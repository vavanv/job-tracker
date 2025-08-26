import React, { useState } from "react";
import { Box, CssBaseline, useTheme, useMediaQuery } from "@mui/material";
import { AppBar } from "./AppBar";
import { Drawer } from "./Drawer";

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onAddClick: () => void;
}

const DRAWER_WIDTH = 240;

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
  onAddClick,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (route: string) => {
    onNavigate(route);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar onMenuClick={handleDrawerToggle} onAddClick={onAddClick} />

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Box sx={{ ...theme.mixins.toolbar }} />
        {children}
      </Box>
    </Box>
  );
};
