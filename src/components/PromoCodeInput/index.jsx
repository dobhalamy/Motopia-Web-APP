import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import CustomInput from 'components/shared/CustomInput';
import { getCookie, setCookie } from 'src/utils/cookie';
import { Promotion, Prospect } from 'src/api';

const useStyles = makeStyles(() => ({
  labelInput: {
    margin: 0,
  },
  applyButton: {
    height: '100%',
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  disabledInput: {
    color: alpha('#30b500', 0.5),
  },
}));

const PromoCodeInput = ({ source, setDiscount }) => {
  const classes = useStyles();
  const [promoCode, setPromoCode] = useState('');
  const [isPromoValid, setPromoValid] = useState(false);
  const [isPromoChecked, setPromoChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    const { value } = target;
    setPromoCode(value);
    setPromoValid(false);
  };

  const checkPromoCode = async promo => {
    setLoading(true);
    try {
      const prospectId = getCookie('prospectId');
      const cookiePromoCode = getCookie('promoCode');
      const pickUpInfo = getCookie('pickupInfo');
      const PickUpSource = pickUpInfo.split('"')[3];
      const prospectData = await Prospect.GetProspect(prospectId);
      const promoPara = {
        prospectId,
        promoCode: promo,
        contactNumber: prospectData.contactNumber,
        firstName: prospectData.firstName,
        lastName: prospectData.lastName,
        PickUpSource,
      };
      const checkPromoRequest = await Promotion.checkPromoCode(promoPara);
      setPromoChecked(true);
      if (checkPromoRequest.status === 'success') {
        setLoading(false);
        const {
          applyCode,
          code,
          saleDiscount,
          rentDiscount,
        } = checkPromoRequest.data;
        if (source === 'RDS') {
          setDiscount(rentDiscount);
        } else {
          setDiscount(saleDiscount);
        }

        if (applyCode) {
          setPromoValid(true);

          if (!cookiePromoCode) {
            setCookie('promoCode', code);
          }
        }
      }
    } catch (error) {
      setPromoValid(false);
    }
  };

  useEffect(() => {
    (async () => {
      const cookiePromoCode = getCookie('promoCode');
      if (cookiePromoCode) {
        setPromoCode(cookiePromoCode);
        await checkPromoCode(cookiePromoCode);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomInput
      id="promo-code"
      label="Promo Code"
      value={promoCode}
      disabled={isPromoChecked && isPromoValid}
      hasError={isPromoChecked && !isPromoValid}
      errorMessage="The Promo Code is not accepted."
      fullWidth
      height="auto"
      onChange={handleChange}
      InputLabelProps={{
        classes: {
          root: classes.labelInput,
        },
      }}
      InputProps={{
        classes: {
          disabled: classes.disabledInput,
        },
        endAdornment: (
          <div className={classes.applyButton}>
            <Button
              className={classes.applyButton}
              disabled={isPromoChecked && isPromoValid}
              style={{
                border: 'none',
                color: isPromoValid ? '#30b500' : '#001C5E',
              }}
              onClick={() => checkPromoCode(promoCode)}
            >
              {isPromoValid ? 'Applied' : 'Apply'}
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        ),
      }}
    />
  );
};

PromoCodeInput.propTypes = {
  source: PropTypes.string.isRequired,
  setDiscount: PropTypes.func.isRequired,
};

export default PromoCodeInput;
