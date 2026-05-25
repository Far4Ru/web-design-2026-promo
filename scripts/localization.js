// Локализация
const translations = {
    ru: {
        about_label: "О нас",
        product_label: "Продукт",
        reviews_label: "Отзывы",
        links_label: "Ссылки",
        download_label: "Скачать",
        go_to_app: "Перейти в приложение",
        years: "года",
        uptime_text: "без единой технической накладки во время конкурсов",
        events_label: "провели через нашу систему",
        events_count: "мероприятий",
        organizers: "организаторов",
        time_label: "сократили время подведения итогов до 15 минут",
        tariff: "Тариф",
        questions_title: "Остались вопросы?",
        name_placeholder: "Ваше имя",
        question_placeholder: "Опишите ваш вопрос...",
        email_placeholder: "Адрес электронной почты",
        send_btn: "Отправить",
        feature1: "Личный кабинет организатора и жюри",
        feature2: "Конструктор конкурса и загрузка участников из Excel",
        feature3: "Подведение итогов после финальной оценки",
        feature4: "Автоматический расчёт и оформленные результаты",
        feature5: "И многое другое: от шаблонов до архива результатов",
        review1: "В прошлом году мы три дня перепроверяли таблицы от 12 экспертов. Сейчас со «СмартОценкой» итоги готовы через минуту после последней оценки. Жюри заходят с телефонов, система не даёт никому забыть ни одного участника. Спонсоры больше не спрашивают «а точно ли не ошиблись?» — просто смотрят протокол и переводят призы",
        review2: "Нам важно было, чтобы эксперты-бизнесмены не путались в интерфейсе. И теперь переход к оцениванию занимает три клика даже для 60-летнего инвестора. Плюс система подсветила, что один эксперт поставил 100 баллов по незначимому критерию — мы скорректировали это за минуту. Без СмартОценки заметили бы только через неделю",
        review3: "Наша боль — потерянные бумажные протоколы и конфликты с жюри: «а я так не оценивал». В СмартОценке всё подписано временной меткой и экспертной подписью. Архив за три года открывается в два клика. И главное — не надо никого учить",
        about_text1: "Мы — команда бывших методистов и IT-архитекторов, которая перевела бюрократию оценивания в чистую математику. Нам доверяют конкурсы, где цена ошибки — публичный скандал и отказ спонсоров.",
        about_text2: "Итоги не сформируются, пока последний эксперт не оценит последнего участника. Никаких «ой, а я этого пропустил» или «забыли посмотреть третьего выступающего». Система просто не даст вам ошибиться.",
        about_text3: "Мы не просто считаем баллы — мы даём прозрачность. Каждый эксперт видит веса критериев, каждый организатор получает историю изменений. К нам возвращаются, потому что мы спасаем от стресса и конфликтов."
    },
    en: {
        about_label: "About",
        product_label: "Product",
        reviews_label: "Reviews",
        links_label: "Links",
        download_label: "Download",
        go_to_app: "Go to App",
        years: "years",
        uptime_text: "without a single technical glitch during competitions",
        events_label: "ran through our system",
        events_count: "events",
        organizers: "organizers",
        time_label: "reduced results time to 15 minutes",
        tariff: "Tariff",
        questions_title: "Any questions?",
        name_placeholder: "Your name",
        question_placeholder: "Describe your question...",
        email_placeholder: "Email address",
        send_btn: "Send",
        feature1: "Organizer and jury personal account",
        feature2: "Contest builder and Excel upload",
        feature3: "Results after final evaluation",
        feature4: "Automatic calculation and formatted results",
        feature5: "Much more: templates to results archive",
        review1: "Last year we spent three days re-checking tables from 12 experts. Now with SmartRating, results are ready a minute after the last evaluation. The jury logs in from phones, the system doesn't let anyone forget a single participant. Sponsors no longer ask 'are you sure you didn't make a mistake?' — they just look at the protocol and transfer prizes.",
        review2: "It was important that business experts don't get confused in the interface. Now evaluation takes three clicks even for a 60-year-old investor. Plus, the system highlighted that one expert gave 100 points for an insignificant criterion — we corrected it in a minute. Without SmartRating, we would have noticed only after a week.",
        review3: "Our pain was lost paper protocols and conflicts with the jury: 'I didn't rate that way'. In SmartRating, everything is time-stamped and expert-signed. The archive for three years opens in two clicks. And most importantly — no need to train anyone.",
        about_text1: "We are a team of former methodologists and IT architects who turned evaluation bureaucracy into pure mathematics. Competitions where the cost of error is public scandal and sponsor withdrawal trust us.",
        about_text2: "Results won't be finalized until the last expert evaluates the last participant. No 'oh, I missed this' or 'forgot to watch the third performer'. The system simply won't let you make a mistake.",
        about_text3: "We don't just count points — we provide transparency. Every expert sees criteria weights, every organizer gets an audit trail. People come back because we save them from stress and conflicts."
    }
};

let currentLang = 'ru';

function setLanguage(lang) {
    currentLang = lang;
    
    // Обновляем атрибут data-lang на переключателе
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
        langSwitch.setAttribute('data-lang', lang);
    }
    
    // Обновляем активный класс на кнопках
    document.querySelectorAll('.lang-option').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Обновляем тексты
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
    
    // Обновляем цену тарифа
    if (window.updateTariffFromLang) {
        window.updateTariffFromLang();
    }
}

// Инициализация переключения языка
function initLanguage() {
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}

window.translations = translations;
window.setLanguage = setLanguage;
window.getCurrentLang = () => currentLang;