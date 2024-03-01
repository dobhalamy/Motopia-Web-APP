import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import { RIDE_SHARE_STEP_1 } from 'src/constants';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomHint from '../CustomComponents/CustomHint';

const useStyles = makeStyles(theme => ({
  licenseApprovalContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  licenseApprovalTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  licenseApprovalWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
  },
  licenseApprovalContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  licenseApprovalBlueBox: {
    padding: 0,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: theme.palette.secondary.main,
    margin: `${theme.spacing(6)}px auto`,
  },
  licenseApprovalBlueBoxContent: {
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  licenseApprovalBlueBoxContentBorder: {
    borderRight: '2px solid #27385f',
    [theme.breakpoints.only('xs')]: {
      borderRight: 'none',
      borderBottom: '2px solid #27385f',
    },
  },
  licenseApprovalLightGrayColor: {
    color: '#a0a0a0',
  },
}));

const LicenseApprovalForm = props => {
  const [activeHint, setActiveHint] = React.useState(null);
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const hintRef = React.useRef();

  const handleCloseHint = () => setActiveHint(null);

  React.useEffect(() => {
    if (activeHint) {
      hintRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, [activeHint]);

  const handleActiveHint = id =>
    setActiveHint(props.financePins
      .find(item => item.page === RIDE_SHARE_STEP_1 && item.number === id));

  return (
    <Container maxWidth="md" className={classes.licenseApprovalContainer}>
      <Typography variant="h4" align="center" className={classes.licenseApprovalTitle}>
        LICENSE APPROVAL
      </Typography>
      <Box className={classes.licenseApprovalWrapper} boxShadow={6}>
        <Box className={classes.licenseApprovalContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box marginBottom={1.5}>
                <Typography variant="body1" component="span" color="secondary">
                  NY Plate
                </Typography>
                <Typography variant="body1" component="span">
                  – Commercial
                </Typography>
              </Box>
              {!matches ? (
                <Badge
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleActiveHint(1)}
                  color="error"
                  badgeContent="1"
                >
                  <Typography
                    variant="body1"
                    component="span"
                  >
                    Approved program:
                  </Typography>
                  <Typography
                    variant="body1"
                    component="span"
                    color="secondary"
                  >
                    Rent-to-Own – Tier 2
                  </Typography>
                </Badge>
              ) : (
                <>
                  <Typography variant="body1">Approved program:</Typography>
                  <Badge
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleActiveHint(1)}
                    color="error"
                    badgeContent="1"
                  >
                    <Typography
                      variant="body1"
                      color="secondary"
                    >
                      Rent-to-Own – Tier 2
                    </Typography>
                  </Badge>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box marginBottom={1.5}>
                <Typography align={!matches ? 'right' : 'left'} variant="body1">
                  2018 CHEVROLET TRAVERSE
                </Typography>
              </Box>
              <Typography
                align={!matches ? 'right' : 'left'}
                variant="body2"
                className={classes.licenseApprovalLightGrayColor}
              >
                High Country
              </Typography>
            </Grid>
          </Grid>
          <Container maxWidth="sm" className={classes.licenseApprovalBlueBox}>
            <Grid container justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Box
                  className={classNames(
                    classes.licenseApprovalBlueBoxContent,
                    classes.licenseApprovalBlueBoxContentBorder
                  )}
                >
                  <Badge
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleActiveHint(2)}
                    color="error"
                    badgeContent="2"
                  >
                    <Typography
                      variant="body1"
                      align="center"
                      color="inherit"
                      gutterBottom
                    >
                      Initial Down
                    </Typography>
                  </Badge>
                  <Typography variant="h4" align="center" color="inherit">
                    $2,000
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className={classes.licenseApprovalBlueBoxContent}>
                  <Badge
                    onClick={() => handleActiveHint(3)}
                    style={{ cursor: 'pointer' }}
                    color="error"
                    badgeContent="3"
                  >
                    <Typography
                      variant="body1"
                      align="center"
                      color="inherit"
                      gutterBottom
                    >
                      Weekly Payment
                    </Typography>
                  </Badge>
                  <Typography variant="h4" align="center" color="inherit">
                    $290
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
          {/* NOTE: Uncomment if need some Disclaimer here */}
          {/* <Typography
            variant="body1"
            align="center"
            className={classes.licenseApprovalLightGrayColor}
          >
            Disclaimer: Lorem ipsum dolor sit amet, consectetur adipisici
          </Typography> */}
        </Box>
        <CustomPrimaryButton withIcon isLarge={!matches} fullWidth onClick={props.handleNextForm}>
          Reserve my car
        </CustomPrimaryButton>
      </Box>
      <div ref={hintRef}>
        {activeHint &&
        <CustomHint activeHint={activeHint} handleCloseHint={handleCloseHint} />}
      </div>
    </Container>
  );
};

LicenseApprovalForm.propTypes = {
  handleNextForm: PropTypes.func.isRequired,
  financePins: PropTypes.array,
};

LicenseApprovalForm.defaultProps = {
  financePins: []
};

export default LicenseApprovalForm;
