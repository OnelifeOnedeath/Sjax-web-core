<?php
$target_dir = "uploads/";
if (!file_exists($target_dir)) { mkdir($target_dir, 0755, true); }

$target_file = $target_dir . "avatar_user.jpg"; // Фиксируем имя
$imageFileType = strtolower(pathinfo($_FILES["avatar"]["name"], PATHINFO_EXTENSION));

// Проверка: это изображение и размер до 2Мб
if(isset($_FILES["avatar"]) && $_FILES["avatar"]["size"] < 2000000) {
    if($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg") {
        if (move_uploaded_file($_FILES["avatar"]["tmp_name"], $target_file)) {
            header("Location: index.html?status=success");
            exit();
        }
    }
}
header("Location: index.html?status=error");
?>
