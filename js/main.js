/* ============================================
   main.js - Свадьба Маши и Семёна
   ВСЕ ФИШКИ В ОДНОМ ФАЙЛЕ
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация всех функций
    initPreloader();
    initThemeSwitcher();
    initParallax();
    initMusicPlayer();
    initBouquetGame();
    initCalendarAnimation();
    initCountdown();
    initFirework();
    initColorPalette();
    initMapAnimation();
    initGuestForm();
    initSmoothScroll();
    initConsoleEasterEgg();
    
});

/* ============================================
   1. ПРЕЛОАДЕР
   ============================================ */
function initPreloader() {
    const container = document.querySelector('.hearts');
    const preloader = document.getElementById('preloader');
    
    if (container) {
        const heartEmojis = ['♥️', '❤️', '💕', '💗', '💖', '💝', '🩷', '💘'];
        
        for (let i = 0; i < 70; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = (12 + Math.random() * 30) + 'px';
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.animationDuration = (3 + Math.random() * 6) + 's';
            heart.style.opacity = Math.random() * 0.6 + 0.2;
            
            container.appendChild(heart);
        }
    }
    
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
   2. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (День/Вечер)
   ============================================ */
function initThemeSwitcher() {
    const switchBtn = document.getElementById('themeSwitch');
    const themeIcon = switchBtn.querySelector('.theme-icon');
    const themeLabel = switchBtn.querySelector('.theme-label');
    const html = document.documentElement;
    
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('wedding-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    switchBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('wedding-theme', newTheme);
        updateThemeButton(newTheme);
        
        // Микро-анимация переключения
        switchBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            switchBtn.style.transform = 'scale(1)';
        }, 200);
    });
    
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeLabel.textContent = 'День';
        } else {
            themeIcon.textContent = '🌙';
            themeLabel.textContent = 'Вечер';
        }
    }
}

/* ============================================
   3. ПАРАЛЛАКС-ЭФФЕКТ
   ============================================ */
function initParallax() {
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxSections.forEach(section => {
            const speed = section.getAttribute('data-parallax') || 0.3;
            const yPos = -(scrolled * speed);
            section.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
        });
    });
}

/* ============================================
   4. МУЗЫКАЛЬНЫЙ ПЛЕЕР С ВИЗУАЛИЗАЦИЕЙ
   ============================================ */
function initMusicPlayer() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const musicIcon = playBtn.querySelector('.music-icon');
    const musicText = playBtn.querySelector('.music-text');
    const visualizer = document.getElementById('visualizer');
    
    if (!audio || !playBtn) return;
    
    let isPlaying = false;
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicIcon.textContent = '🎵';
            musicText.textContent = 'Включить музыку';
            playBtn.classList.remove('playing');
            visualizer.classList.remove('playing');
            isPlaying = false;
        } else {
            audio.play().then(() => {
                musicIcon.textContent = '🎶';
                musicText.textContent = 'Выключить музыку';
                playBtn.classList.add('playing');
                visualizer.classList.add('playing');
                isPlaying = true;
            }).catch(err => {
                console.log('Автовоспроизведение заблокировано браузером. Нажмите ещё раз.');
                alert('Нажмите кнопку ещё раз, чтобы включить музыку 🎵');
            });
        }
    });
    
    // Синхронизация визуализации с реальной громкостью (по возможности)
    if (audio) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            analyser.fftSize = 64;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            function updateVisualizer() {
                if (!isPlaying) return;
                
                analyser.getByteFrequencyData(dataArray);
                const bars = visualizer.querySelectorAll('.bar');
                
                bars.forEach((bar, index) => {
                    const value = dataArray[index] || 0;
                    const height = (value / 255) * 80;
                    bar.style.height = Math.max(5, height) + 'px';
                });
                
                requestAnimationFrame(updateVisualizer);
            }
            
            audio.addEventListener('play', () => {
                audioContext.resume();
                updateVisualizer();
            });
        } catch (e) {
            console.log('Web Audio API не поддерживается, используем CSS-анимацию');
        }
    }
}

/* ============================================
   5. МИНИ-ИГРА "СОБЕРИ БУКЕТ"
   ============================================ */
function initBouquetGame() {
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('score');
    const bouquetContainer = document.getElementById('bouquet');
    const resetBtn = document.getElementById('resetGame');
    
    if (!gameArea) return;
    
    let score = 0;
    let isGameActive = true;
    const flowers = ['🌸', '🌺', '🌷', '🥀', '💐', '🌻', '🌼', '🪷', '🌹', '💮'];
    let gameInterval;
    
    function startGame() {
        score = 0;
        isGameActive = true;
        scoreDisplay.textContent = '0';
        bouquetContainer.innerHTML = '';
        
        gameInterval = setInterval(() => {
            if (!isGameActive) return;
            createFlower();
        }, 600);
    }
    
    function createFlower() {
        const flower = document.createElement('div');
        flower.className = 'flying-flower';
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = Math.random() * 80 + 10 + '%';
        flower.style.top = '-50px';
        flower.style.animationDuration = (3 + Math.random() * 4) + 's';
        
        flower.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!isGameActive) return;
            
            score += 10;
            scoreDisplay.textContent = score;
            
            // Добавляем цветок в букет
            const bouquetFlower = document.createElement('span');
            bouquetFlower.textContent = this.textContent;
            bouquetFlower.style.animation = 'popIn 0.3s ease';
            bouquetContainer.appendChild(bouquetFlower);
            
            // Эффект при сборе
            this.style.transform = 'scale(2)';
            this.style.opacity = '0';
            this.style.transition = 'all 0.2s ease';
            
            // Показываем +10
            showFloatingScore(this, '+10');
            
            setTimeout(() => this.remove(), 200);
            
            // Проверка на рекорд
            if (score % 100 === 0 && score > 0) {
                showBonusMessage();
            }
        });
        
        gameArea.appendChild(flower);
        
        // Удаляем цветок после падения
        setTimeout(() => {
            if (flower.parentNode) {
                flower.remove();
            }
        }, 7000);
    }
    
    function showFloatingScore(element, text) {
        const floater = document.createElement('div');
        floater.textContent = text;
        floater.style.cssText = `
            position: absolute;
            left: ${element.style.left};
            top: ${element.style.top};
            color: var(--wine);
            font-weight: 700;
            font-size: 20px;
            pointer-events: none;
            animation: floatUp 1s ease forwards;
            z-index: 10;
        `;
        gameArea.appendChild(floater);
        setTimeout(() => floater.remove(), 1000);
    }
    
    function showBonusMessage() {
        const messages = [
            '🔥 Шикарный букет!',
            '⭐ Молодожёны в восторге!',
            '💝 Романтика зашкаливает!',
            '🎉 Свадебный букет чемпиона!'
        ];
        
        const bonus = document.createElement('div');
        bonus.textContent = messages[Math.floor(Math.random() * messages.length)];
        bonus.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
            font-weight: 700;
            color: var(--wine);
            animation: bonusPop 1.5s ease forwards;
            pointer-events: none;
            z-index: 20;
            text-align: center;
        `;
        gameArea.appendChild(bonus);
        setTimeout(() => bonus.remove(), 1500);
    }
    
    // Добавляем анимации
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatUp {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-50px); }
        }
        @keyframes bonusPop {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    resetBtn.addEventListener('click', () => {
        // Очищаем все цветы
        const allFlowers = gameArea.querySelectorAll('.flying-flower');
        allFlowers.forEach(f => f.remove());
        
        // Перезапускаем игру
        clearInterval(gameInterval);
        startGame();
    });
    
    // Обработка клика по игровому полю (мимо цветов) = промах
    gameArea.addEventListener('click', function(e) {
        if (e.target === gameArea && isGameActive) {
            // Маленький штраф за промах
            score = Math.max(0, score - 5);
            scoreDisplay.textContent = score;
        }
    });
    
    // Запускаем игру
    startGame();
}

/* ============================================
   6. АНИМАЦИЯ КАЛЕНДАРЯ
   ============================================ */
function initCalendarAnimation() {
    const weddingDay = document.querySelector('.calendar-wedding-day');
    
    if (!weddingDay) return;
    
    // Конфетти при клике на дату
    weddingDay.addEventListener('click', function(e) {
        createConfetti(e.clientX, e.clientY, 15);
    });
    
    // Эффект при наведении
    weddingDay.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.4)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    weddingDay.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1.3)';
    });
}

/* ============================================
   7. ТАЙМЕР ОБРАТНОГО ОТСЧЕТА
   ============================================ */
function initCountdown() {
    const weddingDate = new Date('2026-09-06T15:00:00').getTime();
    
    function animateChange(element, newValue) {
        if (!element) return;
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
        
        if (diff <= 0) {
            if (timerContainer) {
                timerContainer.innerHTML = `
                    <div style="
                        font-size: 48px; 
                        font-weight: 700; 
                        text-align: center; 
                        width: 100%;
                        background: var(--gradient-main);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        animation: pulse 2s infinite;
                    ">
                        СЕГОДНЯ! 🎉💍
                    </div>`;
            }
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        animateChange(daysElement, String(days).padStart(2, '0'));
        animateChange(hoursElement, String(hours).padStart(2, '0'));
        animateChange(minutesElement, String(minutes).padStart(2, '0'));
        animateChange(secondsElement, String(seconds).padStart(2, '0'));
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ============================================
   8. ФЕЙЕРВЕРК ПРИ КЛИКЕ НА ТАЙМЕР
   ============================================ */
function initFirework() {
    const countdownSection = document.querySelector('.countdown-section');
    const fireworkContainer = document.getElementById('fireworkContainer');
    
    if (!countdownSection || !fireworkContainer) return;
    
    countdownSection.addEventListener('click', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        createFirework(x, y);
    });
    
    // Для мобильных - по центру экрана
    countdownSection.addEventListener('touchstart', function(e) {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        createFirework(x, y);
    });
}

function createFirework(x, y) {
    const colors = [
        '#FF6B6B', '#FF8E8E', '#FFD93D', '#FFE66D',
        '#6BCB77', '#8FD99A', '#4D96FF', '#79B4FF',
        '#FF69B4', '#FFB6C1', '#C9A96E', '#E8D5A3',
        '#8B0000', '#C41E3A', '#FF4500', '#FF6347'
    ];
    
    const particleCount = 40;
    const container = document.getElementById('fireworkContainer');
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 50 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 3 + Math.random() * 8;
        
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            --tx: ${tx}px;
            --ty: ${ty}px;
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
    
    // Дополнительные искры
    setTimeout(() => {
        for (let i = 0; i < 20; i++) {
            const spark = document.createElement('div');
            spark.className = 'firework-particle';
            
            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 0.5) * 200;
            
            spark.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: #FFD700;
                --tx: ${tx}px;
                --ty: ${ty}px;
                box-shadow: 0 0 10px #FFD700;
            `;
            
            container.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }
    }, 200);
}

function createConfetti(x, y, count) {
    const emojis = ['🎉', '💝', '✨', '💕', '🎊', '💍', '🥂', '🎀'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${16 + Math.random() * 20}px;
            pointer-events: none;
            z-index: 99999;
            transition: all 1.5s ease-out;
            opacity: 1;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${-(Math.random() * 200 + 100)}px) rotate(${Math.random() * 720}deg)`;
            confetti.style.opacity = '0';
        }, 10);
        
        setTimeout(() => confetti.remove(), 1500);
    }
}

/* ============================================
   9. ГЕНЕРАТОР ЦВЕТОВОЙ ПАЛИТРЫ
   ============================================ */
function initColorPalette() {
    const colorCircles = document.querySelectorAll('.color-circle');
    const suggestion = document.getElementById('colorSuggestion');
    
    const suggestions = {
        'Бордовый': '👗 Идеально для вечернего платья в пол или элегантного костюма с бабочкой',
        'Винный': '👔 Шикарный цвет для классического образа. Добавьте золотые аксессуары!',
        'Розовый': '🌸 Нежный образ для подружек невесты или романтичных гостей',
        'Рубиновый': '💎 Роскошный глубокий оттенок. Подойдёт для самых стильных гостей',
        'Марсала': '🍷 Трендовый оттенок. Будете выглядеть как звезда красной дорожки!'
    };
    
    colorCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            const colorName = this.getAttribute('data-color');
            const colorHex = this.style.background;
            
            // Подсветка выбранного
            colorCircles.forEach(c => c.style.transform = 'scale(1)');
            this.style.transform = 'scale(1.3)';
            
            // Показываем подсказку
            suggestion.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: ${colorHex};
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    "></div>
                    <div style="text-align: left;">
                        <strong>${colorName}</strong><br>
                        <span style="font-size: 14px;">${suggestions[colorName]}</span>
                    </div>
                </div>
            `;
            
            // Маленький взрыв конфетти
            const rect = this.getBoundingClientRect();
            createConfetti(rect.left + rect.width/2, rect.top + rect.height/2, 8);
        });
    });
}

/* ============================================
   10. АНИМИРОВАННЫЙ МАРШРУТ НА КАРТЕ
   ============================================ */
function initMapAnimation() {
    const mapContainer = document.getElementById('mapContainer');
    
    if (!mapContainer) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                mapContainer.classList.add('animate');
                
                // Запускаем анимацию машинки
                const routeLine = mapContainer.querySelector('.route-line');
                if (routeLine) {
                    routeLine.style.setProperty('--animate', 'true');
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    observer.observe(mapContainer);
    
    // Добавляем эффект пульсации пина при клике
    const mapPin = mapContainer.querySelector('.map-pin');
    if (mapPin) {
        mapPin.addEventListener('click', function() {
            this.style.animation = 'none';
            this.offsetHeight; // reflow
            this.style.animation = 'mapPinBounce 0.5s ease 3';
            
            setTimeout(() => {
                this.style.animation = 'mapPinBounce 2s infinite';
            }, 1500);
        });
    }
}

/* ============================================
   11. ФОРМА ГОСТЯ (RSVP) С WHATSAPP
   ============================================ */
function initGuestForm() {
    const form = document.getElementById('guestForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const presenceInput = form.querySelector('input[name="presence"]:checked');
        const childrenInput = form.querySelector('input[name="children"]');
        const wishesInput = form.querySelector('textarea[name="wishes"]');
        
        // Валидация
        if (!nameInput || !nameInput.value.trim()) {
            shakeElement(nameInput);
            alert('Пожалуйста, введите ваше ФИО 🙏');
            return false;
        }
        
        if (!phoneInput || !phoneInput.value.trim()) {
            shakeElement(phoneInput);
            alert('Пожалуйста, введите номер телефона 📱');
            return false;
        }
        
        if (!presenceInput) {
            alert('Пожалуйста, выберите вариант ответа 🤔');
            return false;
        }
        
        // Блокируем кнопку
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'ОТПРАВЛЯЕТСЯ...';
        }
        
        // Формируем сообщение для WhatsApp
        const message = encodeURIComponent(
            `🎉 *АНКЕТА ГОСТЯ*\n\n` +
            `👤 *ФИО:* ${nameInput.value.trim()}\n` +
            `📱 *Телефон:* ${phoneInput.value.trim()}\n` +
            `✅ *Присутствие:* ${presenceInput.value}\n` +
            (childrenInput.value.trim() ? `👶 *Дети:* ${childrenInput.value.trim()}\n` : '') +
            (wishesInput.value.trim() ? `💝 *Пожелания:* ${wishesInput.value.trim()}\n` : '') +
            `\n---\n📅 Отправлено: ${new Date().toLocaleDateString('ru-RU')}\n` +
            `💍 Свадьба Маши и Семёна | 6 сентября 2026`
        );
        
        // ЗАМЕНИТЕ НА ВАШ НОМЕР WHATSAPP:
        const phoneNumber = '79991234567';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        setTimeout(() => {
            form.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // Конфетти успеха
            createConfetti(window.innerWidth / 2, window.innerHeight / 2, 25);
            
            // Открываем WhatsApp
            window.open(whatsappUrl, '_blank');
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ОТПРАВИТЬ';
            }
        }, 800);
        
        return false;
    });
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.style.borderColor = 'red';
    setTimeout(() => {
        element.style.animation = '';
        element.style.borderColor = '';
    }, 500);
}

// Добавляем анимацию shake
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

/* ============================================
   12. ПЛАВНЫЙ СКРОЛЛ
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
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
   13. ПАСХАЛКИ В КОНСОЛИ
   ============================================ */
function initConsoleEasterEgg() {
    console.log(`
    💍💍💍💍💍💍💍💍💍💍💍💍💍💍💍
    💍                          💍
    💍  СВАДЬБА МАШИ И СЕМЁНА  💍
    💍    6 сентября 2026      💍
    💍                          💍
    💍💍💍💍💍💍💍💍💍💍💍💍💍💍💍
    `);
    
    console.log('🌈 Если ты это читаешь — ты особенный гость!');
    console.log('🎮 Попробуй игру "Собери букет" на сайте!');
    console.log('🎆 Кликни на таймер — будет салют!');
    console.log('🌙 Переключи тему на вечернюю (кнопка справа вверху)');
    console.log('💝 С любовью, Маша и Семён');
    
    // Секретный код
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'W') {
            console.log('🎂 ТОРТ БУДЕТ! ЧЕСТНОЕ СЛОВО! 🎂');
            createConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
        }
    });
}

/* ============================================
   14. ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
   ============================================ */

// Отключение зума на мобильных
document.addEventListener('dblclick', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        e.preventDefault();
    }
}, { passive: false });

// Определение мобильных
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Обработка ошибок изображений
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.background = 'linear-gradient(135deg, #F5F0EB, #E8D5C8)';
        this.style.minHeight = '200px';
        this.alt = 'Фото скоро появится';
    });
});

// Случайные комплименты в консоли каждые 30 секунд
const compliments = [
    'Ты сегодня шикарно выглядишь! 💫',
    'У тебя отличный вкус на свадьбы! 🎯',
    'Ты будешь звездой танцпола! 💃',
    'С тобой любой праздник — огонь! 🔥',
    'Твой подарок будет лучшим! 🎁',
    'Ты — душа компании! 🎉',
    'Без тебя этот день был бы не таким! 💝'
];

setInterval(() => {
    const random = compliments[Math.floor(Math.random() * compliments.length)];
    console.log(`💌 ${random}`);
}, 30000);

console.log('✅ Все системы свадьбы готовы! Ждём 6 сентября 2026! 🎊');
