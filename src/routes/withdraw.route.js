import { Router } from "express";

import withdraw from "../controllers/withdraw.controller.js";
import { internalAuthMiddleware } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route ('/withdraw').post (internalAuthMiddleware, withdraw);

export default router;