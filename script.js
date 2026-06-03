// База данных переводов (RU, EN, DE)
const translations = {
    ru: {
        heroTitle: "Разработка ИТ-решений будущего",
        heroSubtitle: "Создаем высокотехнологичное программное обеспечение и оптимизируем процессы.",
        techTitle: "Технологический стек",
        servicesTitle: "Стоимость услуг",
        reqTitle: "Официальные реквизиты ООО «Сиджакс»",
        price1: "от 150 000 ₽ / по ТЗ",
        price2: "от 5 000 ₽ / час"
    },
    en: {
        heroTitle: "Developing Future IT Solutions",
        heroSubtitle: "We build high-tech software and optimize enterprise internal architecture.",
        techTitle: "Our Tech Stack",
        servicesTitle: "Pricing & Services",
        reqTitle: "Official Requisites of LLC 'Sidjacks'",
        price1: "from 150,000 ₽ / by Specification",
        price2: "from 5,000 ₽ / hour"
    },
    de: {
        heroTitle: "Entwicklung von IT-Lösungen der Zukunft",
        heroSubtitle: "Wir entwickeln Hightech-Software und optimieren Geschäftsprozesse.",
        techTitle: "Technologiestapel",
        servicesTitle: "Preise und Dienstleistungen",
        reqTitle: "Offizielle Requisiten von GmbH 'Sidjacks'",
        price1: "ab 150.000 ₽ / nach Lastenheft",
        price2: "ab 5.000 ₽ / Std"
    }
};

// Функция переключения языков
function changeLanguage(lang) {
    document.querySelectorAll('.lang-switcher button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${lang}`).classList.add('active');
    
    // Если в localStorage есть сохраненный админом заголовок — берем его, иначе локализацию
    const savedHeroTitle = localStorage.getItem('customHeroTitle');
    document.getElementById('hero-title').innerText = (lang === 'ru' && savedHeroTitle) ? savedHeroTitle : translations[lang].heroTitle;
    
    document.getElementById('hero-subtitle').innerText = translations[lang].heroSubtitle;
    document.getElementById('tech-title').innerText = translations[lang].techTitle;
    document.getElementById('services-title').innerText = translations[lang].servicesTitle;
    document.getElementById('req-title').innerText = translations[lang].reqTitle;
    document.getElementById('price-1').innerText = translations[lang].price1;
    document.getElementById('price-2').innerText = translations[lang].price2;
}

// Загрузка сохраненного контента при старте
window.onload = function() {
    if(localStorage.getItem('customHeroTitle')) {
        document.getElementById('hero-title').innerText = localStorage.getItem('customHeroTitle');
    }
};

// Логика модального окна админки
function toggleAdminModal() {
    const modal = document.getElementById('admin-modal');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// Вход в админку (Придумай свой пароль, сейчас стоит 'sidjacks2026')
function loginAdmin() {
    const pass = document.getElementById('admin-password').value;
    if (pass === 'sidjacks2026') { 
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('edit-hero-title').value = document.getElementById('hero-title').innerText;
    } else {
        alert('Неверный ключ доступа!');
    }
}

// Сохранение изменений в браузере твоего ноутбука
function saveAdminChanges() {
    const newTitle = document.getElementById('edit-hero-title').value;
    localStorage.setItem('customHeroTitle', newTitle);
    document.getElementById('hero-title').innerText = newTitle;
    
    const status = document.getElementById('save-status');
    status.innerText = "Изменения успешно сохранены локально!";
    setTimeout(() => { status.innerText = ""; toggleAdminModal(); }, 1500);
}
