import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import React from "react";
import { Tooltip, Box } from "@material-ui/core";

export interface TickOrCrossProps {
  state: boolean;
}

export default function TickOrCross({ state }: TickOrCrossProps) {
  if (state) {
    return (
      <Tooltip title="true">
        <Box>
          <TiTick color={"green"} />
        </Box>
      </Tooltip>
    );
  }
  return (
    <Tooltip title="false">
      <Box>
        <ImCross color={"red"} />
      </Box>
    </Tooltip>
  );
}
