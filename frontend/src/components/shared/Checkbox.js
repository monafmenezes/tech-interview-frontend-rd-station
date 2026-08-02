import React from 'react';

function Checkbox({ children, ...props }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug">
      <input
        type="checkbox"
        {...props}
        className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-900"
      />
      <span>{children}</span>
    </label>
  );
}

export default Checkbox;
