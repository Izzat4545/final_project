import User from "../models/userModel";
import bcrypt from "bcrypt";

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
    }> = {};

    if (isMatching && isNewPasswordValid) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
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
