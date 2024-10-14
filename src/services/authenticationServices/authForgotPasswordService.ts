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
    await sendEmail(emailCodeTemplate(email, user?.name, code));

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
      // if the user is registered from google he wont have password field
      isPasswordNew = await bcrypt.compare(password, user.password || "");
    }
    if (isPasswordNew) {
      throw new Error("Please enter a new password");
    }
    const { hashedPassword, salt } = await generateHashedPassword(password);

    if (!user) {
      throw new Error("This email doesn't exist");
    }

    await user?.update({ password: hashedPassword, salt });

    // REMOVING FROM REDIS AFTER UPDATING THE PASSWORD
    await deleteResetCodeRedis(email);

    const message = await sendEmail(
      emailChangedPasswordTemplate(email, user?.name)
    );
    return { message };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
