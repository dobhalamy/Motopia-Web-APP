/* eslint-disable react/prop-types */
// I hate my self for line above as much as you do
/* eslint-disable max-len */
import React from 'react';
import Icon from '@material-ui/core/Icon';

const NextPageSvg = ({ fill = '#b3bbcf' }) => (
  <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.0758 0.946709C14.4096 0.533682 13.5489 1.01279 13.5489 1.79661V2.59543H1.40457C0.628847 2.59543 0 3.22428 0 4C0 4.77572 0.628846 5.40457 1.40457 5.40457H13.5489V6.20326C13.5489 6.98711 14.4097 7.46621 15.0759 7.05313L16.7744 5.99986L18.6293 4.84984C19.26 4.45879 19.26 3.54116 18.6293 3.15007L16.7744 1.99986L15.0758 0.946709Z"
      fill={fill}
    />
  </svg>
);

const PreviousPageSvg = ({ fill = '#b3bbcf' }) => (
  <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.92419 7.05329C5.59036 7.46632 6.45113 6.98721 6.45113 6.20339L6.45113 5.40457L18.5954 5.40457C19.3712 5.40457 20 4.77572 20 4C20 3.22428 19.3712 2.59543 18.5954 2.59543L6.45113 2.59543L6.45113 1.79674C6.45113 1.01289 5.5903 0.533787 4.92413 0.94687L3.22556 2.00013L1.37071 3.15015C0.739985 3.5412 0.739956 4.45884 1.37065 4.84993L3.22556 6.00014L4.92419 7.05329Z"
      fill={fill}
    />
  </svg>
);

const LastPageSvg = ({ fill = '#b3bbcf' }) => (
  <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.07581 1.94671C8.40964 1.53368 7.54887 2.01279 7.54887 2.79661V3.59543H1.40457C0.628846 3.59543 0 4.22428 0 5C0 5.77572 0.628846 6.40457 1.40457 6.40457H7.54887V7.20326C7.54887 7.98711 8.4097 8.46621 9.07587 8.05313L10.7744 6.99986L12.6293 5.84984C13.26 5.45879 13.26 4.54116 12.6293 4.15007L10.7744 2.99986L9.07581 1.94671Z"
      fill={fill}
    />
    <rect x="15" width="2" height="10" rx="1" fill={fill} />
  </svg>
);

const FirstPageSvg = ({ fill = '#b3bbcf' }) => (
  <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.92419 8.05329C8.59036 8.46632 9.45113 7.98721 9.45113 7.20339L9.45113 6.40457L15.5954 6.40457C16.3712 6.40457 17 5.77572 17 5C17 4.22428 16.3712 3.59543 15.5954 3.59543L9.45113 3.59543L9.45113 2.79674C9.45113 2.01289 8.5903 1.53379 7.92413 1.94687L6.22556 3.00014L4.37071 4.15016C3.73998 4.54121 3.73996 5.45884 4.37065 5.84993L6.22556 7.00014L7.92419 8.05329Z"
      fill={fill}
    />
    <rect x="2" y="10" width="2" height="10" rx="1" transform="rotate(-180 2 10)" fill={fill} />
  </svg>
);

export const NextPageIcon = props => <Icon component={NextPageSvg} fill={props.fill} />;
export const PreviousPageIcon = props => <Icon component={PreviousPageSvg} fill={props.fill} />;
export const LastPageIcon = props => <Icon component={LastPageSvg} fill={props.fill} />;
export const FirstPageIcon = props => <Icon component={FirstPageSvg} fill={props.fill} />;
