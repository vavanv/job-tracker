import React from "react";
import { Box, CssBaseline, Container, Typography } from "@mui/material";
import { TabNavigation } from "../Common/TabNavigation";

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentRoute,
  onNavigate,
}) => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <CssBaseline />

      {/* Tab Navigation */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <TabNavigation currentRoute={currentRoute} onNavigate={onNavigate} />

        {/* Main Content */}
        <Box component="main">{children}</Box>
      </Container>
    </Box>
  );
};
