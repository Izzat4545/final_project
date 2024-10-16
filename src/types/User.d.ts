import { Currencies } from "../utils/enums/currency";

export interface UserType {
  id: string;
  email: string;
  name?: string | null;
  currency: Currencies;
  googleId?: string | null;
  token: string;
}
