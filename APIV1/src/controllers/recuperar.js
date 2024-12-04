const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Usuarios } = require("./models/Usuarios"); 
const bcrypt = require("bcryptjs");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

router.post("/auth/recover-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Usuarios.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Hola,</p>
        <p>Haz solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para continuar:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si no solicitaste este cambio, simplemente ignora este correo.</p>
      `,
    });

    res.json({ message: "Correo enviado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar la solicitud." });
  }
});

module.exports = router;
