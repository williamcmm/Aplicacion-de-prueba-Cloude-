// ========================================
// LecturaVeloz - App Controller
// ========================================
(function() {
    'use strict';

    let currentExercise = null;
    let currentRunner = null;
    let exerciseStartTime = null;
    let exerciseTimer = null;
    let isPaused = false;
    let currentConfig = {};

    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    function init() {
        const settings = Storage.getSettings();
        applyTheme(settings.theme || 'light');
        updateHomeStats();

        document.querySelectorAll('.exercise-tile').forEach(tile => {
            tile.addEventListener('click', () => openInstructions(tile.dataset.ex));
        });

        document.getElementById('btn-theme').addEventListener('click', () => {
            const themes = ['light', 'dark', 'sepia'];
            const cur = document.documentElement.dataset.theme || 'light';
            const next = themes[(themes.indexOf(cur) + 1) % themes.length];
            applyTheme(next);
            const s = Storage.getSettings(); s.theme = next; Storage.saveSettings(s);
        });

        document.getElementById('btn-settings').addEventListener('click', openSettings);

        document.getElementById('btn-back-settings').addEventListener('click', () => {
            const s = Storage.getSettings();
            s.theme = document.getElementById('set-theme').value;
            s.font = document.getElementById('set-font').value;
            s.fontSize = parseInt(document.getElementById('set-fontsize').value);
            s.dailyGoal = parseInt(document.getElementById('set-daily-goal').value);
            s.gospel = document.getElementById('set-gospel').value;
            Storage.saveSettings(s);
            applyTheme(s.theme);
            showScreen('screen-home');
            updateHomeStats();
        });

        document.getElementById('btn-back-instructions').addEventListener('click', () => showScreen('screen-home'));
        document.getElementById('btn-start-exercise').addEventListener('click', startExercise);
        document.getElementById('btn-stop-ex').addEventListener('click', stopExercise);
        document.getElementById('btn-pause-ex').addEventListener('click', togglePause);
        document.getElementById('btn-retry').addEventListener('click', () => openInstructions(currentExercise));
        document.getElementById('btn-back-home').addEventListener('click', () => { showScreen('screen-home'); updateHomeStats(); });

        document.getElementById('set-theme').addEventListener('change', e => applyTheme(e.target.value));
        document.getElementById('set-fontsize').addEventListener('input', e => {
            document.getElementById('set-fs-val').textContent = e.target.value;
        });
        document.getElementById('btn-reset-progress').addEventListener('click', () => {
            if (confirm('¿Borrar todo el progreso?')) { Storage.resetAll(); updateHomeStats(); showScreen('screen-home'); }
        });

        document.addEventListener('keydown', e => {
            if (e.code === 'Space' && currentRunner) { e.preventDefault(); togglePause(); }
            if (e.code === 'Escape' && currentRunner) stopExercise();
        });
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        const m = document.querySelector('meta[name="theme-color"]');
        if (m) m.content = { light:'#4f46e5', dark:'#6366f1', sepia:'#b45309' }[theme] || '#4f46e5';
    }

    function updateHomeStats() {
        const p = Storage.getProgress(), s = Storage.getSettings();
        document.getElementById('stat-avg-wpm').textContent = p.averageWpm || 0;
        document.getElementById('stat-streak').textContent = p.currentStreak || 0;
        document.getElementById('stat-sessions').textContent = p.totalSessions || 0;
        document.getElementById('stat-level').textContent = Storage.getLevelInfo(p.level).name.substring(0, 4);

        const today = Storage.getSessions().filter(ss => new Date(ss.date).toDateString() === new Date().toDateString());
        const todayMin = today.reduce((sum, ss) => sum + (ss.time || 0), 0) / 60;
        const goal = s.dailyGoal || 10;
        document.getElementById('daily-progress-fill').style.width = Math.min(100, (todayMin / goal) * 100) + '%';
        document.getElementById('daily-progress-text').textContent = Math.round(todayMin) + ' / ' + goal + ' min hoy';

        const done = new Set(today.map(ss => ss.exercise));
        document.querySelectorAll('.exercise-tile').forEach(tile => {
            const d = tile.querySelector('.tile-done');
            if (d) d.remove();
            if (done.has(tile.dataset.ex)) {
                const dot = document.createElement('div'); dot.className = 'tile-done'; tile.appendChild(dot);
            }
        });
    }

    function openInstructions(exId) {
        currentExercise = exId;
        const def = window.ExerciseDefinitions[exId];
        if (!def) return;

        document.getElementById('instr-title').textContent = def.name;
        document.getElementById('instr-icon').textContent = def.icon;
        document.getElementById('instr-text').innerHTML = def.instructions;

        const cfg = document.getElementById('instr-config');
        cfg.innerHTML = '';

        const textEx = ['columns','fixation','sprints','disappearing','chunking','metronome','subvocal','word-pyramid','comprehension'];
        if (textEx.includes(exId)) {
            addCfg(cfg, 'Evangelio', '<select id="cfg-gospel"><option value="mateo">San Mateo</option><option value="marcos">San Marcos</option><option value="lucas">San Lucas</option><option value="juan">San Juan</option></select>');
            addCfg(cfg, 'Capítulo', '<select id="cfg-chapter"></select>');
            setTimeout(() => {
                const g = document.getElementById('cfg-gospel');
                if (g) { const s = Storage.getSettings(); if (s.gospel) g.value = s.gospel; g.addEventListener('change', popCh); popCh(); }
            }, 0);
        }

        if (def.config) {
            def.config.forEach(c => {
                if (c.type === 'select') {
                    const opts = c.options.map(o => `<option value="${o.v}"${o.v===c.default?' selected':''}>${o.l}</option>`).join('');
                    addCfg(cfg, c.label, `<select id="cfg-${c.id}">${opts}</select>`);
                }
            });
        }
        showScreen('screen-instructions');
    }

    function addCfg(el, label, html) {
        const r = document.createElement('div'); r.className = 'config-row';
        r.innerHTML = `<label>${label}</label>${html}`; el.appendChild(r);
    }

    function popCh() {
        const g = document.getElementById('cfg-gospel'), ch = document.getElementById('cfg-chapter');
        if (!g || !ch) return;
        const gospel = window.GospelData[g.value];
        if (!gospel) return;
        ch.innerHTML = '';
        Object.keys(gospel.chapters).forEach(c => {
            const o = document.createElement('option'); o.value = c;
            o.textContent = 'Cap. ' + c + ' - ' + (gospel.chapters[c].title || '');
            ch.appendChild(o);
        });
    }

    function startExercise() {
        const def = window.ExerciseDefinitions[currentExercise];
        if (!def) return;

        currentConfig = { exercise: currentExercise };
        const gEl = document.getElementById('cfg-gospel'), chEl = document.getElementById('cfg-chapter');
        if (gEl) currentConfig.gospel = gEl.value;
        if (chEl) currentConfig.chapter = chEl.value;
        if (def.config) def.config.forEach(c => {
            const el = document.getElementById('cfg-' + c.id);
            if (el) currentConfig[c.id] = el.value;
        });

        const area = document.getElementById('exercise-area');
        area.innerHTML = '';
        document.getElementById('ex-progress-fill').style.width = '0%';
        document.getElementById('ex-timer').textContent = '0:00';
        isPaused = false;
        updatePauseBtn();

        exerciseStartTime = Date.now();
        exerciseTimer = setInterval(() => {
            if (!isPaused) {
                const s = Math.floor((Date.now() - exerciseStartTime) / 1000);
                document.getElementById('ex-timer').textContent = Math.floor(s/60) + ':' + (s%60<10?'0':'') + s%60;
            }
        }, 500);

        showScreen('screen-exercise');

        const runner = window.ExerciseRunners[currentExercise];
        if (runner) {
            currentRunner = runner(area, currentConfig, {
                onProgress(pct) { document.getElementById('ex-progress-fill').style.width = (pct*100)+'%'; },
                onComplete(results) { finishExercise(results); }
            });
        }
    }

    function togglePause() {
        isPaused = !isPaused;
        if (currentRunner) { isPaused ? currentRunner.pause?.() : currentRunner.resume?.(); }
        updatePauseBtn();
    }

    function updatePauseBtn() {
        document.getElementById('btn-pause-ex').innerHTML = isPaused
            ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21"/></svg>'
            : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    }

    function stopExercise() {
        if (currentRunner?.stop) currentRunner.stop();
        clearInterval(exerciseTimer);
        currentRunner = null;
        showScreen('screen-home');
        updateHomeStats();
    }

    function finishExercise(results) {
        clearInterval(exerciseTimer);
        const elapsed = Math.floor((Date.now() - exerciseStartTime) / 1000);
        Storage.addSession({ exercise: currentExercise, time: elapsed, ...results });

        const grid = document.getElementById('results-grid');
        grid.innerHTML = '';
        const add = (v, l) => { const d = document.createElement('div'); d.className='result-item'; d.innerHTML=`<div class="result-value">${v}</div><div class="result-label">${l}</div>`; grid.appendChild(d); };

        add(fmtTime(elapsed), 'Tiempo');
        if (results.wpm) add(results.wpm, 'PPM');
        if (results.words) add(results.words, 'Palabras');
        if (results.score !== undefined) add(results.score + '%', 'Precisión');
        if (results.correct !== undefined) add(results.correct + '/' + results.total, 'Aciertos');

        const msg = document.getElementById('results-msg');
        if (results.score >= 90) msg.textContent = '¡Excelente! Dominas este ejercicio.';
        else if (results.score >= 70) msg.textContent = '¡Muy bien! Sigue practicando.';
        else if (results.score >= 50) msg.textContent = 'Buen intento. La práctica hace al maestro.';
        else msg.textContent = '¡Completado! Cada sesión te hace más rápido.';

        currentRunner = null;
        showScreen('screen-results');
    }

    function fmtTime(s) { const m=Math.floor(s/60); return m>0?m+'m '+(s%60)+'s':s+'s'; }

    function openSettings() {
        const s = Storage.getSettings(), p = Storage.getProgress();
        document.getElementById('set-theme').value = s.theme||'light';
        document.getElementById('set-font').value = s.font||'Inter';
        document.getElementById('set-fontsize').value = s.fontSize||20;
        document.getElementById('set-fs-val').textContent = s.fontSize||20;
        document.getElementById('set-daily-goal').value = s.dailyGoal||10;
        document.getElementById('set-gospel').value = s.gospel||'juan';
        const li = Storage.getLevelInfo(p.level);
        document.getElementById('progress-summary').innerHTML = `
            <p><strong>Nivel:</strong> ${li.name} | <strong>Sesiones:</strong> ${p.totalSessions} | <strong>Racha:</strong> ${p.currentStreak} días</p>
            <p><strong>Mejor:</strong> ${p.bestWpm} PPM | <strong>Promedio:</strong> ${p.averageWpm} PPM</p>
            <p><strong>Palabras:</strong> ${p.totalWords.toLocaleString()} | <strong>Tiempo:</strong> ${Math.round(p.totalTime/60)} min</p>`;
        showScreen('screen-settings');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
