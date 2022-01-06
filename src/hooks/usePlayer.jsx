/* eslint-disable prefer-template */

import React, {
  createContext, useState, useEffect, useContext,
} from 'react';
import * as Tone from 'tone';
import groupBy from 'lodash.groupby';
import PropTypes from 'prop-types';

import {
  DELIMITER, INSTRUMENT_NOTES, NOTATION_VALUES, TRACKS,
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
  playSingleAudio: () => {},
});

const defaultValue = TRACKS.reduce((a, b) => ({ ...a, [b]: null }), {});
const notReady = TRACKS.reduce((a, b) => ({ ...a, [b]: false }), {});

const MULTIPLE_TRACKS = 'multi';
const INACTIVE = '';

export const PlayerProvider = ({ children }) => {
  const {
    tempo, gridLength, activeBoxes, activeBoxesValues, instruments,
  } = useTracks();

  const [player, setPlayer] = useState(null);
  const [noteEntries, setNoteEntries] = useState([]);

  const [playerId, setPlayerId] = useState(INACTIVE);
  const [playerGroup, setPlayerGroup] = useState(defaultValue);
  const [readyState, setReadyState] = useState(notReady);
  const [noteEntryGroup, setNoteEntryGroup] = useState(defaultValue);

  const [playDuration, setPlayDuration] = useState(0);
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [timeoutId, setTimeoutId] = useState(-1);
  const [resetProgress, setResetProgress] = useState(false);
  const [playWithLoop, setPlayWithLoop] = useState(false);

  const stopAudio = (p) => {
    setDisplayOverlay(false);
    setPlayDuration(0);
    p.dispose();
    Tone.Transport.cancel(playDuration / 1000);

    if (playerId !== MULTIPLE_TRACKS) {
      setPlayerGroup((prev) => ({ ...prev, [playerId]: null }));
      setPlayerId(INACTIVE);
      setReadyState((prev) => ({ ...prev, [playerId]: false }));
    }
  };

  const cancelPlayAudio = () => {
    if (timeoutId !== -1) {
      clearTimeout(timeoutId);
      setTimeoutId(-1);
    }

    if (playerId !== MULTIPLE_TRACKS) {
      stopAudio(playerGroup[playerId]);
    }
  };

  const replayAudio = (entries, p) => {
    setResetProgress(true);
    // eslint-disable-next-line no-use-before-define
    playAudio(entries, p);
  };

  const playAudio = (entries, p) => {
    setDisplayOverlay(true);
    entries.forEach(({ note, noteDatas }) => {
      noteDatas.forEach(({ duration, start }) => {
        p.triggerAttackRelease(
          note.replace('s', '#'),
          duration,
          '+' + toSeconds(start),
        );
      });
    });

    const timeout = setTimeout(() => {
      if (playWithLoop) {
        replayAudio(entries, p);
      } else {
        stopAudio(p);
      }
    }, playDuration + 500);

    setTimeoutId(timeout);
  };

  const getNotes = (id) => activeBoxes[id].map(
    (box) => `${box}${DELIMITER}${activeBoxesValues[id][box] ?? 0}`,
  );

  /**
   * Function to play a grid item.
   * @param {string[]} items
   */
  const play = async (id) => {
    Tone.Transport.bpm.value = tempo;

    const instrument = instruments[id];

    const times = getNotes(id).map((item) => {
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
        (a, b) => ({
          ...a,
          [b.note.replace('s', '#').toString()]: b.note + '.mp3',
        }),
        {},
      );

      const sampler = new Tone.Sampler({
        urls,
        baseUrl:
          'https://louisandrew.github.io/loop-maker/samples/'
          + instrument
          + '/',
        onload: async () => {
          // setNoteEntries(entries);
          // setPlayer(sampler);

          setNoteEntryGroup((prev) => ({
            ...prev,
            [id]: entries,
          }));

          setReadyState((prev) => ({
            ...prev,
            [id]: true,
          }));

          await Tone.start();
        },
      }).toDestination();
      return sampler;
    }

    return null;
  };

  const playSingleAudio = async (id, withLoop) => {
    const totalTrackDuration = toSeconds(createTimeObject(gridLength)) * 1000;
    setPlayDuration(totalTrackDuration);
    setPlayerId(id);
    setPlayWithLoop(withLoop);

    const singlePlayer = await play(id);

    setPlayerGroup((prev) => ({
      ...prev,
      [id]: singlePlayer,
    }));
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

  useEffect(() => {
    if (playerId !== MULTIPLE_TRACKS) {
      if (readyState[playerId] && playerGroup[playerId]) {
        console.log('Playing audio');
        playAudio(noteEntryGroup[playerId], playerGroup[playerId]);
      }
    }
  }, [readyState, playerGroup]);

  return (
    <PlayerContext.Provider
      value={{
        displayOverlay,
        playDuration,
        resetProgress,
        play,
        cancelPlayAudio,
        playSingleAudio,
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
