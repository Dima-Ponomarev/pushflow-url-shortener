import { nanoid } from 'nanoid';
import DbAdaptor from './db.adaptor';
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.connect().catch(console.error);

export const createShortUrl = async (
    url: string,
    db: DbAdaptor,
): Promise<string> => {
    if (!validateUrl(url)) {
        throw new Error('Invalid URL');
    }

    const shortId = nanoid(10);

    await db.query(
        `
        INSERT INTO shortened_url (short_id, original_url)
        VALUES ($1, $2)
        `,
        [shortId, url]);

    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';

    return `${baseUrl}/${shortId}`;
};


export const getOriginalUrl = async (
    shortId: string,
    db: DbAdaptor,
): Promise<string> => {
    const cachedUrl = await redisClient.get(shortId);
    if (cachedUrl) {
        return cachedUrl;
    }
    const result = await db.query<{ original_url: string }>(
        `
        SELECT original_url
        FROM shortened_url
        WHERE short_id = $1
        LIMIT 1
        `,
        [shortId]
    );

    if (result.length === 0) {
        throw new Error('Short URL not found');
    }

    await redisClient.set(shortId, result[0].original_url, {
        EX: 300, // 5 минут
    });

    return result[0].original_url;
};

const validateUrl = (url: string): boolean => {
    const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return urlRegex.test(url);
};