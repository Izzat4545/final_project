import {
  createGiftType,
  updateGiftType,
} from "../../types/validatorTypes/validatorTypes";
import { Gift } from "../../models/giftModel";

export const createGiftService = async (data: createGiftType) => {
  const giftData: Partial<createGiftType> = {
    ...data,
  };

  if (data.description) giftData.description = data.description;
  if (data.image) giftData.image = data.image;

  try {
    const event = await Gift.create(giftData);

    return event;
  } catch (error) {
    throw new Error(`Failed to add event: ${(error as Error).message}`);
  }
};

export const getAllGiftsService = async (eventId: string) => {
  try {
    const gifts = await Gift.findAll({ where: { eventId } });
    return gifts;
  } catch (error) {
    throw new Error(`Failed to fetch gifts: ${(error as Error).message}`);
  }
};

export const getGiftByIdService = async (eventId: string, giftId: string) => {
  try {
    const gifts = await Gift.findOne({ where: { eventId, id: giftId } });
    return gifts;
  } catch (error) {
    throw new Error(`Failed to fetch gift: ${(error as Error).message}`);
  }
};

export const updateGiftByIdService = async (data: updateGiftType) => {
  const { currency, giftId, price, link, name, description, image } = data;
  try {
    const gift = await Gift.findByPk(giftId);

    const updatedFields: Partial<updateGiftType> = {};

    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (image) updatedFields.image = image;
    if (price) updatedFields.price = price;
    if (currency) updatedFields.currency = currency;
    if (currency) updatedFields.currency = currency;
    if (currency) updatedFields.link = link;

    const gifts = await gift?.update(updatedFields);
    return gifts;
  } catch (error) {
    throw new Error(`Failed to update gifts: ${(error as Error).message}`);
  }
};

export const deleteGiftByIdService = async (giftId: string) => {
  try {
    const gift = await Gift.findByPk(giftId);

    const gifts = await gift?.destroy();
    return gifts;
  } catch (error) {
    throw new Error(`Failed to delete gifts: ${(error as Error).message}`);
  }
};
