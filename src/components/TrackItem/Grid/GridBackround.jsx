/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import omit from 'lodash.omit';
import { ResizableBox } from 'react-resizable';
import PropTypes from 'prop-types';

const GridBackround = ({ trackColor = 'yellow' }) => {
  const DELIMITER = '__';
  const GRID_ROWS = 8;
  const GRID_COLS = 16;

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

    const requirements = [activeBox.includes(nextPosition), nextPosition >= GRID_COLS];

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
    <Stack spacing={0.25} key={key}>
      {createArray(GRID_ROWS).map((_, rowIndex) => (
        <Stack direction="row" spacing={0.25} key={`row-${rowIndex}`}>
          {createArray(GRID_COLS).map((s, columnIndex) => {
            const id = `${rowIndex}${DELIMITER}${columnIndex}`;
            const idValue = activeBoxValues[id];
            return (
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: 'primary.dark',
                  borderRadius: 0.5,
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
                key={`col-${columnIndex}`}
                onClick={() => toggleActive(id)}
              >
                {activeBox.includes(id) && idValue ? (
                  <ResizableBox
                    height={30}
                    width={idValue * 30 + (idValue - 1) * 2}
                    axis="x"
                    handleSize={[10, 10]}
                    draggableOpts={{ grid: [32] }}
                    onResizeStop={(event, { size }) => {
                      handleBoxResize(size.width, id);
                    }}
                  >
                    <Box
                      bgcolor={`primary.${trackColor}`}
                      height="100%"
                      width="100%"
                      borderRadius={0.5}
                    />
                  </ResizableBox>
                ) : null}
              </Box>
            );
          })}
        </Stack>
      ))}
    </Stack>
  );
};

GridBackround.propTypes = {
  trackColor: PropTypes.string,
};

GridBackround.defaultProps = {
  trackColor: 'yellow',
};

export default GridBackround;
