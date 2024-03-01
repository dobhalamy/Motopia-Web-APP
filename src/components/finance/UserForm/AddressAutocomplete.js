import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import CustomInput from 'components/shared/CustomInput';
import { BORDER_COLOR } from 'src/constants';

const useStyles = makeStyles(theme => ({
  suggestionActive: {
    color: theme.palette.common.white,
    background: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  suggestionInactive: {
    background: theme.palette.common.white,
  },
  googleSuggestionListContainer: {
    position: 'absolute',
    background: theme.palette.common.white,
    zIndex: 1000,
    maxWidth: 900,
    border: `2px solid ${BORDER_COLOR}`,
    borderRadius: 5,
    padding: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 600,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 330,
    },
  },
}));

export default function AddressAutoComplete(props) {
  const classes = useStyles();
  const [address, setAddress] = React.useState('');

  React.useEffect(() => {
    setAddress(props.value);
  }, [props.value]);

  const handleSelect = async (addressValue, placeId) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    function detailsCallback(place, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const retrieveAddressDetails = place.address_components.reduce(
          (prevDetails, detail) => {
            if (detail.types.includes('administrative_area_level_1')) {
              return { ...prevDetails, state: detail.short_name };
            }
            if (
              detail.types.includes('locality') ||
              detail.types.includes('sublocality')
            ) {
              return { ...prevDetails, city: detail.long_name };
            }
            if (detail.types.includes('postal_code')) {
              return { ...prevDetails, homeZip: detail.long_name };
            }
            return prevDetails;
          },
          {}
        );
        setAddress(place.name);

        props.handleAddressData({
          ...retrieveAddressDetails,
          address: place.name,
        });
      }
    }
    service.getDetails({ placeId }, detailsCallback);
  };

  const handleChangeFormik = addressData => {
    setAddress(addressData);
    props.handleChangeAddress(props.name, addressData, true);
  };

  return (
    <Grid item xs={12} md={6}>
      <PlacesAutocomplete
        value={address}
        onChange={handleChangeFormik}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <CustomInput
              fullWidth
              label={props.label}
              name={props.name}
              hasError={props.hasError}
              errorMessage={props.errorMessage}
              onBlur={props.onBlur}
              onChange={handleChangeFormik}
              value={props.value}
              {...getInputProps()}
              disabled={props.disabled}
            />
            {suggestions.length > 0 && (
              <Grid
                container
                direction="column"
                className={classes.googleSuggestionListContainer}
              >
                {loading ? <div>...loading</div> : null}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? classes.suggestionActive
                    : classes.suggestionInactive;
                  return (
                    <div
                      key={`index-${suggestion.placeId}`}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </Grid>
            )}
          </>
        )}
      </PlacesAutocomplete>
    </Grid>
  );
}

AddressAutoComplete.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hasError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  handleChangeAddress: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  handleAddressData: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

AddressAutoComplete.defaultProps = {
  errorMessage: '',
  disabled: false,
};
