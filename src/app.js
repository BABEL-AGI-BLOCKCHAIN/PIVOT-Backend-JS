import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));

app.use(cookieParser()) ;
app.use(express.json()) ;

import authRouter from './routes/auth.route.js';
app.use (api/v1/user, authRouter);
