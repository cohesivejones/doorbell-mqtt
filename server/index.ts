import "newrelic";
import express from "express";
import mqtt from "mqtt";
import path from "path";
import { Event, EventName, ButtonState, DeviceState } from "./model";
import * as Controller from "./controller";
import jwt from "express-jwt";
import jwtAuthz from "express-jwt-authz";
import jwksRsa from "jwks-rsa";
import { TOPIC } from "./config";

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

client.on("connect", () => {
  client.subscribe([
    TOPIC.DOORBELL_ACTIVE,
    TOPIC.DOORBELL_INACTIVE,
    TOPIC.DOORBELL_OPEN_DOOR,
    TOPIC.DOORBELL_BATTERY,
    TOPIC.DOORBELL_PRESSED,
  ]);
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`,
  }),

  audience: process.env.AUTH_AUDIENCE,
  issuer: [`https://${process.env.AUTH_DOMAIN}/`],
  algorithms: ["RS256"],
});
const openDoorScope = jwtAuthz(["write:open-door"]);
const statusScope = jwtAuthz(["read:status"]);
const batteryScope = jwtAuthz(["read:battery"]);

const TOPIC_TO_NAME = {
  [TOPIC.DOORBELL_PRESSED]: EventName.OUTSIDE_BUTTON,
  [TOPIC.DOORBELL_OPEN_DOOR]: EventName.OPEN_DOOR_BUTTON,
  [TOPIC.DOORBELL_ACTIVE]: EventName.DEVICE_STATE,
  [TOPIC.DOORBELL_INACTIVE]: EventName.DEVICE_STATE,
};

const TOPIC_TO_VALUE = {
  [TOPIC.DOORBELL_PRESSED]: ButtonState.PRESSED,
  [TOPIC.DOORBELL_OPEN_DOOR]: ButtonState.PRESSED,
  [TOPIC.DOORBELL_ACTIVE]: DeviceState.ACTIVE,
  [TOPIC.DOORBELL_INACTIVE]: DeviceState.INACTIVE,
};

client.on("message", async (topic, message) => {
  console.log("received message %s %s", topic, message);
  const now = new Date().toISOString();
  switch (topic) {
    case TOPIC.DOORBELL_PRESSED:
    case TOPIC.DOORBELL_OPEN_DOOR:
    case TOPIC.DOORBELL_ACTIVE:
    case TOPIC.DOORBELL_INACTIVE:
      await Event.create({
        name: TOPIC_TO_NAME[topic],
        value: TOPIC_TO_VALUE[topic],
        created_at: now,
      });
      break;
    case TOPIC.DOORBELL_BATTERY:
      await Event.create({
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

app.get("/timestamps", Controller.timestamps);

app.get("/status", checkJwt, openDoorScope, Controller.status);

app.get("/battery", checkJwt, batteryScope, Controller.battery);

app.post("/open-door", checkJwt, statusScope, Controller.openDoor(client));

const staticFiles = express.static(path.join(__dirname, "../client/build"));

app.use(staticFiles);

app.use("/*", staticFiles);

app.listen(process.env.PORT || 3001, () => console.log("Server is running..."));
