import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Minus, Plus, X, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface FightTimerProps {
  onClose: () => void;
}

const BELT_TIMES: { [key: string]: number } = {
  'Branca': 5 * 60,
  'Azul': 6 * 60,
  'Roxa': 7 * 60,
  'Marrom': 8 * 60,
  'Preta': 10 * 60,
  'Custom': 10 * 60
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const FightTimer: React.FC<FightTimerProps> = ({ onClose }) => {
  const [belt, setBelt] = useState<string>('Preta');
  const [customTime, setCustomTime] = useState<number>(600);
  const [rounds, setRounds] = useState<number>(1);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [restTime, setRestTime] = useState<number>(60);
  const [hasRest, setHasRest] = useState<boolean>(true);
  const [isResting, setIsResting] = useState<boolean>(false);
  
  const [athleteColors, setAthleteColors] = useState({ athlete1: '#3b82f6', athlete2: '#ffffff' });
  
  const [time, setTime] = useState(BELT_TIMES[belt]);
  const [isActive, setIsActive] = useState(false);
  const [scores, setScores] = useState({
    athlete1: { points: 0, advantages: 0, penalties: 0 },
    athlete2: { points: 0, advantages: 0, penalties: 0 }
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Expressive audio functions
  const playSound = (type: 'beep' | 'start' | 'end') => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (type === 'beep') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch A5
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'start') {
      // Expressive start: Two rising tones (e.g., C5 to E5)
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'square';
      osc2.type = 'triangle';
      
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      
      osc2.frequency.setValueAtTime(523.25 * 1.01, audioCtx.currentTime); // Slightly detuned
      osc2.frequency.setValueAtTime(659.25 * 1.01, audioCtx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1);
      osc2.stop(audioCtx.currentTime + 1);
    } else if (type === 'end') {
      // Expressive end: Buzzer / Gong sound (multiple dissonant frequencies)
      const freqs = [300, 305, 450, 455];
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      
      freqs.forEach(f => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(f * 0.8, audioCtx.currentTime + 1.5);
        osc.connect(gain);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
      });
      
      gain.connect(audioCtx.destination);
    }
  };

  const resetScores = () => setScores({
    athlete1: { points: 0, advantages: 0, penalties: 0 },
    athlete2: { points: 0, advantages: 0, penalties: 0 }
  });

  useEffect(() => {
    if (belt === 'Custom') {
      setTime(customTime);
    } else {
      setTime(BELT_TIMES[belt]);
    }
  }, [belt, customTime]);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const nextTime = prev - 1;
          // Bipes de contagem regressiva (3, 2, 1)
          if (nextTime > 0 && nextTime <= 3) {
            playSound('beep');
          }
          // Alerta de fim
          if (nextTime === 0) {
            playSound('end');
          }
          return nextTime;
        });
      }, 1000);
    } else if (isActive && time === 0) {
      if (isResting) {
        setIsResting(false);
        setCurrentRound(prev => prev + 1);
        setTime(belt === 'Custom' ? customTime : BELT_TIMES[belt]);
        playSound('start'); // Alerta de início de round
      } else if (currentRound < rounds && hasRest) {
        setIsResting(true);
        setTime(restTime);
        playSound('end'); // Alerta de fim de round
      } else if (currentRound < rounds) {
        setCurrentRound(prev => prev + 1);
        setTime(belt === 'Custom' ? customTime : BELT_TIMES[belt]);
        playSound('start'); // Alerta de início de round
      } else {
        setIsActive(false);
      }
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, time, currentRound, rounds, belt, customTime, hasRest, isResting, restTime]);

  const toggleActive = () => {
    if (!isActive && time === (belt === 'Custom' ? customTime : BELT_TIMES[belt])) {
      playSound('start'); // Alerta de início de luta
    }
    setIsActive(!isActive);
  };

  const updateScore = (athlete: 'athlete1' | 'athlete2', field: 'points' | 'advantages' | 'penalties', delta: number) => {
    setScores(prev => ({
      ...prev,
      [athlete]: {
        ...prev[athlete],
        [field]: field === 'points' 
          ? Math.max(0, prev[athlete][field] + delta) 
          : Math.max(0, prev[athlete][field] + (delta > 0 ? 1 : -1))
      }
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 w-full max-w-5xl shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar flex flex-col">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">Cronômetro IBJJF</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-2 hover:bg-zinc-800 rounded-full transition-colors"><X /></button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6 bg-zinc-800/50 p-3 sm:p-4 rounded-2xl shrink-0">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Faixa/Tempo</label>
            <select value={belt} onChange={(e) => setBelt(e.target.value)} className="w-full bg-zinc-900 text-white rounded-lg p-2 text-sm border border-zinc-700 focus:border-emerald-500 outline-none transition-colors">
              {Object.keys(BELT_TIMES).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {belt === 'Custom' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Tempo (min)</label>
              <input type="number" value={customTime / 60} onChange={(e) => setCustomTime(parseInt(e.target.value) * 60)} className="w-full bg-zinc-900 text-white rounded-lg p-2 text-sm border border-zinc-700 focus:border-emerald-500 outline-none transition-colors" />
            </div>
          )}
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Rounds</label>
            <input type="number" min="1" value={rounds} onChange={(e) => setRounds(parseInt(e.target.value))} className="w-full bg-zinc-900 text-white rounded-lg p-2 text-sm border border-zinc-700 focus:border-emerald-500 outline-none transition-colors" />
          </div>
          <div className="flex flex-col justify-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasRest} onChange={(e) => setHasRest(e.target.checked)} className="rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-zinc-900" />
              <span className="text-[10px] uppercase font-bold text-zinc-400">Descanso</span>
            </label>
          </div>
          {hasRest && (
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Descanso (s)</label>
              <input type="number" value={restTime} onChange={(e) => setRestTime(parseInt(e.target.value))} className="w-full bg-zinc-900 text-white rounded-lg p-2 text-sm border border-zinc-700 focus:border-emerald-500 outline-none transition-colors" />
            </div>
          )}
        </div>

        <div className="text-center mb-6 shrink-0">
          <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">
            {isResting ? 'DESCANSANDO' : `Round ${currentRound} de ${rounds}`}
          </div>
          <div className="text-7xl sm:text-9xl font-mono font-black text-emerald-500 tabular-nums tracking-tighter leading-none">
            {formatTime(time)}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={toggleActive} className="p-4 sm:p-5 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
              {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button onClick={() => { setIsActive(false); setTime(belt === 'Custom' ? customTime : BELT_TIMES[belt]); setCurrentRound(1); resetScores(); }} className="p-4 sm:p-5 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-transform hover:scale-105 active:scale-95">
              <RotateCcw size={32} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-auto">
          {['athlete1', 'athlete2'].map((athlete, idx) => (
            <div key={athlete} className="bg-zinc-800/80 p-4 sm:p-6 rounded-2xl border-t-4 shadow-inner" style={{ borderColor: athleteColors[athlete as keyof typeof athleteColors] }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Atleta {idx + 1}</h3>
                <input type="color" value={athleteColors[athlete as keyof typeof athleteColors]} onChange={(e) => setAthleteColors(prev => ({ ...prev, [athlete]: e.target.value }))} className="w-8 h-8 rounded-full cursor-pointer border-2 border-zinc-700 p-0" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-black/30 p-3 rounded-xl">
                  <span className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Pontos</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => updateScore(athlete as any, 'points', -2)} className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-[10px] font-bold text-white transition-colors">-2</button>
                      <button onClick={() => updateScore(athlete as any, 'points', -3)} className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-[10px] font-bold text-white transition-colors">-3</button>
                      <button onClick={() => updateScore(athlete as any, 'points', -4)} className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-[10px] font-bold text-white transition-colors">-4</button>
                    </div>
                    <span className="text-4xl sm:text-5xl font-black text-white w-16 sm:w-20 text-center tabular-nums">{scores[athlete as any].points}</span>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => updateScore(athlete as any, 'points', 2)} className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded text-[10px] font-bold transition-colors">+2</button>
                      <button onClick={() => updateScore(athlete as any, 'points', 3)} className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded text-[10px] font-bold transition-colors">+3</button>
                      <button onClick={() => updateScore(athlete as any, 'points', 4)} className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded text-[10px] font-bold transition-colors">+4</button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {['advantages', 'penalties'].map(field => (
                    <div key={field} className="bg-black/30 p-3 rounded-xl flex flex-col items-center">
                      <span className="text-zinc-400 uppercase text-[10px] font-bold tracking-wider mb-2">{field === 'advantages' ? 'Vantagens' : 'Punições'}</span>
                      <div className="flex items-center gap-2 w-full justify-between">
                        <button onClick={() => updateScore(athlete as any, field as any, -1)} className="p-1.5 sm:p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white transition-colors"><Minus size={14} /></button>
                        <span className="text-2xl font-black text-white tabular-nums">{scores[athlete as any][field as any]}</span>
                        <button onClick={() => updateScore(athlete as any, field as any, 1)} className={`p-1.5 sm:p-2 rounded-lg text-white transition-colors ${field === 'advantages' ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/40' : 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/40'}`}><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

