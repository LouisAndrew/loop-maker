/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import omit from 'lodash.omit';

const GridBackround = () => {
  const GRID_ROWS = 8;
  const GRID_COLS = 16;

  const [activeBox, setActiveBox] = useState([]);
  const [activeBoxValues, setActiveBoxValues] = useState({});

  /**
   *
   * @param {string} itemId
   */
  const toggleActive = (itemId) => {
    if (!activeBox.includes(itemId)) {
      setActiveBox([...activeBox, itemId]);
      setActiveBoxValues({
        ...activeBoxValues,
        [itemId]: 1,
      });
    } else {
      setActiveBox(activeBox.filter((boxId) => boxId !== itemId));
      setActiveBoxValues(omit(activeBox, itemId));
    }
  };

  /**
   * @param {number} length
   */
  const createArray = (length) => Array.from(Array(length));

  return (
    <Stack
      spacing={0.25}
    >
      {createArray(GRID_ROWS).map((_, index) => (
        <Stack direction="row" spacing={0.25} key={`row-${index}`}>
          {
            createArray(GRID_COLS).map((s, columnIndex) => {
              const id = `${index};${columnIndex}`;
              const idValue = activeBoxValues[id];
              return (
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                  key={`col-${columnIndex}`}
                  onClick={() => toggleActive(id)}
                >
                  {activeBox.includes(id) && idValue
                    ? (
                      <Box sx={{
                        width: idValue * 30 + (idValue - 1) * 2,
                        height: 30,
                        backgroundColor: '#faa',
                        position: 'relative',
                        zIndex: 100,
                      }}
                      />
                    ) : null}
                </Box>
              );
            })
          }
        </Stack>
      ))}
    </Stack>
  );
};

export default GridBackround;
