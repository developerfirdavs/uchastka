document.addEventListener('DOMContentLoaded', function() {
  // Обработчик клика по превью
  document.querySelectorAll('.video-preview').forEach(preview => {
    preview.addEventListener('click', function(e) {
      e.preventDefault();
      const videoSrc = this.getAttribute('data-video');
      const popup = document.querySelector('.video-popup-overlay');
      const videoPlayer = popup.querySelector('.video-popup-player');
      
      // Очищаем предыдущий источник
      videoPlayer.innerHTML = '';
      
      // Создаем новый source элемент
      const source = document.createElement('source');
      source.src = videoSrc;
      source.type = 'video/mp4';
      videoPlayer.appendChild(source);
      
      // Показываем попап и пытаемся воспроизвести
      popup.style.display = 'flex';
      videoPlayer.load(); // Важно: сначала загружаем
      
      videoPlayer.play().catch(error => {
        console.error('Autoplay failed:', error);
        videoPlayer.controls = true; // Показываем контролы если автовоспроизведение заблокировано
      });
    });
  });

  // Закрытие попапа
  document.querySelector('.video-popup-close').addEventListener('click', function() {
    const popup = document.querySelector('.video-popup-overlay');
    const videoPlayer = popup.querySelector('.video-popup-player');
    
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    popup.style.display = 'none';
  });

  // Закрытие по клику на оверлей
  document.querySelector('.video-popup-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      const videoPlayer = this.querySelector('.video-popup-player');
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
      this.style.display = 'none';
    }
  });
});