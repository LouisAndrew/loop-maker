import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TRACK_NUMBERS } from '../../const';
import Home from './Home';
import TrackView from './TrackView';

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    {Array.from(Array(TRACK_NUMBERS)).map((_, index) => {
      const trackNumber = index + 1;
      return (
        <Route path={`track-${trackNumber}`} key={`track-${trackNumber}`} element={<TrackView trackNumber={trackNumber} />} />
      );
    })}
  </Routes>
);

export default Router;
