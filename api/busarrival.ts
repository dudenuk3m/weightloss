import type { Request, Response } from 'express';

export async function handleBusArrival(req: Request, res: Response) {
  try {
    const busStopCode = (req.query.BusStopCode as string) || (req.query.busStopCode as string) || '84009'; // Marine Parade / ECP ActiveSG Stop
    const serviceNo = req.query.ServiceNo as string;

    // Do not hardcode any key, retrieve from process.env or headers
    const accountKey =
      process.env.LTA_ACCOUNT_KEY ||
      (req.headers['accountkey'] as string) ||
      (req.headers['AccountKey'] as string) ||
      (req.headers['x-api-key'] as string);

    if (!accountKey) {
      return res.json({
        success: false,
        requiresKey: true,
        message: 'LTA_ACCOUNT_KEY not configured yet. You can provide it in .env or via AccountKey header.',
        busStopCode,
        configured: false,
        note: 'Live LTA DataMall connection is ready for your key.',
        sampleServices: [
          {
            ServiceNo: '36',
            Operator: 'GAS',
            NextBus: { EstimatedArrival: new Date(Date.now() + 4 * 60000).toISOString(), Load: 'SEA', Feature: 'WAB', Type: 'SD' },
            NextBus2: { EstimatedArrival: new Date(Date.now() + 14 * 60000).toISOString(), Load: 'SDA', Feature: 'WAB', Type: 'DD' },
          },
          {
            ServiceNo: '196',
            Operator: 'SBST',
            NextBus: { EstimatedArrival: new Date(Date.now() + 7 * 60000).toISOString(), Load: 'SEA', Feature: 'WAB', Type: 'SD' },
          },
        ],
      });
    }

    const url = new URL('http://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
    url.searchParams.set('BusStopCode', busStopCode);
    if (serviceNo) {
      url.searchParams.set('ServiceNo', serviceNo);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: true,
        status: response.status,
        message: 'LTA DataMall API responded with error',
        details: errorText,
      });
    }

    const data = await response.json();
    res.json({
      success: true,
      busStopCode,
      source: 'LTA DataMall BusArrival v3',
      data,
    });
  } catch (err: any) {
    console.error('Error in handleBusArrival:', err);
    res.status(500).json({
      error: true,
      message: err.message || 'Internal server error while fetching LTA Bus Arrival',
    });
  }
}

export default handleBusArrival;
