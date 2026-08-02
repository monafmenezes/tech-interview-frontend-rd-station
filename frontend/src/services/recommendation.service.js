// getRecommendations.js

const countMatches = (items = [], selectedSet) =>
  items.filter((item) => selectedSet.has(item)).length;

const getRecommendations = (
  formData = { selectedPreferences: [], selectedFeatures: [] },
  products = []
) => {
  const {
    selectedPreferences = [],
    selectedFeatures = [],
    selectedRecommendationType,
  } = formData;

  const preferencesSet = new Set(selectedPreferences);
  const featuresSet = new Set(selectedFeatures);

  const matches = products
    .map((product) => ({
      product,
      score:
        countMatches(product.preferences, preferencesSet) +
        countMatches(product.features, featuresSet),
    }))
    .filter(({ score }) => score > 0);

  if (selectedRecommendationType === 'SingleProduct') {
    if (matches.length === 0) return [];

    const best = matches.reduce((champion, candidate) =>
      candidate.score >= champion.score ? candidate : champion
    );

    return [best.product];
  }

  return matches.map(({ product }) => product);
};

const recommendationService = { getRecommendations };

export default recommendationService;
