import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/styles';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { Accident } from '@/api';
import Typoghraphy from '@material-ui/core/Typography';
import moment from 'moment';
import GetAccidentForm from './GetAccidentForm';
import AccidentFormSuccess from './AccidentFormSuccess';

const useStyles = makeStyles(theme => ({
  heading: {
    color: '#ffff',
    [theme.breakpoints.down('md')]: {
      fontSize: 'large',
    },
  },
  tableContainer: {
    display: 'flex',
    '& tbody': {
      wordBreak: 'break-all',
    },
  },
}));
const COLUMNS = [
  {
    title: 'Incident Date',
    field: 'incidentDate',
    render: date => (
      <Typoghraphy>
        {moment(date.incidentDate)
          .local()
          .format('MM/DD/YYYY')}
      </Typoghraphy>
    ),
  },
  {
    title: 'Incident Time',
    field: 'incidentTime',
    render: time => (
      <Typoghraphy>
        {moment(time.incidentTime, 'hh:mm').format('LT')}
      </Typoghraphy>
    ),
  },
  {
    title: 'Incident Intersection',
    field: 'incidentIntersection',
  },
  { title: 'Reason', field: 'accidentDesc' },
  { title: 'Fault', field: 'fault' },
  {
    title: 'Police report',
    field: 'policeReportFiled',
    render: policeReportFiled => (
      <Typoghraphy>{policeReportFiled === true ? 'Yes' : 'No'}</Typoghraphy>
    ),
  },
];
export default function AccidentForm() {
  const theme = useTheme();
  const styles = useStyles();
  const [showForm, setShowForm] = useState(false);
  const [isDisplaySuccess, setDisplaySucess] = useState(false);
  const [activeAccident, setActiveAccident] = useState({});
  const [openAccidents, setOpenAccident] = useState([]);

  const { query } = useRouter();

  const getOpenAccident = async accountId => {
    const openAccident = await Accident.checkOpenAccidentReportByAccountId(
      accountId
    );
    if (openAccident.data && openAccident.data.length > -1) {
      setOpenAccident(() => openAccident.data);
    }
  };

  useEffect(() => {
    const { accountId } = query;
    if (accountId) {
      getOpenAccident(accountId);
    }
  }, [query, query.accountId]);
  useEffect(() => {
    const { accountId } = query;
    if (isDisplaySuccess) {
      getOpenAccident(accountId);
    }
  }, [isDisplaySuccess, query]);
  return (
    <div style={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          height: 50,
          backgroundColor: '#001C5E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" className={styles.heading}>
          ACCIDENT REPORT FORM
        </Typography>
      </Box>
      <div className={styles.tableContainer}>
        <MaterialTable
          data={openAccidents}
          isLoading={false}
          columns={COLUMNS}
          style={{
            maxWidth: '100%',
            width: '100%',
            padding: `${theme.spacing(2.5)}px`,
            whiteSpace: 'normal',
          }}
          title="Your accident details"
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit row',
              onClick: (_, data) => {
                setDisplaySucess(() => false);
                setActiveAccident(() => data);
                setShowForm(() => true);
              },
            },
          ]}
          options={{
            sorting: false,
            draggable: false,
            search: false,
            tableLayout: 'fixed',
            paging: false,
            rowStyle: data => ({
              cursor: data.status === 'Available' ? 'pointer' : 'default',
            }),
          }}
        />
      </div>
      {showForm && !isDisplaySuccess && (
        <GetAccidentForm
          open={showForm}
          setShowForm={setShowForm}
          activeAccident={activeAccident}
          setDisplaySucess={setDisplaySucess}
        />
      )}
      {isDisplaySuccess && <AccidentFormSuccess />}
    </div>
  );
}
