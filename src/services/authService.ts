import bcrypt from "bcrypt";
import User from "../models/userModel";
import { User as UserType } from "../types/User";
import { generateToken } from "../utils/tokenGenerator";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { getEnv } from "../utils/getEnv";
import { redisClient } from "../config/redis";
import { sendEmail } from "./emailService";

export const registerService = async (
  name: string | null,
  email: string,
  password: string,
  repeatPassword: string
) => {
  // ADD VALIDATOR
  if (password !== repeatPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user.id, user.email);
  return { token };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.email);
  return { token };
};

export const storeResetCodeRedis = async (
  email: string,
  code: string
): Promise<void> => {
  const expiresIn = 2 * 60; //2 mins
  await redisClient.set(`resetCode:${email}`, code, { EX: expiresIn });
};

export const getResetCodeRedis = async (
  email: string
): Promise<string | null> => {
  const code = await redisClient.get(`resetCode:${email}`);
  return code;
};

export const sendCodeService = async (email: string, code: string) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("This email doesn't exist");
    }

    await sendEmail({
      fromEmail: "no-reply@example.com",
      fromName: "Gift me Support",
      toEmail: email,
      toName: user.name || "User",
      subject: "Password Reset Code",
      textBody: `Your password reset code is ${code}. It will expire in 2 minutes.`,
      htmlBody: `<p>Your password reset code is <strong>${code}</strong>. It will expire in 2 minutes.</p>`,
    });

    await storeResetCodeRedis(email, code.toString());

    return { message: "Reset code sent successfully" };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const verifyCodeService = async (email: string, code: string) => {
  try {
    const actualCode = await getResetCodeRedis(email);

    if (!actualCode) {
      throw new Error("Reset code has expired");
    }

    if (actualCode !== code) {
      throw new Error("Invalid code provided");
    }
    return true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const resetPasswordService = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ where: { email } });

    const hashedPassword = await bcrypt.hash(password, 10);

    await user?.update({ password: hashedPassword });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// GOOGLE AUTH

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: UserType, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: getEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
      callbackURL: "/auth/google/callback",
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
