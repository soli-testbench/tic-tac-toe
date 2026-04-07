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
    const move = getBestMove(board);
    if (move !== null) {
      res.json({ move });
    }
  } catch (err) {
    console.error('AI move error:', err);
    res.status(500).json({ error: 'Failed to compute AI move' });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const { result, moves } = req.body;
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
