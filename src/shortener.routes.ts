import express from 'express';
import { createShortUrl, getOriginalUrl } from './shortener.actions';
import DbAdaptor from './db.adaptor';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string' || url.trim() === '') {
            res.status(400).json({ error: 'Invalid or missing URL' });
            return;
        }

        const db = DbAdaptor.getInstance();
        const shortUrl = await createShortUrl(url, db);
        res.status(200).json({ result: shortUrl });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        if (!validateShortId) {
            res.status(400).json({ error: 'Invalid shortId format' });
            return;
        }

        const db = DbAdaptor.getInstance();
        const originalUrl = await getOriginalUrl(shortId, db);
        res.redirect(308, originalUrl);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

const validateShortId = (shortId: string): boolean => {
    const shortIdRegex = /^[A-Za-z0-9_-]{10}$/;
    return shortIdRegex.test(shortId);
};

export default router;