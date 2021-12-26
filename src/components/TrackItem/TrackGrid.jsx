/* eslint-disable prefer-template */
import React, { useState } from 'react';
import { Box } from '@mui/material';
import * as Tone from 'tone';
import groupBy from 'lodash.groupby';

import PropTypes from 'prop-types';
import {
  DELIMITER, INSTRUMENT_NOTES, NOTATION_VALUES,
} from './Grid/const';
import GridOverlay from './Grid/GridOverlay';
import GridItem from './Grid/GridItem';
import { TRACK_COLORS } from '../../const';

const TrackGrid = ({ trackNumber }) => {
  const [playDuration, setPlayDuration] = useState(0);
  const trackColor = TRACK_COLORS[trackNumber];

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
  const play = async (items, instrument) => {
    const times = items.map((item) => {
      const [row, col, duration] = item.split(DELIMITER);
      return {
        row,
        duration: createTimeObject(duration),
        start: createTimeObject(col),
      };
    });

    const noteEntries = Object.entries(groupBy(times, (obj) => obj.row)).map(
      ([row, noteDatas]) => {
        /**
         *
         * @returns {string}
         */
        const getNote = () => INSTRUMENT_NOTES[instrument][row];

        return {
          note: getNote(),
          noteDatas,
        };
      },
    );

    if (times.length > 0) {
      const urls = noteEntries.reduce(
        (a, b) => ({ ...a, [b.note.replace('s', '#').toString()]: b.note + '.mp3' }),
        {},
      );

      const player = new Tone.Sampler({
        urls,
        baseUrl: 'https://louisandrew.github.io/loop-maker/samples/' + instrument + '/',
        onload: async () => {
          /**
           * Gets the total duration of a track.
           * Retrieve the last note of the current track, then sum its start time and its duration.
           */
          const noteDurations = [...times].map(
            (item) => getTotalNoteDuration(item.start, item.duration),
          );
          const totalTrackDuration = noteDurations.sort((a, b) => b - a)[0];

          setPlayDuration(totalTrackDuration);

          setTimeout(() => {
            setPlayDuration(0);
            player.dispose();
          }, totalTrackDuration + 500);
          Tone.Transport.cancel(totalTrackDuration / 1000);

          await Tone.start();
          noteEntries.forEach(({ note, noteDatas }) => {
            noteDatas.forEach(({ duration, start }) => {
              player.triggerAttackRelease(
                note.replace('s', '#'),
                duration,
                '+' + toSeconds(start),
              );
            });
          });
        },
      }).toDestination();
    }
  };

  return (
    <Box>
      <GridOverlay trackColor={trackColor} playDuration={playDuration} />
      <GridItem trackColor={trackColor} trackName={'Track ' + trackNumber} onPlay={play} />
    </Box>
  );
};

TrackGrid.propTypes = {
  trackNumber: PropTypes.number.isRequired,
};

export default TrackGrid;
