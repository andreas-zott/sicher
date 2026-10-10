/* ASiC Handel – GBO: Regelwerke und Maßnahmenhinweise je Thema
 *
 * Ersetzt die frühere Stichwort-Erkennung. Jede Frage bekommt über Modul und Thema
 * ein Themenfeld (Kategorie). Jede Kategorie nennt die einschlägigen Regelwerke mit
 * Paragraf, Anhangsnummer oder Abschnitt, eine Erläuterung und Maßnahmenhinweise (TOP).
 *
 * Quellen-Eintrag: [Fundstelle, worum es dort geht, geprüft]
 *   geprüft = 1: Gliederung (Paragraf, Anhang, Abschnitt) wurde im Oktober 2026 gegen eine
 *               öffentliche Fundstelle des Regelwerks abgeglichen.
 *   geprüft = 0: Regelwerk ist sicher benannt, Paragraf bzw. Abschnitt konnte nicht gegen den
 *               Wortlaut abgeglichen werden. Die App zeigt dazu den Hinweis „Abschnitt prüfen".
 * Maßgeblich ist immer die aktuelle Fassung des Regelwerks.
 */
(function () {
  'use strict';

  const SRC = {
    // ---- Arbeitsschutzgesetz ----
    arbschg3: ['ArbSchG § 3', 'Grundpflichten des Arbeitgebers', 1],
    arbschg4: ['ArbSchG § 4', 'Allgemeine Grundsätze (u. a. Rangfolge der Maßnahmen)', 1],
    arbschg5: ['ArbSchG § 5', 'Beurteilung der Arbeitsbedingungen', 1],
    arbschg5psy: ['ArbSchG § 5 Abs. 3 Nr. 6', 'Psychische Belastungen bei der Arbeit', 1],
    arbschg6: ['ArbSchG § 6', 'Dokumentation', 1],
    arbschg7: ['ArbSchG § 7', 'Übertragung von Aufgaben', 1],
    arbschg8: ['ArbSchG § 8', 'Zusammenarbeit mehrerer Arbeitgeber', 1],
    arbschg9: ['ArbSchG § 9', 'Besondere Gefahren', 1],
    arbschg10: ['ArbSchG § 10', 'Erste Hilfe und sonstige Notfallmaßnahmen', 1],
    arbschg11: ['ArbSchG § 11', 'Arbeitsmedizinische Vorsorge', 1],
    arbschg12: ['ArbSchG § 12', 'Unterweisung', 1],
    arbschg13: ['ArbSchG § 13', 'Verantwortliche Personen', 1],
    arbschg15: ['ArbSchG § 15', 'Pflichten und Rechte der Beschäftigten', 1],
    // ---- Arbeitsstättenverordnung ----
    arbstaettv3: ['ArbStättV § 3', 'Gefährdungsbeurteilung', 1],
    arbstaettv3a: ['ArbStättV § 3a', 'Einrichten und Betreiben von Arbeitsstätten', 1],
    arbstaettv4: ['ArbStättV § 4', 'Besondere Anforderungen an das Betreiben von Arbeitsstätten', 1],
    arbstaettv5: ['ArbStättV § 5', 'Nichtraucherschutz', 1],
    arbstaettv6: ['ArbStättV § 6', 'Unterweisung der Beschäftigten', 1],
    as12: ['ArbStättV Anhang 1.2', 'Abmessungen von Räumen, Luftraum', 1],
    as13: ['ArbStättV Anhang 1.3', 'Sicherheits- und Gesundheitsschutzkennzeichnung', 1],
    as14: ['ArbStättV Anhang 1.4', 'Energieverteilungsanlagen', 1],
    as15: ['ArbStättV Anhang 1.5', 'Fußböden, Wände, Decken, Dächer', 1],
    as17: ['ArbStättV Anhang 1.7', 'Türen, Tore', 1],
    as18: ['ArbStättV Anhang 1.8', 'Verkehrswege', 1],
    as110: ['ArbStättV Anhang 1.10', 'Laderampen', 1],
    as21: ['ArbStättV Anhang 2.1', 'Schutz vor Absturz und herabfallenden Gegenständen, Betreten von Gefahrenbereichen', 1],
    as22: ['ArbStättV Anhang 2.2', 'Maßnahmen gegen Brände', 1],
    as23: ['ArbStättV Anhang 2.3', 'Fluchtwege und Notausgänge', 1],
    as31: ['ArbStättV Anhang 3.1', 'Bewegungsfläche', 1],
    as32: ['ArbStättV Anhang 3.2', 'Anordnung der Arbeitsplätze', 1],
    as33: ['ArbStättV Anhang 3.3', 'Ausstattung', 1],
    as34: ['ArbStättV Anhang 3.4', 'Beleuchtung und Sichtverbindung', 1],
    as35: ['ArbStättV Anhang 3.5', 'Raumtemperatur', 1],
    as36: ['ArbStättV Anhang 3.6', 'Lüftung', 1],
    as37: ['ArbStättV Anhang 3.7', 'Lärm', 1],
    as41: ['ArbStättV Anhang 4.1', 'Sanitärräume', 1],
    as42: ['ArbStättV Anhang 4.2', 'Pausen- und Bereitschaftsräume', 1],
    as43: ['ArbStättV Anhang 4.3', 'Erste-Hilfe-Räume', 1],
    as6: ['ArbStättV Anhang 6', 'Maßnahmen zur Gestaltung von Bildschirmarbeitsplätzen', 1],
    // ---- Technische Regeln für Arbeitsstätten (ASR) ----
    asrv3: ['ASR V3', 'Gefährdungsbeurteilung', 1],
    asra12_5: ['ASR A1.2 Abschn. 5', 'Grundflächen von Arbeitsräumen', 1],
    asra12_4: ['ASR A1.2 Abschn. 4', 'Allgemeines (Raumabmessungen und Bewegungsflächen)', 1],
    asra13: ['ASR A1.3', 'Sicherheits- und Gesundheitsschutzkennzeichnung', 0],
    asra15_5: ['ASR A1.5 Abschn. 5', 'Schutzmaßnahmen gegen Stolpern', 1],
    asra15_6: ['ASR A1.5 Abschn. 6 und Anhang 2', 'Schutzmaßnahmen gegen Ausrutschen, Anforderungen an die Rutschhemmung', 1],
    asra15_7: ['ASR A1.5 Abschn. 7', 'Schutzmaßnahmen gegen besondere physikalische Einwirkungen', 1],
    asra15_8: ['ASR A1.5 Abschn. 8', 'Reinigung', 1],
    asra17_4: ['ASR A1.7 Abschn. 4 und 5', 'Planung und Auswahl von Türen und Toren', 1],
    asra17_6: ['ASR A1.7 Abschn. 6 bis 8', 'Sicherung gegen mechanische Gefährdungen, der Flügelbewegung, Sicherheit der Steuerung', 1],
    asra17_10: ['ASR A1.7 Abschn. 10', 'Instandhaltung einschließlich sicherheitstechnischer Prüfung', 1],
    asra18_4: ['ASR A1.8 Abschn. 4', 'Einrichten von Verkehrswegen', 1],
    asra18_5: ['ASR A1.8 Abschn. 5', 'Betreiben von Verkehrswegen', 1],
    asra18_6: ['ASR A1.8 Abschn. 6', 'Instandhaltung und sicherheitstechnische Funktionsprüfung', 1],
    asra21_4: ['ASR A2.1 Abschn. 4', 'Beurteilung der Gefährdungen und Rangfolge der Schutzmaßnahmen', 1],
    asra21_5: ['ASR A2.1 Abschn. 5', 'Maßnahmen zum Schutz vor Absturz', 1],
    asra21_6: ['ASR A2.1 Abschn. 6', 'Maßnahmen zum Schutz vor herabfallenden Gegenständen', 1],
    asra22_5: ['ASR A2.2 Abschn. 4 bis 6', 'Eignung von Feuerlöschern, Ausstattung (Grundausstattung, erhöhte Brandgefährdung)', 1],
    asra22_7: ['ASR A2.2 Abschn. 7', 'Organisation des betrieblichen Brandschutzes', 1],
    asra23_4: ['ASR A2.3 Abschn. 4 bis 7', 'Allgemeine Anforderungen, Haupt- und Nebenfluchtwege, Türen und Tore im Verlauf von Fluchtwegen', 1],
    asra23_8: ['ASR A2.3 Abschn. 8', 'Kennzeichnung von Fluchtwegen und Notausgängen', 1],
    asra23_9: ['ASR A2.3 Abschn. 9', 'Sicherheitsbeleuchtung', 1],
    asra23_10: ['ASR A2.3 Abschn. 10 und 11', 'Flucht- und Rettungsplan, Unterweisung und Übung zur Evakuierung', 1],
    asra34_6: ['ASR A3.4 Abschn. 4 bis 6', 'Sichtverbindung nach außen, Tageslicht, künstliche Beleuchtung in Gebäuden', 1],
    asra34_8: ['ASR A3.4 Abschn. 8 und 9', 'Sicherheitsbeleuchtung; Betrieb, Instandhaltung und orientierende Messung', 1],
    asra34_a3: ['ASR A3.4 Anhang 3', 'Beleuchtungsanforderungen für Tätigkeiten, Arbeitsplätze, Arbeitsräume und Bereiche in Gebäuden', 1],
    asra35: ['ASR A3.5 Abschn. 4', 'Raumtemperaturen', 1],
    asra36: ['ASR A3.6 Abschn. 4 bis 6', 'Luftqualität, freie Lüftung, raumlufttechnische Anlagen', 1],
    asra37: ['ASR A3.7', 'Lärm', 0],
    asra41_5: ['ASR A4.1 Abschn. 5 bis 7', 'Toilettenräume, Waschräume, Umkleideräume', 1],
    asra42_4: ['ASR A4.2 Abschn. 4', 'Pausenräume und Pausenbereiche', 1],
    asra42_6: ['ASR A4.2 Abschn. 6', 'Einrichtungen für schwangere Frauen und stillende Mütter', 1],
    asra43_4: ['ASR A4.3 Abschn. 4 und 5', 'Mittel und Einrichtungen zur Ersten Hilfe', 1],
    asra43_7: ['ASR A4.3 Abschn. 7', 'Kennzeichnung', 1],
    asrv3a2: ['ASR V3a.2', 'Barrierefreie Gestaltung von Arbeitsstätten', 1],
    asra6: ['ASR A6', 'Bildschirmarbeit', 0],
    // ---- Betriebssicherheitsverordnung und TRBS ----
    betrsichv3: ['BetrSichV § 3', 'Gefährdungsbeurteilung', 1],
    betrsichv4: ['BetrSichV § 4', 'Grundpflichten des Arbeitgebers', 1],
    betrsichv5: ['BetrSichV § 5', 'Anforderungen an die zur Verfügung gestellten Arbeitsmittel', 1],
    betrsichv6: ['BetrSichV § 6', 'Grundlegende Schutzmaßnahmen bei der Verwendung von Arbeitsmitteln', 1],
    betrsichv8: ['BetrSichV § 8', 'Schutzmaßnahmen bei Gefährdungen durch Energien, Ingangsetzen und Stillsetzen', 1],
    betrsichv9: ['BetrSichV § 9', 'Weitere Schutzmaßnahmen bei der Verwendung von Arbeitsmitteln', 1],
    betrsichv10: ['BetrSichV § 10', 'Instandhaltung und Änderung von Arbeitsmitteln', 1],
    betrsichv11: ['BetrSichV § 11', 'Besondere Betriebszustände, Betriebsstörungen und Unfälle', 1],
    betrsichv12: ['BetrSichV § 12', 'Unterweisung und besondere Beauftragung von Beschäftigten', 1],
    betrsichv13: ['BetrSichV § 13', 'Zusammenarbeit verschiedener Arbeitgeber', 1],
    betrsichv14: ['BetrSichV § 14', 'Prüfung von Arbeitsmitteln', 1],
    betrsichv16: ['BetrSichV § 16', 'Wiederkehrende Prüfung', 1],
    betrsichv17: ['BetrSichV § 17', 'Prüfaufzeichnungen und -bescheinigungen', 1],
    trbs1111: ['TRBS 1111', 'Gefährdungsbeurteilung und sicherheitstechnische Bewertung', 1],
    trbs1112: ['TRBS 1112', 'Instandhaltung', 1],
    trbs1116: ['TRBS 1116', 'Qualifikation, Unterweisung und Beauftragung von Beschäftigten für die sichere Verwendung von Arbeitsmitteln', 1],
    trbs1201: ['TRBS 1201 Abschn. 3 bis 8', 'Anforderungen an Prüfungen und Kontrollen, Art, Umfang, Fristen, prüfende Personen', 1],
    trbs1203: ['TRBS 1203', 'Befähigte Personen', 1],
    trbs2111: ['TRBS 2111', 'Mechanische Gefährdungen – Allgemeine Anforderungen', 1],
    trbs2111_1: ['TRBS 2111 Teil 1', 'Maßnahmen zum Schutz vor Gefährdungen beim Verwenden von mobilen Arbeitsmitteln', 1],
    trbs2121_2: ['TRBS 2121 Teil 2 Abschn. 3 bis 5', 'Leitern: Gefährdungsbeurteilung, Schutzmaßnahmen, Prüfung', 1],
    trbs3145: ['TRBS 3145 / TRGS 745 Abschn. 3 und 4', 'Ortsbewegliche Druckgasbehälter: Gefährdungsbeurteilung, Schutzmaßnahmen', 1],
    maschvo: ['Maschinenverordnung (EU) 2023/1230', 'gilt ab 20.01.2027, bis dahin Maschinenrichtlinie 2006/42/EG; Konformitätserklärung und Betriebsanleitung des Herstellers', 0],
    en12100: ['DIN EN ISO 12100', 'Sicherheit von Maschinen – Allgemeine Gestaltungsleitsätze, Risikobeurteilung', 0],
    // ---- Gefahrstoffe, Gefahrstoff-TRGS, Vorsorge ----
    gefstoffv4: ['GefStoffV § 4', 'Einstufung, Kennzeichnung und Verpackung', 1],
    gefstoffv5: ['GefStoffV § 5', 'Sicherheitsdatenblatt und sonstige Informationspflichten', 1],
    gefstoffv6: ['GefStoffV § 6', 'Informationsermittlung und Gefährdungsbeurteilung (u. a. Gefahrstoffverzeichnis)', 1],
    gefstoffv7: ['GefStoffV § 7', 'Grundpflichten (u. a. Substitutionsprüfung)', 1],
    gefstoffv8: ['GefStoffV § 8', 'Allgemeine Schutzmaßnahmen', 1],
    gefstoffv9: ['GefStoffV § 9', 'Zusätzliche Schutzmaßnahmen', 1],
    gefstoffv12: ['GefStoffV § 12', 'Besondere Schutzmaßnahmen gegen physikalisch-chemische Einwirkungen, insbesondere Brand- und Explosionsgefährdungen', 1],
    gefstoffv13: ['GefStoffV § 13', 'Betriebsstörungen, Unfälle und Notfälle', 1],
    gefstoffv14: ['GefStoffV § 14', 'Unterrichtung und Unterweisung der Beschäftigten', 1],
    gefstoffv15: ['GefStoffV § 15', 'Zusammenarbeit verschiedener Firmen', 1],
    trgs400: ['TRGS 400', 'Gefährdungsbeurteilung für Tätigkeiten mit Gefahrstoffen', 0],
    trgs401: ['TRGS 401', 'Gefährdung durch Hautkontakt – Ermittlung, Beurteilung, Maßnahmen', 0],
    trgs406: ['TRGS 406', 'Sensibilisierende Stoffe für die Atemwege', 0],
    trgs510: ['TRGS 510', 'Lagerung von Gefahrstoffen in ortsbeweglichen Behältern', 0],
    trgs555: ['TRGS 555', 'Betriebsanweisung und Information der Beschäftigten', 0],
    trgs600: ['TRGS 600', 'Substitution', 0],
    trgs900: ['TRGS 900', 'Arbeitsplatzgrenzwerte', 0],
    clp: ['CLP-Verordnung (EG) Nr. 1272/2008', 'Einstufung und Kennzeichnung von Stoffen und Gemischen', 0],
    arbmedvv3: ['ArbMedVV § 3', 'Allgemeine Pflichten des Arbeitgebers', 1],
    arbmedvv45: ['ArbMedVV §§ 4, 5, 5a', 'Pflichtvorsorge, Angebotsvorsorge, Wunschvorsorge', 1],
    arbmedvvAnh: ['ArbMedVV Anhang', 'Arbeitsmedizinische Pflicht- und Angebotsvorsorge (Anlässe, z. B. Feuchtarbeit, Bildschirmarbeit)', 0],
    // ---- Lastenhandhabung, PSA ----
    lasthandhabv2: ['LasthandhabV § 2', 'Maßnahmen (Vermeiden, Verringern der Gefährdung, Beurteilung)', 1],
    lasthandhabv4: ['LasthandhabV § 4 und Anhang', 'Unterweisung; Merkmale zur Beurteilung der Handhabung von Lasten', 1],
    leitmerkmal: ['BAuA Leitmerkmalmethoden', 'Beurteilung von Heben/Halten/Tragen, Ziehen/Schieben', 0],
    psabv: ['PSA-Benutzungsverordnung §§ 2, 3', 'Bereitstellung und Benutzung, Unterweisung', 1],
    dguv1_29: ['DGUV Vorschrift 1 § 29', 'Bereitstellung (persönliche Schutzausrüstungen)', 1],
    dguv1_30: ['DGUV Vorschrift 1 § 30', 'Benutzung (persönliche Schutzausrüstungen)', 1],
    dguv1_31: ['DGUV Vorschrift 1 § 31', 'Besondere Unterweisungen (PSA gegen tödliche oder schwere Gefahren)', 1],
    en388: ['DIN EN 388', 'Schutzhandschuhe gegen mechanische Risiken', 0],
    en374: ['DIN EN ISO 374-1', 'Schutzhandschuhe gegen gefährliche Chemikalien und Mikroorganismen', 0],
    en407: ['DIN EN 407', 'Schutzhandschuhe gegen thermische Risiken (Hitze und/oder Feuer)', 0],
    en511: ['DIN EN 511', 'Schutzhandschuhe gegen Kälte', 0],
    en342: ['DIN EN 342', 'Schutzkleidung gegen Kälte', 0],
    en13998: ['DIN EN ISO 13998', 'Schürzen, Beinlinge und Jacken aus Ringgeflecht als Schutz gegen Schnitte und Stiche (Handmesser)', 0],
    en20345: ['DIN EN ISO 20345', 'Sicherheitsschuhe (zusätzlich Rutschhemmung SRA/SRB/SRC beachten)', 0],
    dguv112_191: ['DGUV Regel 112-191', 'Benutzung von Fuß- und Knieschutz', 0],
    dguv112_195: ['DGUV Regel 112-195', 'Benutzung von Schutzhandschuhen', 0],
    // ---- DGUV Vorschriften ----
    dguv1_2: ['DGUV Vorschrift 1 § 2', 'Grundpflichten des Unternehmers', 1],
    dguv1_3: ['DGUV Vorschrift 1 § 3', 'Beurteilung der Arbeitsbedingungen, Dokumentation, Auskunftspflichten', 1],
    dguv1_4: ['DGUV Vorschrift 1 § 4', 'Unterweisung der Versicherten', 1],
    dguv1_5: ['DGUV Vorschrift 1 § 5', 'Vergabe von Aufträgen', 1],
    dguv1_6: ['DGUV Vorschrift 1 § 6', 'Zusammenarbeit mehrerer Unternehmer', 1],
    dguv1_7: ['DGUV Vorschrift 1 § 7', 'Befähigung für Tätigkeiten', 1],
    dguv1_8: ['DGUV Vorschrift 1 § 8', 'Gefährliche Arbeiten (Überwachung, z. B. Alleinarbeit)', 1],
    dguv1_13: ['DGUV Vorschrift 1 § 13', 'Pflichtenübertragung', 1],
    dguv1_19: ['DGUV Vorschrift 1 § 19', 'Bestellung von Fachkräften für Arbeitssicherheit und Betriebsärzten', 1],
    dguv1_20: ['DGUV Vorschrift 1 § 20', 'Bestellung und Aufgaben von Sicherheitsbeauftragten', 1],
    dguv1_22: ['DGUV Vorschrift 1 § 22', 'Notfallmaßnahmen', 1],
    dguv1_24: ['DGUV Vorschrift 1 §§ 24 bis 26', 'Erste Hilfe: Pflichten, Einrichtungen und Sachmittel, Zahl und Ausbildung der Ersthelfer', 1],
    dguv68_5: ['DGUV Vorschrift 68 §§ 5, 6', 'Flurförderzeuge: Betriebsanweisung, bestimmungsgemäße Verwendung', 1],
    dguv68_7: ['DGUV Vorschrift 68 § 7', 'Auftrag zum Steuern von Flurförderzeugen (mindestens 18 Jahre, geeignet, ausgebildet, schriftlich beauftragt)', 1],
    dguv68_9: ['DGUV Vorschrift 68 §§ 9, 10', 'Mängel, Instandsetzungsarbeiten', 1],
    dguv68_11: ['DGUV Vorschrift 68 §§ 11 bis 13', 'Beladung, Fahren, Aufnehmen, Absetzen und Stapeln von Lasten', 1],
    dguv68_15: ['DGUV Vorschrift 68 §§ 15, 16', 'Verlassen des Flurförderzeuges, Verhalten während des Betriebes', 1],
    dguv68_17: ['DGUV Vorschrift 68 § 17', 'Be- und Entladen von Fahrzeugen und Wechselaufbauten', 1],
    dguv68_33: ['DGUV Vorschrift 68 §§ 29 bis 33, 36', 'Fluchtwege, Quergänge, Abstandshaltung, Zugangsverbote, Aufenthalt von Fußgängern, Durchgangsverkehr', 1],
    dguv68_37: ['DGUV Vorschrift 68 §§ 37 bis 39', 'Wiederkehrende Prüfungen, Prüfumfang, Prüfnachweis', 1],
    dguv308: ['DGUV Grundsatz 308-001', 'Ausbildung und Beauftragung der Fahrer von Flurförderzeugen mit Fahrersitz oder Fahrerstand', 0],
    dguv3: ['DGUV Vorschrift 3 § 5', 'Elektrische Anlagen und Betriebsmittel: Prüfungen', 0],
    dguv203_071: ['DGUV Information 203-071', 'Wiederkehrende Prüfungen ortsveränderlicher elektrischer Arbeitsmittel', 0],
    vde0701: ['DIN VDE 0701-0702', 'Prüfung nach Instandsetzung und wiederkehrende Prüfung elektrischer Geräte', 0],
    // ---- Lager, Leitern, Regale ----
    dguv108_007: ['DGUV Regel 108-007', 'Lagereinrichtungen und -geräte', 0],
    en15635: ['DIN EN 15635', 'Ortsfeste Regalsysteme aus Stahl – Anwendung und Wartung der Lagereinrichtung', 0],
    dguv208_016: ['DGUV Information 208-016', 'Handlungsanleitung für den Umgang mit Leitern und Tritten', 0],
    en131: ['DIN EN 131', 'Leitern', 0],
    dguv108_003: ['DGUV Regel 108-003', 'Fußböden in Arbeitsräumen und Arbeitsbereichen mit Rutschgefahr', 0],
    // ---- Ärzte, Fachkräfte, Mutterschutz ----
    asig: ['ASiG §§ 2, 3, 5, 6, 10, 11', 'Bestellung und Aufgaben von Betriebsärzten und Fachkräften für Arbeitssicherheit, Zusammenarbeit, Arbeitsschutzausschuss', 1],
    muschg9: ['MuSchG §§ 9, 10', 'Gestaltung der Arbeitsbedingungen, unverantwortbare Gefährdung; Beurteilung der Arbeitsbedingungen, Schutzmaßnahmen', 1],
    muschg27: ['MuSchG § 27', 'Mitteilungs- und Aufbewahrungspflichten des Arbeitgebers', 1],
    muschg11: ['MuSchG §§ 11 bis 14', 'Unzulässige Tätigkeiten (schwangere und stillende Frauen), Rangfolge der Schutzmaßnahmen, Dokumentation und Information', 1],
    // ---- Psychische Belastung, Arbeitszeit ----
    gdapsy: ['GDA-Leitlinie Beratung und Überwachung bei psychischer Belastung am Arbeitsplatz', 'Handlungsfelder: Arbeitsinhalt, Arbeitsorganisation, soziale Beziehungen, Arbeitsumgebung', 0],
    arbzg: ['ArbZG §§ 3 bis 5', 'Arbeitszeit der Arbeitnehmer, Ruhepausen, Ruhezeit', 1],
    iso10075: ['DIN EN ISO 10075', 'Ergonomische Grundlagen bezüglich psychischer Arbeitsbelastung', 0],
    agg: ['AGG', 'Allgemeines Gleichbehandlungsgesetz (Schutz vor Benachteiligung und Belästigung)', 0],
    // ---- Sonstige ----
    sprengv: ['SprengG und 1. SprengV', 'Aufbewahrung und Lagerung von pyrotechnischen Gegenständen', 0],
    lmhyg: ['VO (EG) Nr. 852/2004', 'Lebensmittelhygiene (Anhang II: Anforderungen an Räume, Ausrüstung, Personalhygiene)', 0],
    en378: ['DIN EN 378', 'Kälteanlagen und Wärmepumpen – Sicherheitstechnische und umweltrelevante Anforderungen', 0],
    en13732: ['DIN EN ISO 13732', 'Ergonomie der thermischen Umgebung – Berührung heißer (Teil 1) bzw. kalter (Teil 3) Oberflächen', 0],
    pna: ['DGUV Regel 112-139', 'Einsatz von Personen-Notsignal-Anlagen', 0],
    dguv215_410: ['DGUV Information 215-410', 'Bildschirm- und Büroarbeitsplätze', 0],
    dguv70: ['DGUV Vorschrift 70', 'Fahrzeuge', 0],
    dguv208_043: ['DGUV Information 208-043', 'Sicherheit von Regalen', 0],
    dguv25: ['DGUV Vorschrift 25 / DGUV Regel 108-010', 'Überfallprävention', 0],
    dguv110_011: ['DGUV Regel 110-011', 'Fleischwirtschaft – Handwerk', 0],
    herstellerangaben: ['Betriebsanleitung des Herstellers', 'bestimmungsgemäße Verwendung, Schutzeinrichtungen, Reinigung, Wartung', 1],
    typenschild: ['Produktnorm der Maschine (Konformitätserklärung)', 'z. B. DIN EN 1974 Aufschnittschneidemaschinen, DIN EN 12331 Fleischwölfe, DIN EN 12355 Kutter', 0]
  };

  const DEF = {
    explain: 'Die konkreten Arbeitsbedingungen und die daraus entstehenden Gefährdungen beurteilen. Vorhandene Schutzmaßnahmen auf Eignung und tatsächliche Anwendung prüfen; erforderliche Maßnahmen festlegen und ihre Wirksamkeit kontrollieren.',
    t: 'Gefährdung möglichst an der Quelle beseitigen oder technisch begrenzen.',
    o: 'Zuständigkeiten, sichere Abläufe, Prüfungen und Kontrollen verbindlich regeln.',
    p: 'Beschäftigte tätigkeitsbezogen unterweisen; erforderliche persönliche Schutzausrüstung bereitstellen.',
    e: 'Im Arbeitsalltag prüfen, ob die Maßnahme eingehalten wird und die Gefährdung ausreichend reduziert ist; Ergebnis und Prüftermin dokumentieren.'
  };

  // Kategorien: src = Schlüssel aus SRC; weitere Felder überschreiben DEF.
  const CAT = {
    AREA: { src: ['arbschg5', 'arbschg4', 'arbschg6', 'asrv3'], explain: 'Tätigkeiten dieses Bereichs mit ihren Gefährdungen beurteilen (Heben, Rutschen, Schneiden, Kälte, Maschinen). Maßgeblich ist, wie gearbeitet wird, nicht wie es vorgesehen ist.' },
    ORG: { src: ['arbschg3', 'arbschg13', 'dguv1_2', 'dguv1_13', 'asig', 'dguv1_19', 'dguv1_20'], explain: 'Der Arbeitgeber trägt die Verantwortung für die Organisation des Arbeitsschutzes. Aufgaben können schriftlich übertragen werden, die Verantwortung bleibt. Betriebsarzt und Fachkraft für Arbeitssicherheit sind zu bestellen, der Arbeitsschutzausschuss tagt bei mehr als 20 Beschäftigten vierteljährlich.', t: 'Nicht zutreffend, die Organisation selbst ist die Maßnahme.', o: 'Zuständigkeiten, Vertretungen, Beauftragungen und Zusammenarbeit mit Fachkraft und Betriebsarzt schriftlich festlegen.', p: 'Führungskräfte über ihre Pflichten unterweisen; Sicherheitsbeauftragte schulen.' },
    AUFTRAG: { src: ['arbschg7', 'arbschg13', 'dguv1_13', 'dguv1_7'], explain: 'Aufgaben im Arbeitsschutz dürfen nur an zuverlässige und fachkundige Personen übertragen werden, schriftlich und mit Befugnissen und Mitteln. Die Pflichtenübertragung entbindet den Arbeitgeber nicht von der Aufsicht.', t: 'Nicht zutreffend.', o: 'Schriftliche Beauftragung mit Aufgaben, Befugnissen, Mitteln und Vertretung; Eignung prüfen und dokumentieren.', p: 'Beauftragte vor Übernahme der Aufgabe einweisen und regelmäßig schulen.' },
    EH: { src: ['arbschg10', 'dguv1_24', 'asra43_4', 'asra43_7', 'as43'], explain: 'Erste Hilfe muss jederzeit während der Arbeitszeit möglich sein: ausgebildete Ersthelfer in ausreichender Zahl (bei mehr als 20 anwesenden Beschäftigten im Handel mindestens 5 Prozent), Erste-Hilfe-Material, Meldeeinrichtung, Notrufnummern und Dokumentation von Hilfeleistungen.', t: 'Erste-Hilfe-Material, Augenspülung und Meldeeinrichtungen erreichbar und gekennzeichnet bereitstellen.', o: 'Ersthelfer benennen und Fortbildung (alle 2 Jahre) planen; Verbandbuch bzw. Meldeblock führen; Notrufnummern aushängen.', p: 'Ersthelfer aus- und fortbilden; Beschäftigte über Standort der Hilfsmittel und Notruf informieren.' },
    MUSCHG: { src: ['muschg9', 'muschg11', 'muschg27', 'asra42_6', 'arbschg4'], explain: 'Die Arbeitsbedingungen sind unabhängig von einer Schwangerschaft zu beurteilen (§ 10). Bei einer Meldung sind unverzüglich Schutzmaßnahmen festzulegen: zuerst Umgestaltung, dann Arbeitsplatzwechsel, zuletzt betriebliches Beschäftigungsverbot (§ 13). Die Aufsichtsbehörde ist zu informieren (§ 27).', t: 'Arbeitsplatz so umgestalten, dass unverantwortbare Gefährdungen entfallen (Heben, Gefahrstoffe, Kälte, Stehen).', o: 'Ablauf bei Meldung festlegen: Gespräch, Beurteilung, Maßnahmen, Dokumentation, Information der Behörde.', p: 'Beschäftigte und Führungskräfte über Meldung und Schutzrechte informieren.' },
    FEUERWERK: { src: ['sprengv', 'gefstoffv12', 'asra22_5', 'arbschg10'], explain: 'Pyrotechnische Gegenstände sind nur in der zulässigen Menge, in dafür geeigneten Räumen und getrennt von anderen Waren zu lagern und abzugeben. Die Lagerung darf Flucht- und Rettungswege nicht beeinträchtigen.', t: 'Geeignete Lagerung (abschließbar, getrennt von Zündquellen) und Brandschutzausstattung vorsehen.', o: 'Lagermengen, Verkaufszeiträume, Zuständigkeiten und Sicherheitsabstände festlegen.', p: 'Beschäftigte zu Gefahren, Lagerung und Verhalten im Brandfall unterweisen.' },
    BRAND: { src: ['as22', 'asra22_5', 'asra22_7', 'arbschg10', 'dguv1_22'], explain: 'Die Brandgefährdung bestimmt die Ausstattung mit Feuerlöscheinrichtungen. Zusätzlich sind Brandschutzhelfer zu benennen (Richtwert 5 Prozent der Beschäftigten), Alarmierung und Räumung zu regeln und die Einrichtungen regelmäßig zu prüfen.', t: 'Feuerlöscher nach Grundausstattung (ggf. mehr bei erhöhter Brandgefährdung), Brandmeldung, Rauch- und Wärmeabzug prüfen; Prüffristen einhalten (Feuerlöscher mindestens alle 2 Jahre).', o: 'Brandschutzordnung, Alarmplan, Sammelstelle und Brandschutzhelfer festlegen; Brandlasten und Zündquellen begrenzen.', p: 'Brandschutzhelfer ausbilden; Beschäftigte zu Alarm, Fluchtwegen und Löschen unterweisen; Räumungsübungen durchführen.' },
    FLUCHT: { src: ['as23', 'asra23_4', 'asra23_8', 'asra23_9', 'asra23_10', 'asra13'], explain: 'Flucht- und Rettungswege müssen jederzeit frei, ausreichend breit, gekennzeichnet, beleuchtet (Sicherheitsbeleuchtung) und ohne fremde Hilfe benutzbar sein. Türen im Verlauf von Fluchtwegen müssen von innen ohne Hilfsmittel zu öffnen sein.', t: 'Türen, Kennzeichnung, Sicherheitsbeleuchtung und Fluchtwegplan prüfen und instand halten.', o: 'Fluchtwege freihalten (regelmäßige Kontrolle, keine Lagerung), Prüfintervalle und Zuständigkeiten festlegen.', p: 'Beschäftigte über Fluchtwege, Sammelstelle und Verhalten unterweisen; Evakuierungsübung durchführen.' },
    UNTERW: { src: ['arbschg12', 'dguv1_4', 'arbstaettv6', 'betrsichv12', 'gefstoffv14'], explain: 'Unterweisungen müssen vor Aufnahme der Tätigkeit, bei Änderungen und danach mindestens einmal jährlich erfolgen, arbeitsplatzbezogen, verständlich und dokumentiert. Bei Jugendlichen halbjährlich.', t: 'Zuerst prüfen, ob Gefahren technisch vermieden werden können; Unterweisung ersetzt keine Schutzmaßnahme.', o: 'Unterweisungsplan mit Anlässen, Inhalten, Zielgruppen und Terminen; Teilnahme dokumentieren und Wirksamkeit prüfen.', p: 'Praxisnah und in verständlicher Sprache unterweisen; Verständnis abfragen; Betriebsanweisungen nutzen.' },
    ARBPL: { src: ['as31', 'as32', 'as33', 'asra12_5', 'asra12_4', 'arbstaettv3'], explain: 'Arbeitsplätze müssen ausreichend Bewegungsfläche, sichere Anordnung und eine geeignete Ausstattung haben. Ordnung und Sauberkeit sind Teil des Betreibens.', t: 'Arbeitsflächen, Höhen und Bewegungsräume anpassen; Hilfsmittel bereitstellen.', o: 'Ordnung und Sauberkeit regeln; Arbeitsplätze regelmäßig kontrollieren.', p: 'Beschäftigte zu ergonomischer Arbeitsweise unterweisen.' },
    LICHT: { src: ['as34', 'asra34_6', 'asra34_a3', 'asra34_8', 'asra23_9'], explain: 'Beleuchtung muss zur Sehaufgabe passen, blendfrei sein und im Ausfall der allgemeinen Beleuchtung durch Sicherheitsbeleuchtung ergänzt werden, wo dies erforderlich ist. Beleuchtungsstärken stehen in ASR A3.4 Anhang 3 (z. B. Verkaufsräume, Lager, Verkehrswege).', t: 'Beleuchtung prüfen und messen (orientierende Messung); Leuchtmittel und Sicherheitsbeleuchtung warten.', o: 'Defekte Leuchten melden und zeitnah ersetzen; Wartung der Sicherheitsbeleuchtung dokumentieren.', p: 'Beschäftigte zum Melden von Defekten anhalten.' },
    KLIMA: { src: ['as35', 'asra35', 'as36', 'asra36'], explain: 'In Arbeitsräumen muss während der Arbeitszeit eine gesundheitlich zuträgliche Raumtemperatur und ausreichend Frischluft sichergestellt sein. Bei Hitze und Kälte sind Maßnahmen nach Rangfolge festzulegen.', t: 'Lüftung, Heizung, Sonnenschutz und Kühlung prüfen.', o: 'Arbeitszeiten, Pausen und Getränke bei Hitze regeln; Lüftungsregeln festlegen.', p: 'Beschäftigte zu Verhalten bei Hitze und Kälte unterweisen.' },
    KOERPER: { src: ['lasthandhabv2', 'lasthandhabv4', 'leitmerkmal', 'arbschg4', 'arbschg5'], explain: 'Manuelles Handhaben von Lasten ist zu vermeiden; wo nicht möglich, sind Gefährdungen anhand von Last, Haltung, Häufigkeit und Bedingungen zu beurteilen (Leitmerkmalmethode) und zu verringern.', t: 'Hubhilfen, Wagen, Rollcontainer und höhenverstellbare Flächen einsetzen; Lastgewichte begrenzen.', o: 'Arbeitsabläufe und Rotation festlegen; Regalhöhen und Packstückgewichte planen.', p: 'Hebe- und Tragetechniken unterweisen; nur geeignete Hilfsmittel verwenden.' },
    VERKEHR: { src: ['as18', 'asra18_4', 'asra18_5', 'asra18_6', 'as15'], explain: 'Verkehrswege müssen so angelegt, gekennzeichnet und freigehalten werden, dass sie sicher benutzt werden können; Fahrzeug- und Fußgängerverkehr sind zu trennen oder zu regeln.', t: 'Breiten, Beleuchtung, Markierungen, Anfahrschutz und Kreuzungen prüfen.', o: 'Verkehrswege freihalten, Lagerverbote und Kontrollen festlegen.', p: 'Beschäftigte zu Verkehrsregeln unterweisen.' },
    BODEN: { src: ['as15', 'asra15_5', 'asra15_6', 'asra15_8', 'asra15_7', 'dguv108_003'], explain: 'Fußböden müssen tragfähig, eben, rutschhemmend und leicht zu reinigen sein. Die erforderliche Rutschhemmung hängt vom Arbeitsbereich ab (Bewertungsgruppen R9 bis R13 und Verdrängungsraum V4 bis V10 nach ASR A1.5 Anhang 2).', t: 'Bodenbelag mit passender Rutschhemmung; Schäden und Stolperstellen beseitigen; Auffangmatten.', o: 'Reinigung und Kontrolle festlegen; Verschüttetes sofort aufnehmen; Warnschilder.', p: 'Geeignetes rutschhemmendes Schuhwerk tragen; zum Melden von Gefahrenstellen anhalten.' },
    TREPPE: { src: ['as21', 'asra21_4', 'asra21_5', 'asra21_6', 'asra18_4', 'as18'], explain: 'Absturzgefahr besteht an Treppen, Podesten, Rampen und Öffnungen. Handläufe, Geländer, Stufenkanten und Beleuchtung müssen sicheren Zustand haben.', t: 'Geländer und Handläufe, Stufenmarkierung, rutschhemmender Belag.', o: 'Kontrollen und Instandhaltung festlegen; Treppen frei von Lagergut halten.', p: 'Hinweise zur sicheren Nutzung geben (Handlauf, keine Lasten über Sichtfeld).' },
    TOR: { src: ['as17', 'asra17_4', 'asra17_6', 'asra17_10', 'betrsichv14'], explain: 'Kraftbetätigte Türen und Tore müssen gegen Quetschen, Scheren und Einziehen gesichert sein und regelmäßig durch Fachkundige geprüft werden (sicherheitstechnische Prüfung vor Inbetriebnahme und wiederkehrend, in der Regel jährlich).', t: 'Sicherheitskontaktleiste, Lichtschranke, Notentriegelung, Sensoren funktionsfähig halten.', o: 'Prüfung, Wartung und Mängelmeldung festlegen; Prüfbuch führen.', p: 'Bedienung unterweisen; Beschädigungen sofort melden.' },
    M_BEST: { src: ['betrsichv3', 'betrsichv5', 'betrsichv6', 'trbs1111', 'trbs2111', 'herstellerangaben', 'maschvo'], explain: 'Arbeitsmittel dürfen nur bestimmungsgemäß, in sicherem Zustand und nach Betriebsanleitung des Herstellers verwendet werden. Die Gefährdungsbeurteilung berücksichtigt Normalbetrieb, Reinigung, Rüsten, Störungsbeseitigung und Instandhaltung.', t: 'Feste oder verriegelte Schutzeinrichtungen, sichere Steuerung, Not-Halt; Schutzeinrichtungen nicht umgehen.', o: 'Betriebsanweisung, Berechtigung, Prüf- und Wartungsintervalle festlegen.', p: 'Bedienende auf das konkrete Arbeitsmittel unterweisen; PSA nur ergänzend einsetzen.' },
    M_BED: { src: ['betrsichv6', 'betrsichv12', 'herstellerangaben', 'trbs1116'], explain: 'Beschicken und Bedienen müssen so möglich sein, dass niemand in Gefahrbereiche greifen muss. Hilfsmittel (Stopfer, Schieber) sind zu verwenden, nicht die Hände.', t: 'Einfüllöffnungen, Stopfer, Verriegelungen und Zweihandbedienung prüfen.', o: 'Bedienablauf und Berechtigungen festlegen; Störungen nicht im laufenden Betrieb beheben.', p: 'Sichere Bedienung praktisch unterweisen; Manipulationsverbot vermitteln.' },
    M_ENERGIE: { src: ['betrsichv8', 'betrsichv6', 'trbs1112', 'herstellerangaben'], explain: 'Vor Eingriffen (Reinigen, Rüsten, Entstören, Wartung) muss die Maschine stillgesetzt und gegen Wiederanlauf gesichert sein. Ein unbeabsichtigter Anlauf ist auszuschließen.', t: 'Hauptschalter abschließbar, Not-Halt, Wiederanlaufsperre, Restenergie abbauen.', o: 'Verfahren zum Stillsetzen und Sichern schriftlich festlegen (Ausschalten, Sichern, Prüfen).', p: 'Verfahren üben und regelmäßig unterweisen.' },
    M_PRUEF: { src: ['betrsichv10', 'betrsichv14', 'betrsichv17', 'trbs1201', 'trbs1203', 'trbs1112'], explain: 'Arbeitsmittel sind vor Inbetriebnahme, nach Änderungen und wiederkehrend zu prüfen; Prüffristen legt der Arbeitgeber anhand der Gefährdungsbeurteilung fest. Prüfungen führen befähigte Personen durch; Prüfungen und Mängel werden dokumentiert.', t: 'Mängel beseitigen, defekte Schutzeinrichtungen sofort ersetzen; Maschine bis dahin außer Betrieb nehmen.', o: 'Prüf- und Wartungsplan, befähigte Personen, Dokumentation und Mängelmeldung festlegen.', p: 'Beschäftigte zum Melden von Mängeln anhalten.' },
    M_STOER: { src: ['betrsichv11', 'betrsichv8', 'betrsichv6', 'herstellerangaben'], explain: 'Störungen und Blockaden dürfen nur bei Stillstand und gesicherter Maschine beseitigt werden. Für besondere Betriebszustände sind Verfahren festzulegen.', t: 'Zugang zur Störstelle nur nach Stillsetzen; Hilfsmittel zur Störungsbeseitigung bereitstellen.', o: 'Vorgehen bei Störungen, Zuständigkeiten und Meldung festlegen.', p: 'Verhalten bei Störungen unterweisen; Eingriffe in laufende Maschinen verbieten.' },
    M_REIN: { src: ['betrsichv8', 'betrsichv10', 'betrsichv6', 'herstellerangaben', 'gefstoffv14'], explain: 'Reinigung und Wartung zählen zu den gefährlichsten Arbeitsphasen: Maschine stillsetzen und sichern, scharfe Teile abnehmen, geeignete Hilfsmittel und Mittel verwenden.', t: 'Abnehmbare Teile, Spritzwasserschutz, Reinigungshilfen, Verriegelungen.', o: 'Reinigungsplan mit Zuständigkeiten und Reihenfolge; keine Reinigung bei laufender Maschine.', p: 'Reinigung praktisch unterweisen; Schnittschutzhandschuhe und Schutzbrille, wo erforderlich.' },
    M_SCHUTZ: { src: ['betrsichv6', 'betrsichv5', 'trbs2111', 'en12100', 'herstellerangaben', 'typenschild'], explain: 'Gefahrstellen (Einzug, Quetschen, Schneiden, Scheren) müssen durch feste oder bewegliche verriegelte Schutzeinrichtungen gesichert sein. Schutzeinrichtungen dürfen nicht entfernt, überbrückt oder manipuliert werden.', t: 'Schutzeinrichtungen vollständig und wirksam halten; Verriegelungen auf Funktion prüfen.', o: 'Funktionsprüfung vor Schichtbeginn; Manipulation verbieten und kontrollieren.', p: 'Gefahrstellen und Wirkung der Schutzeinrichtungen unterweisen.' },
    M_BEAUFTR: { src: ['betrsichv12', 'trbs1116', 'dguv1_7', 'herstellerangaben'], explain: 'Gefährliche Maschinen dürfen nur durch unterwiesene und beauftragte Personen bedient werden. Die Betriebsanweisung muss verständlich und am Arbeitsplatz verfügbar sein.', t: 'Zugang zur Maschine begrenzen (Schlüssel, Freigabe).', o: 'Berechtigungsliste führen; Betriebsanweisung aushängen.', p: 'Vor Erstbenutzung und danach jährlich unterweisen; Nachweis führen.' },
    M_UNT: { src: ['betrsichv12', 'trbs1116', 'arbschg12', 'dguv1_4'], explain: 'Beschäftigte sind vor der Verwendung eines Arbeitsmittels zu unterweisen: Funktion, Gefahrstellen, Schutzeinrichtungen, Verhalten bei Störungen. Die Unterweisung ist zu wiederholen und zu dokumentieren.', t: 'Unterweisung ersetzt keine fehlende Schutzeinrichtung.', o: 'Unterweisungsplan je Arbeitsmittel; Dokumentation.', p: 'Praxisnah unterweisen und Verständnis kontrollieren.' },
    MECH: { src: ['betrsichv6', 'trbs2111', 'en12100', 'arbschg4'], explain: 'Mechanische Gefährdungen (Quetschen, Scheren, Schneiden, Stoßen, Einziehen) sind an der Quelle zu vermeiden oder durch Schutzeinrichtungen zu sichern.', t: 'Gefahrstellen sichern, Abstände einhalten.', o: 'Gefahrenbereiche kennzeichnen und freihalten.', p: 'Unterweisen; PSA ergänzend.' },
    BEWEGT: { src: ['as21', 'asra21_6', 'betrsichv6', 'dguv108_007'], explain: 'Gefährdungen durch bewegte, herabfallende oder umkippende Gegenstände entstehen durch unsachgemäße Stapelung, Überlastung und fehlende Standsicherheit.', t: 'Standsichere Lagerung, Sicherungen gegen Herabfallen.', o: 'Stapelhöhen und Lastgrenzen festlegen; Gefahrenbereiche sperren.', p: 'Zu sicherem Stapeln unterweisen.' },
    OBERFL: { src: ['en13732', 'arbschg4', 'betrsichv6', 'en407', 'en511'], explain: 'Heiße und kalte Oberflächen können Verbrennungen bzw. Kälteschäden verursachen. Berührungstemperaturen und Einwirkdauer sind maßgeblich, Berührungsschutz hat Vorrang.', t: 'Abschirmung, Isolierung, Griffe, Berührungsschutz.', o: 'Kennzeichnung, Abkühlzeiten, Verbot der Berührung festlegen.', p: 'Hitze- bzw. Kälteschutzhandschuhe bereitstellen und benutzen lassen.' },
    ELEKTRIK: { src: ['dguv3', 'dguv203_071', 'vde0701', 'betrsichv14', 'trbs1201'], explain: 'Elektrische Anlagen und Betriebsmittel sind vor Inbetriebnahme und wiederkehrend durch Elektrofachkräfte zu prüfen (ortsveränderliche Geräte meist jährlich, ortsfeste Anlagen alle 4 Jahre; Fristen aus der Gefährdungsbeurteilung). Beschädigte Geräte sofort außer Betrieb nehmen.', t: 'Fehlerstromschutz, geschützte Steckdosen, unbeschädigte Leitungen.', o: 'Prüfplan, Prüfnachweise, Mängelmeldung, Verbot privater Geräte.', p: 'Unterweisen: Sichtkontrolle, nicht selbst reparieren, Feuchtigkeit meiden.' },
    KASSE: { src: ['as6', 'asra6', 'as31', 'as33', 'dguv215_410', 'arbmedvvAnh'], explain: 'Kassen- und Bildschirmarbeitsplätze müssen ergonomisch gestaltet sein (Sitz-Steh-Wechsel, Höhen, Bildschirmaufstellung, Blendfreiheit). Bei Bildschirmarbeit ist Vorsorge anzubieten.', t: 'Höhenverstellbare Arbeitsflächen, Sitz-Steh-Hilfen, Anti-Ermüdungsmatten, Blendschutz.', o: 'Wechsel der Arbeitsposition, Pausen, Rotation planen.', p: 'Zu ergonomischem Einstellen und Arbeiten unterweisen.' },
    GELD: { src: ['arbschg4', 'arbschg5', 'dguv25', 'arbschg10', 'dguv1_22', 'gdapsy'], explain: 'Überfall- und Diebstahlgefahr hängt vom Bargeldbestand, vom Gebäude und von der Besetzung ab. Prävention, Verhalten im Ernstfall und Nachsorge der Betroffenen sind zu regeln.', t: 'Tresor, Geldabschöpfung, Kamera, Beleuchtung, Sichtverbindung, Alarmierung.', o: 'Kassenbestände begrenzen, Geldtransporte und Zeiten festlegen, Alleinarbeit vermeiden, Nachsorge organisieren.', p: 'Verhalten bei Überfall unterweisen; Nachsorge-Angebote bekannt machen.' },
    DIEBSTAHL: { src: ['arbschg5', 'arbschg5psy', 'gdapsy', 'arbschg12'], explain: 'Ladendiebstahl und Konflikte mit Kunden können zu Gewalt führen. Beschäftigte sollen nicht eingreifen, die Eskalation muss durch Organisation und Unterweisung begrenzt werden.', t: 'Warensicherung, Sichtverbindung, Alarmknopf.', o: 'Verhaltensregeln, Eskalationsweg, Nachsorge festlegen.', p: 'Deeskalation unterweisen.' },
    HAUT: { src: ['trgs401', 'arbmedvvAnh', 'arbmedvv45', 'gefstoffv6', 'gefstoffv8', 'en374', 'dguv112_195'], explain: 'Hautbelastung durch Feuchtarbeit (regelmäßig mehr als 2 Stunden täglich), Handschuhtragen und hautbelastende Stoffe ist zu ermitteln. Hautschutz-, Hautreinigungs- und Hautpflegemittel sind in einem Hautschutzplan festzulegen; arbeitsmedizinische Vorsorge ist anzubieten.', t: 'Hautbelastende Arbeitsstoffe ersetzen, Verfahren ändern, Hilfsmittel für Feuchtarbeit.', o: 'Hautschutzplan, Tragezeiten, Wechsel zwischen Feucht- und Trockenarbeit, Vorsorge anbieten.', p: 'Hautschutz, Handschuhauswahl und Hautpflege unterweisen.' },
    GEFSTOFF: { src: ['gefstoffv6', 'gefstoffv7', 'gefstoffv8', 'gefstoffv14', 'trgs400', 'trgs555', 'gefstoffv5', 'clp'], explain: 'Gefahrstoffe sind zu erfassen (Gefahrstoffverzeichnis), zu beurteilen, zu kennzeichnen und sicher zu lagern; Substitutionsmöglichkeiten sind zu prüfen. Sicherheitsdatenblatt und Betriebsanweisung müssen verfügbar sein; Unterweisung mindestens jährlich.', t: 'Weniger gefährliche Stoffe, Dosiersysteme, Absaugung oder Lüftung, geschlossene Systeme.', o: 'Gefahrstoffverzeichnis, Betriebsanweisungen, Lagerregeln, Zugangsbeschränkung, Notfallregeln.', p: 'Unterweisung zu konkreten Stoffgefahren; PSA nach Bewertung (Handschuhe, Brille).' },
    SENSI: { src: ['trgs406', 'trgs401', 'gefstoffv6', 'arbmedvv45', 'arbmedvvAnh'], explain: 'Sensibilisierende Stoffe (z. B. Mehlstaub, Gewürzstäube, Latex) können Allergien auslösen. Exposition ist zu ermitteln und zu minimieren, Vorsorge ist anzubieten.', t: 'Staubarme Verfahren, Absaugung, Substitution.', o: 'Expositionsermittlung, Vorsorge, Hautschutzplan.', p: 'Unterweisung zu Symptomen und Meldung.' },
    NOTFALL: { src: ['arbschg10', 'dguv1_22', 'asra23_10', 'asra22_7', 'gefstoffv13'], explain: 'Für Notfälle (Brand, Unfall, Gefahrstofffreisetzung, Überfall) sind Verhalten, Alarmierung, Erste Hilfe und Räumung zu regeln und zu üben.', t: 'Alarmeinrichtungen, Kommunikationsmittel, Notfallausrüstung.', o: 'Notfallplan, Notrufnummern, Zuständigkeiten, Übung.', p: 'Verhalten im Notfall unterweisen und üben.' },
    LEITER: { src: ['trbs2121_2', 'dguv208_016', 'en131', 'betrsichv14', 'trbs1201', 'trbs1203'], explain: 'Leitern und Tritte sind nur für kurzzeitige Arbeiten mit geringer Belastung geeignet und nur bei Fehlen sichererer Arbeitsmittel (z. B. fahrbare Plattform). Zustand vor Benutzung kontrollieren, regelmäßig prüfen lassen.', t: 'Geeignete Aufstiegshilfen (Plattformtritte, fahrbare Podeste) statt Leitern bereitstellen.', o: 'Prüfplan, Kennzeichnung, Auswahlregeln, Verbot von Behelfsmitteln (Stühle, Kartons).', p: 'Richtiges Aufstellen und Benutzen unterweisen.' },
    PSA: { src: ['psabv', 'dguv1_29', 'dguv1_30', 'dguv1_31', 'arbschg4', 'en388', 'en20345'], explain: 'Persönliche Schutzausrüstung ist nachrangig gegenüber technischen und organisatorischen Maßnahmen. Sie muss geeignet, passend und in ausreichender Zahl kostenlos bereitgestellt, gepflegt und benutzt werden.', t: 'Zuerst technische Lösungen prüfen; PSA ergänzt nur.', o: 'PSA-Auswahl anhand der Gefährdungsbeurteilung; Bereitstellung, Wartung, Tragepflicht kontrollieren.', p: 'Benutzung unterweisen; Anprobe, Passform, Pflege.' },
    LAGER: { src: ['as18', 'asra18_5', 'betrsichv6', 'dguv108_007', 'as21', 'asra21_6'], explain: 'Lagerbereiche brauchen freie Verkehrswege, tragfähige Lagereinrichtungen, standsichere Stapelung und sicheren Zugang zu hohen Lagerplätzen.', t: 'Regale und Stapelhilfen, Absturz- und Herabfallschutz, Beleuchtung.', o: 'Lagerordnung, Stapelhöhen, Beladungsangaben, Kontrollen.', p: 'Zu sicherer Lagerung und Stapelung unterweisen.' },
    REGAL: { src: ['dguv108_007', 'dguv208_043', 'en15635', 'betrsichv6', 'betrsichv14', 'trbs1201'], explain: 'Regale sind mit Beladungsangaben zu kennzeichnen, vor Anprall zu schützen und regelmäßig (mindestens jährlich) durch eine befähigte Person zu prüfen; zwischendurch erfolgen Sichtkontrollen durch Beauftragte.', t: 'Anfahrschutz, Beladungsschilder, Sicherungen gegen Aushängen.', o: 'Prüfplan, Sichtkontrollen, Mängelmeldung, Sperrung beschädigter Regale.', p: 'Zu Beladungsgrenzen und Meldung von Schäden unterweisen.' },
    TRANSPORT: { src: ['betrsichv6', 'lasthandhabv2', 'as18', 'asra18_5', 'arbschg4'], explain: 'Transportmittel (Handwagen, Rollcontainer, Hubwagen) müssen für die Last geeignet, gebrauchstüchtig und gut rollbar sein; Ziehen und Schieben sind zu beurteilen.', t: 'Geeignete Räder, Bremsen, Griffhöhen; Hubhilfen.', o: 'Prüf- und Wartungsplan, Stellplätze, Wegfreihaltung.', p: 'Zu sicherem Schieben und Abstellen unterweisen.' },
    FFZ: { src: ['dguv68_5', 'dguv68_7', 'dguv308', 'dguv68_9', 'dguv68_11', 'dguv68_15', 'dguv68_17', 'dguv68_33', 'dguv68_37', 'betrsichv14'], explain: 'Flurförderzeuge dürfen nur Personen steuern, die mindestens 18 Jahre alt, geeignet, ausgebildet und schriftlich beauftragt sind. Das Gerät ist mindestens jährlich durch eine befähigte Person zu prüfen, vor Schichtbeginn kontrolliert und mit Mängeln stillzusetzen.', t: 'Rückhaltesysteme, Warneinrichtungen, Beleuchtung, getrennte Fahrwege.', o: 'Beauftragung (schriftlich), Fahrregeln, Verkehrsregelung, Prüfplan, Schlüsselverwaltung.', p: 'Ausbildung und jährliche Unterweisung der Fahrer; Fußgänger unterweisen.' },
    PRESS: { src: ['betrsichv6', 'betrsichv8', 'betrsichv11', 'betrsichv12', 'betrsichv14', 'herstellerangaben'], explain: 'Abfall- und Ballenpressen sind Gefahrstellen mit Quetsch- und Scherwirkung. Nur unterwiesene und beauftragte Personen dürfen sie bedienen, Wartung und Störungsbeseitigung nur bei gesicherter Maschine.', t: 'Verriegelte Beschickungsklappen, Schlüsselschalter, Not-Halt, Zugangssicherung.', o: 'Beauftragung, Schlüsselverwaltung, Entleerungsablauf, Prüfung.', p: 'Bedienung unterweisen; Eingreifen in Pressraum verbieten.' },
    LEERGUT: { src: ['betrsichv6', 'lasthandhabv2', 'as15', 'asra15_6', 'en388', 'arbschg4'], explain: 'Leergutbereiche haben Gefährdungen durch Glasbruch, Rutschen auf Flüssigkeit, schwere Kisten und Rücknahmeautomaten.', t: 'Rücknahmeautomaten mit geschlossenen Transportbereichen; rutschhemmender Boden; Hubhilfen.', o: 'Reinigung, Störungsbehebung, Entleerung, Glasbruch regeln.', p: 'Schnittschutzhandschuhe, Schuhe, Unterweisung.' },
    SCHERBEN: { src: ['arbschg4', 'betrsichv6', 'en388', 'psabv'], explain: 'Scherben sind mit Hilfsmitteln (Kehrschaufel, Zange), nicht mit bloßen Händen aufzunehmen und in bruchsicheren Behältern zu entsorgen.', t: 'Kehrschaufel, Zange, bruchsichere Behälter.', o: 'Meldewege und Zuständigkeit für Glasbruch festlegen.', p: 'Schnittschutzhandschuhe und feste Schuhe verwenden.' },
    GAS: { src: ['trbs3145', 'trgs510', 'gefstoffv12', 'gefstoffv13', 'betrsichv6'], explain: 'Gasflaschen (insbesondere Flüssiggas) sind standsicher, vor Wärme und Beschädigung geschützt, getrennt nach voll und leer und mit geschlossenen Ventilen zu lagern. Mengen und Lagerort richten sich nach der Gefährdungsbeurteilung.', t: 'Standsicherung, Schutzkappen, Lüftung, Zündquellen fernhalten.', o: 'Lagermenge, Abgabe, Rücknahme, Notfallregeln festlegen.', p: 'Zu Handhabung und Notfall unterweisen.' },
    ARZT: { src: ['asig', 'dguv1_19', 'arbschg11', 'arbmedvv3', 'arbmedvv45'], explain: 'Betriebsarzt und Fachkraft für Arbeitssicherheit sind zu bestellen. Arbeitsmedizinische Vorsorge ist je nach Tätigkeit als Pflicht-, Angebots- oder Wunschvorsorge zu veranlassen bzw. anzubieten und zu dokumentieren (Vorsorgekartei); Vorsorge ist keine Eignungsuntersuchung.', t: 'Nicht zutreffend.', o: 'Betreuungsvertrag, Vorsorgeplanung, Vorsorgekartei, Wunschvorsorge bekannt machen.', p: 'Beschäftigte über Vorsorgeangebote informieren.' },
    RAUCH: { src: ['arbstaettv5', 'as42', 'asra42_4', 'as22', 'asra22_5'], explain: 'Nichtraucher sind in Arbeitsräumen vor Tabakrauch zu schützen. Rauchverbote sind zu kennzeichnen und durchzusetzen; in Bereichen mit Brandgefährdung gilt Rauchverbot.', t: 'Raucherbereiche außerhalb der Gebäude oder separate belüftete Räume.', o: 'Rauchverbote, Raucherbereiche, Kennzeichnung regeln.', p: 'Beschäftigte informieren.' },
    KAELTE: { src: ['arbschg4', 'arbschg5', 'en342', 'en511', 'asra35'], explain: 'Kältearbeit (Kühl- und Tiefkühlbereiche) erfordert Schutz vor Auskühlung: Kälteschutzkleidung, Aufwärmpausen und Begrenzung der Aufenthaltsdauer. Eine ausdrückliche Pflichtvorsorge für Kältearbeit gibt es nicht, Wunschvorsorge ist anzubieten.', t: 'Kontakt zu kalten Flächen vermeiden; Zeitbegrenzung durch Technik.', o: 'Aufenthaltsdauer und Wärmepausen festlegen; Alleinarbeit regeln.', p: 'Kälteschutz bereitstellen; Unterweisung.' },
    CO2: { src: ['betrsichv3', 'betrsichv6', 'betrsichv10', 'betrsichv14', 'en378', 'trgs900', 'trbs1201'], explain: 'CO₂-Kälteanlagen können bei Leckage gesundheitsgefährdende Konzentrationen bilden (AGW siehe TRGS 900). Detektion, Alarmierung, Lüftung und Zugangsregelung sind festzulegen; Prüfungen erfolgen durch befähigte Personen.', t: 'CO₂-Warngerät mit Alarm, Lüftung, Absaugung im Maschinenraum.', o: 'Zugang nur für Beauftragte, Notfallplan, Wartungsverträge, Prüfung.', p: 'Unterweisung zu Gefahren und Verhalten bei Alarm.' },
    RAMPE: { src: ['as110', 'as21', 'asra21_5', 'asra18_5', 'dguv68_17', 'betrsichv6'], explain: 'Laderampen müssen gegen Absturz gesichert, tragfähig und ohne Spalte oder Stufen zum Fahrzeug begehbar sein. Rampenkanten sind kenntlich zu machen, wo kein Geländer möglich ist (Absturzsicherung nur dort entbehrlich, wo es der Betrieb nicht zulässt; Ersatzmaßnahmen festlegen).', t: 'Geländer bzw. Absturzsicherung, Kantenmarkierung, Überladebrücken, Anfahrpuffer, Fahrzeugsicherung (Unterlegkeile, Torverriegelung).', o: 'Be- und Entladeablauf, Absprachen mit Fahrpersonal, Zugangsregelung festlegen.', p: 'Beschäftigte zu Absturz-, Quetsch- und Rangiergefahren unterweisen.' },
    FAHRZEUG: { src: ['as18', 'asra18_5', 'as110', 'dguv68_17', 'dguv70', 'betrsichv14'], explain: 'Rangierende und haltende Fahrzeuge gefährden Beschäftigte durch Anfahren, Wegrollen und Quetschen. Verkehr, Fußgänger und Ladetätigkeit sind zu trennen bzw. abzustimmen; Ladebordwände sind Arbeitsmittel mit Prüfpflicht.', t: 'Getrennte Fußgängerwege, Warnsignale, Spiegel, Fahrzeugsicherung, geprüfte Ladebordwand.', o: 'Anlieferregeln, Einweisung von Fahrpersonal, Verkehrsregelung, Absprachen vor dem Entladen.', p: 'Beschäftigte zu Verhalten im Fahrzeugverkehr unterweisen; Warnkleidung, wo erforderlich.' },
    WINTER: { src: ['as18', 'asra18_5', 'as15', 'asra15_6', 'arbschg4'], explain: 'Bei Schnee und Eis müssen Verkehrswege, Zugänge und Rampen geräumt und abgestreut sein; die Verantwortlichen und Zeiten für den Winterdienst sind festzulegen.', t: 'Beheizte Flächen, Überdachung, rutschhemmende Beläge.', o: 'Winterdienstplan mit Zuständigkeit, Kontrollzeiten und Streumittel.', p: 'Geeignetes rutschhemmendes Schuhwerk; Meldung von Glätte.' },
    REIN: { src: ['arbschg4', 'arbschg5', 'gefstoffv6', 'gefstoffv14', 'betrsichv10', 'asra15_8'], explain: 'Reinigungs- und Desinfektionsarbeiten sind eigene Arbeitsphasen: Maschinen vor dem Reinigen stillsetzen, Reinigungsmittel nach Betriebsanweisung verwenden, Boden und Nassbereiche sicher reinigen.', t: 'Geeignete Reinigungsgeräte, Dosiersysteme, abnehmbare Teile, Absperrung nasser Bereiche.', o: 'Reinigungsplan mit Zuständigkeit, Reihenfolge und Mitteln; Betriebsanweisungen.', p: 'Reinigung und Mittel unterweisen; Hautschutz, Schutzbrille, Handschuhe.' },
    ERGO: { src: ['as31', 'as33', 'lasthandhabv2', 'leitmerkmal', 'arbschg4'], explain: 'Arbeitshöhen, Greifräume, Steharbeit und wiederholte Bewegungen sind nach Ergonomiegrundsätzen zu gestalten; einseitige Belastung ist durch Wechsel und Hilfsmittel zu verringern.', t: 'Höhenverstellbare Flächen, Anti-Ermüdungsmatten, Greifhilfen.', o: 'Arbeitswechsel, Pausen, Rotation.', p: 'Ergonomisches Arbeiten unterweisen.' },
    KAELTEANLAGE: { src: ['betrsichv3', 'betrsichv6', 'betrsichv10', 'betrsichv14', 'en378', 'trbs1201'], explain: 'Kälteanlagen sind Arbeitsmittel und teilweise Druckanlagen: Betrieb, Wartung, Dichtheitsprüfung und Prüfungen sind nach Gefährdungsbeurteilung zu regeln; Eingriffe nur durch Fachkundige.', t: 'Leckageüberwachung, Maschinenraumbelüftung, Warneinrichtungen.', o: 'Wartungsvertrag, Prüffristen, Zutritt, Notfallplan.', p: 'Beschäftigte zu Verhalten bei Störung oder Leckage unterweisen.' },
    FUSS: { src: ['psabv', 'dguv1_29', 'dguv1_30', 'dguv1_31', 'en20345', 'dguv112_191', 'asra15_6'], explain: 'Fußschutz richtet sich nach der Gefährdung: Rutschen (Schuhe mit geprüfter Rutschhemmung), Quetschen und Herabfallen (Zehenschutz), Durchtritt (durchtrittsichere Sohle), Nässe und Kälte. Schuhe sind kostenlos bereitzustellen, passend, sauber und intakt.', t: 'Zuerst Bodenbelag und Verkehrswege verbessern; Fußschutz ergänzt.', o: 'Schuhauswahl nach Gefährdungsbeurteilung, Ersatz bei Verschleiß, Reinigung und Bereitstellung festlegen.', p: 'Tragepflicht unterweisen; Passform und Tragekomfort berücksichtigen.' },
    SOZIAL_BF: { src: ['asrv3a2', 'as41', 'asra41_5', 'arbschg10', 'arbstaettv3a'], explain: 'Barrierefreie Sanitärräume brauchen eine funktionierende Notrufeinrichtung, die an eine ständig besetzte Stelle weitergeleitet wird; Funktion regelmäßig prüfen, Notentriegelung sicherstellen.', t: 'Notruf mit Weiterleitung, Notentriegelung der Tür, ausreichende Bewegungsflächen.', o: 'Funktionsprüfung, Zuständigkeit für Alarmreaktion, Unterweisung festlegen.', p: 'Beschäftigte zum Alarmverhalten unterweisen.' },
    MESSER: { src: ['arbschg4', 'betrsichv6', 'dguv110_011', 'en13998', 'en388', 'dguv1_4'], explain: 'Handmesser sind scharf, gepflegt und für die Tätigkeit geeignet zu benutzen; Schnittrichtung, Werkstückführung und Ablage sind Hauptursachen für Schnittverletzungen.', t: 'Geeignete Messer, Schnittschutzhandschuh, Ringgeflecht-Schürze, sichere Ablage, Werkstückhalter.', o: 'Messer-Management (Schärfen, Ablage, Transport) festlegen.', p: 'Schnitttechnik unterweisen; Schnittschutz tragen.' },
    PSYCH: { src: ['arbschg5psy', 'arbschg5', 'gdapsy', 'iso10075', 'arbzg'], explain: 'Psychische Belastung wird anhand der Arbeitsbedingungen beurteilt (Arbeitsinhalt, Arbeitsorganisation, soziale Beziehungen, Arbeitsumgebung, neue Arbeitsformen), nicht anhand von Eigenschaften einzelner Personen.', t: 'Arbeitsumgebung (Lärm, Klima, Ergonomie) und Arbeitsmittel verbessern.', o: 'Arbeitsmenge, Personalbedarf, Pausen, Zuständigkeiten, Information und Konfliktregeln gestalten.', p: 'Führungskräfte und Beschäftigte zu Unterstützungswegen informieren.' },
    SOZIAL: { src: ['as41', 'asra41_5', 'as42', 'asra42_4', 'lmhyg'], explain: 'Toiletten, Waschgelegenheiten und Umkleiden müssen vorhanden, getrennt nutzbar, sauber und ausgestattet sein.', t: 'Ausstattung, Lüftung, Beleuchtung, Warmwasser.', o: 'Reinigungsplan, Mängelmeldung.', p: 'Hygieneregeln vermitteln.' },
    PAUSE: { src: ['as42', 'asra42_4', 'arbzg', 'as35', 'as36'], explain: 'Ein Pausenraum ist bereitzustellen, wenn mehr als zehn Beschäftigte arbeiten oder Sicherheits- und Gesundheitsgründe es erfordern; sonst genügt ein geeigneter Pausenbereich. Er muss ausreichend groß, sauber, klimatisiert und nutzbar sein.', t: 'Sitzplätze, Tische, Trinkwasser, Lüftung, Beleuchtung.', o: 'Pausenregelung und Dienstplan.', p: 'Information zur Pausennutzung.' },
    FREMD: { src: ['arbschg8', 'dguv1_6', 'dguv1_5', 'betrsichv13', 'gefstoffv15'], explain: 'Bei Arbeiten mehrerer Firmen im selben Betrieb müssen sich die Arbeitgeber über Gefährdungen abstimmen und einen Koordinator benennen; Fremdfirmen sind einzuweisen.', t: 'Gefahrenbereiche absperren und kennzeichnen.', o: 'Einweisung, Ansprechpartner, schriftliche Abstimmung, Zutrittsregelung.', p: 'Fremdfirmen unterweisen lassen und Nachweis führen.' },
    LAERM: { src: ['as37', 'asra37', 'arbschg5'], explain: 'Lärm ist zu ermitteln und zu minimieren; ab 80 dB(A) ist Gehörschutz bereitzustellen, ab 85 dB(A) zu tragen.', t: 'Leise Arbeitsmittel, Dämmung, Abschirmung.', o: 'Lärmbereiche kennzeichnen, Arbeitszeit begrenzen.', p: 'Gehörschutz bereitstellen und unterweisen.' },
    ALLEIN: { src: ['dguv1_8', 'pna', 'arbschg5', 'arbschg10'], explain: 'Bei Alleinarbeit ist sicherzustellen, dass Hilfe im Notfall rechtzeitig kommt (z. B. Personen-Notsignal-Anlage, Kontaktintervalle).', t: 'Personen-Notsignalgerät, Notruf, Innenentriegelung.', o: 'Alleinarbeit vermeiden oder organisieren; Kontaktregeln.', p: 'Verhalten bei Notlagen unterweisen.' },
    SONST: { src: ['arbschg5', 'arbschg4', 'arbschg8', 'muschg9'], explain: 'Weitere Gefährdungen, besonders schutzbedürftige Personengruppen (Jugendliche, werdende Mütter, Menschen mit Einschränkungen) und Zusammenarbeit mit Fremdfirmen sind zu berücksichtigen.', t: 'Arbeitsplatz anpassen.', o: 'Besondere Regeln für Personengruppen festlegen.', p: 'Gezielt unterweisen.' },
    VERKAUF: { src: ['as18', 'asra18_5', 'as15', 'asra15_6', 'as23', 'asra23_4'], explain: 'Verkaufsräume müssen sichere Verkehrswege und Fluchtwege auch bei Warenpräsentation, Kundenandrang und Aktionsflächen behalten.', t: 'Gangbreiten, Beleuchtung, Anfahrschutz, Bodenbelag.', o: 'Platzierung von Aktionsware und Paletten regeln; Kontrollgänge.', p: 'Beschäftigte zu Freihaltung und Meldung unterweisen.' },
    TECHRAUM: { src: ['arbstaettv3a', 'as18', 'as22', 'asra22_5', 'dguv3', 'betrsichv6', 'arbschg8'], explain: 'Technikräume (Elektro, Heizung, Kälte) dürfen nur befugte Personen betreten; sie müssen frei von Lagergut, brandsicher und gut zugänglich sein.', t: 'Zugang sichern, Beleuchtung, Lüftung, Brandschutz.', o: 'Zutritt und Freihaltung regeln, Fremdfirmen einweisen.', p: 'Befugte unterweisen.' },
    BUERO: { src: ['as31', 'as33', 'as34', 'as6', 'asra6', 'dguv215_410'], explain: 'Büro- und Kassenbüroarbeitsplätze müssen ergonomisch, ausreichend beleuchtet und sicher eingerichtet sein.', t: 'Möbel, Beleuchtung, Kabelführung.', o: 'Ordnung, Zutrittsregelung.', p: 'Ergonomie unterweisen.' },
    HYGIENE: { src: ['lmhyg', 'gefstoffv8', 'arbschg4'], explain: 'Hygiene und Arbeitsschutz greifen ineinander: Reinigungsmittel, Handhygiene und Lebensmittelsicherheit sind gemeinsam zu betrachten.', t: 'Geeignete Einrichtungen und Mittel.', o: 'Hygieneplan.', p: 'Unterweisen.' }
  };

  // Modul -> Standardkategorie
  const MOD = {
    org: 'ORG', auftrag: 'AUFTRAG', erstehilfe: 'EH', mutterschutz: 'MUSCHG', feuerwerk: 'FEUERWERK', brandschutz: 'BRAND',
    arbeitsplatz: 'ARBPL', beleuchtung: 'LICHT', raumklima: 'KLIMA', flucht: 'FLUCHT', koerper: 'KOERPER', unterweisung: 'UNTERW',
    sonstiges: 'SONST', verkaufsstelle: 'VERKAUF', verkehr: 'VERKEHR', maschinen: 'M_BEST', mechanik: 'MECH', bewegte: 'BEWEGT',
    oberflaechen: 'OBERFL', kassen: 'KASSE', zahlung: 'GELD', diebstahl: 'DIEBSTAHL', raub: 'GELD', hautbelastung: 'HAUT',
    sensibil: 'SENSI', notfall: 'NOTFALL', leitern: 'LEITER', psa: 'PSA', lager_allg: 'LAGER', transport: 'TRANSPORT', ffz: 'FFZ',
    stapler: 'FFZ', presscontainer: 'PRESS', leergutshop: 'LEERGUT', leergutrueck: 'LEERGUT', regale: 'REGAL', scherben: 'SCHERBEN',
    gasverkauf: 'GAS', betriebsarzt: 'ARZT', hautschutz: 'HAUT', rauchverbot: 'RAUCH', nichtraucher: 'RAUCH',
    pause: 'PAUSE', sozial: 'SOZIAL', fuss: 'PSA', treppe: 'TREPPE', technik: 'TECHRAUM', heiz: 'TECHRAUM', buero: 'BUERO',
    kassenbuero: 'BUERO', bildschirm: 'KASSE', fuehrung: 'PSYCH', gewuerz: 'GEFSTOFF', reinigung: 'GEFSTOFF', boden: 'BODEN',
    co2: 'CO2', co2zusatz: 'CO2', rolltor: 'TOR', automatiktuer: 'TOR', fremdfirmen: 'FREMD', psychische_belastungen: 'PSYCH',
    hackklotz: 'MESSER', messer_schleif: 'MESSER', hm: 'MESSER',
    fw: 'M_BEST', kutter: 'M_BEST', band: 'M_BEST', dixi: 'M_BEST', leihpresse: 'M_BEST', aufschnitt: 'M_BEST', fueller: 'M_BEST',
    vakuum: 'M_BEST', orange: 'M_BEST', reinigungsmaschine: 'M_BEST', braeter: 'M_BEST', ofen_fleisch: 'M_BEST', ofen_brot: 'M_BEST',
    fleischtheke: 'M_BEST', heissetheke: 'M_BEST', abhol: 'AREA'
  };
  const MACHINE = new Set(['fw', 'kutter', 'band', 'dixi', 'leihpresse', 'aufschnitt', 'fueller', 'vakuum', 'orange', 'reinigungsmaschine',
    'braeter', 'ofen_fleisch', 'ofen_brot', 'fleischtheke', 'heissetheke', 'co2', 'co2zusatz', 'rolltor', 'automatiktuer', 'presscontainer']);

  // Themen, die für Maschinen gelten (Regeln werden der Reihe nach geprüft)
  const MACHINE_TOPICS = [
    [/^unterweis/i, 'M_UNT'],
    [/psa|handschutz/i, 'PSA'],
    [/boden|rutsch/i, 'BODEN'],
    [/^ergonomie/i, 'ERGO'],
    [/^beleuchtung/i, 'LICHT'],
    [/^scherben/i, 'SCHERBEN'],
    [/^kundenbereich/i, 'OBERFL'],
    [/reinigungsmittel/i, 'GEFSTOFF'],
    [/^(reinigung|maschinenreinigung|reinigen)/i, 'M_REIN'],
    [/^(störung|stoerung)/i, 'M_STOER'],
    [/stillsetzen|unbeabsichtigter anlauf|wiederanlauf|^energie|messerwechsel/i, 'M_ENERGIE'],
    [/prüfung|instandhaltung|wartung|funktionskontrolle|mängel|zusammenbau/i, 'M_PRUEF'],
    [/elektr/i, 'ELEKTRIK'],
    [/heiße oberfl|verbrenn|dampf|spritzer|heißes gargut|heiße speisen/i, 'OBERFL'],
    [/beschicken|nachschieben|bedienung|normalbetrieb|bedienelemente|entnahme|entleeren|zerlegen/i, 'M_BED'],
    [/berechtigung|betriebsanweisung/i, 'M_BEAUFTR'],
    [/eingreifen|schutz|verriegelung|deckel|tür|klappe|quetsch|scher|schneid|abdeckung|manipulation|einzug|draht/i, 'M_SCHUTZ'],
    [/kältemittel|kühlung|temperatur/i, 'M_BEST']
  ];

  // Themen, die in allen Modulen gleich zugeordnet werden
  const COMMON_TOPICS = [
    [/^beleuchtung|blendung/i, 'LICHT'],
    [/^(kälte|kontaktkälte|kälteschutz)/i, 'KAELTE'],
    [/^(lüftung|raumklima)/i, 'KLIMA'],
    [/^verkehrswege/i, 'VERKEHR'],
    [/^(rutschen|rutschhemmung|nässe|stolpern|rutschgefahr)/i, 'BODEN'],
    [/^(aufstiegshilfen|tritte|leiter)/i, 'LEITER'],
    [/^(heben|ziehen|körperhaltung|lasten handhaben)/i, 'KOERPER'],
    [/^lärm/i, 'LAERM'],
    [/^(alleinarbeit)/i, 'ALLEIN'],
    [/^(fluchtwege|fluchtwegfunktion)/i, 'FLUCHT'],
    [/^brandschutz/i, 'BRAND'],
    [/^(elektrik|elektrische)/i, 'ELEKTRIK'],
    [/^hautkontakt/i, 'HAUT'],
    [/^(gefahrstoffe|reinigungsmittel|augenkontakt|umfüllen|gelagerte stoffe)/i, 'GEFSTOFF'],
    [/^bewegte teile/i, 'MECH'],
    [/^(fremdfirmen)/i, 'FREMD'],
    [/^(brandgefährdungen|brandlasten)/i, 'BRAND'],
    [/^(kabel|elektrische geräte)/i, 'ELEKTRIK'],
    [/^regale und ablagen/i, 'REGAL'],
    [/^(notfallmaßnahmen)/i, 'NOTFALL'],
    [/^(haut|hautbelastung)/i, 'HAUT'],
    [/^psa/i, 'PSA'],
    [/^(handmesser|schneidrichtung|schnitt- und stichschutz|schärfen|messerauswahl|messerzustand)/i, 'MESSER'],
    [/^(flurförderzeuge)/i, 'FFZ'],
    [/^(hitze|heiße oberflächen|verbrennungsgefahr)/i, 'OBERFL'],
    [/^(alarmierung|notfall)/i, 'NOTFALL'],
    [/^hygiene/i, 'HYGIENE'],
    [/^(unterweisung)/i, 'UNTERW']
  ];


  // Bereichs-Module (Themen werden einzeln zugeordnet)
  const AREA_MODS = new Set(['og', 'kt', 'wv', 'swk', 'metz', 'zerl', 'kuehl', 'back', 'aufb', 'lager', 'wa', 'rampe', 'abhol']);
  const AREA_TOPICS = [
    [/^(verpackungen|schneiden|öffnen|cutter|messer|schnittschutz|werkstück|transport$|schnitt)/i, 'MESSER'],
    [/^(eis|kondens|verunreinigungen|fußboden|temperaturwechsel eis)/i, 'BODEN'],
    [/^(aufwärmen|temperaturwechsel)/i, 'KAELTE'],
    [/^(kundenverkehr|kundenbereich)/i, 'VERKAUF'],
    [/^(scherben|beschädigte ware)/i, 'SCHERBEN'],
    [/^verdorbene ware/i, 'HYGIENE'],
    [/^(lasten|belastung)/i, 'KOERPER'],
    [/^(ergonomie|arbeitsplatz)/i, 'ERGO'],
    [/^(herabfallen)/i, 'BEWEGT'],
    [/^(lagerung|lagerordnung|stapeln|beladung|ordnung|ladeeinheiten|entladen)/i, 'LAGER'],
    [/^(regale|regalschäden)/i, 'REGAL'],
    [/^(handhubwagen|transportmittel|transportwege|rollbehälter)/i, 'TRANSPORT'],
    [/^(quetschen)/i, 'MECH'],
    [/^warenhandling/i, 'KOERPER'],
    [/^abstellen/i, 'VERKEHR'],
    [/^(türen|tore)/i, 'TOR'],
    [/^(absturz)/i, 'TREPPE'],
    [/^(übergang|tragfähigkeit)/i, 'RAMPE'],
    [/^(fahrzeug|rangieren|fußverkehr|anlieferfahrzeug|ladebordwand|kommunikation)/i, 'FAHRZEUG'],
    [/^(witterung|winterdienst)/i, 'WINTER'],
    [/^(reinigung|maschinenreinigung)/i, 'REIN'],
    [/^(aufschnittmaschine|maschinen|arbeitsmittel|aufstellung|zeitdruck|bandsäge)/i, 'M_BEST'],
    [/^(schutzeinrichtungen)/i, 'M_SCHUTZ'],
    [/^(störung|störungen)/i, 'M_STOER'],
    [/^(instandhaltung)/i, 'M_ENERGIE'],
    [/^(prüfungen|wartung)/i, 'M_PRUEF'],
    [/^(beschicken|entnehmen|hilfsmittel)/i, 'M_BED'],
    [/^(oberflächen|dampf)/i, 'OBERFL'],
    [/^brand$/i, 'BRAND'],
    [/^kälteanlage/i, 'KAELTEANLAGE'],
    [/^(organisation|arbeitsorganisation|arbeitsabläufe)/i, 'PSYCH'],
    [/^hautschutz/i, 'HAUT']
  ];

  // Modulspezifische Ausnahmen: [Modul, Themen-Regex, Kategorie]
  const MOD_TOPICS = [
    ['kassen', /ergonomie|arbeitsplatz|sitz|kassenarbeitsplatz/i, 'KASSE'],
    ['kassen', /arbeitsorganisation/i, 'PSYCH'],
    ['kt', /^ergonomie/i, 'KOERPER'],
    ['kuehl', /alarmierung|alleinarbeit|verlassen|zugang|störung/i, 'ALLEIN'],
    ['kuehl', /^türen/i, 'TOR'],
    ['kuehl', /^kälteanlage/i, 'KAELTEANLAGE'],
    ['arbeitsplatz', /psychische/i, 'PSYCH'],
    ['sozial', /barrierefrei/i, 'SOZIAL_BF'],
    ['sozial', /^(hygiene|toiletten|waschen|umkleide|kleidung|trocknen|privatsphäre|mängel|zugang)/i, 'SOZIAL'],
    ['heiz', /lüftung|brennstoff/i, 'TECHRAUM'],
    ['technik', /lüftung|sicherer zugang|wartung|störungen|gelagerte stoffe/i, 'TECHRAUM'],
    ['kassenbuero', /aufbewahrung|geldübergabe|überfall|alarmierung|zutritt/i, 'GELD'],
    ['kassenbuero', /alleinarbeit/i, 'ALLEIN'],
    ['kassenbuero', /bildschirm/i, 'KASSE'],
    ['buero', /ergonomie/i, 'ERGO'],
    ['reinigung', /rutsch/i, 'BODEN'],
    ['reinigung', /arbeitsorganisation/i, 'REIN'],
    ['reinigung', /reinigungsgeräte/i, 'M_BEST'],
    ['gewuerz', /^reinigung|verschüttungen/i, 'REIN'],
    ['gewuerz', /^hygiene/i, 'HYGIENE'],
    ['gewuerz', /sensibilisierung/i, 'SENSI'],
    ['gewuerz', /hautkontakt/i, 'HAUT'],
    ['gewuerz', /arbeitsplatzlüftung/i, 'GEFSTOFF'],
    ['pause', /nichtraucher/i, 'RAUCH'],
    ['abhol', /^(kommissionieren|sortieren)/i, 'KOERPER'],
    ['abhol', /^trockenlagerung/i, 'LAGER'],
    ['abhol', /kühlware|tiefkühlware/i, 'KAELTE'],
    ['abhol', /^(abholfächer|befüllen)/i, 'M_BED'],
    ['abhol', /^kundenübergabe/i, 'VERKAUF'],
    ['abhol', /^(zahlungsmittel|bargeld)/i, 'GELD'],
    ['abhol', /^nichtabholung/i, 'HYGIENE'],
    ['stapler', /beauftragung|eignung|fahrer/i, 'FFZ'],
    ['fuss', /.*/, 'FUSS'],
    ['bildschirm', /.*/, 'KASSE'],
    ['leergutrueck', /rücknahmeautomat|störung|reinigung/i, 'M_BEST'],
    ['sozial', /hygiene/i, 'SOZIAL']
  ];

  // Module mit einem einzigen Themenfeld: alle Fragen gehören zur Standardkategorie
  const SINGLE = new Set(['org', 'auftrag', 'erstehilfe', 'mutterschutz', 'feuerwerk', 'brandschutz', 'beleuchtung', 'raumklima', 'flucht',
    'koerper', 'unterweisung', 'sonstiges', 'verkaufsstelle', 'verkehr', 'maschinen', 'mechanik', 'bewegte', 'oberflaechen', 'zahlung',
    'diebstahl', 'raub', 'hautbelastung', 'sensibil', 'notfall', 'leitern', 'psa', 'lager_allg', 'transport', 'ffz', 'stapler',
    'presscontainer', 'leergutshop', 'leergutrueck', 'regale', 'scherben', 'gasverkauf', 'betriebsarzt', 'hautschutz', 'rauchverbot',
    'nichtraucher', 'fuehrung', 'psychische_belastungen', 'rolltor', 'automatiktuer', 'co2', 'co2zusatz', 'fremdfirmen', 'hm',
    'hackklotz', 'messer_schleif', 'boden', 'fuss', 'bildschirm', 'arbeitsplatz']);

  function catFor(moduleId, topic) {
    const t = String(topic || '');
    for (const [m, rx, c] of MOD_TOPICS) if (m === moduleId && rx.test(t)) return c;
    if (MACHINE.has(moduleId) && !SINGLE.has(moduleId)) {
      for (const [rx, c] of MACHINE_TOPICS) if (rx.test(t)) return c;
    }
    if (SINGLE.has(moduleId)) return MOD[moduleId] || 'AREA';
    if (AREA_MODS.has(moduleId)) {
      if (moduleId === 'kt' && /^organisation/i.test(t)) return 'UNTERW';
      for (const [rx, c] of COMMON_TOPICS) if (rx.test(t)) return c;
      for (const [rx, c] of AREA_TOPICS) if (rx.test(t)) return c;
      return MOD[moduleId] || 'AREA';
    }
    if (MACHINE.has(moduleId)) return MOD[moduleId] || 'M_BEST';
    for (const [rx, c] of COMMON_TOPICS) if (rx.test(t)) return c;
    return MOD[moduleId] || 'AREA';
  }

  function fmtSource(key) {
    const s = SRC[key];
    if (!s) return null;
    return { norm: s[0], gloss: s[1], checked: !!s[2] };
  }

  function sourcesFor(cat) {
    return (CAT[cat] ? CAT[cat].src : []).map(fmtSource).filter(Boolean);
  }

  // q = [id, topic, text]; moduleId optional (Fallback: Präfix des Frage-IDs wird nicht verwendet)
  let QMOD = null;
  function moduleOf(qid) {
    if (!QMOD) {
      QMOD = {};
      const Q = (window.GBO_DATA && window.GBO_DATA.questions) || {};
      Object.keys(Q).forEach(m => Q[m].forEach(x => { QMOD[x[0]] = m; }));
    }
    return QMOD[qid];
  }

  function describe(q, moduleId) {
    const cat = catFor(moduleId || moduleOf(q[0]), q[1]);
    const c = CAT[cat] || CAT.AREA;
    const list = sourcesFor(cat);
    const line = x => x.norm + (x.checked ? '' : ' (Abschnitt prüfen)');
    return {
      cat,
      sourceList: list,
      source: list.map(line).join('; '),
      explain: c.explain || DEF.explain,
      technical: c.t || DEF.t,
      organisational: c.o || DEF.o,
      personal: c.p || DEF.p,
      effective: c.e || DEF.e
    };
  }

  window.GBOSources = { SRC, CAT, MOD, catFor, sourcesFor, describe, fmtSource, moduleOf };
})();
