/* ============================================================================
   ACCORDION.JS - Accordion para FAQ
   ============================================================================ */

class Accordion {
    constructor(accordionSelector, options = {}) {
        this.accordion = DOM.query(accordionSelector);
        if (!this.accordion) {
            Logger.error('Accordion não encontrado:', accordionSelector);
            return;
        }

        this.items = Array.from(this.accordion.querySelectorAll('.accordion-item'));

        // Opções
        this.options = {
            allowMultiple: options.allowMultiple || false,
            animationSpeed: options.animationSpeed || 300,
            ...options
        };

        this.init();
    }

    init() {
        this.items.forEach((item, index) => {
            const header = item.querySelector('.accordion-trigger');
            if (header) {
                header.addEventListener('click', () => this.toggleItem(item, index));
                // Acessibilidade
                header.setAttribute('aria-expanded', 'false');
            }
        });

        Logger.log('Accordion inicializado', {
            items: this.items.length,
            allowMultiple: this.options.allowMultiple
        });
    }

    toggleItem(item, index) {
        const isOpen = DOM.hasClass(item, 'open');

        if (!isOpen) {
            this.openItem(item);
        } else {
            this.closeItem(item);
        }
    }

    openItem(item) {
        // Se allowMultiple é false, fechar outros items
        if (!this.options.allowMultiple) {
            this.items.forEach(i => {
                if (i !== item) {
                    this.closeItem(i);
                }
            });
        }

        DOM.addClass(item, 'open');
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.setAttribute('aria-expanded', 'true');
        }

        Logger.log('Accordion item aberto');
    }

    closeItem(item) {
        DOM.removeClass(item, 'open');
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }

        Logger.log('Accordion item fechado');
    }

    openAll() {
        this.items.forEach(item => this.openItem(item));
    }

    closeAll() {
        this.items.forEach(item => this.closeItem(item));
    }

    destroy() {
        this.items = [];
        this.accordion = null;
    }
}

/**
 * Inicializar Accordion de FAQ
 */
document.addEventListener('DOMContentLoaded', () => {
    const faqAccordion = new Accordion('#faqAccordion', {
        allowMultiple: false,
        animationSpeed: 300
    });

    Logger.log('FAQ Accordion inicializado');
});
