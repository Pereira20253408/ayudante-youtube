const fs = require('fs');

let code = fs.readFileSync('src/services/aiService.js', 'utf8');

// We split the code at "export const generateThumbnailIdeas" to isolate the first part of the file
const parts = code.split('export const generateThumbnailIdeas');
const firstPart = parts[0];

const cleanBottomPart = `export const generateThumbnailIdeas = async (topic, videoType = "historia") => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: getGeminiModelName(),
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = \`Actúa como un director de arte experto en miniaturas (thumbnails) virales para YouTube Infantil.
Tema del video: "\${topic}".
Tipo de video: "\${videoType}" (\${videoType === 'musical' ? 'Video musical / Canción' : videoType === 'narracion' ? 'Video educativo / Curiosidades' : 'Cuento mágico / Historia'}).

Genera dos elementos clave para crear una miniatura de altísimo CTR:
1. "visualPrompt": Un prompt detallado en español para generadores de imágenes por IA (como Midjourney o DALL-E 3). Debe describir una escena 3D estilo Pixar/Disney, con colores ultra vibrantes, un personaje mascota expresivo en primer plano y elementos representativos del tema. Si es musical, añade luces de escenario, micrófonos o notas musicales; si es educativo, lupas o trajes de explorador; si es cuento, un libro mágico abriéndose.
2. "suggestedText": Un texto corto, impactante y en mayúsculas (máximo 3 palabras) para colocar en la miniatura (ej. "\${videoType === 'musical' ? '¡A CANTAR!' : videoType === 'narracion' ? '¿SABÍAS QUÉ?' : '¡CUENTO MÁGICO!'}").

Devuelve estrictamente un objeto JSON con el formato:
{
  "visualPrompt": "...",
  "suggestedText": "..."
}\`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.warn("Gemini API Error en generateThumbnailIdeas, usando fallback:", error);
    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    return getFallbackThumbnail(topic, videoType);
  }
};

export const generateRecommendedTopics = async (count = 1, excludeTopics = []) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: getGeminiModelName(),
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = \`Actúa como un director creativo experto en canales de YouTube infantiles.
Genera un array JSON con exactamente \${count} ideas de temas creativos, divertidos y llamativos para videos infantiles (cuentos, canciones o videos educativos).
REGLA CRÍTICA: Cada tema debe ser muy corto, conciso y directo, de máximo 2 o 3 palabras (un concepto descriptivo simple).
Cada tema debe incluir un emoji infantil y coherente al final.
Ejemplos de formato corto obligatorio:
"Robot bailarín 🤖"
"Perro espacial 🐕‍🚀"
"Gatito bombero 🐱"
"Dinosaurio dentista 🦖"
"Tren del arcoíris 🌈"

Temas que debes EXCLUIR (no los repitas bajo ninguna circunstancia): \${JSON.stringify(excludeTopics)}

Devuelve estrictamente un array JSON de strings con las nuevas ideas de temas:
[
  "Tema 1...",
  "Tema 2..."
]\`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/\\\`\\\`\\\`json/g, '').replace(/\\\`\\\`\\\`/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.warn("Error generando temas recomendados, usando pool de fallbacks:", error);
    const fallbackPool = [
      "Dinosaurio dentista 🦖",
      "Perro espacial 🐕‍🚀",
      "Robot bailarín 🤖",
      "Gatito bombero 🐱",
      "Tren del arcoíris 🌈",
      "Abeja exploradora 🐝",
      "Hormiga cantante 🐜",
      "Carro de carreras 🏎️",
      "Koala cocinero 🐨",
      "Pirata bueno 🏴‍☠️",
      "Nube de caramelos 🍬",
      "Peces traviesos 🐟",
      "Sol dormilón ☀️",
      "Cohete de globos 🚀",
      "Jirafa elegante 🦒",
      "Tiburón surfista 🦈",
      "Oso pintor 🐻",
      "Conejo cartero 🐰"
    ];
    // Filtrar los excluidos
    const filtered = fallbackPool.filter(t => !excludeTopics.includes(t));
    // Mezclar aleatoriamente
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
};

export const generateImagePromptsForScript = async (topic, scriptData) => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getGeminiModelName(), generationConfig: { responseMimeType: "application/json", temperature: 1.0 } });
  
  const scriptText = scriptData.map(s => s.audio).join('\\n');
  const prompt = \`Genera prompts de imágenes para un video musical infantil 3D sobre: "\${topic}".
Basado en esta letra:
\${scriptText}

Devuelve un JSON Array de objetos, un objeto por cada sección de la letra. Cada objeto debe tener la propiedad "imagePrompts", que es un array de objetos con "line" (la línea de la letra en español) y "prompt" (el prompt de imagen en INGLÉS).
Reglas:
- 4 imagePrompts por sección.
- Estilo en el prompt visual (inglés): 3D cartoon style for kids, bright, vibrant colors.
- Consistencia del personaje.
- FORMATO EXACTO: [{ "imagePrompts": [{ "line": "...", "prompt": "..." }] }]\`;
  
  const result = await model.generateContent(prompt);
  let s = result.response.text().trim();
  if (s.startsWith('\\\`\\\`\\\`json')) s = s.replace(/^\\\`\\\`\\\`json\\n/, '').replace(/\\n\\\`\\\`\\\`$/, '');
  else if (s.startsWith('\\\`\\\`\\\`')) s = s.replace(/^\\\`\\\`\\\`\\n/, '').replace(/\\n\\\`\\\`\\\`$/, '');
  
  return JSON.parse(s);
};

export const generateMusicPromptForScript = async (topic, scriptData) => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getGeminiModelName(), generationConfig: { responseMimeType: "application/json", temperature: 1.0 } });
  
  const prompt = \`Genera un prompt de estilo musical en inglés para una canción infantil muy alegre, pegadiza y bailable sobre "\${topic}".
Devuelve un JSON con formato: { "musicPrompt": "..." }\`;
  
  const result = await model.generateContent(prompt);
  let s = result.response.text().trim();
  if (s.startsWith('\\\`\\\`\\\`json')) s = s.replace(/^\\\`\\\`\\\`json\\n/, '').replace(/\\n\\\`\\\`\\\`$/, '');
  else if (s.startsWith('\\\`\\\`\\\`')) s = s.replace(/^\\\`\\\`\\\`\\n/, '').replace(/\\n\\\`\\\`\\\`$/, '');
  
  return JSON.parse(s);
};

export const generateAllContent = async (topic, duration = "1 minuto", videoType = "historia") => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: getGeminiModelName(), generationConfig: { responseMimeType: "application/json", temperature: 1.0 } });

    const prompt = \`Actúa como un equipo experto de producción de YouTube (Guionista, SEO y Director de Arte).
Tema: "\${topic}"
Tipo de video: "\${videoType}"

Genera todo el contenido para este video en un solo JSON con la siguiente estructura exacta:
{
  "script": [
    { "audio": "[Coro]\\\\n...", "time": "0:00 - 0:15" },
    { "audio": "[Verso 1]\\\\n...", "time": "0:15 - 0:30" },
    { "audio": "[Coro]\\\\n...", "time": "0:30 - 0:45" },
    { "audio": "[Verso 2]\\\\n...", "time": "0:45 - 1:00" },
    { "audio": "[Coro]\\\\n...", "time": "1:00 - 1:15" },
    { "audio": "[Verso 3]\\\\n...", "time": "1:15 - 1:30" },
    { "audio": "[Coro]\\\\n...", "time": "1:30 - 1:45" },
    { "audio": "[Verso 4]\\\\n...", "time": "1:45 - 2:00" }
  ],
  "metadata": {
    "titles": ["Título 1", "Título 2", "Título 3", "Título 4", "Título 5"],
    "description": "Descripción del video...",
    "hashtags": ["#Tag1", "#Tag2"]
  },
  "thumbnail": {
    "visualPrompt": "3D estilo cartoon infantil, brillo, colores vibrantes...",
    "suggestedText": "TEXTO CORTO"
  }
}

REGLAS PARA EL SCRIPT:
- Si es musical:
  1. El JSON de "script" debe tener EXACTAMENTE 8 secciones alternando Coro y Verso (Coro, Verso 1, Coro, Verso 2, Coro, Verso 3, Coro, Verso 4).
  2. TANTO EL CORO COMO CADA VERSO DEBEN TENER EXACTAMENTE 4 LÍNEAS DE LETRA (ni 3, ni 5, ni 6; obligatoriamente 4 líneas de letra cada uno).
  3. Las líneas deben ser cortas, con una estructura y métrica pareja, constante y fluida para que sea extremadamente fácil de cantar y ponerle ritmo musical.
  4. Las rimas deben ser claras, pegadizas y divertidas, totalmente libres de clichés comunes.
  5. El Coro debe ser idéntico las 4 veces.
  6. ESTÁ ESTRICTAMENTE PROHIBIDO usar emojis o caracteres especiales en la letra.
  7. LA LETRA DEBE SER SUMAMENTE CREATIVA Y CONTAR UNA HISTORIA DIVERTIDA SOBRE EL TEMA DADO ("\${topic}"). IMPORTANTE: NO intentes rimar o repetir el nombre completo del tema de forma literal y forzada en cada línea. La canción debe hablar SOBRE el tema (por ejemplo, si el tema es 'Perro espacial 🐕‍🚀', cuenta la historia de un perrito astronauta viajando por las estrellas y la luna, sin necesidad de repetir la frase 'perro espacial' de manera forzada en cada rima).
- Si es historia o narración: divídelo en segmentos de tiempo, sin repetir historias.
- IMPORTANTE: SOLO genera las propiedades "audio" y "time" dentro del array "script". NO generes "imagePrompts" ni "musicPrompt" aquí.

REGLAS PARA METADATA:
- Títulos llamativos y virales con emojis.
- 15 hashtags relevantes.

REGLAS PARA THUMBNAIL:
- visualPrompt detallado en español para generadores como Midjourney, 3D cartoon infantil.
- suggestedText máximo 3 palabras en mayúsculas.\`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\\\`\\\`\\\`json')) text = text.replace(/^\\\`\\\`\\\`json\\n/, '').replace(/\\n\\\`\\\`\\\`$/, '');
    else if (text.startsWith('\\\`\\\`\\\`')) text = text.replace(/^\\\`\\\`\\\`\\n/, '').replace(/\\n\\\`\\\`\\\`$/, '');
    
    const parsedData = JSON.parse(text);
    if (parsedData && Array.isArray(parsedData.script)) {
      parsedData.script.forEach(item => {
        if (item.audio) {
          item.audio = item.audio.replace(/[\\u{1F300}-\\u{1F9FF}]|[\\u{2600}-\\u{26FF}]|[\\u{2700}-\\u{27BF}]|[\\u{1F600}-\\u{1F64F}]|[\\u{1F680}-\\u{1F6FF}]|[\\u{1F1E6}-\\u{1F1FF}]|[\\u{2B50}]|[\\u{2B55}]|[\\u{23F3}]|[\\u{23F0}]|[\\u{23E9}-\\u{23EC}]|[\\u{25B6}]/gu, '');
        }
      });
    }
    return parsedData;
  } catch (error) {
    console.warn("Gemini API Error en generateAllContent, usando fallbacks:", error);
    if (error.message === "API_KEY_MISSING") throw error;
    
    const fallbackScript = getFallbackScript(topic, duration, videoType);
    const fallbackMetadata = getFallbackMetadata(topic, videoType);
    const fallbackThumbnail = getFallbackThumbnail(topic, videoType);
    
    const cleanFallbackScript = fallbackScript.map(s => ({
      audio: s.audio,
      time: s.time || "0:00"
    }));
    
    return {
      script: cleanFallbackScript,
      metadata: fallbackMetadata,
      thumbnail: fallbackThumbnail
    };
  }
};
`;

fs.writeFileSync('src/services/aiService.js', firstPart + cleanBottomPart);
console.log("Rewrote aiService.js bottom part successfully");
