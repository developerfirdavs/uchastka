document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    easing: 'ease-in-out-sine'
  });

  setInterval(addItem, 1900);

  var itemsCounter = 1;
  var container = document.getElementById('aos-demo');

  function addItem() {
    if (itemsCounter > 42 || !container) return; // Дополнительная проверка
    var item = document.createElement('div');
    item.classList.add('aos-item');
    item.setAttribute('data-aos', 'fade-up');
    item.innerHTML = '<div class="aos-item__inner"><h3>' + itemsCounter + '</h3></div>';
    container.appendChild(item);
    itemsCounter++;
  }
});


// Добавление класса display-none,
// чтобы избавиться от 'палок' в блоке Наши преимущества
// при уменьшении ширины


function check1024ScreenWidth() {
  const element = document.querySelector('.benefist__border-2');
  const mediaQuery = window.matchMedia('(max-width: 1024px)');

  if (mediaQuery.matches) {
    element.classList.add('display-none');
  } else {
    element.classList.remove('display-none');
  }
}

// Проверяем при загрузке и изменении размера окна
window.addEventListener('load', check1024ScreenWidth);
window.addEventListener('resize', check1024ScreenWidth);


function check768ScreenWidth() {
  const elements = document.querySelectorAll('.benefist__border');
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  function handleResize() {
    elements.forEach(element => {
      if (mediaQuery.matches) {
        element.classList.add('display-none');
      } else {
        element.classList.remove('display-none');
      }
    });
  }
  handleResize();
  mediaQuery.addListener(handleResize);
}

check768ScreenWidth();


document.addEventListener('DOMContentLoaded', function() {
  // Находим все кнопки "Ген.план"
  const genplanButtons = document.querySelectorAll('.act2');
  
  // Находим попап и его элементы
  const popup = document.getElementById('genplanPopup');
  const popupContent = document.querySelector('.popup-content');
  const popupClose = document.querySelector('.popup-close');
  
  // Для каждой кнопки добавляем обработчик
  genplanButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault(); // Отменяем переход по ссылке
      
      // Получаем URL страницы из атрибута data-genplan или из href родительской ссылки
      const pageUrl = this.getAttribute('data-genplan') || this.parentElement.getAttribute('href');
      
      // Создаем iframe с полной заливкой и без видимых границ
      popupContent.innerHTML = `
        <span class="popup-close">&times;</span>
        <iframe src="${pageUrl}" 
                style="width:100%; height:100%; border:none; position:absolute; top:0; left:0;"
                frameborder="0"
                allowfullscreen></iframe>
      `;
      
      // Показываем попап
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Добавляем обработчик для нового крестика
      popupContent.querySelector('.popup-close').addEventListener('click', closePopup);
    });
  });
  
  // Функция закрытия попапа
  function closePopup() {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Очищаем iframe при закрытии
    popupContent.innerHTML = '<span class="popup-close">&times;</span>';
  }
  
  // Закрытие попапа по крестику
  popupClose.addEventListener('click', closePopup);
  
  // Закрытие попапа по клику вне контента
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });
});