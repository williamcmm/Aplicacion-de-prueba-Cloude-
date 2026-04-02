// ========================================
// Exercise Engines
// ========================================

class ExerciseEngine {
    constructor(config) {
        this.type = config.type;
        this.text = config.text || '';
        this.words = this.text.split(/\s+/).filter(w => w.length > 0);
        this.wpm = config.wpm || 250;
        this.chunkSize = config.chunkSize || 3;
        this.fontSize = config.fontSize || 24;
        this.gospel = config.gospel || '';
        this.chapter = config.chapter || '';
        this.onProgress = config.onProgress || (() => {});
        this.onComplete = config.onComplete || (() => {});
        this.onWpmUpdate = config.onWpmUpdate || (() => {});

        this.currentIndex = 0;
        this.isPaused = false;
        this.isRunning = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.pauseStart = null;
        this.timer = null;
    }

    getInterval() {
        return (60 / this.wpm) * 1000; // ms per word
    }

    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.currentIndex = 0;
        this.run();
    }

    pause() {
        if (this.isPaused) {
            this.isPaused = false;
            this.pausedTime += Date.now() - this.pauseStart;
            this.run();
        } else {
            this.isPaused = true;
            this.pauseStart = Date.now();
            clearTimeout(this.timer);
        }
    }

    stop() {
        this.isRunning = false;
        clearTimeout(this.timer);
        return this.getResults();
    }

    adjustSpeed(delta) {
        this.wpm = Math.max(60, Math.min(1200, this.wpm + delta));
        this.onWpmUpdate(this.wpm);
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        let elapsed = Date.now() - this.startTime - this.pausedTime;
        if (this.isPaused) {
            elapsed -= (Date.now() - this.pauseStart);
        }
        return elapsed / 1000; // in seconds
    }

    getResults() {
        const elapsed = this.getElapsedTime();
        const wordsRead = this.currentIndex;
        const effectiveWpm = elapsed > 0 ? Math.round((wordsRead / elapsed) * 60) : 0;

        return {
            exercise: this.type,
            wpm: effectiveWpm || this.wpm,
            words: wordsRead,
            time: Math.round(elapsed),
            gospel: this.gospel,
            chapter: this.chapter
        };
    }

    complete() {
        this.isRunning = false;
        clearTimeout(this.timer);
        const results = this.getResults();
        this.onComplete(results);
    }

    run() {
        // Override in subclasses
    }
}

// ========================================
// RSVP Exercise
// ========================================
class RSVPExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'rsvp' });
        this.wordEl = document.getElementById('rsvp-word');
        this.contextEl = document.getElementById('rsvp-context');
    }

    run() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentIndex >= this.words.length) {
            this.complete();
            return;
        }

        const word = this.words[this.currentIndex];
        this.wordEl.textContent = word;
        this.wordEl.style.fontSize = this.fontSize + 'px';

        // Show context (surrounding words)
        const start = Math.max(0, this.currentIndex - 3);
        const end = Math.min(this.words.length, this.currentIndex + 4);
        const context = this.words.slice(start, end).map((w, i) => {
            return i === (this.currentIndex - start) ? `<strong>${w}</strong>` : w;
        }).join(' ');
        this.contextEl.innerHTML = context;

        this.currentIndex++;
        this.onProgress(this.currentIndex / this.words.length);

        // Adjust timing for longer words
        let interval = this.getInterval();
        if (word.length > 8) interval *= 1.3;
        if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) interval *= 1.5;
        if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) interval *= 1.2;

        this.timer = setTimeout(() => this.run(), interval);
    }
}

// ========================================
// Chunked Reading Exercise
// ========================================
class ChunkedExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'chunked' });
        this.container = document.getElementById('chunked-text');
        this.wordElements = [];
    }

    start() {
        // Render all words as spans
        this.container.innerHTML = '';
        this.container.style.fontSize = this.fontSize + 'px';
        this.wordElements = this.words.map((word, i) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word + ' ';
            this.container.appendChild(span);
            return span;
        });

        super.start();
    }

    run() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentIndex >= this.words.length) {
            this.complete();
            return;
        }

        // Remove previous highlights
        this.wordElements.forEach(el => el.classList.remove('active'));

        // Highlight current chunk
        const end = Math.min(this.currentIndex + this.chunkSize, this.words.length);
        for (let i = this.currentIndex; i < end; i++) {
            this.wordElements[i].classList.add('active');
        }

        // Mark previous as read
        for (let i = 0; i < this.currentIndex; i++) {
            this.wordElements[i].classList.add('read');
        }

        // Scroll into view
        if (this.wordElements[this.currentIndex]) {
            this.wordElements[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        this.currentIndex += this.chunkSize;
        this.onProgress(this.currentIndex / this.words.length);

        const interval = this.getInterval() * this.chunkSize;
        this.timer = setTimeout(() => this.run(), interval);
    }
}

// ========================================
// Pacer Exercise
// ========================================
class PacerExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'pacer' });
        this.container = document.getElementById('pacer-text');
        this.lineElements = [];
        this.wordsPerLine = 10;
        this.currentLine = 0;
    }

    start() {
        this.container.innerHTML = '';
        this.container.style.fontSize = this.fontSize + 'px';

        // Split into lines
        const lines = [];
        for (let i = 0; i < this.words.length; i += this.wordsPerLine) {
            lines.push(this.words.slice(i, i + this.wordsPerLine).join(' '));
        }

        this.lineElements = lines.map(line => {
            const div = document.createElement('div');
            div.className = 'line';
            div.textContent = line;
            this.container.appendChild(div);
            return div;
        });

        this.currentLine = 0;
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.currentIndex = 0;
        this.run();
    }

    run() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentLine >= this.lineElements.length) {
            this.currentIndex = this.words.length;
            this.complete();
            return;
        }

        // Update line states
        this.lineElements.forEach((el, i) => {
            el.classList.remove('active');
            if (i < this.currentLine) el.classList.add('read');
        });
        this.lineElements[this.currentLine].classList.add('active');
        this.lineElements[this.currentLine].scrollIntoView({ behavior: 'smooth', block: 'center' });

        this.currentIndex = Math.min((this.currentLine + 1) * this.wordsPerLine, this.words.length);
        this.currentLine++;
        this.onProgress(this.currentLine / this.lineElements.length);

        const interval = this.getInterval() * this.wordsPerLine;
        this.timer = setTimeout(() => this.run(), interval);
    }
}

// ========================================
// Peripheral Vision Exercise
// ========================================
class PeripheralExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'peripheral' });
        this.leftEl = document.getElementById('peripheral-left');
        this.centerEl = document.getElementById('peripheral-center');
        this.rightEl = document.getElementById('peripheral-right');
        this.answerEl = document.getElementById('peripheral-answer');
        this.pairIndex = 0;
        this.pairs = this.generatePairs();
    }

    generatePairs() {
        const pairs = [];
        // Create word pairs from the text
        for (let i = 0; i < this.words.length - 1; i += 2) {
            pairs.push({
                left: this.words[i],
                right: this.words[i + 1] || ''
            });
        }
        // Limit to reasonable amount
        return pairs.slice(0, 50);
    }

    start() {
        this.pairIndex = 0;
        super.start();
    }

    run() {
        if (!this.isRunning || this.isPaused) return;

        if (this.pairIndex >= this.pairs.length) {
            this.currentIndex = this.pairIndex * 2;
            this.complete();
            return;
        }

        const pair = this.pairs[this.pairIndex];

        // Flash the words briefly
        this.leftEl.textContent = pair.left;
        this.rightEl.textContent = pair.right;
        this.leftEl.style.fontSize = this.fontSize + 'px';
        this.rightEl.style.fontSize = this.fontSize + 'px';
        this.answerEl.textContent = `Fija la vista en el punto central`;

        // After display time, hide words briefly
        setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
                this.leftEl.style.opacity = '0.3';
                this.rightEl.style.opacity = '0.3';
                setTimeout(() => {
                    this.leftEl.style.opacity = '1';
                    this.rightEl.style.opacity = '1';
                }, 200);
            }
        }, this.getInterval() * 1.5);

        this.pairIndex++;
        this.currentIndex = this.pairIndex * 2;
        this.onProgress(this.pairIndex / this.pairs.length);

        this.timer = setTimeout(() => this.run(), this.getInterval() * 2);
    }
}

// ========================================
// Schultz Table Exercise
// ========================================
class SchultzExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'schultz' });
        this.gridEl = document.getElementById('schultz-grid');
        this.nextEl = document.getElementById('schultz-next');
        this.timeEl = document.getElementById('schultz-time');
        this.gridSize = config.gridSize || 5;
        this.maxNumber = this.gridSize * this.gridSize;
        this.nextNumber = 1;
        this.timerInterval = null;
    }

    start() {
        this.nextNumber = 1;
        this.generateGrid();
        this.isRunning = true;
        this.startTime = Date.now();
        this.nextEl.textContent = '1';

        this.timerInterval = setInterval(() => {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.timeEl.textContent = elapsed.toFixed(1) + 's';
        }, 100);
    }

    generateGrid() {
        const numbers = Array.from({ length: this.maxNumber }, (_, i) => i + 1);
        // Shuffle
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        this.gridEl.innerHTML = '';
        this.gridEl.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

        numbers.forEach(num => {
            const cell = document.createElement('div');
            cell.className = 'schultz-cell';
            cell.textContent = num;
            cell.dataset.number = num;
            cell.addEventListener('click', () => this.handleCellClick(cell, num));
            this.gridEl.appendChild(cell);
        });
    }

    handleCellClick(cell, num) {
        if (!this.isRunning) return;

        if (num === this.nextNumber) {
            cell.classList.add('found');
            this.nextNumber++;
            this.nextEl.textContent = this.nextNumber;
            this.currentIndex = this.nextNumber - 1;
            this.onProgress(this.currentIndex / this.maxNumber);

            if (this.nextNumber > this.maxNumber) {
                clearInterval(this.timerInterval);
                this.complete();
            }
        } else {
            cell.classList.add('wrong');
            setTimeout(() => cell.classList.remove('wrong'), 300);
        }
    }

    stop() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        return this.getResults();
    }

    getResults() {
        const elapsed = this.getElapsedTime();
        return {
            exercise: 'schultz',
            wpm: 0,
            words: this.currentIndex,
            time: Math.round(elapsed),
            gospel: '',
            chapter: ''
        };
    }
}

// ========================================
// Disappearing Text Exercise
// ========================================
class DisappearingExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'disappearing' });
        this.container = document.getElementById('disappearing-text');
        this.wordElements = [];
        this.fadeDelay = config.fadeDelay || 3; // seconds before fading starts
    }

    start() {
        this.container.innerHTML = '';
        this.container.style.fontSize = this.fontSize + 'px';

        this.wordElements = this.words.map(word => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word + ' ';
            this.container.appendChild(span);
            return span;
        });

        this.currentIndex = 0;
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.run();
    }

    run() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentIndex >= this.words.length) {
            this.complete();
            return;
        }

        // Fade the current word
        if (this.wordElements[this.currentIndex]) {
            this.wordElements[this.currentIndex].classList.add('fading');
        }

        this.currentIndex++;
        this.onProgress(this.currentIndex / this.words.length);

        // Speed increases slightly over time for pressure
        const baseFade = (60 / this.wpm) * 1000 * this.fadeDelay;
        const speedUp = Math.max(0.5, 1 - (this.currentIndex / this.words.length) * 0.3);
        const interval = baseFade * speedUp;

        this.timer = setTimeout(() => this.run(), interval);
    }
}

// ========================================
// Comprehension Exercise
// ========================================
class ComprehensionExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'comprehension' });
        this.container = document.getElementById('comprehension-text');
        this.quizContainer = document.getElementById('comprehension-quiz');
        this.questionsEl = document.getElementById('quiz-questions');
        this.questions = config.questions || [];
        this.wordElements = [];
        this.readingComplete = false;
    }

    start() {
        this.container.innerHTML = '';
        this.container.style.fontSize = this.fontSize + 'px';
        this.quizContainer.classList.add('hidden');
        this.readingComplete = false;

        this.wordElements = this.words.map(word => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word + ' ';
            this.container.appendChild(span);
            return span;
        });

        this.currentIndex = 0;
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.run();
    }

    run() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentIndex >= this.words.length) {
            this.showQuiz();
            return;
        }

        // Highlight current chunk
        this.wordElements.forEach(el => el.classList.remove('active'));
        const end = Math.min(this.currentIndex + this.chunkSize, this.words.length);
        for (let i = this.currentIndex; i < end; i++) {
            this.wordElements[i].classList.add('active');
        }
        for (let i = 0; i < this.currentIndex; i++) {
            this.wordElements[i].classList.add('read');
        }

        if (this.wordElements[this.currentIndex]) {
            this.wordElements[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        this.currentIndex += this.chunkSize;
        this.onProgress(this.currentIndex / this.words.length * 0.7); // 70% for reading

        const interval = this.getInterval() * this.chunkSize;
        this.timer = setTimeout(() => this.run(), interval);
    }

    showQuiz() {
        this.readingComplete = true;
        this.container.style.display = 'none';
        this.quizContainer.classList.remove('hidden');

        this.questionsEl.innerHTML = '';
        if (this.questions.length === 0) {
            this.questionsEl.innerHTML = '<p>No hay preguntas disponibles para este capítulo. ¡Ejercicio completado!</p>';
            this.onProgress(1);
            setTimeout(() => this.complete(), 2000);
            return;
        }

        this.questions.forEach((q, qi) => {
            const div = document.createElement('div');
            div.className = 'quiz-question';
            div.innerHTML = `<p>${qi + 1}. ${q.question}</p>`;

            q.options.forEach((opt, oi) => {
                const label = document.createElement('label');
                label.className = 'quiz-option';
                label.innerHTML = `
                    <input type="radio" name="q${qi}" value="${oi}">
                    <span>${opt}</span>
                `;
                div.appendChild(label);
            });

            this.questionsEl.appendChild(div);
        });

        this.onProgress(0.8);
    }

    submitQuiz() {
        let correct = 0;
        this.questions.forEach((q, qi) => {
            const selected = document.querySelector(`input[name="q${qi}"]:checked`);
            const options = document.querySelectorAll(`input[name="q${qi}"]`);

            options.forEach((opt, oi) => {
                const label = opt.parentElement;
                if (oi === q.correct) {
                    label.classList.add('correct');
                }
                if (selected && parseInt(selected.value) === oi && oi !== q.correct) {
                    label.classList.add('incorrect');
                }
            });

            if (selected && parseInt(selected.value) === q.correct) {
                correct++;
            }
        });

        this.onProgress(1);
        const results = this.getResults();
        results.comprehension = Math.round((correct / this.questions.length) * 100);
        results.correctAnswers = correct;
        results.totalQuestions = this.questions.length;

        setTimeout(() => {
            this.isRunning = false;
            this.onComplete(results);
        }, 2000);

        return results;
    }
}

// ========================================
// Zigzag Reading Exercise
// ========================================
class ZigzagExercise extends ExerciseEngine {
    constructor(config) {
        super({ ...config, type: 'zigzag' });
        this.container = document.getElementById('zigzag-text');
        this.lineElements = [];
        this.wordsPerLine = 10;
        this.currentLine = 0;
        this.direction = 'left'; // alternates left/right
    }

    start() {
        this.container.innerHTML = '';
        this.container.style.fontSize = this.fontSize + 'px';

        const lines = [];
        for (let i = 0; i < this.words.length; i += this.wordsPerLine) {
            lines.push(this.words.slice(i, i + this.wordsPerLine).join(' '));
        }

        this.lineElements = lines.map(line => {
            const div = document.createElement('div');
            div.className = 'line';
            div.textContent = line;
            this.container.appendChild(div);
            return div;
        });

        this.currentLine = 0;
        this.direction = 'left';
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.currentIndex = 0;
        this.run();
    }

    run() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentLine >= this.lineElements.length) {
            this.currentIndex = this.words.length;
            this.complete();
            return;
        }

        this.lineElements.forEach(el => {
            el.classList.remove('highlight-left', 'highlight-right');
        });

        const cls = this.direction === 'left' ? 'highlight-left' : 'highlight-right';
        this.lineElements[this.currentLine].classList.add(cls);
        this.lineElements[this.currentLine].scrollIntoView({ behavior: 'smooth', block: 'center' });

        this.direction = this.direction === 'left' ? 'right' : 'left';
        this.currentIndex = Math.min((this.currentLine + 1) * this.wordsPerLine, this.words.length);
        this.currentLine++;
        this.onProgress(this.currentLine / this.lineElements.length);

        const interval = this.getInterval() * this.wordsPerLine;
        this.timer = setTimeout(() => this.run(), interval);
    }
}
