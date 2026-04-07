const { getBestMove } = require('../src/ai');

describe('getBestMove', () => {
  test('returns a valid move index (0-8)', () => {
    const board = Array(9).fill(null);
    const move = getBestMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  test('never overwrites an occupied cell', () => {
    const board = ['X', 'O', 'X', 'O', null, null, null, null, null];
    const move = getBestMove(board);
    expect(board[move]).toBeNull();
  });

  test('does not mutate the input board', () => {
    const board = ['X', null, null, null, 'O', null, null, null, null];
    const boardCopy = board.slice();
    getBestMove(board);
    expect(board).toEqual(boardCopy);
  });

  test('takes the winning move when available', () => {
    // O can win by playing index 2
    const board = [null, 'X', null, 'X', null, null, 'O', 'O', null];
    const move = getBestMove(board);
    expect(move).toBe(8);
  });

  test('blocks opponent winning move', () => {
    // X is about to win on [0,4,8] by playing index 8; O must block
    const board = ['X', null, 'O', null, 'X', null, 'O', null, null];
    const move = getBestMove(board);
    expect(move).toBe(8);
  });

  test('returns null when board is full', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const move = getBestMove(board);
    expect(move).toBeNull();
  });

  test('only chooses from empty cells', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', null, null, null];
    const move = getBestMove(board);
    expect([6, 7, 8]).toContain(move);
  });

  test('handles board with single empty cell', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    const move = getBestMove(board);
    expect(move).toBe(8);
  });
});
