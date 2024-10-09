import { Event } from "./eventModel";
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
