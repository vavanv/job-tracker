import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
  Typography,
  Stack,
} from "@mui/material";
import { Description as DescriptionIcon } from "@mui/icons-material";
import type { Application, ApplicationFormData } from "../../types";
import { ApplicationStatus } from "../../types";

interface ApplicationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Application, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  application?: Application | null;
  loading?: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const initialFormData: ApplicationFormData = {
  companyName: "",
  companyWebsite: "",
  jobTitle: "",
  applicationDate: new Date().toISOString().split("T")[0],
  status: ApplicationStatus.APPLIED,
  notes: "",
  jobLink: "",
};

const normalizeUrl = (value: string): string => {
  if (!value) return "";
  try {
    // If value lacks protocol, prepend https://
    const hasProtocol = /^https?:\/\//i.test(value);
    const url = new URL(hasProtocol ? value : `https://${value}`);
    return url.toString();
  } catch {
    return value; // leave as-is; validation will surface
  }
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  open,
  onClose,
  onSubmit,
  application,
  loading = false,
}) => {
  const [formData, setFormData] =
    useState<ApplicationFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<ApplicationFormData>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (application) {
      setFormData({
        companyName: application.companyName,
        companyWebsite: application.companyWebsite || "",
        jobTitle: application.jobTitle,
        applicationDate: new Date(application.applicationDate)
          .toISOString()
          .split("T")[0],
        status: application.status,
        notes: application.notes || "",
        jobLink: application.jobLink || "",
      });
      setResumeFile(null);
      setCoverLetterFile(null);
      setFileError(null);
    } else {
      setFormData(initialFormData);
      setResumeFile(null);
      setCoverLetterFile(null);
      setFileError(null);
    }
    setErrors({});
  }, [application, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationFormData> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.applicationDate) {
      newErrors.applicationDate = "Application date is required";
    }

    // Company website: if provided, must be a valid URL after normalization
    if (formData.companyWebsite?.trim()) {
      const normalized = normalizeUrl(formData.companyWebsite.trim());
      try {
        new URL(normalized);
      } catch {
        newErrors.companyWebsite = "Enter a valid URL";
      }
    }

    setErrors(newErrors);

    if (resumeFile && !ACCEPTED_TYPES.includes(resumeFile.type)) {
      setFileError("Resume must be a PDF or Word document");
      return false;
    }
    if (coverLetterFile && !ACCEPTED_TYPES.includes(coverLetterFile.type)) {
      setFileError("Cover Letter must be a PDF or Word document");
      return false;
    }
    if (
      (resumeFile && resumeFile.size > MAX_FILE_SIZE) ||
      (coverLetterFile && coverLetterFile.size > MAX_FILE_SIZE)
    ) {
      setFileError("Files must be 10MB or smaller");
      return false;
    }

    setFileError(null);
    return Object.keys(newErrors).length === 0;
  };

  const downloadBlob = (blob: Blob, suggestedName?: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedName || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted with data:', formData);
    console.log('Is editing application:', !!application);

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      const payload: Omit<Application, "id" | "createdAt" | "updatedAt"> = {
        companyName: formData.companyName.trim(),
        companyWebsite: formData.companyWebsite?.trim()
          ? normalizeUrl(formData.companyWebsite.trim())
          : undefined,
        jobTitle: formData.jobTitle.trim(),
        applicationDate: new Date(formData.applicationDate),
        status: formData.status,
        notes: formData.notes.trim(),
        jobLink: formData.jobLink.trim(),
      };

      console.log('Payload before file processing:', payload);

      // Handle resume: use new file if uploaded, otherwise preserve existing
      if (resumeFile) {
        const resumeBlob = new Blob([await resumeFile.arrayBuffer()], {
          type: resumeFile.type,
        });
        payload.resumeBlob = resumeBlob;
        payload.resumeMeta = {
          fileName: resumeFile.name,
          mimeType: resumeFile.type,
          size: resumeFile.size,
          updatedAt: new Date(),
        };
      } else if (application?.resumeBlob) {
        // Preserve existing resume if no new file uploaded
        payload.resumeBlob = application.resumeBlob;
        payload.resumeMeta = application.resumeMeta;
      }

      // Handle cover letter: use new file if uploaded, otherwise preserve existing
      if (coverLetterFile) {
        const coverLetterBlob = new Blob(
          [await coverLetterFile.arrayBuffer()],
          { type: coverLetterFile.type }
        );
        payload.coverLetterBlob = coverLetterBlob;
        payload.coverLetterMeta = {
          fileName: coverLetterFile.name,
          mimeType: coverLetterFile.type,
          size: coverLetterFile.size,
          updatedAt: new Date(),
        };
      } else if (application?.coverLetterBlob) {
        // Preserve existing cover letter if no new file uploaded
        payload.coverLetterBlob = application.coverLetterBlob;
        payload.coverLetterMeta = application.coverLetterMeta;
      }

      console.log('Final payload being submitted:', payload);
      await onSubmit(payload);
      console.log('onSubmit completed successfully');

      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (
    field: keyof ApplicationFormData,
    value: string | ApplicationStatus
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const clearResume = () => setResumeFile(null);
  const clearCover = () => setCoverLetterFile(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {application ? "Edit Application" : "Add New Application"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              error={!!errors.companyName}
              helperText={errors.companyName}
              fullWidth
              required
            />

            <TextField
              label="Company Website (Optional)"
              value={formData.companyWebsite || ""}
              onChange={(e) => handleChange("companyWebsite", e.target.value)}
              error={!!errors.companyWebsite}
              helperText={errors.companyWebsite}
              fullWidth
              placeholder="https://example.com"
            />

            <TextField
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle}
              fullWidth
              required
            />

            <TextField
              label="Application Date"
              type="date"
              value={formData.applicationDate}
              onChange={(e) => handleChange("applicationDate", e.target.value)}
              error={!!errors.applicationDate}
              helperText={errors.applicationDate}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) =>
                  handleChange("status", e.target.value as ApplicationStatus)
                }
              >
                {Object.values(ApplicationStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Resume (PDF/DOC/DOCX)</Typography>
              <input
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              {resumeFile && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {resumeFile.name} ({Math.round(resumeFile.size / 1024)} KB)
                  </Typography>
                  <Button size="small" onClick={clearResume}>
                    Remove
                  </Button>
                </Stack>
              )}
              {!resumeFile && application?.resumeBlob && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DescriptionIcon />}
                  onClick={() =>
                    downloadBlob(
                      application.resumeBlob!,
                      application.resumeMeta?.fileName || "resume"
                    )
                  }
                >
                  RESUME
                </Button>
              )}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">
                Cover Letter (PDF/DOC/DOCX)
              </Typography>
              <input
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={(e) =>
                  setCoverLetterFile(e.target.files?.[0] || null)
                }
              />
              {coverLetterFile && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {coverLetterFile.name} (
                    {Math.round(coverLetterFile.size / 1024)} KB)
                  </Typography>
                  <Button size="small" onClick={clearCover}>
                    Remove
                  </Button>
                </Stack>
              )}
            </Stack>

            {fileError && <FormHelperText error>{fileError}</FormHelperText>}

            <TextField
              label="Job Link (Optional)"
              value={formData.jobLink}
              onChange={(e) => handleChange("jobLink", e.target.value)}
              fullWidth
              placeholder="https://..."
            />

            <TextField
              label="Notes (Optional)"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Add any additional notes..."
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : application ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
