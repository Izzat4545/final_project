import { Gift } from "../../models/giftModel";
import { currency } from "../../utils/enums/currency";
import { visibilityModes } from "../../utils/enums/visibilityModes";

export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType extends LoginType {
  name: string | null;
  repeatPassword: string;
}

export interface CodeType extends LoginType {
  code: string;
}

export interface SettingsType {
  // if the user wanna update stuff he does not have to enter all the values
  userId: string;
  newName?: string;
  newEmail?: string;
  currency?: currency;
  oldPassword?: string;
  newPassword?: string;
}

export interface EventsType {
  id?: string;
  userId: string;
  title: string;
  date: string;
  visibility: visibilityModes;
  description?: string;
  image?: string;
}

export interface GiftType {
  name: string;
  currency: currency;
  link: string;
  price: string;
  description?: string;
  image?: string;
}

export interface GiftReturnType extends Gift {
  originalPrice: string;
  originalCurrency: string;
}

export interface CreateGiftType extends GiftType {
  userId: string;
  eventId: string;
}

export interface UpdateGiftType extends GiftType {
  userId: string;
  giftId: string;
}

export type ExchangeRates = {
  USD: number;
  UZS: number;
  RUB: number;
};

export type ExchangeRateResponse = {
  rates: ExchangeRates;
  base: string;
  timestamp: number;
};
