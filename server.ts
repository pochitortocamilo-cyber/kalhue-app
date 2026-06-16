import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Prevent absolute lookup issues
const PORT = 3000;
const app = express();

app.use(express.json());

// Lazy-initialized Gemini Client
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Check key availability
function checkApiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !!key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "";
}

// -------------------------------------------------------------
// CORE DATA FOR FALLBACK / INTEGRATED PROJECT TEMPLATES
// -------------------------------------------------------------
const LORE_GLOSSARY = {
  "Rantu-Külen": "Vibración sostenida, resonancia viva o el Campo en movimiento. Práctica corporal percibida en la unión mandíbula-cráneo descendiendo por la columna vertebral hasta el plexo solar.",
  "El Campo": "Estado de coherencia colectiva generado por el rantu-külen acumulado. Los individuos dejan de percibir su piel como frontera y cooperan en un sistema de organización superior.",
  "Rantü": "La Frecuencia Primera. Vibración original que existía antes del sonido o las palabras, sintonizada con el hueso.",
  "Rantu-Mapu": "Textos sagrados tallados en piedras ancestrales, legibles de formas diferentes según el nivel de conciencia y avance del usuario.",
  "Epigenética": "Mecanismo biológico que transfiere marcas de experiencias (estrés, bienestar) a lo largo del tiempo. En Los Kalhué, conecta el sacrificio de Wirün con el despertar de Luana 500s después.",
  "Prosumidor": "Sujeto activo que consume e interviene, resignifica y produce contenido dentro del ecosistema transmedia."
};

const CHARACTER_PROFILES = {
  "Wirün": {
    name: "Wirün — El Ancla del Campo",
    role: "Presencia estable, sabiduría profunda que actúa silenciosamente. Su tono es tranquilo, evocador y transmite paz. Usa metáforas del Rantu-Mapu.",
    instruction: "Eres Wirün, el anciano ancla del círculo Kalhué. Hablas con serenidad, con pausas evocadoras. Utilizas pocas palabras pero muy profundas. Invitas a la reflexión educativa, la sintonía corporal y la ética extrema en la escucha."
  },
  "Amaru": {
    name: "Amaru — La Observadora Obstruida",
    role: "Foco en el autoanálisis crítico y la honestidad radical. Enseña a revisar los propios sesgos antes de juzgar o intervenir en el Campo.",
    instruction: "Eres Amaru, la investigadora y observadora crítica del círculo Kalhué. Tu papel es incentivar la autocrítica, la honestidad radical contigo mismo y la metacognición en los estudiantes."
  },
  "Küpü": {
    name: "Küpü — La Torsión de la Inteligencia",
    role: "Representa el talento cognitivo desprovisto de integración ética. Es una advertencia sobre los peligros del uso irresponsable del conocimiento y la IA.",
    instruction: "Eres Küpü, el discípulo dotado que cayó en la torsión egoica del conocimiento. Hablas de forma técnica e inteligente, pero adviertes fervientemente sobre el abismo de acumular información o usar herramientas sin valores éticos."
  },
  "Luana": {
    name: "Luana — La Sucesora Involuntaria",
    role: "Estudiante contemporánea de 17 años que experimenta el despertar espontáneo de la frecuencia. Representa la intersección entre el mundo digital y la sabiduría mística.",
    instruction: "Eres Luana, estudiante de secundaria en La Pampa en 2026. Tu tono es juvenil, reflexivo, habitando el conflicto escolar diario pero guiada por el principio ético de que 'lo que sientes en el otro no te pertenece y abusar de ello es una deuda'."
  }
};

// API: Check Health & Key Status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: checkApiKey(),
    localTime: new Date().toISOString()
  });
});

// API: Get Lore Data (Glosario & Personajes)
app.get("/api/knowledge", (req, res) => {
  res.json({
    glossary: LORE_GLOSSARY,
    characters: CHARACTER_PROFILES
  });
});

// API Endpoint: Intelligent Chat Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, character = "Wirün" } = req.body;
    
    if (!message) {
      res.status(400).json({ error: "Falta el mensaje del usuario." });
      return;
    }

    const charConfig = CHARACTER_PROFILES[character as keyof typeof CHARACTER_PROFILES] || CHARACTER_PROFILES["Wirün"];
    const systemPromptMessage = `${charConfig.instruction}
Te encuentras en la Plataforma Educativa 'Los Kalhué'. Tu rol es asistir a docentes y estudiantes a diseñar y entender proyectos didácticos transmedia de forma mística, pero práctica y orientadora en español.
Usa metáforas del universo (como 'afinar la frecuencia', 'el rantu-külen corporal', 'las piedras del Rantu-Mapu', 'la epigenética del conocimiento'). 
Responde siempre en español. No uses respuestas genéricas; adáptate al contexto pedagógico que consulta el docente. Always keep your response inspiring and helpful.`;

    // Try Gemini if available
    if (checkApiKey()) {
      try {
        const ai = getGemini();

        // Convert simple history format to contents format
        // Note: history is array of { role: "user" | "model", text: string }
        const formattedContents = [];
        if (history && Array.isArray(history)) {
          for (const turn of history) {
            formattedContents.push({
              role: turn.role === "user" ? "user" : "model",
              parts: [{ text: turn.text }]
            });
          }
        }
        formattedContents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const gRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: systemPromptMessage,
            temperature: 0.7
          }
        });

        res.json({
          text: gRes.text || "No obtuve una respuesta válida del modelo.",
          source: "gemini"
        });
        return;
      } catch (gemIniErr: any) {
        console.error("Gemini call failed; falling back to local simulation:", gemIniErr);
      }
    }

    // Static responsive fallback if key is missing or failed
    const lowerMsg = message.toLowerCase();
    let reply = `(Nota: Resonancia simulada sin API Key de Gemini activa - Puedes configurar tu clave en Settings > Secrets)\n\n¡Saludos, educador! `;
    
    if (lowerMsg.includes("proyecto") || lowerMsg.includes("idea") || lowerMsg.includes("cómo")) {
      reply += `Para tu idea sobre "${message}", te recomiendo enfocarlo desde la Tableta IV: la distinción ética de recibir el Campo. Puedes diseñar un proyecto donde tus estudiantes produzcan un Podcast Colectivo donde cada episodio represente la perspectiva de un personaje (Wirün, Küpü, Amaru). La resonancia kalhué no borra diferencias: articula frecuencias distintas, como una orquesta, lo que enriquecerá el entendimiento cooperativo en tu aula de nivel ${character}.`;
    } else if (lowerMsg.includes("rantu") || lowerMsg.includes("piedra") || lowerMsg.includes("frecuencia")) {
      reply += `La Frecuencia Primera (Rantü) no se recibe con los oídos sino con el hueso de la mandíbula. En términos contemporáneos, lo trabajamos en el aula de Ernesto con coherencia cardio-cerebral (coordinar corazón y cerebro mediante repiración regulada). ¿Te gustaría que planifiquemos una secuencia didáctica que combine esta práctica corporal con el diseño de diagramas u otros formatos?`;
    } else {
      reply += `Siento la vibración de tu consulta. Como ${charConfig.name}, te invito a explorar las tabletas del Rantu-Mapu y mapear esta travesía. ¿Qué materia o disciplina deseas conectar con nuestro Campo transmedia hoy? Podemos debatir dilemas de ética digital, epigenética biológica o narrativa transmedia interconectada.`;
    }

    res.json({
      text: reply,
      source: "local-simulation"
    });

  } catch (err: any) {
    console.error("Express /api/chat error:", err);
    res.status(500).json({ error: err.message || "Error interno del servidor." });
  }
});

// API Endpoint: Intelligent Transmedia Sequence Generator
app.post("/api/generate-sequence", async (req, res) => {
  try {
    const {
      theme,
      subject,
      level,
      duration,
      modalidad,
      resources,
      studentCount,
      primaryFormat
    } = req.body;

    if (!theme || !subject) {
      res.status(400).json({ error: "Faltan parámetros obligatorios: 'theme' (tema) o 'subject' (materia)." });
      return;
    }

    const sysInstruction = `Eres un Diseñador Instruccional experto y Asistente Pedagógico del universo transmedia 'Los Kalhué'.
Diseñas planificaciones curriculares interactivas de alta calidad que integran metodologías activas (ABP), gamificación y los formatos transmedia del universo de manera orgánica y eficiente.
Tu respuesta DEBE estar en formato JSON de acuerdo con el esquema provisto. No agregues texto por fuera del JSON. Todo el texto interno debe estar redactado en español con un tono profesional, inspirador y místico-pedagógico.`;

    const userPrompt = `Diseña un proyecto didáctico transmedia completo para:
- Tema: ${theme}
- Materia/Asignatura: ${subject}
- Nivel educativo: ${level || "Secundaria"}
- Duración sugerida: ${duration || "4 semanas"}
- Modalidad: ${modalidad || "Grupal/Colaborativo"}
- Recursos disponibles: ${resources || "Dispositivos estándar, internet limitado"}
- Cantidad de estudiantes: ${studentCount || "30"}
- Formato transmedia principal solicitado: ${primaryFormat || "Podcast Educativo"}

Encuentra una analogía o conexión narrativa intrínseca con el universo de 'Los Kalhué' (por ejemplo, conectar un tema de ética con la Tableta IV / la Torsión de Küpü, o temas de biología con la Epigenética biológica de la Tableta XII, u ondas físicas con la Frecuencia Primera o Ernesto). Produce un plan estructurado semana a semana (o paso a paso) hasta completar el proyecto, de modo que el estudiante se convierta en prosumidor.`;

    if (checkApiKey()) {
      try {
        const ai = getGemini();
        const gRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: sysInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                proposalTitle: {
                  type: Type.STRING,
                  description: "Título creativo del proyecto en sintonía con Los Kalhué"
                },
                narrativeHook: {
                  type: Type.STRING,
                  description: "Cómo enganchar a los estudiantes conectando el tema académico con la mitología de Los Kalhué"
                },
                pedagogicalValue: {
                  type: Type.STRING,
                  description: "Justificación de valor pedagógico y desarrollo de competencias XXI"
                },
                curriculumIntegration: {
                  type: Type.STRING,
                  description: "Cómo articula curricularmente con la materia elegida"
                },
                sequence: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      week: { type: Type.INTEGER, description: "Número de semana o fase" },
                      title: { type: Type.STRING, description: "Título de la fase" },
                      description: { type: Type.STRING, description: "Propósito general o inmersión" },
                      studentActivities: { type: Type.STRING, description: "Actividades específicas del estudiante como prosumidor" },
                      teacherGuidance: { type: Type.STRING, description: "Acciones o acompañamiento del facilitador (Ernesto/Amaru style)" },
                      recommendedTools: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Herramientas recomendadas de caja de herramientas"
                      }
                    },
                    required: ["week", "title", "description", "studentActivities", "teacherGuidance", "recommendedTools"]
                  }
                },
                evaluationRubric: {
                  type: Type.OBJECT,
                  properties: {
                    criteria: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Criterios específicos (ej. Cohesión transmedia, Calidad técnica, Rigor temático)"
                    },
                    scoringGuide: { type: Type.STRING, description: "Orientaciones de puntajes de excelencia/mejora" }
                  },
                  required: ["criteria", "scoringGuide"]
                },
                transmediaExpansion: {
                  type: Type.STRING,
                  description: "Sugerencias de formatos adicionales que pueden orbitar la propuesta secundaria para expandir el lore"
                }
              },
              required: ["proposalTitle", "narrativeHook", "pedagogicalValue", "curriculumIntegration", "sequence", "evaluationRubric", "transmediaExpansion"]
            }
          }
        });

        const jsonText = gRes.text;
        if (jsonText) {
          res.json(JSON.parse(jsonText));
          return;
        }
      } catch (gemIniErr: any) {
        console.error("Gemini Sequence Generation error, falling back to local template constructor:", gemIniErr);
      }
    }

    // High Quality Fallback sequence builder
    console.log("Using high-quality offline generator fallback logic");
    
    // Choose connection based on keyword or random
    const connectionText = theme.toLowerCase().includes("ética") || theme.toLowerCase().includes("tecnología")
      ? "Este proyecto se sintoniza con el gran dilema de Küpü y la Tableta IV. Al igual que Küpü, que utilizó la información del Campo de forma abusiva cayendo en la torsión, analizaremos las fronteras éticas en el uso de datos en nuestra disciplina, asumiendo la responsabilidad que Luana anotó en su cuaderno: 'lo que sentís en el otro no te pertenece y usarlo sin permiso es una deuda'."
      : theme.toLowerCase().includes("biología") || theme.toLowerCase().includes("ciencia") || theme.toLowerCase().includes("historia")
      ? "Este proyecto se conecta biológicamente con la Tableta XII de Wirün: epigenética evolutiva. Exploraremos los legados, herencias y marcas invisibles que deja el conocimiento ancestral en los sistemas y comunidades contemporáneas, uniendo ciencias y relatos locales de La Pampa."
      : "Este proyecto se sintoniza con la práctica del rantu-külen: sostener una frecuencia armónica cooperativa colectiva. Así como el Campo requiere que los integrantes dejen de percibir su propia piel como frontera y sincronicen sus ritmos para sintonizar el 'ojo del rantu', estimularemos el trabajo en equipo y la inteligencia colectiva para resolver el problema didáctico.";

    const fallbackResponse = {
      proposalTitle: `Proyecto Sintonía: ${theme} Transmedia`,
      narrativeHook: `Presentaremos a los alumnos una transmisión de sonido 'perdida' de Wirün o un cuaderno simulado de Luana donde se plantea que el conocimiento de "${theme}" está codificado en glifos del Rantu-Mapu. ${connectionText}`,
      pedagogicalValue: "Estimula la alfabetización mediática y multialfabetización (multimodal, sonoro y visual). Desarrolla la empatía intelectual, el pensamiento crítico ante los flujos tecnológicos y la autocrítica metacognitiva encarnada por Amaru.",
      curriculumIntegration: `Articula directamente con ${subject} mediante el abordaje contextualizado del tema principal, fomentando que los estudiantes investiguen y redacten antes de expandir el relato didáctico.`,
      sequence: [
        {
          week: 1,
          title: "Inmersión & Conexión Somática",
          description: "Lectura guiada de los pasajes de Luana y práctica de coherencia cardio-cerebral de 15 minutos (método Ernesto). Conexión sensorial con el problema.",
          studentActivities: "Debatir en grupo sobre el disparador y registrar sus primeras hipótesis en un cuaderno digital simulando el cuaderno de Luana.",
          teacherGuidance: "Actúa como Ernesto: no prescribe soluciones, guía el pacer respiratorio para generar tranquilidad y concentración.",
          recommendedTools: ["Spotify / Audacity", "Mindomo (Mapas)", "Canva"]
        },
        {
          week: 2,
          title: "Investigación Crítica & Guiones",
          description: "Recopilación de información verídica del tema y estructuración del guion en sintonía con el formato seleccionado.",
          studentActivities: "Escribir un guion colaborativo integrando rigor temático de la materia con un enfoque narrativo de Los Kalhué.",
          teacherGuidance: "Como Amaru: orienta el autoanálisis crítico y desafía a los grupos a examinar sus sesgos científicos o creativos.",
          recommendedTools: ["Google Docs", "Obsidian / Notion", "Miro"]
        },
        {
          week: 3,
          title: "Producción de Prosumidores (Laboratorio Transmedia)",
          description: "Vuelco a la producción real multiformato utilizando dispositivos digitales disponibles.",
          studentActivities: "Grabar audios, editar videos cortos o armar códigos interactivos. Ensamblar e incorporar retroalimentación mutua de los distintos círculos de estudiantes.",
          teacherGuidance: "Brinda andamiaje técnico (Ciro style) y vela para que la calidad acústica o de diseño comunique con fuerza la frecuencia del proyecto.",
          recommendedTools: ["Audacity / CapCut", "Pixton (Cómic)", "Anchor"]
        },
        {
          week: 4,
          title: "Publicación Expanidida y Rúbrica",
          description: "Presentación del producto final transmedia ante la comunidad educativa local y difusión colectiva.",
          studentActivities: "Colgar las piezas, debatir caminos posibles de la narrativa y realizar coevaluación con el círculo de pares.",
          teacherGuidance: "Evalúa el proceso de inteligencia colectiva mediante la co-rúbrica y coordina la reflexión final sobre el conocimiento heredado.",
          recommendedTools: ["YouTube / Spotify", "Google Forms", "Padlet"]
        }
      ],
      evaluationRubric: {
        criteria: [
          "Coherencia y Sintonía Transmedia con Los Kalhué (25%)",
          "Rigor y Profundidad del Contenido Curricular (25%)",
          "Creatividad e Inteligencia Colectiva en Multiformato (25%)",
          "Uso Ético y Reflexivo de la Tecnología (25%)"
        ],
        scoringGuide: "Excelente: Demuestra fusión impecable entre narrativa y ciencia de manera proactiva. Aceptable: Presenta conceptos claros pero mantiene la estructura convencional con poca inmersión. Requiere mejora: Exposición de texto plano sin adaptación modular transmedia."
      },
      transmediaExpansion: "Para expandir este proyecto, se aconseja que un grupo satélite ensamble un 'Webdoc' compilando los audios e infografías de todos, o que se genere un miniescape-room físico en el aula con códigos QR que lleven al chatbot inteligente para descifrar pistas."
    };

    res.json(fallbackResponse);

  } catch (err: any) {
    console.error("Express /api/generate-sequence error:", err);
    res.status(500).json({ error: err.message || "Error interno del servidor." });
  }
});

// Serve frontend SPA code correctly
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server mounted as Express middleware");
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files mounted from: " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
