import { Currencies } from "../../utils/enums/currency";
import { Gift } from "../../models/giftModel";
import { GiftReturnType } from "../../types/validatorTypes/validatorTypes";
import { convertCurrency } from "../../utils/convertCurrency";
import { logger } from "../../config/logger/loggerMain";

export const convertGiftPrices = async (
  gifts: Gift[],
  targetCurrency: Currencies
): Promise<GiftReturnType[]> => {
  return Promise.all(
    gifts.map(async (gift) => {
      const originalCurrency = gift.currency;
      const originalPrice = gift.price;

      if (originalCurrency === targetCurrency) {
        return {
          ...gift.toJSON(),
          originalPrice,
          originalCurrency,
        } as GiftReturnType;
      }

      const convertedPrice = await convertCurrency(
        parseFloat(originalPrice),
        originalCurrency,
        targetCurrency
      );

      logger.info("convertCurrency:", convertCurrency);

      return {
        ...gift.toJSON(),
        currency: targetCurrency,
        price: convertedPrice.toString(),
        originalPrice,
        originalCurrency,
      } as GiftReturnType;
    })
  );
};
