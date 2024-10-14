import {
  deleteResetCodeRedis,
  getResetCodeRedis,
  storeResetCodeRedis,
} from "./cacheService";
import {
  emailChangedPasswordTemplate,
  emailCodeTemplate,
} from "../../utils/emailTemplate";
import { User } from "../../models/userModel";
import bcrypt from "bcrypt";
import { generateHashedPassword } from "../../utils/generateHashedPassword";
import { sendEmail } from "./emailService";

export const sendCodeService = async (email: string, code: string) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("This email doesn't exist");
    }
    await sendEmail(emailCodeTemplate(email, user.name, code));

    await storeResetCodeRedis(email, code);

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

    if (!user) {
      throw new Error("This email doesn't exist");
    }

    // If the user has a password, check if the new password matches the old one
    if (user.password) {
      const isPasswordSame = await bcrypt.compare(password, user.password);

      if (isPasswordSame) {
        throw new Error(
          "Please enter a new password, not the same as the old one."
        );
      }
    }

    // If user has no password (likely registered via Google), skip comparison and directly set the new password
    const { hashedPassword, salt } = await generateHashedPassword(password);

    // Update the user's password and salt
    await user.update({ password: hashedPassword, salt });

    // Removing the reset code from Redis after updating the password
    await deleteResetCodeRedis(email);

    const message = await sendEmail(
      emailChangedPasswordTemplate(email, user.name)
    );

    return { message };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
