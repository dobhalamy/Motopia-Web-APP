/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import { ShareRounded, FileCopyOutlined } from '@material-ui/icons';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';

const useStyles = makeStyles(theme => ({
  exampleWrapper: {
    position: 'sticky',
    right: 0,
    bottom: 30,
  },
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

const domain = 'https://www.gomotopia.com';

const ShareButton = ({ postTitle }) => {
  const classes = useStyles();
  const { asPath } = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fullPath = `${domain}${asPath}`;
    if (url !== fullPath) {
      setUrl(fullPath);
    }
    return () => {
      setUrl('');
    };
  }, [asPath]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const actions = [
    {
      icon: <EmailIcon round />,
      name: 'Email',
      fabProps: {
        component: EmailShareButton,
        subject: `Motopia | ${postTitle}`,
        url,
        openShareDialogOnClick: true,
      },
    },
    {
      icon: <FacebookIcon round />,
      name: 'Facebook',
      fabProps: {
        component: FacebookShareButton,
        url,
        quote: postTitle,
      },
    },
    {
      icon: <LinkedinIcon round />,
      name: 'Linkedin',
      fabProps: {
        component: LinkedinShareButton,
        url,
        quote: postTitle,
      },
    },
    {
      icon: <TwitterIcon round />,
      name: 'Twitter',
      fabProps: {
        component: TwitterShareButton,
        url,
        quote: postTitle,
      },
    },
    {
      icon: <WhatsappIcon round />,
      name: 'WhatsApp',
      fabProps: {
        component: WhatsappShareButton,
        url,
        title: postTitle,
      },
    },
    {
      icon: <FileCopyOutlined />,
      name: 'Copy to clipboard',
      // eslint-disable-next-line no-alert
      onClick: () =>
        navigator.clipboard.writeText(url).then(() => alert('URL is copied!')),
    },
  ];

  return (
    <div className={classes.exampleWrapper}>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<ShareRounded />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick || handleClose}
            FabProps={{ ...action.fabProps }}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default ShareButton;
