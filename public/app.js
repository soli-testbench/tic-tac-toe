const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const historyDiv = document.getElementById('history');

let board = Array(9).fill(null);
let gameOver = false;
let aiThinking = false;
let moves = [];

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i] || '';
    cell.className = 'cell';
    if (board[i] === 'X') cell.classList.add('x');
    if (board[i] === 'O') cell.classList.add('o');
    if (board[i] || gameOver || aiThinking) cell.classList.add('disabled');
  });
}

function checkWinner(b) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b2, c] of lines) {
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
  }
  return null;
}

function isBoardFull(b) {
  return b.every(cell => cell !== null);
}

async function makeAiMove() {
  aiThinking = true;
  render();
  status.textContent = 'AI is thinking...';

  try {
    const response = await fetch('/api/ai-move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board })
    });

    const data = await response.json();

    if (data.move !== undefined && data.move !== null && board[data.move] === null) {
      board[data.move] = 'O';
      moves.push({ player: 'O', position: data.move });

      const winner = checkWinner(board);
      if (winner) {
        gameOver = true;
        status.textContent = 'AI wins!';
        saveGame('O');
      } else if (isBoardFull(board)) {
        gameOver = true;
        status.textContent = "It's a draw!";
        saveGame('draw');
      } else {
        status.textContent = 'Your turn (X)';
      }
    } else {
      status.textContent = 'AI error - Your turn (X)';
    }
  } catch (err) {
    console.error('AI move failed:', err);
    status.textContent = 'AI error - try again';
  }

  aiThinking = false;
  render();
}

function handleCellClick(e) {
  const index = parseInt(e.target.dataset.index);
  if (board[index] || gameOver || aiThinking) return;

  board[index] = 'X';
  moves.push({ player: 'X', position: index });

  const winner = checkWinner(board);
  if (winner) {
    gameOver = true;
    status.textContent = 'You win!';
    render();
    saveGame('X');
    return;
  }

  if (isBoardFull(board)) {
    gameOver = true;
    status.textContent = "It's a draw!";
    render();
    saveGame('draw');
    return;
  }

  render();
  makeAiMove();
}

function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  aiThinking = false;
  moves = [];
  status.textContent = 'Your turn (X)';
  render();
}

async function saveGame(result) {
  try {
    await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, moves })
    });
    loadHistory();
  } catch (err) {
    console.error('Failed to save game:', err);
  }
}

async function loadHistory() {
  try {
    const response = await fetch('/api/games');
    const games = await response.json();

    if (games.length === 0) {
      historyDiv.innerHTML = '';
      return;
    }

    historyDiv.innerHTML = '';
    const heading = document.createElement('h3');
    heading.textContent = 'Recent Games';
    historyDiv.appendChild(heading);
    games.slice(0, 10).forEach(g => {
      const resultText = g.result === 'X' ? 'You won' : g.result === 'O' ? 'AI won' : 'Draw';
      const date = new Date(g.played_at).toLocaleDateString();
      const item = document.createElement('div');
      item.className = 'history-item';
      item.textContent = `${resultText} - ${date}`;
      historyDiv.appendChild(item);
    });
  } catch (err) {
    console.error('Failed to load history:', err);
  }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

render();
loadHistory();
