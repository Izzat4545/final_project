import { Event } from "../../models/eventModel";
import { visibilityModes } from "../../utils/enums/visibilityModes";

export const createEventService = async (
  userId: string,
  title: string,
  date: string,
  visibility: visibilityModes,
  description?: string,
  image?: string
) => {
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

export const getAllEventsService = async (userId: string) => {
  try {
    const events = await Event.findAll({ where: { userId } });

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
    return { message: `Failed to get event: ${(error as Error).message}` };
  }
};

export const updateEventByIdService = async (
  id: string,
  userId: string,
  title: string,
  eventDate: string,
  description: string,
  visibility: visibilityModes,
  image: string
) => {
  try {
    const event = await Event.findOne({ where: { id, userId } });

    if (!event) {
      throw new Error("Event not found");
    }

    const updateData: Partial<{
      title: string;
      eventDate: string;
      description: string;
      visibility: visibilityModes;
      image: string;
    }> = {};

    if (title) {
      updateData.title = title;
    }
    if (eventDate) {
      updateData.eventDate = eventDate;
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

    const updatedData = await event?.update({ ...updateData });

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
