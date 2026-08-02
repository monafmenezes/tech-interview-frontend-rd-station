import React from 'react';
import Checkbox from '../../shared/Checkbox';

function RecommendationType({
  selectedRecommendationType,
  onRecommendationTypeChange,
}) {
  return (
    <fieldset className="mb-4">
      <legend className="text-lg font-bold mb-2">Tipo de Recomendação:</legend>
      <div className="flex items-center gap-4">
        <Checkbox
          type="radio"
          name="recommendationType"
          value="SingleProduct"
          checked={selectedRecommendationType === 'SingleProduct'}
          onChange={() => onRecommendationTypeChange('SingleProduct')}
        >
          Produto Único
        </Checkbox>
        <Checkbox
          type="radio"
          name="recommendationType"
          value="MultipleProducts"
          checked={selectedRecommendationType === 'MultipleProducts'}
          onChange={() => onRecommendationTypeChange('MultipleProducts')}
        >
          Múltiplos Produtos
        </Checkbox>
      </div>
    </fieldset>
  );
}

export default RecommendationType;
