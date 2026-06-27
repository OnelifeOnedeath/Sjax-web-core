/**
 * Архитектура ядра Cjax.core
 * Финальная сборка: поддержка анти-кеширования аватара и управление состоянием
 */

// Инициализация системы
document.addEventListener('DOMContentLoaded', () => {
    // 1. Анти-кеширование аватара: добавляем timestamp, чтобы браузер брал свежий файл
    const avatar = document.getElementById('ceo-avatar');
    if (avatar) {
        avatar.src = "uploads/avatar_user.jpg?v=" + new Date().getTime();
    }

    // 2. Восстановление сохраненного слогана из локального хранилища
    const savedHeadline = localStorage.getItem('sjax_custom_headline');
    if (savedHeadline) {
        document.getElementById('main-headline').innerHTML = savedHeadline;
    }
});

/* Модуль администрирования */

// Вход в терминал
function tryGateAccess() {
    const pass = document.getElementById('gate-pass').value;
    if(pass === 'sudo_rm_rf_sidjacks') {
        localStorage.setItem('sjax_admin_authenticated', 'true');
        document.getElementById('auth-zone').style.display = 'none';
        document.getElementById('control-zone').style.display = 'block';
    } else {
        alert('Ошибка авторизации: ключ не прошел проверку безопасности.');
    }
}

// Применение изменений (заголовок и аватар)
function commitDevChanges() {
    const h = document.getElementById('input-headline').value;
    
    // Обновление заголовка
    if (h.trim() !== "") {
        localStorage.setItem('sjax_custom_headline', h);
        document.getElementById('main-headline').innerHTML = h;
    }
    
    // Аватар: после загрузки через PHP-форму, просто перезагружаем картинку
    const avatar = document.getElementById('ceo-avatar');
    avatar.src = "uploads/avatar_user.jpg?v=" + new Date().getTime();
    
    alert('Системные параметры успешно применены.');
    location.reload(); // Перезагрузка для чистоты состояния
}

// Выход из админки
function revokeAdminAccess() {
    localStorage.removeItem('sjax_admin_authenticated');
    document.getElementById('secure-gate').style.display = 'none';
    location.reload();
}

// Вспомогательные функции UI
function closeAdminModal() { 
    document.getElementById('secure-gate').style.display = 'none'; 
}

function toggleUserModal() {
    // Твой код вызова модального окна входа
    const modal = document.getElementById('secure-gate');
    modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'flex' : 'none';
}

// ... остальной твой функционал (renderGlobalTenders, setLang и др.)
