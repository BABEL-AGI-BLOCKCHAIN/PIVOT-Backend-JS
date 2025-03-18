import { Router } from "express";

const router = Router();


import { getTopics, getTopicById, getTopicsByUser, createTopic, updateTopic, getComments, comment } from "../controllers/topic.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { internalAuthMiddleware } from "../middlewares/auth.middleware.js";

router.route('/getTopics').get(getTopics);

router.route('/getTopic/:id').get(getTopicById);

router.route('/getTopics/user/:userId').get(getTopicsByUser);

router.route('/createTopic')
  // #swagger.ignore = true
  .post(internalAuthMiddleware, createTopic);


router.route('/updateTopic').post(upload.fields([
    {
        name: 'image',
        maxCount: 1
    }
]), updateTopic);

router.route('/comments/:topicId').get(getComments);

router.route('/comment').post(comment);

export default router;