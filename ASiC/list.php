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
| Nur GET zulassen
|--------------------------------------------------------------------------
*/

if (
    $_SERVER['REQUEST_METHOD'] !== 'GET'
) {

    http_response_code(405);

    echo json_encode([
        'ok' => false,
        'message' => 'Nur GET erlaubt.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| Wenn Ordner nicht existiert
|--------------------------------------------------------------------------
|
| Ab Rev. 1.52 bewusst eine Fehlermeldung statt einer leeren Liste: Ein
| falscher Pfad in config.php fiel sonst nur als „keine Begehungen“ auf.
| save.php legt den Ordner beim ersten Speichern an; pruefen.php ebenso.
|
*/

if (!is_dir($datenOrdner)) {

    http_response_code(500);

    echo json_encode([
        'ok' => false,
        'message' => 'Datenordner nicht gefunden. Bitte den Pfad in config.php prüfen (oder einmal speichern bzw. pruefen.php aufrufen, um ihn anzulegen).'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/*
|--------------------------------------------------------------------------
| Begehungsdateien berücksichtigen
|--------------------------------------------------------------------------
|
| Zwei Namensmuster werden gefunden:
| - "Begehung_<Datum>_Markt<Nummer>.json" (von save.php selbst erzeugt)
| - "ASiC-Handel_<Firma>_<Datum>.json" (aus "JSON exportieren"/"JSON per
|   Mail teilen" in der App, manuell z. B. per Dateifreigabe in diesen
|   Ordner eingespielt)
|
|--------------------------------------------------------------------------
*/

$filesAutomatisch =
    glob(
        $datenOrdner .
        DIRECTORY_SEPARATOR .
        'Begehung_*.json'
    );

$filesManuell =
    glob(
        $datenOrdner .
        DIRECTORY_SEPARATOR .
        'ASiC-Handel_*.json'
    );

$files =
    array_merge(
        $filesAutomatisch === false ? [] : $filesAutomatisch,
        $filesManuell === false ? [] : $filesManuell
    );


$result = [];


/*
|--------------------------------------------------------------------------
| Dateien analysieren
|--------------------------------------------------------------------------
*/

foreach (
    $files as $file
) {

    if (
        !is_file($file)
    ) {
        continue;
    }


    $json =
        file_get_contents(
            $file
        );


    if (
        $json === false
    ) {
        continue;
    }


    $data =
        json_decode(
            $json,
            true
        );


    if (
        !is_array($data)
    ) {
        continue;
    }


    /*
     * Metadaten aus _nas
     */
    $nas =
        isset($data['_nas']) &&
        is_array($data['_nas'])
            ? $data['_nas']
            : [];


    /*
     * Fallback auf companyInfo
     */
    $companyInfo =
        isset($data['companyInfo']) &&
        is_array($data['companyInfo'])
            ? $data['companyInfo']
            : [];


    $datumISO =
        $nas['datumISO']
        ?? ($companyInfo['datum'] ?? '');


    $datumDE =
        $nas['datumDE']
        ?? '';


    /*
     * Datum bei älteren Dateien umwandeln
     */
    if (
        $datumDE === '' &&
        preg_match(
            '/^\d{4}-\d{2}-\d{2}$/',
            (string)$datumISO
        )
    ) {

        $dateObject =
            DateTime::createFromFormat(
                'Y-m-d',
                $datumISO
            );


        if ($dateObject) {

            $datumDE =
                $dateObject->format(
                    'd.m.Y'
                );
        }
    }


    $marktnummer =
        $nas['marktnummer']
        ?? (
            $companyInfo['marktnummer']
            ?? ''
        );


    $firma =
        $nas['firma']
        ?? (
            $companyInfo['firma']
            ?? ''
        );


    $savedAt =
        $nas['savedAt']
        ?? date(
            'c',
            filemtime($file)
        );


    $result[] = [

        'fileName' =>
            basename(
                $file
            ),

        'datumISO' =>
            $datumISO,

        'datum' =>
            $datumDE,

        'marktnummer' =>
            $marktnummer,

        'firma' =>
            $firma,

        'plzOrt' =>
            (string) ($companyInfo['plzOrt'] ?? ''),

        'savedAt' =>
            $savedAt
    ];
}


/*
|--------------------------------------------------------------------------
| Sortierung:
| neuestes Begehungsdatum zuerst
|--------------------------------------------------------------------------
*/

usort(
    $result,
    function (
        array $a,
        array $b
    ) {

        $dateA =
            $a['datumISO'] ?? '';

        $dateB =
            $b['datumISO'] ?? '';


        if (
            $dateA === $dateB
        ) {

            /*
             * Bei gleichem Datum nach Speicherzeit
             */
            return strcmp(
                $b['savedAt'] ?? '',
                $a['savedAt'] ?? ''
            );
        }


        return strcmp(
            $dateB,
            $dateA
        );
    }
);


/*
|--------------------------------------------------------------------------
| Antwort
|--------------------------------------------------------------------------
*/

echo json_encode([

    'ok' =>
        true,

    'files' =>
        $result

], JSON_UNESCAPED_UNICODE);
