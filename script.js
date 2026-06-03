/**
 * Скрипт управления функционалом сайта ООО "Сиджакс"
 * Локализация, сохранение заявок в хранилище, симуляция авторизации.
 */

const i18n = {
    ru: {
        headline: "Разработка высокотехнологичного ПО<br><span class='purple-gradient'>и проектирование систем</span>",
        subline: "Создание отказоустойчивых архитектурных решений, обеспечение информационной безопасности и автоматизация инфраструктуры.",
        tenderT: "Регистрация тендерных заявок",
        tenderD: "Внесите данные технического задания для фиксации в распределенной системе обработки заявок.",
        tenderB: "Отправить ТЗ",
        stackH: "Технологический стек",
        legalH: "Реквизиты организации"
    },
    en: {
        headline: "High-Tech Software Development<br><span class='purple-gradient'>and Systems Engineering</span>",
        subline: "Engineering fault-tolerant architectural solutions, ensuring information security, and infrastructure automation.",
        tenderT: "Tender Proposals Registration",
        tenderD: "Enter the technical specification data to commit into the distributed request processing system.",
        tenderB: "Submit Spec",
        stackH: "Technology Stack",
        legalH: "Corporate Requisites"
    },
    de: {
        headline: "High-Tech Softwareentwicklung<br><span class='purple-gradient'>und Systemdesign</span>",
        subline: "Entwicklung fehlertoleranter Architekturen, Gewährleistung der Informationssicherheit und Infrastrukturautomatisierung.",
        tenderT: "Registrierung von Ausschreibungen",
        tenderD: "Geben Sie die Lastenheftdaten ein, um sie im dezentralen Anforderungsverarbeitungssystem zu speichern.",
        tenderB: "Spezifikation senden",
        stackH: "Technologiestapel",
        legalH: "Unternehmensdaten"
    }
};

let currentUser = JSON.parse(localStorage.getItem('sjax_logged_user')) || null;

function setLang(lang) {
    document.querySelectorAll('.lang-selector button').forEach(b => b.classList.remove('active-lang'));
    document.getElementById(`lang-${lang}`).classList.add('active-lang');

    const customH = localStorage.getItem('sjax_custom_headline');
    document.getElementById('main-headline').innerHTML = (lang === 'ru' && customH) ? customH : i18n[lang].headline;
    
    document.getElementById('main-subline').innerText = i18n[lang].subline;
    document.getElementById('tender-title').innerText = i18n[lang].tenderT;
    document.getElementById('tender-desc').innerText = i18n[lang].tenderD;
    document.getElementById('tender-btn').innerText = i18n[lang].tenderB;
    document.getElementById('stack-headline').innerText = i18n[lang].stackH;
    document.getElementById('legal-title').innerText = i18n[lang].legalH;
}

window.onload = function() {
    if(localStorage.getItem('sjax_custom_headline')) {
        document.getElementById('main-headline').innerHTML = localStorage.getItem('sjax_custom_headline');
    }
    const savedAvatar = localStorage.getItem('sjax_custom_avatar') || "https://cdn.phototourl.com/free/2026-06-03-d10186d6-d493-4228-a46b-4784cc7c9f4e.png";
    document.getElementById('ceo-avatar').src = savedAvatar;

    updateUserInterface();
    renderUserTenders();
};

/* Хранение и рендеринг заявок */
function submitTenderToDB() {
    const company = document.getElementById('client-company').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const keywords = document.getElementById('tender-keywords').value.trim();
    const output = document.getElementById('tender-result');

    if (!company || !email || !keywords) {
        output.style.display = "block";
        output.innerHTML = `<span style="color: #ef4444;">[Ошибка] Заполните все поля формы.</span>`;
        return;
    }

    const tenderId = "S_IDX_" + Math.floor(Math.random() * 900000 + 100000);
    const newTender = {
        id: tenderId,
        company: company,
        email: email,
        keywords: keywords,
        date: new Date().toLocaleString(),
        user: currentUser ? currentUser.name : "Анонимный источник"
    };

    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];
    db.push(newTender);
    localStorage.setItem('sjax_global_database', JSON.stringify(db));

    output.style.display = "block";
    output.innerHTML = `<span style="color: #22c55e;">[Успешно] Запись зарегистрирована. UID: ${tenderId}</span>`;

    document.getElementById('client-company').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('tender-keywords').value = '';
    renderUserTenders();
}

function renderUserTenders() {
    const box = document.getElementById('my-tenders-box');
    const container = document.getElementById('tenders-container');
    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];

    if (db.length === 0) {
        box.style.display = "none";
        return;
    }

    box.style.display = "block";
    container.innerHTML = "";
    
    db.reverse().forEach(item => {
        container.innerHTML += `
            <div class="db-tender-item">
                [${item.date}] ID: ${item.id} | Организация: ${item.company} (${item.user}) <br>
                <span>Спецификация: ${item.keywords}</span>
            </div>
        `;
    });
}

/* Симуляция подсистемы авторизации */
function toggleUserModal() {
    const modal = document.getElementById('user-gate');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    if(modal.style.display === 'flex') renderUserModalContent();
}

function renderUserModalContent() {
    const body = document.getElementById('user-modal-body');
    if (currentUser) {
        body.innerHTML = `
            <p class="status-text">[AUTHORIZED] Сессия активна.</p>
            <p style="font-size:14px; margin-bottom:12px;">Пользователь: <strong>${currentUser.name}</strong></p>
            <button onclick="logoutUser()" class="action-btn" style="background:#ef4444;">Выйти</button>
        `;
    } else {
        body.innerHTML = `
            <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Выберите внешнюю платформу для аутентификации:</p>
            <div class="oauth-container">
                <div class="social-btn btn-google" onclick="simulateOAuth('Google', 'Пользователь Google')">Вход через Google</div>
                <div class="social-btn btn-yandex" onclick="simulateOAuth('Yandex', 'Пользователь Яндекс')">Вход через Яндекс</div>
                <div class="social-btn btn-vk" onclick="simulateOAuth('VK', 'Пользователь ВКонтакте')">Вход через VK</div>
            </div>
        `;
    }
}

function simulateOAuth(provider, mockName) {
    currentUser = { name: mockName, provider: provider };
    localStorage.setItem('sjax_logged_user', JSON.stringify(currentUser));
    updateUserInterface();
    renderUserModalContent();
    setTimeout(() => toggleUserModal(), 800);
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('sjax_logged_user');
    updateUserInterface();
    renderUserModalContent();
    setTimeout(() => toggleUserModal(), 600);
}

function updateUserInterface() {
    const navText = document.getElementById('user-nav-name');
    if (currentUser) {
        navText.innerText = `Профиль (${currentUser.provider})`;
        navText.style.color = "var(--highlight)";
    } else {
        navText.innerText = "Войти";
        navText.style.color = "#fff";
    }
}

/* Консоль администратора */
function openAdminModal() { document.getElementById('secure-gate').style.display = 'flex'; }
function closeAdminModal() { document.getElementById('secure-gate').style.display = 'none'; }

function tryGateAccess() {
    const inputPass = document.getElementById('gate-pass').value;
    if(inputPass === 'sudo_rm_rf_sidjacks') {
        document.getElementById('auth-zone').style.display = 'none';
        document.getElementById('control-zone').style.display = 'block';
        document.getElementById('input-headline').value = document.getElementById('main-headline').innerText;
        document.getElementById('input-avatar').value = document.getElementById('ceo-avatar').src;
    } else {
        alert('Ошибка доступа.');
    }
}

function selectPresetAvatar(url) {
    document.getElementById('input-avatar').value = url;
}

function commitDevChanges() {
    const nextHeadline = document.getElementById('input-headline').value;
    const nextAvatar = document.getElementById('input-avatar').value;
    
    localStorage.setItem('sjax_custom_headline', nextHeadline);
    document.getElementById('main-headline').innerHTML = nextHeadline;
    
    if(nextAvatar.trim() !== "") {
        localStorage.setItem('sjax_custom_avatar', nextAvatar);
        document.getElementById('ceo-avatar').src = nextAvatar;
    }
    
    const log = document.getElementById('console-log');
    log.style.color = "#22c55e";
    log.innerText = ">>> Изменения успешно применены.";
    
    setTimeout(() => { log.innerText = ""; closeAdminModal(); }, 1000);
}
