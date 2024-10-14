import { User } from "../../models/userModel";
import bcrypt from "bcrypt";
import { generateHashedPassword } from "../../utils/generateHashedPassword";
import { generateToken } from "../../utils/tokenGenerator";

export const registerService = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const { hashedPassword, salt } = await generateHashedPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    salt,
  });

  const token = generateToken(user.id, user.email);
  return { token };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // If the user has no password (registered via Google), return an error
  if (!user.password) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password + user.salt,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate a token upon successful login
  const token = generateToken(user.id, user.email);
  return { token };
};
