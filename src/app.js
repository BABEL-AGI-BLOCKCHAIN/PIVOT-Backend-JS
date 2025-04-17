import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

import setupSwagger from "./utils/swaggerConfig.js";
if (process.env.NODE_ENV !== "production") {
    setupSwagger(app);
}

import passport from "./utils/passport.js";
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
BigInt.prototype.toJSON = function () {
    return this.toString();
};

import authRouter from "./routes/auth.route.js";
app.use("/api/v1/auth", authRouter);

import userRouter from "./routes/user.route.js";
app.use("/api/v1/user", userRouter);

import topicRouter from "./routes/topic.route.js";
app.use("/api/v1/topic", topicRouter);

import eventRouter from "./routes/event.route.js";
app.use(
    // #swagger.ignore = true
    "/api/v1/event",
    eventRouter
);

import investRouter from "./routes/invest.route.js";
app.use("/api/v1/invest", investRouter);

import withdrawRouter from "./routes/withdraw.route.js";

app.use(
    // #swagger.ignore = true
    "/api/v1/withdraw",
    withdrawRouter
);

export default app;
