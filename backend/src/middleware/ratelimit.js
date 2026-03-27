import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

    keyGenerator: (req) => {
        const ip =
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.ip;

        return ipKeyGenerator(ip); // ✅ FIX
    },

    message: 'Too many requests from this IP, please try again later.'
});