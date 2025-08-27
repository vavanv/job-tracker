import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ApplicationStatus } from "../../types";
import type { FilterOptions } from "../../types";

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (
    field: keyof FilterOptions,
    value: string | ApplicationStatus | "all"
  ) => {
    onFilterChange({ [field]: value });
  };

  return (
    <Box
      sx={{ mb: 3, p: 2, backgroundColor: "background.paper", borderRadius: 1 }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" variant="standard">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) =>
                handleChange(
                  "status",
                  e.target.value as ApplicationStatus | "all"
                )
              }
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.values(ApplicationStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="From Date"
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
            fullWidth
            size="small"
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="To Date"
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleChange("dateTo", e.target.value)}
            fullWidth
            size="small"
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <TextField
              label="Clear Filters"
              value=""
              onClick={() =>
                onFilterChange({
                  search: "",
                  status: "all",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              fullWidth
              size="small"
              variant="standard"
              InputProps={{
                readOnly: true,
                sx: { cursor: "pointer" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
