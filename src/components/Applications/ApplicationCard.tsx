import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  Language as LanguageIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as DuplicateIcon,
} from "@mui/icons-material";
import type { Application } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "../Common/ConfirmDialog";

interface ApplicationCardProps {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (application: Application) => void;
}

const withProtocol = (value?: string) => {
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuEdit = () => {
    handleMenuClose();
    onEdit(application);
  };

  const handleMenuDuplicate = () => {
    handleMenuClose();
    if (onDuplicate) {
      onDuplicate(application.id);
    }
  };

  const handleMenuDelete = () => {
    handleMenuClose();
    setShowDeleteDialog(true);
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
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 280,
        width: "100%",
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, mr: 1 }}>
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
                wordBreak: "break-word",
              }}
            >
              {application.jobTitle}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StatusBadge status={application.status} />
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ p: 0.5 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="subtitle1" color="primary" gutterBottom>
          {application.companyName}
        </Typography>



        {application.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {application.notes}
          </Typography>
        )}

        <Stack direction="column" spacing={1} sx={{ mb: 1, alignItems: "flex-start" }}>
          {application.jobLink && (
            <Button
              startIcon={<LaunchIcon />}
              onClick={handleJobLink}
              size="small"
              sx={{ justifyContent: "flex-start" }}
            >
              View Job Posting
            </Button>
          )}
          {websiteHref && (
            <Button
              startIcon={<LanguageIcon />}
              size="small"
              sx={{ justifyContent: "flex-start" }}
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

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleMenuEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {onDuplicate && (
          <MenuItem onClick={handleMenuDuplicate}>
            <ListItemIcon>
              <DuplicateIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <CardActions sx={{ p: 2, pt: 0, display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Applied: {formatDate(application.applicationDate)}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
        >
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
