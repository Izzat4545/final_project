import { Event } from "../../models/eventModel";
import { visibilityModes } from "../../utils/enums/visibilityModes";

export const createEventService = async (
  title: string,
  eventDate: string,
  visibility: visibilityModes,
  description?: string,
  image?: string
) => {
  try {
    const event = await Event.create({
      title,
      eventDate,
      visibility,
      description,
      image,
    });

    return { event };
  } catch (error) {
    throw new Error(`Failed to add event: ${(error as Error).message}`);
  }
};

export const getAllEventsService = async () => {
  try {
    const events = await Event.findAll();

    return { events };
  } catch (error) {
    return { message: `Failed to get events: ${(error as Error).message}` };
  }
};

export const getEventByIdService = async (id: string) => {
  try {
    const event = await Event.findByPk(id);

    return { event };
  } catch (error) {
    return { message: `Failed to get event: ${(error as Error).message}` };
  }
};

export const updateEventByIdService = async (
  id: string,
  title: string,
  eventDate: string,
  description: string,
  visibility: visibilityModes,
  image: string
) => {
  try {
    const event = await Event.findByPk(id);

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

    const updatedData = await event?.update({ updateData });

    return { updatedData };
  } catch (error) {
    throw new Error(`Failed to update event: ${(error as Error).message}`);
  }
};

export const deleteEventByIdService = async (id: string) => {
  try {
    const event = await Event.findByPk(id);

    await event?.destroy();

    return { message: "success" };
  } catch (error) {
    throw new Error(`Failed to delete event: ${(error as Error).message}`);
  }
};
