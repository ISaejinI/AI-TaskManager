"use client";

export default function SharedListCard({ list, currentUserId, onOpen, onDelete }) {
  const safeList = list ?? {};
  const listName = String(safeList.name ?? "").trim() || "Liste sans nom";
  const membersCount = Array.isArray(safeList.members) ? safeList.members.length : 0;
  const isOwner = Boolean(currentUserId) && safeList.ownerId === currentUserId;

  // Accepte plusieurs formats possibles de stats pour faciliter l'integration.
  const totalTasks =
    Number(safeList.totalTasks) ||
    Number(safeList.tasksCount) ||
    (Array.isArray(safeList.tasks) ? safeList.tasks.length : 0);
  const completedTasks =
    Number(safeList.completedTasks) ||
    Number(safeList.completedCount) ||
    (Array.isArray(safeList.tasks)
      ? safeList.tasks.filter((task) => Boolean(task?.completed)).length
      : 0);

  const handleOpen = () => {
    if (typeof onOpen === "function") {
      onOpen(safeList);
    }
  };

  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(safeList);
    }
  };

  return (
    <article
      className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient"
      aria-label={`Liste partagee ${listName}`}
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-title-lg font-semibold text-on-surface">{listName}</h3>
        {isOwner ? (
          <span className="rounded-full bg-primary px-3 py-1 text-label-md font-semibold text-surface-container-lowest">
            Proprietaire
          </span>
        ) : null}
      </header>

      <section className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Statistiques de la liste">
        <p className="rounded-lg bg-surface-container-high px-3 py-2 text-body-md text-on-surface">
          Membres : <span className="font-semibold">{membersCount}</span>
        </p>
        <p className="rounded-lg bg-surface-container-high px-3 py-2 text-body-md text-on-surface">
          Taches : <span className="font-semibold">{totalTasks}</span>
        </p>
        <p className="rounded-lg bg-surface-container-high px-3 py-2 text-body-md text-on-surface">
          Completees : <span className="font-semibold">{completedTasks}</span>
        </p>
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Ouvrir la liste ${listName}`}
          className="rounded-full bg-primary px-5 py-2 text-label-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Ouvrir
        </button>

        {isOwner ? (
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Supprimer la liste ${listName}`}
            className="rounded-full bg-danger px-5 py-2 text-label-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            Supprimer
          </button>
        ) : null}
      </div>
    </article>
  );
}
