
import { Link } from 'react-router-dom';
import { Cone, IceCream } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-br tw-from-pink-100 tw-to-blue-100 tw-p-4">
      <div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-8 tw-text-center tw-max-w-md tw-relative tw-overflow-hidden">
        {/* Número 404 grande */}
        <div className="tw-text-9xl tw-font-bold tw-text-pink-500 tw-opacity-20 tw-absolute tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-0">
          404
        </div>

        {/* Contenido principal */}
        <div className="tw-relative tw-z-10">
          <div className="tw-flex tw-justify-center tw-mb-6 tw-space-x-4">
            <IceCream 
              className="tw-text-pink-500 tw-animate-bounce" 
              size={80} 
              strokeWidth={1.5} 
            />
            <Cone 
              className="tw-text-blue-500 tw-animate-bounce tw-animation-delay-300" 
              size={80} 
              strokeWidth={1.5} 
            />
          </div>

          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-4">
            ¡Helado no encontrado!
          </h1>
          
          <p className="tw-text-gray-600 tw-mb-6">
            Parece que este sabor de página se ha derretido. 
            No te preocupes, ¡hay muchos más deliciosos por descubrir!
          </p>

          <div className="tw-flex tw-justify-center tw-space-x-4">
            <Link 
              to="/" 
              className="tw-bg-pink-500 tw-text-white tw-px-6 tw-py-3 tw-rounded-full tw-transition tw-duration-300 hover:tw-bg-pink-600 tw-flex tw-items-center tw-space-x-2"
            >
              <span>Volver al Inicio</span>
            </Link>
           
          </div>
        </div>

        {/* Decoraciones de helado */}
        <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-2 tw-bg-gradient-to-r tw-from-pink-300 tw-to-blue-300 tw-opacity-50"></div>
      </div>

      {/* Fondo animado de gotitas */}
      <div className="tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-full tw-pointer-events-none tw-overflow-hidden tw-z-0">
        {[...Array(20)].map((_, index) => (
          <div 
            key={index} 
            className="tw-absolute tw-bg-pink-200 tw-rounded-full tw-animate-drop"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;