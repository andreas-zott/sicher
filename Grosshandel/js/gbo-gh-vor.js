// ==========================================================================
// Großhandel Begehung — Gefährdungsbeurteilung: Zuschnitt auf den Großhandel
// (Stufe 1, ab Rev. 1.1)
// ==========================================================================
// Läuft direkt nach js/gbo-data.js und vor js/gbo-struktur.js.
// Grundlage ist der GBO-Fragenkatalog aus ASiC Handel 2.x (Märkte). Für den
// Großhandel gilt: keine Kunden (nur Besucher, Lieferanten, Fahrpersonal),
// keine Kassen, kein Bargeld, kein Verkauf an Endkunden.
//   - Markt-Module ohne Bezug werden entfernt
//   - Fragen mit Kunden-/Kassenbezug werden umformuliert oder entfernt
//   - Modul-Titel werden auf den Großhandel angepasst
// Fragen-IDs bleiben unverändert (Austausch mit Sicherungen, Verknüpfungen).
// ==========================================================================
(function () {
  'use strict';
  var D = window.GBO_DATA;
  if (!D || !D.questions) return;

  // Module ohne Bezug zum Großhandel
  var ENTFERNEN = [
    // Themen
    'feuerwerk', 'kassen', 'zahlung', 'diebstahl', 'raub', 'verkaufsstelle', 'gasverkauf',
    // Bereiche
    'swk', 'back', 'aufb', 'abhol', 'kassenbuero',
    // Maschinen
    'orange', 'braeter', 'ofen_fleisch', 'ofen_brot', 'fleischtheke', 'heissetheke'
  ];
  // Einzelne Fragen ohne Bezug (Kasse, Ladendiebstahl)
  var FRAGEN_WEG = ['PSY-32', 'PSY-38'];

  // Umformulierte Fragen: ID -> [Thema, Frage]
  var TEXT = {
    'LG-01': ['Leergutbereich', 'Sind Leergutzentrum und Leergutflächen so organisiert, dass Stolper-, Stoß-, Quetsch- und Schnittgefährdungen minimiert werden?'],
    'LG-02': ['Lasten', 'Sind körperliche Belastungen beim Umgang mit Getränkekisten, Leergut und Paletten beurteilt?'],
    'WV-11': ['Fahr- und Besucherverkehr', 'Ist das Verräumen und Kommissionieren so organisiert, dass Flurförderzeugverkehr, Fußwege und Besucher sicher getrennt sind?'],
    'FUEHRUNG-03': ['Arbeitsunterbrechungen', 'Werden Arbeitsunterbrechungen durch Fahrpersonal, Telefon, Funk oder Zusatzaufgaben erfasst und begrenzt?'],
    'FUEHRUNG-11': ['Kontakte mit Dritten', 'Sind Beschäftigte auf schwierige Kontakte mit Fahrpersonal, Lieferanten und Besuchern vorbereitet und werden sie dabei unterstützt?'],
    'REINIGUN-16': ['Rutsch- und Stolpergefahr', 'Werden nasse oder behandelte Flächen abgesichert und Reinigungsarbeiten so organisiert, dass Beschäftigte und Besucher nicht unnötig gefährdet werden?'],
    'REINIGUN-17': ['Arbeitsorganisation', 'Sind Reinigungszeiten, Arbeitsabläufe und Zuständigkeiten so festgelegt, dass Reinigung sicher und ohne vermeidbare Wechselwirkungen mit Flurförderzeug- oder Warenverkehr erfolgt?'],
    'BODEN-10': ['Reinigungszeiten', 'Findet die Reinigung außerhalb der Hauptumschlagszeiten statt oder wird der Bereich abgesperrt?'],
    'AUTOMATI-09': ['Personen- und Warenverkehr', 'Ist die Tür auch bei starkem Personen- und Warenverkehr (Rollcontainer, Hubwagen, Rollstühle) ausreichend breit und übersichtlich?'],
    'RM-05': ['Bedienung / Fahrbewegung', 'Sind Bedienung, Fahrbewegung und Rangieren so organisiert, dass Beschäftigte, Besucher und Einrichtungen nicht gefährdet werden?'],
    'RM-12': ['Rutschgefahr / Betriebsverkehr', 'Werden nasse Flächen und Arbeitsbereiche während des Maschineneinsatzes wirksam abgesichert und Wechselwirkungen mit Flurförderzeug- und Fußgängerverkehr berücksichtigt?'],
    'FF-03': ['Gegenseitige Gefährdungen', 'Werden Gefährdungen beurteilt, die durch das Zusammenwirken eigener Beschäftigter, Fremdfirmen, Speditionen, Besucher oder weiterer Unternehmen entstehen können?'],
    'FF-11': ['Besucher- und Betriebsverkehr', 'Sind Fremdfirmenarbeiten so organisiert und abgesichert, dass Besucher, Beschäftigte und Waren-/Fahrzeugverkehr nicht unnötig gefährdet werden?'],
    'PSY-22': ['Entscheidungsspielräume', 'Sind für typische Situationen mit Fahrpersonal, Lieferanten und Besuchern angemessene Zuständigkeiten und Entscheidungsspielräume festgelegt?'],
    'PSY-23': ['Konflikte mit Dritten', 'Sind Beschäftigte (z. B. Pforte, Empfang, Wareneingang, Disposition) auf den Umgang mit aggressivem, beleidigendem oder konfliktreichem Verhalten von Fahrpersonal, Lieferanten oder Besuchern vorbereitet?'],
    'PSY-25': ['Bedrohungen / Gewalt', 'Sind Maßnahmen zum Schutz bei Bedrohungen, Gewalt und vergleichbaren Ereignissen (z. B. an Pforte, Empfang, Wareneingang, bei Nachtarbeit) festgelegt und bekannt?'],
    'PSY-33': ['Technische Störungen', 'Werden Störungen an Scannern, Terminals, Pick-by-Voice, Lagerverwaltung und anderen Arbeitsmitteln schnell behoben, und ist das Vorgehen bei Ausfällen geregelt?'],
    'PSY-37': ['Emotionale Anforderungen', 'Werden Beschäftigte mit dauerhaft hohen emotionalen Anforderungen (z. B. Empfang, Pforte, Disposition, Reklamationen) unterstützt und entlastet?']
  };

  // Modul-Titel: ID -> [Titel, Beschreibung]
  var TITEL = {
    og: ['Obst und Gemüse (Frischezentrum)', 'Umschlag, Sortieren, Aussortieren, Reifung'],
    kt: ['Kühl- und Tiefkühlware', 'Kühl-/TK-Ware ein- und auslagern, kommissionieren'],
    wv: ['Warenhandling und Kommissionierung', 'Allgemeines Verräumen, Kommissionieren und Bereitstellen'],
    metz: ['Fleischwerk – Herstellung', 'Herstellung und Bearbeitung (Zuständigkeit BGN)'],
    zerl: ['Fleischwerk – Zerlegung', 'Zerlegen, Schneiden, Bearbeiten (Zuständigkeit BGN)'],
    hackklotz: ['Fleischwerk – Schneidetisch / Hackklotz', 'Handmesser, Beile, Arbeitsplatz und Reinigung (BGN)'],
    gewuerz: ['Fleischwerk – Gewürze', 'Staub, Hautkontakt, Lagerung und Hygiene (BGN)'],
    lager: ['Lager und Kommissionierung', 'Lagern, Stapeln, Kommissionieren'],
    wa: ['Wareneingang und Warenausgang', 'Übernehmen, Kontrollieren, Transport, Verladung'],
    rampe: ['Laderampe', 'Be-/Entladen, Überladebrücken, Warenübergabe'],
    buero: ['Büros, Verwaltung und Besprechungsräume', 'Verwaltungen, Schulungszentrum, Besprechung'],
    bildschirm: ['Bildschirmarbeit', 'Büro, Empfang, Pforte, Disposition, Leitstand'],
    leergutshop: ['Leergut und Leergutzentrum', 'Leergutannahme, Sortierung, Glasbruch'],
    leergutrueck: ['Leergutannahme', 'Manuelle und maschinelle Annahme'],
    presscontainer: ['Presscontainer', 'Beschicken, Betrieb, Störung und Entleerung'],
    hm: ['Handmesser (Fleischwerk)', '12 Tiefenfragen'],
    fw: ['Fleischwolf (Fleischwerk)', '24 Tiefenfragen'],
    kutter: ['Kutter (Fleischwerk)', '20 Tiefenfragen'],
    band: ['Bandsäge (Fleischwerk)', '22 Tiefenfragen'],
    aufschnitt: ['Aufschnittmaschine / Slicer (Fleischwerk)', '20 Tiefenfragen'],
    fueller: ['Wurstfüller (Fleischwerk)', '20 Tiefenfragen'],
    messer_schleif: ['Umgang mit und Schleifen von Messern (Fleischwerk)', '15 Tiefenfragen'],
    dixi: ['Ballenpresse', '22 Tiefenfragen']
  };

  var weg = {};
  ENTFERNEN.forEach(function (id) { weg[id] = true; delete D.questions[id]; });
  ['generalTopics', 'areas', 'machines'].forEach(function (k) {
    D[k] = (D[k] || []).filter(function (a) { return !weg[a[0]]; });
    D[k].forEach(function (a) { if (TITEL[a[0]]) { a[1] = TITEL[a[0]][0]; a[2] = TITEL[a[0]][1]; } });
  });
  Object.keys(D.questions).forEach(function (m) {
    D.questions[m] = D.questions[m].filter(function (q) { return FRAGEN_WEG.indexOf(q[0]) < 0; });
    D.questions[m].forEach(function (q) {
      if (TEXT[q[0]]) { q[1] = TEXT[q[0]][0]; q[2] = TEXT[q[0]][1]; }
      q[2] = String(q[2]).replace(/ASiC-/g, 'GBO-');
    });
  });

  // Zusatzkatalog Großhandel (js/gbo-gh-daten.js): neue Bereiche, Einrichtungen, Maschinen
  var Z = window.GBO_GH_DATEN;
  if (Z) {
    [['general', 'generalTopics'], ['areas', 'areas'], ['machines', 'machines']].forEach(function (p) {
      (Z[p[0]] || []).forEach(function (a) {
        if (D[p[1]].some(function (x) { return x[0] === a[0]; })) return;
        D[p[1]].push(a.slice());
        D.questions[a[0]] = (Z.questions[a[0]] || []).map(function (q) { return q.slice(); });
      });
    });
  }

  window.GBOGrosshandel = { entfernt: ENTFERNEN.slice(), fragenEntfernt: FRAGEN_WEG.slice() };
})();
