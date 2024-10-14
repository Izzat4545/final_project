import { User } from "../../models/userModel";
import bcrypt from "bcrypt";
import { generateHashedPassword } from "../../utils/generateHashedPassword";
import { generateToken } from "../../utils/tokenGenerator";

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

  const { hashedPassword, salt } = await generateHashedPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    salt: salt,
  });

  const token = generateToken(user.id, user.email);
  return { token };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(
    password + user.salt,
    // I am using ! because I am 100% sure password will be passed because I am validating for it in the routes
    user.password!
  );
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.email);
  return { token };
};
