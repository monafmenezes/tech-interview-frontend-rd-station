import recommendationService from './recommendation.service';
import mockProducts from '../mocks/mockProducts';

describe('recommendationService', () => {
  test('Retorna recomendação correta para SingleProduct com base nas preferências selecionadas', () => {
    const formData = {
      selectedPreferences: ['Integração com chatbots'],
      selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });

  test('Retorna recomendações corretas para MultipleProducts com base nas preferências selecionadas', () => {
    const formData = {
      selectedPreferences: [
        'Integração fácil com ferramentas de e-mail',
        'Personalização de funis de vendas',
        'Automação de marketing',
      ],
      selectedFeatures: [
        'Rastreamento de interações com clientes',
        'Rastreamento de comportamento do usuário',
      ],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(2);
    expect(recommendations.map((product) => product.name)).toEqual([
      'RD Station CRM',
      'RD Station Marketing',
    ]);
  });

  test('Retorna apenas um produto para SingleProduct com mais de um produto de match', () => {
    const formData = {
      selectedPreferences: [
        'Integração fácil com ferramentas de e-mail',
        'Automação de marketing',
      ],
      selectedFeatures: [
        'Rastreamento de interações com clientes',
        'Rastreamento de comportamento do usuário',
      ],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('Retorna o último match em caso de empate para SingleProduct', () => {
    const formData = {
      selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Conversas');
  });
});

describe('recommendationService - casos de borda', () => {
  test('Retorna lista vazia quando nenhum produto corresponde', () => {
    const formData = {
      selectedPreferences: ['Preferência que não existe no catálogo'],
      selectedFeatures: [],
      selectedRecommendationType: 'MultipleProducts',
    };

    expect(
      recommendationService.getRecommendations(formData, mockProducts)
    ).toEqual([]);
  });

  test('Retorna lista vazia para SingleProduct quando nenhum produto corresponde', () => {
    const formData = {
      selectedPreferences: ['Preferência que não existe no catálogo'],
      selectedFeatures: [],
      selectedRecommendationType: 'SingleProduct',
    };

    expect(
      recommendationService.getRecommendations(formData, mockProducts)
    ).toEqual([]);
  });

  test('Retorna lista vazia quando o usuário não seleciona nada', () => {
    const formData = {
      selectedPreferences: [],
      selectedFeatures: [],
      selectedRecommendationType: 'MultipleProducts',
    };

    expect(
      recommendationService.getRecommendations(formData, mockProducts)
    ).toEqual([]);
  });

  test('Recomenda produto que corresponde apenas por funcionalidade', () => {
    const formData = {
      selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations.map((product) => product.name)).toEqual([
      'RD Conversas',
    ]);
  });

  test('Recomenda produto que corresponde apenas por preferência', () => {
    const formData = {
      selectedPreferences: ['Análise preditiva de dados'],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations.map((product) => product.name)).toEqual([
      'RD Mentor AI',
    ]);
  });

  test('Escolhe o produto de maior pontuação, e não simplesmente o último', () => {
    const formData = {
      selectedPreferences: [
        'Automação de marketing',
        'Testes A/B para otimização de campanhas',
        'Integração com chatbots',
      ],
      selectedRecommendationType: 'SingleProduct',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].name).toBe('RD Station Marketing');
  });

  test('Mantém a ordem original do catálogo, e não a ordem da seleção', () => {
    const formData = {
      selectedPreferences: [
        'Integração com chatbots',
        'Personalização de funis de vendas',
      ],
      selectedRecommendationType: 'MultipleProducts',
    };

    const recommendations = recommendationService.getRecommendations(
      formData,
      mockProducts
    );

    expect(recommendations.map((product) => product.name)).toEqual([
      'RD Station CRM',
      'RD Conversas',
    ]);
  });

  test('Não altera o array de produtos recebido', () => {
    const snapshot = JSON.parse(JSON.stringify(mockProducts));
    const formData = {
      selectedPreferences: ['Automação de marketing'],
      selectedRecommendationType: 'MultipleProducts',
    };

    recommendationService.getRecommendations(formData, mockProducts);

    expect(mockProducts).toEqual(snapshot);
  });

  test('Não quebra quando chamado sem formData', () => {
    expect(
      recommendationService.getRecommendations(undefined, mockProducts)
    ).toEqual([]);
  });

  test('Não quebra quando chamado sem produtos', () => {
    expect(recommendationService.getRecommendations()).toEqual([]);
  });
});
