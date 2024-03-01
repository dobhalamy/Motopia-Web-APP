import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';

import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';

import { SORT_PARAMETERS } from './constants';

export default function SortButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchorRef = useRef(null);

  const handleOpenSortMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleCloseSortMenu = (sortParameter) => () => {
    setAnchorEl(null);
    props.handleSortVehicles(sortParameter);
  };

  const isSortMenuOpen = Boolean(anchorEl);
  const id = isSortMenuOpen ? 'sort-menu' : null;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="text"
        color="default"
        onClick={handleOpenSortMenu}
        ref={anchorRef}
      >
        {props.vehiclesAreSortedBy} <ArrowDownIcon />
      </Button>
      <Popper
        style={{ zIndex: 1000 }}
        open={Boolean(anchorEl)}
        anchorEl={anchorRef.current}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={Boolean(anchorEl)} id="menu-list-grow">
                  {SORT_PARAMETERS.map(parameter => (
                    <MenuItem key={parameter} onClick={handleCloseSortMenu(parameter)}>
                      <Typography variant="button">{parameter}</Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

SortButton.propTypes = {
  handleSortVehicles: PropTypes.func.isRequired,
  vehiclesAreSortedBy: PropTypes.string.isRequired,
};
