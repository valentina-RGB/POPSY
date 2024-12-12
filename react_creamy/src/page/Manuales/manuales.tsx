import React, { useState } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const UserManualViewer = () => {
    const pdfUrl = '../../components/Manuales/ManualUsuario.pdf';
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfError, setPdfError] = useState<string | null>(null);

  return (
    <div className="tw-bg-gray-100 tw-min-h-screen tw-p-6 tw-flex tw-flex-col tw-items-center tw-justify-start">
      <div className="tw-bg-blue-600 tw-w-full tw-text-white tw-rounded-lg tw-shadow-lg tw-mb-6 tw-p-4 tw-text-center">
        <h1 className="tw-text-2xl tw-font-bold">Manual de Usuario</h1>
        <p className="tw-text-sm">Consulta el manual para aprender a usar el sistema.</p>
      </div>

      <div className="tw-w-full tw-max-w-5xl tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 tw-border tw-border-gray-300">
      <Worker workerUrl="/node_modules/pdfjs-dist/build/pdf.worker.min.js">
      {pdfError ? (
            <div className="tw-text-red-500 tw-text-center tw-p-4">{pdfError}</div>
          ) : (
            <Viewer
              fileUrl={pdfUrl}
              plugins={[defaultLayoutPluginInstance]}
              defaultScale={SpecialZoomLevel.PageFit}
              onDocumentLoad={(error: any) => {
                console.error('PDF Load Error:', error);
                setPdfError('No se pudo cargar el documento PDF. Verifique la ruta del archivo.');
              }}
            />
          )}
        </Worker>
      </div>

      <footer className="tw-mt-6 tw-text-gray-500 tw-text-sm">
        <p>© {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default UserManualViewer;
