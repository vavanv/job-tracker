import { useState } from "react";
import { CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { ApplicationList } from "./components/Applications/ApplicationList";
import { ApplicationForm } from "./components/Applications/ApplicationForm";
import { Settings } from "./components/Settings";
import type { Application } from "./types";
import { useApplications } from "./hooks/useApplications";
import { generateMockApplications } from "./utils/mockData";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { useDynamicSpeculationRules } from "./hooks/useSpeculationRules";

function AppContent() {
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply dynamic speculation rules based on current route
  useDynamicSpeculationRules(location.pathname);

  const {
    applications,
    loading,
    error,
    filters,
    addApplication,
    updateApplication,
    deleteApplication,
    duplicateApplication,
    updateFilters,
    getStats,
    refresh,
  } = useApplications();

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
    console.log("handleFormSubmit called with data:", data);
    console.log("editingApplication:", editingApplication);

    setIsSubmitting(true);
    try {
      if (editingApplication) {
        console.log(
          "Calling updateApplication with ID:",
          editingApplication.id
        );
        await updateApplication(editingApplication.id, data);
        console.log("updateApplication completed");
      } else {
        console.log("Calling addApplication");
        await addApplication(data);
        console.log("addApplication completed");
      }
      handleFormClose();
    } catch (error) {
      console.error("Failed to save application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateMockData = async () => {
    try {
      const mockApplications = generateMockApplications(50);
      console.log("🎯 Generating 50 mock applications...");

      for (const mockApp of mockApplications) {
        await addApplication(mockApp);
      }

      console.log("✅ Mock data generated successfully!");
    } catch (error) {
      console.error("❌ Failed to generate mock data:", error);
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard
                stats={getStats()}
                loading={loading}
                onAddClick={handleAddClick}
              />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard
                stats={getStats()}
                loading={loading}
                onAddClick={handleAddClick}
              />
            </Layout>
          }
        />
        <Route
          path="/applications"
          element={
            <Layout>
              <ApplicationList
                applications={applications}
                loading={loading}
                error={error}
                filters={filters}
                onEdit={handleEditApplication}
                onDelete={deleteApplication}
                onDuplicate={duplicateApplication}
                onUpdateFilters={updateFilters}
                onAddClick={handleAddClick}
              />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings
                onGenerateMockData={handleGenerateMockData}
                refresh={refresh}
              />
            </Layout>
          }
        />
      </Routes>

      <ApplicationForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        application={editingApplication}
        loading={isSubmitting}
      />
    </>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
