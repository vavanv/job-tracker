import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getSetting, saveSetting } from "../utils/indexedDB";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from database on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await getSetting("theme");
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === "dark");
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    try {
      await saveSetting("theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: isDarkMode ? "#f48fb1" : "#dc004e",
      },
      background: {
        default: isDarkMode ? "#121212" : "#fafafa",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
    },
  });

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
