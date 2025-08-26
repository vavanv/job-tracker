import React from "react";
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

const DRAWER_WIDTH = 240;

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  onNavigate,
  currentRoute,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, route: "dashboard" },
    { text: "Applications", icon: <WorkIcon />, route: "applications" },
    { text: "Settings", icon: <SettingsIcon />, route: "settings" },
  ];

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH }}>
      <Box sx={{ height: 64 }} /> {/* Spacer for AppBar */}
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.route} disablePadding>
            <ListItemButton
              selected={currentRoute === item.route}
              onClick={() => handleItemClick(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </MuiDrawer>
    );
  }

  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
      }}
      open
    >
      {drawerContent}
    </MuiDrawer>
  );
};
