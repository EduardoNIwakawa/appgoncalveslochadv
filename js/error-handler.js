/**
 * Error Handler - Tratamento centralizado de erros
 * Fornece logging, notificação ao usuário e integração com monitoring
 */
class ErrorHandler {
    static initialized = false;
    static errorLog = [];
    static MAX_ERRORS_LOGGED = 50;

    /**
     * Inicializa o Error Handler
     */
    static init() {
        if (this.initialized) return;

        // Capturar erros não tratados globalmente
        window.addEventListener('error', (e) => {
            this.handle(e.error, 'UncaughtError', { 
                filename: e.filename, 
                lineno: e.lineno 
            });
        });

        // Capturar promise rejections não tratadas
        window.addEventListener('unhandledrejection', (e) => {
            this.handle(e.reason, 'UnhandledPromiseRejection');
        });

        this.initialized = true;
        console.log('✅ Error Handler inicializado');
    }

    /**
     * Trata um erro com logging, notificação e monitoramento
     */
    static handle(error, context = 'UnknownError', metadata = {}) {
        const errorData = {
            timestamp: new Date().toISOString(),
            context,
            message: error?.message || String(error),
            stack: error?.stack || 'N/A',
            metadata,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Log no console (desenvolvimento)
        console.error(`[${context}] ${errorData.message}`, error, metadata);

        // Armazenar localmente (máximo 50 erros)
        this.errorLog.push(errorData);
        if (this.errorLog.length > this.MAX_ERRORS_LOGGED) {
            this.errorLog.shift();
        }

        // Enviar para monitoramento externo (ex: Sentry)
        if (window.__sentry__) {
            window.__sentry__.captureException(error, {
                tags: { context },
                extra: metadata
            });
        } else {
            // Fallback: enviar para endpoint próprio
            this.sendToBackend(errorData);
        }

        // Notificar usuário (se apropriado)
        this.notifyUser(error, context);
    }

    /**
     * Envia erro para backend para monitoramento
     * Só ativo quando endpoint está configurado
     */
    static sendToBackend(errorData) {
        // Endpoint de monitoramento (configure quando disponível)
        const endpoint = window.__ERROR_ENDPOINT__;
        if (!endpoint) return;

        if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, JSON.stringify(errorData));
        } else {
            fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(errorData),
                keepalive: true
            }).catch(() => {});
        }
    }

    /**
     * Notifica o usuário sobre o erro
     */
    static notifyUser(error, context) {
        // Não mostrar em production para usuários finais
        if (this.isProduction() && !this.isCriticalError(context)) {
            return;
        }

        const message = this.getUserFriendlyMessage(context, error);
        this.showNotification(message, 'error', 5000);
    }

    /**
     * Gera mensagem amigável para o usuário
     */
    static getUserFriendlyMessage(context, error) {
        const messages = {
            'FormSubmitError': 'Erro ao enviar formulário. Por favor, tente novamente.',
            'NetworkError': 'Erro de conexão. Verifique sua internet e tente novamente.',
            'ValidationError': 'Dados inválidos. Por favor, verifique os campos.',
            'ServerError': 'Erro no servidor. Tente novamente em alguns minutos.',
            'UnhandledPromiseRejection': 'Erro interno. Tente recarregar a página.',
            'UncaughtError': 'Erro inesperado. Tente recarregar a página.'
        };

        return messages[context] || 'Ocorreu um erro. Por favor, tente novamente.';
    }

    /**
     * Mostra notificação ao usuário
     */
    static showNotification(message, type = 'info', duration = 5000) {
        // Remover notificação anterior
        const existing = document.querySelector('.error-notification, .success-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `${type}-notification`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button aria-label="Fechar notificação" class="notification-close">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Fechar ao clicar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remover após duração
        if (duration > 0) {
            setTimeout(() => {
                if (document.contains(notification)) {
                    notification.remove();
                }
            }, duration);
        }
    }

    /**
     * Determina se é erro crítico que deve notificar usuário
     */
    static isCriticalError(context) {
        const criticalContexts = [
            'FormSubmitError',
            'NetworkError',
            'ValidationError',
            'ServerError'
        ];
        return criticalContexts.includes(context);
    }

    /**
     * Verifica se está em produção
     */
    static isProduction() {
        return window.location.hostname !== 'localhost' && 
               !window.location.hostname.startsWith('127.');
    }

    /**
     * Retorna logs de erro (para debug)
     */
    static getLogs() {
        return this.errorLog;
    }

    /**
     * Limpa logs
     */
    static clearLogs() {
        this.errorLog = [];
    }

    /**
     * Cria um erro customizado para lançar
     */
    static createError(message, context) {
        const error = new Error(message);
        error.context = context;
        return error;
    }
}

// Inicializar automaticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ErrorHandler.init());
} else {
    ErrorHandler.init();
}
