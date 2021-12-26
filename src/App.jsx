import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

import { Colors } from './const';

import './App.css';
import Router from './components/Views/Router';
import { TracksProvider } from './hooks/useTracks';

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
        <TracksProvider>
          <Router />
        </TracksProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
