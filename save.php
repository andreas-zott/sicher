<?php

header('Content-Type: application/json; charset=utf-8');


/*
|--------------------------------------------------------------------------
| Konfiguration
|--------------------------------------------------------------------------
|
| Datenordner und Zugriffsschluessel stehen zentral in config.php
| (im selben Ordner wie dieses Skript). Hier nichts aendern.
|
|--------------------------------------------------------------------------
*/

$asicConfig = require __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

$datenOrdner = (string) ($asicConfig['datenOrdner'] ?? '');

/*
|--------------------------------------------------------------------------
| Optionaler Zugriffsschluessel (Wert in config.php)
|--------------------------------------------------------------------------
*/

$apiKey = (string) ($asicConfig['apiKey'] ?? '');

if ($datenOrdner === '') {

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'message' => 'Datenordner ist in config.php nicht eingetragen.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

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
| Nur POST zulassen
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        'ok' => false,
        'message' => 'Nur POST erlaubt.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| JSON vom Browser einlesen
|--------------------------------------------------------------------------
*/

$input = file_get_contents('php://input');

if ($input === false || trim($input) === '') {

    http_response_code(400);

    echo json_encode([
        'ok' => false,
        'message' => 'Keine Daten empfangen.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| JSON dekodieren
|--------------------------------------------------------------------------
*/

$data = json_decode($input, true);

if (
    !is_array($data) ||
    json_last_error() !== JSON_ERROR_NONE
) {

    http_response_code(400);

    echo json_encode([
        'ok' => false,
        'message' => 'Ungültiges JSON.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| companyInfo sicherstellen
|--------------------------------------------------------------------------
*/

if (
    !isset($data['companyInfo']) ||
    !is_array($data['companyInfo'])
) {

    $data['companyInfo'] = [];
}


/*
|--------------------------------------------------------------------------
| Betriebsdaten
|--------------------------------------------------------------------------
*/

$firma =
    trim(
        (string) (
            $data['companyInfo']['firma'] ?? ''
        )
    );


$marktnummer =
    trim(
        (string) (
            $data['companyInfo']['marktnummer'] ?? ''
        )
    );


$datumISO =
    trim(
        (string) (
            $data['companyInfo']['datum'] ?? ''
        )
    );


/*
|--------------------------------------------------------------------------
| Fehlende Pflichtdaten prüfen
|--------------------------------------------------------------------------
*/

if ($datumISO === '') {

    http_response_code(400);

    echo json_encode([
        'ok' => false,
        'message' => 'Bitte zuerst ein Datum eingeben.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


if ($marktnummer === '') {

    http_response_code(400);

    echo json_encode([
        'ok' => false,
        'message' => 'Bitte zuerst eine Marktnummer eingeben.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| Datum validieren und deutsches Format erzeugen
|--------------------------------------------------------------------------
|
| Erwartet normalerweise:
| 2026-08-25
|
| Daraus wird:
| 25.08.2026
|
|--------------------------------------------------------------------------
*/

$dateObject =
    DateTime::createFromFormat(
        'Y-m-d',
        $datumISO
    );


if (
    !$dateObject ||
    $dateObject->format('Y-m-d') !== $datumISO
) {

    http_response_code(400);

    echo json_encode([
        'ok' => false,
        'message' => 'Das Datum hat ein ungültiges Format.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


$datumDE =
    $dateObject->format('d.m.Y');


/*
|--------------------------------------------------------------------------
| Sicheren Dateinamen erzeugen
|--------------------------------------------------------------------------
*/

function cleanFilePart(
    string $value,
    string $fallback
): string {

    $value =
        trim($value);


    if ($value === '') {
        $value = $fallback;
    }


    /*
     * Umlaute und ß bleiben erhalten.
     * Problematische Zeichen werden zu "-".
     */
    $value =
        preg_replace(
            '/[^a-zA-Z0-9äöüÄÖÜß_-]+/u',
            '-',
            $value
        );


    $value =
        trim(
            $value,
            '-_'
        );


    if ($value === '') {
        return $fallback;
    }


    return $value;
}


$marktnummerDatei =
    cleanFilePart(
        $marktnummer,
        'ohne-Marktnummer'
    );


/*
|--------------------------------------------------------------------------
| Optional: Marktname nur für Metadaten,
| nicht als eindeutiger Schlüssel
|--------------------------------------------------------------------------
*/

$firmaDatei =
    cleanFilePart(
        $firma,
        'Markt'
    );


/*
|--------------------------------------------------------------------------
| Dateiname
|--------------------------------------------------------------------------
|
| Beispiel:
|
| Begehung_25.08.2026_Markt123.json
|
|--------------------------------------------------------------------------
*/

$dateiname =
    'Begehung_' .
    $datumDE .
    '_Markt' .
    $marktnummerDatei .
    '.json';


/*
|--------------------------------------------------------------------------
| Datenordner anlegen
|--------------------------------------------------------------------------
*/

if (!is_dir($datenOrdner)) {

    if (
        !mkdir(
            $datenOrdner,
            0775,
            true
        )
    ) {

        http_response_code(500);

        echo json_encode([
            'ok' => false,
            'message' =>
                'Der Datenordner konnte nicht erstellt werden.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}


/*
|--------------------------------------------------------------------------
| Server-Metadaten hinzufügen
|--------------------------------------------------------------------------
*/

$data['_nas'] = [

    'fileName' =>
        $dateiname,

    'savedAt' =>
        date('c'),

    'datumISO' =>
        $datumISO,

    'datumDE' =>
        $datumDE,

    'marktnummer' =>
        $marktnummer,

    'firma' =>
        $firma
];


/*
|--------------------------------------------------------------------------
| JSON erzeugen
|--------------------------------------------------------------------------
*/

$json =
    json_encode(
        $data,
        JSON_PRETTY_PRINT |
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );


if ($json === false) {

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'message' =>
            'Die Daten konnten nicht in JSON umgewandelt werden.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| Zieldatei
|--------------------------------------------------------------------------
*/

$datei =
    $datenOrdner .
    DIRECTORY_SEPARATOR .
    $dateiname;


/*
|--------------------------------------------------------------------------
| Temporäre Datei schreiben
|--------------------------------------------------------------------------
|
| Dadurch wird verhindert, dass bei einem Abbruch
| eine halbfertige JSON-Datei zurückbleibt.
|
|--------------------------------------------------------------------------
*/

$tempDatei =
    $datei . '.tmp';


if (
    file_put_contents(
        $tempDatei,
        $json,
        LOCK_EX
    ) === false
) {

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'message' =>
            'Die JSON-Datei konnte nicht geschrieben werden.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| Vorherigen Stand sichern
|--------------------------------------------------------------------------
|
| Der Dateiname besteht nur aus Datum und Marktnummer. Wird am selben Tag
| fuer denselben Markt erneut gespeichert, wuerde die alte Datei sonst
| kommentarlos verloren gehen. Deshalb wird sie vorher mit Zeitstempel in
| den Unterordner "versionen" kopiert. list.php/load.php sehen diesen
| Unterordner nicht (kein Treffer im Hauptordner). Schlaegt die Sicherung
| fehl, wird trotzdem gespeichert - die Sicherung ist nur ein Zusatz.
|
*/

if (is_file($datei)) {

    $versionenOrdner =
        $datenOrdner .
        DIRECTORY_SEPARATOR .
        'versionen';

    if (
        is_dir($versionenOrdner) ||
        @mkdir($versionenOrdner, 0775, true)
    ) {

        $sicherung =
            $versionenOrdner .
            DIRECTORY_SEPARATOR .
            preg_replace('/\.json$/', '', $dateiname) .
            '_' .
            date('Ymd-His') .
            '.json';

        @copy($datei, $sicherung);
    }
}


/*
|--------------------------------------------------------------------------
| Vorhandene Datei ersetzen
|--------------------------------------------------------------------------
*/

if (
    !rename(
        $tempDatei,
        $datei
    )
) {

    /*
     * Fallback für Systeme, auf denen rename()
     * eine vorhandene Datei nicht ersetzen kann.
     */
    if (
        file_exists($datei)
    ) {
        @unlink($datei);
    }


    if (
        !rename(
            $tempDatei,
            $datei
        )
    ) {

        @unlink($tempDatei);

        http_response_code(500);

        echo json_encode([
            'ok' => false,
            'message' =>
                'Die gespeicherte Datei konnte nicht ersetzt werden.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}


/*
|--------------------------------------------------------------------------
| Erfolg
|--------------------------------------------------------------------------
*/

echo json_encode([

    'ok' =>
        true,

    'message' =>
        'Begehung auf dem Server gespeichert.',

    'fileName' =>
        $dateiname,

    'datum' =>
        $datumDE,

    'marktnummer' =>
        $marktnummer,

    'firma' =>
        $firma,

    'savedAt' =>
        date('c')

], JSON_UNESCAPED_UNICODE);
