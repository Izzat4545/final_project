import { UserType } from "../User";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
