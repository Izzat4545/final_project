export interface User {
  id: number;
  email: string;
  name?: string | null;
  googleId?: string | null;
  token: string;
}
