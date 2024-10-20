import { Event } from "./eventModel";
import { Gift } from "./giftModel";
import { User } from "./userModel";

User.hasMany(Event, {
  foreignKey: "userId",
  as: "events",
});

Event.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

Event.hasMany(Gift, {
  foreignKey: "eventId",
  as: "gifts",
});

Gift.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
  onDelete: "CASCADE",
});

User.hasMany(Gift, {
  foreignKey: "userId",
  as: "gifts",
});

Gift.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
