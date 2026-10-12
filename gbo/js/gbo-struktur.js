// ==========================================================================
// ASiC Handel — GBO: Aufbau nach Gefährdungsfaktoren (ab Rev. 2.1.0)
// ==========================================================================
// Baut die Fragen aus js/gbo-data.js beim Laden in die neue Struktur um:
//   Stufe 1/3  Kernbeurteilung: Pflichtfragen für jeden Markt, gegliedert nach
//              den Gefährdungsfaktoren 0–11 (BGHW/GDA). Eine Risikobewertung
//              je Faktor (1–11).
//   Stufe 2    Inventar: Bereiche, Maschinen und besondere Einrichtungen.
//   Stufe 4    Vertiefung: Bereichs- und Maschinenmodule nach Inventar; einige
//              öffnen sich zusätzlich automatisch bei Handlungs- oder
//              Beratungsbedarf in der Kernbeurteilung (LINKS).
// Fragen-IDs bleiben erhalten. Zusammengeführte bzw. doppelte Fragen werden
// über ALIAS auf die verbleibende Frage übertragen (js/gbo-migrate.js).
// Muss nach gbo-data.js und gbo-quellen.js und vor gbo-migrate.js/gbo.js
// geladen werden.
// ==========================================================================
(function () {
  'use strict';
  var D = window.GBO_DATA;
  if (!D || !D.questions) return;
  var S = window.GBOSources;
  var KEY = 'asicGboStateV1';

  // ------------------------------------------------------------------------
  // Gefährdungsfaktoren
  // ------------------------------------------------------------------------
  var FAKTOREN = [
    ['kern_f0', '0 · Organisation und Pflichten', 'Verantwortung, Beauftragung, Betreuung, Unterweisung, Betriebsanweisungen, Prüfungen, Erste Hilfe, Fremdfirmen, besondere Personengruppen'],
    ['kern_f1', '1 · Mechanische Gefährdungen', 'Verkehrswege, Böden, Absturz, Leitern, Regale, Lager, Transport, Maschinen, Schneiden, Glasbruch'],
    ['kern_f2', '2 · Elektrische Gefährdungen', 'Elektrische Anlagen und Betriebsmittel, Prüfungen'],
    ['kern_f3', '3 · Gefahrstoffe', 'Reinigungs- und Desinfektionsmittel, Haut, sensibilisierende Stoffe'],
    ['kern_f4', '4 · Biologische Arbeitsstoffe', 'Hygiene, verdorbene Ware, Schädlinge'],
    ['kern_f5', '5 · Brand- und Explosionsgefährdungen', 'Brandverhütung, Löscheinrichtungen, Brandschutzhelfer, Räumung, Rauchverbote'],
    ['kern_f6', '6 · Thermische Gefährdungen', 'Heiße und kalte Oberflächen, Kälte- und Hitzearbeit'],
    ['kern_f7', '7 · Physikalische Einwirkungen', 'Lärm, Sonneneinstrahlung'],
    ['kern_f8', '8 · Arbeitsumgebung', 'Raumklima, Beleuchtung, Flucht- und Rettungswege, Sozial- und Pausenräume, Nichtraucherschutz'],
    ['kern_f9', '9 · Physische Belastung', 'Heben, Tragen, Ziehen, Schieben, Körperhaltung, Kasse'],
    ['kern_f10', '10 · Psychische Belastung', 'Verfahren, Arbeitsinhalt, Organisation, Arbeitszeit, soziale Beziehungen, Führung, Kundenkontakt'],
    ['kern_f11', '11 · Sonstige Gefährdungen', 'Überfall, Zahlungsmittel, Ladendiebstahl, Alleinarbeit, weitere betriebliche Gefährdungen']
  ];
  // Themenfeld (js/gbo-quellen.js) -> Gefährdungsfaktor
  var C2F = {
    ORG: 0, AUFTRAG: 0, EH: 0, UNTERW: 0, ARZT: 0, FREMD: 0, MUSCHG: 0, NOTFALL: 0, SONST: 0, M_UNT: 0, M_BEAUFTR: 0, PSA: 0, FUSS: 0,
    VERKEHR: 1, BODEN: 1, TREPPE: 1, TOR: 1, MECH: 1, BEWEGT: 1, LEITER: 1, LAGER: 1, REGAL: 1, TRANSPORT: 1, FFZ: 1, PRESS: 1, LEERGUT: 1,
    SCHERBEN: 1, RAMPE: 1, FAHRZEUG: 1, WINTER: 1, MESSER: 1, VERKAUF: 1, M_BEST: 1, M_BED: 1, M_ENERGIE: 1, M_STOER: 1, M_REIN: 1,
    M_SCHUTZ: 1, M_PRUEF: 1, AREA: 1,
    ELEKTRIK: 2, TECHRAUM: 2,
    GEFSTOFF: 3, HAUT: 3, SENSI: 3, GAS: 3, REIN: 3, CO2: 3, KAELTEANLAGE: 3,
    HYGIENE: 4,
    BRAND: 5, FEUERWERK: 5, RAUCH: 5,
    OBERFL: 6, KAELTE: 6,
    LAERM: 7,
    LICHT: 8, KLIMA: 8, FLUCHT: 8, ARBPL: 8, SOZIAL: 8, SOZIAL_BF: 8, PAUSE: 8,
    KOERPER: 9, ERGO: 9, KASSE: 9, BUERO: 9,
    PSYCH: 10,
    GELD: 11, DIEBSTAHL: 11, ALLEIN: 11
  };
  // Nichtraucherschutz gehört zur Arbeitsumgebung, Rauch-/Zündverbote zum Brandschutz
  var MOD_FAKTOR = { nichtraucher: 8, rauchverbot: 5 };

  // ------------------------------------------------------------------------
  // Inventarabhängige Themen (bleiben auswählbar, gehören zur Vertiefung)
  // ------------------------------------------------------------------------
  var INV_TOPICS = ['feuerwerk', 'gasverkauf', 'leergutshop', 'leergutrueck', 'presscontainer', 'ffz', 'stapler'];
  // Bereiche, die jeder Markt hat: wechseln in den Kern
  var KERN_AREAS = ['wv', 'sozial', 'pause', 'reinigung', 'boden'];

  // ------------------------------------------------------------------------
  // Zusammenführungen (Quelle -> Ziel)
  // ------------------------------------------------------------------------
  var MERGE = [
    ['pause', 'sozial'], ['rampe', 'wa'], ['heiz', 'technik'], ['co2zusatz', 'co2'], ['hautbelastung', 'hautschutz'],
    ['leergutrueck', 'leergutshop'], ['mechanik', 'maschinen'], ['leihpresse', 'dixi'], ['ofen_fleisch', 'ofen_brot'], ['fuehrung', 'psychische_belastungen']
  ];
  var RENAME = {
    sozial: ['Sozial- und Pausenräume', 'Toiletten, Wasch- und Umkleideräume, Pausenraum, barrierefreies WC'],
    wa: ['Warenannahme und Laderampe', 'Anlieferung, Entladen, Rampe, Fahrzeugverkehr'],
    technik: ['Technik- und Heizungsräume', 'Maschinen-, Technik- und Heizungsräume'],
    co2: ['CO₂-Kälteanlage und CO₂-Kühlräume', 'Kälteanlage mit R-744, Detektion, Alarm, Rettung'],
    hautschutz: ['Haut und Feuchtarbeit', 'Hautschutz, Feuchtarbeit, Handschuhe'],
    leergutshop: ['Leergut und Getränke', 'Getränkeshop, Leergutrücknahme, Automaten, Glasbruch'],
    maschinen: ['Maschinen und mechanische Gefährdungen (allgemein)', 'Auswahl, Schutzeinrichtungen, Betriebszustände'],
    dixi: ['Ballen-/Papierpresse', 'eigene Presse oder Leihgerät'],
    ofen_brot: ['Backofen', 'Backshop oder Fleischprodukte – je Ofen eine Instanz'],
    stapler: ['Gabelstapler', 'zusätzlich zu „Flurförderzeuge“']
  };

  // ------------------------------------------------------------------------
  // Doppelte Fragen: alte ID -> verbleibende ID
  // ------------------------------------------------------------------------
  var ALIAS = {
    // innerhalb eines Moduls
    'BRA-06': 'BRA-03', 'UW-04': 'UW-01', 'REG-04': 'REG-02', 'REG-06': 'REG-03', 'RA-05': 'RA-03', 'ZM-03': 'ZM-02',
    'SCH-05': 'SCH-02', 'SCH-04': 'SCH-01', 'PSA-04': 'PSA-03', 'LAG-03': 'LAG-01', 'LAG-04': 'LAG-02', 'KB-04': 'KB-01',
    'VS-04': 'VS-02', 'VW-03': 'VW-02', 'RV-03': 'RV-01', 'NR-02': 'NR-01', 'GAS-05': 'GAS-02', 'GAS-07': 'GAS-04',
    'PC-06': 'PC-03', 'PC-07': 'PC-04', 'AP-03': 'AP-02', 'BEL-03': 'BEL-02', 'MA-06': 'MA-02', 'MA-05': 'MA-03',
    'MECH-02': 'MECH-01', 'ST-04': 'ST-03', 'ST-05': 'ST-02', 'HS-09': 'HS-05', 'LG-02': 'LG-03', 'LGR-06': 'LGR-03',
    'LGR-02': 'LGR-05', 'SENS-03': 'SENS-01', 'SENS-04': 'SENS-02', 'RK-04': 'RK-02', 'TM-03': 'TM-01',
    // Warenverräumung -> Leitern / Regale
    'WV-04': 'LT-01', 'WV-05': 'LT-05', 'WV-10': 'REG-01',
    // Personalführung -> Psychische Belastung
    'FUEHRUNG-01': 'PSY-01', 'FUEHRUNG-02': 'PSY-21', 'FUEHRUNG-03': 'PSY-06', 'FUEHRUNG-04': 'PSY-03', 'FUEHRUNG-05': 'PSY-22',
    'FUEHRUNG-06': 'PSY-04', 'FUEHRUNG-07': 'PSY-05', 'FUEHRUNG-08': 'PSY-16', 'FUEHRUNG-09': 'PSY-17', 'FUEHRUNG-10': 'PSY-15',
    'FUEHRUNG-11': 'PSY-23', 'FUEHRUNG-12': 'PSY-25', 'FUEHRUNG-13': 'PSY-10', 'FUEHRUNG-14': 'PSY-11', 'FUEHRUNG-15': 'PSY-07',
    // Pausenraum -> Sozialräume
    'PAUSE-04': 'SOZ-07', 'PAUSE-05': 'SOZ-08', 'PAUSE-10': 'SOZ-14', 'PAUSE-11': 'SOZ-12', 'PAUSE-09': 'NR-01',
    // Laderampe <-> Warenannahme
    'RAM-06': 'WA-03', 'RAM-05': 'WA-08', 'RAM-08': 'WA-07', 'WA-09': 'RAM-01', 'WA-13': 'RAM-02', 'RAM-12': 'WA-14', 'RAM-16': 'WA-16',
    // Heizungsraum -> Technikräume
    'HEIZ-01': 'TECHNIK-01', 'HEIZ-02': 'TECHNIK-02', 'HEIZ-10': 'TECHNIK-02', 'HEIZ-03': 'TECHNIK-11', 'HEIZ-05': 'TECHNIK-07',
    'HEIZ-06': 'TECHNIK-10', 'HEIZ-08': 'TECHNIK-06', 'HEIZ-11': 'TECHNIK-04', 'HEIZ-12': 'TECHNIK-15', 'HEIZ-13': 'TECHNIK-13',
    'HEIZ-14': 'TECHNIK-14',
    // CO2-Zusatz -> CO2-Kälteanlage
    'CO2ZUSAT-02': 'CO2-04', 'CO2ZUSAT-03': 'CO2-07', 'CO2ZUSAT-04': 'CO2-08', 'CO2ZUSAT-05': 'CO2-08', 'CO2ZUSAT-06': 'CO2-06',
    'CO2ZUSAT-07': 'CO2-10', 'CO2ZUSAT-08': 'CO2-08', 'CO2ZUSAT-10': 'CO2-13', 'CO2ZUSAT-11': 'CO2-12', 'CO2ZUSAT-12': 'CO2-16',
    'CO2ZUSAT-13': 'CO2-18', 'CO2ZUSAT-14': 'CO2-11', 'CO2ZUSAT-15': 'CO2-19',
    // Hautbelastende Tätigkeiten -> Hautschutz
    'HB-02': 'HS-08', 'HB-03': 'HS-06'
  };
  // Leih-Papierpresse LP-03..24 entspricht DX-01..22; Backofen Fleisch = Backofen Brot (gleiche Nummern)
  var PAIR = { leihpresse: ['dixi', function (id) { var n = +id.slice(3); return n >= 3 ? 'DX-' + String(n - 2).padStart(2, '0') : null; }],
               ofen_fleisch: ['ofen_brot', function (id) { return 'OFENBROT-' + id.split('-')[1]; }] };
  (D.questions.leihpresse || []).forEach(function (q) { var t = PAIR.leihpresse[1](q[0]); if (t) ALIAS[q[0]] = t; });
  (D.questions.ofen_fleisch || []).forEach(function (q) { ALIAS[q[0]] = PAIR.ofen_fleisch[1](q[0]); });

  // ------------------------------------------------------------------------
  // Präzisierte Texte (BGHW-Handlungshilfe A 130/A 131); IDs bleiben
  // ------------------------------------------------------------------------
  var TEXT = {
    'AP-05': ['Eingangsfrage psychische Belastung', 'Werden psychische Fehlbelastungen bei der Arbeit vermieden, und ist festgelegt, mit welchem Verfahren sie beurteilt werden (Expertencheck, Befragung, Workshop) und wer beteiligt ist?'],
    'REG-02': ['Beladung', 'Werden Regale bestimmungsgemäß und standsicher beladen und die zulässigen Fach- und Feldlasten beachtet?'],
    'REG-03': ['Prüforganisation', 'Sind Art, Umfang und Fristen der Regalprüfungen (mindestens jährlich durch eine befähigte Person) sowie die Behandlung festgestellter Mängel festgelegt und dokumentiert?'],
    'RA-03': ['Nachsorge', 'Ist geregelt, wie Betroffene nach einem Überfall oder vergleichbaren Gewalt- oder Bedrohungsereignis unmittelbar und anschließend betreut werden?'],
    'ZM-02': ['Bargeldbestand', 'Werden Bargeldbestände regelmäßig abgeschöpft, nicht einsehbar gezählt und verwahrt, und sind Geldtransporte so gestaltet, dass das Überfallrisiko gering bleibt?'],
    'PSA-03': ['Bereitstellung / Benutzung', 'Wird erforderliche PSA in geeigneter Ausführung und passender Größe bereitgestellt, bestimmungsgemäß benutzt, gepflegt und bei Mängeln ersetzt?'],
    'LAG-02': ['Verkehrsflächen', 'Sind Lager- und Verkehrsflächen ausreichend bemessen, freigehalten und frei von Stolperstellen, und ist ein sicherer Zugriff auf Lagergut möglich?'],
    'KB-01': ['Lastenhandhabung', 'Sind Heben, Tragen, Ziehen und Schieben mit einem geeigneten Verfahren (z. B. Leitmerkmalmethode der BAuA) beurteilt – mit Gewicht, Häufigkeit, Greifbedingungen, Wegstrecken und Körperhaltung?'],
    'KB-02': ['Körperhaltungen', 'Sind ungünstige oder lang andauernde Körperhaltungen, dauerhaftes Stehen ohne Bewegungswechsel und einseitig wiederholte Tätigkeiten (z. B. an der Kasse) berücksichtigt?'],
    'PC-03': ['Störung / Blockade', 'Gibt es ein festgelegtes sicheres Verfahren für Störungen und Blockaden einschließlich Stillsetzen und Sicherung gegen Wiederanlauf?'],
    'PC-04': ['Wechsel / Abholung', 'Sind Bereitstellung, Abholung, Wechsel und Rangieren des Presscontainers mit Fremdfirmen bzw. Fahrpersonal sicher abgestimmt?'],
    'GAS-04': ['Notfall', 'Sind Verhalten und Maßnahmen bei Gasaustritt, Brand oder beschädigten Flaschen einschließlich Alarmierung und Abstandhalten festgelegt und unterwiesen?'],
    'MA-03': ['Betriebszustände', 'Sind neben dem Normalbetrieb auch Einrichten, Reinigen, Störungsbeseitigung, Wartung und Wiederanlauf beurteilt?'],
    'ST-02': ['Lasten', 'Sind Aufnehmen, Transportieren, Stapeln und Absetzen von Lasten mit Tragfähigkeit, Lastschwerpunkt und freier Sicht geregelt?'],
    'BRA-02': ['Feuerlöscher', 'Sind geeignete Feuerlöscher in ausreichender Zahl vorhanden, gut erreichbar (Griffhöhe 0,8–1,2 m), gekennzeichnet, frei zugänglich und mindestens alle zwei Jahre geprüft?'],
    'BRA-05': ['Brandlasten / Zündquellen', 'Werden Brandlasten und Zündquellen begrenzt – z. B. Heizgeräte und Strahler mit Abstand zu Brennbarem, keine hintereinander gesteckten Mehrfachsteckdosen, Geräte in Pausen ausgeschaltet?'],
    'EH-02': ['Ersthelfende', 'Stehen während der Arbeitszeit ausreichend ausgebildete Ersthelfende zur Verfügung, werden sie alle zwei Jahre fortgebildet und sind ihre Namen bekannt gemacht?'],
    'UW-02': ['Wiederholung', 'Werden Unterweisungen mindestens jährlich wiederholt – bei Jugendlichen und bei Beschäftigten mit Bargeldumgang bzw. Überfallrisiko mindestens halbjährlich?'],
    'RK-01': ['Raumtemperatur', 'Werden die Mindesttemperaturen eingehalten (Verkaufsraum 19 °C, Büro 20 °C, Pausen- und Sanitärräume 21 °C, überwiegend nicht sitzende Tätigkeit 17 °C) und sind Luftqualität und Luftbewegung angemessen?'],
    'RK-02': ['Hitze / Kälte / Zugluft', 'Werden Hitze (über 26 °C), Kälte und Zugluft ermittelt und erforderliche Maßnahmen getroffen (z. B. Sonnenschutz, Getränke, Türschleier, Windfang)?'],
    'BEL-01': ['Beleuchtungsstärke', 'Ist die Beleuchtung für die Sehaufgabe ausreichend (z. B. Verkaufsraum 300 lx, Büro 500 lx, Lager 50–200 lx, Verkehrswege 50–100 lx) und flimmerfrei?'],
    'OFENBROT-02': ['Bestimmungsgemäße Verwendung', 'Wird der Ofen nur für die vorgesehenen Produkte und Programme verwendet?'],
    'OFENBROT-06': ['Dampf', 'Wird beim Öffnen die Freisetzung von Dampf, Schwaden und Heißluft beachtet (Abstand, Tür zunächst spaltweise öffnen, Abzug)?'],
    'OFENBROT-08': ['Heiße Bleche und Behälter', 'Sind für heiße Bleche und Behälter geeignete Hitzeschutzhandschuhe, Zangen und Transporthilfen vorhanden?'],
    'OFENBROT-09': ['Verbrennungsgefahr', 'Ist die Gefahr von Verbrennungen am Gargut, an Blechen, durch heißes Fett und beim Umsetzen begrenzt (Auffangwannen, Abkühlung)?'],
    'OFENBROT-13': ['Reinigung', 'Ist die Reinigung geregelt (Abkühlzeit, Reinigungsmittel, Schutzbrille und Handschuhe, Fettablagerungen)?']
  };
  var TOPIC_PREFIX = { 'HEIZ-04': 'Heizung: ', 'HEIZ-07': 'Heizung: ', 'HEIZ-09': 'Heizung: ', 'HEIZ-15': 'Heizung: ',
    'LP-01': 'Leihgerät: ', 'LP-02': 'Leihgerät: ', 'CO2ZUSAT-01': 'Kühlraum: ', 'CO2ZUSAT-09': 'Kühlraum: ' };

  // ------------------------------------------------------------------------
  // Neue Kernfragen (BGHW A 130/A 131): [ID, Thema, Frage, Faktor, Gruppe, Themenfeld, U, Rechtsbezug, Maßnahmen]
  // ------------------------------------------------------------------------
  var NEU = [
    ['ORG-06', 'Betriebsanweisungen', 'Liegen für Maschinen, Geräte, Gefahrstoffe und den Umgang mit Zahlungsmitteln (einschließlich Verhalten bei Überfällen) verständliche Betriebsanweisungen vor, sind sie bekannt gegeben und aktuell?', 0, 'Unternehmer / Pflichten allgemein', 'ORG', true,
      'ArbSchG § 9; BetrSichV § 12; GefStoffV § 14; DGUV Vorschrift 25',
      ['Betriebsanweisungen erstellen (Musterbetriebsanweisungen der BGHW nutzen)', 'Betriebsanweisungen bekannt geben und am Arbeitsplatz verfügbar machen', 'Einhaltung der Betriebsanweisungen überwachen', 'Betriebsanweisungen jährlich auf Aktualität prüfen']],
    ['ORG-07', 'Prüfung von Arbeitsmitteln', 'Sind Art, Umfang und Fristen der Prüfungen aller Arbeitsmittel (z. B. Leitern, Elektrogeräte, Regale, Tore, Flurförderzeuge, Maschinen) festgelegt, und werden sie durch befähigte Personen durchgeführt und dokumentiert?', 0, 'Unternehmer / Pflichten allgemein', 'M_PRUEF', false,
      'BetrSichV §§ 3, 14; TRBS 1201; TRBS 1203',
      ['Prüffristen für alle Arbeitsmittel festlegen (TRBS 1201)', 'Befähigte Personen benennen bzw. beauftragen (TRBS 1203)', 'Sichtprüfung vor der Verwendung anweisen', 'Prüfnachweise führen und bis zur nächsten Prüfung aufbewahren']],
    ['JA-01', 'Jugendliche – Beschäftigungsbeschränkungen', 'Werden für Jugendliche unter 18 Jahren die Beschäftigungsverbote und -beschränkungen beachtet (z. B. gefährliche Maschinen, Akkord, Arbeitszeit, Ruhepausen)?', 0, 'Besondere Personengruppen', 'SONST', false,
      'JArbSchG §§ 8–18, 22, 23',
      ['Gefährliche Arbeiten für Jugendliche ausschließen bzw. nur unter Aufsicht zulassen', 'Arbeitszeit- und Pausengrenzen des JArbSchG im Dienstplan berücksichtigen', 'Liste der für Jugendliche verbotenen Maschinen aushängen']],
    ['JA-02', 'Jugendliche – Unterweisung und Untersuchung', 'Werden Jugendliche vor Beginn und danach mindestens halbjährlich unterwiesen, und liegen die ärztlichen Bescheinigungen über Erst- bzw. Nachuntersuchung vor?', 0, 'Besondere Personengruppen', 'UNTERW', true,
      'JArbSchG §§ 29, 32, 33',
      ['Jugendliche vor Beginn und mindestens halbjährlich unterweisen', 'Unterweisung schriftlich dokumentieren', 'Bescheinigung der Erstuntersuchung vor Beschäftigungsbeginn vorlegen lassen']],
    ['ABS-01', 'Absturz an Bühnen, Podesten und Rampen', 'Sind Lagerbühnen, Podeste, Laderampen und Arbeitsplätze mit mehr als 1 m Absturzhöhe gegen Absturz gesichert (Geländer, Haltebügel, Schleusengeländer an Lastübergabestellen)?', 1, 'Verkehrswege', 'TREPPE', true,
      'ArbStättV Anhang 2.1; ASR A2.1; BGHW A 131',
      ['Geländer bzw. Haltebügel anbringen', 'Lastübergabestellen mit Schleusengeländer sichern und nach dem Be-/Entladen schließen', 'Absturzkanten auffällig kennzeichnen', 'Abgänge als Treppe oder Schräge gestalten']],
    ['KA-05', 'Einzugsstellen am Kassenband', 'Sind Einzugsstellen an Kassenarbeitsplätzen gesichert (kleiner Abstand zwischen Förderband und Warenrutsche, kein Spalt an Umlenkrollen, Springblech lose eingelegt)?', 1, 'Kassen', 'MECH', true,
      'BetrSichV § 6; BGHW A 131',
      ['Abstand zwischen Förderband und Warenrutsche minimieren', 'Umlenkrollen so einstellen, dass kein Spalt zum Kassentisch entsteht', 'Springblech lose einlegen und Band regelmäßig reinigen']],
    ['VW-06', 'Glasflächen', 'Sind Glastüren und Glaswände in Verkehrswegen in Augenhöhe gekennzeichnet bzw. aus Sicherheitsglas, und sind beschädigte Glasflächen gesichert?', 1, 'Verkehrswege', 'VERKEHR', false,
      'ArbStättV Anhang 1.5, 1.7; ASR A1.6; DGUV Information 208-014',
      ['Glasflächen in Augenhöhe kennzeichnen', 'Beschädigte Glasflächen sofort sichern (abkleben, ersetzen)', 'Bei Erneuerung Sicherheitsglas verwenden']],
    ['VW-07', 'Stoßstellen', 'Sind Stoßstellen in Kopfhöhe (z. B. Dekoration, Schilder, Regalaufbauten) vermieden, gepolstert oder gelb-schwarz gekennzeichnet?', 1, 'Verkehrswege', 'VERKEHR', true,
      'ASR A1.8; ASR A1.3; BGHW A 131',
      ['Dekoration und Schilder höher hängen', 'Unvermeidbare Stoßstellen polstern', 'Stoßstellen gelb-schwarz kennzeichnen']],
    ['EL-01', 'Zustand elektrischer Geräte', 'Sind elektrische Geräte, Leitungen, Stecker und Schalter unbeschädigt, und werden schadhafte Geräte bis zur Instandsetzung der Benutzung entzogen?', 2, 'Elektrische Anlagen und Geräte', 'ELEKTRIK', true,
      'DGUV Vorschrift 3 § 3; BetrSichV § 4',
      ['Schadhafte Geräte sofort der Benutzung entziehen', 'Mängel durch eine Elektrofachkraft beseitigen lassen', 'Beschäftigte zur Sichtkontrolle vor Benutzung anweisen']],
    ['EL-02', 'Prüfung elektrischer Betriebsmittel', 'Werden ortsveränderliche und ortsfeste elektrische Betriebsmittel und Anlagen in festgelegten Fristen durch eine Elektrofachkraft geprüft und die Prüfungen dokumentiert?', 2, 'Elektrische Anlagen und Geräte', 'ELEKTRIK', false,
      'DGUV Vorschrift 3 § 5; BetrSichV § 14; DGUV Information 203-071',
      ['Prüffristen festlegen (Gefährdungsbeurteilung, DGUV Vorschrift 3)', 'Prüfung durch Elektrofachkraft beauftragen', 'Prüfprotokolle bzw. Prüfplaketten führen']],
    ['EL-03', 'Elektrische Anlage', 'Sind Verteiler und Sicherungskästen verschlossen bzw. vollständig abgedeckt, Leuchtenabdeckungen intakt und Lichtschalter unbeschädigt?', 2, 'Elektrische Anlagen und Geräte', 'ELEKTRIK', false,
      'DGUV Vorschrift 3; BGHW A 131',
      ['Fehlende Abdeckungen im Sicherungskasten ergänzen lassen', 'Defekte Leuchtenabdeckungen ersetzen', 'Verteiler verschließen und freihalten']],
    ['EL-04', 'Leitungen und Dekoration', 'Werden Leitungen nicht durch Türen oder Fenster geführt, Mehrfachsteckdosen nicht hintereinandergesteckt und Dekoration von Leitungen und Leuchten ferngehalten?', 2, 'Elektrische Anlagen und Geräte', 'ELEKTRIK', true,
      'DGUV Vorschrift 3; BGHW A 131',
      ['Leitungen sicher verlegen, nicht durch Türen oder Fenster', 'Mehrfachsteckdosen nicht hintereinanderschalten', 'Dekoration von Leitungen und Leuchten fernhalten']],
    ['GS-01', 'Beschädigte Ware mit Gefahrstoffen', 'Ist der Umgang mit beschädigter oder ausgelaufener Verkaufsware mit Gefahrstoffen (z. B. Reiniger, Grillanzünder, Spraydosen, Lampenöl) geregelt?', 3, 'Gefahrstoffe in der Verkaufsware', 'GEFSTOFF', true,
      'GefStoffV §§ 7, 13; TRGS 510',
      ['Bindemittel und Schutzhandschuhe bereitstellen', 'Vorgehen und Entsorgung festlegen', 'Beschäftigte zum Umgang mit ausgelaufenen Produkten unterweisen']],
    ['BIO-01', 'Biologische Arbeitsstoffe', 'Sind Tätigkeiten mit möglichem Kontakt zu biologischen Arbeitsstoffen ermittelt (z. B. verdorbene Ware, Schimmel, Leergutrückstände, Tierkot) und Hygienemaßnahmen festgelegt?', 4, 'Hygiene und biologische Arbeitsstoffe', 'HYGIENE', true,
      'BiostoffV §§ 4, 9; TRBA 500',
      ['Schutzhandschuhe für den Umgang mit verdorbener Ware bereitstellen', 'Handwaschgelegenheit, Hautreinigung und Desinfektion bereitstellen', 'Hygieneregeln unterweisen']],
    ['BIO-02', 'Schädlingsbefall', 'Ist geregelt, wie bei Schädlingsbefall vorzugehen ist (Fachfirma, keine eigene Bekämpfung mit Bioziden, Reinigung kontaminierter Bereiche)?', 4, 'Hygiene und biologische Arbeitsstoffe', 'HYGIENE', false,
      'BiostoffV; GefStoffV; LMHV',
      ['Schädlingsbekämpfung durch Fachfirma beauftragen', 'Meldeweg bei Befall festlegen', 'Kontaminierte Bereiche mit Schutzhandschuhen reinigen']],
    ['BR-01', 'Brandschutzordnung und Pläne', 'Gibt es eine Brandschutzordnung (Teil A ausgehängt) sowie aktuelle Flucht- und Rettungspläne, und sind sie den Beschäftigten bekannt?', 5, 'Brandschutz', 'BRAND', true,
      'ArbStättV § 4 Abs. 4; ASR A2.2; ASR A2.3; DIN 14096',
      ['Brandschutzordnung erstellen bzw. aktualisieren', 'Flucht- und Rettungspläne aushängen', 'Inhalte in der Unterweisung behandeln']],
    ['BR-02', 'Räumungsübungen', 'Werden Räumungs- bzw. Evakuierungsübungen in angemessenen Abständen durchgeführt und ausgewertet?', 5, 'Brandschutz', 'BRAND', false,
      'ArbSchG § 10; ASR A2.3',
      ['Räumungsübung planen und durchführen', 'Ergebnisse auswerten und Mängel abstellen', 'Sammelstelle festlegen und bekannt machen']],
    ['BR-03', 'Brandschutztüren', 'Werden Brand- und Rauchschutztüren nicht festgekeilt und ihre Schließbereiche freigehalten?', 5, 'Brandschutz', 'BRAND', true,
      'ASR A2.2; Bauordnung; BGHW A 131',
      ['Festkeilen von Brandschutztüren verbieten', 'Bei Bedarf Feststellanlagen nachrüsten lassen', 'Schließbereich freihalten']],
    ['BR-04', 'Batterieladeanlagen', 'Sind Ladestellen für Flurförderzeuge sicher gestaltet (abgegrenzt, ausreichend belüftet, mind. 2,5 m Abstand zu Brennbarem, Kennzeichnung mit Verbots- und Warnzeichen)?', 5, 'Brandschutz', 'BRAND', true,
      'ASR A1.3; BGHW A 130/A 131',
      ['Ladestelle optisch abgrenzen und Zufahrt freihalten', 'Abstände einhalten (0,6 m um den Stellplatz, 1 m Batterie–Ladegerät)', 'Keine brennbaren Materialien im Umkreis von 2,5 m', 'Kennzeichnung mit Verbotszeichen P003 und Warnzeichen W026']],
    ['TH-01', 'Kältearbeit', 'Sind für Arbeiten in Kühl- und Tiefkühlbereichen Kälteschutzkleidung, begrenzte Aufenthaltsdauer und Aufwärmmöglichkeiten festgelegt?', 6, 'Kälte und Hitze', 'KAELTE', true,
      'ArbSchG § 5; ASR A3.5; DIN EN 342; DIN EN 511',
      ['Kälteschutzkleidung und -handschuhe bereitstellen', 'Aufenthaltsdauer in Tiefkühlbereichen begrenzen', 'Aufwärmzeiten und -räume ermöglichen']],
    ['TH-02', 'Hitzearbeit im Freien', 'Werden Hitze und Sonneneinstrahlung bei Arbeiten im Freien (z. B. Anlieferung, Einkaufswagen, Außenverkauf) berücksichtigt?', 6, 'Kälte und Hitze', 'KLIMA', true,
      'ArbSchG § 5; ASR A3.5',
      ['Arbeiten im Freien in kühlere Tageszeiten legen', 'Getränke und Schattenplätze bereitstellen', 'Sonnenschutz (Kopfbedeckung, Sonnencreme) bereitstellen']],
    ['LAE-01', 'Lärm', 'Sind Lärmquellen (z. B. Durchsagen, Hintergrundmusik, Kühlaggregate, Pressen, Leergutautomaten) ermittelt und so begrenzt, dass Verständigung und Konzentration möglich sind?', 7, 'Lärm und Strahlung', 'LAERM', false,
      'LärmVibrationsArbSchV; ASR A3.7',
      ['Lärmquellen erfassen', 'Lautstärke von Musik und Durchsagen begrenzen', 'Laute Geräte warten bzw. kapseln']],
    ['LAE-02', 'Headsets', 'Sind bei Headset-Nutzung Lautstärke, Tragedauer und Hygiene geregelt?', 7, 'Lärm und Strahlung', 'LAERM', true,
      'LärmVibrationsArbSchV; IFA-Projekt Headsets im Einzelhandel',
      ['Lautstärkebegrenzung einstellen', 'Tragepausen ermöglichen', 'Persönliche Ohrpolster bzw. Reinigung vorsehen']],
    ['LAE-03', 'Sonneneinstrahlung (UV)', 'Sind Beschäftigte mit regelmäßigen Tätigkeiten im Freien vor UV-Strahlung geschützt?', 7, 'Lärm und Strahlung', 'LAERM', true,
      'ArbSchG § 5; ArbMedVV (Angebotsvorsorge bei natürlicher UV-Strahlung)',
      ['Sonnenschutz bereitstellen', 'Angebotsvorsorge bei Tätigkeiten im Freien prüfen', 'Mittagsstunden für Außenarbeiten meiden']],
    ['UM-01', 'Sicherheitskennzeichnung', 'Sind Sicherheits- und Gesundheitsschutzkennzeichnungen (Rettungswege, Brandschutz, Verbote, Warnungen) vollständig, aktuell und gut sichtbar?', 8, 'Arbeitsumgebung allgemein', 'FLUCHT', false,
      'ArbStättV Anhang 1.3; ASR A1.3; DIN EN ISO 7010',
      ['Kennzeichnung vervollständigen', 'Beschädigte oder verdeckte Schilder ersetzen bzw. freilegen', 'Kennzeichnung nach Umbauten überprüfen']],
    ['UM-02', 'Sichtverbindung nach außen', 'Haben Arbeitsräume, soweit betrieblich möglich, ausreichend Tageslicht und eine Sichtverbindung nach außen?', 8, 'Arbeitsumgebung allgemein', 'LICHT', false,
      'ArbStättV Anhang 3.4; ASR A3.4',
      ['Fenster und Sichtverbindungen freihalten', 'Bei Räumen ohne Sichtverbindung Ausgleich prüfen (Pausenraum mit Tageslicht)']],
    ['KOE-01', 'Einkaufswagen zurückholen', 'Ist das Zurückholen von Einkaufswagen so geregelt, dass Schiebekräfte, Wagenschlangen und Verkehr auf dem Parkplatz beherrscht werden?', 9, 'Körperliche Belastungen', 'KOERPER', true,
      'LasthandhabV § 2; ArbSchG § 5',
      ['Länge der Wagenschlangen begrenzen', 'Hilfsmittel (Wagenschieber) prüfen', 'Warnweste und Verhalten im Parkplatzverkehr unterweisen']],
    ['SON-01', 'Meldung von Überfällen', 'Werden Überfälle der BGHW gemeldet, und gibt es einen Notfallplan für die Zeit unmittelbar nach einem Überfall?', 11, 'Raub / Überfall', 'GELD', false,
      'DGUV Vorschrift 25; SGB VII § 193; BGHW A 130',
      ['Meldung von Überfällen an die BGHW sicherstellen', 'Notfallplan für die Zeit nach einem Überfall erstellen', 'Ansprechpartner für Betreuung bekannt machen']]
  ];
  var NEU_LINKS = { 'EL-01': ['technik'], 'EL-02': ['technik'], 'EL-03': ['technik'], 'BR-04': ['ffz'], 'TH-01': ['kuehl', 'kt'],
    'ABS-01': ['lager', 'wa'], 'KA-05': ['kassenbuero'] };

  // Maßnahmenvorschläge zu bestehenden Fragen (Rechtsbezug, U, Maßnahmen)
  var CONFIG_EXTRA = {
    'AP-05': ['ArbSchG § 5 Abs. 3 Nr. 6; GDA-Leitlinie Psychische Belastung; BGHW A 131', false,
      ['Expertencheck bzw. Begehung (Fragen dieses Faktors)', 'PegA-Befragung der Beschäftigten', 'PegA-Team bzw. moderierter Workshop', 'Ideen-Treffen (DGUV Information 206-007)', 'Anderes Verfahren (unter Bemerkung beschreiben)']]
  };

  // ------------------------------------------------------------------------
  // Maschinen-Grundstruktur: fehlende Grundfragen je Maschine ergänzen
  // ------------------------------------------------------------------------
  var GRUND = {
    G04: ['Sicheres Stillsetzen', 'Ist geregelt, wie das Gerät vor Reinigung, Störungsbeseitigung und Wartung sicher stillgesetzt und gegen Wiedereinschalten gesichert wird?'],
    G07: ['Elektrik', 'Sind elektrische Teile, Zuleitungen und Stecker unbeschädigt, geprüft (DGUV Vorschrift 3) und gegen Feuchtigkeit geschützt?'],
    G08: ['Prüfung und Wartung', 'Sind Art und Fristen von Prüfung und Wartung festgelegt, und werden sie durch befähigte bzw. fachkundige Personen durchgeführt und dokumentiert?'],
    G09: ['Mängel', 'Ist geregelt, dass sicherheitsrelevante Mängel sofort gemeldet werden und das Gerät bis zur Instandsetzung außer Betrieb genommen wird?'],
    G10: ['Betriebsanweisung', 'Liegt eine verständliche Betriebsanweisung für Bedienung, Reinigung und Störungen vor, und ist sie den Beschäftigten bekannt?'],
    G11: ['Befugnis und Unterweisung', 'Ist festgelegt, wer das Gerät bedienen, reinigen und Störungen beseitigen darf, und sind diese Personen unterwiesen?']
  };
  var GRUND_ADD = { orange: ['G08', 'G09', 'G10', 'G11'], heissetheke: ['G09', 'G10'], braeter: ['G07', 'G09', 'G10'],
    fleischtheke: ['G04', 'G09'], rolltor: ['G09', 'G10', 'G11'], automatiktuer: ['G09', 'G11'], band: ['G09'], dixi: ['G07'],
    fueller: ['G10'], ofen_brot: ['G09', 'G10'] };

  // ------------------------------------------------------------------------
  // Vertiefung öffnet sich automatisch bei Handlungs-/Beratungsbedarf im Kern
  // (Herkunftsmodul der Kernfrage -> Vertiefungsmodule)
  // ------------------------------------------------------------------------
  var LINKS = {
    psa: ['fuss'], verkehr: ['treppe'], boden: ['treppe'], koerper: ['bildschirm'], kassen: ['kassenbuero', 'bildschirm'],
    zahlung: ['kassenbuero'], raub: ['kassenbuero'], sensibil: ['gewuerz'], hautschutz: ['gewuerz'], lager_allg: ['lager', 'wa'],
    regale: ['lager'], transport: ['lager', 'wa', 'ffz'], oberflaechen: ['heissetheke', 'braeter', 'kuehl'], arbeitsplatz: ['buero'],
    brandschutz: ['technik'], fremdfirmen: ['technik'], wv: ['og', 'kt']
  };

  // ========================================================================
  // Umbau
  // ========================================================================
  var Q = D.questions;
  var origModule = {}, qCat = {}, qSource = {}, qConfig = {};
  Object.keys(Q).forEach(function (m) { Q[m].forEach(function (q) { origModule[q[0]] = m; }); });
  var title = {};
  [].concat(D.generalTopics, D.areas, D.machines).forEach(function (a) { title[a[0]] = a[1]; });
  Object.keys(RENAME).forEach(function (m) { title[m] = RENAME[m][0]; });

  // Texte präzisieren
  Object.keys(Q).forEach(function (m) {
    Q[m].forEach(function (q) {
      if (TEXT[q[0]]) { q[1] = TEXT[q[0]][0]; q[2] = TEXT[q[0]][1]; }
      if (TOPIC_PREFIX[q[0]]) q[1] = TOPIC_PREFIX[q[0]] + q[1];
    });
  });
  // Doppelte Fragen entfernen
  Object.keys(Q).forEach(function (m) { Q[m] = Q[m].filter(function (q) { return !ALIAS[q[0]]; }); });
  // Module zusammenführen
  var modAlias = {};
  MERGE.forEach(function (p) {
    var src = p[0], dst = p[1];
    if (!Q[src]) return;
    Q[dst] = (Q[dst] || []).concat(Q[src]);
    delete Q[src];
    modAlias[src] = dst;
  });
  // Maschinen-Grundstruktur
  Object.keys(GRUND_ADD).forEach(function (m) {
    if (!Q[m] || !Q[m].length) return;
    var prefix = Q[m][0][0].replace(/-\d+$/, '');
    GRUND_ADD[m].forEach(function (g) {
      var id = prefix + '-' + g;
      Q[m].push([id, GRUND[g][0], GRUND[g][1]]);
      origModule[id] = m;
    });
  });
  // Faktor einer Frage
  function faktorOf(q) {
    var m = origModule[q[0]];
    if (qCat[q[0]] != null && C2F[qCat[q[0]]] != null) return C2F[qCat[q[0]]];
    if (MOD_FAKTOR[m] != null) return MOD_FAKTOR[m];
    var cat = S ? S.catFor(m, q[1]) : 'AREA';
    return C2F[cat] != null ? C2F[cat] : 1;
  }

  // Kern zusammenstellen
  var kernSrc = D.generalTopics.map(function (a) { return a[0]; }).filter(function (id) { return INV_TOPICS.indexOf(id) < 0; })
    .concat(KERN_AREAS);
  var kernSet = {};
  kernSrc.forEach(function (id) { var t = modAlias[id] || id; kernSet[t] = true; });
  var kern = FAKTOREN.map(function () { return []; });
  Object.keys(kernSet).forEach(function (m) {
    (Q[m] || []).forEach(function (q) {
      var f = faktorOf(q);
      qSource[q[0]] = title[origModule[q[0]]] || title[m] || m;
      kern[f].push(q);
    });
  });
  // neue Fragen
  NEU.forEach(function (n) {
    var q = [n[0], n[1], n[2]];
    origModule[n[0]] = 'neu';
    qCat[n[0]] = n[5];
    qSource[n[0]] = n[4];
    qConfig[n[0]] = { law: n[7], u: !!n[6], measures: n[8] };
    kern[n[3]].push(q);
  });
  Object.keys(CONFIG_EXTRA).forEach(function (id) {
    var c = CONFIG_EXTRA[id];
    qConfig[id] = { law: c[0], u: c[1], measures: c[2] };
  });
  // Faktor 10: Eingangsfrage zuerst
  kern[10].sort(function (a, b) { return (a[0] === 'AP-05' ? 0 : 1) - (b[0] === 'AP-05' ? 0 : 1); });
  // Module des Kerns entfernen, Kernmodule anlegen
  Object.keys(kernSet).forEach(function (m) { delete Q[m]; });
  FAKTOREN.forEach(function (f, i) { Q[f[0]] = kern[i]; });

  // Listen anpassen
  function keep(list) {
    return list.filter(function (a) { return !kernSet[a[0]] && !modAlias[a[0]] && Q[a[0]]; }).map(function (a) {
      if (RENAME[a[0]]) { a[1] = RENAME[a[0]][0]; a[2] = RENAME[a[0]][1]; }
      return a;
    });
  }
  D.generalTopics = keep(D.generalTopics);
  D.areas = keep(D.areas);
  D.machines = keep(D.machines);
  D.kern = FAKTOREN.map(function (f) { return [f[0], f[1], f[2]]; });

  // Faktor jeder Frage (Kern: Faktor des Kernmoduls; Vertiefung: über Themenfeld)
  var qFaktor = {};
  Object.keys(Q).forEach(function (m) {
    var km = /^kern_f(\d+)$/.exec(m);
    Q[m].forEach(function (q) { qFaktor[q[0]] = km ? +km[1] : faktorOf(q); });
  });

  // Modul-Zuordnung alter Modul-IDs (für Begehung und alte Auswahl)
  var qModule = {};
  Object.keys(Q).forEach(function (m) { Q[m].forEach(function (q) { qModule[q[0]] = m; }); });
  Object.keys(kernSet).concat(Object.keys(modAlias)).forEach(function (m) {
    if (modAlias[m] && !kernSet[modAlias[m]]) return;
    var cnt = {};
    Object.keys(origModule).forEach(function (id) {
      if (origModule[id] === m && qModule[id]) cnt[qModule[id]] = (cnt[qModule[id]] || 0) + 1;
    });
    var best = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; })[0];
    if (best) modAlias[m] = best;
  });
  Object.keys(modAlias).forEach(function (m) {
    var t = modAlias[m], n = 0;
    while (t && !Q[t] && modAlias[t] && n++ < 5) t = modAlias[t];
    modAlias[m] = t;
  });

  // ------------------------------------------------------------------------
  // Instanzen (mehrere Geräte gleichen Typs)
  // ------------------------------------------------------------------------
  var baseTitle = {};
  D.machines.forEach(function (a) { baseTitle[a[0]] = a[1]; });
  function instId(qid, k) { return k > 1 ? qid + '~' + k : qid; }
  function registerInstances(st) {
    var inst = (st && st.instances) || {};
    Object.keys(inst).forEach(function (m) {
      if (!Q[m] || !baseTitle[m]) return;
      (inst[m] || []).forEach(function (it) {
        var k = +it.k;
        var mid = k > 1 ? m + '~' + k : m;
        if (k > 1 && !Q[mid]) {
          Q[mid] = Q[m].map(function (q) {
            var nid = instId(q[0], k);
            origModule[nid] = origModule[q[0]];
            if (qConfig[q[0]]) qConfig[nid] = qConfig[q[0]];
            qModule[nid] = mid;
            qFaktor[nid] = qFaktor[q[0]];
            return [nid, q[1], q[2]];
          });
        }
        var name = baseTitle[m] + (it.n ? ' – ' + it.n : (k > 1 ? ' ' + k : ''));
        var row = D.machines.find(function (a) { return a[0] === mid; });
        if (row) row[1] = name;
        else {
          var base = D.machines.find(function (a) { return a[0] === m; });
          var at = D.machines.indexOf(base);
          var others = D.machines.filter(function (a) { return a[0].indexOf(m + '~') === 0; }).length;
          D.machines.splice(at + 1 + others, 0, [mid, name, base ? base[2] : '', base ? base[3] : '']);
        }
      });
    });
  }
  try { registerInstances(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}

  // Herkunftsmodul für Quellen und Themenfelder
  D.origModule = origModule;
  D.qCat = qCat;

  window.GBOStruktur = {
    faktoren: FAKTOREN,
    alias: ALIAS,
    modAlias: modAlias,
    pairs: PAIR,
    links: LINKS,
    neuLinks: NEU_LINKS,
    origModule: origModule,
    qSource: qSource,
    qConfig: qConfig,
    qFaktor: qFaktor,
    faktorName: function (nr) { return FAKTOREN[nr] ? FAKTOREN[nr][1] : ''; },
    isKern: function (id) { return /^kern_f\d+$/.test(id); },
    hasRisk: function (id) { return /^kern_f([1-9]|1[01])$/.test(id); },
    faktorNr: function (id) { var m = /^kern_f(\d+)$/.exec(id); return m ? +m[1] : null; },
    moduleOfQ: function (qid) { return qModule[qid] || null; },
    baseModule: function (id) { return String(id).split('~')[0]; },
    baseTitle: function (id) { return baseTitle[String(id).split('~')[0]] || ''; },
    registerInstances: registerInstances,
    machineBase: function (id) { return !!baseTitle[String(id).split('~')[0]]; }
  };
})();
