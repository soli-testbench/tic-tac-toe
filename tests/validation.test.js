const { validateBoard, validateGameResult } = require('../src/validation');

describe('validateBoard', () => {
  test('accepts a valid empty board', () => {
    const board = [null,null,null, null,null,null, null,null,null];
    expect(validateBoard(board)).toEqual({ valid: true });
  });

  test('accepts a valid mid-game board', () => {
    const board = ['X', null, 'O', null, 'X', null, null, null, null];
    expect(validateBoard(board)).toEqual({ valid: true });
  });

  test('rejects non-array input', () => {
    expect(validateBoard('not an array').valid).toBe(false);
    expect(validateBoard(123).valid).toBe(false);
    expect(validateBoard(null).valid).toBe(false);
    expect(validateBoard(undefined).valid).toBe(false);
    expect(validateBoard({}).valid).toBe(false);
  });

  test('rejects wrong length array', () => {
    expect(validateBoard([null, null]).valid).toBe(false);
    expect(validateBoard([null,null,null,null,null,null,null,null,null,null]).valid).toBe(false);
    expect(validateBoard([]).valid).toBe(false);
  });

  test('rejects invalid cell values', () => {
    const board = ['X', 'O', 'Z', null, null, null, null, null, null];
    const result = validateBoard(board);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid cell value');
  });

  test('rejects board with numbers instead of null', () => {
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    expect(validateBoard(board).valid).toBe(false);
  });

  test('rejects board where O has more moves than X', () => {
    const board = ['O', 'O', null, null, null, null, null, null, null];
    const result = validateBoard(board);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('O has more moves than X');
  });

  test('rejects board where X has more than one extra move', () => {
    const board = ['X', 'X', 'X', null, null, null, null, null, null];
    const result = validateBoard(board);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('more than one extra move');
  });

  test('rejects board where X won but O played after', () => {
    // X wins top row, but X count == O count means O played after X won
    const board = ['X', 'X', 'X', 'O', 'O', 'O', null, null, null];
    const result = validateBoard(board);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('X has won');
  });

  test('rejects board where O won but X played after', () => {
    // O wins left column, X has 4 moves vs O's 3 means X played after O won
    const board = ['O', 'X', 'X', 'O', 'X', null, 'O', null, 'X'];
    const result = validateBoard(board);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('O has won');
  });

  test('accepts a valid board where X just won', () => {
    // X wins top row, X has 3 moves, O has 2
    const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    expect(validateBoard(board)).toEqual({ valid: true });
  });

  test('accepts a valid board where O just won', () => {
    // O wins top row, X has 3, O has 3 (X went first so it's equal count)
    const board = ['O', 'O', 'O', 'X', 'X', null, null, null, 'X'];
    expect(validateBoard(board)).toEqual({ valid: true });
  });
});

describe('validateGameResult', () => {
  test('accepts valid result "X"', () => {
    expect(validateGameResult('X', [])).toEqual({ valid: true });
  });

  test('accepts valid result "O"', () => {
    expect(validateGameResult('O', [])).toEqual({ valid: true });
  });

  test('accepts valid result "draw"', () => {
    expect(validateGameResult('draw', [])).toEqual({ valid: true });
  });

  test('accepts null moves', () => {
    expect(validateGameResult('X', null)).toEqual({ valid: true });
  });

  test('accepts undefined moves', () => {
    expect(validateGameResult('X', undefined)).toEqual({ valid: true });
  });

  test('rejects invalid result values', () => {
    expect(validateGameResult('win', []).valid).toBe(false);
    expect(validateGameResult('', []).valid).toBe(false);
    expect(validateGameResult(null, []).valid).toBe(false);
    expect(validateGameResult(123, []).valid).toBe(false);
  });

  test('rejects non-array moves', () => {
    const result = validateGameResult('X', 'not array');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Moves must be an array');
  });

  test('rejects moves with non-object entries', () => {
    const result = validateGameResult('X', ['invalid']);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('each move must be an object');
  });

  test('accepts moves with valid objects', () => {
    const moves = [{ player: 'X', position: 0 }, { player: 'O', position: 4 }];
    expect(validateGameResult('X', moves)).toEqual({ valid: true });
  });
});
