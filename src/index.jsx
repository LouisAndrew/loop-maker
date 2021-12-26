// eslint-disable-file

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import 'react-resizable/css/styles.css';

import App from './App';

ReactDOM.render(
  <BrowserRouter basename="loop-maker">
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
