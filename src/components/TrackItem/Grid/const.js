const BASE_NOTES = ['B', 'A', 'G', 'F', 'E', 'D', 'C#', 'C'];
const NOTES = ['C', ...BASE_NOTES, ...BASE_NOTES];
const DELIMITER = '__';
const GRID_ROWS = 17;
const GRID_COLS = 48;
const NOTATIONS = ['1n', '2n', '4n', '8n'];
const NOTATION_VALUES = {
  '1n': 8,
  '2n': 4,
  '4n': 2,
  '8n': 1,
};

export {
  NOTES, DELIMITER, GRID_COLS, GRID_ROWS, NOTATIONS, NOTATION_VALUES,
};
