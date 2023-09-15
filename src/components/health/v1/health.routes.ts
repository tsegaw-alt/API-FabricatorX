import { Router } from 'express';
import os from 'os';
import mongoose from 'mongoose';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check the health status of the application
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: The application is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 responseTime:
 *                   type: number
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                 system:
 *                   type: object
 *                   properties:
 *                     memoryUsage:
 *                       type: object
 *                     cpuUsage:
 *                       type: number
 *                     uptime:
 *                       type: number
 *                 environment:
 *                   type: object
 *       500:
 *         description: The application is not healthy
 */
router.get('/', async (req, res) => {
  const startTime = new Date();

  // Check the database connection
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  // Check system resource usage
  const memoryUsage = process.memoryUsage();
  const cpuUsage = await getCpuUsage();

  const endTime = new Date();
  const elapsedTime = endTime.getTime() - startTime.getTime();

  // Get environment variables
  const envVars = process.env;

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    responseTime: elapsedTime,
    database: {
      status: dbStatus,
    },
    system: {
      memoryUsage,
      cpuUsage,
      uptime: os.uptime(),
    },
    environment: envVars,
  });
});

async function getCpuUsage() {
  return new Promise((resolve) => {
    const startTime = process.cpuUsage();
    setTimeout(() => {
      const endTime = process.cpuUsage(startTime);
      const totalTime = endTime.user + endTime.system;
      const elapsedTime = process.uptime();
      const cpuUsage = 100 * totalTime / (elapsedTime * os.cpus().length);
      resolve(cpuUsage);
    }, 100);
  });
}

export default router;
