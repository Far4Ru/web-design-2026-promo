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
        ],
        featuresEn: [
            'Organizer and jury personal account',
            'Contest builder and Excel upload',
            'Results after final evaluation',
            'Automatic calculation and formatted results',
            'Much more: templates to results archive'
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
        ],
        featuresEn: [
            'Everything in Standard +',
            'Priority support 24/7',
            'Custom analytics and dashboards',
            'CRM and API integration',
            'Unlimited number of experts'
        ]
    }
};

let currentPlan = 'usual';

function updateTariff(plan) {
    currentPlan = plan;
    const data = tariffData[plan];
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'ru';
    const priceDisplay = document.getElementById('priceDisplay');
    const featuresList = document.getElementById('featuresList');

    if (!priceDisplay || !featuresList) return;

    priceDisplay.textContent = lang === 'en' ? (data.priceEn || data.price) : data.price;

    const features = lang === 'en' ? (data.featuresEn || data.features) : data.features;
    const items = featuresList.querySelectorAll('li');
    features.forEach((text, idx) => {
        if (items[idx]) items[idx].textContent = text;
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
window.updateTariffFromLang = () => updateTariff(currentPlan);
