import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomExpansion from 'components/shared/CustomExpansion';

const DetailedTab = (props) => {
  const [state, setState] = useState({
    features: []
  });
  const [expanded, setExpanded] = useState('Engine');
  const ref = React.createRef();
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    if (props.chrome) {
      const engineDesc = [];
      if (props.chrome.engine) {
        const { engine } = props.chrome;
        if (engine.engineType) {
          engineDesc.push({
            title: 'Engine type',
            desc: engine.engineType,
          });
        }
        if (engine.cylinders) {
          engineDesc.push({
            title: 'Engine cylinders',
            desc: engine.cylinders,
          });
        }
        if (engine.liters) {
          engineDesc.push({
            title: 'Engine liters',
            desc: engine.liters,
          });
        }
        if (engine.horsepower) {
          const { horsepower } = engine;
          engineDesc.push({
            title: 'Horsepower',
            desc: `${horsepower.value} pcs and ${horsepower.rpm} rpm`
          });
        }
        if (engine.netTorque) {
          const { netTorque } = engine;
          engineDesc.push({
            title: 'Net torque',
            desc: `${netTorque.value} pcs and ${netTorque.rpm} rpm`
          });
        }
        if (engine.fuelEconomy) {
          const { fuelEconomy } = engine;
          engineDesc.push({
            title: 'Fuel economy',
            desc: `City: ${fuelEconomy.city.low}-${fuelEconomy.city.high};
                  Highway: ${fuelEconomy.hwy.low}-${fuelEconomy.hwy.high};`
          });
        }
        if (engine.fuelCapacity) {
          const { fuelCapacity } = engine;
          engineDesc.push({
            title: 'Fuel capacity',
            desc: `Lowest capacity: ${fuelCapacity.low} ${fuelCapacity.unit};
                  Highest capacity: ${fuelCapacity.high} ${fuelCapacity.unit};`
          });
        }
        setState({ ...state,
          features: [
            {
              title: 'Engine',
              desc: engineDesc
            },
          ]
        });
      }
      if (props.chrome.standard) {
        setState({ ...state,
          features: [
            {
              title: 'Engine',
              desc: engineDesc,
            },
            ...props.chrome.standard] });
      }
    }
    if (!props.chrome) {
      setState({
        ...state,
        features: [
          {
            title: 'Engine',
            desc: [],
          },
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
          long={feature.title === 'Engine'}
        />)}
    </div>
  );
};

DetailedTab.propTypes = {
  chrome: PropTypes.object.isRequired,
};

export default DetailedTab;
