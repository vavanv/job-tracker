import React from "react";
import { Tabs, Tab, Box, useTheme } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

interface TabNavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, route: "dashboard" },
  { text: "Applications", icon: <WorkIcon />, route: "applications" },
  { text: "Settings", icon: <SettingsIcon />, route: "settings" },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const theme = useTheme();
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    onNavigate(newValue);
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
        value={currentRoute}
        onChange={handleTabChange}
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
