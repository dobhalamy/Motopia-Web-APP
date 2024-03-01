/* eslint-disable react/prop-types */
import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
// import Button from '../shared/CustomPrimaryButton';
import { Button } from '@material-ui/core';

const ClearRefinements = ({ items, refine }) => (
  <Button color="secondary" variant="contained" fullWidth onClick={() => refine(items)} disabled={!items.length}>Reset filters</Button>
);

export default connectCurrentRefinements(ClearRefinements);
