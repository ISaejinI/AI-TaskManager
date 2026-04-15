import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 justify-center bg-surface px-3 pb-12 pt-6 sm:px-6">
      <div className="flex w-full max-w-6xl flex-col gap-8">
        <header
          className="rounded-xl bg-surface-container-low p-8 shadow-soft"
          aria-label="En-tete principal"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <h1 className="font-display text-display-lg text-on-surface">TaskManager</h1>
              <p className="max-w-xl text-headline-lg text-on-surface-variant">
                Gere tes taches efficacement avec une interface epuree concue pour la
                clarte mentale.
              </p>
              <nav aria-label="Actions principales" className="mt-2 flex items-center gap-4">
                <Link
                  href="/signup"
                  className="rounded-full bg-primary-gradient px-8 py-3 text-lg font-semibold text-surface-container-lowest shadow-ambient transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Commencer
                </Link>
                <Link
                  href="/login"
                  className="text-body-md font-semibold text-primary hover:text-primary-strong"
                >
                  Se connecter
                </Link>
              </nav>
            </div>
            <section
              className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1"
              aria-label="Fonctionnalites principales"
            >
              <article className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-on-surface"
                  aria-hidden="true"
                >
                  ◎
                </div>
                <h2 className="font-body text-title-lg font-semibold text-on-surface">
                  Focus Absolu
                </h2>
                <p className="mt-2 text-body-md text-on-surface-variant">
                  Elimine les distractions avec une organisation claire.
                </p>
              </article>
              <article className="rounded-xl bg-primary p-5 text-surface-container-lowest shadow-soft">
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest/20"
                  aria-hidden="true"
                >
                  ⚡
                </div>
                <h2 className="font-body text-title-lg font-semibold">Vitesse Eclair</h2>
                <p className="mt-2 text-body-md text-surface-container-lowest/80">
                  Une interface reactive qui suit ton rythme.
                </p>
              </article>
              <article className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-on-surface"
                  aria-hidden="true"
                >
                  ▣
                </div>
                <h2 className="font-body text-title-lg font-semibold text-on-surface">
                  Analytiques
                </h2>
                <p className="mt-2 text-body-md text-on-surface-variant">
                  Suis tes progres avec des indicateurs lisibles.
                </p>
              </article>
            </section>
          </div>
        </header>
      </div>
    </main>
  );
}
