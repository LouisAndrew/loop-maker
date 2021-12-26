import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import TrackGrid from '../TrackItem/TrackGrid';

const TrackView = ({ trackNumber }) => (
  <Box bgcolor="primary.bg" display="flex" alignItems="center" justifyContent="center" height="100vh">
    <TrackGrid trackNumber={trackNumber} />
  </Box>
);

TrackView.propTypes = {
  trackNumber: PropTypes.number.isRequired,
};

export default TrackView;
