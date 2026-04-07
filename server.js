const express = require('express');
const path = require('path');
const { getBestMove } = require('./src/ai');
const { initDb, saveGame, getGames } = require('./src/db');
const { validateBoard, validateGameResult } = require('./src/validation');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/ai-move', (req, res) => {
  try {
    const { board } = req.body;

    const validation = validateBoard(board);
    if (!validation.valid) {
      console.error('AI move validation error:', validation.error);
      return res.status(400).json({ error: validation.error });
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

    const validation = validateGameResult(result, moves);
    if (!validation.valid) {
      console.error('Save game validation error:', validation.error);
      return res.status(400).json({ error: validation.error });
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

/* istanbul ignore next */
if (require.main === module) {
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
}

module.exports = app;
