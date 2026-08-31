<?php

header('Content-Type: application/json; charset=utf-8');


/*
|--------------------------------------------------------------------------
| Konfiguration
|--------------------------------------------------------------------------
|
| Muss exakt derselbe Pfad sein wie in save.php und list.php.
|
|--------------------------------------------------------------------------
*/

$datenOrdner = '/volume1/asic-handel-backup/audit-daten';

/*
|--------------------------------------------------------------------------
| Optionaler Zugriffsschluessel
|--------------------------------------------------------------------------
|
| Leer lassen = kein Schluessel erforderlich (bisheriges Verhalten, z. B.
| wenn der Server nur ueber ein geschuetztes Netz wie Tailscale erreichbar
| ist). Zum Aktivieren: eigenen, langen Zufallswert eintragen und denselben
| Wert auf der Einstellungsseite der App unter "Zugriffsschluessel"
| hinterlegen - muss in ALLEN DREI Dateien (save.php/list.php/load.php)
| identisch gesetzt werden.
|
|--------------------------------------------------------------------------
*/

$apiKey = '';

if ($apiKey !== '') {

    $providedKey = $_SERVER['HTTP_X_API_KEY'] ?? '';

    if (!hash_equals($apiKey, $providedKey)) {

        http_response_code(401);

        echo json_encode([
            'ok' => false,
            'message' => 'Ungültiger oder fehlender Zugriffsschlüssel.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}




/*
|--------------------------------------------------------------------------
| Nur GET zulassen
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'message' => 'Nur GET erlaubt.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


/*
|--------------------------------------------------------------------------
| Dateiname aus der Anfrage lesen
|--------------------------------------------------------------------------
|
| ÄNDERUNG gegenüber der vorherigen Version: load.php versuchte bisher
| immer eine fest einprogrammierte Datei "daten/begehung.json" zu laden -
| die von save.php erzeugten Dateien heißen aber
| "Begehung_25.08.2026_Markt123.json" (Datum + Marktnummer im Namen).
| Dadurch konnte "Laden" nie eine der gespeicherten Dateien finden.
| Jetzt wird der gewünschte Dateiname als Parameter erwartet, z. B.:
| load.php?filename=Begehung_25.08.2026_Markt123.json
|
|--------------------------------------------------------------------------
*/

$angeforderterName = $_GET['filename'] ?? '';

if (trim($angeforderterName) === '') {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => 'Bitte einen Dateinamen angeben (?filename=...).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


/*
|--------------------------------------------------------------------------
| Sicherheit: Verzeichnis-Ausbruch verhindern
|--------------------------------------------------------------------------
|
| basename() entfernt jeden Pfadanteil (z. B. "../../"), sodass nur der
| reine Dateiname übrig bleibt. Zusaetzlich wird geprueft, dass der Name
| einem der beiden bekannten Namensmuster entspricht - so kann ueber
| diesen Parameter niemals eine beliebige andere Datei auf dem Server
| gelesen werden.
|
| Muster 1: von save.php selbst erzeugt
|   Begehung_25.08.2026_Markt123.json
| Muster 2: aus "JSON exportieren"/"JSON per Mail teilen" in der App,
| manuell z. B. per File Station in diesen Ordner eingespielt
|   ASiC-Handel_Testmarkt_2026-08-25.json
|
|--------------------------------------------------------------------------
*/

$dateiname = basename($angeforderterName);

$mustergueltigAutomatisch = preg_match('/^Begehung_[0-9]{2}\.[0-9]{2}\.[0-9]{4}_Markt[a-zA-Z0-9äöüÄÖÜß_-]+\.json$/u', $dateiname);
$mustergueltigManuell = preg_match('/^ASiC-Handel_[a-zA-Z0-9äöüÄÖÜß_-]+_[0-9]{4}-[0-9]{2}-[0-9]{2}\.json$/u', $dateiname);

if (!$mustergueltigAutomatisch && !$mustergueltigManuell) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => 'Ungültiger Dateiname.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$datei = $datenOrdner . DIRECTORY_SEPARATOR . $dateiname;


/*
|--------------------------------------------------------------------------
| Datei laden
|--------------------------------------------------------------------------
*/

if (!file_exists($datei)) {
    http_response_code(404);
    echo json_encode([
        'ok' => false,
        'message' => 'Diese Begehung wurde auf dem NAS nicht gefunden.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$json = file_get_contents($datei);

if ($json === false) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Gespeicherte Datei konnte nicht gelesen werden.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/*
 * JSON validieren
 */
$data = json_decode($json, true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Gespeicherte JSON-Datei ist ungültig.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo $json;
