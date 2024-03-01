import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import { CARFAX_URL } from 'src/constants';
import Tab from '@material-ui/core/Tab';
import SeePdf from 'assets/see_pdf.png';

const useStyles = makeStyles(theme => ({
  tabsWrapper: {
    background: theme.palette.common.white,
    textAlign: 'right'
  },
  wrapper: {
    alignItems: 'flex-end',
  },
  pdf: {
    width: 35,
    height: 35
  },
  root: {
    textAlign: 'right',
    display: 'flow-root',
    fontWeight: 900,
    color: '#001C5E'
  },
  btn: {
    minWidth: 130
  }
}));

export default function InformationTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const { carfaxInfo } = props;
  const { stickerFIleName } = carfaxInfo;

  return (
    <Grid className={classes.tabsWrapper} container>
      <Grid
        className={classNames(
          classes.tabsContainer, classes.wrapper
        )}
        container
        direction="column"
        alignItems="flex-end"
      >
        <Tabs
          value={props.tab}
          onChange={props.handleChangeTab}
          indicatorColor="secondary"
          orientation={matches ? 'horizontal' : 'vertical'}
          variant={matches && 'scrollable'}
        >
          <Tab label="Features" classes={{ wrapper: classes.root }}/>
          {props.features.length > 0 &&
            <Tab label="Installed features" classes={{ wrapper: classes.root }}/>}
          <Tab label="Detailed info" classes={{ wrapper: classes.root }}/>
          {stickerFIleName &&
            <a
              style={{ display: 'flex' }}
              download
              href={`${CARFAX_URL}${stickerFIleName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={SeePdf} alt="seeCarfaxSticker" className={classes.pdf} />
              <Tab
                label="Original Sticker"
                classes={{ wrapper: classes.root }}
                style={{ minWidth: '130px' }}
              />
            </a>}
          {props.brochureLink &&
            <a
              style={{ display: 'flex', marginLeft: 'auto' }}
              download
              href={props.brochureLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={SeePdf} alt="seePdf" className={classes.pdf} />
              <Tab
                label="See Brochure"
                classes={{ wrapper: classes.root }}
                style={{ minWidth: '130px' }}
              />
            </a>}
        </Tabs>
      </Grid>
    </Grid>
  );
}

InformationTabs.propTypes = {
  tab: PropTypes.number,
  handleChangeTab: PropTypes.func.isRequired,
  features: PropTypes.array,
  brochureLink: PropTypes.string,
  carfaxInfo: PropTypes.object
};

InformationTabs.defaultProps = {
  tab: 0,
  features: [],
  brochureLink: '',
  carfaxInfo: {}
};
