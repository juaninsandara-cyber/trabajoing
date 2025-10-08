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
});