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
  styled,
} from "@mui/material";
import { useApplications } from "../../hooks/useApplications";
import { Description as DescriptionIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'resume' | 'coverLetter' | null>(null);
  
  const { updateApplication } = useApplications();

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

  const handleDeleteClick = (type: 'resume' | 'coverLetter') => {
    setDeleteType(type);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!application || !deleteType) return;

    try {
      const updates: Partial<Application> = {};
      
      if (deleteType === 'resume') {
        updates.resumeBlob = null;
        updates.resumeMeta = null;
      } else if (deleteType === 'coverLetter') {
        updates.coverLetterBlob = null;
        updates.coverLetterMeta = null;
      }

      await updateApplication(application.id, updates);
      
      // Update the local application object to reflect the changes
      if (deleteType === 'resume') {
        application.resumeBlob = null;
        application.resumeMeta = null;
      } else if (deleteType === 'coverLetter') {
        application.coverLetterBlob = null;
        application.coverLetterMeta = null;
      }
      
      setDeleteConfirmOpen(false);
      setDeleteType(null);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteType(null);
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
    <>
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
              size="small"
            />

            <TextField
              label="Company Website (Optional)"
              value={formData.companyWebsite || ""}
              onChange={(e) => handleChange("companyWebsite", e.target.value)}
              error={!!errors.companyWebsite}
              helperText={errors.companyWebsite}
              fullWidth
              placeholder="https://example.com"
              size="small"
            />

            <TextField
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle}
              fullWidth
              required
              size="small"
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
              size="small"
            />

            <FormControl fullWidth size="small">
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
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  UPLOAD
                  <VisuallyHiddenInput
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  />
                </Button>
                {!resumeFile && application?.resumeBlob && (
                  <>
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
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick('resume')}
                    >
                      DELETE
                    </Button>
                  </>
                )}
              </Box>
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
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">
                Cover Letter (PDF/DOC/DOCX)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  UPLOAD
                  <VisuallyHiddenInput
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={(e) =>
                      setCoverLetterFile(e.target.files?.[0] || null)
                    }
                  />
                </Button>
                {!coverLetterFile && application?.coverLetterBlob && (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DescriptionIcon />}
                      onClick={() =>
                        downloadBlob(
                          application.coverLetterBlob!,
                          application.coverLetterMeta?.fileName || "cover-letter"
                        )
                      }
                    >
                      COVER LETTER
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick('coverLetter')}
                    >
                      DELETE
                    </Button>
                  </>
                )}
              </Box>
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
              size="small"
            />

            <TextField
              label="Notes (Optional)"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Add any additional notes..."
              size="small"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading} size="small">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading} size="small">
            {loading ? "Saving..." : application ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    
    {/* Delete Confirmation Dialog */}
    <Dialog
      open={deleteConfirmOpen}
      onClose={handleDeleteCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Typography id="delete-dialog-description">
          Are you sure you want to delete the {deleteType === 'resume' ? 'resume' : 'cover letter'} file? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};
