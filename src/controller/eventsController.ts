import { Request, Response } from "express";
import {
  createEventService,
  deleteEventByIdService,
  getAllEventsByIdService,
  getEventByIdService,
  updateEventByIdService,
} from "../services/eventServices/eventService";
import {
  getGiftCountReservedEmailService,
  getGiftCountService,
} from "../services/giftServices/giftService";
import { UserType } from "../types/User";
import { deleteImage } from "../config/imgUploadConfig";

export const createEventController = async (req: Request, res: Response) => {
  const { title, date, visibility, description } = req.body;
  const user = req.user as UserType;
  const image = req.file?.path;

  try {
    const event = await createEventService({
      userId: user.id.toString(),
      title,
      date,
      visibility,
      description,
      image,
    });

    res.status(201).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAllEventsController = async (req: Request, res: Response) => {
  const user = req.user as UserType;
  try {
    const event = await getAllEventsByIdService(user.id);

    res.status(200).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = req.user as UserType;
    const [event, giftCount, giftReservedCount] = await Promise.all([
      getEventByIdService(id, user.id).then((event) =>
        event?.get({ plain: true })
      ),
      getGiftCountService(id),
      getGiftCountReservedEmailService(id),
    ]);
    res.status(200).send({ ...event, giftCount, giftReservedCount });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateEventByIdController = async (
  req: Request,
  res: Response
) => {
  const { title, date, visibility, description } = req.body;
  const { id } = req.params;
  const user = req.user as UserType;
  const newImage = req.file?.path;

  try {
    const existingEvent = await getEventByIdService(id, user.id);

    if (!existingEvent) {
      throw new Error("Event not found");
    }

    const oldImage = existingEvent.image;

    // Update the event with the new details
    const event = await updateEventByIdService({
      id,
      userId: user.id,
      date,
      description,
      title,
      visibility,
      image: newImage || oldImage,
    });

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

export const deleteEventByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = req.user as UserType;
    const event = await getEventByIdService(id, user.id);

    if (event && !!event.image) {
      const imagePath = event.image;
      if (imagePath) {
        await deleteImage(imagePath);
      }
    }
    const message = await deleteEventByIdService(id, user.id);

    res.status(202).send(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
