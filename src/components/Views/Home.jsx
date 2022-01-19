import {
  Box, Button, Stack, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import { TRACKS, TRACK_COLORS, Colors } from '../../const';
import HomeControl from '../HomeControl';

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

  const textColor = '#cecece';

  const [withLoop, setWithLoop] = useState(false);
  document.body.style = (`background: ${Colors.bg}`);
  return (
    <Stack padding={4}>
      <Stack paddingBottom={4}>
        <Typography variant="h3" color="#fff" sx={{ paddingLeft: 3 }}>
          Loop Maker
        </Typography>
        <Stack direction="row" py={2}>
          <GridControl
            handlePlay={() => playMultipleAudio(withLoop)}
            setWithLoop={setWithLoop}
            color="#dddddd"
          />
          <HomeControl />
        </Stack>
      </Stack>

      <Stack spacing={3}>
        {TRACKS.map((trackNumber) => (
          <div>
            <Box>
              <Button
                onClick={() => playSingleAudio(trackNumber, false)}
                sx={{
                  backgroundColor: Colors[TRACK_COLORS[trackNumber]],
                  marginLeft: '28px',
                  marginRight: '28px',
                  '&:hover': { backgroundColor: 'yellow' },
                }}
              >
                PLAY Track
                {' '}
                {trackNumber}
              </Button>
              <Link to={`track-${trackNumber}`} key={`track-${trackNumber}-link`} style={{ color: textColor }}>
                Go to track
                {' '}
                {trackNumber}
              </Link>
            </Box>

            <GridItem
              trackColor={TRACK_COLORS[trackNumber]}
              trackNumber={trackNumber}
              trackName={`Track ${trackNumber}`}
              onPlay={() => {}}
              mini
            />

          </div>
        ))}
      </Stack>

      <GridOverlay
        playDuration={playDuration}
        onCancel={cancelPlayAudio}
        trackColor="white"
        display={displayOverlay}
        reset={resetProgress}
      />
    </Stack>
  );
};

export default Home;
