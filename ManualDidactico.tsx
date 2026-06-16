/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Sliders, Activity, Zap, RefreshCw, Sparkles } from "lucide-react";

export default function WaveVisualizer() {
  const [resonance, setResonance] = useState(60);     // Wave amplitude
  const [frequency, setFrequency] = useState(40);     // Wave speed / count
  const [instability, setInstability] = useState(25); // Wave distortion (sombra)
  const [time, setTime] = useState(0);

  const requestRef = useRef<number | null>(null);

  // Animation Loop for real-time wave movement
  useEffect(() => {
    const animate = () => {
      setTime((prevTime) => prevTime + 0.08);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Compute Group Coherence score based on slider positions
  // Coherence is optimal when resonance is high (70-95), frequency is harmonious (45-65), instability is very low (0-15)
  const calculateCoherenceAndEyeState = () => {
    const rDist = Math.max(0, 80 - resonance); // optimal around 80
    const fDist = Math.max(0, 55 - frequency); // optimal around 55
    const iFactor = instability * 1.5;         // lower is better
    const score = Math.max(0, Math.min(100, Math.round(100 - (rDist * 0.4 + fDist * 0.4 + iFactor))));
    
    // "Ojo del Rantu" state achieved when Coherence > 85
    return {
      score,
      isEyeAchieved: score >= 82
    };
  };

  const { score, isEyeAchieved } = calculateCoherenceAndEyeState();

  // Generate SVG path points for "Frecuencia Kalhué" (spectrogram layout)
  const generateSineWavePath = (width: number, height: number, phaseShift: number, amplitudeMultiplier: number, waveCount: number, noiseFactor: number) => {
    const points = [];
    const amp = (resonance / 100) * (height / 3.2) * amplitudeMultiplier;
    const waveFreq = (frequency / 100) * waveCount + 0.01;

    for (let x = 0; x <= width; x += 3) {
      // Harmonic wave superposition + noise chaos
      const baseAngle = (x / width) * Math.PI * 2 * waveFreq + time + phaseShift;
      let sineVal = Math.sin(baseAngle);
      
      // Adding secondary higher frequency wave
      sineVal += Math.sin(baseAngle * 1.8 - time * 0.6) * 0.35;
      
      // Adding noise/shadow instability
      if (noiseFactor > 0) {
        const noise = Math.sin(baseAngle * 5.5 + time * 2) * (noiseFactor / 100) * 18;
        sineVal += noise / 25;
      }
      
      const y = height / 2 + sineVal * amp;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  return (
    <div id="freq-visualizer-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1 border-4 border-slate-900 bg-slate-950/90 rounded-none shadow-2xl relative overflow-hidden font-mono text-slate-300">
      
      {/* Decorative Anime panel headers */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-cyan-500 z-10Opacity" />
      
      {/* Left 2 Cols: Main Visualizer Screen (The Dual Monitor Spectrogram) */}
      <div className="lg:col-span-2 flex flex-col gap-4 border-r-2 border-slate-800 p-2 lg:p-4">
        
        {/* Upper Screen: Frecuencia Kalhué Spectrogram (Glowing Blue/Cyan) */}
        <div id="screen-frecuencia" className="relative h-44 bg-slate-950 border-2 border-cyan-500/30 rounded-lg p-2 overflow-hidden shadow-inner flex flex-col justify-between">
          <div className="absolute top-2 left-3 flex items-center justify-between w-full pr-6 z-10 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-400 font-bold tracking-widest uppercase">FRECUENCIA KALHUÉ</span>
            </div>
            <div className="text-cyan-600/60 hidden sm:block">2026_CAMP_ACTIVE // RATIO_SISM0</div>
          </div>
          
          {/* Wave Grid Canvas representing Spectrogram */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-cyan-400 border-dashed" />
            ))}
          </div>

          <svg className="w-full h-full absolute inset-0 text-cyan-500" preserveAspectRatio="none">
            {/* Primary waveform with nice shadow glow */}
            <path
              d={generateSineWavePath(500, 180, 0, 1.0, 3.5, instability)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] filter opacity-90 transition-all duration-300"
            />
            {/* Secondary offset waveform to match full spectrum depth of the anime image */}
            <path
              d={generateSineWavePath(500, 180, Math.PI / 2, 0.75, 4.2, instability)}
              fill="none"
              stroke="#0891b2"
              strokeWidth="1.5"
              className="opacity-60 transition-all duration-300"
              strokeDasharray="4 2"
            />
            {/* Sub-harmonic frequency line */}
            <path
              d={generateSineWavePath(500, 180, -Math.PI / 4, 1.2, 2.0, instability * 1.5)}
              fill="none"
              stroke="#0e7490"
              strokeWidth="1.0"
              className="opacity-40 transition-all duration-300"
            />
          </svg>
          
          <div className="mt-auto flex justify-between text-[8px] text-cyan-500/70 select-none z-10">
            <span>0.00 Hz</span>
            <span>0.5s</span>
            <span>1.0s</span>
            <span>2.5s</span>
            <span>4.0 Hz (Rantü)</span>
          </div>
        </div>

        {/* Lower Screen: Visual Waveform Grid (The Sismological / Brain Coherence wave in neon green/teal) */}
        <div id="screen-visual" className="relative h-44 bg-slate-950 border-2 border-emerald-500/30 rounded-lg p-2 overflow-hidden shadow-inner flex flex-col justify-between">
          <div className="absolute top-2 left-3 flex items-center justify-between w-full pr-6 z-10 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-bold tracking-widest uppercase">MONITOR COHERENCIA CARDIO-CEREBRAL</span>
            </div>
            <div className="text-emerald-600/60 hidden sm:block">STATUS: {score >= 82 ? "RESONANTE" : score >= 50 ? "STABLE" : "COMPRESO"}</div>
          </div>

          <svg className="w-full h-full absolute inset-0 text-emerald-400" preserveAspectRatio="none">
            {/* Fine gridlines to replicate high-tech look */}
            <g className="opacity-15">
              {[...Array(12)].map((_, i) => (
                <line key={i} x1={(i * 500) / 11} y1="0" x2={(i * 500) / 11} y2="180" stroke="#10b981" strokeWidth="0.5" />
              ))}
            </g>
            
            {/* Primary Coherence Path */}
            <path
              d={generateSineWavePath(500, 180, time * 0.2, 0.85, 2.5, instability * 0.4)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] filter opacity-85"
            />
            {/* Ideal Harmonics layer (where standard should match) */}
            <path
              d={generateSineWavePath(500, 180, -time * 0.1, 0.5, 3.0, 0)}
              fill="none"
              stroke="#047857"
              strokeWidth="1"
              className="opacity-30"
            />
          </svg>

          <div className="mt-auto flex justify-between text-[8px] text-emerald-500/70 select-none z-10">
            <span>SISTEMAS CARDÍACOS OK</span>
            <span>VFC INDUCCIÓN CONCIENTE</span>
            <span>100% ARMÓNICO</span>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Wave Controllers & Coherence Level Info */}
      <div className="flex flex-col gap-5 justify-between p-2">
        <div>
          {/* Score Indicator */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center relative overflow-hidden">
            {isEyeAchieved && (
              <div className="absolute inset-0 bg-yellow-500/5 animate-pulse pointer-events-none" />
            )}
            
            <div className="text-xs text-slate-400 uppercase tracking-widest">Nivel de Coherencia de Campo</div>
            <div className="text-5xl font-black my-1 text-slate-100 flex items-center justify-center gap-1">
              <span className={score >= 82 ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" : score >= 50 ? "text-emerald-400" : "text-red-400"}>
                {score}%
              </span>
            </div>

            <div className="text-[10px] text-slate-500 tracking-tight mt-1">
              Objetivo: {">"}82% para sintonizar el <strong className="text-yellow-500 font-bold">Ojo del Rantü</strong>.
            </div>
          </div>
          
          {/* Tonal feedback text based on Coherence Score */}
          <div className="mt-3 text-xs bg-slate-950 p-3 border border-slate-900 leading-relaxed min-h-[64px] rounded-lg">
            {isEyeAchieved ? (
              <p className="text-yellow-400 font-normal">
                ✨ <strong>¡OJO DEL RANTÜ DETECTADO!</strong> Las partes del círculo cooperan en perfecta sincronía. Se ha disuelto la frontera del cuerpo y la sabiduría fluye colectivamente sin fricciones.
              </p>
            ) : score >= 55 ? (
              <p className="text-emerald-400">
                ✔️ <strong>Campo Estable:</strong> Vibración grupal armónica. Los estudiantes coordinan actividades e incrementan su condición de prosumidores. Sigue bajando la inestabilidad.
              </p>
            ) : (
              <p className="text-red-400/90">
                ⚠️ <strong>Campo Compreso / Torsional:</strong> La inestabilidad es elevada o la frecuencia no está en sintonía. Al igual que a Küpü, el ruido de las tensiones bloquea la escucha profunda.
              </p>
            )}
          </div>
        </div>

        {/* Action Controls Sliders */}
        <div className="flex flex-col gap-4">
          <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest border-b border-slate-800 pb-1.5">
            <Sliders className="h-3 w-3 text-cyan-400" />
            <span>Controles del Círculo</span>
          </div>

          {/* Resonance / Amplitude Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-cyan-400">Amplitud / Activación (Resonancia)</span>
              <span className="text-cyan-600 font-bold">{resonance}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={resonance}
              onChange={(e) => setResonance(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Frequency / Cycle Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Afinamiento del Ritmo (Frecuencia)</span>
              <span className="text-emerald-600 font-bold">{frequency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Instability / Distortion Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-red-400">Sombra del Círculo (Inestabilidad)</span>
              <span className="text-red-500 font-bold">{instability}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={instability}
              onChange={(e) => setInstability(Number(e.target.value))}
              className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Quick harmonizer button */}
        <button
          onClick={() => {
            setResonance(80);
            setFrequency(55);
            setInstability(5);
          }}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-900 border border-slate-700 hover:border-yellow-500/70 text-slate-100 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
        >
          <Sparkles className="h-3 w.3 text-yellow-400 animate-pulse" />
          <span>Sintonización Armónica Perfecta</span>
        </button>
      </div>

    </div>
  );
}
