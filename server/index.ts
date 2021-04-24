import "newrelic";
import db from "./config";
import express from "express";
import mqtt from "mqtt";
import path from "path";
import Event from "./event";

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

const DOORBELL_ACTIVE = "doorbell/active";
const DOORBELL_INACTIVE = "doorbell/inactive";
const DOORBELL_BUZZER = "doorbell/buzzer";
const DOORBELL_BATTERY = "doorbell/battery";
const DOORBELL_PRESSED = "doorbell/pressed";

client.on("connect", () => {
  client.subscribe([
    DOORBELL_ACTIVE,
    DOORBELL_INACTIVE,
    DOORBELL_BUZZER,
    DOORBELL_BATTERY,
    DOORBELL_PRESSED,
  ]);
});

enum DeviceState {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

enum ButtonState {
  PRESSED = "pressed",
}

enum EventName {
  DEVICE_STATE = "device_state",
  OUTSIDE_BUTTON = "outside_button",
  BATTERY = "battery_state",
}

client.on("message", (topic, message) => {
  console.log("received message %s %s", topic, message);
  const now = new Date().toISOString();
  switch (topic) {
    case DOORBELL_PRESSED:
      Event.create({
        name: EventName.OUTSIDE_BUTTON,
        value: ButtonState.PRESSED,
        created_at: now,
      });
      break;
    case DOORBELL_ACTIVE:
      Event.create({
        name: EventName.DEVICE_STATE,
        value: DeviceState.ACTIVE,
        created_at: now,
      });
      break;
    case DOORBELL_INACTIVE:
      Event.create({
        name: EventName.DEVICE_STATE,
        value: DeviceState.INACTIVE,
        created_at: now,
      });
      break;
    case DOORBELL_BATTERY:
      Event.create({
        name: EventName.BATTERY,
        value: message,
        created_at: now,
      });
      break;
    default:
      console.log("No handler for topic %s", topic);
  }
});

const app = express();

app.get("/timestamps", (_req, res) => {
  Event.findAll({
    where: {
      name: EventName.OUTSIDE_BUTTON,
    },
    order: [["created_at", "DESC"]],
  }).then((events: Event[]) => {
    res.status(200).json(events.map((event) => event.created_at) || []);
  });
});

app.get("/status", (_req, res) => {
  Event.findOne({
    where: {
      name: EventName.DEVICE_STATE,
    },
    order: [["created_at", "DESC"]],
  }).then((event: Event) => {
    res.status(200).json(event.value || DeviceState.INACTIVE);
  });
});

app.get("/battery", (_req, res) => {
  Event.findOne({
    where: {
      name: EventName.BATTERY,
    },
    order: [["created_at", "DESC"]],
  }).then((event: Event) => {
    res.status(200).json(event.value || 0);
  });
});

app.post("/buzzer", (req, res) => {
  client.publish(DOORBELL_BUZZER, "test");
  res.status(201).json();
});

const staticFiles = express.static(path.join(__dirname, "../client/build"));

app.use(staticFiles);

app.use("/*", staticFiles);

app.listen(process.env.PORT || 3001, () => console.log("Server is running..."));
