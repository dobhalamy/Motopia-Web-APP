import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  textBold: {
    fontWeight: 600,
  },
  customTable: {
    border: '1px solid rgb(187, 187, 187)',
    borderCollapse: 'collapse',
    width: '100%',
    tableLayout: 'fixed',
    wordWrap: 'break-word',
  },
  customTh: {
    border: '1px solid rgb(187, 187, 187)',
    borderCollapse: 'collapse',
    padding: 15,
  },
}));
const RenderReasonsTable = ({ table }) => {
  const { headerOne, headerTwo, headerThree, rows, additional } = table;
  const classes = useStyles();
  return (
    <>
      <table className={classes.customTable}>
        <thead>
          <tr>
            <th className={classes.customTh}>
              <Typography variant="subtitle1" className={classes.textBold}>
                {headerOne}
              </Typography>
            </th>
            <th className={classes.customTh}>
              <Typography variant="subtitle1" className={classes.textBold}>
                {headerTwo}
              </Typography>
            </th>
            <th className={classes.customTh}>
              <Typography variant="subtitle1" className={classes.textBold}>
                {headerThree}
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.title}>
              <td className={classes.customTh} style={{ width: '70%' }}>
                <Typography variant="body1" className={classes.textBold}>
                  {row.title}
                </Typography>
                {row.desc && (
                  <Typography variant="body1">{row.desc}</Typography>
                )}
              </td>
              <td className={classes.customTh}>
                <Typography
                  variant="body1"
                  align="center"
                  className={classes.textBold}
                >
                  {row.share}
                </Typography>
              </td>
              <td className={classes.customTh}>
                <Typography
                  variant="body1"
                  align="center"
                  className={classes.textBold}
                >
                  {row.limit}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typography variant="body2">{additional}</Typography>
    </>
  );
};

RenderReasonsTable.propTypes = {
  table: PropTypes.object,
};
RenderReasonsTable.defaultProps = {
  table: {},
};

export default RenderReasonsTable;
