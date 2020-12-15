import { Typography } from "@material-ui/core";
import { format } from "date-fns";
import React from "react";

export interface TimeFormatterProps {
  dateTime: number | Date;
}

export default function TimeFormatter({ dateTime }: TimeFormatterProps) {
  return <Typography>{format(dateTime, "MM/dd/yyyy hh:mm")}</Typography>;
}
