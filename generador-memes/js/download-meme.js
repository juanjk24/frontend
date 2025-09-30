import { showSuccess, showError } from './notifications.js';

// Función para crear el botón de descarga
export function createDownloadButton(imageUrl, templateName) {
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = `
        <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Descargar Meme</span>
    `;

    const fileName = `meme-${templateName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;

    downloadBtn.addEventListener('click', () => {
        downloadMeme(imageUrl, fileName);
    });

    return downloadBtn;
}

// Función para descargar la imagen del meme
async function downloadMeme(imageUrl, fileName) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        
        // Agregar el enlace al DOM temporalmente y hacer clic
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar el URL objeto
        window.URL.revokeObjectURL(downloadUrl);
        
        // Mostrar notificación de éxito
        showSuccess('¡Descarga completada!', `El meme "${fileName}" se ha descargado exitosamente.`);
    } catch (error) {
        console.error('Error al descargar la imagen:', error);
        showError('Error de descarga', 'No se pudo descargar la imagen. Verifica tu conexión e intenta de nuevo.');
    }
}