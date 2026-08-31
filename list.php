<?php

header('Content-Type: application/json; charset=utf-8');


/*
|--------------------------------------------------------------------------
| Konfiguration
|--------------------------------------------------------------------------
|
| Muss exakt derselbe Pfad sein wie in save.php und load.php.
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
*/

if (!is_dir($datenOrdner)) {

    echo json_encode([
        'ok' => true,
        'files' => []
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
|   Mail teilen" in der App, manuell z. B. per File Station in diesen
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
