"use client";

import Link from "next/link";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";

// Header de navigation principal avec UserMenu intégré
export default function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full bg-surface px-6 py-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-xl bg-surface-container-low px-5 py-3">
        <h1 className="font-display text-xl font-bold tracking-tight text-on-surface">
          TaskManager
        </h1>
        {/* Navigation principale + UserMenu à droite */}
        <nav aria-label="Navigation principale" className="flex items-center gap-4">
          <ul className="flex items-center gap-2 text-body-md font-semibold">
            <li>
              <Link
                href="/"
                className="rounded-full bg-primary px-4 py-2 text-surface-container-lowest transition-opacity hover:opacity-90"
              >
                Accueil
              </Link>
            </li>
            {user ? (
              <li>
                <Link
                  href="/dashboard"
                  className="rounded-full px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                >
                  Dashboard
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              >
                A propos
              </Link>
            </li>
          </ul>
          {/* Insertion du menu utilisateur à droite de la nav */}
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
