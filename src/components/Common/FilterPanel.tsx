import React from "react";
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
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
  const handleChange = (
    field: keyof FilterOptions,
    value: string | ApplicationStatus | "all"
  ) => {
    onFilterChange({ [field]: value });
  };

  return (
    <Card
      sx={{ 
        mb: 3, 
        p: 2,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <Grid container spacing={1} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <TextField
            label="Search"
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            fullWidth
            size="small"
            variant="standard"
            placeholder="Search by company or job title..."
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
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

        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
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

        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
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

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              height: "100%",
              alignItems: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                onFilterChange({
                  search: "",
                  status: "all",
                  dateFrom: "",
                  dateTo: "",
                })
              }
              sx={{ mb: 0.5 }}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};
