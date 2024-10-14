import { DataTypes, Model } from "sequelize";
import { Currencies } from "../utils/enums/currency";
import { sequelize } from "../config/database";

export class User extends Model {
  declare id: string;
  declare name: string | null;
  declare email: string;
  declare password: string | null;
  declare googleId: string | null;
  declare currency: Currencies;
  declare salt: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [8, Infinity],
      },
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Currencies.USD,
      validate: {
        isIn: {
          args: [Object.values(Currencies)],
          msg: "Visibility must be one of 'UZS', 'RUB', or 'USD'",
        },
      },
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);
