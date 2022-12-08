import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { UilEllipsisH } from '@iconscout/react-unicons';

function DetailsDropdown(props) {
  const { clickedElement, onUpdatingElementClick, onDeletingElementClick, onDetailClick } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleUpdateClick() {
    handleClose();
    if (onUpdatingElementClick) onUpdatingElementClick(clickedElement);
  }

  function handleDeleteClick() {
    handleClose();
    if (onDeletingElementClick) onDeletingElementClick(clickedElement);
  }

  function handleDetailClick() {
    handleClose();
    if (onDetailClick) onDetailClick(clickedElement);
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <UilEllipsisH />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {onDetailClick && <MenuItem onClick={handleDetailClick}>Details</MenuItem>}
        <MenuItem onClick={handleUpdateClick}>Update</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default DetailsDropdown;