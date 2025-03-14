import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import dotenv from 'dotenv';
import prisma from './prisma.js';

dotenv.config();

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${baseUrl}/api/v1/auth/twitter/callback`,
      includeEmail: false,
      passReqToCallback: true,
    },
    async (req, token, tokenSecret, profile, done) => {
      try {
        const walletAddress = req.session.walletAddress;

        if (!walletAddress) {
          return done(new Error('Wallet address not provided'));
        }

        const user = await prisma.user.upsert({
          where: { walletAddress },
          update: {
            username: profile.displayName || profile.username || null,
            twitterHandle: profile.username || null,
            avatar: profile.photos?.[0]?.value || null,
          },
          create: {
            walletAddress,
            username: profile.displayName || profile.username || null,
            twitterHandle: profile.username || null,
            avatar: profile.photos?.[0]?.value || null,
          },
        });

        return done(null, user);
      } catch (err) {
        console.error("Passport verify error:", err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.walletAddress));
passport.deserializeUser(async (walletAddress, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { walletAddress } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;