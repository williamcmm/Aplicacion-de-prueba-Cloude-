// ========================================
// Storage - localStorage persistence
// ========================================
const Storage = {
    KEYS: { SETTINGS:'lv_s', PROGRESS:'lv_p', SESSIONS:'lv_ss', ACHIEVEMENTS:'lv_a' },
    defaults: {
        settings: { theme:'light', font:'Inter', fontSize:20, defaultSpeed:250, dailyGoal:10, gospel:'juan' },
        progress: { totalSessions:0, totalWords:0, totalTime:0, averageWpm:0, bestWpm:0, currentStreak:0, lastSessionDate:null, wpmHistory:[], level:'principiante' }
    },
    get(k) { try { const d=localStorage.getItem(k); return d?JSON.parse(d):null; } catch{ return null; } },
    set(k,v) { try { localStorage.setItem(k,JSON.stringify(v)); } catch{} },
    getSettings() { return {...this.defaults.settings,...(this.get(this.KEYS.SETTINGS)||{})}; },
    saveSettings(s) { this.set(this.KEYS.SETTINGS,s); },
    getProgress() { return {...this.defaults.progress,...(this.get(this.KEYS.PROGRESS)||{})}; },
    saveProgress(p) { this.set(this.KEYS.PROGRESS,p); },
    getSessions() { return this.get(this.KEYS.SESSIONS)||[]; },
    addSession(session) {
        const ss=this.getSessions();
        ss.unshift({...session,date:new Date().toISOString()});
        if(ss.length>100) ss.length=100;
        this.set(this.KEYS.SESSIONS,ss);
        const p=this.getProgress();
        p.totalSessions++;
        p.totalWords+=(session.words||0);
        p.totalTime+=(session.time||0);
        if(session.wpm){
            p.wpmHistory.push({date:new Date().toISOString(),wpm:session.wpm,exercise:session.exercise});
            if(p.wpmHistory.length>50) p.wpmHistory=p.wpmHistory.slice(-50);
            if(session.wpm>p.bestWpm) p.bestWpm=session.wpm;
            p.averageWpm=Math.round(p.wpmHistory.reduce((s,h)=>s+h.wpm,0)/p.wpmHistory.length);
        }
        const today=new Date().toDateString();
        const last=p.lastSessionDate?new Date(p.lastSessionDate).toDateString():null;
        if(last!==today){
            const y=new Date(); y.setDate(y.getDate()-1);
            p.currentStreak=(last===y.toDateString())?p.currentStreak+1:1;
        }
        p.lastSessionDate=new Date().toISOString();
        p.level=this.calculateLevel(p.averageWpm);
        this.saveProgress(p);
        return p;
    },
    calculateLevel(wpm) { if(wpm>=600)return'experto'; if(wpm>=400)return'avanzado'; if(wpm>=200)return'intermedio'; return'principiante'; },
    getLevelInfo(level) {
        const l={
            principiante:{name:'Principiante',min:0,max:200,color:'#22c55e'},
            intermedio:{name:'Intermedio',min:200,max:400,color:'#f59e0b'},
            avanzado:{name:'Avanzado',min:400,max:600,color:'#ec4899'},
            experto:{name:'Experto',min:600,max:1200,color:'#8b5cf6'}
        };
        return l[level]||l.principiante;
    },
    resetAll() { Object.values(this.KEYS).forEach(k=>localStorage.removeItem(k)); }
};
