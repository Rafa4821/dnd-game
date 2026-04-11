import type { CampaignNode } from '@/types/campaign'

/**
 * Nodos de Campaña V2 - Sangrebruma
 * 18 nodos con estructura completa, rutas múltiples, puzzles, diálogos y assets
 * Basado en Campaña v2.md
 */

export const CAMPAIGN_V2_NODES: CampaignNode[] = [
  // ============================================
  // ACTO 1: EL VALLE DE LA NIEBLA (N01-N06)
  // ============================================
  
  {
    id: 'N01',
    type: 'narrative',
    title: 'Arribo a Sangrebruma',
    description: `La niebla carmesí envuelve el valle mientras vuestro carruaje se detiene ante las puertas del pueblo. 
    
El cochero, pálido y tembloroso, se niega a continuar. "No pasaré de aquí", murmura. "Hace tres lunas que los gritos cesaron... y el silencio es peor."

Ante vosotros se alza Sangrebruma: edificios oscurecidos, ventanas vacías, chimeneas sin humo. Solo el viento rompe el silencio.`,
    nextNodeId: 'N02',
    check: null,
    encounterId: null,
    assetManifestId: 'manifest_n01',
    act: 1,
    location: 'Entrada del Valle',
    scaling: {
      minPlayers: 2,
      maxPlayers: 6,
    },
  },
  
  {
    id: 'N02',
    type: 'narrative',
    title: 'Posada del Ajo Negro',
    description: `La posada es el único edificio con luz. El fuego arde bajo en la chimenea.

Mara Carbón, la posadera, os mira desde detrás del mostrador. Su rostro curtido muestra desconfianza, pero también un destello de esperanza.

"¿Cazadores?", pregunta con voz rasposa. "Llevan meses sin llegar. El valle está maldito desde que él vino... desde que el noble ocupó la abadía."`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    dialogueId: 'dialogue_posada_01',
    assetManifestId: 'manifest_n02',
    options: [
      {
        id: 'ask_about_abbey',
        text: 'Preguntar sobre la abadía y el noble',
        nextNodeId: 'N02A',
        setsFlags: { F_POSADA_ALIADA: true },
      },
      {
        id: 'ask_about_fog',
        text: 'Preguntar sobre la niebla carmesí',
        nextNodeId: 'N02B',
        setsFlags: { F_SABE_NIEBLA: true },
      },
      {
        id: 'leave_quickly',
        text: 'Agradecer y partir de inmediato',
        nextNodeId: 'N03',
      },
    ],
    act: 1,
    location: 'Posada del Ajo Negro',
  },
  
  {
    id: 'N02A',
    type: 'narrative',
    title: 'Información sobre la Abadía',
    description: `Mara se inclina hacia adelante, bajando la voz.

"El conde Dragomir llegó hace seis meses. Decía venir en peregrinación, pero ocupó la abadía y expulsó a los monjes. Desde entonces, los muertos caminan y la niebla se espesa cada noche."

Te entrega un mapa manchado de sangre. "Los aldeanos que intentaron huir... nunca salieron del cementerio."`,
    nextNodeId: 'N03',
    check: null,
    encounterId: null,
    setsFlags: { F_MAPA_OBTENIDO: true },
    act: 1,
    location: 'Posada del Ajo Negro',
  },
  
  {
    id: 'N02B',
    type: 'narrative',
    title: 'Información sobre la Niebla',
    description: `"La niebla", dice Mara con un escalofrío, "no es natural. Huele a hierro y muerte. Los que respiran demasiado profundo... cambian."

"He visto aldeanos volverse pálidos, sedientos. Otros se vuelven salvajes, con colmillos y garras. La niebla los corrompe desde dentro."

Te muestra frascos con ajo picado. "Llevad esto. No sé si sirve, pero es lo único que tengo."`,
    nextNodeId: 'N03',
    check: null,
    encounterId: null,
    setsFlags: { F_TIENE_AJO: true },
    modifiesVariables: { corruption: -1 },
    act: 1,
    location: 'Posada del Ajo Negro',
  },
  
  {
    id: 'N03',
    type: 'narrative',
    title: 'El Mapa de la Niebla',
    description: `En la posada, encontráis un mapa antiguo del valle. Está manchado y parcialmente ilegible, pero muestra varias rutas posibles.

**Opciones de ruta:**
- **Cementerio de San Vid**: La ruta directa a la abadía. Peligrosa pero rápida.
- **Bosque del Lobo Blanco**: Ruta más larga que rodea el cementerio. Dicen que una criatura antigua acecha allí.
- **Puzzle cooperativo**: Si tenéis el mapa obtenido de Mara, podéis resolver un antiguo código para encontrar un paso secreto.`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    puzzleId: 'puzzle_mapa',
    options: [
      {
        id: 'route_cemetery',
        text: 'Ir directamente al Cementerio de San Vid',
        nextNodeId: 'N04',
        requirements: {},
      },
      {
        id: 'route_forest',
        text: 'Rodear por el Bosque del Lobo Blanco',
        nextNodeId: 'N06',
        requirements: {},
      },
      {
        id: 'solve_puzzle',
        text: 'Resolver el código del mapa (requiere mapa de Mara)',
        nextNodeId: 'N03_PUZZLE',
        requirements: { F_MAPA_OBTENIDO: true },
      },
    ],
    act: 1,
    location: 'Posada del Ajo Negro',
  },
  
  {
    id: 'N03_PUZZLE',
    type: 'narrative',
    title: 'La Rueda de Ceniza',
    description: `El mapa revela símbolos extraños que forman una especie de cerradura circular. Al examinarla, descubrís que es un puzzle cooperativo antiguo.

**Puzzle: La Rueda de Ceniza**
- Cada jugador controla un anillo concéntrico con símbolos
- Deben alinearse correctamente según pistas del mapa
- Éxito: Revela un túnel secreto que evita tanto el cementerio como el bosque
- Fracaso: Alerta a los no-muertos, enfrentamiento inevitable`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    puzzleId: 'puzzle_rueda_ceniza',
    act: 1,
    location: 'Posada del Ajo Negro',
  },
  
  {
    id: 'N04',
    type: 'narrative',
    title: 'Cementerio de San Vid',
    description: `Las lápidas torcidas emergen de la niebla como dientes rotos. El aire huele a tierra removida y descomposición.

Un sepulturero anciano cava una tumba. Al veros, se detiene y apoya su pala.

"Más carne fresca para las fosas", dice sin emoción. "¿Venís a uniros a ellos o a intentar detenerlo?"`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    dialogueId: 'dialogue_sepulturero_01',
    options: [
      {
        id: 'talk_gravedigger',
        text: 'Hablar con el sepulturero (requiere tag_barbaro)',
        nextNodeId: 'N04A',
        requirements: { tag_barbaro: true },
      },
      {
        id: 'investigate_graves',
        text: 'Investigar las tumbas',
        nextNodeId: 'N04B',
        check: {
          skill: 'investigation',
          dc: 12,
        },
      },
      {
        id: 'proceed_combat',
        text: 'Avanzar hacia la abadía',
        nextNodeId: 'N04_COMBAT',
      },
    ],
    act: 1,
    location: 'Cementerio de San Vid',
  },
  
  {
    id: 'N04A',
    type: 'narrative',
    title: 'Conversación con el Sepulturero',
    description: `El sepulturero solo habla con el bárbaro del grupo, reconociendo algo en su mirada.

"Eres como yo", dice. "Has visto la muerte de cerca. Escucha: la cripta bajo la capilla tiene un paso a las catacumbas. Evita a los guardias de superficie."

Te entrega una llave oxidada. "No me preguntes cómo la conseguí."`,
    nextNodeId: 'N05',
    check: null,
    encounterId: null,
    setsFlags: { F_LLAVE_CRIPTA: true, F_ATAJO_DISPONIBLE: true },
    act: 1,
    location: 'Cementerio de San Vid',
  },
  
  {
    id: 'N04B',
    type: 'check',
    title: 'Investigar las Tumbas',
    description: `Examináis las lápidas buscando pistas.`,
    nextNodeId: null,
    check: {
      skill: 'investigation',
      dc: 12,
      groupCheck: false,
      onSuccess: {
        description: 'Encontráis patrones en las fechas de muerte: todas dentro de las últimas 6 lunas. Una lápida reciente tiene garras marcadas desde dentro.',
        nextNodeId: 'N04_COMBAT',
        setsFlags: { F_PATRÓN_DESCUBIERTO: true },
      },
      onFailure: {
        description: 'No notáis nada inusual, pero algo se mueve entre las tumbas...',
        nextNodeId: 'N04_COMBAT',
      },
    },
    encounterId: null,
    act: 1,
    location: 'Cementerio de San Vid',
  },
  
  {
    id: 'N04_COMBAT',
    type: 'combat',
    title: 'Emboscada en el Cementerio',
    description: `Las tumbas se abren. Esqueletos y murciélagos de ceniza emergen de las fosas, sus ojos brillando con luz antinatural.`,
    nextNodeId: 'N05',
    check: null,
    encounterId: 'E02',
    act: 1,
    location: 'Cementerio de San Vid',
  },
  
  {
    id: 'N05',
    type: 'narrative',
    title: 'La Abadía Abandonada',
    description: `Los muros de piedra de la abadía se alzan ante vosotros, cubiertos de hiedra marchita. Las ventanas góticas están rotas, y un resplandor rojo pulsa desde el interior.

La puerta principal está entreabierta. Un rastro de sangre seca conduce hacia las profundidades.

Podéis sentir que algo antiguo y hambriento os espera dentro.`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    options: [
      {
        id: 'main_entrance',
        text: 'Entrar por la puerta principal',
        nextNodeId: 'N07',
      },
      {
        id: 'crypt_entrance',
        text: 'Usar la llave de la cripta (si la tenéis)',
        nextNodeId: 'N08',
        requirements: { F_LLAVE_CRIPTA: true },
      },
      {
        id: 'explore_perimeter',
        text: 'Explorar el perímetro',
        nextNodeId: 'N05A',
      },
    ],
    act: 1,
    location: 'Abadía de San Vid',
  },
  
  {
    id: 'N05A',
    type: 'check',
    title: 'Explorar el Perímetro',
    description: `Rodeáis la abadía buscando otras entradas.`,
    nextNodeId: null,
    check: {
      skill: 'perception',
      dc: 14,
      groupCheck: false,
      onSuccess: {
        description: 'Encontráis una ventana rota en el segundo piso. Con una cuerda podríais subir y evitar la entrada principal.',
        nextNodeId: 'N05B',
        setsFlags: { F_ENTRADA_VENTANA: true },
      },
      onFailure: {
        description: 'No encontráis nada útil. Tendréis que usar la entrada principal.',
        nextNodeId: 'N07',
      },
    },
    encounterId: null,
    act: 1,
    location: 'Abadía de San Vid',
  },
  
  {
    id: 'N05B',
    type: 'narrative',
    title: 'Entrada por la Ventana',
    description: `Trepáis por la cuerda hasta la ventana del segundo piso. Entrais a lo que parece ser una antigua biblioteca.

Los estantes están vacíos excepto por volúmenes chamuscados. En el centro de la sala, un monje hueco lee un libro en silencio, ajeno a vuestra presencia... por ahora.`,
    nextNodeId: 'N09',
    check: null,
    encounterId: null,
    setsFlags: { F_ENTRADA_SIGILOSA: true },
    act: 1,
    location: 'Biblioteca de la Abadía',
  },
  
  {
    id: 'N06',
    type: 'narrative',
    title: 'Bosque del Lobo Blanco',
    description: `Los árboles retorcidos crean un dosel que bloquea lo poco de luz que penetra la niebla. Aullidos distantes resuenan entre los troncos.

Veis marcas de garras en los árboles, algunas tan profundas que han arrancado la corteza completa.

Un rastro de sangre fresca conduce más adentro del bosque.`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    options: [
      {
        id: 'follow_blood',
        text: 'Seguir el rastro de sangre',
        nextNodeId: 'N06_COMBAT',
      },
      {
        id: 'avoid_trail',
        text: 'Evitar el rastro y rodear',
        nextNodeId: 'N06A',
        check: {
          skill: 'stealth',
          dc: 13,
        },
      },
      {
        id: 'set_trap',
        text: 'Preparar una trampa (requiere tag_alquimista o tag_tirador)',
        nextNodeId: 'N06B',
        requirements: { tag_alquimista: true },
      },
    ],
    act: 1,
    location: 'Bosque del Lobo Blanco',
  },
  
  {
    id: 'N06_COMBAT',
    type: 'combat',
    title: 'Patrulla del Lobo Blanco',
    description: `Lobos corrompidos por la niebla os rodean, sus ojos brillando en rojo. Trabajan en manada, coordinados y letales.`,
    nextNodeId: 'N07',
    check: null,
    encounterId: 'E04',
    act: 1,
    location: 'Bosque del Lobo Blanco',
  },
  
  {
    id: 'N06A',
    type: 'check',
    title: 'Rodear Sigilosamente',
    description: `Intentáis evitar la patrulla de lobos moviéndoos en silencio.`,
    nextNodeId: null,
    check: {
      skill: 'stealth',
      dc: 13,
      groupCheck: false,
      onSuccess: {
        description: 'Lográis pasar desapercibidos. Los aullidos se alejan mientras os acercáis a la abadía.',
        nextNodeId: 'N07',
        modifiesVariables: { stealth_bonus: 1 },
      },
      onFailure: {
        description: 'Una rama cruje bajo vuestros pies. Los aullidos se acercan rápidamente.',
        nextNodeId: 'N06_COMBAT',
      },
    },
    encounterId: null,
    act: 1,
    location: 'Bosque del Lobo Blanco',
  },
  
  {
    id: 'N06B',
    type: 'narrative',
    title: 'Trampa Preparada',
    description: `Usando vuestros conocimientos, preparáis una trampa explosiva en el camino. Los lobos caen en ella, dándoos ventaja táctica.`,
    nextNodeId: 'N06_COMBAT',
    check: null,
    encounterId: null,
    setsFlags: { F_TRAMPA_LISTA: true },
    act: 1,
    location: 'Bosque del Lobo Blanco',
  },
  
  // ============================================
  // ACTO 2: LA ABADÍA Y EL LABORATORIO (N07-N12)
  // ============================================
  
  {
    id: 'N07',
    type: 'narrative',
    title: 'Puente de los Colgados',
    description: `Un puente de madera podrida cruza un barranco. Colgando de las vigas, hay cadáveres con sogas al cuello.

Cuando os acercáis, los cuerpos se retuercen. Las sogas cobran vida, alcanzando hacia vosotros.

Un diálogo cooperativo está disponible si tenéis el tag correcto.`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    dialogueId: 'dialogue_puente_01',
    options: [
      {
        id: 'talk_to_hanged',
        text: 'Intentar hablar con los ahorcados (requiere tag_erudito o tag_nigromante)',
        nextNodeId: 'N07A',
        requirements: { tag_erudito: true },
      },
      {
        id: 'fight_guardians',
        text: 'Prepararse para el combate',
        nextNodeId: 'N07_COMBAT',
      },
      {
        id: 'burn_bridge',
        text: 'Quemar el puente (requiere tag_alquimista)',
        nextNodeId: 'N07B',
        requirements: { tag_alquimista: true },
      },
    ],
    act: 2,
    location: 'Puente de los Colgados',
  },
  
  {
    id: 'N07A',
    type: 'narrative',
    title: 'Susurros de los Ahorcados',
    description: `Tu conocimiento de lo arcano te permite entender los susurros.

"Liberación... busca... en la biblioteca... el nombre..."

Los ahorcados se calman brevemente, permitiéndoos pasar sin combate. Pero la perturbación ha alertado a otros.`,
    nextNodeId: 'N08',
    check: null,
    encounterId: null,
    setsFlags: { F_PISTA_BIBLIOTECA: true },
    act: 2,
    location: 'Puente de los Colgados',
  },
  
  {
    id: 'N07B',
    type: 'narrative',
    title: 'Puente en Llamas',
    description: `Usáis aceite alquímico para prender fuego al puente. Los ahorcados se retuercen en las llamas, pero no pueden cruzar.

El camino está bloqueado tras vosotros. No hay vuelta atrás.`,
    nextNodeId: 'N08',
    check: null,
    encounterId: null,
    setsFlags: { F_PUENTE_QUEMADO: true },
    modifiesVariables: { no_retreat: 1 },
    act: 2,
    location: 'Puente de los Colgados',
  },
  
  {
    id: 'N07_COMBAT',
    type: 'combat',
    title: 'Batalla en el Puente',
    description: `Los Ahogados de Soga y el Guardián de Cuerda atacan, intentando arrastraros del puente.`,
    nextNodeId: 'N08',
    check: null,
    encounterId: 'E08',
    act: 2,
    location: 'Puente de los Colgados',
  },
  
  {
    id: 'N08',
    type: 'narrative',
    title: 'Catacumbas Bajo la Abadía',
    description: `Las escaleras descienden a túneles de piedra húmeda. Nichos en las paredes contienen huesos apilados.

El aire es denso y difícil de respirar. Escucháis pasos arrastrándose en la oscuridad.`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    options: [
      {
        id: 'explore_catacombs',
        text: 'Explorar las catacumbas',
        nextNodeId: 'N08_COMBAT',
      },
      {
        id: 'stealth_through',
        text: 'Avanzar sigilosamente',
        nextNodeId: 'N08A',
        check: {
          skill: 'stealth',
          dc: 14,
        },
      },
      {
        id: 'use_crypt_key',
        text: 'Usar la llave de la cripta (si la tenéis)',
        nextNodeId: 'N09',
        requirements: { F_LLAVE_CRIPTA: true },
      },
    ],
    act: 2,
    location: 'Catacumbas',
  },
  
  {
    id: 'N08A',
    type: 'check',
    title: 'Avance Sigiloso',
    description: `Intentáis atravesar las catacumbas sin alertar a los ghouls.`,
    nextNodeId: null,
    check: {
      skill: 'stealth',
      dc: 14,
      groupCheck: false,
      onSuccess: {
        description: 'Os movéis en silencio entre las sombras. Los ghouls no os detectan.',
        nextNodeId: 'N09',
        setsFlags: { F_CATACUMBAS_SIGILO: true },
      },
      onFailure: {
        description: 'Un hueso cruje bajo vuestros pies. Los ghouls giran hacia vosotros, hambrientos.',
        nextNodeId: 'N08_COMBAT',
      },
    },
    encounterId: null,
    act: 2,
    location: 'Catacumbas',
  },
  
  {
    id: 'N08_COMBAT',
    type: 'combat',
    title: 'Emboscada de Ghouls',
    description: `Ghouls hambrientos emergen de los nichos, sus garras paralizantes extendidas.`,
    nextNodeId: 'N09',
    check: null,
    encounterId: 'E16',
    act: 2,
    location: 'Catacumbas',
  },
  
  {
    id: 'N09',
    type: 'narrative',
    title: 'Biblioteca de Hueso',
    description: `La biblioteca es una visión de pesadilla: estanterías curvadas hechas de huesos humanos, libros encuadernados en piel.

Un ser sin pupilas, vestido con túnicas de bibliotecario, os observa desde su escritorio.

"Bienvenidos", dice con voz neutra. "¿Buscáis conocimiento o muerte? Ambos se encuentran aquí."`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    dialogueId: 'dialogue_bibliotecario_01',
    options: [
      {
        id: 'ask_knowledge',
        text: 'Preguntar sobre el Conde (requiere tag_erudito)',
        nextNodeId: 'N09A',
        requirements: { tag_erudito: true },
      },
      {
        id: 'search_library',
        text: 'Buscar información sobre el prometeo',
        nextNodeId: 'N09B',
        check: {
          skill: 'investigation',
          dc: 15,
        },
      },
      {
        id: 'attack_librarian',
        text: 'Atacar al bibliotecario',
        nextNodeId: 'N09_COMBAT',
      },
    ],
    act: 2,
    location: 'Biblioteca de Hueso',
  },
  
  {
    id: 'N09A',
    type: 'narrative',
    title: 'Conocimiento Prohibido',
    description: `El bibliotecario os entrega un tomo antiguo.

"El Conde Dragomir es antiguo, anterior a Sangrebruma. No vino en peregrinación... vino a recuperar algo que perdió hace siglos."

"En el laboratorio, su creación espera. Un experimento fallido en vida eterna."`,
    nextNodeId: 'N10',
    check: null,
    encounterId: null,
    setsFlags: { F_CONOCE_ORIGEN_CONDE: true },
    act: 2,
    location: 'Biblioteca de Hueso',
  },
  
  {
    id: 'N09B',
    type: 'check',
    title: 'Investigar la Biblioteca',
    description: `Buscáis entre los tomos prohibidos información sobre la creación del Conde.`,
    nextNodeId: null,
    check: {
      skill: 'investigation',
      dc: 15,
      groupCheck: false,
      onSuccess: {
        description: 'Encontráis esquemas del "Prometeo de Hierro": un experimento galvánico para reanimar tejido muerto. Las notas mencionan un punto débil: el núcleo eléctrico.',
        nextNodeId: 'N10',
        setsFlags: { F_DEBILIDAD_PROMETEO: true },
      },
      onFailure: {
        description: 'Los libros están en idiomas que no comprendéis. El bibliotecario sonríe.',
        nextNodeId: 'N10',
      },
    },
    encounterId: null,
    act: 2,
    location: 'Biblioteca de Hueso',
  },
  
  {
    id: 'N09_COMBAT',
    type: 'combat',
    title: 'Ira del Bibliotecario',
    description: `Los Bibliotecarios de Hueso y Monjes Huecos defienden el conocimiento prohibido.`,
    nextNodeId: 'N10',
    check: null,
    encounterId: 'E10',
    act: 2,
    location: 'Biblioteca de Hueso',
  },
  
  {
    id: 'N10',
    type: 'narrative',
    title: 'Taller Galvánico',
    description: `El taller es un caos de mesas de operaciones, frascos con líquidos burbujeantes y arcos eléctricos que saltan entre torres de cobre.

En el centro, inactivo pero intimidante, descansa un autómata cobrizo gigante.`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    options: [
      {
        id: 'disable_automaton',
        text: 'Intentar desactivar el autómata (requiere tag_alquimista)',
        nextNodeId: 'N10A',
        requirements: { tag_alquimista: true },
      },
      {
        id: 'trigger_combat',
        text: 'Avanzar hacia el laboratorio',
        nextNodeId: 'N10_COMBAT',
      },
      {
        id: 'study_notes',
        text: 'Estudiar las notas del taller',
        nextNodeId: 'N10B',
      },
    ],
    act: 2,
    location: 'Taller Galvánico',
  },
  
  {
    id: 'N10A',
    type: 'check',
    title: 'Desactivar el Autómata',
    description: `Usáis vuestro conocimiento alquímico para sabotear el núcleo del autómata.`,
    nextNodeId: null,
    check: {
      skill: 'arcana',
      dc: 16,
      groupCheck: false,
      onSuccess: {
        description: 'Desconectáis el núcleo galvánico. El autómata se desploma, inerte.',
        nextNodeId: 'N11',
        setsFlags: { F_AUTOMATA_DESACTIVADO: true },
      },
      onFailure: {
        description: 'El núcleo chisporrotea. El autómata cobra vida con un rugido mecánico.',
        nextNodeId: 'N10_COMBAT',
      },
    },
    encounterId: null,
    act: 2,
    location: 'Taller Galvánico',
  },
  
  {
    id: 'N10B',
    type: 'narrative',
    title: 'Notas del Conde',
    description: `Las notas revelan el proceso de creación del Prometeo:

"Día 157: El cuerpo responde a las descargas. Los músculos se contraen. ¿Hay algo dentro? ¿Algo... consciente?"

"Día 200: Ha hablado. Preguntó mi nombre. Luego preguntó el suyo. No supe qué responder."`,
    nextNodeId: 'N11',
    check: null,
    encounterId: null,
    setsFlags: { F_LEYO_NOTAS_CONDE: true },
    act: 2,
    location: 'Taller Galvánico',
  },
  
  {
    id: 'N10_COMBAT',
    type: 'combat',
    title: 'Autómata Activado',
    description: `El Autómata Cobrizo cobra vida, defendiendo el laboratorio con descargas eléctricas.`,
    nextNodeId: 'N11',
    check: null,
    encounterId: 'E11',
    act: 2,
    location: 'Taller Galvánico',
  },
  
  {
    id: 'N11',
    type: 'narrative',
    title: 'Laboratorio del Prometeo',
    description: `La puerta se abre a una sala circular con un techo de cristal roto. La lluvia cae sobre una mesa de operaciones metálica.

Allí yace La Criatura: tres metros de altura, piel pálida con suturas visibles, ojos que brillan con electricidad.

Al veros, se incorpora lentamente.

"¿Venís... a matarme?", pregunta con voz rota. "¿O... a salvarme?"`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    dialogueId: 'dialogue_criatura_01',
    options: [
      {
        id: 'talk_creature',
        text: 'Intentar razonar con la Criatura (requiere tag_medico, tag_alquimista o tag_barbaro)',
        nextNodeId: 'N11A',
        requirements: { tag_medico: true },
      },
      {
        id: 'attack_creature',
        text: 'Atacar inmediatamente',
        nextNodeId: 'N11_COMBAT',
      },
      {
        id: 'offer_help',
        text: 'Ofrecer ayuda',
        nextNodeId: 'N11B',
      },
    ],
    act: 2,
    location: 'Laboratorio del Prometeo',
  },
  
  {
    id: 'N11A',
    type: 'narrative',
    title: 'Diálogo con el Prometeo',
    description: `"No soy... monstruo", dice la Criatura. "Él me hizo así. Me dio... vida. Pero no alma."

"Cuando llegó a 40 HP en combate, hará una pregunta trágica. Si respondéis con compasión, se rendirá."

Os entrega información: "El Conde... está en el castillo. Esperando... al Alfa."`,
    nextNodeId: 'N12',
    check: null,
    encounterId: null,
    setsFlags: { F_CRIATURA_ALIADA: true },
    act: 2,
    location: 'Laboratorio del Prometeo',
  },
  
  {
    id: 'N11B',
    type: 'narrative',
    title: 'Compasión por la Criatura',
    description: `La Criatura baja la cabeza.

"Gracias... por ver... lo humano en mí. Pero debo... proteger este lugar. Es... mi propósito."

Ataca con tristeza en sus ojos. Pero si reducís su HP a 40 o menos, preguntará si es un monstruo. Podéis persuadirlo de rendirse.`,
    nextNodeId: 'N11_COMBAT',
    check: null,
    encounterId: null,
    setsFlags: { F_CRIATURA_PERSUADIBLE: true },
    act: 2,
    location: 'Laboratorio del Prometeo',
  },
  
  {
    id: 'N11_COMBAT',
    type: 'combat',
    title: 'BOSS: La Criatura',
    description: `El Prometeo de Hierro ataca con puños galvánicos y fuerza sobrehumana. Pero hay tristeza en su mirada.`,
    nextNodeId: 'N12',
    check: null,
    encounterId: 'E12',
    act: 2,
    location: 'Laboratorio del Prometeo',
  },
  
  {
    id: 'N12',
    type: 'narrative',
    title: 'Torre del Reloj - Oleadas',
    description: `Desde la torre del reloj, podéis ver todo el valle. La niebla carmesí se concentra alrededor del castillo del Conde.

Un aullido rompe la noche. No es un lobo normal... es algo más grande, más antiguo.

Las oleadas comienzan.`,
    nextNodeId: 'N13',
    check: null,
    encounterId: null,
    assetManifestId: 'manifest_n12',
    setsFlags: { F_OLEADAS_INICIADAS: true },
    act: 2,
    location: 'Torre del Reloj',
  },
  
  // ============================================
  // ACTO 3: EL CASTILLO DEL CONDE (N13-N18)
  // ============================================
  
  {
    id: 'N13',
    type: 'combat',
    title: 'Torre del Reloj - Oleada 1',
    description: `Lobos y murciélagos ceniza trepan las paredes de la torre, entrando por las ventanas rotas.`,
    nextNodeId: 'N14',
    check: null,
    encounterId: 'E13',
    act: 3,
    location: 'Torre del Reloj',
  },
  
  {
    id: 'N14',
    type: 'combat',
    title: 'Torre del Reloj - Oleada 2',
    description: `Apenas termináis con la primera oleada, ghouls y un neófito vampírico emergen de las escaleras.`,
    nextNodeId: 'N15',
    check: null,
    encounterId: 'E14',
    act: 3,
    location: 'Torre del Reloj',
  },
  
  {
    id: 'N15',
    type: 'combat',
    title: 'Torre del Reloj - BOSS: El Alfa',
    description: `El aullido se acerca. Una figura masiva salta desde las sombras: el Hombre Lobo Alfa de Sangrebruma.

Tres metros de altura, pelaje blanco manchado de sangre, ojos que brillan con inteligencia feroz.

"Por fin... presa digna", gruñe con voz casi humana.`,
    nextNodeId: 'N16',
    check: null,
    encounterId: 'E15',
    assetManifestId: 'manifest_n15',
    act: 3,
    location: 'Torre del Reloj',
  },
  
  {
    id: 'N16',
    type: 'narrative',
    title: 'Patio del Castillo',
    description: `Tras derrotar al Alfa, os acercáis al castillo del Conde. El portón principal está abierto, como si os esperara.

El patio está lleno de guardias no-muertos y gárgolas de piedra que cobran vida al detectar vuestra presencia.

Las oleadas continúan.`,
    nextNodeId: 'N17',
    check: null,
    encounterId: 'E17',
    act: 3,
    location: 'Patio del Castillo',
  },
  
  {
    id: 'N17',
    type: 'narrative',
    title: 'Salón de Mármol Negro',
    description: `Tras atravesar el patio, llegáis al salón principal. Columnas de mármol negro sostienen un techo pintado con escenas de conquista.

Al fondo, sentado en un trono de hueso, espera el Conde Dragomir.

"Habéis llegado más lejos que los demás", dice con voz suave y educada. "¿Venís a matarme? ¿O a negociar?"`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    dialogueId: 'dialogue_conde_final',
    options: [
      {
        id: 'talk_count',
        text: 'Intentar dialogar con el Conde',
        nextNodeId: 'N17A',
      },
      {
        id: 'attack_count',
        text: 'Atacar inmediatamente',
        nextNodeId: 'N17_COMBAT',
      },
      {
        id: 'demand_surrender',
        text: 'Exigir que se rinda (requiere tag_lider)',
        nextNodeId: 'N17B',
        requirements: { tag_lider: true },
      },
    ],
    act: 3,
    location: 'Salón de Mármol Negro',
  },
  
  {
    id: 'N17A',
    type: 'narrative',
    title: 'Diálogo con el Conde',
    description: `El Conde sonríe, mostrando colmillos afilados.

"Interesante. Hace siglos que nadie me habla sin miedo. Muy bien, preguntad."

Podéis hacer preguntas sobre su pasado, sus motivos, o la niebla carmesí. Las respuestas pueden darte ventaja en combate... o revelar que no todo es lo que parece.`,
    nextNodeId: 'N17_COMBAT',
    check: null,
    encounterId: null,
    setsFlags: { F_CONDE_DIALOGO: true },
    act: 3,
    location: 'Salón de Mármol Negro',
  },
  
  {
    id: 'N17B',
    type: 'check',
    title: 'Exigir Rendición',
    description: `Con autoridad absoluta, exigís que el Conde se rinda.`,
    nextNodeId: null,
    check: {
      skill: 'intimidation',
      dc: 18,
      groupCheck: false,
      onSuccess: {
        description: 'El Conde se ríe, pero hay respeto en su mirada. "Tenéis agallas. Eso os dará... una oportunidad." El combate comienza, pero con el Conde impresionado.',
        nextNodeId: 'N17_COMBAT',
        setsFlags: { F_CONDE_IMPRESIONADO: true },
        modifiesVariables: { conde_respect: 1 },
      },
      onFailure: {
        description: 'El Conde se ríe. "Patético. Demostrádmelo con acero, no con palabras."',
        nextNodeId: 'N17_COMBAT',
      },
    },
    encounterId: null,
    act: 3,
    location: 'Salón de Mármol Negro',
  },
  
  {
    id: 'N17_COMBAT',
    type: 'combat',
    title: 'BOSS FINAL: Conde de Sangrebruma',
    description: `El Conde se levanta de su trono. La niebla carmesí se concentra a su alrededor.

"Mostraré por qué he sobrevivido mil años."

Se transforma en murciélago, luego en lobo, finalmente en niebla, todo en segundos. Su poder es abrumador.`,
    nextNodeId: 'N18',
    check: null,
    encounterId: 'E22',
    assetManifestId: 'manifest_n17',
    act: 3,
    location: 'Trono de Sangre',
  },
  
  {
    id: 'N18',
    type: 'narrative',
    title: 'Epílogo: El Amanecer',
    description: `El Conde cae, transformándose en cenizas que se dispersan con el viento.

La niebla carmesí comienza a disiparse. Por primera vez en meses, la luz del sol toca el valle de Sangrebruma.

Desde las casas, los aldeanos supervivientes salen lentamente, parpadeando ante la luz. Mara Carbón os saluda desde la posada, lágrimas en sus ojos.

"Lo lograron", susurra. "Realmente lo lograron."

El valle está libre. Pero las cicatrices permanecerán por generaciones.

**FIN DE LA CAMPAÑA**

*Opcional: Si queréis explorar el Observatorio y enfrentar al Astro-Horror, podéis hacerlo antes del epílogo.*`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    assetManifestId: 'manifest_n18',
    setsFlags: { F_CAMPAÑA_COMPLETADA: true },
    act: 3,
    location: 'Valle de Sangrebruma',
    scaling: {
      minPlayers: 2,
      maxPlayers: 6,
    },
  },
]

/**
 * Buscar nodo por ID
 */
export function getNodeById(id: string): CampaignNode | undefined {
  return CAMPAIGN_V2_NODES.find(node => node.id === id)
}

/**
 * Obtener nodo inicial
 */
export function getStartNode(): CampaignNode {
  return CAMPAIGN_V2_NODES[0] // N01
}

/**
 * Obtener nodos por acto
 */
export function getNodesByAct(act: 1 | 2 | 3): CampaignNode[] {
  return CAMPAIGN_V2_NODES.filter(node => node.act === act)
}
