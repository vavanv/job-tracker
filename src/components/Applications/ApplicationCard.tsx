import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  Download as DownloadIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import type { Application } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "../Common/ConfirmDialog";

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

const withProtocol = (value?: string) => {
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleEdit = () => {
    onEdit(application);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(application.id);
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleJobLink = () => {
    if (application.jobLink) {
      window.open(application.jobLink, "_blank");
    }
  };

  const downloadBlob = (blob?: Blob, suggestedName?: string) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedName || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const websiteHref = withProtocol(application.companyWebsite);

  return (
    <Card sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      width: 320,
      minWidth: 320,
      maxWidth: 320
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
              minHeight: "2.6em",
              wordBreak: "break-word"
            }}
          >
            {application.jobTitle}
          </Typography>
          <StatusBadge status={application.status} />
        </Box>

        <Typography variant="subtitle1" color="primary" gutterBottom>
          {application.companyName}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            Applied: {formatDate(application.applicationDate)}
          </Typography>
        </Box>

        {application.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {application.notes}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 1 }}>
          {application.jobLink && (
            <Button
              startIcon={<LaunchIcon />}
              onClick={handleJobLink}
              size="small"
              sx={{ mb: 1 }}
            >
              View Job Posting
            </Button>
          )}
          {websiteHref && (
            <Button
              startIcon={<LanguageIcon />}
              size="small"
              sx={{ mb: 1 }}
              onClick={() => window.open(websiteHref, "_blank")}
            >
              Company Website
            </Button>
          )}
        </Stack>

        {(application.resumeBlob || application.coverLetterBlob) && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {application.resumeBlob && (
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
                Resume
              </Button>
            )}
            {application.coverLetterBlob && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArticleIcon />}
                onClick={() =>
                  downloadBlob(
                    application.coverLetterBlob!,
                    application.coverLetterMeta?.fileName || "cover-letter"
                  )
                }
              >
                Cover Letter
              </Button>
            )}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ flexDirection: "column", alignItems: "stretch", p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
            size="small"
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            size="small"
          >
            Delete
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "left" }}>
          Updated: {formatDate(application.updatedAt)}
        </Typography>
      </CardActions>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Application"
        message={`Are you sure you want to delete the application for ${application.jobTitle} at ${application.companyName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Card>
  );
};
