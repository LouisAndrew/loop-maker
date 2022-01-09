import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { TRACKS } from '../../const';
import { usePlayer } from '../../hooks/usePlayer';
import GridOverlay from '../TrackItem/Grid/GridOverlay';

const Home = () => {
  const {
    playMultipleAudio,
    displayOverlay,
    playDuration,
    cancelPlayAudio,
    resetProgress,
    playSingleAudio
  } = usePlayer();

  return (
    <div>
      <h1>Home View</h1>
      {TRACKS.map((trackNumber) => (
        <div>
        <Link to={`track-${trackNumber}`} key={`track-${trackNumber}-link`}>
          <Box>
            Go to track
            {' '}
            {trackNumber}
          </Box>
        </Link>

        <Button onClick={() => playSingleAudio(trackNumber, false)}>
          play track
        </Button>
        </div>
      ))}

      <GridOverlay
        playDuration={playDuration}
        onCancel={cancelPlayAudio}
        trackColor="white"
        display={displayOverlay}
        reset={resetProgress}
      />

      <Button onClick={() => playMultipleAudio(false)}>Multiple audio</Button>
    </div>
  );
};

export default Home;
