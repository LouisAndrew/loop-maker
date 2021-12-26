import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

import { Colors } from './const';

import './App.css';
import Router from './components/Views/Router';

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
        <Router />
      </ThemeProvider>
    </div>
  );
}

export default App;
