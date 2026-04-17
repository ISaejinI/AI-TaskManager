"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "./UserMenu";

function getLinkClassName(isActive) {
  if (isActive) {
    return "rounded-full bg-primary px-4 py-2 text-surface-container-lowest transition-opacity hover:opacity-90";
  }

  return "rounded-full px-4 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface";
}

// Barre de navigation principale avec liens conditionnels selon l'authentification
export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav aria-label="Navigation principale" className="flex items-center gap-4">
      <ul className="flex items-center gap-2 text-body-md font-semibold">
        <li>
          <Link href="/" className={getLinkClassName(pathname === "/")}>
            Accueil
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link
                href="/dashboard"
                className={getLinkClassName(pathname === "/dashboard")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/shared"
                className={getLinkClassName(pathname === "/shared")}
              >
                Listes partagées
              </Link>
            </li>
          </>
        ) : null}
      </ul>
      <UserMenu />
    </nav>
  );
}
