import { Router } from "express";

const router = Router();

import { getTopics, getTopicById, getTopicsByUser, createTopic, updateTopic, getComments, comment } from "../controllers/topic.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/getTopics").get(getTopics);

router.route("/getTopic/:id").get(getTopicById);

router.route("/getTopics/user/:userId").get(getTopicsByUser);

router
    .route("/createTopic")
    // #swagger.ignore = true
    .post(verifyJWT, createTopic);

router.route("/updateTopic").post(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        },
    ]),
    updateTopic
);

router.route("/getComments/:topicId").get(getComments);

router.route("/comment").post(verifyJWT, comment);

export default router;
