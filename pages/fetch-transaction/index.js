import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/router';

import { CircularProgress, Container } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { getCreditIdQueryParams } from '@/utils/commonUtils';

import Layout from 'components/shared/Layout';

import { PLAID } from 'src/api';
import PlaidAuth from '@/components/plaid/plaidAuth';

const useStyles = makeStyles({
  plaidLoader: {
    display: 'flex',
    justifyContent: 'center ',
    alignItems: 'center',
  },
});

const FetchTransactions = () => {
  const [state, setState] = useState({
    linkToken: '',
    publicToken: '',
    accountInfo: null,
    creditId: null,
    showResult: null,
    loading: true,
  });

  const router = useRouter();
  const creditIdQuery = getCreditIdQueryParams(router.query);

  const classes = useStyles();

  const fetchPlaidLink = async () => {
    try {
      const response = await PLAID.getPlaidLink();
      setState(prevState => ({
        ...prevState,
        linkToken: response.link_token,
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      creditId: parseInt(creditIdQuery.creditId, 10),
      showResult: creditIdQuery.res,
    }));

    fetchPlaidLink();
  }, [creditIdQuery.creditId, creditIdQuery.res]);

  const { open, ready } = usePlaidLink({
    token: state.linkToken,
    onSuccess: (plaidPublicToken, metadata) => {
      setState(prevState => ({
        ...prevState,
        publicToken: plaidPublicToken,
        accountInfo: metadata,
        loading: false,
      }));
    },
    onExit: () => {
      router.push({
        pathname: '/',
      });
    },
  });

  // Directly open Plaid Link when ready
  useEffect(() => {
    if (ready) {
      open();
    }
  }, [open, ready]);

  return (
    <>
      <Layout>
        {state.loading ? (
          <Container className={classes.plaidLoader}>
            <CircularProgress size="5rem" />
          </Container>
        ) : (
          <PlaidAuth
            publicToken={state.publicToken}
            accountInfo={state.accountInfo}
            creditId={state.creditId}
            showResult={state.showResult}
          />
        )}
      </Layout>
    </>
  );
};

export default FetchTransactions;
