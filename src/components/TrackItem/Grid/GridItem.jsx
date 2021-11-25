/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Stack, Box, Button } from '@mui/material';
import omit from 'lodash.omit';
import { ResizableBox } from 'react-resizable';
import PropTypes from 'prop-types';
import {
  NOTES, DELIMITER, GRID_COLS, GRID_ROWS,
} from './const';

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

  const [key, setKey] = useState(Math.random());
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

  const handlePlay = () => {
    onPlay(
      activeBox.map((box) => `${box}${DELIMITER}${activeBoxValues[box] ?? 0}`),
    );
  };

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

  return (
    <Stack padding={4}>
      <Stack direction="row" paddingBottom={2}>
        <Button onClick={handlePlay} display="block" sx={{ marginRight: 1 }}>Play</Button>
        <Button onClick={handleClear} variant="outlined">
          Clear
        </Button>
      </Stack>
      <Stack
        spacing={0.25}
        key={key}
      >
        {createArray(GRID_ROWS).map((_, rowIndex) => {
          const SHADES = ['', '_darker'];
          const color = rowIndex % 7 === 0 ? `primary.${trackColor}_c` : `primary.${trackColor}${
            SHADES[Math.floor(rowIndex / 7)]
          }`;
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
                height={30}
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
                      width={30}
                      height={30}
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
                          height={30}
                          width={idValue * 30 + (idValue - 1) * 2}
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
