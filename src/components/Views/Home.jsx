import {
  Box, Button, Stack, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { TRACKS, TRACK_COLORS, Colors } from '../../const';
import { usePlayer } from '../../hooks/usePlayer';
import GridOverlay from '../TrackItem/Grid/GridOverlay';
import GridControl from '../TrackItem/Grid/GridControl';
import { useTracks } from '../../hooks/useTracks';
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

  const { tempo, gridLength } = useTracks();
  const textColor='#cecece'
  const [withLoop, setWithLoop] = useState(false);
  document.body.style = ('background: '+Colors['bg']);
  return (
    <div>
      <h1 style={{color:textColor}}>Home View</h1>
      <Stack>
        <GridControl
          handlePlay={() => playMultipleAudio(withLoop)}
          setWithLoop={setWithLoop}
          color='#dddddd'
        />
        <Typography color={textColor}>
          Tempo:
          {' '}
          {tempo}
        </Typography>
        <Typography color={textColor}>
          Grid length:
          {' '}
          {gridLength}
        </Typography>
      </Stack>
      {TRACKS.map((trackNumber) => (
        <div>
            <Box>
              <Button onClick={() => playSingleAudio(trackNumber, false)} sx={{
                backgroundColor: Colors[TRACK_COLORS[trackNumber]],
                marginLeft: '28px',
                marginRight: '28px',
                '&:hover': { backgroundColor: 'yellow' },
              }}>
                PLAY
              </Button>
              <Link to={`track-${trackNumber}`} key={`track-${trackNumber}-link`} style={{color:textColor}}>
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
