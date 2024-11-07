const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(helmet()); 
app.use(cors()); 

// Simulación de base de datos
let users = [];

const JWT_SECRET = crypto.randomBytes(64).toString('hex');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Registro de usuario
app.post('/register', 
  body('username').isLength({ min: 5 }),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Verifica si el usuario ya existe
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guarda el usuario
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ error: 'Usuario no encontrado' });
  }

  if (await bcrypt.compare(password, user.password)) {
    // Genera token JWT xdxd
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Contraseña incorrecta' });
  }
});


app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});