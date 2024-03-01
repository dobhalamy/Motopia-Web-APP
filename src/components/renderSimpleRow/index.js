import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, Typography } from '@material-ui/core';

const RenderSimpleRow = ({ row }) => (
  <>
    <Typography
      variant="body1"
      style={{ fontWeight: row.title === 'Facts' ? 600 : 400 }}
    >
      {row.desc}
    </Typography>
    {row.list && (
      <ul>
        {row.list.map(item => (
          <ListItem key={`${item.title}_`} item={item} />
        ))}
      </ul>
    )}
  </>
);

RenderSimpleRow.propTypes = {
  row: PropTypes.object,
};
RenderSimpleRow.defaultProps = {
  row: {},
};

export default RenderSimpleRow;
