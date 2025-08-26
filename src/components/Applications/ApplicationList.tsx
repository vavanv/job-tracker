import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { Application, FilterOptions } from "../../types";
import { ApplicationCard } from "./ApplicationCard";
import { SearchBar } from "../Common/SearchBar";
import { FilterPanel } from "../Common/FilterPanel";

interface ApplicationListProps {
  applications: Application[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateFilters: (filters: Partial<FilterOptions>) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({ 
  applications,
  loading,
  error,
  filters,
  onEdit,
  onDelete,
  onUpdateFilters
}) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearchChange = (search: string) => {
    onUpdateFilters({ search });
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    onUpdateFilters(newFilters);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Applications
      </Typography>

      <SearchBar value={filters.search} onChange={handleSearchChange} />

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      {applications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.search ||
            filters.status !== "all" ||
            filters.dateFrom ||
            filters.dateTo
              ? "Try adjusting your search or filters"
              : "Start by adding your first job application using the + button above"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={application.id}>
              <ApplicationCard
                application={application}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {applications.length > 0 && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Showing {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
