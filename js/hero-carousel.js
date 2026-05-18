/**
 * Hero Carousel — Lazy loading, video condicional (desktop only), transicoes suaves
 */
class HeroCarousel {
    constructor() {
        this.items = document.querySelectorAll('.hero-bg-img');
        this.dots = document.querySelectorAll('.hero-dot');
        this.currentIndex = 0;
        this.autoPlayInterval = 6000;
        this.transitionTime = 800;
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (this.items.length === 0) return;

        this.lazyImagesLoaded = new Set();
        this.videoLoaded = false;
        this.init();
    }

    init() {
        if (this.items.length === 0) {
            ErrorHandler.handle(
                new Error('Nenhum item do carrossel encontrado'),
                'HeroCarouselInitError'
            );
            return;
        }

        this.loadLazyAssets();

        this.dots.forEach((dot) => {
            const index = parseInt(dot.dataset.index, 10);
            dot.addEventListener('click', () => {
                try {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                } catch (error) {
                    ErrorHandler.handle(error, 'CarouselNavigationError', { index });
                }
            });

            dot.addEventListener('mouseenter', () => {
                if (!dot.classList.contains('active')) {
                    dot.style.backgroundColor = 'rgba(212, 175, 55, 0.6)';
                }
            });

            dot.addEventListener('mouseleave', () => {
                if (!dot.classList.contains('active')) {
                    dot.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                }
            });
        });

        this.startAutoPlay();

        const wrapper = document.querySelector('.hero');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
            wrapper.addEventListener('mouseleave', () => this.startAutoPlay());
        }

        this.dots.forEach(dot => {
            dot.addEventListener('focus', () => this.stopAutoPlay());
            dot.addEventListener('blur', () => this.startAutoPlay());
        });
    }

    loadLazyAssets() {
        this.items.forEach((item, index) => {
            const lazyImg = item.querySelector('.lazy-bg');
            if (lazyImg && lazyImg.dataset.src) {
                if (index <= 1) {
                    this.loadLazyImage(lazyImg);
                } else {
                    setTimeout(() => this.loadLazyImage(lazyImg), 2000);
                }
            }

            const videoTrigger = item.querySelector('.video-trigger');
            if (videoTrigger && videoTrigger.dataset.video && !this.isMobile) {
                setTimeout(() => this.loadVideo(item, videoTrigger), 3000);
            }
        });
    }

    loadLazyImage(img) {
        if (this.lazyImagesLoaded.has(img)) return;
        const src = img.dataset.src;
        if (src && src !== img.src) {
            img.src = src;
            img.removeAttribute('data-src');
            this.lazyImagesLoaded.add(img);
        }
    }

    loadVideo(item, triggerImg) {
        if (this.videoLoaded) return;
        const videoSrc = triggerImg.dataset.video;

        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.className = 'hero-video';

        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        video.appendChild(source);

        triggerImg.style.display = 'none';
        item.appendChild(video);
        this.videoLoaded = true;
    }

    goToSlide(index) {
        if (index < 0 || index >= this.items.length) return;

        const targetItem = this.items[index];
        const lazyImg = targetItem.querySelector('.lazy-bg');
        if (lazyImg && lazyImg.dataset.src) {
            this.loadLazyImage(lazyImg);
        }

        if (!this.isMobile && !this.videoLoaded) {
            const videoTrigger = targetItem.querySelector('.video-trigger');
            if (videoTrigger && videoTrigger.dataset.video) {
                this.loadVideo(targetItem, videoTrigger);
            }
        }

        this.items.forEach(item => item.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        this.currentIndex = index;
        this.items[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');

        this.dispatchEvent('slideChanged', { index, total: this.items.length });
    }

    nextSlide() {
        let next = this.currentIndex + 1;
        if (next >= this.items.length) next = 0;
        this.goToSlide(next);
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => this.nextSlide(), this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    destroy() {
        this.stopAutoPlay();
        this.dots.forEach(dot => {
            dot.replaceWith(dot.cloneNode(true));
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.heroCarousel = new HeroCarousel();
    });
} else {
    window.heroCarousel = new HeroCarousel();
}
