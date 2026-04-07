const { checkWinner, isBoardFull } = require('../src/game');

describe('checkWinner', () => {
  // Test all 8 winning configurations for X
  test('detects X win on top row [0,1,2]', () => {
    const board = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X win on middle row [3,4,5]', () => {
    const board = ['O', null, null, 'X', 'X', 'X', null, 'O', null];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X win on bottom row [6,7,8]', () => {
    const board = [null, 'O', null, null, 'O', null, 'X', 'X', 'X'];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X win on left column [0,3,6]', () => {
    const board = ['X', 'O', null, 'X', 'O', null, 'X', null, null];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X win on middle column [1,4,7]', () => {
    const board = ['O', 'X', null, null, 'X', null, null, 'X', 'O'];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X win on right column [2,5,8]', () => {
    const board = [null, 'O', 'X', null, null, 'X', null, 'O', 'X'];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X win on main diagonal [0,4,8]', () => {
    const board = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X win on anti-diagonal [2,4,6]', () => {
    const board = [null, 'O', 'X', null, 'X', null, 'X', null, 'O'];
    expect(checkWinner(board)).toBe('X');
  });

  // Test O winning
  test('detects O win', () => {
    const board = ['X', 'X', null, 'O', 'O', 'O', 'X', null, null];
    expect(checkWinner(board)).toBe('O');
  });

  // Test no winner
  test('returns null when no winner', () => {
    const board = ['X', 'O', 'X', null, null, null, null, null, null];
    expect(checkWinner(board)).toBeNull();
  });

  test('returns null for empty board', () => {
    const board = Array(9).fill(null);
    expect(checkWinner(board)).toBeNull();
  });
});

describe('isBoardFull', () => {
  test('returns true for a full board', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(isBoardFull(board)).toBe(true);
  });

  test('returns false for an empty board', () => {
    const board = Array(9).fill(null);
    expect(isBoardFull(board)).toBe(false);
  });

  test('returns false for a partially filled board', () => {
    const board = ['X', null, 'O', null, 'X', null, null, null, 'O'];
    expect(isBoardFull(board)).toBe(false);
  });
});
