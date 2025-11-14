<<<<<<< HEAD
<<<<<<< HEAD
const request = require('supertest');
const app = require('../app')

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
=======
=======
>>>>>>> origin/main
// tests/basic.test.js
const request = require('supertest');
const app = require('../app');

test('Servidor responde a ruta raíz', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toContain('Hola clase');
});

test('Ruta de usuarios existe', async () => {
  const response = await request(app).get('/users');
  expect([200, 404]).toContain(response.status);
<<<<<<< HEAD
});
>>>>>>> c786a63 (feat: deploy secure API with authentication, rate limiting, and security measures)
=======
});
>>>>>>> origin/main
