"use client";

import { useMemo, useState } from "react";
import useUserEmailMap from "../hooks/useUserEmailMap";
import AddTaskForm from "./AddTaskForm";
import TaskItem from "./TaskItem";

function formatMember(member) {
  if (typeof member === "string") {
    return { id: member, label: member };
  }

  if (member && typeof member === "object") {
    const memberId = String(member.id ?? member.uid ?? member.userId ?? "");
    const label = String((member.email ?? member.displayName ?? member.name ?? memberId) || "Membre");
    return { id: memberId, label };
  }

  return { id: "", label: "Membre inconnu" };
}

export default function SharedListView({
  list,
  tasks,
  currentUserId,
  members,
  onAddMember,
  onRemoveMember,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onBack,
}) {
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const safeList = list ?? {};
  const listName = String(safeList.name ?? "").trim() || "Liste partagee";
  const isOwner = Boolean(currentUserId) && safeList.ownerId === currentUserId;
  const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);
  const sourceMembers = useMemo(
    () => (Array.isArray(members) ? members : Array.isArray(safeList.members) ? safeList.members : []),
    [members, safeList.members]
  );

  const userIdsToResolve = useMemo(() => {
    const memberIds = sourceMembers.map((member) => formatMember(member).id).filter(Boolean);
    const taskUserIds = safeTasks.map((task) => String(task?.addedBy ?? "").trim()).filter(Boolean);

    return Array.from(new Set([...memberIds, ...taskUserIds]));
  }, [sourceMembers, safeTasks]);

  const userEmailById = useUserEmailMap(userIdsToResolve);

  const normalizedMembers = useMemo(() => {
    return sourceMembers.map((member) => {
      const formattedMember = formatMember(member);
      const resolvedEmail = userEmailById[formattedMember.id];

      return {
        ...formattedMember,
        label: resolvedEmail || formattedMember.label,
      };
    });
  }, [sourceMembers, userEmailById]);

  const handleAddMemberSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = memberEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setMemberError("L'email du membre est obligatoire.");
      return;
    }

    if (typeof onAddMember !== "function") {
      setMemberError("Impossible d'ajouter un membre pour le moment.");
      return;
    }

    try {
      setIsAddingMember(true);
      setMemberError(null);
      await onAddMember(normalizedEmail);
      setMemberEmail("");
    } catch (error) {
      setMemberError(error?.message ?? "Une erreur est survenue lors de l'ajout du membre.");
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleToggleTask = async (task) => {
    if (typeof onUpdateTask !== "function" || !task?.id) {
      return;
    }

    await onUpdateTask(task.id, { completed: !Boolean(task.completed) });
  };

  return (
    <section className="flex flex-col gap-6" aria-label={`Vue detaillee de ${listName}`}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-headline-lg font-semibold text-on-surface">{listName}</h2>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-surface-container-high px-4 py-2 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Retour
        </button>
      </header>

      <section
        className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient"
        aria-label="Membres de la liste"
      >
        <h3 className="text-title-lg font-semibold text-on-surface">Membres</h3>

        {normalizedMembers.length === 0 ? (
          <p className="mt-3 text-body-md text-on-surface-variant">Aucun membre pour le moment.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {normalizedMembers.map((member, index) => {
              const memberId = member.id || `member-${index}`;
              const canRemove = isOwner && member.id && member.id !== safeList.ownerId;

              return (
                <li
                  key={memberId}
                  className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-high px-3 py-2"
                >
                  <span className="text-body-md text-on-surface">{member.label}</span>
                  {canRemove ? (
                    <button
                      type="button"
                      onClick={() => onRemoveMember?.(member.id)}
                      aria-label={`Retirer ${member.label}`}
                      className="rounded-full bg-danger px-4 py-1.5 text-label-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                    >
                      Retirer
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}

        <form onSubmit={handleAddMemberSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="shared-list-member-email" className="text-label-md font-medium text-on-surface">
              Ajouter un membre (email)
            </label>
            <input
              id="shared-list-member-email"
              type="email"
              value={memberEmail}
              onChange={(event) => setMemberEmail(event.target.value)}
              placeholder="email@exemple.com"
              aria-invalid={Boolean(memberError)}
              className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isAddingMember}
            className="rounded-full bg-primary px-6 py-3 text-body-md font-semibold text-surface-container-lowest transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAddingMember ? "Ajout..." : "Ajouter"}
          </button>
        </form>

        {memberError ? (
          <p role="alert" className="mt-3 rounded-lg bg-danger/10 px-4 py-3 text-body-md text-danger">
            {memberError}
          </p>
        ) : null}
      </section>

      <section className="flex flex-col gap-4" aria-label="Taches partagees">
        <h3 className="text-title-lg font-semibold text-on-surface">Taches partagees</h3>

        <AddTaskForm onAddTask={onAddTask} />

        {safeTasks.length === 0 ? (
          <p className="rounded-xl bg-surface-container-lowest p-6 text-body-md text-on-surface-variant shadow-ambient">
            Aucune tache partagee pour le moment.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {safeTasks.map((task) => {
              const taskTitle = String(task?.title ?? "").trim() || "Tache sans titre";
              const taskId = task?.id ?? taskTitle;

              return (
                <TaskItem
                  key={taskId}
                  title={taskTitle}
                  description={task?.description}
                  dueDate={task?.dueDate}
                  completed={Boolean(task?.completed)}
                  priority={task?.priority}
                  authorLabel={
                    userEmailById[String(task?.addedBy ?? "")] ??
                    String(task?.addedByEmail ?? task?.addedBy ?? "Utilisateur inconnu")
                  }
                  dueDateLabel="Date de fin"
                  headingLevel={4}
                  onToggle={() => handleToggleTask(task)}
                  onDelete={() => onDeleteTask?.(task?.id)}
                  deleteAriaLabel={`Supprimer la tache ${taskTitle}`}
                />
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
