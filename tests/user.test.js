const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

//   usuarios e ingresos
describe('Sistema Parqueadero - Pruebas de Rutas', () => {

  // Registro de usuario
  it('should register a new user successfully', async () => {
    const username = `user${Date.now()}`; // nombre unico
    const response = await request(app)
      .post('/users/registro')
      .send({ username, password: '1234' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
  });

  // Login exitoso
  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ username: 'testUser', password: 'testPass' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  // Login fallido
  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(response.status).toBe(401);
  });

  // Registrar ingreso
it('should register a vehicle entry successfully', async () => {
  const response = await request(app)
    .post('/users/ingreso')
    .send({
      username: 'testUser',
      password: 'testPass',
      placa: 'ABC123',
      tipoVehiculo: 'carro',
      tipoAcceso: 'dia'  
    });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('message');
});


  // Registrar salida
  it('should register vehicle exit successfully', async () => {
    const response = await request(app)
      .post('/users/salida')
      .send({
        username: 'testUser',
        password: 'testPass',
        placa: 'ABC123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});

// Cerrar conexión después de las pruebas
afterAll(async () => {
  await sequelize.close();
});
