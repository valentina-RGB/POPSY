const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
// const cors = require('cors');

const app = express();

// app.use(express.json());
app.use(helmet());
// app.use(cors()); 

// Simulación de base de datos
const { Usuarios } = require("../../models");

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


const registrar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, telefono, password, ID_rol, estado } = req.body;

  console.log(nombre, email, telefono, password, ID_rol, estado)



  try {
    // Verifica si el usuario ya existe
    const existingUser = await Usuarios.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el usuario en la base de datos
    await Usuarios.create({
      nombre: nombre,
      email: email,
      telefono: telefono,
      password: hashedPassword,
      ID_rol: ID_rol || 7,
      estado: estado || 'A'
    });






    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const Iniciar_sesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Encuentra el usuario por email
    const user = await Usuarios.findOne(
      {
        attributes: ["ID_usuario", "email", "password"],
        where: { email: email }
      });

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Verifica la contraseña
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      // Genera el token JWT
      const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      // filtro donde retires la contraseña del usuario

      const resUser = await Usuarios.findAll(
        {
          attributes: ["ID_usuario", "nombre", "email", "telefono", "ID_rol", "estado"],
          where: { ID_usuario: user.ID_usuario }
        });

      res.json({ token, resUser }); ///////
    } else {
      res.status(400).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


// app.get('/protected', authenticateToken, (req, res) => {
//   res.json({ message: 'Esta es una ruta protegida', user: req.user });
// });





module.exports = {
  authenticateToken,
  registrar,
  Iniciar_sesion
}