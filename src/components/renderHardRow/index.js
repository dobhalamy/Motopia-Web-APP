import React from 'react';
import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const ListItem = ({ item }) => (
  <li>
    <Typography variant="body1">{item}</Typography>
  </li>
);

ListItem.propTypes = {
  item: PropTypes.string.isRequired,
};

const RenderHardRow = ({ row }) => (
  <Box>
    {row.descOne && <Typography variant="body1">{row.descOne}</Typography>}
    {row.listOne && (
      <ul>
        {row.listOne.map(item => (
          <ListItem key={item} item={item} />
        ))}
      </ul>
    )}
    {row.descTwo && <Typography variant="body1">{row.descTwo}</Typography>}
    {row.listTwo && (
      <ul>
        {row.listTwo.map(item => (
          <ListItem key={item} item={item} />
        ))}
      </ul>
    )}
    {row.descThree && (
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: row.descThree }}
      />
    )}
    {row.descFour && (
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: row.descFour }}
        style={{ paddingTop: 20 }}
      />
    )}
  </Box>
);

RenderHardRow.propTypes = {
  row: PropTypes.object,
};
RenderHardRow.defaultProps = {
  row: {},
};
export default RenderHardRow;
