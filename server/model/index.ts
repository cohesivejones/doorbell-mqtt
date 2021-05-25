import Event from "./event";

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
  OPEN_DOOR_BUTTON = "open_door_button",
  BATTERY = "battery_state",
}

export { Event, DeviceState, ButtonState, EventName };
