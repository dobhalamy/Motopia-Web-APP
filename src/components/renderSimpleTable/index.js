import { Typography, useMediaQuery } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import RenderHardRow from '@/components/renderHardRow';
import RenderSimpleRow from '@/components/renderSimpleRow';
import RenderParagraphs from '@/components/renderParagraphs';

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
const RenderSimpleTable = ({ tableData }) => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  return (
    <table className={classes.customTable}>
      <tbody>
        {tableData.map(el => (
          <tr key={el.title}>
            <td
              className={classes.customTh}
              style={{ width: matches ? '35%' : '15%' }}
            >
              <Typography variant="subtitle1" className={classes.textBold}>
                {el.title}
              </Typography>
            </td>
            <td
              className={classes.customTh}
              style={{ width: matches ? '65%' : '85%' }}
            >
              {el.desc && <RenderSimpleRow row={el} />}
              {(el.descOne || el.descThree) && <RenderHardRow row={el} />}
              {el.paragraphs && <RenderParagraphs row={el} />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

RenderSimpleTable.propTypes = {
  tableData: PropTypes.array,
};
RenderSimpleTable.defaultProps = {
  tableData: [],
};
export default RenderSimpleTable;
