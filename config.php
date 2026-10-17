<?php
/*
|--------------------------------------------------------------------------
| ASiC Handel 1.52 – Server-Konfiguration
|--------------------------------------------------------------------------
|
| Diese Datei wird von save.php, list.php, load.php und pruefen.php gelesen.
| Nur hier anpassen – die übrigen Skripte bleiben unverändert.
| Die Datei gibt beim direkten Aufruf im Browser nichts aus.
|
| datenOrdner – wo die Begehungen als JSON-Dateien gespeichert werden
|
|   Variante A (empfohlen): Ordner AUSSERHALB des Web-Verzeichnisses.
|     Die Dateien sind dann nie über eine Internetadresse abrufbar.
|       Linux:   '/srv/asic-daten'
|       Windows: 'D:\\asic-daten'
|
|   Variante B: Unterordner "daten" im App-Ordner.
|       'datenOrdner' => __DIR__ . DIRECTORY_SEPARATOR . 'daten',
|     Der Ordner wird mitgeliefert und enthält Sperrdateien für Apache
|     (.htaccess) und IIS (web.config). Bei nginx muss eine Sperrregel in
|     der Server-Konfiguration gesetzt werden (siehe Installationsanleitung).
|     Ob die Sperre wirkt, zeigt pruefen.php.
|
|   Der Webserver-/PHP-Benutzer braucht Lese- und Schreibrecht. Fehlt der
|   Ordner, legt save.php ihn beim ersten Speichern selbst an, sofern im
|   übergeordneten Ordner Schreibrecht besteht.
|
| apiKey – Zugriffsschlüssel
|
|   Leer = kein Schlüssel. Nur sinnvoll, wenn der Server ausschließlich im
|   geschützten Firmennetz erreichbar ist.
|   Empfohlen: langer Zufallswert (mindestens 32 Zeichen), z. B. erzeugt mit
|     openssl rand -hex 24
|   Derselbe Wert wird auf jedem iPad in der App unter
|   Einstellungen → „Zugriffsschlüssel“ eingetragen.
|   Ist ein Schlüssel gesetzt, öffnet sich auch pruefen.php nur mit
|     pruefen.php?schluessel=<Schlüssel>
|
|--------------------------------------------------------------------------
*/

// Zeitstempel (savedAt, Dateien in versionen/) in deutscher Zeit
date_default_timezone_set('Europe/Berlin');

return [
    'datenOrdner' => '/srv/asic-daten',
    'apiKey'      => '',
];
