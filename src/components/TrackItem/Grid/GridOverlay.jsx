import React, { useEffect, useState } from 'react';
import { Box, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Component that overlays the grid item when it's playing
 */
const GridOverlay = ({ playDuration, trackColor }) => {
  const [progressKey, setProgressKey] = useState(Math.random());
  const [progress, setProgress] = useState(0);
  const isActive = playDuration !== 0;

  /**
   * Function to reset the current progress bar
   */
  const resetProgress = () => {
    setProgress(0);
    setProgressKey(Math.random());
  };

  /**
   * Will be called everytime the variable `playDuration` changes.
   * What it does: Sets an interval to update the "playing audio" progress bar.
   */
  useEffect(() => {
    let timer;

    if (playDuration > 0) {
      timer = setInterval(() => {
        setProgress((prev) => (prev === 100 ? prev : prev + 1));
      }, playDuration / 100);
    } else {
      resetProgress();
    }

    /**
     * Cleanup function to clear the interval.
     */
    return () => {
      if (timer) {
        resetProgress();
        clearInterval(timer);
      }
    };
  }, [playDuration]);

  return isActive ? (
    <Box
      position="absolute"
      bgcolor="rgba(0, 0, 0, 0.1)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backdropFilter: 'blur(1px)',
        zIndex: 99,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Box color="#fff" fontWeight="bold" fontSize="32px">
        PLAYING AUDIO
      </Box>
      <Box width="20vw" color={`primary.${trackColor}`} sx={{ marginTop: 3 }}>
        <LinearProgress
          key={progressKey}
          color="inherit"
          variant="determinate"
          value={progress}
        />
      </Box>
    </Box>
  ) : null;
};

GridOverlay.propTypes = {
  trackColor: PropTypes.string,
  playDuration: PropTypes.number.isRequired,
};

GridOverlay.defaultProps = {
  trackColor: 'yellow',
};

export default GridOverlay;