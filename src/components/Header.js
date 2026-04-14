import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Task Manager
        </h1>
        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link href="/" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/tasks"
                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                Taches
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                A propos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
