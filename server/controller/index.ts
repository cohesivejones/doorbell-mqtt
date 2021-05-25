import { Event, EventName, DeviceState } from "../model";
import { Op } from "sequelize";
import { TOPIC } from "../config";

const timestamps = (_req, res) => {
  Event.findAll({
    where: {
      [Op.or]: [
        { name: EventName.OUTSIDE_BUTTON },
        { name: EventName.OPEN_DOOR_BUTTON },
      ],
    },
    order: [["created_at", "DESC"]],
    limit: 10,
  }).then((events: Event[]) => {
    res.status(200).json(
      events.map((event) => ({
        open: event.name == EventName.OPEN_DOOR_BUTTON,
        timestamp: event.created_at,
      }))
    );
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
