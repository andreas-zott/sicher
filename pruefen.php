<?php
/*
|--------------------------------------------------------------------------
| ASiC Handel 1.52 – Prüfseite für die Server-Einrichtung
|--------------------------------------------------------------------------
|
| Aufruf im Browser:  https://<server>/<pfad>/ASiC/pruefen.php
| Ist in config.php ein Zugriffsschlüssel gesetzt:
|                     pruefen.php?schluessel=<Schlüssel>
|
| Die Seite prüft PHP-Version, Konfiguration, Datenordner (anlegen, Schreib-
| recht), den Schutz des Datenordners vor direktem Abruf, HTTPS und die
| Upload-Grenze. Sie schreibt nur eine kurze Testdatei in den Datenordner
| und löscht sie sofort wieder. Gespeicherte Begehungen werden nicht
| gelesen, verändert oder angezeigt.
|
| Empfehlung: Nach erfolgreicher Einrichtung löschen oder umbenennen – die
| Seite zeigt Server-Pfade an.
|
|--------------------------------------------------------------------------
*/

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

$ergebnisse = [];

function eintrag(array &$liste, string $status, string $titel, string $text)
{
    $liste[] = ['status' => $status, 'titel' => $titel, 'text' => $text];
}

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function groesseInBytes(string $wert): int
{
    $wert = trim($wert);
    if ($wert === '' || $wert === '-1') {
        return -1;
    }
    $zahl = (int) $wert;
    $einheit = strtolower(substr($wert, -1));
    switch ($einheit) {
        case 'g': $zahl *= 1024;
        // weiter
        case 'm': $zahl *= 1024;
        // weiter
        case 'k': $zahl *= 1024;
    }
    return $zahl;
}

function normPfad(string $pfad): string
{
    $pfad = str_replace('\\', '/', $pfad);
    return rtrim($pfad, '/');
}

/* ---------- 1. Konfiguration laden ---------- */

$configDatei = __DIR__ . DIRECTORY_SEPARATOR . 'config.php';
$config = null;
if (is_file($configDatei)) {
    $config = require $configDatei;
}
$apiKey = is_array($config) ? (string) ($config['apiKey'] ?? '') : '';

/* ---------- Zugang zur Prüfseite ---------- */

if ($apiKey !== '') {
    $angegeben = (string) ($_GET['schluessel'] ?? '');
    if (!hash_equals($apiKey, $angegeben)) {
        http_response_code(401);
        echo '<!doctype html><html lang="de"><meta charset="utf-8"><title>Prüfseite</title>'
            . '<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem">'
            . '<h1>ASiC Handel – Prüfseite</h1><p>In <code>config.php</code> ist ein Zugriffsschlüssel gesetzt. '
            . 'Bitte die Seite mit <code>pruefen.php?schluessel=&lt;Schlüssel&gt;</code> aufrufen.</p></body></html>';
        exit;
    }
}

/* ---------- 2. PHP ---------- */

if (version_compare(PHP_VERSION, '7.0.0', '<')) {
    eintrag($ergebnisse, 'fehler', 'PHP-Version', 'PHP ' . PHP_VERSION . ' ist zu alt. Benötigt wird mindestens PHP 7.0, empfohlen 8.x.');
} elseif (version_compare(PHP_VERSION, '8.0.0', '<')) {
    eintrag($ergebnisse, 'hinweis', 'PHP-Version', 'PHP ' . PHP_VERSION . ' funktioniert. Empfohlen ist eine unterstützte 8.x-Version.');
} else {
    eintrag($ergebnisse, 'ok', 'PHP-Version', 'PHP ' . PHP_VERSION);
}

if (function_exists('json_encode') && function_exists('json_decode')) {
    eintrag($ergebnisse, 'ok', 'JSON-Funktionen', 'vorhanden');
} else {
    eintrag($ergebnisse, 'fehler', 'JSON-Funktionen', 'Die PHP-Erweiterung „json“ fehlt.');
}

/* ---------- 3. config.php ---------- */

$datenOrdner = '';
if (!is_file($configDatei)) {
    eintrag($ergebnisse, 'fehler', 'config.php', 'Die Datei config.php fehlt im App-Ordner.');
} elseif (!is_array($config)) {
    eintrag($ergebnisse, 'fehler', 'config.php', 'config.php liefert keine gültigen Einstellungen. Bitte die Datei aus dem Paket verwenden.');
} else {
    $datenOrdner = trim((string) ($config['datenOrdner'] ?? ''));
    if ($datenOrdner === '') {
        eintrag($ergebnisse, 'fehler', 'config.php', 'In config.php ist kein Datenordner eingetragen.');
    } else {
        eintrag($ergebnisse, 'ok', 'config.php', 'gefunden, Datenordner: <code>' . h($datenOrdner) . '</code>');
    }
}

foreach (['save.php', 'list.php', 'load.php'] as $skript) {
    if (!is_file(__DIR__ . DIRECTORY_SEPARATOR . $skript)) {
        eintrag($ergebnisse, 'fehler', $skript, 'Die Datei fehlt im App-Ordner.');
    }
}

/* ---------- 4. Datenordner ---------- */

$ordnerOk = false;
if ($datenOrdner !== '') {
    if (!is_dir($datenOrdner)) {
        if (@mkdir($datenOrdner, 0775, true)) {
            eintrag($ergebnisse, 'ok', 'Datenordner anlegen', 'Der Ordner war noch nicht vorhanden und wurde jetzt angelegt.');
        } else {
            eintrag($ergebnisse, 'fehler', 'Datenordner anlegen', 'Der Ordner existiert nicht und konnte nicht angelegt werden. Bitte von Hand anlegen und dem Webserver-Benutzer'
                . (function_exists('posix_geteuid') && function_exists('posix_getpwuid') ? ' (<code>' . h((string) (posix_getpwuid(posix_geteuid())['name'] ?? '')) . '</code>)' : '')
                . ' Lese- und Schreibrecht geben.');
        }
    } else {
        eintrag($ergebnisse, 'ok', 'Datenordner vorhanden', '<code>' . h(realpath($datenOrdner) ?: $datenOrdner) . '</code>');
    }

    if (is_dir($datenOrdner)) {
        $test = $datenOrdner . DIRECTORY_SEPARATOR . 'pruef_' . bin2hex(random_bytes(6)) . '.tmp';
        $test2 = $test . '.ok';
        $schreiben = @file_put_contents($test, '{"pruefung":true}', LOCK_EX) !== false;
        $umbenennen = $schreiben && @rename($test, $test2);
        $loeschen = $umbenennen ? @unlink($test2) : @unlink($test);
        if ($schreiben && $umbenennen && $loeschen) {
            $ordnerOk = true;
            eintrag($ergebnisse, 'ok', 'Schreibrecht', 'Testdatei geschrieben, umbenannt und wieder gelöscht.');
        } else {
            eintrag($ergebnisse, 'fehler', 'Schreibrecht', 'Im Datenordner kann nicht vollständig geschrieben werden ('
                . ($schreiben ? 'Schreiben ok' : 'Schreiben fehlgeschlagen') . ', '
                . ($umbenennen ? 'Umbenennen ok' : 'Umbenennen fehlgeschlagen') . ', '
                . ($loeschen ? 'Löschen ok' : 'Löschen fehlgeschlagen') . '). Bitte Rechte des Webserver-Benutzers prüfen.');
        }

        $versionen = $datenOrdner . DIRECTORY_SEPARATOR . 'versionen';
        if (is_dir($versionen) || @mkdir($versionen, 0775, true)) {
            eintrag($ergebnisse, 'ok', 'Unterordner versionen', 'vorhanden bzw. angelegt (hier landen ältere Stände desselben Tages).');
        } else {
            eintrag($ergebnisse, 'hinweis', 'Unterordner versionen', 'konnte nicht angelegt werden. Speichern funktioniert trotzdem, ältere Stände desselben Tages werden dann aber nicht gesichert.');
        }

        $anzahl = count(glob($datenOrdner . DIRECTORY_SEPARATOR . 'Begehung_*.json') ?: [])
            + count(glob($datenOrdner . DIRECTORY_SEPARATOR . 'ASiC-Handel_*.json') ?: []);
        eintrag($ergebnisse, 'info', 'Gespeicherte Begehungen', $anzahl . ' Datei(en) im Datenordner.');
    }
}

/* ---------- 5. Lage des Datenordners und Schutz ---------- */

if ($datenOrdner !== '' && is_dir($datenOrdner)) {
    $root = normPfad((string) (realpath((string) ($_SERVER['DOCUMENT_ROOT'] ?? '')) ?: ''));
    $ordner = normPfad((string) (realpath($datenOrdner) ?: ''));
    $innerhalb = $root !== '' && $ordner !== '' && (strpos($ordner . '/', $root . '/') === 0);

    if (!$innerhalb) {
        eintrag($ergebnisse, 'ok', 'Lage des Datenordners', 'außerhalb des Web-Verzeichnisses – die Dateien sind nicht über eine Internetadresse abrufbar (Variante A).');
    } else {
        $relativ = substr($ordner, strlen($root));
        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['SERVER_PORT'] ?? '') === '443');
        $host = (string) ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $basis = ($https ? 'https://' : 'http://') . $host;
        $name = 'pruef_zugriff_' . bin2hex(random_bytes(4)) . '.json';
        $datei = $datenOrdner . DIRECTORY_SEPARATOR . $name;
        $url = $basis . str_replace('%2F', '/', rawurlencode($relativ)) . '/' . rawurlencode($name);

        if (@file_put_contents($datei, '{"pruefung":true}') === false) {
            eintrag($ergebnisse, 'hinweis', 'Schutz des Datenordners', 'Der Datenordner liegt im Web-Verzeichnis (Variante B). Der Schutz konnte nicht geprüft werden, weil keine Testdatei geschrieben werden konnte.');
        } else {
            $kontext = stream_context_create([
                'http' => ['method' => 'GET', 'timeout' => 5, 'ignore_errors' => true, 'follow_location' => 0],
                'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false],
            ]);
            $antwort = @file_get_contents($url, false, $kontext);
            $statusZeile = isset($http_response_header[0]) ? $http_response_header[0] : '';
            @unlink($datei);
            $code = preg_match('/\s(\d{3})\s?/', $statusZeile, $m) ? (int) $m[1] : 0;

            if ($code === 0) {
                eintrag($ergebnisse, 'hinweis', 'Schutz des Datenordners', 'Der Datenordner liegt im Web-Verzeichnis (Variante B). Der Server konnte sich für den Test nicht selbst aufrufen. Bitte von Hand prüfen: Eine Datei im Datenordner darf im Browser <strong>nicht</strong> abrufbar sein (erwartet: Fehler 403 oder 404).');
            } elseif ($code === 200 && strpos((string) $antwort, 'pruefung') !== false) {
                eintrag($ergebnisse, 'fehler', 'Schutz des Datenordners', 'Der Datenordner liegt im Web-Verzeichnis und ist <strong>nicht geschützt</strong>: Eine Testdatei war unter <code>' . h($url) . '</code> abrufbar. '
                    . 'Apache: AllowOverride für diesen Ordner erlauben, damit die mitgelieferte .htaccess wirkt. nginx: Sperrregel setzen (siehe Anleitung). IIS: web.config im Ordner daten belassen. '
                    . 'Alternativ den Datenordner außerhalb des Web-Verzeichnisses anlegen (Variante A).');
            } else {
                eintrag($ergebnisse, 'ok', 'Schutz des Datenordners', 'Der Datenordner liegt im Web-Verzeichnis (Variante B) und ist gesperrt – direkter Abruf einer Testdatei wurde mit HTTP ' . $code . ' abgewiesen.');
            }
        }
    }
}

/* ---------- 6. HTTPS ---------- */

$httpsAktiv = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
    || (($_SERVER['SERVER_PORT'] ?? '') === '443');
if ($httpsAktiv) {
    eintrag($ergebnisse, 'ok', 'HTTPS', 'Die Seite wurde über HTTPS aufgerufen.');
} else {
    eintrag($ergebnisse, 'fehler', 'HTTPS', 'Die Seite wurde ohne HTTPS aufgerufen. Offline-Betrieb und „Zum Home-Bildschirm“ funktionieren auf dem iPad nur über HTTPS mit gültigem Zertifikat.');
}

/* ---------- 7. Upload-Grenze ---------- */

$post = groesseInBytes((string) ini_get('post_max_size'));
if ($post === -1 || $post >= 20 * 1024 * 1024) {
    eintrag($ergebnisse, 'ok', 'Upload-Grenze', 'post_max_size = ' . h((string) ini_get('post_max_size')));
} else {
    eintrag($ergebnisse, 'hinweis', 'Upload-Grenze', 'post_max_size = ' . h((string) ini_get('post_max_size')) . '. Empfohlen sind mindestens 20M, da Begehungen Vorschaubilder und Unterschriften enthalten können. Bei Überschreitung meldet die App „Keine Daten empfangen.“');
}

/* ---------- 8. Zugriffsschlüssel, Zeitzone ---------- */

if ($apiKey === '') {
    eintrag($ergebnisse, 'hinweis', 'Zugriffsschlüssel', 'Kein Zugriffsschlüssel gesetzt. Das ist nur vertretbar, wenn der Server ausschließlich im Firmennetz erreichbar ist.');
} elseif (strlen($apiKey) < 24) {
    eintrag($ergebnisse, 'hinweis', 'Zugriffsschlüssel', 'gesetzt, aber kurz (' . strlen($apiKey) . ' Zeichen). Empfohlen sind mindestens 32 Zeichen.');
} else {
    eintrag($ergebnisse, 'ok', 'Zugriffsschlüssel', 'gesetzt (' . strlen($apiKey) . ' Zeichen). Denselben Wert auf jedem iPad unter Einstellungen eintragen.');
}

eintrag($ergebnisse, 'info', 'Serverzeit', date('d.m.Y H:i') . ' Uhr (Zeitzone ' . h(date_default_timezone_get()) . ')');

/* ---------- Ausgabe ---------- */

$fehler = count(array_filter($ergebnisse, function ($e) { return $e['status'] === 'fehler'; }));
$hinweise = count(array_filter($ergebnisse, function ($e) { return $e['status'] === 'hinweis'; }));
$symbol = ['ok' => '✓', 'fehler' => '✕', 'hinweis' => '!', 'info' => 'i'];
?>
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>ASiC Handel – Prüfseite</title>
<style>
  :root { --ink:#1c2226; --muted:#5f6b73; --line:#e2e6e9; --ok:#2e7d4f; --err:#cc071e; --warn:#b7791f; --info:#3d6683; }
  body { margin:0; background:#eef0ee; color:var(--ink); font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
  main { max-width:52rem; margin:0 auto; padding:1.5rem 1rem 3rem; }
  h1 { font-size:1.5rem; margin:.2rem 0 .3rem; }
  .kicker { color:var(--err); font-weight:700; font-size:.78rem; letter-spacing:.06em; text-transform:uppercase; }
  .gesamt { margin:1rem 0 1.25rem; padding:.9rem 1rem; border-radius:12px; background:#fff; border:1px solid var(--line); border-left:5px solid var(--ok); }
  .gesamt.fehler { border-left-color:var(--err); }
  .gesamt.hinweis { border-left-color:var(--warn); }
  ul { list-style:none; margin:0; padding:0; background:#fff; border:1px solid var(--line); border-radius:12px; }
  li { display:grid; grid-template-columns:2rem 12rem minmax(0,1fr); gap:.6rem; padding:.7rem 1rem; border-top:1px solid var(--line); }
  li:first-child { border-top:0; }
  .s { display:grid; place-items:center; width:1.6rem; height:1.6rem; border-radius:50%; color:#fff; font-weight:700; font-size:.85rem; }
  .ok .s { background:var(--ok); } .fehler .s { background:var(--err); } .hinweis .s { background:var(--warn); } .info .s { background:var(--info); }
  .t { font-weight:600; }
  code { background:#f3f4f5; padding:.05rem .3rem; border-radius:4px; font-size:.9em; word-break:break-all; }
  .fuss { margin-top:1.25rem; color:var(--muted); font-size:.9rem; }
  @media (max-width:600px) { li { grid-template-columns:2rem minmax(0,1fr); } li .x { grid-column:2; } }
</style>
</head>
<body>
<main>
  <div class="kicker">ASiC Handel 1.52</div>
  <h1>Prüfseite für die Server-Einrichtung</h1>
  <div class="gesamt <?= $fehler ? 'fehler' : ($hinweise ? 'hinweis' : '') ?>">
    <?php if ($fehler): ?>
      <strong><?= $fehler ?> Problem(e) gefunden.</strong> Speichern auf dem Server funktioniert erst, wenn die rot markierten Punkte behoben sind.
    <?php elseif ($hinweise): ?>
      <strong>Einsatzbereit, mit <?= $hinweise ?> Hinweis(en).</strong> Die gelb markierten Punkte sollten geprüft werden.
    <?php else: ?>
      <strong>Alles in Ordnung.</strong> Die App kann auf diesem Server speichern.
    <?php endif; ?>
  </div>
  <ul>
    <?php foreach ($ergebnisse as $e): ?>
      <li class="<?= h($e['status']) ?>">
        <span class="s" aria-hidden="true"><?= $symbol[$e['status']] ?></span>
        <span class="t"><?= h($e['titel']) ?></span>
        <span class="x"><?= $e['text'] ?></span>
      </li>
    <?php endforeach; ?>
  </ul>
  <p class="fuss">Die Prüfseite zeigt Server-Pfade an. Bitte nach erfolgreicher Einrichtung löschen oder umbenennen.
  Für eine spätere Kontrolle kann sie jederzeit wieder hochgeladen werden.</p>
</main>
</body>
</html>
