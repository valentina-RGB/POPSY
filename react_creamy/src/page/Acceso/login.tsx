import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const API_URL = 'http://localhost:3000';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const handleSwitchAuthMode = () => {
    setIsLogin((prev) => !prev);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setIsForgotPasswordOpen(false);
  };

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/login`, {
          username: email,
          password: password,
        });
        setToken(response.data.token);
        alert('Inicio de sesión exitoso');
      } else {
        if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        await axios.post(`${API_URL}/register`, {
          username: email,
          password: password,
        });
        alert('Usuario registrado exitosamente');
        setIsLogin(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Error en la autenticación');
      } else {
        alert('Error desconocido');
      }
    }
  };

  const handleForgotPasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert('Correo de recuperación enviado a: ' + email);
    handleCloseForgotPassword();
  };

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen tw-bg-gray-100">
      <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-md">
        <h2 className="tw-text-2xl tw-font-bold tw-text-center tw-mb-4">
          {isLogin ? 'Iniciar Sesión' : 'Registrar Usuario'}
        </h2>
        <form onSubmit={handleAuthSubmit} className="tw-flex tw-flex-col tw-gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="tw-border tw-rounded tw-p-2 tw-w-full"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="tw-border tw-rounded tw-p-2 tw-w-full"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="tw-border tw-rounded tw-p-2 tw-w-full"
            />
          )}
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-py-2 tw-rounded tw-w-full">
            {isLogin ? 'Iniciar Sesión' : 'Registrar'}
          </button>
          {isLogin && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="tw-text-blue-500 tw-text-sm tw-underline tw-mt-2"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </form>
        <button
          onClick={handleSwitchAuthMode}
          className="tw-text-gray-600 tw-text-sm tw-underline tw-mt-4"
        >
          {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
        </button>
      </div>

      <Modal
        isOpen={isForgotPasswordOpen}
        onRequestClose={handleCloseForgotPassword}
        className="tw-bg-white tw-p-6 tw-rounded-lg tw-max-w-md tw-w-full tw-mx-auto"
        overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center"
      >
        <h2 className="tw-text-xl tw-font-bold tw-mb-4">Recuperar Contraseña</h2>
        <form onSubmit={handleForgotPasswordSubmit} className="tw-flex tw-flex-col tw-gap-4">
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="tw-border tw-rounded tw-p-2 tw-w-full"
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-py-2 tw-rounded tw-w-full">
            Enviar correo de recuperación
          </button>
          <button
            type="button"
            onClick={handleCloseForgotPassword}
            className="tw-text-gray-600 tw-text-sm tw-underline tw-mt-2"
          >
            Cancelar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AuthPage;
