// Управление тарифами
const tariffData = {
    usual: {
        price: 'бесплатный',
        priceEn: 'free',
        features: [
            'Личный кабинет организатора и жюри',
            'Конструктор конкурса и загрузка участников из Excel',
            'Подведение итогов после финальной оценки',
            'Автоматический расчёт и оформленные результаты',
            'И многое другое: от шаблонов до архива результатов'
        ]
    },
    pro: {
        price: 'от 5000₽/мес',
        priceEn: 'from 5000₽/month',
        features: [
            'Всё из обычного тарифа +',
            'Приоритетная поддержка 24/7',
            'Кастомная аналитика и дашборды',
            'Интеграция с CRM и API',
            'Неограниченное количество экспертов'
        ]
    }
};

function updateTariff(plan) {
    const data = tariffData[plan];
    const priceDisplay = document.getElementById('priceDisplay');
    const featuresList = document.getElementById('featuresList');
    
    if (!priceDisplay || !featuresList) return;
    
    if (window.getCurrentLang && window.getCurrentLang() === 'en') {
        priceDisplay.textContent = data.priceEn || data.price;
    } else {
        priceDisplay.textContent = data.price;
    }
    
    const items = featuresList.querySelectorAll('li');
    data.features.forEach((text, idx) => {
        if (items[idx]) {
            items[idx].textContent = text;
        }
    });
}

function initTariff() {
    const tariffOptions = document.querySelectorAll('.tariff-option');
    
    tariffOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            tariffOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            const plan = opt.getAttribute('data-plan');
            updateTariff(plan);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTariff);
} else {
    initTariff();
}

window.updateTariff = updateTariff;