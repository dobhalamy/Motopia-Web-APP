import React from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  ButtonGroup,
  Button,
  Typography,
  Grid,
} from '@material-ui/core';

const LocationModal = props => {
  const { open, pickupPoints, handleClose, handlePickLocation } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Choose Pickup Location</DialogTitle>
      <DialogContent style={{ paddingBottom: 20 }}>
        <ButtonGroup
          fullWidth
          orientation="vertical"
          style={{ flexDirection: 'column' }}
        >
          {pickupPoints.map(el => {
            const {
              locationName,
              address,
              city,
              state,
              zipcode } = el;
            const addressArr = address.split(' ');
            const addressNum = addressArr.shift();
            const addressSt = addressArr.map(str =>
              str[0].toUpperCase() + str.slice(1).toLowerCase()).join(' ');
            const lowerCity = city[0].toUpperCase() + city.slice(1).toLowerCase();
            return (
              <Button
                onClick={() => handlePickLocation(el)}
                key={locationName}
                variant="text"
                style={{ textTransform: 'none' }}
              >
                <Grid item xs={6}>
                  <Typography color="secondary" align="left" style={{ fontWeight: 600 }}>
                    {locationName}
                  </Typography>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                  <Typography align="right" style={{ fontWeight: 600 }}>
                    {addressNum}{' '}{addressSt}{', '}{lowerCity}{' '}{state}{' '}{zipcode}
                  </Typography>
                </Grid>
              </Button>
            );
          })}
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
};

LocationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  handlePickLocation: PropTypes.func.isRequired,
};

export default LocationModal;
