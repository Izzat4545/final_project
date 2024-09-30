import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  public id!: number;
  public name!: string | null;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
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
      allowNull: false,
      validate: {
        len: [8, Infinity],
      },
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;
