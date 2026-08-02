import React from 'react';

function SubmitButton({ text, unavailable = false, describedBy }) {
  const baseClasses =
    'w-full rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2';
  const stateClasses = unavailable
    ? 'bg-neutral-300 cursor-not-allowed'
    : 'bg-neutral-900 hover:bg-neutral-800';

  return (
    <button
      type="submit"
      aria-disabled={unavailable}
      aria-describedby={unavailable ? describedBy : undefined}
      className={`${baseClasses} ${stateClasses}`}
    >
      {text}
    </button>
  );
}

export default SubmitButton;
