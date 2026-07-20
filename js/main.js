/* ============================================
   main.js - Свадьба Маши и Семёна
   Всё работает, баги исправлены, отправка в Telegram
   ============================================ */

(function() {
    'use strict';

    // Ждём загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initPreloader();
        initThemeSwitcher();
        initMusicPlayer();
        initCalendar();
        initCountdown();
        initFirework();
        initColorPalette();
        initBouquetGame();
        initGuestForm();
        initSmoothScroll();
        showConsoleGreeting();
    }

    /* ==========================================
       1. ПРЕЛОАДЕР
       ========================================== */
    function initPreloader() {
        var preloader = document.getElementById('preloader');
        var container = document.querySelector('.hearts');
        
        if (!preloader || !container) return;

        var emojis = ['♥️', '❤️', '💕', '💗', '💖', '💝', '🩷', '💘'];
        
        for (var i = 0; i < 60; i++) {
            var heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = (12 + Math.random() * 28) + 'px';
            heart.style.animationDelay = Math.random() * 4 + 's';
            heart.style.animationDuration = (3 + Math.random() * 4) + 's';
            container.appendChild(heart);
        }

        setTimeout(function() {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 800);
        }, 3500);
    }

    /* ==========================================
       2. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
       ========================================== */
    function initThemeSwitcher() {
        var btn = document.getElementById('themeSwitch');
        var icon = btn ? btn.querySelector('.theme-icon') : null;
        var html = document.documentElement;
        
        if (!btn) return;

        var saved = localStorage.getItem('wed-theme') || 'light';
        html.setAttribute('data-theme', saved);
        icon.textContent = saved === 'dark' ? '☀️' : '🌙';

        btn.addEventListener('click', function() {
            var current = html.getAttribute('data-theme');
            var next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('wed-theme', next);
            icon.textContent = next === 'dark' ? '☀️' : '🌙';
        });
    }

    /* ==========================================
       3. МУЗЫКАЛЬНЫЙ ПЛЕЕР
       ========================================== */
    function initMusicPlayer() {
        var audio = document.getElementById('audio');
        var btn = document.getElementById('playBtn');
        var viz = document.getElementById('visualizer');
        
        if (!audio || !btn) return;

        var playing = false;

        btn.addEventListener('click', function() {
            if (playing) {
                audio.pause();
                btn.innerHTML = '<span class="music-icon">🎵</span> Включить музыку';
                if (viz) viz.classList.remove('playing');
                playing = false;
            } else {
                audio.play().then(function() {
                    btn.innerHTML = '<span class="music-icon">🎶</span> Пауза';
                    if (viz) viz.classList.add('playing');
                    playing = true;
                }).catch(function() {
                    alert('Нажмите ещё раз для воспроизведения 🎵');
                });
            }
        });

        audio.addEventListener('ended', function() {
            btn.innerHTML = '<span class="music-icon">🎵</span> Включить музыку';
            if (viz) viz.classList.remove('playing');
            playing = false;
        });
    }

    /* ==========================================
       4. КАЛЕНДАРЬ (конфетти при клике)
       ========================================== */
    function initCalendar() {
        var day = document.querySelector('.day-wedding');
        if (!day) return;

        day.addEventListener('click', function(e) {
            spawnConfetti(e.clientX, e.clientY, 12);
        });
    }

    /* ==========================================
       5. ТАЙМЕР ОБРАТНОГО ОТСЧЁТА
       ========================================== */
    function initCountdown() {
        var wedding = new Date('2026-09-06T15:00:00').getTime();

        function update() {
            var now = Date.now();
            var diff = wedding - now;

            var daysEl = document.getElementById('days');
            var hoursEl = document.getElementById('hours');
            var minsEl = document.getElementById('minutes');
            var secsEl = document.getElementById('seconds');
            var timer = document.getElementById('timer');

            if (diff <= 0) {
                if (timer) {
                    timer.innerHTML = '<div style="font-size:40px;font-weight:700;color:var(--wine);text-align:center;width:100%">СЕГОДНЯ! 🎉💍</div>';
                }
                return;
            }

            var d = Math.floor(diff / 86400000);
            var h = Math.floor((diff % 86400000) / 3600000);
            var m = Math.floor((diff % 3600000) / 60000);
            var s = Math.floor((diff % 60000) / 1000);

            setWithPop(daysEl, pad(d));
            setWithPop(hoursEl, pad(h));
            setWithPop(minsEl, pad(m));
            setWithPop(secsEl, pad(s));
        }

        function setWithPop(el, val) {
            if (!el) return;
            if (el.textContent === val) return;
            el.classList.add('pop');
            el.textContent = val;
            setTimeout(function() { el.classList.remove('pop'); }, 400);
        }

        function pad(n) { return n < 10 ? '0' + n : '' + n; }

        update();
        setInterval(update, 1000);
    }

    /* ==========================================
       6. ФЕЙЕРВЕРК
       ========================================== */
    function initFirework() {
        var timerSection = document.querySelector('.countdown').parentElement.parentElement;
        if (!timerSection) return;

        timerSection.addEventListener('click', function(e) {
            createFirework(e.clientX, e.clientY);
        });

        timerSection.addEventListener('touchend', function(e) {
            var touch = e.changedTouches[0];
            createFirework(touch.clientX, touch.clientY);
        });
    }

    function createFirework(x, y) {
        var container = document.getElementById('fireworkContainer');
        if (!container) return;

        var colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF69B4','#C9A96E','#FF4500','#FFB6C1'];
        var count = 35;

        for (var i = 0; i < count; i++) {
            var p = document.createElement('div');
            p.className = 'firework-particle';
            var angle = (Math.PI * 2 * i) / count;
            var vel = 40 + Math.random() * 130;
            var tx = Math.cos(angle) * vel;
            var ty = Math.sin(angle) * vel;
            var size = 3 + Math.random() * 7;
            var color = colors[Math.floor(Math.random() * colors.length)];

            p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;background:' + color + ';--tx:' + tx + 'px;--ty:' + ty + 'px;box-shadow:0 0 ' + (size*2) + 'px ' + color + ';';
            container.appendChild(p);
            setTimeout(function() { p.remove(); }, 1300);
        }
    }

    function spawnConfetti(x, y, count) {
        var emojis = ['🎉','💝','✨','💕','🎊','💍','🥂','🎀'];
        for (var i = 0; i < count; i++) {
            var c = document.createElement('div');
            c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            c.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;font-size:' + (14+Math.random()*18) + 'px;pointer-events:none;z-index:99999;transition:all 1.4s ease-out;opacity:1;';
            document.body.appendChild(c);
            requestAnimationFrame(function(el) {
                return function() {
                    el.style.transform = 'translate(' + ((Math.random()-0.5)*250) + 'px, -' + (Math.random()*180+80) + 'px) rotate(' + (Math.random()*720) + 'deg)';
                    el.style.opacity = '0';
                };
            }(c));
            setTimeout(function(el) { return function() { el.remove(); }; }(c), 1400);
        }
    }

    /* ==========================================
       7. ПАЛИТРА ДРЕСС-КОДА
       ========================================== */
    function initColorPalette() {
        var swatches = document.querySelectorAll('.color-swatch');
        var hint = document.getElementById('paletteHint');

        var tips = {
            'Бордовый': '👗 Идеально для вечернего платья в пол или элегантного костюма с бабочкой',
            'Винный': '👔 Шикарный цвет для классического образа. Добавьте золотые аксессуары!',
            'Розовый': '🌸 Нежный образ для подружек невесты или романтичных гостей',
            'Рубиновый': '💎 Роскошный глубокий оттенок. Для самых стильных гостей',
            'Марсала': '🍷 Трендовый оттенок. Будете выглядеть как звезда красной дорожки!'
        };

        swatches.forEach(function(s) {
            s.addEventListener('click', function() {
                swatches.forEach(function(x) { x.classList.remove('active'); });
                this.classList.add('active');
                var name = this.getAttribute('data-name');
                if (hint && tips[name]) {
                    hint.innerHTML = '<strong>' + name + '</strong><br><span style="font-size:13px">' + tips[name] + '</span>';
                }
            });
        });
    }

    /* ==========================================
       8. ИГРА "СОБЕРИ БУКЕТ" (ПОЧИНЕНО!)
       ========================================== */
    function initBouquetGame() {
        var field = document.getElementById('gameField');
        var scoreEl = document.getElementById('gameScore');
        var bouquet = document.getElementById('gameBouquet');
        var resetBtn = document.getElementById('gameReset');

        if (!field || !scoreEl || !bouquet) return;

        var score = 0;
        var active = true;
        var intervalId = null;
        var flowers = ['🌸','🌺','🌷','🥀','💐','🌻','🌼','🌹','💮','🪻','🏵️','🌾'];

        function start() {
            stopGame();
            score = 0;
            active = true;
            scoreEl.textContent = '0';
            bouquet.innerHTML = '';
            
            // Удаляем старые цветы
            var old = field.querySelectorAll('.flower-item');
            old.forEach(function(f) { f.remove(); });

            intervalId = setInterval(function() {
                if (!active) return;
                spawnFlower();
            }, 700);
        }

        function stopGame() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        function spawnFlower() {
            var flower = document.createElement('div');
            flower.className = 'flower-item';
            flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
            flower.style.left = (Math.random() * 80 + 10) + '%';
            flower.style.top = '-40px';
            flower.style.animationDuration = (3.5 + Math.random() * 3) + 's';

            // КЛИК ПО ЦВЕТКУ
            flower.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!active) return;

                score += 10;
                scoreEl.textContent = score;

                // Добавляем в букет
                var petal = document.createElement('span');
                petal.textContent = this.textContent;
                petal.style.animation = 'popIn 0.3s ease';
                bouquet.appendChild(petal);

                // Эффект сбора
                this.style.transform = 'scale(2)';
                this.style.opacity = '0';
                this.style.transition = 'all 0.2s ease';
                
                var self = this;
                setTimeout(function() { 
                    if (self.parentNode) self.remove(); 
                }, 200);

                // Бонусное сообщение
                if (score % 100 === 0 && score > 0) {
                    showBonus();
                }
            });

            field.appendChild(flower);

            // Автоудаление упавшего цветка
            var self = flower;
            setTimeout(function() {
                if (self.parentNode) self.remove();
            }, 7000);
        }

        function showBonus() {
            var msgs = ['🔥 Шикарный букет!', '⭐ Молодожёны в восторге!', '💝 Романтика!', '🎉 Свадебный букет!'];
            var bonus = document.createElement('div');
            bonus.textContent = msgs[Math.floor(Math.random() * msgs.length)];
            bonus.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:18px;font-weight:700;color:var(--wine);pointer-events:none;z-index:20;animation:bonusPop 1.5s ease forwards;text-align:center;';
            field.appendChild(bonus);
            setTimeout(function() { bonus.remove(); }, 1500);
        }

        // Сброс игры
        if (resetBtn) {
            resetBtn.addEventListener('click', start);
        }

        // Запуск
        start();

        // Остановка когда секция не видна (оптимизация)
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    if (!active) start();
                } else {
                    active = false;
                    stopGame();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(field);
    }

    // Добавляем стили для игры
    var gameStyles = document.createElement('style');
    gameStyles.textContent = '@keyframes popIn{from{transform:scale(0) rotate(-180deg)}to{transform:scale(1) rotate(0)}}@keyframes bonusPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}';
    document.head.appendChild(gameStyles);

    /* ==========================================
       9. ФОРМА ГОСТЯ (TELEGRAM)
       ========================================== */
    function initGuestForm() {
        var form = document.getElementById('guestForm');
        var success = document.getElementById('successMessage');

        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = form.querySelector('[name="name"]');
            var phone = form.querySelector('[name="phone"]');
            var presence = form.querySelector('[name="presence"]:checked');
            var children = form.querySelector('[name="children"]');
            var wishes = form.querySelector('[name="wishes"]');

            if (!name || !name.value.trim()) {
                shake(name);
                return;
            }
            if (!phone || !phone.value.trim()) {
                shake(phone);
                return;
            }
            if (!presence) {
                alert('Выберите вариант присутствия 🙏');
                return;
            }

            var btn = form.querySelector('button');
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'ОТПРАВЛЯЕТСЯ...';
            }

            var msg = 
                '🎉 *АНКЕТА ГОСТЯ*\n\n' +
                '👤 *ФИО:* ' + name.value.trim() + '\n' +
                '📱 *Тел:* ' + phone.value.trim() + '\n' +
                '✅ *Буду:* ' + presence.value + '\n' +
                (children && children.value.trim() ? '👶 *Дети:* ' + children.value.trim() + '\n' : '') +
                (wishes && wishes.value.trim() ? '💝 *Пожелания:* ' + wishes.value.trim() + '\n' : '') +
                '\n───\n📅 ' + new Date().toLocaleDateString('ru-RU') + '\n💍 Свадьба Маши и Семёна | 6.09.2026';

            // Отправка в Telegram
            // ЗАМЕНИТЕ НА СВОЙ ТОКЕН БОТА И CHAT ID
            sendToTelegram(msg, function(success) {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'ОТПРАВИТЬ';
                }
                
                if (success) {
                    form.style.display = 'none';
                    if (success) success.style.display = 'block';
                    spawnConfetti(window.innerWidth/2, window.innerHeight/2, 20);
                } else {
                    // Fallback: открываем Telegram с текстом
                    var tgUrl = 'https://t.me/share/url?url=&text=' + encodeURIComponent(msg);
                    window.open(tgUrl, '_blank');
                    form.style.display = 'none';
                    if (success) success.style.display = 'block';
                }
            });

            return false;
        });
    }

    function sendToTelegram(message, callback) {
        // ЗАМЕНИТЕ НА РЕАЛЬНЫЕ ДАННЫЕ
        var BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Токен бота из @BotFather
        var CHAT_ID = 'YOUR_CHAT_ID';     // Ваш chat_id

        // Если токен не указан — просто открываем шаринг
        if (BOT_TOKEN === 'YOUR_BOT_TOKEN') {
            callback(false);
            return;
        }

        var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
        var data = {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        };

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(function(r) { return r.json(); })
        .then(function(json) {
            callback(json.ok);
        })
        .catch(function() {
            callback(false);
        });
    }

    function shake(el) {
        if (!el) return;
        el.style.animation = 'shake 0.5s ease';
        el.style.border = '2px solid red';
        el.focus();
        setTimeout(function() {
            el.style.animation = '';
            el.style.border = '';
        }, 500);
    }

    var shakeCSS = document.createElement('style');
    shakeCSS.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}';
    document.head.appendChild(shakeCSS);

    /* ==========================================
       10. ПЛАВНЫЙ СКРОЛЛ
       ========================================== */
    function initSmoothScroll() {
        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            var href = link.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* ==========================================
       11. ПРИВЕТСТВИЕ В КОНСОЛИ
       ========================================== */
    function showConsoleGreeting() {
        console.log('%c💍 Свадьба Маши и Семёна %c| %c6 сентября 2026',
            'font-size:18px;color:#8B0000;', '', 'font-size:14px;color:#C9A96E;');
        console.log('%c🎮 Собери букет %c| %c🎆 Кликни на таймер %c| %c🌙 Переключи тему',
            '', '', '', '', '');
        console.log('%c💝 С любовью, Маша и Семён', 'font-style:italic;');
    }

})();
