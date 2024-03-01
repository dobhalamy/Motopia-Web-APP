import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  tooltipPopper: {
    zIndex: 100,
  },
  tooltip: {
    fontSize: 14
  }
});

function CustomSliderLabel(props) {
  const classes = useStyles();
  const { children, value } = props;

  const transformedAmount = String(value).replace(/[$,]/g, '');
  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef,
      }}
      classes={{ popper: classes.tooltipPopper, tooltip: classes.tooltip }}
      open
      enterTouchDelay={0}
      placement="top"
      title={props.valueLabelFormat(transformedAmount)}
    >
      {children}
    </Tooltip>
  );
}

CustomSliderLabel.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
  valueLabelFormat: PropTypes.func,
};

CustomSliderLabel.defaultProps = {
  valueLabelFormat: value => value
};
export default CustomSliderLabel;
