import React from "react";
import { Box, Container, useTheme } from "@mui/material";
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
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Tab Navigation */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <TabNavigation currentRoute={currentRoute} onNavigate={onNavigate} />

        {/* Main Content */}
        <Box component="main">{children}</Box>
      </Container>
    </Box>
  );
};
