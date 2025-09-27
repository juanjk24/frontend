const API_BASE_URL = 'https://api.memegen.link';

// Funciones para interactuar con la API de memegen
export async function getTemplates() {
    try {
        const res = await fetch(`${API_BASE_URL}/templates`);
        return await res.json();
    } catch (err) {
        console.error('Error al obtener las plantillas', err);
        return [];
    }
}

export async function getTemplate(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/templates/${id}`);
        return await res.json();
    } catch (err) {
        console.error('Error al obtener la plantilla', err);
        return null;
    }
}

export function generateMemeUrl(templateId, texts) {
    const encodedTexts = texts.map(text => encodeURIComponent(text || '_'));
    return `${API_BASE_URL}/images/${templateId}/${encodedTexts.join('/')}.jpg`;
}
