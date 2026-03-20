import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { limiter } from './middleware/ratelimit.js';

app.use(limiter);

/* IMPORT ROUTE FILES HERE */
import healthRoute from './routes/health.route.js';
import timetableRoute from './routes/timetable.route.js';

/* USE ROUTES HERE */
app.use('/api/v1/health', healthRoute);
app.use('/api/v1/timetable', timetableRoute);

export default app;