import React, { useState } from 'react';
import { HelpCircle, X, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useManuales } from '../page/Manuales/handleManuales';




const HelpDownloadButton = () => {


  const { handleManuales, urlManuales } = useManuales();



  const [isOpen, setIsOpen] = useState(false);




  const handleMainButtonClick = () => {
    setIsOpen(!isOpen);
    handleManuales('https://app.tango.us/app/workflow/Ver-detalles-de-la-categor-a-43d87679db234b4bb045190f6a63bfdc');
  };

  const handleDownload = () => {
    try {
      // Ejemplo de descarga de un PDF (necesitarás reemplazar con tu ruta real)
      const pdfPath = '../../public/docs/Manual de usuario creamy soft.docx.pdf';
      
      // Crear un elemento temporal para la descarga
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = 'manual-usuario.pdf';
      
      // Añadir al documento, hacer click y remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Mostrar notificación de descarga exitosa
      toast.success('Documento descargado correctamente');
    } catch (error) {
      // Manejar errores de descarga
      toast.error('Error al descargar el documento');
      console.error('Error en la descarga:', error);
    }
  };





  return (
    <div className="tw-fixed tw-bottom-6 tw-right-6 tw-z-50 tw-flex tw-flex-col tw-items-center tw-space-y-4">
      <div 
        className={`tw-transition-all tw-duration-300 tw-ease-in-out ${
          isOpen 
            ? 'tw-opacity-100 tw-translate-y-0 tw-visible' 
            : 'tw-opacity-0 tw-translate-y-[-20px] tw-invisible'
        }`}
      >
        <button 
          onClick={handleDownload}
          className="tw-bg-green-500 tw-text-white tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-transition-all tw-duration-300 tw-transform tw-hover:scale-110 tw-animate-pulse"
        >
          <FileText className="tw-w-6 tw-h-6" />
        </button>
      
        <button
          // onClick={}
          // href={`${urlManuales}`}
      
           onClick={urlManuales}
          className="tw-bg-blue-500 tw-m-5 tw-text-white tw-rounded-full tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-transition-all tw-duration-300 tw-transform tw-hover:scale-110 tw-animate-pulse"
        >
          <FileText className="tw-w-6 tw-h-6" />
        </button>
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
