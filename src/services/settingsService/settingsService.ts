import { User } from "../../models/userModel";
import bcrypt from "bcrypt";
import { currency } from "../../utils/enums/currency";
import { generateHashedPassword } from "../../utils/generateHashedPassword";

export const editProfileService = async (
  userId: string,
  oldPassword?: string,
  newPassword?: string,
  repeatPassword?: string,
  currency?: currency,
  newEmail?: string,
  newName?: string
) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("This user doesn't exist");
    }

    // Only proceed with password change if any password fields are provided
    if (oldPassword && newPassword && repeatPassword) {
      const isMatching = await bcrypt.compare(oldPassword, user.password || "");
      const isNewPasswordValid = newPassword === repeatPassword;

      if (!isMatching) {
        throw new Error("Old password does not match");
      }

      if (!isNewPasswordValid) {
        throw new Error("New passwords do not match");
      }

      // Hash the new password and update it
      const { hashedPassword, salt } = await generateHashedPassword(
        newPassword
      );
      await user.update({
        password: hashedPassword,
        salt: salt,
      });
    }

    // Prepare an object to store other updates (email, name, currency)
    const updateData: Partial<{
      email: string;
      name: string;
      currency: string;
    }> = {};

    if (newEmail) {
      updateData.email = newEmail;
    }

    if (newName) {
      updateData.name = newName;
    }

    if (currency) {
      updateData.currency = currency;
    }

    // Update other fields (email, name, currency)
    if (Object.keys(updateData).length > 0) {
      await user.update(updateData);
    }

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
