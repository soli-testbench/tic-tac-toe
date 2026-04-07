const { checkWinner } = require('./game');

function validateBoard(board) {
  if (!Array.isArray(board)) {
    return { valid: false, error: 'Board must be an array' };
  }

  if (board.length !== 9) {
    return { valid: false, error: 'Board must have exactly 9 cells' };
  }

  const validValues = [null, 'X', 'O'];
  for (let i = 0; i < 9; i++) {
    if (!validValues.includes(board[i])) {
      return { valid: false, error: `Invalid cell value at index ${i}: expected null, "X", or "O", got ${JSON.stringify(board[i])}` };
    }
  }

  const xCount = board.filter(c => c === 'X').length;
  const oCount = board.filter(c => c === 'O').length;

  if (oCount > xCount) {
    return { valid: false, error: 'Invalid board state: O has more moves than X (X always goes first)' };
  }

  if (xCount - oCount > 1) {
    return { valid: false, error: 'Invalid board state: X has more than one extra move over O' };
  }

  const winner = checkWinner(board);
  if (winner === 'X' && xCount === oCount) {
    return { valid: false, error: 'Invalid board state: X has won but O played after the winning move' };
  }
  if (winner === 'O' && xCount > oCount) {
    return { valid: false, error: 'Invalid board state: O has won but X played after the winning move' };
  }

  return { valid: true };
}

function validateGameResult(result, moves) {
  const validResults = ['X', 'O', 'draw'];
  if (!validResults.includes(result)) {
    return { valid: false, error: `Invalid result: expected "X", "O", or "draw", got ${JSON.stringify(result)}` };
  }

  if (moves !== undefined && moves !== null) {
    if (!Array.isArray(moves)) {
      return { valid: false, error: 'Moves must be an array if provided' };
    }

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (typeof move !== 'object' || move === null) {
        return { valid: false, error: `Invalid move at index ${i}: each move must be an object` };
      }
    }
  }

  return { valid: true };
}

module.exports = { validateBoard, validateGameResult };
