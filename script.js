/**
 * Скриптная система Cjax Core v2.6
 */

const i18n = {
    ru: {
        headline: "Разработка высокотехнологичного ПО<br><span class='gradient-text'>и проектирование систем</span>",
        subline: "Проектирование отказоустойчивых архитектурных решений, обеспечение информационной безопасности и автоматизация распределенной инфраструктуры.",
        tenderT: "Регистрация тендерных заявок",
        tenderD: "Внесите параметры технического задания для фиксации в распределенном стеке обработки.",
        tenderB: "Отправить ТЗ",
        stackH: "Используемый технологический стек",
        legalH: "Раскрытие информации / Реквизиты"
    },
    en: {
        headline: "High-Tech Software Development<br><span class='gradient-text'>and Systems Engineering</span>",
        subline: "Engineering fault-tolerant architectural systems, information security assurance, and distributed infrastructure automation.",
        tenderT: "Tender Specifications Registration",
        tenderD: "Commit your system technical requirements parameters into the core processing queue.",
        tenderB: "Submit Spec",
        stackH: "Core Technology Stack",
        legalH: "Corporate Transparency & Specifications"
    },
    de: {
        headline: "High-Tech Softwareentwicklung<br><span class='gradient-text'>and Systemdesign</span>",
        subline: "Entwicklung fehlertoleranter Architektursysteme, Gewährleistung der Informationssicherheit und Automatisierung verteilter Infrastrukturen.",
        tenderT: "Registrierung von Projektausschreibungen",
        tenderD: "Übermitteln Sie die Parameter des Lastenhefts zur Erfassung im zentralen Verarbeitungssystem.",
        tenderB: "Spezifikation Senden",
        stackH: "Technologiestapel Kern",
        legalH: "Offenlegung von Informationen und Requisiten"
    }
};

const mockAccounts = {
    Google: [
        { name: "Игорь Бежин", email: "igorb9475@gmail.com" },
        { name: "Рахид ИТ", email: "rahid.dev@gmail.com" }
    ],
    Yandex: [
        { name: "Бежин И.А.", email: "i.bezhin@yandex.ru" },
        { name: "Владимир КИП", email: "vladimir.kip@yandex.ru" }
    ],
    VK: [
        { name: "Игорь Алексеевич", email: "id2074829@vk.com" },
        { name: "Виктория Арт", email: "vvn.art@vk.com" }
    ]
};

let currentUser = JSON.parse(localStorage.getItem('sjax_logged_user')) || null;
let selectedProvider = "";

function setLang(lang) {
    document.querySelectorAll('.lang-box button').forEach(b => b.classList.remove('active-lang'));
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

/* Скрытый Вызов Терминала Управления по Горячим Клавишам (Ctrl + Alt + A) */
window.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.code === 'KeyA') {
        e.preventDefault();
        openAdminModal();
    }
});

function openAdminModal() {
    document.getElementById('secure-gate').style.display = 'flex';
    
    if (localStorage.getItem('sjax_admin_authenticated') === 'true') {
        document.getElementById('auth-zone').style.display = 'none';
        document.getElementById('control-zone').style.display = 'block';
        loadAdminFormValues();
    } else {
        document.getElementById('auth-zone').style.display = 'block';
        document.getElementById('control-zone').style.display = 'none';
    }
}

function closeAdminModal() { document.getElementById('secure-gate').style.display = 'none'; }

function tryGateAccess() {
    const inputPass = document.getElementById('gate-pass').value;
    if(inputPass === 'sudo_rm_rf_sidjacks') {
        localStorage.setItem('sjax_admin_authenticated', 'true');
        document.getElementById('auth-zone').style.display = 'none';
        document.getElementById('control-zone').style.display = 'block';
        loadAdminFormValues();
    } else {
        alert('Ошибка дешифрации ключа. Отказано.');
    }
}

function loadAdminFormValues() {
    document.getElementById('input-headline').value = document.getElementById('main-headline').innerText;
    document.getElementById('input-avatar').value = document.getElementById('ceo-avatar').src;
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
    log.innerText = ">>> Системные параметры переконфигурированы.";
    
    setTimeout(() => { log.innerText = ""; closeAdminModal(); }, 1000);
}

function revokeAdminAccess() {
    localStorage.removeItem('sjax_admin_authenticated');
    document.getElementById('gate-pass').value = '';
    document.getElementById('control-zone').style.display = 'none';
    document.getElementById('auth-zone').style.display = 'block';
    closeAdminModal();
}

/* Модуль обработки данных ТЗ */
function submitTenderToDB() {
    const company = document.getElementById('client-company').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const keywords = document.getElementById('tender-keywords').value.trim();
    const output = document.getElementById('tender-result');

    if (!company || !email || !keywords) {
        output.style.display = "block";
        output.style.borderColor = "#ef4444";
        output.style.color = "#f87171";
        output.innerHTML = `[ERROR] Ошибка заполнения полей спецификации.`;
        return;
    }

    const tenderId = "C_JX_" + Math.floor(Math.random() * 900000 + 100000);
    const newTender = {
        id: tenderId,
        company: company,
        email: email,
        keywords: keywords,
        date: new Date().toLocaleString(),
        user: currentUser ? currentUser.name : "Anonymous Link"
    };

    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];
    db.push(newTender);
    localStorage.setItem('sjax_global_database', JSON.stringify(db));

    output.style.display = "block";
    output.style.borderColor = "rgba(34, 197, 94, 0.2)";
    output.style.color = "#4ade80";
    output.innerHTML = `[OK] Заявка закомичена в стек транзакций. ID: ${tenderId}`;

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
                <strong>[${item.date}] ${item.id}</strong><br>
                Организация: ${item.company} | Сигнатура: ${item.keywords} (${item.user})
            </div>
        `;
    });
}

/* Полноценная сессия пользователей */
function toggleUserModal() {
    const modal = document.getElementById('user-gate');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    if(modal.style.display === 'flex') renderUserModalContent();
}

function renderUserModalContent() {
    const body = document.getElementById('user-modal-body');
    if (currentUser) {
        body.innerHTML = `
            <p class="console-success">[AUTHORIZED] Токен действителен.</p>
            <p style="font-size:13px; margin-bottom:16px;">Субъект: <strong>${currentUser.name}</strong></p>
            <p style="font-size:11px; color:var(--color-muted); margin-bottom:12px;">Провайдер: ${currentUser.provider}</p>
            <button onclick="logoutUser()" class="btn-primary" style="background:#ef4444; color:#fff;">Завершить сессию</button>
        `;
    } else {
        body.innerHTML = `
            <p style="font-size:12px; color:var(--color-muted); margin-bottom:12px;">Выберите OAuth2 провайдера для авторизации:</p>
            <div class="oauth-list">
                <div class="oauth-btn oa-g" onclick="openOAuthSelector('Google')">Google Workspace ID</div>
                <div class="oauth-btn oa-y" onclick="openOAuthSelector('Yandex')">Яндекс ID Коннект</div>
                <div class="oauth-btn oa-v" onclick="openOAuthSelector('VK')">VK ID Gate</div>
            </div>
        `;
    }
}

function openOAuthSelector(provider) {
    selectedProvider = provider;
    document.getElementById('user-gate').style.display = 'none';
    
    const screen = document.getElementById('oauth-selector-screen');
    const title = document.getElementById('oauth-screen-title');
    const container = document.getElementById('oauth-profiles-container');
    
    title.innerText = `Вход через аккаунт ${provider}`;
    screen.style.display = 'flex';
    container.innerHTML = '';
    
    mockAccounts[provider].forEach(account => {
        container.innerHTML += `
            <div class="oauth-account-item" onclick="selectProfile('${account.name}', '${account.email}')">
                <div class="oauth-avatar-circle">${account.name[0]}</div>
                <div class="oauth-details">
                    <span class="oauth-name">${account.name}</span>
                    <span class="oauth-email">${account.email}</span>
                </div>
            </div>
        `;
    });
}

function closeOAuthScreen() {
    document.getElementById('oauth-selector-screen').style.display = 'none';
    document.getElementById('user-gate').style.display = 'flex';
}

function selectProfile(name, email) {
    currentUser = { name: name, email: email, provider: selectedProvider };
    localStorage.setItem('sjax_logged_user', JSON.stringify(currentUser));
    
    document.getElementById('oauth-selector-screen').style.display = 'none';
    updateUserInterface();
    toggleUserModal();
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('sjax_logged_user');
    updateUserInterface();
    renderUserModalContent();
    setTimeout(() => toggleUserModal(), 400);
}

function updateUserInterface() {
    const badge = document.getElementById('user-badge');
    if (currentUser) {
        badge.innerText = `Профиль`;
        badge.style.borderColor = "var(--color-glow)";
    } else {
        badge.innerText = "Войти";
        badge.style.borderColor = "var(--color-border)";
    }
}
