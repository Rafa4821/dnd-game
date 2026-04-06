import type { CampaignNode } from '@/types/campaign'

/**
 * Nodos de la campaña Sangrebruma
 * Basado en CAMPAÑA.md sección 3
 */

export const SANGREBRUMA_NODES: CampaignNode[] = [
  {
    id: 'SB-N_START',
    type: 'narrative',
    title: 'Llegada a Sangrebruma',
    description: `La niebla se espesa mientras vuestro carruaje se detiene ante las puertas de Sangrebruma. 
    El valle está envuelto en una bruma carmesí que parece palpitar con vida propia. 
    
    El cochero, un hombre de rostro pálido, se niega a entrar. "No pasaré de aquí", dice con voz temblorosa. 
    "Hace tres lunas que los gritos dejaron de oírse... y eso es peor que el silencio."
    
    Ante vosotros se alza la aldea, sus edificios de madera oscurecida por el tiempo y la humedad. 
    No se ve luz en las ventanas, ni humo en las chimeneas.`,
    nextNodeId: 'SB-N_INN',
    check: null,
    encounterId: null,
    act: 1,
    location: 'Entrada del Valle',
  },
  
  {
    id: 'SB-N_INN',
    type: 'narrative',
    title: 'La Posada del Cuervo Negro',
    description: `Avanzáis por las calles desiertas hasta la posada. La puerta está entreabierta, 
    chirriando con el viento. En el interior, el fuego arde bajo en la chimenea.
    
    Una anciana está sentada junto al fuego, meciéndose en una silla. Al veros, levanta la vista.
    
    "¿Cazadores?", pregunta con una voz rasposa. "Llevan meses sin llegar. El valle está maldito. 
    Los muertos caminan desde que el noble... desde que él llegó a la abadía."`,
    nextNodeId: 'SB-N_INN_DECISION',
    check: null,
    encounterId: null,
    act: 1,
    location: 'Posada del Cuervo Negro',
  },
  
  {
    id: 'SB-N_INN_DECISION',
    type: 'decision',
    title: 'Hablar con la anciana',
    description: `La anciana os mira expectante. Podéis preguntarle sobre la situación o ir directamente a investigar.`,
    options: [
      {
        id: 'talk',
        text: 'Preguntar sobre la abadía y los no-muertos',
        nextNodeId: 'SB-N_INN_INFO',
        setsFlags: { f_village_trust: true },
      },
      {
        id: 'investigate',
        text: 'Agradecer y salir a investigar de inmediato',
        nextNodeId: 'SB-N_CEMETERY',
      },
    ],
    nextNodeId: null,
    check: null,
    encounterId: null,
    act: 1,
    location: 'Posada del Cuervo Negro',
  },
  
  {
    id: 'SB-N_INN_INFO',
    type: 'narrative',
    title: 'Relato de la anciana',
    description: `"Hace tres lunas llegó un noble de tierras lejanas. Compró la vieja abadía en ruinas 
    y se encerró allí con sus sirvientes. Pronto empezaron a desaparecer personas de la aldea.
    
    Primero los niños. Luego los jóvenes. Los que salían a buscarlos no volvían.
    
    Una noche, los muertos salieron de sus tumbas. El cementerio... no es seguro. 
    Y desde la abadía se oyen cantos extraños al caer la noche."
    
    Os entrega un símbolo sagrado. "Mi hijo era sacerdote. Tomadlo. Quizás os proteja."`,
    nextNodeId: 'SB-N_CEMETERY',
    setsFlags: { f_village_trust: true, f_holy_symbol: true },
    check: null,
    encounterId: null,
    act: 1,
    location: 'Posada del Cuervo Negro',
  },
  
  {
    id: 'SB-N_CEMETERY',
    type: 'check',
    title: 'El Cementerio',
    description: `El cementerio está junto a la iglesia abandonada. Lápidas torcidas emergen de la niebla.
    Algunas tumbas han sido profanadas desde dentro, la tierra removida y los ataúdes abiertos.
    
    Percibís movimiento entre las lápidas...`,
    check: {
      skill: 'perception',
      dc: 12,
      successNodeId: 'SB-N_CEMETERY_AMBUSH_READY',
      failureNodeId: 'SB-N_CEMETERY_AMBUSH',
      groupCheck: false,
    },
    nextNodeId: null,
    encounterId: null,
    act: 1,
    location: 'Cementerio',
  },
  
  {
    id: 'SB-N_CEMETERY_AMBUSH_READY',
    type: 'combat',
    title: '¡Emboscada de no-muertos!',
    description: `¡Gracias a vuestra vigilancia, detectáis la emboscada a tiempo! 
    Zombis y esqueletos emergen de las tumbas, pero estáis preparados.`,
    nextNodeId: 'SB-N_POST_CEMETERY',
    check: null,
    encounterId: 'SB-E_CEMETERY1',
    act: 1,
    location: 'Cementerio',
  },
  
  {
    id: 'SB-N_CEMETERY_AMBUSH',
    type: 'combat',
    title: '¡Emboscada!',
    description: `Demasiado tarde os dais cuenta. Los muertos vivientes os rodean. 
    ¡Comenzáis el combate con desventaja en iniciativa!`,
    nextNodeId: 'SB-N_POST_CEMETERY',
    encounterId: 'SB-E_CEMETERY1',
    check: null,
    modifiesVariables: { darkness: 1 },
    act: 1,
    location: 'Cementerio',
  },
  
  {
    id: 'SB-N_POST_CEMETERY',
    type: 'narrative',
    title: 'Después de la batalla',
    description: `Los no-muertos caen definitivamente. Entre las tumbas encontráis rastros recientes: 
    alguien ha estado aquí recientemente, realizando algún tipo de ritual.
    
    La iglesia al lado del cementerio está abierta...`,
    nextNodeId: 'SB-N_CHURCH_DECISION',
    check: null,
    encounterId: null,
    act: 1,
    location: 'Cementerio',
  },
  
  {
    id: 'SB-N_CHURCH_DECISION',
    type: 'decision',
    title: 'La Iglesia Abandonada',
    description: `La puerta de la iglesia cruje al abrirse. En el interior, los bancos están cubiertos de polvo 
    y telarañas. El altar ha sido profanado con símbolos extraños.`,
    options: [
      {
        id: 'investigate_altar',
        text: 'Investigar el altar profanado (requiere luz)',
        nextNodeId: 'SB-N_ALTAR_DISCOVERY',
      },
      {
        id: 'skip',
        text: 'Continuar hacia la abadía sin perder tiempo',
        nextNodeId: 'SB-N_ABBEY_APPROACH',
        setsFlags: { f_skip_church: true },
      },
    ],
    nextNodeId: null,
    check: null,
    encounterId: null,
    act: 1,
    location: 'Iglesia Abandonada',
  },
  
  {
    id: 'SB-N_ALTAR_DISCOVERY',
    type: 'narrative',
    title: 'Descubrimiento en el altar',
    description: `Al examinar los símbolos, reconocéis signos de nigromancia. 
    Un diario parcialmente quemado revela fragmentos de información:
    
    "...el noble busca la inmortalidad... sacrificios para despertar algo antiguo... 
    la cripta bajo la abadía... cuando la niebla sea roja como la sangre..."
    
    También encontráis un mapa que muestra una entrada secreta a la abadía.`,
    nextNodeId: 'SB-N_ABBEY_APPROACH',
    setsFlags: { f_secret_entrance: true, f_knows_plan: true },
    check: null,
    encounterId: null,
    act: 1,
    location: 'Iglesia Abandonada',
  },
  
  {
    id: 'SB-N_ABBEY_APPROACH',
    type: 'narrative',
    title: 'Acercándose a la Abadía',
    description: `La abadía se alza imponente en lo alto de la colina. 
    Sus torres góticas perforan la niebla carmesí. Luces extrañas parpadean en las ventanas.
    
    El camino principal está custodiado por criaturas... pero si tenéis el mapa de la entrada secreta, 
    podríais evitar el enfrentamiento directo.`,
    nextNodeId: 'SB-N_ABBEY_ENTRANCE_CHOICE',
    modifiesVariables: { darkness: 1 },
    check: null,
    encounterId: null,
    act: 2,
    location: 'Colina de la Abadía',
  },
  
  {
    id: 'SB-N_ABBEY_ENTRANCE_CHOICE',
    type: 'decision',
    title: 'Entrada a la Abadía',
    description: `¿Cómo queréis entrar a la abadía?`,
    options: [
      {
        id: 'main_entrance',
        text: 'Asalto frontal por la puerta principal',
        nextNodeId: 'SB-N_MAIN_GATE_COMBAT',
      },
      {
        id: 'secret_entrance',
        text: 'Usar la entrada secreta (requiere mapa)',
        nextNodeId: 'SB-N_SECRET_ENTRANCE',
        requirements: ['f_secret_entrance'],
      },
    ],
    nextNodeId: null,
    check: null,
    encounterId: null,
    act: 2,
    location: 'Entrada de la Abadía',
  },
  
  {
    id: 'SB-N_MAIN_GATE_COMBAT',
    type: 'combat',
    title: 'Guardianes de la Puerta',
    description: `Los guardianes no-muertos del noble os atacan. Son más fuertes que los zombis del cementerio.`,
    nextNodeId: 'SB-N_ABBEY_HALLS',
    encounterId: 'SB-E_GATE_GUARDS',
    check: null,
    modifiesVariables: { darkness: 1 },
    act: 2,
    location: 'Puerta Principal',
  },
  
  {
    id: 'SB-N_SECRET_ENTRANCE',
    type: 'narrative',
    title: 'Entrada Secreta',
    description: `Siguiendo el mapa, encontráis un pasadizo oculto que lleva directamente a los sótanos de la abadía.
    Evitáis a los guardianes y ganáis la ventaja de la sorpresa.`,
    nextNodeId: 'SB-N_ABBEY_CRYPTS',
    setsFlags: { f_surprise_advantage: true },
    check: null,
    encounterId: null,
    act: 2,
    location: 'Túnel Secreto',
  },
  
  // Más nodos para completar los 16... (simplificado para el ejemplo)
  {
    id: 'SB-N_ABBEY_HALLS',
    type: 'narrative',
    title: 'Pasillos de la Abadía',
    description: `Los pasillos están decorados con tapices antiguos y estatuas inquietantes. 
    El olor a incienso mezclado con putrefacción llena el aire.`,
    nextNodeId: 'SB-N_FINAL_APPROACH',
    check: null,
    encounterId: null,
    act: 2,
    location: 'Abadía - Pasillos',
  },
  
  {
    id: 'SB-N_ABBEY_CRYPTS',
    type: 'narrative',
    title: 'Criptas de la Abadía',
    description: `Las criptas bajo la abadía son antiguas, anteriores al edificio mismo. 
    Símbolos arcanos brillan débilmente en las paredes.`,
    nextNodeId: 'SB-N_FINAL_APPROACH',
    check: null,
    encounterId: null,
    act: 2,
    location: 'Abadía - Criptas',
  },
  
  {
    id: 'SB-N_FINAL_APPROACH',
    type: 'narrative',
    title: 'El Corazón de la Oscuridad',
    description: `Llegáis a la cámara central. El noble vampiro os espera, rodeado de sus sirvientes más poderosos.
    
    "Así que habéis llegado hasta aquí, cazadores. Impresionante. Pero llegáis demasiado tarde. 
    El ritual está completo. Esta tierra me pertenece ahora."`,
    nextNodeId: 'SB-N_FINAL_COMBAT',
    modifiesVariables: { darkness: 2 },
    check: null,
    encounterId: null,
    act: 3,
    location: 'Cámara del Ritual',
  },
  
  {
    id: 'SB-N_FINAL_COMBAT',
    type: 'combat',
    title: '¡Enfrentamiento Final!',
    description: `El vampiro y sus guardias de élite os atacan. Esta es la batalla que decidirá el destino del valle.`,
    nextNodeId: 'SB-N_VICTORY',
    encounterId: 'SB-E_FINAL_BOSS',
    check: null,
    act: 3,
    location: 'Cámara del Ritual',
  },
  
  {
    id: 'SB-N_VICTORY',
    type: 'narrative',
    title: 'Victoria',
    description: `El vampiro cae, su cuerpo convirtiéndose en cenizas. La niebla carmesí comienza a disiparse.
    
    Los aldeanos supervivientes emergen de sus escondites. El valle está a salvo... por ahora.
    
    Pero sabéis que la oscuridad nunca descansa por mucho tiempo.`,
    nextNodeId: null,
    check: null,
    encounterId: null,
    act: 3,
    location: 'Cámara del Ritual',
  },
]

/**
 * Obtener nodo por ID
 */
export function getNodeById(nodeId: string): CampaignNode | undefined {
  return SANGREBRUMA_NODES.find(n => n.id === nodeId)
}

/**
 * Obtener nodo inicial
 */
export function getStartNode(): CampaignNode {
  return SANGREBRUMA_NODES[0]
}

/**
 * Obtener todos los nodos
 */
export function getAllNodes(): CampaignNode[] {
  return SANGREBRUMA_NODES
}
