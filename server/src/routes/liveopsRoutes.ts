import { Router } from 'express';
import {
  getMetrics,
  getBroadcasts,
  createBroadcast,
  deleteBroadcast,
  getPacks,
  simulatePackPull,
  getAuditLogs,
  resetData,
} from '../controllers/liveopsController';

const router = Router();

router.get('/metrics', getMetrics);
router.get('/broadcasts', getBroadcasts);
router.post('/broadcasts', createBroadcast);
router.delete('/broadcasts/:id', deleteBroadcast);
router.get('/packs', getPacks);
router.post('/packs/simulate-pull', simulatePackPull);
router.get('/audit-log', getAuditLogs);
router.post('/reset-data', resetData);

export default router;
