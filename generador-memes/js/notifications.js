// Sistema de notificaciones
let notificationContainer = null;

// Crear el contenedor de notificaciones si no existe
function createNotificationContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    return notificationContainer;
}

// Iconos SVG para cada tipo de notificación
const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="2"/>
    </svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="2"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" stroke-width="2"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" stroke-width="2"/>
    </svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="#fff" stroke-width="2"/>
        <path d="M12 9v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 17h.01" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="2"/>
        <path d="M12 16v-4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 8h.01" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </svg>`
};

// Crear una notificación
function createNotification(type, title, message, duration = 3000) {
    const container = createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const closeIcon = `<svg viewBox="0 0 24 24" fill="none" width="16" height="16">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
    </svg>`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icons[type]}</div>
            <div class="notification-text">
                <h4 class="notification-title">${title}</h4>
                <p class="notification-message">${message}</p>
            </div>
        </div>
        <button class="notification-close" aria-label="Cerrar notificación">
            ${closeIcon}
        </button>
        <div class="notification-progress"></div>
    `;
    
    // Agregar al contenedor
    container.appendChild(notification);
    
    // Mostrar la notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Configurar progreso de auto-cierre
    const progressBar = notification.querySelector('.notification-progress');
    if (duration > 0) {
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressBar.style.width = '0%';
            progressBar.style.transition = `width ${duration}ms linear`;
        }, 200);
    }
    
    // Función para cerrar la notificación
    const closeNotification = () => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                container.removeChild(notification);
            }
            
            // Remover contenedor si está vacío
            if (container.children.length === 0) {
                document.body.removeChild(container);
                notificationContainer = null;
            }
        }, 300);
    };
    
    // Event listener para el botón de cerrar
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', closeNotification);
    
    // Auto-cerrar después del tiempo especificado
    if (duration > 0) {
        setTimeout(closeNotification, duration);
    }
    
    return {
        element: notification,
        close: closeNotification
    };
}

// Funciones públicas para cada tipo de notificación
export function showSuccess(title, message, duration = 3000) {
    return createNotification('success', title, message, duration);
}

export function showError(title, message, duration = 3000) {
    return createNotification('error', title, message, duration);
}

export function showWarning(title, message, duration = 3000) {
    return createNotification('warning', title, message, duration);
}

export function showInfo(title, message, duration = 3000) {
    return createNotification('info', title, message, duration);
}

// Función genérica
export function showNotification(type, title, message, duration = 3000) {
    return createNotification(type, title, message, duration);
}
