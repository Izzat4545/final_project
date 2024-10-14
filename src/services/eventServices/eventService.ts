import { Event } from "../../models/eventModel";
import { EventsType } from "../../types/validatorTypes/validatorTypes";
import { Gift } from "../../models/giftModel";

export const createEventService = async (info: EventsType) => {
  const { date, title, userId, visibility, description, image } = info;
  try {
    const event = await Event.create({
      userId,
      title,
      date,
      visibility,
      description,
      image,
    });

    return event;
  } catch (error) {
    throw new Error(`Failed to add event: ${(error as Error).message}`);
  }
};

export const getAllEventsByIdService = async (userId: string) => {
  try {
    const events = await Event.findAll({
      where: { userId },
      include: [{ model: Gift, as: "gifts" }],
    });

    return events;
  } catch (error) {
    return { message: `Failed to get events: ${(error as Error).message}` };
  }
};

export const getEventByIdService = async (id: string, userId: string) => {
  try {
    const event = await Event.findOne({ where: { id, userId } });

    return event;
  } catch (error) {
    return {
      message: `Failed to get event: ${(error as Error).message}`,
      image: null,
    };
  }
};

export const updateEventByIdService = async (info: EventsType) => {
  const { date, title, userId, visibility, description, id, image } = info;
  try {
    const event = await Event.findOne({ where: { id, userId } });

    if (!event) {
      throw new Error("Event not found");
    }

    const updateData: Partial<EventsType> = {};

    if (title) {
      updateData.title = title;
    }
    if (date) {
      updateData.date = date;
    }
    if (description) {
      updateData.description = description;
    }
    if (visibility) {
      updateData.visibility = visibility;
    }
    if (image) {
      updateData.image = image;
    }

    const updatedData = await event.update({ ...updateData });

    return updatedData;
  } catch (error) {
    throw new Error(`Failed to update event: ${(error as Error).message}`);
  }
};

export const deleteEventByIdService = async (id: string, userId: string) => {
  try {
    const event = await Event.findOne({ where: { id, userId } });

    await event?.destroy();

    return { message: "success" };
  } catch (error) {
    throw new Error(`Failed to delete event: ${(error as Error).message}`);
  }
};
