import React from "react";
import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";
import { ApplicationStatus } from "../../types";
import { STATUS_COLORS } from "../../utils/constants";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: ChipProps["size"];
  variant?: ChipProps["variant"];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "small",
  variant = "filled",
}) => {
  const color = STATUS_COLORS[status];

  return (
    <Chip
      label={status}
      size={size}
      variant={variant}
      sx={{
        backgroundColor: color,
        color: "white",
        fontWeight: "medium",
        "& .MuiChip-label": {
          color: "white",
        },
      }}
    />
  );
};
