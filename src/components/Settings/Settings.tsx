import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  styled,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import {
  exportApplicationsAsJSON,
  importApplicationsFromJSON,
} from "../../utils/indexedDB";
import { useTheme } from "../../contexts/ThemeContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface ImportResult {
  imported: number;
  errors: string[];
}

interface SettingsProps {
  onGenerateMockData?: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({
  onGenerateMockData,
  refresh,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [cleanSuccess, setCleanSuccess] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);

      const jsonData = await exportApplicationsAsJSON();

      // Create and download the file
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `job-applications-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("Export failed:", error);
      alert(
        `Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    setShowImportDialog(true);
    setImportResult(null);
    setImportError(null);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setImportError(null);
      setImportResult(null);

      const text = await file.text();
      const result = await importApplicationsFromJSON(text);

      setImportResult(result);

      // Refresh the applications list
      await refresh();
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsImporting(false);
      // Reset the file input
      event.target.value = "";
    }
  };

  const handleCloseImportDialog = () => {
    setShowImportDialog(false);
    setImportResult(null);
    setImportError(null);
  };

  const handleGenerateMockData = async () => {
    if (!onGenerateMockData) return;

    try {
      setIsGenerating(true);
      setGenerateSuccess(false);

      await onGenerateMockData();

      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    } catch (error) {
      console.error("Generate mock data failed:", error);
      alert(
        `Generate mock data failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCleanDataClick = async () => {
    try {
      setIsCleaning(true);
      setCleanSuccess(false);

      // Clear all applications from IndexedDB
      const { clearAllApplications } = await import("../../utils/indexedDB");
      await clearAllApplications();

      // Refresh the applications list
      await refresh();

      setCleanSuccess(true);
      setTimeout(() => setCleanSuccess(false), 3000);
    } catch (error) {
      console.error("Clean data failed:", error);
      alert(
        `Clean data failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Data Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Export your job applications to a JSON file for backup or transfer to
          another device. You can also import applications from a previously
          exported JSON file.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            startIcon={
              isExporting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
            onClick={handleExport}
            disabled={isExporting}
            sx={{ minWidth: 150 }}
            size="small"
          >
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleImportClick}
            disabled={isImporting}
            sx={{ minWidth: 150 }}
            size="small"
          >
            Import Data
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleCleanDataClick}
            disabled={isCleaning}
            sx={{ minWidth: 150 }}
            size="small"
          >
            {isCleaning ? "Cleaning..." : "Clean Data"}
          </Button>
        </Stack>

        {exportSuccess && (
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
            Data exported successfully! The file has been downloaded to your
            device.
          </Alert>
        )}

        {cleanSuccess && (
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
            All application data has been successfully cleared!
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary">
          <strong>Export format:</strong> JSON file containing all your job
          applications, including attachments (resume and cover letters) encoded
          as base64.
          <br />
          <strong>Import behavior:</strong> Existing applications with the same
          ID will be updated. New applications will be added.
        </Typography>
      </Card>

      {/* Theme Settings Section */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Appearance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize the appearance of the application.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isDarkMode ? (
            <DarkModeIcon sx={{ color: "text.secondary" }} />
          ) : (
            <LightModeIcon sx={{ color: "text.secondary" }} />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={isDarkMode ? "Dark Mode" : "Light Mode"}
          />
        </Box>
      </Card>

      {/* Sample Data Section */}
      {onGenerateMockData && (
        <Card
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Sample Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate sample job applications to test the application features.
          </Typography>

          <Button
            variant="contained"
            color="error"
            onClick={handleGenerateMockData}
            disabled={isGenerating}
            sx={{ minWidth: 200 }}
            size="small"
          >
            {isGenerating ? "Generating..." : "Add 50 More Sample Applications"}
          </Button>

          {generateSuccess && (
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
              50 sample applications have been successfully added!
            </Alert>
          )}
        </Card>
      )}

      {/* Import Dialog */}
      <Dialog
        open={showImportDialog}
        onClose={handleCloseImportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Job Applications</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a JSON file exported from this application to import your job
            applications. This will merge the imported data with your existing
            applications.
          </Typography>

          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
            <strong>Important:</strong> This action will modify your existing
            data. Consider exporting your current data as a backup before
            importing.
          </Alert>

          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            size="small"
            sx={{ justifyContent: "flex-start", mb: 2 }}
            disabled={isImporting}
          >
            UPLOAD
            <VisuallyHiddenInput
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
            />
          </Button>

          {isImporting && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Importing applications...</Typography>
            </Box>
          )}

          {importError && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
              <strong>Import failed:</strong> {importError}
            </Alert>
          )}

          {importResult && (
            <Alert
              severity={importResult.errors.length > 0 ? "warning" : "success"}
              sx={{ mb: 2 }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Import completed:</strong> {importResult.imported}{" "}
                applications imported successfully.
              </Typography>

              {importResult.errors.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>
                      {importResult.errors.length} errors occurred:
                    </strong>
                  </Typography>
                  <List dense>
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText
                          primary={error}
                          primaryTypographyProps={{
                            variant: "body2",
                            color: "text.secondary",
                          }}
                        />
                      </ListItem>
                    ))}
                    {importResult.errors.length > 5 && (
                      <ListItem sx={{ py: 0 }}>
                        <ListItemText
                          primary={`... and ${
                            importResult.errors.length - 5
                          } more errors`}
                          primaryTypographyProps={{
                            variant: "body2",
                            color: "text.secondary",
                            fontStyle: "italic",
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                </>
              )}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog} size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
