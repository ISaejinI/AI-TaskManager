// Page d'accueil épurée pour TaskManager
export default function Home() {
  return (
    // Conteneur principal centré
    <main className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <section
        className="flex flex-col items-center justify-center gap-8 rounded-xl bg-white/90 dark:bg-zinc-900/80 shadow-lg px-8 py-16"
        aria-label="Page d'accueil TaskManager"
      >
        {/* Titre principal */}
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
          TaskManager
        </h1>
        {/* Sous-titre */}
        <h2 className="text-xl font-medium text-zinc-600 dark:text-zinc-300 mb-6 text-center">
          Gérez vos tâches efficacement
        </h2>
        {/* Bouton "Commencer" */}
        <button
          className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Commencer à utiliser TaskManager"
        >
          Commencer
        </button>
      </section>
    </main>
  );
}
