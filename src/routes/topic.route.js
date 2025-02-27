import { Router } from "express";

const router = Router();


import { getTopics, getTopicById, getTopicsByUser, createTopic } from "../controllers/topic.controller.js";

router.route('/getTopics').get( getTopics);

router.route('/topic/:id').get(getTopicById);

router.route('/topics/user/:userId').get(getTopicsByUser);

router.route('/createTopic').post(createTopic);

export default router;