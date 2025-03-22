import { Router } from "express";
import { internalAuthMiddleware } from "../middlewares/auth.middleware.js";
import { invest, getPositions } from "../controllers/invest.controller.js";

const router = Router();

router.route('/createInvest').
    // #swagger.ignore = true
post(internalAuthMiddleware, invest);

router.route('/getPositions').get(getPositions);

export default router;