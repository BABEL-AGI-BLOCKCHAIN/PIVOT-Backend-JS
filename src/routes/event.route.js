import { Router } from "express";

const router = new Router();

import { getEventSync, updateEventSync } from "../controllers/eventSync.controller.js";
import { internalAuthMiddleware } from "../middlewares/auth.middleware.js";


router.route ('/getEventSync').get(internalAuthMiddleware, getEventSync);
router.route ('/updateEventSync').post(internalAuthMiddleware, updateEventSync);

export default router;