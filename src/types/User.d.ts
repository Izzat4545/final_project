import { currency } from "../utils/enums/currency";

export interface UserType {
  id: string;
  email: string;
  name?: string | null;
  currency: currency;
  googleId?: string | null;
  token: string;
}
