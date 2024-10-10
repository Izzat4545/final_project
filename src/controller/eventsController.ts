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
  const { title, date, visibility, description, image } = req.body;
  const user = req.user as UserType;
  console.log(user);
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
  try {
    const event = await getAllEventsService();

    res.status(200).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  const { pk } = req.params;
  try {
    const event = await getEventByIdService(pk);

    res.status(200).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateEventByIdController = async (
  req: Request,
  res: Response
) => {
  const { title, date, visibility, description, image } = req.body;
  const { pk } = req.params;
  try {
    const event = await updateEventByIdService(
      pk,
      title,
      date,
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
  const { pk } = req.params;
  try {
    const event = await deleteEventByIdService(pk);

    res.status(201).send(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
