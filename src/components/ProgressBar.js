"use client";

export default function ProgressBar({ percentage = 0, label = "Progression" }) {
  const safePercentage = Number.isFinite(percentage)
    ? Math.min(100, Math.max(0, Math.round(percentage)))
    : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-label-sm text-on-surface-variant">{label}</p>
        <p className="text-label-md font-medium text-on-surface">{safePercentage}%</p>
      </div>

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePercentage}
        className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}
