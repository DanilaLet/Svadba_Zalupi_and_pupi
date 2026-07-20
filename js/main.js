/* ============================================
   main.js - Основной JavaScript файл
   ============================================ */

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация всех функций
    initPreloader();
    initAudioPlayer();
    initPhotoGallery();
    initCountdown();
    initGuestForm();
    
});

/* ============================================
   ПРЕЛОАДЕР
   ============================================ */
function initPreloader() {
    const container = document.querySelector('.hearts');
    const preloader = document.getElementById('preloader');
    
    // Создаём 50 сердечек
    if (container) {
        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '♥️';
            
            // Случайные позиции и размеры
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = (12 + Math.random() * 22) + 'px';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.animationDuration = (3 + Math.random() * 4) + 's';
            
            container.appendChild(heart);
        }
    }
    
    // Скрываем прелоадер через 4 секунды
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Удаляем прелоадер из DOM после анимации
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        }, 4000);
    }
}

/* ============================================
   АУДИО ПЛЕЕР
   ============================================ */
function initAudioPlayer() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.querySelector('.play-icon');
    
    if (!audio || !playBtn) return;
    
    // Обработчик клика по кнопке
    playBtn.addEventListener('click', function() {
        if (audio.paused) {
            // Воспроизводим
            audio.play().then(() => {
                playIcon.textContent = '⏸';
            }).catch(error => {
                console.log('Ошибка воспроизведения:', error);
                // Показываем подсказку для мобильных устройств
                alert('Нажмите на кнопку ещё раз для воспроизведения музыки');
            });
        } else {
            // Ставим на паузу
            audio.pause();
            playIcon.textContent = '▶';
        }
    });
    
    // Обновляем иконку когда аудио заканчивается
    audio.addEventListener('ended', function() {
        playIcon.textContent = '▶';
    });
    
    // Обработка ошибок загрузки аудио
    audio.addEventListener('error', function() {
        console.log('Ошибка загрузки аудиофайла');
        playIcon.textContent = '🔇';
        playBtn.style.opacity = '0.5';
    });
}

/* ============================================
   ФОТОГАЛЕРЕЯ С АНИМАЦИЕЙ
   ============================================ */
function initPhotoGallery() {
    const photos = document.querySelectorAll('.fade-photo');
    
    if (photos.length === 0) return;
    
    // Используем Intersection Observer для ленивой загрузки
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем задержку для каскадной анимации
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 60);
                
                // Прекращаем наблюдение после показа
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Начинаем наблюдение за всеми фото
    photos.forEach(photo => {
        observer.observe(photo);
    });
    
    // Показываем первые фото при загрузке страницы
    setTimeout(() => {
        const visiblePhotos = Array.from(photos).filter(photo => {
            const rect = photo.getBoundingClientRect();
            return rect.top < window.innerHeight + 100;
        });
        
        visiblePhotos.forEach((photo, index) => {
            setTimeout(() => {
                photo.classList.add('show');
            }, index * 60);
        });
    }, 200);
}

/* ============================================
   ТАЙМЕР ОБРАТНОГО ОТСЧЕТА
   ============================================ */
function initCountdown() {
    const weddingDate = new Date('2026-08-12T00:00:00').getTime();
    
    function animateChange(element, newValue) {
        if (!element) return;
        
        // Если значение не изменилось, не анимируем
        if (element.textContent === newValue) return;
        
        // Добавляем класс для анимации
        element.classList.add('animate');
        
        setTimeout(() => {
            element.textContent = newValue;
            element.classList.remove('animate');
        }, 200);
    }
    
    function updateTimer() {
        const now = new Date().getTime();
        const diff = weddingDate - now;
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        const timerContainer = document.getElementById('timer');
        
        // Если дата прошла
        if (diff <= 0) {
            if (timerContainer) {
                timerContainer.innerHTML = '<div style="font-size: 36px; font-weight: 700; text-align: center; width: 100%;">СЕГОДНЯ! 🎉</div>';
            }
            return;
        }
        
        // Вычисляем значения
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        // Форматируем с ведущими нулями
        const daysStr = String(days).padStart(2, '0');
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');
        
        // Обновляем значения с анимацией
        animateChange(daysElement, daysStr);
        animateChange(hoursElement, hoursStr);
        animateChange(minutesElement, minutesStr);
        animateChange(secondsElement, secondsStr);
    }
    
    // Запускаем таймер
    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ============================================
   ФОРМА ГОСТЯ (RSVP)
   ============================================ */
function initGuestForm() {
    const form = document.getElementById('guestForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Базовая валидация
        const nameInput = form.querySelector('input[name="name"]');
        const presenceInput = form.querySelector('input[name="presence"]:checked');
        
        // Проверка имени
        if (!nameInput || !nameInput.value.trim()) {
            alert('Пожалуйста, введите ваше имя и фамилию');
            nameInput.focus();
            return false;
        }
        
        // Проверка выбора присутствия
        if (!presenceInput) {
            alert('Пожалуйста, выберите вариант ответа');
            return false;
        }
        
        // Блокируем кнопку на время отправки
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'ОТПРАВЛЯЕТСЯ...';
        }
        
        // Имитация отправки (замените на реальный сервис)
        setTimeout(() => {
            // Скрываем форму
            form.style.display = 'none';
            
            // Показываем сообщение об успехе
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // Разблокируем кнопку (на случай если форма снова понадобится)
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ОТПРАВИТЬ';
            }
            
            // Здесь можно добавить реальную отправку данных
            sendFormData({
                name: nameInput.value.trim(),
                presence: presenceInput.value
            });
            
        }, 1500);
        
        return false;
    });
}

/* ============================================
   ОТПРАВКА ДАННЫХ ФОРМЫ
   (Замените на свой сервис)
   ============================================ */
function sendFormData(data) {
    // Вариант 1: Google Forms
    // const formUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
    // const formData = new FormData();
    // formData.append('entry.123456789', data.name);
    // formData.append('entry.987654321', data.presence);
    // 
    // fetch(formUrl, {
    //     method: 'POST',
    //     mode: 'no-cors',
    //     body: formData
    // });
    
    // Вариант 2: Formspree (замените YOUR_FORM_ID)
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // });
    
    // Пока просто логируем в консоль
    console.log('Данные формы:', data);
    console.log('Для реальной отправки настройте Google Forms или Formspree');
}

/* ============================================
   ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
   ============================================ */

// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработка ошибок загрузки изображений
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.log('Ошибка загрузки изображения:', this.src);
        // Можно добавить fallback изображение
        // this.src = 'images/fallback.jpg';
    });
});

// Отключаем зум на двойной тап для мобильных
document.addEventListener('dblclick', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        e.preventDefault();
    }
}, { passive: false });

// Добавляем класс для устройств с touch-screen
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Вывод информации в консоль
console.log('🌸 Свадебное приглашение загружено!');
console.log('📅 Дата свадьбы: 12 августа 2026 года');
console.log('💝 С любовью, жених и невеста');