/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, {
  useEffect, useRef, useState, useMemo,
} from 'react';
import { Stack, Box } from '@mui/material';

import omit from 'lodash.omit';
import { ResizableBox } from 'react-resizable';
import PropTypes from 'prop-types';
import { DELIMITER, INSTRUMENT_NOTES } from '../../../const';
import { useTracks } from '../../../hooks/useTracks';
import GridControl from './GridControl';

/**
 * Grid item where user can clicks on the grid and assign an active note.
 * ![documentation](https://raw.githubusercontent.com/LouisAndrew/loop-maker/docs/docs/images/GridItem.jpeg)
 */
const GridItem = ({
  trackColor = 'yellow',
  onPlay,
  trackName = 'Track 1',
  trackNumber,
  mini = false,
}) => {
  const {
    getSetter,
    activeBoxes,
    activeBoxesValues,
    instruments,
    gridLength,
    tempo,
  } = useTracks();

  const activeBox = useMemo(() => activeBoxes[trackNumber], [activeBoxes]);
  const activeBoxValues = useMemo(
    () => activeBoxesValues[trackNumber],
    [activeBoxesValues],
  );
  const instrument = useMemo(() => instruments[trackNumber], [instruments]);

  const {
    setActiveBox,
    setActiveBoxValues,
    setInstrument,
    setTempo,
    setGridLength,
  } = useMemo(() => getSetter(trackNumber), [trackNumber]);

  const [withLoop, setWithLoop] = useState(false);

  function handleTempo(_, newValue) {
    setTempo(newValue);
  }

  /**
   * Key of the whole component (Used to rerender the grids).
   * @type {[string]}
   */
  const [key, setKey] = useState(Math.random());

  /**
   * @type {string[]}
   */
  const instrumentNotes = useMemo(
    () => INSTRUMENT_NOTES[instrument],
    [instrument],
  );

  /**
   * Sets whether the component is done being rendered for the first time.
   */
  const firstRender = useRef(true);

  /**
   * Function to rerender the whole component.
   */
  const rerender = () => setKey(Math.random());

  /**
   * Function to toggle active state of a box (e.g. 1__2).
   * @param {string} itemId
   */
  const toggleActive = (itemId) => {
    if (!activeBox.includes(itemId)) {
      setActiveBox([...activeBox, itemId]);
      setActiveBoxValues({
        ...activeBoxValues,
        [itemId.toString()]: 1,
      });
    } else {
      setActiveBox(activeBox.filter((boxId) => boxId !== itemId));
      setActiveBoxValues(omit(activeBoxValues, [itemId]));
    }
  };

  /**
   * Function to handle resize action of a box. The function will be called **AFTER** the
   * user stopped resizing the box.
   * @param {number} width
   * @param {string} itemId
   */
  const handleBoxResize = (width, itemId) => {
    const [row, col] = itemId.split(DELIMITER);

    // disable resize if the next column is filled
    if (activeBox.includes(`${row}${DELIMITER}${parseInt(col, 10) + 1}`)) {
      rerender();
      return;
    }

    const quotient = Math.floor(width / 32); // Whole number division
    const remainder = width % 32; // Rest of the division

    // Resize value: Difference (in grids) of the active box before and after resize event
    const resizeValue = quotient + (remainder > 0 ? 1 : 0);

    /**
     * Next position of the box
     * @example {resizeValue: 3; itemId: 1__2} -> nextPosition = 1__5
     */
    const nextPosition = parseInt(col, 10) + resizeValue - 1;

    const requirements = [
      activeBox.includes(nextPosition),
      nextPosition > gridLength,
    ];

    if (
      requirements.some(Boolean) // returns true if all of the `requirements` array is truthy
    ) {
      rerender();
      return;
    }

    setActiveBoxValues({
      ...activeBoxValues,
      [itemId]: resizeValue,
    });
  };

  /**
   * Play all of the active notes on the grid.
   */
  const handlePlay = () => {
    onPlay(trackNumber, withLoop);
  };

  /**
   * Clear all of the active box and its values.
   */
  const handleClear = () => {
    setActiveBox([]);
    setActiveBoxValues([]);
  };

  /**
   * Helper function to initialize an array of length
   * @param {number} length
   */
  const createArray = (length) => Array.from(Array(length));

  const filterOldBoxes = (box) => {
    const [rowIndex, colIndex] = box.split(DELIMITER);
    return (
      instrumentNotes.length > parseInt(rowIndex, 10) && colIndex < gridLength
    );
  };

  useEffect(() => {
    if (!firstRender.current) {
      rerender();
    } else {
      firstRender.current = false;
    }
  }, [activeBox, activeBoxValues]);

  useEffect(() => {
    if (!firstRender.current) {
      const newValue = activeBox.filter(filterOldBoxes);

      const newBoxValue = Object.keys(activeBoxValues).filter(filterOldBoxes);

      setActiveBox(newValue);
      setActiveBoxValues(
        newBoxValue
          .map((k) => ({ [k]: activeBoxValues[k] }))
          .reduce((a, b) => ({ ...a, ...b }), {}),
      );
    }
  }, [instrumentNotes, gridLength]);

  const color = `primary.${trackColor}`;
  const borderRadius = mini ? 0 : 0.5;
  const BOX_SIZE = mini ? 10 : 24;

  return (
    <Stack className={mini ? 'grid-item--mini' : ''}>
      <Stack
        direction="row"
        alignItems="flex-end"
        paddingBottom={2}
        spacing={5}
      >
        {
          !mini
           && (
           <GridControl
             {...{
               handlePlay,
               color,
               handleTempo,
               setGridLength,
               setInstrument,
               trackName,
               handleClear,
               tempo,
               gridLength,
               instrument,
               setWithLoop,
             }}
           />
           )
        }
      </Stack>
      <Stack spacing={mini ? 0 : 0.25} key={key} position="relative">
        {mini && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 12,
            }}
          />
        )}
        {instrumentNotes.map((note, rowIndex) => (
          <Stack
            width="fit-content"
            spacing={mini ? 0 : 0.25}
            direction="row"
            alignItems="center"
            key={`row-${rowIndex}`}
            sx={{
              borderRadius,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'transparent',
              '&:hover': {
                borderColor: color,
                transition: '200ms',
              },
              bgcolor: mini ? 'primary.dark' : 'transparent',
            }}
          >
            {!mini && (
              <Box
                height={BOX_SIZE}
                width={50}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                color={color}
              >
                {note.replace('s', '#')}
              </Box>
            )}
            {createArray(gridLength).map((s, columnIndex) => {
              const id = `${rowIndex}${DELIMITER}${columnIndex}`;
              const idValue = activeBoxValues[id];
              return (
                <React.Fragment key={`col-${columnIndex}`}>
                  <Box
                    width={mini ? 12 : BOX_SIZE}
                    height={BOX_SIZE}
                    borderRadius={0.5}
                    sx={{
                      backgroundColor: 'primary.dark',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        opacity: [0.9, 0.8, 0.7],
                      },
                    }}
                    onClick={() => toggleActive(id)}
                  >
                    {activeBox.includes(id) && idValue ? (
                      <ResizableBox
                        height={BOX_SIZE}
                        width={idValue * BOX_SIZE + (idValue - 1) * 2}
                        axis="x"
                        onResizeStop={(event, { size }) => {
                          handleBoxResize(size.width, id);
                        }}
                      >
                        <Box
                          bgcolor={color}
                          height="100%"
                          width="100%"
                          borderRadius={0.5}
                        />
                      </ResizableBox>
                    ) : null}
                  </Box>
                </React.Fragment>
              );
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

GridItem.propTypes = {
  trackNumber: PropTypes.number.isRequired,
  trackColor: PropTypes.string,
  onPlay: PropTypes.func.isRequired,
  trackName: PropTypes.string,
  mini: PropTypes.bool,
};

GridItem.defaultProps = {
  trackColor: 'yellow',
  trackName: 'Track 1',
  mini: false,
};

export default GridItem;
