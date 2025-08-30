import React from "react";
import { Tabs, Tab, Box, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, route: "/dashboard" },
  { text: "Applications", icon: <WorkIcon />, route: "/applications" },
  { text: "Settings", icon: <SettingsIcon />, route: "/settings" },
];

export const TabNavigation: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  const getCurrentValue = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "/dashboard";
    return currentPath;
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: 1,
        borderColor: "divider",
        mb: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Tabs
        value={getCurrentValue()}
        aria-label="navigation tabs"
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            minHeight: 64,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
          },
        }}
      >
        {menuItems.map((item) => (
          <Tab
            key={item.route}
            label={item.text}
            value={item.route}
            icon={item.icon}
            iconPosition="start"
            component={Link}
            to={item.route}
            sx={{
              "& .MuiTab-iconWrapper": {
                marginRight: 1,
                marginBottom: 0,
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
