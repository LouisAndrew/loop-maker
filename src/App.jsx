import React from 'react';
import { createTheme, ThemeProvider, Box } from '@mui/material';

import TrackGrid from './components/TrackItem/TrackGrid';
import { Colors } from './const';

import './App.css';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        ...Colors,
      },
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Box bgcolor="primary.bg">
          <TrackGrid />
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
