import { Request, Response } from "express";
import {
  createEventService,
  deleteEventByIdService,
  getAllEventsService,
  getEventByIdService,
  updateEventByIdService,
} from "../services/eventServices/eventService";
import { UserType } from "../types/User";
import { deleteImage } from "../config/imgUploadConfig";

export const createEventController = async (req: Request, res: Response) => {
  const { title, date, visibility, description } = req.body;
  const user = req.user as UserType;
  const image = req.file?.path;

  try {
    const event = await createEventService(
      user.id.toString(),
      title,
      date,
      visibility,
      description,
      image
    );

    res.status(201).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAllEventsController = async (req: Request, res: Response) => {
  const user = req.user as UserType;
  try {
    const event = await getAllEventsService(user.id);

    res.status(200).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  const { pk } = req.params;
  try {
    const user = req.user as UserType;
    const event = await getEventByIdService(pk, user.id);
    res.status(200).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateEventByIdController = async (
  req: Request,
  res: Response
) => {
  const { title, date, visibility, description } = req.body;
  const { pk } = req.params;
  const user = req.user as UserType;
  const newImage = req.file?.path;
  let oldImage = "";
  try {
    const existingEvent = await getEventByIdService(pk, user.id);

    if (existingEvent && "image" in existingEvent) {
      oldImage = existingEvent.image;
      if (oldImage) {
        await deleteImage(oldImage);
      }
    }

    const event = await updateEventByIdService(
      pk,
      user.id,
      title,
      date,
      description,
      visibility,
      newImage || oldImage
    );

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

export const deleteEventByIdController = async (
  req: Request,
  res: Response
) => {
  const { pk } = req.params;
  try {
    const user = req.user as UserType;
    const event = await getEventByIdService(pk, user.id);

    if (event && "image" in event) {
      const imagePath = event.image;
      if (imagePath) {
        await deleteImage(imagePath);
      }
    }
    const message = await deleteEventByIdService(pk, user.id);

    res.status(202).send(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
