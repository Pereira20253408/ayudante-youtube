// Este es un stub/esquema para integrar Google Gemini (Vertex AI).
// Para usarlo realmente, necesitarás tu API KEY de Gemini y usar el SDK de Google Generative AI
// ej: npm install @google/generative-ai

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Funciones Simuladas (Stubs) que muestran la estructura esperada:

export const generateScript = async (topic, duration = "1 minuto", videoType = "historia") => {
  // Simulación de retraso de red
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extraer minutos de la duración (asumiendo formato "X minutos" o solo número)
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
      // default: historia / cuento
      visual = i === 0 
        ? `Escena de apertura: Un libro de cuentos mágico se abre mostrando el título '${topic}' entre destellos dorados.` 
        : `Escena ${i + 1}: El personaje vive una emocionante aventura superando un obstáculo relacionado con ${topic}.`;
      audio = i === 0 
        ? `Había una vez, en un mundo lleno de magia y color, una gran aventura llamada ${topic}...` 
        : `Y así, con mucho valor y amistad, nuestro héroe descubrió el secreto mágico de ${topic}. ✨`;
    }
    
    script.push({ time: timeStr, visual, audio });
  }

  return script;
};

export const generateMetadata = async (topic, videoType = "historia") => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
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

  // default: historia
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

export const generateThumbnailIdeas = async (topic, videoType = "historia") => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let visualPrompt = "";
  let suggestedText = "";

  if (videoType === "musical") {
    visualPrompt = `Diseño de miniatura para YouTube de alta calidad, render 3D estilo Pixar/Disney, colores ultra vibrantes y de neón. En el centro, un personaje mascota lindo sosteniendo un micrófono brillante, cantando y bailando alegremente en un escenario con luces coloridas y notas musicales flotantes 3D. A un lado, un gran elemento mágico representando "${topic}". Resolución 8K, iluminación de concierto cinematográfica.`;
    suggestedText = "¡A CANTAR!";
  } else if (videoType === "narracion") {
    visualPrompt = `Diseño de miniatura para YouTube de alta calidad, render 3D estilo Pixar/Disney, colores ultra vibrantes y nítidos. En el centro, un personaje mascota lindo vestido de explorador con lupa y sombrero de safari, mirando asombrado un elemento gigante y detallado que representa "${topic}". Alrededor hay signos de interrogación flotantes y destellos de curiosidad. Resolución 8K, iluminación de estudio limpia y brillante.`;
    suggestedText = "¿SABÍAS QUÉ?";
  } else {
    // historia
    visualPrompt = `Diseño de miniatura para YouTube de alta calidad, render 3D estilo Pixar/Disney, colores ultra vibrantes y mágicos. En el centro, un enorme libro de cuentos antiguo abriéndose, del cual salen rayos de luz dorada, polvo de estrellas y un hermoso escenario 3D que representa "${topic}". Un personaje mascota lindo mira el libro con ojos llenos de asombro y emoción. Resolución 8K, iluminación mágica de cuento de hadas.`;
    suggestedText = "¡CUENTO MÁGICO!";
  }

  return { visualPrompt, suggestedText };
};
