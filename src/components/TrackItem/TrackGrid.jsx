import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { DELIMITER, NOTATION_VALUES, NOTES } from './Grid/const';

import GridItem from './Grid/GridItem';

const TrackGrid = () => {
  /**
   * @type {[Tone.Synth]}
   */
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    setPlayer(new Tone.Synth().toDestination());
  }, []);

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
        start: player.toSeconds(createTimeObject(col)),
      };
    });

    times.forEach(({ duration, start, row }) => {
      const getNote = () => {
        const OCTAVES = [5, 4, 3];
        const note = NOTES[row];
        const octave = OCTAVES[Math.floor(row / 7)];
        return `${note}${note === 'C' ? octave + 1 : octave}`;
      };

      player.triggerAttackRelease(getNote(), duration, `+${start}`);
    });

    console.log({ last: times[times.length - 1].start });

    await Tone.start();
  };

  return <GridItem trackColor="yellow" onPlay={play} />;
};

export default TrackGrid;
