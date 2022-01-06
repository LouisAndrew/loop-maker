import React, {
  createContext, useContext, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { TRACKS } from '../const';

const activeBoxesDefault = TRACKS.reduce((a, b) => ({ ...a, [b]: [] }), {});
const activeBoxesValuesDefault = TRACKS.reduce((a, b) => ({ ...a, [b]: {} }), {});
const instrumentsDefault = TRACKS.reduce((a, b) => ({ ...a, [b]: 'piano' }), {});

const TracksContext = createContext({
  activeBoxes: activeBoxesDefault,
  activeBoxesValues: activeBoxesValuesDefault,
  instruments: instrumentsDefault,
  tempo: 120,
  gridLength: 40,
});

export const TracksProvider = ({ children }) => {
  const [activeBoxes, setActiveBoxes] = useState(activeBoxesDefault);
  const [activeBoxesValues, setActiveBoxesValues] = useState(activeBoxesValuesDefault);
  const [instruments, setInstruments] = useState(instrumentsDefault);

  const [tempo, setTempo] = useState(120);
  const [gridLength, setGridLength] = useState(40);

  const getSetter = useCallback((trackNumber) => {
    if (TRACKS.indexOf(trackNumber) !== -1) {
      const setActiveBox = (value) => {
        setActiveBoxes((prev) => ({
          ...prev,
          [trackNumber]: value,
        }));
      };

      const setActiveBoxValues = (value) => {
        setActiveBoxesValues((prev) => ({
          ...prev,
          [trackNumber]: value,
        }));
      };

      const setInstrument = (value) => {
        setInstruments((prev) => ({
          ...prev,
          [trackNumber]: value,
        }));
      };

      return {
        setActiveBox,
        setActiveBoxValues,
        setInstrument,
        setTempo,
        setGridLength,
      };
    }

    return {
      setActiveBox: () => {},
      setActiveBoxValues: () => {},
      setInstrument: () => {},
    };
  }, []);

  return (
    <TracksContext.Provider value={{
      getSetter,
      activeBoxes,
      activeBoxesValues,
      instruments,
      tempo,
      gridLength,
    }}
    >
      {children}
    </TracksContext.Provider>
  );
};

TracksProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

/**
 *
 */
export const useTracks = () => useContext(TracksContext);
