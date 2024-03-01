import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { useTheme } from '@material-ui/styles';
import Typoghraphy from '@material-ui/core/Typography';

import MaterialTable from 'material-table';

const coulumn = [
  { title: 'Year', field: 'carYear', width: 70 },
  { title: 'Make', field: 'make', width: 150 },
  { title: 'Model', field: 'model', width: 200 },
  { title: 'Series', field: 'series', width: 200 },
  {
    title: 'Application Status',
    field: 'appStatus',
    width: 200,
  },
  {
    title: 'Downpayment $',
    field: 'downPayment',
    render: data =>
      data.downPayment && (
        <Typoghraphy>
          {(Math.round(data.downPayment * 100) / 100).toFixed(2)}
        </Typoghraphy>
      ),
  },
  {
    title: 'Monthly payment $',
    field: 'monthlyPayment',
    render: data =>
      data.downPayment && (
        <Typoghraphy>
          {(Math.round(data.monthlyPayment * 100) / 100).toFixed(2)}
        </Typoghraphy>
      ),
  },
  {
    title: 'Vehicle status',
    field: 'status',
    defaultSort: 'asc',
    render: data =>
      data.status === 'Available' ? (
        <Typoghraphy style={{ color: '#3AC23F' }}>{data.status}</Typoghraphy>
      ) : (
        <Typoghraphy style={{ color: '#FF4227' }}>{data.status}</Typoghraphy>
      ),
  },
];
const VehicleSection = props => {
  const router = useRouter();
  const theme = useTheme();

  const handleRowClick = (e, data) =>
    data.status === 'Available'
      ? router.push(`/vehicle?id=${data.stockid}`)
      : props.handleOutOfStockClick();

  return (
    props.vehicles && (
      <MaterialTable
        data={props.vehicles}
        isLoading={props.isLoading}
        columns={coulumn}
        style={{
          maxWidth: 1138,
          width: '100%',
          margin: `${theme.spacing(2.5)}px auto`,
          boxShadow: `0px 1px 3px 0px rgba(0,0,0,0.2),
                    0px 1px 1px 0px rgba(0,0,0,0.14),
                    0px 2px 1px -1px rgba(0,0,0,0.12)`,
        }}
        title="Your approvals"
        options={{
          sorting: false,
          draggable: false,
          search: false,
          tableLayout: 'fixed',
          rowStyle: data => ({
            cursor: data.status === 'Available' ? 'pointer' : 'default',
          }),
        }}
        onRowClick={handleRowClick}
      />
    )
  );
};

VehicleSection.propTypes = {
  vehicles: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleOutOfStockClick: PropTypes.func.isRequired,
};

export default VehicleSection;
