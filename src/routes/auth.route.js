import { Router } from "express";

import passport from "passport";
import { signIn, twitterSuccess, twitterFailure } from "../controllers/auth.controller.js";

const router = Router();

router.route('/signIn').post(signIn);


router.route('/twitter').get((req, res, next) => {
    const { walletAddress } = req.query;
  
    if (!walletAddress) {
      return res.status(400).json({ success: false, message: 'walletAddress is required' });
    }
  
    req.session.walletAddress = walletAddress;
  
    passport.authenticate('twitter')(req, res, next);
  });
  

router.route('/twitter/callback').get((req, res, next) => {
    passport.authenticate('twitter', (err, user) => {
        if (err) {
            return twitterFailure(req, res);
        }
        if (!user) {
            return twitterFailure(req, res);
        }
        req.logIn(user, (err) => {
            if (err) {
                return twitterFailure(req, res);
            }
            return twitterSuccess(req, res);
        });
    })(req, res, next);
}
);

export default router;