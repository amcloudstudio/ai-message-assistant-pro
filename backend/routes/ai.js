import express from 'express';
import { generateMessage } from '../services/openaiService.js';

const router = express.Router();

// POST: /api/ai/message
router.post('/message', async (req, res) => {
    try {
        const { messageType, recipientType, topic, context, goal } = req.body;

        const output = await generateMessage({
            messageType,
            recipientType,
            topic,
            context,
            goal
        });

        res.json({ message: output });

    } catch (err) {
        console.error('AI Error:', err);
        res.status(500).json({ error: 'AI generation failed' });
    }
});

export default router;
