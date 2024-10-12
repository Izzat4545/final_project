import { currency } from "../../utils/enums/currency";
import { visibilityModes } from "../../utils/enums/visibilityModes";

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

export interface settingsType {
  newName?: string;
  newEmail?: string;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export interface eventsType {
  title: string;
  date: string;
  visibility: visibilityModes;
  description?: string;
  image?: string;
}

export interface giftType {
  name: string;
  currency: currency;
  link: string;
  price: string;
  description?: string;
  image?: string;
}

export interface createGiftType extends giftType {
  userId: string;
  eventId: string;
}

export interface updateGiftType extends giftType {
  userId: string;
  giftId: string;
}
