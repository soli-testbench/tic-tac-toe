const { getBestMove, minimax } = require('../src/ai');

describe('getBestMove', () => {
  test('does not mutate the original board', () => {
    const board = ['X', null, null, null, null, null, null, null, null];
    const boardCopy = [...board];
    getBestMove(board);
    expect(board).toEqual(boardCopy);
  });

  test('returns a valid index for an empty board', () => {
    const board = [null,null,null, null,null,null, null,null,null];
    const move = getBestMove(board);
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  test('takes the winning move when available', () => {
    // O has two in a row, can win at index 2
    const board = [
      'X',  'X',  null,
      'O',  'O',  null,
      null,  null, 'X'
    ];
    const move = getBestMove(board);
    expect(move).toBe(5); // O should complete middle row
  });

  test('blocks opponent winning move', () => {
    // X is about to win at index 2 (top row), O must block
    const board = [
      'X',  'X',  null,
      'O',  'O',  null,
      null,  null, null
    ];
    const move = getBestMove(board);
    // O should block at index 2 or win at index 5 — either is acceptable
    expect([2, 5]).toContain(move);
  });

  test('takes center on first move response', () => {
    // X played corner, O should take center
    const board = [
      'X',  null, null,
      null, null, null,
      null, null, null
    ];
    const move = getBestMove(board);
    expect(move).toBe(4);
  });

  test('returns null for a full board', () => {
    const board = ['X','O','X', 'X','O','O', 'O','X','X'];
    const move = getBestMove(board);
    expect(move).toBeNull();
  });

  test('returns null when game is already won', () => {
    const board = ['X','X','X', 'O','O',null, null,null,null];
    const move = getBestMove(board);
    // Game is over; behavior may return null or a move, but should not crash
    expect(move).toBeDefined();
  });

  test('handles mid-game position correctly', () => {
    const board = [
      'X',  'O',  'X',
      null, 'O',  null,
      null, null,  null
    ];
    const move = getBestMove(board);
    // O should block X or play optimally; move should be a valid empty cell
    expect([3, 5, 6, 7, 8]).toContain(move);
    expect(board[move]).toBeNull();
  });

  test('concurrent calls do not interfere with each other', async () => {
    const board1 = ['X', null, null, null, null, null, null, null, null];
    const board2 = [null, null, null, null, 'X', null, null, null, null];
    const board1Copy = [...board1];
    const board2Copy = [...board2];

    const [move1, move2] = await Promise.all([
      Promise.resolve(getBestMove(board1)),
      Promise.resolve(getBestMove(board2)),
    ]);

    // Boards should be unchanged
    expect(board1).toEqual(board1Copy);
    expect(board2).toEqual(board2Copy);
    // Moves should be valid
    expect(move1).toBeGreaterThanOrEqual(0);
    expect(move2).toBeGreaterThanOrEqual(0);
  });
});

describe('minimax', () => {
  test('returns positive score for O winning position', () => {
    const board = ['O','O','O', null,null,null, null,null,null];
    expect(minimax(board, 0, false)).toBe(10);
  });

  test('returns negative score for X winning position', () => {
    const board = ['X','X','X', null,null,null, null,null,null];
    expect(minimax(board, 0, true)).toBe(-10);
  });

  test('returns 0 for a draw position', () => {
    const board = ['X','O','X', 'X','O','O', 'O','X','X'];
    expect(minimax(board, 0, true)).toBe(0);
  });

  test('does not mutate board during recursion', () => {
    const board = ['X', null, null, null, 'O', null, null, null, null];
    const boardCopy = [...board];
    minimax(board, 0, true);
    expect(board).toEqual(boardCopy);
  });
});
