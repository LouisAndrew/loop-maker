/* eslint-disable prefer-template */

import React, {
  createContext, useState, useEffect, useContext,
} from 'react';
import * as Tone from 'tone';
import groupBy from 'lodash.groupby';
import PropTypes from 'prop-types';

import {
  DELIMITER, INSTRUMENT_NOTES, NOTATION_VALUES,
} from '../const';
import { useTracks } from './useTracks';

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

export const PlayerContext = createContext({
  playDuration: 0,
  displayOverlay: false,
  resetProgress: false,
  cancelPlayAudio: () => {},
  play: () => {},
});

export const PlayerProvider = ({ children }) => {
  const { tempo, gridLength } = useTracks();

  const [player, setPlayer] = useState(null);
  const [noteEntries, setNoteEntries] = useState([]);
  const [playDuration, setPlayDuration] = useState(0);
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [timeoutId, setTimeoutId] = useState(-1);
  const [resetProgress, setResetProgress] = useState(false);
  const [playWithLoop, setPlayWithLoop] = useState(false);

  const stopAudio = () => {
    setDisplayOverlay(false);
    setPlayDuration(0);
    player.dispose();
    Tone.Transport.cancel(playDuration / 1000);
  };

  const cancelPlayAudio = () => {
    if (timeoutId !== -1) {
      clearTimeout(timeoutId);
      setTimeoutId(-1);
    }
    stopAudio();
  };

  const replayAudio = (entries) => {
    setResetProgress(true);
    // eslint-disable-next-line no-use-before-define
    playAudio(entries);
  };

  const playAudio = (entries) => {
    setDisplayOverlay(true);
    entries.forEach(({ note, noteDatas }) => {
      noteDatas.forEach(({ duration, start }) => {
        player.triggerAttackRelease(
          note.replace('s', '#'),
          duration,
          '+' + toSeconds(start),
        );
      });
    });

    const timeout = setTimeout(() => {
      if (playWithLoop) {
        replayAudio(entries);
      } else {
        stopAudio();
      }
    }, playDuration + 500);

    setTimeoutId(timeout);
  };

  /**
   * Function to play a grid item.
   * @param {string[]} items
   */
  const play = async (items, instrument, withLoop) => {
    setPlayWithLoop(withLoop);
    Tone.Transport.bpm.value = tempo;
    const times = items.map((item) => {
      const [row, col, duration] = item.split(DELIMITER);
      return {
        row,
        duration: createTimeObject(duration),
        start: createTimeObject(col),
      };
    });

    const entries = Object.entries(groupBy(times, (obj) => obj.row)).map(
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
      const urls = entries.reduce(
        (a, b) => ({ ...a, [b.note.replace('s', '#').toString()]: b.note + '.mp3' }),
        {},
      );

      const sampler = new Tone.Sampler({
        urls,
        baseUrl: 'https://louisandrew.github.io/loop-maker/samples/' + instrument + '/',
        onload: async () => {
          const totalTrackDuration = toSeconds(createTimeObject(gridLength)) * 1000;
          setPlayDuration(totalTrackDuration);
          setNoteEntries(entries);
          setPlayer(sampler);

          await Tone.start();
        },
      }).toDestination();
    }
  };

  useEffect(() => {
    if (player && noteEntries) {
      playAudio(noteEntries);
    }
  }, [player]);

  useEffect(() => {
    if (resetProgress) {
      setTimeout(() => {
        setResetProgress(false);
      }, 100);
    }
  }, [resetProgress]);

  return (
    <PlayerContext.Provider value={{
      displayOverlay, playDuration, resetProgress, play, cancelPlayAudio,
    }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

PlayerProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export const usePlayer = () => useContext(PlayerContext);
