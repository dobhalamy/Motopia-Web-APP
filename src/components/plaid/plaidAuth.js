import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import axios from 'axios';

import PlaidResponseWithMvr from '@/components/plaid/plaidResponseWithMvr';
import PlaidResponse from '@/components/plaid/plaidResponse';
import Layout from 'components/shared/Layout';
import { PLAID, MVR } from 'src/api';
import { CircularProgress, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { setCookie } from '@/utils/cookie';
import { DMS_PLAID_PDF_UPLOAD } from '@/constants';

const useStyles = makeStyles({
  messageContainer: {
    marginTop: '5rem',
  },
  plaidLoader: {
    display: 'flex',
    justifyContent: 'center ',
    alignItems: 'center',
  },
  skeletonMessage: {
    textAlign: 'center',
    fontSize: '1.375rem',
  },
});
const PlaidAuth = ({ publicToken, accountInfo, creditId, showResult }) => {
  const [mvr, setMvr] = useState(null);
  const [loading, setLoading] = useState(true);
  let RenderComponent;

  const classes = useStyles();

  PlaidAuth.propTypes = {
    publicToken: PropTypes.string.isRequired,
    accountInfo: PropTypes.object.isRequired,
    showResult: PropTypes.string.isRequired,
    creditId: PropTypes.number.isRequired,
  };
  const fetchTransactions = async () => {
    try {
      const response = await PLAID.getAccessToken({
        public_token: publicToken,
      });
      const { accessToken } = response;
      const assetReport = await PLAID.createAssetReport({
        access_token: accessToken,
      });
      const { assetReportId } = assetReport;
      const transactions = await PLAID.getAssetReport({
        assetReportId,
        accountInfo,
        creditId,
      });
      // pdf code start
      const { pdfData } = transactions;
      const pdfFormData = new FormData();
      pdfFormData.append('PlaidPdf', pdfData);
      pdfFormData.append('CreditId', creditId);
      try {
        const pfdResponse = await axios.post(DMS_PLAID_PDF_UPLOAD, pdfFormData);
        console.log('File upload response:', pfdResponse.data);
      } catch (error) {
        // Handle errors during file upload
        console.error('Error uploading file:', error);
      }

      // pdf code end
      const inFlowTransactionData = {
        ...transactions.inFlowTransactionData,
        res: showResult,
      };

      const mvrResponse = await MVR.getPlaidMvr({ inFlowTransactionData });
      setCookie('mvr', JSON.stringify(mvrResponse));
      setMvr(mvrResponse);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicToken, accountInfo]);

  if (loading) {
    RenderComponent = (
      <Layout>
        <Container className={classes.messageContainer}>
          <p className={classes.skeletonMessage}>
            Please bear with us while we gather and analyze your information.
            <br />
            This process may take up to 5 minutes.
          </p>
          <div className={classes.plaidLoader}>
            <CircularProgress size="5rem" />
          </div>
        </Container>
      </Layout>
    );
  } else if (showResult === 'Y') {
    RenderComponent = <PlaidResponseWithMvr mvr={mvr} />;
  } else {
    RenderComponent = <PlaidResponse />;
  }

  return <>{RenderComponent}</>;
};
export default PlaidAuth;
