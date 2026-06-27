/**
 * Архитектура ядра Cjax.core
 */

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('sjax_custom_headline')) {
        document.getElementById('main-headline').innerHTML = localStorage.getItem('sjax_custom_headline');
    }
    const savedAvatar = localStorage.getItem('sjax_custom_avatar');
    if(savedAvatar) {
        document.getElementById('ceo-avatar').src = savedAvatar;
    }
});

/* Модуль администрирования */
function tryGateAccess() {
    if(document.getElementById('gate-pass').value === 'sudo_rm_rf_sidjacks') {
        localStorage.setItem('sjax_admin_authenticated', 'true');
        document.getElementById('auth-zone').style.display = 'none';
        document.getElementById('control-zone').style.display = 'block';
    } else {
        alert('Доступ запрещен.');
    }
}

function commitDevChanges() {
    const h = document.getElementById('input-headline').value;
    const a = document.getElementById('input-avatar').value;
    
    if (h.trim() !== "") {
        localStorage.setItem('sjax_custom_headline', h);
        document.getElementById('main-headline').innerHTML = h;
    }
    if (a.trim() !== "") {
        localStorage.setItem('sjax_custom_avatar', a);
        document.getElementById('ceo-avatar').src = a;
    }
    alert('Системные параметры успешно применены.');
}

function revokeAdminAccess() {
    localStorage.removeItem('sjax_admin_authenticated');
    document.getElementById('secure-gate').style.display = 'none';
    location.reload();
}

function closeAdminModal() { document.getElementById('secure-gate').style.display = 'none'; }
