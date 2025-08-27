import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  useTheme,
} from "@mui/material";
import {
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RemoveCircle as RemoveCircleIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import type { Stats } from "../../types";

interface DashboardProps {
  stats: Stats;
  loading: boolean;
  onAddClick: () => void;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: "50%",
            p: 1,
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" component="div" color="text.secondary">
          {value}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ stats, loading, onAddClick }) => {
  const theme = useTheme();

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
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={<WorkIcon sx={{ color: "white" }} />}
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Applied"
            value={stats.applied}
            icon={<WorkIcon sx={{ color: "white" }} />}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Interviews"
            value={stats.interview}
            icon={<ScheduleIcon sx={{ color: "white" }} />}
            color={theme.palette.warning.main}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Offers"
            value={stats.offer}
            icon={<CheckCircleIcon sx={{ color: "white" }} />}
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<CancelIcon sx={{ color: "white" }} />}
            color={theme.palette.error.main}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <StatCard
            title="Withdrawn"
            value={stats.withdrawn}
            icon={<RemoveCircleIcon sx={{ color: "white" }} />}
            color={theme.palette.grey[500]}
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add new job applications or navigate to the Applications section to view and manage your existing applications.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          size="small"
        >
          New Application
        </Button>
      </Paper>
    </Box>
  );
};
