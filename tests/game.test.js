const { checkWinner, isBoardFull } = require('../src/game');

describe('checkWinner', () => {
  // All 8 winning lines for X
  test('detects X wins on top row [0,1,2]', () => {
    const board = ['X','X','X', null,null,null, null,null,null];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X wins on middle row [3,4,5]', () => {
    const board = [null,null,null, 'X','X','X', null,null,null];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X wins on bottom row [6,7,8]', () => {
    const board = [null,null,null, null,null,null, 'X','X','X'];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X wins on left column [0,3,6]', () => {
    const board = ['X',null,null, 'X',null,null, 'X',null,null];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X wins on middle column [1,4,7]', () => {
    const board = [null,'X',null, null,'X',null, null,'X',null];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X wins on right column [2,5,8]', () => {
    const board = [null,null,'X', null,null,'X', null,null,'X'];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X wins on main diagonal [0,4,8]', () => {
    const board = ['X',null,null, null,'X',null, null,null,'X'];
    expect(checkWinner(board)).toBe('X');
  });

  test('detects X wins on anti-diagonal [2,4,6]', () => {
    const board = [null,null,'X', null,'X',null, 'X',null,null];
    expect(checkWinner(board)).toBe('X');
  });

  // Winning lines for O
  test('detects O wins on top row', () => {
    const board = ['O','O','O', null,null,null, null,null,null];
    expect(checkWinner(board)).toBe('O');
  });

  test('detects O wins on diagonal', () => {
    const board = ['O',null,null, null,'O',null, null,null,'O'];
    expect(checkWinner(board)).toBe('O');
  });

  // No winner cases
  test('returns null for empty board', () => {
    const board = [null,null,null, null,null,null, null,null,null];
    expect(checkWinner(board)).toBeNull();
  });

  test('returns null for draw board', () => {
    const board = ['X','O','X', 'X','O','O', 'O','X','X'];
    expect(checkWinner(board)).toBeNull();
  });

  test('returns null for partially filled board with no winner', () => {
    const board = ['X','O',null, null,'X',null, null,null,null];
    expect(checkWinner(board)).toBeNull();
  });
});

describe('isBoardFull', () => {
  test('returns true for a full board', () => {
    const board = ['X','O','X', 'X','O','O', 'O','X','X'];
    expect(isBoardFull(board)).toBe(true);
  });

  test('returns false for an empty board', () => {
    const board = [null,null,null, null,null,null, null,null,null];
    expect(isBoardFull(board)).toBe(false);
  });

  test('returns false for a partially filled board', () => {
    const board = ['X','O',null, null,'X',null, null,null,'O'];
    expect(isBoardFull(board)).toBe(false);
  });

  test('returns false with single empty cell', () => {
    const board = ['X','O','X', 'X','O','O', 'O','X',null];
    expect(isBoardFull(board)).toBe(false);
  });
});
