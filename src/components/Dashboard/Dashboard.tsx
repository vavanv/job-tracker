import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
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
  value: number | string;
  color: string;
  bgColor: string;
}> = ({ title, value, color, bgColor }) => (
  <Card 
    sx={{ 
      height: "100%",
      backgroundColor: bgColor,
      borderRadius: 3,
      border: "1px solid #e0e0e0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}
  >
    <CardContent sx={{ p: 3, textAlign: "center" }}>
      <Typography 
        variant="h3" 
        component="div" 
        sx={{ 
          color: color,
          fontWeight: "bold",
          mb: 1,
          fontSize: "2.5rem"
        }}
      >
        {value}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ fontSize: "0.875rem" }}
      >
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ stats, loading, onAddClick }) => {

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
            color="#6366f1"
            bgColor="#f1f5f9"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Interviews"
            value={stats.interview}
            color="#f59e0b"
            bgColor="#fef3c7"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Offers"
            value={stats.offer}
            color="#10b981"
            bgColor="#d1fae5"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Success Rate"
            value={stats.total > 0 ? `${Math.round((stats.offer / stats.total) * 100)}%` : "0%"}
            color="#06b6d4"
            bgColor="#cffafe"
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
