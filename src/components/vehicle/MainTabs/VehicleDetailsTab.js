import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import CarfaxIcon from 'src/assets/carfax.jpg';

import InformationTabs from 'components/vehicle/InformationTabs';
import { formatMoneyAmount, formatNumber } from 'utils/formatNumbersToLocale';
import { BORDER_COLOR, LIGHT_GRAY_BACKGROUND } from 'src/constants';
import FeaturesTab from '../VehicleTabs/FeaturesTab';
import InstalledTab from '../VehicleTabs/InstalledTab';
import DetailedTab from '../VehicleTabs/DetailedTab';
import {
  SUMMARY_FIELDS,
  VEHICLE_CONTENT_WIDTH,
} from '../constants';

const useStyles = makeStyles(theme => ({
  tabTitle: {
    fontSize: theme.typography.pxToRem(28),
    textTransform: 'uppercase',
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(26),
      textAlign: 'center',
    },
  },
  summaryWrapper: {
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  summaryItemsContainer: {
    height: 320,
    maxWidth: VEHICLE_CONTENT_WIDTH,
    flexDirection: 'initial',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      marginTop: theme.spacing(2),
    },
  },
  summaryItem: {
    background: LIGHT_GRAY_BACKGROUND,
    maxWidth: 435,
    height: 50,
    margin: theme.spacing(0.275),
    paddingLeft: theme.spacing(2),
  },
  summaryItemTitle: {
    width: 155,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.fontSize,
      width: 130,
    },
  },
  summaryItemValue: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.fontSize,
    },
  },
  visibilityIcon: {
    color: BORDER_COLOR,
    marginLeft: theme.spacing(2),
  },
  featuresWrapper: {
    marginTop: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  featuresContainer: {
    maxWidth: VEHICLE_CONTENT_WIDTH,
    alignItems: 'felx-end '
  },
  featureItemsContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px 0px`,
    },
  },
  vehicleDetailsContainer: {
    flexGrow: 1,
    maxWidth: 1200,
    margin: 'auto',
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  rightWrap: {
    alignItems: 'flex-end',
    width: '100%'
  },
  carfaxLink: {
    cursor: 'pointer',
  }
}));

export default function VehicleDetails(props) {
  const classes = useStyles();
  const [tab, setActiveTab] = React.useState(0);

  const handleTab = (event, activeTab) => {
    setActiveTab(activeTab);
  };

  const vehicleInformation = {
    ...props.vehicleInformation,
    driveType: props.vehicleInformation.drivetrain || 'No information',
    transmission: 'Automatic',
  };

  const {
    features,
    installedPossibleFeatures,
    carfax } = props.vehicleInformation.features;
  const { chromeFeatures } = props.vehicleInformation;
  const { eBrochureLink } = props.vehicleInformation;
  const { highlights } = carfax;

  const renderSummaryValue = data => (
    <>
      {data.title.includes('Color:')
        ?
          <Typography className={classes.summaryItemValue} variant="body1">
            {`${
              data.title === 'Ext. Color:'
                ? vehicleInformation.oemExt || vehicleInformation.exteriorColor
                : vehicleInformation.oemInt || vehicleInformation.interiorColor}`}
          </Typography>
        :
          <>
            {data.title.includes('Carfax Report:')
              ?
                <Link href={vehicleInformation.carfaxReport}>
                  <a target="_blank">
                    <img src={CarfaxIcon} alt="carfax" width="160" className={classes.carfaxLink}/>
                  </a>
                </Link>
              :
                <>
                  {data.title.includes('Carfax Highlights:')
                    ?
                      <Typography className={classes.summaryItemValue} variant="body1">
                        {highlights || ''}
                      </Typography>
                    :
                      <Typography className={classes.summaryItemValue} variant="body1">
                        {`${
                          data.withNumberFormatting
                            ? (data.isMoneyValue &&
                              formatMoneyAmount(vehicleInformation[data.fieldName])) ||
                              formatNumber(vehicleInformation[data.fieldName])
                            : vehicleInformation[data.fieldName]
                        } ${data.titleExtension || ''}`}
                      </Typography>}
                </>
                }
          </>
      }
    </>
  );
  return (
    <Grid
      className={classes.vehicleDetailsContainer}
      container
      justifyContent="center"
      direction="column"
    >
      <Typography className={classes.tabTitle}>Vehicle Details</Typography>
      <Grid
        className={classes.summaryWrapper}
        item
        container
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Typography variant="subtitle2">SUMMARY</Typography>
        <Grid
          className={classes.summaryItemsContainer}
          item
          container
          direction="column"
        >
          {SUMMARY_FIELDS.map(field => (
            <Grid
              className={classes.summaryItem}
              key={field.fieldName}
              container
              alignItems="center"
            >
              <div style={{ width: '40%' }}>
                <Typography
                  className={classes.summaryItemTitle}
                  variant="body1"
                  color="secondary"
                >
                  {field.title}
                </Typography>
              </div>
              <div style={{ width: '60%' }}>
                {renderSummaryValue(field)}
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid
        className={classes.featuresWrapper}
        item
        container
        justifyContent="space-between"
        wrap="nowrap"
        alignItems="flex-start"
      >
        <Typography variant="subtitle2" align="left">
          <InformationTabs
            tab={tab}
            handleChangeTab={handleTab}
            features={installedPossibleFeatures}
            brochureLink={eBrochureLink}
            carfaxInfo={carfax}
          />
        </Typography>
        <Grid className={classes.featuresContainer} item container>
          {features && tab === 0 &&
            <div className={classes.rightWrap}>
              <FeaturesTab features={features} />
            </div>}
          {installedPossibleFeatures.length > 0 ?
            <div className={classes.rightWrap}>
              {tab === 1 &&
                <InstalledTab installed={installedPossibleFeatures || []} />}
              {tab === 2 &&
                <DetailedTab chrome={chromeFeatures} />}
            </div> :
            <div className={classes.rightWrap}>
              {tab === 1 &&
                <DetailedTab chrome={chromeFeatures} />}
            </div>}
        </Grid>
      </Grid>
    </Grid>
  );
}

VehicleDetails.propTypes = {
  vehicleInformation: PropTypes.object,
};

VehicleDetails.defaultProps = {
  vehicleInformation: {},
};
