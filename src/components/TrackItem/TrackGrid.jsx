import React from 'react';
import { Box } from '@mui/material';

import PropTypes from 'prop-types';
import GridOverlay from './Grid/GridOverlay';
import GridItem from './Grid/GridItem';
import { TRACK_COLORS } from '../../const';
import { usePlayer } from '../../hooks/usePlayer';

const TrackGrid = ({ trackNumber }) => {
  const {
    cancelPlayAudio, playDuration, displayOverlay, resetProgress, playSingleAudio,
  } = usePlayer();
  const trackColor = TRACK_COLORS[trackNumber];

  return (
    <Box>
      <GridOverlay
        onCancel={cancelPlayAudio}
        trackColor={trackColor}
        playDuration={playDuration}
        display={displayOverlay}
        reset={resetProgress}
      />
      <GridItem
        trackColor={trackColor}
        trackName={`Track ${trackNumber}`}
        trackNumber={trackNumber}
        onPlay={playSingleAudio}
      />
    </Box>
  );
};

TrackGrid.propTypes = {
  trackNumber: PropTypes.number.isRequired,
};

export default TrackGrid;
