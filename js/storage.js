// ========================================
// Storage Manager - Persistencia con localStorage
// ========================================

const Storage = {
    KEYS: {
        SETTINGS: 'lv_settings',
        PROGRESS: 'lv_progress',
        SESSIONS: 'lv_sessions',
        ACHIEVEMENTS: 'lv_achievements',
        READ_CHAPTERS: 'lv_read_chapters'
    },

    defaults: {
        settings: {
            theme: 'light',
            font: 'Inter',
            fontSize: 20,
            defaultSpeed: 250,
            showVerse: true,
            sound: true,
            dailyGoal: 10,
            breakReminder: 20
        },
        progress: {
            totalSessions: 0,
            totalWords: 0,
            totalTime: 0, // in seconds
            averageWpm: 0,
            bestWpm: 0,
            currentStreak: 0,
            lastSessionDate: null,
            wpmHistory: [], // {date, wpm, exercise}
            level: 'principiante'
        }
    },

    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    getSettings() {
        return { ...this.defaults.settings, ...(this.get(this.KEYS.SETTINGS) || {}) };
    },

    saveSettings(settings) {
        this.set(this.KEYS.SETTINGS, settings);
    },

    getProgress() {
        return { ...this.defaults.progress, ...(this.get(this.KEYS.PROGRESS) || {}) };
    },

    saveProgress(progress) {
        this.set(this.KEYS.PROGRESS, progress);
    },

    getSessions() {
        return this.get(this.KEYS.SESSIONS) || [];
    },

    addSession(session) {
        const sessions = this.getSessions();
        sessions.unshift({
            ...session,
            date: new Date().toISOString()
        });
        // Keep last 100 sessions
        if (sessions.length > 100) sessions.length = 100;
        this.set(this.KEYS.SESSIONS, sessions);

        // Update progress
        const progress = this.getProgress();
        progress.totalSessions++;
        progress.totalWords += session.words || 0;
        progress.totalTime += session.time || 0;

        if (session.wpm) {
            progress.wpmHistory.push({
                date: new Date().toISOString(),
                wpm: session.wpm,
                exercise: session.exercise
            });
            if (progress.wpmHistory.length > 50) {
                progress.wpmHistory = progress.wpmHistory.slice(-50);
            }
            if (session.wpm > progress.bestWpm) {
                progress.bestWpm = session.wpm;
            }
            // Recalculate average
            const totalWpm = progress.wpmHistory.reduce((sum, h) => sum + h.wpm, 0);
            progress.averageWpm = Math.round(totalWpm / progress.wpmHistory.length);
        }

        // Update streak
        const today = new Date().toDateString();
        const lastDate = progress.lastSessionDate ? new Date(progress.lastSessionDate).toDateString() : null;
        if (lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate === yesterday.toDateString()) {
                progress.currentStreak++;
            } else if (lastDate !== today) {
                progress.currentStreak = 1;
            }
        }
        progress.lastSessionDate = new Date().toISOString();

        // Update level
        progress.level = this.calculateLevel(progress.averageWpm);

        this.saveProgress(progress);
        this.checkAchievements(progress);

        return progress;
    },

    calculateLevel(wpm) {
        if (wpm >= 600) return 'experto';
        if (wpm >= 400) return 'avanzado';
        if (wpm >= 200) return 'intermedio';
        return 'principiante';
    },

    getLevelInfo(level) {
        const levels = {
            principiante: { name: 'Principiante', min: 0, max: 200, next: 'Intermedio', color: '#22c55e' },
            intermedio: { name: 'Intermedio', min: 200, max: 400, next: 'Avanzado', color: '#f59e0b' },
            avanzado: { name: 'Avanzado', min: 400, max: 600, next: 'Experto', color: '#ec4899' },
            experto: { name: 'Experto', min: 600, max: 1200, next: 'Maestro', color: '#8b5cf6' }
        };
        return levels[level] || levels.principiante;
    },

    getReadChapters() {
        return this.get(this.KEYS.READ_CHAPTERS) || {};
    },

    markChapterRead(gospel, chapter) {
        const read = this.getReadChapters();
        if (!read[gospel]) read[gospel] = [];
        if (!read[gospel].includes(chapter)) {
            read[gospel].push(chapter);
        }
        this.set(this.KEYS.READ_CHAPTERS, read);
    },

    getAchievements() {
        return this.get(this.KEYS.ACHIEVEMENTS) || [];
    },

    checkAchievements(progress) {
        const earned = this.getAchievements();
        const allAchievements = [
            { id: 'first_session', name: 'Primer Paso', desc: 'Completa tu primera sesión', icon: '🌱', check: p => p.totalSessions >= 1 },
            { id: 'ten_sessions', name: 'Constante', desc: 'Completa 10 sesiones', icon: '💪', check: p => p.totalSessions >= 10 },
            { id: 'fifty_sessions', name: 'Dedicado', desc: 'Completa 50 sesiones', icon: '🏆', check: p => p.totalSessions >= 50 },
            { id: 'speed_200', name: 'Velocista', desc: 'Alcanza 200 PPM', icon: '🚀', check: p => p.bestWpm >= 200 },
            { id: 'speed_400', name: 'Supersónico', desc: 'Alcanza 400 PPM', icon: '⚡', check: p => p.bestWpm >= 400 },
            { id: 'speed_600', name: 'Rayo', desc: 'Alcanza 600 PPM', icon: '🌟', check: p => p.bestWpm >= 600 },
            { id: 'streak_3', name: 'Tres en Raya', desc: '3 días seguidos', icon: '🔥', check: p => p.currentStreak >= 3 },
            { id: 'streak_7', name: 'Semana Santa', desc: '7 días seguidos', icon: '📅', check: p => p.currentStreak >= 7 },
            { id: 'streak_30', name: 'Discípulo Fiel', desc: '30 días seguidos', icon: '👑', check: p => p.currentStreak >= 30 },
            { id: 'words_1000', name: 'Lector', desc: 'Lee 1,000 palabras', icon: '📖', check: p => p.totalWords >= 1000 },
            { id: 'words_10000', name: 'Erudito', desc: 'Lee 10,000 palabras', icon: '📚', check: p => p.totalWords >= 10000 },
            { id: 'time_60', name: 'Una Hora', desc: 'Entrena 60 minutos en total', icon: '⏰', check: p => p.totalTime >= 3600 }
        ];

        const earnedIds = earned.map(a => a.id);
        let newAchievements = [];

        for (const achievement of allAchievements) {
            if (!earnedIds.includes(achievement.id) && achievement.check(progress)) {
                newAchievements.push({
                    id: achievement.id,
                    date: new Date().toISOString()
                });
            }
        }

        if (newAchievements.length > 0) {
            this.set(this.KEYS.ACHIEVEMENTS, [...earned, ...newAchievements]);
        }

        return newAchievements;
    },

    getAllAchievementDefinitions() {
        return [
            { id: 'first_session', name: 'Primer Paso', desc: 'Completa tu primera sesión', icon: '🌱' },
            { id: 'ten_sessions', name: 'Constante', desc: 'Completa 10 sesiones', icon: '💪' },
            { id: 'fifty_sessions', name: 'Dedicado', desc: 'Completa 50 sesiones', icon: '🏆' },
            { id: 'speed_200', name: 'Velocista', desc: 'Alcanza 200 PPM', icon: '🚀' },
            { id: 'speed_400', name: 'Supersónico', desc: 'Alcanza 400 PPM', icon: '⚡' },
            { id: 'speed_600', name: 'Rayo', desc: 'Alcanza 600 PPM', icon: '🌟' },
            { id: 'streak_3', name: 'Tres en Raya', desc: '3 días seguidos', icon: '🔥' },
            { id: 'streak_7', name: 'Semana Santa', desc: '7 días seguidos', icon: '📅' },
            { id: 'streak_30', name: 'Discípulo Fiel', desc: '30 días seguidos', icon: '👑' },
            { id: 'words_1000', name: 'Lector', desc: 'Lee 1,000 palabras', icon: '📖' },
            { id: 'words_10000', name: 'Erudito', desc: 'Lee 10,000 palabras', icon: '📚' },
            { id: 'time_60', name: 'Una Hora', desc: 'Entrena 60 min total', icon: '⏰' }
        ];
    },

    resetAll() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    }
};
