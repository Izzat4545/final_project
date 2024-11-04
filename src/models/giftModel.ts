import { DataTypes, Model } from "sequelize";
import { Currencies } from "../utils/enums/currency";
import { GiftCategories } from "../utils/enums/giftCategories";
import { sequelize } from "../config/database";

export class Gift extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare image: string;
  declare price: string;
  declare currency: Currencies;
  declare link: string;
  declare userId: string;
  declare reservedEmail: string;
  declare eventId: string;
  declare category: GiftCategories;
  declare popularity: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Gift.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(Currencies)],
          msg: "Visibility must be one of 'UZS', 'RUB', or 'USD'",
        },
      },
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(GiftCategories)],
          msg: "Invalid category",
        },
      },
    },
    reservedEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Gift",
    tableName: "gifts",
    timestamps: true,
  }
);
