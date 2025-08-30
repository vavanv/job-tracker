import { useEffect } from "react";

interface SpeculationRules {
  prerender?: Array<{
    source: string;
    eagerness: string;
    urls?: string[];
  }>;
  prefetch?: Array<{
    source: string;
    urls: string[];
    eagerness: string;
  }>;
}

export const useSpeculationRules = (rules: SpeculationRules) => {
  useEffect(() => {
    // Check if speculation rules are supported
    if (!("speculationrules" in document.createElement("script"))) {
      console.warn("Speculation Rules API is not supported in this browser");
      return;
    }

    // Remove existing speculation rules script
    const existingScript = document.querySelector(
      'script[type="speculationrules"]'
    );
    if (existingScript) {
      document.head.removeChild(existingScript);
    }

    // Create new speculation rules script
    const script = document.createElement("script");
    script.type = "speculationrules";
    script.textContent = JSON.stringify(rules);

    // Add the script to the head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [rules]);
};

// Hook for dynamic route-based speculation rules
export const useDynamicSpeculationRules = (currentPath: string) => {
  const rules: SpeculationRules = {
    prefetch: [
      {
        source: "list",
        urls: getRelatedRoutes(currentPath),
        eagerness: "moderate",
      },
    ],
  };

  useSpeculationRules(rules);
};

// Helper function to get related routes based on current path
const getRelatedRoutes = (currentPath: string): string[] => {
  const allRoutes = ["/dashboard", "/applications", "/settings"];

  switch (currentPath) {
    case "/dashboard":
      return ["/applications", "/settings"];
    case "/applications":
      return ["/dashboard", "/settings"];
    case "/settings":
      return ["/dashboard", "/applications"];
    default:
      return allRoutes.filter((route) => route !== currentPath);
  }
};

// Hook for user behavior-based speculation rules
export const useBehavioralSpeculationRules = (userActions: string[]) => {
  const rules: SpeculationRules = {
    prefetch: [
      {
        source: "list",
        urls: predictNextRoutes(userActions),
        eagerness: "conservative",
      },
    ],
  };

  useSpeculationRules(rules);
};

// Simple prediction based on user actions
const predictNextRoutes = (actions: string[]): string[] => {
  const recentActions = actions.slice(-3); // Last 3 actions

  if (recentActions.includes("view_applications")) {
    return ["/applications"];
  }

  if (recentActions.includes("add_application")) {
    return ["/applications", "/dashboard"];
  }

  return ["/dashboard", "/applications"];
};
