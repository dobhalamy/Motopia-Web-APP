import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual, union } from 'lodash';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';

import CheckIcon from '@material-ui/icons/Check';

import ArrayItemToggler from 'utils/ArrayItemToggler';
import FilterCount from './FilterCount';

const styles = theme => ({
  checkIcon: {
    width: 18,
    height: 18,
    marginRight: theme.spacing(2.5),
    color: theme.palette.error.main,
  },
  modelCheckIcon: {
    position: 'absolute',
    left: theme.spacing(-3),
    margin: 0,
  },
  title: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  makersTitleButton: {
    textTransform: 'none',
    padding: 0,
  },
  selectorButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    position: 'relative',
    padding: `${theme.spacing(0.5)}px 0px`,
  },
  selectorButtonLabel: {
    justifyContent: 'space-between',
  },
  modelsList: {
    marginLeft: theme.spacing(3),
  },
  selectAllButton: {
    color: theme.palette.error.main,
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    '&:hover': {
      color: theme.palette.error.dark,
    },
  },
  vehicleLogoIcon: {
    width: theme.spacing(5),
    height: theme.spacing(4),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  makerPanelRoot: {
    width: '100%',
    margin: `${theme.spacing(0.5)}px 0px`,
  },
  makerPanelSummaryRoot: {
    padding: 0,
    minHeight: theme.spacing(4),
  },
  makerPanelSummaryExpanded: {
    minHeight: theme.spacing(2),
  },
  makerPanelSummaryContent: {
    margin: 0,
    justifyContent: 'space-between',
  },
  makerPanelDetails: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    marginBottom: theme.spacing(1.5),
  },
  showFullListButton: {
    color: theme.palette.error.main,
    fontSize: theme.typography.pxToRem(12),
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(
      1
    )}px 0px`,
  },
});

class MakeAndModel extends Component {
  state = {
    showFullList: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.selectedModels, this.props.selectedModels) ||
      !isEqual(nextProps.vehicleGlossary, this.props.vehicleGlossary) ||
      nextState.showFullList !== this.state.showFullList
    );
  }

  setSelectedModels = model => () =>
    this.props.multipurposeFilterHandler('selectedModels')(
      null,
      ArrayItemToggler(model, this.props.selectedModels)
    );

  selectAllModels = makerModels => () => {
    // NOTE: this solution need to be improved
    this.props.multipurposeFilterHandler('selectedModels')(
      null,
      union(makerModels, this.props.selectedModels)
    );
  };

  handleShowFullListToggler = () =>
    this.setState(prevState => ({ showFullList: !prevState.showFullList }));

  render() {
    const {
      // https://github.com/eslint/eslint/issues/9259
      // eslint-disable-next-line
      classes,
      selectedModels,
      vehicleGlossary,
    } = this.props;
    const { showFullList } = this.state;

    const vehicleGlossaryVersionList = showFullList
      ? vehicleGlossary
      : vehicleGlossary.slice(0, 10);

    return (
      <Grid container>
        {vehicleGlossaryVersionList.map(vehicle => (
          <Grid
            key={vehicle.maker}
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            wrap="nowrap"
            direction="column"
          >
            <Accordion
              id={vehicle.maker}
              elevation={0}
              classes={{
                root: classes.makerPanelRoot,
              }}
            >
              <AccordionSummary
                classes={{
                  root: classes.makerPanelSummaryRoot,
                  content: classes.makerPanelSummaryContent,
                  expanded: classes.makerPanelSummaryExpanded,
                }}
              >
                <Typography variant="body1" className={classes.title}>
                  {vehicle.maker}
                  <FilterCount filterName="make" title={vehicle.maker} />
                </Typography>
                <div
                  className={classes.vehicleLogoIcon}
                  style={{
                    // eslint-disable-next-line max-len
                    backgroundImage: `url(https://rohitluxor.github.io/carImages/${vehicle.maker
                      .trim()
                      .toLowerCase()
                      .replace(/ /g, '-')}.jpg)`,
                  }}
                />
              </AccordionSummary>
              <AccordionDetails className={classes.makerPanelDetails}>
                <Button
                  fullWidth
                  className={classNames(
                    classes.selectorButton,
                    classes.selectAllButton
                  )}
                  variant="text"
                  onClick={this.selectAllModels(vehicle.models)}
                >
                  Select All
                </Button>
                <Grid
                  item
                  container
                  alignItems="flex-start"
                  justifyContent="center"
                  direction="column"
                  className={classes.modelsList}
                >
                  {vehicle.models.map(model => (
                    <Button
                      key={model}
                      fullWidth
                      className={classes.selectorButton}
                      onClick={this.setSelectedModels(model)}
                    >
                      {selectedModels.includes(model) ? (
                        <Grid item container alignItems="center">
                          <CheckIcon
                            className={classNames(
                              classes.checkIcon,
                              classes.modelCheckIcon
                            )}
                          />
                          <Typography
                            color="error"
                            variant="body1"
                            className={classes.title}
                          >
                            {model}
                            <FilterCount filterName="model" title={model} />
                          </Typography>
                        </Grid>
                      ) : (
                        <Typography variant="body1" className={classes.title}>
                          {model}
                          <FilterCount filterName="model" title={model} />
                        </Typography>
                      )}
                    </Button>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
        <Button
          className={classes.showFullListButton}
          onClick={this.handleShowFullListToggler}
          variant="text"
        >
          {showFullList ? 'Show less makers' : 'Show all makers'}
        </Button>
      </Grid>
    );
  }
}

MakeAndModel.propTypes = {
  selectedModels: PropTypes.array.isRequired,
  vehicleGlossary: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(MakeAndModel);
