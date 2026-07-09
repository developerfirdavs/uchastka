<?php

$name = isset($_POST['name']) ? $_POST['name'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';


$name = trim(htmlspecialchars(strip_tags($name)));
$phone = trim(htmlspecialchars(strip_tags($phone)));

$message = "Имя клиента: $name\nТелефон: $phone\n";

$subject = "Новая заявка с сайта Лавровы поля"; // Тут меняем тему
$subject = '=?UTF-8?B?'.base64_encode($subject).'?=';

// Заголовки письма
$headers = "From: info@ск-лавровы.рф\r\n";
$headers .= "Content-type: text/plain; charset=UTF-8\r\n";
$headers .= "MIME-Version: 1.0\r\n";

$to = 'info@ск-лавровы.рф';
$mailSent = mail($to, $subject, $message, $headers);


$redirect_url = $_SERVER['HTTP_REFERER'] ?? 'https://lavrovy-polya.ru'; // Если нет реферера, вернёт на главную

if (mail($to, $subject, $message, $headers)) {
    echo '<script>
        alert("Спасибо! Ваша заявка отправлена.");
        window.location.href = "' . $redirect_url . '";
    </script>';
} else {
    echo '<script>
        alert("Ошибка! Попробуйте позже.");
        window.location.href = "' . $redirect_url . '";
    </script>';
}