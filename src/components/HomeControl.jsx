import React from 'react';
import {
  Stack, Box, InputLabel, Slider, FormControl, Select, MenuItem,
} from '@mui/material';

import { useTracks } from '../hooks/useTracks';

const HomeControl = () => {
  const {
    tempo,
    gridLength, getSetter,
  } = useTracks();

  const { setTempo, setGridLength } = getSetter(1);
  const color = '#fff';

  return (
    <div>
      <Stack direction="row" alignItems="flex-end" spacing={1}>
        {tempo && (
        <Box sx={{ width: 120 }}>
          <InputLabel id="tempo" sx={{ color }}>
            Tempo:
            {' '}
            {tempo}
          </InputLabel>
          <Slider
            size="small"
            value={tempo}
            id="tempo"
            max={180}
            min={80}
            onChange={(_, newValue) => setTempo(newValue)}
            sx={{ color }}
          />
        </Box>
        )}
        {gridLength && (
        <Box sx={{ width: 80 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel id="grid-size" sx={{ color }}>
              Grid length:
              {gridLength}
            </InputLabel>
            <Select
              labelId="grid-size"
              id="grid-size-input"
              value={gridLength}
              label="Grid length"
              autoWidth
              variant="filled"
              onChange={(e) => setGridLength(parseInt(e.target.value, 10))}
              sx={{ color }}
            >
              {[32, 36, 40, 44, 48, 52].map((len) => (
                <MenuItem key={len} value={len}>
                  {len}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        )}
      </Stack>
    </div>
  );
};

export default HomeControl;
