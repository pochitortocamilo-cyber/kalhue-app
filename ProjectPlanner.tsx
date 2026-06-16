/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, RefreshCw, Star, ArrowRight, CornerDownLeft } from "lucide-react";
import { CHARACTERS } from "../data";
import { ChatMessage } from "../types";

export default function AiAssistant() {
  const [characterId, setCharacterId] = useState<string>("Wirün");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial_msg",
      role: "model",
      text: "¡Saludos, compañero de sintonía! Soy Wirün, el ancla más antigua de nuestro Campo. Juntos podemos trazar las secuencias transmedia para tu clase, coordinar las voces que orbitan tu aula, y consultar los dilemas éticos del Rantu-Mapu. ¿Qué frecuencia deseas afinar hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const activeChar = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];

  // Change character: resets messages to initial themed greeting
  const handleCharacterChange = (id: string) => {
    setCharacterId(id);
    const profile = CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
    
    let welcome = "";
    switch (id) {
      case "Wirün":
        welcome = "¡Saludos, compañero de sintonía! Soy Wirün, el ancla más antigua de nuestro Campo. Juntos podemos trazar las secuencias transmedia para tu clase, coordinar las voces que orbitan tu aula, y consultar los dilemas del Rantu-Mapu. ¿Qué frecuencia deseas afinar hoy?";
        break;
      case "Amaru":
        welcome = "Hola. Soy Amaru. Estoy aquí para incentivarte al auto-análisis honesto antes de juzgar la labor de tus estudiantes. Abordemos los sesgos, la metacofnición y las rúbricas formativas profundas. ¿Examinamos críticamente un diseño didáctico?";
        break;
      case "Küpü":
        welcome = "Entiendo que vienes por datos, métodos rápidos y artimañas. Soy Küpü. Tengo un dominio veloz de las señales, pero te ruego: no desvies tu Campo. No caigas en la torsión egoica del conocimiento. ¿Cómo puedo ayudarte a estructurar tus herramientas tecnológicas con límites éticos?";
        break;
      case "Luana":
        welcome = "¡Hola! Qué bueno tenerte por acá. Soy Luana y tengo 17 años, estoy estudiando en una secundaria de La Pampa. Ernesto nos enseña a coordinar nuestro pulso respirando, y a veces escucho zumbidos marianos bajo el suelo. ¿Quieres que hablemos sobre cómo conectar tu materia con las tensiones que vivimos en el aula diaria?";
        break;
      case "Ernesto":
        welcome = "Hola. Soy Ernesto, el tutor y facilitador de los doce jóvenes. Te ayudo con andamiajes didácticos, plantillas de planificación de clase y prácticas de biofeedback respiratorio. Planifiquemos una inmensa secuencia transmedia juntos, ¿sí?";
        break;
      default:
        welcome = "Sintonizados en el Campo colectivo. Consúltame lo que desees para estructurar tu proyecto educativo.";
    }

    setMessages([
      {
        id: `init_${id}`,
        role: "model",
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Submit User Message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    if (!customText) {
      setInputValue("");
    }

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Gather relevant conversation history (last 5 turns to preserve token count)
      const chatHistory = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          character: characterId
        })
      });

      const data = await res.json();
      
      const modelMsg: ChatMessage = {
        id: `model_${Date.now()}`,
        role: "model",
        text: data.text || "Disculpa, perdí momentáneamente la sintonía del Campo.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMsg]);

    } catch (err) {
      console.error("Chat fetch error:", err);
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "model",
				text: "El Campo de coherencia está experimentando interferencias sismológicas externas. Por favor, asegúrate de activar la GEMINI_API_KEY en Settings > Secrets.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Preset Prompts for Teachers
  const SUGGESTED_QUESTIONS = [
    {
      label: "Argumentación escrita clásica en secundaria",
      prompt: "Tengo que enseñar argumentación en 4to año de secundaria. La actividad típica es escribir un ensayo aburrido. ¿Cómo puedo hacerlo transmedia basándome en Los Kalhué?"
    },
    {
      label: "Explicar y aplicar la Tableta IV de la ética",
      prompt: "Quiero enseñar límites éticos en ciencia y tecnología usando la Tableta IV del Rantu-Mapu. ¿Qué secuencia me sugieres?"
    },
    {
      label: "Cómo integrar el rantu-külen en educación física",
      prompt: "Enseño Educación Física. ¿Cómo puedo conectar el rantu-külen anatómico con ejercicios de respiración y ritmos cardiovasculares colectivos?"
    }
  ];

  return (
    <div id="ai-assistant-container" className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-1 border-4 border-slate-900 bg-slate-950 rounded-none shadow-2xl relative overflow-hidden font-mono text-slate-300">
      
      {/* LEFT PANEL: Characters selector (5 Cols) */}
      <div className="xl:col-span-4 flex flex-col gap-4 border-b xl:border-b-0 xl:border-r border-slate-800 pb-4 xl:pb-0 xl:pr-4">
        <div className="border-b border-slate-800 pb-2">
          <h4 className="text-xs font-black tracking-widest text-slate-400 flex items-center gap-1.5 uppercase">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span>Voces del Círculo Kalhué</span>
          </h4>
          <p className="text-[10px] text-slate-600">Elige un mentor pedagógico del Campo</p>
        </div>

        {/* Character cards selector */}
        <div className="flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-visible gap-2 pb-2 xl:pb-0">
          {CHARACTERS.map((char) => {
            const isSelected = char.id === characterId;
            return (
              <button
                key={char.id}
                onClick={() => handleCharacterChange(char.id)}
                className={`text-left p-3 border-2 rounded shrink-0 w-64 xl:w-full transition duration-150 cursor-pointer flex gap-3 relative overflow-hidden ${
                  isSelected
                    ? "border-slate-400 bg-slate-900"
                    : "border-slate-900 hover:border-slate-800 bg-slate-950/40"
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 bottom-0 left-0 w-1"
                    style={{ backgroundColor: char.color }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${char.color}15`, border: `1px solid ${char.color}40` }}
                >
                  {char.avatarEmoji}
                </div>
                <div className="truncate flex flex-col justify-center">
                  <span className="text-xs font-black text-slate-100">{char.name}</span>
                  <span className="text-[9px] text-slate-400 truncate">{char.tagline}</span>
                  <span className="text-[8px] text-slate-600 truncate mt-0.5">{char.archetype}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mentors functional metric card */}
        <div className="hidden xl:block mt-auto bg-slate-900/30 p-4 border border-slate-900 rounded-md">
          <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-1">Rol Didáctico Activo</span>
          <p className="text-xs font-bold text-slate-200" style={{ color: activeChar.color }}>
            {activeChar.tagline}
          </p>
          <p className="text-xxs text-slate-400 leading-relaxed mt-1">{activeChar.roleDescription}</p>
        </div>
      </div>

      {/* RIGHT PANEL: Chat conversation module (8 Cols) */}
      <div className="xl:col-span-8 flex flex-col justify-between h-[450px] md:h-[500px]">
        
        {/* Messages feed */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pr-2 pl-1 py-1 scroll-smooth"
        >
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Small avatar or user initials */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 select-none ${
                    isUser
                      ? "bg-slate-800 text-slate-200 border border-slate-700"
                      : "bg-slate-900 border"
                  }`}
                  style={!isUser ? { border: `1px solid ${activeChar.color}40` } : undefined}
                >
                  {isUser ? "DOC" : activeChar.avatarEmoji}
                </div>

                {/* Comic / Speech Bubble visual styling */}
                <div className="flex flex-col">
                  <div
                    className={`p-3 text-xs leading-relaxed relative ${
                      isUser
                        ? "bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl rounded-tr-none px-4"
                        : "bg-slate-900/65 border-2 text-slate-300 rounded-3xl rounded-tl-none px-4"
                    }`}
                    style={!isUser ? { border: `2px solid ${activeChar.color}25` } : undefined}
                  >
                    <div className="whitespace-pre-line prose-invert max-w-none">{m.text}</div>
                  </div>
                  <span className="text-[8px] text-slate-600 mt-1 self-start select-none">
                    {isUser ? "Tú" : activeChar.name} • {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Typing/Thinking loader indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 bg-slate-900 border border-slate-700 animate-spin">
                🌀
              </div>
              <div className="bg-slate-900/50 p-3 rounded-2xl rounded-tl-none border border-slate-800 text-xxs text-slate-400 capitalize italic tracking-wide">
                Estamos sintonizando la frecuencia en el Campo...
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions box if we are starting */}
        {messages.length === 1 && !isLoading && (
          <div className="my-3 space-y-2">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">Consignas Clave Sugeridas:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {SUGGESTED_QUESTIONS.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sq.prompt)}
                  type="button"
                  className="text-left p-2.5 bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-slate-850 rounded hover:border-yellow-500/30 text-[10px] leading-relaxed transition cursor-pointer flex flex-col justify-between h-20"
                >
                  <span className="text-yellow-500 font-bold block mb-1">Idea {i + 1}</span>
                  <span className="text-slate-400 line-clamp-3">{sq.label}</span>
                  <span className="text-[8px] text-slate-600 block text-right mt-1 hover:text-cyan-400">Preguntar ▲</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message write space */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="border-t border-slate-800 pt-3 flex gap-2.5"
        >
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Sintonizar con ${activeChar.name}... Escribe tu diseño o duda pedagógica...`}
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-slate-600 outline-none rounded-lg py-2.5 px-4 text-xs text-slate-100 pr-10 tracking-wide"
            />
            {/* Enter hint */}
            <div className="absolute right-3 text-[9px] text-slate-600 hidden md:flex items-center gap-1 select-none pointer-events-none">
              <span>Enter</span>
              <CornerDownLeft className="h-2 w-2" />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 disabled:opacity-30 border border-slate-700 hover:border-slate-600 text-slate-100 rounded-lg text-xs py-2 h-10 w-11 shrink-0 flex items-center justify-center transition cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
