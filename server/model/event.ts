import connection from "../config";
import { DataTypes, Model } from "sequelize";

class Event extends Model {
  public id!: number;
  public name!: string;
  public value!: string;
  public created_at!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    sequelize: connection,
    tableName: "events",
  }
);

export default Event;
