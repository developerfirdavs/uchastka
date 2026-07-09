<?php
session_start();
$correct_password = "123321"; // Ваш пароль

// Проверяем, был ли отправлен пароль
if (isset($_POST['password'])) {
    if ($_POST['password'] === $correct_password) {
        $_SESSION['authenticated'] = true;
    } else {
        $error = "Неверный пароль!";
    }
}

// Если не авторизован, показываем форму ввода
if (!isset($_SESSION['authenticated'])) {
?>
<!DOCTYPE html>
<html>
<meta charset="UTF-8">
<head>
    <title>Введите пароль</title>
</head>
<body>
    <h1>Доступ ограничен</h1>
    <?php if (isset($error)) echo "<p style='color:red'>$error</p>"; ?>
    <form method="POST">
        <input type="password" name="password" placeholder="Введите пароль" required>
        <button type="submit">Войти</button>
    </form>
</body>
</html>
<?php
    exit(); // Завершаем выполнение, если не авторизован
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Редактирование объектов на карте</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .tabs {
            display: flex;
            background-color: #f1f1f1;
        }
        .tab {
            padding: 14px 20px;
            cursor: pointer;
            background-color: #ddd;
            border: 1px solid #ccc;
            border-bottom: none;
            margin-right: 5px;
            border-radius: 5px 5px 0 0;
        }
        .tab.active {
            background-color: #f9f9f9;
            font-weight: bold;
            border-bottom: 1px solid #f9f9f9;
            margin-bottom: -1px;
        }
        .tab-content {
            display: none;
            width: 100%;
            height: calc(100vh - 50px);
            border: none;
        }
        .tab-content.active {
            display: block;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <div class="tabs">
        <div class="tab active" onclick="openTab(event, 'alpine')">Карта Альпийские луга</div>
        <div class="tab" onclick="openTab(event, 'family')">Карта Семейная усадьба</div>
        <div class="tab" onclick="openTab(event, 'forest')">Карта Лесной воздух</div>
    </div>

    <div id="alpine" class="tab-content active">
        <iframe src="https://docs.google.com/spreadsheets/d/1inVyIZE5m45iaHNhRJKIbNyBsIQ--NSxH4voDoJf2Vc/edit?rm=minimal#gid=0"></iframe>
    </div>

    <div id="family" class="tab-content">
        <iframe src="https://docs.google.com/spreadsheets/d/1awsNwygdtFwAPmCw1wakfcjIBbn6EAX3Q1RLzz2McKE/edit?rm=minimal#gid=0"></iframe>
    </div>

    <div id="forest" class="tab-content">
        <iframe src="https://docs.google.com/spreadsheets/d/1RxaEoflNgrdNcUmVPqwMhTmoI_0sGXYT8p5WNT8RSdI/edit?rm=minimal#gid=0"></iframe>
    </div>

    <script>
        function openTab(evt, tabName) {
            // Скрыть все вкладки
            var tabContents = document.getElementsByClassName("tab-content");
            for (var i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove("active");
            }

            // Убрать активный класс у всех кнопок вкладок
            var tabs = document.getElementsByClassName("tab");
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove("active");
            }

            // Показать текущую вкладку и сделать кнопку активной
            document.getElementById(tabName).classList.add("active");
            evt.currentTarget.classList.add("active");
        }
    </script>
</body>
</html>