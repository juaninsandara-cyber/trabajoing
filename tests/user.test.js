const request = require('supertest');
const app = require('../app');

describe('User Login', () => {
  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ username: 'testUser', password: 'testPass' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(response.status).toBe(401);
  });
});
