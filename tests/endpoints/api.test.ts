import app from '../../app';
const request = require('supertest');

describe('POST /api/search', () => {
  it('should list all databases', async () => {
    const response = await request(app).post('/api/search')
      .send({});
    expect(response.statusCode).toEqual(200);
  })
});

describe('GET /api/databases/:databaseId', () => {
  it('should retrieve the requested database', async () => {
    const response = await request(app).get('/api/databases/ppp')
      .send({});
    expect(response.statusCode).toEqual(200);
  })
});

describe('POST /api/databases/:databaseId/pages', () => {
  it('should create a new post', async () => {
    const response = await request(app).post('/api/databases/ppp/pages')
      .send({});
    expect(response.statusCode).toEqual(201);
  })
});
