/* ============================================
   main.js - Свадьба Маши и Семёна
   Всё работает! Музыка, игра, фейерверк, Telegram!
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
        initMusicPlayer();
        initCalendarConfetti();
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
       2. МУЗЫКАЛЬНЫЙ ПЛЕЕР (ПОЛНОСТЬЮ РАБОЧИЙ)
       ========================================== */
    function initMusicPlayer() {
        var audio = document.getElementById('audio');
        var btn = document.getElementById('playBtn');
        var viz = document.getElementById('visualizer');
        
        if (!audio || !btn) {
            console.warn('❌ Аудиоплеер: элементы не найдены');
            return;
        }

        var playing = false;

        // Проверка загрузки аудио
        audio.addEventListener('loadeddata', function() {
            console.log('✅ Аудиофайл загружен и готов к воспроизведению');
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        });

        audio.addEventListener('error', function(e) {
            console.error('❌ Ошибка загрузки аудиофайла');
            console.error('Проверьте, что файл audio/wedding-song.mp3 существует');
            btn.innerHTML = '<span>🚫</span> Музыка не найдена';
            btn.style.opacity = '0.6';
            btn.style.pointerEvents = 'none';
            btn.title = 'Добавьте файл audio/wedding-song.mp3';
        });

        // Основной обработчик клика
        btn.addEventListener('click', function() {
            if (playing) {
                // Пауза
                audio.pause();
                btn.innerHTML = '<span class="music-icon">🎵</span> Включить музыку';
                if (viz) viz.classList.remove('playing');
                playing = false;
                console.log('⏸ Музыка на паузе');
            } else {
                // Воспроизведение
                console.log('▶ Пытаюсь запустить музыку...');
                
                var playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(function() {
                        // Успешно!
                        btn.innerHTML = '<span class="music-icon">🎶</span> Пауза';
                        if (viz) viz.classList.add('playing');
                        playing = true;
                        console.log('✅ Музыка играет!');
                    }).catch(function(error) {
                        console.error('❌ Ошибка воспроизведения:', error);
                        
                        // Повторная попытка
                        setTimeout(function() {
                            audio.play().then(function() {
                                btn.innerHTML = '<span class="music-icon">🎶</span> Пауза';
                                if (viz) viz.classList.add('playing');
                                playing = true;
                                console.log('✅ Музыка запущена со второй попытки');
                            }).catch(function(err2) {
                                console.error('❌ Вторая попытка тоже не удалась:', err2);
                                alert('Не удалось запустить музыку 😢\nПроверьте, что файл audio/wedding-song.mp3 существует.\n\nПодсказка: попробуйте нажать кнопку ещё раз!');
                            });
                        }, 300);
                    });
                }
            }
        });

        // Если аудио само закончилось (на всякий случай)
        audio.addEventListener('ended', function() {
            btn.innerHTML = '<span class="music-icon">🎵</span> Включить музыку';
            if (viz) viz.classList.remove('playing');
            playing = false;
        });

        // Для мобильных: разблокировка аудио при первом касании
        var audioUnlocked = false;
        document.addEventListener('touchstart', function unlockAudio() {
            if (!audioUnlocked) {
                audio.load();
                audioUnlocked = true;
                console.log('📱 Аудио разблокировано для мобильного устройства');
            }
        }, { once: false });
    }

    /* ==========================================
       3. КОНФЕТТИ ПРИ КЛИКЕ НА ДАТУ В КАЛЕНДАРЕ
       ========================================== */
    function initCalendarConfetti() {
        var day = document.querySelector('.day-wedding');
        if (!day) return;

        day.addEventListener('click', function(e) {
            spawnConfetti(e.clientX, e.clientY, 15);
        });
    }

    /* ==========================================
       4. ТАЙМЕР ОБРАТНОГО ОТСЧЁТА
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
                    timer.innerHTML = '<div style="font-size:42px;font-weight:700;color:var(--wine);text-align:center;width:100%;animation:pulse 1.5s infinite;">СЕГОДНЯ! 🎉💍</div>';
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
       5. ФЕЙЕРВЕРК ПРИ КЛИКЕ НА ТАЙМЕР
       ========================================== */
    function initFirework() {
        var countdownContainer = document.querySelector('.countdown');
        if (!countdownContainer) return;

        var clickTarget = countdownContainer.closest('.section');
        if (!clickTarget) return;

        clickTarget.style.cursor = 'pointer';

        clickTarget.addEventListener('click', function(e) {
            createFirework(e.clientX, e.clientY);
        });

        clickTarget.addEventListener('touchend', function(e) {
            var touch = e.changedTouches[0];
            createFirework(touch.clientX, touch.clientY);
        });
    }

    function createFirework(x, y) {
        var container = document.getElementById('fireworkContainer');
        if (!container) return;

        var colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF69B4','#C9A96E','#FF4500','#FFB6C1','#FF1493','#FFD700'];
        var count = 40;

        for (var i = 0; i < count; i++) {
            var p = document.createElement('div');
            p.className = 'firework-particle';
            var angle = (Math.PI * 2 * i) / count;
            var vel = 40 + Math.random() * 140;
            var tx = Math.cos(angle) * vel;
            var ty = Math.sin(angle) * vel;
            var size = 3 + Math.random() * 8;
            var color = colors[Math.floor(Math.random() * colors.length)];

            p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;background:' + color + ';--tx:' + tx + 'px;--ty:' + ty + 'px;box-shadow:0 0 ' + (size*2) + 'px ' + color + ';';
            container.appendChild(p);
            
            setTimeout((function(el) { return function() { el.remove(); }; })(p), 1300);
        }

        // Вторая волна искр
        setTimeout(function() {
            for (var j = 0; j < 25; j++) {
                var spark = document.createElement('div');
                spark.className = 'firework-particle';
                var tx2 = (Math.random() - 0.5) * 200;
                var ty2 = (Math.random() - 0.5) * 200;
                
                spark.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:4px;height:4px;background:#FFD700;--tx:' + tx2 + 'px;--ty:' + ty2 + 'px;box-shadow:0 0 10px #FFD700;';
                container.appendChild(spark);
                setTimeout((function(el) { return function() { el.remove(); }; })(spark), 1000);
            }
        }, 150);
    }

    function spawnConfetti(x, y, count) {
        var emojis = ['🎉','💝','✨','💕','🎊','💍','🥂','🎀'];
        for (var i = 0; i < count; i++) {
            (function() {
                var c = document.createElement('div');
                c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                c.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;font-size:' + (14+Math.random()*18) + 'px;pointer-events:none;z-index:99999;transition:all 1.4s ease-out;opacity:1;';
                document.body.appendChild(c);
                
                requestAnimationFrame(function() {
                    c.style.transform = 'translate(' + ((Math.random()-0.5)*250) + 'px, -' + (Math.random()*180+80) + 'px) rotate(' + (Math.random()*720) + 'deg)';
                    c.style.opacity = '0';
                });
                
                setTimeout(function() { c.remove(); }, 1400);
            })();
        }
    }

    /* ==========================================
       6. ПАЛИТРА ДРЕСС-КОДА
       ========================================== */
    function initColorPalette() {
        var swatches = document.querySelectorAll('.color-swatch');
        var hint = document.getElementById('paletteHint');

        var tips = {
            'Бордовый': '👗 Идеально для вечернего платья в пол или элегантного костюма с бабочкой. Выглядит дорого-богато!',
            'Винный': '👔 Шикарный цвет для классического образа. Добавьте золотые аксессуары — и вы звезда вечера!',
            'Розовый': '🌸 Нежный образ для подружек невесты или романтичных гостей. Милота обеспечена!',
            'Рубиновый': '💎 Роскошный глубокий оттенок. Для тех, кто хочет выглядеть как голливудская звезда!',
            'Марсала': '🍷 Трендовый оттенок сезона. Будете выглядеть так, будто только что с красной дорожки!'
        };

        swatches.forEach(function(s) {
            s.addEventListener('click', function() {
                swatches.forEach(function(x) { x.classList.remove('active'); });
                this.classList.add('active');
                var name = this.getAttribute('data-name');
                if (hint && tips[name]) {
                    hint.innerHTML = '<strong>' + name + '</strong><br><span style="font-size:14px;">' + tips[name] + '</span>';
                }
            });
        });
    }

    /* ==========================================
       7. ИГРА "СОБЕРИ БУКЕТ" (ПОЛНОСТЬЮ РАБОЧАЯ)
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
        var flowers = ['🌸','🌺','🌷','🥀','💐','🌻','🌼','🌹','💮','🪻','🏵️','🌾','💠','🪷'];

        function start() {
            stopGame();
            score = 0;
            active = true;
            scoreEl.textContent = '0';
            bouquet.innerHTML = '';
            
            var oldFlowers = field.querySelectorAll('.flower-item');
            oldFlowers.forEach(function(f) { f.remove(); });

            intervalId = setInterval(function() {
                if (!active) return;
                spawnFlower();
            }, 650);
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
            flower.style.top = '-50px';
            flower.style.animationDuration = (3.5 + Math.random() * 3.5) + 's';

            flower.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!active) return;

                score += 10;
                scoreEl.textContent = score;

                var petal = document.createElement('span');
                petal.textContent = this.textContent;
                petal.style.display = 'inline-block';
                petal.style.animation = 'popIn 0.3s ease forwards';
                bouquet.appendChild(petal);

                this.style.transform = 'scale(2)';
                this.style.opacity = '0';
                this.style.transition = 'all 0.2s ease';
                this.style.pointerEvents = 'none';
                
                var self = this;
                setTimeout(function() { 
                    if (self.parentNode) self.remove(); 
                }, 200);

                if (score % 100 === 0 && score > 0) {
                    showBonus();
                }
            });

            field.appendChild(flower);

            var self = flower;
            setTimeout(function() {
                if (self.parentNode) self.remove();
            }, 7500);
        }

        function showBonus() {
            var msgs = [
                '🔥 Шикарный букет! Молодожёны плачут от счастья!',
                '⭐ Да ты профессионал! Свадебный букет мечты!',
                '💝 Романтика зашкаливает! Такой букет — просто пушка!',
                '🎉 Свадебный букет чемпиона! Ты главный гость!',
                '👑 Король/Королева цветов! Все в восторге!'
            ];
            
            var bonus = document.createElement('div');
            bonus.textContent = msgs[Math.floor(Math.random() * msgs.length)];
            bonus.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:16px;font-weight:700;color:var(--wine);pointer-events:none;z-index:20;animation:bonusPop 1.8s ease forwards;text-align:center;background:rgba(255,255,255,0.9);padding:10px 18px;border-radius:30px;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
            field.appendChild(bonus);
            
            setTimeout(function() { 
                if (bonus.parentNode) bonus.remove(); 
            }, 1800);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                start();
            });
        }

        start();

        // Пауза когда не видно
        if (window.IntersectionObserver) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        if (!active) start();
                    } else {
                        active = false;
                        stopGame();
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(field);
        }
    }

    // Динамические стили игры
    var gameStyles = document.createElement('style');
    gameStyles.textContent = 
        '@keyframes popIn{' +
            'from{transform:scale(0) rotate(-180deg);opacity:0;}' +
            'to{transform:scale(1) rotate(0deg);opacity:1;}' +
        '}' +
        '@keyframes bonusPop{' +
            '0%{opacity:0;transform:translate(-50%,-50%) scale(0.5);}' +
            '40%{opacity:1;transform:translate(-50%,-50%) scale(1.1);}' +
            '100%{opacity:0;transform:translate(-50%,-70%) scale(0.8);}' +
        '}';
    document.head.appendChild(gameStyles);

    /* ==========================================
       8. ФОРМА ГОСТЯ — ОТПРАВКА В TELEGRAM
       ========================================== */
    function initGuestForm() {
        var form = document.getElementById('guestForm');
        var successMsg = document.getElementById('successMessage');

        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = form.querySelector('[name="name"]');
            var phone = form.querySelector('[name="phone"]');
            var presence = form.querySelector('[name="presence"]:checked');
            var children = form.querySelector('[name="children"]');
            var wishes = form.querySelector('[name="wishes"]');

            if (!name || !name.value.trim()) {
                shakeElement(name);
                return;
            }
            if (!phone || !phone.value.trim()) {
                shakeElement(phone);
                return;
            }
            if (!presence) {
                alert('Пожалуйста, выберите вариант ответа 🤔\nСможете ли вы присутствовать?');
                return;
            }

            var btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'ОТПРАВЛЯЕТСЯ...';
            }

            var msg = 
                '🎉 *АНКЕТА ГОСТЯ — СВАДЬБА МАШИ И СЕМЁНА*\n\n' +
                '👤 *ФИО:* ' + name.value.trim() + '\n' +
                '📱 *Телефон:* ' + phone.value.trim() + '\n' +
                '✅ *Присутствие:* ' + presence.value + '\n' +
                (children && children.value.trim() ? '👶 *Дети:* ' + children.value.trim() + '\n' : '') +
                (wishes && wishes.value.trim() ? '💝 *Пожелания:* ' + wishes.value.trim() + '\n' : '') +
                '\n───\n' +
                '📅 *Отправлено:* ' + new Date().toLocaleDateString('ru-RU', {day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}) + '\n' +
                '💍 *Свадьба:* 6 сентября 2026';

            sendToTelegram(msg, function(success) {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'ОТПРАВИТЬ';
                }

                if (success) {
                    form.style.display = 'none';
                    if (successMsg) successMsg.style.display = 'block';
                    spawnConfetti(window.innerWidth/2, window.innerHeight/2, 25);
                } else {
                    var tgUrl = 'https://t.me/share/url?url=&text=' + encodeURIComponent(msg);
                    window.open(tgUrl, '_blank');
                    
                    form.style.display = 'none';
                    if (successMsg) successMsg.style.display = 'block';
                    spawnConfetti(window.innerWidth/2, window.innerHeight/2, 15);
                }
            });

            return false;
        });
    }

    function sendToTelegram(message, callback) {
        // ==========================================
        // НАСТРОЙКА TELEGRAM БОТА
        // ==========================================
        // 1. Напишите @BotFather в Telegram
        // 2. Создайте бота командой /newbot
        // 3. Скопируйте токен и вставьте ниже
        // 4. Напишите боту любое сообщение
        // 5. Перейдите: https://api.telegram.org/bot<ТОКЕН>/getUpdates
        // 6. Найдите свой chat_id и вставьте ниже
        // ==========================================
        
        var BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
        var CHAT_ID = 'YOUR_CHAT_ID_HERE';

        if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') {
            console.log('ℹ️ Telegram бот не настроен. Использую fallback.');
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
        .then(function(response) { return response.json(); })
        .then(function(json) {
            if (json.ok) {
                console.log('✅ Анкета отправлена в Telegram!');
                callback(true);
            } else {
                console.error('❌ Ошибка Telegram:', json.description);
                callback(false);
            }
        })
        .catch(function(error) {
            console.error('❌ Ошибка отправки:', error);
            callback(false);
        });
    }

    function shakeElement(el) {
        if (!el) return;
        el.style.animation = 'shake 0.5s ease';
        el.style.border = '2px solid #ff4444';
        el.focus();
        setTimeout(function() {
            el.style.animation = '';
            el.style.border = '';
        }, 500);
    }

    var shakeStyles = document.createElement('style');
    shakeStyles.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}';
    document.head.appendChild(shakeStyles);

    /* ==========================================
       9. ПЛАВНЫЙ СКРОЛЛ
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
       10. КОНСОЛЬНЫЕ ПАСХАЛКИ
       ========================================== */
    function showConsoleGreeting() {
        console.log('%c💍 %cСВАДЬБА МАШИ И СЕМЁНА %c💍',
            'font-size:20px;', 'font-size:18px;color:#8B0000;font-weight:bold;', 'font-size:20px;');
        console.log('%c📅 6 сентября 2026 | 📍 Волгоград, Советский район',
            'font-size:14px;color:#C9A96E;');
        console.log('');
        console.log('%c🎮 Собери букет — кликай по цветам!', '');
        console.log('%c🎆 Кликни на таймер — будет салют!', '');
        console.log('%c🎵 Включи музыку для атмосферы!', '');
        console.log('');
        console.log('%c💝 С любовью, Маша и Семён %c🍪',
            'font-style:italic;', '');
        console.log('%cP.S. Торт будет. Честно-честно.', 'color:#8B0000;');

        // Konami Code
        var keys = [];
        var secret = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
        
        window.addEventListener('keydown', function(e) {
            keys.push(e.key);
            keys = keys.slice(-8);
            
            if (keys.join(',') === secret.join(',')) {
                console.log('🎂🍾 ТОРТ БУДЕТ! ЧЕСТНОЕ СЛОВО! 🍾🎂');
                spawnConfetti(window.innerWidth/2, window.innerHeight/2, 50);
            }
        });
    }

})();
