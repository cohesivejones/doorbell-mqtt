import "newrelic";
import db from "./config";
import express from "express";
import mqtt from "mqtt";
import path from "path";

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

const DOORBELL_ACTIVE = "doorbell/active";
const DOORBELL_INACTIVE = "doorbell/inactive";
const DOORBELL_BUZZER = "doorbell/buzzer";
const BATTERY_STATUS = "battery/status";

client.on("connect", () => {
  client.subscribe([
    DOORBELL_ACTIVE,
    DOORBELL_INACTIVE,
    DOORBELL_BUZZER,
    BATTERY_STATUS,
  ]);
});

enum DeviceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

enum EventName {
  DEVICE_STATUS = "device_status",
  BATTERY = "battery",
}

client.on("message", (topic, message) => {
  console.log("received message %s %s", topic, message);
  const now = new Date().toISOString();
  switch (topic) {
    case DOORBELL_ACTIVE:
      db.query(
        "INSERT INTO events (name, value, created_at) VALUES ($1, $2, $3)",
        [EventName.DEVICE_STATUS, DeviceStatus.ACTIVE, now]
      );
      break;
    case DOORBELL_INACTIVE:
      db.query(
        "INSERT INTO events (name, value, created_at) VALUES ($1, $2, $3)",
        [EventName.DEVICE_STATUS, DeviceStatus.INACTIVE, now]
      );
      break;
    case BATTERY_STATUS:
      db.query(
        "INSERT INTO events (name, value, created_at) VALUES ($1, $2, $3)",
        [EventName.BATTERY, message, now]
      );
      break;
    default:
      console.log("No handler for topic %s", topic);
  }
});

const app = express();

app.get("/timestamps", (_req, res) => {
  db.query(
    `SELECT created_at FROM events WHERE name = '${EventName.DEVICE_STATUS}' AND value = '${DeviceStatus.ACTIVE}' ORDER BY created_at desc`,
    (_error, results) => {
      res.status(200).json(results?.rows.map((row) => row.created_at) || []);
    }
  );
});

app.get("/status", (_req, res) => {
  db.query(
    `SELECT value FROM events WHERE name = '${EventName.DEVICE_STATUS}' ORDER BY created_at desc LIMIT 1`,
    (_error, results) => {
      res
        .status(200)
        .json(
          results?.rows.map((row) => row.value)[0] || DeviceStatus.INACTIVE
        );
    }
  );
});

app.get("/battery", (_req, res) => {
  db.query(
    `SELECT value FROM events WHERE name = '${EventName.BATTERY}' ORDER BY created_at desc LIMIT 1`,
    (_error, results) => {
      res.status(200).json(results?.rows.map((row) => row.value)[0] || 0);
    }
  );
});

app.post("/buzzer", (req, res) => {
  client.publish(DOORBELL_BUZZER, "test");
  res.status(201).json();
});

const staticFiles = express.static(path.join(__dirname, "../client/build"));

app.use(staticFiles);

app.use("/*", staticFiles);

app.listen(process.env.PORT || 3001, () => console.log("Server is running..."));
