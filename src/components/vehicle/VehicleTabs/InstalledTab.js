/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomExpansion from 'components/shared/CustomExpansion';

const InstalledTab = (props) => {
  const [state, setState] = useState({
    features: []
  });
  const [expanded, setExpanded] = useState('Installed features');
  const ref = React.createRef();
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const defaultInst = {
    title: 'Installed features',
    desc: [],
  };

  useEffect(() => {
    if (props) {
      const instDesc = [];
      if (props.installed.length > 0) {
        props.installed.map(el => {
          instDesc.push({
            title: el.featureName,
            desc: el.featureDesc,
          });
        });
      }
      setState({
        features: [
          { ...defaultInst, desc: instDesc },
        ]
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%' }} ref={ref}>
      {state.features.map(feature =>
        <CustomExpansion
          key={feature.title}
          feature={feature}
          expanded={expanded}
          handleChange={handleChange}
          long
        />)}
    </div>
  );
};

InstalledTab.propTypes = {
  installed: PropTypes.array
};

InstalledTab.defaultProps = {
  installed: []
};

export default InstalledTab;
