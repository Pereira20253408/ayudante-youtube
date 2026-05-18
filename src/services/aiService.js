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
  const script = [];

  if (videoType === "musical") {
    const musicalVerses = [
      `[Verso 1]\nCon gran alegría vamos a empezar,\neste nuevo juego para disfrutar.\nDa un paso al frente y ponte a girar,\nque con ${topic} te va a encantar.`,
      `[Verso 2]\nMira los colores brillando al compás,\nsalta muy bien alto, un poquito más.\nTodos los amigos vienen por detrás,\njunto con ${topic} paz y amor tendrás.`,
      `[Verso 3]\nBajo las estrellas o el sol de cristal,\nesta melodía suena sin igual.\nMueve la cabeza de un modo genial,\nque con ${topic} todo es especial.`,
      `[Verso 4]\nSube ya las manos, aplaude con fe,\ngira a la derecha, uno, dos y tres.\nGuarda este recuerdo mágico otra vez,\njunto con ${topic} todo sale bien.`
    ];

    const musicalChorus = `[Coro]\n🌟 ¡Baila, canta, ríe sin parar!\nCon ${topic} vamos a soñar.\n¡Da una vuelta entera y vuelve a saltar,\nque esta fiesta nunca va a terminar! 🎈`;

    const versePrompts = [
      [
        { line: "Con gran alegría vamos a empezar,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Un lindo personaje mascota sonriendo emocionado al comenzar un juego sobre ${topic}.` },
        { line: "este nuevo juego para disfrutar.", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El mismo lindo personaje abriendo una caja mágica llena de elementos coloridos de ${topic}.` },
        { line: "Da un paso al frente y ponte a girar,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El mismo lindo personaje dando una pirueta alegre en un escenario brillante con luces mágicas.` },
        { line: `que con ${topic} te va a encantar.`, prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El mismo lindo personaje abrazando un gran emblema brillante y festivo de ${topic}.` }
      ],
      [
        { line: "Mira los colores brillando al compás,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El mismo lindo personaje mirando notas musicales multicolores flotando a su alrededor.` },
        { line: "salta muy bien alto, un poquito más.", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El mismo lindo personaje saltando en un trampolín mágico entre nubes de algodón de azúcar.` },
        { line: "Todos los amigos vienen por detrás,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Un alegre desfile de animalitos y amigos siguiendo al personaje principal con serpentinas.` },
        { line: `junto con ${topic} paz y amor tendrás.`, prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Todos los amigos reunidos en un hermoso jardín radiante celebrando la magia de ${topic}.` }
      ],
      [
        { line: "Bajo las estrellas o el sol de cristal,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal mirando un cielo mágico donde conviven el sol y estrellas brillantes.` },
        { line: "esta melodía suena sin igual.", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Instrumentos mágicos animados tocando solos una dulce melodía alrededor del personaje.` },
        { line: "Mueve la cabeza de un modo genial,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal con audífonos grandes y coloridos bailando con mucho estilo.` },
        { line: `que con ${topic} todo es especial.`, prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Una explosión de confeti y luces de neón formando el nombre de ${topic}.` }
      ],
      [
        { line: "Sube ya las manos, aplaude con fe,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal aplaudiendo alegremente bajo un foco de luz cálida de teatro.` },
        { line: "gira a la derecha, uno, dos y tres.", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal haciendo una divertida coreografía junto a tres simpáticos pajaritos.` },
        { line: "Guarda este recuerdo mágico otra vez,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal guardando un destello de luz en un frasco de cristal mágico.` },
        { line: `junto con ${topic} todo sale bien.`, prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Gran escena final con todos los personajes sonriendo y saludando en un escenario festivo de ${topic}.` }
      ]
    ];

    const chorusPrompts = [
      { line: "¡Baila, canta, ríe sin parar!", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal y sus amigos en una gran fiesta de baile con luces de colores y burbujas.` },
      { line: `Con ${topic} vamos a soñar.`, prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal durmiendo plácidamente sobre una nube flotante con elementos mágicos de ${topic}.` },
      { line: "¡Da una vuelta entera y vuelve a saltar,", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El personaje principal dando un gran salto acrobático lleno de energía y chispas doradas.` },
      { line: "que esta fiesta nunca va a terminar!", prompt: `Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Un espectacular castillo de fuegos artificiales iluminando un carnaval infantil lleno de alegría.` }
    ];

    const order = [
      { isChorus: false, verseIndex: 0 },
      { isChorus: true },
      { isChorus: false, verseIndex: 1 },
      { isChorus: true },
      { isChorus: false, verseIndex: 2 },
      { isChorus: true },
      { isChorus: false, verseIndex: 3 },
      { isChorus: true }
    ];

    for (let i = 0; i < order.length; i++) {
      const item = order[i];
      const audio = item.isChorus ? musicalChorus : musicalVerses[item.verseIndex];
      const imagePrompts = item.isChorus ? (i === 1 ? chorusPrompts : []) : versePrompts[item.verseIndex];
      script.push({ audio, imagePrompts });
    }
    return script;
  }

  // Fallback para narracion e historia
  const minutesMatch = duration.match(/\d+/);
  const totalSeconds = minutesMatch ? parseInt(minutesMatch[0]) * 60 : 60;
  const segments = Math.ceil(totalSeconds / 15);

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
    `Zoom in microscópico: La cámara se acerca muchísimo para mostrar un detalle secreto de ${topic} con brillos mágicos.`,
    `Escena de cierre: El personaje investigador choca los cinco con la centalla mientras caen insignias de explorador.`
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

    if (videoType === "narracion") {
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
      prompt = `Actúa como un compositor experto de canciones infantiles virales para YouTube y director de arte de animación.
Tema de la canción: "${topic}".
Duración aproximada: ${duration}.

IMPORTANTE Y OBLIGATORIO: Genera la letra de la canción estructurada en 8 secciones exactas (Verso 1, Coro, Verso 2, Coro, Verso 3, Coro, Verso 4, Coro Final).
NO generes propiedades de tiempo ("time") ni descripciones visuales generales ("visual").

REGLAS PARA LA LETRA ("audio"):
- El "Coro" debe ser sumamente llamativo, pegadizo y alegre para atraer a los niños. El mismo coro se repite de forma idéntica después de cada verso.
- Cada "Verso" (Verso 1, Verso 2, Verso 3, Verso 4) debe tener exactamente 4 líneas rimadas contando una parte nueva y divertida de la historia. Las líneas deben ser cortas y con buen ritmo para que al momento de cantar o producir la canción todo cuadre perfectamente. Ejemplo de un verso de 4 líneas cortas:
Si escondo su hueso, lo encuentra al revés,
rasca la alfombra con patas otra vez.
Trae sus juguetes, los pone a mis pies,
¡me entiende muy rápido, en un, dos y tres!

REGLAS PARA LOS PROMPTS DE IMÁGENES ("imagePrompts"):
- Para cada sección, debes proporcionar un array "imagePrompts".
- Por cada una de las líneas de la letra en esa sección, genera un objeto con la línea exacta ("line") y un prompt de imagen por IA ("prompt") que represente lo que dice esa línea.
- REGLA ESTRICTA DE COHERENCIA DE ESTILO: Todos y cada uno de los prompts generados DEBEN comenzar exactamente con la misma instrucción de estilo maestro para garantizar una coherencia visual absoluta en todo el video musical y que no salgan estilos diferentes.
- Usa obligatoriamente este estilo maestro al inicio de cada prompt: "Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. [Descripción de la escena y el personaje principal realizando la acción de la línea]".
- Mantén al mismo personaje o personajes principales a lo largo de todos los prompts para que tenga coherencia narrativa.
- Para las repeticiones del Coro (después del Verso 2, Verso 3, Verso 4), puedes dejar el array "imagePrompts" vacío o repetir el mismo del primer coro, ya que en la interfaz mostraremos los prompts del coro una única vez.

Devuelve estrictamente un array JSON de objetos con el formato:
[
  { 
    "audio": "[Verso 1]\nSi escondo su hueso, lo encuentra al revés,\nrasca la alfombra con patas otra vez.\nTrae sus juguetes, los pone a mis pies,\n¡me entiende muy rápido, en un, dos y tres!",
    "imagePrompts": [
      { "line": "Si escondo su hueso, lo encuentra al revés,", "prompt": "Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. Un perrito travieso buscando su hueso debajo de un sofá amarillo en una sala acogedora." },
      { "line": "rasca la alfombra con patas otra vez.", "prompt": "Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El perrito travieso rascando una alfombra azul con texturas suaves y detalladas." },
      { "line": "Trae sus juguetes, los pone a mis pies,", "prompt": "Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El perrito travieso con una pelota roja en la boca frente a los zapatos de un niño." },
      { "line": "¡me entiende muy rápido, en un, dos y tres!", "prompt": "Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El perrito travieso chocando los cinco con un niño alegre entre destellos mágicos." }
    ]
  },
  { 
    "audio": "[Coro]\n¡Baila, canta, ríe sin parar!\nCon el osito vamos a soñar.\n¡Da una vuelta entera y vuelve a saltar,\nque esta fiesta nunca va a terminar!",
    "imagePrompts": [
      { "line": "¡Baila, canta, ríe sin parar!", "prompt": "Render 3D estilo animación Pixar Disney infantil, colores ultra vibrantes, nítido, iluminación mágica de estudio. El perrito y un osito bailando alegremente bajo luces de colores." }
    ]
  }
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
