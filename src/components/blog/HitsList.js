/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import classNames from 'classnames';
import {
  Button,
  Grid,
  Divider,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HitComponent from './HitComponent';

const useStyles = makeStyles(theme => ({
  hits: {
    padding: '1rem',
    marginBottom: '1rem',
    height: 800,
    backgroundColor: '#fafafa',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 0
    },
  },
  divider: {
    marginBottom: '1rem',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  item: {
    overflow: 'visible',
  }
}));

const HitsList = ({ hits, hasMore, refineNext }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [columns, setColumns] = useState(3);
  useEffect(() => {
    if (isMobile) {
      setColumns(1);
    }

    if (isTablet) {
      setColumns(2);
    }

    if (isDesktop) {
      setColumns(3);
    }

    return () => {
      setColumns(3);
    };
  }, [isDesktop, isTablet, isMobile]);

  return (
    <>
      <ImageList
        cols={columns}
        rowHeight={380}
        gap={0}
        classes={{
          root: classes.hits
        }}
      >
        {hits.map((hit) =>
          <ImageListItem
            classes={{
              item: classNames('hit', classes.item)
            }}
            key={hit.objectID}
            cols={1}
            rows={1}
          >
            <HitComponent hit={hit} />
          </ImageListItem>)}
      </ImageList>
      <Divider classes={{ root: classes.divider }} />
      <Grid container variant="inset" justifyContent="center">
        <Button variant="contained" disabled={!hasMore} onClick={refineNext} size="medium" color="primary">Show more</Button>
      </Grid>
    </>
  );
};

export default connectInfiniteHits(HitsList);
