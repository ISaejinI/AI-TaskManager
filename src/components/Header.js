"use client";

import Navigation from "./Navigation";

// Header principal qui délègue la navigation au composant dédié
export default function Header() {
  return (
    <header className="w-full bg-surface px-6 py-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-xl bg-surface-container-low px-5 py-3">
        <h1 className="font-display text-xl font-bold tracking-tight text-on-surface">
          TaskManager
        </h1>
        <Navigation />
      </div>
    </header>
  );
}
