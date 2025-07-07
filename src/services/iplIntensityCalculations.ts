
export type SkinTone = 
  | 'branco' | 'bege' 
  | 'castanho-claro' | 'castanho-medio' | 'castanho-escuro' 
  | 'castanho-muito-escuro';

export type HairColor = 
  | 'preto' | 'castanho-escuro' | 'castanho-medio' 
  | 'castanho-claro' | 'loiro' | 'ruivo';

interface IplIntensityRecommendation {
  initialIntensity: string;
  maxIntensity: string;
  observations: string;
  isRecommended: boolean;
}

export const getIplIntensityRecommendation = (
  skinTone: SkinTone, 
  hairColor: HairColor
): IplIntensityRecommendation => {
  // Map skin tones to Fitzpatrick scale categories
  const skinToneMap: Record<SkinTone, string> = {
    'branco': 'I-II',
    'bege': 'III',
    'castanho-claro': 'IV',
    'castanho-medio': 'V',
    'castanho-escuro': 'VI',
    'castanho-muito-escuro': 'VI'
  };

  const mappedSkin = skinToneMap[skinTone] || 'III';

  // Check for non-recommended combinations first
  if (mappedSkin === 'VI') {
    return {
      initialIntensity: 'Não recomendado',
      maxIntensity: 'Não recomendado',
      observations: 'Risco alto de queimaduras. Consulte um dermatologista para alternativas seguras.',
      isRecommended: false
    };
  }

  if (hairColor === 'loiro' || hairColor === 'ruivo') {
    return {
      initialIntensity: 'Não recomendado',
      maxIntensity: 'Não recomendado',
      observations: 'Baixa eficácia em cabelos claros. Considere outros métodos de depilação.',
      isRecommended: false
    };
  }

  // Intensity recommendations based on skin tone and hair color
  const intensityMatrix: Record<string, Record<string, IplIntensityRecommendation>> = {
    'I-II': {
      'preto': {
        initialIntensity: 'Nível 3',
        maxIntensity: 'Nível 5',
        observations: 'Comece no nível 3 e aumente para 5 após 2-3 sessões se não houver irritação.',
        isRecommended: true
      },
      'castanho-escuro': {
        initialIntensity: 'Nível 2',
        maxIntensity: 'Nível 4',
        observations: 'Aumente para nível 4 após 3 sessões, monitorando a reação da pele.',
        isRecommended: true
      },
      'castanho-medio': {
        initialIntensity: 'Nível 2',
        maxIntensity: 'Nível 3',
        observations: 'Aumente gradualmente, observando a resposta da pele.',
        isRecommended: true
      },
      'castanho-claro': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 3',
        observations: 'Eficácia pode ser limitada. Monitore os resultados cuidadosamente.',
        isRecommended: true
      }
    },
    'III': {
      'preto': {
        initialIntensity: 'Nível 2',
        maxIntensity: 'Nível 4',
        observations: 'Aumente gradualmente, evitando exposição solar antes e após as sessões.',
        isRecommended: true
      },
      'castanho-escuro': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 3',
        observations: 'Use 1-2 sessões no nível 1 e avance se a pele responder bem.',
        isRecommended: true
      },
      'castanho-medio': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 2',
        observations: 'Proceda com cautela, aumentando apenas se não houver reações.',
        isRecommended: true
      },
      'castanho-claro': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 2',
        observations: 'Eficácia limitada. Considere métodos alternativos.',
        isRecommended: true
      }
    },
    'IV': {
      'preto': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 3',
        observations: 'Teste em pequena área primeiro. Aumente intensidade só se tolerável.',
        isRecommended: true
      },
      'castanho-medio': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 2',
        observations: 'Limite-se ao nível 2 para evitar riscos de hiperpigmentação.',
        isRecommended: true
      },
      'castanho-escuro': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 2',
        observations: 'Use com extrema cautela. Considere consulta dermatológica.',
        isRecommended: true
      },
      'castanho-claro': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 1',
        observations: 'Mantenha intensidade baixa. Eficácia pode ser limitada.',
        isRecommended: true
      }
    },
    'V': {
      'castanho-escuro': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 2',
        observations: 'Use com cuidado extremo, preferindo sessões mais espaçadas.',
        isRecommended: true
      },
      'castanho-medio': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 1',
        observations: 'Mantenha intensidade mínima. Alto risco de hiperpigmentação.',
        isRecommended: true
      },
      'preto': {
        initialIntensity: 'Nível 1',
        maxIntensity: 'Nível 2',
        observations: 'Proceda com extrema cautela. Considere consulta médica.',
        isRecommended: true
      },
      'castanho-claro': {
        initialIntensity: 'Não recomendado',
        maxIntensity: 'Não recomendado',
        observations: 'Risco muito alto. Consulte um dermatologista.',
        isRecommended: false
      }
    }
  };

  // Default fallback
  const defaultRecommendation: IplIntensityRecommendation = {
    initialIntensity: 'Nível 1',
    maxIntensity: 'Nível 2',
    observations: 'Proceda com cautela. Consulte um profissional para orientação personalizada.',
    isRecommended: true
  };

  try {
    return intensityMatrix[mappedSkin]?.[hairColor] || defaultRecommendation;
  } catch (error) {
    console.error("Error calculating IPL intensity:", error);
    return defaultRecommendation;
  }
};
