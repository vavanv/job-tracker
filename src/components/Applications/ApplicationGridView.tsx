import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Link,
  Box,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  FileCopy as DuplicateIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import type { Application } from '../../types';
import { StatusBadge } from './StatusBadge';

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedApplication, setSelectedApplication] = React.useState<Application | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, application: Application) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary?: string) => {
    if (!salary) return '-';
    return salary;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="applications table">
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Updated Date</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((application) => (
            <TableRow
              key={application.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {application.companyName}
                    </Typography>
                    {application.companyWebsite && (
                      <Link
                        href={application.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}
                      >
                        Website
                        <LaunchIcon sx={{ fontSize: '0.75rem' }} />
                      </Link>
                    )}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {application.jobTitle}
                </Typography>
                {application.jobLink && (
                  <Link
                    href={application.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}
                  >
                    Job Link
                    <LaunchIcon sx={{ fontSize: '0.75rem' }} />
                  </Link>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={application.status} size="small" />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(application.applicationDate)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(application.updatedAt)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatSalary(application.salary)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {application.contactPerson || '-'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, application)}
                  aria-label="more options"
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
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
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </TableContainer>
  );
};