const { checkWinner, isBoardFull } = require('./game');

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        // Make move on a copy to avoid mutating the caller's board
        const newBoard = board.slice();
        newBoard[i] = 'O';
        const score = minimax(newBoard, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        // Make move on a copy to avoid mutating the caller's board
        const newBoard = board.slice();
        newBoard[i] = 'X';
        const score = minimax(newBoard, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getBestMove(board) {
  // Work on a copy so the caller's board is never mutated
  const boardCopy = board.slice();
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (boardCopy[i] === null) {
      const newBoard = boardCopy.slice();
      newBoard[i] = 'O';
      const score = minimax(newBoard, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

module.exports = { getBestMove };
