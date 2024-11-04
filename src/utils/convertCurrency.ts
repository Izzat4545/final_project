import {
  ExchangeRateResponse,
  ExchangeRates,
} from "../types/validatorTypes/validatorTypes";
import { getEnv } from "./getEnv";
import { redisClient } from "../config/redis";

export const convertCurrency = async (
  amount: number,
  fromCurrency: keyof ExchangeRates,
  toCurrency: keyof ExchangeRates
): Promise<number> => {
  const OPEN_EXCHANGE_API_KEY = getEnv("CURRENCY_EXCHANGE_KEY");
  const EXCHANGE_URL = `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_API_KEY}`;
  const CACHE_KEY = "exchange_rates";
  const CACHE_EXPIRATION = 40 * 60; // 40 minutes in seconds

  try {
    // Check if exchange rates are cached
    const cachedRates = await redisClient.get(CACHE_KEY);

    let rates: ExchangeRates;

    if (cachedRates) {
      rates = JSON.parse(cachedRates) as ExchangeRates;
    } else {
      const response = await fetch(EXCHANGE_URL);

      if (!response.ok) {
        throw new Error(
          `Error fetching exchange rates: ${response.statusText}`
        );
      }

      const data: ExchangeRateResponse = await response.json();
      rates = data.rates;

      // Cache the rates in Redis with a 40-minute expiration
      await redisClient.set(CACHE_KEY, JSON.stringify(rates), {
        EX: CACHE_EXPIRATION, // Set expiration in seconds
      });
    }

    // Convert from `fromCurrency` to `USD`, then from `USD` to `toCurrency`
    const usdAmount = amount / rates[fromCurrency]; // Convert `fromCurrency` to USD
    const convertedAmount = usdAmount * rates[toCurrency]; // Convert USD to `toCurrency`

    return Math.round(convertedAmount * 100) / 100;
  } catch (error) {
    console.error("Currency conversion error:", error);
    throw new Error("Failed to convert currency");
  }
};
