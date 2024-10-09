import { DataTypes, Model } from "sequelize";
import { getEnv } from "../utils/getEnv";
import { sequelize } from "../config/database";
import { visibilityModes } from "../utils/enums/visibilityModes";

export class Event extends Model {
  declare id: string;
  declare title: string;
  declare date: string;
  declare description: string;
  declare image: string;
  declare visibility: string;
  declare link: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(visibilityModes)],
          msg: "Visibility must be one of 'private', 'by_url', or 'public'",
        },
      },
    },
    link: {
      type: DataTypes.VIRTUAL,
      get: function () {
        return `${getEnv("FRONTEND_LINK")}/${this.getDataValue("id")}`;
      },
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    timestamps: true,
  }
);
