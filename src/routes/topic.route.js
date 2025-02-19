import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();


import { getTopics, getTopicById, getTopicsByUser, createTopic, getHistoricTopics } from "../controllers/topic.controller.js";

router.route('/getTopics').get(verifyJwt, getTopics);

router.route('/topic/:id').get(verifyJwt, getTopicById);

router.route('/topics/user/:userId').get(verifyJwt, getTopicsByUser);

router.route('/topics/historic').get(verifyJwt, getHistoricTopics);

router.route('/createTopic').post(verifyJwt, createTopic);

export default router;