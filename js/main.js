/* ============================================================================
   MAIN.JS - Orquestrador Principal (Menu Mobile, Smooth Scroll, etc.)
   ============================================================================ */

/**
 * Header Controller — Scroll state + Progress bar
 */
class HeaderController {
    constructor() {
        this.header = DOM.query('#header');
        this.progressFill = DOM.query('.progress-fill');
        if (!this.header) return;

        this.scrollThreshold = 80;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.onScroll();
        Logger.log('Header controller inicializado');
    }

    onScroll() {
        const scrollY = window.scrollY;

        // Progress bar
        if (this.progressFill) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
            this.progressFill.style.width = `${progress}%`;
        }

        // Header state: transparent ↔ scrolled (glass)
        if (scrollY > this.scrollThreshold) {
            DOM.removeClass(this.header, 'header-transparent');
            DOM.addClass(this.header, 'header-scrolled');
        } else {
            DOM.addClass(this.header, 'header-transparent');
            DOM.removeClass(this.header, 'header-scrolled');
        }
    }
}

/**
 * Menu Mobile — Fullscreen overlay com animação
 */
class MobileMenu {
    constructor() {
        this.menuToggle = DOM.query('.menu-toggle');
        this.header = DOM.query('#mainHeader');
        this.mobileOverlay = DOM.query('.mobile-overlay');
        this.mobileNavLinks = DOM.queryAll('.mobile-nav-link');
        this.mobileCtaBtn = DOM.query('.mobile-cta-btn');

        if (!this.menuToggle || !this.mobileOverlay) return;

        this.isOpen = false;
        this.previousActiveElement = null;
        this.init();
    }

    init() {
        this.menuToggle.addEventListener('click', () => this.toggle());

        // Fechar ao clicar em link do menu mobile
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Fechar ao clicar no CTA
        if (this.mobileCtaBtn) {
            this.mobileCtaBtn.addEventListener('click', () => this.close());
        }

        // Fechar ao clicar no background
        const overlayBg = DOM.query('.mobile-overlay-bg');
        if (overlayBg) {
            overlayBg.addEventListener('click', () => this.close());
        }

        // Fechar com tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        Logger.log('Menu mobile inicializado');
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.previousActiveElement = document.activeElement;

        DOM.addClass(this.menuToggle, 'active');
        DOM.addClass(this.mobileOverlay, 'active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menuToggle.setAttribute('aria-label', 'Fechar menu');

        // Bloquear scroll do body
        document.body.style.overflow = 'hidden';

        // Focar primeiro link do menu após animação
        setTimeout(() => {
            const firstLink = DOM.query('.mobile-nav-link');
            if (firstLink) firstLink.focus();
        }, 400);

        Logger.log('Menu mobile aberto');
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        DOM.removeClass(this.menuToggle, 'active');
        DOM.removeClass(this.mobileOverlay, 'active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-label', 'Abrir menu');

        // Restaurar scroll do body
        document.body.style.overflow = '';

        // Restaurar foco
        if (this.previousActiveElement && document.contains(this.previousActiveElement)) {
            this.previousActiveElement.focus();
        }

        Logger.log('Menu mobile fechado');
    }
}

/**
 * Smooth Scroll para Links de Âncora
 */
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            e.preventDefault();
            const href = target.getAttribute('href');
            const element = DOM.query(href);

            if (element) {
                ScrollHelper.smoothScroll(href, 80);
            }
        });

        Logger.log('Smooth scroll inicializado');
    }
}

/**
 * Scroll Spy - Destacar menu item baseado no scroll
 */
class ScrollSpy {
    constructor(menuSelector = '.nav-link') {
        this.links = DOM.queryAll(menuSelector);
        this.sections = [];

        this.links.forEach(link => {
            const href = link.getAttribute('href');
            const section = DOM.query(href);
            if (section) {
                this.sections.push({ link, section, href });
            }
        });

        this.init();
    }

    init() {
        window.addEventListener('scroll', Debounce.debounce(() => this.update(), 100));
        this.update();
        Logger.log('ScrollSpy inicializado');
    }

    update() {
        let current = '';

        this.sections.forEach(({ section, href }) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = href;
            }
        });

        this.links.forEach(link => {
            DOM.removeClass(link, 'active');
            if (link.getAttribute('href') === current) {
                DOM.addClass(link, 'active');
            }
        });
    }
}

/**
 * Scroll to Top Button
 */
class ScrollToTopButton {
    constructor(buttonSelector = '.scroll-to-top') {
        this.button = DOM.query(buttonSelector);
        if (!this.button) return;

        this.init();
    }

    init() {
        window.addEventListener('scroll', Debounce.debounce(() => this.updateVisibility(), 100));
        this.button.addEventListener('click', () => ScrollHelper.scrollToTop());
        this.updateVisibility();
        Logger.log('Botão scroll to top inicializado');
    }

    updateVisibility() {
        if (window.scrollY > 300) {
            DOM.show(this.button);
        } else {
            DOM.hide(this.button);
        }
    }
}

/**
 * Theme Toggle — Dark/Light mode com prefers-color-scheme + localStorage
 */
class ThemeToggle {
    constructor(toggleSelector = '.theme-toggle') {
        this.toggle = DOM.query(toggleSelector);
        if (!this.toggle) return;

        this.storageKey = 'theme';
        this.init();
    }

    init() {
        this.currentTheme = this.detectTheme();
        this.applyTheme(this.currentTheme);
        this.toggle.addEventListener('click', () => this.switchTheme());

        // Ouvir mudanças no sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Storage.get(this.storageKey)) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        Logger.log('Theme toggle inicializado');
    }

    detectTheme() {
        // 1. Preferência salva pelo usuário
        const saved = Storage.get(this.storageKey);
        if (saved === 'light' || saved === 'dark') return saved;

        // 2. Preferência do sistema
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

        // 3. Default: light
        return 'light';
    }

    switchTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        Storage.set(this.storageKey, this.currentTheme);
        Analytics.trackEvent('theme_toggle', { theme: this.currentTheme });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Atualizar meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.content = theme === 'dark' ? '#070b1a' : '#0A0E27';
        }
    }
}

/**
 * Analytics Helper
 */
class Analytics {
    static trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            ...eventData
        };
        Logger.log(`Analytics: ${eventName}`, event);

        // Aqui você poderia enviar para Google Analytics ou outro serviço
        if (window.gtag) {
            gtag('event', eventName, eventData);
        }
    }

    static trackPageView(pageName = null) {
        this.trackEvent('page_view', {
            page_title: document.title,
            page_path: window.location.pathname
        });
    }

    static trackFormSubmit(formName) {
        this.trackEvent('form_submit', {
            form_name: formName
        });
    }

    static trackCTA(ctaText) {
        this.trackEvent('cta_click', {
            cta_text: ctaText
        });
    }
}

/**
 * Lazy Load Images
 */
class LazyImageLoader {
    constructor() {
        this.images = DOM.queryAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });

            this.images.forEach(img => observer.observe(img));
        } else {
            // Fallback para navegadores antigos
            this.images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
    }
}

/**
 * Inicialização Global
 */
document.addEventListener('DOMContentLoaded', () => {
    Logger.log('Inicializando aplicação...');

    // Inicializar componentes
    new HeaderController();
    new MobileMenu();
    new SmoothScroller();
    new ScrollSpy('.nav-link');
    new ScrollToTopButton();
    new ThemeToggle();
    new LazyImageLoader();

    // ── Flip Cards "Quem Somos" ──
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    });

    // Track page view
    Analytics.trackPageView();

    // Adicionar listeners para CTAs
    const ctaButtons = DOM.queryAll('[data-cta]');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            Analytics.trackCTA(btn.textContent);
        });
    });

    Logger.log('Aplicação inicializada com sucesso');

    // ===== STICKY MOBILE CTA =====
    const hero = DOM.query('.hero');
    const stickyCTA = DOM.query('#stickyCTA');
    
    if (hero && stickyCTA) {
        const observerCTA = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Hero is visible, hide sticky CTA
                    DOM.addClass(stickyCTA, 'hidden');
                } else {
                    // Hero is not visible, show sticky CTA
                    DOM.removeClass(stickyCTA, 'hidden');
                }
            });
        }, { threshold: 0.1 });
        
        observerCTA.observe(hero);
        Logger.log('Sticky CTA mobile inicializado');
    }


    if (!Logger.isProduction()) {
        console.log('%c Gonçalves & Loch - Advocacia Especializada', 'color: #0B3D91; font-size: 16px; font-weight: bold;');
        console.log('Versão: 1.0.0');
    }
});

/**
 * Cleanup ao descarregar página
 */
window.addEventListener('beforeunload', () => {
    Logger.log('Página sendo descarregada');
});

/**
 * Tratamento de Erros Global
 */
window.addEventListener('error', (e) => {
    Logger.error('Erro JavaScript', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

/**
 * Tratamento de Promise Rejections não tratadas
 */
window.addEventListener('unhandledrejection', (e) => {
    Logger.error('Promise rejection não tratada', e.reason);
});
