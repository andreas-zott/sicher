// Zentrale Revisionsnummer der Unfallanzeige-App.
// WICHTIG: Bei jeder inhaltlichen Änderung (neue Felder, geänderte Logik, PDF-Anpassungen)
// APP_REVISION hochzählen und APP_REVISION_DATUM auf das aktuelle Datum setzen.
const APP_REVISION = "1.1";
const APP_REVISION_DATUM = "23.08.2026";

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("app-footer");
  if (el) el.textContent = `Unfallanzeige-App · Revision ${APP_REVISION} · ${APP_REVISION_DATUM}`;
});
