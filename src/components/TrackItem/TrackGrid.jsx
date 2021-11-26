/* eslint-disable max-len */
import React, { useState } from 'react';
import { Box } from '@mui/material';
import * as Tone from 'tone';
import groupBy from 'lodash.groupby';

import {
  BASE_NOTES, DELIMITER, NOTATION_VALUES, NOTES,
} from './Grid/const';
import GridOverlay from './Grid/GridOverlay';
import GridItem from './Grid/GridItem';

const TrackGrid = () => {
  const [playDuration, setPlayDuration] = useState(0);

  /**
   * Divide a number to its floored value (whole number division) and its rest.
   * @param {number} num Number to be divided.
   * @param {number} divider Divider of the number
   * @returns {[number, number]} result of the division and the rest of the division
   */
  const divide = (num, divider) => [Math.floor(num / divider), num % divider];

  /**
   * Function to create a Tone.js compliant time object from a duration.
   * @param {number} duration Duration of the time in grid units.
   * @returns {Object} Tone.js compliant time object.
   */
  const createTimeObject = (duration) => {
    // note: Assuming that every grid unit -> 8n or 1/8 note
    const [nValue, nRest] = divide(duration, NOTATION_VALUES['1n']);
    const [halfNValue, halfNRest] = divide(nRest, NOTATION_VALUES['2n']);
    const [quarterNValue, quarterNRest] = divide(
      halfNRest,
      NOTATION_VALUES['4n'],
    );
    const [eighthNValue] = divide(quarterNRest, NOTATION_VALUES['8n']);

    return {
      '1n': nValue,
      '2n': halfNValue,
      '4n': quarterNValue,
      '8n': eighthNValue,
    };
  };

  const toSeconds = (duration) => Tone.Transport.toSeconds(duration);
  const getTotalNoteDuration = (start, duration) => (toSeconds(start) + toSeconds(duration)) * 1000;

  /**
   * Function to play a grid item.
   * @param {string[]} items
   */
  const play = async (items) => {
    const times = items.map((item) => {
      const [row, col, duration] = item.split(DELIMITER);
      return {
        row,
        duration: createTimeObject(duration),
        start: createTimeObject(col),
      };
    });

    const noteEntries = Object.entries(groupBy(times, (obj) => obj.row)).map(([row, noteDatas]) => {
      const getNote = () => {
        const OCTAVES = [5, 4, 3];
        const note = NOTES[row];
        const octave = OCTAVES[Math.floor(row / (BASE_NOTES.length - 1))];
        return `${note}${note === 'C' ? octave + 1 : octave}`;
      };
      return ({
        note: getNote(),
        noteDatas,
        player: new Tone.Synth().toDestination(),
      });
    });

    noteEntries
      .forEach(({ noteDatas, player, note }) => {
        noteDatas.forEach(({ duration, start }) => {
          player.triggerAttackRelease(
            note,
            duration,
            `+${toSeconds(start)}`,
          );
        });
      });

    if (times.length > 0) {
      const noteDurations = [...times].map((item) => getTotalNoteDuration(item.start, item.duration));
      const totalTrackDuration = noteDurations.sort((a, b) => b - a)[0];
      setPlayDuration(totalTrackDuration);

      await Tone.start();
      setTimeout(() => {
        setPlayDuration(0);
        noteEntries.forEach(({ player }) => {
          player.dispose();
        });
      }, totalTrackDuration + 500);
      Tone.Transport.cancel(totalTrackDuration / 1000);
    }
  };

  return (
    <Box position="relative">
      <GridOverlay trackColor="yellow" playDuration={playDuration} />
      <GridItem trackColor="yellow" onPlay={play} />
    </Box>
  );
};

export default TrackGrid;
