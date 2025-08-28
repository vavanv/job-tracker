import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Link,
  Box,
  Card,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  FileCopy as DuplicateIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Launch as LaunchIcon,
} from "@mui/icons-material";
import type { Application } from "../../types";
import { StatusBadge } from "./StatusBadge";

interface ApplicationGridViewProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (application: Application) => Promise<string>;
}

export const ApplicationGridView: React.FC<ApplicationGridViewProps> = ({
  applications,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [gridHeight, setGridHeight] = useState<number>(600);

  useEffect(() => {
    const calculateHeight = () => {
      // Calculate available height: window height minus header, navigation, padding, etc.
      // Assuming roughly 200px for header/navigation and 100px for padding/margins
      const availableHeight = window.innerHeight - 300;
      // Minimum height of 400px, maximum based on available space
      const newHeight = Math.max(
        400,
        Math.min(availableHeight, window.innerHeight * 0.7)
      );
      setGridHeight(newHeight);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    application: Application
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedApplication(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApplication(null);
  };

  const handleEdit = () => {
    if (selectedApplication) {
      onEdit(selectedApplication);
    }
    handleMenuClose();
  };

  const handleDuplicate = async () => {
    if (selectedApplication) {
      await onDuplicate(selectedApplication);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedApplication) {
      await onDelete(selectedApplication.id);
    }
    handleMenuClose();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const columns: GridColDef[] = [
    {
      field: "companyName",
      headerName: "Company",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon color="action" fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {params.value}
            </Typography>
            {params.row.companyWebsite && (
              <Link
                href={params.row.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.75rem",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Website
                <LaunchIcon sx={{ fontSize: "0.75rem" }} />
              </Link>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: "jobTitle",
      headerName: "Job Title",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          {params.row.jobLink && (
            <Link
              href={params.row.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.75rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Job Link
              <LaunchIcon sx={{ fontSize: "0.75rem" }} />
            </Link>
          )}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <StatusBadge status={params.value} size="small" />
      ),
    },
    {
      field: "applicationDate",
      headerName: "Applied Date",
      width: 130,
      valueFormatter: (params: any) => formatDate(params.value),
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      width: 130,
      valueFormatter: (params: any) => formatDate(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row as Application)}
          aria-label="more options"
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        p: 2,
      }}
    >
      <Box sx={{ height: gridHeight, width: "100%" }}>
        <DataGrid
          rows={applications}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              border: "none",
            },
            "& .MuiDataGrid-root": {
              border: "none",
            },
            border: "none",
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <DuplicateIcon sx={{ mr: 1 }} fontSize="small" />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};
