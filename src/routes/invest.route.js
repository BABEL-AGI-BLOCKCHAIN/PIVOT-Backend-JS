import { Router } from "express";
import { internalAuthMiddleware } from "../middlewares/auth.middleware.js";
import { invest } from "../controllers/topic.controller.js";

const router = Router();

router.route('/invest').post(internalAuthMiddleware, invest);

export default router;