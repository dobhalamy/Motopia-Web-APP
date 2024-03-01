/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Highlight } from 'react-instantsearch-dom';
import classNames from 'classnames';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: 'auto',
  },
});
const logo = 'https://res.cloudinary.com/luxor-motor-cars-inc/image/upload/v1591113639/Logo.png';

const HitComponent = ({ hit }) => {
  const classes = useStyles();
  const router = useRouter();
  const navigateToPost = () => router.push(hit.url);
  const handleCTA = () => router.push(hit.callToActionLink);
  const postedDate = new Date(hit.updatedAt || hit.createdAt).toLocaleDateString('en-US');
  const [image, setImage] = useState(logo);

  useEffect(() => {
    if (hit && hit.content && hit.content.entityMap) {
      setImage(Object.values(hit.content.entityMap).find(el => el.type === 'IMAGE').data.src);
    }
    return () => {
      setImage(logo);
    };
  }, [hit]);
  return (
    <Card classes={{ root: classNames('hit', classes.root) }}>
      <CardActionArea className="hit-content" onClickCapture={navigateToPost}>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={image}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <Highlight attribute="title" hit={hit} />
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            <Highlight attribute="category" hit={hit} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <Highlight attribute="previewDescription" hit={hit} />
          </Typography>
          <Typography variant="body2" color="textSecondary" align="right" component="p">
            {postedDate}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Grid container justifyContent="space-between">
          <Button size="small" color="secondary" variant="contained" onClickCapture={navigateToPost}>
            Learn More
          </Button>
          {hit.callToActionText &&
            <Button size="small" color="primary" variant="contained" onClickCapture={handleCTA}>
              {hit.callToActionText}
            </Button>}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default HitComponent;
