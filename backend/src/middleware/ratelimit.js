import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,

    keyGenerator: (req) => {
        return (
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.ip
        );
    },

    message: 'Too many requests from this IP, please try again later.'
});