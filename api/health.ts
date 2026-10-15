import type { Request, Response } from 'express';

export function handleHealthCheck(req: Request, res: Response) {
  res.json({
    status: 'ok',
    service: 'PulseAI Singapore Telemetry API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      { path: '/api/pm25', description: 'Live Singapore PM2.5 readings from Data.gov.sg / DataMall' },
      { path: '/api/busarrival', description: 'LTA DataMall Bus Arrival live telemetry' },
      { path: '/api/health', description: 'Service health check' },
    ],
  });
}

export default handleHealthCheck;
