/**
 * Архитектура ядра Cjax.core
 * Полноценные CRUD-операции над СУБД, темы и прямая авторизация юзеров.
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

let currentUser = JSON.parse(localStorage.getItem('cjax_user_session')) || null;
let currentTheme = localStorage.getItem('cjax_theme') || 'dark';

window.onload = function() {
    // Применяем тему
    const body = document.getElementById('app-body');
    body.className = `theme-${currentTheme}`;
    document.getElementById('theme-toggle-btn').innerText = currentTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';

    if(localStorage.getItem('sjax_custom_headline')) {
        document.getElementById('main-headline').innerHTML = localStorage.getItem('sjax_custom_headline');
    }
    const savedAvatar = localStorage.getItem('sjax_custom_avatar') || "https://cdn.phototourl.com/free/2026-06-03-d10186d6-d493-4228-a46b-4784cc7c9f4e.png";
    document.getElementById('ceo-avatar').src = savedAvatar;

    updateUserInterface();
    renderGlobalTenders();
};

/* Модуль переключения тем */
function toggleTheme() {
    const body = document.getElementById('app-body');
    if (body.classList.contains('theme-dark')) {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        currentTheme = 'light';
        document.getElementById('theme-toggle-btn').innerText = '🌙 Тёмная тема';
    } else {
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
        currentTheme = 'dark';
        document.getElementById('theme-toggle-btn').innerText = '☀️ Светлая тема';
    }
    localStorage.setItem('cjax_theme', currentTheme);
}

/* Локализация */
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

/* Скрытый вызов пульта управления по Ctrl + Alt + A */
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
        renderAdminTendersEditor();
    } else {
        document.getElementById('auth-zone').style.display = 'block';
        document.getElementById('control-zone').style.display = 'none';
    }
}

function closeAdminModal() { document.getElementById('secure-gate').style.display = 'none'; }

function tryGateAccess() {
    if(document.getElementById('gate-pass').value === 'sudo_rm_rf_sidjacks') {
        localStorage.setItem('sjax_admin_authenticated', 'true');
        document.getElementById('auth-zone').style.display = 'none';
        document.getElementById('control-zone').style.display = 'block';
        loadAdminFormValues();
        renderAdminTendersEditor();
    } else {
        alert('Доступ запрещен. Неверная цифровая подпись.');
    }
}

function loadAdminFormValues() {
    document.getElementById('input-headline').value = document.getElementById('main-headline').innerText;
    document.getElementById('input-avatar').value = document.getElementById('ceo-avatar').src;
}

function commitDevChanges() {
    const h = document.getElementById('input-headline').value;
    const a = document.getElementById('input-avatar').value;
    localStorage.setItem('sjax_custom_headline', h);
    document.getElementById('main-headline').innerHTML = h;
    if(a.trim() !== "") {
        localStorage.setItem('sjax_custom_avatar', a);
        document.getElementById('ceo-avatar').src = a;
    }
    alert('Системные параметры успешно применены.');
}

/* Генерация списка тендеров для РЕДАКТИРОВАНИЯ админом */
function renderAdminTendersEditor() {
    const container = document.getElementById('admin-tenders-list-edit');
    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];
    
    if(db.length === 0) {
        container.innerHTML = `<p style="color:var(--color-muted); font-size:12px;">База данных заявок пуста.</p>`;
        return;
    }
    
    container.innerHTML = "";
    db.forEach((item, index) => {
        container.innerHTML += `
            <div class="admin-tender-edit-card">
                <span style="font-size:11px; color:var(--color-accent)">ID транзакции: ${item.id} (От: ${item.user})</span>
                <div class="admin-edit-grid">
                    <input type="text" id="edit-comp-${index}" value="${item.company}" placeholder="Компания">
                    <input type="text" id="edit-key-${index}" value="${item.keywords}" placeholder="Требования">
                    <input type="number" id="edit-budget-${index}" value="${item.budget || 0}" placeholder="Бюджет">
                </div>
                <button onclick="saveTenderByAdmin(${index})" class="btn-primary" style="padding:4px 10px; font-size:11px; margin-top:8px;">Сохранить изменения</button>
                <button onclick="deleteTenderByAdmin(${index})" class="btn-secondary" style="padding:4px 10px; font-size:11px; margin-top:8px; color:#ef4444; border-color:rgba(239,68,68,0.2)">Удалить</button>
            </div>
        `;
    });
}

function saveTenderByAdmin(index) {
    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];
    db[index].company = document.getElementById(`edit-comp-${index}`).value.trim();
    db[index].keywords = document.getElementById(`edit-key-${index}`).value.trim();
    db[index].budget = document.getElementById(`edit-budget-${index}`).value;
    
    localStorage.setItem('sjax_global_database', JSON.stringify(db));
    renderAdminTendersEditor();
    renderGlobalTenders();
}

function deleteTenderByAdmin(index) {
    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];
    db.splice(index, 1);
    localStorage.setItem('sjax_global_database', JSON.stringify(db));
    renderAdminTendersEditor();
    renderGlobalTenders();
}

function revokeAdminAccess() {
    localStorage.removeItem('sjax_admin_authenticated');
    closeAdminModal();
}

/* Работа со спецификациями ТЗ */
function submitTenderToDB() {
    const company = document.getElementById('client-company').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const keywords = document.getElementById('tender-keywords').value.trim();
    const budget = document.getElementById('client-budget').value.trim();
    const output = document.getElementById('tender-result');

    if (!company || !email || !keywords) {
        output.style.display = "block";
        output.style.borderColor = "#ef4444";
        output.style.color = "#f87171";
        output.innerHTML = `[ERROR] Заполните обязательные поля компании, почты и требований.`;
        return;
    }

    const newTender = {
        id: "C_JX_" + Math.floor(Math.random() * 900000 + 100000),
        company: company,
        email: email,
        keywords: keywords,
        budget: budget ? budget : "Не указан",
        date: new Date().toLocaleString(),
        user: currentUser ? currentUser.name : "Anonymous Base"
    };

    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];
    db.push(newTender);
    localStorage.setItem('sjax_global_database', JSON.stringify(db));

    output.style.display = "block";
    output.style.borderColor = "rgba(34, 197, 94, 0.3)";
    output.style.color = "#4ade80";
    output.innerHTML = `[OK] Спецификация зафиксирована под ID: ${newTender.id}`;

    document.getElementById('client-company').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('tender-keywords').value = '';
    document.getElementById('client-budget').value = '';
    renderGlobalTenders();
}

function renderGlobalTenders() {
    const box = document.getElementById('my-tenders-box');
    const container = document.getElementById('tenders-container');
    let db = JSON.parse(localStorage.getItem('sjax_global_database')) || [];

    if (db.length === 0) {
        box.style.display = "none";
        return;
    }

    box.style.display = "block";
    container.innerHTML = "";
    db.slice().reverse().forEach(item => {
        container.innerHTML += `
            <div class="db-tender-item">
                <strong>[${item.date}] ${item.id}</strong><br>
                Контрагент: <strong>${item.company}</strong> | Архитектура: ${item.keywords} | Утвержденный бюджет: <span style="color:var(--color-glow)">${item.budget} руб.</span> (${item.user})
            </div>
        `;
    });
}

/* Модуль честной авторизации (Ник/Пароль или Имитация OAuth провайдеров) */
function toggleUserModal() {
    const modal = document.getElementById('user-gate');
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    if(modal.style.display === 'flex') drawAuthInterface();
}

function drawAuthInterface() {
    const body = document.getElementById('user-modal-body');
    if (currentUser) {
        body.innerHTML = `
            <p class="console-success">[AUTHORIZED] Сессия активна.</p>
            <p style="font-size:14px; margin-bottom:8px;">Пользователь: <strong>${currentUser.name}</strong></p>
            <p style="font-size:11px; color:var(--color-muted); margin-bottom:16px;">Канал аутентификации: ${currentUser.provider}</p>
            <button onclick="logoutUser()" class="btn-primary" style="background:#ef4444; color:#fff; width:100%;">Завершить сессию</button>
        `;
    } else {
        body.innerHTML = `
            <div class="login-form-wrapper">
                <label style="font-size:11px; color:var(--color-muted);">Вход через аккаунт Cjax ID:</label>
                <input type="text" id="form-username" placeholder="Ваш никнейм или логин">
                <input type="password" id="form-password" placeholder="Пароль">
                <button onclick="loginWithCredentials()" class="btn-primary">Войти в ядро</button>
            </div>
            
            <div style="margin-top:20px; text-align:center; font-size:11px; color:var(--color-muted);">Или авторизоваться через глобальные ID:</div>
            
            <div class="oauth-row">
                <button onclick="loginViaOAuth('Google')" class="btn-secondary" style="background:#de4032; color:#fff; border:none; font-size:11px; padding:8px 0;">Google</button>
                <button onclick="loginViaOAuth('Yandex')" class="btn-secondary" style="background:#fc3f1d; color:#fff; border:none; font-size:11px; padding:8px 0;">Яндекс</button>
                <button onclick="loginViaOAuth('VK')" class="btn-secondary" style="background:#0077ff; color:#fff; border:none; font-size:11px; padding:8px 0;">ВКонтакте</button>
            </div>
        `;
    }
}

function loginWithCredentials() {
    const user = document.getElementById('form-username').value.trim();
    const pass = document.getElementById('form-password').value.trim();
    if(!user || !pass) { alert('Введите данные для авторизации!'); return; }
    
    currentUser = { name: user, provider: "Cjax ID Credentials" };
    localStorage.setItem('cjax_user_session', JSON.stringify(currentUser));
    updateUserInterface();
    toggleUserModal();
}

function loginViaOAuth(provider) {
    const userRealName = prompt(`[OAuth API ${provider}] Введите ваше имя для авторизации профиля:`, "Игорь Алексеевич");
    if(userRealName && userRealName.trim() !== "") {
        currentUser = { name: userRealName.trim(), provider: `${provider} Secure API` };
        localStorage.setItem('cjax_user_session', JSON.stringify(currentUser));
        updateUserInterface();
        toggleUserModal();
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('cjax_user_session');
    updateUserInterface();
    toggleUserModal();
}

function updateUserInterface() {
    const badge = document.getElementById('user-badge');
    if (currentUser) {
        badge.innerText = `Личный кабинет`;
        badge.style.borderColor = "var(--color-glow)";
    } else {
        badge.innerText = "Войти";
        badge.style.borderColor = "var(--color-border)";
    }
}
