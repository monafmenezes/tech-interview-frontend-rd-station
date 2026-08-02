import React from 'react';

function RecommendationList({ recommendations }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Recomendações
      </h2>

      {recommendations.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          Nenhuma recomendação encontrada.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {recommendations.map((recommendation) => (
            <li
              key={recommendation.id}
              className="rounded-md border border-neutral-200 px-3 py-2.5"
            >
              <p className="text-sm font-medium">{recommendation.name}</p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {recommendation.category}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecommendationList;
