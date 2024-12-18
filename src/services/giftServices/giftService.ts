import {
  CreateGiftType,
  UpdateGiftType,
} from "../../types/validatorTypes/validatorTypes";
import { Currencies } from "../../utils/enums/currency";
import { Gift } from "../../models/giftModel";
import { Op } from "sequelize";
import { convertGiftPrices } from "./giftPriceConverter";

export const createGiftService = async (data: CreateGiftType) => {
  const giftData: Partial<CreateGiftType> = {
    ...data,
  };

  // Check if the link has 'http://' or 'https://', and prepend 'https://' if not
  if (data.link && !/^(http:\/\/|https:\/\/)/.test(data.link)) {
    giftData.link = `https://${data.link}`;
  }
  if (data.description) giftData.description = data.description;
  if (data.image) giftData.image = data.image;

  try {
    const event = await Gift.create(giftData);

    return event;
  } catch (error) {
    throw new Error(`Failed to add event: ${(error as Error).message}`);
  }
};

const DEFAULT_CURRENCY = Currencies.USD;
export const getAllGiftsService = async (
  eventId: string,
  currency: Currencies = DEFAULT_CURRENCY,
  page: number,
  limit: number,
  category?: string
) => {
  try {
    const offset = (page - 1) * limit;

    const { rows: gifts, count: totalGifts } = await Gift.findAndCountAll({
      where: { eventId, ...(category ? { category } : {}) },
      limit,
      offset,
    });

    if (!gifts.length) {
      return {
        data: [],
        meta: {
          page,
          limit,
          totalPages: 0,
          totalGifts: 0,
        },
      };
    }

    const convertedGifts = await convertGiftPrices(gifts, currency);

    const totalPages = Math.ceil(totalGifts / limit);

    return {
      meta: {
        page,
        limit,
        totalPages,
        totalGifts,
      },
      data: convertedGifts,
    };
  } catch (error) {
    throw new Error(`Failed to fetch gifts: ${(error as Error).message}`);
  }
};

export const getGiftByIdService = async (giftId: string) => {
  try {
    const gifts = await Gift.findOne({
      where: { id: giftId },
    });
    return gifts;
  } catch (error) {
    throw new Error(`Failed to fetch gift: ${(error as Error).message}`);
  }
};

export const updateGiftByIdService = async (data: UpdateGiftType) => {
  const {
    currency,
    userId,
    giftId,
    price,
    link,
    name,
    description,
    image,
    category,
  } = data;
  try {
    const gift = await Gift.findOne({ where: { id: giftId, userId } });

    if (!gift) {
      throw new Error("Cannot find that gift in this account");
    }

    const updatedFields: Partial<UpdateGiftType> = {};

    if (name) updatedFields.name = name;
    if (image) updatedFields.image = image;
    if (price) updatedFields.price = price;
    if (currency) updatedFields.currency = currency;
    if (link) updatedFields.link = link;
    if (category) updatedFields.category = category;
    updatedFields.description = description || "";

    const gifts = await gift.update(updatedFields);
    return gifts;
  } catch (error) {
    throw new Error(`Failed to update gifts: ${(error as Error).message}`);
  }
};

export const deleteGiftByIdService = async (giftId: string, userId: string) => {
  try {
    const gift = await Gift.findOne({ where: { id: giftId, userId } });

    if (!gift) {
      throw new Error("Gift not found");
    }

    const gifts = await gift.destroy();
    return gifts;
  } catch (error) {
    throw new Error(`Failed to delete gifts: ${(error as Error).message}`);
  }
};

export const getGiftCountService = async (eventId: string) => {
  try {
    const gifts = await Gift.findAll({ where: { eventId } });

    return gifts.length;
  } catch (error) {
    throw new Error(`Failed to get gift count: ${(error as Error).message}`);
  }
};

export const getGiftCountReservedEmailService = async (eventId: string) => {
  try {
    const gifts = await Gift.findAll({
      where: {
        eventId,
        reservedEmail: {
          [Op.ne]: null, // Checks if reservedEmail is not null
        },
      },
    });
    return gifts.length;
  } catch (error) {
    throw new Error(
      `Failed to get reserved gift count: ${(error as Error).message}`
    );
  }
};

export const createGiftReservationService = async (
  giftId: string,
  reservedEmail: string
) => {
  try {
    const gift = await Gift.findByPk(giftId);

    if (!gift) {
      throw new Error("Gift not found");
    }

    if (gift.reservedEmail !== null) {
      throw new Error("This gift has already been reserved");
    }

    const updatedGift = await gift.update({ reservedEmail });

    return updatedGift;
  } catch (error) {
    throw new Error(`Failed to reserve the gift: ${(error as Error).message}`);
  }
};
