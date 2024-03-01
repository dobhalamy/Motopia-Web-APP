import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  paragraphBox: {
    marginBottom: 30,
  },
}));
const RenderParagraphs = ({ row }) => {
  const { paragraphs, contacts } = row;
  const classes = useStyles();
  return (
    <>
      {paragraphs.map(par => (
        <Box key={`${par.title}_`} className={classes.paragraphBox}>
          {par.title && (
            <Typography variant="body1" className={classes.textBold}>
              {par.title}
            </Typography>
          )}
          {par.desc ? (
            <Typography variant="body1">{par.desc}</Typography>
          ) : (
            <>
              <Box className={classes.paragraphBox}>
                <Typography variant="body1">{par.descOne}</Typography>
              </Box>
              <Divider />
              <Box className={classes.contactBox}>
                {contacts.map((el, index1) => (
                  <Typography
                    key={el}
                    variant="subtitle1"
                    className={
                      index1 !== contacts.length - 1 ? classes.textBold : null
                    }
                  >
                    {el}
                  </Typography>
                ))}
              </Box>
              <Divider style={{ marginBottom: 25 }} />
              <Box className={classes.paragraphBox}>
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{ __html: par.descTwo }}
                />
              </Box>
              <Divider style={{ marginBottom: 25 }} />
              <Box className={classes.paragraphBox}>
                <Typography variant="body1">{par.descThree}</Typography>
              </Box>
            </>
          )}
        </Box>
      ))}
    </>
  );
};

RenderParagraphs.propTypes = {
  row: PropTypes.object,
};
RenderParagraphs.defaultProps = {
  row: {},
};
export default RenderParagraphs;
