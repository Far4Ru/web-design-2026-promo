// Навигация
function scrollToScreen(screenId) {
    const screen = document.getElementById(`screen-${screenId}`);
    if (screen) {
        screen.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Закрываем попап при навигации
    const navPopup = document.getElementById('navPopup');
    if (navPopup) {
        navPopup.classList.remove('open');
        const iconMenu = document.querySelector('.icon-menu');
        const iconClose = document.querySelector('.icon-close');
        if (iconMenu) iconMenu.style.display = 'block';
        if (iconClose) iconClose.style.display = 'none';
    }
}

function initNavigation() {
    const headerControlBtn = document.getElementById('headerControlBtn');
    const navPopup = document.getElementById('navPopup');
    const iconMenu = document.querySelector('.icon-menu');
    const iconClose = document.querySelector('.icon-close');
    const screens = document.querySelectorAll('.screen');
    
    let isPopupOpen = false;
    
    // Управление попапом
    if (headerControlBtn && navPopup) {
        headerControlBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isPopupOpen = !isPopupOpen;
            
            if (isPopupOpen) {
                navPopup.classList.add('open');
                if (iconMenu) iconMenu.style.display = 'none';
                if (iconClose) iconClose.style.display = 'block';
            } else {
                navPopup.classList.remove('open');
                if (iconMenu) iconMenu.style.display = 'block';
                if (iconClose) iconClose.style.display = 'none';
            }
        });
    }
    
    // Закрываем попап при клике вне его
    document.addEventListener('click', (e) => {
        if (navPopup && navPopup.classList.contains('open')) {
            if (!navPopup.contains(e.target) && e.target !== headerControlBtn) {
                navPopup.classList.remove('open');
                if (iconMenu) iconMenu.style.display = 'block';
                if (iconClose) iconClose.style.display = 'none';
                isPopupOpen = false;
            }
        }
    });
    
    // Навигационные кнопки в header
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            if (target) {
                scrollToScreen(target);
            }
        });
    });
    
    // Навигационные кнопки в попапе
    document.querySelectorAll('.popup-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            if (target) {
                scrollToScreen(target);
            }
        });
    });
    
    // Навигационные ссылки в футере
    document.querySelectorAll('.footer-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (target) {
                scrollToScreen(target);
            }
        });
    });
    
    // Стрелки вниз для перехода к следующему экрану
    const downArrows = document.querySelectorAll('.scroll-arrow-area');
    downArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const currentScreen = arrow.closest('.screen');
            if (currentScreen) {
                const screensList = Array.from(document.querySelectorAll('.screen'));
                const currentIndex = screensList.indexOf(currentScreen);
                if (currentIndex < screensList.length - 1) {
                    screensList[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Стрелки назад для перехода к предыдущему экрану
    const backArrows = document.querySelectorAll('.scroll-arrow-back-area');
    backArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const currentScreen = arrow.closest('.screen');
            if (currentScreen) {
                const screensList = Array.from(document.querySelectorAll('.screen'));
                const currentIndex = screensList.indexOf(currentScreen);
                if (currentIndex > 0) {
                    screensList[0].scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Кнопки "Перейти в приложение"
    document.querySelectorAll('.app-link, .download-button-card').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Переход в приложение');
        });
    });
    
    // Обработка формы
    const formButton = document.querySelector('.form-block button');
    if (formButton) {
        formButton.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Спасибо! Ваш вопрос отправлен. Мы свяжемся с вами в ближайшее время.');
        });
    }
    
    // Закрываем попап при скролле
    window.addEventListener('scroll', () => {
        if (navPopup && navPopup.classList.contains('open')) {
            navPopup.classList.remove('open');
            if (iconMenu) iconMenu.style.display = 'block';
            if (iconClose) iconClose.style.display = 'none';
            isPopupOpen = false;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

window.scrollToScreen = scrollToScreen;