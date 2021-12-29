import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { TRACKS } from '../../const';

const Home = () => (
  <div>
    <h1>Home View</h1>
    {TRACKS.map((trackNumber) => (
      <Link to={`track-${trackNumber}`} key={`track-${trackNumber}-link`}>
        <Box>
          Go to track
          {' '}
          {trackNumber}
        </Box>

      </Link>
    ))}
  </div>
);

export default Home;
