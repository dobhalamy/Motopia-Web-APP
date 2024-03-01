import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LinearProgress from '@material-ui/core/LinearProgress';

import Layout from 'components/shared/Layout';
import { MVR } from 'src/api';
import { getCookie } from 'src/utils/cookie';
import FinanceHero from 'assets/finance_hero.jpg';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  SuccessPaymentContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  SuccessPaymentTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  SuccessPaymentWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  SuccessPaymentContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  SuccessPaymentLightGrayColor: {
    color: '#a0a0a0',
  },
  SuccessPaymentIcon: {
    color: 'green',
    width: 40,
    height: 'auto',
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: 960
  }
}));

const Success = props => {
  const classes = useStyles();
  const [isRDS, setRDS] = useState(false);
  const [link, setLink] = useState(null);
  const [file, setFile] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const { router } = props;
    if (router.query.report === 'true') {
      const creditRdsId = getCookie('creditId');
      const dmsUserId = getCookie('prospectId');
      const jobsAmount = getCookie('jobsAmount');
      (async () => {
        try {
          const response = await MVR.getMVRReport(creditRdsId, jobsAmount);
          await MVR.saveReport({
            dmsUserId,
            creditRdsId,
            file: response.filePath,
          });
          setRDS(true);
          const fileArr = response.filePath.split('/');
          const filename = fileArr[fileArr.length - 1];
          setFile(filename);
          fetch(response.filePath)
            .then(res => res.blob())
            .then(pdf => {
              const url = window.URL.createObjectURL(pdf);
              setLink(url);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
            });
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      })();
    } else setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };

  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        <Container maxWidth="md" className={classes.SuccessPaymentContainer}>
          {isLoading ? (
            <LinearProgress className={classes.loader} color="secondary" />
          ) : (
            <>
              <Typography
                variant="h4"
                align="center"
                className={classes.SuccessPaymentTitle}
              >
                PAYMENT SUCCESS
              </Typography>
              <Box className={classes.SuccessPaymentWrapper} boxShadow={6}>
                <Box className={classes.SuccessPaymentContent}>
                  <Box marginTop={2} marginBottom={2}>
                    <Typography align="center">
                      <CheckCircleIcon className={classes.SuccessPaymentIcon} />
                    </Typography>
                  </Box>
                  <Box marginTop={2} marginBottom={4}>
                    <Typography align="center" variant="h5">
                      Your payment succsessfully sent to payment system.
                      <br/>
                      We will contact you soon.
                    </Typography>
                  </Box>
                  {isRDS &&
                  <Box marginTop={2} marginBottom={4}>
                    <Typography align="center" variant="h5">
                      Here is the{' '}
                      <Typography
                        component="a"
                        color="primary"
                        href={link}
                        download={file}
                        variant="h5"
                        style={{ textDecoration: 'none' }}
                      >
                        link
                      </Typography>{' '}
                      for your MVR report.
                      <br/>
                      Download will start soon.
                    </Typography>
                  </Box>}
                </Box>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default withRouter(Success);
