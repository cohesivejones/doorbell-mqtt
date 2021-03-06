import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const dbConnection = () => {
  if (isProduction) {
    return new Sequelize(process.env.DATABASE_URL, {
      ssl: true,
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    return new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }
};

export enum TOPIC {
  DOORBELL_ACTIVE = "doorbell/active",
  DOORBELL_BATTERY = "doorbell/battery",
  DOORBELL_INACTIVE = "doorbell/inactive",
  DOORBELL_OPEN_DOOR = "doorbell/open-door",
  DOORBELL_OPEN_DOOR_SUCCESS = "doorbell/open-door-success",
  DOORBELL_PRESSED = "doorbell/pressed",
}

export default dbConnection();
