// Анимации и интерактивные эффекты
function initAnimations() {
    // Анимация наклонов списка в продукте
    const featureItems = document.querySelectorAll('.features-list li');
    featureItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 2 - 1;
            const skew = percent * 5;
            const translateX = percent * 10;
            item.style.transform = `skewX(${skew}deg) translateX(${translateX}px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
    
    // Анимация для блоков при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.about-block, .review-card, .tariff-block, .features-list, .form-block, .social-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}