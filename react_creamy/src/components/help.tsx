import  { useState } from 'react';
import { HelpCircle, X, Download} from 'lucide-react';
import toast from 'react-hot-toast';
// import { useManuales } from '../page/Manuales/handleManuales';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'react-feather';

const HelpDownloadButton = () => {
  // const { urlManuales } = useManuales();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleMainButtonClick = () => {
    setIsOpen(!isOpen);
    // handleManuales('/manuales');
    // urlManuales();
  };


  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el enlace actúe como un enlace normal
    navigate('/manuales'); // Redirige a la ruta donde se renderiza el manual
};

  const handleDownload = () => {
    try {
      const pdfPath = '/docs/Manual de usuario creamy soft.docx.pdf';
      
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = 'manual-usuario.pdf';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Documento descargado correctamente');
    } catch (error) {
      toast.error('Error al descargar el documento');
      console.error('Error en la descarga:', error);
    }
  };

  return (
    <div className="tw-fixed tw-bottom-6 tw-right-6 tw-z-50 tw-flex tw-flex-col tw-items-center tw-space-y-4">
      <div 
        className={`tw-flex tw-items-center tw-space-x-4 tw-transition-all tw-duration-300 tw-ease-in-out ${
          isOpen 
            ? 'tw-opacity-100 tw-translate-y-0 tw-visible' 
            : 'tw-opacity-0 tw-translate-y-[-20px] tw-invisible'
        }`}
      >
        <button 
          onClick={handleDownload}
          className="tw-bg-green-500 tw-text-white tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-transition-all tw-duration-300 tw-transform tw-hover:scale-110 tw-animate-pulse"
        >
          <Download className="tw-w-6 tw-h-6" />
        </button>
      
        <a
          onClick={handleClick}
          href="#"
          className="tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-transition-all tw-duration-300 tw-transform tw-hover:scale-110 tw-animate-pulse"
        >
          <FileText className="tw-w-6 tw-h-6" />
        </a>
      </div>
      
      <button 
        onClick={handleMainButtonClick}
        aria-label={isOpen ? "Cerrar menú de ayuda" : "Abrir menú de ayuda"}
        className={`tw-bg-blue-500 tw-text-white tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-transition-all tw-duration-300 tw-transform tw-hover:scale-110 ${
          isOpen ? 'tw-rotate-180' : ''
        }`}
      >
        {isOpen ? (
          <X className="tw-w-6 tw-h-6" />
        ) : (
          <HelpCircle className="tw-w-6 tw-h-6" />
        )}
      </button>
    </div>
  );
};

export default HelpDownloadButton;