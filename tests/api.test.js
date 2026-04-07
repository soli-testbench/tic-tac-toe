const request = require('supertest');
const app = require('../server');

describe('POST /api/ai-move', () => {
  test('returns a valid move for an empty board', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: [null,null,null, null,null,null, null,null,null] });
    expect(res.status).toBe(200);
    expect(res.body.move).toBeGreaterThanOrEqual(0);
    expect(res.body.move).toBeLessThanOrEqual(8);
  });

  test('returns a valid move for a mid-game board', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: ['X', null, null, null, 'O', null, null, null, null] });
    expect(res.status).toBe(200);
    expect(typeof res.body.move).toBe('number');
  });

  test('returns null move for a full board', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: ['X','O','X', 'X','O','O', 'O','X','X'] });
    expect(res.status).toBe(200);
    expect(res.body.move).toBeNull();
  });

  test('returns 400 for non-array board', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: 'not an array' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for wrong length board', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: [null, null] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('9 cells');
  });

  test('returns 400 for invalid cell values', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: ['X','O','Z', null,null,null, null,null,null] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid cell value');
  });

  test('returns 400 for invalid game state (O has more moves)', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: ['O','O',null, null,null,null, null,null,null] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('O has more moves');
  });

  test('returns 400 for missing board', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for null board', async () => {
    const res = await request(app)
      .post('/api/ai-move')
      .send({ board: null });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('POST /api/games', () => {
  test('saves a game with valid result and moves', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ result: 'X', moves: [{ player: 'X', position: 0 }] });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('X');
  });

  test('saves a game with draw result', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ result: 'draw', moves: [] });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe('draw');
  });

  test('returns 400 for invalid result value', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ result: 'invalid', moves: [] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid result');
  });

  test('returns 400 for missing result', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ moves: [] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for non-array moves', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ result: 'X', moves: 'not array' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Moves must be an array');
  });

  test('returns 400 for malformed moves entries', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ result: 'X', moves: ['bad'] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('each move must be an object');
  });

  test('accepts null moves', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({ result: 'O', moves: null });
    expect(res.status).toBe(200);
  });
});

describe('GET /api/games', () => {
  test('returns an array of games', async () => {
    const res = await request(app)
      .get('/api/games');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
