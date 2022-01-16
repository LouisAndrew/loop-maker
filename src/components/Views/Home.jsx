import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { TRACKS } from '../../const';
import { usePlayer } from '../../hooks/usePlayer';
import { TRACK_COLORS } from '../../const';
import {Colors} from '../../const';

const Home = () => {
  const { playMultipleAudio, displayOverlay, playSingleAudio} = usePlayer();
  document.body.style = 'background: #3E3C3C;';
  return (
    <div>
      <h1 style={{color:'#cecece'}}>Home View</h1>
      <Button onClick={playMultipleAudio}sx={{
              backgroundColor: '#dddddd',
              marginLeft: '28px',
              marginRight: '14px',
              '&:hover': { backgroundColor: '#dddddd' },
            }}>
        Play loop
      </Button>
      <br/>
      <br/>
      {TRACKS.map((trackNumber) => (
        <div>
          <Box>
            <Button onClick={() => playSingleAudio(trackNumber, false)} sx={{
              backgroundColor: Colors[TRACK_COLORS[trackNumber]],
              marginLeft: '28px',
              marginRight: '14px',
              '&:hover': { backgroundColor: 'yellow' },
            }}>
              play
            </Button>
            <Link to={`track-${trackNumber}`} key={`track-${trackNumber}-link`} style={{color:'#cecece'}} >
              Go to track
              {' '}
              {trackNumber}
            </Link>
            
          </Box>

        </div>
      ))}

      {displayOverlay && (
        <Box>
          Displaying overlay
        </Box>
      )}

    </div>
  );
};

export default Home;
