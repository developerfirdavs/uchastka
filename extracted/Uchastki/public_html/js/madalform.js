// Функция для открытия модального окна
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'flex'; // Показываем модальное окно
}

// Функция для закрытия модального окна
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'none'; // Скрываем модальное окно
}

// Добавляем слушатели событий
document.getElementById('closeModalButton').addEventListener('click', closeModal);


// Закрытие окна при нажатии вне формы
document.getElementById('modalOverlay').addEventListener('click', event => {
    if(event.target.id === 'modalOverlay') {
        closeModal(); // Закрываем окно, если кликнули вне формы
    }
});


const BOT_TOKEN = '8313431544:AAFrdPHMZJUUGdbdmPlI7M3XvP51rMvjbTA';
const CHAT_IDS = {
  alp: '1066811164',
  vozduh: '1066811164',
  usadba: '1066811164',
  default: '1066811164'
};

const projectNames = {
  alp: 'Альпийские луга',
  vozduh: 'Лесной воздух',
  usadba: 'Семейная усадьба',
  default: 'Общий запрос'
};

// Обработчики кнопок "Консультация"
document.querySelectorAll('.consult').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const project = this.getAttribute('data-project') || 'default';
    const form = document.getElementById('registrationForm');
    form.dataset.project = project;
    openModal();
  });
});

// Обработчик отправки формы
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const checkbox = form.querySelector('[name="checkbox"]');

  [nameInput, phoneInput].forEach(i => i.style.border = '');
  checkbox.nextElementSibling.style.color = '';

  let valid = true;

  // Валидация имени
  if (nameInput.value.trim().length < 2) {
    nameInput.style.border = '2px solid red';
    valid = false;
  }

  // Валидация телефона — очистка и проверка длины
  const rawPhone = phoneInput.value.trim();
  const digits = rawPhone.replace(/\D/g, '');

  if (!(digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8')))) {
    phoneInput.style.border = '2px solid red';
    valid = false;
  }

  // Валидация чекбокса
  if (!checkbox.checked) {
    checkbox.nextElementSibling.style.color = 'red';
    valid = false;
  }

  if (!valid) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
  }

  const name = nameInput.value.trim();
  const phone = rawPhone;
  const project = form.dataset.project || 'default';
  const chatId = CHAT_IDS[project] || CHAT_IDS.default;

  const message =
    `Новая заявка\n\n` +
    `Проект: ${projectNames[project]}\n` +
    `Имя: ${name}\n` +
    `Телефон: ${phone}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (data.ok) {
      alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
      form.reset();
      document.getElementById('modalOverlay').style.display = 'none';
    } else {
      throw new Error(data.description || 'Ошибка отправки');
    }
  } catch (error) {
    console.error('Ошибка отправки:', error);
    alert('Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.');
  }
});
