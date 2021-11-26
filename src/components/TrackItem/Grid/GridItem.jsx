/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Stack, Box, Button } from '@mui/material';
import omit from 'lodash.omit';
import { ResizableBox } from 'react-resizable';
import PropTypes from 'prop-types';
import {
  NOTES, DELIMITER, GRID_COLS, GRID_ROWS, BASE_NOTES,
} from './const';

/**
 * Grid item where user can clicks on the grid and assign an active note.
 * ![documentation](./docs/GridItem.jpeg)
 */
const GridItem = ({ trackColor = 'yellow', onPlay }) => {
  /**
   * Array of active box positions.
   * @example [1__2, 2__3]
   * @type {[String[], | React.SetStateAction]}
   */
  const [activeBox, setActiveBox] = useState([]);

  /**
   * Array of the values (length in number of grids taken) of the active box.
   * @example { '1__2': 1, '2__3': 2 }
   * @type {[{[key: string]: number}, React.SetStateAction]}
   */
  const [activeBoxValues, setActiveBoxValues] = useState({});

  /**
   * Key of the whole component (Used to rerender the grids).
   * @type {[string]}
   */
  const [key, setKey] = useState(Math.random());

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
      setActiveBox((prev) => prev.filter((boxId) => boxId !== itemId));
      setActiveBoxValues((prev) => omit(prev, [itemId]));
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
      nextPosition >= GRID_COLS,
    ];

    if (
      requirements.some(Boolean) // returns true if all of the `requirements` array is truthy
    ) {
      rerender();
      return;
    }

    setActiveBoxValues((prev) => ({
      ...prev,
      [itemId]: resizeValue,
    }));
  };

  /**
   * Play all of the active notes on the grid.
   */
  const handlePlay = () => {
    onPlay(
      activeBox.map((box) => `${box}${DELIMITER}${activeBoxValues[box] ?? 0}`),
    );
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

  useEffect(() => {
    if (!firstRender.current) {
      rerender();
    } else {
      firstRender.current = false;
    }
  }, [activeBox, activeBoxValues]);

  const baseColor = `primary.${trackColor}`;
  const BOX_SIZE = 25;

  return (
    <Stack padding={4}>
      <Stack direction="row" spacing={1} paddingBottom={2}>
        <Button
          onClick={handlePlay}
          sx={{
            backgroundColor: baseColor,
            '&:hover': { backgroundColor: baseColor },
          }}
        >
          Play
        </Button>
        <Button
          onClick={handleClear}
          variant="outlined"
          sx={{ color: baseColor, borderColor: baseColor }}
        >
          Clear
        </Button>
      </Stack>
      <Stack spacing={0.25} key={key}>
        {createArray(GRID_ROWS).map((_, rowIndex) => {
          const SHADES = ['', '_darker'];
          const color = rowIndex % BASE_NOTES.length === 0
            ? `${baseColor}_c`
            : `${baseColor}${SHADES[Math.floor(rowIndex / BASE_NOTES.length)]}`;
          return (
            <Stack
              width="fit-content"
              spacing={0.25}
              direction="row"
              alignItems="center"
              key={`row-${rowIndex}`}
              sx={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'transparent',
                borderRadius: 0.5,
                '&:hover': {
                  borderColor: color,
                  transition: '200ms',
                },
              }}
            >
              <Box
                height={BOX_SIZE}
                width={50}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                color={color}
              >
                {NOTES[rowIndex]}
              </Box>
              {createArray(GRID_COLS).map((s, columnIndex) => {
                const id = `${rowIndex}${DELIMITER}${columnIndex}`;
                const idValue = activeBoxValues[id];
                return (
                  <React.Fragment key={`col-${columnIndex}`}>
                    <Box
                      width={BOX_SIZE}
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
                          handleSize={[10, 10]}
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
          );
        })}
      </Stack>
    </Stack>
  );
};

GridItem.propTypes = {
  trackColor: PropTypes.string,
  onPlay: PropTypes.func.isRequired,
};

GridItem.defaultProps = {
  trackColor: 'yellow',
};

export default GridItem;
