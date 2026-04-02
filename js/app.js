// ========================================
// LecturaVeloz - Main Application
// ========================================

(function() {
    'use strict';

    // App State
    const App = {
        currentView: 'home',
        currentExercise: null,
        engine: null,
        selectedGospel: 'mateo',
        selectedChapter: 1,
        exerciseFontSize: 24,

        exerciseInfo: {
            rsvp: { icon: '👁️', name: 'RSVP', desc: 'Palabra por palabra en el centro de la pantalla' },
            chunked: { icon: '📝', name: 'Lectura por Bloques', desc: 'Grupos de palabras resaltadas progresivamente' },
            pacer: { icon: '▶️', name: 'Marcapasos', desc: 'Línea de resaltado que avanza por el texto' },
            peripheral: { icon: '👀', name: 'Visión Periférica', desc: 'Palabras a los lados del punto focal' },
            schultz: { icon: '🔢', name: 'Tabla de Schultz', desc: 'Encuentra los números en orden' },
            disappearing: { icon: '💨', name: 'Texto Evanescente', desc: 'El texto se desvanece gradualmente' },
            comprehension: { icon: '🧠', name: 'Comprensión Lectora', desc: 'Lee y responde preguntas sobre el contenido' },
            zigzag: { icon: '↔️', name: 'Lectura en Zigzag', desc: 'Patrón diagonal de lectura' }
        }
    };

    // ========================================
    // Initialization
    // ========================================
    function init() {
        // Show splash then app
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
                document.getElementById('app').classList.remove('hidden');
                loadApp();
            }, 500);
        }, 1500);
    }

    function loadApp() {
        applySettings();
        bindEvents();
        updateHomeStats();
        updateDailyReading();
        updateHeaderWpm();
    }

    // ========================================
    // Settings & Theme
    // ========================================
    function applySettings() {
        const settings = Storage.getSettings();
        document.documentElement.setAttribute('data-theme', settings.theme);
        updateThemeIcons(settings.theme);

        // Apply to settings form
        const themeEl = document.getElementById('setting-theme');
        const fontEl = document.getElementById('setting-font');
        const fontsizeEl = document.getElementById('setting-fontsize');
        const speedEl = document.getElementById('setting-default-speed');
        const verseEl = document.getElementById('setting-show-verse');
        const soundEl = document.getElementById('setting-sound');
        const goalEl = document.getElementById('setting-daily-goal');
        const breakEl = document.getElementById('setting-break-reminder');

        if (themeEl) themeEl.value = settings.theme;
        if (fontEl) fontEl.value = settings.font;
        if (fontsizeEl) {
            fontsizeEl.value = settings.fontSize;
            document.getElementById('fontsize-display').textContent = settings.fontSize + 'px';
        }
        if (speedEl) speedEl.value = settings.defaultSpeed;
        if (verseEl) verseEl.checked = settings.showVerse;
        if (soundEl) soundEl.checked = settings.sound;
        if (goalEl) goalEl.value = settings.dailyGoal;
        if (breakEl) breakEl.value = settings.breakReminder;

        document.getElementById('setup-speed').value = settings.defaultSpeed;
        document.getElementById('speed-value').textContent = settings.defaultSpeed;
    }

    function updateThemeIcons(theme) {
        const lightIcon = document.getElementById('theme-icon-light');
        const darkIcon = document.getElementById('theme-icon-dark');
        if (theme === 'dark') {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        } else {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    }

    function toggleTheme() {
        const settings = Storage.getSettings();
        const themes = ['light', 'dark', 'sepia'];
        const idx = themes.indexOf(settings.theme);
        settings.theme = themes[(idx + 1) % themes.length];
        Storage.saveSettings(settings);
        applySettings();
    }

    // ========================================
    // Navigation
    // ========================================
    function navigateTo(view) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

        // Show target
        const target = document.getElementById('view-' + view);
        if (target) {
            target.classList.add('active');
            App.currentView = view;
        }

        // Update sidebar
        document.querySelectorAll('.sidebar-nav a').forEach(a => {
            a.classList.toggle('active', a.dataset.view === view);
        });

        closeSidebar();

        // Load view-specific data
        if (view === 'library') loadLibrary();
        if (view === 'progress') loadProgress();
        if (view === 'settings') applySettings();
    }

    function openSidebar() {
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('active');
    }

    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
    }

    // ========================================
    // Home View
    // ========================================
    function updateHomeStats() {
        const progress = Storage.getProgress();
        document.getElementById('home-wpm').textContent = progress.averageWpm || 0;
        document.getElementById('home-streak').textContent = progress.currentStreak || 0;
        document.getElementById('home-sessions').textContent = progress.totalSessions || 0;

        const totalMin = Math.round((progress.totalTime || 0) / 60);
        document.getElementById('home-time').textContent = totalMin < 60 ? totalMin + 'm' : Math.round(totalMin / 60) + 'h';

        // Update level badge
        const levelInfo = Storage.getLevelInfo(progress.level);
        document.getElementById('sidebar-level').querySelector('.level-value').textContent = levelInfo.name;
    }

    function updateHeaderWpm() {
        const progress = Storage.getProgress();
        document.getElementById('current-wpm').textContent = progress.averageWpm || 0;
    }

    function updateDailyReading() {
        const gospels = ['mateo', 'marcos', 'lucas', 'juan'];
        const gospel = gospels[Math.floor(Math.random() * gospels.length)];
        const data = window.GospelData[gospel];
        if (!data) return;

        const chapters = Object.keys(data.chapters);
        const chapter = chapters[Math.floor(Math.random() * chapters.length)];
        const chapterData = data.chapters[chapter];

        const card = document.getElementById('daily-reading-card');
        card.querySelector('.daily-gospel').textContent = data.shortName;
        card.querySelector('.daily-chapter').textContent = `Capítulo ${chapter}: ${chapterData.title}`;

        const verses = Object.values(chapterData.verses);
        const preview = verses.slice(0, 2).join(' ').substring(0, 150) + '...';
        card.querySelector('.daily-preview').textContent = preview;

        document.getElementById('start-daily').onclick = () => {
            App.selectedGospel = gospel;
            App.selectedChapter = parseInt(chapter);
            openExerciseSetup('pacer');
        };
    }

    // ========================================
    // Library View
    // ========================================
    function loadLibrary() {
        updateGospelInfo();
        updateChapterGrid();
    }

    function updateGospelInfo() {
        const data = window.GospelData[App.selectedGospel];
        if (!data) return;
        document.querySelector('.gospel-description').textContent = data.description;
    }

    function updateChapterGrid() {
        const data = window.GospelData[App.selectedGospel];
        if (!data) return;

        const grid = document.getElementById('chapter-grid');
        grid.innerHTML = '';

        const readChapters = Storage.getReadChapters();
        const readList = readChapters[App.selectedGospel] || [];
        const totalChapters = { mateo: 28, marcos: 16, lucas: 24, juan: 21 };
        const total = totalChapters[App.selectedGospel] || 28;

        for (let i = 1; i <= total; i++) {
            const btn = document.createElement('button');
            btn.className = 'chapter-btn';
            btn.textContent = i;

            if (readList.includes(i)) {
                btn.classList.add('read');
            }

            if (data.chapters[i]) {
                btn.onclick = () => {
                    App.selectedChapter = i;
                    openExerciseSetup('pacer');
                };
            } else {
                btn.classList.add('unavailable');
                btn.title = 'Capítulo próximamente disponible';
            }

            grid.appendChild(btn);
        }
    }

    // ========================================
    // Exercise Setup & Running
    // ========================================
    function openExerciseSetup(exerciseType) {
        App.currentExercise = exerciseType;
        navigateTo('exercise-runner');

        const info = App.exerciseInfo[exerciseType];
        document.getElementById('setup-icon').textContent = info.icon;
        document.getElementById('setup-title').textContent = info.name;
        document.getElementById('setup-description').textContent = info.desc;

        // Show/hide chunk size option
        const chunkGroup = document.getElementById('chunk-size-group');
        chunkGroup.style.display = ['chunked', 'comprehension'].includes(exerciseType) ? 'block' : 'none';

        // Setup chapter select
        updateChapterSelect();

        // Show setup, hide active & results
        document.getElementById('exercise-setup').classList.remove('hidden');
        document.getElementById('exercise-active').classList.add('hidden');
        document.getElementById('exercise-results').classList.add('hidden');
    }

    function updateChapterSelect() {
        const data = window.GospelData[App.selectedGospel];
        if (!data) return;

        const select = document.getElementById('setup-chapter');
        select.innerHTML = '';

        Object.keys(data.chapters).forEach(ch => {
            const opt = document.createElement('option');
            opt.value = ch;
            opt.textContent = `Capítulo ${ch}: ${data.chapters[ch].title}`;
            if (parseInt(ch) === App.selectedChapter) opt.selected = true;
            select.appendChild(opt);
        });
    }

    function getChapterText(gospel, chapter) {
        const data = window.GospelData[gospel];
        if (!data || !data.chapters[chapter]) return '';

        const settings = Storage.getSettings();
        const verses = data.chapters[chapter].verses;
        let text = '';

        Object.entries(verses).forEach(([num, verse]) => {
            if (settings.showVerse) {
                text += `${verse} `;
            } else {
                text += `${verse} `;
            }
        });

        return text.trim();
    }

    function startExercise() {
        const exerciseType = App.currentExercise;
        const gospel = document.getElementById('setup-gospel').value;
        const chapter = document.getElementById('setup-chapter').value;
        const speed = parseInt(document.getElementById('setup-speed').value);
        const chunkSize = parseInt(document.getElementById('setup-chunk').value);

        App.selectedGospel = gospel;
        App.selectedChapter = parseInt(chapter);

        const text = getChapterText(gospel, chapter);
        if (!text && exerciseType !== 'schultz') {
            alert('No hay texto disponible para este capítulo.');
            return;
        }

        // Hide setup, show active
        document.getElementById('exercise-setup').classList.add('hidden');
        document.getElementById('exercise-active').classList.remove('hidden');
        document.getElementById('exercise-results').classList.add('hidden');

        // Hide all displays
        document.querySelectorAll('.exercise-active > div[id$="-display"]').forEach(d => d.classList.add('hidden'));

        // Update speed display
        document.getElementById('exercise-wpm').textContent = speed;

        // Config
        const config = {
            text,
            wpm: speed,
            chunkSize,
            fontSize: App.exerciseFontSize,
            gospel,
            chapter,
            onProgress: updateExerciseProgress,
            onComplete: showExerciseResults,
            onWpmUpdate: (wpm) => {
                document.getElementById('exercise-wpm').textContent = wpm;
            }
        };

        // Get questions for comprehension
        if (exerciseType === 'comprehension') {
            const qData = window.ComprehensionData;
            config.questions = (qData && qData[gospel] && qData[gospel][chapter]) ? qData[gospel][chapter] : [];
        }

        // Create and start engine
        switch (exerciseType) {
            case 'rsvp':
                document.getElementById('rsvp-display').classList.remove('hidden');
                App.engine = new RSVPExercise(config);
                break;
            case 'chunked':
                document.getElementById('chunked-display').classList.remove('hidden');
                App.engine = new ChunkedExercise(config);
                break;
            case 'pacer':
                document.getElementById('pacer-display').classList.remove('hidden');
                App.engine = new PacerExercise(config);
                break;
            case 'peripheral':
                document.getElementById('peripheral-display').classList.remove('hidden');
                App.engine = new PeripheralExercise(config);
                break;
            case 'schultz':
                document.getElementById('schultz-display').classList.remove('hidden');
                App.engine = new SchultzExercise(config);
                break;
            case 'disappearing':
                document.getElementById('disappearing-display').classList.remove('hidden');
                App.engine = new DisappearingExercise(config);
                break;
            case 'comprehension':
                document.getElementById('comprehension-display').classList.remove('hidden');
                App.engine = new ComprehensionExercise(config);
                break;
            case 'zigzag':
                document.getElementById('zigzag-display').classList.remove('hidden');
                App.engine = new ZigzagExercise(config);
                break;
        }

        if (App.engine) {
            App.engine.start();
        }
    }

    function updateExerciseProgress(ratio) {
        const percent = Math.min(100, Math.round(ratio * 100));
        document.getElementById('exercise-progress-fill').style.width = percent + '%';
    }

    function pauseExercise() {
        if (App.engine) {
            App.engine.pause();
            const btn = document.getElementById('exercise-pause');
            btn.textContent = App.engine.isPaused ? '▶' : '⏸';
        }
    }

    function stopExercise() {
        if (App.engine) {
            const results = App.engine.stop();
            showExerciseResults(results);
        }
    }

    function showExerciseResults(results) {
        document.getElementById('exercise-active').classList.add('hidden');
        document.getElementById('exercise-results').classList.remove('hidden');

        document.getElementById('result-wpm').textContent = results.wpm || 0;
        document.getElementById('result-words').textContent = results.words || 0;
        document.getElementById('result-time').textContent = results.time || 0;

        const compStat = document.getElementById('result-comprehension-stat');
        if (results.comprehension !== undefined) {
            compStat.style.display = 'block';
            document.getElementById('result-comprehension').textContent = results.comprehension + '%';
        } else {
            compStat.style.display = 'none';
        }

        // Generate message
        const msg = getResultMessage(results);
        document.getElementById('results-message').textContent = msg;

        // Save session
        Storage.addSession(results);
        if (results.gospel && results.chapter) {
            Storage.markChapterRead(results.gospel, parseInt(results.chapter));
        }

        updateHomeStats();
        updateHeaderWpm();
    }

    function getResultMessage(results) {
        const wpm = results.wpm || 0;
        if (wpm >= 600) return '¡Increíble! Velocidad de experto. Tu dominio de la lectura rápida es impresionante.';
        if (wpm >= 400) return '¡Excelente! Estás leyendo a velocidad avanzada. Sigue así para alcanzar el nivel experto.';
        if (wpm >= 300) return '¡Muy bien! Tu velocidad está por encima del promedio. Continúa practicando.';
        if (wpm >= 200) return '¡Buen trabajo! Estás progresando. Con práctica constante mejorarás rápidamente.';
        if (wpm >= 100) return 'Buen comienzo. La práctica regular te ayudará a aumentar tu velocidad gradualmente.';
        return 'Sesión completada. Recuerda que la constancia es la clave del éxito.';
    }

    // ========================================
    // Progress View
    // ========================================
    function loadProgress() {
        const progress = Storage.getProgress();
        const sessions = Storage.getSessions();

        // Level progress
        const levelInfo = Storage.getLevelInfo(progress.level);
        document.getElementById('current-level-name').textContent = levelInfo.name;
        document.getElementById('next-level-name').textContent = '→ ' + levelInfo.next;

        const levelRange = levelInfo.max - levelInfo.min;
        const levelProgress = Math.min(100, ((progress.averageWpm - levelInfo.min) / levelRange) * 100);
        document.getElementById('level-fill').style.width = Math.max(5, levelProgress) + '%';

        // Session history
        const historyEl = document.getElementById('session-history');
        historyEl.innerHTML = '';

        if (sessions.length === 0) {
            historyEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No hay sesiones registradas aún</p>';
        } else {
            sessions.slice(0, 20).forEach(s => {
                const item = document.createElement('div');
                item.className = 'session-item';
                const info = App.exerciseInfo[s.exercise] || { name: s.exercise };
                const date = new Date(s.date);
                const dateStr = date.toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                item.innerHTML = `
                    <div class="session-item-left">
                        <span class="session-exercise">${info.name || s.exercise}</span>
                        <span class="session-date">${dateStr}</span>
                    </div>
                    <span class="session-wpm">${s.wpm || 0} PPM</span>
                `;
                historyEl.appendChild(item);
            });
        }

        // Achievements
        const achievementsEl = document.getElementById('achievements');
        achievementsEl.innerHTML = '';
        const earnedIds = Storage.getAchievements().map(a => a.id);
        const allAchievements = Storage.getAllAchievementDefinitions();

        allAchievements.forEach(a => {
            const div = document.createElement('div');
            div.className = 'achievement' + (earnedIds.includes(a.id) ? '' : ' locked');
            div.innerHTML = `
                <div class="achievement-icon">${a.icon}</div>
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.desc}</div>
            `;
            achievementsEl.appendChild(div);
        });

        // Draw speed chart
        drawSpeedChart(progress.wpmHistory);
    }

    function drawSpeedChart(history) {
        const canvas = document.getElementById('speed-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Set actual size
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 200;

        const w = canvas.width;
        const h = canvas.height;
        const padding = 40;

        // Clear
        ctx.clearRect(0, 0, w, h);

        if (history.length < 2) {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Necesitas al menos 2 sesiones para ver el gráfico', w / 2, h / 2);
            return;
        }

        const data = history.slice(-20); // Last 20 sessions
        const maxWpm = Math.max(...data.map(d => d.wpm), 100);
        const minWpm = Math.min(...data.map(d => d.wpm), 0);
        const range = maxWpm - minWpm || 100;

        const stepX = (w - padding * 2) / (data.length - 1);

        // Grid lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (h - padding * 2) * (i / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(w - padding, y);
            ctx.stroke();

            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
            ctx.font = '11px Inter';
            ctx.textAlign = 'right';
            const val = Math.round(maxWpm - (range * i / 4));
            ctx.fillText(val + '', padding - 5, y + 4);
        }

        // Line
        ctx.beginPath();
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';

        data.forEach((d, i) => {
            const x = padding + i * stepX;
            const y = padding + (h - padding * 2) * (1 - (d.wpm - minWpm) / range);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Dots
        data.forEach((d, i) => {
            const x = padding + i * stepX;
            const y = padding + (h - padding * 2) * (1 - (d.wpm - minWpm) / range);

            ctx.beginPath();
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // ========================================
    // Event Binding
    // ========================================
    function bindEvents() {
        // Sidebar
        document.getElementById('menu-toggle').addEventListener('click', openSidebar);
        document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
        document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

        // Navigation
        document.querySelectorAll('[data-view]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(el.dataset.view);
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

        // Stats button
        document.getElementById('stats-btn').addEventListener('click', () => navigateTo('progress'));

        // Quick start buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openExerciseSetup(btn.dataset.exercise);
            });
        });

        // Exercise cards
        document.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', () => {
                openExerciseSetup(card.dataset.exercise);
            });
        });

        // Gospel tabs
        document.querySelectorAll('.gospel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.gospel-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                App.selectedGospel = tab.dataset.gospel;
                updateGospelInfo();
                updateChapterGrid();
            });
        });

        // Exercise setup
        document.getElementById('exercise-back').addEventListener('click', () => {
            if (App.engine) App.engine.stop();
            navigateTo('exercises');
        });

        document.getElementById('setup-gospel').addEventListener('change', (e) => {
            App.selectedGospel = e.target.value;
            updateChapterSelect();
        });

        document.getElementById('setup-speed').addEventListener('input', (e) => {
            document.getElementById('speed-value').textContent = e.target.value;
        });

        document.getElementById('setup-chunk').addEventListener('input', (e) => {
            document.getElementById('chunk-value').textContent = e.target.value;
        });

        // Speed presets
        document.querySelectorAll('.speed-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseInt(btn.dataset.speed);
                document.getElementById('setup-speed').value = speed;
                document.getElementById('speed-value').textContent = speed;
                document.querySelectorAll('.speed-preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Font size controls
        document.getElementById('font-decrease').addEventListener('click', () => {
            App.exerciseFontSize = Math.max(14, App.exerciseFontSize - 2);
            document.getElementById('font-size-display').textContent = App.exerciseFontSize + 'px';
        });

        document.getElementById('font-increase').addEventListener('click', () => {
            App.exerciseFontSize = Math.min(48, App.exerciseFontSize + 2);
            document.getElementById('font-size-display').textContent = App.exerciseFontSize + 'px';
        });

        // Start exercise
        document.getElementById('start-exercise').addEventListener('click', startExercise);

        // Exercise controls
        document.getElementById('exercise-pause').addEventListener('click', pauseExercise);
        document.getElementById('exercise-stop').addEventListener('click', stopExercise);

        document.getElementById('speed-up').addEventListener('click', () => {
            if (App.engine) App.engine.adjustSpeed(25);
        });

        document.getElementById('speed-down').addEventListener('click', () => {
            if (App.engine) App.engine.adjustSpeed(-25);
        });

        // Quiz submit
        document.getElementById('submit-quiz').addEventListener('click', () => {
            if (App.engine && App.engine instanceof ComprehensionExercise) {
                App.engine.submitQuiz();
            }
        });

        // Results actions
        document.getElementById('result-retry').addEventListener('click', () => {
            openExerciseSetup(App.currentExercise);
        });

        document.getElementById('result-next').addEventListener('click', () => {
            // Find next available chapter
            const data = window.GospelData[App.selectedGospel];
            if (data) {
                const chapters = Object.keys(data.chapters).map(Number).sort((a, b) => a - b);
                const currentIdx = chapters.indexOf(App.selectedChapter);
                if (currentIdx < chapters.length - 1) {
                    App.selectedChapter = chapters[currentIdx + 1];
                }
            }
            openExerciseSetup(App.currentExercise);
        });

        document.getElementById('result-home').addEventListener('click', () => {
            navigateTo('home');
        });

        // Settings
        document.getElementById('setting-fontsize').addEventListener('input', (e) => {
            document.getElementById('fontsize-display').textContent = e.target.value + 'px';
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            const settings = {
                theme: document.getElementById('setting-theme').value,
                font: document.getElementById('setting-font').value,
                fontSize: parseInt(document.getElementById('setting-fontsize').value),
                defaultSpeed: parseInt(document.getElementById('setting-default-speed').value),
                showVerse: document.getElementById('setting-show-verse').checked,
                sound: document.getElementById('setting-sound').checked,
                dailyGoal: parseInt(document.getElementById('setting-daily-goal').value),
                breakReminder: parseInt(document.getElementById('setting-break-reminder').value)
            };
            Storage.saveSettings(settings);
            applySettings();
            alert('Configuración guardada correctamente.');
        });

        // Reset progress
        document.getElementById('reset-progress').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
                Storage.resetAll();
                updateHomeStats();
                updateHeaderWpm();
                loadProgress();
                alert('Progreso reiniciado.');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (App.engine && App.engine.isRunning) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    pauseExercise();
                }
                if (e.code === 'Escape') {
                    stopExercise();
                }
                if (e.code === 'ArrowUp') {
                    App.engine.adjustSpeed(25);
                }
                if (e.code === 'ArrowDown') {
                    App.engine.adjustSpeed(-25);
                }
            }
        });
    }

    // ========================================
    // Start app when DOM is ready
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
