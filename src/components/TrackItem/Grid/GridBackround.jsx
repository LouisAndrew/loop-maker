/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import omit from 'lodash.omit';
import { ResizableBox } from 'react-resizable';

const GridBackround = () => {
  const DELIMITER = '__';
  const GRID_ROWS = 8;
  const GRID_COLS = 16;

  /**
   * @type {[String[], | React.SetStateAction]}
   */
  const [activeBox, setActiveBox] = useState([]);
  /**
   * @type {[{[key: string]: number}, React.SetStateAction]}
   */
  const [activeBoxValues, setActiveBoxValues] = useState({});

  const [key, setKey] = useState(Math.random());
  const firstRender = useRef(true);

  const rerender = () => setKey(Math.random());

  /**
   *
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
   *
   * @param {number} width
   * @param {string} itemId
   */
  const handleBoxResize = (width, itemId) => {
    const [row, col] = itemId.split(DELIMITER);
    if (activeBox.includes(`${row}${DELIMITER}${parseInt(col, 10) + 1}`)) {
      rerender();
      return;
    }

    const quotient = Math.floor(width / 32);
    const remainder = width % 32;
    if (quotient === 0) {
      toggleActive(itemId);
      return;
    }

    const value = quotient + (remainder > 0 ? 1 : 0);

    if (activeBox.includes(`${row}${DELIMITER}${parseInt(col, 10) + value - 1}`)) {
      rerender();
      return;
    }

    setActiveBoxValues((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  /**
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
      {createArray(GRID_ROWS).map((_, index) => (
        <Stack direction="row" spacing={0.25} key={`row-${index}`}>
          {createArray(GRID_COLS).map((s, columnIndex) => {
            const id = `${index}${DELIMITER}${columnIndex}`;
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
                {activeBox.includes(id) && idValue ? (
                  <ResizableBox
                    height={30}
                    width={idValue * 30 + (idValue - 1) * 2}
                    axis="x"
                    draggableOpts={{ grid: [32] }}
                    // eslint-disable-next-line no-shadow
                    onResizeStop={(_, { size }) => {
                      handleBoxResize(size.width, id);
                    }}
                  >
                    <Box sx={{ height: '100%', width: '100%', backgroundColor: '#faa' }} />
                  </ResizableBox>
                ) : null}
              </Box>
            );
          })}
        </Stack>
      ))}
      <ResizableBox className="box" width={200} height={200}>
        <span className="text">{'<ResizableBox>, same as above.'}</span>
      </ResizableBox>
    </Stack>
  );
};

export default GridBackround;
