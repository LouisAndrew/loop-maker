import {
  Box, Button, Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import HomeControl from '../HomeControl';

import { TRACKS, TRACK_COLORS } from '../../const';
import { usePlayer } from '../../hooks/usePlayer';
import GridOverlay from '../TrackItem/Grid/GridOverlay';
import GridControl from '../TrackItem/Grid/GridControl';
import GridItem from '../TrackItem/Grid/GridItem';

const Home = () => {
  const {
    playMultipleAudio,
    displayOverlay,
    playDuration,
    cancelPlayAudio,
    resetProgress,
    playSingleAudio,
  } = usePlayer();

  const [withLoop, setWithLoop] = useState(false);

  return (
    <div>
      <h1>Home View</h1>
      <Stack>
        <GridControl
          handlePlay={() => playMultipleAudio(withLoop)}
          setWithLoop={setWithLoop}
        />
        <HomeControl />
      </Stack>
      {TRACKS.map((trackNumber) => (
        <div>
          <Link to={`track-${trackNumber}`} key={`track-${trackNumber}-link`}>
            <Box>
              Go to track
              {' '}
              {trackNumber}
            </Box>
          </Link>

          <GridItem
            trackColor={TRACK_COLORS[trackNumber]}
            trackNumber={trackNumber}
            trackName={`Track ${trackNumber}`}
            onPlay={() => {}}
            mini
          />

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
    </div>
  );
};

export default Home;
