import { User } from "../../models/userModel";
import bcrypt from "bcrypt";
import { generateHashedPassword } from "../../utils/generateHashedPassword";

export const editProfileService = async (
  email: string,
  oldPassword: string,
  newPassword: string,
  repeatPassword: string,
  newEmail?: string,
  newName?: string
) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("This email doesn't exist");
    }

    const isMatching = await bcrypt.compare(oldPassword, user.password || "");
    const isNewPasswordValid = newPassword === repeatPassword;

    if (!isMatching) {
      throw new Error("Old password does not match");
    }

    if (!isNewPasswordValid) {
      throw new Error("New passwords do not match");
    }

    const updateData: Partial<{
      password: string;
      email: string;
      name: string;
      salt: string;
    }> = {};

    if (isMatching && isNewPasswordValid) {
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
    await user.update(updateData);

    return { message: "Profile updated successfully" };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
