import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../models/userModel";
import { UserType as UserType } from "../../types/User";
import { generateToken } from "../../utils/tokenGenerator";
import { getEnv } from "../../utils/getEnv";
import passport from "passport";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: UserType, done) => {
  done(null, user);
});

export const initializeGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: getEnv("GOOGLE_CLIENT_ID"),
        clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
        callbackURL: `${getEnv("BACKEND_LINK")}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ where: { googleId: profile.id } });
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value || "",
            });
          }
          const token = generateToken(user.id, user.email);
          done(null, { ...user.get(), token });
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
