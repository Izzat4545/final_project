import { Request, Response } from "express";
import {
  createGiftReservationService,
  createGiftService,
  deleteGiftByIdService,
  getAllGiftsService,
  getAllPublicGiftsService,
  getGiftByIdService,
  getGiftCountReservedEmailService,
  getGiftCountService,
  updateGiftByIdService,
} from "../services/giftServices/giftService";
import { UserType } from "../types/User";
import { deleteImage } from "../config/imgUploadConfig";

export const createGiftController = async (req: Request, res: Response) => {
  const { name, currency, link, price, description } = req.body;
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
      description,
      image,
      price,
    });

    res.status(201).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAllGiftsController = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const gifts = await getAllGiftsService(eventId);

    const giftCount = await getGiftCountService(eventId);
    const giftReservedCount = await getGiftCountReservedEmailService(eventId);

    res.status(200).send({ giftCount, giftReservedCount, gifts });
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

export const getAllPublicGiftsController = async (
  req: Request,
  res: Response
) => {
  try {
    const gifts = await getAllPublicGiftsService();

    res.status(200).send(gifts);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateGiftByIdController = async (req: Request, res: Response) => {
  const { giftId } = req.params;
  const { currency, description, name, price, link } = req.body;
  const user = req.user as UserType;
  const newImage = req.file?.path;
  let oldImage = "";
  try {
    const existingGift = await getGiftByIdService(giftId);

    if (existingGift && "image" in existingGift) {
      oldImage = existingGift.image;
      if (oldImage) {
        await deleteImage(oldImage);
      }
    }

    const event = await updateGiftByIdService({
      userId: user.id,
      giftId,
      name,
      currency,
      link,
      price,
      description,
      image: newImage,
    });

    // If a new image was uploaded, delete the old image
    if (newImage && oldImage) {
      await deleteImage(oldImage);
    }

    res.status(200).send(event);
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

    if (gift && "image" in gift) {
      const imagePath = gift.image;
      if (imagePath) {
        await deleteImage(imagePath);
      }
    }
    const message = await deleteGiftByIdService(giftId, user.id);

    res.status(202).send(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
