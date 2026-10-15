import type { Request, Response } from 'express';

export async function handleTwoHrForecast(req: Request, res: Response) {
  try {
    const { date } = req.query;
    const url = new URL('https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast');
    if (typeof date === 'string' && date) {
      url.searchParams.set('date', date);
    }

    const headers: Record<string, string> = {
      'accept': 'application/json',
    };

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
        message: 'Upstream 2-Hour Forecast API returned non-200',
        details: errorText,
      });
    }

    const data = await response.json();
    const item = data?.data?.items?.[0] || data?.data?.items?.[data?.data?.items?.length - 1];
    const forecasts = item?.forecasts || [];
    const validPeriod = item?.valid_period || { text: 'Next 2 Hours' };

    // Categorize overall weather
    // Common terms: Cloudy, Light Rain, Showers, Thundery Showers, Fair (Day), Partly Cloudy
    const forecastCounts: Record<string, number> = {};
    for (const f of forecasts) {
      const str = f.forecast || 'Cloudy';
      forecastCounts[str] = (forecastCounts[str] || 0) + 1;
    }

    let dominantForecast = 'Cloudy';
    let maxCount = 0;
    for (const [fc, count] of Object.entries(forecastCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantForecast = fc;
      }
    }

    // Determine weather archetype for live graphic background
    let weatherType: 'fair' | 'cloudy' | 'rain' | 'thunderstorm' | 'hazy' = 'cloudy';
    const lower = dominantForecast.toLowerCase();
    if (lower.includes('thunder')) {
      weatherType = 'thunderstorm';
    } else if (lower.includes('rain') || lower.includes('shower')) {
      weatherType = 'rain';
    } else if (lower.includes('hazy') || lower.includes('haze')) {
      weatherType = 'hazy';
    } else if (lower.includes('fair') || lower.includes('sunny')) {
      weatherType = 'fair';
    } else {
      weatherType = 'cloudy';
    }

    // Running outdoor suitability based on 2-hour forecast
    const runAdvice =
      weatherType === 'thunderstorm'
        ? {
            safe: false,
            headline: 'Lightning Risk — Train Indoors',
            detail: 'Thundery showers forecasted across Singapore. Strictly avoid outdoor PCN running due to lightning hazard.',
            icon: 'thunderstorm',
            badgeBg: 'bg-[#ff5252]',
            badgeText: 'THUNDERSTORM ALERT',
          }
        : weatherType === 'rain'
        ? {
            safe: false,
            headline: 'Wet Pavements & Rain',
            detail: 'Rain / showers expected. Slippery PCN trails; treadmill or covered ActiveSG track advised.',
            icon: 'rainy',
            badgeBg: 'bg-[#00ddeb]',
            badgeText: 'RAIN FORECAST',
          }
        : weatherType === 'fair'
        ? {
            safe: true,
            headline: 'Dry & Clear Pavements',
            detail: 'Optimal dry conditions for outdoor running along Marina Bay & ECP PCN. Stay hydrated.',
            icon: 'wb_sunny',
            badgeBg: 'bg-[#c3f400]',
            badgeText: 'SUNNY & DRY',
          }
        : {
            safe: true,
            headline: 'Overcast & Low Sun Glare',
            detail: 'Cloudy conditions provide excellent natural shade and lower heat index for outdoor interval runs.',
            icon: 'cloud',
            badgeBg: 'bg-[#10e575]',
            badgeText: 'OPTIMAL RUNNING WEATHER',
          };

    res.json({
      success: true,
      timestamp: item?.update_timestamp || item?.timestamp || new Date().toISOString(),
      validPeriod,
      dominantForecast,
      weatherType,
      runAdvice,
      forecasts,
      areaMetadata: data?.data?.area_metadata || [],
      raw: data,
    });
  } catch (err: any) {
    console.error('Error in handleTwoHrForecast:', err);
    res.status(500).json({
      error: true,
      message: err.message || 'Internal server error while fetching 2-hour forecast',
    });
  }
}

export default handleTwoHrForecast;
