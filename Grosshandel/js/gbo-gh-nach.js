// ==========================================================================
// Großhandel Begehung — Gefährdungsbeurteilung: Zuschnitt nach dem Umbau
// (Stufe 1, ab Rev. 1.1)
// ==========================================================================
// Läuft direkt nach js/gbo-struktur.js. Passt die Kernbeurteilung
// (Gefährdungsfaktoren 0–11) und die Hinweistexte an den Großhandel an:
// keine Kassen, kein Bargeld, kein Ladendiebstahl, keine Kunden.
// ==========================================================================
(function () {
  'use strict';
  var D = window.GBO_DATA, L = window.GBOStruktur, S = window.GBOSources;
  if (!D || !L) return;

  // Faktoren-Beschreibungen
  var FAKTOR = {
    1: 'Verkehrswege, Böden, Absturz, Leitern, Regale, Lager, Flurförderzeuge, Transport, Maschinen, Schneiden, Glasbruch',
    9: 'Heben, Tragen, Ziehen, Schieben, Kommissionieren, Körperhaltung, Bildschirmarbeit',
    10: 'Verfahren, Arbeitsinhalt, Organisation, Arbeitszeit/Schichtarbeit, soziale Beziehungen, Führung, Kontakt mit Fahrpersonal und Besuchern',
    11: 'Alleinarbeit, Nachtarbeit, Bedrohung an Pforte und Empfang, weitere betriebliche Gefährdungen'
  };
  Object.keys(FAKTOR).forEach(function (nr) {
    if (L.faktoren[nr]) L.faktoren[nr][2] = FAKTOR[nr];
    if (D.kern && D.kern[nr]) D.kern[nr][2] = FAKTOR[nr];
  });

  // Kernfragen ohne Bezug (Kassenband, Überfall-Meldung, Einkaufswagen)
  var WEG = { 'KA-05': 1, 'SON-01': 1, 'KOE-01': 1 };
  Object.keys(D.questions).forEach(function (m) {
    if (!/^kern_f\d+$/.test(m)) return;
    D.questions[m] = D.questions[m].filter(function (q) { return !WEG[q[0]]; });
  });
  delete L.neuLinks['KA-05'];
  ['kassen', 'zahlung', 'raub'].forEach(function (k) { delete L.links[k]; });

  // Faktor 11 (Sonstige Gefährdungen): statt Überfall/Bargeld/Ladendiebstahl
  // die typischen Themen eines Großhandelsstandorts
  var F11 = [
    ['GH-11-01', 'Alleinarbeit', 'Sind Alleinarbeitsplätze ermittelt (z. B. Nachtschicht, Kühl- und TK-Lager, Pforte, Werkstatt, Wochenende), und ist sichergestellt, dass bei einem Unfall rechtzeitig Hilfe erreicht werden kann (Personen-Notsignal-Anlage, Kontrollanrufe, Rundgänge)?',
      'ArbSchG § 5; DGUV Vorschrift 1 § 8; DGUV Regel 112-139', true,
      ['Alleinarbeitsplätze und -zeiten erfassen', 'Gefährliche Arbeiten nicht in Alleinarbeit ausführen lassen', 'Personen-Notsignal-Anlage oder Kontrollanrufe/Rundgänge festlegen', 'Notfall- und Rettungsablauf festlegen und unterweisen']],
    ['GH-11-02', 'Nacht- und Schichtarbeit', 'Sind Nacht- und Schichtarbeit (z. B. Wareneingang, Kommissionierung, Pforte) menschengerecht gestaltet und wird Nachtarbeitnehmern die arbeitsmedizinische Untersuchung angeboten?',
      'ArbZG § 6; ArbSchG § 5 Abs. 3 Nr. 4; ArbMedVV', false,
      ['Schichtpläne nach arbeitswissenschaftlichen Erkenntnissen gestalten (vorwärts rotierend, wenige Nachtschichten in Folge)', 'Arbeitsmedizinische Untersuchung für Nachtarbeitnehmer anbieten', 'Verpflegung und Erste Hilfe auch nachts sicherstellen']],
    ['GH-11-03', 'Bedrohung an Pforte und Empfang', 'Gibt es für Pforte, Empfang und Wareneingang Regeln und Hilfsmittel für bedrohliche Situationen (Alarmierung, Rückzugsmöglichkeit, Zutrittsregelung, Videoüberwachung, Nachsorge)?',
      'ArbSchG §§ 5, 10; DGUV Information 206-017', true,
      ['Zutritts- und Besucherregelung festlegen', 'Alarmierungsmöglichkeit (Notruftaste) und Rückzugsmöglichkeit schaffen', 'Beschäftigte zu Deeskalation und Verhalten bei Bedrohung unterweisen', 'Nachsorge nach Gewaltereignissen organisieren']],
    ['GH-11-04', 'Fremdes Fahrpersonal', 'Sind Verhaltensregeln für fremdes Fahrpersonal festgelegt und verständlich bekannt gemacht (Aufenthaltsbereiche, Mitwirkung beim Be- und Entladen, Warnweste und Sicherheitsschuhe, mehrsprachige Hinweise bzw. Piktogramme)?',
      'ArbSchG § 8; DGUV Vorschrift 1 §§ 5, 6; DGUV Information 208-008', true,
      ['Fahrerregeln mehrsprachig bzw. mit Piktogrammen aushängen', 'Aufenthalts- und Wartebereiche für Fahrpersonal festlegen', 'Mitwirkung beim Be- und Entladen mit Speditionen abstimmen', 'Einhaltung an Pforte und Rampe kontrollieren']],
    ['GH-11-05', 'Gefährdungen durch Dritte im Betriebsgelände', 'Sind Gefährdungen durch Besucher, Abholer, Fremdfirmen und Lieferverkehr im Betriebsgelände berücksichtigt (Besucherführung, Einweisung, Begleitung in Lager und Fleischwerk, Hygieneregeln)?',
      'ArbSchG §§ 5, 8; DGUV Vorschrift 1 § 6', false,
      ['Besucher an Pforte bzw. Empfang registrieren und einweisen', 'Begleitung in Lager-, Produktions- und Technikbereichen festlegen', 'Besucherwege kennzeichnen und von Fahrwegen trennen']]
  ];
  var f11 = D.questions.kern_f11 || (D.questions.kern_f11 = []);
  var f11Ids = {};
  F11.forEach(function (n) {
    if (f11.some(function (q) { return q[0] === n[0]; })) return;
    f11.push([n[0], n[1], n[2]]);
    f11Ids[n[0]] = 'kern_f11';
    L.qConfig[n[0]] = { law: n[3], u: n[4], measures: n[5] };
    L.qFaktor[n[0]] = 11;
    L.qSource[n[0]] = 'Sonstige Gefährdungen am Großhandelsstandort';
    L.origModule[n[0]] = 'neu';
    if (D.qCat) D.qCat[n[0]] = 'ALLEIN';
  });
  var moduleOfQ = L.moduleOfQ;
  L.moduleOfQ = function (qid) { return moduleOfQ(qid) || f11Ids[qid] || null; };

  // Präzisierte Texte für den Großhandel: ID -> [Thema, Frage]
  var TEXT = {
    'ORG-06': ['Betriebsanweisungen', 'Liegen für Maschinen, Anlagen, Flurförderzeuge, Ladeeinrichtungen und Gefahrstoffe verständliche Betriebsanweisungen vor, sind sie bekannt gegeben und aktuell?'],
    'ORG-07': ['Prüfung von Arbeitsmitteln', 'Sind Art, Umfang und Fristen der Prüfungen aller Arbeitsmittel (z. B. Leitern, Elektrogeräte, Regale, Tore, Ladebrücken, Flurförderzeuge, Regalbediengeräte, Maschinen) festgelegt, und werden sie durch befähigte Personen durchgeführt und dokumentiert?'],
    'UW-02': ['Wiederholung', 'Werden Unterweisungen mindestens jährlich wiederholt – bei Jugendlichen mindestens halbjährlich – und bei Fahrbeauftragten für Flurförderzeuge zusätzlich die Fahrberechtigung überprüft?'],
    'KB-02': ['Körperhaltungen', 'Sind ungünstige oder lang andauernde Körperhaltungen, dauerhaftes Stehen ohne Bewegungswechsel und einseitig wiederholte Tätigkeiten (z. B. Kommissionierung, Verpackung, Zerlegung) berücksichtigt?'],
    'RK-01': ['Raumtemperatur', 'Werden die Mindesttemperaturen eingehalten (Büro 20 °C, Pausen- und Sanitärräume 21 °C, überwiegend nicht sitzende leichte Tätigkeit 19 °C, mittelschwere Tätigkeit z. B. Kommissionierung 17 °C) und sind Luftqualität und Luftbewegung angemessen?'],
    'RK-02': ['Hitze / Kälte / Zugluft', 'Werden Hitze (über 26 °C), Kälte und Zugluft – z. B. an Toren, Rampen und Pforten – ermittelt und erforderliche Maßnahmen getroffen (z. B. Sonnenschutz, Getränke, Torluftschleier, Torabdichtungen)?'],
    'BEL-01': ['Beleuchtungsstärke', 'Ist die Beleuchtung für die Sehaufgabe ausreichend (z. B. Büro 500 lx, Kommissionierung 200–300 lx, Lager 100–200 lx, Verkehrswege 50–100 lx, Rampen und Hof ausreichend) und flimmerfrei?'],
    'GS-01': ['Beschädigte Ware mit Gefahrstoffen', 'Ist der Umgang mit beschädigter oder ausgelaufener Handelsware mit Gefahrstoffen (z. B. Reiniger, Grillanzünder, Spraydosen, Lampenöl, Spirituosen) im Lager und an der Rampe geregelt?'],
    'TH-02': ['Hitzearbeit im Freien', 'Werden Hitze und Sonneneinstrahlung bei Arbeiten im Freien (z. B. Hof, Rampe, Rangieren, Leergut, Pforte) berücksichtigt?'],
    'LAE-01': ['Lärm', 'Sind Lärmquellen (z. B. Kühlaggregate, Pressen, Leergutsortierung, Verpackungsmaschinen, Fleischwerk, Durchsagen) ermittelt und so begrenzt, dass Verständigung und Konzentration möglich sind?'],
    'LAE-02': ['Headsets / Pick-by-Voice', 'Sind bei Headset- bzw. Pick-by-Voice-Nutzung Lautstärke, Tragedauer und Hygiene geregelt?'],
    'VW-07': ['Stoßstellen', 'Sind Stoßstellen in Kopfhöhe (z. B. Schilder, Regaltraversen, Leitungen, Ausstellungsaufbauten) vermieden, gepolstert oder gelb-schwarz gekennzeichnet?'],
    'BIO-01': ['Biologische Arbeitsstoffe', 'Sind Tätigkeiten mit möglichem Kontakt zu biologischen Arbeitsstoffen ermittelt (z. B. verdorbene Ware, Schimmel, Leergutrückstände, Tierkot, Fleischwerk) und Hygienemaßnahmen festgelegt?'],
    'ABS-01': ['Absturz an Bühnen, Podesten und Rampen', 'Sind Lagerbühnen, Podeste, Laderampen und Arbeitsplätze mit mehr als 1 m Absturzhöhe gegen Absturz gesichert (Geländer, Haltebügel, Schleusengeländer an Lastübergabestellen)?']
  };
  Object.keys(D.questions).forEach(function (m) {
    D.questions[m].forEach(function (q) { var b = String(q[0]).split('~')[0]; if (TEXT[b]) { q[1] = TEXT[b][0]; q[2] = TEXT[b][1]; } });
  });
  if (L.qConfig['ORG-06']) {
    L.qConfig['ORG-06'].measures = ['Betriebsanweisungen erstellen (Muster von BGHW bzw. BGN nutzen)', 'Betriebsanweisungen bekannt geben und am Arbeitsplatz verfügbar machen', 'Einhaltung der Betriebsanweisungen überwachen', 'Betriebsanweisungen jährlich auf Aktualität prüfen'];
    L.qConfig['ORG-06'].law = 'ArbSchG § 9; BetrSichV § 12; GefStoffV § 14; DGUV Vorschrift 1';
  }
  if (L.qConfig['LAE-02']) L.qConfig['LAE-02'].law = 'LärmVibrationsArbSchV; ArbSchG § 5';
  Object.keys(L.qSource).forEach(function (id) {
    var s = L.qSource[id];
    if (/Verkaufsware/.test(s)) L.qSource[id] = 'Gefahrstoffe in der Handelsware';
  });

  // Hinweistexte (Themenfelder) für den Großhandel
  var C = S && S.CAT;
  if (C) {
    if (C.NOTFALL) C.NOTFALL.explain = 'Für Notfälle (Brand, Unfall, Gefahrstofffreisetzung, Kältemittelaustritt, Bedrohung) sind Verhalten, Alarmierung, Erste Hilfe und Räumung zu regeln und zu üben.';
    if (C.LICHT && C.LICHT.explain) C.LICHT.explain = C.LICHT.explain.replace('Verkaufsräume, Lager, Verkehrswege', 'Lager, Kommissionierung, Verkehrswege, Büro');
    if (C.BUERO) C.BUERO.explain = 'Büro-, Empfangs- und Pfortenarbeitsplätze müssen ergonomisch, ausreichend beleuchtet und sicher eingerichtet sein.';
    if (C.VERKAUF) C.VERKAUF.explain = 'Ausstellungs-, Börsen- und Besucherbereiche müssen sichere Verkehrs- und Fluchtwege auch bei Warenpräsentation und Veranstaltungen behalten.';
  }

  // Zusatzkatalog Großhandel: Quellen, Themenfelder, Rechtsbezug, Maßnahmen, Faktor
  var Z = window.GBO_GH_DATEN;
  if (Z) {
    var C2F = { ORG: 0, AUFTRAG: 0, EH: 0, UNTERW: 0, ARZT: 0, FREMD: 0, MUSCHG: 0, NOTFALL: 0, SONST: 0, M_UNT: 0, M_BEAUFTR: 0, PSA: 0, FUSS: 0,
      VERKEHR: 1, BODEN: 1, TREPPE: 1, TOR: 1, MECH: 1, BEWEGT: 1, LEITER: 1, LAGER: 1, REGAL: 1, TRANSPORT: 1, FFZ: 1, PRESS: 1, LEERGUT: 1,
      SCHERBEN: 1, RAMPE: 1, FAHRZEUG: 1, WINTER: 1, MESSER: 1, M_BEST: 1, M_BED: 1, M_ENERGIE: 1, M_STOER: 1, M_REIN: 1, M_SCHUTZ: 1, M_PRUEF: 1, AREA: 1,
      ELEKTRIK: 2, TECHRAUM: 2, GEFSTOFF: 3, HAUT: 3, SENSI: 3, GAS: 3, REIN: 3, CO2: 3, KAELTEANLAGE: 3, HYGIENE: 4, BRAND: 5, RAUCH: 5,
      OBERFL: 6, KAELTE: 6, LAERM: 7, LICHT: 8, KLIMA: 8, FLUCHT: 8, ARBPL: 8, SOZIAL: 8, SOZIAL_BF: 8, PAUSE: 8,
      KOERPER: 9, ERGO: 9, BUERO: 9, PSYCH: 10, ALLEIN: 11 };
    if (S) {
      Object.keys(Z.src || {}).forEach(function (k) { if (!S.SRC[k]) S.SRC[k] = Z.src[k]; });
      Object.keys(Z.cat || {}).forEach(function (k) {
        var c = Z.cat[k];
        S.CAT[k] = { src: c.src, explain: c.explain, t: c.t, o: c.o, p: c.p };
      });
    }
    Object.keys(Z.cat || {}).forEach(function (k) { C2F[k] = Z.cat[k].faktor; });
    D.qCat = D.qCat || {};
    var setze = function (id, base) {
      var c = Z.config[base];
      if (!c) return;
      D.qCat[id] = c[0];
      L.qConfig[id] = { law: c[1], u: !!c[2], measures: c[3] };
      L.qFaktor[id] = C2F[c[0]] != null ? C2F[c[0]] : 1;
    };
    Object.keys(D.questions).forEach(function (m) {
      D.questions[m].forEach(function (q) { setze(q[0], String(q[0]).split('~')[0]); });
    });
    // Geräte-Instanzen, die später angelegt werden, übernehmen die Angaben der Grundfrage
    var reg = L.registerInstances;
    L.registerInstances = function (st) {
      reg(st);
      Object.keys(D.questions).forEach(function (m) {
        if (m.indexOf('~') < 0) return;
        D.questions[m].forEach(function (q) { var b = String(q[0]).split('~')[0]; if (Z.config[b] && !L.qConfig[q[0]]) setze(q[0], b); });
      });
    };
  }

  // Titel, die der Umbau (Zusammenführungen) überschreibt
  var TITEL = {
    wa: ['Wareneingang, Warenausgang und Laderampe', 'Anlieferung, Entladen, Verladung, Rampe, Überladebrücken, Fahrzeugverkehr'],
    leergutshop: ['Leergut und Leergutzentrum', 'Leergutannahme, Sortierung, Automaten, Glasbruch'],
    dixi: ['Ballenpresse', 'eigene Presse oder Leihgerät'],
    technik: ['Technik- und Heizungsräume', 'Maschinen-, Technik-, Heizungs- und Elektroräume'],
    stapler: ['Gabelstapler', 'zusätzlich zu „Flurförderzeuge“']
  };
  ['generalTopics', 'areas', 'machines'].forEach(function (k) {
    (D[k] || []).forEach(function (a) { if (TITEL[a[0]]) { a[1] = TITEL[a[0]][0]; a[2] = TITEL[a[0]][1]; } });
  });
})();
