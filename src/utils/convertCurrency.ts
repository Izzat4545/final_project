import {
  ExchangeRateResponse,
  ExchangeRates,
} from "../types/validatorTypes/validatorTypes";
import { getEnv } from "./getEnv";

export const convertCurrency = async (
  amount: number,
  fromCurrency: keyof ExchangeRates,
  toCurrency: keyof ExchangeRates
): Promise<number> => {
  const OPEN_EXCHANGE_API_KEY = getEnv("CURRENCY_EXCHANGE_KEY");
  const url = `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching exchange rates: ${response.statusText}`);
    }

    const data: ExchangeRateResponse = await response.json();
    const { rates } = data;

    // Convert from `fromCurrency` to `USD`, then from `USD` to `toCurrency`
    const usdAmount = amount / rates[fromCurrency]; // Convert `fromCurrency` to USD
    const convertedAmount = usdAmount * rates[toCurrency]; // Convert USD to `toCurrency`

    return Math.round(convertedAmount * 100) / 100;
  } catch (error) {
    console.error("Currency conversion error:", error);
    throw new Error("Failed to convert currency");
  }
};
