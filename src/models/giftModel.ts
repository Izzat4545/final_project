import { DataTypes, Model } from "sequelize";
import { currency } from "../utils/enums/currency";
import { sequelize } from "../config/database";

export class Gift extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare image: string;
  declare price: string;
  declare link: string;
  declare userId: string;

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
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(currency)],
          msg: "Visibility must be one of 'so'm', 'rub', or 'usd'",
        },
      },
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Gift",
    tableName: "gifts",
    timestamps: true,
  }
);
