import { Currencies } from "../../utils/enums/currency";
import { Event } from "../../models/eventModel";
import { Gift } from "../../models/giftModel";
import { VisibilityModes } from "../../utils/enums/visibilityModes";
import { convertGiftPrices } from "./giftPriceConverter";

export const addPublicGiftToEventService = async (
  giftId: string,
  targetEventId: string
) => {
  try {
    const selectedGift = await Gift.findByPk(giftId);

    if (!selectedGift) {
      throw new Error(`Failed to find gift`);
    }
    const selectedEvent = await Event.findByPk(selectedGift.eventId);

    if (!selectedEvent) {
      throw new Error(`Failed to find event`);
    }

    if (selectedEvent.visibility === VisibilityModes.PRIVATE) {
      throw new Error(`This event is private`);
    }

    const addedGift = await Gift.create({
      ...selectedGift.toJSON(),
      id: undefined,
      eventId: targetEventId,
      popularity: 0,
    });
    await selectedGift.increment("popularity");

    return addedGift;
  } catch (error) {
    throw new Error(`Failed to post gifts: ${(error as Error).message}`);
  }
};

const DEFAULT_CURRENCY = Currencies.USD;
export const getPopularGiftsService = async (
  currency: Currencies = DEFAULT_CURRENCY
) => {
  const TOP_GIFTS = 15;
  try {
    const popularGifts = await Gift.findAll({
      include: [
        {
          model: Event,
          as: "event",
          where: {
            visibility: VisibilityModes.PUBLIC,
          },
        },
      ],
      order: [["popularity", "DESC"]],
      limit: TOP_GIFTS,
    });

    if (!popularGifts.length) {
      return [];
    }
    const convertedGifts = await convertGiftPrices(popularGifts, currency);

    return convertedGifts;
  } catch (error) {
    throw new Error(
      `Failed to fetch public gifts: ${(error as Error).message}`
    );
  }
};
