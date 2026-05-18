/* ============================================================================
   UTILS.JS - Funções Auxiliares Reutilizáveis
   ============================================================================ */

/**
 * DOM Query Helpers
 */
const DOM = {
    query: (selector) => document.querySelector(selector),
    queryAll: (selector) => document.querySelectorAll(selector),
    on: (selector, event, callback) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) element.addEventListener(event, callback);
    },
    off: (selector, event, callback) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) element.removeEventListener(event, callback);
    },
    addClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) element.classList.add(className);
    },
    removeClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) element.classList.remove(className);
    },
    toggleClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) element.classList.toggle(className);
    },
    hasClass: (selector, className) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        return element ? element.classList.contains(className) : false;
    },
    setText: (selector, text) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) element.textContent = text;
    },
    getText: (selector) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        return element ? element.textContent : '';
    },
    setHTML: (selector, html) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        // IMPORTANTE: Usar apenas com HTML confiável
        // Para conteúdo do usuário, use setText ou sanitize-html
        if (element) {
            console.warn('[DOM.setHTML] Usando innerHTML - garanta que o HTML é confiável');
            element.innerHTML = html;
        }
    },
    
    /**
     * Sanitiza HTML para prevenir XSS
     * Remove tags potencialmente perigosas
     */
    sanitizeHTML: (html) => {
        const temp = document.createElement('div');
        temp.textContent = html; // textContent escapa HTML automaticamente
        return temp.innerHTML;
    },
    setAttr: (selector, attr, value) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) element.setAttribute(attr, value);
    },
    getAttr: (selector, attr) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        return element ? element.getAttribute(attr) : null;
    },
    hide: (selector) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) {
            element.style.display = 'none';
            element.setAttribute('aria-hidden', 'true');
        }
    },
    show: (selector, display = 'block') => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (element) {
            element.style.display = display;
            element.removeAttribute('aria-hidden');
        }
    },
    isVisible: (selector) => {
        const element = typeof selector === 'string' ? DOM.query(selector) : selector;
        if (!element) return false;
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
    }
};

/**
 * Validação de Formulário (Com proteção contra segurança)
 */
const Validation = {
    /**
     * Valida email mais rigorosamente
     * Step 1: Regex básico de RFC 5322 simplificado
     * Step 2: Validações adicionais contra formatos inválidos
     * Step 3: Backend DEVE validar SMTP/existência do email
     */
    isEmail: (email) => {
        // Remover espaços e converter para minúsculas
        email = email.trim().toLowerCase();
        
        // Regex baseado em RFC 5322 simplificado (mais rigoroso que antes)
        const basicRe = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!basicRe.test(email)) return false;
        
        // Validações adicionais contra edge cases
        if (email.startsWith('@') || email.endsWith('@')) return false;
        if (email.startsWith('.') || email.endsWith('.')) return false;
        if (email.includes('..')) return false;
        if (email.length > 254) return false; // RFC 5321 max length
        
        // Verificar se tem pelo menos 1 caractere antes do @ e domínio válido
        const [localPart, domain] = email.split('@');
        if (localPart.length < 1 || localPart.length > 64) return false;
        if (domain.length < 4) return false; // ex: a@b.c = 4 chars
        
        return true;
    },
    
    /**
     * Valida telefone brasileiro (10 ou 11 dígitos) com validações rigorosas
     * Segue padrão ANATEL
     */
    isPhone: (phone) => {
        // Remover caracteres especiais
        const cleaned = phone.replace(/\D/g, '');
        
        // Validar comprimento (10 para fixo, 11 para celular)
        if (cleaned.length !== 10 && cleaned.length !== 11) {
            return false;
        }
        
        // Não pode ser número repetido (ex: 1111111111)
        if (/^(\d)\1{9,10}$/.test(cleaned)) {
            return false;
        }
        
        // DDD válido (11-99) - padrão ANATEL
        const ddd = parseInt(cleaned.substring(0, 2));
        if (ddd < 11 || ddd > 99) {
            return false;
        }
        
        // Para celular (11 dígitos): 9º dígito deve ser 9
        if (cleaned.length === 11 && cleaned[2] !== '9') {
            return false;
        }
        
        // Para fixo (10 dígitos): 3º dígito deve ser 2-5
        if (cleaned.length === 10) {
            const thirdDigit = parseInt(cleaned[2]);
            if (thirdDigit < 2 || thirdDigit > 5) {
                return false;
            }
        }
        
        return true;
    },
    isEmpty: (value) => {
        return !value || value.trim() === '';
    },
    isMinLength: (value, min) => {
        return value && value.length >= min;
    },
    isMaxLength: (value, max) => {
        return value && value.length <= max;
    },
    isNumber: (value) => {
        return !isNaN(value) && value !== '';
    },
    isCPF: (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        let sum = 0;
        let remainder;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf.substring(10, 11));
    }
};

/**
 * Storage Helper (LocalStorage) com validação de quota e fallback
 * Trata QuotaExceededError e fornece fallback para sessionStorage
 */
const Storage = {
    MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB limite recomendado
    
    /**
     * Salvar com validação de tamanho e tratamento de quota
     */
    set: (key, value) => {
        try {
            const serialized = JSON.stringify(value);
            
            // Validar tamanho individual
            if (serialized.length > Storage.MAX_STORAGE_SIZE) {
                ErrorHandler.handle(
                    new Error(`Dados muito grandes (${(serialized.length / 1024 / 1024).toFixed(2)}MB)`),
                    'StorageQuotaError'
                );
                return false;
            }
            
            localStorage.setItem(key, serialized);
            return true;
        } catch (e) {
            // Tratamento de quota excedida
            if (e.name === 'QuotaExceededError') {
                console.warn('[Storage] LocalStorage cheio, tentando sessionStorage como fallback');
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (sessionE) {
                    ErrorHandler.handle(sessionE, 'StorageFallbackError', { key });
                    return false;
                }
            }
            ErrorHandler.handle(e, 'StorageSetError', { key });
            return false;
        }
    },
    
    /**
     * Ler com fallback para sessionStorage
     */
    get: (key) => {
        try {
            // Tentar localStorage primeiro
            const item = localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            }
            
            // Fallback para sessionStorage
            const sessionItem = sessionStorage.getItem(key);
            if (sessionItem) {
                return JSON.parse(sessionItem);
            }
            
            return null;
        } catch (e) {
            ErrorHandler.handle(e, 'StorageGetError', { key });
            return null;
        }
    },
    
    /**
     * Remover de ambos os storages
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
            return true;
        } catch (e) {
            ErrorHandler.handle(e, 'StorageRemoveError', { key });
            return false;
        }
    },
    
    /**
     * Limpar todo o localStorage e sessionStorage do usuário
     */
    clear: () => {
        try {
            localStorage.clear();
            sessionStorage.clear();
            return true;
        } catch (e) {
            ErrorHandler.handle(e, 'StorageClearError');
            return false;
        }
    },
    
    /**
     * Verificar espaço disponível (aproximado)
     */
    getAvailableSpace: () => {
        let available = 0;
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            available = localStorage.getItem(test).length;
            localStorage.removeItem(test);
        } catch (e) {
            return 0;
        }
        return available;
    }
};

/**
 * Scroll Helper
 */
const ScrollHelper = {
    smoothScroll: (targetId, offset = 80) => {
        const target = DOM.query(targetId);
        if (!target) return;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    scrollToTop: () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

/**
 * String Utilities
 */
const StringUtils = {
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    trim: (str) => {
        return str.trim();
    },
    slugify: (str) => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
    },
    formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length !== 11) return phone;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    },
    formatCPF: (cpf) => {
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length !== 11) return cpf;
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
};

/**
 * Array Utilities
 */
const ArrayUtils = {
    chunk: (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },
    shuffle: (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    unique: (arr) => {
        return [...new Set(arr)];
    },
    flatten: (arr) => {
        return arr.reduce((flat, item) => {
            return flat.concat(Array.isArray(item) ? ArrayUtils.flatten(item) : item);
        }, []);
    }
};

/**
 * Event Debounce, Throttle e Utilities
 * Otimização para eventos de alta frequência (scroll, resize, input)
 */
const Debounce = {
    /**
     * Debounce: Aguarda X ms após última chamada para executar
     * Ideal para: validação em tempo real, search, resize
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle: Executa no máximo uma vez a cada X ms
     * Ideal para: scroll, mousemove, resize
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },
    
    /**
     * Debounce com opção de executar no início (leading)
     * Útil para prevenir múltiplos submits
     */
    debounceLeading: (func, wait) => {
        let timeout, lastRun = 0;
        return function executedFunction(...args) {
            const now = Date.now();
            if (now - lastRun >= wait) {
                func(...args);
                lastRun = now;
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func(...args);
                    lastRun = Date.now();
                }, wait);
            }
        };
    },
    
    /**
     * Sanitização de HTML para prevenir XSS
     * Remove tags potencialmente perigosas mantendo texto
     */
    sanitizeHTML: (html) => {
        const temp = document.createElement('div');
        temp.textContent = html; // textContent escapa HTML automaticamente
        return temp.innerHTML;
    },
    
    /**
     * Sanitização mais agressiva - remove TODAS as tags
     * Use quando só quer texto
     */
    sanitizeText: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Sanitizar input de formulário (remove caracteres perigosos)
     */
    sanitizeInput: (input, allowedChars = /[^a-zA-Z0-9\s@.\-()]/g) => {
        return input.replace(allowedChars, '');
    }
};

/**
 * Logger
 */
const Logger = {
    _prod: null,

    isProduction() {
        if (this._prod !== null) return this._prod;
        const host = window.location.hostname;
        this._prod = host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.');
        return this._prod;
    },

    log: (message, data = null) => {
        if (!Logger.isProduction()) {
            console.log(`[LOG] ${message}`, data);
        }
    },
    warn: (message, data = null) => {
        if (!Logger.isProduction()) {
            console.warn(`[WARN] ${message}`, data);
        }
    },
    error: (message, data = null) => {
        console.error(`[ERROR] ${message}`, data);
    },
    info: (message, data = null) => {
        if (!Logger.isProduction()) {
            console.info(`[INFO] ${message}`, data);
        }
    }
};
