import type { CharacterLore } from '@/types/characterLore'

/**
 * Lore completo de los personajes pregenerados de Sangrebruma V2
 * Basado en los arcos narrativos inspirados en Frankenstein; o el moderno Prometeo
 */

export const CHARACTER_LORE_DATA: Record<string, CharacterLore> = {
  'SB-PC_BARBARIAN': {
    pregenId: 'SB-PC_BARBARIAN',
    fullName: 'Bárbaro del Páramo',
    
    biography: 'Nació en tierras abiertas donde la noche es honesta: si algo te quiere matar, lo ves venir. En Sangrebruma, esa "honestidad" no existe; la niebla miente. Llegó buscando a un pariente desaparecido, siguiendo el rastro de una fuerza que no respeta puertas ni tumbas.',
    
    moralDilemma: 'Su brújula es simple: proteger a los suyos. Pero la campaña lo fuerza a preguntas incómodas: si algo fue "creado" como arma, ¿sigue siendo culpable cuando destruye?',
    
    prometheusConnection: 'Su vínculo con el Prometeo es directo: cree que la Criatura es "fuerza robada", alguien a quien le quitaron la decisión de ser. El dilema: "¿Se mata al monstruo o se mata al que lo encadenó?"',
    
    actEvolution: {
      act1: 'Aprende que su fuerza sirve, pero también asusta. Decisión clave: ser el portavoz ante el Sepulturero (puede activar F_CEMENTERIO_PACTO).',
      act2: 'Descubre el laboratorio y ve la mesa de correas. Decisión clave: si presencia la Criatura, elegir "hablar con fuerza honesta" (puede activar F_CRIATURA_EMPÁTICA).',
      act3: 'El Conde intenta comprarlo con una promesa de "fuerza sin dolor". Decisión clave: rechazar pacto a costa de un sacrificio (puede bajar V_SANGREBRUMA_CORRUPCION si protege aldeanos).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Ser portavoz ante el Sepulturero',
        flagsAffected: ['F_CEMENTERIO_PACTO'],
      },
      {
        act: 2,
        description: 'Hablar con fuerza honesta a la Criatura',
        flagsAffected: ['F_CRIATURA_EMPÁTICA'],
      },
      {
        act: 3,
        description: 'Rechazar pacto y proteger aldeanos',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -2 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_RUGIDO_GUARDIA',
        name: 'Rugido de Guardia',
        description: 'Reacción: cuando un aliado cae a 0, el Bárbaro puede moverse 2 casillas y ponerse entre el aliado y el enemigo',
        type: 'reaction',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_GOLPE_REMACHE',
        name: 'Golpe de Remache',
        description: 'Una vez por encuentro: si impacta a un enemigo grande/elite, puede derribarlo con CD fija',
        type: 'action',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_FURIA_CANALIZADA',
        name: 'Furia Canalizada',
        description: 'Acción adicional 1/encuentro: empujar 2 casillas o romper un anclaje de puzzle/ritual',
        type: 'bonus',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si el Sepulturero exige tag_barbaro',
        text: 'Hablá conmigo. Si querés medir fuerza, medila. Pero no me mientas con susurros.',
        speakerLock: 'tag_barbaro',
      },
      {
        condition: 'Si hay Nigromante en party',
        text: 'Vos hablás con huesos. Yo hablo con vivos. Hoy, hagamos lo que sirva.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Si un NPC solo confía en fe',
        text: 'No sé rezar bonito. Pero sé cumplir promesas.',
      },
      {
        condition: 'Si la Criatura está presente y alguien quiere atacarla',
        text: 'Esperá. Si la matamos sin escuchar, somos lo mismo que el que la encadenó.',
      },
    ],
    
    dialogueKeys: {
      'npc.sepulturero': ['dlg_sepulturero_barbaro_only'],
      'npc.criatura': ['dlg_criatura_fuerza_honesta'],
    },
    
    voiceBarks: [
      { text: 'No corro. Llego.' },
      { text: 'La niebla no manda en mí.' },
      { text: 'Si grita… algo en él todavía vive.' },
    ],
    
    voiceTone: 'Grave, directo, pocas palabras; emoción contenida',
    ttsPrompt: 'Voz masculina grave, español latino neutro, ritmo lento-medio, firme sin gritar, pausas cortas al final de cada frase.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-RuedaAstral',
        description: 'Puede bloquear un anillo 1 turno',
        mechanicalEffect: 'Clavija por fuerza con check STR simple o consume fuerza 1/encuentro',
      },
      {
        puzzleId: 'PZ-Circuito',
        description: 'Puede descargar a tierra un exceso',
        mechanicalEffect: 'Absorbe un fallo y recibe pequeño daño, evita reinicio total',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Jura destruir la rueda',
        outcome: 'Para que nadie vuelva a ser encadenado',
      },
      {
        finalType: 'B',
        description: 'Acepta pacto solo si protege a la villa',
        outcome: 'Final amargo por obediencia',
      },
      {
        finalType: 'C',
        description: 'Lidera el acto de reconocimiento',
        outcome: 'Llama a la Criatura "persona" frente al Conde (escena de nombre propio)',
      },
    ],
  },

  'SB-PC_NECROMANCER': {
    pregenId: 'SB-PC_NECROMANCER',
    fullName: 'Nigromante de Hueso',
    
    biography: 'No "ama" la muerte; la estudia porque la teme. Creció en una región donde la gente desaparecía y nadie anotaba nombres. Aprendió a escuchar restos, no para profanar, sino para recordar. Llegó a Sangrebruma tras oír rumores de un laboratorio que "mezcla" partes como si fueran herramientas.',
    
    moralDilemma: 'En el núcleo de Frankenstein, la criatura busca afecto y recibe rechazo.',
    
    prometheusConnection: 'El Nigromante se pregunta: "¿Qué pasa con un ser que nace sin pasado? ¿Quién le debe un relato?" Para él, el Prometeo es el caso extremo: vida sin historia propia.',
    
    actEvolution: {
      act1: 'Gana acceso a diálogos alternos en cementerio y catacumbas. Puede activar F_CEMENTERIO_PACTO sin intimidar (habla con los muertos, no con el Sepulturero).',
      act2: 'Descubre que el laboratorio "borra identidades" (serializa cuerpos). Decisión: guardar nombres (baja corrupción) o usarlos como herramientas (sube V_SANGREBRUMA_CORRUPCION).',
      act3: 'Ante el Corazón, decide si rompe el ciclo nombrando a la Criatura (acto simbólico) o si "la clasifica" (acto utilitario).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Hablar con los muertos en lugar del Sepulturero',
        flagsAffected: ['F_CEMENTERIO_PACTO'],
      },
      {
        act: 2,
        description: 'Guardar nombres en lugar de usar cuerpos',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -2 },
      },
      {
        act: 3,
        description: 'Nombrar a la Criatura',
        flagsAffected: ['F_CRIATURA_NOMBRADA'],
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_ECO_LAPIDA',
        name: 'Eco de Lápida',
        description: 'Puzzle: recibe 1 pista privada extra en PZ-RuedaAstral y PZ-Espejos',
        type: 'puzzle',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_SELLO_OSARIO',
        name: 'Sello de Osario',
        description: 'Consumible: anula 1 refuerzo de esqueletos/ghouls',
        type: 'consumable',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_NOMBRE_VERDADERO',
        name: 'Nombre Verdadero',
        description: 'Habilidad narrativa: 1 vez, convierte NPC neutral/hostil en neutral si su odio nace de abandono',
        type: 'narrative',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Médico de Campaña',
        text: 'Vos cerrás heridas. Yo cierro historias. No me pidas que sea limpio.',
        requiresTags: ['tag_medico'],
      },
      {
        condition: 'Si hay Paladín del Alba',
        text: 'No busco profanar. Busco que no se pierdan.',
        requiresTags: ['tag_fe', 'tag_lider'],
      },
      {
        condition: 'Si el Bárbaro es portavoz',
        text: 'Dejame hablar. Esta tumba escucha mejor que vos.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Con la Criatura',
        text: 'No sos un pedazo de nadie. Sos un alguien sin acta. Eso se arregla.',
      },
    ],
    
    dialogueKeys: {
      'npc.sepulturero': ['dlg_sepulturero_nigromante_alt'],
      'npc.criatura': ['dlg_criatura_nombre'],
    },
    
    voiceBarks: [
      { text: 'La tierra guarda más verdad que la gente.' },
      { text: 'No los mando. Los escucho.' },
      { text: 'Si te hicieron sin pasado, te inventamos futuro.' },
    ],
    
    voiceTone: 'Bajo, íntimo, cerebral, no villanesco',
    ttsPrompt: 'Voz calma, español latino neutro, timbre suave, ritmo medio-lento, énfasis en palabras "nombre", "memoria".',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Espejos',
        description: 'Puede ver símbolo oculto',
        mechanicalEffect: 'UI overlay que los demás no ven',
      },
      {
        puzzleId: 'PZ-RitualCorazón',
        description: 'Puede sustituir tirada',
        mechanicalEffect: 'Arcana/Historia cuando el party no tiene erudito',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Quema el laboratorio pero rescata archivos/nombres',
        outcome: 'Epílogo de memoria',
      },
      {
        finalType: 'B',
        description: 'Se convierte en archivista del Conde',
        outcome: 'Final oscuro si quiere preservar a cualquier costo',
      },
      {
        finalType: 'C',
        description: 'Consigue que la Criatura viva con identidad propia',
        outcome: 'Final esperanzador pero difícil',
      },
    ],
  },

  'SB-PC_MARKSMAN': {
    pregenId: 'SB-PC_MARKSMAN',
    fullName: 'Tiradora de Plata',
    
    biography: 'Viene de una región donde los lobos eran "cuento"… hasta que dejaron de serlo. Aprendió a disparar sin temblar, no por valentía, sino por hambre. En Sangrebruma busca a alguien que juró volver y no volvió.',
    
    moralDilemma: 'Su conflicto es la "distancia moral": matar desde lejos facilita olvidar que hay historia en el objetivo.',
    
    prometheusConnection: 'Para ella, el Prometeo es lo mismo que una bala: algo que otros fabrican y después sueltan. Frankenstein le exige mirar de cerca: "¿y si el monstruo es el herido?"',
    
    actEvolution: {
      act1: 'Aprende a no disparar primero. Puede activar F_POSADA_ALIADA si protege a Mara de un incidente (sin matar a un aldeano poseído).',
      act2: 'Ve a la Criatura y reconoce señales humanas (miedo y cuidado). Decide si baja el arma.',
      act3: 'Tiene el tiro que puede terminar todo… o empezar algo. Decide entre ejecución (A) y misericordia (C).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Proteger a Mara sin matar',
        flagsAffected: ['F_POSADA_ALIADA'],
      },
      {
        act: 2,
        description: 'Bajar el arma ante la Criatura',
        flagsAffected: ['F_CRIATURA_RESPETADA'],
      },
      {
        act: 3,
        description: 'Elegir misericordia sobre ejecución',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -1 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_BALAS_PLATA_X3',
        name: 'Bala de Plata',
        description: 'Consumible: bonus vs licántropos',
        type: 'consumable',
        uses: 3,
        maxUses: 3,
      },
      {
        milestone: 'act2_end',
        id: 'UNL_TIRO_COBERTURA',
        name: 'Tiro de Cobertura',
        description: 'Reacción: si un aliado es atacado, imponer desventaja al atacante 1 vez',
        type: 'reaction',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_DISPARO_PERNO',
        name: 'Disparo de Perno',
        description: 'Acción: rompe un anclaje del ritual/puzzle a distancia 1 vez',
        type: 'action',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Bárbaro',
        text: 'A vos te sigue el ruido. A mí me sigue el eco. Vamos a hacer esto limpio.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Si hay Exorcista',
        text: 'Si tu fe falla, mi bala no. Pero ojalá no lleguemos a eso.',
        requiresTags: ['tag_exorcista'],
      },
      {
        condition: 'Si hay Nigromante',
        text: 'No me recites tragedias. Dame un objetivo. Y después… hablamos.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Con la Criatura',
        text: 'No te muevas. No por amenaza… por miedo mío.',
      },
    ],
    
    dialogueKeys: {
      'npc.mara': ['dlg_mara_proteccion'],
      'npc.criatura': ['dlg_criatura_no_dispares'],
    },
    
    voiceBarks: [
      { text: 'Respirá… ahora.' },
      { text: 'No desperdicio plata.' },
      { text: 'Si dispara la niebla, yo contesto.' },
    ],
    
    voiceTone: 'Controlado, tenso, minimalista',
    ttsPrompt: 'Voz firme, español latino neutro, pocas palabras, tensión contenida, silencios breves antes de decisiones.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Espejos',
        description: 'Puede ver reflejos falsos',
        mechanicalEffect: 'Elimina una opción trampa (pista)',
      },
      {
        puzzleId: 'PZ-RitualCorazón',
        description: 'Puede ejecutar Disparo de Perno',
        mechanicalEffect: 'Reemplaza tirada fallida por progreso parcial',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Finaliza como cazadora solitaria',
        outcome: 'Victoria, pérdida',
      },
      {
        finalType: 'B',
        description: 'Se siente traicionada',
        outcome: 'La plata se vuelve símbolo de control',
      },
      {
        finalType: 'C',
        description: 'Baja el arma y se redime',
        outcome: 'Protege a la Criatura ante aldeanos hostiles',
      },
    ],
  },

  'SB-PC_WHIP': {
    pregenId: 'SB-PC_WHIP',
    fullName: 'Cazador del Látigo Consagrado',
    
    biography: 'Creció entre manuales viejos, plata mal guardada y lecciones repetidas: "no invites a nadie", "no confíes en la cara perfecta", "no pelees en oscuridad". Su linaje no es importante por sangre, sino por oficio. Llegó a Sangrebruma por una deuda: su maestro desapareció al investigar "un castillo que fabrica vida".',
    
    moralDilemma: 'Fue entrenado para "cazar". Pero Frankenstein le pone un espejo: una criatura creada sin elección ¿es objetivo o víctima?',
    
    prometheusConnection: 'Su dilema es: "Si mi identidad es cazar monstruos, ¿qué soy cuando el monstruo solo quiere vivir?"',
    
    actEvolution: {
      act1: 'Aprende a distinguir "monstruo" de "amenaza". Puede activar F_POSADA_ALIADA si se gana a Mara con respeto (no intimidación).',
      act2: 'Halla marcas de entrenamiento en el laboratorio (su maestro estuvo aquí o algo lo imitó). Decide si odia al creador o a la creación.',
      act3: 'Frente al Conde, puede romper el pacto con una frase que cancela la "invitación" (si el party obtuvo F_INVITACION_LEY).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Ganarse a Mara con respeto en lugar de intimidación',
        flagsAffected: ['F_POSADA_ALIADA'],
      },
      {
        act: 2,
        description: 'Decidir si odia al creador o a la creación',
        flagsAffected: ['F_CRIATURA_EMPÁTICA'],
      },
      {
        act: 3,
        description: 'Romper pacto con invocación de la ley',
        flagsAffected: ['F_INVITACION_LEY'],
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_AZOTE_SAL',
        name: 'Azote de Sal',
        description: 'Acción: aplica desventaja a un enemigo 1 ronda si hay sal en inventario',
        type: 'action',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_ESTACAS_CONSAGRADAS',
        name: 'Luz de Estaca',
        description: 'Consumible: estaca consagrada ×2; mejora vs vampiros',
        type: 'consumable',
        uses: 2,
        maxUses: 2,
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_CADENA_JURAMENTO',
        name: 'Cadena del Juramento',
        description: 'Reacción: impedir que un enemigo huya 1 vez por combate',
        type: 'reaction',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Paladín del Alba en party',
        text: 'Vos ponés la fe. Yo pongo el método. No nos pisemos.',
        requiresTags: ['tag_fe', 'tag_lider'],
      },
      {
        condition: 'Si hay Nigromante en party',
        text: 'Si vas a hablar con los muertos, lo hacés afuera. Adentro, yo marco el ritmo.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Si el Bárbaro es portavoz',
        text: 'Pegá primero si querés, pero dejame mirar las marcas. Hay reglas acá.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Con la Criatura',
        text: 'No vine a terminarte. Vine a saber quién se cree con derecho a empezarte.',
      },
    ],
    
    dialogueKeys: {
      'npc.mara': ['dlg_mara_respect'],
      'npc.conde': ['dlg_conde_juramento'],
    },
    
    voiceBarks: [
      { text: 'Plata lista.' },
      { text: 'No mires el humo. Mirá los bordes.' },
      { text: 'El castillo miente en detalles.' },
    ],
    
    voiceTone: 'Decidido, profesional, controlado',
    ttsPrompt: 'Voz adulta, español latino neutro, tono de cazador experto, velocidad media, sin dramatizar demasiado.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-RuedaAstral',
        description: 'Obtiene pista extra automática',
        mechanicalEffect: 'Revela relación símbolo-número si tiene sal/plata',
      },
      {
        puzzleId: 'PZ-Campana',
        description: 'Puede marcar compás',
        mechanicalEffect: 'Reduce 1 intento fallido con check de ritmo (DEX/WIS)',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Se queda como nuevo guardián',
        outcome: 'Evita que resurja el castillo',
      },
      {
        finalType: 'B',
        description: 'Se rompe por dentro',
        outcome: 'Vive pero traiciona oficio (epílogo tenso)',
      },
      {
        finalType: 'C',
        description: 'Rediseña su juramento',
        outcome: 'Cazar a quienes crean armas vivas, no a las armas mismas',
      },
    ],
  },

  'SB-PC_ALCHEM': {
    pregenId: 'SB-PC_ALCHEM',
    fullName: 'Alquimista del Cobre',
    
    biography: 'Hijo de un herrero y una curandera. Aprendió que un metal puede ser herramienta o arma. En Sangrebruma lo atrajeron los rumores de un laboratorio que hace "cobre vivo". El Prometeo es su obsesión: no por poder, sino por la pregunta que lo persigue desde siempre: ¿se puede reparar lo irreparable?',
    
    moralDilemma: 'En los temas de Frankenstein, ciencia y humanidad chocan: crear vida puede convertirse en tragedia por irresponsabilidad.',
    
    prometheusConnection: 'El Alquimista se debate entre curar y controlar: si entiende la creación, ¿la libera o la perfecciona?',
    
    actEvolution: {
      act1: 'Gana confianza con soluciones (antídotos, luz). Decide si comparte fórmulas con la villa (F_POSADA_ALIADA) o las guarda.',
      act2: 'En PZ-Circuito entiende el patrón galvánico. Decisión clave: desactivar el sistema (seguro) o "aprenderlo" (peligroso pero poderoso).',
      act3: 'El Conde le ofrece laboratorio completo. Decisión clave: destruir su sueño para salvar vidas, o salvar su sueño y perder humanidad.'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Compartir fórmulas con la villa',
        flagsAffected: ['F_POSADA_ALIADA'],
      },
      {
        act: 2,
        description: 'Aprender el patrón galvánico',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: 1 },
      },
      {
        act: 3,
        description: 'Rechazar laboratorio del Conde',
        flagsAffected: ['F_CONDE_RECHAZADO'],
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_BOMBAS_LUZ_X2',
        name: 'Bomba de Luz',
        description: 'Consumible que ayuda vs vampiros',
        type: 'consumable',
        uses: 2,
        maxUses: 2,
      },
      {
        milestone: 'act2_end',
        id: 'UNL_SELLO_COBRE',
        name: 'Sello de Cobre',
        description: 'Puzzle: reduce fallos del circuito; Combate: reduce daño eléctrico',
        type: 'puzzle',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_FORMULA_FINAL',
        name: 'Fórmula Final',
        description: 'Elige 1: suero de resistencia, ungüento de plata, o antídoto masivo',
        type: 'choice',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Médico de Campaña',
        text: 'Vos curás gente. Yo fabrico herramientas. Si me pasás datos, no improviso a ciegas.',
        requiresTags: ['tag_medico'],
      },
      {
        condition: 'Si hay Nigromante',
        text: 'No me hables de almas. Hablemos de consecuencias.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Si el Bárbaro es portavoz',
        text: 'Sí, entiendo: querés romperlo. Dame cinco minutos y lo rompo bien.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Con la Criatura',
        text: 'Si te duele la costura… no te la saco. Te la arreglo.',
      },
    ],
    
    dialogueKeys: {
      'npc.bibliotecario': ['dlg_biblioteca_ciencia'],
      'npc.conde': ['dlg_conde_oferta_laboratorio'],
    },
    
    voiceBarks: [
      { text: 'Si chispea, es que todavía responde.' },
      { text: 'No es magia: es disciplina.' },
      { text: 'La vida no es un experimento… hasta que alguien la trata como uno.' },
    ],
    
    voiceTone: 'Curioso, técnico, empático',
    ttsPrompt: 'Voz adulta, español latino neutro, intelectual pero cálida, ritmo medio, pronunciar claro términos técnicos.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Circuito',
        description: 'Reduce umbral de sobrecarga',
        mechanicalEffect: 'Habilita modo seguro con más tolerancia',
      },
      {
        puzzleId: 'PZ-RuedaAstral',
        description: 'Descifra símbolo mecánico',
        mechanicalEffect: 'Pista automática si tiene Sello de Cobre',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Quema sus planos con dolor',
        outcome: 'Tragedia personal, salvación colectiva',
      },
      {
        finalType: 'B',
        description: 'Acepta pacto como ingeniero del Conde',
        outcome: 'Final oscuro de soberbia',
      },
      {
        finalType: 'C',
        description: 'Decide reparar sin dominar',
        outcome: 'Crea un lugar seguro para la Criatura (final esperanzador)',
      },
    ],
  },

  'SB-PC_DHAMPIR': {
    pregenId: 'SB-PC_DHAMPIR',
    fullName: 'Dhampir Duelista',
    
    biography: 'Nació humano, pero no "terminó" humano. Era escolta de una caravana médica que intentó cruzar Sangrebruma con suministros para la abadía. En el puente, los atacaron. Sobrevivió porque alguien le "inyectó vida" con sangre que no era suya: un procedimiento incompleto, desesperado… y prohibido. Desde entonces su pulso es más lento, su hambre más real, y su reflejo a veces tarda en copiarlo.',
    
    moralDilemma: 'Vive con una pregunta que lo corroe: "si me hicieron así para sobrevivir, ¿sigo siendo dueño de mí?"',
    
    prometheusConnection: 'Su dilema Frankenstein es íntimo: ¿soy una persona con un accidente… o un producto al que le quedó conciencia? Cuando conoce a la Criatura del laboratorio, el espejo es brutal: ambos son el resultado de decisiones ajenas.',
    
    actEvolution: {
      act1: 'Oculta su naturaleza por miedo a que lo rechacen. Decisión clave: confesarle al grupo o mentir (F_DHAMPIR_CONFESO).',
      act2: 'Descubre que el castillo usa "protocolos de invitación" y que parte de su sangre responde a ellos. Decisión clave: usar esa ventaja (y endeudarse) o rechazarla (F_INVITACION_INTIMA).',
      act3: 'El Conde le ofrece "completar el proceso": poder, control, y hambre sin dolor. Decisión clave: aceptar (pacto) o sacrificarse por el amanecer (final A).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Confesar su naturaleza dhampir al grupo',
        flagsAffected: ['F_DHAMPIR_CONFESO'],
      },
      {
        act: 2,
        description: 'Rechazar el protocolo de invitación',
        flagsAffected: ['F_INVITACION_INTIMA'],
      },
      {
        act: 3,
        description: 'Rechazar completar el proceso',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -2 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_PASO_SOMBRIO',
        name: 'Paso Sombrío',
        description: 'Bonus 1/encuentro: teleporta 2-3 casillas a sombra visible',
        type: 'bonus',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_HAMBRE_CONTENIDA',
        name: 'Hambre Contenida',
        description: 'Acción adicional 1/encuentro: si impacta, se cura poco o gana resistencia temporal al miedo. Sube corrupción +1',
        type: 'bonus',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_NEGAR_INVITACION',
        name: 'Negar la Invitación',
        description: 'Reacción 1/combate: cancela habilidad de encanto/orden del Conde o vampírico',
        type: 'reaction',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si Paladín del Alba está en party',
        text: 'No te pido perdón por existir. Te pido que mires lo que hago, no lo que soy.',
        requiresTags: ['tag_fe', 'tag_lider'],
      },
      {
        condition: 'Si Exorcista está en party',
        text: 'Si tu luz me quema, avisame antes. Prefiero el dolor al miedo.',
        requiresTags: ['tag_exorcista'],
      },
      {
        condition: 'Si Maldito está en party',
        text: 'Vos y yo… somos la prueba de que esto no es "bien contra mal". Es control contra vida.',
        requiresTags: ['tag_maldito'],
      },
      {
        condition: 'Con la Criatura',
        text: 'A mí también me cambiaron sin preguntar. Si querés un nombre… te doy el mío como préstamo hasta que elijas el tuyo.',
      },
    ],
    
    dialogueKeys: {
      'npc.conde': ['dlg_conde_oferta_completar'],
      'npc.criatura': ['dlg_criatura_espejo_identidad'],
    },
    
    voiceBarks: [
      { text: 'No soy el hambre. Soy la mano que la frena.' },
      { text: 'Si me mirás como arma, te vas a equivocar.' },
      { text: 'Amanecer… también mata. Igual lo elijo.' },
    ],
    
    voiceTone: 'Elegante, controlado, con tensión interna',
    ttsPrompt: 'Voz masculina (o andrógina) adulta, español latino neutro, ritmo medio, tono bajo y preciso; emoción contenida, sin teatralidad.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Espejos',
        description: 'Puede detectar reflejo falso',
        mechanicalEffect: '1 pista automática: si un espejo muestra su reflejo normal, ese espejo está corrupto',
      },
      {
        puzzleId: 'PZ-RuedaAstral',
        description: 'Puede sacrificar sangre',
        mechanicalEffect: 'Fijar un anillo 1 turno sin clavija; costo: +1 corrupción o pierde 1 consumible',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Acepta que el amanecer puede dañarlo',
        outcome: 'Epílogo heroico/trágico',
      },
      {
        finalType: 'B',
        description: 'Acepta completar el proceso con el Conde',
        outcome: 'Epílogo de poder con cadena',
      },
      {
        finalType: 'C',
        description: 'Ayuda a la Criatura a escapar',
        outcome: 'Renuncia al power-up, epílogo de humanidad',
      },
    ],
  },

  'SB-PC_EXORC': {
    pregenId: 'SB-PC_EXORC',
    fullName: 'Exorcista de Campanas',
    
    biography: 'Fue aprendiz en un campanario donde el metal "ordenaba" a la gente: misa, duelo, incendio. Cuando una plaga espiritual llegó, aprendió que el sonido puede salvar o condenar. Viajó a Sangrebruma por una carta de la abadía: "las campanas suenan sin campanas".',
    
    moralDilemma: 'La novela pone el foco en la creación y el abandono: ¿es pecado crear vida y luego dejarla sola?',
    
    prometheusConnection: 'Para el Exorcista, el dilema es: "¿Puedo bendecir a alguien que nació de un acto profano?"',
    
    actEvolution: {
      act1: 'Aprende que "fe" no es solo símbolos; es elegir a quién proteger. Puede activar F_ABADIA_PURIFICADA.',
      act2: 'Entiende que la Criatura no es demonio por defecto; decide si la llama "abominación" o "hijo del error". Eso afecta F_CRIATURA_EMPÁTICA.',
      act3: 'Ante el final, decide si el amanecer vale un sacrificio personal (puede gastar "carga de luz" para salvar a la villa).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Purificar la abadía',
        flagsAffected: ['F_ABADIA_PURIFICADA'],
      },
      {
        act: 2,
        description: 'Llamar a la Criatura "hijo del error" en lugar de abominación',
        flagsAffected: ['F_CRIATURA_EMPÁTICA'],
      },
      {
        act: 3,
        description: 'Sacrificar poder personal por la villa',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -3 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_CAMPANA_INTERIOR',
        name: 'Campana Interior',
        description: 'Bonus: quitar miedo 1/encuentro',
        type: 'bonus',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_SALMO_SILENCIO',
        name: 'Salmo de Silencio',
        description: 'Reacción: cancelar un chillido/aullido que aplica desventaja',
        type: 'reaction',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_CONSAGRAR_RUEDA',
        name: 'Consagración de Rueda',
        description: 'Bloquear un anillo del dial 1 ronda sin check, 1 vez por puzzle',
        type: 'puzzle',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Bruja de Espejos',
        text: 'Tu poder es espejo. El mío es límite. No te voy a dejar sola con eso.',
        requiresTags: ['tag_control', 'tag_espejos'],
      },
      {
        condition: 'Si hay Nigromante',
        text: 'No te juzgo por estudiar huesos. Te juzgo por para qué lo hacés.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Si el Bárbaro es portavoz',
        text: 'Tu fuerza es oración sin palabras. Usala para sostener, no para romper.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Con la Criatura',
        text: 'No sé si tenés alma. Pero sí sé que tenés dolor. Y eso pesa.',
      },
    ],
    
    dialogueKeys: {
      'npc.abadesa': ['dlg_abadesa_fe'],
      'npc.criatura': ['dlg_criatura_bendicion'],
    },
    
    voiceBarks: [
      { text: 'Respirá. La noche también se cansa.' },
      { text: 'Una campana rompe mentiras.' },
      { text: 'No naciste para ser herramienta.' },
    ],
    
    voiceTone: 'Sereno, cálido, firme',
    ttsPrompt: 'Voz adulta serena, español latino neutro, compasiva pero firme, ritmo medio-lento.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Campana',
        description: 'Es director de compás',
        mechanicalEffect: 'Su presencia reduce la complejidad (menos notas o más tolerancia)',
      },
      {
        puzzleId: 'PZ-RitualCorazón',
        description: 'Puede convertir 1 falla en falla parcial',
        mechanicalEffect: 'No suma a contador, 1 vez',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Se queda reconstruyendo abadía',
        outcome: 'Final esperanzador',
      },
      {
        finalType: 'B',
        description: 'Acepta pacto pero deja campana muda',
        outcome: 'Final ambiguo de resistencia',
      },
      {
        finalType: 'C',
        description: 'Bendice a la Criatura',
        outcome: 'Acto de ruptura del ciclo de rechazo',
      },
    ],
  },

  'SB-PC_ROGUE_CRYPT': {
    pregenId: 'SB-PC_ROGUE_CRYPT',
    fullName: 'Pícaro de Catacumbas',
    
    biography: 'Creció en túneles, mercados negros y puertas cerradas. No es malo; es sobreviviente. Llegó a Sangrebruma porque "un castillo" paga bien por cosas que nadie quiere tocar: llaves, mapas y silencio. Su vínculo con el Prometeo es accidental: robó una pieza del laboratorio sin saber qué era… y ahora la niebla lo sigue.',
    
    moralDilemma: 'Su dilema es pragmático: "¿De verdad tengo derecho a vender \'partes\' de algo vivo?"',
    
    prometheusConnection: 'Cuando entiende que el laboratorio no trafica objetos, sino destinos, puede quebrarse o madurar.',
    
    actEvolution: {
      act1: 'Aprende que mentir en Sangrebruma atrae niebla (sube corrupción). Decide si confiesa su robo (activa F_NOTAS_PROMETEO temprano) o lo oculta.',
      act2: 'Es el primero en ver rutas secretas; puede activar F_ATAJO_CATACUMBAS. Decide si usa atajos para salvar gente o solo para salvarse.',
      act3: 'El Conde ofrece perdón a cambio de traición. Decisión clave: entregar un aliado o romper su "instinto de huida".'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Confesar su robo',
        flagsAffected: ['F_NOTAS_PROMETEO'],
      },
      {
        act: 2,
        description: 'Usar atajos para salvar gente',
        flagsAffected: ['F_ATAJO_CATACUMBAS'],
      },
      {
        act: 3,
        description: 'Rechazar traición',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -1 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_PASO_SORDO',
        name: 'Paso Sordo',
        description: 'Acción adicional 1/encuentro: moverse sin provocar reacción',
        type: 'bonus',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_GANZUA_PLATA',
        name: 'Ganzúa de Plata',
        description: 'Puzzle: 1 prueba gratis en PZ-RuedaAstral o PZ-Llaves',
        type: 'puzzle',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_GOLPE_OPORTUNIDAD',
        name: 'Golpe de Oportunidad',
        description: 'Reacción: atacar si el enemigo falla contra él',
        type: 'reaction',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Bárbaro',
        text: 'Vos abrís puertas con hombro. Yo las abro sin que nadie se entere. Dividamos trabajo.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Si hay Paladín',
        text: 'No soy santo. Pero hoy no vendo a nadie.',
        requiresTags: ['tag_fe', 'tag_lider'],
      },
      {
        condition: 'Si hay Alquimista',
        text: 'No me preguntes de dónde lo saqué. Preguntame cuánto falta para salir vivos.',
        requiresTags: ['tag_alquimista'],
      },
      {
        condition: 'Con la Criatura',
        text: 'Yo también fui \'cosa\' para gente con plata. Te entiendo más de lo que debería.',
      },
    ],
    
    dialogueKeys: {
      'npc.mara': ['dlg_mara_sospecha_picaro'],
      'npc.conde': ['dlg_conde_oferta_traicion'],
    },
    
    voiceBarks: [
      { text: 'Tranqui… yo vi peores cerraduras.' },
      { text: 'Si hay trampa, hay premio.' },
      { text: 'No me mires así, fue por necesidad.' },
    ],
    
    voiceTone: 'Rápido, irónico, con grietas de culpa',
    ttsPrompt: 'Voz juvenil/adulta, español latino neutro, ritmo medio-rápido, sarcasmo suave, bajando el tono en frases emotivas.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-RuedaAstral',
        description: 'Puede alinear anillo sin costo',
        mechanicalEffect: '1 vez (representa destreza)',
      },
      {
        puzzleId: 'PZ-Circuito',
        description: 'Puede puentear conexión',
        mechanicalEffect: 'Bypass, pero sube riesgo si falla (activa hazard leve)',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Paga su deuda ayudando a reconstruir',
        outcome: 'Redención con caminos seguros',
      },
      {
        finalType: 'B',
        description: 'Acepta pacto',
        outcome: 'Termina como llavero del Conde (útil pero triste)',
      },
      {
        finalType: 'C',
        description: 'Usa su oficio para rescatar',
        outcome: 'Saca a la Criatura y aldeanos (final heroico inesperado)',
      },
    ],
  },

  'SB-PC_WITCH': {
    pregenId: 'SB-PC_WITCH',
    fullName: 'Bruja de Espejos',
    
    biography: 'No nació bruja; la hicieron. Sobrevivió a un "ritual de espejo" que nadie quiso admitir. Desde entonces, ve reflejos donde otros ven paredes. Vino a Sangrebruma porque la niebla "refleja" cosas que deberían estar muertas. Su vínculo con el Prometeo es visceral: entiende lo que es ser definida por un acto ajeno.',
    
    moralDilemma: 'Si la Criatura mata, ¿es su culpa o del creador?',
    
    prometheusConnection: 'La Bruja se pregunta lo mismo sobre sí misma: "si me hicieron así, ¿soy responsable?"',
    
    actEvolution: {
      act1: 'Aprende a usar su don sin romper a los demás. Puede activar F_POSADA_ALIADA si "apaga" un susto en la posada (evita pánico).',
      act2: 'En la biblioteca, sufre un espejo que la muestra como monstruo. Decide si se odia o se integra al grupo (impacta diálogos con la Criatura).',
      act3: 'El Conde intenta reclutarla ("yo entiendo lo que sos"). Decide si acepta pertenecer al monstruo o a los vivos.'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Apagar susto en la posada',
        flagsAffected: ['F_POSADA_ALIADA'],
      },
      {
        act: 2,
        description: 'Integrarse al grupo en lugar de odiarse',
        flagsAffected: ['F_BRUJA_INTEGRADA'],
      },
      {
        act: 3,
        description: 'Rechazar al Conde',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -2 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_REFLEJO_PROTECTOR',
        name: 'Reflejo Protector',
        description: 'Bonus: dar desventaja a enemigo que apunta a un aliado',
        type: 'bonus',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_ESPEJO_VERDAD',
        name: 'Espejo de Verdad',
        description: 'Puzzle: revela una pista falsa en PZ-RuedaAstral o PZ-Espejos',
        type: 'puzzle',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_CORTE_REFLEJO',
        name: 'Corte del Reflejo',
        description: 'Acción: remover una ilusión/hazard de niebla 1 vez',
        type: 'action',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Exorcista',
        text: 'Si me vas a juzgar, hacelo rápido. Después necesito que me ayudes.',
        requiresTags: ['tag_exorcista'],
      },
      {
        condition: 'Si hay Nigromante',
        text: 'Vos escuchás huesos. Yo escucho mentiras. Somos necesarios, aunque duela.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Si el Bárbaro habla',
        text: 'No me mires como si fuera frágil. Soy peligrosa… y lo sé.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Con la Criatura',
        text: 'A mí también me miraron como error. No sos el único.',
      },
    ],
    
    dialogueKeys: {
      'npc.bibliotecario': ['dlg_biblioteca_espejo'],
      'npc.conde': ['dlg_conde_tentacion_espejos'],
    },
    
    voiceBarks: [
      { text: 'No es un espejo… es una trampa.' },
      { text: 'El reflejo no siempre miente, pero siempre elige.' },
      { text: 'Si me pierdo, tráiganme de vuelta.' },
    ],
    
    voiceTone: 'Vulnerable-firme; oscura sin ser villana',
    ttsPrompt: 'Voz femenina adulta, español latino neutro, tono íntimo, cambios leves entre miedo y determinación.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Espejos',
        description: 'Rol principal: controla/decodifica orientaciones',
        mechanicalEffect: 'Puede marcar correcto/incorrecto una vez',
      },
      {
        puzzleId: 'PZ-RuedaAstral',
        description: 'Interpreta símbolos',
        mechanicalEffect: 'Reduce complejidad: muestra el grupo de símbolos correcto',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Rompe espejos del castillo',
        outcome: 'Liberación (catarsis)',
      },
      {
        finalType: 'B',
        description: 'Queda como reflejo del Conde',
        outcome: 'Final trágico si cae',
      },
      {
        finalType: 'C',
        description: 'Ayuda a la Criatura a entrar al mundo',
        outcome: 'Como alguien, no como sombra',
      },
    ],
  },

  'SB-PC_PALADIN': {
    pregenId: 'SB-PC_PALADIN',
    fullName: 'Paladín del Alba',
    
    biography: 'Juró servir a "la idea del amanecer": no solo la luz física, sino la promesa de que el mal no es permanente. Sangrebruma lo llama como un desafío a su fe: un cielo que no amanece. El Prometeo lo rompe por dentro porque pone en duda su dogma: ¿una vida artificial puede ser sagrada?',
    
    moralDilemma: 'Frankenstein muestra que lo creado puede ser rechazado por "anticomún".',
    
    prometheusConnection: 'El Paladín se debate entre pureza y misericordia: si bendice a la Criatura, ¿traiciona su juramento o lo cumple?',
    
    actEvolution: {
      act1: 'Aprende que autoridad sin empatía fracasa. Puede activar F_ABADIA_PURIFICADA al guiar la secuencia de campanas.',
      act2: 'Frente al laboratorio, decide si su fe condena o protege. Si protege, habilita diálogos empáticos y reduce violencia en la villa.',
      act3: 'Decide si rompe el pacto de sangre con un acto de auto-sacrificio (gasto de recurso, salva aldeanos).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Guiar secuencia de campanas',
        flagsAffected: ['F_ABADIA_PURIFICADA'],
      },
      {
        act: 2,
        description: 'Proteger en lugar de condenar',
        flagsAffected: ['F_FE_PROTECTORA'],
        variablesAffected: { V_VILLA_VIOLENCIA: -2 },
      },
      {
        act: 3,
        description: 'Auto-sacrificio para romper pacto',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -3 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_AURA_CLARIDAD',
        name: 'Aura de Claridad',
        description: 'Bonus: remover desventaja del party 1 vez',
        type: 'bonus',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_MARCA_ALBA',
        name: 'Marca del Alba',
        description: 'Acción: enemigo no puede regenerar 1 ronda',
        type: 'action',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_JURAMENTO_FINAL',
        name: 'Juramento Final',
        description: 'Elección: castigo al Conde (A), pacto vigilado (B), protección a la Criatura (C)',
        type: 'choice',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Nigromante',
        text: 'No te voy a negar. Pero sí te voy a exigir: no uses a los muertos como piezas.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Si el Bárbaro es portavoz',
        text: 'Tu rabia es combustible. Yo pongo dirección.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Si hay Bruja de Espejos',
        text: 'Tu espejo muestra miedo. No lo confundas con verdad.',
        requiresTags: ['tag_control', 'tag_espejos'],
      },
      {
        condition: 'Con la Criatura',
        text: 'No importa cómo naciste. Importa qué elegís ahora.',
      },
    ],
    
    dialogueKeys: {
      'npc.abadesa': ['dlg_abadesa_paladin'],
      'npc.conde': ['dlg_conde_reto_fe'],
    },
    
    voiceBarks: [
      { text: 'Amanecer no es una hora; es una decisión.' },
      { text: 'No pelees solo.' },
      { text: 'La luz no pide permiso.' },
    ],
    
    voiceTone: 'Líder, inspirador, sin sermonear',
    ttsPrompt: 'Voz adulta autoritaria cálida, español latino neutro, ritmo medio, tono esperanzador.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Campana',
        description: 'Habilita marcador de compás visible',
        mechanicalEffect: 'Reduce errores para todos',
      },
      {
        puzzleId: 'PZ-RitualCorazón',
        description: 'Éxito cuenta como doble',
        mechanicalEffect: 'Si party está en 1-1 (última oportunidad), 1 vez',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Se sacrifica para encender el amanecer',
        outcome: 'Épico',
      },
      {
        finalType: 'B',
        description: 'Termina como vigilante del pacto',
        outcome: 'Tragedia noble',
      },
      {
        finalType: 'C',
        description: 'Redefine fe',
        outcome: 'Protege a la Criatura y enfrenta rechazo social',
      },
    ],
  },

  'SB-PC_MEDIC': {
    pregenId: 'SB-PC_MEDIC',
    fullName: 'Médico de Campaña',
    
    biography: 'Vio demasiada sangre para creer en "finales limpios". Su vocación nació en guerra y peste: remendar cuerpos cuando nadie quería mirar. Sangrebruma lo atrae porque el laboratorio promete "remendar la muerte". El Prometeo es su espejo profesional: reconstruir un cuerpo no equivale a reparar una vida.',
    
    moralDilemma: 'En Frankenstein, crear vida no garantiza humanidad, y el rechazo alimenta tragedia.',
    
    prometheusConnection: 'El Médico se pregunta: "si puedo mantener algo con vida… ¿debo hacerlo, aunque su vida sea dolor?"',
    
    actEvolution: {
      act1: 'Se gana la villa con actos concretos (baja sospecha). Puede activar F_POSADA_ALIADA si cura a un aldeano poseído sin dañarlo.',
      act2: 'Ante la Criatura, ve suturas, no monstruo. Puede activar diálogo de "consentimiento": pedir permiso antes de tocar (gana confianza).',
      act3: 'Decide si sacrifica su kit/recursos para salvar a muchos (cambia epílogo de la villa).'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Curar aldeano poseído sin dañarlo',
        flagsAffected: ['F_POSADA_ALIADA'],
      },
      {
        act: 2,
        description: 'Pedir consentimiento a la Criatura',
        flagsAffected: ['F_CRIATURA_CONFÍA'],
      },
      {
        act: 3,
        description: 'Sacrificar kit para salvar a muchos',
        variablesAffected: { V_VILLA_SALVADA: 1 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_ESTABILIZACION_AVANZADA',
        name: 'Estabilización Avanzada',
        description: 'Reacción: evitar que un aliado caiga a 0, 1 vez',
        type: 'reaction',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_SUTURA_EMERGENCIA',
        name: 'Sutura de Emergencia',
        description: 'Bonus: curación pequeña + quitar sangrado',
        type: 'bonus',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_JURAMENTO_CAMPO',
        name: 'Juramento de Campo',
        description: 'Habilidad narrativa: convencer NPCs de no linchar a la Criatura',
        type: 'narrative',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si hay Alquimista',
        text: 'Dame control de dosis. Vos hacés la mezcla, yo miro el cuerpo.',
        requiresTags: ['tag_alquimista'],
      },
      {
        condition: 'Si hay Nigromante',
        text: 'No me importa si hablás con muertos. Me importa si protegés vivos.',
        requiresTags: ['tag_nigromante'],
      },
      {
        condition: 'Si el Bárbaro habla',
        text: 'Tu plan es romper. El mío es que nadie se muera por tu plan.',
        requiresTags: ['tag_barbaro'],
      },
      {
        condition: 'Con la Criatura',
        text: 'No te voy a \'arreglar\'. Te voy a preguntar qué necesitás.',
      },
    ],
    
    dialogueKeys: {
      'npc.mara': ['dlg_mara_confia_medico'],
      'npc.criatura': ['dlg_criatura_consentimiento'],
    },
    
    voiceBarks: [
      { text: 'Respirá conmigo.' },
      { text: 'No sos un informe. Sos alguien.' },
      { text: 'Si duele, paramos.' },
    ],
    
    voiceTone: 'Humano, calmante, urgente en combate',
    ttsPrompt: 'Voz adulta neutra, español latino claro, tono tranquilizador, ritmo medio, respiración audible en tensión.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Circuito',
        description: 'Puede reducir daño por fallo',
        mechanicalEffect: 'Administra shock',
      },
      {
        puzzleId: 'PZ-RitualCorazón',
        description: 'Puede sustituir tirada',
        mechanicalEffect: 'Medicina o Persuasión (mantener pulso del ritual)',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Elige el amanecer aunque pierda la tecnología',
        outcome: 'Ética',
      },
      {
        finalType: 'B',
        description: 'Acepta pacto si garantiza hospitales',
        outcome: 'Pragmático',
      },
      {
        finalType: 'C',
        description: 'Lidera la reinserción de la Criatura',
        outcome: 'Humanización social',
      },
    ],
  },

  'SB-PC_RANGER': {
    pregenId: 'SB-PC_RANGER',
    fullName: 'Explorador',
    
    biography: 'Criado en rutas de contrabando y caminos de mierda donde la brújula es "lo que no te mata". Fue guía de caravanas y rastreador de desaparecidos. Su vínculo con Sangrebruma: una vez aceptó guiar a "médicos" hasta el valle. No sabía que llevaban piezas de laboratorio. Cuando empezó la noche eterna, entendió que fue parte del transporte del horror.',
    
    moralDilemma: 'Su dilema Frankenstein es de responsabilidad indirecta: no creó a la Criatura, pero ayudó a que el sistema existiera.',
    
    prometheusConnection: '¿Cuánto daño te vuelve culpable cuando solo fuiste \'el que abrió la puerta\'?',
    
    actEvolution: {
      act1: 'Se gana la confianza de la villa con acciones prácticas (rutas seguras, trampas contra lobos). Puede activar F_RUTA_SEGURA.',
      act2: 'Encuentra marcas de carga idénticas a las de su antigua caravana. Decisión clave: confesar su pasado al grupo o ocultarlo.',
      act3: 'El Conde ofrece "perdón" por su culpa a cambio de servir como guía de nuevas caravanas. Decisión clave: romper ciclo o asegurar supervivencia.'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Priorizar proteger aldeanos',
        flagsAffected: ['F_RUTA_SEGURA'],
      },
      {
        act: 2,
        description: 'Confesar su pasado al grupo',
        variablesAffected: { V_SOSPECHA_VILLA: -2 },
      },
      {
        act: 3,
        description: 'Romper ciclo rechazando al Conde',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -1 },
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_PASO_TERRENO',
        name: 'Paso de Terreno',
        description: 'Pasivo: ignora terreno difícil 1 vez por combate',
        type: 'passive',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_MARCA_PRESA_V2',
        name: 'Marca de Presa Mejorada',
        description: 'Bonus 1/encuentro: objetivo marcado queda visible aunque haya niebla/cobertura',
        type: 'bonus',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_RED_TRAMPAS',
        name: 'Red de Trampas',
        description: 'Acción 1/combate: coloca 2 casillas-trampa; enemigo queda Derribado o frenado',
        type: 'action',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si Pícaro de Catacumbas está en party',
        text: 'Vos abrís lo cerrado. Yo te digo cuál puerta NO abrir.',
        requiresTags: ['tag_sigilo'],
      },
      {
        condition: 'Si Alquimista está en party',
        text: 'Eso que vos llamás herramienta… yo lo vi cargarse en silencio hacia el castillo.',
        requiresTags: ['tag_alquimista'],
      },
      {
        condition: 'Si Maldito está en party',
        text: 'No te voy a tratar como bestia. Conozco el olor de un humano atrapado.',
        requiresTags: ['tag_maldito'],
      },
      {
        condition: 'En el bosque',
        text: 'La niebla no se cruza discutiendo. Se cruza con decisiones.',
      },
    ],
    
    dialogueKeys: {
      'npc.mara': ['dlg_mara_confesion_ruta'],
      'npc.conde': ['dlg_conde_oferta_guia'],
    },
    
    voiceBarks: [
      { text: 'Si el camino es fácil, es trampa.' },
      { text: 'No sigan huellas que no vuelven.' },
      { text: 'Yo guié esto una vez. No lo voy a guiar dos.' },
    ],
    
    voiceTone: 'Práctico, vigilante, con culpa contenida',
    ttsPrompt: 'Voz adulta, español latino neutro, ritmo medio, tono serio; énfasis en frases cortas tipo consejo.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-RuedaAstral',
        description: 'Puede identificar desgaste en símbolos',
        mechanicalEffect: '1 pista: el anillo correcto muestra marcas de uso',
      },
      {
        puzzleId: 'PZ-Circuito',
        description: 'Habilita ruta segura',
        mechanicalEffect: 'Marca 1 conexión como segura por ronda',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Destruye rutas y registros',
        outcome: 'Nadie repite el transporte del horror',
      },
      {
        finalType: 'B',
        description: 'Acepta pacto para proteger sobrevivientes',
        outcome: 'Queda como guía del Conde',
      },
      {
        finalType: 'C',
        description: 'Lidera evacuación',
        outcome: 'Reintegración de la Criatura, rompe ciclo logístico',
      },
    ],
  },

  'SB-PC_CURSED': {
    pregenId: 'SB-PC_CURSED',
    fullName: 'Maldito',
    
    biography: 'No nació "maldito"; lo hicieron. Fue mordido una vez… pero la mordida no era de un lobo: era de un experimento. Alguien le inyectó un suero de "control de manada" para fabricar soldados. Sobrevivió y escapó, pero desde entonces su cuerpo reacciona a la luna, al miedo y a la sangre como si alguien hubiera instalado un mecanismo adentro.',
    
    moralDilemma: 'Su dilema Frankenstein es el más directo: él es la prueba viva de creación/alteración involuntaria.',
    
    prometheusConnection: 'Tiene miedo de perder control y convertirse en "herramienta perfecta". La pregunta: si fui construido para hacer daño, ¿mi vida es peligrosa por existir?',
    
    actEvolution: {
      act1: 'Oculta síntomas para que no lo expulsen. Decisión clave: confesar la maldición o mentir.',
      act2: 'Descubre notas del suero en el laboratorio. Decisión clave: destruir el suero o usar "dosis de control".',
      act3: 'El Conde le ofrece control absoluto a cambio de obediencia. Decisión clave: aceptar control o elegir sacrificio.'
    },
    
    keyDecisions: [
      {
        act: 1,
        description: 'Confesar la maldición',
        flagsAffected: ['F_MALDICION_REVELADA'],
      },
      {
        act: 2,
        description: 'Destruir el suero en lugar de usarlo',
        variablesAffected: { V_SANGREBRUMA_CORRUPCION: -1 },
      },
      {
        act: 3,
        description: 'Rechazar control del Conde',
        flagsAffected: ['F_MALDITO_LIBRE'],
      },
    ],
    
    unlocks: [
      {
        milestone: 'act1_end',
        id: 'UNL_FURIA_CONTROLADA',
        name: 'Furia Controlada',
        description: 'Bonus 1/encuentro: gana HP temporal + ventaja en check STR, pero termina con agotamiento narrativo',
        type: 'bonus',
      },
      {
        milestone: 'act2_end',
        id: 'UNL_DOSIS_DOMINIO',
        name: 'Dosis de Dominio',
        description: 'Consumible elección: antídoto parcial (menos riesgo) o suero de control (más poder, sube corrupción)',
        type: 'consumable',
      },
      {
        milestone: 'act3_mid',
        id: 'UNL_ANCLA_VOLUNTAD',
        name: 'Ancla de Voluntad',
        description: 'Reacción 1/combate: cancelar pérdida de control (miedo/encanto), queda Derribado',
        type: 'reaction',
      },
    ],
    
    conditionalDialogues: [
      {
        condition: 'Si Exorcista está en party',
        text: 'No necesito perdón. Necesito que me ayudes a no romper a nadie.',
        requiresTags: ['tag_exorcista'],
      },
      {
        condition: 'Si Paladín está en party',
        text: 'Si vas a juzgarme, hacelo ahora. Después no quiero dudas en combate.',
        requiresTags: ['tag_fe', 'tag_lider'],
      },
      {
        condition: 'Si Dhampir está en party',
        text: 'Vos tenés hambre. Yo tengo luna. Ninguno eligió su jaula.',
        requiresTags: ['tag_dhampir'],
      },
      {
        condition: 'Con la Criatura',
        text: 'Yo también me despierto con partes mías que no reconozco.',
      },
    ],
    
    dialogueKeys: {
      'npc.abadesa': ['dlg_abadesa_maldicion'],
      'npc.conde': ['dlg_conde_oferta_control'],
    },
    
    voiceBarks: [
      { text: 'No me acerquen sangre.' },
      { text: 'Si pierdo el control… tírenme al suelo.' },
      { text: 'No soy tu arma. Ni del Conde, ni de nadie.' },
    ],
    
    voiceTone: 'Áspero, contenido, con miedo debajo de la rabia',
    ttsPrompt: 'Voz adulta intensa, español latino neutro, respiración marcada, ritmo medio; enojo contenido y tristeza breve al final.',
    
    puzzleInteractions: [
      {
        puzzleId: 'PZ-Circuito',
        description: 'Puede actuar como tierra',
        mechanicalEffect: 'Absorber 1 sobrecarga para evitar reinicio (recibe daño leve)',
      },
      {
        puzzleId: 'PZ-RitualCorazón',
        description: 'Puede ofrecer sangre-marca',
        mechanicalEffect: 'Componente ritual alternativo, pero sube bloodDebt o corrupción',
      },
    ],
    
    finalHooks: [
      {
        finalType: 'A',
        description: 'Se sacrifica para que el amanecer vuelva',
        outcome: 'Redención dura',
      },
      {
        finalType: 'B',
        description: 'Acepta control del Conde',
        outcome: 'Final de obediencia y culpa',
      },
      {
        finalType: 'C',
        description: 'Elige vivir con su maldición sin ser arma',
        outcome: 'Ayuda a reintegrar a la Criatura (final de identidad)',
      },
    ],
  },
}

/**
 * Obtener lore de un personaje por su pregenId
 */
export function getCharacterLore(pregenId: string): CharacterLore | undefined {
  return CHARACTER_LORE_DATA[pregenId]
}

/**
 * Obtener todos los unlocks disponibles para un personaje en un acto
 */
export function getUnlocksForAct(pregenId: string, act: 1 | 2 | 3): CharacterLore['unlocks'] {
  const lore = getCharacterLore(pregenId)
  if (!lore) return []
  
  const milestones = act === 1 
    ? ['act1_start', 'act1_end'] 
    : act === 2 
    ? ['act2_start', 'act2_end'] 
    : ['act3_start', 'act3_mid', 'act3_end']
  
  return lore.unlocks.filter(u => milestones.includes(u.milestone))
}

/**
 * Obtener diálogos condicionales según tags del party
 */
export function getConditionalDialogues(
  pregenId: string, 
  partyTags: string[]
): CharacterLore['conditionalDialogues'] {
  const lore = getCharacterLore(pregenId)
  if (!lore) return []
  
  return lore.conditionalDialogues.filter(dialogue => {
    if (!dialogue.requiresTags) return true
    return dialogue.requiresTags.some(tag => partyTags.includes(tag))
  })
}
