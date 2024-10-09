import { Request, Response } from "express";
import {
  createEventService,
  deleteEventByIdService,
  getAllEventsService,
  getEventByIdService,
  updateEventByIdService,
} from "../services/EventServices/EventService";
import { UserType } from "../types/User";

export const createEventController = async (req: Request, res: Response) => {
  const { title, eventDate, visibility, description, image } = req.body;
  try {
    const event = await createEventService(
      title,
      eventDate,
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
  try {
    const event = await getAllEventsService();

    res.status(200).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserType;
    const event = await getEventByIdService(user.id.toString());

    res.status(200).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateEventByIdController = async (
  req: Request,
  res: Response
) => {
  const { title, eventDate, visibility, description, image } = req.body;
  try {
    const user = req.user as UserType;
    const event = await updateEventByIdService(
      user.id.toString(),
      title,
      eventDate,
      description,
      visibility,
      image
    );

    res.status(201).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteEventByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as UserType;
    const event = await deleteEventByIdService(user.id.toString());

    res.status(201).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
