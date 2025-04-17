import { Router } from "express";

import { getUserByWalletAddress } from "../controllers/user.controller.js";

const router = Router();

router.route("/getUser/:walletAddress").get(getUserByWalletAddress);

export default router;
