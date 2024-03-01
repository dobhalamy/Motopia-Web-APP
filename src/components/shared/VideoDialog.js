import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player/vimeo';
import { BORDER_COLOR, VideoUrls, vimeoConfig } from 'src/constants';

const useStyles = makeStyles(theme => ({
  dialogContainer: {
    width: 960,
    maxWidth: 1000
  },
  videoContainer: {
    background: theme.palette.secondary.main,
    padding: theme.spacing(2.5),
  },
  contentContainer: {
    padding: `0px ${theme.spacing(2)}px`,
    height: '100%',
  },
  contentContainerMessage: {
    padding: `${theme.spacing(3)}px 0px ${theme.spacing(4)}px `,
    borderBottom: `1px solid ${BORDER_COLOR}`,
  },
  textSpacing: {
    margin: `${theme.spacing(1.5)}px 0px`,
  },
}));

export default function VideoDialog(props) {
  const router = useRouter();
  const classes = useStyles();
  const { isMobile } = props;
  const { OverviewUrl, PurchaseUrl, RideShareUrl } = VideoUrls;
  const [playerUrl, setPlayerUrl] = useState('');
  useEffect(() => {
    let URL;
    if (props.urlType === 'RideShareUrl') {
      URL = RideShareUrl;
      setPlayerUrl(URL);
    } else {
      URL =
        router.pathname === '/' ||
        router.pathname === '/ride-share/' ||
        router.pathname === '/ride-share'
          ? OverviewUrl
          : PurchaseUrl;
      setPlayerUrl(URL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      classes={{
        paper: classes.dialogContainer,
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Grid
        className={classes.videoContainer}
        container
        alignItems="center"
        direction="column"
      >
        <ReactPlayer
          width={isMobile === 'true' ? '100%' : '860px'}
          height={isMobile === 'true' ? '100%' : '480px'}
          url={playerUrl}
          config={vimeoConfig}
        />
      </Grid>
    </Dialog>
  );
}
VideoDialog.defaultProps = {
  urlType: null,
};

VideoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  isMobile: PropTypes.string.isRequired,
  urlType: PropTypes.string,
};
