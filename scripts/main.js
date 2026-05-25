// Главный файл инициализации
function init() {
    if (window.setLanguage) {
        window.setLanguage('ru');
    }
    
    if (window.updateTariff) {
        window.updateTariff('usual');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}