import cors from 'cors';

export const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

export const corsMiddleware = cors(corsOptions);
