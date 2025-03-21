import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));

app.use(cookieParser()) ;
app.use(express.json()) ;
BigInt.prototype.toJSON = function () { return this.toString(); };


import authRouter from './routes/auth.route.js';
app.use ('/api/v1/user', authRouter);

import topicRouter from './routes/topic.route.js';
app.use ('/api/v1/topic', topicRouter);

import eventRouter from './routes/event.route.js';
app.use ('/api/v1/event', eventRouter);


export default app;