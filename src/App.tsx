import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Layout } from "./components/Layout/Layout";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { ApplicationList } from "./components/Applications/ApplicationList";
import { ApplicationForm } from "./components/Applications/ApplicationForm";
import { Settings } from "./components/Settings";
import type { Application } from "./types";
import { useApplications } from "./hooks/useApplications";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#fafafa",
        },
      },
    },
  },
});

function App() {
  const [currentRoute, setCurrentRoute] = useState("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    applications,
    loading,
    error,
    filters,
    addApplication,
    updateApplication,
    deleteApplication,
    updateFilters,
    getStats,
  } = useApplications();

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
  };

  const handleAddClick = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingApplication(null);
  };

  const handleFormSubmit = async (
    data: Omit<Application, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log('handleFormSubmit called with data:', data);
    console.log('editingApplication:', editingApplication);
    
    setIsSubmitting(true);
    try {
      if (editingApplication) {
        console.log('Calling updateApplication with ID:', editingApplication.id);
        await updateApplication(editingApplication.id, data);
        console.log('updateApplication completed');
      } else {
        console.log('Calling addApplication');
        await addApplication(data);
        console.log('addApplication completed');
      }
      handleFormClose();
    } catch (error) {
      console.error("Failed to save application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (currentRoute) {
      case "dashboard":
        return <Dashboard stats={getStats()} loading={loading} onAddClick={handleAddClick} />;
      case "applications":
        return (
          <ApplicationList 
            applications={applications}
            loading={loading}
            error={error}
            filters={filters}
            onEdit={handleEditApplication}
            onDelete={deleteApplication}
            onUpdateFilters={updateFilters}
            onAddClick={handleAddClick}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return (
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to Job Application Tracker</p>
          </div>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      >
        {renderContent()}
      </Layout>

      <ApplicationForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        application={editingApplication}
        loading={isSubmitting}
      />
    </ThemeProvider>
  );
}

export default App;
