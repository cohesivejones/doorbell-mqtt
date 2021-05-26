import moment from "moment-timezone";

export const formatTimestamp = (timestamp: string) => {
  const date = moment(timestamp);
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "day").startOf("day");

  if (date > today) return `Today ${date.format("h:mm:ss a")}`;
  if (date > yesterday) return `Yesterday ${date.format("h:mm:ss a")}`;
  return date.format("MMMM Do YYYY, h:mm:ss a");
};
