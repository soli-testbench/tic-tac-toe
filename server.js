const express = require('express');
const path = require('path');
const { getBestMove } = require('./src/ai');
const { initDb, saveGame, getGames } = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/ai-move', (req, res) => {
  try {
    const { board } = req.body;

    if (!Array.isArray(board)) {
      return res.status(400).json({ error: 'board must be an array' });
    }
    if (board.length !== 9) {
      return res.status(400).json({ error: 'board must have exactly 9 cells' });
    }
    const validValues = [null, 'X', 'O'];
    for (let i = 0; i < board.length; i++) {
      if (!validValues.includes(board[i])) {
        return res.status(400).json({ error: `Invalid cell value at index ${i}: must be null, "X", or "O"` });
      }
    }

    const move = getBestMove(board);
    if (move !== null) {
      res.json({ move });
    } else {
      res.json({ move: null });
    }
  } catch (err) {
    console.error('AI move error:', err);
    res.status(500).json({ error: 'Failed to compute AI move' });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const { result, moves } = req.body;

    const validResults = ['X', 'O', 'draw'];
    if (!validResults.includes(result)) {
      return res.status(400).json({ error: 'result must be "X", "O", or "draw"' });
    }
    if (!Array.isArray(moves)) {
      return res.status(400).json({ error: 'moves must be an array' });
    }
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (!move || typeof move !== 'object') {
        return res.status(400).json({ error: `Invalid move at index ${i}: must be an object` });
      }
      if (!['X', 'O'].includes(move.player)) {
        return res.status(400).json({ error: `Invalid player at move index ${i}: must be "X" or "O"` });
      }
      if (typeof move.position !== 'number' || move.position < 0 || move.position > 8 || !Number.isInteger(move.position)) {
        return res.status(400).json({ error: `Invalid position at move index ${i}: must be an integer 0-8` });
      }
    }

    const game = await saveGame(result, moves);
    res.json(game);
  } catch (err) {
    console.error('Save game error:', err);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const games = await getGames();
    res.json(games);
  } catch (err) {
    console.error('Get games error:', err);
    res.status(500).json({ error: 'Failed to get games' });
  }
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (without database)`);
  });
});
