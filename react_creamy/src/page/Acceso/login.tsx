import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import App from '../../App';
import toast, { Toaster } from 'react-hot-toast';
// import { Link } from "react-router-dom";
// import { Layout } from 'lucide-react';

Modal.setAppElement('#root');
const API_URL = 'http://localhost:3300';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

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
          email: email,
          password: password,
        });
        setToken(response.data.token);

//Alejo es un crack fgfgdgf

        if (response.data.resUser[0].ID_rol === 2) {
          toast.success('Inicio de sesión exitoso', { duration: 2000 });
          navigate("/principal");
          
          // navega manualmente
          
        } else {
          toast.error('No tienes permisos para esta acción', { duration: 2000 });
        }
      } else {
        if (password !== confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          return;
        }
        await axios.post(`${API_URL}/signup`, {
          email: email,
          password: password,
        });
        toast.success('Usuario registrado exitosamente');
        setIsLogin(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'Error en la autenticación', { duration: 2000 });
      } else {
        toast.error('Error desconocido', { duration: 1500 });
      }
    }
  };

  const handleForgotPasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success('Correo de recuperación enviado a: ' + email);
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
          {/* <Link to= '/Principal'>
            <p>hola</p>
          </Link> */}
          
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



const Mostrar: React.FC = () =>{
  <Router>
 <Layout></Layout> 
 <Toaster position="top-right" reverseOrder={false} />
</Router>
}