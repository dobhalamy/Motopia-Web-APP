import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';

import CloseIcon from 'assets/close.svg';

const useStyles = makeStyles(theme => ({
  customHintPaper: {
    backgroundColor: '#002f9e94',
  },
  customHint: {
    display: 'flex',
    padding: theme.spacing(4),
    color: theme.palette.common.white,
    borderRadius: 5,
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(1),
    },
  },
}));

const CustomHint = ({ activeHint, handleCloseHint }) => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  return (
    <>
      {matches ?
        <Dialog open={!!activeHint} PaperProps={{ className: classes.customHintPaper }} fullScreen>
          <DialogContent>
            <Grid container justifyContent="space-between">
              <Grid item xs={11} container>
                <Box key={activeHint.number} className={classes.customHint}>
                  <Typography variant="h4" color="inherit">
                    {activeHint.number}
                  </Typography>
                  <Typography variant="body2" color="inherit" style={{ marginLeft: 24 }}>
                    {activeHint.description}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={1} container>
                <Box onClick={handleCloseHint}>
                  <img src={CloseIcon} alt="close" />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
        :
        <Box hidden={!activeHint} key={activeHint.number} className={classes.customHintPaper}>
          <Box className={classes.customHint}>
            <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
              <Grid item container alignItems="center">
                <Typography variant="h4" color="inherit">
                  {activeHint.number}
                </Typography>
                <Typography variant="body2" color="inherit" style={{ marginLeft: 24 }}>
                  {activeHint.description}
                </Typography>
              </Grid>
              <Grid item>
                <Box ml={3} onClick={handleCloseHint}>
                  <img src={CloseIcon} style={{ cursor: 'pointer' }} alt="close" />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>}
    </>
  );
};

CustomHint.propTypes = {
  activeHint: PropTypes.object.isRequired,
  handleCloseHint: PropTypes.func.isRequired,
};

export default CustomHint;
