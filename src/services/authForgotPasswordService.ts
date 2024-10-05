import {
  deleteResetCodeRedis,
  getResetCodeRedis,
  storeResetCodeRedis,
} from "./redisService";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { emailTemplate } from "../utils/emailTemplate";
import { sendEmail } from "./emailService";

export const sendCodeService = async (email: string, code: string) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("This email doesn't exist");
    }
    await sendEmail(emailTemplate(email, user?.name, code));

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
    let isPasswordNew: boolean = false;
    if (user) {
      isPasswordNew = await bcrypt.compare(password, user.password || "");
    }
    if (isPasswordNew) {
      throw new Error("Please enter a new password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      throw new Error("This email doesn't exist");
    }

    await user?.update({ password: hashedPassword });

    // REMOVING FROM REDIS AFTER UPDATING THE PASSWORD
    await deleteResetCodeRedis(email);

    return { message: "Password reset successfully!" };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
