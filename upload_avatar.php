<?php
/**
 * Серверная часть для загрузки аватара пользователя
 * Работает в связке с админ-панелью Cjax.core
 */

// Папка для хранения (должна существовать на хостинге)
$target_dir = "uploads/";

// Создаем папку, если её нет (права 0755)
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0755, true);
}

// Формируем имя файла (используем фиксированное имя для профиля)
$file_extension = strtolower(pathinfo($_FILES["avatar"]["name"], PATHINFO_EXTENSION));
$new_filename = "avatar_user." . $file_extension;
$target_file = $target_dir . $new_filename;

// 1. Проверка: это реально изображение?
$check = getimagesize($_FILES["avatar"]["tmp_name"]);

if($check !== false && $_FILES["avatar"]["size"] < 2000000) { // Лимит 2 Мб
    
    // Разрешенные форматы
    if($file_extension == "jpg" || $file_extension == "jpeg" || $file_extension == "png") {
        
        if (move_uploaded_file($_FILES["avatar"]["tmp_name"], $target_file)) {
            // Успех: перенаправляем обратно на сайт
            header("Location: index.html?upload=success&path=" . $target_file);
            exit();
        }
    }
}

// Если что-то пошло не так
header("Location: index.html?upload=error");
exit();
?>
