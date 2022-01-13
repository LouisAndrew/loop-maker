/* eslint-disable react/require-default-props */
import React from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Checkbox,
  Slider,
  FormGroup,
  Stack,
  Box,
} from '@mui/material';
import propTypes from 'prop-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { INSTRUMENTS } from '../../../const';

const GridControl = ({
  handleClear,
  handlePlay,
  color,
  setWithLoop,
  trackName,
  tempo,
  handleTempo,
  gridLength,
  setGridLength,
  instrument,
  setInstrument,
}) => (
  <>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      spacing={3}
    >
      {trackName && (
      <>
        <Link to="/">
          <IconButton aria-label="back" sx={{ color }}>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Typography
          color={color}
          variant="h5"
          fontWeight="bold"
          sx={{ marginLeft: '14px' }}
        >
          {trackName}
        </Typography>
      </>
      )}
      <Button
        onClick={handlePlay}
        sx={{
          backgroundColor: color,
          marginLeft: '28px',
          marginRight: '14px',
          '&:hover': { backgroundColor: color },
        }}
      >
        Play
      </Button>
      {handleClear && (
      <Button
        onClick={handleClear}
        variant="outlined"
        sx={{ color, borderColor: color }}
      >
        Clear
      </Button>
      )}
      {setWithLoop && (
        <FormGroup>
          <FormControlLabel
            control={(
              <Checkbox
                onChange={(e) => {
                  setWithLoop(e.target.checked);
                }}
                sx={{
                  color,
                  '&.Mui-checked': {
                    color,
                  },
                }}
              />
          )}
            sx={{ color }}
            label="Loop"
          />
        </FormGroup>
      )}
    </Stack>
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
            onChange={handleTempo}
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

      {instrument && (
      <Box sx={{ width: 64 }}>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel id="instrument" sx={{ color }}>
            Instrument
          </InputLabel>
          <Select
            labelId="instrument"
            id="instrument-input"
            value={instrument}
            defaultValue="piano"
            label="Instrument"
            autoWidth
            variant="filled"
            onChange={(e) => setInstrument(e.target.value)}
            sx={{ color }}
          >
            {INSTRUMENTS.map((instrumentData) => (
              <MenuItem value={instrumentData} key={instrumentData}>
                {instrumentData}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      )}
    </Stack>
  </>
);

GridControl.propTypes = {
  handleClear: propTypes.func.isRequired,
  handlePlay: propTypes.func.isRequired,
  color: propTypes.string.isRequired,
  setWithLoop: propTypes.func.isRequired,
  trackName: propTypes.string,
  tempo: propTypes.number,
  handleTempo: propTypes.func.isRequired,
  gridLength: propTypes.number,
  setGridLength: propTypes.func.isRequired,
  instrument: propTypes.string,
  setInstrument: propTypes.func,
};

export default GridControl;
