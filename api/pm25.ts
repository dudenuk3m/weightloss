import type { Request, Response } from 'express';

export async function handlePM25(req: Request, res: Response) {
  try {
    const { date, paginationToken } = req.query;

    const url = new URL('https://api-open.data.gov.sg/v2/real-time/api/pm25');
    if (typeof date === 'string' && date) {
      url.searchParams.set('date', date);
    }
    if (typeof paginationToken === 'string' && paginationToken) {
      url.searchParams.set('paginationToken', paginationToken);
    }

    const headers: Record<string, string> = {
      'accept': 'application/json',
    };

    // Retrieve LTA / DataMall / data.gov.sg AccountKey from environment or request headers
    // Do not hardcode any key
    const accountKey =
      process.env.LTA_ACCOUNT_KEY ||
      (req.headers['accountkey'] as string) ||
      (req.headers['x-api-key'] as string);

    if (accountKey) {
      headers['AccountKey'] = accountKey;
      headers['x-api-key'] = accountKey;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: true,
        status: response.status,
        message: 'Upstream PM2.5 API returned non-200',
        details: errorText,
      });
    }

    const data = await response.json();

    // Parse readings from the API
    const latestItem = data?.data?.items?.[0] || data?.data?.items?.[data?.data?.items?.length - 1];
    const regionalReadings = latestItem?.readings?.pm25_one_hourly || {};

    const evaluateAirQuality = (val: number) => {
      if (val <= 12) {
        return {
          band: 'Normal (Band I)',
          isSafeToRun: true,
          safetyLevel: 'SAFE' as const,
          badgeText: 'SAFE TO RUN OUTDOORS',
          status: 'Good for Outdoor Cardio',
          recommendation: 'Optimal conditions for outdoor running, walking along PCN, and cycling.',
          indoorAlternative: 'Outdoor PCN recommended over treadmill',
          color: '#10e575',
          indicatorIcon: 'check_circle',
        };
      }
      if (val <= 55) {
        return {
          band: 'Elevated (Band II)',
          isSafeToRun: true,
          safetyLevel: 'CAUTION' as const,
          badgeText: 'EXERCISE WITH CAUTION',
          status: 'Moderate Air Quality',
          recommendation: 'Safe for running, but reduce tempo sprints. Hydrate frequently in SG heat.',
          indoorAlternative: 'Outdoor walk or shaded PCN trail',
          color: '#c3f400',
          indicatorIcon: 'warning',
        };
      }
      if (val <= 150) {
        return {
          band: 'High (Band III)',
          isSafeToRun: false,
          safetyLevel: 'UNSAFE' as const,
          badgeText: 'UNSAFE TO RUN OUTDOORS',
          status: 'Unhealthy for Prolonged Cardio',
          recommendation: 'High PM2.5 particles detected. Avoid outdoor running or intense PCN cardio.',
          indoorAlternative: 'Switch to indoor ActiveSG gym treadmill or indoor pool',
          color: '#ff9800',
          indicatorIcon: 'do_not_disturb_on',
        };
      }
      return {
        band: 'Very High (Band IV)',
        isSafeToRun: false,
        safetyLevel: 'HAZARDOUS' as const,
        badgeText: 'HAZARDOUS - DO NOT RUN OUTDOORS',
        status: 'Hazardous Air Quality',
        recommendation: 'Strictly avoid outdoor exercise. High risk of cardiovascular and airway irritation.',
        indoorAlternative: 'Air-conditioned fitness pod or indoor gym only',
        color: '#ff5252',
        indicatorIcon: 'dangerous',
      };
    };

    const regionalTelemetry: Record<string, any> = {};
    let maxPM25 = 0;
    let minPM25 = 999;
    let totalPM25 = 0;
    let count = 0;

    for (const [region, value] of Object.entries(regionalReadings)) {
      const numVal = Number(value);
      if (!isNaN(numVal)) {
        if (numVal > maxPM25) maxPM25 = numVal;
        if (numVal < minPM25) minPM25 = numVal;
        totalPM25 += numVal;
        count++;
      }
      regionalTelemetry[region] = {
        value: numVal,
        unit: 'µg/m³',
        ...evaluateAirQuality(numVal),
      };
    }

    const avgPM25 = count > 0 ? Math.round(totalPM25 / count) : 12;
    const overallSafety = evaluateAirQuality(avgPM25);

    res.json({
      success: true,
      timestamp: latestItem?.updatedTimestamp || latestItem?.timestamp || new Date().toISOString(),
      source: 'api-open.data.gov.sg / LTA DataMall',
      hasCustomKey: Boolean(accountKey),
      overall: {
        avgValue: avgPM25,
        maxValue: maxPM25,
        minValue: minPM25,
        unit: 'µg/m³',
        ...overallSafety,
      },
      regionalReadings: regionalTelemetry,
      raw: data,
    });
  } catch (err: any) {
    console.error('Error in handlePM25:', err);
    res.status(500).json({
      error: true,
      message: err.message || 'Internal server error while fetching PM2.5',
    });
  }
}

export default handlePM25;
