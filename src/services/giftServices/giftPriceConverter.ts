import { Gift } from "../../models/giftModel";
import { convertCurrency } from "../../utils/convertCurrency";
import { Currencies } from "../../utils/enums/currency";
import { GiftReturnType } from "../../types/validatorTypes/validatorTypes";

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
