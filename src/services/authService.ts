import bcrypt from "bcrypt";
import User from "../models/userModel";
import { generateToken } from "../utils/tokenGenerator";

export const registerService = async (
  name: string | null,
  email: string,
  password: string,
  repeatPassword: string
) => {
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

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.email);
  return { token };
};
