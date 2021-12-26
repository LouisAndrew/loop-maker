import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TRACKS } from '../../const';
import Home from './Home';
import TrackView from './TrackView';

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    {TRACKS.map((trackNumber) => (
      <Route path={`track-${trackNumber}`} key={`track-${trackNumber}`} element={<TrackView trackNumber={trackNumber} />} />
    ))}
  </Routes>
);

export default Router;
