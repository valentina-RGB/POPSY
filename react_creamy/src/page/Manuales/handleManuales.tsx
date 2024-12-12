import React from 'react';

const ManualesViewer = () => {
    const manualPath = "/docs/Manualv1soft.docx.html"; // Cambia esto a la ruta de tu archivo manual

    return (
        <div style={{ width: '100%', height: '100vh', padding: '1px' }}>
            <iframe
                src={manualPath}
                title="Manual Viewer"
                style={{
                    width: '100%', // O cualquier proporción que prefieras
                    height: '100vh', // Más grande que el tamaño anterior
                    border: 'none',
                    margin: 'auto',
                    display: 'block',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}
            />
        </div>
    );
};

export default ManualesViewer;