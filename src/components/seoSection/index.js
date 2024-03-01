import React from 'react';
import PropTypes from 'prop-types';

const SeoHeader = ({ id, h1Tag, h2Tag, h3Tag }) => (
  <div id={id} style={{ display: 'none' }}>
    <h1>{h1Tag}</h1>
    <h2>{h2Tag}</h2>
    <h3>{h3Tag}</h3>
  </div>
);
SeoHeader.propTypes = {
  h1Tag: PropTypes.string,
  h2Tag: PropTypes.string,
  h3Tag: PropTypes.string,
  id: PropTypes.string.isRequired,
};
SeoHeader.defaultProps = {
  h1Tag: '',
  h2Tag: '',
  h3Tag: '',
};

export default SeoHeader;
