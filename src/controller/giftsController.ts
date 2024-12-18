import { Request, Response } from "express";
import {
  addPublicGiftToEventService,
  getPopularGiftsService,
} from "../services/giftServices/popularGiftService";
import {
  createGiftReservationService,
  createGiftService,
  deleteGiftByIdService,
  getAllGiftsService,
  getGiftByIdService,
  updateGiftByIdService,
} from "../services/giftServices/giftService";
import { Currencies } from "../utils/enums/currency";
import { UserType } from "../types/User";
import { deleteImage } from "../config/imgUploadConfig";

export const createGiftController = async (req: Request, res: Response) => {
  const { name, currency, link, price, description, category } = req.body;
  const { eventId } = req.params;
  const user = req.user as UserType;
  const image = req.file?.path;

  try {
    const event = await createGiftService({
      userId: user.id,
      eventId,
      name,
      currency,
      link,
      category,
      description,
      price,
      image,
    });

    res.status(201).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAllGiftsController = async (req: Request, res: Response) => {
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_LIMIT = 10;
  const { eventId } = req.params;
  const {
    category,
    page = DEFAULT_PAGE_NUMBER,
    limit = DEFAULT_PAGE_LIMIT,
  } = req.query;
  const user = req.user as UserType | undefined;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  try {
    const gifts = await getAllGiftsService(
      eventId,
      user?.currency,
      pageNum,
      limitNum,
      category?.toString()
    );
    res.status(200).send({ ...gifts });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getGiftByIdController = async (req: Request, res: Response) => {
  const { giftId } = req.params;
  try {
    const gift = await getGiftByIdService(giftId);

    res.status(200).send(gift);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getPopularGiftsController = async (
  req: Request,
  res: Response
) => {
  const user = req.user as UserType | undefined;
  const DEFAULT_CURRENCY = Currencies.USD;
  try {
    const currency = user ? user.currency : DEFAULT_CURRENCY;
    const gifts = await getPopularGiftsService(currency);

    res.status(200).send(gifts);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateGiftByIdController = async (req: Request, res: Response) => {
  const { giftId } = req.params;
  const { currency, description, name, price, link, category } = req.body;
  const user = req.user as UserType;
  const newImage = req.file?.path;

  try {
    const existingGift = await getGiftByIdService(giftId);

    // Check if the gift exists
    if (!existingGift) {
      throw new Error("Gift not found");
    }

    // Store the old image if it exists
    const oldImage = existingGift.image;

    // Update the gift with the new details
    const updatedGift = await updateGiftByIdService({
      userId: user.id,
      giftId,
      name,
      currency,
      link,
      price,
      category,
      description,
      image: newImage || oldImage, // Use new image or retain old image if new image is not provided
    });

    // Delete the old image only if a new image was uploaded
    if (newImage && oldImage) {
      await deleteImage(oldImage);
    }

    res.status(200).send(updatedGift);
  } catch (error) {
    // Cleanup: remove the uploaded image if an error occurred
    if (newImage) {
      await deleteImage(newImage);
    }
    res.status(400).json({ error: (error as Error).message });
  }
};

export const createGiftReservationController = async (
  req: Request,
  res: Response
) => {
  const { giftId } = req.params;
  const { email } = req.body;
  try {
    const reservedGift = await createGiftReservationService(giftId, email);
    res.status(201).json(reservedGift);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteGiftByIdController = async (req: Request, res: Response) => {
  const { giftId } = req.params;
  const user = req.user as UserType;
  try {
    const gift = await getGiftByIdService(giftId);

    if (gift && !!gift.image) {
      const imagePath = gift.image;
      if (imagePath) {
        await deleteImage(imagePath);
      }
    }
    const message = await deleteGiftByIdService(giftId, user.id);

    res.status(202).json(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const addPublicGiftToEventController = async (
  req: Request,
  res: Response
) => {
  const user = req.user as UserType;
  const { giftId, targetEventId } = req.body;
  try {
    const addedGift = addPublicGiftToEventService(
      giftId,
      targetEventId,
      user.id
    );
    res.status(201).json(addedGift);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
