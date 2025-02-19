import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();


import { getTopics, getTopicById, getTopicsByUser } from "../controllers/topic.controller.js";

router.route('/topics').get(verifyJwt, getTopics);

router.route('/topics/:id').get(verifyJwt, getTopicById);

router.route('/topics/user/:userId').get(verifyJwt, getTopicsByUser);

export default router;