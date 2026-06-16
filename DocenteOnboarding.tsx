/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Heart, Info, Star } from "lucide-react";

export default function BreathingPacer() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [secLeftInPhase, setSecLeftInPhase] = useState(5); // 5s inhale, 3s hold, 5s exhale, 3s rest
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [streak, setStreak] = useState(0);

  // Core 0.1 Hz coherence pacing variables
  const phaseDurations = {
    inhale: 5,
    hold: 2,
    exhale: 5,
    rest: 2
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
        setSecLeftInPhase((prev) => {
          if (prev <= 1) {
            // Transition to next breathing state
            setPhase((currentPhase) => {
              switch (currentPhase) {
                case "inhale":
                  setSecLeftInPhase(phaseDurations.hold);
                  return "hold";
                case "hold":
                  setSecLeftInPhase(phaseDurations.exhale);
                  return "exhale";
                case "exhale":
                  setSecLeftInPhase(phaseDurations.rest);
                  return "rest";
                case "rest":
                  setStreak((s) => s + 1);
                  setSecLeftInPhase(phaseDurations.inhale);
                  return "inhale";
                default:
                  setSecLeftInPhase(phaseDurations.inhale);
                  return "inhale";
              }
            });
            return 0; // Temp placeholder
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const resetSession = () => {
    setIsActive(false);
    setPhase("inhale");
    setSecLeftInPhase(5);
    setTotalSeconds(0);
    setStreak(0);
  };

  // Compute text instructions and color highlights
  const getPhaseInstruct = () => {
    switch (phase) {
      case "inhale":
        return {
          title: "INHALA SUAVEMENTE",
          subtitle: "Siente el aire entrar expandiendo tu pecho y mandíbula...",
          color: "text-cyan-400 border-cyan-500/30 shadow-cyan-950/40",
          scaleClass: "scale-140 bg-cyan-500/20 shadow-[0_0_35px_rgba(6,182,212,0.4)]",
          pacerLabel: "Expande"
        };
      case "hold":
        return {
          title: "SOPORTA / RETÉN",
          subtitle: "Mantén una ligera vibración interna en la columna solar...",
          color: "text-yellow-400 border-yellow-500/30 shadow-yellow-950/40",
          scaleClass: "scale-140 bg-yellow-500/35 shadow-[0_0_45px_rgba(234,179,8,0.5)] border-yellow-400/80 animate-pulse",
          pacerLabel: "Resuena"
        };
      case "exhale":
        return {
          title: "EXHALA DESPACIO",
          subtitle: "Suelta las tensiones musculares y de los ojos...",
          color: "text-emerald-400 border-emerald-500/30 shadow-emerald-950/40",
          scaleClass: "scale-95 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
          pacerLabel: "Libera"
        };
      case "rest":
        return {
          title: "RESPIRA EN SILENCIO",
          subtitle: "Siente la brasa de temperatura templada en el hueso...",
          color: "text-slate-400 border-slate-700 shadow-slate-900",
          scaleClass: "scale-90 bg-slate-900 border-slate-700",
          pacerLabel: "Vacío"
        };
    }
  };

  const { title, subtitle, color, scaleClass, pacerLabel } = getPhaseInstruct();

  // Draw Heart Rate simulation dots based on totalSeconds
  const calculateHRVHeartRate = () => {
    if (!isActive) return 72;
    // HRV should fluctuate up during inhale (sympathetic activation) and down on exhale (parasympathetic activation)
    if (phase === "inhale") return Math.round(75 + (totalSeconds % 5) * 2);
    if (phase === "exhale") return Math.round(84 - (totalSeconds % 5) * 3);
    return 70;
  };

  const simulatedBpm = calculateHRVHeartRate();

  return (
    <div className="bg-slate-950/90 border-2 border-slate-800 rounded-none p-5 text-slate-300 font-mono shadow-xl relative overflow-hidden">
      
      {/* Aesthetic Border Highlights */}
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-60" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 mb-6 gap-3">
        <div>
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2 tracking-wider">
            <Heart className="h-4 w-4 text-rose-500 animate-pulse" />
            <span>MÓDULO ERNESTO: INDUCTOR DE COHERENCIA</span>
          </h3>
          <p className="text-[10px] text-slate-500">Práctica somática cardio-cerebral escolar de 15 minutos</p>
        </div>
        
        {/* Statistics panels */}
        <div className="flex gap-4 text-xs">
          <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-center">
            <div className="text-[9px] text-slate-500 uppercase">Tiempo total</div>
            <div className="font-bold text-slate-200">
              {Math.floor(totalSeconds / 60)}m {totalSeconds % 60}s
            </div>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-center">
            <div className="text-[9px] text-slate-500 uppercase">Ciclos sintonizados</div>
            <div className="font-bold text-slate-200 text-emerald-400 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{streak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Circle Pacer vs Context Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Interactive Expanding Breathing Circle */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            
            {/* Visual background ripple rings */}
            <div className={`absolute inset-0 rounded-full border-2 border-slate-800 opacity-20 duration-[5s] transition-all transform ${isActive ? 'scale-125 animate-ping' : ''}`} />
            <div className="absolute w-36 h-36 rounded-full border border-slate-900 bg-slate-950" />
            
            {/* Primary animated breathing node */}
            <div
              className={`w-28 h-28 rounded-full border-2 border-slate-600 transition-all duration-[4.5s] ease-in-out flex flex-col items-center justify-center transform ${scaleClass}`}
              style={{ transitionDuration: `${phaseDurations[phase] * 1000}ms` }}
            >
              <div className="text-xxs text-slate-400 font-bold uppercase tracking-widest">{pacerLabel}</div>
              <div className="text-xl font-black text-slate-100 tracking-wider mt-0.5">
                {isActive ? `${secLeftInPhase}s` : "--"}
              </div>
            </div>

            {/* Simulated heart rate metric blinking on top corner of pacer */}
            {isActive && (
              <div className="absolute top-1 right-2 bg-slate-900/90 py-1 px-2 border border-slate-800 rounded-md text-[9px] text-rose-500 font-bold animate-pulse flex items-center gap-1">
                <Heart className="h-2 w-2 text-rose-500 fill-rose-500" />
                <span>{simulatedBpm} BPM</span>
              </div>
            )}
          </div>

          {/* Core Phase Instructions Text */}
          <div className="text-center mt-6 h-16">
            <h4 className={`text-base font-black tracking-widest border border-transparent p-1 px-3 ${color}`}>
              {isActive ? title : "COHERENCIA DESACTIVADA"}
            </h4>
            <p className="text-xxs text-slate-400 tracking-tight mt-1 max-w-[280px] mx-auto leading-normal">
              {isActive ? subtitle : "Haz clic en 'Frecuencia de Inicio' para sintonizar tu respiración."}
            </p>
          </div>
        </div>

        {/* Right: Informative content / Instructions */}
        <div className="flex flex-col gap-4 bg-slate-900/40 border border-slate-900 p-4 rounded-md">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="text-slate-100 font-bold block mb-1 uppercase tracking-wider">¿Por qué este ritmo?</strong>
              Sincronizamos un ciclo rítmico de <strong className="text-emerald-400 font-bold">12 segundos</strong> (0.1 Hz sinapsis). Esto estimula mecánicamente el tono vagal, alineando los barorreceptores cardíacos con los capilares respiratorios en un perfecto <strong className="text-slate-200">acoplamiento de fase</strong>.
            </div>
          </div>

          <div className="text-[10px] space-y-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />
              <span><strong>Inhala (5s)</strong>: Llena con suavidad por la fosa nasal sin forzar.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full" />
              <span><strong>Atrae (2s)</strong>: Mantén levemente prestando atención al cráneo mandibular.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" />
              <span><strong>Exhala (5s)</strong>: Vacía el aire lentamente entornando los labios con laxitud.</span>
            </div>
          </div>

          {/* Live Audio toggle buttons */}
          <div className="flex gap-3 justify-center pt-3 border-t border-slate-800/80 mt-2">
            {!isActive ? (
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-600 font-extrabold px-5 py-2 text-slate-950 text-xs tracking-wider transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-slate-950" />
                <span>FRECUENCIA DE INICIO</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-600 font-extrabold px-5 py-2 text-slate-950 text-xs tracking-wider transition cursor-pointer"
              >
                <Pause className="h-3.5 w-3.5 fill-slate-950" />
                <span>PAUSAR SESIÓN</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetSession}
              disabled={totalSeconds === 0}
              className="px-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 text-xs py-2 disabled:opacity-30 transition cursor-pointer"
              title="Resetear temporizador"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
