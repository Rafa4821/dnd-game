import type { DialogueConfig } from '@/types/dialogue'

/**
 * Diálogos predefinidos de la campaña
 */

export const DIALOGUES: Record<string, DialogueConfig> = {
  // N02 - Mara Carbón en la Posada
  dialogue_mara_posada: {
    id: 'dialogue_mara_posada',
    nodeId: 'N02',
    name: 'Conversación con Mara Carbón',
    npcId: 'npc_mara',
    lines: [
      {
        id: 'line_mara_01',
        speaker: 'npc_mara',
        text: 'Cazadores, ¿verdad? Llevan meses sin llegar. El Conde tiene hambre, y el valle está maldito.',
        options: [
          {
            id: 'opt_mara_01_erudito',
            text: '[Erudito] ¿Qué sabes del Conde? ¿Cuál es su verdadera naturaleza?',
            nextLineId: 'line_mara_02_lore',
            requiredTags: ['tag_erudito'],
            setsFlags: { F_MARA_LORE_CONDE: true },
          },
          {
            id: 'opt_mara_01_fe',
            text: '[Fe] Que Dios nos proteja. ¿Hay alguna reliquia sagrada en el valle?',
            nextLineId: 'line_mara_02_fe',
            requiredTags: ['tag_fe'],
            setsFlags: { F_MARA_RELIQUIA: true },
          },
          {
            id: 'opt_mara_01_general',
            text: 'Cuéntanos sobre el valle. ¿Qué peligros nos esperan?',
            nextLineId: 'line_mara_02_general',
            requiredPartyTags: [],
          },
        ],
      },
      {
        id: 'line_mara_02_lore',
        speaker: 'npc_mara',
        text: 'No es un vampiro común. Fue... creado. Un experimento del viejo doctor que vivía en la abadía. Galvanismo, alquimia profana.',
        options: [
          {
            id: 'opt_mara_02_continue',
            text: 'Entiendo. Sigamos.',
            nextLineId: null,
          },
        ],
      },
      {
        id: 'line_mara_02_fe',
        speaker: 'npc_mara',
        text: 'La capilla de San Vid tiene una reliquia. Dicen que quema a los impuros. Pero está en el cementerio... y los muertos caminan.',
        options: [
          {
            id: 'opt_mara_02_continue',
            text: 'Gracias. Iremos con cuidado.',
            nextLineId: null,
          },
        ],
      },
      {
        id: 'line_mara_02_general',
        speaker: 'npc_mara',
        text: 'Lobos, muertos vivientes, el Prometeo de Hierro en la abadía... Y el Conde, esperando en su castillo. Tened cuidado.',
        options: [
          {
            id: 'opt_mara_02_continue',
            text: 'Lo tendremos. Gracias.',
            nextLineId: null,
          },
        ],
      },
    ],
    onComplete: {
      nextNodeId: 'N03',
    },
  },

  // N07 - Los Colgados
  dialogue_colgados: {
    id: 'dialogue_colgados',
    nodeId: 'N07',
    name: 'El Puente de los Colgados',
    npcId: 'npc_spirit',
    lines: [
      {
        id: 'line_spirit_01',
        speaker: 'npc_spirit',
        text: 'Tres cuerpos cuelgan del puente. Uno susurra: "Cortadnos... o unios a nosotros."',
        options: [
          {
            id: 'opt_spirit_01_medico',
            text: '[Médico] Examino los cuerpos. ¿Cuánto llevan aquí?',
            nextLineId: 'line_spirit_02_medico',
            requiredTags: ['tag_medico'],
            setsFlags: { F_COLGADOS_EXAMINADOS: true },
          },
          {
            id: 'opt_spirit_01_exorcista',
            text: '[Exorcista] Recito una oración de descanso eterno.',
            nextLineId: 'line_spirit_02_exorcista',
            requiredTags: ['tag_exorcista'],
            setsFlags: { F_COLGADOS_EXORCIZADOS: true },
          },
          {
            id: 'opt_spirit_01_cortar',
            text: 'Los cortamos. Merecen descanso.',
            nextLineId: 'line_spirit_02_cortar',
            requiredPartyTags: [],
          },
          {
            id: 'opt_spirit_01_ignorar',
            text: 'Los ignoramos y cruzamos el puente.',
            nextLineId: null,
            setsFlags: { F_COLGADOS_IGNORADOS: true },
          },
        ],
      },
      {
        id: 'line_spirit_02_medico',
        speaker: 'npc_spirit',
        text: 'Semanas. Las marcas en el cuello no son de soga... son garras. Los colgaron después de matarlos.',
        options: [
          {
            id: 'opt_continue',
            text: 'Información valiosa. Continuemos.',
            nextLineId: null,
          },
        ],
      },
      {
        id: 'line_spirit_02_exorcista',
        speaker: 'npc_spirit',
        text: 'Los espíritus suspiran aliviados. Las cuerdas se deshacen solas. Descansarán en paz.',
        options: [
          {
            id: 'opt_continue',
            text: 'Que encuentren paz.',
            nextLineId: null,
          },
        ],
      },
      {
        id: 'line_spirit_02_cortar',
        speaker: 'npc_spirit',
        text: 'Los cuerpos caen al río. Algo se agita en el agua... pero luego se calma.',
        options: [
          {
            id: 'opt_continue',
            text: 'Sigamos adelante.',
            nextLineId: null,
          },
        ],
      },
    ],
    onComplete: {
      nextNodeId: 'N08',
    },
  },

  // N17 - Confrontación con el Conde
  dialogue_conde_final: {
    id: 'dialogue_conde_final',
    nodeId: 'N17',
    name: 'El Salón del Conde',
    npcId: 'npc_count',
    lines: [
      {
        id: 'line_count_01',
        speaker: 'npc_count',
        text: 'Así que habéis llegado. Impresionante. Pocos cruzan mi valle con vida. ¿Venís a negociar... o a morir?',
        options: [
          {
            id: 'opt_count_01_lider',
            text: '[Líder] Venimos a libertar este valle. Ríndete, y vivirás.',
            nextLineId: 'line_count_02_amenaza',
            requiredTags: ['tag_lider'],
            setsFlags: { F_CONDE_AMENAZADO: true },
          },
          {
            id: 'opt_count_01_erudito',
            text: '[Erudito] Sabemos tu secreto. No eres un vampiro natural.',
            nextLineId: 'line_count_02_secreto',
            requiredTags: ['tag_erudito'],
            setsFlags: { F_CONDE_SECRETO_REVELADO: true },
          },
          {
            id: 'opt_count_01_negociar',
            text: 'Podemos llegar a un acuerdo. No tiene que acabar así.',
            nextLineId: 'line_count_02_negociar',
            requiredPartyTags: ['tag_mediador'],
          },
          {
            id: 'opt_count_01_atacar',
            text: 'No negociamos con monstruos. ¡Prepárate!',
            nextLineId: null,
            setsFlags: { F_CONDE_PROVOCADO: true },
          },
        ],
      },
      {
        id: 'line_count_02_amenaza',
        speaker: 'npc_count',
        text: 'Jajaja. Tenéis agallas. Eso os hará... sabrosos. Venid, demostradme vuestro valor.',
        options: [
          {
            id: 'opt_final',
            text: 'Que comience.',
            nextLineId: null,
          },
        ],
      },
      {
        id: 'line_count_02_secreto',
        speaker: 'npc_count',
        text: 'Así que lo sabéis. Sí, fui creado. Pero superé a mi creador. Ahora soy más que humano... más que vampiro.',
        options: [
          {
            id: 'opt_final',
            text: 'Y nosotros te detendremos.',
            nextLineId: null,
          },
        ],
      },
      {
        id: 'line_count_02_negociar',
        speaker: 'npc_count',
        text: 'Interesante. ¿Qué ofrecéis? ¿Vuestras vidas a cambio del valle? Tentador... pero prefiero el sabor de la victoria.',
        options: [
          {
            id: 'opt_final',
            text: 'Entonces luchemos.',
            nextLineId: null,
          },
        ],
      },
    ],
    onComplete: {
      nextNodeId: 'N17_COMBAT',
    },
  },
}

/**
 * Obtener configuración de diálogo por ID
 */
export function getDialogueConfig(dialogueId: string): DialogueConfig | undefined {
  return DIALOGUES[dialogueId]
}
