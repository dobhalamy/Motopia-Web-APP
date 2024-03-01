import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomExpansion from 'components/shared/CustomExpansion';

const FeaturesTab = (props) => {
  const [state, setState] = useState({
    features: []
  });
  const [expanded, setExpanded] = useState();
  const ref = React.createRef();
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    if (props.features) {
      const features = [];
      const title = 'Main features';
      const desc = props.features.map(el => el.featureName);
      features.push({ title, desc });
      setState({ ...state, features });
      setExpanded(title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%' }} ref={ref}>
      {props.features && state.features.map(feature =>
        <CustomExpansion
          key={feature.title}
          feature={feature}
          expanded={expanded}
          handleChange={handleChange}
        />)}
    </div>
  );
};

FeaturesTab.propTypes = {
  features: PropTypes.array.isRequired,
};

export default FeaturesTab;
