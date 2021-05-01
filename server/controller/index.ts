import { Event, EventName, DeviceState } from "../model";
import { TOPIC } from "../config";

const timestamps = (_req, res) => {
  Event.findAll({
    where: {
      name: EventName.OUTSIDE_BUTTON,
    },
    order: [["created_at", "DESC"]],
  }).then((events: Event[]) => {
    res.status(200).json(events.map((event) => event.created_at) || []);
  });
};

const status = (_req, res) => {
  Event.findOne({
    where: {
      name: EventName.DEVICE_STATE,
    },
    order: [["created_at", "DESC"]],
  }).then((event: Event) => {
    res.status(200).json(event ? event.value : DeviceState.INACTIVE);
  });
};

const battery = (_req, res) => {
  Event.findOne({
    where: {
      name: EventName.BATTERY,
    },
    order: [["created_at", "DESC"]],
  }).then((event: Event) => {
    res.status(200).json(event ? event.value : 0);
  });
};

const openDoor = (client) => (_req, res) => {
  client.publish(TOPIC.DOORBELL_OPEN_DOOR, "test");
  res.status(201).json();
};

export { timestamps, status, battery, openDoor };
