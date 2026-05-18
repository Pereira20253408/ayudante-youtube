import { GoogleGenerativeAI } from "@google/generative-ai";

// Función auxiliar para obtener la instancia de Gemini AI
const getGenAI = () => {
  const apiKey = localStorage.getItem('ckc_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenerativeAI(apiKey.trim());
};

// Fallbacks simulados ricos y variados por si falla la API o no hay clave configurada
const getFallbackScript = (topic, duration, videoType) => {
  const minutesMatch = duration.match(/\d+/);
  const totalSeconds = minutesMatch ? parseInt(minutesMatch[0]) * 60 : 60;
  const segments = Math.ceil(totalSeconds / 15); // Segmentos de 15 segundos para dar variedad natural

  const script = [];

  // Plantillas ricas y variadas para que nunca se repita
  const musicalVerses = [
    `🎵 ¡Atención amigos, la aventura va a empezar! Con ${topic} nos vamos a divertir y a cantar.`,
    `🎶 Da un paso al frente, mueve los pies, mira a ${topic} saltando a la vez.`,
    `🎵 Bajo el sol brillante o la luna de cristal, la magia de ${topic} es algo sensacional.`,
    `🎶 Girando, girando como un carrusel, ${topic} nos muestra un mundo de papel.`,
    `🎵 Sube las manos, aplaude con emoción, que ${topic} te canta esta bella canción.`
  ];

  const musicalChoruses = [
    `🎤 (Estribillo) ¡Baila, canta, ríe sin parar! Con ${topic} los sueños se hacen realidad. 🌟`,
    `🎤 (Estribillo Pegadizo) ¡Uepa, uepa, vamos a saltar, que con ${topic} es hora de celebrar! 🎈`,
    `🎤 (Estribillo Final) ¡Y así cantamos con el corazón, ${topic} es el rey de esta canción! 🚀`
  ];

  const musicalVisuals = [
    `Escena inicial: Escenario brillante con luces de neón y confeti cayendo mientras aparece el título de ${topic}.`,
    `Cámara rápida: Los personajes hacen una coreografía divertida, saltando de un lado a otro con una sonrisa gigante.`,
    `Plano detalle: Instrumentos musicales mágicos tocando solos alrededor de ${topic} entre burbujas de colores.`,
    `Escena de baile libre: Todos los animalitos y amigos se unen en un gran círculo bailando bajo una bola de disco animada.`,
    `Gran final: Fuegos artificiales de estrellas y destellos mágicos mientras ${topic} se despide con una reverencia.`
  ];

  const narracionAudios = [
    `¡Hola pequeños investigadores! 🔍 Hoy tenemos una misión súper emocionante: descubrir los grandes secretos de ${topic}.`,
    `¿Sabías qué? 💡 ${topic} tiene características únicas que sorprenden a todos los científicos del mundo. ¡Miremos de cerca!`,
    `¡Guau! 🔬 Si observamos con nuestra lupa mágica, podemos ver cómo ${topic} funciona en su entorno natural. Es fascinante.`,
    `Otro dato curiosísimo: a lo largo de la historia, ${topic} ha ayudado a entender muchos misterios de nuestro planeta. 🌍`,
    `¡Excelente trabajo, equipo de exploradores! 🎒 Hoy hemos aprendido cosas increíbles sobre ${topic}. ¡Hasta la próxima aventura!`
  ];

  const narracionVisuals = [
    `Animación de apertura: Un libro de notas se abre y sale una lupa gigante enfocando el título de ${topic}.`,
    `Gráfico animado: Aparecen flechas y círculos de colores resaltando las partes más importantes de ${topic}.`,
    `Pantalla dividida: A un lado el personaje investigador con expresión de asombro, al otro una animación detallada de ${topic}.`,
    `Zoom in microscópico: La cámara se acerc muchísimo para mostrar un detalle secreto de ${topic} con brillos mágicos.`,
    `Escena de cierre: El personaje investigador choca los cinco con la pantalla mientras caen insignias de explorador.`
  ];

  const historiaAudios = [
    `Había una vez, en un valle lleno de árboles de algodón de azúcar, un simpático amigo llamado ${topic}... ✨`,
    `Un día soleado, ${topic} decidió emprender un viaje misterioso para encontrar el tesoro de la montaña dorada. 🗺️`,
    `De repente, se presentó un gran desafío. Pero ${topic}, con mucho ingenio y ayuda de sus amigos, ideó un plan brillante. 🌟`,
    `¡Lo lograron! 🎉 Al superar el obstáculo, el cielo se llenó de auroras boreales y risas encantadoras.`,
    `Y así, ${topic} descubrió que el verdadero tesoro siempre fue la amistad y la valentía que llevaba en su corazón. ❤️`
  ];

  const historiaVisuals = [
    `Apertura mágica: Un polvo de hadas dorado dibuja el contorno de ${topic} sobre un prado verde y florido.`,
    `Escena de travesía: El personaje camina alegremente por un sendero animado con mariposas que brillan a su paso.`,
    `Escena de acción y suspenso leve: Sombras graciosas aparecen, pero el personaje usa un objeto mágico que ilumina todo el lugar.`,
    `Clímax festivo: Una explosión de luz cálida transforma el paisaje en un festival de colores y alegría.`,
    `Cierre de cuento: El libro mágico se cierra suavemente con un lazo de cinta roja mientras la luna sonríe en el cielo.`
  ];

  for (let i = 0; i < segments; i++) {
    const start = i * 15;
    const end = (i + 1) * 15;
    const timeStr = `${Math.floor(start / 60)}:${(start % 60).toString().padStart(2, '0')} - ${Math.floor(end / 60)}:${(end % 60).toString().padStart(2, '0')}`;
    
    let visual = "";
    let audio = "";

    if (videoType === "musical") {
      const sectionName = i === 0 ? "Estrofa 1" : i === 1 ? "Estribillo" : i === 2 ? "Estrofa 2" : i === segments - 1 ? "Estribillo Final" : `Estrofa ${i+1}`;
      visual = musicalVisuals[i % musicalVisuals.length];
      audio = (i === 1 || i === segments - 1) ? musicalChoruses[i % musicalChoruses.length] : musicalVerses[i % musicalVerses.length];
      script.push({ time: `${sectionName} (${timeStr})`, visual, audio });
    } else if (videoType === "narracion") {
      visual = narracionVisuals[i % narracionVisuals.length];
      audio = narracionAudios[i % narracionAudios.length];
      script.push({ time: `Segmento ${i+1} (${timeStr})`, visual, audio });
    } else {
      visual = historiaVisuals[i % historiaVisuals.length];
      audio = historiaAudios[i % historiaAudios.length];
      script.push({ time: `Escena ${i+1} (${timeStr})`, visual, audio });
    }
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

Genera la letra completa de la canción estructurada en secciones diferentes (ej. Estrofa 1, Estribillo, Estrofa 2, Puente, Estribillo Final).
IMPORTANTE Y OBLIGATORIO: Asegúrate de NO REPETIR la misma letra ni la misma descripción visual en las diferentes secciones. Cada estrofa debe contar una parte nueva y emocionante de la historia, y cada descripción visual debe mostrar escenarios, coreografías y acciones completamente DIFERENTES.

Para cada sección, proporciona:
1. "time": El nombre de la sección y tiempo estimado (ej. "Estrofa 1 (0:00 - 0:30)").
2. "visual": Descripción de la animación o escenas visuales alegres, dinámicas y DIFERENTES para cada parte.
3. "audio": La letra exacta y creativa de la canción para cantar, sin repetir versos anteriores (salvo el estribillo), incluyendo indicaciones de ritmo o coros (ej. "🎵 (Ritmo alegre) ¡Salta, salta sin parar!...").

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
IMPORTANTE Y OBLIGATORIO: Asegúrate de NO REPETIR la misma narración ni la misma descripción visual en los diferentes segmentos. Cada segmento debe explicar un dato curioso o concepto NUEVO, con animaciones, gráficos y situaciones DIFERENTES.

Para cada segmento, proporciona:
1. "time": Intervalo de tiempo (ej. "0:00 - 0:45").
2. "visual": Descripción de gráficos, animaciones explicativas, lupas o personajes investigando (diferente en cada segmento).
3. "audio": La narración entusiasta y clara, explicando conceptos o datos curiosos NUEVOS sobre el tema sin repetir lo anterior.

Devuelve estrictamente un array JSON de objetos con el formato:
[
  { "time": "0:00 - 0:45", "visual": "...", "audio": "..." }
]`;
    } else {
      prompt = `Actúa como un cuentacuentos y guionista experto en historias mágicas infantiles para YouTube.
Tema del cuento: "${topic}".
Duración aproximada: ${duration}.

Genera un guion de cuento mágico y emocionante, dividido en escenas o segmentos de tiempo.
IMPORTANTE Y OBLIGATORIO: Asegúrate de NO REPETIR los mismos diálogos ni la misma descripción visual en las diferentes escenas. La historia debe avanzar de forma fluida con un inicio, desarrollo, clímax y desenlace, mostrando escenarios, retos y acciones mágicas DIFERENTES en cada parte.

Para cada segmento, proporciona:
1. "time": Intervalo de tiempo (ej. "0:00 - 1:00").
2. "visual": Descripción de las escenas animadas, expresiones de los personajes y acciones mágicas (diferente en cada escena).
3. "audio": La narración del cuento y diálogos de los personajes con tono cálido y atrapante, haciendo avanzar la historia sin repetir textos.

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
