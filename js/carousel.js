/* ============================================================================
   CAROUSEL.JS - Carrossel de Depoimentos
   ============================================================================ */

class Carousel {
    constructor(carouselSelector, options = {}) {
        this.carousel = DOM.query(carouselSelector);
        if (!this.carousel) {
            Logger.error('Carrossel não encontrado:', carouselSelector);
            return;
        }

        this.slides = Array.from(this.carousel.children);
        this.currentSlide = 0;
        this.slideCount = this.slides.length;

        // Opções
        this.options = {
            autoPlay: options.autoPlay || false,
            autoPlayInterval: options.autoPlayInterval || 5000,
            showIndicators: options.showIndicators !== false,
            indicatorsSelector: options.indicatorsSelector || null,
            ...options
        };

        this.init();
    }

    init() {
        // Ocultar todos os slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Mostrar primeiro slide
        this.goToSlide(0);

        // Criar indicadores
        if (this.options.showIndicators && this.options.indicatorsSelector) {
            this.createIndicators();
        }

        // Auto-play
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }

        Logger.log('Carrossel inicializado', {
            slides: this.slideCount,
            autoPlay: this.options.autoPlay
        });
    }

    goToSlide(index) {
        // Validar índice
        if (index < 0) {
            this.currentSlide = this.slideCount - 1;
        } else if (index >= this.slideCount) {
            this.currentSlide = 0;
        } else {
            this.currentSlide = index;
        }

        // Ocultar todos os slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
            DOM.removeClass(slide, 'active');
        });

        // Mostrar slide atual
        this.slides[this.currentSlide].style.display = 'block';
        DOM.addClass(this.slides[this.currentSlide], 'active');

        // Atualizar indicadores
        this.updateIndicators();
    }

    next() {
        this.goToSlide(this.currentSlide + 1);
        if (this.options.autoPlay) {
            this.resetAutoPlay();
        }
    }

    prev() {
        this.goToSlide(this.currentSlide - 1);
        if (this.options.autoPlay) {
            this.resetAutoPlay();
        }
    }

    createIndicators() {
        const indicatorsContainer = DOM.query(this.options.indicatorsSelector);
        if (!indicatorsContainer) return;

        // Limpar indicadores existentes
        indicatorsContainer.innerHTML = '';

        // Criar dots
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'indicator-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }
    }

    updateIndicators() {
        const dots = DOM.queryAll('.indicator-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                DOM.addClass(dot, 'active');
            } else {
                DOM.removeClass(dot, 'active');
            }
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.options.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    destroy() {
        this.stopAutoPlay();
        this.slides = [];
        this.carousel = null;
    }
}

/**
 * Inicializar Carrossel de Depoimentos
 */
document.addEventListener('DOMContentLoaded', () => {
    const testimonialCarousel = new Carousel('#testimonialCarousel', {
        autoPlay: true,
        autoPlayInterval: 8000,
        showIndicators: true,
        indicatorsSelector: '#carouselIndicators'
    });

    // Botões de navegação
    const prevBtn = DOM.query('.carousel-btn-prev');
    const nextBtn = DOM.query('.carousel-btn-next');

    if (prevBtn) {
        DOM.on(prevBtn, 'click', () => testimonialCarousel.prev());
    }

    if (nextBtn) {
        DOM.on(nextBtn, 'click', () => testimonialCarousel.next());
    }

    // Parar autoplay ao passar o mouse (desktop)
    const carouselContainer = DOM.query('.carousel-container');
    if (carouselContainer) {
        DOM.on(carouselContainer, 'mouseenter', () => testimonialCarousel.stopAutoPlay());
        DOM.on(carouselContainer, 'mouseleave', () => {
            if (testimonialCarousel.options.autoPlay) {
                testimonialCarousel.startAutoPlay();
            }
        });
    }

    Logger.log('Carrossel de depoimentos inicializado');
});
