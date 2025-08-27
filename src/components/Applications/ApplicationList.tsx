import React from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import type { Application, FilterOptions } from "../../types";
import { ApplicationCard } from "./ApplicationCard";
import { SearchBar } from "../Common/SearchBar";
import { FilterPanel } from "../Common/FilterPanel";
import { Add as AddIcon } from "@mui/icons-material";

interface ApplicationListProps {
  applications: Application[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateFilters: (filters: Partial<FilterOptions>) => void;
  onAddClick: () => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  loading,
  error,
  filters,
  onEdit,
  onDelete,
  onUpdateFilters,
  onAddClick,
}) => {
  // Assume drawer is open on desktop by default (matching Layout component)

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
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Applications
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            size="small"
          >
            New Application
          </Button>
        </Box>

        <SearchBar value={filters.search} onChange={handleSearchChange} />

        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
      </Box>

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
              : "Start by adding your first job application using the New Application button above"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application) => (
            <Grid key={application.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
