// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';
// import { IceCreamIcon, Lock, Mail, Eye, EyeOff } from 'lucide-react';

// Modal.setAppElement('#root');
// const API_URL = 'http://localhost:3300';

// const Recovery: React.FC = () => {
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_URL}/login`, {  password });
//       const { resUser, token } = response.data;

//       if (!resUser[0]) {
//         throw new Error('Usuario no encontrado');
//       }

//       // Validación del estado del usuario
//       if (resUser[0].estado !== 'A') {
//         toast.error('Tu cuenta está desactivada. Contacta al administrador.', {
//           icon: '❌',
//           style: { borderRadius: '10px', background: '#ff4b4b', color: '#fff' },
//         });
//         return;
//       }

//       // Almacenar datos del usuario y token
//       if (token) {
//         localStorage.setItem('jwtToken', token);
//         localStorage.setItem('ID_rol', resUser[0].ID_rol);
//         localStorage.setItem('ID_usuario', resUser[0].ID_usuario);
//         localStorage.setItem('userName', resUser[0].nombre);

//         toast.success(`Bienvenido, ${resUser[0].nombre}`, {
//           icon: '🍦',
//           style: { borderRadius: '10px', background: '#fff', color: '#000' },
//         });

//         setTimeout(() => {
//           console.log('Login correcto');
//           navigate("/Home");
//         }, 1500);
//       } else {
//         throw new Error('Token no recibido');
//       }
//     } catch (error) {
//       toast.error('Contraseña inválida, ingresa una correcta', {
//         icon: '❌',
//         style: { borderRadius: '10px', background: '#ff4b4b', color: '#fff' },
//       });
//       console.error('Error en el login:', error);
//     }
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleForgotPassword = () => setIsForgotPasswordOpen(true);
//   const handleCloseForgotPassword = () => setIsForgotPasswordOpen(false);

//   const handleForgotPasswordSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     toast.success('Contraseña modificada correctamente: ' + email);
//     handleCloseForgotPassword();
//   };

//   return (
//     <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-pink-100 tw-to-blue-100 tw-flex tw-items-center tw-justify-center tw-p-4">
//       <div className="tw-bg-gray-50 tw-rounded-2xl tw-shadow-2xl tw-p-8 tw-w-full tw-max-w-md tw-transform tw-transition-all tw-duration-500 tw-hover:scale-105">
//         <div className="tw-flex tw-justify-center tw-mb-6">
//           <IceCreamIcon size={64} className="tw-text-pink-500 tw-animate-bounce" />
//         </div>
//         <h2 className="tw-text-3xl tw-font-bold tw-text-center tw-mb-6 tw-text-pink-600">
//           Helados & Acceso
//         </h2>

//         <form onSubmit={handleLogin} className="tw-space-y-4">
//         <div className="tw-relative">
//             <Lock className="tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-pink-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Contraseña"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="tw-w-full tw-pl-10 tw-pr-12 tw-py-3 tw-rounded-lg tw-border tw-border-pink-200 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-pink-400 tw-transition"
//             />
//             </div>
//           <div className="tw-relative">
//             <Lock className="tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-pink-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Contraseña"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="tw-w-full tw-pl-10 tw-pr-12 tw-py-3 tw-rounded-lg tw-border tw-border-pink-200 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-pink-400 tw-transition"
//             />
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-pink-400 tw-focus:outline-none"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>
//           <button
//             type="submit"
//             className="tw-w-full tw-bg-pink-500 tw-text-white tw-py-3 tw-rounded-lg tw-hover:bg-pink-600 tw-transition tw-duration-300 tw-ease-in-out tw-transform tw-hover:scale-105"
//           >
//             Ingresar
//           </button>
//         </form>

//       </div>

//       <Toaster position="top-right" />
//     </div>
//   );
// };

// export default Recovery;

// // Mucha suerte por siempre