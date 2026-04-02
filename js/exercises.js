// ========================================
// Speed Reading Exercises - Full Implementation
// ========================================

// ----------------------------------------
// Helper Functions
// ----------------------------------------
function getGospelText(gospel, chapter) {
    const g = window.GospelData[gospel || 'juan'];
    if (!g) return '';
    const chapters = Object.keys(g.chapters);
    const ch = chapter || chapters[Math.floor(Math.random() * chapters.length)];
    const verses = g.chapters[ch] ? g.chapters[ch].verses : g.chapters[chapters[0]].verses;
    return Object.values(verses).join(' ');
}

function getRandomWords(count) {
    const text = getGospelText('juan');
    const words = text.split(/\s+/).filter(w => w.length > 1);
    const start = Math.floor(Math.random() * Math.max(1, words.length - count));
    return words.slice(start, start + count);
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ----------------------------------------
// Exercise Definitions
// ----------------------------------------
window.ExerciseDefinitions = {
    'schultz': {
        name: 'Tabla de Schultz',
        icon: '🔢',
        skill: 'Visión periférica',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Verás una cuadrícula con números desordenados. Debes encontrar cada número en orden ascendente (1, 2, 3...) lo más rápido posible.</p>
<p><strong>Regla clave:</strong> Mantén la vista fija en el centro de la cuadrícula (punto rojo). Usa tu visión periférica para encontrar los números sin mover los ojos.</p>
<ul>
<li>Toca el número correcto en orden</li>
<li>Si te equivocas, se marca en rojo</li>
<li>El objetivo es completar la tabla cada vez más rápido</li>
</ul>`,
        config: [
            { id: 'grid-size', label: 'Tamaño', type: 'select', options: [{v:'3',l:'3×3 (Fácil)'},{v:'5',l:'5×5 (Normal)'},{v:'7',l:'7×7 (Difícil)'}], default: '5' }
        ]
    },
    'flash': {
        name: 'Taquistoscopio',
        icon: '⚡',
        skill: 'Reconocimiento rápido',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Una palabra o frase aparecerá en la pantalla por un instante muy breve. Debes leer y memorizar lo que viste.</p>
<p>La duración de exposición va disminuyendo progresivamente, forzando tu cerebro a procesar texto más rápido.</p>
<ul>
<li>Mira al centro de la pantalla</li>
<li>La palabra aparece y desaparece rápidamente</li>
<li>Comenzamos con 500ms y bajamos hasta 50ms</li>
<li>Se muestran palabras cada vez más largas</li>
</ul>`,
        config: [
            { id: 'flash-time', label: 'Tiempo inicial (ms)', type: 'select', options: [{v:'800',l:'800ms (Fácil)'},{v:'500',l:'500ms (Normal)'},{v:'300',l:'300ms (Rápido)'}], default: '500' },
            { id: 'flash-rounds', label: 'Rondas', type: 'select', options: [{v:'10',l:'10'},{v:'20',l:'20'},{v:'30',l:'30'}], default: '20' }
        ]
    },
    'flash-choice': {
        name: 'Flash + Opciones',
        icon: '🎯',
        skill: 'Identificación veloz',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Se muestra una palabra muy rápido y luego aparecen 4 opciones. Debes elegir la palabra que viste.</p>
<ul>
<li>Concéntrate en el centro</li>
<li>La palabra aparece brevemente</li>
<li>Elige entre las 4 opciones cuál era</li>
<li>¡Velocidad y precisión!</li>
</ul>`,
        config: [
            { id: 'fc-time', label: 'Tiempo de exposición', type: 'select', options: [{v:'600',l:'600ms (Fácil)'},{v:'400',l:'400ms (Normal)'},{v:'200',l:'200ms (Difícil)'},{v:'100',l:'100ms (Extremo)'}], default: '400' },
            { id: 'fc-rounds', label: 'Rondas', type: 'select', options: [{v:'10',l:'10'},{v:'20',l:'20'}], default: '15' }
        ]
    },
    'word-pyramid': {
        name: 'Pirámide de Palabras',
        icon: '🔺',
        skill: 'Expansión visual',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Las palabras se presentan en forma de pirámide. <strong>Fija la vista en el centro</strong> de cada línea y trata de leer toda la línea de un solo vistazo.</p>
<ul>
<li>Cada línea tiene más palabras que la anterior</li>
<li>Mantén los ojos en el centro (punto rojo)</li>
<li>Absorbe toda la línea con visión periférica</li>
</ul>`,
        config: [
            { id: 'wp-speed', label: 'Velocidad', type: 'select', options: [{v:'3000',l:'Lento (3s)'},{v:'2000',l:'Normal (2s)'},{v:'1200',l:'Rápido (1.2s)'},{v:'800',l:'Veloz (0.8s)'}], default: '2000' }
        ]
    },
    'number-pyramid': {
        name: 'Pirámide de Números',
        icon: '🔻',
        skill: 'Campo visual',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Igual que la pirámide de palabras, pero con números. Fija la vista en el centro y trata de ver todos los números de cada fila sin mover los ojos.</p>
<ul>
<li>Fila de 1 número, luego 3, luego 5, etc.</li>
<li>Mantén la vista fija en el centro</li>
<li>Intenta memorizar todos los números de cada fila</li>
</ul>`,
        config: [
            { id: 'np-speed', label: 'Velocidad', type: 'select', options: [{v:'2500',l:'Lento'},{v:'1500',l:'Normal'},{v:'800',l:'Rápido'}], default: '1500' }
        ]
    },
    'columns': {
        name: 'Lectura en Columnas',
        icon: '📰',
        skill: 'Fijación única',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>El texto se divide en dos columnas estrechas. Lee cada línea de un solo vistazo y salta a la siguiente.</p>
<ul>
<li>Lee la columna izquierda, luego la derecha</li>
<li>Un solo golpe de vista por línea</li>
<li>El resaltado avanza automáticamente</li>
</ul>`,
        config: [
            { id: 'col-speed', label: 'Velocidad (PPM)', type: 'select', options: [{v:'150',l:'150 PPM'},{v:'250',l:'250 PPM'},{v:'400',l:'400 PPM'},{v:'600',l:'600 PPM'}], default: '250' }
        ]
    },
    'fixation': {
        name: 'Reducción de Fijaciones',
        icon: '👁️',
        skill: 'Menos fijaciones',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>El texto aparece con puntos de fijación marcados. Solo debes fijar la vista en 2-3 puntos por línea y absorber las palabras cercanas con visión periférica.</p>
<ul>
<li>Solo mira los puntos resaltados en azul</li>
<li>No muevas los ojos a las demás palabras</li>
<li>Confía en tu visión periférica</li>
</ul>`,
        config: [
            { id: 'fix-points', label: 'Fijaciones por línea', type: 'select', options: [{v:'3',l:'3 (Fácil)'},{v:'2',l:'2 (Normal)'},{v:'1',l:'1 (Experto)'}], default: '2' },
            { id: 'fix-speed', label: 'Velocidad', type: 'select', options: [{v:'2000',l:'Lento'},{v:'1200',l:'Normal'},{v:'700',l:'Rápido'}], default: '1200' }
        ]
    },
    'sprints': {
        name: 'Sprints de Velocidad',
        icon: '🏃',
        skill: 'Romper barreras',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Lee el mismo texto 3 veces con tiempos decrecientes: primero en 3 minutos, luego en 2, luego en 1.</p>
<ul>
<li>Ronda 1: Lee en 3 minutos (cómodo)</li>
<li>Ronda 2: Relee en 2 minutos (rápido)</li>
<li>Ronda 3: Relee en 1 minuto (sprint)</li>
<li>¡No te preocupes si pierdes comprensión en el sprint!</li>
</ul>`,
        config: []
    },
    'peripheral': {
        name: 'Visión Periférica',
        icon: '👀',
        skill: 'Palabras a los lados',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Fija la vista en el punto rojo central. Aparecerán palabras a la izquierda y derecha que debes leer SIN mover los ojos del centro.</p>
<ul>
<li>NO muevas los ojos del punto rojo</li>
<li>Lee las palabras que aparecen a los lados</li>
<li>La distancia aumenta progresivamente</li>
</ul>`,
        config: [
            { id: 'per-time', label: 'Tiempo exposición', type: 'select', options: [{v:'2000',l:'2s (Fácil)'},{v:'1000',l:'1s (Normal)'},{v:'500',l:'0.5s (Difícil)'}], default: '1000' }
        ]
    },
    'disappearing': {
        name: 'Texto Evanescente',
        icon: '💨',
        skill: 'Anti-regresión',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>El texto se va desvaneciendo palabra por palabra desde el inicio. Si no lees lo suficientemente rápido, las palabras desaparecen antes de que las leas.</p>
<ul>
<li>Lee siempre hacia adelante</li>
<li>Las palabras desaparecen tras unos segundos</li>
<li>No puedes volver atrás</li>
<li>¡Mantén el ritmo!</li>
</ul>`,
        config: [
            { id: 'dis-speed', label: 'Velocidad (PPM)', type: 'select', options: [{v:'150',l:'150 PPM'},{v:'250',l:'250 PPM'},{v:'400',l:'400 PPM'}], default: '250' }
        ]
    },
    'chunking': {
        name: 'Chunking Progresivo',
        icon: '📦',
        skill: 'Grupos de palabras',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>El texto se divide en grupos (chunks) de palabras que se resaltan de forma progresiva. Empezamos con grupos de 2 palabras y vamos aumentando.</p>
<ul>
<li>Lee cada grupo resaltado como una unidad</li>
<li>No leas palabra por palabra dentro del grupo</li>
<li>El tamaño del grupo aumenta progresivamente</li>
</ul>`,
        config: [
            { id: 'ch-size', label: 'Tamaño inicial', type: 'select', options: [{v:'2',l:'2 palabras'},{v:'3',l:'3 palabras'},{v:'4',l:'4 palabras'}], default: '2' },
            { id: 'ch-speed', label: 'Velocidad (PPM)', type: 'select', options: [{v:'200',l:'200 PPM'},{v:'300',l:'300 PPM'},{v:'450',l:'450 PPM'}], default: '300' }
        ]
    },
    'metronome': {
        name: 'Metrónomo',
        icon: '🎵',
        skill: 'Ritmo constante',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Un metrónomo visual marca el ritmo. Con cada pulso, avanza al siguiente grupo de palabras.</p>
<ul>
<li>Cada pulso = avanza a la siguiente palabra/grupo</li>
<li>Sigue el ritmo visual del metrónomo</li>
<li>El tempo sube gradualmente</li>
</ul>`,
        config: [
            { id: 'met-bpm', label: 'BPM inicial', type: 'select', options: [{v:'60',l:'60 BPM'},{v:'90',l:'90 BPM'},{v:'120',l:'120 BPM'}], default: '90' }
        ]
    },
    'letter-grid': {
        name: 'Rejilla de Letras',
        icon: '🔤',
        skill: 'Búsqueda visual',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Una cuadrícula de letras aleatorias aparece en pantalla. Debes encontrar y tocar letras específicas en el orden indicado (A, B, C...).</p>
<ul>
<li>Se te indica qué letra buscar</li>
<li>Encuéntrala en la cuadrícula y tócala</li>
<li>Luego busca la siguiente</li>
</ul>`,
        config: [
            { id: 'lg-size', label: 'Tamaño', type: 'select', options: [{v:'4',l:'4×4 (Fácil)'},{v:'5',l:'5×5 (Normal)'},{v:'6',l:'6×6 (Difícil)'}], default: '5' }
        ]
    },
    'eye-warmup': {
        name: 'Calentamiento Ocular',
        icon: '🏋️',
        skill: 'Flexibilidad ocular',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Ejercicios de movimiento ocular estructurados para calentar antes de leer. Sigue el punto que se mueve por la pantalla.</p>
<ul>
<li>Sigue el punto azul con los ojos</li>
<li>Movimientos horizontales, verticales, diagonales y circulares</li>
<li>Haz esto antes de cada sesión de lectura</li>
</ul>`,
        config: []
    },
    'comprehension': {
        name: 'Flash + Comprensión',
        icon: '🧠',
        skill: 'Velocidad con retención',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Lee un versículo completo que aparece brevemente, luego responde una pregunta sobre lo que leíste.</p>
<ul>
<li>Un versículo aparece por unos segundos</li>
<li>Después desaparece y aparece una pregunta</li>
<li>Responde correctamente para avanzar</li>
</ul>`,
        config: [
            { id: 'comp-time', label: 'Tiempo exposición', type: 'select', options: [{v:'5000',l:'5s (Fácil)'},{v:'3000',l:'3s (Normal)'},{v:'1500',l:'1.5s (Difícil)'}], default: '3000' }
        ]
    },
    'subvocal': {
        name: 'Anti-Subvocalización',
        icon: '🤫',
        skill: 'Lectura silenciosa',
        instructions: `<h3>¿Cómo funciona?</h3>
<p>Mientras lees el texto, debes contar en voz alta o mentalmente (1-2-3-4-1-2-3-4...). Esto ocupa tu "voz interior" y te obliga a leer visualmente.</p>
<ul>
<li>Lee el texto en pantalla</li>
<li>Mientras tanto, cuenta: 1-2-3-4-1-2-3-4...</li>
<li>El contador en pantalla te marca el ritmo</li>
</ul>`,
        config: []
    }
};

// ----------------------------------------
// Exercise Runners
// ----------------------------------------
window.ExerciseRunners = {};

// ========================================
// 1. SCHULTZ TABLE
// ========================================
window.ExerciseRunners['schultz'] = function(area, config, callbacks) {
    const size = parseInt(config['grid-size'] || '5');
    const total = size * size;
    let current = 1;
    let startTime = Date.now();
    let stopped = false;
    let paused = false;
    let pauseStart = 0;
    let totalPaused = 0;
    let tickInterval = null;
    let secondsElapsed = 0;

    function render() {
        const nums = shuffle(Array.from({length: total}, (_, i) => i + 1));
        area.innerHTML = `
            <div class="schultz-wrap" style="position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;">
                <div style="font-size:16px;color:var(--text-secondary);">Encuentra: <strong id="sch-target" style="font-size:22px;color:var(--accent);">${current}</strong> de ${total}</div>
                <div style="position:relative;display:inline-block;">
                    <div id="sch-grid" style="display:grid;grid-template-columns:repeat(${size},1fr);gap:6px;padding:8px;background:var(--surface);border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);"></div>
                    <div id="sch-center" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:14px;height:14px;background:red;border-radius:50%;pointer-events:none;z-index:10;opacity:0.8;"></div>
                </div>
                <div id="sch-status" style="font-size:14px;color:var(--text-secondary);">Progreso: 0/${total}</div>
                <div id="sch-timer" style="font-size:20px;font-weight:700;color:var(--accent);">0.0s</div>
            </div>`;

        const grid = area.querySelector('#sch-grid');
        const cellSize = size <= 4 ? 70 : size <= 5 ? 58 : 46;
        nums.forEach(n => {
            const btn = document.createElement('button');
            btn.textContent = n;
            btn.dataset.num = n;
            btn.style.cssText = `width:${cellSize}px;height:${cellSize}px;border-radius:8px;border:2px solid var(--border);background:var(--bg);color:var(--text);font-size:${size<=4?22:size<=5?18:15}px;font-weight:600;cursor:pointer;transition:all 0.15s;`;
            btn.addEventListener('click', () => handleClick(btn, n));
            grid.appendChild(btn);
        });
    }

    function handleClick(btn, n) {
        if (paused || stopped) return;
        if (n === current) {
            btn.style.background = 'var(--success, #22c55e)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'transparent';
            btn.disabled = true;
            current++;
            const targetEl = area.querySelector('#sch-target');
            const statusEl = area.querySelector('#sch-status');
            if (targetEl) targetEl.textContent = current <= total ? current : '✓';
            if (statusEl) statusEl.textContent = `Progreso: ${current-1}/${total}`;
            callbacks.onProgress((current - 1) / total);
            if (current > total) {
                finish();
            }
        } else {
            btn.style.background = '#ef4444';
            btn.style.color = '#fff';
            setTimeout(() => {
                if (!btn.disabled) {
                    btn.style.background = '';
                    btn.style.color = '';
                }
            }, 500);
        }
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        const elapsed = (Date.now() - startTime - totalPaused) / 1000;
        const timerEl = area.querySelector('#sch-timer');
        if (timerEl) timerEl.textContent = elapsed.toFixed(1) + 's';
        callbacks.onComplete({ exercise: 'schultz', time: Math.round(elapsed), gridSize: size, score: Math.round(1000 / elapsed * total) });
    }

    render();
    startTime = Date.now();
    tickInterval = setInterval(() => {
        if (paused || stopped) return;
        secondsElapsed++;
        callbacks.onTick(secondsElapsed);
        const elapsed = (Date.now() - startTime - totalPaused) / 1000;
        const timerEl = area.querySelector('#sch-timer');
        if (timerEl) timerEl.textContent = elapsed.toFixed(1) + 's';
    }, 1000);

    return {
        pause() { paused = true; pauseStart = Date.now(); },
        resume() { paused = false; totalPaused += Date.now() - pauseStart; },
        stop() { stopped = true; clearInterval(tickInterval); }
    };
};

// ========================================
// 2. FLASH (Taquistoscopio)
// ========================================
window.ExerciseRunners['flash'] = function(area, config, callbacks) {
    const initTime = parseInt(config['flash-time'] || '500');
    const rounds = parseInt(config['flash-rounds'] || '20');
    const words = getRandomWords(rounds * 3);
    let round = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    area.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;gap:24px;">
            <div style="font-size:13px;color:var(--text-secondary);">Ronda <span id="fl-round">0</span>/${rounds}</div>
            <div id="fl-display" style="width:320px;height:100px;display:flex;align-items:center;justify-content:center;background:var(--surface);border-radius:16px;border:2px solid var(--border);font-size:32px;font-weight:700;color:var(--accent);letter-spacing:1px;transition:opacity 0.1s;"></div>
            <div id="fl-msg" style="font-size:15px;color:var(--text-secondary);min-height:24px;"></div>
            <div style="width:280px;background:var(--border);height:6px;border-radius:3px;">
                <div id="fl-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
            </div>
        </div>`;

    function nextRound() {
        if (stopped || paused) return;
        if (round >= rounds) { finish(); return; }

        const displayEl = area.querySelector('#fl-display');
        const msgEl = area.querySelector('#fl-msg');
        const roundEl = area.querySelector('#fl-round');
        const barEl = area.querySelector('#fl-bar');

        // Pick words: 1 word early rounds, 2-3 words later
        const wordCount = round < rounds * 0.4 ? 1 : round < rounds * 0.7 ? 2 : 3;
        const chunk = words.slice(round * 2, round * 2 + wordCount).join(' ') || words[round % words.length];

        // Decreasing exposure time
        const progress = round / rounds;
        const expTime = Math.max(50, Math.round(initTime * (1 - progress * 0.8)));

        if (roundEl) roundEl.textContent = round + 1;
        if (barEl) barEl.style.width = ((round / rounds) * 100) + '%';
        if (msgEl) msgEl.textContent = expTime + 'ms';

        // Show word
        if (displayEl) {
            displayEl.textContent = chunk;
            displayEl.style.opacity = '1';
        }

        timer = setTimeout(() => {
            if (stopped || paused) return;
            if (displayEl) {
                displayEl.textContent = '';
                displayEl.style.opacity = '0';
            }
            round++;
            callbacks.onProgress(round / rounds);
            // Gap between flashes
            timer = setTimeout(() => { if (!stopped && !paused) nextRound(); }, 600);
        }, expTime);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        const displayEl = area.querySelector('#fl-display');
        const msgEl = area.querySelector('#fl-msg');
        if (displayEl) { displayEl.textContent = '✓'; displayEl.style.opacity = '1'; }
        if (msgEl) msgEl.textContent = '¡Ejercicio completado!';
        callbacks.onComplete({ exercise: 'flash', rounds, time: secondsElapsed });
    }

    nextRound();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() {
            paused = true;
            clearTimeout(timer);
            const displayEl = area.querySelector('#fl-display');
            if (displayEl) displayEl.style.opacity = '0.3';
        },
        resume() {
            paused = false;
            const displayEl = area.querySelector('#fl-display');
            if (displayEl) displayEl.style.opacity = '1';
            nextRound();
        },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 3. FLASH + OPCIONES
// ========================================
window.ExerciseRunners['flash-choice'] = function(area, config, callbacks) {
    const expTime = parseInt(config['fc-time'] || '400');
    const rounds = parseInt(config['fc-rounds'] || '15');
    const allWords = getRandomWords(rounds + 20).filter(w => w.length > 3);
    let round = 0;
    let score = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    area.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:20px;min-height:320px;padding:10px;">
            <div style="display:flex;gap:20px;font-size:13px;color:var(--text-secondary);">
                <span>Ronda <span id="fc-round">0</span>/${rounds}</span>
                <span>Aciertos: <span id="fc-score" style="color:var(--success,#22c55e);font-weight:700;">0</span></span>
            </div>
            <div id="fc-flash" style="width:300px;height:80px;display:flex;align-items:center;justify-content:center;background:var(--surface);border-radius:12px;border:2px solid var(--accent);font-size:28px;font-weight:700;color:var(--accent);"></div>
            <div id="fc-choices" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:300px;"></div>
            <div id="fc-feedback" style="font-size:14px;min-height:20px;font-weight:600;"></div>
            <div style="width:280px;background:var(--border);height:6px;border-radius:3px;">
                <div id="fc-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
            </div>
        </div>`;

    function nextRound() {
        if (stopped || paused || round >= rounds) { if (round >= rounds) finish(); return; }

        const flashEl = area.querySelector('#fc-flash');
        const choicesEl = area.querySelector('#fc-choices');
        const roundEl = area.querySelector('#fc-round');
        const barEl = area.querySelector('#fc-bar');
        const feedbackEl = area.querySelector('#fc-feedback');

        if (roundEl) roundEl.textContent = round + 1;
        if (barEl) barEl.style.width = ((round / rounds) * 100) + '%';
        if (feedbackEl) feedbackEl.textContent = '';
        if (choicesEl) choicesEl.innerHTML = '';

        const correct = allWords[round % allWords.length] || 'Jesús';
        const distractors = allWords.filter(w => w !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = shuffle([correct, ...distractors]);

        // Show flash
        if (flashEl) { flashEl.textContent = correct; flashEl.style.opacity = '1'; }

        timer = setTimeout(() => {
            if (stopped || paused) return;
            if (flashEl) { flashEl.textContent = '?'; flashEl.style.opacity = '0.4'; }

            // Show choices
            if (choicesEl) {
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.textContent = opt;
                    btn.style.cssText = 'padding:10px;border-radius:8px;border:2px solid var(--border);background:var(--bg);color:var(--text);font-size:16px;cursor:pointer;transition:all 0.2s;';
                    btn.addEventListener('click', () => handleChoice(btn, opt, correct, options, choicesEl));
                    choicesEl.appendChild(btn);
                });
            }
        }, expTime);
    }

    function handleChoice(btn, chosen, correct, options, choicesEl) {
        if (stopped) return;
        const feedbackEl = area.querySelector('#fc-feedback');
        const scoreEl = area.querySelector('#fc-score');
        const flashEl = area.querySelector('#fc-flash');

        // Disable all buttons
        choicesEl.querySelectorAll('button').forEach(b => b.disabled = true);

        if (chosen === correct) {
            score++;
            btn.style.background = 'var(--success, #22c55e)';
            btn.style.color = '#fff';
            if (feedbackEl) { feedbackEl.textContent = '✓ ¡Correcto!'; feedbackEl.style.color = 'var(--success,#22c55e)'; }
        } else {
            btn.style.background = '#ef4444';
            btn.style.color = '#fff';
            // Highlight correct
            choicesEl.querySelectorAll('button').forEach(b => {
                if (b.textContent === correct) { b.style.background = 'var(--success,#22c55e)'; b.style.color = '#fff'; }
            });
            if (feedbackEl) { feedbackEl.textContent = '✗ Era: ' + correct; feedbackEl.style.color = '#ef4444'; }
        }

        if (flashEl) { flashEl.textContent = correct; flashEl.style.opacity = '1'; }
        if (scoreEl) scoreEl.textContent = score;
        round++;
        callbacks.onProgress(round / rounds);

        timer = setTimeout(() => { if (!stopped && !paused) nextRound(); }, 1000);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        const pct = Math.round((score / rounds) * 100);
        callbacks.onComplete({ exercise: 'flash-choice', rounds, score, accuracy: pct, time: secondsElapsed });
    }

    nextRound();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; nextRound(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 4. WORD PYRAMID
// ========================================
window.ExerciseRunners['word-pyramid'] = function(area, config, callbacks) {
    const speed = parseInt(config['wp-speed'] || '2000');
    const text = getGospelText('juan');
    const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 80);
    // Build pyramid rows: 1, 2, 3, 4, 5, 4, 3, 2 words
    const rowSizes = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2];
    const rows = [];
    let idx = 0;
    rowSizes.forEach(size => {
        if (idx < words.length) {
            rows.push(words.slice(idx, idx + size));
            idx += size;
        }
    });

    let currentRow = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    function renderRows() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:20px;">
                <div style="font-size:13px;color:var(--text-secondary);">Fija la vista en el punto rojo • Lee la fila completa de un vistazo</div>
                <div id="pyr-rows" style="display:flex;flex-direction:column;align-items:center;gap:8px;min-height:320px;justify-content:center;"></div>
                <div style="width:280px;background:var(--border);height:6px;border-radius:3px;">
                    <div id="pyr-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        const container = area.querySelector('#pyr-rows');
        rows.forEach((row, i) => {
            const rowEl = document.createElement('div');
            rowEl.id = 'pyr-row-' + i;
            rowEl.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 16px;border-radius:8px;transition:all 0.3s;opacity:0.3;';

            // Center marker
            const centerDot = document.createElement('span');
            centerDot.innerHTML = '•';
            centerDot.style.cssText = 'color:red;font-size:18px;position:absolute;';

            const wordsContainer = document.createElement('div');
            wordsContainer.style.cssText = 'display:flex;gap:8px;position:relative;';
            row.forEach(w => {
                const span = document.createElement('span');
                span.textContent = w;
                span.style.cssText = 'font-size:18px;font-weight:500;color:var(--text);';
                wordsContainer.appendChild(span);
            });

            // Add center dot overlay
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;';
            wrapper.appendChild(wordsContainer);
            const dot = document.createElement('div');
            dot.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:red;border-radius:50%;opacity:0;transition:opacity 0.3s;pointer-events:none;';
            dot.className = 'pyr-dot';
            wrapper.appendChild(dot);

            rowEl.appendChild(wrapper);
            container.appendChild(rowEl);
        });
    }

    function advance() {
        if (stopped || paused) return;
        if (currentRow >= rows.length) { finish(); return; }

        // Dim all rows
        rows.forEach((_, i) => {
            const el = area.querySelector('#pyr-row-' + i);
            if (el) {
                el.style.opacity = i < currentRow ? '0.2' : '0.3';
                el.style.background = 'transparent';
                const dot = el.querySelector('.pyr-dot');
                if (dot) dot.style.opacity = '0';
            }
        });

        // Highlight current row
        const rowEl = area.querySelector('#pyr-row-' + currentRow);
        if (rowEl) {
            rowEl.style.opacity = '1';
            rowEl.style.background = 'var(--surface)';
            rowEl.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
            const dot = rowEl.querySelector('.pyr-dot');
            if (dot) dot.style.opacity = '1';
            rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const barEl = area.querySelector('#pyr-bar');
        if (barEl) barEl.style.width = ((currentRow / rows.length) * 100) + '%';

        callbacks.onProgress(currentRow / rows.length);
        currentRow++;
        timer = setTimeout(advance, speed);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'word-pyramid', rows: rows.length, time: secondsElapsed });
    }

    renderRows();
    advance();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; advance(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 5. NUMBER PYRAMID
// ========================================
window.ExerciseRunners['number-pyramid'] = function(area, config, callbacks) {
    const speed = parseInt(config['np-speed'] || '1500');
    // Generate rows of numbers: 1, 3, 5, 7, 5, 3, 1
    const rowSizes = [1, 3, 5, 7, 5, 3, 1];
    const rows = rowSizes.map(size => {
        return Array.from({length: size}, () => Math.floor(Math.random() * 90) + 10);
    });

    let currentRow = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    function renderRows() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:20px;">
                <div style="font-size:13px;color:var(--text-secondary);">Fija la vista en el centro • Memoriza todos los números de cada fila</div>
                <div id="npyr-rows" style="display:flex;flex-direction:column;align-items:center;gap:10px;min-height:300px;justify-content:center;"></div>
                <div style="width:280px;background:var(--border);height:6px;border-radius:3px;">
                    <div id="npyr-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        const container = area.querySelector('#npyr-rows');
        rows.forEach((row, i) => {
            const rowEl = document.createElement('div');
            rowEl.id = 'npyr-row-' + i;
            rowEl.style.cssText = 'display:flex;align-items:center;gap:12px;padding:8px 20px;border-radius:8px;transition:all 0.3s;opacity:0.3;position:relative;';

            const inner = document.createElement('div');
            inner.style.cssText = 'display:flex;gap:12px;align-items:center;justify-content:center;';
            row.forEach(n => {
                const span = document.createElement('span');
                span.textContent = n;
                span.style.cssText = 'font-size:22px;font-weight:700;color:var(--text);font-family:monospace;';
                inner.appendChild(span);
            });

            const dot = document.createElement('div');
            dot.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:red;border-radius:50%;opacity:0;transition:opacity 0.3s;pointer-events:none;';
            dot.className = 'npyr-dot';

            rowEl.appendChild(inner);
            rowEl.appendChild(dot);
            container.appendChild(rowEl);
        });
    }

    function advance() {
        if (stopped || paused) return;
        if (currentRow >= rows.length) { finish(); return; }

        rows.forEach((_, i) => {
            const el = area.querySelector('#npyr-row-' + i);
            if (el) {
                el.style.opacity = i < currentRow ? '0.15' : '0.3';
                el.style.background = 'transparent';
                el.style.boxShadow = 'none';
                const d = el.querySelector('.npyr-dot');
                if (d) d.style.opacity = '0';
            }
        });

        const rowEl = area.querySelector('#npyr-row-' + currentRow);
        if (rowEl) {
            rowEl.style.opacity = '1';
            rowEl.style.background = 'var(--surface)';
            rowEl.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
            const d = rowEl.querySelector('.npyr-dot');
            if (d) d.style.opacity = '1';
        }

        const barEl = area.querySelector('#npyr-bar');
        if (barEl) barEl.style.width = ((currentRow / rows.length) * 100) + '%';
        callbacks.onProgress(currentRow / rows.length);
        currentRow++;
        timer = setTimeout(advance, speed);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'number-pyramid', rows: rows.length, time: secondsElapsed });
    }

    renderRows();
    advance();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; advance(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 6. COLUMNS
// ========================================
window.ExerciseRunners['columns'] = function(area, config, callbacks) {
    const ppm = parseInt(config['col-speed'] || '250');
    const text = getGospelText('juan');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordsPerLine = 4;
    const msPerLine = Math.round((wordsPerLine / ppm) * 60 * 1000);

    // Build lines for 2 columns
    const lines = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    // Pair into left/right columns
    const pairs = [];
    for (let i = 0; i < lines.length - 1; i += 2) {
        pairs.push({ left: lines[i], right: lines[i+1] || '' });
    }
    const maxPairs = Math.min(pairs.length, 30);
    const displayPairs = pairs.slice(0, maxPairs);

    let currentLine = 0; // 0 = left col row 0, 1 = right col row 0, 2 = left col row 1, etc.
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:12px;padding:10px;">
                <div style="font-size:12px;color:var(--text-secondary);text-align:center;">${ppm} PPM • Lee cada línea de UN solo vistazo</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-height:400px;overflow-y:auto;" id="col-container">
                    <div id="col-left" style="display:flex;flex-direction:column;gap:4px;"></div>
                    <div id="col-right" style="display:flex;flex-direction:column;gap:4px;"></div>
                </div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="col-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        const leftCol = area.querySelector('#col-left');
        const rightCol = area.querySelector('#col-right');

        displayPairs.forEach((pair, i) => {
            const makeEl = (text, col, idx) => {
                const el = document.createElement('div');
                el.id = 'col-' + col + '-' + idx;
                el.textContent = text;
                el.style.cssText = 'padding:5px 8px;border-radius:6px;font-size:15px;line-height:1.5;transition:all 0.2s;opacity:0.4;text-align:center;';
                return el;
            };
            leftCol.appendChild(makeEl(pair.left, 'l', i));
            rightCol.appendChild(makeEl(pair.right, 'r', i));
        });
    }

    function advance() {
        if (stopped || paused) return;
        const totalLines = displayPairs.length * 2;
        if (currentLine >= totalLines) { finish(); return; }

        // Clear previous highlights
        area.querySelectorAll('[id^="col-l-"],[id^="col-r-"]').forEach(el => {
            const lineIdx = parseInt(el.id.split('-')[2]);
            const isLeft = el.id.includes('-l-');
            const globalIdx = lineIdx * 2 + (isLeft ? 0 : 1);
            el.style.opacity = globalIdx < currentLine ? '0.2' : '0.4';
            el.style.background = 'transparent';
            el.style.fontWeight = 'normal';
            el.style.color = 'var(--text)';
        });

        const rowIdx = Math.floor(currentLine / 2);
        const isLeft = currentLine % 2 === 0;
        const elId = 'col-' + (isLeft ? 'l' : 'r') + '-' + rowIdx;
        const el = area.querySelector('#' + elId);
        if (el) {
            el.style.opacity = '1';
            el.style.background = 'var(--accent)';
            el.style.color = '#fff';
            el.style.fontWeight = '600';
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        const barEl = area.querySelector('#col-bar');
        if (barEl) barEl.style.width = ((currentLine / totalLines) * 100) + '%';
        callbacks.onProgress(currentLine / totalLines);
        currentLine++;
        timer = setTimeout(advance, msPerLine);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'columns', ppm, time: secondsElapsed, words: currentLine * wordsPerLine });
    }

    render();
    advance();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; advance(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 7. FIXATION REDUCTION
// ========================================
window.ExerciseRunners['fixation'] = function(area, config, callbacks) {
    const fixPoints = parseInt(config['fix-points'] || '2');
    const speed = parseInt(config['fix-speed'] || '1200');
    const text = getGospelText('juan');
    const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 100);
    const wordsPerLine = 8;

    // Build lines
    const lines = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine));
    }
    const maxLines = Math.min(lines.length, 20);

    let currentFixation = 0; // global fixation index
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    // For each line, compute fixation word indices
    function getFixationIndices(lineWords, n) {
        if (n === 1) return [Math.floor(lineWords.length / 2)];
        if (n === 2) return [Math.floor(lineWords.length * 0.25), Math.floor(lineWords.length * 0.75)];
        return [Math.floor(lineWords.length * 0.15), Math.floor(lineWords.length * 0.5), Math.floor(lineWords.length * 0.85)];
    }

    // Flatten fixations
    const allFixations = [];
    lines.slice(0, maxLines).forEach((line, li) => {
        const indices = getFixationIndices(line, fixPoints);
        indices.forEach(wi => {
            allFixations.push({ lineIdx: li, wordIdx: wi });
        });
    });

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:12px;padding:10px;">
                <div style="font-size:12px;color:var(--text-secondary);text-align:center;">Mira SOLO las palabras resaltadas en azul • ${fixPoints} fijación(es) por línea</div>
                <div id="fix-text" style="max-height:380px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:4px;"></div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="fix-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        const container = area.querySelector('#fix-text');
        lines.slice(0, maxLines).forEach((line, li) => {
            const lineEl = document.createElement('div');
            lineEl.id = 'fix-line-' + li;
            lineEl.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;padding:6px 8px;border-radius:6px;line-height:1.8;';
            const fixIndices = getFixationIndices(line, fixPoints);

            line.forEach((word, wi) => {
                const span = document.createElement('span');
                span.id = `fix-w-${li}-${wi}`;
                span.textContent = word;
                const isFix = fixIndices.includes(wi);
                span.style.cssText = `font-size:16px;padding:2px 4px;border-radius:4px;transition:all 0.2s;${isFix ? 'font-weight:700;' : ''}`;
                lineEl.appendChild(span);
            });
            container.appendChild(lineEl);
        });
    }

    function advance() {
        if (stopped || paused) return;
        if (currentFixation >= allFixations.length) { finish(); return; }

        const fix = allFixations[currentFixation];

        // Dim all previous fixation words
        allFixations.forEach((f, i) => {
            const el = area.querySelector(`#fix-w-${f.lineIdx}-${f.wordIdx}`);
            if (el) {
                if (i < currentFixation) {
                    el.style.background = 'transparent';
                    el.style.color = 'var(--text-secondary)';
                } else if (i > currentFixation) {
                    el.style.background = 'transparent';
                    el.style.color = 'var(--text)';
                }
            }
        });

        // Highlight current fixation
        const el = area.querySelector(`#fix-w-${fix.lineIdx}-${fix.wordIdx}`);
        if (el) {
            el.style.background = 'var(--accent)';
            el.style.color = '#fff';
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Dim current line's background slightly
        const lineEl = area.querySelector('#fix-line-' + fix.lineIdx);
        if (lineEl) lineEl.style.background = 'var(--surface)';

        const barEl = area.querySelector('#fix-bar');
        if (barEl) barEl.style.width = ((currentFixation / allFixations.length) * 100) + '%';
        callbacks.onProgress(currentFixation / allFixations.length);
        currentFixation++;
        timer = setTimeout(advance, speed);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'fixation', fixPoints, time: secondsElapsed });
    }

    render();
    advance();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; advance(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 8. SPRINTS (3-2-1)
// ========================================
window.ExerciseRunners['sprints'] = function(area, config, callbacks) {
    const text = getGospelText('mateo');
    const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 200);
    const rounds = [
        { label: 'Ronda 1', duration: 180, desc: '3 minutos – lee cómodamente' },
        { label: 'Ronda 2', duration: 120, desc: '2 minutos – lee más rápido' },
        { label: 'Ronda 3', duration: 60,  desc: '1 minuto – ¡SPRINT máximo!' }
    ];

    let currentRound = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let countdownTimer = null;
    let timeLeft = 0;
    let secondsElapsed = 0;
    let tickInterval = null;

    function renderText() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:12px;padding:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div id="sp-round-label" style="font-weight:700;font-size:16px;color:var(--accent);"></div>
                    <div id="sp-countdown" style="font-size:24px;font-weight:700;color:var(--accent);font-family:monospace;"></div>
                </div>
                <div id="sp-desc" style="font-size:13px;color:var(--text-secondary);"></div>
                <div style="display:flex;gap:6px;justify-content:center;">
                    ${rounds.map((r,i) => `<div id="sp-dot-${i}" style="width:12px;height:12px;border-radius:50%;background:var(--border);transition:background 0.3s;"></div>`).join('')}
                </div>
                <div id="sp-text" style="font-size:16px;line-height:1.8;max-height:340px;overflow-y:auto;padding:12px;background:var(--surface);border-radius:12px;color:var(--text);"></div>
                <div id="sp-next-btn" style="display:none;text-align:center;">
                    <button id="sp-next" style="padding:12px 28px;border-radius:10px;border:none;background:var(--accent);color:#fff;font-size:16px;cursor:pointer;font-weight:600;">Siguiente ronda →</button>
                </div>
            </div>`;

        // Render text
        const textEl = area.querySelector('#sp-text');
        words.forEach((w, i) => {
            const span = document.createElement('span');
            span.textContent = w + ' ';
            span.style.cssText = 'transition:color 0.3s;';
            textEl.appendChild(span);
        });
    }

    function startRound(roundIdx) {
        if (stopped || roundIdx >= rounds.length) { finish(); return; }
        currentRound = roundIdx;
        const round = rounds[roundIdx];
        timeLeft = round.duration;

        const labelEl = area.querySelector('#sp-round-label');
        const descEl = area.querySelector('#sp-desc');
        const nextBtn = area.querySelector('#sp-next-btn');

        if (labelEl) labelEl.textContent = round.label;
        if (descEl) descEl.textContent = round.desc;
        if (nextBtn) nextBtn.style.display = 'none';

        // Update dots
        rounds.forEach((_, i) => {
            const dot = area.querySelector(`#sp-dot-${i}`);
            if (dot) dot.style.background = i < roundIdx ? 'var(--success,#22c55e)' : i === roundIdx ? 'var(--accent)' : 'var(--border)';
        });

        // Scroll text back to top
        const textEl = area.querySelector('#sp-text');
        if (textEl) textEl.scrollTop = 0;

        updateCountdown();
        countdownTimer = setInterval(() => {
            if (paused || stopped) return;
            timeLeft--;
            updateCountdown();
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                roundComplete();
            }
        }, 1000);
    }

    function updateCountdown() {
        const cdEl = area.querySelector('#sp-countdown');
        if (!cdEl) return;
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        cdEl.textContent = m + ':' + String(s).padStart(2, '0');
        if (timeLeft <= 10) cdEl.style.color = '#ef4444';
        else cdEl.style.color = 'var(--accent)';
    }

    function roundComplete() {
        if (currentRound >= rounds.length - 1) {
            finish();
            return;
        }
        const nextBtn = area.querySelector('#sp-next-btn');
        if (nextBtn) nextBtn.style.display = 'block';
        const btn = area.querySelector('#sp-next');
        if (btn) btn.onclick = () => startRound(currentRound + 1);
        callbacks.onProgress((currentRound + 1) / rounds.length);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        clearInterval(countdownTimer);
        const roundLabelEl = area.querySelector('#sp-round-label');
        if (roundLabelEl) roundLabelEl.textContent = '¡Completado!';
        callbacks.onComplete({ exercise: 'sprints', rounds: currentRound + 1, time: secondsElapsed });
    }

    renderText();
    startRound(0);
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() {
            paused = true;
            clearInterval(countdownTimer);
        },
        resume() {
            paused = false;
            countdownTimer = setInterval(() => {
                if (paused || stopped) return;
                timeLeft--;
                updateCountdown();
                if (timeLeft <= 0) { clearInterval(countdownTimer); roundComplete(); }
            }, 1000);
        },
        stop() { stopped = true; clearInterval(timer); clearInterval(countdownTimer); clearInterval(tickInterval); }
    };
};

// ========================================
// 9. PERIPHERAL VISION
// ========================================
window.ExerciseRunners['peripheral'] = function(area, config, callbacks) {
    const expTime = parseInt(config['per-time'] || '1000');
    const words = getRandomWords(40);
    let round = 0;
    const totalRounds = 20;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    area.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:10px;">
            <div style="font-size:13px;color:var(--text-secondary);">NO muevas los ojos del punto rojo • Lee las palabras periféricamente</div>
            <div id="per-arena" style="position:relative;width:100%;height:200px;background:var(--surface);border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                <div id="per-dot" style="width:16px;height:16px;background:red;border-radius:50%;z-index:10;position:relative;box-shadow:0 0 8px red;"></div>
                <div id="per-left" style="position:absolute;left:15%;font-size:20px;font-weight:700;color:var(--accent);opacity:0;transition:opacity 0.15s;"></div>
                <div id="per-right" style="position:absolute;right:15%;font-size:20px;font-weight:700;color:var(--accent);opacity:0;transition:opacity 0.15s;"></div>
            </div>
            <div id="per-round" style="font-size:13px;color:var(--text-secondary);">Ronda 0/${totalRounds}</div>
            <div style="width:280px;background:var(--border);height:6px;border-radius:3px;">
                <div id="per-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
            </div>
        </div>`;

    function nextRound() {
        if (stopped || paused || round >= totalRounds) {
            if (round >= totalRounds) finish();
            return;
        }

        const leftEl = area.querySelector('#per-left');
        const rightEl = area.querySelector('#per-right');
        const roundEl = area.querySelector('#per-round');
        const barEl = area.querySelector('#per-bar');
        const arena = area.querySelector('#per-arena');

        // Increase distance over rounds
        const progress = round / totalRounds;
        const distancePct = 15 + progress * 25; // 15% to 40% from center

        if (leftEl) {
            leftEl.style.left = (50 - distancePct - 10) + '%';
            leftEl.textContent = words[round * 2 % words.length] || 'Dios';
        }
        if (rightEl) {
            rightEl.style.right = (50 - distancePct - 10) + '%';
            rightEl.textContent = words[(round * 2 + 1) % words.length] || 'amor';
        }

        if (roundEl) roundEl.textContent = `Ronda ${round + 1}/${totalRounds}`;
        if (barEl) barEl.style.width = ((round / totalRounds) * 100) + '%';

        // Show words
        if (leftEl) leftEl.style.opacity = '1';
        if (rightEl) rightEl.style.opacity = '1';

        timer = setTimeout(() => {
            if (stopped || paused) return;
            if (leftEl) leftEl.style.opacity = '0';
            if (rightEl) rightEl.style.opacity = '0';
            round++;
            callbacks.onProgress(round / totalRounds);
            timer = setTimeout(() => { if (!stopped && !paused) nextRound(); }, 400);
        }, expTime);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'peripheral', rounds: round, time: secondsElapsed });
    }

    nextRound();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; nextRound(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 10. DISAPPEARING TEXT
// ========================================
window.ExerciseRunners['disappearing'] = function(area, config, callbacks) {
    const ppm = parseInt(config['dis-speed'] || '250');
    const text = getGospelText('juan');
    const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 120);
    const msPerWord = Math.round((60 / ppm) * 1000);
    const fadeDelay = msPerWord * 6; // word stays visible for 6 words' worth

    let wordIndex = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;
    let wordEls = [];

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:12px;padding:10px;">
                <div style="font-size:13px;color:var(--text-secondary);text-align:center;">Lee hacia adelante • Las palabras desaparecen • No puedes volver</div>
                <div id="dis-text" style="font-size:18px;line-height:2;padding:16px;background:var(--surface);border-radius:12px;min-height:280px;display:flex;flex-wrap:wrap;gap:4px;align-content:flex-start;"></div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="dis-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        const container = area.querySelector('#dis-text');
        wordEls = words.map((w, i) => {
            const span = document.createElement('span');
            span.textContent = w;
            span.style.cssText = 'transition:opacity 0.8s;display:inline-block;padding:0 2px;';
            container.appendChild(span);
            return span;
        });
    }

    function advance() {
        if (stopped || paused) return;
        if (wordIndex >= words.length) { finish(); return; }

        // Fade out old words (those more than 6 words behind)
        const fadeIdx = wordIndex - 7;
        if (fadeIdx >= 0 && wordEls[fadeIdx]) {
            wordEls[fadeIdx].style.opacity = '0';
        }
        // Highlight current
        if (wordEls[wordIndex]) {
            wordEls[wordIndex].style.color = 'var(--accent)';
            wordEls[wordIndex].style.fontWeight = '600';
            // Restore previous current
            if (wordIndex > 0 && wordEls[wordIndex - 1]) {
                wordEls[wordIndex - 1].style.color = 'var(--text)';
                wordEls[wordIndex - 1].style.fontWeight = 'normal';
            }
            wordEls[wordIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        const barEl = area.querySelector('#dis-bar');
        if (barEl) barEl.style.width = ((wordIndex / words.length) * 100) + '%';
        callbacks.onProgress(wordIndex / words.length);
        wordIndex++;
        timer = setTimeout(advance, msPerWord);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'disappearing', ppm, words: wordIndex, time: secondsElapsed });
    }

    render();
    advance();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; advance(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 11. CHUNKING PROGRESIVO
// ========================================
window.ExerciseRunners['chunking'] = function(area, config, callbacks) {
    let chunkSize = parseInt(config['ch-size'] || '2');
    const ppm = parseInt(config['ch-speed'] || '300');
    const text = getGospelText('juan');
    const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 150);

    // Build chunks with increasing size every 5 chunks
    const chunks = [];
    let i = 0;
    let localChunk = chunkSize;
    let chunksAtThisSize = 0;
    while (i < words.length) {
        chunks.push(words.slice(i, i + localChunk));
        i += localChunk;
        chunksAtThisSize++;
        if (chunksAtThisSize >= 5) {
            localChunk = Math.min(localChunk + 1, 6);
            chunksAtThisSize = 0;
        }
    }

    let chunkIndex = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    function msPerChunk(size) {
        return Math.round((size / ppm) * 60 * 1000);
    }

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:12px;padding:10px;align-items:center;">
                <div style="font-size:13px;color:var(--text-secondary);">Lee cada grupo resaltado como una UNIDAD</div>
                <div id="ch-chunk-size" style="font-size:14px;color:var(--accent);font-weight:600;">Grupo de ${chunkSize} palabras</div>
                <div id="ch-display" style="width:100%;min-height:80px;display:flex;align-items:center;justify-content:center;background:var(--surface);border-radius:16px;padding:20px;font-size:22px;font-weight:600;color:var(--accent);text-align:center;letter-spacing:2px;border:2px solid var(--border);transition:all 0.15s;"></div>
                <div id="ch-context" style="font-size:14px;color:var(--text-secondary);line-height:1.8;max-height:160px;overflow-y:auto;padding:8px;background:var(--bg);border-radius:8px;width:100%;"></div>
                <div style="display:flex;justify-content:space-between;width:100%;font-size:12px;color:var(--text-secondary);">
                    <span>Chunk <span id="ch-idx">0</span>/${chunks.length}</span>
                    <span id="ch-wpm-display">${ppm} PPM</span>
                </div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="ch-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        // Build context view (all text as spans)
        const contextEl = area.querySelector('#ch-context');
        let globalIdx = 0;
        chunks.forEach((chunk, ci) => {
            const chunkDiv = document.createElement('span');
            chunkDiv.id = 'ch-c-' + ci;
            chunkDiv.textContent = chunk.join(' ') + ' ';
            chunkDiv.style.cssText = 'transition:all 0.2s;border-radius:3px;padding:1px 2px;';
            contextEl.appendChild(chunkDiv);
        });
    }

    function advance() {
        if (stopped || paused) return;
        if (chunkIndex >= chunks.length) { finish(); return; }

        const chunk = chunks[chunkIndex];
        const displayEl = area.querySelector('#ch-display');
        const idxEl = area.querySelector('#ch-idx');
        const barEl = area.querySelector('#ch-bar');
        const sizeEl = area.querySelector('#ch-chunk-size');

        // Highlight in context
        area.querySelectorAll('[id^="ch-c-"]').forEach(el => {
            const ci = parseInt(el.id.split('-')[2]);
            if (ci < chunkIndex) {
                el.style.color = 'var(--text-secondary)';
                el.style.background = 'transparent';
                el.style.fontWeight = 'normal';
            } else if (ci === chunkIndex) {
                el.style.color = '#fff';
                el.style.background = 'var(--accent)';
                el.style.fontWeight = '700';
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                el.style.color = 'var(--text)';
                el.style.background = 'transparent';
            }
        });

        if (displayEl) displayEl.textContent = chunk.join('  ');
        if (idxEl) idxEl.textContent = chunkIndex + 1;
        if (barEl) barEl.style.width = ((chunkIndex / chunks.length) * 100) + '%';
        if (sizeEl) sizeEl.textContent = `Grupo de ${chunk.length} palabras`;

        callbacks.onProgress(chunkIndex / chunks.length);
        chunkIndex++;
        timer = setTimeout(advance, msPerChunk(chunk.length));
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'chunking', ppm, chunks: chunkIndex, time: secondsElapsed });
    }

    render();
    advance();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; advance(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 12. METRONOME
// ========================================
window.ExerciseRunners['metronome'] = function(area, config, callbacks) {
    let bpm = parseInt(config['met-bpm'] || '90');
    const text = getGospelText('lucas');
    const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 120);
    const wordsPerBeat = 2;

    let wordIndex = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;
    let beat = 0;
    let bpmBoostInterval = null;
    let wordEls = [];

    function msPerBeat() { return Math.round(60000 / bpm); }

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:14px;padding:10px;align-items:center;">
                <div style="display:flex;align-items:center;gap:16px;">
                    <div id="met-dot" style="width:28px;height:28px;background:var(--border);border-radius:50%;transition:background 0.05s,transform 0.05s;"></div>
                    <div style="font-size:18px;font-weight:700;color:var(--accent);"><span id="met-bpm">${bpm}</span> BPM</div>
                    <div id="met-beat-bar" style="display:flex;gap:3px;">
                        ${[0,1,2,3].map(i => `<div id="met-b-${i}" style="width:8px;height:8px;border-radius:50%;background:var(--border);transition:background 0.1s;"></div>`).join('')}
                    </div>
                </div>
                <div id="met-text" style="font-size:17px;line-height:2;max-height:280px;overflow-y:auto;padding:12px;background:var(--surface);border-radius:12px;width:100%;display:flex;flex-wrap:wrap;gap:3px;align-content:flex-start;"></div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="met-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        const container = area.querySelector('#met-text');
        wordEls = words.map((w, i) => {
            const span = document.createElement('span');
            span.textContent = w;
            span.style.cssText = 'padding:2px 4px;border-radius:4px;transition:all 0.1s;display:inline-block;';
            container.appendChild(span);
            return span;
        });
    }

    function pulse() {
        if (stopped || paused) return;

        // Visual metronome beat
        const dot = area.querySelector('#met-dot');
        if (dot) {
            dot.style.background = 'var(--accent)';
            dot.style.transform = 'scale(1.3)';
            setTimeout(() => {
                if (dot) { dot.style.background = 'var(--border)'; dot.style.transform = 'scale(1)'; }
            }, 120);
        }

        // Beat indicator
        const beatNum = beat % 4;
        for (let i = 0; i < 4; i++) {
            const bEl = area.querySelector(`#met-b-${i}`);
            if (bEl) bEl.style.background = i === beatNum ? 'var(--accent)' : 'var(--border)';
        }

        // Advance words
        const end = Math.min(wordIndex + wordsPerBeat, words.length);
        wordEls.forEach((el, i) => {
            if (i < wordIndex) {
                el.style.background = 'transparent';
                el.style.color = 'var(--text-secondary)';
                el.style.fontWeight = 'normal';
            } else if (i >= wordIndex && i < end) {
                el.style.background = 'var(--accent)';
                el.style.color = '#fff';
                el.style.fontWeight = '700';
                if (i === wordIndex) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                el.style.background = 'transparent';
                el.style.color = 'var(--text)';
                el.style.fontWeight = 'normal';
            }
        });

        const barEl = area.querySelector('#met-bar');
        if (barEl) barEl.style.width = ((wordIndex / words.length) * 100) + '%';
        callbacks.onProgress(wordIndex / words.length);

        wordIndex += wordsPerBeat;
        beat++;
        if (wordIndex >= words.length) { finish(); return; }

        // Gradually increase BPM every 10 beats
        if (beat % 10 === 0 && bpm < 200) {
            bpm = Math.min(200, bpm + 5);
            const bpmEl = area.querySelector('#met-bpm');
            if (bpmEl) bpmEl.textContent = bpm;
        }

        timer = setTimeout(pulse, msPerBeat());
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'metronome', bpm, words: wordIndex, time: secondsElapsed });
    }

    render();
    pulse();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; pulse(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 13. LETTER GRID
// ========================================
window.ExerciseRunners['letter-grid'] = function(area, config, callbacks) {
    const size = parseInt(config['lg-size'] || '5');
    const total = size * size;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const targetLetters = alphabet.slice(0, Math.min(total, 26)).split('');
    let current = 0;
    let startTime = Date.now();
    let stopped = false;
    let paused = false;
    let pauseStart = 0;
    let totalPaused = 0;
    let tickInterval = null;
    let secondsElapsed = 0;

    function buildGrid() {
        // Fill grid with target letters + random extras
        const needed = total;
        const gridLetters = targetLetters.slice();
        while (gridLetters.length < needed) {
            gridLetters.push(alphabet[Math.floor(Math.random() * 26)]);
        }
        return shuffle(gridLetters.slice(0, needed));
    }

    let gridLetters = buildGrid();

    function render() {
        const cellSize = size <= 4 ? 64 : size <= 5 ? 52 : 42;
        const fontSize = size <= 4 ? 24 : size <= 5 ? 20 : 16;
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:8px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:14px;color:var(--text-secondary);">Busca:</span>
                    <span id="lg-target" style="font-size:36px;font-weight:900;color:var(--accent);min-width:40px;text-align:center;">${targetLetters[current]}</span>
                    <span style="font-size:13px;color:var(--text-secondary);">(${current + 1}/${targetLetters.length})</span>
                </div>
                <div id="lg-timer" style="font-size:20px;font-weight:700;color:var(--accent);font-family:monospace;">0.0s</div>
                <div id="lg-grid" style="display:grid;grid-template-columns:repeat(${size},1fr);gap:5px;padding:10px;background:var(--surface);border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);"></div>
                <div id="lg-status" style="font-size:13px;color:var(--text-secondary);">Toca las letras en orden A→B→C...</div>
            </div>`;

        const grid = area.querySelector('#lg-grid');
        gridLetters.forEach((letter, i) => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.dataset.letter = letter;
            btn.dataset.idx = i;
            btn.style.cssText = `width:${cellSize}px;height:${cellSize}px;border-radius:8px;border:2px solid var(--border);background:var(--bg);color:var(--text);font-size:${fontSize}px;font-weight:700;cursor:pointer;transition:all 0.15s;`;
            btn.addEventListener('click', () => handleLetterClick(btn, letter));
            grid.appendChild(btn);
        });
    }

    function handleLetterClick(btn, letter) {
        if (paused || stopped) return;
        const targetLetter = targetLetters[current];
        if (letter === targetLetter) {
            btn.style.background = 'var(--success,#22c55e)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'transparent';
            btn.disabled = true;
            current++;
            const targetEl = area.querySelector('#lg-target');
            const statusEl = area.querySelector('#lg-status');
            if (targetEl) targetEl.textContent = current < targetLetters.length ? targetLetters[current] : '✓';
            if (statusEl) statusEl.textContent = `Encontradas: ${current}/${targetLetters.length}`;
            callbacks.onProgress(current / targetLetters.length);
            if (current >= targetLetters.length) { finish(); }
        } else {
            btn.style.background = '#ef4444';
            btn.style.color = '#fff';
            setTimeout(() => {
                if (!btn.disabled) { btn.style.background = ''; btn.style.color = ''; }
            }, 400);
        }
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        const elapsed = (Date.now() - startTime - totalPaused) / 1000;
        callbacks.onComplete({ exercise: 'letter-grid', time: Math.round(elapsed), gridSize: size, letters: current });
    }

    render();
    startTime = Date.now();
    tickInterval = setInterval(() => {
        if (paused || stopped) return;
        secondsElapsed++;
        callbacks.onTick(secondsElapsed);
        const elapsed = (Date.now() - startTime - totalPaused) / 1000;
        const timerEl = area.querySelector('#lg-timer');
        if (timerEl) timerEl.textContent = elapsed.toFixed(1) + 's';
    }, 1000);

    return {
        pause() { paused = true; pauseStart = Date.now(); },
        resume() { paused = false; totalPaused += Date.now() - pauseStart; },
        stop() { stopped = true; clearInterval(tickInterval); }
    };
};

// ========================================
// 14. EYE WARMUP
// ========================================
window.ExerciseRunners['eye-warmup'] = function(area, config, callbacks) {
    const phases = [
        { name: 'Horizontal', desc: 'Sigue el punto de izquierda a derecha', duration: 8000, type: 'horizontal' },
        { name: 'Vertical', desc: 'Sigue el punto de arriba a abajo', duration: 8000, type: 'vertical' },
        { name: 'Diagonal', desc: 'Sigue el punto en diagonal', duration: 8000, type: 'diagonal' },
        { name: 'Circular', desc: 'Sigue el punto en círculo', duration: 10000, type: 'circle' }
    ];

    let phaseIndex = 0;
    let stopped = false;
    let paused = false;
    let animFrame = null;
    let phaseTimer = null;
    let phaseStart = 0;
    let secondsElapsed = 0;
    let tickInterval = null;
    let pauseTime = 0;
    let totalPaused = 0;
    let pauseStart = 0;

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:10px;">
                <div style="display:flex;gap:6px;">
                    ${phases.map((p, i) => `<div id="ew-ph-${i}" style="padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;background:var(--border);color:var(--text-secondary);transition:all 0.3s;">${p.name}</div>`).join('')}
                </div>
                <div id="ew-desc" style="font-size:14px;color:var(--text-secondary);"></div>
                <div id="ew-arena" style="position:relative;width:100%;height:220px;background:var(--surface);border-radius:16px;overflow:hidden;">
                    <div id="ew-dot" style="position:absolute;width:20px;height:20px;background:var(--accent);border-radius:50%;transform:translate(-50%,-50%);transition:none;box-shadow:0 0 10px var(--accent);left:50%;top:50%;"></div>
                </div>
                <div id="ew-phase-bar-wrap" style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="ew-phase-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.1s;"></div>
                </div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="ew-bar" style="height:6px;border-radius:3px;background:var(--success,#22c55e);width:0%;transition:width 0.5s;"></div>
                </div>
            </div>`;
    }

    function startPhase(idx) {
        if (stopped || idx >= phases.length) { finish(); return; }
        phaseIndex = idx;
        const phase = phases[idx];
        phaseStart = Date.now();

        // Update UI
        phases.forEach((_, i) => {
            const el = area.querySelector(`#ew-ph-${i}`);
            if (el) {
                el.style.background = i < idx ? 'var(--success,#22c55e)' : i === idx ? 'var(--accent)' : 'var(--border)';
                el.style.color = i <= idx ? '#fff' : 'var(--text-secondary)';
            }
        });
        const descEl = area.querySelector('#ew-desc');
        if (descEl) descEl.textContent = phase.desc;

        // Start animation
        animate(phase);

        // Schedule next phase
        phaseTimer = setTimeout(() => {
            if (!stopped && !paused) startPhase(idx + 1);
        }, phase.duration);
    }

    function animate(phase) {
        if (stopped || paused) return;
        const dot = area.querySelector('#ew-dot');
        const arena = area.querySelector('#ew-arena');
        if (!dot || !arena) return;

        const w = arena.clientWidth;
        const h = arena.clientHeight;
        const now = Date.now() - phaseStart;
        const phaseDuration = phase.duration;
        const t = (now % phaseDuration) / phaseDuration;
        const angle = t * Math.PI * 2;
        const pct = now / phaseDuration;

        let x, y;
        const margin = 20;
        switch (phase.type) {
            case 'horizontal':
                x = margin + (w - margin * 2) * (0.5 + 0.5 * Math.sin(angle * 2));
                y = h / 2;
                break;
            case 'vertical':
                x = w / 2;
                y = margin + (h - margin * 2) * (0.5 + 0.5 * Math.sin(angle * 2));
                break;
            case 'diagonal':
                x = margin + (w - margin * 2) * (0.5 + 0.5 * Math.sin(angle * 2));
                y = margin + (h - margin * 2) * (0.5 + 0.5 * Math.cos(angle * 2));
                break;
            case 'circle':
                const rx = (w / 2 - margin);
                const ry = (h / 2 - margin);
                x = w / 2 + rx * Math.cos(angle * 2);
                y = h / 2 + ry * Math.sin(angle * 2);
                break;
            default:
                x = w / 2; y = h / 2;
        }

        dot.style.left = x + 'px';
        dot.style.top = y + 'px';

        // Update phase progress bar
        const phaseBarEl = area.querySelector('#ew-phase-bar');
        if (phaseBarEl) phaseBarEl.style.width = (pct * 100) + '%';

        // Update overall bar
        const barEl = area.querySelector('#ew-bar');
        const totalDuration = phases.reduce((s, p) => s + p.duration, 0);
        const elapsed = phases.slice(0, phaseIndex).reduce((s, p) => s + p.duration, 0) + now;
        if (barEl) barEl.style.width = Math.min(100, (elapsed / totalDuration) * 100) + '%';
        callbacks.onProgress(Math.min(1, elapsed / totalDuration));

        animFrame = requestAnimationFrame(() => animate(phase));
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        cancelAnimationFrame(animFrame);
        callbacks.onComplete({ exercise: 'eye-warmup', phases: phaseIndex + 1, time: secondsElapsed });
    }

    render();
    startPhase(0);
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() {
            paused = true;
            pauseStart = Date.now();
            clearTimeout(phaseTimer);
            cancelAnimationFrame(animFrame);
        },
        resume() {
            const pausedMs = Date.now() - pauseStart;
            phaseStart += pausedMs;
            paused = false;
            const phase = phases[phaseIndex];
            animate(phase);
            const remaining = phase.duration - (Date.now() - phaseStart);
            if (remaining > 0) {
                phaseTimer = setTimeout(() => { if (!stopped && !paused) startPhase(phaseIndex + 1); }, remaining);
            } else {
                startPhase(phaseIndex + 1);
            }
        },
        stop() {
            stopped = true;
            cancelAnimationFrame(animFrame);
            clearTimeout(phaseTimer);
            clearInterval(tickInterval);
        }
    };
};

// ========================================
// 15. COMPREHENSION
// ========================================
window.ExerciseRunners['comprehension'] = function(area, config, callbacks) {
    const expTime = parseInt(config['comp-time'] || '3000');
    const gospels = ['mateo', 'juan', 'marcos', 'lucas'];
    let round = 0;
    const maxRounds = 5;
    let score = 0;
    let stopped = false;
    let paused = false;
    let timer = null;
    let secondsElapsed = 0;
    let tickInterval = null;

    // Collect questions from ComprehensionData
    const allQs = [];
    if (window.ComprehensionData) {
        gospels.forEach(g => {
            const gData = window.ComprehensionData[g];
            if (gData) {
                Object.keys(gData).forEach(ch => {
                    gData[ch].forEach(q => {
                        allQs.push({ ...q, gospel: g, chapter: parseInt(ch) });
                    });
                });
            }
        });
    }
    // Fallback questions
    if (allQs.length === 0) {
        allQs.push(
            { question: '¿Cuánto amó Dios al mundo según Juan 3:16?', options: ['Un poco', 'Mucho', 'De tal manera', 'Con condiciones'], correct: 2, gospel: 'juan', chapter: 3 },
            { question: '¿Quién es el camino, la verdad y la vida?', options: ['Moisés', 'Juan', 'Jesús', 'Un ángel'], correct: 2, gospel: 'juan', chapter: 14 }
        );
    }
    const selectedQs = shuffle(allQs).slice(0, maxRounds);

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:16px;padding:10px;min-height:340px;">
                <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);">
                    <span>Ronda <span id="comp-round">0</span>/${maxRounds}</span>
                    <span>Aciertos: <span id="comp-score" style="color:var(--success,#22c55e);font-weight:700;">0</span>/${maxRounds}</span>
                </div>
                <div id="comp-verse-box" style="padding:16px;background:var(--surface);border-radius:12px;font-size:16px;line-height:1.7;min-height:120px;display:flex;align-items:center;justify-content:center;border:2px solid var(--accent);text-align:center;"></div>
                <div id="comp-question-box" style="display:none;flex-direction:column;gap:10px;">
                    <div id="comp-q" style="font-size:16px;font-weight:600;color:var(--text);line-height:1.5;"></div>
                    <div id="comp-opts" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"></div>
                    <div id="comp-fb" style="font-size:14px;min-height:20px;text-align:center;font-weight:600;"></div>
                </div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="comp-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;
    }

    function showRound() {
        if (stopped || paused || round >= maxRounds) {
            if (round >= maxRounds) finish();
            return;
        }

        const q = selectedQs[round];
        const verseBoxEl = area.querySelector('#comp-verse-box');
        const questionBoxEl = area.querySelector('#comp-question-box');
        const roundEl = area.querySelector('#comp-round');
        const barEl = area.querySelector('#comp-bar');

        if (roundEl) roundEl.textContent = round + 1;
        if (barEl) barEl.style.width = ((round / maxRounds) * 100) + '%';

        // Get verse text
        let verseText = '';
        try {
            const gData = window.GospelData[q.gospel];
            if (gData && gData.chapters[q.chapter]) {
                const verses = Object.values(gData.chapters[q.chapter].verses);
                verseText = verses.slice(0, 3).join(' ');
            }
        } catch(e) {}
        if (!verseText) verseText = 'Lee con atención este pasaje...';

        // Show verse
        if (verseBoxEl) {
            verseBoxEl.textContent = verseText;
            verseBoxEl.style.display = 'flex';
        }
        if (questionBoxEl) questionBoxEl.style.display = 'none';

        // Reduce time slightly each round
        const roundTime = Math.max(1000, expTime - round * 200);

        timer = setTimeout(() => {
            if (stopped || paused) return;
            // Hide verse, show question
            if (verseBoxEl) verseBoxEl.style.display = 'none';
            if (questionBoxEl) questionBoxEl.style.display = 'flex';

            const qEl = area.querySelector('#comp-q');
            const optsEl = area.querySelector('#comp-opts');
            const fbEl = area.querySelector('#comp-fb');
            if (qEl) qEl.textContent = q.question;
            if (fbEl) fbEl.textContent = '';
            if (optsEl) {
                optsEl.innerHTML = '';
                q.options.forEach((opt, i) => {
                    const btn = document.createElement('button');
                    btn.textContent = opt;
                    btn.style.cssText = 'padding:10px 8px;border-radius:8px;border:2px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;cursor:pointer;line-height:1.3;transition:all 0.2s;';
                    btn.addEventListener('click', () => handleAnswer(btn, i, q.correct, optsEl, fbEl));
                    optsEl.appendChild(btn);
                });
            }
        }, roundTime);
    }

    function handleAnswer(btn, chosen, correct, optsEl, fbEl) {
        if (stopped) return;
        optsEl.querySelectorAll('button').forEach(b => b.disabled = true);
        const scoreEl = area.querySelector('#comp-score');

        if (chosen === correct) {
            score++;
            btn.style.background = 'var(--success,#22c55e)';
            btn.style.color = '#fff';
            if (fbEl) { fbEl.textContent = '✓ ¡Correcto!'; fbEl.style.color = 'var(--success,#22c55e)'; }
        } else {
            btn.style.background = '#ef4444';
            btn.style.color = '#fff';
            optsEl.querySelectorAll('button').forEach((b, i) => {
                if (i === correct) { b.style.background = 'var(--success,#22c55e)'; b.style.color = '#fff'; }
            });
            if (fbEl) { fbEl.textContent = '✗ Respuesta incorrecta'; fbEl.style.color = '#ef4444'; }
        }
        if (scoreEl) scoreEl.textContent = score;
        round++;
        callbacks.onProgress(round / maxRounds);

        timer = setTimeout(() => { if (!stopped && !paused) showRound(); }, 1200);
    }

    function finish() {
        stopped = true;
        clearInterval(tickInterval);
        const pct = Math.round((score / maxRounds) * 100);
        callbacks.onComplete({ exercise: 'comprehension', rounds: maxRounds, score, accuracy: pct, time: secondsElapsed });
    }

    render();
    showRound();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() { paused = true; clearTimeout(timer); },
        resume() { paused = false; showRound(); },
        stop() { stopped = true; clearTimeout(timer); clearInterval(tickInterval); }
    };
};

// ========================================
// 16. ANTI-SUBVOCALIZATION
// ========================================
window.ExerciseRunners['subvocal'] = function(area, config, callbacks) {
    const text = getGospelText('lucas');
    const words = text.split(/\s+/).filter(w => w.length > 0).slice(0, 150);
    const ppm = 250;
    const msPerWord = Math.round((60 / ppm) * 1000);

    let wordIndex = 0;
    let countBeat = 0; // 0=1, 1=2, 2=3, 3=4
    let stopped = false;
    let paused = false;
    let wordTimer = null;
    let beatTimer = null;
    let secondsElapsed = 0;
    let tickInterval = null;
    let wordEls = [];

    const beatMs = 400; // 150bpm counting rhythm

    function render() {
        area.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:14px;padding:10px;align-items:center;">
                <div style="font-size:13px;color:var(--text-secondary);text-align:center;">Lee el texto • Cuenta en voz alta siguiendo los números</div>
                <div style="display:flex;gap:12px;align-items:center;">
                    ${[1,2,3,4].map(n => `<div id="sv-n-${n}" style="width:44px;height:44px;border-radius:50%;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:var(--text-secondary);transition:all 0.1s;">${n}</div>`).join('')}
                </div>
                <div id="sv-text" style="font-size:17px;line-height:2;max-height:280px;overflow-y:auto;padding:12px;background:var(--surface);border-radius:12px;width:100%;display:flex;flex-wrap:wrap;gap:3px;align-content:flex-start;"></div>
                <div style="font-size:12px;color:var(--text-secondary);">Cuenta: 1-2-3-4-1-2-3-4... mientras lees</div>
                <div style="width:100%;background:var(--border);height:6px;border-radius:3px;">
                    <div id="sv-bar" style="height:6px;border-radius:3px;background:var(--accent);width:0%;transition:width 0.3s;"></div>
                </div>
            </div>`;

        const container = area.querySelector('#sv-text');
        wordEls = words.map((w, i) => {
            const span = document.createElement('span');
            span.textContent = w;
            span.style.cssText = 'padding:2px 4px;border-radius:4px;transition:all 0.15s;display:inline-block;';
            container.appendChild(span);
            return span;
        });
    }

    function pulseBeat() {
        if (stopped || paused) return;
        const beatNum = countBeat % 4 + 1;
        for (let n = 1; n <= 4; n++) {
            const el = area.querySelector(`#sv-n-${n}`);
            if (el) {
                if (n === beatNum) {
                    el.style.borderColor = 'var(--accent)';
                    el.style.color = 'var(--accent)';
                    el.style.background = 'rgba(var(--accent-rgb,99,102,241),0.15)';
                    el.style.transform = 'scale(1.2)';
                } else {
                    el.style.borderColor = 'var(--border)';
                    el.style.color = 'var(--text-secondary)';
                    el.style.background = 'transparent';
                    el.style.transform = 'scale(1)';
                }
            }
        }
        countBeat++;
        beatTimer = setTimeout(pulseBeat, beatMs);
    }

    function advanceWord() {
        if (stopped || paused) return;
        if (wordIndex >= words.length) { finish(); return; }

        wordEls.forEach((el, i) => {
            if (i < wordIndex) {
                el.style.background = 'transparent';
                el.style.color = 'var(--text-secondary)';
                el.style.fontWeight = 'normal';
                el.style.opacity = '0.5';
            } else if (i === wordIndex) {
                el.style.background = 'var(--accent)';
                el.style.color = '#fff';
                el.style.fontWeight = '700';
                el.style.opacity = '1';
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                el.style.background = 'transparent';
                el.style.color = 'var(--text)';
                el.style.fontWeight = 'normal';
                el.style.opacity = '1';
            }
        });

        const barEl = area.querySelector('#sv-bar');
        if (barEl) barEl.style.width = ((wordIndex / words.length) * 100) + '%';
        callbacks.onProgress(wordIndex / words.length);
        wordIndex++;
        wordTimer = setTimeout(advanceWord, msPerWord);
    }

    function finish() {
        stopped = true;
        clearTimeout(beatTimer);
        clearInterval(tickInterval);
        callbacks.onComplete({ exercise: 'subvocal', words: wordIndex, time: secondsElapsed });
    }

    render();
    advanceWord();
    pulseBeat();
    tickInterval = setInterval(() => {
        if (!paused && !stopped) { secondsElapsed++; callbacks.onTick(secondsElapsed); }
    }, 1000);

    return {
        pause() {
            paused = true;
            clearTimeout(wordTimer);
            clearTimeout(beatTimer);
        },
        resume() {
            paused = false;
            advanceWord();
            pulseBeat();
        },
        stop() {
            stopped = true;
            clearTimeout(wordTimer);
            clearTimeout(beatTimer);
            clearInterval(tickInterval);
        }
    };
};

// ========================================
// Expose as window.Exercises
// ========================================
window.Exercises = {
    definitions: window.ExerciseDefinitions,
    runners: window.ExerciseRunners,

    /**
     * Run an exercise.
     * @param {string} id - Exercise id
     * @param {HTMLElement} area - Container element
     * @param {Object} config - Config values from user
     * @param {Object} callbacks - { onProgress, onComplete, onTick }
     * @returns {{ pause(), resume(), stop() }}
     */
    run(id, area, config, callbacks) {
        const runner = this.runners[id];
        if (!runner) {
            area.innerHTML = `<div style="padding:20px;color:#ef4444;">Ejercicio "${id}" no encontrado.</div>`;
            return { pause() {}, resume() {}, stop() {} };
        }
        const cb = {
            onProgress: callbacks.onProgress || (() => {}),
            onComplete: callbacks.onComplete || (() => {}),
            onTick: callbacks.onTick || (() => {})
        };
        return runner(area, config || {}, cb);
    },

    getDefinition(id) {
        return this.definitions[id] || null;
    },

    getAllIds() {
        return Object.keys(this.definitions);
    }
};

