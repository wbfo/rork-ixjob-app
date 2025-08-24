import { Router, Request, Response } from 'express';
import { HealthController } from '../controllers/HealthController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/health', asyncHandler(HealthController.getHealth));
router.get('/ready', asyncHandler(HealthController.getReadiness));

// Simple ping endpoint - plain text for easy curl/mobile testing
router.get('/ping', (_req: Request, res: Response) => {
  res.status(200).type('text/plain').send('pong');
});

export default router;