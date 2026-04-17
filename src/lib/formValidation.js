export function buildRequiredFieldErrors(fieldConfig) {
  return Object.fromEntries(
    Object.entries(fieldConfig).map(([fieldName, config]) => {
      const value = String(config?.value ?? "").trim();
      const message = String(config?.message ?? "").trim() || "Champ requis.";

      return [fieldName, value ? null : message];
    })
  );
}

export function hasFieldErrors(fieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}
