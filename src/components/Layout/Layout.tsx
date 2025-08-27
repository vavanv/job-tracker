import React, { useState } from "react";
import { Box, CssBaseline, useTheme, useMediaQuery } from "@mui/material";
import { AppBar } from "./AppBar";
import { Drawer } from "./Drawer";

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

const DRAWER_WIDTH = 240;

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleNavigate = (route: string) => {
    onNavigate(route);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar onMenuClick={handleDrawerToggle} />

      <Drawer
        open={isMobile ? mobileOpen : desktopOpen}
        onClose={() => isMobile ? setMobileOpen(false) : setDesktopOpen(false)}
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { md: desktopOpen ? `${DRAWER_WIDTH}px` : 0 },
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box sx={{ ...theme.mixins.toolbar }} />
        {children}
      </Box>
    </Box>
  );
};
