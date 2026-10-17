// Veraltet: Fruehere Seiten haben diese Datei als Service Worker registriert.
// Damit bestehende Installationen nicht auf altem Stand haengen bleiben,
// laedt sie jetzt einfach den aktuellen Service Worker des Portals.
// Neue Seiten registrieren direkt /sicher/service-worker.js.
importScripts('/sicher/service-worker.js');
