// ==========================================================================
// ASiC Handel – Zugangscode (Einstellung für den Betreiber)
// ==========================================================================
// Die installierte App (Home-Bildschirm) fragt beim ersten Start nach einem
// Zugangscode. Hier steht NICHT der Code selbst, sondern nur seine
// SHA-256-Prüfsumme – der Code ist im Quelltext damit nicht lesbar.
//
// Neuen Code festlegen:
//   1. Prüfsumme erzeugen (Groß-/Kleinschreibung beachten):
//        Linux/macOS:  printf '%s' 'NeuerCode' | sha256sum
//        PowerShell:   [BitConverter]::ToString((New-Object Security.Cryptography.SHA256Managed).ComputeHash([Text.Encoding]::UTF8.GetBytes('NeuerCode'))).Replace('-','').ToLower()
//   2. Den 64-stelligen Wert unten bei codeHash eintragen.
//   3. Alle Geräte fragen den neuen Code beim nächsten Start einmal ab.
//
// aktiv: false schaltet die Abfrage ganz ab.
//
// Hinweis: Der Zugangscode ist eine Hürde gegen zufälliges Herumstöbern,
// kein Ersatz für einen serverseitigen Zugriffsschutz (Firmennetz,
// Zugriffsschlüssel in config.php, ggf. Anmeldung am Webserver).
// ==========================================================================
window.ASIC_ZUGANG = {
    aktiv: true,
    codeHash: '35dd4578183b7acc2b18153304e59452d7ae1bbe34877d5edccf3ae5964e5232'
};
