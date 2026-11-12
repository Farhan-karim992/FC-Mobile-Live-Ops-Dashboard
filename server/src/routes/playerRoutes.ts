import { Router } from 'express';
import { getPlayers, getPlayerById, togglePlayerBoost } from '../controllers/playerController';

const router = Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.patch('/:id/boost', togglePlayerBoost);

export default router;
