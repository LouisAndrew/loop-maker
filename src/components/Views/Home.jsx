import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { TRACKS } from '../../const';
import { usePlayer } from '../../hooks/usePlayer';

const Home = () => {
  const { playMultipleAudio, displayOverlay, playSingleAudio} = usePlayer();

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

      {displayOverlay && (
        <Box>
          Displaying overlay
        </Box>
      )}

      <Button onClick={playMultipleAudio}>
        Multiple audio
      </Button>
    </div>
  );
};

export default Home;
