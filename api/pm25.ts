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
      // In case of upstream error or rate limit, return status with details
      const errorText = await response.text();
      return res.status(response.status).json({
        error: true,
        status: response.status,
        message: 'Upstream PM2.5 API returned non-200',
        details: errorText,
      });
    }

    const data = await response.json();

    // Augment with workout safety telemetry for Singapore outdoor sports
    const latestItem = data?.data?.items?.[0] || data?.data?.items?.[data?.data?.items?.length - 1];
    const regionalReadings = latestItem?.readings?.pm25_one_hourly || {};

    const evaluateAirQuality = (val: number) => {
      if (val <= 12) {
        return {
          band: 'Normal (Band I)',
          status: 'Good for Outdoor Exercise',
          recommendation: 'Optimal for outdoor walking along PCN, jogging at Bedok Reservoir & cycling',
          color: '#10e575',
        };
      }
      if (val <= 55) {
        return {
          band: 'Elevated (Band II)',
          status: 'Moderate',
          recommendation: 'Acceptable for outdoor sports. Keep hydration high in tropical humidity',
          color: '#c3f400',
        };
      }
      if (val <= 150) {
        return {
          band: 'High (Band III)',
          status: 'Unhealthy for Prolonged Cardio',
          recommendation: 'Recommend switching to indoor ActiveSG gym or swimming complex',
          color: '#ff9800',
        };
      }
      return {
        band: 'Very High (Band IV)',
        status: 'Hazardous',
        recommendation: 'Avoid outdoor exercise. Stay in air-conditioned fitness centres',
        color: '#ff5252',
      };
    };

    const regionalTelemetry: Record<string, any> = {};
    for (const [region, value] of Object.entries(regionalReadings)) {
      regionalTelemetry[region] = {
        value,
        unit: 'µg/m³',
        ...evaluateAirQuality(Number(value)),
      };
    }

    res.json({
      success: true,
      timestamp: latestItem?.updatedTimestamp || latestItem?.timestamp || new Date().toISOString(),
      source: 'api-open.data.gov.sg / LTA DataMall',
      hasCustomKey: Boolean(accountKey),
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
