import "newrelic";
import express from "express";
import mqtt from "mqtt";
import path from "path";
import Event from "./event";
import jwt from "express-jwt";
import jwtAuthz from "express-jwt-authz";
import jwksRsa from "jwks-rsa";

const client = mqtt.connect(process.env.CLOUDMQTT_URL);

const DOORBELL_ACTIVE = "doorbell/active";
const DOORBELL_INACTIVE = "doorbell/inactive";
const DOORBELL_OPEN_DOOR = "doorbell/open-door";
const DOORBELL_BATTERY = "doorbell/battery";
const DOORBELL_PRESSED = "doorbell/pressed";

client.on("connect", () => {
  client.subscribe([
    DOORBELL_ACTIVE,
    DOORBELL_INACTIVE,
    DOORBELL_OPEN_DOOR,
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

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH_AUDIENCE,
  issuer: [`https://${process.env.AUTH_DOMAIN}/`],
  algorithms: ["RS256"],
});
const checkScopes = jwtAuthz(["write:open-door"]);

client.on("message", async (topic, message) => {
  console.log("received message %s %s", topic, message);
  const now = new Date().toISOString();
  switch (topic) {
    case DOORBELL_PRESSED:
      await Event.create({
        name: EventName.OUTSIDE_BUTTON,
        value: ButtonState.PRESSED,
        created_at: now,
      });
      break;
    case DOORBELL_ACTIVE:
      await Event.create({
        name: EventName.DEVICE_STATE,
        value: DeviceState.ACTIVE,
        created_at: now,
      });
      break;
    case DOORBELL_INACTIVE:
      await Event.create({
        name: EventName.DEVICE_STATE,
        value: DeviceState.INACTIVE,
        created_at: now,
      });
      break;
    case DOORBELL_BATTERY:
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
    res.status(200).json(event ? event.value : DeviceState.INACTIVE);
  });
});

app.get("/battery", (_req, res) => {
  Event.findOne({
    where: {
      name: EventName.BATTERY,
    },
    order: [["created_at", "DESC"]],
  }).then((event: Event) => {
    res.status(200).json(event ? event.value : 0);
  });
});

app.post("/open-door", checkJwt, checkScopes, (_req, res) => {
  client.publish(DOORBELL_OPEN_DOOR, "test");
  res.status(201).json();
});

const staticFiles = express.static(path.join(__dirname, "../client/build"));

app.use(staticFiles);

app.use("/*", staticFiles);

app.listen(process.env.PORT || 3001, () => console.log("Server is running..."));
