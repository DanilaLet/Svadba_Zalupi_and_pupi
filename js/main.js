/* ============================================
   main.js - Свадьба Маши и Семёна
   ============================================ */

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация всех функций
    initPreloader();
    initAudioPlayer();
    initSmoothScroll();
    initCountdown();
    initGuestForm();
    initCalendarAnimation();
    initScrollAnimations();
    
});

/* ============================================
   ПРЕЛОАДЕР
   ============================================ */
function initPreloader() {
    const container = document.querySelector('.hearts');
    const preloader = document.getElementById('preloader');
    
    // Создаём 60 сердечек (больше = красивее)
    if (container) {
        const heartEmojis = ['♥️', '❤️', '💕', '💗', '💖', '💝'];
        
        for (let i = 0; i < 60; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            // Случайный смайлик сердечка
            heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            // Случайные позиции и размеры
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = (14 + Math.random() * 28) + 'px';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.animationDuration = (3 + Math.random() * 5) + 's';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            
            container.appendChild(heart);
        }
    }
    
    // Скрываем прелоадер через 4 секунды
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        }, 4000);
    }
}

/* ============================================
   АУДИО ПЛЕЕР (если будет музыка)
   ============================================ */
function initAudioPlayer() {
    // Если в будущем добавите музыку, раскомментируйте:
    /*
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.querySelector('.play-icon');
    
    if (!audio || !playBtn) return;
    
    playBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().then(() => {
                playIcon.textContent = '⏸';
            }).catch(error => {
                console.log('Нажмите ещё раз для музыки');
            });
        } else {
            audio.pause();
            playIcon.textContent = '▶';
        }
    });
    */
}

/* ============================================
   ПЛАВНЫЙ СКРОЛЛ
   ============================================ */
function initSmoothScroll() {
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
}

/* ============================================
   ТАЙМЕР ОБРАТНОГО ОТСЧЕТА
   ============================================ */
function initCountdown() {
    // Устанавливаем дату свадьбы: 6 сентября 2026 года
    const weddingDate = new Date('2026-09-06T15:00:00').getTime();
    
    function animateChange(element, newValue) {
        if (!element) return;
        
        // Если значение не изменилось, не анимируем
        if (element.textContent === newValue) return;
        
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
                timerContainer.innerHTML = `
                    <div style="
                        font-size: 42px; 
                        font-weight: 700; 
                        text-align: center; 
                        width: 100%;
                        color: var(--wine);
                        animation: pulse 2s infinite;
                    ">
                        СЕГОДНЯ! 🎉
                    </div>`;
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
        
        // Получаем данные формы
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const presenceInput = form.querySelector('input[name="presence"]:checked');
        const childrenInput = form.querySelector('input[name="children"]');
        const wishesInput = form.querySelector('textarea[name="wishes"]');
        
        // Валидация
        if (!nameInput || !nameInput.value.trim()) {
            alert('Пожалуйста, введите ваше ФИО 🙏');
            nameInput.focus();
            return false;
        }
        
        if (!phoneInput || !phoneInput.value.trim()) {
            alert('Пожалуйста, введите номер телефона 📱');
            phoneInput.focus();
            return false;
        }
        
        if (!presenceInput) {
            alert('Пожалуйста, выберите вариант ответа 🤔');
            return false;
        }
        
        // Блокируем кнопку на время отправки
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'ОТПРАВЛЯЕТСЯ...';
        }
        
        // Формируем сообщение
        const message = encodeURIComponent(
            `🎉 *АНКЕТА ГОСТЯ*\n\n` +
            `👤 *ФИО:* ${nameInput.value.trim()}\n` +
            `📱 *Телефон:* ${phoneInput.value.trim()}\n` +
            `✅ *Присутствие:* ${presenceInput.value}\n` +
            (childrenInput.value.trim() ? `👶 *Дети:* ${childrenInput.value.trim()}\n` : '') +
            (wishesInput.value.trim() ? `💝 *Пожелания:* ${wishesInput.value.trim()}\n` : '') +
            `\n---\n📅 Дата отправки: ${new Date().toLocaleDateString('ru-RU')}`
        );
        
        // Открываем WhatsApp с сообщением
        // ЗАМЕНИТЕ НОМЕР НА ВАШ:
        const phoneNumber = '79991234567'; // Укажите ваш номер для WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        // Показываем сообщение об успехе
        setTimeout(() => {
            form.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // Открываем WhatsApp в новой вкладке
            window.open(whatsappUrl, '_blank');
            
            // Разблокируем кнопку
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ОТПРАВИТЬ';
            }
        }, 1000);
        
        return false;
    });
}

/* ============================================
   АНИМАЦИЯ КАЛЕНДАРЯ
   ============================================ */
function initCalendarAnimation() {
    const weddingDay = document.querySelector('.calendar-wedding-day');
    
    if (!weddingDay) return;
    
    // Добавляем эффект пульсации при наведении
    weddingDay.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.3)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    weddingDay.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1.2)';
    });
    
    // Добавляем конфетти при клике на дату (шутка)
    weddingDay.addEventListener('click', function() {
        this.style.transform = 'scale(1.5)';
        setTimeout(() => {
            this.style.transform = 'scale(1.2)';
        }, 200);
        
        // Можно добавить реальный эффект конфетти
        createMiniConfetti(this);
    });
}

/* ============================================
   МИНИ-КОНФЕТТИ (для календаря)
   ============================================ */
function createMiniConfetti(element) {
    const confettiEmojis = ['🎉', '💝', '✨', '💕', '🎊', '💍'];
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 99999;
            transition: all 1s ease-out;
            opacity: 1;
        `;
        
        document.body.appendChild(confetti);
        
        // Анимируем разлёт
        setTimeout(() => {
            confetti.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${-(Math.random() * 150 + 50)}px) rotate(${Math.random() * 720}deg)`;
            confetti.style.opacity = '0';
        }, 10);
        
        // Удаляем после анимации
        setTimeout(() => {
            confetti.remove();
        }, 1000);
    }
}

/* ============================================
   АНИМАЦИИ ПРИ СКРОЛЛЕ
   ============================================ */
function initScrollAnimations() {
    // Анимируем появление элементов при скролле
    const animatedElements = document.querySelectorAll('.detail-item, .timeline-item, .color-circle');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });
}

/* ============================================
   ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ
   ============================================ */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn('Изображение не найдено:', this.src);
        // Добавляем fallback стили
        this.style.background = '#F5F0EB';
        this.style.minHeight = '200px';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.alt = 'Изображение скоро появится';
    });
});

/* ============================================
   ОТКЛЮЧЕНИЕ ЗУМА НА МОБИЛЬНЫХ
   ============================================ */
document.addEventListener('dblclick', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        e.preventDefault();
    }
}, { passive: false });

/* ============================================
   ОПРЕДЕЛЕНИЕ МОБИЛЬНЫХ УСТРОЙСТВ
   ============================================ */
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

/* ============================================
   КОНСОЛЬНОЕ ПРИВЕТСТВИЕ
   ============================================ */
console.log(`
💍 Свадьба Маши и Семёна
📅 6 сентября 2026 года
📍 Волгоград, Советский район

Если ты это читаешь, значит ты из тех самых гостей,
кто лазит в консоли разработчика! 🤓
Не забудь заполнить анкету и взять с собой хорошее настроение! 🎉

P.S. А вот и пасхалка для самых любопытных! 🥚
`);

/* ============================================
   ДОПОЛНИТЕЛЬНЫЕ ФИШКИ
   ============================================ */

// Случайные комплименты в консоли
const compliments = [
    'Ты сегодня отлично выглядишь! 💫',
    'У тебя прекрасный вкус на свадьбы! 🎯',
    'Ты точно будешь звездой танцпола! 💃',
    'С тобой любой праздник в кайф! 🎊',
    'Твой подарок будет лучшим! 🎁'
];

console.log(compliments[Math.floor(Math.random() * compliments.length)]);

// Скрытая фича: если ввести "торт" в консоли
window.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        console.log('🎂 Торт будет! Обещаем!');
    }
});

// Автоматическое обновление года в футере (если будет)
const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
});
