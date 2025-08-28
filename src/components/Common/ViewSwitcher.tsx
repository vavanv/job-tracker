import React from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Tooltip,
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewAgenda as CardViewIcon,
} from '@mui/icons-material';

export type ViewMode = 'card' | 'grid';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleChange}
        aria-label="view mode"
        size="small"
      >
        <ToggleButton value="card" aria-label="card view">
          <Tooltip title="Card View">
            <CardViewIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="grid" aria-label="grid view">
          <Tooltip title="Grid View">
            <GridViewIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};