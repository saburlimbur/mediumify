import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // maks 100 req per 15 menit per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later!",
    },
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login/register attempts, please try again later!",
    },
});