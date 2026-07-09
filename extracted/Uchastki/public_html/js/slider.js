let slideIndex = 0;
const slides = document.getElementById('slides');

// Функция переключения слайда назад
function prevSlide() {
    if (slideIndex > 0) {
        slideIndex--;
    } else {
        slideIndex = slides.children.length - 1;
    }
    updateSlider();
}

// Функция переключения слайда вперёд
function nextSlide() {
    if (slideIndex < slides.children.length - 1) {
        slideIndex++;
    } else {
        slideIndex = 0;
    }
    updateSlider();
}

// Обновление положения слайдеров
function updateSlider() {
    const offset = -slideIndex * 100 + '%';
    slides.style.transform = `translateX(${offset})`;
}

updateSlider(); // Первоначальная инициализация