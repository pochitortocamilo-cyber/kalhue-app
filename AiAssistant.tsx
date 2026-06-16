/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FilePlus,
  Bot,
  Wrench,
  FolderHeart,
  Sparkles,
  Clock,
  Search,
  Share2,
  Workflow,
  HelpCircle,
  MapPin,
  Eye,
  Info,
  Layers,
  Award,
  BookMarked,
  Trash2
} from "lucide-react";

// Lore, data and subcomponents imports
import { CHARACTERS, GLOSSARY, TRANSMEDIA_FORMATS, EDUCATIONAL_TOOLBOX, MODEL_PROJECTS } from "./data";
import { SavedProject } from "./types";
import WaveVisualizer from "./components/WaveVisualizer";
import BreathingPacer from "./components/BreathingPacer";
import TabletDecoder from "./components/TabletDecoder";
import ProjectPlanner from "./components/ProjectPlanner";
import AiAssistant from "./components/AiAssistant";
import DocenteOnboarding from "./components/DocenteOnboarding";
import ManualDidactico from "./components/ManualDidactico";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("inicio");
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const stored = localStorage.getItem("kalhue_saved_projects");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read local saved projects:", e);
    }
    return MODEL_PROJECTS;
  });

  // Local glossary search and category filter
  const [glossarySearch, setGlossarySearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("todos");

  // Toolbox state
  const [appDifficulty, setAppDifficulty] = useState<string>("todos");
  const [appCategory, setAppCategory] = useState<string>("todos");

  // Save projects to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("kalhue_saved_projects", JSON.stringify(savedProjects));
  }, [savedProjects]);

  const handleProjectSaved = (newProj: SavedProject) => {
    setSavedProjects((prev) => [newProj, ...prev]);
  };

  const handleDeleteSavedProject = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este proyecto de tu dosier local?")) {
      setSavedProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Filter glossary concepts dynamically
  const filteredGlossary = GLOSSARY.filter((g) => {
    const srch = glossarySearch.toLowerCase();
    const matchesTerm = g.term.toLowerCase().includes(srch);
    const matchesDef = g.definition.toLowerCase().includes(srch);
    return matchesTerm || matchesDef;
  });

  return (
    <div id="master-app-root" className="min-h-screen bg-[#02080a] text-slate-100 flex flex-col md:flex-row relative">
      
      {/* Decorative bioluminescent sky grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#0c2a2d_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Persistent Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#031114] border-b md:border-b-0 md:border-r-2 border-slate-900 flex flex-col relative z-20 shrink-0">
        {/* Title logo with glows */}
        <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-[#06b6d4] tracking-widest font-black uppercase">Plataforma Educativa</span>
            <span className="font-sans font-black text-lg text-slate-100 tracking-tight flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              <span>LOS KALHUÉ</span>
            </span>
          </div>
          <div className="bg-[#041a1d] px-2 py-0.5 border border-cyan-500/20 rounded text-[9px] text-cyan-400 font-bold font-mono">
            V 2.6
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto uppercase font-mono text-[10px] tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("inicio")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "inicio" ? "bg-slate-900 text-cyan-400 font-bold border-l-2 border-cyan-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Inicio / Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("instructivo")}
            className={`w-full text-left py-2 px-3 flex items-start gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "instructivo" ? "bg-slate-900 text-yellow-400 font-bold border-l-2 border-yellow-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-yellow-500" />
            <div className="flex flex-col">
              <span>Instructivo</span>
              <span className="text-[7.5px] text-slate-500 lowercase font-normal tracking-wide normal-case mt-0.5">Te enseño a usar la app</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("universo")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "universo" ? "bg-slate-900 text-[#eab308] font-bold border-l-2 border-yellow-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>El Universo Lore</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("formatos")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "formatos" ? "bg-slate-900 text-cyan-400 font-bold border-l-2 border-cyan-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Mapeo Formatos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("glosario")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "glosario" ? "bg-slate-900 text-cyan-400 font-bold border-l-2 border-cyan-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <BookMarked className="h-4 w-4" />
            <span>Glosario Conceptos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("planificador")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "planificador" ? "bg-slate-900 text-emerald-400 font-bold border-l-2 border-emerald-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <FilePlus className="h-4 w-4" />
            <span>Diseñar Proyecto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("asistente")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "asistente" ? "bg-slate-900 text-yellow-400 font-bold border-l-2 border-yellow-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Asistente IA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("herramientas")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "herramientas" ? "bg-slate-900 text-cyan-400 font-bold border-l-2 border-cyan-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>Caja de herramientas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dosier")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "dosier" ? "bg-slate-900 text-emerald-400 font-bold border-l-2 border-emerald-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <FolderHeart className="h-4 w-4" />
            <span>Modo Docente ({savedProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("creditos")}
            className={`w-full text-left py-2.5 px-3 flex items-center gap-2.5 transition duration-150 rounded cursor-pointer ${
              activeTab === "creditos" ? "bg-slate-900 text-pink-400 font-bold border-l-2 border-pink-500" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Créditos</span>
          </button>
        </nav>

        {/* Active Session Status Footer inside Sidebar */}
        <div className="p-4 border-t border-slate-900 bg-[#020b0d] text-[9px] font-mono space-y-1 text-slate-500 select-none">
          <div className="flex justify-between items-center text-slate-400">
            <span>SESIÓN_USUARIO:</span>
            <span className="text-cyan-400 font-bold">ACTIVO</span>
          </div>
          <div className="flex justify-between">
            <span>La Pampa, ARG:</span>
            <span>2026_UTC</span>
          </div>
          <div className="flex justify-between text-[8px] text-slate-600 mt-0.5 pt-0.5 border-t border-slate-900/40">
            <span>Diseño Gral:</span>
            <span>Lautaro Pagnutti</span>
          </div>
          <div className="flex items-center justify-between text-[8px] text-[#06b6d4] mt-2 bg-[#0c2a2d]/30 p-1 rounded border border-[#06b6d4]/10">
            <span>● RES_DE_CAMPO: OPTIMAL</span>
          </div>
        </div>
      </aside>

      {/* Main content display view frame */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto relative z-10">

        {/* Global Dashboard Header status bar */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-4 gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
              <span className="font-mono text-cyan-500/80 text-sm">{activeTab.toUpperCase()} //</span>
              <span>
                {activeTab === "inicio" ? "PORTAL DE SINTONÍA MAESTRA" :
                 activeTab === "universo" ? "UNIVERSO COGNITIVO" :
                 activeTab === "formatos" ? "MAPEO DE FORMATOS TRANSMEDIA" :
                 activeTab === "glosario" ? "SABIDURÍA CONCEPTUAL" :
                 activeTab === "planificador" ? "DISEÑO TRANSMEDIA INTELIGENTE" :
                 activeTab === "asistente" ? "CONSULTOR SISMOLÓGICO IA" :
                 activeTab === "herramientas" ? "REPOSITORIO MULTI-MEDIOS" :
                 activeTab === "instructivo" ? "SABER EN ACCIÓN // MANUAL DIDÁCTICO" :
                 activeTab === "creditos" ? "EQUIPO DE TRABAJO // CRÉDITOS" :
                 "EXPEDIENTES & DOSIER DOCENTE"}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
              Los Kalhué • Educador Transmedia Coordinador — La Pampa
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-[#031114] border border-slate-800 py-1.5 px-3 flex items-center gap-2 rounded-lg text-slate-300">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Pampa, ARG</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 bg-[#031114] border border-slate-800 py-1.5 px-3 rounded-lg text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Frecuencia: Primera (Harmoniosa)</span>
            </div>
          </div>
        </header>

        {/* TAB 1: PORTAL / INICIO (The High Quality manga presentation) */}
        {activeTab === "inicio" && (
          <div className="space-y-8 animate-fade-in">
            {/* The Manga / Comic Grid Welcome Banner (Satisfies anime custom visual theme) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 border-4 border-slate-950 bg-slate-900/40 shadow-2xl overflow-hidden font-mono text-slate-300 relative">
              
              <div className="xl:col-span-8 p-6 flex flex-col justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xxs font-bold text-[#eab308] tracking-widest uppercase">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Transmedia Historytelling Real</span>
                  </div>
                  
                  <h2 className="text-lg md:text-xl font-black text-slate-50 tracking-tight leading-snug mb-3">
                    ...¡Si las estructuras musicales son planos, las tablas Rantu Mapu son las instrucciones de montaje!
                  </h2>
                  
                  {/* Comic Speech bubble representations simulating the anime character's inner thoughts */}
                  <div className="space-y-4 my-2.5">
                    <div className="relative bg-[#020c0f] p-3 rounded-xl border border-slate-800 rounded-tl-none max-w-[95%]">
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 bg-[#020c0f] border-t border-l border-slate-800" />
                      <p className="text-xxs text-cyan-400 leading-normal italic">
                        "(El ritmo sismológico que decodifiqué... ¡No son solo sonidos! ¡Son líneas de cimentación biológica sembradas bajo la Pampa para edificar algo para el futuro!)"
                      </p>
                      <span className="text-[8px] text-slate-500 block mt-1 text-right">— Luana (Mapeo contemporáneo 2026)</span>
                    </div>

                    <div className="relative bg-[#0d0901] p-3 rounded-xl border border-slate-850 rounded-tr-none max-w-[95%] ml-auto">
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rotate-45 bg-[#0d0901] border-t border-r border-[#0d0901]" />
                      <p className="text-xxs text-[#eab308] leading-normal italic">
                        "La resonancia kalhué no borra diferencias: articula frecuencias distintas, como una orquesta que toca en conjunto. Afina tu oído, educador."
                      </p>
                      <span className="text-[8px] text-slate-500 block mt-1 text-right">— Wirün (Mensaje tallado en Tableta IV)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900 flex flex-wrap gap-4 text-xxs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    <span>Lanzamiento: La Pampa, Argentina (2026)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Award className="h-3.5 w-3.5 text-yellow-500" />
                    <span>Novela: Guillermo René Schiavi Gon</span>
                  </div>
                </div>
              </div>

              {/* Sidebar decorative graphic of comic frame showing system values */}
              <div className="xl:col-span-4 bg-slate-950 p-6 border-t-2 xl:border-t-0 xl:border-l-2 border-slate-950 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-[#001417]/20 pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[8px] text-slate-500 tracking-widest uppercase font-black">Bitácora didáctica</span>
                  <h3 className="text-xs font-black text-slate-200 uppercase mt-0.5 border-b border-slate-850 pb-1 mb-2.5">
                    Laboratorio Escolar
                  </h3>
                  
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between py-1 border-b border-slate-900/60">
                      <span className="text-slate-400">Proyectos creados:</span>
                      <span className="text-slate-200 font-bold">{savedProjects.length} secuencia(s)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900/60">
                      <span className="text-slate-400">Líneas temporales:</span>
                      <span className="text-slate-200 font-bold">Ancestral / 2026</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900/60">
                      <span className="text-slate-400">Estilo visual:</span>
                      <span className="text-yellow-500 font-bold">Anime / Novela Gráfica</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Módulos integrados:</span>
                      <span className="text-cyan-400 font-bold">Asistente IA & Planner</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("planificador")}
                  type="button"
                  className="w-full mt-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xxs tracking-wider border border-slate-950 leading-relaxed transition cursor-pointer"
                >
                  DEVELAR PLANIFICACIÓN DE CLASE ▲
                </button>
              </div>

            </div>

            {/* Didactic onboarding guide for teachers explaining how to navigate the Kalhué projects easily */}
            <DocenteOnboarding onNavigate={setActiveTab} />

            {/* Core Oscilloscope / Spectrogram Wave visualizer (Simulating computer screen in image!) */}
            <div>
              <div className="flex justify-between items-center mb-2 font-mono">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span>Análisis de Señal Sismográfica (Frecuencia Sintonizada)</span>
                </span>
                <span className="text-[10px] text-slate-600 hidden md:inline">MONITOR_GRID_X: OK</span>
              </div>
              <WaveVisualizer />
            </div>

            {/* Ernesto Coherence Breathing inductor */}
            <div className="grid grid-cols-1 gap-6">
              <BreathingPacer />
            </div>
          </div>
        )}

        {/* TAB 2: EL UNIVERSO DE LORE & CHARACTER DECIPHER STONE */}
        {activeTab === "universo" && (
          <div className="space-y-8 animate-fade-in">
            {/* Introductory lore presentation card */}
            <div className="bg-[#031114] border border-slate-800 p-5 rounded-lg flex flex-col md:flex-row gap-5 items-center">
              <div className="text-3xl">🏜️</div>
              <div className="font-mono text-xs leading-relaxed">
                <h3 className="text-slate-100 font-semibold mb-1 text-sm uppercase tracking-wider">El Origen: El Aprendizaje de la Frecuencia</h3>
                El universo dramático creado por Guillermo René Schiavi Gon combina ciencia, historia y mitología regional. Opera en dos líneas temporales paralelas: el círculo original de los Kalhué que experimentó el quiebre y el sacrificio supremo de Wirün hace 500 años; y el aula contemporánea de Ernesto (La Pampa, 2026), donde Luana y sus compañeros despiertan de forma espontánea a la coherencia grupal. La epigenética es el eslabón biológico que une ambas eras.
              </div>
            </div>

            {/* Interactive stone tablet decoder component showing Runes decrypting depending on tab role */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1.5">
                  <Workflow className="h-4 w-4 text-yellow-500" />
                  <span>Descifrador Rantu-Mapu (Piedras Sagradas)</span>
                </span>
                <span className="text-[9px] text-[#eab308] hidden sm:inline">ALINEAR RITMOS PARA DEVELAR TEXTO</span>
              </div>
              <TabletDecoder />
            </div>

            {/* Characters profile listing */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase border-b border-slate-800 pb-2 mb-4">
                Perfiles Psicosociales & Personajes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {CHARACTERS.map((char) => (
                  <div key={char.id} className="bg-slate-900/35 border border-slate-900 rounded-md p-4 relative group">
                    <div
                      className="absolute top-0 bottom-0 left-0 w-1"
                      style={{ backgroundColor: char.color }}
                    />
                    <div className="flex gap-3.5 items-start">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: `${char.color}15`, border: `1px solid ${char.color}40` }}
                      >
                        {char.avatarEmoji}
                      </div>

                      <div className="text-xxs leading-relaxed font-mono">
                        <h4 className="text-xs font-black text-slate-100">{char.name}</h4>
                        <span className="text-[9px] font-bold block mb-2" style={{ color: char.color }}>
                          {char.tagline}
                        </span>
                        
                        <div className="space-y-1 text-slate-400 text-[10px]">
                          <div><strong>Arquetipo:</strong> <span className="text-slate-300">{char.archetype}</span></div>
                          <div className="pt-1.5 border-t border-slate-850 text-slate-400 leading-normal">{char.roleDescription}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSMEDIA FORMATS MAPEO */}
        {activeTab === "formatos" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#031114] border border-[#06b6d4]/10 p-5 rounded-lg flex flex-col md:flex-row gap-5 items-center mb-6">
              <div className="text-3xl text-cyan-400">📊</div>
              <div className="font-mono text-xs leading-relaxed text-slate-400">
                <h3 className="text-slate-100 font-semibold mb-1 text-sm uppercase tracking-wider">Mapeo de Formatos de Expansión Transmedia</h3>
                La narrativa transmedia designa que cada medio asume el rol para el cual está mejor estructurado sin duplicaciones redundantes. Tu aula es la nave nodriza; los estudiantes asumen la carga creativa produciendo podcasts, videoensayos, escape-rooms interactivos, reels de síntesis rápida, cómics secuenciales o narrativas ramificadas, permitiendo consolidar la inteligencia colectiva.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TRANSMEDIA_FORMATS.map((fmt) => (
                <div key={fmt.id} className="bg-slate-900/40 border border-slate-900 rounded-md p-5 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xxs font-extrabold px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase rounded">
                        Foco {fmt.complexity}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                        PROD: {fmt.duration}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-100">{fmt.name}</h4>
                    <p className="text-xxs text-slate-400 leading-relaxed border-l-2 border-[#06b6d4] pl-3.5">
                      {fmt.definition}
                    </p>

                    <div className="text-[10px] space-y-2 border-t border-slate-900 pt-3">
                      <div>
                        <strong className="text-slate-300">Potencial en Aula:</strong>
                        <span className="text-slate-400 block mt-0.5 leading-normal">{fmt.pedagogicalPotential}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xxs pt-2 border-t border-slate-900/60 mt-1">
                        <div>
                          <strong className="text-slate-300">Ventajas:</strong>
                          <span className="text-emerald-400 block mt-0.5 leading-normal">{fmt.advantages}</span>
                        </div>
                        <div>
                          <strong className="text-slate-300 font-bold">Limitaciones:</strong>
                          <span className="text-red-400/90 block mt-0.5 leading-normal">{fmt.limitations}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3.5 mt-5 text-[10px] flex flex-wrap gap-2">
                    <span className="text-slate-500 font-bold uppercase shrink-0 mt-0.5">Herramientas sugeridas:</span>
                    <div className="flex flex-wrap gap-1">
                      {fmt.recommendedTools.map((t, idx) => (
                        <span key={idx} className="bg-slate-950 px-1.5 py-0.5 text-[9px] text-[#06b6d4] rounded border border-slate-850">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GLOSARIO INTELIGENTE */}
        {activeTab === "glosario" && (
          <div className="space-y-6 animate-fade-in">
            {/* Search inputs */}
            <div className="bg-slate-950 p-4 border border-slate-900 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Buscar conceptos (ej. Prosumidor, Coherencia, Epigenética...)"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 outline-none rounded py-2 px-3 pl-10 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                Conceptos cargados: <strong>{GLOSSARY.length} términos teóricos</strong>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredGlossary.map((term) => (
                <div key={term.id} className="bg-slate-900/35 border border-slate-900 p-4 rounded flex flex-col justify-between h-48">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                      <span>{term.term}</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-normal line-clamp-4">
                      {term.definition}
                    </p>
                  </div>

                  <div className="border-t border-slate-900 pt-2 flex flex-wrap gap-1 items-center">
                    <span className="text-[8px] text-slate-600 uppercase font-black mr-1 select-none">Conecta:</span>
                    {term.relatedTerms.map((rt, idx) => (
                      <span key={idx} className="bg-slate-950 px-1.5 py-0.5 text-[8px] text-slate-400 rounded border border-slate-850">
                        {rt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {filteredGlossary.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 bg-slate-950 border border-slate-900">
                  ⚠️ No se encontraron términos relacionados con tu búsqueda. Prueba con otros conceptos del lore.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB INSTRUCTIVO: (Detailed Training Manual) */}
        {activeTab === "instructivo" && (
          <div className="animate-fade-in text-slate-300">
            <ManualDidactico onNavigate={setActiveTab} />
          </div>
        )}

        {/* TAB 5: INTEL PLANNER (Form, AI endpoint & sequence renderer) */}
        {activeTab === "planificador" && (
          <div className="animate-fade-in">
            <ProjectPlanner 
              onProjectSaved={handleProjectSaved} 
              savedProjects={savedProjects} 
              selectedProject={selectedProject}
              onClearSelectedProject={() => setSelectedProject(null)}
            />
          </div>
        )}

        {/* TAB 6: AI PEDAGOGICAL BOT ASSISTANT (WIRÜN/AMARU CHATBOARD) */}
        {activeTab === "asistente" && (
          <div className="animate-fade-in">
            <AiAssistant />
          </div>
        )}

        {/* TAB 7: CAJA DE HERRAMIENTAS (Suggested app directory categorised) */}
        {activeTab === "herramientas" && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter buttons */}
            <div className="bg-slate-950 p-4 border border-slate-900 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <span className="text-[9px] text-slate-500 uppercase font-bold shrink-0 mt-2.5">Dificultad:</span>
                <select
                  value={appDifficulty}
                  onChange={(e) => setAppDifficulty(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xxs py-1 px-2.5 rounded cursor-pointer outline-none"
                >
                  <option value="todos">Todos los niveles</option>
                  <option value="Fácil">Fácil (Rápida asimilación)</option>
                  <option value="Moderado">Moderado (Curva intermedia)</option>
                  <option value="Avanzado">Avanzado (Nivel superior)</option>
                </select>
              </div>

              <div className="text-[10px] text-[#06b6d4] font-semibold flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                <span>Utiliza estas herramientas para dar andamiaje práctico a los estudiantes (Ciro style)</span>
              </div>
            </div>

            {/* Toolbox list grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {EDUCATIONAL_TOOLBOX.filter(item => {
                if (appDifficulty !== "todos" && item.difficulty !== appDifficulty) return false;
                return true;
              }).map((item, idx) => (
                <div key={idx} className="bg-slate-900/35 border border-slate-900 rounded p-4 flex flex-col justify-between h-52">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xxs">
                      <span className="px-1.5 py-0.5 bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 rounded font-black uppercase">
                        {item.category.toUpperCase()}
                      </span>
                      <span className="text-slate-500 font-bold">DIFICULTAD: {item.difficulty}</span>
                    </div>

                    <h4 className="text-xs font-black text-slate-100">{item.name}</h4>
                    <p className="text-xxs text-slate-400 leading-normal line-clamp-3">
                      {item.description}
                    </p>

                    <div className="text-xxs text-slate-500 border-l border-slate-700 pl-2 leading-relaxed">
                      <strong>Uso en el Campo:</strong> {item.utility}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-xxs">
                    <span className="text-slate-600 block truncate max-w-[150px]">{item.url}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="text-cyan-400 hover:text-cyan-300 font-bold block flex items-center gap-1 transition-all"
                    >
                      <span>Web Oficial</span>
                      <Share2 className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: MODO DOCENTE (Dossier & projects history store locally) */}
        {activeTab === "dosier" && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-900 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">
                  Mi dosier local de planificaciones transmedia
                </h3>
                <p className="text-[10px] text-slate-500">
                  Administra, repasa o elimina las secuencias curriculares generadas para tus círculos escolares.
                </p>
              </div>

              <span className="bg-slate-900 border border-slate-800 text-xs px-3 py-1 rounded text-slate-300 uppercase">
                {savedProjects.length} Proyecto(s)
              </span>
            </div>

            {/* List of saved projects */}
            <div className="space-y-6">
              {savedProjects.map((p) => (
                <div key={p.id} className="bg-slate-950 border-2 border-slate-900 p-5 rounded relative overflow-hidden space-y-4">
                  
                  {/* Status header bar on card */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-900 pb-3 gap-2">
                    <div>
                      <div className="text-[9px] text-[#06b6d4] font-black uppercase tracking-wider bg-[#06b6d4]/5 border-cyan-500/20 rounded border px-2 py-0.5 inline-block select-none">
                        PROYECTO: {p.primaryFormat}
                      </div>
                      <h4 className="text-sm font-black text-slate-100 mt-1">{p.plan.proposalTitle}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Establecido el: {p.createdAt} • Asignatura: {p.subject} • Alumnos: {p.plan.sequence.length * 5 || "25"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProject(p);
                          setActiveTab("planificador");
                        }}
                        className="py-1 px-3 bg-slate-900 hover:bg-slate-850 text-xxs font-bold rounded text-slate-100 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                      >
                        ABRIR EN EL CO-PLANIFICADOR
                      </button>

                      {p.createdAt !== "Modelo Precargado" && (
                        <button
                          onClick={() => handleDeleteSavedProject(p.id)}
                          className="p-1.5 bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-950/40 rounded transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary parameters of saved item */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xxs leading-relaxed text-slate-400">
                    <div>
                      <strong className="text-slate-200 uppercase block text-[9px] tracking-wider mb-0.5">⚡ Disparador Mitológico:</strong>
                      <span>{p.plan.narrativeHook}</span>
                    </div>
                    <div>
                      <strong className="text-slate-200 uppercase block text-[9px] tracking-wider mb-0.5">🎯 Integración Didáctica:</strong>
                      <span>{p.plan.curriculumIntegration}</span>
                    </div>
                  </div>
                  
                  {/* Small sequence visual timeline overview */}
                  <div className="border-t border-slate-900/60 pt-3 text-xxs">
                    <strong className="text-slate-300 block uppercase text-[9px] mb-2 font-bold tracking-wider">Línea de fases secuenciales:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {p.plan.sequence.map((w, idx) => (
                        <div key={idx} className="bg-slate-900 p-2.5 rounded border border-slate-900 text-xxs">
                          <div className="font-black text-slate-300 mb-0.5">Fase {idx + 1}: {w.title.slice(0, 20)}...</div>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{w.studentActivities}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}

              {savedProjects.length === 0 && (
                <div className="p-12 text-center text-slate-500 bg-slate-950 border border-slate-900 rounded">
                  🎒 Tu portafolio docente está vacío. Ve al 'Diseñador de Proyectos' para emitir tu primera secuencia didáctica basándote en el Campo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: CRÉDITOS */}
        {activeTab === "creditos" && (
          <div className="space-y-6 animate-fade-in text-slate-300 font-mono">
            <div className="bg-gradient-to-r from-[#031c21] to-[#01090a] border-4 border-slate-950 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#06b6d4] text-slate-950 text-[9px] font-black tracking-widest px-3 py-1 uppercase border-b border-l border-slate-950">
                Oficial
              </div>
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 text-xxs font-extrabold text-[#06b6d4] uppercase tracking-widest mb-1 font-mono">
                  <Award className="h-4 w-4" />
                  <span>Créditos e Integrantes</span>
                </div>
                <h2 className="text-base md:text-lg font-black text-slate-50 tracking-tight leading-snug uppercase">
                  Convivencia en el aula. Gamificación y Narrativas Transmedia
                </h2>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-2">
                  Esta plataforma de sintonización pedagógica consolida la metodología transmedia innovadora desarrollada para empoderar a estudiantes y docentes de nivel secundario en el diseño de proyectos educativos interactivos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Coordinador General */}
              <div className="bg-slate-950 border-2 border-slate-900 p-5 rounded-none flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-pink-500 uppercase tracking-widest bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
                    Proyecto Integral y Coordinador General
                  </span>
                  <div className="pt-2">
                    <h3 className="text-sm font-black text-slate-100 uppercase">Guillermo Schiavi Gon</h3>
                    <p className="text-xxs text-slate-400 leading-relaxed mt-1.5">
                      Coordinación general del trayecto pedagógico integral "Convivencia en el aula", entrelazando dinámicas de gamificación activa y narrativa transmedia didáctica para enriquecer los saberes escolares locales.
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-900/60 pt-3 mt-4 text-[9px] text-slate-500">
                  Dirección y Planificación Estratégica
                </div>
              </div>

              {/* Capacitadores */}
              <div className="bg-slate-950 border-2 border-slate-900 p-5 rounded-none flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                    Capacitadores Docentes
                  </span>
                  <div className="space-y-3 pt-2">
                    <div className="border-l-2 border-yellow-500/50 pl-3">
                      <h4 className="text-xs font-black text-slate-200">Lautaro Pagnutti</h4>
                      <p className="text-[10px] text-slate-400">Desarrollo narrativo y capacitación sobre metodologías activas contemporáneas.</p>
                    </div>
                    <div className="border-l-2 border-yellow-500/50 pl-3">
                      <h4 className="text-xs font-black text-slate-200">Araceli Dal Santo</h4>
                      <p className="text-[10px] text-slate-400">Acompañamiento didáctico y soporte reflexivo en secuencias curriculares.</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-900/60 pt-3 mt-4 text-[9px] text-slate-500">
                  Formación y Tutorías áulicas
                </div>
              </div>

              {/* Colaboradoras */}
              <div className="bg-slate-950 border-2 border-slate-900 p-5 rounded-none flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">
                    Colaboradoras
                  </span>
                  <div className="space-y-3 pt-2">
                    <div className="border-l-2 border-cyan-500/50 pl-3">
                      <h4 className="text-xs font-black text-slate-200">Andrea Jouli</h4>
                      <p className="text-[10px] text-slate-400">Docente especialista en la temática de convivencia que asiste desde ese aporte específico a la propuesta.</p>
                    </div>
                    <div className="border-l-2 border-cyan-500/50 pl-3">
                      <h4 className="text-xs font-black text-slate-200">Lourdes Vistarop Calvo</h4>
                      <p className="text-[10px] text-slate-400">Docente especialista en la temática de convivencia que asiste desde ese aporte específico a la propuesta.</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-900/60 pt-3 mt-4 text-[9px] text-slate-500">
                  Soporte Reflexivo y Convivencia
                </div>
              </div>

              {/* Diseño de app */}
              <div className="bg-slate-950 border-2 border-slate-900 p-5 rounded-none flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Diseño de App
                  </span>
                  <div className="pt-2">
                    <h3 className="text-sm font-black text-slate-100 uppercase">Lautaro Pagnutti</h3>
                    <p className="text-xxs text-slate-400 leading-relaxed mt-1.5">
                      Maquetación integral de la interfaz de la estación de control, algoritmos interactivos de sintonización de coherencia y el pautador biofisiológico escolar.
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-900/60 pt-3 mt-4 text-[9px] text-slate-500">
                  Desarrollo de Experiencia de Usuario
                </div>
              </div>

            </div>

            <div className="bg-[#020b0d] border border-slate-900 p-4 rounded text-xxs text-slate-500 text-center uppercase tracking-wide">
              🔬 Proyecto de Innovación y Fortalecimiento Didáctico • La Pampa • 2026_UTC
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
