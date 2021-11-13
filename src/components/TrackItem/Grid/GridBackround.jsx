/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Stack, Box } from '@mui/material';

const GridBackround = () => {
  const GRID_ROWS = 8;
  const GRID_COLS = 16;

  /**
   * @param {number} length
   */
  const createArray = (length) => Array.from(Array(length));

  return (
    <Stack
      container
      spacing={0.25}
    >
      {createArray(GRID_ROWS).map((_, index) => (
        <Stack direction="row" spacing={0.25} key={`row-${index}`}>
          {
            createArray(GRID_COLS).map((s, columnIndex) => (
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
              />
            ))
          }
        </Stack>
      ))}
    </Stack>
  );
};

export default GridBackround;
