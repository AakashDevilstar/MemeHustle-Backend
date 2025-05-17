import express from 'express';
import { createMeme, getMemes, bidMeme, voteMeme, leaderboard, generateCaption } from '../controllers/memeController.js';

const router = express.Router();

router.post('/', createMeme);
router.get('/', getMemes);
router.post('/:id/bid', bidMeme);
router.post('/:id/vote', voteMeme);
router.get('/leaderboard', leaderboard);
router.post('/:id/caption', generateCaption);

export default router;
