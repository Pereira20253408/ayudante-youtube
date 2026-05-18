import { GoogleGenerativeAI } from "@google/generative-ai";

// Función auxiliar para obtener la instancia de Gemini AI
const getGenAI = () => {
  const apiKey = localStorage.getItem('ckc_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenerativeAI(apiKey.trim());
};

// Fallbacks simulados por si falla la API o no hay clave configurada
const getFallbackScript = (topic, duration, videoType) => {
  const minutesMatch = duration.match(/\d+/);
  const totalSeconds = minutesMatch ? parseInt(minutesMatch[0]) * 60 : 60;
  const segments = Math.ceil(totalSeconds / 5);

  const script = [];
  for (let i = 0; i < segments; i++) {
    const start = i * 5;
    const end = (i + 1) * 5;
    const timeStr = `${Math.floor(start / 60)}:${(start % 60).toString().padStart(2, '0')} - ${Math.floor(end / 60)}:${(end % 60).toString().padStart(2, '0')}`;
    
    let visual = "";
    let audio = "";

    if (videoType === "musical") {
      visual = i === 0 
        ? `Escena de apertura: Título musical animado '${topic}' con notas musicales brillantes y luces de escenario.` 
        : `Escena ${i + 1}: Personajes bailando al ritmo de la música, interactuando alegremente con elementos de ${topic}.`;
      audio = i === 0 
        ? `(Música alegre y pegadiza) 🎵 ¡Hola amigos! ¿Están listos para cantar y bailar con ${topic}?` 
        : `(Estribillo pegadizo) 🎶 ¡Baila, baila, gira sin parar, con ${topic} vamos a disfrutar! 🎵`;
    } else if (videoType === "narracion") {
      visual = i === 0 
        ? `Escena de apertura: Título estilo documental infantil '${topic}' con lupas animadas y gráficos curiosos.` 
        : `Escena ${i + 1}: Animación explicativa con zoom y datos curiosos sobre ${topic}, mostrando detalles fascinantes.`;
      audio = i === 1
        ? `¡Hola pequeños exploradores! Hoy vamos a investigar a fondo y aprender cosas increíbles sobre ${topic}.`
        : `¿Sabías este dato curioso? ${topic} es asombroso. ¡Sigamos observando con nuestra lupa mágica! 🔍`;
    } else {
      visual = i === 0 
        ? `Escena de apertura: Un libro de cuentos mágico se abre mostrando el título '${topic}' entre destellos dorados.` 
        : `Escena ${i + 1}: El personaje vive una emocionante aventura superando un obstáculo relacionado con ${topic}.`;
      audio = i === 0 
        ? `Había una vez, en un mundo lleno de magia y color, una gran aventura llamada ${topic}...` 
        : `Y así, con mucho valor y amistad, nuestro héroe descubrió el secreto mágico de ${topic}. ✨`;
    }
    
    script.push({ time: videoType === 'musical' ? `Sección ${i+1} (${timeStr})` : timeStr, visual, audio });
  }
  return script;
};

const getFallbackMetadata = (topic, videoType) => {
  if (videoType === "musical") {
    return {
      titles: [
        `🎤 La Canción de ${topic} 🎶 | ¡Baila y Canta!`,
        `🎵 ¡A Mover el Cuerpo! Ritmo y Diversión con ${topic} ✨`,
        `🌟 ${topic}: El Video Musical Oficial para Niños 🚀`,
        `¡Aprende Cantando sobre ${topic}! 🎧 (Música Infantil)`,
        `🕺 Fiesta Musical Mágica con ${topic} 🎈`
      ],
      description: `¡Hola amiguitos cantantes! 🎤🎶 Prepárense para bailar y cantar sin parar con la canción oficial de ${topic}.\n\nUna melodía súper pegadiza y llena de ritmo para que toda la familia aprenda bailando. ¡Sube el volumen y a disfrutar!\n\nNo olvides darle LIKE 👍 y SUSCRIBIRTE 🔔 para más éxitos musicales infantiles.`,
      hashtags: ['#CancionInfantil', '#MusicaParaNiños', '#Bailar', '#Cantar', '#Infantil', '#AprenderCantando', '#Diversion', '#Familia', '#YoutubeKids', '#Ritmo']
    };
  } else if (videoType === "narracion") {
    return {
      titles: [
        `🔬 Aprende Todo Sobre ${topic} 🧠 | Datos Curiosos`,
        `🔍 ¿Qué es ${topic}? Explicación Fácil para Niños 🚀`,
        `💡 5 Curiosidades Increíbles de ${topic} que No Sabías 😱`,
        `🌍 Explorando el Mundo de ${topic} (Video Educativo) 📚`,
        `¡Misión Explorador! Descubriendo los Secretos de ${topic} 🕵️‍♂️`
      ],
      description: `¡Hola pequeños exploradores! 🔍🎒 Hoy nos ponemos las gafas de investigar para descubrir todos los secretos y datos curiosos sobre ${topic}.\n\nUn video educativo, fácil de entender y súper entretenido para mentes curiosas. ¡Acompáñanos en esta misión de aprendizaje!\n\nNo olvides darle LIKE 👍 y SUSCRIBIRTE 🔔 para más videos educativos.`,
      hashtags: ['#Educativo', '#Curiosidades', '#AprenderJugando', '#NiñosExploradores', '#CienciaInfantil', '#DatosCuriosos', '#Infantil', '#Conocimiento', '#YoutubeKids', '#Aprender']
    };
  }
  return {
    titles: [
      `📖 El Cuento Mágico de ${topic} ✨ | Historias para Niños`,
      `🌟 La Gran Aventura de ${topic} 🚀 (Cuento Infantil)`,
      `🏰 Había una vez... El Misterio de ${topic} 🦄`,
      `💤 Cuento para Dormir y Soñar con ${topic} 🌙`,
      `¡Emocionante! La Historia Secreta de ${topic} 🎈`
    ],
    description: `¡Hola soñadores! 📖✨ Abran bien los ojos y prepárense para escuchar el cuento mágico más hermoso sobre ${topic}.\n\nAcompáñanos en esta increíble aventura llena de fantasía, amistad y valiosas lecciones. ¡Ideal para disfrutar en familia o antes de dormir!\n\nNo olvides darle LIKE 👍 y SUSCRIBIRTE 🔔 para más cuentos mágicos.`,
    hashtags: ['#CuentosInfantiles', '#HistoriasParaNiños', '#CuentoMagico', '#Infantil', '#HoraDeDormir', '#Aventuras', '#Familia', '#Magia', '#Valores', '#YoutubeKids']
  };
};

const getFallbackThumbnail = (topic, videoType) => {
  let visualPrompt = "";
  let suggestedText = "";
  if (videoType === "musical") {
    visualPrompt = `Diseño de miniatura para YouTube de alta calidad, render 3D estilo Pixar/Disney, colores ultra vibrantes y de neón. En el centro, un personaje mascota lindo sosteniendo un micrófono brillante, cantando y bailando alegremente en un escenario con luces coloridas y notas musicales flotantes 3D. A un lado, un gran elemento mágico representando "${topic}". Resolución 8K, iluminación de concierto cinematográfica.`;
    suggestedText = "¡A CANTAR!";
  } else if (videoType === "narracion") {
    visualPrompt = `Diseño de miniatura para YouTube de alta calidad, render 3D estilo Pixar/Disney, colores ultra vibrantes y nítidos. En el centro, un personaje mascota lindo vestido de explorador con lupa y sombrero de safari, mirando asombrado un elemento gigante y detallado que representa "${topic}". Alrededor hay signos de interrogación flotantes y destellos de curiosidad. Resolución 8K, iluminación de estudio limpia y brillante.`;
    suggestedText = "¿SABÍAS QUÉ?";
  } else {
    visualPrompt = `Diseño de miniatura para YouTube de alta calidad, render 3D estilo Pixar/Disney, colores ultra vibrantes y mágicos. En el centro, un enorme libro de cuentos antiguo abriéndose, del cual salen rayos de luz dorada, polvo de estrellas y un hermoso escenario 3D que representa "${topic}". Un personaje mascota lindo mira el libro con ojos llenos de asombro y emoción. Resolución 8K, iluminación mágica de cuento de hadas.`;
    suggestedText = "¡CUENTO MÁGICO!";
  }
  return { visualPrompt, suggestedText };
};

export const generateScript = async (topic, duration = "1 minuto", videoType = "historia") => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    let prompt = "";
    if (videoType === "musical") {
      prompt = `Actúa como un compositor experto de canciones infantiles virales para YouTube.
Tema de la canción: "${topic}".
Duración aproximada: ${duration}.

Genera la letra completa de la canción estructurada en secciones (ej. Estrofa 1, Estribillo, Estrofa 2, Puente, Estribillo Final).
Para cada sección, proporciona:
1. "time": El nombre de la sección y tiempo estimado (ej. "Estrofa 1 (0:00 - 0:30)").
2. "visual": Descripción de la animación o escenas visuales alegres y dinámicas que acompañan esta parte.
3. "audio": La letra exacta de la canción para cantar, incluyendo indicaciones de ritmo o coros (ej. "🎵 (Ritmo alegre) ¡Salta, salta sin parar!...").

Devuelve estrictamente un array JSON de objetos con el formato:
[
  { "time": "Estrofa 1 (0:00 - 0:30)", "visual": "...", "audio": "..." },
  { "time": "Estribillo (0:30 - 1:00)", "visual": "...", "audio": "..." }
]`;
    } else if (videoType === "narracion") {
      prompt = `Actúa como un guionista experto en documentales y videos educativos infantiles para YouTube.
Tema del video: "${topic}".
Duración aproximada: ${duration}.

Genera un guion educativo, entretenido y lleno de datos curiosos, dividido en segmentos de tiempo.
Para cada segmento, proporciona:
1. "time": Intervalo de tiempo (ej. "0:00 - 0:45").
2. "visual": Descripción de gráficos, animaciones explicativas, lupas o personajes investigando.
3. "audio": La narración entusiasta y clara, explicando conceptos o datos curiosos sobre el tema.

Devuelve estrictamente un array JSON de objetos con el formato:
[
  { "time": "0:00 - 0:45", "visual": "...", "audio": "..." }
]`;
    } else {
      prompt = `Actúa como un cuentacuentos y guionista experto en historias mágicas infantiles para YouTube.
Tema del cuento: "${topic}".
Duración aproximada: ${duration}.

Genera un guion de cuento mágico y emocionante, dividido en segmentos de tiempo.
Para cada segmento, proporciona:
1. "time": Intervalo de tiempo (ej. "0:00 - 1:00").
2. "visual": Descripción de las escenas animadas, expresiones de los personajes y acciones mágicas.
3. "audio": La narración del cuento y diálogos de los personajes con tono cálido y atrapante.

Devuelve estrictamente un array JSON de objetos con el formato:
[
  { "time": "0:00 - 1:00", "visual": "...", "audio": "..." }
]`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.warn("Gemini API Error en generateScript, usando fallback:", error);
    if (error.message === "API_KEY_MISSING") {
      throw error; // Dejamos que la UI avise al usuario
    }
    return getFallbackScript(topic, duration, videoType);
  }
};

export const generateMetadata = async (topic, videoType = "historia") => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Actúa como un experto en SEO y marketing para YouTube Infantil.
Tema del video: "${topic}".
Tipo de video: "${videoType}" (${videoType === 'musical' ? 'Video musical / Canción' : videoType === 'narracion' ? 'Video educativo / Curiosidades' : 'Cuento mágico / Historia'}).

Genera los metadatos perfectos para que este video sea viral en YouTube y YouTube Kids:
1. "titles": Un array con 5 títulos virales, atractivos y optimizados para CTR (incluye emojis).
2. "description": Una descripción detallada y persuasiva para YouTube, incluyendo un saludo, resumen del contenido, llamado a la acción (suscribirse/like).
3. "hashtags": Un array con 15 hashtags relevantes y populares (ej. #Infantil, #CancionesParaNiños, etc.).

Devuelve estrictamente un objeto JSON con el formato:
{
  "titles": ["..."],
  "description": "...",
  "hashtags": ["#..."]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.warn("Gemini API Error en generateMetadata, usando fallback:", error);
    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    return getFallbackMetadata(topic, videoType);
  }
};

export const generateThumbnailIdeas = async (topic, videoType = "historia") => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Actúa como un director de arte experto en miniaturas (thumbnails) virales para YouTube Infantil.
Tema del video: "${topic}".
Tipo de video: "${videoType}" (${videoType === 'musical' ? 'Video musical / Canción' : videoType === 'narracion' ? 'Video educativo / Curiosidades' : 'Cuento mágico / Historia'}).

Genera dos elementos clave para crear una miniatura de altísimo CTR:
1. "visualPrompt": Un prompt detallado en español para generadores de imágenes por IA (como Midjourney o DALL-E 3). Debe describir una escena 3D estilo Pixar/Disney, con colores ultra vibrantes, un personaje mascota expresivo en primer plano y elementos representativos del tema. Si es musical, añade luces de escenario, micrófonos o notas musicales; si es educativo, lupas o trajes de explorador; si es cuento, un libro mágico abriéndose.
2. "suggestedText": Un texto corto, impactante y en mayúsculas (máximo 3 palabras) para colocar en la miniatura (ej. "${videoType === 'musical' ? '¡A CANTAR!' : videoType === 'narracion' ? '¿SABÍAS QUÉ?' : '¡CUENTO MÁGICO!'}").

Devuelve estrictamente un objeto JSON con el formato:
{
  "visualPrompt": "...",
  "suggestedText": "..."
}`;

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
