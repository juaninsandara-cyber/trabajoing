// Crea este archivo: tests/basic.test.js
const request = require('supertest');
const app = require('../app');

test('Ruta principal funciona', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toContain('Hola clase');
});