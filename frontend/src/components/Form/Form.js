// Form.js

import React from 'react';
import { Preferences, Features, RecommendationType } from './Fields';
import { SubmitButton } from './SubmitButton';
import useProducts from '../../hooks/useProducts';
import useForm from '../../hooks/useForm';
import useRecommendations from '../../hooks/useRecommendations';

function Form({ onRecommendationsChange }) {
  const { preferences, features, products } = useProducts();
  const { formData, handleChange } = useForm({
    selectedPreferences: [],
    selectedFeatures: [],
    selectedRecommendationType: '',
  });

  const { getRecommendations } = useRecommendations(products);

  const hasSelection =
    formData.selectedPreferences.length > 0 ||
    formData.selectedFeatures.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasSelection) return;

    const dataRecommendations = getRecommendations(formData);

    onRecommendationsChange(dataRecommendations);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Preferences
        preferences={preferences}
        selectedPreferences={formData.selectedPreferences}
        onPreferenceChange={(selected) =>
          handleChange('selectedPreferences', selected)
        }
      />
      <Features
        features={features}
        selectedFeatures={formData.selectedFeatures}
        onFeatureChange={(selected) =>
          handleChange('selectedFeatures', selected)
        }
      />
      <RecommendationType
        selectedRecommendationType={formData.selectedRecommendationType}
        onRecommendationTypeChange={(selected) =>
          handleChange('selectedRecommendationType', selected)
        }
      />
      <SubmitButton
        text="Obter recomendação"
        unavailable={!hasSelection}
        describedBy="submit-help"
      />
      {!hasSelection && (
        <p id="submit-help" className="mt-2 text-sm text-neutral-500">
          Selecione ao menos uma preferência ou funcionalidade.
        </p>
      )}
    </form>
  );
}

export default Form;
