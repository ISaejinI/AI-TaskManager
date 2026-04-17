export function getFirestoreErrorMessage(error) {
  const code = error?.code ?? "";

  switch (code) {
    case "permission-denied":
      return "Acces refuse. Vous n'avez pas la permission.";
    case "not-found":
      return "Cette ressource n'existe plus.";
    case "unavailable":
      return "Service temporairement indisponible. Verifiez votre connexion.";
    case "unauthenticated":
      return "Vous devez etre connecte pour effectuer cette action.";
    default:
      if (!code && typeof error?.message === "string" && error.message.trim()) {
        return error.message;
      }

      return "Une erreur est survenue. Veuillez reessayer.";
  }
}
