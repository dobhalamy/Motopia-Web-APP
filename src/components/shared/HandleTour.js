import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import dynamic from 'next/dynamic';

const useStyles = makeStyles({
  stepsText: {
    backgroundColor: '#001B5D',
    color: '#FFF'
  },
  steps: {
    color: '#FD151B',
    backgroundColor: '#001B5D',
    border: 'none',
    cursor: 'pointer',
    outline: 'none'
  }
});
function HandleTour(props) {
  const classes = useStyles();
  // NOTE: Use this when you need to open tour popup
  // eslint-disable-next-line
  const { isOpen, steps } = props;
  const shouldOpen = false;
  const Tour = dynamic(() => import('reactour'), { ssr: false });
  const handleCloseTour = () => {
    clearAllBodyScrollLocks();
    props.handleClose();
  };
  const disableBody = target => disableBodyScroll(target);
  const enableBody = target => enableBodyScroll(target);
  const renderNextButton = () => (
    <button className={classes.steps}>
      <ArrowForwardIcon/>
    </button>
  );
  const renderPrevButton = () => (
    <button className={classes.steps}>
      <ArrowBackIcon/>
    </button>
  );
  return (
    <Tour
      steps={steps}
      isOpen={shouldOpen}
      onAfterOpen={disableBody}
      onBeforeClose={() => enableBody}
      onRequestClose={handleCloseTour}
      nextButton={renderNextButton()}
      prevButton={renderPrevButton()}
    />
  );
}

function areEqual(prevProps, nextProps) {
  if (prevProps.isOpen === nextProps.isOpen) {
    return true;
  }
  return false;
}

HandleTour.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  steps: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default React.memo(HandleTour, areEqual);
