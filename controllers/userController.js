// controllers/userController.js
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Caso válido
  if (username === 'testUser' && password === 'testPass') {
    return res.status(200).json({ token: 'fake-jwt-token' });
  }

  // Caso inválido
  return res.status(401).json({ message: 'Credenciales inválidas' });
};