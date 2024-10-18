import { SettingsType } from "../../types/validatorTypes/validatorTypes";
import { User } from "../../models/userModel";
import bcrypt from "bcrypt";
import { generateHashedPassword } from "../../utils/generateHashedPassword";

export const editProfileService = async (info: SettingsType) => {
  const { userId, currency, newEmail, newName, newPassword, oldPassword } =
    info;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("This user doesn't exist");
    }

    const updateData: Partial<{
      password: string;
      email: string;
      name: string;
      currency: string;
      salt: string;
    }> = {};

    if (newPassword) {
      // If the user is not registered with google then check the old password
      if (user.password) {
        if (!oldPassword) {
          throw new Error("Old password is required");
        }

        const isMatching = await bcrypt.compare(
          oldPassword + user.salt,
          user.password
        );

        if (!isMatching) {
          throw new Error("Old password does not match");
        }
        const isOldPasswordMatchNewPassword = await bcrypt.compare(
          newPassword + user.salt,
          user.password
        );

        if (isOldPasswordMatchNewPassword) {
          throw new Error("You cannot use old password as new password");
        }
      }

      const { hashedPassword, salt } = await generateHashedPassword(
        newPassword
      );
      updateData.password = hashedPassword;
      updateData.salt = salt;
    }

    if (newEmail) {
      updateData.email = newEmail;
    }

    if (newName) {
      updateData.name = newName;
    }

    if (currency) {
      updateData.currency = currency;
    }
    await user.update(updateData);

    return { message: "Profile updated successfully" };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getProfileService = async (userId: string) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("This user doesn't exist");
    }

    return { name: user.name, email: user.email, currency: user.currency };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
