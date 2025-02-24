import { Router } from "express";

const router = new Router();

import { getEventSync, updateEventSync } from "../controllers/eventSync.controller.js";

router.route ('/getEventSync').get(getEventSync);
router.route ('/updateEventSync').post(updateEventSync);

export default router;