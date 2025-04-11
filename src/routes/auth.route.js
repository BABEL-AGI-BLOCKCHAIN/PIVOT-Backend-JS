import { Router } from "express";

import signIn from "../controllers/signIn.controller.js";
import passport from "../utils/passport.js";

const router = Router();

router.route("/signIn").post(signIn);
router.get("/twitter", (req, res, next) => {
    const { walletAddress } = req.query;

    if (!walletAddress) {
        return res.status(400).json({ success: false, message: "walletAddress is required" });
    }

    req.session.walletAddress = walletAddress;
    passport.authenticate("twitter")(req, res, next);
});

router.get("/twitter/callback", (req, res, next) => {
    passport.authenticate("twitter", (err, user) => {
        if (err || !user) {
            // return res.status(401).json({
            //     success: false,
            //     message: "Twitter authentication failed",
            //     error: err?.message || "Unknown error",
            // });
            return res.redirect(`${process.env.FRONTEND_WEBSITE}/twitter/callback?status=401`);
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.redirect(`${process.env.FRONTEND_WEBSITE}/twitter/callback?status=500`);
                // return res.status(500).json({
                //   success: false,
                //   message: 'Failed to log in user',
                //   error: err.message,
                // });
            }

            return res.redirect(`${process.env.FRONTEND_WEBSITE}/twitter/callback?status=200`);
            // return res.status(200).json({
            //   success: true,
            //   message: 'Twitter authentication successful',
            //   user,
            // });
        });
    })(req, res, next);
});

export default router;
