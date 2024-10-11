export interface UserType {
  id: string;
  email: string;
  name?: string | null;
  googleId?: string | null;
  token: string;
}
