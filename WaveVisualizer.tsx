/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BookOpen, User, HelpCircle, Sparkles, AlertCircle } from "lucide-react";

interface TabletInterpretation {
  literal: string;
  docente: string;
  estudiante: string;
  investigador: string;
}

interface RantuTablet {
  id: string;
  romanId: string;
  title: string;
  shortBrief: string;
  glyphs: string;
  color: string;
  detail: TabletInterpretation;
}

export default function TabletDecoder() {
  const [selectedTabletId, setSelectedTabletId] = useState<string>("tab_4");
  const [viewPerspective, setViewPerspective] = useState<"docente" | "estudiante" | "investigador">("docente");

  const TABLETS: RantuTablet[] = [
    {
      id: "tab_3",
      romanId: "III",
      title: "El Cuerpo sin Fronteras",
      shortBrief: "El momento en que el cuerpo físico deja de ser una frontera hermética.",
      glyphs: "ᛏ ᛉ ᚦ ᛘ ᛦ",
      color: "border-indigo-500/30 text-indigo-400 shadow-indigo-950/20",
      detail: {
        literal: "«Cuando la vibración trasciende la piel, el círculo es la única envoltura. Al retirarse, queda la estela que ampara el suelo.»",
        docente: "Úsala en el aula para dinámicas de integración corporal. Enseña a tus alumnos que el aprendizaje colaborativo no es competir, sino sintonizarse reduciendo el ego defensivo.",
        estudiante: "Representa el cansancio estructural acumulado que siente Valentina. Al integrarte en grupo, descansas parte de tu carga mental en el ritmo de tus compañeros.",
        investigador: "Mapea las dinámicas somáticas del aprendizaje enactivo contemporáneo y los principios de cognición distribuida en ecología de redes."
      }
    },
    {
      id: "tab_4",
      romanId: "IV",
      title: "La Distinción Ética",
      shortBrief: "El límite ético de recibir la información sagrada del Campo.",
      glyphs: "ᚦ ᛒ ᛦ ᛃ ᛘ",
      color: "border-yellow-500/30 text-yellow-400 shadow-yellow-950/20",
      detail: {
        literal: "«Saber lo que late en el otro es un don del Campo. Usarlo para hurgar sus sombras es levantar una deuda que se cobrará en tu propia sangre.»",
        docente: "Perfecto para impartir argumentación y debates de ética digital. Pregunta a tus alumnos: ¿Es lícito utilizar datos privados o vulnerabilidades ajenas para nuestro propio beneficio?",
        estudiante: "La regla de oro de Luana: 'Lo que sientes en tus compañeros no te pertenece'. Si intuyes que alguien está triste o asustado (como Nico), respeta su privacidad; no manipules su Campo.",
        investigador: "Un paralelo directo con los dilemas éticos de la IA y el big data: la asimetría cognitiva en la recolección de huellas de comportamiento sin consentimiento."
      }
    },
    {
      id: "tab_6",
      romanId: "VI",
      title: "El Recorrido del Círculo",
      shortBrief: "La práctica interna de viajar por el Campo sin desequilibrarse.",
      glyphs: "ᛦ ᚿ ᛃ ᛏ ᚬ",
      color: "border-cyan-500/30 text-cyan-400 shadow-cyan-950/20",
      detail: {
        literal: "«Viaja por las frecuencias de los hermanos. Atiende su llanto y gozo, pero mantén la quietud de tu propio centro. Quien se confunde pierde el ojo de piedra.»",
        docente: "Excelente en tutorías escolares sobre inteligencia emocional. Enseña empatía sin contagio emocional: cómo sostener a un compañero sin desmoronarse a uno mismo.",
        estudiante: "Entrenar la escucha profunda en clase. Acepta que tus amigos piensen o sientan diferente, logrando un 'ojo del rantu' donde florece la variedad.",
        investigador: "Representa el principio de subjetividad transmedia: la exploración del lore general articulado desde múltiples perspectivas polifónicas."
      }
    },
    {
      id: "tab_9",
      romanId: "IX",
      title: "El Peso de lo No Observado",
      shortBrief: "El gran riesgo de acumular poder cognitivo antes de integrarse.",
      glyphs: "ᛘ ᛏ ᛉ ᚦ ᛒ",
      color: "border-red-500/30 text-red-400 shadow-red-950/20",
      detail: {
        literal: "«Dar herramientas de fuego al infante que ignora su nombre es edificar su patíbulo. Develar el secreto antes del silencio engendra monstruos de soberbia.»",
        docente: "Apto para reflexionar en clase de Ciencia y Ética sobre las armas atómicas o el impacto de lanzar algoritmos de gran escala sin controles morales.",
        estudiante: "Aprender no es solo memorizar datos para sacar la nota más alta y presumir. Si no usas lo que sabes para mejorar tu vida y tu escuela, tu talento se vuelve inútil.",
        investigador: "Analiza el quiebre de la ecología de medios cuando se masifican interfaces que fomentan la adicción hiperestimulante de info, sin andamiaje madurativo."
      }
    },
    {
      id: "tab_11",
      romanId: "XI",
      title: "La Profecía de la Torsión",
      shortBrief: "La advertencia del quiebre originado desde adentro de la comunidad.",
      glyphs: "ᚬ ᛦ ᚦ ᛃ ᛘ",
      color: "border-purple-500/30 text-purple-400 shadow-purple-950/20",
      detail: {
        literal: "«El muro no caerá por arietes exteriores. Se agrietará desde el vientre cuando un hijo pretenda saberlo todo sin integrar su sombra.»",
        docente: "Te sirve para modelar la resolución de conflictos grupales y precaver dinámicas de bullying o asimetrías de poder entre grupos escolares dominantes.",
        estudiante: "La torsión de Küpü. Su dolor por la pérdida de su hijita se deformó en soberbia. No dejes que tus dolores se transformen en crueldad con el resto.",
        investigador: "Aborda el principio de continuidad transmedia: cómo la inclusión de la contradicción humana y el relato de sombra refuerzan la verosimilitud de mundos."
      }
    },
    {
      id: "tab_12",
      romanId: "XII",
      title: "La Biología Relegada (Epigenética)",
      shortBrief: "El sacrificio final de Wirün sembrando la frecuencia en el genoma.",
      glyphs: "ᛒ ᛏ ᛦ ᛘ ᚬ",
      color: "border-emerald-500/30 text-emerald-400 shadow-emerald-950/20",
      detail: {
        literal: "«La ceniza guarda el rescoldo vivo. Sembremos el fuego en los lazos de la sangre para que despierte en la simiente que vendrá quinientos veranos luego.»",
        docente: "Cruza Biología (Genética) y Ética. Debate cómo nuestras decisiones y estrés físico actual dejan marcas químicas en las células de herencia epigenética.",
        estudiante: "Conecta las épocas: de Wirün a Luana (La Pampa, 2026). Tu cuerpo carga con legados. La empatía profunda es una flor que tus antepasados plantaron de antemano.",
        investigador: "Mecanismo diegético clave que une las dos líneas temporales y valida la educación expandida como un archivo dinámico de memoria comunitaria biológica."
      }
    }
  ];

  const currentTablet = TABLETS.find(t => t.id === selectedTabletId) || TABLETS[1];

  return (
    <div id="tablet-decoder-component" className="bg-slate-950 border-2 border-slate-900 rounded-none p-5 text-slate-300 font-mono shadow-xl relative overflow-hidden">
      
      {/* Visual atmospheric corner light matching the prompt 'oscuridad con luz puntual' */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full filter blur-xl pointer-events-none" />

      {/* Main Grid: Tablet list vs Reading Stand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Slabs (Slit of Slabs to Select) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="border-b border-slate-800 pb-2 mb-2">
            <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <span>CÁMARA SUBTERRÁNEA</span>
            </h4>
            <p className="text-[9px] text-slate-600">Sintoniza las piedras del Rantu-Mapu</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {TABLETS.map((t) => {
              const isActive = t.id === selectedTabletId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTabletId(t.id)}
                  type="button"
                  className={`text-left p-3 border-2 rounded transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between h-20 ${
                    isActive
                      ? "border-yellow-500 bg-yellow-500/5 shadow-yellow-950/20"
                      : "border-slate-850 hover:border-slate-700 bg-slate-900/40"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-xxs font-bold tracking-widest ${isActive ? 'text-yellow-400' : 'text-slate-500'}`}>
                      TABLETA {t.romanId}
                    </span>
                    <span className="text-[10px] text-slate-600 opacity-80">{t.glyphs}</span>
                  </div>
                  <div className={`text-xs font-black ${isActive ? 'text-slate-100' : 'text-slate-400'} truncate`}>
                    {t.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Half: Reading Stand of Selected Tablet */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-900 p-4 lg:p-6 rounded-md relative flex flex-col justify-between">
          
          {/* Stone Tablet Emblem / Title Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
            <div>
              <div className="text-[10px] text-yellow-500 bg-yellow-500/5 px-2 py-0.5 border border-yellow-500/20 rounded-full inline-block font-extrabold uppercase tracking-widest">
                SINTONIZADA: RANTU-MAPU {currentTablet.romanId}
              </div>
              <h3 className="text-base font-black text-slate-100 mt-1">{currentTablet.title}</h3>
            </div>
            {/* Runes Display block */}
            <div className="text-xl tracking-widest bg-slate-950 px-3 py-1 border border-slate-800 rounded text-yellow-500/80 select-none">
              {currentTablet.glyphs}
            </div>
          </div>

          {/* Literal translation quote block using hand-writing like italic styling */}
          <div className="bg-slate-950 p-4 border-l-4 border-yellow-500 rounded shadow-md relative overflow-hidden mb-6">
            <span className="absolute -top-3 -left-1 text-[70px] text-yellow-500/5 font-serif select-none pointer-events-none">“</span>
            <div className="text-xs text-yellow-100 italic font-medium leading-relaxed tracking-wide select-all text-center">
              {currentTablet.detail.literal}
            </div>
          </div>

          {/* PERSPECTIVES SELECTOR (The core state variable interpreting stone depending on user grade) */}
          <div className="space-y-4">
            <div className="flex border-b border-slate-800">
              <button
                type="button"
                onClick={() => setViewPerspective("docente")}
                className={`py-2 px-3 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
                  viewPerspective === "docente"
                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <BookOpen className="h-3 w-3" />
                <span>Mirada Docente</span>
              </button>
              <button
                type="button"
                onClick={() => setViewPerspective("estudiante")}
                className={`py-2 px-3 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
                  viewPerspective === "estudiante"
                    ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <User className="h-3 w-3" />
                <span>Mirada Estudiante</span>
              </button>
              <button
                type="button"
                onClick={() => setViewPerspective("investigador")}
                className={`py-2 px-3 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
                  viewPerspective === "investigador"
                    ? "border-purple-500 text-purple-400 bg-purple-500/5"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <HelpCircle className="h-3 w-3" />
                <span>Mirada Académica</span>
              </button>
            </div>

            {/* Render interpreted text nicely in dynamic animated bubble card layout */}
            <div className="bg-slate-950/70 p-4 border border-slate-900 rounded justify-center flex flex-col min-h-[110px]">
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs leading-relaxed text-slate-300">
                  <span className="font-bold text-slate-100 uppercase block text-[10px] tracking-wider mb-1.5">
                    Revelación en Estado de {viewPerspective === "docente" ? "Docente Facilitador" : viewPerspective === "estudiante" ? "Estudiante Prosumidor" : "Investigador Teórico"}:
                  </span>
                  {currentTablet.detail[viewPerspective]}
                </div>
              </div>
            </div>
          </div>

          {/* Cautionary text alert at bottom relating to Kupü's danger */}
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
            <AlertCircle className="h-3.5 w-3.5 text-red-500/70 shrink-0" />
            <span>Frecuencia vigilada. Sintoniza cuidadosamente respetando los límites del Rantü. No causes Torsión.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
