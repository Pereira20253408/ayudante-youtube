import { GoogleGenerativeAI } from "@google/generative-ai";

// Función auxiliar para obtener la instancia de Gemini AI
const getGenAI = () => {
  const apiKey = localStorage.getItem('ckc_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenerativeAI(apiKey.trim());
};

// Obtiene el modelo configurado por el usuario o usa el predeterminado (gemini-2.5-flash)
export const getGeminiModelName = () => {
  const model = localStorage.getItem('ckc_gemini_model');
  if (model === 'gemini-1.5-flash') {
    // Si tenían guardado el modelo viejo retirado por Google, forzar la migración
    localStorage.setItem('ckc_gemini_model', 'gemini-2.5-flash');
    return 'gemini-2.5-flash';
  }
  return model || 'gemini-2.5-flash';
};
// Fallbacks simulados ricos y variados por si falla la API o no hay clave configurada
export const getFallbackScript = (topic, duration, videoType) => {
  const script = [];
  if (videoType === "musical") {
    const cleanTopic = topic.trim();
    const songIndex = Math.abs(cleanTopic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 5;

    const songs = [
      // Canción 0: Enérgica / Aventurera
      {
        verses: [
          `[Verso 1]\nCon gran alegría vamos a empezar,\neste nuevo juego para disfrutar.\nDa un paso al frente y ponte a girar,\nque con ${cleanTopic} te va a encantar.`,
          `[Verso 2]\nMira los colores brillando al compás,\nsalta muy bien alto, un poquito más.\nTodos los amigos vienen por detrás,\njunto con ${cleanTopic} paz y amor tendrás.`,
          `[Verso 3]\nBajo las estrellas o el sol de cristal,\nesta melodía suena sin igual.\nMueve la cabeza de un modo genial,\nque con ${cleanTopic} todo es especial.`,
          `[Verso 4]\nSube ya las manos, aplaude con fe,\ngira a la derecha, uno, dos y tres.\nGuarda este recuerdo mágico otra vez,\njunto con ${cleanTopic} todo sale bien.`
        ],
        chorus: `[Coro]\n¡Baila, canta, ríe sin parar!\nCon ${cleanTopic} vamos a soñar.\n¡Da una vuelta entera y vuelve a saltar,\nque esta fiesta nunca va a terminar!`,
        musicPrompt: "energetic children's pop, happy upbeat rhythm, fun synthesizer, catchy male vocal",
        versePrompts: [
          [
            { line: "Con gran alegría vamos a empezar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un lindo personaje mascota sonriendo emocionado al comenzar un juego sobre ${cleanTopic}.` },
            { line: "este nuevo juego para disfrutar.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El mismo lindo personaje abriendo una caja mágica llena de elementos coloridos de ${cleanTopic}.` },
            { line: "Da un paso al frente y ponte a girar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El mismo lindo personaje dando una pirueta alegre en un escenario brillante con luces mágicas.` },
            { line: `que con ${cleanTopic} te va a encantar.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El mismo lindo personaje abrazando un gran emblema brillante y festivo de ${cleanTopic}.` }
          ],
          [
            { line: "Mira los colores brillando al compás,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El mismo lindo personaje mirando notas musicales multicolores flotando a su alrededor.` },
            { line: "salta muy bien alto, un poquito más.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El mismo lindo personaje saltando en un trampolín mágico entre nubes de algodón de azúcar.` },
            { line: "Todos los amigos vienen por detrás,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un alegre desfile de animalitos y amigos siguiendo al personaje principal con serpentinas.` },
            { line: `junto con ${cleanTopic} paz y amor tendrás.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Todos los amigos reunidos en un hermoso jardín radiante celebrando la magia de ${cleanTopic}.` }
          ],
          [
            { line: "Bajo las estrellas o el sol de cristal,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal mirando un cielo mágico donde conviven el sol y estrellas brillantes.` },
            { line: "esta melodía suena sin igual.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Instrumentos mágicos animados tocando solos una dulce melodía alrededor del personaje.` },
            { line: "Mueve la cabeza de un modo genial,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal con audífonos grandes y coloridos bailando con mucho estilo.` },
            { line: `que con ${cleanTopic} todo es especial.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una explosión de confeti y luces de neón formando el nombre de ${cleanTopic}.` }
          ],
          [
            { line: "Sube ya las manos, aplaude con fe,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal aplaudiendo alegremente bajo un foco de luz cálida de teatro.` },
            { line: "gira a la derecha, uno, dos y tres.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal haciendo una divertida coreografía junto a tres simpáticos pajaritos.` },
            { line: "Guarda este recuerdo mágico otra vez,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal guardando un destello de luz en un frasco de cristal mágico.` },
            { line: `junto con ${cleanTopic} todo sale bien.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Gran escena final con todos los personajes sonriendo y saludando en un escenario festivo de ${cleanTopic}.` }
          ]
        ],
        chorusPrompts: [
          { line: "¡Baila, canta, ríe sin parar!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal y sus amigos en una gran fiesta de baile con luces de colores y burbujas.` },
          { line: `Con ${cleanTopic} vamos a soñar.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal durmiendo plácidamente sobre una nube flotante con elementos mágicos de ${cleanTopic}.` },
          { line: "¡Da una vuelta entera y vuelve a saltar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje principal dando un gran salto acrobático lleno de energía y chispas doradas.` },
          { line: "que esta fiesta nunca va a terminar!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un espectacular castillo de fuegos artificiales iluminando un carnaval infantil lleno de alegría.` }
        ]
      },
      // Canción 1: Mágica / Soñadora
      {
        verses: [
          `[Verso 1]\nUna luz destella en el cielo azul,\nbrilla suavemente como un gran tul.\nAbre bien los ojos, mira qué quietud,\nhoy con ${cleanTopic} nace una virtud.`,
          `[Verso 2]\nFlotan las burbujas lentas hacia el sol,\npintan mil caminos de un bello color.\nSiente la tibieza de este gran calor,\njunto con ${cleanTopic} todo es mucho mejor.`,
          `[Verso 3]\nCierra las pestañas, pide un gran deseo,\nvuela por las nubes en un balanceo.\nSuena una cajita con un tintineo,\nque con ${cleanTopic} gana el trofeo.`,
          `[Verso 4]\nGuarda el secreto en tu corazón,\ncanta muy bajito esta bella canción.\nDuerme muy tranquilo en tu habitación,\njunto con ${cleanTopic} y con emoción.`
        ],
        chorus: `[Coro]\n¡Vuela, sueña, flota sin temor!\nCon ${cleanTopic} siente el amor.\n¡Deja que las estrellas te den su resplandor,\nque esta noche mágica tiene un gran color!`,
        musicPrompt: "soft magical lullaby, sweet acoustic guitar, gentle chimes, calming female vocal, dreamy atmosphere",
        versePrompts: [
          [
            { line: "Una luz destella en el cielo azul,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un lindo personaje mirando una estrella fugaz brillante en un cielo nocturno azul profundo.` },
            { line: "brilla suavemente como un gran tul.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El mismo personaje envuelto en una estela de luz mágica y polvo de estrellas.` },
            { line: "Abre bien los ojos, mira qué quietud,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje caminando de puntillas por un bosque encantado de árboles luminosos.` },
            { line: `hoy con ${cleanTopic} nace una virtud.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje encontrando una flor de cristal brillante que representa ${cleanTopic}.` }
          ],
          [
            { line: "Flotan las burbujas lentas hacia el sol,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Burbujas gigantes y tornasoladas flotando en un prado mágico al amanecer.` },
            { line: "pintan mil caminos de un bello color.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje pintando un arcoíris en el aire con una varita mágica.` },
            { line: "Siente la tibieza de este gran calor,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje abrazando un pequeño sol animado y sonriente.` },
            { line: `junto con ${cleanTopic} todo es mucho mejor.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje y sus amigos sentados alrededor de una fogata mágica de ${cleanTopic}.` }
          ],
          [
            { line: "Cierra las pestañas, pide un gran deseo,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje con los ojos cerrados soplando un diente de león brillante.` },
            { line: "vuela por las nubes en un balanceo.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje meciéndose en un columpio que cuelga de una luna creciente.` },
            { line: "Suena una cajita con un tintineo,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una cajita musical de madera tallada abriéndose con bailarinas de luz.` },
            { line: `que con ${cleanTopic} gana el trofeo.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje levantando un trofeo de estrella dorada con el símbolo de ${cleanTopic}.` }
          ],
          [
            { line: "Guarda el secreto en tu corazón,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje guardando una llave dorada en un cofre mágico del tesoro.` },
            { line: "canta muy bajito esta bella canción.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje susurrando una melodía a un pajarito azul que descansa en su mano.` },
            { line: "Duerme muy tranquilo en tu habitación,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje arropado en una cama con sábanas de nubes y móviles de planetas.` },
            { line: `junto con ${cleanTopic} y con emoción.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Vista exterior de una casita mágica bajo un cielo estrellado con un letrero de ${cleanTopic}.` }
          ]
        ],
        chorusPrompts: [
          { line: "¡Vuela, sueña, flota sin temor!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje volando con alitas de luz sobre un mar de nubes rosadas.` },
          { line: `Con ${cleanTopic} siente el amor.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Corazones flotantes de neón rodeando al personaje y sus amigos de ${cleanTopic}.` },
          { line: "¡Deja que las estrellas te den su resplandor,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una lluvia de estrellas fugaces iluminando un hermoso palacio de cristal.` },
          { line: "que esta noche mágica tiene un gran color!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje durmiendo feliz con una sonrisa pacífica bajo un móvil mágico.` }
        ]
      },
      // Canción 2: Divertida / Salto
      {
        verses: [
          `[Verso 1]\nSalta que salta sin mirar atrás,\neste gran rebote te divertirá.\nMueve las rodillas, un salto audaz,\nhoy con ${cleanTopic} nadie parará.`,
          `[Verso 2]\nToca ya el cielo con el zapatón,\ncae suavecito en un gran colchón.\nRíen los amigos con gran emoción,\njunto con ${cleanTopic} en esta ocasión.`,
          `[Verso 3]\nGira como trompo, vuelve a comenzar,\neste baile loco te va a fascinar.\nChoca las manitas, ponte a zapatear,\nque con ${cleanTopic} vamos a triunfar.`,
          `[Verso 4]\nCorre muy deprisa, llega hasta el final,\nesta competencia ha sido genial.\nAlza la bandera de modo triunfal,\njunto con ${cleanTopic} fiesta sin igual.`
        ],
        chorus: `[Coro]\n¡Salta, brinca, corre sin parar!\nCon ${cleanTopic} vamos a jugar.\n¡Siente la energía que te va a llenar,\nque este juego loco nunca va a acabar!`,
        musicPrompt: "fast bouncy electro pop, playful rhythm, energetic beats, joyful kid chorus",
        versePrompts: [
          [
            { line: "Salta que salta sin mirar atrás,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un lindo personaje saltando con zapatos de resortes en un parque futurista.` },
            { line: "este gran rebote te divertirá.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El mismo personaje rebotando muy alto contra pelotas gigantes de goma de colores.` },
            { line: "Mueve las rodillas, un salto audaz,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje haciendo una pose acrobática divertida en el aire.` },
            { line: `hoy con ${cleanTopic} nadie parará.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una multitud de animalitos aplaudiendo y animando con carteles de ${cleanTopic}.` }
          ],
          [
            { line: "Toca ya el cielo con el zapatón,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El zapato del personaje tocando una nube esponjosa con chispas mágicas.` },
            { line: "cae suavecito en un gran colchón.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje aterrizando riendo sobre un enorme cojín de gelatina multicolor.` },
            { line: "Ríen los amigos con gran emoción,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Tres amigos simpáticos riendo a carcajadas sosteniéndose la barriga.` },
            { line: `junto con ${cleanTopic} en esta ocasión.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Todos celebrando alrededor de una gran torre de juguetes de ${cleanTopic}.` }
          ],
          [
            { line: "Gira como trompo, vuelve a comenzar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje girando rápidamente creando un torbellino de colores y confeti.` },
            { line: "este baile loco te va a fascinar.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una pista de baile con baldosas que se iluminan al pisarlas.` },
            { line: "Choca las manitas, ponte a zapatear,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje chocando los cinco con un robot amigable y simpático.` },
            { line: `que con ${cleanTopic} vamos a triunfar.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Fuegos artificiales de día formando el emblema de ${cleanTopic} en el cielo.` }
          ],
          [
            { line: "Corre muy deprisa, llega hasta el final,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje corriendo por una pista de carreras colorida cruzando una cinta de meta.` },
            { line: "esta competencia ha sido genial.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Confeti cayendo sobre el podio de ganadores con copas brillantes.` },
            { line: "Alza la bandera de modo triunfal,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje ondeando una gran bandera brillante con estrellas doradas.` },
            { line: `junto con ${cleanTopic} fiesta sin igual.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Gran foto grupal de todos los personajes saltando felices celebrando ${cleanTopic}.` }
          ]
        ],
        chorusPrompts: [
          { line: "¡Salta, brinca, corre sin parar!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje y sus amigos saltando en una mega colchoneta inflable de castillo.` },
          { line: `Con ${cleanTopic} vamos a jugar.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una feria de juegos espectacular llena de luces y atracciones de ${cleanTopic}.` },
          { line: "¡Siente la energía que te va a llenar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Rayos de luz dorada y chispas de energía rodeando al personaje sonriente.` },
          { line: "que este juego loco nunca va a acabar!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Globos gigantes soltándose al cielo en una celebración masiva y colorida.` }
        ]
      },
      // Canción 3: Curiosa / Exploración
      {
        verses: [
          `[Verso 1]\nToma tu lupa, vamos a buscar,\nun gran misterio en este lugar.\nMira las huellas que van por allá,\nhoy con ${cleanTopic} te sorprenderás.`,
          `[Verso 2]\nAbre la libreta, apunta muy bien,\nestos secretos que pocos los ven.\nSigue la pista del viejo andén,\njunto con ${cleanTopic} marchando al cien.`,
          `[Verso 3]\nUsa el sombrero de buen detective,\nmira qué cosas la ciencia concibe.\nEste misterio en tu mente vive,\nque con ${cleanTopic} a todos cautive.`,
          `[Verso 4]\nYa descubrimos la gran verdad,\ncon mucha astucia y curiosidad.\nCelebraremos con felicidad,\njunto con ${cleanTopic} y en amistad.`
        ],
        chorus: `[Coro]\n¡Busca, explora, mira con atención!\nCon ${cleanTopic} en cada rincón.\n¡Descubre el secreto de esta gran misión,\nque aprender es una hermosa pasión!`,
        musicPrompt: "curious acoustic pop, light percussion, marimba, inquisitive upbeat melody, cheerful vocals",
        versePrompts: [
          [
            { line: "Toma tu lupa, vamos a buscar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un lindo personaje con sombrero de explorador mirando a través de una lupa gigante brillante.` },
            { line: "un gran misterio en este lugar.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un mapa del tesoro antiguo brillando sobre una mesa de madera rústica.` },
            { line: "Mira las huellas que van por allá,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Huellas de patitas brillantes de color neón marcadas en un sendero de tierra.` },
            { line: `hoy con ${cleanTopic} te sorprenderás.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje descubriendo un artefacto mágico brillante relacionado con ${cleanTopic}.` }
          ],
          [
            { line: "Abre la libreta, apunta muy bien,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje escribiendo con una pluma luminosa en una libreta de cuero con broche de oro.` },
            { line: "estos secretos que pocos los ven.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Símbolos mágicos flotando en el aire revelándose bajo una luz ultravioleta mágica.` },
            { line: "Sigue la pista del viejo andén,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un trenecito de juguete antiguo pasando por un túnel misterioso iluminado.` },
            { line: `junto con ${cleanTopic} marchando al cien.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un equipo de simpáticos exploradores marchando con mochilas y linternas de ${cleanTopic}.` }
          ],
          [
            { line: "Usa el sombrero de buen detective,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje ajustándose una gabardina y sombrero a cuadros estilo Sherlock Holmes.` },
            { line: "mira qué cosas la ciencia concibe.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Tubos de ensayo coloridos burbujeando con humo mágico en un laboratorio infantil.` },
            { line: "Este misterio en tu mente vive,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Engranajes mágicos y bombillas de luz encendiéndose sobre la cabeza del personaje.` },
            { line: `que con ${cleanTopic} a todos cautive.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una gran pantalla holográfica mostrando un modelo 3D giratorio de ${cleanTopic}.` }
          ],
          [
            { line: "Ya descubrimos la gran verdad,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un cofre misterioso abriéndose revelando un cristal brillante y radiante.` },
            { line: "con mucha astucia y curiosidad.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje guiñando un ojo y sosteniendo una lupa con orgullo.` },
            { line: "Celebraremos con felicidad,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Globos y serpentinas saliendo de cañones de confeti en una biblioteca mágica.` },
            { line: `junto con ${cleanTopic} y en amistad.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Todos los amigos exploradores chocando sus tazas de chocolate caliente celebrando ${cleanTopic}.` }
          ]
        ],
        chorusPrompts: [
          { line: "¡Busca, explora, mira con atención!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje investigando un enorme árbol hueco lleno de cristales brillantes.` },
          { line: `Con ${cleanTopic} en cada rincón.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una habitación mágica llena de libros voladores y telescopios apuntando a ${cleanTopic}.` },
          { line: "¡Descubre el secreto de esta gran misión,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una puerta secreta de piedra abriéndose hacia un jardín secreto resplandeciente.` },
          { line: "que aprender es una hermosa pasión!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje graduándose con un birrete brillante y un diploma mágico de explorador.` }
        ]
      },
      // Canción 4: Festiva / Carnaval
      {
        verses: [
          `[Verso 1]\nSuenan tambores, empieza el compás,\neste gran ritmo te va a atrapar.\nPonte el disfraz de un color muy vivaz,\nhoy con ${cleanTopic} vamos a bailar.`,
          `[Verso 2]\nToca la flauta con mucha ilusión,\nsigue las palmas de esta canción.\nLluvia de dulces en cada rincón,\njunto con ${cleanTopic} y en el corazón.`,
          `[Verso 3]\nSube a la carroza que va a desfilar,\nlucen mil luces de un brillo estelar.\nToca la trompeta, ponte a marchar,\nque con ${cleanTopic} vamos a gozar.`,
          `[Verso 4]\nCae confeti de cinta y papel,\neste momento es dulce como miel.\nGuarda el recuerdo en un gran carrusel,\njunto con ${cleanTopic} pintando el pincel.`
        ],
        chorus: `[Coro]\n¡Canta, desfila, ríe con pasión!\nCon ${cleanTopic} en esta celebración.\n¡Siente la música y el acordeón,\nque este carnaval es pura emoción!`,
        musicPrompt: "festive latin pop, carnival rhythm, accordion, brass section, very happy upbeat dance",
        versePrompts: [
          [
            { line: "Suenan tambores, empieza el compás,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un lindo personaje tocando un tambor brillante con baquetas que desprenden chispas.` },
            { line: "este gran ritmo te va a atrapar.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Notas musicales tridimensionales bailando y girando alrededor de un escenario festivo.` },
            { line: "Ponte el disfraz de un color muy vivaz,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje probándose un sombrero de arlequín colorido con cascabeles dorados.` },
            { line: `hoy con ${cleanTopic} vamos a bailar.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una pista de carnaval al aire libre llena de animalitos disfrazados celebrando ${cleanTopic}.` }
          ],
          [
            { line: "Toca la flauta con mucha ilusión,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un osito simpático tocando una flauta mágica de la que salen mariposas de luz.` },
            { line: "sigue las palmas de esta canción.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una multitud alegre aplaudiendo al unísono bajo guirnaldas de luces de colores.` },
            { line: "Lluvia de dulces en cada rincón,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Caramelos y paletas gigantes cayendo suavemente del cielo en paracaídas.` },
            { line: `junto con ${cleanTopic} y en el corazón.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una gran piñata con forma de estrella rompiéndose soltando premios de ${cleanTopic}.` }
          ],
          [
            { line: "Sube a la carroza que va a desfilar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una carroza de carnaval espectacular decorada con flores luminosas y ruedas doradas.` },
            { line: "lucen mil luces de un brillo estelar.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Focos de teatro y rayos láser multicolores iluminando el cielo nocturno del desfile.` },
            { line: "Toca la trompeta, ponte a marchar,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje tocando una trompeta dorada liderando una banda de música infantil.` },
            { line: `que con ${cleanTopic} vamos a gozar.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Globos aerostáticos coloridos sobrevolando el carnaval de ${cleanTopic}.` }
          ],
          [
            { line: "Cae confeti de cinta y papel,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Una tormenta mágica de confeti brillante y cintas doradas cubriendo a los personajes.` },
            { line: "este momento es dulce como miel.", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje compartiendo un enorme algodón de azúcar con un amigo.` },
            { line: "Guarda el recuerdo en un gran carrusel,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un hermoso carrusel iluminado girando con caballitos de cristal mágicos.` },
            { line: `junto con ${cleanTopic} pintando el pincel.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Gran escena final de carnaval con todos bailando bajo fuegos artificiales de ${cleanTopic}.` }
          ]
        ],
        chorusPrompts: [
          { line: "¡Canta, desfila, ríe con pasión!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El personaje bailando samba alegremente con un traje brillante de plumas de luz.` },
          { line: `Con ${cleanTopic} en esta celebración.`, prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un espectáculo de fuentes de agua danzantes iluminadas con los colores de ${cleanTopic}.` },
          { line: "¡Siente la música y el acordeón,", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. Un simpático gato tocando un acordeón festivo rodeado de notas musicales brillantes.` },
          { line: "que este carnaval es pura emoción!", prompt: `3D estilo cartoon infantil, brillo, colores vibrantes. El cielo nocturno iluminado por un espectáculo masivo de drones formando a ${cleanTopic}.` }
        ]
      }
    ];

    const currentSong = songs[songIndex];

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
      const audio = item.isChorus ? currentSong.chorus : currentSong.verses[item.verseIndex];
      const imagePrompts = item.isChorus ? (i === 1 ? currentSong.chorusPrompts : []) : currentSong.versePrompts[item.verseIndex];
      const scriptItem = { audio, imagePrompts };
      if (i === 0) {
        scriptItem.musicPrompt = currentSong.musicPrompt;
      }
      script.push(scriptItem);
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

export const getFallbackMetadata = (topic, videoType) => {
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

export const getFallbackThumbnail = (topic, videoType) => {
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
      model: getGeminiModelName(),
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 1.0
      }
    });

    let prompt = "";
    if (videoType === "musical") {
      prompt = `Actúa como un compositor experto de canciones infantiles virales para YouTube y director de arte de animación.
Tema ingresado por el usuario: "${topic}".
Duración aproximada: ${duration}.

IMPORTANTE Y OBLIGATORIO PARA LA CREATIVIDAD Y ORIGINALIDAD:
¡NO uses fórmulas genéricas ni repitas estructuras, melodías o rimas de otras canciones! Cada canción generada debe ser 100% ÚNICA, ORIGINAL, con un ritmo, métrica, vocabulario y enfoque completamente DIFERENTE y adaptado exclusivamente a la esencia, humor y universo del tema.
Si el tema es sobre dinosaurios, hazla enérgica y gigante; si es sobre estrellitas o dormir, hazla suave y mágica; si es sobre carritos o carreras, hazla veloz y roquera. ¡Inventa una melodía conceptual y rimas sorprendentes que no se parezcan a ninguna otra canción anterior!

IMPORTANTE Y OBLIGATORIO DE ESTRUCTURA Y CALIDAD DE LETRA:
1. CORRECCIÓN ORTOGRÁFICA Y GRAMATICAL OBLIGATORIA: Si el tema ingresado por el usuario ("${topic}") contiene errores de ortografía, errores de tipeo o gramaticales (por ejemplo, si escribe "dinoaurios" en vez de "dinosaurios", o "abja" en vez de "abeja"), DEBES CORREGIR el tema internamente antes de componer la canción. Toda la letra generada debe basarse en el tema correctamente escrito y tener una ortografía y gramática impecables en español neutro. ¡Bajo ninguna circunstancia incluyas el error ortográfico del usuario en la letra!
2. LETRA COMPLETAMENTE LIMPIA (SIN EMOJIS NI PALABRAS RARAS): El texto en la propiedad "audio" debe ser texto plano completamente limpio. NO incluyas ningún emoji (❌), ningún símbolo musical (🎵), ningún símbolo extraño ni palabras raras, inventadas o complejas. Usa un vocabulario infantil natural, claro y correcto. ¡ESTÁ ESTRICTAMENTE PROHIBIDO USAR EMOJIS EN LOS COROS Y EN LOS VERSOS!
3. Genera la letra de la canción estructurada en 8 secciones exactas (Verso 1, Coro, Verso 2, Coro, Verso 3, Coro, Verso 4, Coro Final).
4. TANTO EL CORO COMO CADA VERSO DEBEN TENER EXACTAMENTE 4 LÍNEAS DE LETRA (ni 3, ni 5, ni 6; obligatoriamente 4 líneas de letra cada uno).
5. Las líneas deben ser cortas, con una estructura y métrica pareja, constante y fluida para que sea extremadamente fácil de cantar y ponerle ritmo musical.
6. LA LETRA DEBE SER SUMAMENTE CREATIVA Y CONTAR UNA HISTORIA DIVERTIDA SOBRE EL TEMA DADO ("${topic}"). IMPORTANTE: NO intentes rimar o repetir el nombre completo del tema de forma literal y forzada en cada línea. La canción debe hablar SOBRE el tema (por ejemplo, si el tema es 'Perro espacial 🐕‍🚀', cuenta la historia de un perrito astronauta viajando por las estrellas y la luna, sin necesidad de repetir la frase 'perro espacial' de manera forzada en cada rima).
7. NO generes propiedades de tiempo ("time") ni descripciones visuales generales ("visual").

REGLAS PARA LA LETRA ("audio"):
- El "Coro" debe ser sumamente llamativo, pegadizo y alegre para atraer a los niños. El mismo coro se repite de forma idéntica después de cada verso. ¡RECUERDA: NO USES EMOJIS EN EL CORO! Su atractivo debe basarse únicamente en la letra y el ritmo.
- Cada "Verso" (Verso 1, Verso 2, Verso 3, Verso 4) debe tener exactamente 4 líneas rimadas contando una parte nueva y divertida de la historia. Las líneas deben ser cortas y con buen ritmo para que al momento de cantar o producir la canción todo cuadre perfectamente. Ejemplo de un verso de 4 líneas cortas:
Si escondo su hueso, lo encuentra al revés,
rasca la alfombra con patas otra vez.
Trae sus juguetes, los pone a mis pies,
¡me entiende muy rápido, en un, dos y tres!

REGLAS PARA EL PROMPT MUSICAL ("musicPrompt"):
- En el PRIMER objeto del array (el del Verso 1), DEBES incluir una propiedad "musicPrompt".
- REGLA DE TONO Y VARIEDAD: El estilo musical SIEMPRE debe ser alegre, divertido, positivo y con buen ritmo para encantar a los niños (usa términos obligatorios en inglés como "happy, upbeat, fun, joyful, cheerful, catchy melody").
- CAMBIO DINÁMICO SEGÚN EL TEMA: Aunque siempre sea alegre y divertido, el género musical específico, el ritmo y los instrumentos DEBEN CAMBIAR dinámicamente basándose en el tema y la letra de la canción. Por ejemplo, si el tema es de piratas: "happy sea shanty pop, upbeat accordion, fun acoustic guitar, cheerful kid chorus"; si es del espacio: "fun synth pop, upbeat electronic beats, happy cosmic melody, cheerful vocals"; si es de dinosaurios: "energetic jungle pop, happy tribal percussion, fun bouncy bass, joyful kid songs".
- Debe ser ideal para herramientas como Suno AI o Udio.
- OBLIGATORIO: DEBE ESTAR EN INGLÉS. Los demás objetos no necesitan esta propiedad.

REGLAS PARA LOS PROMPTS DE IMÁGENES ("imagePrompts") Y COHERENCIA DE PERSONAJES:
- Para cada sección, debes proporcionar un array "imagePrompts".
- Por cada una de las líneas de la letra en esa sección, genera un objeto con la línea exacta ("line") y un prompt de imagen por IA ("prompt") que represente lo que dice esa línea.
- REGLA ESTRICTA DE COHERENCIA DE ESTILO: Todos y cada uno de los prompts generados DEBEN comenzar exactamente con la misma instrucción de estilo maestro: "3D estilo cartoon infantil, brillo, colores vibrantes."
- REGLA MAESTRA DE COHERENCIA DE PERSONAJES (¡CRÍTICO PARA LA ARMONÍA DEL VIDEO!): Para que las IAs generadoras de imágenes (DALL-E 3, Midjourney, Ideogram, etc.) mantengan al mismo personaje a lo largo de todo el video y no cambien su apariencia en cada foto, DEBES INVENTAR UNA DESCRIPCIÓN VISUAL FIJA Y EXTREMADAMENTE DETALLADA del personaje o personajes principales (sean niños, animales o ambos) al inicio del proceso y REPETIR ESA EXACTA DESCRIPCIÓN VISUAL VERBATIM en todos y cada uno de los prompts de la canción.
- Por ejemplo, si el protagonista es un perrito, NO escribas solo "un perrito travieso". Debes inventar y usar en todos los prompts una descripción fija como: "El mismo cachorro Beagle pequeño con orejas largas y caídas, pelaje blanco con manchas color caramelo y un collar azul brillante". Si es un oso: "El mismo oso pardo bebé gordito, con pelaje suave color canela, grandes ojos negros expresivos y un moño rojo en el cuello". Si es un niño: "El mismo niño de 5 años con cabello castaño rizado, pecas en las mejillas, usando una camiseta amarilla y overoles de mezclilla".
- Estructura obligatoria de cada prompt: "3D estilo cartoon infantil, brillo, colores vibrantes. [DESCRIPCIÓN VISUAL FIJA DEL PERSONAJE PRINCIPAL], [Acción y entorno específico de la línea actual]."
- Mantén esta coherencia escrupulosamente en todos los versos y coros.
- Para las repeticiones del Coro (después del Verso 2, Verso 3, Verso 4), puedes dejar el array "imagePrompts" vacío o repetir el mismo del primer coro, ya que en la interfaz mostraremos los prompts del coro una única vez.

Devuelve estrictamente un array JSON de objetos con el formato:
[
  { 
    "audio": "[Verso 1]\nSi escondo su hueso, lo encuentra al revés,\nrasca la alfombra con patas otra vez.\nTrae sus juguetes, los pone a mis pies,\n¡me entiende muy rápido, en un, dos y tres!",
    "musicPrompt": "upbeat children's pop, happy acoustic guitar, bouncy rhythm, catchy melody, cheerful male vocal",
    "imagePrompts": [
      { "line": "Si escondo su hueso, lo encuentra al revés,", "prompt": "3D estilo cartoon infantil, brillo, colores vibrantes. El mismo cachorro Beagle pequeño con orejas largas y caídas, pelaje blanco con manchas color caramelo y un collar azul brillante, buscando su hueso debajo de un sofá amarillo en una sala acogedora." },
      { "line": "rasca la alfombra con patas otra vez.", "prompt": "3D estilo cartoon infantil, brillo, colores vibrantes. El mismo cachorro Beagle pequeño con orejas largas y caídas, pelaje blanco con manchas color caramelo y un collar azul brillante, rascando una alfombra azul con texturas suaves y detalladas." },
      { "line": "Trae sus juguetes, los pone a mis pies,", "prompt": "3D estilo cartoon infantil, brillo, colores vibrantes. El mismo cachorro Beagle pequeño con orejas largas y caídas, pelaje blanco con manchas color caramelo y un collar azul brillante, con una pelota roja en la boca frente a los zapatos de un niño." },
      { "line": "¡me entiende muy rápido, en un, dos y tres!", "prompt": "3D estilo cartoon infantil, brillo, colores vibrantes. El mismo cachorro Beagle pequeño con orejas largas y caídas, pelaje blanco con manchas color caramelo y un collar azul brillante, chocando los cinco con un niño alegre entre destellos mágicos." }
    ]
  },
  { 
    "audio": "[Coro]\n¡Baila, canta, ríe sin parar!\nCon el osito vamos a soñar.\n¡Da una vuelta entera y vuelve a saltar,\nque esta fiesta nunca va a terminar!",
    "imagePrompts": [
      { "line": "¡Baila, canta, ríe sin parar!", "prompt": "3D estilo cartoon infantil, brillo, colores vibrantes. El mismo cachorro Beagle pequeño con orejas largas y caídas, pelaje blanco con manchas color caramelo y un collar azul brillante, bailando alegremente junto a un osito de peluche bajo luces de colores." }
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
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(text);
    
    // Post-procesamiento estricto para eliminar cualquier emoji o símbolo residual del audio sin perder saltos de línea
    if (Array.isArray(parsedData)) {
      parsedData.forEach(item => {
        if (item.audio) {
          // Eliminar rangos comunes de emojis
          item.audio = item.audio.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{2B50}]|[\u{2B55}]|[\u{23F3}]|[\u{23F0}]|[\u{23E9}-\u{23EC}]|[\u{25B6}]/gu, '');
        }
      });
    }
    return parsedData;
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
      model: getGeminiModelName(),
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
      model: getGeminiModelName(),
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

export const generateRecommendedTopics = async (count = 1, excludeTopics = []) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: getGeminiModelName(),
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Actúa como un director creativo experto en canales de YouTube infantiles.
Genera un array JSON con exactamente ${count} ideas de temas creativos, divertidos y llamativos para videos infantiles (cuentos, canciones o videos educativos).
REGLA CRÍTICA: Cada tema debe ser muy corto, conciso y directo, de máximo 2 o 3 palabras (un concepto descriptivo simple).
Cada tema debe incluir un emoji infantil y coherente al final.
Ejemplos de formato corto obligatorio:
"Robot bailarín 🤖"
"Perro espacial 🐕‍🚀"
"Gatito bombero 🐱"
"Dinosaurio dentista 🦖"
"Tren del arcoíris 🌈"

Temas que debes EXCLUIR (no los repitas bajo ninguna circunstancia): ${JSON.stringify(excludeTopics)}

Devuelve estrictamente un array JSON de strings con las nuevas ideas de temas:
[
  "Tema 1...",
  "Tema 2..."
]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
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
  
  const scriptText = scriptData.map(s => s.audio).join('\n');
  const prompt = `Genera prompts de imágenes para un video musical infantil 3D sobre: "${topic}".
Basado en esta letra:
${scriptText}

Devuelve un JSON Array de objetos, un objeto por cada sección de la letra. Cada objeto debe tener la propiedad "imagePrompts", que es un array de objetos con "line" (la línea de la letra en español) y "prompt" (el prompt de imagen en INGLÉS).
Reglas:
- 4 imagePrompts por sección.
- Estilo en el prompt visual (inglés): 3D cartoon style for kids, bright, vibrant colors.
- Consistencia del personaje.
- FORMATO EXACTO: [{ "imagePrompts": [{ "line": "...", "prompt": "..." }] }]`;
  
  const result = await model.generateContent(prompt);
  let s = result.response.text().trim();
  if (s.startsWith('\`\`\`json')) s = s.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
  else if (s.startsWith('\`\`\`')) s = s.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
  
  return JSON.parse(s);
};

export const generateMusicPromptForScript = async (topic, scriptData) => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: getGeminiModelName(), generationConfig: { responseMimeType: "application/json", temperature: 1.0 } });
  
  const prompt = `Genera un prompt de estilo musical en inglés para una canción infantil muy alegre, pegadiza y bailable sobre "${topic}".
Devuelve un JSON con formato: { "musicPrompt": "..." }`;
  
  const result = await model.generateContent(prompt);
  let s = result.response.text().trim();
  if (s.startsWith('\`\`\`json')) s = s.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
  else if (s.startsWith('\`\`\`')) s = s.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
  
  return JSON.parse(s);
};

export const generateAllContent = async (topic, duration = "1 minuto", videoType = "historia") => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: getGeminiModelName(), generationConfig: { responseMimeType: "application/json", temperature: 1.0 } });

    const prompt = `Actúa como un equipo experto de producción de YouTube (Guionista, SEO y Director de Arte).
Tema: "${topic}"
Tipo de video: "${videoType}"

Genera todo el contenido para este video en un solo JSON con la siguiente estructura exacta:
{
  "script": [
    { "audio": "[Coro]\\n...", "time": "0:00 - 0:15" },
    { "audio": "[Verso 1]\\n...", "time": "0:15 - 0:30" },
    { "audio": "[Coro]\\n...", "time": "0:30 - 0:45" },
    { "audio": "[Verso 2]\\n...", "time": "0:45 - 1:00" },
    { "audio": "[Coro]\\n...", "time": "1:00 - 1:15" },
    { "audio": "[Verso 3]\\n...", "time": "1:15 - 1:30" },
    { "audio": "[Coro]\\n...", "time": "1:30 - 1:45" },
    { "audio": "[Verso 4]\\n...", "time": "1:45 - 2:00" }
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
  7. LA LETRA DEBE SER SUMAMENTE CREATIVA Y CONTAR UNA HISTORIA DIVERTIDA SOBRE EL TEMA DADO ("${topic}"). IMPORTANTE: NO intentes rimar o repetir el nombre completo del tema de forma literal y forzada en cada línea. La canción debe hablar SOBRE el tema (por ejemplo, si el tema es 'Perro espacial 🐕‍🚀', cuenta la historia de un perrito astronauta viajando por las estrellas y la luna, sin necesidad de repetir la frase 'perro espacial' de manera forzada en cada rima).
- Si es historia o narración: divídelo en segmentos de tiempo, sin repetir historias.
- IMPORTANTE: SOLO genera las propiedades "audio" y "time" dentro del array "script". NO generes "imagePrompts" ni "musicPrompt" aquí.

REGLAS PARA METADATA:
- Títulos llamativos y virales con emojis.
- 15 hashtags relevantes.

REGLAS PARA THUMBNAIL:
- visualPrompt detallado en español para generadores como Midjourney, 3D cartoon infantil.
- suggestedText máximo 3 palabras en mayúsculas.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    else if (text.startsWith('\`\`\`')) text = text.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    
    const parsedData = JSON.parse(text);
    if (parsedData && Array.isArray(parsedData.script)) {
      parsedData.script.forEach(item => {
        if (item.audio) {
          item.audio = item.audio.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{2B50}]|[\u{2B55}]|[\u{23F3}]|[\u{23F0}]|[\u{23E9}-\u{23EC}]|[\u{25B6}]/gu, '');
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
