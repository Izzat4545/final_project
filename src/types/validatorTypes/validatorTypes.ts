export interface loginType {
  email: string;
  password: string;
}

export interface registerType extends loginType {
  name: string | null;
  repeatPassword: string;
}

export interface codeType extends loginType {
  code: string;
}
