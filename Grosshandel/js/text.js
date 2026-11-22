// ===== Großhandel Begehung – vordefinierte Maßnahmen-Texte je Prüfpunkt, in drei Sprachstilen =====
// Erstfassung Rev. 1.0 (20.11.2026), erzeugt aus tools/katalog*.py.
// einfach    = Alltagssprache ohne Paragraphen, für Mitarbeitende ohne Fachhintergrund
// bghw       = branchenspezifische Terminologie mit konkreten DGUV-/ASR-/DIN-Regelwerken
//              (die BGHW wendet DGUV- und ASR-Regelwerke für den Handel an)
// rechtlich  = konkrete gesetzliche Rechtsgrundlagen; technische Regeln nur dort,
//              wo sie die gesetzlichen Schutzziele konkretisieren.
// Hinweis: DGUV-Regeln und DGUV-Informationen konkretisieren die Umsetzung; sie sind
// nicht mit staatlichen Rechtsvorschriften gleichzusetzen. Feste Fristen und Zahlenwerte
// vor dem Produktiveinsatz fachlich gegenprüfen (Stand der Regelwerke ändert sich).
//
// Offizielle Quellen:
// https://www.bghw.de/arbeitsschutz/
// https://publikationen.dguv.de/
// https://www.baua.de/DE/Angebote/Regelwerk/ASR/ASR
// https://www.gesetze-im-internet.de/

const MEASURE_SOURCES = {
    bghw: [
        'DGUV Vorschrift 1 – Grundsätze der Prävention',
        'DGUV Vorschrift 2 – Betriebsärzte und Fachkräfte für Arbeitssicherheit',
        'DGUV Vorschrift 3 – Elektrische Anlagen und Betriebsmittel',
        'DGUV Vorschrift 68 – Flurförderzeuge',
        'DGUV Vorschrift 70 – Fahrzeuge',
        'DGUV Grundsatz 308-001 – Ausbildung und Beauftragung der Fahrer von Flurförderzeugen mit Fahrersitz und Fahrerstand',
        'DGUV Grundsatz 312-906 – Auswahl, Ausbildung und Befähigungsnachweis von Sachkundigen für persönliche Schutzausrüstung gegen Absturz',
        'DGUV Regel 110-010 – Verwendung von Flüssiggas',
        'DGUV Regel 112-139 – Einsatz von Personen-Notsignal-Anlagen',
        'DGUV Regel 112-189 – Benutzung von Schutzkleidung',
        'DGUV Regel 112-191 – Benutzung von Fuß- und Knieschutz',
        'DGUV Regel 112-195 – Benutzung von Schutzhandschuhen',
        'DGUV Regel 112-198 – Benutzung von persönlichen Schutzausrüstungen gegen Absturz',
        'DGUV Information 204-020 – Dokumentation der Erste-Hilfe-Leistungen',
        'DGUV Information 204-022 – Erste Hilfe im Betrieb',
        'DGUV Information 205-023 – Brandschutzhelfer',
        'DGUV Information 208-016 – Handlungsanleitung für den Umgang mit Leitern und Tritten',
        'DGUV Information 208-061 – Lagereinrichtungen und Ladungsträger',
        'DIN EN 15635 – Ortsfeste Regalsysteme aus Stahl, Nutzung und Instandhaltung',
        'DIN EN 528 – Regalbediengeräte, Sicherheitsanforderungen',
        'DIN EN 1398 – Ladebrücken, Sicherheitsanforderungen',
        'DIN EN 13241 – Tore, Produktnorm',
        'DIN EN 16500 – Vertikale Ballenpressen, Sicherheitsanforderungen',
        'DIN EN 378 – Kälteanlagen und Wärmepumpen, sicherheitstechnische Anforderungen',
        'DIN EN IEC 62485-3 – Sicherheitsanforderungen an Batterien und Batterieanlagen, Traktionsbatterien',
        'DIN 33403-5 – Klima am Arbeitsplatz, ergonomische Gestaltung von Kältearbeitsplätzen',
        'DIN 14406-4 – Tragbare Feuerlöscher, Instandhaltung',
        'DIN 14096 – Brandschutzordnung',
        'DIN 14677 – Instandhaltung von elektrisch gesteuerten Feststellanlagen',
        'DIN EN 50172 / DIN V VDE V 0108-100 – Sicherheitsbeleuchtungsanlagen',
        'DIN ISO 23601 – Flucht- und Rettungspläne',
        'VDI 2700 – Ladungssicherung auf Straßenfahrzeugen',
        'VdS 2259 – Batterieladeanlagen für Elektrofahrzeuge',
        'VdS 3103 – Lithium-Batterien',
        'VdS CEA 4001 – Sprinkleranlagen, Planung und Einbau',
        'BAuA – Leitmerkmalmethoden zur Beurteilung von Lastenhandhabungen'
    ],
    rechtsquellen: [
        'ArbSchG – insbesondere §§ 3, 4, 5, 6, 8, 10, 12, 15',
        'ArbStättV – insbesondere §§ 3, 3a, 4 sowie Anhang Nr. 1.2, 1.5, 1.7, 1.8, 1.10, 2.1, 2.2, 2.3, 3.4, 3.5, 4.1, 4.2, 4.3, 6',
        'BetrSichV – insbesondere §§ 3, 4, 5, 6, 9, 10, 12, 14, 16 sowie Anhang 1 und Anhang 2 Abschnitt 2',
        'GefStoffV – insbesondere §§ 6, 7, 8, 14',
        'ArbMedVV – insbesondere §§ 4, 5 und Anhang Teil 3 und 4',
        'ArbZG – insbesondere §§ 4, 6',
        'JArbSchG – insbesondere §§ 22, 29',
        'ASiG – insbesondere §§ 2, 5, 11',
        'SGB VII – insbesondere § 193',
        'PSA-Benutzungsverordnung – §§ 2, 3',
        'Lastenhandhabungsverordnung (LasthandhabV) – §§ 2, 3',
        'StVO – § 22 (Ladung)',
        'HGB – § 412 (Verladen)',
        'REACH-Verordnung (EG) Nr. 1907/2006 – Art. 31 (Sicherheitsdatenblätter)',
        'ASR A1.2, A1.3, A1.5, A1.7, A1.8, A2.1, A2.2, A2.3, A3.4, A3.5, A4.1, A4.2, A4.3, A6',
        'TRGS 201, TRGS 510, TRGS 555',
        'TRBS 2121-2, TRBS 3121'
    ]
};

const MEASURES_TEXT = {
    "Haupteingang und Empfang": {
        "1.1": {
            einfach: "Lassen Sie die automatischen Eingangstüren jedes Jahr prüfen und testen Sie die Sensoren.",
            bghw: "Lassen Sie kraftbetätigte Türen gemäß ASR A1.7 und DIN 18650-2 mindestens jährlich prüfen.",
            rechtlich: "Kraftbetätigte Türen sind nach ASR A1.7 vor der ersten Inbetriebnahme, nach wesentlichen Änderungen und wiederkehrend sachgerecht zu prüfen; die Prüfung ist zu dokumentieren."
        },
        "1.2": {
            einfach: "Legen Sie im Eingang ausreichend große Matten aus und wischen Sie Nässe sofort auf.",
            bghw: "Sehen Sie eine Sauberlaufzone ausreichender Länge gemäß ASR A1.5 vor.",
            rechtlich: "Fußböden müssen nach Anhang Nr. 1.5 ArbStättV rutschhemmend sein (ASR A1.5); Verunreinigungen sind unverzüglich zu beseitigen."
        },
        "1.3": {
            einfach: "Kleben Sie gut sichtbare Markierungen auf große Glasflächen, damit niemand dagegen läuft.",
            bghw: "Stellen Sie die Kennzeichnung und Bruchsicherheit von Glasflächen gemäß ASR A1.6 und ASR A1.7 sicher.",
            rechtlich: "Durchsichtige Wände und Türen müssen nach Anhang Nr. 1.5 und 1.7 ArbStättV deutlich gekennzeichnet und aus bruchsicherem Werkstoff sein oder abgeschirmt werden (ASR A1.6)."
        },
        "1.4": {
            einfach: "Richten Sie den Empfang bequem ein und schützen Sie ihn vor Zugluft.",
            bghw: "Gestalten Sie den Empfangsarbeitsplatz gemäß ASR A6 und schützen Sie ihn vor Zugluft gemäß ASR A3.5.",
            rechtlich: "Bildschirmarbeitsplätze sind nach Anhang Nr. 6 ArbStättV zu gestalten; nach Anhang Nr. 3.5 ArbStättV ist eine gesundheitlich zuträgliche Raumtemperatur ohne Zugluft sicherzustellen."
        },
        "1.5": {
            einfach: "Sorgen Sie für einen Alarmknopf am Empfang und üben Sie mit dem Personal den Umgang mit schwierigen Besuchern.",
            bghw: "Beurteilen Sie Gefährdungen durch Besucherkontakt und legen Sie Maßnahmen fest (Alarmierung, Deeskalationsschulung, Nachsorge).",
            rechtlich: "Gefährdungen durch Gewalt und psychische Belastung sind nach § 5 Abs. 3 Nr. 6 ArbSchG zu beurteilen; Notfallmaßnahmen sind nach § 10 ArbSchG festzulegen."
        },
        "1.6": {
            einfach: "Lassen Sie Besucher sich anmelden, geben Sie ihnen die Sicherheitsregeln und begleiten Sie sie ins Lager.",
            bghw: "Legen Sie eine Besucherregelung fest (Registrierung, Sicherheitshinweise, Begleitung, Warnweste im Lager).",
            rechtlich: "Nach § 8 ArbSchG und § 6 DGUV Vorschrift 1 sind betriebsfremde Personen über Gefahren zu informieren; bei Gefahr ist nach § 10 ArbSchG ein Verlassen der Arbeitsstätte für alle Anwesenden zu organisieren."
        },
        "1.7": {
            einfach: "Halten Sie den Eingangsbereich frei und kennzeichnen Sie den Weg zum Sammelplatz.",
            bghw: "Kennzeichnen Sie Fluchtwege und Sammelstelle gemäß ASR A1.3 und ASR A2.3.",
            rechtlich: "Fluchtwege und Notausgänge sind nach § 4 Abs. 4 ArbStättV freizuhalten und nach Anhang Nr. 2.3 ArbStättV zu kennzeichnen."
        },
        "1.8": {
            einfach: "Prüfen Sie, ob Rollstuhlfahrer und gehbehinderte Personen ohne Hilfe hineinkommen.",
            bghw: "Gestalten Sie Eingang und Wege gemäß ASR V3a.2 „Barrierefreie Gestaltung von Arbeitsstätten“.",
            rechtlich: "Nach § 3a Abs. 2 ArbStättV sind Arbeitsstätten barrierefrei zu gestalten, soweit Menschen mit Behinderungen beschäftigt werden (ASR V3a.2)."
        },
        "1.9": {
            einfach: "Halten Sie am Empfang Verbandkasten, Defibrillator und Notrufnummern bereit.",
            bghw: "Stellen Sie Erste-Hilfe-Einrichtungen am Empfang gemäß DGUV Information 204-022 bereit und kennzeichnen Sie sie gemäß ASR A1.3.",
            rechtlich: "Mittel zur Ersten Hilfe sind nach § 25 DGUV Vorschrift 1 leicht zugänglich bereitzuhalten; Notrufnummern sind nach § 24 Abs. 5 DGUV Vorschrift 1 auszuhängen."
        },
        "1.10": {
            einfach: "Stellen Sie den Bildschirm am Empfang so auf, dass er nicht spiegelt, und sorgen Sie für einen Sonnenschutz an der Glasfront.",
            bghw: "Richten Sie den Bildschirmarbeitsplatz am Empfang blendfrei aus und sehen Sie einen Sonnenschutz gemäß ArbStättV Anhang Nr. 6 und ASR A6 vor.",
            rechtlich: "Bildschirmarbeitsplätze sind nach § 3a ArbStättV i. V. m. Anhang Nr. 6 ArbStättV so einzurichten, dass störende Blendungen und Reflexionen vermieden werden (ASR A6)."
        },
        "1.11": {
            einfach: "Stellen Sie Bildschirm, Tastatur und Maus so ein, dass man gerade sitzt bzw. steht und den Kopf nicht verdrehen muss.",
            bghw: "Gestalten Sie die Anordnung von Bildschirm und Eingabemitteln gemäß ASR A6 (Sehabstand, Bildschirmoberkante unter Augenhöhe, Bewegungsfreiraum).",
            rechtlich: "Nach Anhang Nr. 6.1 bis 6.4 ArbStättV müssen Bildschirm und Eingabemittel ergonomisch angeordnet und an die Beschäftigten anpassbar sein."
        },
        "1.12": {
            einfach: "Sorgen Sie am Empfang für einen guten Stuhl und die Möglichkeit, auch im Stehen zu arbeiten.",
            bghw: "Stellen Sie einen ergonomischen Stuhl bereit und ermöglichen Sie Sitz-Steh-Wechsel gemäß ASR A6 und DGUV Information 215-410.",
            rechtlich: "Arbeitsplätze sind nach § 3a ArbStättV und Anhang Nr. 6 ArbStättV ergonomisch zu gestalten; ein Wechsel der Körperhaltung ist nach der Gefährdungsbeurteilung (§ 5 ArbSchG) zu ermöglichen."
        },
        "1.13": {
            einfach: "Bieten Sie dem Empfangspersonal eine Untersuchung mit Sehtest beim Betriebsarzt an und planen Sie Pausen ein.",
            bghw: "Bieten Sie die Angebotsvorsorge „Tätigkeiten an Bildschirmgeräten“ nach ArbMedVV an und organisieren Sie Mischarbeit bzw. Kurzpausen gemäß ASR A6.",
            rechtlich: "Nach § 5 ArbMedVV i. V. m. ArbMedVV Anhang Teil 4 ist Angebotsvorsorge anzubieten; nach Anhang Nr. 6.1 Abs. 2 ArbStättV ist die Bildschirmarbeit regelmäßig zu unterbrechen."
        },
        "1.14": {
            einfach: "Sorgen Sie am Empfangstresen für genug Licht ohne Blendung.",
            bghw: "Stellen Sie die Beleuchtung gemäß ASR A3.4 sicher (Büro- und Bildschirmarbeit mindestens 500 lx).",
            rechtlich: "Arbeitsplätze müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; die ASR A3.4 nennt für Bildschirmarbeit mindestens 500 lx."
        }
    },
    "Pforten und Schrankenanlagen": {
        "2.1": {
            einfach: "Sorgen Sie für einen guten Stuhl und gut angeordnete Bildschirme am Pförtnerplatz.",
            bghw: "Gestalten Sie den Arbeitsplatz gemäß ASR A6 und ArbStättV Anhang Nr. 6; bei Dauerbesetzung Stühle für 24-Stunden-Nutzung einsetzen.",
            rechtlich: "Bildschirmarbeitsplätze sind nach § 3a ArbStättV i. V. m. Anhang Nr. 6 ArbStättV ergonomisch zu gestalten."
        },
        "2.2": {
            einfach: "Sorgen Sie dafür, dass es in der Pforte weder zu kalt noch zu warm ist.",
            bghw: "Stellen Sie Raumtemperatur, Sonnenschutz und Lüftung gemäß ASR A3.5 und ASR A3.6 sicher.",
            rechtlich: "Nach Anhang Nr. 3.5 und 3.6 ArbStättV muss eine gesundheitlich zuträgliche Raumtemperatur und Atemluft vorhanden sein."
        },
        "2.3": {
            einfach: "Benutzen Sie nur geprüfte Geräte und entfernen Sie private Heizlüfter.",
            bghw: "Lassen Sie alle elektrischen Geräte gemäß DGUV Vorschrift 3 prüfen; private Geräte sind nur nach Prüfung zuzulassen.",
            rechtlich: "Elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 wiederkehrend zu prüfen; Brandgefahren sind nach § 5 ArbSchG zu beurteilen."
        },
        "2.4": {
            einfach: "Sorgen Sie dafür, dass das Pfortenpersonal im Notfall schnell Hilfe holen kann.",
            bghw: "Legen Sie für Alleinarbeit an der Pforte Überwachungsmaßnahmen fest, z. B. Personen-Notsignal-Anlage gemäß DGUV Regel 112-139.",
            rechtlich: "Nach § 8 DGUV Vorschrift 1 ist bei gefährlicher Alleinarbeit eine geeignete Überwachung sicherzustellen."
        },
        "2.5": {
            einfach: "Regeln Sie die Ablösung, damit das Pfortenpersonal Pause machen und zur Toilette gehen kann.",
            bghw: "Stellen Sie die Erreichbarkeit von Toiletten gemäß ASR A4.1 und eine Pausenablösung sicher.",
            rechtlich: "Toilettenräume sind nach Anhang Nr. 4.1 ArbStättV in der Nähe der Arbeitsplätze bereitzustellen; Ruhepausen sind nach § 4 ArbZG zu gewähren."
        },
        "2.6": {
            einfach: "Lassen Sie die Schranke jedes Jahr prüfen und testen Sie, ob sie bei Fahrzeugen und Personen stoppt.",
            bghw: "Lassen Sie Schrankenanlagen gemäß DIN EN 12453 und Herstellerangaben mindestens jährlich durch einen Sachkundigen prüfen.",
            rechtlich: "Kraftbetätigte Schranken sind Arbeitsmittel; Prüfungen sind nach § 3 Abs. 6 und § 14 BetrSichV festzulegen und aufzuzeichnen."
        },
        "2.7": {
            einfach: "Sorgen Sie für einen gut sichtbaren Schrankenbaum und einen eigenen Weg für Fußgänger.",
            bghw: "Kennzeichnen Sie die Schranke gemäß ASR A1.3 und führen Sie Fußgänger gemäß ASR A1.8 getrennt am Schrankenbereich vorbei.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV so zu gestalten, dass Fußgänger nicht durch Fahrzeuge oder Schranken gefährdet werden."
        },
        "2.8": {
            einfach: "Tragen Sie bei der Fahrzeugkontrolle eine Warnweste und stellen Sie sich nie vor oder hinter ein Fahrzeug.",
            bghw: "Legen Sie für Fahrzeugkontrollen Regeln fest (Warnkleidung, sichere Standorte, Beleuchtung) gemäß DGUV Vorschrift 70.",
            rechtlich: "Die Gefährdung durch Fahrzeugverkehr ist nach § 5 ArbSchG zu beurteilen; Warnkleidung ist nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        },
        "2.9": {
            einfach: "Halten Sie Alarmplan, Notrufnummern und Feuerwehrpläne an der Pforte bereit und erklären Sie dem Personal den Ablauf.",
            bghw: "Halten Sie Feuerwehrpläne gemäß DIN 14095 und den Alarmplan an der Pforte bereit und unterweisen Sie das Personal.",
            rechtlich: "Nach § 10 ArbSchG sind Maßnahmen für Notfälle zu treffen und Verbindungen zu Rettungsdienst und Feuerwehr herzustellen."
        },
        "2.10": {
            einfach: "Sorgen Sie für einen guten Stuhl und gut angeordnete Bildschirme am Pförtnerplatz.",
            bghw: "Gestalten Sie den Arbeitsplatz gemäß ASR A6 und ArbStättV Anhang Nr. 6; bei Dauerbesetzung Stühle für 24-Stunden-Nutzung einsetzen.",
            rechtlich: "Bildschirmarbeitsplätze sind nach § 3a ArbStättV i. V. m. Anhang Nr. 6 ArbStättV ergonomisch zu gestalten."
        },
        "2.11": {
            einfach: "Sorgen Sie dafür, dass es in der Pforte weder zu kalt noch zu warm ist.",
            bghw: "Stellen Sie Raumtemperatur, Sonnenschutz und Lüftung gemäß ASR A3.5 und ASR A3.6 sicher.",
            rechtlich: "Nach Anhang Nr. 3.5 und 3.6 ArbStättV muss eine gesundheitlich zuträgliche Raumtemperatur und Atemluft vorhanden sein."
        },
        "2.12": {
            einfach: "Benutzen Sie nur geprüfte Geräte und entfernen Sie private Heizlüfter.",
            bghw: "Lassen Sie alle elektrischen Geräte gemäß DGUV Vorschrift 3 prüfen; private Geräte sind nur nach Prüfung zuzulassen.",
            rechtlich: "Elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 wiederkehrend zu prüfen; Brandgefahren sind nach § 5 ArbSchG zu beurteilen."
        },
        "2.13": {
            einfach: "Sorgen Sie dafür, dass das Pfortenpersonal im Notfall schnell Hilfe holen kann.",
            bghw: "Legen Sie für Alleinarbeit an der Pforte Überwachungsmaßnahmen fest, z. B. Personen-Notsignal-Anlage gemäß DGUV Regel 112-139.",
            rechtlich: "Nach § 8 DGUV Vorschrift 1 ist bei gefährlicher Alleinarbeit eine geeignete Überwachung sicherzustellen."
        },
        "2.14": {
            einfach: "Regeln Sie die Ablösung, damit das Pfortenpersonal Pause machen und zur Toilette gehen kann.",
            bghw: "Stellen Sie die Erreichbarkeit von Toiletten gemäß ASR A4.1 und eine Pausenablösung sicher.",
            rechtlich: "Toilettenräume sind nach Anhang Nr. 4.1 ArbStättV in der Nähe der Arbeitsplätze bereitzustellen; Ruhepausen sind nach § 4 ArbZG zu gewähren."
        },
        "2.15": {
            einfach: "Lassen Sie die Schranke jedes Jahr prüfen und testen Sie, ob sie bei Fahrzeugen und Personen stoppt.",
            bghw: "Lassen Sie Schrankenanlagen gemäß DIN EN 12453 und Herstellerangaben mindestens jährlich durch einen Sachkundigen prüfen.",
            rechtlich: "Kraftbetätigte Schranken sind Arbeitsmittel; Prüfungen sind nach § 3 Abs. 6 und § 14 BetrSichV festzulegen und aufzuzeichnen."
        },
        "2.16": {
            einfach: "Sorgen Sie für einen gut sichtbaren Schrankenbaum und einen eigenen Weg für Fußgänger.",
            bghw: "Kennzeichnen Sie die Schranke gemäß ASR A1.3 und führen Sie Fußgänger gemäß ASR A1.8 getrennt am Schrankenbereich vorbei.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV so zu gestalten, dass Fußgänger nicht durch Fahrzeuge oder Schranken gefährdet werden."
        },
        "2.17": {
            einfach: "Tragen Sie bei der Fahrzeugkontrolle eine Warnweste und stellen Sie sich nie vor oder hinter ein Fahrzeug.",
            bghw: "Legen Sie für Fahrzeugkontrollen Regeln fest (Warnkleidung, sichere Standorte, Beleuchtung) gemäß DGUV Vorschrift 70.",
            rechtlich: "Die Gefährdung durch Fahrzeugverkehr ist nach § 5 ArbSchG zu beurteilen; Warnkleidung ist nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        },
        "2.18": {
            einfach: "Halten Sie Alarmplan, Notrufnummern und Feuerwehrpläne an der Pforte bereit und erklären Sie dem Personal den Ablauf.",
            bghw: "Halten Sie Feuerwehrpläne gemäß DIN 14095 und den Alarmplan an der Pforte bereit und unterweisen Sie das Personal.",
            rechtlich: "Nach § 10 ArbSchG sind Maßnahmen für Notfälle zu treffen und Verbindungen zu Rettungsdienst und Feuerwehr herzustellen."
        }
    },
    "Börsensaal und Veranstaltungen": {
        "3.1": {
            einfach: "Klären Sie, wie viele Personen höchstens in den Saal dürfen, und halten Sie den Bestuhlungsplan ein.",
            bghw: "Beachten Sie die Vorgaben für Versammlungsstätten (Muster-Versammlungsstättenverordnung bzw. in NRW Sonderbauverordnung) und die Baugenehmigung.",
            rechtlich: "Für Versammlungsräume mit mehr als 200 Besuchern gelten die bauordnungsrechtlichen Vorschriften für Versammlungsstätten (in NRW Sonderbauverordnung); Personenzahl und Bestuhlungspläne der Genehmigung sind einzuhalten."
        },
        "3.2": {
            einfach: "Halten Sie alle Notausgänge frei und prüfen Sie, ob die Türen leicht nach außen aufgehen.",
            bghw: "Halten Sie Rettungswege gemäß ASR A2.3 frei; bei Veranstaltungen Panikverschlüsse nach DIN EN 1125 vorsehen.",
            rechtlich: "Fluchtwege sind nach § 4 Abs. 4 ArbStättV freizuhalten; Türen im Verlauf von Fluchtwegen müssen nach Anhang Nr. 2.3 ArbStättV jederzeit leicht zu öffnen sein."
        },
        "3.3": {
            einfach: "Prüfen Sie, ob Notleuchten und grüne Fluchtwegschilder im Saal leuchten.",
            bghw: "Prüfen Sie die Sicherheitsbeleuchtung gemäß DIN EN 50172 und DIN V VDE V 0108-100.",
            rechtlich: "Sicherheitsbeleuchtung ist nach ASR A2.3 und ASR A3.4 erforderlich, wenn bei Ausfall der Allgemeinbeleuchtung das gefahrlose Verlassen nicht gewährleistet ist."
        },
        "3.4": {
            einfach: "Sichern Sie Bühnen- und Podestkanten und achten Sie auf stabile Messestände.",
            bghw: "Sichern Sie Podeste und Bühnen gegen Absturz gemäß ASR A2.1 und kennzeichnen Sie Kanten gemäß ASR A1.3.",
            rechtlich: "Absturzgefährdete Bereiche sind nach Anhang Nr. 2.1 ArbStättV zu sichern; Aufbauten müssen nach § 5 BetrSichV standsicher sein."
        },
        "3.5": {
            einfach: "Lassen Sie alles, was über Köpfen hängt, fachgerecht befestigen und prüfen.",
            bghw: "Lassen Sie Veranstaltungstechnik und hängende Lasten gemäß DGUV Vorschrift 17 bzw. DGUV Vorschrift 18 und Herstellerangaben prüfen.",
            rechtlich: "Lastaufnahme- und Tragmittel über Personen sind nach § 14 BetrSichV zu prüfen; für Veranstaltungstechnik gelten zusätzlich die DGUV Vorschriften 17 und 18."
        },
        "3.6": {
            einfach: "Verwenden Sie nur schwer entflammbare Deko und Stellwände.",
            bghw: "Verwenden Sie Dekorationen mindestens schwer entflammbar (DIN 4102-1 B1 bzw. DIN EN 13501-1) gemäß den Vorgaben für Versammlungsstätten.",
            rechtlich: "Für Versammlungsstätten schreiben die bauordnungsrechtlichen Vorschriften schwer entflammbare Ausstattungen vor; Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen."
        },
        "3.7": {
            einfach: "Erlauben Sie offene Flammen und Gasgeräte nur nach Absprache und mit Feuerlöscher.",
            bghw: "Regeln Sie Gasgeräte gemäß DGUV Regel 110-010 und offene Flammen nach Brandschutzkonzept.",
            rechtlich: "Die Verwendung von Flüssiggas erfordert nach §§ 5, 12 ArbSchG Gefährdungsbeurteilung und Unterweisung (DGUV Regel 110-010); offenes Feuer ist nach Bauordnungsrecht bzw. Brandschutzkonzept zu regeln."
        },
        "3.8": {
            einfach: "Lassen Sie Kabel und Verteiler vor der Veranstaltung prüfen und decken Sie Kabel auf dem Boden ab.",
            bghw: "Lassen Sie fliegende Bauten und provisorische Elektroinstallationen gemäß DGUV Vorschrift 3 prüfen und verlegen Sie Kabel mit Kabelbrücken.",
            rechtlich: "Elektrische Anlagen und Betriebsmittel sind nach § 5 DGUV Vorschrift 3 vor Inbetriebnahme und wiederkehrend zu prüfen; Stolperstellen sind nach ASR A1.5 zu vermeiden."
        },
        "3.9": {
            einfach: "Benennen Sie eine verantwortliche Person für Auf- und Abbau und stimmen Sie die Abläufe mit Fremdfirmen ab.",
            bghw: "Koordinieren Sie Auf- und Abbau mit Fremdfirmen gemäß DGUV Vorschrift 1 und legen Sie Verkehrsregeln für Flurförderzeuge im Saal fest.",
            rechtlich: "Bei Zusammenarbeit mehrerer Arbeitgeber ist nach § 8 ArbSchG und § 6 DGUV Vorschrift 1 zusammenzuwirken; erforderlichenfalls ist ein Koordinator zu bestimmen."
        },
        "3.10": {
            einfach: "Planen Sie für Veranstaltungen genug Ersthelfer und klären Sie, ob Feuerwehr oder Sanitätsdienst vor Ort sein muss.",
            bghw: "Legen Sie Sanitäts- und Brandsicherheitsdienst nach Größe der Veranstaltung fest (Vorgaben für Versammlungsstätten, Absprache mit Feuerwehr).",
            rechtlich: "Notfallmaßnahmen sind nach § 10 ArbSchG festzulegen; die bauordnungsrechtlichen Vorschriften für Versammlungsstätten regeln Brandsicherheitswache und Sanitätsdienst."
        },
        "3.11": {
            einfach: "Sorgen Sie bei vielen Personen für genug frische Luft.",
            bghw: "Stellen Sie die Lüftung gemäß ASR A3.6 sicher.",
            rechtlich: "Nach Anhang Nr. 3.6 ArbStättV muss ausreichend gesundheitlich zuträgliche Atemluft vorhanden sein."
        }
    },
    "Ausstellungsraum": {
        "4.1": {
            einfach: "Sichern Sie hohe oder schwere Ausstellungsstücke gegen Umfallen.",
            bghw: "Sichern Sie Exponate gemäß Herstellerangaben gegen Kippen und prüfen Sie die Standsicherheit regelmäßig.",
            rechtlich: "Nach § 4 ArbSchG sind Gefährdungen durch umstürzende Gegenstände zu vermeiden; Einrichtungen müssen nach § 5 BetrSichV standsicher sein."
        },
        "4.2": {
            einfach: "Stellen Sie schwere Ware nicht hoch oben ab und benutzen Sie zum Erreichen eine Leiter oder einen Tritt.",
            bghw: "Stellen Sie Aufstiegshilfen gemäß DGUV Information 208-016 bereit und lagern Sie schwere Exponate nicht in der Höhe.",
            rechtlich: "Geeignete Arbeitsmittel für Arbeiten in der Höhe sind nach § 5 BetrSichV bereitzustellen (TRBS 2121-2)."
        },
        "4.3": {
            einfach: "Halten Sie die Gänge frei und markieren Sie Stufen und Podestkanten.",
            bghw: "Gestalten Sie Verkehrswege gemäß ASR A1.8 und kennzeichnen Sie Kanten gemäß ASR A1.3.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV freizuhalten und nach Anhang Nr. 1.5 ArbStättV frei von Stolperstellen zu gestalten."
        },
        "4.4": {
            einfach: "Lassen Sie Vorführgeräte prüfen und führen Sie Maschinen nur mit Schutzeinrichtungen vor.",
            bghw: "Lassen Sie Vorführgeräte gemäß DGUV Vorschrift 3 prüfen und betreiben Sie Vorführmaschinen nur mit Schutzeinrichtungen.",
            rechtlich: "Elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 zu prüfen; Arbeitsmittel dürfen nach § 6 BetrSichV nur mit wirksamen Schutzeinrichtungen verwendet werden."
        },
        "4.5": {
            einfach: "Markieren Sie Glasflächen und schützen Sie scharfe Kanten.",
            bghw: "Kennzeichnen bzw. sichern Sie Glasflächen und Kanten gemäß ASR A1.6 und ASR A1.3.",
            rechtlich: "Durchsichtige Flächen sind nach Anhang Nr. 1.5 ArbStättV zu kennzeichnen; Gefährdungen durch scharfe Kanten sind nach § 4 ArbSchG zu vermeiden."
        },
        "4.6": {
            einfach: "Planen Sie Umbauten mit genug Personen und Hilfsmitteln.",
            bghw: "Beurteilen Sie Umbautätigkeiten (Heben, Tragen, Arbeiten in der Höhe) und stellen Sie Hilfsmittel bereit (LasthandhabV, DGUV Information 208-016).",
            rechtlich: "Die Gefährdungen beim Umbau sind nach § 5 ArbSchG und § 2 LasthandhabV zu beurteilen; geeignete Arbeitsmittel sind nach § 5 BetrSichV bereitzustellen."
        },
        "4.7": {
            einfach: "Achten Sie darauf, dass heiße Strahler nicht zu nah an Stoffen oder Kartons stehen.",
            bghw: "Halten Sie die vom Hersteller angegebenen Mindestabstände von Leuchten zu brennbaren Materialien ein.",
            rechtlich: "Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen; Leuchten sind nach Herstellerangaben (Mindestabstand) zu betreiben."
        },
        "4.8": {
            einfach: "Stellen Sie keine Ausstellungsstücke vor Notausgänge.",
            bghw: "Halten Sie Fluchtwege gemäß ASR A2.3 frei und kennzeichnen Sie sie gemäß ASR A1.3.",
            rechtlich: "Fluchtwege und Notausgänge sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten."
        }
    },
    "Büroarbeitsplätze": {
        "5.1": {
            einfach: "Stellen Sie die Bildschirme so auf, dass man parallel zum Fenster blickt, und nutzen Sie Jalousien gegen Blendung.",
            bghw: "Richten Sie die Bildschirmarbeitsplätze blendfrei aus und sorgen Sie für einstellbaren Sonnenschutz gemäß ArbStättV Anhang Nr. 6 und ASR A6 „Bildschirmarbeit“.",
            rechtlich: "Bildschirmarbeitsplätze sind nach § 3a Abs. 1 ArbStättV i. V. m. Anhang Nr. 6 ArbStättV so einzurichten, dass störende Blendungen und Reflexionen vermieden werden; die ASR A6 konkretisiert die Anforderungen."
        },
        "5.2": {
            einfach: "Sorgen Sie für einstellbare Stühle und Tische und zeigen Sie den Beschäftigten, wie man sie richtig einstellt.",
            bghw: "Stellen Sie ergonomisch einstellbare Arbeitsmittel bereit und unterweisen Sie die Beschäftigten in der Einstellung gemäß ArbStättV Anhang Nr. 6 und ASR A6.",
            rechtlich: "Nach Anhang Nr. 6.1 ArbStättV müssen Bildschirmarbeitsplätze ergonomisch gestaltet und an die Belange der Beschäftigten anpassbar sein; die Unterweisung erfolgt nach § 12 ArbSchG."
        },
        "5.3": {
            einfach: "Prüfen Sie die Raumbelegung und schaffen Sie genug Platz an jedem Arbeitsplatz.",
            bghw: "Stellen Sie ausreichende Grund- und Bewegungsflächen gemäß ASR A1.2 „Raumabmessungen und Bewegungsflächen“ sicher (Richtwert Büro: 8 m² für den ersten und 6 m² für jeden weiteren Arbeitsplatz).",
            rechtlich: "Arbeitsräume müssen nach § 3a ArbStättV i. V. m. Anhang Nr. 1.2 ArbStättV eine ausreichende Grundfläche und Bewegungsfläche aufweisen; die ASR A1.2 nennt für Büroräume 8 m² für den ersten und 6 m² für jeden weiteren Arbeitsplatz."
        },
        "5.4": {
            einfach: "Lassen Sie defekte Leuchten tauschen und sorgen Sie für genug Licht am Schreibtisch.",
            bghw: "Stellen Sie die Beleuchtung gemäß ASR A3.4 „Beleuchtung und Sichtverbindung“ sicher; für Büroarbeit sind mindestens 500 lx im Bereich der Arbeitsaufgabe vorgesehen.",
            rechtlich: "Arbeitsstätten müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; die ASR A3.4 nennt für Büroarbeitsplätze einen Mindestwert der Beleuchtungsstärke von 500 lx."
        },
        "5.5": {
            einfach: "Sorgen Sie im Büro für mindestens 20 °C und treffen Sie bei Hitze Maßnahmen wie Sonnenschutz oder Lüften am Morgen.",
            bghw: "Halten Sie die Raumtemperatur gemäß ASR A3.5 „Raumtemperatur“ ein (Büro mindestens 20 °C) und legen Sie Maßnahmen für Lufttemperaturen über 26 °C fest.",
            rechtlich: "Nach Anhang Nr. 3.5 ArbStättV muss eine gesundheitlich zuträgliche Raumtemperatur bestehen; die ASR A3.5 nennt für leichte, überwiegend sitzende Tätigkeit mindestens 20 °C und sieht ab 26 °C gestufte Maßnahmen vor."
        },
        "5.6": {
            einfach: "Verlegen Sie Kabel in Kabelkanälen und stecken Sie keine Steckdosenleisten hintereinander.",
            bghw: "Beseitigen Sie Stolperstellen durch Kabelführung gemäß ASR A1.5 und vermeiden Sie hintereinandergesteckte Mehrfachsteckdosen gemäß DGUV Vorschrift 3.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.5 ArbStättV frei von Stolperstellen zu halten (ASR A1.5); elektrische Betriebsmittel dürfen nach § 3 DGUV Vorschrift 3 nur in ordnungsgemäßem Zustand und bestimmungsgemäß verwendet werden."
        },
        "5.7": {
            einfach: "Bieten Sie allen Bildschirm-Beschäftigten regelmäßig eine Untersuchung beim Betriebsarzt mit Sehtest an.",
            bghw: "Bieten Sie die Angebotsvorsorge „Tätigkeiten an Bildschirmgeräten“ nach ArbMedVV an und stellen Sie bei Bedarf Bildschirmarbeitsbrillen bereit.",
            rechtlich: "Nach § 5 ArbMedVV i. V. m. ArbMedVV Anhang Teil 4 ist bei Tätigkeiten an Bildschirmgeräten Angebotsvorsorge anzubieten; die Kosten für eine notwendige Bildschirmarbeitsbrille trägt der Arbeitgeber (§ 3 Abs. 3 ArbSchG)."
        },
        "5.8": {
            einfach: "Lassen Sie elektrische Geräte regelmäßig von einer Elektrofachkraft prüfen und markieren.",
            bghw: "Lassen Sie ortsveränderliche elektrische Betriebsmittel wiederkehrend gemäß DGUV Vorschrift 3 prüfen; in Büros gilt bei geringer Fehlerquote ein Prüfintervall von höchstens zwei Jahren als Richtwert.",
            rechtlich: "Ortsveränderliche elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 und § 14 BetrSichV wiederkehrend durch eine Elektrofachkraft zu prüfen; die Fristen sind in der Gefährdungsbeurteilung festzulegen."
        },
        "5.9": {
            einfach: "Planen Sie die Arbeit so, dass Bildschirmarbeit regelmäßig durch andere Tätigkeiten oder kurze Pausen unterbrochen wird.",
            bghw: "Organisieren Sie Mischarbeit bzw. Kurzpausen gemäß ArbStättV Anhang Nr. 6 und ASR A6.",
            rechtlich: "Nach Anhang Nr. 6.1 Abs. 2 ArbStättV ist die Bildschirmarbeit so zu organisieren, dass sie regelmäßig durch andere Tätigkeiten oder Erholungszeiten unterbrochen wird."
        },
        "5.10": {
            einfach: "Lassen Sie defekte Fenster, Jalousien und Lüftungen reparieren.",
            bghw: "Stellen Sie Sonnenschutz und Lüftung gemäß ASR A3.5 und ASR A3.6 sicher.",
            rechtlich: "Nach Anhang Nr. 3.5 und 3.6 ArbStättV müssen Arbeitsräume gesundheitlich zuträglich temperiert und belüftet sein; Fenster müssen nach Anhang Nr. 1.6 ArbStättV sicher bedienbar sein."
        }
    },
    "Verwaltung Dienstleistungszentrum": {
        "42.1": {
            einfach: "Stellen Sie die Bildschirme so auf, dass man parallel zum Fenster blickt, und nutzen Sie Jalousien gegen Blendung.",
            bghw: "Richten Sie die Bildschirmarbeitsplätze blendfrei aus und sorgen Sie für einstellbaren Sonnenschutz gemäß ArbStättV Anhang Nr. 6 und ASR A6 „Bildschirmarbeit“.",
            rechtlich: "Bildschirmarbeitsplätze sind nach § 3a Abs. 1 ArbStättV i. V. m. Anhang Nr. 6 ArbStättV so einzurichten, dass störende Blendungen und Reflexionen vermieden werden; die ASR A6 konkretisiert die Anforderungen."
        },
        "42.2": {
            einfach: "Sorgen Sie für einstellbare Stühle und Tische und zeigen Sie den Beschäftigten, wie man sie richtig einstellt.",
            bghw: "Stellen Sie ergonomisch einstellbare Arbeitsmittel bereit und unterweisen Sie die Beschäftigten in der Einstellung gemäß ArbStättV Anhang Nr. 6 und ASR A6.",
            rechtlich: "Nach Anhang Nr. 6.1 ArbStättV müssen Bildschirmarbeitsplätze ergonomisch gestaltet und an die Belange der Beschäftigten anpassbar sein; die Unterweisung erfolgt nach § 12 ArbSchG."
        },
        "42.3": {
            einfach: "Prüfen Sie die Raumbelegung und schaffen Sie genug Platz an jedem Arbeitsplatz.",
            bghw: "Stellen Sie ausreichende Grund- und Bewegungsflächen gemäß ASR A1.2 „Raumabmessungen und Bewegungsflächen“ sicher (Richtwert Büro: 8 m² für den ersten und 6 m² für jeden weiteren Arbeitsplatz).",
            rechtlich: "Arbeitsräume müssen nach § 3a ArbStättV i. V. m. Anhang Nr. 1.2 ArbStättV eine ausreichende Grundfläche und Bewegungsfläche aufweisen; die ASR A1.2 nennt für Büroräume 8 m² für den ersten und 6 m² für jeden weiteren Arbeitsplatz."
        },
        "42.4": {
            einfach: "Lassen Sie defekte Leuchten tauschen und sorgen Sie für genug Licht am Schreibtisch.",
            bghw: "Stellen Sie die Beleuchtung gemäß ASR A3.4 „Beleuchtung und Sichtverbindung“ sicher; für Büroarbeit sind mindestens 500 lx im Bereich der Arbeitsaufgabe vorgesehen.",
            rechtlich: "Arbeitsstätten müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; die ASR A3.4 nennt für Büroarbeitsplätze einen Mindestwert der Beleuchtungsstärke von 500 lx."
        },
        "42.5": {
            einfach: "Sorgen Sie im Büro für mindestens 20 °C und treffen Sie bei Hitze Maßnahmen wie Sonnenschutz oder Lüften am Morgen.",
            bghw: "Halten Sie die Raumtemperatur gemäß ASR A3.5 „Raumtemperatur“ ein (Büro mindestens 20 °C) und legen Sie Maßnahmen für Lufttemperaturen über 26 °C fest.",
            rechtlich: "Nach Anhang Nr. 3.5 ArbStättV muss eine gesundheitlich zuträgliche Raumtemperatur bestehen; die ASR A3.5 nennt für leichte, überwiegend sitzende Tätigkeit mindestens 20 °C und sieht ab 26 °C gestufte Maßnahmen vor."
        },
        "42.6": {
            einfach: "Verlegen Sie Kabel in Kabelkanälen und stecken Sie keine Steckdosenleisten hintereinander.",
            bghw: "Beseitigen Sie Stolperstellen durch Kabelführung gemäß ASR A1.5 und vermeiden Sie hintereinandergesteckte Mehrfachsteckdosen gemäß DGUV Vorschrift 3.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.5 ArbStättV frei von Stolperstellen zu halten (ASR A1.5); elektrische Betriebsmittel dürfen nach § 3 DGUV Vorschrift 3 nur in ordnungsgemäßem Zustand und bestimmungsgemäß verwendet werden."
        },
        "42.7": {
            einfach: "Bieten Sie allen Bildschirm-Beschäftigten regelmäßig eine Untersuchung beim Betriebsarzt mit Sehtest an.",
            bghw: "Bieten Sie die Angebotsvorsorge „Tätigkeiten an Bildschirmgeräten“ nach ArbMedVV an und stellen Sie bei Bedarf Bildschirmarbeitsbrillen bereit.",
            rechtlich: "Nach § 5 ArbMedVV i. V. m. ArbMedVV Anhang Teil 4 ist bei Tätigkeiten an Bildschirmgeräten Angebotsvorsorge anzubieten; die Kosten für eine notwendige Bildschirmarbeitsbrille trägt der Arbeitgeber (§ 3 Abs. 3 ArbSchG)."
        },
        "42.8": {
            einfach: "Lassen Sie elektrische Geräte regelmäßig von einer Elektrofachkraft prüfen und markieren.",
            bghw: "Lassen Sie ortsveränderliche elektrische Betriebsmittel wiederkehrend gemäß DGUV Vorschrift 3 prüfen; in Büros gilt bei geringer Fehlerquote ein Prüfintervall von höchstens zwei Jahren als Richtwert.",
            rechtlich: "Ortsveränderliche elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 und § 14 BetrSichV wiederkehrend durch eine Elektrofachkraft zu prüfen; die Fristen sind in der Gefährdungsbeurteilung festzulegen."
        },
        "42.9": {
            einfach: "Planen Sie die Arbeit so, dass Bildschirmarbeit regelmäßig durch andere Tätigkeiten oder kurze Pausen unterbrochen wird.",
            bghw: "Organisieren Sie Mischarbeit bzw. Kurzpausen gemäß ArbStättV Anhang Nr. 6 und ASR A6.",
            rechtlich: "Nach Anhang Nr. 6.1 Abs. 2 ArbStättV ist die Bildschirmarbeit so zu organisieren, dass sie regelmäßig durch andere Tätigkeiten oder Erholungszeiten unterbrochen wird."
        },
        "42.10": {
            einfach: "Lassen Sie defekte Fenster, Jalousien und Lüftungen reparieren.",
            bghw: "Stellen Sie Sonnenschutz und Lüftung gemäß ASR A3.5 und ASR A3.6 sicher.",
            rechtlich: "Nach Anhang Nr. 3.5 und 3.6 ArbStättV müssen Arbeitsräume gesundheitlich zuträglich temperiert und belüftet sein; Fenster müssen nach Anhang Nr. 1.6 ArbStättV sicher bedienbar sein."
        },
        "42.11": {
            einfach: "Halten Sie Flure und Treppen im Verwaltungsgebäude frei und hängen Sie einen aktuellen Fluchtplan aus.",
            bghw: "Halten Sie Fluchtwege gemäß ASR A2.3 frei und hängen Sie Flucht- und Rettungspläne nach DIN ISO 23601 aus.",
            rechtlich: "Fluchtwege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten; ein Flucht- und Rettungsplan ist aufzustellen, wenn Lage und Ausdehnung der Arbeitsstätte dies erfordern."
        },
        "42.12": {
            einfach: "Halten Sie die Feuerlöscher in der Verwaltung frei und lassen Sie sie alle zwei Jahre prüfen.",
            bghw: "Stellen Sie Feuerlöscher gemäß ASR A2.2 bereit und lassen Sie sie gemäß DIN 14406-4 prüfen.",
            rechtlich: "Arbeitsstätten sind nach Anhang Nr. 2.2 ArbStättV mit Feuerlöscheinrichtungen auszustatten; die ASR A2.2 fordert eine Instandhaltung mindestens alle zwei Jahre."
        },
        "42.13": {
            einfach: "Sorgen Sie dafür, dass in der Verwaltung ein Ersthelfer da ist und der Verbandkasten vollständig ist.",
            bghw: "Stellen Sie Ersthelfer und Erste-Hilfe-Material gemäß DGUV Vorschrift 1 und DGUV Information 204-022 sicher.",
            rechtlich: "Nach §§ 25, 26 DGUV Vorschrift 1 sind Erste-Hilfe-Material und eine ausreichende Zahl von Ersthelfern bereitzustellen; Notrufnummern sind nach § 24 Abs. 5 auszuhängen."
        },
        "42.14": {
            einfach: "Achten Sie auf sichere Treppen mit Handlauf und lassen Sie den Aufzug prüfen.",
            bghw: "Halten Sie Treppen gemäß ASR A1.8 instand und lassen Sie Aufzüge gemäß BetrSichV durch eine ZÜS prüfen.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; Aufzugsanlagen sind nach § 16 BetrSichV wiederkehrend durch eine ZÜS zu prüfen."
        },
        "42.15": {
            einfach: "Halten Sie Teeküche, Pausenraum und Toiletten sauber.",
            bghw: "Stellen Sie Pausen- und Sanitärräume gemäß ASR A4.2 und ASR A4.1 bereit und legen Sie Reinigungsintervalle fest.",
            rechtlich: "Nach Anhang Nr. 4.1 und 4.2 ArbStättV sind Sanitär- und Pausenräume bereitzustellen und nach § 4 Abs. 2 ArbStättV hygienisch zu reinigen."
        }
    },
    "Schulungszentrum": {
        "43.1": {
            einfach: "Achten Sie darauf, dass nicht mehr Personen im Raum sind, als hineinpassen.",
            bghw: "Legen Sie die höchstzulässige Personenzahl je Raum fest (Raumgröße, Fluchtwege, Lüftung) und hängen Sie sie aus; bei mehr als 200 Personen gelten die Vorgaben für Versammlungsstätten.",
            rechtlich: "Räume müssen nach § 3a ArbStättV i. V. m. Anhang Nr. 1.2 ArbStättV ausreichend bemessen sein; Fluchtwege müssen nach ASR A2.3 der Personenzahl entsprechen."
        },
        "43.2": {
            einfach: "Stellen Sie Tische und Stühle so, dass Gänge frei bleiben, und decken Sie Kabel ab.",
            bghw: "Halten Sie Gänge gemäß ASR A1.8 und ASR A2.3 frei und verlegen Sie Kabel stolperfrei (ASR A1.5).",
            rechtlich: "Verkehrs- und Fluchtwege sind nach § 4 Abs. 4 ArbStättV freizuhalten; Stolperstellen sind nach Anhang Nr. 1.5 ArbStättV zu vermeiden."
        },
        "43.3": {
            einfach: "Sorgen Sie für gutes Licht, Verdunkelung bei Präsentationen und regelmäßiges Lüften.",
            bghw: "Stellen Sie Beleuchtung gemäß ASR A3.4 und Lüftung gemäß ASR A3.6 sicher; bei voller Belegung Lüftungsintervalle festlegen.",
            rechtlich: "Nach Anhang Nr. 3.4 und 3.6 ArbStättV müssen Räume ausreichend beleuchtet sein und gesundheitlich zuträgliche Atemluft haben."
        },
        "43.4": {
            einfach: "Lassen Sie Beamer und Bildschirme sicher befestigen und die Geräte regelmäßig prüfen.",
            bghw: "Lassen Sie Medientechnik gemäß DGUV Vorschrift 3 prüfen und Deckenhalterungen nach Herstellerangaben montieren und kontrollieren.",
            rechtlich: "Elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 wiederkehrend zu prüfen; Gefährdungen durch herabfallende Gegenstände sind nach § 4 ArbSchG zu vermeiden."
        },
        "43.5": {
            einfach: "Sperren Sie Übungsflächen ab und verwenden Sie nur geprüfte Übungsgeräte.",
            bghw: "Legen Sie für praktische Übungen Schutzmaßnahmen fest (Absperrung, Aufsicht, geprüfte Übungsgeräte, Ausbildungsfahrzeuge gemäß DGUV Grundsatz 308-001).",
            rechtlich: "Gefährdungen bei Übungen sind nach § 5 ArbSchG zu beurteilen; Arbeitsmittel müssen nach § 4 BetrSichV geprüft und sicher sein."
        },
        "43.6": {
            einfach: "Halten Sie Flure und Treppen frei und hängen Sie in jedem Schulungsraum einen Fluchtplan aus.",
            bghw: "Halten Sie Fluchtwege gemäß ASR A2.3 frei, kennzeichnen Sie sie gemäß ASR A1.3 und hängen Sie Flucht- und Rettungspläne (DIN ISO 23601) aus.",
            rechtlich: "Fluchtwege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten; Flucht- und Rettungspläne sind auszuhängen, wenn Lage und Ausdehnung dies erfordern."
        },
        "43.7": {
            einfach: "Sagen Sie zu Beginn jeder Schulung, wo die Notausgänge und der Sammelplatz sind.",
            bghw: "Nehmen Sie den Hinweis auf Fluchtwege und Sammelplatz in den Ablauf jeder Schulung auf.",
            rechtlich: "Nach § 10 ArbSchG sind Maßnahmen zur Evakuierung zu treffen; betriebsfremde Personen sind nach § 8 ArbSchG über Gefahren zu informieren."
        },
        "43.8": {
            einfach: "Achten Sie auf sichere Treppen, gute Beleuchtung und einen geprüften Aufzug.",
            bghw: "Halten Sie Treppen gemäß ASR A1.8 instand, lassen Sie Aufzüge gemäß BetrSichV prüfen und gestalten Sie Zugänge nach ASR V3a.2.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; Aufzugsanlagen sind nach § 16 BetrSichV durch eine ZÜS zu prüfen; Barrierefreiheit richtet sich nach § 3a Abs. 2 ArbStättV."
        },
        "43.9": {
            einfach: "Halten Sie Feuerlöscher frei und prüfen Sie, ob die Notbeleuchtung funktioniert.",
            bghw: "Stellen Sie Feuerlöscher gemäß ASR A2.2 bereit und prüfen Sie die Sicherheitsbeleuchtung gemäß DIN EN 50172.",
            rechtlich: "Arbeitsstätten sind nach Anhang Nr. 2.2 ArbStättV mit Feuerlöscheinrichtungen auszustatten; Sicherheitsbeleuchtung ist nach ASR A2.3 und ASR A3.4 erforderlich, wo Gefährdungen beim Ausfall der Beleuchtung entstehen."
        },
        "43.10": {
            einfach: "Halten Sie Teeküche und Pausenbereich sauber und lassen Sie Kaffeemaschinen und Wasserkocher prüfen.",
            bghw: "Prüfen Sie Küchengeräte gemäß DGUV Vorschrift 3 und halten Sie Pausenbereiche gemäß ASR A4.2 sauber.",
            rechtlich: "Elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 zu prüfen; Pausenräume sind nach Anhang Nr. 4.2 ArbStättV bereitzustellen und hygienisch zu halten."
        },
        "43.11": {
            einfach: "Sorgen Sie für genug saubere Toiletten, auch wenn viele Teilnehmende da sind.",
            bghw: "Stellen Sie Toiletten gemäß ASR A4.1 in ausreichender Zahl bereit und legen Sie Reinigungsintervalle fest.",
            rechtlich: "Toilettenräume sind nach Anhang Nr. 4.1 ArbStättV in ausreichender Zahl bereitzustellen und hygienisch zu reinigen."
        },
        "43.12": {
            einfach: "Halten Sie einen Verbandkasten bereit und sorgen Sie dafür, dass ein Ersthelfer im Haus ist.",
            bghw: "Stellen Sie Erste-Hilfe-Material und Ersthelfer gemäß DGUV Vorschrift 1 und DGUV Information 204-022 sicher.",
            rechtlich: "Nach §§ 25, 26 DGUV Vorschrift 1 sind Erste-Hilfe-Material und eine ausreichende Zahl von Ersthelfern bereitzuhalten."
        },
        "43.13": {
            einfach: "Sorgen Sie für einen guten Arbeitsplatz für die Trainer und einen ruhigen Raum zur Vorbereitung.",
            bghw: "Gestalten Sie Trainer- und Vorbereitungsarbeitsplätze gemäß ASR A6 und berücksichtigen Sie Stimm- und Stehbelastung in der Gefährdungsbeurteilung.",
            rechtlich: "Arbeitsplätze sind nach § 3a ArbStättV ergonomisch zu gestalten; Belastungen sind nach § 5 ArbSchG zu beurteilen."
        }
    },
    "Sozialräume und PSA": {
        "6.1": {
            einfach: "Halten Sie den Pausenraum sauber und lagern Sie dort keine Ware.",
            bghw: "Stellen Sie Pausenräume gemäß ASR A4.2 bereit und halten Sie sie frei von betrieblichen Lagerungen.",
            rechtlich: "Nach Anhang Nr. 4.2 ArbStättV ist bei mehr als zehn Beschäftigten oder wenn Sicherheits- oder Gesundheitsgründe es erfordern ein Pausenraum bereitzustellen (ASR A4.2)."
        },
        "6.2": {
            einfach: "Sorgen Sie für saubere Toiletten, Waschräume und Umkleiden.",
            bghw: "Stellen Sie Sanitärräume gemäß ASR A4.1 bereit und legen Sie Reinigungsintervalle fest.",
            rechtlich: "Nach Anhang Nr. 4.1 ArbStättV sind Toilettenräume, Waschräume und Umkleideräume bereitzustellen (ASR A4.1)."
        },
        "6.3": {
            einfach: "Stellen Sie Sicherheitsschuhe bereit und achten Sie darauf, dass sie im Lager getragen werden.",
            bghw: "Stellen Sie Sicherheitsschuhe gemäß Gefährdungsbeurteilung (EN ISO 20345) bereit und kontrollieren Sie die Benutzung (DGUV Regel 112-191).",
            rechtlich: "Nach § 2 PSA-Benutzungsverordnung ist erforderliche PSA kostenlos bereitzustellen; die Beschäftigten haben sie nach § 15 ArbSchG bestimmungsgemäß zu benutzen."
        },
        "6.4": {
            einfach: "Lassen Sie im Hof und an der Rampe Warnwesten tragen.",
            bghw: "Stellen Sie Warnkleidung gemäß Gefährdungsbeurteilung (EN ISO 20471) bereit und regeln Sie die Tragepflicht (DGUV Regel 112-189).",
            rechtlich: "Erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen; die Tragepflicht ergibt sich aus der Gefährdungsbeurteilung nach § 5 ArbSchG."
        },
        "6.5": {
            einfach: "Stellen Sie passende Handschuhe bereit, z. B. gegen Schnitte und Kälte.",
            bghw: "Stellen Sie Schutzhandschuhe gemäß Gefährdungsbeurteilung bereit (DGUV Regel 112-195).",
            rechtlich: "Nach § 2 PSA-Benutzungsverordnung ist geeignete PSA bereitzustellen; die Auswahl erfolgt nach der Gefährdungsbeurteilung."
        },
        "6.6": {
            einfach: "Erklären Sie den Beschäftigten, wann und wie sie ihre Schutzausrüstung tragen müssen.",
            bghw: "Unterweisen Sie die Beschäftigten im Gebrauch der PSA und dokumentieren Sie die Unterweisung (DGUV Vorschrift 1).",
            rechtlich: "Nach § 3 PSA-Benutzungsverordnung sind die Beschäftigten darin zu unterweisen, wie die PSA sicherheitsgerecht benutzt wird."
        }
    },
    "Verkehrswege": {
        "7.1": {
            einfach: "Trennen Sie Wege für Stapler und Fußgänger oder markieren Sie sie deutlich am Boden.",
            bghw: "Trennen bzw. kennzeichnen Sie Fahr- und Gehwege gemäß ASR A1.8 „Verkehrswege“; in Räumen über 1.000 m² sind die Begrenzungen der Fahrwege zu kennzeichnen.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV so zu gestalten, dass Fußgänger und Fahrzeuge sicher verkehren können; die ASR A1.8 fordert die Kennzeichnung der Fahrwegbegrenzungen in Arbeitsräumen mit mehr als 1.000 m² Grundfläche."
        },
        "7.2": {
            einfach: "Prüfen Sie, ob Stapler und Ladung mit genug Abstand an Regalen und Personen vorbeikommen, und schaffen Sie bei Bedarf mehr Platz.",
            bghw: "Bemessen Sie Fahrwege gemäß ASR A1.8: Fahrzeug- bzw. Ladungsbreite zuzüglich Randzuschlag von 0,50 m je Seite, bei Gegenverkehr zusätzlich Begegnungszuschlag von 0,40 m.",
            rechtlich: "Die Breite der Verkehrswege muss sich nach Anhang Nr. 1.8 ArbStättV nach Anzahl der Benutzer und Art des Betriebs richten; die ASR A1.8 nennt Randzuschläge von 0,50 m je Seite und einen Begegnungszuschlag von 0,40 m."
        },
        "7.3": {
            einfach: "Räumen Sie die Wege frei und legen Sie feste Abstellflächen für Paletten und Leergut fest.",
            bghw: "Halten Sie Verkehrswege gemäß ASR A1.8 ständig frei und legen Sie gekennzeichnete Abstellflächen fest.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten, damit sie jederzeit benutzt werden können; die ASR A1.8 konkretisiert dies."
        },
        "7.4": {
            einfach: "Lassen Sie Löcher und Risse im Boden reparieren und kennzeichnen Sie Schadstellen bis zur Reparatur.",
            bghw: "Beseitigen Sie Bodenschäden und Stolperstellen gemäß ASR A1.5 „Fußböden“; Höhenunterschiede von mehr als 4 mm gelten als Stolperstelle.",
            rechtlich: "Fußböden müssen nach Anhang Nr. 1.5 ArbStättV frei von Stolperstellen, eben und rutschhemmend sein; die ASR A1.5 bewertet Höhenunterschiede über 4 mm als Stolperstelle."
        },
        "7.5": {
            einfach: "Bringen Sie an unübersichtlichen Stellen Spiegel und Warnschilder an und legen Sie Schrittgeschwindigkeit fest.",
            bghw: "Sichern Sie unübersichtliche Bereiche gemäß ASR A1.8 und DGUV Vorschrift 68 durch Spiegel, Kennzeichnung nach ASR A1.3 und betriebliche Geschwindigkeitsregelungen.",
            rechtlich: "Nach § 4 ArbSchG sind Gefahren an der Quelle zu bekämpfen; Gefahrstellen an Verkehrswegen sind nach ASR A1.3 zu kennzeichnen und nach ASR A1.8 so zu gestalten, dass Zusammenstöße vermieden werden."
        },
        "7.6": {
            einfach: "Lassen Sie defekte Leuchten tauschen und dunkle Bereiche besser ausleuchten.",
            bghw: "Stellen Sie die Beleuchtung der Verkehrswege gemäß ASR A3.4 sicher und prüfen Sie dunkle Zonen, insbesondere in Regalgassen.",
            rechtlich: "Verkehrswege müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; die Mindestwerte ergeben sich aus der ASR A3.4."
        },
        "7.7": {
            einfach: "Halten Sie Treppen frei und lassen Sie fehlende oder lose Handläufe reparieren.",
            bghw: "Sorgen Sie für sichere Treppen mit Handläufen und freie Laufwege gemäß ASR A1.8.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV mit Handläufen auszustatten und sicher begehbar zu halten; die ASR A1.8 konkretisiert die Anforderungen."
        },
        "7.8": {
            einfach: "Legen Sie fest, wie schnell in der Halle gefahren werden darf, und hängen Sie Schilder auf.",
            bghw: "Legen Sie Höchstgeschwindigkeiten in der Betriebsanweisung fest und kennzeichnen Sie sie gemäß ASR A1.3; ggf. technische Geschwindigkeitsbegrenzung nutzen.",
            rechtlich: "Fahrregeln sind nach § 5 ArbSchG festzulegen und in der Betriebsanweisung nach § 12 BetrSichV aufzunehmen; Verkehrsregeln sind nach ASR A1.3 zu kennzeichnen."
        },
        "7.9": {
            einfach: "Kennzeichnen Sie Stellen, an denen Fußgänger Fahrwege queren, und sichern Sie Türen zu Fahrwegen mit Absperrgittern.",
            bghw: "Sichern Sie Querungsstellen gemäß ASR A1.8 (Absperrungen vor Türen, die direkt auf Fahrwege führen, Markierung, Spiegel).",
            rechtlich: "Nach Anhang Nr. 1.8 ArbStättV dürfen Türen nicht unmittelbar auf Fahrwege führen, ohne dass Schutzmaßnahmen getroffen sind; die ASR A1.8 konkretisiert die Absicherung."
        },
        "7.10": {
            einfach: "Legen Sie an Eingängen und Toren Matten aus, damit Nässe nicht in die Halle getragen wird.",
            bghw: "Sehen Sie Sauberlaufzonen gemäß ASR A1.5 vor und reinigen Sie nasse Bereiche umgehend.",
            rechtlich: "Fußböden müssen nach Anhang Nr. 1.5 ArbStättV rutschhemmend sein; Verunreinigungen sind nach § 4 Abs. 2 ArbStättV unverzüglich zu beseitigen."
        }
    },
    "Außenbereich und Hof": {
        "8.1": {
            einfach: "Legen Sie Fahrwege und Gehwege auf dem Hof fest und kennzeichnen Sie sie mit Schildern und Markierungen.",
            bghw: "Regeln und kennzeichnen Sie die Verkehrsführung im Freien gemäß ASR A1.8 und ASR A1.3; Gehwege sollten vom Lkw-Verkehr getrennt sein.",
            rechtlich: "Verkehrswege im Freien sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; die Verkehrsregelung ist Teil der Gefährdungsbeurteilung nach § 5 ArbSchG."
        },
        "8.2": {
            einfach: "Legen Sie fest, wie Lkw rückwärts an die Rampe fahren, und halten Sie Personen aus dem Rangierbereich fern.",
            bghw: "Organisieren Sie das Rangieren gemäß DGUV Vorschrift 70 „Fahrzeuge“; ist der Bereich hinter dem Fahrzeug nicht einsehbar, ist ein Einweiser oder eine gleichwertige Maßnahme erforderlich.",
            rechtlich: "Nach DGUV Vorschrift 70 darf beim Rückwärtsfahren niemand gefährdet werden; ist dies nicht sichergestellt, ist ein Einweiser einzusetzen. Die Regelung ist nach §§ 5, 12 ArbSchG festzulegen und zu unterweisen."
        },
        "8.3": {
            einfach: "Lassen Sie Hof, Rampenbereich und Wege bei Dunkelheit gut ausleuchten.",
            bghw: "Stellen Sie die Außenbeleuchtung von Verkehrswegen gemäß ASR A3.4 sicher.",
            rechtlich: "Verkehrswege im Freien müssen nach Anhang Nr. 3.4 ArbStättV ausreichend künstlich beleuchtet werden können, wenn das Tageslicht nicht ausreicht (ASR A3.4)."
        },
        "8.4": {
            einfach: "Legen Sie fest, wer bei Schnee und Glätte räumt und streut, und lassen Sie das aufschreiben.",
            bghw: "Organisieren Sie den Winterdienst schriftlich (Zuständigkeit, Zeiten, Kontrolle) gemäß ASR A1.5 und ASR A1.8.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV sicher benutzbar zu halten; dazu gehört bei Glätte das Räumen und Streuen. Zuständigkeit und Kontrolle sind nach § 3 Abs. 2 ArbSchG zu organisieren."
        },
        "8.5": {
            einfach: "Bringen Sie an gefährdeten Ecken und Toren Poller oder Anfahrschutz an und tauschen Sie beschädigte aus.",
            bghw: "Sichern Sie gefährdete Bauteile und Einrichtungen durch Anfahrschutz und kennzeichnen Sie diesen gemäß ASR A1.3 gelb-schwarz.",
            rechtlich: "Gefahren sind nach § 4 Nr. 1 ArbSchG an der Quelle zu bekämpfen; Hindernisse an Verkehrswegen sind nach ASR A1.3 und ASR A1.8 zu kennzeichnen bzw. zu sichern."
        },
        "8.6": {
            einfach: "Hängen Sie für fremde Fahrer verständliche Regeln aus, möglichst mit Bildern und in mehreren Sprachen.",
            bghw: "Legen Sie Verhaltensregeln für Fremdfahrer fest und stimmen Sie diese mit den Transportunternehmen ab (Koordination nach DGUV Vorschrift 1).",
            rechtlich: "Bei Zusammenarbeit mehrerer Arbeitgeber ist nach § 8 ArbSchG und § 6 DGUV Vorschrift 1 die Koordination sicherzustellen; Fremdfahrer sind über die Gefahren und Regeln am Standort zu informieren."
        },
        "8.7": {
            einfach: "Halten Sie die Sammelstellen ordentlich und stellen Sie nichts auf Wege oder vor Notausgänge.",
            bghw: "Legen Sie feste, gekennzeichnete Flächen für Abfall und Leergut fest und halten Sie Flucht- und Verkehrswege gemäß ASR A2.3 und ASR A1.8 frei.",
            rechtlich: "Fluchtwege und Notausgänge sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten (ASR A2.3); Lagerflächen im Freien dürfen Verkehrswege nicht einengen (ASR A1.8)."
        }
    },
    "Parkhäuser": {
        "9.1": {
            einfach: "Markieren Sie Fahrspuren, begrenzen Sie die Geschwindigkeit und hängen Sie an engen Kurven Spiegel auf.",
            bghw: "Gestalten und kennzeichnen Sie Fahrwege gemäß ASR A1.8 und ASR A1.3 sowie den Vorgaben des Garagenrechts.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; für Garagen gelten zusätzlich die bauordnungsrechtlichen Vorschriften (in NRW Sonderbauverordnung)."
        },
        "9.2": {
            einfach: "Kennzeichnen Sie Gehwege, damit Fußgänger nicht auf der Fahrbahn laufen müssen.",
            bghw: "Kennzeichnen Sie Fußwege gemäß ASR A1.8 und ASR A1.3.",
            rechtlich: "Verkehrswege für Fußgänger und Fahrzeuge sind nach Anhang Nr. 1.8 ArbStättV so anzulegen, dass Fußgänger nicht gefährdet werden."
        },
        "9.3": {
            einfach: "Lassen Sie Schäden im Boden reparieren und streuen Sie Rampen und Oberdeck bei Glätte.",
            bghw: "Halten Sie Fahr- und Gehflächen gemäß ASR A1.5 instand und organisieren Sie den Winterdienst.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV sicher benutzbar zu halten; Fußböden müssen nach Anhang Nr. 1.5 ArbStättV eben und rutschhemmend sein."
        },
        "9.4": {
            einfach: "Halten Sie die Treppenhäuser sauber und frei und lassen Sie Schäden an Stufen und Handläufen reparieren.",
            bghw: "Halten Sie Treppen gemäß ASR A1.8 instand und Treppenräume frei von Brandlasten.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV sicher begehbar mit Handläufen zu halten; Treppenräume als notwendige Fluchtwege sind nach § 4 Abs. 4 ArbStättV freizuhalten."
        },
        "9.5": {
            einfach: "Verkeilen Sie Treppenhaustüren nie und lassen Sie defekte Türschließer reparieren.",
            bghw: "Halten Sie Rauchschutz- und Brandschutztüren funktionsfähig; Feststellanlagen nur zugelassen und gewartet (DIN 14677).",
            rechtlich: "Feuer- und Rauchschutzabschlüsse dürfen in ihrer Funktion nicht beeinträchtigt werden; dies ergibt sich aus dem Bauordnungsrecht und dem Brandschutzkonzept."
        },
        "9.6": {
            einfach: "Achten Sie darauf, dass der Parkhausaufzug spätestens alle zwei Jahre geprüft wird.",
            bghw: "Lassen Sie Aufzugsanlagen gemäß BetrSichV und TRBS 3121 wiederkehrend durch eine ZÜS prüfen.",
            rechtlich: "Aufzugsanlagen sind nach § 16 BetrSichV i. V. m. BetrSichV Anhang 2 Abschnitt 2 wiederkehrend durch eine ZÜS zu prüfen; die Hauptprüfung darf zwei Jahre nicht überschreiten."
        },
        "9.7": {
            einfach: "Testen Sie den Notruf im Aufzug und melden Sie Schäden sofort.",
            bghw: "Stellen Sie Notrufsystem und Befreiung gemäß TRBS 3121 sicher und lassen Sie Mängel umgehend beheben.",
            rechtlich: "Aufzugsanlagen müssen nach BetrSichV Anhang 1 Nr. 4 mit einem wirksamen Zweiwege-Kommunikationssystem ausgestattet sein; Mängel sind nach § 10 BetrSichV zu beheben."
        },
        "9.8": {
            einfach: "Lassen Sie defekte Leuchten und Notleuchten im Parkhaus tauschen.",
            bghw: "Stellen Sie Beleuchtung gemäß ASR A3.4 und Sicherheitsbeleuchtung gemäß DIN EN 50172 sicher.",
            rechtlich: "Verkehrswege müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; Sicherheitsbeleuchtung und Kennzeichnung ergeben sich aus Garagenrecht und ASR A2.3."
        },
        "9.9": {
            einfach: "Halten Sie Feuerlöscher bereit und lagern Sie im Parkhaus keine Paletten, Reifen oder Kartons.",
            bghw: "Stellen Sie Löschmittel nach Brandschutzkonzept bereit und untersagen Sie Lagerungen in Garagen.",
            rechtlich: "Nach Garagenrecht ist die Lagerung brennbarer Stoffe in Garagen eingeschränkt; Feuerlöscheinrichtungen sind nach ASR A2.2 instand zu halten."
        },
        "9.10": {
            einfach: "Lassen Sie die Abgas-Warnanlage und die Lüftung regelmäßig prüfen.",
            bghw: "Lassen Sie CO-Warn- und Lüftungsanlagen nach der Prüfverordnung des Landes und Herstellerangaben prüfen.",
            rechtlich: "Für geschlossene Großgaragen schreibt das Bauordnungsrecht CO-Warnanlagen bzw. Lüftungsanlagen und deren wiederkehrende Prüfung durch Sachverständige vor."
        },
        "9.11": {
            einfach: "Lassen Sie beschädigte Brüstungen und Geländer sofort reparieren.",
            bghw: "Halten Sie Absturzsicherungen gemäß ASR A2.1 instand und sichern Sie sie gegen Anfahren.",
            rechtlich: "Absturzsicherungen sind nach Anhang Nr. 2.1 ArbStättV instand zu halten; Schäden sind unverzüglich zu beheben."
        },
        "9.12": {
            einfach: "Kennzeichnen Sie die Durchfahrtshöhe an der Einfahrt und markieren Sie Stützen.",
            bghw: "Kennzeichnen Sie Durchfahrtshöhen und Hindernisse gemäß ASR A1.3.",
            rechtlich: "Hindernisse an Verkehrswegen sind nach ASR A1.3 und ASR A1.8 zu kennzeichnen und zu sichern."
        },
        "9.13": {
            einfach: "Markieren Sie Fahrspuren, begrenzen Sie die Geschwindigkeit und hängen Sie an engen Kurven Spiegel auf.",
            bghw: "Gestalten und kennzeichnen Sie Fahrwege gemäß ASR A1.8 und ASR A1.3 sowie den Vorgaben des Garagenrechts.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; für Garagen gelten zusätzlich die bauordnungsrechtlichen Vorschriften (in NRW Sonderbauverordnung)."
        },
        "9.14": {
            einfach: "Kennzeichnen Sie Gehwege, damit Fußgänger nicht auf der Fahrbahn laufen müssen.",
            bghw: "Kennzeichnen Sie Fußwege gemäß ASR A1.8 und ASR A1.3.",
            rechtlich: "Verkehrswege für Fußgänger und Fahrzeuge sind nach Anhang Nr. 1.8 ArbStättV so anzulegen, dass Fußgänger nicht gefährdet werden."
        },
        "9.15": {
            einfach: "Lassen Sie Schäden im Boden reparieren und streuen Sie Rampen und Oberdeck bei Glätte.",
            bghw: "Halten Sie Fahr- und Gehflächen gemäß ASR A1.5 instand und organisieren Sie den Winterdienst.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV sicher benutzbar zu halten; Fußböden müssen nach Anhang Nr. 1.5 ArbStättV eben und rutschhemmend sein."
        },
        "9.16": {
            einfach: "Halten Sie die Treppenhäuser sauber und frei und lassen Sie Schäden an Stufen und Handläufen reparieren.",
            bghw: "Halten Sie Treppen gemäß ASR A1.8 instand und Treppenräume frei von Brandlasten.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV sicher begehbar mit Handläufen zu halten; Treppenräume als notwendige Fluchtwege sind nach § 4 Abs. 4 ArbStättV freizuhalten."
        },
        "9.17": {
            einfach: "Verkeilen Sie Treppenhaustüren nie und lassen Sie defekte Türschließer reparieren.",
            bghw: "Halten Sie Rauchschutz- und Brandschutztüren funktionsfähig; Feststellanlagen nur zugelassen und gewartet (DIN 14677).",
            rechtlich: "Feuer- und Rauchschutzabschlüsse dürfen in ihrer Funktion nicht beeinträchtigt werden; dies ergibt sich aus dem Bauordnungsrecht und dem Brandschutzkonzept."
        },
        "9.18": {
            einfach: "Achten Sie darauf, dass der Parkhausaufzug spätestens alle zwei Jahre geprüft wird.",
            bghw: "Lassen Sie Aufzugsanlagen gemäß BetrSichV und TRBS 3121 wiederkehrend durch eine ZÜS prüfen.",
            rechtlich: "Aufzugsanlagen sind nach § 16 BetrSichV i. V. m. BetrSichV Anhang 2 Abschnitt 2 wiederkehrend durch eine ZÜS zu prüfen; die Hauptprüfung darf zwei Jahre nicht überschreiten."
        },
        "9.19": {
            einfach: "Testen Sie den Notruf im Aufzug und melden Sie Schäden sofort.",
            bghw: "Stellen Sie Notrufsystem und Befreiung gemäß TRBS 3121 sicher und lassen Sie Mängel umgehend beheben.",
            rechtlich: "Aufzugsanlagen müssen nach BetrSichV Anhang 1 Nr. 4 mit einem wirksamen Zweiwege-Kommunikationssystem ausgestattet sein; Mängel sind nach § 10 BetrSichV zu beheben."
        },
        "9.20": {
            einfach: "Lassen Sie defekte Leuchten und Notleuchten im Parkhaus tauschen.",
            bghw: "Stellen Sie Beleuchtung gemäß ASR A3.4 und Sicherheitsbeleuchtung gemäß DIN EN 50172 sicher.",
            rechtlich: "Verkehrswege müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; Sicherheitsbeleuchtung und Kennzeichnung ergeben sich aus Garagenrecht und ASR A2.3."
        },
        "9.21": {
            einfach: "Halten Sie Feuerlöscher bereit und lagern Sie im Parkhaus keine Paletten, Reifen oder Kartons.",
            bghw: "Stellen Sie Löschmittel nach Brandschutzkonzept bereit und untersagen Sie Lagerungen in Garagen.",
            rechtlich: "Nach Garagenrecht ist die Lagerung brennbarer Stoffe in Garagen eingeschränkt; Feuerlöscheinrichtungen sind nach ASR A2.2 instand zu halten."
        },
        "9.22": {
            einfach: "Lassen Sie die Abgas-Warnanlage und die Lüftung regelmäßig prüfen.",
            bghw: "Lassen Sie CO-Warn- und Lüftungsanlagen nach der Prüfverordnung des Landes und Herstellerangaben prüfen.",
            rechtlich: "Für geschlossene Großgaragen schreibt das Bauordnungsrecht CO-Warnanlagen bzw. Lüftungsanlagen und deren wiederkehrende Prüfung durch Sachverständige vor."
        },
        "9.23": {
            einfach: "Lassen Sie beschädigte Brüstungen und Geländer sofort reparieren.",
            bghw: "Halten Sie Absturzsicherungen gemäß ASR A2.1 instand und sichern Sie sie gegen Anfahren.",
            rechtlich: "Absturzsicherungen sind nach Anhang Nr. 2.1 ArbStättV instand zu halten; Schäden sind unverzüglich zu beheben."
        },
        "9.24": {
            einfach: "Kennzeichnen Sie die Durchfahrtshöhe an der Einfahrt und markieren Sie Stützen.",
            bghw: "Kennzeichnen Sie Durchfahrtshöhen und Hindernisse gemäß ASR A1.3.",
            rechtlich: "Hindernisse an Verkehrswegen sind nach ASR A1.3 und ASR A1.8 zu kennzeichnen und zu sichern."
        },
        "9.25": {
            einfach: "Markieren Sie Fahrspuren, begrenzen Sie die Geschwindigkeit und hängen Sie an engen Kurven Spiegel auf.",
            bghw: "Gestalten und kennzeichnen Sie Fahrwege gemäß ASR A1.8 und ASR A1.3 sowie den Vorgaben des Garagenrechts.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; für Garagen gelten zusätzlich die bauordnungsrechtlichen Vorschriften (in NRW Sonderbauverordnung)."
        },
        "9.26": {
            einfach: "Kennzeichnen Sie Gehwege, damit Fußgänger nicht auf der Fahrbahn laufen müssen.",
            bghw: "Kennzeichnen Sie Fußwege gemäß ASR A1.8 und ASR A1.3.",
            rechtlich: "Verkehrswege für Fußgänger und Fahrzeuge sind nach Anhang Nr. 1.8 ArbStättV so anzulegen, dass Fußgänger nicht gefährdet werden."
        },
        "9.27": {
            einfach: "Lassen Sie Schäden im Boden reparieren und streuen Sie Rampen und Oberdeck bei Glätte.",
            bghw: "Halten Sie Fahr- und Gehflächen gemäß ASR A1.5 instand und organisieren Sie den Winterdienst.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV sicher benutzbar zu halten; Fußböden müssen nach Anhang Nr. 1.5 ArbStättV eben und rutschhemmend sein."
        },
        "9.28": {
            einfach: "Halten Sie die Treppenhäuser sauber und frei und lassen Sie Schäden an Stufen und Handläufen reparieren.",
            bghw: "Halten Sie Treppen gemäß ASR A1.8 instand und Treppenräume frei von Brandlasten.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV sicher begehbar mit Handläufen zu halten; Treppenräume als notwendige Fluchtwege sind nach § 4 Abs. 4 ArbStättV freizuhalten."
        },
        "9.29": {
            einfach: "Verkeilen Sie Treppenhaustüren nie und lassen Sie defekte Türschließer reparieren.",
            bghw: "Halten Sie Rauchschutz- und Brandschutztüren funktionsfähig; Feststellanlagen nur zugelassen und gewartet (DIN 14677).",
            rechtlich: "Feuer- und Rauchschutzabschlüsse dürfen in ihrer Funktion nicht beeinträchtigt werden; dies ergibt sich aus dem Bauordnungsrecht und dem Brandschutzkonzept."
        },
        "9.30": {
            einfach: "Achten Sie darauf, dass der Parkhausaufzug spätestens alle zwei Jahre geprüft wird.",
            bghw: "Lassen Sie Aufzugsanlagen gemäß BetrSichV und TRBS 3121 wiederkehrend durch eine ZÜS prüfen.",
            rechtlich: "Aufzugsanlagen sind nach § 16 BetrSichV i. V. m. BetrSichV Anhang 2 Abschnitt 2 wiederkehrend durch eine ZÜS zu prüfen; die Hauptprüfung darf zwei Jahre nicht überschreiten."
        },
        "9.31": {
            einfach: "Testen Sie den Notruf im Aufzug und melden Sie Schäden sofort.",
            bghw: "Stellen Sie Notrufsystem und Befreiung gemäß TRBS 3121 sicher und lassen Sie Mängel umgehend beheben.",
            rechtlich: "Aufzugsanlagen müssen nach BetrSichV Anhang 1 Nr. 4 mit einem wirksamen Zweiwege-Kommunikationssystem ausgestattet sein; Mängel sind nach § 10 BetrSichV zu beheben."
        },
        "9.32": {
            einfach: "Lassen Sie defekte Leuchten und Notleuchten im Parkhaus tauschen.",
            bghw: "Stellen Sie Beleuchtung gemäß ASR A3.4 und Sicherheitsbeleuchtung gemäß DIN EN 50172 sicher.",
            rechtlich: "Verkehrswege müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; Sicherheitsbeleuchtung und Kennzeichnung ergeben sich aus Garagenrecht und ASR A2.3."
        },
        "9.33": {
            einfach: "Halten Sie Feuerlöscher bereit und lagern Sie im Parkhaus keine Paletten, Reifen oder Kartons.",
            bghw: "Stellen Sie Löschmittel nach Brandschutzkonzept bereit und untersagen Sie Lagerungen in Garagen.",
            rechtlich: "Nach Garagenrecht ist die Lagerung brennbarer Stoffe in Garagen eingeschränkt; Feuerlöscheinrichtungen sind nach ASR A2.2 instand zu halten."
        },
        "9.34": {
            einfach: "Lassen Sie die Abgas-Warnanlage und die Lüftung regelmäßig prüfen.",
            bghw: "Lassen Sie CO-Warn- und Lüftungsanlagen nach der Prüfverordnung des Landes und Herstellerangaben prüfen.",
            rechtlich: "Für geschlossene Großgaragen schreibt das Bauordnungsrecht CO-Warnanlagen bzw. Lüftungsanlagen und deren wiederkehrende Prüfung durch Sachverständige vor."
        },
        "9.35": {
            einfach: "Lassen Sie beschädigte Brüstungen und Geländer sofort reparieren.",
            bghw: "Halten Sie Absturzsicherungen gemäß ASR A2.1 instand und sichern Sie sie gegen Anfahren.",
            rechtlich: "Absturzsicherungen sind nach Anhang Nr. 2.1 ArbStättV instand zu halten; Schäden sind unverzüglich zu beheben."
        },
        "9.36": {
            einfach: "Kennzeichnen Sie die Durchfahrtshöhe an der Einfahrt und markieren Sie Stützen.",
            bghw: "Kennzeichnen Sie Durchfahrtshöhen und Hindernisse gemäß ASR A1.3.",
            rechtlich: "Hindernisse an Verkehrswegen sind nach ASR A1.3 und ASR A1.8 zu kennzeichnen und zu sichern."
        },
        "9.37": {
            einfach: "Markieren Sie Fahrspuren, begrenzen Sie die Geschwindigkeit und hängen Sie an engen Kurven Spiegel auf.",
            bghw: "Gestalten und kennzeichnen Sie Fahrwege gemäß ASR A1.8 und ASR A1.3 sowie den Vorgaben des Garagenrechts.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; für Garagen gelten zusätzlich die bauordnungsrechtlichen Vorschriften (in NRW Sonderbauverordnung)."
        },
        "9.38": {
            einfach: "Kennzeichnen Sie Gehwege, damit Fußgänger nicht auf der Fahrbahn laufen müssen.",
            bghw: "Kennzeichnen Sie Fußwege gemäß ASR A1.8 und ASR A1.3.",
            rechtlich: "Verkehrswege für Fußgänger und Fahrzeuge sind nach Anhang Nr. 1.8 ArbStättV so anzulegen, dass Fußgänger nicht gefährdet werden."
        },
        "9.39": {
            einfach: "Lassen Sie Schäden im Boden reparieren und streuen Sie Rampen und Oberdeck bei Glätte.",
            bghw: "Halten Sie Fahr- und Gehflächen gemäß ASR A1.5 instand und organisieren Sie den Winterdienst.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV sicher benutzbar zu halten; Fußböden müssen nach Anhang Nr. 1.5 ArbStättV eben und rutschhemmend sein."
        },
        "9.40": {
            einfach: "Halten Sie die Treppenhäuser sauber und frei und lassen Sie Schäden an Stufen und Handläufen reparieren.",
            bghw: "Halten Sie Treppen gemäß ASR A1.8 instand und Treppenräume frei von Brandlasten.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV sicher begehbar mit Handläufen zu halten; Treppenräume als notwendige Fluchtwege sind nach § 4 Abs. 4 ArbStättV freizuhalten."
        },
        "9.41": {
            einfach: "Verkeilen Sie Treppenhaustüren nie und lassen Sie defekte Türschließer reparieren.",
            bghw: "Halten Sie Rauchschutz- und Brandschutztüren funktionsfähig; Feststellanlagen nur zugelassen und gewartet (DIN 14677).",
            rechtlich: "Feuer- und Rauchschutzabschlüsse dürfen in ihrer Funktion nicht beeinträchtigt werden; dies ergibt sich aus dem Bauordnungsrecht und dem Brandschutzkonzept."
        },
        "9.42": {
            einfach: "Achten Sie darauf, dass der Parkhausaufzug spätestens alle zwei Jahre geprüft wird.",
            bghw: "Lassen Sie Aufzugsanlagen gemäß BetrSichV und TRBS 3121 wiederkehrend durch eine ZÜS prüfen.",
            rechtlich: "Aufzugsanlagen sind nach § 16 BetrSichV i. V. m. BetrSichV Anhang 2 Abschnitt 2 wiederkehrend durch eine ZÜS zu prüfen; die Hauptprüfung darf zwei Jahre nicht überschreiten."
        },
        "9.43": {
            einfach: "Testen Sie den Notruf im Aufzug und melden Sie Schäden sofort.",
            bghw: "Stellen Sie Notrufsystem und Befreiung gemäß TRBS 3121 sicher und lassen Sie Mängel umgehend beheben.",
            rechtlich: "Aufzugsanlagen müssen nach BetrSichV Anhang 1 Nr. 4 mit einem wirksamen Zweiwege-Kommunikationssystem ausgestattet sein; Mängel sind nach § 10 BetrSichV zu beheben."
        },
        "9.44": {
            einfach: "Lassen Sie defekte Leuchten und Notleuchten im Parkhaus tauschen.",
            bghw: "Stellen Sie Beleuchtung gemäß ASR A3.4 und Sicherheitsbeleuchtung gemäß DIN EN 50172 sicher.",
            rechtlich: "Verkehrswege müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; Sicherheitsbeleuchtung und Kennzeichnung ergeben sich aus Garagenrecht und ASR A2.3."
        },
        "9.45": {
            einfach: "Halten Sie Feuerlöscher bereit und lagern Sie im Parkhaus keine Paletten, Reifen oder Kartons.",
            bghw: "Stellen Sie Löschmittel nach Brandschutzkonzept bereit und untersagen Sie Lagerungen in Garagen.",
            rechtlich: "Nach Garagenrecht ist die Lagerung brennbarer Stoffe in Garagen eingeschränkt; Feuerlöscheinrichtungen sind nach ASR A2.2 instand zu halten."
        },
        "9.46": {
            einfach: "Lassen Sie die Abgas-Warnanlage und die Lüftung regelmäßig prüfen.",
            bghw: "Lassen Sie CO-Warn- und Lüftungsanlagen nach der Prüfverordnung des Landes und Herstellerangaben prüfen.",
            rechtlich: "Für geschlossene Großgaragen schreibt das Bauordnungsrecht CO-Warnanlagen bzw. Lüftungsanlagen und deren wiederkehrende Prüfung durch Sachverständige vor."
        },
        "9.47": {
            einfach: "Lassen Sie beschädigte Brüstungen und Geländer sofort reparieren.",
            bghw: "Halten Sie Absturzsicherungen gemäß ASR A2.1 instand und sichern Sie sie gegen Anfahren.",
            rechtlich: "Absturzsicherungen sind nach Anhang Nr. 2.1 ArbStättV instand zu halten; Schäden sind unverzüglich zu beheben."
        },
        "9.48": {
            einfach: "Kennzeichnen Sie die Durchfahrtshöhe an der Einfahrt und markieren Sie Stützen.",
            bghw: "Kennzeichnen Sie Durchfahrtshöhen und Hindernisse gemäß ASR A1.3.",
            rechtlich: "Hindernisse an Verkehrswegen sind nach ASR A1.3 und ASR A1.8 zu kennzeichnen und zu sichern."
        }
    },
    "Ladesäulen für Elektrofahrzeuge": {
        "44.1": {
            einfach: "Lassen Sie die Ladesäulen regelmäßig von einer Elektrofachkraft prüfen.",
            bghw: "Lassen Sie Ladeeinrichtungen gemäß DGUV Vorschrift 3 und Herstellerangaben prüfen (Prüfung nach DIN VDE 0105-100 bzw. DIN VDE 0100-600).",
            rechtlich: "Elektrische Anlagen sind nach § 5 DGUV Vorschrift 3 wiederkehrend zu prüfen; die Prüffristen sind nach § 3 Abs. 6 BetrSichV in der Gefährdungsbeurteilung festzulegen."
        },
        "44.2": {
            einfach: "Schützen Sie die Ladesäulen mit Pollern und lassen Sie beschädigte Kabel oder Stecker sofort tauschen.",
            bghw: "Sichern Sie Ladeeinrichtungen gegen Anfahren und kontrollieren Sie Kabel und Stecker regelmäßig; beschädigte Ladepunkte sofort außer Betrieb nehmen.",
            rechtlich: "Elektrische Betriebsmittel dürfen nach § 3 DGUV Vorschrift 3 nur in ordnungsgemäßem Zustand betrieben werden; Gefährdungen durch Anfahren sind nach § 4 ArbSchG zu vermeiden."
        },
        "44.3": {
            einfach: "Hängen Sie Ladekabel nach dem Laden auf und lassen Sie sie nicht über Gehwege laufen.",
            bghw: "Sehen Sie Kabelhalter bzw. Kabelführungen vor, damit Ladekabel keine Stolperstellen auf Verkehrswegen bilden (ASR A1.8).",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV und Anhang Nr. 1.8 ArbStättV frei von Stolperstellen zu halten."
        },
        "44.4": {
            einfach: "Kennzeichnen Sie, wo die Ladesäulen abgeschaltet werden, und teilen Sie das der Feuerwehr mit.",
            bghw: "Kennzeichnen Sie Freischaltstellen gemäß ASR A1.3 und nehmen Sie die Ladeinfrastruktur in Feuerwehrpläne (DIN 14095) auf.",
            rechtlich: "Nach § 10 ArbSchG sind Maßnahmen für Notfälle zu treffen; Freischaltstellen sind nach ASR A1.3 zu kennzeichnen."
        },
        "44.5": {
            einfach: "Klären Sie mit dem Brandschutzbeauftragten, ob für die Ladeplätze besondere Maßnahmen nötig sind.",
            bghw: "Berücksichtigen Sie Ladeplätze im Brandschutzkonzept und stimmen Sie Maßnahmen mit Feuerwehr bzw. Sachversicherer ab.",
            rechtlich: "Brandgefährdungen durch Ladeinfrastruktur sind nach § 5 ArbSchG zu beurteilen; die bauordnungsrechtlichen Vorgaben für Garagen sind einzuhalten."
        },
        "44.6": {
            einfach: "Laden Sie Elektrofahrzeuge nur an den Ladesäulen, nicht an normalen Steckdosen oder mit Verlängerungskabeln.",
            bghw: "Regeln Sie das Laden in einer Betriebsanweisung und untersagen Sie das Laden über ungeeignete Steckdosen und Verlängerungen.",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 1 BetrSichV bestimmungsgemäß zu verwenden; die Regeln sind nach § 12 BetrSichV zu unterweisen."
        },
        "44.7": {
            einfach: "Sorgen Sie für gutes Licht an den Ladeplätzen und kennzeichnen Sie sie.",
            bghw: "Stellen Sie die Beleuchtung gemäß ASR A3.4 sicher und kennzeichnen Sie Ladeplätze eindeutig.",
            rechtlich: "Verkehrswege und Parkflächen müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein."
        }
    },
    "Tore und Türen": {
        "10.1": {
            einfach: "Lassen Sie alle elektrischen Tore mindestens einmal im Jahr von einer Fachfirma prüfen.",
            bghw: "Lassen Sie kraftbetätigte Tore gemäß ASR A1.7 und DIN EN 13241 vor der ersten Inbetriebnahme, nach wesentlichen Änderungen und wiederkehrend mindestens jährlich prüfen.",
            rechtlich: "Kraftbetätigte Tore sind nach ASR A1.7 sachgerecht auf ihren sicheren Zustand zu prüfen; die wiederkehrende Prüfung sollte mindestens jährlich erfolgen und ist zu dokumentieren."
        },
        "10.2": {
            einfach: "Testen Sie, ob das Tor beim Hindernis stoppt, und lassen Sie defekte Sicherungen sofort reparieren.",
            bghw: "Stellen Sie die Funktion der Schutzeinrichtungen gemäß ASR A1.7 und DIN EN 13241 sicher; Tore mit defekter Sicherung sind außer Betrieb zu nehmen.",
            rechtlich: "Kraftbetätigte Tore müssen nach Anhang Nr. 1.7 ArbStättV ohne Gefährdung bewegt werden können; defekte Schutzeinrichtungen sind nach § 10 BetrSichV unverzüglich instand zu setzen."
        },
        "10.3": {
            einfach: "Sorgen Sie dafür, dass Fußgänger eine eigene Tür neben dem Tor benutzen können.",
            bghw: "Sehen Sie neben Toren für den Fahrzeugverkehr gekennzeichnete Fußgängertüren gemäß ASR A1.7 vor.",
            rechtlich: "Nach Anhang Nr. 1.7 ArbStättV müssen in unmittelbarer Nähe von Toren, die vorwiegend für den Fahrzeugverkehr bestimmt sind, gut sichtbar gekennzeichnete, stets zugängliche Türen für Fußgänger vorhanden sein."
        },
        "10.4": {
            einfach: "Halten Sie den Bereich unter und vor den Toren frei und stellen Sie nichts vor die Bedienschalter.",
            bghw: "Halten Sie Torbereiche und Bedienelemente gemäß ASR A1.7 frei zugänglich.",
            rechtlich: "Tore müssen nach Anhang Nr. 1.7 ArbStättV sicher bedient werden können; Bewegungsbereiche sind freizuhalten (ASR A1.7)."
        },
        "10.5": {
            einfach: "Tauschen Sie zerkratzte oder kaputte Streifenvorhänge und Sichtfenster aus, damit man durchsehen kann.",
            bghw: "Stellen Sie die Durchsicht bei Pendeltüren und Streifenvorhängen gemäß ASR A1.7 sicher.",
            rechtlich: "Pendeltüren und -tore müssen nach Anhang Nr. 1.7 ArbStättV durchsichtig sein oder eine Sichtöffnung haben; die ASR A1.7 konkretisiert dies."
        },
        "10.6": {
            einfach: "Prüfen Sie täglich, dass Notausgänge offen gehen und nichts davor steht.",
            bghw: "Stellen Sie die jederzeitige Öffnung von Notausgangstüren von innen ohne Hilfsmittel gemäß ASR A2.3 und ASR A1.7 sicher.",
            rechtlich: "Türen im Verlauf von Fluchtwegen müssen nach Anhang Nr. 2.3 ArbStättV jederzeit von innen ohne besondere Hilfsmittel leicht zu öffnen sein, solange sich Beschäftigte in der Arbeitsstätte befinden."
        }
    },
    "Anlieferung und Rampe": {
        "11.1": {
            einfach: "Lassen Sie die Ladebrücken mindestens einmal im Jahr von einer Fachfirma prüfen und defekte sofort sperren.",
            bghw: "Lassen Sie Ladebrücken gemäß BetrSichV, Herstellerangaben und DIN EN 1398 wiederkehrend prüfen (in der Praxis mindestens jährlich) und dokumentieren Sie die Prüfung.",
            rechtlich: "Ladebrücken sind Arbeitsmittel; Art, Umfang und Fristen der Prüfung sind nach § 3 Abs. 6 und § 14 BetrSichV festzulegen, die Prüfung ist durch eine zur Prüfung befähigte Person durchzuführen und nach § 14 Abs. 7 BetrSichV aufzuzeichnen."
        },
        "11.2": {
            einfach: "Sichern Sie jeden Lkw an der Rampe mit Keilen oder einer Radsperre und regeln Sie, wann er abfahren darf.",
            bghw: "Legen Sie ein verbindliches Verfahren zur Sicherung der Lkw fest (Unterlegkeile, Radsperre oder Ampelsystem) gemäß DGUV Vorschrift 70 und der Gefährdungsbeurteilung.",
            rechtlich: "Fahrzeuge sind nach DGUV Vorschrift 70 gegen unbeabsichtigtes Bewegen zu sichern; das Verfahren ist nach § 5 ArbSchG festzulegen und die Beschäftigten sind nach § 12 ArbSchG zu unterweisen."
        },
        "11.3": {
            einfach: "Markieren Sie die Rampenkanten gut sichtbar gelb-schwarz und erneuern Sie abgefahrene Markierungen.",
            bghw: "Kennzeichnen Sie Absturzkanten an Laderampen gemäß ASR A1.3 und ASR A1.8 dauerhaft gelb-schwarz.",
            rechtlich: "Absturzgefährdete Bereiche sind nach ASR A1.3 zu kennzeichnen; Laderampen müssen nach Anhang Nr. 1.10 ArbStättV sicher benutzbar sein."
        },
        "11.4": {
            einfach: "Sichern Sie Rampenstellen, an denen gerade nicht geladen wird, mit Geländer oder Kette.",
            bghw: "Sichern Sie Laderampen mit mehr als 1 m Höhe gemäß ASR A1.8 und ASR A2.1 in Bereichen ohne Be- und Entladetätigkeit gegen Absturz.",
            rechtlich: "Laderampen mit einer Höhe von mehr als 1 m sollen nach Anhang Nr. 1.10 ArbStättV mit Schutzvorrichtungen gegen Absturz ausgerüstet sein; die ASR A2.1 konkretisiert die Schutzmaßnahmen."
        },
        "11.5": {
            einfach: "Sorgen Sie für eine Treppe an der Rampe und verbieten Sie das Herunterspringen.",
            bghw: "Sehen Sie an Laderampen sichere Abgänge gemäß ASR A1.8 vor; bei Rampen über 20 m Länge sollen Abgänge in jedem Endbereich vorhanden sein.",
            rechtlich: "Laderampen müssen nach Anhang Nr. 1.10 ArbStättV sicher begangen werden können; die ASR A1.8 sieht bei längeren Rampen Abgänge in jedem Endbereich vor."
        },
        "11.6": {
            einfach: "Lassen Sie beschädigte Puffer, Abdichtungen und Leuchten an der Rampe reparieren.",
            bghw: "Halten Sie Rampeneinrichtungen gemäß BetrSichV instand und stellen Sie die Beleuchtung im Ladebereich gemäß ASR A3.4 sicher.",
            rechtlich: "Arbeitsmittel und Einrichtungen sind nach § 10 BetrSichV instand zu halten; die Beleuchtung muss Anhang Nr. 3.4 ArbStättV (ASR A3.4) entsprechen."
        },
        "11.7": {
            einfach: "Stellen Sie Ware an der Rampe nur auf den markierten Flächen ab und halten Sie Tore und Wege frei.",
            bghw: "Legen Sie gekennzeichnete Bereitstellflächen fest und halten Sie Verkehrswege gemäß ASR A1.8 frei.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten; die ASR A1.8 konkretisiert dies."
        },
        "11.8": {
            einfach: "Erklären Sie allen an der Rampe die Gefahren und wie man sicher lädt, mindestens einmal im Jahr.",
            bghw: "Führen Sie mindestens jährlich eine dokumentierte Unterweisung zu den Gefahren an der Rampe gemäß DGUV Vorschrift 1 durch.",
            rechtlich: "Die Beschäftigten sind nach § 12 ArbSchG und § 4 DGUV Vorschrift 1 vor Aufnahme der Tätigkeit und danach mindestens jährlich zu unterweisen; die Unterweisung ist zu dokumentieren."
        },
        "11.9": {
            einfach: "Erklären Sie die sichere Nutzung der Hebebühne am Lkw und achten Sie auf die Sicherungsklappen für Rollcontainer.",
            bghw: "Regeln Sie die Benutzung von Ladebordwänden gemäß Herstellerangaben und DGUV Vorschrift 70 (Abrollsicherungen, Stellung des Bedieners).",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 1 BetrSichV bestimmungsgemäß zu verwenden; die Unterweisung erfolgt nach § 12 BetrSichV."
        },
        "11.10": {
            einfach: "Prüfen Sie, ob die Ampeln an den Toren funktionieren, und achten Sie darauf, dass Fahrer sie beachten.",
            bghw: "Halten Sie Signalanlagen funktionsfähig und binden Sie sie in das Verfahren zur Lkw-Sicherung ein.",
            rechtlich: "Schutzeinrichtungen sind nach § 10 BetrSichV instand zu halten; das Verfahren ist nach § 5 ArbSchG festzulegen und zu unterweisen."
        }
    },
    "Wareneingang und Ladungssicherung": {
        "12.1": {
            einfach: "Sichern Sie die Ladung mit Gurten, Antirutschmatten oder formschlüssigem Stauen, bevor der Lkw losfährt.",
            bghw: "Sichern Sie Ladungen nach den anerkannten Regeln der Technik, insbesondere VDI 2700, und legen Sie die Verantwortung von Verlader und Fahrer fest.",
            rechtlich: "Die Ladung ist nach § 22 StVO verkehrssicher zu verstauen und zu sichern; die Verantwortung des Verladers ergibt sich zusätzlich aus § 412 HGB. Die VDI 2700 gilt als anerkannte Regel der Technik."
        },
        "12.2": {
            einfach: "Sortieren Sie kaputte Paletten aus und lagern Sie sie getrennt, bis sie repariert oder entsorgt werden.",
            bghw: "Prüfen Sie Paletten und Ladungsträger vor der Benutzung und sortieren Sie beschädigte gemäß DGUV Information 208-061 aus.",
            rechtlich: "Ladungsträger sind Arbeitsmittel; nach § 4 Abs. 5 BetrSichV dürfen nur sichere Arbeitsmittel verwendet werden, beschädigte sind der Benutzung zu entziehen."
        },
        "12.3": {
            einfach: "Kennzeichnen Sie feste Flächen für ankommende und abgehende Ware.",
            bghw: "Legen Sie gekennzeichnete Bereitstellflächen fest, sodass Verkehrswege gemäß ASR A1.8 frei bleiben.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten; Bereitstellflächen sind entsprechend zu planen (ASR A1.8)."
        },
        "12.4": {
            einfach: "Stapeln Sie Paletten nur so hoch, dass sie sicher stehen, und tauschen Sie schiefe Stapel um.",
            bghw: "Stellen Sie die Standsicherheit von Stapeln gemäß DGUV Information 208-061 sicher und legen Sie zulässige Stapelhöhen in der Gefährdungsbeurteilung fest.",
            rechtlich: "Nach § 4 ArbSchG sind Gefährdungen durch umfallende Lasten zu vermeiden; die zulässigen Stapelhöhen sind in der Gefährdungsbeurteilung nach § 5 ArbSchG festzulegen."
        },
        "12.5": {
            einfach: "Stellen Sie Sicherheitsmesser bereit und achten Sie darauf, dass sie benutzt werden.",
            bghw: "Stellen Sie geeignete Sicherheitsmesser und bei Bedarf Schnittschutzhandschuhe bereit; Umreifungsbänder nur mit Bandschere öffnen.",
            rechtlich: "Der Arbeitgeber hat nach § 5 BetrSichV geeignete Arbeitsmittel bereitzustellen und nach § 2 PSA-Benutzungsverordnung erforderliche PSA zur Verfügung zu stellen."
        },
        "12.6": {
            einfach: "Klären Sie vor dem Befahren, ob Ladefläche und Ladebrücke das Gewicht tragen, und regeln Sie den Ablauf.",
            bghw: "Legen Sie das Befahren von Ladeflächen fest (Tragfähigkeit, Spaltüberbrückung, Sicherung) gemäß DGUV Vorschrift 68 und Herstellerangaben.",
            rechtlich: "Flurförderzeuge dürfen nach DGUV Vorschrift 68 nur auf ausreichend tragfähigen Flächen eingesetzt werden; das Verfahren ist nach § 5 ArbSchG festzulegen."
        }
    },
    "Rollcontainer": {
        "13.1": {
            einfach: "Sortieren Sie kaputte Rollcontainer sofort aus und markieren Sie sie bis zur Reparatur.",
            bghw: "Legen Sie eine regelmäßige Kontrolle und ein Aussortierverfahren für Rollbehälter (DIN EN 12674) fest.",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 5 BetrSichV vor der Verwendung zu kontrollieren; mangelhafte Arbeitsmittel dürfen nicht verwendet werden."
        },
        "13.2": {
            einfach: "Beladen Sie Rollcontainer nicht zu schwer und nicht so hoch, dass Sie nicht mehr darüber sehen.",
            bghw: "Legen Sie Beladungsregeln (Traglast, Schwerpunkt, Ladehöhe) in der Betriebsanweisung fest.",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur bestimmungsgemäß verwendet werden; die Beladungsregeln sind nach § 12 BetrSichV zu unterweisen."
        },
        "13.3": {
            einfach: "Sichern Sie lose Ware im Rollcontainer mit Netz oder Gurt.",
            bghw: "Sichern Sie die Ladung in Rollbehältern mit geeigneten Hilfsmitteln.",
            rechtlich: "Nach § 4 ArbSchG sind Gefährdungen durch herabfallende Ladung zu vermeiden."
        },
        "13.4": {
            einfach: "Schieben Sie Rollcontainer und bewegen Sie nur so viele gleichzeitig, wie es die Regel erlaubt.",
            bghw: "Beurteilen Sie Ziehen und Schieben mit der Leitmerkmalmethode und legen Sie die zulässige Anzahl in der Betriebsanweisung fest.",
            rechtlich: "Nach § 2 LasthandhabV i. V. m. § 5 ArbSchG sind Gefährdungen beim Ziehen und Schieben zu beurteilen und zu begrenzen."
        },
        "13.5": {
            einfach: "Hängen Sie mehrere Rollcontainer nur mit dem dafür vorgesehenen Schlepper und der passenden Kupplung zusammen.",
            bghw: "Setzen Sie für Rollcontainerzüge nur geeignete Schlepper und Kupplungen gemäß DGUV Vorschrift 68 und Herstellerangaben ein.",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur bestimmungsgemäß und in zulässiger Kombination verwendet werden."
        },
        "13.6": {
            einfach: "Bewegen Sie Rollcontainer auf Schrägen langsam, mit Feststeller und nicht allein, wenn er schwer ist.",
            bghw: "Legen Sie Regeln für Gefälle, Rampen und Ladebordwände fest und unterweisen Sie die Beschäftigten.",
            rechtlich: "Die Gefährdung durch wegrollende Lasten ist nach § 5 ArbSchG zu beurteilen; die Beschäftigten sind nach § 12 ArbSchG zu unterweisen."
        },
        "13.7": {
            einfach: "Fassen Sie Rollcontainer nur an den Griffen an und tragen Sie Sicherheitsschuhe.",
            bghw: "Unterweisen Sie zu Quetschstellen und stellen Sie PSA gemäß Gefährdungsbeurteilung bereit (DGUV Regel 112-191).",
            rechtlich: "Erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen; die Beschäftigten sind nach § 12 ArbSchG zu unterweisen."
        },
        "13.8": {
            einfach: "Sichern Sie Rollcontainer im Lkw mit Sperrstangen oder Gurten.",
            bghw: "Sichern Sie Rollbehälter nach VDI 2700 und den Vorgaben des Fahrzeugherstellers.",
            rechtlich: "Die Ladung ist nach § 22 StVO verkehrssicher zu verstauen und zu sichern; die Verladerpflichten ergeben sich zusätzlich aus § 412 HGB."
        },
        "13.9": {
            einfach: "Stellen Sie Rollcontainer nur auf festen Plätzen ab und nie vor Notausgänge.",
            bghw: "Legen Sie Abstellflächen für Rollbehälter fest und halten Sie Flucht- und Verkehrswege gemäß ASR A2.3 und ASR A1.8 frei.",
            rechtlich: "Flucht- und Verkehrswege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten."
        }
    },
    "Verpackungsmaschinen": {
        "14.1": {
            einfach: "Prüfen Sie, ob jede Maschine ein CE-Zeichen hat und eine deutsche Anleitung vorhanden ist.",
            bghw: "Prüfen Sie CE-Kennzeichnung und Unterlagen nach Maschinenrichtlinie bzw. Maschinenverordnung vor der Bereitstellung.",
            rechtlich: "Nach § 5 Abs. 3 BetrSichV dürfen nur Arbeitsmittel bereitgestellt werden, die den Rechtsvorschriften über Sicherheit und Gesundheitsschutz entsprechen (u. a. Maschinenrichtlinie, ProdSG)."
        },
        "14.2": {
            einfach: "Prüfen Sie, ob alle Schutzgitter und Lichtschranken funktionieren und nicht überbrückt sind.",
            bghw: "Prüfen Sie die Schutzeinrichtungen regelmäßig gemäß Herstellerangaben und der DIN-EN-415-Reihe.",
            rechtlich: "Schutzeinrichtungen dürfen nach § 6 BetrSichV nicht umgangen oder unwirksam gemacht werden; Manipulationen sind zu unterbinden."
        },
        "14.3": {
            einfach: "Testen Sie regelmäßig, ob der Not-Aus die Maschine sofort stoppt.",
            bghw: "Legen Sie Funktionsprüfungen der Not-Halt-Einrichtungen gemäß Herstellerangaben fest.",
            rechtlich: "Arbeitsmittel müssen nach § 9 Abs. 1 BetrSichV mit wirksamen Not-Halt-Einrichtungen ausgestattet sein, soweit erforderlich."
        },
        "14.4": {
            einfach: "Halten Sie Abstand zum laufenden Palettenwickler und markieren Sie den Gefahrbereich am Boden.",
            bghw: "Sichern Sie Palettenwickler gemäß DIN EN 415-6 und kennzeichnen Sie den Gefahrbereich gemäß ASR A1.3.",
            rechtlich: "Gefahrbereiche sind nach § 9 BetrSichV zu sichern bzw. zu kennzeichnen."
        },
        "14.5": {
            einfach: "Tragen Sie beim Umreifen eine Schutzbrille.",
            bghw: "Stellen Sie Augenschutz gemäß Gefährdungsbeurteilung bereit und betreiben Sie Umreifungsmaschinen gemäß DIN EN 415-8.",
            rechtlich: "Erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen; die Gefährdungen sind nach § 12 BetrSichV zu unterweisen."
        },
        "14.6": {
            einfach: "Achten Sie auf heiße Teile und lassen Sie Schrumpfpistolen nur von eingewiesenen Personen benutzen.",
            bghw: "Sichern Sie heiße Oberflächen und betreiben Sie gasbetriebene Schrumpfgeräte gemäß DGUV Regel 110-010.",
            rechtlich: "Gefährdungen durch heiße Oberflächen und Brand sind nach § 5 ArbSchG zu beurteilen; für Flüssiggas gilt DGUV Regel 110-010."
        },
        "14.7": {
            einfach: "Schalten Sie die Maschine vor dem Folienwechsel aus und sichern Sie sie.",
            bghw: "Legen Sie Verfahren für Rüsten, Folienwechsel und Störungsbeseitigung gemäß Herstellerangaben fest.",
            rechtlich: "Instandhaltung und Störungsbeseitigung dürfen nach § 10 Abs. 3 BetrSichV nur im sicheren Zustand erfolgen."
        },
        "14.8": {
            einfach: "Lassen Sie die Verpackungsmaschinen regelmäßig prüfen.",
            bghw: "Lassen Sie Verpackungsmaschinen gemäß BetrSichV und Herstellerangaben wiederkehrend prüfen.",
            rechtlich: "Nach § 3 Abs. 6 und § 14 BetrSichV sind Art, Umfang und Fristen der Prüfung festzulegen und die Ergebnisse aufzuzeichnen."
        },
        "14.9": {
            einfach: "Lassen Sie nur eingewiesene Personen an die Verpackungsmaschinen und hängen Sie die Anleitung aus.",
            bghw: "Erstellen Sie Betriebsanweisungen und beauftragen Sie die Bedienpersonen.",
            rechtlich: "Nach § 12 BetrSichV sind Betriebsanweisung und Unterweisung erforderlich; besondere Gefährdungen erfordern nach § 12 Abs. 3 BetrSichV eine Beauftragung."
        },
        "14.10": {
            einfach: "Nutzen Sie für schwere Folienrollen eine Hebehilfe oder arbeiten Sie zu zweit.",
            bghw: "Beurteilen Sie den Rollenwechsel nach LasthandhabV und stellen Sie Hilfsmittel bereit.",
            rechtlich: "Nach § 2 LasthandhabV sind geeignete Arbeitsmittel zur Vermeidung gesundheitsgefährdender Lastenhandhabung einzusetzen."
        }
    },
    "Lager": {
        "15.1": {
            einfach: "Markieren Sie Lagerflächen und achten Sie darauf, dass Ware nur dort gelagert wird.",
            bghw: "Kennzeichnen Sie Lagerflächen und legen Sie eine Lagerordnung gemäß DGUV Information 208-061 fest.",
            rechtlich: "Lagerflächen sind so zu organisieren, dass Verkehrswege nach § 4 Abs. 4 ArbStättV frei bleiben und Gefährdungen nach § 4 ArbSchG vermieden werden."
        },
        "15.2": {
            einfach: "Halten Sie Fluchtwege und Notausgänge im Lager frei und lassen Sie defekte Notleuchten tauschen.",
            bghw: "Halten Sie Fluchtwege gemäß ASR A2.3 frei, kennzeichnen Sie sie gemäß ASR A1.3 und prüfen Sie die Sicherheitsbeleuchtung gemäß DIN EN 50172.",
            rechtlich: "Fluchtwege und Notausgänge sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten und nach Anhang Nr. 2.3 ArbStättV zu kennzeichnen; die Sicherheitsbeleuchtung ist wiederkehrend zu prüfen."
        },
        "15.3": {
            einfach: "Lagern Sie schwere Ware unten und leichte oben, damit niemand schwer über Kopf heben muss.",
            bghw: "Gestalten Sie die Lagerung ergonomisch gemäß LasthandhabV und der Gefährdungsbeurteilung (schwere Lasten in Greifhöhe zwischen Hüfte und Schulter).",
            rechtlich: "Nach § 2 LasthandhabV sind Gefährdungen beim manuellen Handhaben von Lasten durch organisatorische Maßnahmen möglichst gering zu halten."
        },
        "15.4": {
            einfach: "Lassen Sie dunkle Regalgassen besser ausleuchten und defekte Leuchten tauschen.",
            bghw: "Stellen Sie die Beleuchtung im Lager gemäß ASR A3.4 sicher; Lagerbereiche mit Lese- oder Suchaufgaben benötigen höhere Beleuchtungsstärken.",
            rechtlich: "Arbeitsstätten müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; die Werte richten sich nach der Sehaufgabe (ASR A3.4)."
        },
        "15.5": {
            einfach: "Stellen Sie genug Tritte und Leitern bereit und verbieten Sie das Klettern auf Regale.",
            bghw: "Stellen Sie geeignete Aufstiegshilfen gemäß DGUV Information 208-016 bereit; das Besteigen von Regalen ist zu untersagen.",
            rechtlich: "Der Arbeitgeber hat nach § 5 BetrSichV geeignete Arbeitsmittel für Arbeiten in der Höhe bereitzustellen; ungeeignete Aufstiegshilfen sind zu untersagen (TRBS 2121-2)."
        },
        "15.6": {
            einfach: "Räumen Sie Folienreste und Bänder sofort weg und wischen Sie Verschüttetes direkt auf.",
            bghw: "Legen Sie Reinigungsintervalle und Zuständigkeiten fest und stellen Sie Abfallbehälter in Arbeitsnähe bereit (ASR A1.5).",
            rechtlich: "Arbeitsstätten sind nach § 4 Abs. 2 ArbStättV den hygienischen Erfordernissen entsprechend zu reinigen; Verunreinigungen, die zu Unfällen führen können, sind unverzüglich zu beseitigen."
        },
        "15.7": {
            einfach: "Prüfen Sie, ob es im Lager zu kalt, zu warm oder zugig ist, und schaffen Sie Abhilfe, z. B. Torvorhänge oder Pausen.",
            bghw: "Beurteilen Sie das Raumklima gemäß ASR A3.5 und legen Sie Maßnahmen gegen Zugluft, Kälte und Hitze fest.",
            rechtlich: "Nach Anhang Nr. 3.5 ArbStättV muss während der Arbeitszeit eine gesundheitlich zuträgliche Raumtemperatur bestehen; Maßnahmen sind in der Gefährdungsbeurteilung nach § 5 ArbSchG festzulegen."
        },
        "15.8": {
            einfach: "Stellen Sie nichts vor Stromverteiler, Feuerlöscher und Brandmelder.",
            bghw: "Halten Sie Bedien- und Zugangsflächen von Elektroverteilern und Brandschutzeinrichtungen gemäß ASR A2.2 und DGUV Vorschrift 3 frei.",
            rechtlich: "Einrichtungen für den Brandschutz sind nach § 4 Abs. 3 ArbStättV und ASR A2.2 jederzeit zugänglich zu halten."
        },
        "15.9": {
            einfach: "Sammeln Sie Folie und Kartons sofort in Behältern und bringen Sie sie regelmäßig weg.",
            bghw: "Begrenzen Sie Brandlasten durch regelmäßige Abfallentsorgung gemäß ASR A2.2.",
            rechtlich: "Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen; Abfälle sind nach § 4 Abs. 2 ArbStättV regelmäßig zu beseitigen."
        }
    },
    "Regale": {
        "16.1": {
            einfach: "Lassen Sie alle Regale einmal im Jahr von einer fachkundigen Person prüfen und bewahren Sie den Bericht auf.",
            bghw: "Lassen Sie Regalanlagen gemäß DIN EN 15635 und DGUV Information 208-061 mindestens jährlich durch eine fachkundige Person inspizieren und dokumentieren Sie das Ergebnis.",
            rechtlich: "Regale sind Arbeitsmittel; nach § 3 Abs. 6 und § 14 BetrSichV sind Art, Umfang und Fristen der Prüfungen festzulegen. Die DIN EN 15635 sieht eine Experteninspektion mindestens alle zwölf Monate vor."
        },
        "16.2": {
            einfach: "Lassen Sie die Regale regelmäßig, z. B. wöchentlich, anschauen und melden Sie Schäden sofort.",
            bghw: "Benennen Sie eine verantwortliche Person für Regalsicherheit und legen Sie regelmäßige Sichtkontrollen gemäß DIN EN 15635 fest.",
            rechtlich: "Nach § 4 Abs. 5 BetrSichV hat sich der Arbeitgeber vor der Verwendung vom sicheren Zustand der Arbeitsmittel zu überzeugen; die DIN EN 15635 sieht regelmäßige Sichtkontrollen vor."
        },
        "16.3": {
            einfach: "Bringen Sie an jedem Regal ein Schild mit der erlaubten Last an und überladen Sie die Fächer nicht.",
            bghw: "Bringen Sie Belastungsschilder gemäß DGUV Information 208-061 und DIN EN 15635 an und kontrollieren Sie die Einhaltung.",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur bestimmungsgemäß verwendet werden; die zulässigen Belastungen müssen dafür erkennbar sein (DGUV Information 208-061)."
        },
        "16.4": {
            einfach: "Entladen Sie beschädigte Regalfelder sofort, sperren Sie sie ab und lassen Sie die Teile tauschen.",
            bghw: "Bewerten Sie Schäden nach dem Ampelschema der DIN EN 15635 (grün/gelb/rot); rote Schäden sofort entlasten und sperren, gelbe zeitnah reparieren.",
            rechtlich: "Arbeitsmittel mit sicherheitsrelevanten Mängeln dürfen nach § 4 Abs. 5 BetrSichV nicht verwendet werden; Instandsetzungen sind nach § 10 BetrSichV durchzuführen."
        },
        "16.5": {
            einfach: "Bringen Sie an Regalecken in Fahrwegen einen gelb-schwarzen Anfahrschutz an und tauschen Sie beschädigten aus.",
            bghw: "Statten Sie Regalecken und Durchfahrten gemäß DGUV Information 208-061 mit Anfahrschutz (mindestens 0,3 m hoch) aus und kennzeichnen Sie diesen gelb-schwarz nach ASR A1.3.",
            rechtlich: "Gefahren sind nach § 4 Nr. 1 ArbSchG an der Quelle zu bekämpfen; Anfahrschutz und Kennzeichnung konkretisieren die DGUV Information 208-061 und ASR A1.3."
        },
        "16.6": {
            einfach: "Bringen Sie an der Rückseite der Regale eine Sicherung an, damit nichts in den Nachbargang fällt.",
            bghw: "Sehen Sie Durchschubsicherungen gemäß DGUV Information 208-061 vor, wo Ladeeinheiten in Verkehrswege oder Arbeitsplätze geschoben werden können.",
            rechtlich: "Nach § 4 ArbSchG sind Gefährdungen durch herabfallende Lasten zu vermeiden; die DGUV Information 208-061 konkretisiert die Anforderungen an Durchschubsicherungen."
        },
        "16.7": {
            einfach: "Legen Sie Paletten mittig auf die Traversen und lagern Sie nur heile Paletten ein.",
            bghw: "Lagern Sie Ladeeinheiten gemäß DGUV Information 208-061 und Herstellerangaben ein (mittig, ohne unzulässigen Überstand, mit intakten Ladungsträgern).",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 1 BetrSichV bestimmungsgemäß zu verwenden; Ladeeinheiten müssen standsicher eingelagert werden."
        },
        "16.8": {
            einfach: "Lassen Sie Regale fest am Boden oder an der Wand befestigen, damit sie nicht kippen können.",
            bghw: "Stellen Sie die Standsicherheit der Regale gemäß Herstellerangaben und DGUV Information 208-061 sicher (Verankerung, Fußplatten, Verbindungen).",
            rechtlich: "Regale müssen nach § 5 BetrSichV standsicher aufgestellt sein; die Aufstellung hat nach Herstellerangaben zu erfolgen."
        },
        "16.9": {
            einfach: "Sichern Sie Durchgänge unter Regalen mit Netzen oder Abdeckungen gegen herabfallende Ware.",
            bghw: "Sichern Sie Durchgänge und Durchfahrten in Regalanlagen gemäß DGUV Information 208-061 gegen herabfallende Gegenstände.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV so zu gestalten, dass Beschäftigte nicht durch herabfallende Gegenstände gefährdet werden."
        },
        "16.10": {
            einfach: "Sorgen Sie dafür, dass niemand in einen Schmalgang geht, solange dort ein Gerät fährt.",
            bghw: "Stellen Sie den Personenschutz in Schmalganglagern gemäß DIN 15185-2 und DGUV Information 208-061 sicher.",
            rechtlich: "Gefahrenbereiche sind nach § 9 BetrSichV abzusichern; die DIN 15185-2 beschreibt Personenschutzanlagen für Schmalgänge."
        },
        "16.11": {
            einfach: "Befestigen Sie Fachboden- und Kragarmregale und kennzeichnen Sie die erlaubte Last.",
            bghw: "Sichern Sie Fachboden- und Kragarmregale gemäß Herstellerangaben und DGUV Information 208-061 gegen Kippen und kennzeichnen Sie die Belastung.",
            rechtlich: "Lagereinrichtungen müssen nach § 5 BetrSichV standsicher sein; die zulässigen Belastungen müssen erkennbar sein."
        },
        "16.12": {
            einfach: "Bringen Sie nach der Regalprüfung eine Plakette mit dem Prüfdatum an.",
            bghw: "Kennzeichnen Sie das Ergebnis der Experteninspektion gemäß DIN EN 15635 sichtbar an der Regalanlage.",
            rechtlich: "Die Prüfergebnisse sind nach § 14 Abs. 7 BetrSichV aufzuzeichnen; eine Kennzeichnung am Arbeitsmittel unterstützt den Nachweis."
        }
    },
    "Regalbediengeräte": {
        "17.1": {
            einfach: "Lassen Sie die Regalbediengeräte regelmäßig von einer Fachfirma prüfen und heben Sie den Nachweis auf.",
            bghw: "Lassen Sie Regalbediengeräte gemäß BetrSichV und Herstellerangaben (DIN EN 528) wiederkehrend prüfen, in der Regel mindestens jährlich.",
            rechtlich: "Nach § 3 Abs. 6 und § 14 BetrSichV sind Prüffristen festzulegen und die Prüfungen durch eine zur Prüfung befähigte Person durchzuführen und aufzuzeichnen."
        },
        "17.2": {
            einfach: "Sorgen Sie dafür, dass niemand in die Gasse kann, solange das Gerät fährt.",
            bghw: "Stellen Sie die Zugangssicherung (trennende Schutzeinrichtungen, verriegelte Zugangstüren) gemäß DIN EN 528 und Herstellerangaben sicher.",
            rechtlich: "Schutzeinrichtungen dürfen nach § 6 BetrSichV nicht umgangen oder unwirksam gemacht werden; Gefahrenbereiche sind nach § 9 BetrSichV abzusichern."
        },
        "17.3": {
            einfach: "Prüfen Sie, ob die Not-Aus-Taster gut erreichbar sind und funktionieren.",
            bghw: "Prüfen Sie Not-Halt-Einrichtungen regelmäßig gemäß Herstellerangaben und DIN EN 528.",
            rechtlich: "Arbeitsmittel müssen nach § 9 Abs. 1 BetrSichV mit wirksamen Not-Halt-Einrichtungen ausgestattet sein, soweit dies erforderlich ist."
        },
        "17.4": {
            einfach: "Lassen Sie nur geschulte und beauftragte Personen an die Geräte und in die Gassen.",
            bghw: "Beauftragen Sie Bedien- und Wartungspersonal schriftlich und unterweisen Sie es gemäß Betriebsanweisung und Herstellerangaben.",
            rechtlich: "Die Verwendung von Arbeitsmitteln mit besonderen Gefährdungen ist nach § 12 Abs. 3 BetrSichV beauftragten Beschäftigten vorzubehalten; diese sind nach § 12 Abs. 1 BetrSichV zu unterweisen."
        },
        "17.5": {
            einfach: "Legen Sie schriftlich fest, wie Störungen sicher behoben werden und wie eine Person aus dem Gerät gerettet wird.",
            bghw: "Legen Sie ein Verfahren für Instandhaltung, Störungsbeseitigung und Personenbergung gemäß BetrSichV und Herstellerangaben fest.",
            rechtlich: "Instandhaltungsarbeiten sind nach § 10 BetrSichV nur im sicheren Zustand durchzuführen; Rettungsmaßnahmen sind nach § 10 ArbSchG zu planen."
        },
        "17.6": {
            einfach: "Hängen Sie eine verständliche Betriebsanweisung am Gerät aus.",
            bghw: "Erstellen Sie eine Betriebsanweisung gemäß BetrSichV unter Berücksichtigung der Herstellerangaben.",
            rechtlich: "Nach § 12 Abs. 2 BetrSichV hat der Arbeitgeber den Beschäftigten eine schriftliche Betriebsanweisung in verständlicher Form und Sprache zur Verfügung zu stellen."
        }
    },
    "Kommissionierung": {
        "18.1": {
            einfach: "Prüfen Sie, wie schwer und wie oft gehoben wird, und schreiben Sie das in die Gefährdungsbeurteilung.",
            bghw: "Beurteilen Sie Heben, Halten und Tragen mit der Leitmerkmalmethode der BAuA und leiten Sie Maßnahmen ab.",
            rechtlich: "Nach § 2 LasthandhabV i. V. m. § 5 ArbSchG sind die Arbeitsbedingungen beim manuellen Handhaben von Lasten zu beurteilen."
        },
        "18.2": {
            einfach: "Lagern Sie schwere und oft gebrauchte Ware so, dass man sie ohne Bücken und Strecken greifen kann.",
            bghw: "Gestalten Sie die Greifzonen ergonomisch gemäß LasthandhabV und Gefährdungsbeurteilung.",
            rechtlich: "Nach § 2 LasthandhabV sind geeignete organisatorische Maßnahmen zu treffen, um Gefährdungen beim manuellen Handhaben von Lasten möglichst gering zu halten."
        },
        "18.3": {
            einfach: "Stellen Sie Hebehilfen bereit und achten Sie darauf, dass sie benutzt werden.",
            bghw: "Stellen Sie geeignete mechanische Hilfsmittel gemäß LasthandhabV bereit.",
            rechtlich: "Nach § 2 Abs. 1 LasthandhabV sind geeignete Arbeitsmittel, insbesondere mechanische Ausrüstungen, einzusetzen, um manuelle Lastenhandhabung zu vermeiden."
        },
        "18.4": {
            einfach: "Achten Sie darauf, dass Scanner und Headsets leicht sind, gut sitzen und gut lesbar bzw. hörbar sind.",
            bghw: "Beurteilen Sie die Ergonomie der Kommissioniertechnik im Rahmen der Gefährdungsbeurteilung und beziehen Sie die Beschäftigten ein.",
            rechtlich: "Die Arbeit ist nach § 4 Nr. 1 ArbSchG so zu gestalten, dass Gefährdungen vermieden werden; ergonomische Aspekte sind Teil der Gefährdungsbeurteilung nach § 5 ArbSchG."
        },
        "18.5": {
            einfach: "Prüfen Sie, ob das Arbeitstempo zu hoch ist, und achten Sie auf ausreichende Pausen.",
            bghw: "Berücksichtigen Sie psychische und körperliche Belastung durch Leistungsvorgaben in der Gefährdungsbeurteilung und halten Sie die Pausenregelungen ein.",
            rechtlich: "Nach § 5 Abs. 3 Nr. 6 ArbSchG ist die psychische Belastung zu beurteilen; Ruhepausen sind nach § 4 ArbZG zu gewähren."
        },
        "18.6": {
            einfach: "Bieten Sie Beschäftigten mit schwerem Heben und Tragen eine Beratung beim Betriebsarzt an.",
            bghw: "Bieten Sie Angebotsvorsorge bei wesentlich erhöhter Belastung des Muskel-Skelett-Systems nach ArbMedVV an.",
            rechtlich: "Nach § 5 ArbMedVV i. V. m. ArbMedVV Anhang Teil 3 ist bei Tätigkeiten mit wesentlich erhöhten körperlichen Belastungen Angebotsvorsorge anzubieten."
        },
        "18.7": {
            einfach: "Sortieren Sie defekte Rollcontainer aus und beladen Sie sie nur so, dass sie sicher stehen.",
            bghw: "Kontrollieren Sie Rollcontainer und Kommissionierwagen regelmäßig und legen Sie zulässige Beladungshöhen fest.",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 5 BetrSichV vor der Verwendung zu kontrollieren und nach § 4 Abs. 1 BetrSichV bestimmungsgemäß zu verwenden."
        },
        "18.8": {
            einfach: "Achten Sie darauf, dass auf hochfahrenden Kommissionierern der Gurt bzw. der Seitenschutz benutzt wird.",
            bghw: "Stellen Sie die Benutzung der Absturzsicherungen an Vertikalkommissionierern gemäß Herstellerangaben und DGUV Vorschrift 68 sicher.",
            rechtlich: "Schutzeinrichtungen sind nach § 6 BetrSichV zu benutzen und dürfen nicht unwirksam gemacht werden."
        },
        "18.9": {
            einfach: "Lagern Sie häufig gebrauchte Ware nahe und in guter Greifhöhe.",
            bghw: "Optimieren Sie Lagerorte nach Zugriffshäufigkeit und Gewicht gemäß Gefährdungsbeurteilung und LasthandhabV.",
            rechtlich: "Nach § 2 LasthandhabV sind organisatorische Maßnahmen zur Verringerung der Belastung zu treffen."
        }
    },
    "Kühlung und Tiefkühlung": {
        "19.1": {
            einfach: "Prüfen Sie regelmäßig, ob die Kühlraumtüren von innen aufgehen, auch wenn sie abgeschlossen sind.",
            bghw: "Stellen Sie die Notöffnung der Kühlraumtüren gemäß ASR A1.7 und DIN EN 378 sicher und prüfen Sie sie regelmäßig auf Vereisung.",
            rechtlich: "Türen von begehbaren Kühlräumen müssen nach ASR A1.7 jederzeit von innen ohne fremde Hilfsmittel geöffnet werden können; dies ist regelmäßig zu kontrollieren."
        },
        "19.2": {
            einfach: "Prüfen Sie, ob der Notruf-Taster im Kühlraum funktioniert und gut zu finden ist.",
            bghw: "Statten Sie begehbare Kühlräume mit einer Notrufeinrichtung gemäß DIN EN 378 aus und prüfen Sie diese regelmäßig.",
            rechtlich: "Nach § 10 ArbSchG sind Maßnahmen für Notfälle zu treffen; die DIN EN 378 sieht Alarmeinrichtungen in begehbaren Kühlräumen vor."
        },
        "19.3": {
            einfach: "Stellen Sie warme Schutzkleidung, Handschuhe und Schuhe bereit und achten Sie darauf, dass sie getragen werden.",
            bghw: "Stellen Sie Kälteschutzkleidung gemäß Gefährdungsbeurteilung (DIN EN 342) bereit und kontrollieren Sie die Benutzung.",
            rechtlich: "Erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen und von den Beschäftigten nach § 15 ArbSchG zu benutzen."
        },
        "19.4": {
            einfach: "Legen Sie fest, wie lange am Stück in der Kälte gearbeitet wird, und sorgen Sie für Aufwärmpausen.",
            bghw: "Legen Sie Expositions- und Aufwärmzeiten in der Gefährdungsbeurteilung fest; Hinweise gibt die DIN 33403-5 (Kältearbeitsplätze).",
            rechtlich: "Nach § 5 ArbSchG ist die Gefährdung durch Kälte zu beurteilen; Aufwärmzeiten sind als organisatorische Maßnahme nach § 4 ArbSchG festzulegen."
        },
        "19.5": {
            einfach: "Schicken Sie Beschäftigte, die im Tiefkühlbereich bei −25 °C oder kälter arbeiten, regelmäßig zum Betriebsarzt.",
            bghw: "Veranlassen Sie die Pflichtvorsorge nach ArbMedVV für Tätigkeiten mit extremer Kältebelastung.",
            rechtlich: "Nach § 4 ArbMedVV i. V. m. ArbMedVV Anhang Teil 3 ist bei Tätigkeiten mit extremer Kältebelastung (−25 °C und kälter) Pflichtvorsorge zu veranlassen."
        },
        "19.6": {
            einfach: "Entfernen Sie Eis auf dem Boden sofort und kennzeichnen Sie glatte Stellen.",
            bghw: "Beseitigen Sie Vereisungen und sorgen Sie für rutschhemmende Böden gemäß ASR A1.5.",
            rechtlich: "Fußböden müssen nach Anhang Nr. 1.5 ArbStättV rutschhemmend und frei von Stolperstellen sein (ASR A1.5)."
        },
        "19.7": {
            einfach: "Lassen Sie die Kältemittel-Warnanlage regelmäßig prüfen und halten Sie die Sensoren frei.",
            bghw: "Stellen Sie die Gaswarnanlage gemäß DIN EN 378 und Herstellerangaben sicher und lassen Sie sie wiederkehrend prüfen.",
            rechtlich: "Kälteanlagen sind nach BetrSichV und DIN EN 378 sicher zu betreiben; Warneinrichtungen sind nach § 14 BetrSichV wiederkehrend zu prüfen."
        },
        "19.8": {
            einfach: "Erklären Sie den Beschäftigten die Gefahren im Kühlraum und was im Notfall zu tun ist.",
            bghw: "Unterweisen Sie die Beschäftigten mindestens jährlich zu Gefahren in Kühlbereichen (DGUV Vorschrift 1).",
            rechtlich: "Die Beschäftigten sind nach § 12 ArbSchG und § 4 DGUV Vorschrift 1 vor Aufnahme der Tätigkeit und danach mindestens jährlich zu unterweisen."
        },
        "19.9": {
            einfach: "Schauen Sie vor dem Abschließen nach, ob noch jemand im Kühlraum ist.",
            bghw: "Legen Sie ein Kontrollverfahren für das Verschließen von Kühlräumen fest und unterweisen Sie die Beschäftigten.",
            rechtlich: "Nach § 10 ArbSchG sind Maßnahmen für Notfälle festzulegen; das Verfahren ist Teil der Gefährdungsbeurteilung nach § 5 ArbSchG."
        },
        "19.10": {
            einfach: "Lassen Sie vereiste Türen und kaputte Dichtungen reparieren.",
            bghw: "Halten Sie Kühlraumabschlüsse und Türheizungen gemäß Herstellerangaben instand.",
            rechtlich: "Türen und Tore sind nach § 4 Abs. 1 ArbStättV instand zu halten; Mängel sind unverzüglich zu beseitigen."
        }
    },
    "Absturzsicherung": {
        "20.1": {
            einfach: "Sichern Sie offene Kanten an Bühnen und Podesten mit einem stabilen Geländer.",
            bghw: "Sichern Sie Absturzkanten gemäß ASR A2.1 mit Geländern (Höhe mindestens 1,00 m, bei Absturzhöhen über 12 m mindestens 1,10 m) mit Knieleiste und Fußleiste.",
            rechtlich: "Nach Anhang Nr. 2.1 ArbStättV sind Arbeitsplätze und Verkehrswege mit Absturzgefahr mit Schutzvorrichtungen zu versehen; die ASR A2.1 sieht dies ab einer Absturzhöhe von 1 m vor."
        },
        "20.2": {
            einfach: "Sorgen Sie dafür, dass an der Palettenaufgabe auf der Bühne immer eine Absicherung geschlossen ist.",
            bghw: "Sichern Sie Übergabestellen gemäß ASR A2.1 und DGUV Information 208-061 mit Einrichtungen, die zu keinem Zeitpunkt eine offene Absturzkante zulassen.",
            rechtlich: "Absturzgefährdete Bereiche sind nach Anhang Nr. 2.1 ArbStättV auch während Be- und Entladevorgängen zu sichern; technische Maßnahmen haben nach § 4 Nr. 5 ArbSchG Vorrang."
        },
        "20.3": {
            einfach: "Decken Sie Bodenöffnungen sicher ab oder sperren Sie sie mit einem Geländer ab.",
            bghw: "Sichern Sie Bodenöffnungen gemäß ASR A2.1 durch tragfähige, unverschiebbare Abdeckungen oder Umwehrungen.",
            rechtlich: "Nach Anhang Nr. 2.1 ArbStättV sind Öffnungen im Boden, in die Beschäftigte hineinfallen können, zu sichern (ASR A2.1)."
        },
        "20.4": {
            einfach: "Stellen Sie genug sichere Leitern und Tritte bereit und sortieren Sie kaputte sofort aus.",
            bghw: "Stellen Sie geeignete Leitern und Tritte bereit und lassen Sie diese gemäß DGUV Information 208-016 wiederkehrend prüfen (Empfehlung: mindestens jährlich).",
            rechtlich: "Leitern sind Arbeitsmittel; nach § 3 Abs. 6 und § 14 BetrSichV sind Art und Fristen der Prüfung festzulegen. Die TRBS 2121-2 regelt die Verwendung von Leitern."
        },
        "20.5": {
            einfach: "Achten Sie darauf, dass Leitern richtig benutzt werden und niemand sich seitlich hinauslehnt.",
            bghw: "Unterweisen Sie die Beschäftigten im sicheren Umgang mit Leitern gemäß DGUV Information 208-016 und TRBS 2121-2.",
            rechtlich: "Leitern dürfen nach TRBS 2121-2 nur verwendet werden, wenn wegen geringer Gefährdung und kurzer Dauer andere Arbeitsmittel nicht verhältnismäßig sind; die Unterweisung erfolgt nach § 12 BetrSichV."
        },
        "20.6": {
            einfach: "Lassen Sie Gurte und Seile gegen Absturz einmal im Jahr prüfen und sortieren Sie beschädigte aus.",
            bghw: "Lassen Sie PSA gegen Absturz gemäß DGUV Regel 112-198 und DGUV Grundsatz 312-906 mindestens jährlich durch einen Sachkundigen prüfen.",
            rechtlich: "PSA gegen Absturz ist nach § 2 PSA-Benutzungsverordnung bereitzustellen und in ordnungsgemäßem Zustand zu halten; die DGUV Regel 112-198 sieht eine Prüfung mindestens jährlich vor."
        },
        "20.7": {
            einfach: "Üben Sie das Anlegen der Absturzsicherung mit den Beschäftigten und legen Sie fest, wie eine hängende Person gerettet wird.",
            bghw: "Führen Sie Unterweisungen mit praktischen Übungen gemäß DGUV Regel 112-198 durch und legen Sie ein Rettungskonzept fest.",
            rechtlich: "Für PSA gegen tödliche Gefahren ist nach § 3 Abs. 2 PSA-Benutzungsverordnung eine Unterweisung mit Übungen durchzuführen; Rettungsmaßnahmen sind nach § 10 ArbSchG festzulegen."
        }
    },
    "Leergutzentrum": {
        "21.1": {
            einfach: "Prüfen Sie, ob Schutzgitter und Not-Aus der Sortieranlage funktionieren.",
            bghw: "Prüfen Sie Schutzeinrichtungen und Not-Halt gemäß Herstellerangaben und BetrSichV regelmäßig.",
            rechtlich: "Gefahrstellen sind nach § 9 BetrSichV zu sichern; Schutzeinrichtungen dürfen nach § 6 BetrSichV nicht unwirksam gemacht werden."
        },
        "21.2": {
            einfach: "Lassen Sie die Leergutanlagen jedes Jahr prüfen.",
            bghw: "Lassen Sie die Anlagen gemäß BetrSichV und Herstellerangaben wiederkehrend prüfen.",
            rechtlich: "Nach § 3 Abs. 6 und § 14 BetrSichV sind Art, Umfang und Fristen der Prüfung festzulegen."
        },
        "21.3": {
            einfach: "Greifen Sie bei Stau nie in die laufende Anlage, sondern schalten Sie sie vorher aus.",
            bghw: "Legen Sie ein Verfahren zur Störungsbeseitigung (Stillsetzen, Sichern) in der Betriebsanweisung fest.",
            rechtlich: "Instandhaltung und Störungsbeseitigung dürfen nach § 10 Abs. 3 BetrSichV nur im sicheren Zustand erfolgen."
        },
        "21.4": {
            einfach: "Stapeln Sie Leergut nur so hoch, dass es sicher steht.",
            bghw: "Legen Sie Stapelhöhen für Leergut in der Gefährdungsbeurteilung fest und kennzeichnen Sie sie.",
            rechtlich: "Nach § 4 ArbSchG sind Gefährdungen durch umfallende Stapel zu vermeiden; die Stapelhöhen sind nach § 5 ArbSchG festzulegen."
        },
        "21.5": {
            einfach: "Stellen Sie Handschuhe, Besen und Behälter für Glasscherben bereit und heben Sie Scherben nie mit bloßen Händen auf.",
            bghw: "Stellen Sie Schnittschutzhandschuhe und Hilfsmittel für Glasbruch gemäß Gefährdungsbeurteilung bereit (DGUV Regel 112-195).",
            rechtlich: "Erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen; Arbeitsmittel zur gefahrlosen Beseitigung sind nach § 5 BetrSichV bereitzustellen."
        },
        "21.6": {
            einfach: "Reinigen Sie den Leergutbereich regelmäßig und sorgen Sie für eine Möglichkeit zum Händewaschen.",
            bghw: "Legen Sie einen Reinigungsplan fest und setzen Sie Hygienemaßnahmen gemäß TRBA 500 um.",
            rechtlich: "Arbeitsstätten sind nach § 4 Abs. 2 ArbStättV hygienisch zu reinigen; Tätigkeiten mit verschimmeltem bzw. verunreinigtem Leergut sind nach BioStoffV zu beurteilen."
        },
        "21.7": {
            einfach: "Achten Sie auf eine gute Arbeitshöhe am Sortierband und wechseln Sie die Tätigkeiten.",
            bghw: "Beurteilen Sie die Sortiertätigkeit mit den Leitmerkmalmethoden und gestalten Sie die Arbeitsplätze ergonomisch.",
            rechtlich: "Nach § 2 LasthandhabV und § 5 ArbSchG sind körperliche Belastungen zu beurteilen und zu verringern."
        },
        "21.8": {
            einfach: "Lassen Sie den Lärm messen und stellen Sie Gehörschutz bereit.",
            bghw: "Ermitteln Sie die Lärmexposition gemäß TRLV Lärm und legen Sie Maßnahmen fest.",
            rechtlich: "Nach § 8 LärmVibrationsArbSchV ist ab 80 dB(A) Gehörschutz zur Verfügung zu stellen und ab 85 dB(A) zu tragen."
        },
        "21.9": {
            einfach: "Lagern Sie Kunststoffkisten in Abschnitten mit Abstand und achten Sie auf das Rauchverbot.",
            bghw: "Berücksichtigen Sie die Brandlast im Brandschutzkonzept und stellen Sie Löschmittel gemäß ASR A2.2 bereit.",
            rechtlich: "Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen und durch Maßnahmen nach ASR A2.2 zu verringern."
        },
        "21.10": {
            einfach: "Sorgen Sie für Wetterschutz und warme Arbeitskleidung im Leergutbereich.",
            bghw: "Legen Sie Schutzmaßnahmen gegen Witterung und Zugluft gemäß ASR A3.5 fest.",
            rechtlich: "Nach Anhang Nr. 3.5 ArbStättV sind Beschäftigte bei Arbeiten im Freien oder in nicht allseits umschlossenen Räumen gegen Witterungseinflüsse zu schützen."
        }
    },
    "Fleischwerk – Zerlegung und Messerarbeit": {
        "22.1": {
            einfach: "Achten Sie darauf, dass bei der Arbeit mit dem Messer immer Stechschutzschürze und Kettenhandschuh getragen werden.",
            bghw: "Stellen Sie Stechschutzschürzen (DIN EN ISO 13998) und Metallringgeflecht-Handschuhe (DIN EN 1082-1) in passenden Größen bereit und kontrollieren Sie das Tragen.",
            rechtlich: "Erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen und von den Beschäftigten nach § 15 ArbSchG zu benutzen; die Auswahl erfolgt nach der Gefährdungsbeurteilung."
        },
        "22.2": {
            einfach: "Prüfen Sie Schürzen und Kettenhandschuhe regelmäßig auf Risse und ersetzen Sie beschädigte.",
            bghw: "Legen Sie Kontrolle, Reinigung und Austausch der Stechschutz-PSA gemäß Herstellerangaben fest.",
            rechtlich: "PSA ist nach § 2 Abs. 4 PSA-Benutzungsverordnung durch Wartung, Reparatur und Ersatz in hygienisch einwandfreiem und funktionsfähigem Zustand zu halten."
        },
        "22.3": {
            einfach: "Sorgen Sie für scharfe Messer, regeln Sie das Schleifen und legen Sie Messer nur in Köcher oder Halter.",
            bghw: "Regeln Sie Messerauswahl, Schärfen und sichere Ablage in der Betriebsanweisung und unterweisen Sie die Beschäftigten.",
            rechtlich: "Geeignete Arbeitsmittel sind nach § 5 BetrSichV bereitzustellen; die sichere Verwendung ist nach § 12 BetrSichV zu unterweisen."
        },
        "22.4": {
            einfach: "Sorgen Sie für Schneidtische in passender Höhe und genug Abstand zum Nachbarn.",
            bghw: "Gestalten Sie Zerlegearbeitsplätze ergonomisch (Arbeitshöhe, Bewegungsfläche gemäß ASR A1.2) und vermeiden Sie Gefährdungen durch benachbarte Messerarbeit.",
            rechtlich: "Arbeitsplätze sind nach § 3a ArbStättV so einzurichten, dass Sicherheit und Gesundheit nicht gefährdet werden; ausreichende Bewegungsflächen ergeben sich aus ASR A1.2."
        },
        "22.5": {
            einfach: "Entfernen Sie Fett und Fleischreste sofort vom Boden und tragen Sie rutschhemmende Sicherheitsschuhe.",
            bghw: "Stellen Sie die erforderliche Rutschhemmung gemäß ASR A1.5 sicher (für die Fleischzerlegung in der Regel Bewertungsgruppe R13) und regeln Sie die Zwischenreinigung.",
            rechtlich: "Fußböden müssen nach Anhang Nr. 1.5 ArbStättV rutschhemmend sein; die ASR A1.5 nennt die Bewertungsgruppen je Arbeitsbereich."
        },
        "22.6": {
            einfach: "Setzen Sie für schwere Fleischteile Hebehilfen und die Hängebahn ein.",
            bghw: "Beurteilen Sie die Lastenhandhabung mit der Leitmerkmalmethode und setzen Sie mechanische Hilfsmittel gemäß LasthandhabV ein.",
            rechtlich: "Nach § 2 LasthandhabV ist manuelle Lastenhandhabung, die eine Gefährdung für die Gesundheit mit sich bringt, durch geeignete Arbeitsmittel zu vermeiden."
        },
        "22.7": {
            einfach: "Wechseln Sie die Tätigkeiten regelmäßig und machen Sie Pausen, damit Hände und Arme sich erholen.",
            bghw: "Beurteilen Sie repetitive Tätigkeiten (Leitmerkmalmethode manuelle Arbeitsprozesse) und organisieren Sie Rotation und Pausen.",
            rechtlich: "Nach § 5 ArbSchG ist die Gestaltung von Arbeitsabläufen zu beurteilen; nach ArbMedVV Anhang Teil 3 ist bei wesentlich erhöhten körperlichen Belastungen Angebotsvorsorge anzubieten."
        },
        "22.8": {
            einfach: "Halten Sie Verbandmaterial direkt in der Zerlegung bereit und tragen Sie jede Verletzung ins Verbandbuch ein.",
            bghw: "Stellen Sie Erste-Hilfe-Material arbeitsplatznah gemäß DGUV Information 204-022 bereit und dokumentieren Sie Erste-Hilfe-Leistungen.",
            rechtlich: "Mittel zur Ersten Hilfe sind nach § 25 DGUV Vorschrift 1 leicht erreichbar bereitzuhalten; Erste-Hilfe-Leistungen sind nach § 24 Abs. 6 DGUV Vorschrift 1 zu dokumentieren."
        }
    },
    "Fleischwerk – Maschinen": {
        "23.1": {
            einfach: "Stellen Sie die Schutzhaube der Bandsäge immer auf die Höhe des Fleisches ein und benutzen Sie den Schiebeschlitten.",
            bghw: "Betreiben Sie Bandsägen nur mit den Schutzeinrichtungen nach DIN EN 12268 und unterweisen Sie die Bediener.",
            rechtlich: "Arbeitsmittel dürfen nach § 6 BetrSichV nur mit wirksamen Schutzeinrichtungen verwendet werden; Schutzeinrichtungen dürfen nicht umgangen werden."
        },
        "23.2": {
            einfach: "Greifen Sie nie in den Fleischwolf und benutzen Sie immer den Stopfer.",
            bghw: "Betreiben Sie Fleischwölfe nur mit den Schutzeinrichtungen nach DIN EN 12331.",
            rechtlich: "Nach § 6 BetrSichV dürfen Schutzeinrichtungen nicht unwirksam gemacht werden; Gefahrstellen sind nach § 9 BetrSichV gegen Eingreifen zu sichern."
        },
        "23.3": {
            einfach: "Öffnen Sie Kutter und Mischer erst, wenn sie stillstehen, und lassen Sie defekte Verriegelungen reparieren.",
            bghw: "Prüfen Sie Verriegelungen und Nachlaufsperren regelmäßig gemäß Herstellerangaben und DIN EN 12855.",
            rechtlich: "Schutzeinrichtungen sind nach § 9 BetrSichV wirksam zu halten; Arbeitsmittel mit Mängeln dürfen nach § 4 Abs. 5 BetrSichV nicht verwendet werden."
        },
        "23.4": {
            einfach: "Lassen Sie nur eingewiesene Personen an die Entschwartungsmaschine und arbeiten Sie nur mit Schutzeinrichtung.",
            bghw: "Betreiben Sie die Maschinen gemäß DIN EN 12355 und Herstellerangaben; beauftragen Sie die Bediener schriftlich.",
            rechtlich: "Die Verwendung von Arbeitsmitteln mit besonderen Gefährdungen ist nach § 12 Abs. 3 BetrSichV beauftragten Beschäftigten vorzubehalten."
        },
        "23.5": {
            einfach: "Prüfen Sie, ob die Schutzhauben der Verpackungsmaschinen funktionieren.",
            bghw: "Prüfen Sie die Schutzeinrichtungen gemäß Herstellerangaben und der DIN-EN-415-Reihe.",
            rechtlich: "Gefahrstellen an Arbeitsmitteln sind nach § 9 BetrSichV durch Schutzeinrichtungen zu sichern."
        },
        "23.6": {
            einfach: "Schalten Sie die Maschine zum Reinigen aus, ziehen Sie den Stecker bzw. sichern Sie den Hauptschalter.",
            bghw: "Legen Sie ein Verfahren zum Freischalten und Sichern (z. B. Schloss am Hauptschalter) für Reinigung und Störungsbeseitigung fest.",
            rechtlich: "Instandhaltung und Reinigung dürfen nach § 10 Abs. 3 BetrSichV nur im sicheren Zustand erfolgen; das Arbeitsmittel ist gegen unbeabsichtigtes Wiedereinschalten zu sichern."
        },
        "23.7": {
            einfach: "Lassen Sie Maschinen und elektrische Anlagen in Nassbereichen regelmäßig prüfen.",
            bghw: "Lassen Sie Maschinen gemäß BetrSichV und elektrische Anlagen gemäß DGUV Vorschrift 3 prüfen; in Nassbereichen geeignete Schutzart und Fehlerstrom-Schutzeinrichtungen sicherstellen.",
            rechtlich: "Prüfungen sind nach § 14 BetrSichV und § 5 DGUV Vorschrift 3 festzulegen und durchzuführen; die Ergebnisse sind aufzuzeichnen."
        },
        "23.8": {
            einfach: "Hängen Sie an jeder Maschine eine Anleitung aus, die alle verstehen, und lassen Sie Jugendliche nicht an gefährliche Maschinen.",
            bghw: "Erstellen Sie Betriebsanweisungen (ggf. mehrsprachig bzw. bebildert) und beachten Sie die Beschäftigungsbeschränkungen für Jugendliche.",
            rechtlich: "Nach § 12 Abs. 2 BetrSichV sind Betriebsanweisungen in verständlicher Form und Sprache bereitzustellen; Jugendliche dürfen nach § 22 JArbSchG nicht mit gefährlichen Arbeiten beschäftigt werden, außer zur Ausbildung unter Aufsicht."
        }
    },
    "Fleischwerk – Kälte, Nässe, Reinigung und Hygiene": {
        "24.1": {
            einfach: "Lassen Sie die Ammoniak-Warnanlage regelmäßig prüfen und üben Sie, was bei einem Gasaustritt zu tun ist.",
            bghw: "Stellen Sie Gaswarnanlage, Notfallplan, Fluchtgeräte und Augenduschen gemäß DIN EN 378 und Gefährdungsbeurteilung sicher.",
            rechtlich: "Kälteanlagen sind nach BetrSichV und DIN EN 378 sicher zu betreiben; für Ammoniak sind nach §§ 6, 7 und 13 GefStoffV Schutz- und Notfallmaßnahmen festzulegen."
        },
        "24.2": {
            einfach: "Lassen Sie Hochdruckreiniger jedes Jahr prüfen und tragen Sie beim Reinigen eine Schutzbrille.",
            bghw: "Lassen Sie Flüssigkeitsstrahler gemäß DGUV Regel 100-500 Kapitel 2.36 mindestens jährlich durch einen Sachkundigen prüfen.",
            rechtlich: "Flüssigkeitsstrahler sind nach § 14 BetrSichV wiederkehrend zu prüfen; die DGUV Regel 100-500 Kapitel 2.36 sieht eine mindestens jährliche Prüfung vor."
        },
        "24.3": {
            einfach: "Dosieren Sie Reiniger mit der Anlage, mischen Sie nie verschiedene Mittel und tragen Sie Schutzbrille und Handschuhe.",
            bghw: "Erstellen Sie Betriebsanweisungen gemäß TRGS 555 und stellen Sie Dosiersysteme und PSA bereit.",
            rechtlich: "Nach § 14 GefStoffV sind Betriebsanweisung und Unterweisung erforderlich; nach § 7 GefStoffV sind Schutzmaßnahmen nach dem STOP-Prinzip festzulegen."
        },
        "24.4": {
            einfach: "Hängen Sie einen Hautschutzplan aus und schicken Sie Beschäftigte mit viel Nassarbeit zum Betriebsarzt.",
            bghw: "Legen Sie Hautschutzmaßnahmen gemäß TRGS 401 fest und organisieren Sie die Vorsorge bei Feuchtarbeit nach ArbMedVV.",
            rechtlich: "Bei Feuchtarbeit von regelmäßig mehr als zwei Stunden täglich ist nach ArbMedVV Anhang Teil 1 Angebotsvorsorge anzubieten, ab regelmäßig vier Stunden täglich Pflichtvorsorge zu veranlassen."
        },
        "24.5": {
            einfach: "Sorgen Sie für Waschbecken, saubere Schutzkleidung und essen Sie nur im Pausenraum.",
            bghw: "Setzen Sie die Hygienemaßnahmen gemäß TRBA 500 um.",
            rechtlich: "Tätigkeiten mit biologischen Arbeitsstoffen sind nach § 4 BioStoffV zu beurteilen; die allgemeinen Hygienemaßnahmen nach § 9 BioStoffV und TRBA 500 sind einzuhalten."
        },
        "24.6": {
            einfach: "Lassen Sie den Lärm messen, stellen Sie Gehörschutz bereit und kennzeichnen Sie laute Bereiche.",
            bghw: "Ermitteln Sie die Lärmexposition und setzen Sie Maßnahmen gemäß TRLV Lärm um.",
            rechtlich: "Nach § 8 LärmVibrationsArbSchV ist ab dem unteren Auslösewert von 80 dB(A) Gehörschutz zur Verfügung zu stellen und ab 85 dB(A) zu tragen; Lärmbereiche sind nach § 7 Abs. 4 LärmVibrationsArbSchV zu kennzeichnen."
        },
        "24.7": {
            einfach: "Sorgen Sie in kalten Produktionsräumen für warme Kleidung und Aufwärmpausen.",
            bghw: "Beurteilen Sie Kältearbeitsplätze (Hinweise in DIN 33403-5) und legen Sie Aufwärmzeiten und Schutzkleidung fest.",
            rechtlich: "Die Gefährdung durch Kälte ist nach § 5 ArbSchG zu beurteilen; erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        },
        "24.8": {
            einfach: "Achten Sie auf genug Platz in den Umkleiden und auf rutschfeste Böden an der Stiefelwäsche.",
            bghw: "Gestalten Sie Umkleide- und Waschräume gemäß ASR A4.1 mit getrennter Aufbewahrung und rutschhemmendem Boden (ASR A1.5).",
            rechtlich: "Nach Anhang Nr. 4.1 ArbStättV sind geeignete Umkleide- und Waschräume bereitzustellen; bei hygienischen Anforderungen ist eine getrennte Aufbewahrung erforderlich."
        },
        "24.9": {
            einfach: "Lassen Sie lose oder kaputte Abdeckungen von Abläufen sofort reparieren.",
            bghw: "Halten Sie Bodenabläufe und Abdeckungen gemäß ASR A1.5 trittsicher und eben.",
            rechtlich: "Fußböden müssen nach Anhang Nr. 1.5 ArbStättV frei von Stolperstellen und sicher begehbar sein."
        }
    },
    "Fleischwerk – Fördertechnik, Transport und Organisation": {
        "25.1": {
            einfach: "Prüfen Sie Haken, Weichen und Endanschläge der Hängebahn und halten Sie den Bereich darunter frei.",
            bghw: "Halten Sie Hängebahnen gemäß Herstellerangaben instand und sichern Sie Endanschläge und Weichen.",
            rechtlich: "Arbeitsmittel sind nach § 10 BetrSichV instand zu halten; Gefährdungen durch herabfallende Lasten sind nach § 4 ArbSchG zu vermeiden."
        },
        "25.2": {
            einfach: "Lassen Sie Hebezeuge und Hebebühnen jedes Jahr prüfen.",
            bghw: "Lassen Sie Hebezeuge gemäß DGUV Vorschrift 52 bzw. DGUV Regel 109-017 mindestens jährlich prüfen.",
            rechtlich: "Hebezeuge und Lastaufnahmeeinrichtungen sind nach § 14 BetrSichV wiederkehrend zu prüfen."
        },
        "25.3": {
            einfach: "Stapeln Sie Kisten nicht zu hoch und achten Sie auf das Gewicht gefüllter Kisten.",
            bghw: "Legen Sie Stapelhöhen und Füllgewichte fest und betreiben Sie Kistenwaschanlagen nur mit Schutzeinrichtungen.",
            rechtlich: "Lastenhandhabungen sind nach § 2 LasthandhabV zu beurteilen; Schutzeinrichtungen sind nach § 6 BetrSichV wirksam zu halten."
        },
        "25.4": {
            einfach: "Setzen Sie in nassen und kalten Bereichen nur dafür geeignete Hubwagen ein.",
            bghw: "Wählen Sie Flurförderzeuge für die Einsatzbedingungen aus (Feuchte, Kälte) gemäß Herstellerangaben und DGUV Vorschrift 68.",
            rechtlich: "Nach § 5 Abs. 1 BetrSichV dürfen nur Arbeitsmittel verwendet werden, die für die Arbeitsbedingungen geeignet sind."
        },
        "25.5": {
            einfach: "Erfassen Sie die Arbeitszeiten elektronisch und prüfen Sie, ob Fremdpersonal in Zerlegung und Verarbeitung erlaubt ist.",
            bghw: "Beachten Sie die Vorgaben des GSA Fleisch zur elektronischen Arbeitszeiterfassung und zum Einsatz von Fremdpersonal (Ausnahmen für kleine Betriebe des Fleischerhandwerks prüfen).",
            rechtlich: "Nach § 6 GSA Fleisch ist die Arbeitszeit elektronisch und manipulationssicher aufzuzeichnen; § 6a GSA Fleisch beschränkt den Einsatz von Fremdpersonal in Schlachtung, Zerlegung und Fleischverarbeitung."
        },
        "25.6": {
            einfach: "Unterweisen Sie in einer Sprache, die alle verstehen, und nutzen Sie Bilder.",
            bghw: "Führen Sie Unterweisungen sprachlich angepasst durch (DGUV Vorschrift 1) und dokumentieren Sie sie.",
            rechtlich: "Die Unterweisung nach § 12 ArbSchG muss für die Beschäftigten verständlich sein; Betriebsanweisungen sind nach § 12 Abs. 2 BetrSichV in verständlicher Sprache bereitzustellen."
        },
        "25.7": {
            einfach: "Prüfen Sie, ob die Gefährdungsbeurteilung für das Fleischwerk alle Gefahren enthält und aktuell ist.",
            bghw: "Aktualisieren Sie die Gefährdungsbeurteilung unter Berücksichtigung der Branchenregeln des zuständigen Unfallversicherungsträgers (in der Regel BGN).",
            rechtlich: "Nach §§ 5, 6 ArbSchG ist die Gefährdungsbeurteilung für alle Tätigkeiten durchzuführen, zu dokumentieren und bei Änderungen anzupassen."
        }
    },
    "Frischezentrum – Wareneingang, Umschlag und Kommissionierung": {
        "39.1": {
            einfach: "Sichern Sie auch im Frischezentrum jeden Lkw an der Rampe und lassen Sie die Ladebrücken jedes Jahr prüfen.",
            bghw: "Regeln Sie die Lkw-Sicherung gemäß DGUV Vorschrift 70 und lassen Sie Ladebrücken gemäß DIN EN 1398 und BetrSichV wiederkehrend prüfen.",
            rechtlich: "Fahrzeuge sind nach DGUV Vorschrift 70 gegen unbeabsichtigtes Bewegen zu sichern; Ladebrücken sind nach § 14 BetrSichV wiederkehrend zu prüfen."
        },
        "39.2": {
            einfach: "Kehren Sie Salatblätter, Obst und Nässe sofort weg und stellen Sie dafür Besen und Behälter bereit.",
            bghw: "Legen Sie Zwischenreinigungen fest und stellen Sie rutschhemmende Böden gemäß ASR A1.5 sicher.",
            rechtlich: "Verunreinigungen, die zu Unfällen führen können, sind nach § 4 Abs. 2 ArbStättV unverzüglich zu beseitigen; Fußböden müssen nach Anhang Nr. 1.5 ArbStättV rutschhemmend sein."
        },
        "39.3": {
            einfach: "Sorgen Sie bei der Qualitätskontrolle für gutes Licht, einen passenden Tisch und sichere Messer.",
            bghw: "Gestalten Sie den Kontrollarbeitsplatz gemäß ASR A3.4 und Gefährdungsbeurteilung und stellen Sie Schnittschutz bereit (DGUV Regel 112-195).",
            rechtlich: "Arbeitsplätze müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        },
        "39.4": {
            einfach: "Nutzen Sie für schwere Säcke und Kartons Hebehilfen und heben Sie sehr schwere Gebinde zu zweit.",
            bghw: "Beurteilen Sie die Lastenhandhabung mit der Leitmerkmalmethode und stellen Sie Hilfsmittel gemäß LasthandhabV bereit.",
            rechtlich: "Nach § 2 LasthandhabV sind Gefährdungen beim manuellen Handhaben von Lasten zu beurteilen und durch geeignete Arbeitsmittel und Organisation zu verringern."
        },
        "39.5": {
            einfach: "Stapeln Sie Kisten und Steigen nur so hoch, dass sie sicher stehen, und tragen Sie bei Holzsteigen Handschuhe.",
            bghw: "Legen Sie Stapelhöhen fest und stellen Sie Schutzhandschuhe gemäß Gefährdungsbeurteilung bereit (DGUV Regel 112-195).",
            rechtlich: "Gefährdungen durch umfallende Stapel sind nach § 4 ArbSchG zu vermeiden; PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        },
        "39.6": {
            einfach: "Regeln Sie, wo Stapler fahren und wo Fußgänger gehen, gerade wenn es beim Umschlag schnell gehen muss.",
            bghw: "Legen Sie Verkehrsregeln für Umschlagzonen gemäß ASR A1.8 und DGUV Vorschrift 68 fest.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; Zeitdruck ist als psychische Belastung nach § 5 Abs. 3 Nr. 6 ArbSchG zu beurteilen."
        },
        "39.7": {
            einfach: "Stellen Sie warme Arbeitskleidung bereit und sorgen Sie für Aufwärmpausen.",
            bghw: "Beurteilen Sie die Kältearbeit (Hinweise in DIN 33403-5) und stellen Sie Kälteschutzkleidung bereit.",
            rechtlich: "Die Gefährdung durch Kälte ist nach § 5 ArbSchG zu beurteilen; erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        },
        "39.8": {
            einfach: "Bringen Sie verdorbene Ware regelmäßig weg und halten Sie die Abfallbehälter geschlossen und sauber.",
            bghw: "Legen Sie Entsorgungs- und Reinigungsintervalle fest und setzen Sie Hygienemaßnahmen gemäß TRBA 500 um.",
            rechtlich: "Arbeitsstätten sind nach § 4 Abs. 2 ArbStättV hygienisch zu reinigen; Tätigkeiten mit verdorbener Ware sind nach § 4 BioStoffV zu beurteilen."
        },
        "39.9": {
            einfach: "Prüfen Sie, ob die Gefährdungsbeurteilung das Frischezentrum vollständig abdeckt, und unterweisen Sie alle Beschäftigten.",
            bghw: "Aktualisieren Sie die Gefährdungsbeurteilung für das Frischezentrum und führen Sie Unterweisungen gemäß DGUV Vorschrift 1 durch.",
            rechtlich: "Nach §§ 5, 6 ArbSchG ist die Gefährdungsbeurteilung durchzuführen und zu dokumentieren; nach § 12 ArbSchG ist mindestens jährlich zu unterweisen."
        }
    },
    "Frischezentrum – Kühllager und Reiferäume": {
        "40.1": {
            einfach: "Prüfen Sie regelmäßig, ob die Türen von innen aufgehen und der Notruf funktioniert.",
            bghw: "Stellen Sie Notöffnung und Notrufeinrichtung gemäß ASR A1.7 und DIN EN 378 sicher und prüfen Sie sie regelmäßig.",
            rechtlich: "Türen begehbarer Kühlräume müssen nach ASR A1.7 jederzeit von innen ohne Hilfsmittel zu öffnen sein; nach § 10 ArbSchG sind Maßnahmen für Notfälle zu treffen."
        },
        "40.2": {
            einfach: "Betreten Sie Reiferäume und CA-Lager nur nach Lüften bzw. Messen und hängen Sie Warnschilder auf.",
            bghw: "Regeln Sie den Zutritt gemäß DGUV Regel 113-004 (Arbeiten in engen Räumen bzw. Räumen mit gefährlicher Atmosphäre): Freimessen, Erlaubnisschein, Sicherungsposten.",
            rechtlich: "Gefährdungen durch Sauerstoffmangel bzw. erhöhte CO2-Konzentration sind nach § 5 ArbSchG und §§ 6, 7 GefStoffV zu beurteilen; Schutz- und Rettungsmaßnahmen sind nach § 10 ArbSchG festzulegen."
        },
        "40.3": {
            einfach: "Lassen Sie die Gaswarngeräte regelmäßig prüfen und halten Sie die Sensoren frei.",
            bghw: "Lassen Sie Gaswarneinrichtungen gemäß Herstellerangaben und DGUV Information 213-056 wiederkehrend prüfen.",
            rechtlich: "Gaswarneinrichtungen sind als Schutzeinrichtungen nach § 14 BetrSichV wiederkehrend zu prüfen; die Prüfergebnisse sind aufzuzeichnen."
        },
        "40.4": {
            einfach: "Lassen Sie nur eingewiesene Personen mit Reifegas arbeiten und sichern Sie die Gasflaschen gegen Umfallen.",
            bghw: "Regeln Sie den Umgang mit Ethylen gemäß GefStoffV, TRGS 510 und TRGS 720 ff. (Explosionsschutz) und erstellen Sie eine Betriebsanweisung.",
            rechtlich: "Für Tätigkeiten mit Ethylen sind nach § 6 GefStoffV die Brand- und Explosionsgefährdungen zu beurteilen; bei explosionsfähiger Atmosphäre ist nach § 6 Abs. 9 GefStoffV ein Explosionsschutzdokument zu erstellen; nach § 14 GefStoffV sind Betriebsanweisung und Unterweisung erforderlich."
        },
        "40.5": {
            einfach: "Öffnen Sie Container erst, wenn geprüft ist, dass keine Begasungsmittel mehr enthalten sind.",
            bghw: "Legen Sie ein Verfahren für das Öffnen begaster bzw. verdächtiger Container gemäß TRGS 512 fest (Kennzeichnung prüfen, Freimessen, Lüften).",
            rechtlich: "Tätigkeiten mit begasten Transporteinheiten sind nach § 6 GefStoffV zu beurteilen; die TRGS 512 regelt Schutzmaßnahmen und das Freigeben begaster Einheiten."
        },
        "40.6": {
            einfach: "Fassen Sie verschimmelte Ware nur mit Handschuhen an und waschen Sie danach die Hände.",
            bghw: "Legen Sie Schutzmaßnahmen für den Umgang mit Schimmelpilzen gemäß BioStoffV und TRBA 500 fest.",
            rechtlich: "Tätigkeiten mit biologischen Arbeitsstoffen sind nach § 4 BioStoffV zu beurteilen; Hygienemaßnahmen nach § 9 BioStoffV und TRBA 500 sind einzuhalten."
        },
        "40.7": {
            einfach: "Entfernen Sie Eis und Nässe sofort und tragen Sie im Kühlraum warme Kleidung.",
            bghw: "Beseitigen Sie Vereisungen gemäß ASR A1.5 und legen Sie Aufenthaltszeiten und Kälteschutz in der Gefährdungsbeurteilung fest.",
            rechtlich: "Fußböden müssen nach Anhang Nr. 1.5 ArbStättV rutschhemmend sein; die Kältebelastung ist nach § 5 ArbSchG zu beurteilen."
        },
        "40.8": {
            einfach: "Halten Sie den Kältemaschinenraum verschlossen und hängen Sie aus, was bei Gasaustritt zu tun ist.",
            bghw: "Sichern Sie Maschinenräume und legen Sie Notfallmaßnahmen gemäß DIN EN 378 fest.",
            rechtlich: "Kälteanlagen sind nach BetrSichV und DIN EN 378 sicher zu betreiben; nach § 10 ArbSchG sind Notfallmaßnahmen festzulegen."
        }
    },
    "Frischezentrum – Verwaltung": {
        "41.1": {
            einfach: "Stellen Sie die Bildschirme so auf, dass man parallel zum Fenster blickt, und nutzen Sie Jalousien gegen Blendung.",
            bghw: "Richten Sie die Bildschirmarbeitsplätze blendfrei aus und sorgen Sie für einstellbaren Sonnenschutz gemäß ArbStättV Anhang Nr. 6 und ASR A6 „Bildschirmarbeit“.",
            rechtlich: "Bildschirmarbeitsplätze sind nach § 3a Abs. 1 ArbStättV i. V. m. Anhang Nr. 6 ArbStättV so einzurichten, dass störende Blendungen und Reflexionen vermieden werden; die ASR A6 konkretisiert die Anforderungen."
        },
        "41.2": {
            einfach: "Sorgen Sie für einstellbare Stühle und Tische und zeigen Sie den Beschäftigten, wie man sie richtig einstellt.",
            bghw: "Stellen Sie ergonomisch einstellbare Arbeitsmittel bereit und unterweisen Sie die Beschäftigten in der Einstellung gemäß ArbStättV Anhang Nr. 6 und ASR A6.",
            rechtlich: "Nach Anhang Nr. 6.1 ArbStättV müssen Bildschirmarbeitsplätze ergonomisch gestaltet und an die Belange der Beschäftigten anpassbar sein; die Unterweisung erfolgt nach § 12 ArbSchG."
        },
        "41.3": {
            einfach: "Prüfen Sie die Raumbelegung und schaffen Sie genug Platz an jedem Arbeitsplatz.",
            bghw: "Stellen Sie ausreichende Grund- und Bewegungsflächen gemäß ASR A1.2 „Raumabmessungen und Bewegungsflächen“ sicher (Richtwert Büro: 8 m² für den ersten und 6 m² für jeden weiteren Arbeitsplatz).",
            rechtlich: "Arbeitsräume müssen nach § 3a ArbStättV i. V. m. Anhang Nr. 1.2 ArbStättV eine ausreichende Grundfläche und Bewegungsfläche aufweisen; die ASR A1.2 nennt für Büroräume 8 m² für den ersten und 6 m² für jeden weiteren Arbeitsplatz."
        },
        "41.4": {
            einfach: "Lassen Sie defekte Leuchten tauschen und sorgen Sie für genug Licht am Schreibtisch.",
            bghw: "Stellen Sie die Beleuchtung gemäß ASR A3.4 „Beleuchtung und Sichtverbindung“ sicher; für Büroarbeit sind mindestens 500 lx im Bereich der Arbeitsaufgabe vorgesehen.",
            rechtlich: "Arbeitsstätten müssen nach Anhang Nr. 3.4 ArbStättV ausreichend beleuchtet sein; die ASR A3.4 nennt für Büroarbeitsplätze einen Mindestwert der Beleuchtungsstärke von 500 lx."
        },
        "41.5": {
            einfach: "Sorgen Sie im Büro für mindestens 20 °C und treffen Sie bei Hitze Maßnahmen wie Sonnenschutz oder Lüften am Morgen.",
            bghw: "Halten Sie die Raumtemperatur gemäß ASR A3.5 „Raumtemperatur“ ein (Büro mindestens 20 °C) und legen Sie Maßnahmen für Lufttemperaturen über 26 °C fest.",
            rechtlich: "Nach Anhang Nr. 3.5 ArbStättV muss eine gesundheitlich zuträgliche Raumtemperatur bestehen; die ASR A3.5 nennt für leichte, überwiegend sitzende Tätigkeit mindestens 20 °C und sieht ab 26 °C gestufte Maßnahmen vor."
        },
        "41.6": {
            einfach: "Verlegen Sie Kabel in Kabelkanälen und stecken Sie keine Steckdosenleisten hintereinander.",
            bghw: "Beseitigen Sie Stolperstellen durch Kabelführung gemäß ASR A1.5 und vermeiden Sie hintereinandergesteckte Mehrfachsteckdosen gemäß DGUV Vorschrift 3.",
            rechtlich: "Verkehrswege sind nach Anhang Nr. 1.5 ArbStättV frei von Stolperstellen zu halten (ASR A1.5); elektrische Betriebsmittel dürfen nach § 3 DGUV Vorschrift 3 nur in ordnungsgemäßem Zustand und bestimmungsgemäß verwendet werden."
        },
        "41.7": {
            einfach: "Bieten Sie allen Bildschirm-Beschäftigten regelmäßig eine Untersuchung beim Betriebsarzt mit Sehtest an.",
            bghw: "Bieten Sie die Angebotsvorsorge „Tätigkeiten an Bildschirmgeräten“ nach ArbMedVV an und stellen Sie bei Bedarf Bildschirmarbeitsbrillen bereit.",
            rechtlich: "Nach § 5 ArbMedVV i. V. m. ArbMedVV Anhang Teil 4 ist bei Tätigkeiten an Bildschirmgeräten Angebotsvorsorge anzubieten; die Kosten für eine notwendige Bildschirmarbeitsbrille trägt der Arbeitgeber (§ 3 Abs. 3 ArbSchG)."
        },
        "41.8": {
            einfach: "Lassen Sie elektrische Geräte regelmäßig von einer Elektrofachkraft prüfen und markieren.",
            bghw: "Lassen Sie ortsveränderliche elektrische Betriebsmittel wiederkehrend gemäß DGUV Vorschrift 3 prüfen; in Büros gilt bei geringer Fehlerquote ein Prüfintervall von höchstens zwei Jahren als Richtwert.",
            rechtlich: "Ortsveränderliche elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 und § 14 BetrSichV wiederkehrend durch eine Elektrofachkraft zu prüfen; die Fristen sind in der Gefährdungsbeurteilung festzulegen."
        },
        "41.9": {
            einfach: "Planen Sie die Arbeit so, dass Bildschirmarbeit regelmäßig durch andere Tätigkeiten oder kurze Pausen unterbrochen wird.",
            bghw: "Organisieren Sie Mischarbeit bzw. Kurzpausen gemäß ArbStättV Anhang Nr. 6 und ASR A6.",
            rechtlich: "Nach Anhang Nr. 6.1 Abs. 2 ArbStättV ist die Bildschirmarbeit so zu organisieren, dass sie regelmäßig durch andere Tätigkeiten oder Erholungszeiten unterbrochen wird."
        },
        "41.10": {
            einfach: "Lassen Sie defekte Fenster, Jalousien und Lüftungen reparieren.",
            bghw: "Stellen Sie Sonnenschutz und Lüftung gemäß ASR A3.5 und ASR A3.6 sicher.",
            rechtlich: "Nach Anhang Nr. 3.5 und 3.6 ArbStättV müssen Arbeitsräume gesundheitlich zuträglich temperiert und belüftet sein; Fenster müssen nach Anhang Nr. 1.6 ArbStättV sicher bedienbar sein."
        },
        "41.11": {
            einfach: "Halten Sie Flure und Treppen im Verwaltungsgebäude frei und hängen Sie einen aktuellen Fluchtplan aus.",
            bghw: "Halten Sie Fluchtwege gemäß ASR A2.3 frei und hängen Sie Flucht- und Rettungspläne nach DIN ISO 23601 aus.",
            rechtlich: "Fluchtwege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten; ein Flucht- und Rettungsplan ist aufzustellen, wenn Lage und Ausdehnung der Arbeitsstätte dies erfordern."
        },
        "41.12": {
            einfach: "Halten Sie die Feuerlöscher in der Verwaltung frei und lassen Sie sie alle zwei Jahre prüfen.",
            bghw: "Stellen Sie Feuerlöscher gemäß ASR A2.2 bereit und lassen Sie sie gemäß DIN 14406-4 prüfen.",
            rechtlich: "Arbeitsstätten sind nach Anhang Nr. 2.2 ArbStättV mit Feuerlöscheinrichtungen auszustatten; die ASR A2.2 fordert eine Instandhaltung mindestens alle zwei Jahre."
        },
        "41.13": {
            einfach: "Sorgen Sie dafür, dass in der Verwaltung ein Ersthelfer da ist und der Verbandkasten vollständig ist.",
            bghw: "Stellen Sie Ersthelfer und Erste-Hilfe-Material gemäß DGUV Vorschrift 1 und DGUV Information 204-022 sicher.",
            rechtlich: "Nach §§ 25, 26 DGUV Vorschrift 1 sind Erste-Hilfe-Material und eine ausreichende Zahl von Ersthelfern bereitzustellen; Notrufnummern sind nach § 24 Abs. 5 auszuhängen."
        },
        "41.14": {
            einfach: "Achten Sie auf sichere Treppen mit Handlauf und lassen Sie den Aufzug prüfen.",
            bghw: "Halten Sie Treppen gemäß ASR A1.8 instand und lassen Sie Aufzüge gemäß BetrSichV durch eine ZÜS prüfen.",
            rechtlich: "Treppen sind nach Anhang Nr. 1.8 ArbStättV sicher zu gestalten; Aufzugsanlagen sind nach § 16 BetrSichV wiederkehrend durch eine ZÜS zu prüfen."
        },
        "41.15": {
            einfach: "Halten Sie Teeküche, Pausenraum und Toiletten sauber.",
            bghw: "Stellen Sie Pausen- und Sanitärräume gemäß ASR A4.2 und ASR A4.1 bereit und legen Sie Reinigungsintervalle fest.",
            rechtlich: "Nach Anhang Nr. 4.1 und 4.2 ArbStättV sind Sanitär- und Pausenräume bereitzustellen und nach § 4 Abs. 2 ArbStättV hygienisch zu reinigen."
        }
    },
    "Gabelstapler": {
        "26.1": {
            einfach: "Lassen Sie nur ausgebildete Fahrer mit Fahrausweis fahren und beauftragen Sie diese schriftlich.",
            bghw: "Setzen Sie nur ausgebildete Fahrer gemäß DGUV Grundsatz 308-001 ein, die mindestens 18 Jahre alt sind und schriftlich beauftragt wurden (DGUV Vorschrift 68).",
            rechtlich: "Nach § 7 DGUV Vorschrift 68 dürfen Flurförderzeuge mit Fahrersitz oder Fahrerstand nur von Personen gesteuert werden, die mindestens 18 Jahre alt, geeignet, ausgebildet sind, ihre Befähigung nachgewiesen haben und schriftlich beauftragt wurden."
        },
        "26.2": {
            einfach: "Lassen Sie jeden Stapler einmal im Jahr prüfen und kleben Sie die Prüfplakette sichtbar auf.",
            bghw: "Lassen Sie Flurförderzeuge gemäß DGUV Vorschrift 68 mindestens jährlich durch eine zur Prüfung befähigte Person prüfen und dokumentieren Sie das Ergebnis.",
            rechtlich: "Flurförderzeuge sind nach § 37 DGUV Vorschrift 68 sowie § 14 BetrSichV mindestens einmal jährlich zu prüfen; das Ergebnis ist aufzuzeichnen."
        },
        "26.3": {
            einfach: "Lassen Sie die Fahrer vor jeder Schicht Bremsen, Lenkung, Hupe und Gabel kurz prüfen.",
            bghw: "Legen Sie die tägliche Einsatzprüfung mit Checkliste gemäß Betriebsanleitung und DGUV Vorschrift 68 fest.",
            rechtlich: "Nach § 4 Abs. 5 BetrSichV hat der Arbeitgeber dafür zu sorgen, dass Arbeitsmittel vor der Verwendung durch Inaugenscheinnahme und erforderlichenfalls Funktionskontrolle auf offensichtliche Mängel kontrolliert werden."
        },
        "26.4": {
            einfach: "Achten Sie darauf, dass jeder Fahrer den Gurt anlegt oder die Bügeltür schließt.",
            bghw: "Stellen Sie die Benutzung der Rückhaltesysteme gemäß Betriebsanweisung, Herstellerangaben und DGUV Vorschrift 68 sicher und kontrollieren Sie dies.",
            rechtlich: "Nach § 4 Abs. 1 BetrSichV sind Arbeitsmittel bestimmungsgemäß zu verwenden; vorhandene Rückhaltesysteme sind zu benutzen. Die Kontrolle ist Teil der Aufsichtspflicht nach § 4 ArbSchG."
        },
        "26.5": {
            einfach: "Verbieten Sie das Mitfahren und das Hochheben von Personen auf der Gabel.",
            bghw: "Untersagen Sie die Personenmitnahme ohne Sitzplatz und das Hochheben von Personen ohne zugelassene, gesicherte Arbeitsbühne gemäß DGUV Vorschrift 68.",
            rechtlich: "Nach DGUV Vorschrift 68 und § 4 Abs. 1 BetrSichV dürfen Personen nur auf dafür vorgesehenen Plätzen mitgenommen und nur mit geeigneten Arbeitsbühnen angehoben werden."
        },
        "26.6": {
            einfach: "Achten Sie darauf, dass das Lastschild lesbar ist und der Stapler nicht überladen wird.",
            bghw: "Halten Sie das Lastdiagramm lesbar und unterweisen Sie die Fahrer in dessen Anwendung (DGUV Grundsatz 308-001).",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur innerhalb der vom Hersteller angegebenen Grenzen verwendet werden."
        },
        "26.7": {
            einfach: "Stellen Sie Stapler immer mit abgesenkter Gabel ab, ziehen Sie den Schlüssel ab und parken Sie nicht vor Notausgängen.",
            bghw: "Legen Sie Abstellplätze fest und regeln Sie das Sichern gegen unbefugte Benutzung gemäß DGUV Vorschrift 68.",
            rechtlich: "Flurförderzeuge sind nach DGUV Vorschrift 68 gegen unbefugte Benutzung zu sichern; Fluchtwege und Brandschutzeinrichtungen sind nach § 4 Abs. 4 ArbStättV freizuhalten."
        },
        "26.8": {
            einfach: "Lassen Sie Gasflaschen nur von unterwiesenen Personen wechseln und parken Sie Gasstapler nicht im Keller.",
            bghw: "Regeln Sie Umgang und Wechsel von Treibgasflaschen gemäß DGUV Regel 110-010 und Betriebsanweisung.",
            rechtlich: "Für die Verwendung von Flüssiggas sind nach §§ 5, 12 ArbSchG Gefährdungsbeurteilung, Betriebsanweisung und Unterweisung erforderlich; die DGUV Regel 110-010 konkretisiert die Anforderungen."
        },
        "26.9": {
            einfach: "Unterweisen Sie alle Staplerfahrer jedes Jahr und lassen Sie sich die Teilnahme unterschreiben.",
            bghw: "Führen Sie mindestens jährlich eine Unterweisung der Fahrer gemäß DGUV Vorschrift 1 und DGUV Grundsatz 308-001 durch und dokumentieren Sie diese.",
            rechtlich: "Die Beschäftigten sind nach § 12 ArbSchG, § 12 BetrSichV und § 4 DGUV Vorschrift 1 vor Aufnahme der Tätigkeit und danach mindestens jährlich zu unterweisen."
        },
        "26.10": {
            einfach: "Nutzen Sie Warnlichter und fahren Sie rückwärts, wenn die Ladung die Sicht versperrt.",
            bghw: "Legen Sie Maßnahmen zur Sichtverbesserung und Warnung gemäß DGUV Vorschrift 68 und Gefährdungsbeurteilung fest.",
            rechtlich: "Nach DGUV Vorschrift 68 ist bei eingeschränkter Sicht so zu fahren, dass niemand gefährdet wird; zusätzliche technische Maßnahmen sind nach § 5 ArbSchG zu beurteilen."
        },
        "26.11": {
            einfach: "Verwenden Sie nur Anbaugeräte, die zum Stapler passen und geprüft sind.",
            bghw: "Setzen Sie nur vom Hersteller freigegebene Anbaugeräte mit Zusatz-Tragfähigkeitsschild ein und prüfen Sie diese mit dem Stapler (DGUV Vorschrift 68).",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur bestimmungsgemäß verwendet werden; Anbaugeräte sind nach § 14 BetrSichV in die Prüfung einzubeziehen."
        },
        "26.12": {
            einfach: "Fahren Sie auf Rampen immer mit der Last bergseitig und wenden Sie nicht auf Schrägen.",
            bghw: "Unterweisen Sie die Fahrer zum Befahren von Steigungen gemäß DGUV Grundsatz 308-001.",
            rechtlich: "Die Fahrer sind nach § 12 BetrSichV und § 4 DGUV Vorschrift 1 über sichere Fahrweisen zu unterweisen."
        }
    },
    "E-Ameisen (Mitgänger-Flurförderzeuge)": {
        "27.1": {
            einfach: "Lassen Sie nur eingewiesene und beauftragte Personen mit der E-Ameise fahren.",
            bghw: "Setzen Sie nur unterwiesene und beauftragte Bediener ein; bei Geräten mit Fahrerstand bzw. Standplattform ist eine Ausbildung nach DGUV Grundsatz 308-001 und eine schriftliche Beauftragung erforderlich (DGUV Vorschrift 68).",
            rechtlich: "Nach § 12 BetrSichV sind die Beschäftigten vor der Verwendung zu unterweisen; für Flurförderzeuge mit Fahrersitz oder Fahrerstand gelten zusätzlich die Anforderungen des § 7 DGUV Vorschrift 68 (Ausbildung, Mindestalter 18, schriftliche Beauftragung)."
        },
        "27.2": {
            einfach: "Prüfen Sie vor jeder Schicht, ob die Sicherheitsschalter, die Bremse und die Hupe funktionieren.",
            bghw: "Prüfen Sie die Schutzeinrichtungen vor Arbeitsbeginn gemäß Betriebsanleitung; Geräte mit Mängeln sind gemäß DGUV Vorschrift 68 stillzusetzen.",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 5 BetrSichV vor der Verwendung auf offensichtliche Mängel zu kontrollieren; Arbeitsmittel mit Mängeln dürfen nicht verwendet werden."
        },
        "27.3": {
            einfach: "Lassen Sie jede E-Ameise einmal im Jahr prüfen und kleben Sie die Plakette auf.",
            bghw: "Lassen Sie Mitgänger-Flurförderzeuge gemäß DGUV Vorschrift 68 mindestens jährlich durch eine zur Prüfung befähigte Person prüfen.",
            rechtlich: "Flurförderzeuge sind nach § 37 DGUV Vorschrift 68 und § 14 BetrSichV mindestens jährlich zu prüfen; die Ergebnisse sind aufzuzeichnen."
        },
        "27.4": {
            einfach: "Verbieten Sie das Mitfahren auf E-Ameisen ohne Standplattform.",
            bghw: "Untersagen Sie das Mitfahren auf Mitgänger-Flurförderzeugen ohne dafür vorgesehenen Fahrerstand gemäß Betriebsanweisung und DGUV Vorschrift 68.",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur bestimmungsgemäß verwendet werden."
        },
        "27.5": {
            einfach: "Fahren Sie langsam, besonders an Ecken und in engen Gängen, und halten Sie Abstand zu Wänden und Regalen.",
            bghw: "Legen Sie Fahrregeln (Schrittgeschwindigkeit, Deichselführung, Abstand) in der Betriebsanweisung fest und unterweisen Sie diese.",
            rechtlich: "Nach § 12 BetrSichV sind Betriebsanweisung und Unterweisung erforderlich; die Fahrregeln sind Teil der Gefährdungsbeurteilung nach § 5 ArbSchG."
        },
        "27.6": {
            einfach: "Parken Sie E-Ameisen auf festen Plätzen und ziehen Sie den Schlüssel ab.",
            bghw: "Legen Sie Abstellplätze fest und sichern Sie die Geräte gegen unbefugte Benutzung (DGUV Vorschrift 68).",
            rechtlich: "Flurförderzeuge sind nach DGUV Vorschrift 68 gegen unbefugte Benutzung zu sichern; Fluchtwege sind nach § 4 Abs. 4 ArbStättV freizuhalten."
        },
        "27.7": {
            einfach: "Achten Sie darauf, dass beim Fahren mit der E-Ameise Sicherheitsschuhe getragen werden.",
            bghw: "Stellen Sie Sicherheitsschuhe gemäß Gefährdungsbeurteilung bereit (DGUV Regel 112-191) und kontrollieren Sie das Tragen.",
            rechtlich: "Erforderliche persönliche Schutzausrüstung ist nach § 2 PSA-Benutzungsverordnung bereitzustellen; die Beschäftigten haben sie nach § 15 ArbSchG bestimmungsgemäß zu benutzen."
        }
    },
    "Hubwagen": {
        "28.1": {
            einfach: "Sortieren Sie kaputte Hubwagen aus und lassen Sie sie reparieren.",
            bghw: "Kontrollieren Sie Hubwagen vor der Benutzung und setzen Sie defekte Geräte gemäß BetrSichV still.",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 5 BetrSichV vor der Verwendung auf Mängel zu kontrollieren; mangelhafte Arbeitsmittel dürfen nicht verwendet werden."
        },
        "28.2": {
            einfach: "Lassen Sie die Hubwagen regelmäßig prüfen, am besten jedes Jahr.",
            bghw: "Legen Sie die Prüffrist für Handhubwagen in der Gefährdungsbeurteilung fest, in der Praxis jährlich in Anlehnung an DGUV Vorschrift 68.",
            rechtlich: "Nach § 3 Abs. 6 und § 14 BetrSichV sind Art, Umfang und Fristen erforderlicher Prüfungen festzulegen und die Prüfungen aufzuzeichnen."
        },
        "28.3": {
            einfach: "Stellen Sie Hubwagen mit abgesenkter Gabel an festen Plätzen ab.",
            bghw: "Legen Sie Abstellplätze fest und halten Sie Verkehrswege gemäß ASR A1.8 frei.",
            rechtlich: "Verkehrswege sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten."
        },
        "28.4": {
            einfach: "Überladen Sie die Hubwagen nicht und bewegen Sie schwere Paletten nicht auf Schrägen.",
            bghw: "Unterweisen Sie die Beschäftigten über Tragfähigkeit und den Umgang auf Gefälle; ggf. sind elektrische Geräte mit Bremse einzusetzen.",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur bestimmungsgemäß verwendet werden; die Belastung durch Ziehen und Schieben ist nach § 2 LasthandhabV zu beurteilen."
        },
        "28.5": {
            einfach: "Setzen Sie bei schweren Paletten elektrische Hubwagen ein, damit niemand zu schwer ziehen muss.",
            bghw: "Beurteilen Sie Zieh- und Schiebetätigkeiten mit der Leitmerkmalmethode der BAuA und setzen Sie bei Bedarf motorisch unterstützte Geräte ein.",
            rechtlich: "Nach §§ 2, 3 LasthandhabV sind Gefährdungen beim manuellen Handhaben von Lasten zu beurteilen und durch geeignete Arbeitsmittel zu verringern."
        }
    },
    "Batterieladestation": {
        "29.1": {
            einfach: "Sorgen Sie für gute Lüftung im Ladebereich, damit sich kein Gas sammeln kann.",
            bghw: "Stellen Sie die Lüftung von Ladebereichen gemäß DIN EN IEC 62485-3 und den Herstellerangaben sicher.",
            rechtlich: "Beim Laden von Bleibatterien kann Wasserstoff entstehen; die Lüftung ist nach § 5 ArbSchG und den Vorgaben der DIN EN IEC 62485-3 sicherzustellen."
        },
        "29.2": {
            einfach: "Hängen Sie Rauchverbotsschilder auf und lagern Sie keine Kartons oder Folien im Ladebereich.",
            bghw: "Kennzeichnen Sie den Ladebereich gemäß ASR A1.3 und halten Sie Abstand zu brennbaren Stoffen nach Brandschutzkonzept bzw. VdS 2259 ein.",
            rechtlich: "Gefahrenbereiche sind nach ASR A1.3 zu kennzeichnen; Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen und durch Maßnahmen nach ASR A2.2 zu verringern."
        },
        "29.3": {
            einfach: "Stellen Sie eine Augenspülflasche, eine Schutzbrille und säurefeste Handschuhe bereit.",
            bghw: "Stellen Sie im Ladebereich Augenspüleinrichtungen und die erforderliche PSA gemäß Gefährdungsbeurteilung und DGUV Information 204-022 bereit.",
            rechtlich: "Erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen; Mittel zur Ersten Hilfe sind nach § 25 DGUV Vorschrift 1 bereitzuhalten."
        },
        "29.4": {
            einfach: "Lassen Sie beschädigte Ladekabel und Stecker sofort tauschen.",
            bghw: "Lassen Sie Ladegeräte und Leitungen gemäß DGUV Vorschrift 3 wiederkehrend prüfen und schadhafte Teile sofort aussondern.",
            rechtlich: "Elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 und § 14 BetrSichV wiederkehrend zu prüfen; Mängel sind unverzüglich zu beheben."
        },
        "29.5": {
            einfach: "Laden Sie Lithium-Akkus nur mit dem passenden Ladegerät und lagern Sie beschädigte Akkus getrennt und sicher.",
            bghw: "Legen Sie Regeln für Laden und Lagerung von Lithium-Ionen-Batterien gemäß Herstellerangaben und VdS 3103 fest.",
            rechtlich: "Die Brandgefährdung durch Lithium-Ionen-Batterien ist nach § 5 ArbSchG zu beurteilen; die Maßnahmen sind in der Betriebsanweisung nach § 12 BetrSichV festzulegen."
        },
        "29.6": {
            einfach: "Hängen Sie eine Anleitung zum Laden aus und erklären Sie den Beschäftigten, was zu beachten ist.",
            bghw: "Erstellen Sie eine Betriebsanweisung für Laden, Nachfüllen und Batteriewechsel und unterweisen Sie die Beschäftigten (DGUV Vorschrift 1).",
            rechtlich: "Nach § 12 BetrSichV und § 14 GefStoffV (Batteriesäure) sind Betriebsanweisungen zu erstellen und die Beschäftigten zu unterweisen."
        },
        "29.7": {
            einfach: "Stellen Sie einen passenden Feuerlöscher in der Nähe der Ladestation bereit.",
            bghw: "Stellen Sie Feuerlöscher gemäß ASR A2.2 in der Nähe des Ladebereichs bereit.",
            rechtlich: "Arbeitsstätten sind nach Anhang Nr. 2.2 ArbStättV mit geeigneten Feuerlöscheinrichtungen auszustatten (ASR A2.2)."
        }
    },
    "Werkstatt Flurförderzeuge": {
        "30.1": {
            einfach: "Lassen Sie Hebebühnen und Wagenheber jedes Jahr prüfen und sperren Sie defekte sofort.",
            bghw: "Lassen Sie Hebebühnen gemäß DGUV Grundsatz 308-002 und BetrSichV mindestens jährlich durch eine zur Prüfung befähigte Person prüfen und dokumentieren Sie das Ergebnis.",
            rechtlich: "Nach § 3 Abs. 6 und § 14 BetrSichV sind Art, Umfang und Fristen der Prüfung festzulegen; die Prüfung ist durch eine zur Prüfung befähigte Person durchzuführen und nach § 14 Abs. 7 BetrSichV aufzuzeichnen."
        },
        "30.2": {
            einfach: "Lassen Sie Kran, Kettenzug und Hebebänder jedes Jahr prüfen und sortieren Sie beschädigte Bänder und Ketten aus.",
            bghw: "Lassen Sie Krane und Lastaufnahmeeinrichtungen gemäß DGUV Vorschrift 52 und DGUV Regel 109-017 mindestens jährlich prüfen; Anschlagmittel vor jedem Gebrauch auf Mängel kontrollieren.",
            rechtlich: "Krane und Lastaufnahmeeinrichtungen sind nach § 14 BetrSichV wiederkehrend zu prüfen; Arbeitsmittel mit Mängeln dürfen nach § 4 Abs. 5 BetrSichV nicht verwendet werden."
        },
        "30.3": {
            einfach: "Arbeiten Sie nie unter einem angehobenen Stapler oder Mast, ohne ihn mit Böcken oder einer Sperre zu sichern.",
            bghw: "Sichern Sie angehobene Fahrzeuge und Lastaufnahmemittel gemäß DGUV Regel 109-009 „Fahrzeug-Instandhaltung“ mit geeigneten Abstützungen.",
            rechtlich: "Instandhaltungsarbeiten dürfen nach § 10 Abs. 3 BetrSichV nur durchgeführt werden, wenn Gefährdungen durch Bewegung von Teilen ausgeschlossen sind; die DGUV Regel 109-009 konkretisiert die Sicherung."
        },
        "30.4": {
            einfach: "Prüfen Sie jedes reparierte Fahrzeug vor der Rückgabe und schreiben Sie auf, was gemacht und geprüft wurde.",
            bghw: "Führen Sie nach Instandsetzung eine Funktions- und Sicherheitsprüfung gemäß Herstellerangaben und DGUV Vorschrift 68 durch und dokumentieren Sie sie im Prüfbuch.",
            rechtlich: "Nach § 14 Abs. 2 BetrSichV sind Arbeitsmittel nach prüfpflichtigen Änderungen bzw. Instandsetzungen, die die Sicherheit beeinflussen können, vor der erneuten Verwendung zu prüfen."
        },
        "30.5": {
            einfach: "Hängen Sie an defekte Fahrzeuge ein Sperrschild und ziehen Sie den Schlüssel ab.",
            bghw: "Kennzeichnen Sie defekte Fahrzeuge und sichern Sie sie gegen Wiederinbetriebnahme gemäß DGUV Vorschrift 68.",
            rechtlich: "Arbeitsmittel mit Mängeln, die die sichere Verwendung beeinträchtigen, dürfen nach § 4 Abs. 5 BetrSichV nicht verwendet werden; sie sind gegen Benutzung zu sichern."
        },
        "30.6": {
            einfach: "Lassen Sie alle elektrischen Werkzeuge und Kabel in der Werkstatt jedes Jahr prüfen.",
            bghw: "Lassen Sie ortsveränderliche elektrische Betriebsmittel gemäß DGUV Vorschrift 3 prüfen; in Werkstätten gilt bei geringer Fehlerquote höchstens ein Jahr als Richtwert.",
            rechtlich: "Ortsveränderliche elektrische Betriebsmittel sind nach § 5 DGUV Vorschrift 3 und § 14 BetrSichV wiederkehrend durch eine Elektrofachkraft zu prüfen."
        },
        "30.7": {
            einfach: "Lassen Sie an der Elektrik nur ausgebildete Personen arbeiten und ziehen Sie vorher den Batteriestecker.",
            bghw: "Legen Sie Qualifikation und Freischaltverfahren für Arbeiten an der Fahrzeugelektrik gemäß DGUV Vorschrift 3 fest.",
            rechtlich: "Elektrische Anlagen und Betriebsmittel dürfen nach § 3 DGUV Vorschrift 3 nur von Elektrofachkräften oder unter deren Leitung und Aufsicht errichtet, geändert und instand gehalten werden."
        },
        "30.8": {
            einfach: "Schweißen und Schleifen Sie nur mit Feuerlöscher in der Nähe, decken Sie Brennbares ab und nutzen Sie die Absaugung.",
            bghw: "Regeln Sie Heißarbeiten gemäß DGUV Regel 100-500 Kapitel 2.26 und TRGS 528 (Erlaubnisschein, Brandwache, Absaugung).",
            rechtlich: "Für Tätigkeiten mit Schweißrauchen sind nach §§ 6, 7 GefStoffV Schutzmaßnahmen festzulegen (TRGS 528); Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen."
        },
        "30.9": {
            einfach: "Lassen Sie den Kompressor und den Druckluftbehälter regelmäßig prüfen.",
            bghw: "Lassen Sie Druckanlagen gemäß BetrSichV prüfen; die Prüffristen richten sich nach Druck und Volumen und sind im Prüfbericht festgelegt.",
            rechtlich: "Druckanlagen sind nach §§ 15, 16 BetrSichV i. V. m. BetrSichV Anhang 2 Abschnitt 4 vor Inbetriebnahme und wiederkehrend zu prüfen; die Fristen sind nach § 3 Abs. 6 BetrSichV festzulegen."
        },
        "30.10": {
            einfach: "Pumpen Sie Reifen auf geteilten Felgen nur im Schutzkäfig auf.",
            bghw: "Befüllen Sie Reifen auf mehrteiligen Felgen gemäß DGUV Regel 109-009 nur mit Reifenfüllkäfig und Druckbegrenzung.",
            rechtlich: "Nach § 4 ArbSchG sind Gefahren an der Quelle zu bekämpfen; die DGUV Regel 109-009 fordert für mehrteilige Felgen eine Schutzeinrichtung beim Befüllen."
        },
        "30.11": {
            einfach: "Lagern Sie Öle und Reiniger in Auffangwannen, sammeln Sie Altöl getrennt und hängen Sie die Anweisungen aus.",
            bghw: "Lagern Sie Betriebsstoffe gemäß TRGS 510, erstellen Sie Betriebsanweisungen gemäß TRGS 555 und sammeln Sie Altöl getrennt.",
            rechtlich: "Gefahrstoffe sind nach § 8 GefStoffV sicher aufzubewahren; nach § 14 GefStoffV sind Betriebsanweisungen zu erstellen und die Beschäftigten zu unterweisen."
        },
        "30.12": {
            einfach: "Hängen Sie einen Hautschutzplan aus und stellen Sie Handschuhe, Schutzbrillen und Gehörschutz bereit.",
            bghw: "Erstellen Sie einen Hautschutzplan gemäß TRGS 401 und stellen Sie die erforderliche PSA gemäß Gefährdungsbeurteilung bereit (DGUV Regel 112-195).",
            rechtlich: "Bei Feuchtarbeit und Hautkontakt mit Ölen und Reinigern sind nach TRGS 401 Schutzmaßnahmen festzulegen; erforderliche PSA ist nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        },
        "30.13": {
            einfach: "Stellen Sie in der Werkstatt einen Verbandkasten und eine Augenspülflasche bereit.",
            bghw: "Stellen Sie Erste-Hilfe-Material und Augenspüleinrichtungen gemäß DGUV Information 204-022 bereit.",
            rechtlich: "Mittel zur Ersten Hilfe sind nach § 25 DGUV Vorschrift 1 entsprechend den Gefährdungen leicht erreichbar bereitzuhalten."
        },
        "30.14": {
            einfach: "Sorgen Sie für einen sauberen Pausenraum, in dem keine Werkzeuge oder Teile lagern.",
            bghw: "Stellen Sie einen Pausenraum gemäß ASR A4.2 bereit, getrennt von Lärm, Staub und Gefahrstoffen der Werkstatt.",
            rechtlich: "Nach Anhang Nr. 4.2 ArbStättV ist ein Pausenraum bereitzustellen, wenn mehr als zehn Beschäftigte tätig sind oder Sicherheits- oder Gesundheitsgründe dies erfordern (ASR A4.2)."
        },
        "30.15": {
            einfach: "Sorgen Sie dafür, dass schmutzige Arbeitskleidung getrennt von der Straßenkleidung aufbewahrt werden kann.",
            bghw: "Stellen Sie Wasch- und Umkleideräume gemäß ASR A4.1 bereit; bei stark verschmutzender Tätigkeit ist eine getrennte Aufbewahrung erforderlich.",
            rechtlich: "Nach Anhang Nr. 4.1 ArbStättV sind Wasch- und Umkleideräume bereitzustellen; die ASR A4.1 regelt die getrennte Aufbewahrung von Arbeits- und Straßenkleidung."
        },
        "30.16": {
            einfach: "Richten Sie den Schreibtisch in der Werkstatt ergonomisch ein und schützen Sie ihn vor Lärm und Zugluft.",
            bghw: "Gestalten Sie den Büroarbeitsplatz gemäß ASR A6 und schützen Sie ihn vor Lärm gemäß ASR A3.7.",
            rechtlich: "Bildschirmarbeitsplätze sind nach Anhang Nr. 6 ArbStättV zu gestalten; der Schalldruckpegel ist nach Anhang Nr. 3.7 ArbStättV so niedrig zu halten, wie es nach Art des Betriebs möglich ist (ASR A3.7)."
        },
        "30.17": {
            einfach: "Halten Sie Sozialräume und Büro sauber, warm, gut gelüftet und hell.",
            bghw: "Stellen Sie Raumtemperatur, Lüftung und Beleuchtung gemäß ASR A3.5, ASR A3.6 und ASR A3.4 sicher.",
            rechtlich: "Nach Anhang Nr. 3.4 bis 3.6 ArbStättV müssen Arbeits- und Sozialräume ausreichend beleuchtet, gesundheitlich zuträglich temperiert und belüftet sein."
        }
    },
    "Betriebstankstelle (Diesel)": {
        "31.1": {
            einfach: "Lassen Sie die Tankanlage von einem Sachverständigen prüfen, wenn das vorgeschrieben ist, und bewahren Sie die Unterlagen auf.",
            bghw: "Lassen Sie die Tankstelle gemäß AwSV prüfen (Fristen je nach Gefährdungsstufe und Bauart) und führen Sie die Anlagendokumentation.",
            rechtlich: "Anlagen zum Umgang mit wassergefährdenden Stoffen sind nach § 46 AwSV i. V. m. Anlage 5 AwSV durch Sachverständige zu prüfen; der Betreiber hat nach § 43 AwSV eine Anlagendokumentation zu führen."
        },
        "31.2": {
            einfach: "Hängen Sie an der Tankstelle das Merkblatt zum Umgang mit Diesel gut sichtbar aus.",
            bghw: "Hängen Sie das Merkblatt nach AwSV aus und ergänzen Sie eine Betriebsanweisung für das Betanken.",
            rechtlich: "Nach § 44 AwSV hat der Betreiber eine Betriebsanweisung mit Überwachungs-, Instandhaltungs- und Notfallplan zu erstellen bzw. das Merkblatt nach Anlage 3 AwSV gut sichtbar anzubringen."
        },
        "31.3": {
            einfach: "Prüfen Sie, ob die Fläche an der Zapfsäule dicht ist und das Wasser über den Abscheider abläuft.",
            bghw: "Halten Sie die Abfüllfläche gemäß AwSV dicht und betreiben Sie den Leichtflüssigkeitsabscheider gemäß DIN 1999-100 und DIN EN 858.",
            rechtlich: "Abfüllflächen müssen nach AwSV so beschaffen sein, dass wassergefährdende Stoffe nicht austreten können (§ 17 AwSV); Abscheider sind nach DIN 1999-100 zu betreiben."
        },
        "31.4": {
            einfach: "Lassen Sie den Ölabscheider regelmäßig warten und leeren und schreiben Sie das in das Betriebstagebuch.",
            bghw: "Kontrollieren und warten Sie den Abscheider gemäß DIN 1999-100 (Eigenkontrolle, halbjährliche Wartung durch Sachkundigen, Generalinspektion) und führen Sie ein Betriebstagebuch.",
            rechtlich: "Abwasseranlagen sind nach den Vorgaben des Wasserrechts und der DIN 1999-100 zu betreiben und zu warten; die Wartungen sind zu dokumentieren."
        },
        "31.5": {
            einfach: "Stellen Sie Ölbindemittel bereit und legen Sie fest, was bei ausgelaufenem Diesel zu tun ist.",
            bghw: "Halten Sie Bindemittel bereit und legen Sie einen Notfallplan für Leckagen gemäß AwSV fest.",
            rechtlich: "Nach § 24 AwSV hat der Betreiber bei Betriebsstörungen unverzüglich Maßnahmen zur Schadensbegrenzung zu ergreifen und austretende Stoffe der zuständigen Behörde anzuzeigen."
        },
        "31.6": {
            einfach: "Kennzeichnen Sie den Not-Aus und das Rauchverbot und stellen Sie einen Feuerlöscher an die Tankstelle.",
            bghw: "Kennzeichnen Sie Not-Aus, Verbote und Gebote gemäß ASR A1.3 und stellen Sie Feuerlöscher gemäß ASR A2.2 bereit.",
            rechtlich: "Sicherheitszeichen sind nach Anhang Nr. 1.3 ArbStättV (ASR A1.3) anzubringen; Feuerlöscheinrichtungen sind nach Anhang Nr. 2.2 ArbStättV bereitzustellen."
        },
        "31.7": {
            einfach: "Prüfen Sie Schlauch und Zapfpistole auf Risse und Tropfen und lassen Sie Schäden sofort reparieren.",
            bghw: "Kontrollieren Sie die Zapfeinrichtung regelmäßig auf Schäden und lassen Sie elektrische Teile gemäß DGUV Vorschrift 3 prüfen.",
            rechtlich: "Arbeitsmittel sind nach § 4 Abs. 5 BetrSichV vor der Verwendung auf Mängel zu kontrollieren; elektrische Anlagen sind nach § 5 DGUV Vorschrift 3 wiederkehrend zu prüfen."
        },
        "31.8": {
            einfach: "Schützen Sie Zapfsäule und Tank mit Pollern oder Anfahrschutz.",
            bghw: "Sichern Sie Tankanlage und Zapfsäule durch Anfahrschutz und kennzeichnen Sie diesen gemäß ASR A1.3.",
            rechtlich: "Anlagen zum Umgang mit wassergefährdenden Stoffen sind nach § 17 AwSV gegen mechanische Beschädigung zu schützen; Gefahrstellen sind nach ASR A1.3 zu kennzeichnen."
        },
        "31.9": {
            einfach: "Lassen Sie nur eingewiesene Personen tanken und sichern Sie die Zapfsäule gegen fremde Benutzung.",
            bghw: "Unterweisen Sie die Beschäftigten anhand einer Betriebsanweisung (TRGS 555) und sichern Sie die Anlage gegen unbefugte Nutzung.",
            rechtlich: "Für Tätigkeiten mit Dieselkraftstoff sind nach § 14 GefStoffV Betriebsanweisung und Unterweisung erforderlich; die Unterweisung ist mindestens jährlich zu wiederholen."
        },
        "31.10": {
            einfach: "Tragen Sie beim Tanken Schutzhandschuhe und cremen Sie die Hände danach ein.",
            bghw: "Stellen Sie Schutzhandschuhe und Hautschutzmittel gemäß Hautschutzplan (TRGS 401) bereit.",
            rechtlich: "Bei Hautkontakt mit Dieselkraftstoff sind nach TRGS 401 Schutzmaßnahmen festzulegen; geeignete Schutzhandschuhe sind nach § 2 PSA-Benutzungsverordnung bereitzustellen."
        }
    },
    "Aufzüge (Personen- und Lastenaufzug)": {
        "32.1": {
            einfach: "Achten Sie darauf, dass der Personenaufzug spätestens alle zwei Jahre vom TÜV oder einer anderen ZÜS geprüft wird.",
            bghw: "Lassen Sie Personenaufzüge gemäß BetrSichV und TRBS 3121 wiederkehrend durch eine ZÜS prüfen (Hauptprüfung höchstens alle zwei Jahre, dazwischen Zwischenprüfung).",
            rechtlich: "Aufzugsanlagen sind nach § 16 BetrSichV i. V. m. BetrSichV Anhang 2 Abschnitt 2 wiederkehrend durch eine ZÜS zu prüfen; die Frist der Hauptprüfung darf zwei Jahre nicht überschreiten."
        },
        "32.2": {
            einfach: "Testen Sie den Notruf im Aufzug und klären Sie, wer im Notfall eingeschlossene Personen befreit.",
            bghw: "Stellen Sie ein ständig erreichbares Notrufsystem und einen Notfallplan zur Personenbefreiung gemäß TRBS 3121 sicher.",
            rechtlich: "Nach BetrSichV Anhang 1 Nr. 4 müssen Aufzugsanlagen mit einem wirksamen Zweiwege-Kommunikationssystem ausgestattet sein; die Befreiung ist nach TRBS 3121 zu organisieren."
        },
        "32.3": {
            einfach: "Melden Sie Schäden am Aufzug sofort und lassen Sie sie reparieren.",
            bghw: "Lassen Sie Mängel umgehend durch den Aufzugsfachbetrieb beheben; bei gefährlichen Mängeln ist der Aufzug stillzusetzen (TRBS 3121).",
            rechtlich: "Arbeitsmittel mit Mängeln dürfen nach § 4 Abs. 5 BetrSichV nicht verwendet werden; Instandsetzungen sind nach § 10 BetrSichV durchzuführen."
        },
        "32.4": {
            einfach: "Lassen Sie den Lastenaufzug regelmäßig prüfen und heben Sie den Nachweis auf.",
            bghw: "Lassen Sie Güteraufzüge gemäß BetrSichV und TRBS 3121 wiederkehrend prüfen; die Prüfart (ZÜS oder befähigte Person) richtet sich nach der Anlagenart.",
            rechtlich: "Die Prüfpflichten ergeben sich aus §§ 14, 16 BetrSichV und BetrSichV Anhang 2 Abschnitt 2; die Prüffristen sind nach § 3 Abs. 6 BetrSichV festzulegen."
        },
        "32.5": {
            einfach: "Bringen Sie ein deutliches Schild „Personenbeförderung verboten“ an und kontrollieren Sie die Einhaltung.",
            bghw: "Kennzeichnen Sie das Mitfahrverbot gemäß ASR A1.3 und unterweisen Sie die Beschäftigten (TRBS 3121).",
            rechtlich: "Arbeitsmittel dürfen nach § 4 Abs. 1 BetrSichV nur bestimmungsgemäß verwendet werden; Güteraufzüge ohne Zulassung zur Personenbeförderung dürfen nicht von Personen benutzt werden."
        },
        "32.6": {
            einfach: "Achten Sie auf das Lastschild und stellen Sie Rollcontainer im Aufzug gebremst ab.",
            bghw: "Bringen Sie Tragfähigkeitsangaben und Bedienhinweise an und regeln Sie die Ladungssicherung im Fahrkorb in der Betriebsanweisung.",
            rechtlich: "Nach § 12 BetrSichV ist eine Betriebsanweisung bereitzustellen; die zulässige Last darf nach § 4 Abs. 1 BetrSichV nicht überschritten werden."
        }
    },
    "Photovoltaikanlage auf den Dächern": {
        "45.1": {
            einfach: "Lassen Sie die Solaranlage und die Wechselrichter regelmäßig von einer Elektrofachkraft prüfen.",
            bghw: "Lassen Sie die PV-Anlage gemäß DGUV Vorschrift 3 und DIN EN 62446-1 wiederkehrend prüfen und dokumentieren Sie das Ergebnis.",
            rechtlich: "Elektrische Anlagen sind nach § 5 DGUV Vorschrift 3 wiederkehrend zu prüfen; die Fristen sind nach § 3 Abs. 6 BetrSichV festzulegen."
        },
        "45.2": {
            einfach: "Lassen Sie aufs Dach nur, wenn Absturzsicherungen da sind, und sichern Sie Lichtkuppeln gegen Durchtreten.",
            bghw: "Sichern Sie Dacharbeitsplätze gemäß ASR A2.1 (Geländer, Anschlageinrichtungen nach DIN EN 795, durchsturzsichere Lichtkuppeln) und legen Sie Laufwege fest.",
            rechtlich: "Arbeitsplätze auf Dächern sind nach Anhang Nr. 2.1 ArbStättV gegen Absturz und Durchsturz zu sichern; technische Maßnahmen haben nach § 4 Nr. 5 ArbSchG Vorrang vor PSA."
        },
        "45.3": {
            einfach: "Halten Sie den Dachzugang verschlossen und lassen Sie nur eingewiesene Personen hinauf.",
            bghw: "Regeln Sie den Dachzugang schriftlich (Schlüssel, Freigabe, Koordination von Fremdfirmen nach DGUV Vorschrift 1).",
            rechtlich: "Gefahrenbereiche sind nach § 9 ArbSchG nur für unterwiesene Beschäftigte zugänglich zu machen; bei Fremdfirmen gilt § 8 ArbSchG."
        },
        "45.4": {
            einfach: "Bringen Sie am Gebäude ein Hinweisschild „PV-Anlage“ an und tragen Sie die Anlage in den Feuerwehrplan ein.",
            bghw: "Kennzeichnen Sie die PV-Anlage für die Feuerwehr (VDE-AR-E 2100-712) und nehmen Sie sie in die Feuerwehrpläne (DIN 14095) auf.",
            rechtlich: "Notfallmaßnahmen sind nach § 10 ArbSchG mit der Feuerwehr abzustimmen; die Kennzeichnung erfolgt nach den anerkannten Regeln der Technik."
        },
        "45.5": {
            einfach: "Lagern Sie nichts Brennbares bei den Wechselrichtern oder dem Batteriespeicher.",
            bghw: "Stellen Sie Wechselrichter und Speicher nach Herstellerangaben auf und berücksichtigen Sie sie im Brandschutzkonzept.",
            rechtlich: "Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen; elektrische Anlagen sind nach § 3 DGUV Vorschrift 3 nach den elektrotechnischen Regeln zu betreiben."
        },
        "45.6": {
            einfach: "Lassen Sie an der Solaranlage nur Fachleute arbeiten – auch bei Sonne liegt Spannung an.",
            bghw: "Beauftragen Sie für Arbeiten an der PV-Anlage nur Elektrofachkräfte bzw. Fachfirmen und koordinieren Sie diese nach DGUV Vorschrift 1.",
            rechtlich: "Arbeiten an elektrischen Anlagen dürfen nach § 3 DGUV Vorschrift 3 nur durch Elektrofachkräfte oder unter deren Leitung und Aufsicht erfolgen."
        },
        "45.7": {
            einfach: "Lassen Sie die Befestigung der Module und den Blitzschutz regelmäßig und nach Sturm kontrollieren.",
            bghw: "Legen Sie Sichtkontrollen der Unterkonstruktion und die Prüfung des Blitzschutzes (DIN EN 62305-3) fest.",
            rechtlich: "Nach § 4 ArbSchG sind Gefährdungen durch herabfallende Teile zu vermeiden; Blitzschutzanlagen sind nach den anerkannten Regeln der Technik zu prüfen."
        }
    },
    "Ballenpresse und Müllpresse": {
        "33.1": {
            einfach: "Prüfen Sie, ob die Presse stoppt, wenn die Tür geöffnet wird, und lassen Sie Defekte sofort reparieren.",
            bghw: "Stellen Sie die Wirksamkeit der Schutzeinrichtungen gemäß Herstellerangaben und DIN EN 16500 sicher; manipulierte Pressen sind stillzusetzen.",
            rechtlich: "Schutzeinrichtungen dürfen nach § 6 Abs. 2 BetrSichV nicht umgangen oder unwirksam gemacht werden; Arbeitsmittel mit Mängeln dürfen nach § 4 Abs. 5 BetrSichV nicht verwendet werden."
        },
        "33.2": {
            einfach: "Lassen Sie die Presse regelmäßig von einer Fachfirma prüfen.",
            bghw: "Lassen Sie Pressen gemäß BetrSichV und Herstellerangaben wiederkehrend prüfen und dokumentieren Sie das Ergebnis.",
            rechtlich: "Nach § 3 Abs. 6 und § 14 BetrSichV sind Prüffristen festzulegen und Prüfungen durch eine zur Prüfung befähigte Person durchzuführen und aufzuzeichnen."
        },
        "33.3": {
            einfach: "Lassen Sie nur eingewiesene Erwachsene die Presse bedienen und sichern Sie sie mit Schlüssel.",
            bghw: "Beauftragen Sie Bedienpersonen schriftlich, sichern Sie die Presse gegen unbefugte Benutzung (Schlüsselschalter) und beachten Sie das Beschäftigungsverbot für Jugendliche.",
            rechtlich: "Nach § 12 Abs. 3 BetrSichV ist die Verwendung beauftragten Beschäftigten vorzubehalten; Jugendliche dürfen nach § 22 JArbSchG nicht mit gefährlichen Arbeiten beschäftigt werden, außer im Rahmen der Ausbildung unter Aufsicht."
        },
        "33.4": {
            einfach: "Hängen Sie eine verständliche Bedienanleitung direkt an der Presse aus.",
            bghw: "Erstellen Sie eine Betriebsanweisung gemäß BetrSichV und Herstellerangaben.",
            rechtlich: "Nach § 12 Abs. 2 BetrSichV ist eine schriftliche Betriebsanweisung in verständlicher Form und Sprache bereitzustellen."
        },
        "33.5": {
            einfach: "Halten Sie den Platz um die Presse frei und lagern Sie keine losen Kartons daneben.",
            bghw: "Halten Sie den Pressenbereich frei und minimieren Sie Brandlasten gemäß ASR A2.2.",
            rechtlich: "Brandgefährdungen sind nach § 5 ArbSchG zu beurteilen und durch organisatorische Maßnahmen zu verringern (ASR A2.2)."
        },
        "33.6": {
            einfach: "Stapeln Sie Ballen nur so hoch, dass sie sicher stehen.",
            bghw: "Legen Sie Lagerflächen und Stapelhöhen für Ballen in der Gefährdungsbeurteilung fest.",
            rechtlich: "Nach § 4 ArbSchG sind Gefährdungen durch umfallende Lasten zu vermeiden; die Lagerung ist nach § 5 ArbSchG zu beurteilen."
        }
    },
    "Gefahrstoffe": {
        "34.1": {
            einfach: "Führen Sie eine aktuelle Liste aller Gefahrstoffe, die am Standort verwendet oder gelagert werden.",
            bghw: "Führen Sie ein Gefahrstoffverzeichnis gemäß GefStoffV und aktualisieren Sie es regelmäßig.",
            rechtlich: "Nach § 6 Abs. 12 GefStoffV hat der Arbeitgeber ein Verzeichnis der verwendeten Gefahrstoffe zu führen."
        },
        "34.2": {
            einfach: "Halten Sie die Sicherheitsdatenblätter aktuell bereit, sodass jeder sie schnell findet.",
            bghw: "Halten Sie die Sicherheitsdatenblätter gemäß REACH-Verordnung Art. 31 bereit und machen Sie sie zugänglich.",
            rechtlich: "Sicherheitsdatenblätter sind nach REACH-Verordnung Art. 31 vom Lieferanten bereitzustellen; sie sind nach § 6 GefStoffV Grundlage der Gefährdungsbeurteilung."
        },
        "34.3": {
            einfach: "Hängen Sie für jeden Gefahrstoff eine kurze Anleitung aus und erklären Sie sie den Beschäftigten.",
            bghw: "Erstellen Sie Betriebsanweisungen gemäß TRGS 555 und unterweisen Sie die Beschäftigten mindestens jährlich.",
            rechtlich: "Nach § 14 GefStoffV sind schriftliche Betriebsanweisungen zu erstellen und die Beschäftigten vor Aufnahme der Tätigkeit und danach mindestens jährlich mündlich und arbeitsplatzbezogen zu unterweisen."
        },
        "34.4": {
            einfach: "Lagern Sie Gefahrstoffe in Auffangwannen und getrennt nach Sorte, nie in Fluren oder Fluchtwegen.",
            bghw: "Lagern Sie Gefahrstoffe gemäß TRGS 510 (Auffangwannen, Zusammenlagerung, Lagermengen).",
            rechtlich: "Gefahrstoffe sind nach § 8 GefStoffV so aufzubewahren, dass sie die Gesundheit und Umwelt nicht gefährden; die TRGS 510 konkretisiert die Lagerung in ortsbeweglichen Behältern."
        },
        "34.5": {
            einfach: "Füllen Sie Gefahrstoffe nie in Getränkeflaschen um und beschriften Sie alle Behälter.",
            bghw: "Kennzeichnen Sie alle Behälter gemäß GefStoffV und TRGS 201; Lebensmittelbehälter dürfen nicht verwendet werden.",
            rechtlich: "Nach § 8 Abs. 2 GefStoffV müssen Gefahrstoffe identifizierbar und gekennzeichnet sein; Behälter, die zu Verwechslungen mit Lebensmitteln führen können, dürfen nicht verwendet werden."
        },
        "34.6": {
            einfach: "Stellen Sie passende Handschuhe und Schutzbrillen bereit und achten Sie darauf, dass sie getragen werden.",
            bghw: "Stellen Sie PSA gemäß Sicherheitsdatenblatt und Gefährdungsbeurteilung bereit (DGUV Regel 112-195 für Schutzhandschuhe).",
            rechtlich: "Nach § 7 GefStoffV und § 2 PSA-Benutzungsverordnung ist erforderliche PSA bereitzustellen; die Beschäftigten haben sie nach § 15 ArbSchG zu benutzen."
        },
        "34.7": {
            einfach: "Prüfen Sie, ob es weniger gefährliche Reiniger oder Stoffe gibt, und tauschen Sie sie aus.",
            bghw: "Führen Sie eine Substitutionsprüfung gemäß TRGS 600 durch und dokumentieren Sie das Ergebnis.",
            rechtlich: "Nach § 6 Abs. 1 Nr. 4 und § 7 Abs. 3 GefStoffV ist zu prüfen, ob Gefahrstoffe durch weniger gefährliche ersetzt werden können; das Ergebnis ist zu dokumentieren."
        },
        "34.8": {
            einfach: "Lagern Sie Spraydosen kühl und nicht in der Nähe von Heizungen oder in Fluren.",
            bghw: "Lagern Sie Druckgaspackungen gemäß TRGS 510.",
            rechtlich: "Gefahrstoffe sind nach § 8 GefStoffV so aufzubewahren, dass keine Gefährdung entsteht; die TRGS 510 regelt die Lagerung von Aerosolpackungen."
        }
    },
    "Brandschutz und Flucht": {
        "35.1": {
            einfach: "Halten Sie Feuerlöscher frei und lassen Sie sie mindestens alle zwei Jahre prüfen.",
            bghw: "Stellen Sie Feuerlöscher gemäß ASR A2.2 bereit und lassen Sie sie gemäß DIN 14406-4 mindestens alle zwei Jahre durch einen Sachkundigen prüfen.",
            rechtlich: "Arbeitsstätten sind nach Anhang Nr. 2.2 ArbStättV mit Feuerlöscheinrichtungen auszustatten; die ASR A2.2 fordert eine Instandhaltung mindestens alle zwei Jahre."
        },
        "35.2": {
            einfach: "Halten Sie alle Fluchtwege und Notausgänge immer frei.",
            bghw: "Halten Sie Fluchtwege gemäß ASR A2.3 frei und kennzeichnen Sie sie gemäß ASR A1.3.",
            rechtlich: "Fluchtwege und Notausgänge sind nach § 4 Abs. 4 ArbStättV ständig freizuhalten und nach Anhang Nr. 2.3 ArbStättV zu kennzeichnen."
        },
        "35.3": {
            einfach: "Hängen Sie aktuelle Fluchtpläne an gut sichtbaren Stellen aus.",
            bghw: "Erstellen und aktualisieren Sie Flucht- und Rettungspläne gemäß ASR A2.3 und DIN ISO 23601.",
            rechtlich: "Ein Flucht- und Rettungsplan ist nach § 4 Abs. 4 ArbStättV aufzustellen, wenn Lage, Ausdehnung und Art der Arbeitsstätte dies erfordern; er ist an geeigneten Stellen auszuhängen."
        },
        "35.4": {
            einfach: "Lassen Sie die Notbeleuchtung regelmäßig testen und defekte Leuchten tauschen.",
            bghw: "Prüfen Sie die Sicherheitsbeleuchtung gemäß DIN EN 50172 und DIN V VDE V 0108-100 und dokumentieren Sie die Prüfungen.",
            rechtlich: "Sicherheitsbeleuchtung ist nach ASR A2.3 und ASR A3.4 dort erforderlich, wo bei Ausfall der Allgemeinbeleuchtung Gefährdungen entstehen; sie ist wiederkehrend zu prüfen."
        },
        "35.5": {
            einfach: "Verkeilen Sie keine Brandschutztüren und halten Sie den Schließbereich frei.",
            bghw: "Halten Sie Feuerschutzabschlüsse funktionsfähig; Feststellanlagen sind gemäß DIN 14677 jährlich zu warten.",
            rechtlich: "Feuerschutzabschlüsse dürfen in ihrer Funktion nicht beeinträchtigt werden; Feststellanlagen sind nach den bauaufsichtlichen Vorgaben und DIN 14677 regelmäßig zu prüfen."
        },
        "35.6": {
            einfach: "Stapeln Sie Ware nicht bis unter die Sprinklerköpfe.",
            bghw: "Halten Sie den Freiraum unter Sprinklern gemäß Brandschutzkonzept und Sprinklerrichtlinie (VdS CEA 4001) ein.",
            rechtlich: "Die Wirksamkeit von Brandschutzanlagen ist nach § 4 ArbSchG und den Vorgaben des Brandschutzkonzepts sicherzustellen."
        },
        "35.7": {
            einfach: "Bilden Sie genug Brandschutzhelfer aus, etwa jede zwanzigste Person.",
            bghw: "Benennen und schulen Sie Brandschutzhelfer gemäß ASR A2.2 und DGUV Information 205-023; der Richtwert liegt bei 5 % der Beschäftigten.",
            rechtlich: "Nach § 10 Abs. 2 ArbSchG sind Beschäftigte für die Brandbekämpfung zu benennen; die ASR A2.2 nennt in der Regel 5 % der Beschäftigten."
        },
        "35.8": {
            einfach: "Hängen Sie die Brandschutzordnung aus und üben Sie regelmäßig die Räumung des Gebäudes.",
            bghw: "Erstellen Sie eine Brandschutzordnung gemäß DIN 14096 und führen Sie Räumungsübungen gemäß ASR A2.3 durch.",
            rechtlich: "Nach ASR A2.3 ist in angemessenen Zeitabständen anhand des Flucht- und Rettungsplans zu üben, wie sich die Beschäftigten im Gefahr- oder Katastrophenfall in Sicherheit bringen."
        },
        "35.9": {
            einfach: "Lassen Sie die Brandmeldeanlage regelmäßig prüfen und warten.",
            bghw: "Lassen Sie Brandmeldeanlagen gemäß DIN 14675 und DIN VDE 0833 inspizieren und warten.",
            rechtlich: "Brandmeldeanlagen sind nach den bauordnungsrechtlichen Prüfvorschriften und den anerkannten Regeln der Technik (DIN 14675, DIN VDE 0833) wiederkehrend zu prüfen."
        },
        "35.10": {
            einfach: "Lassen Sie die Rauchabzüge regelmäßig warten.",
            bghw: "Lassen Sie RWA gemäß Herstellerangaben und DIN 18232-2 wiederkehrend warten.",
            rechtlich: "Rauch- und Wärmeabzugsanlagen sind nach Bauordnungsrecht bzw. Brandschutzkonzept wiederkehrend zu prüfen und instand zu halten."
        },
        "35.11": {
            einfach: "Halten Sie die Wandhydranten frei und lassen Sie sie prüfen.",
            bghw: "Lassen Sie Wandhydranten gemäß DIN 14462 wiederkehrend prüfen.",
            rechtlich: "Einrichtungen zur Brandbekämpfung sind nach ASR A2.2 instand zu halten und jederzeit zugänglich zu halten."
        },
        "35.12": {
            einfach: "Halten Sie die Feuerwehrzufahrt immer frei und parken Sie dort nicht.",
            bghw: "Halten Sie Flächen für die Feuerwehr gemäß DIN 14090 und Brandschutzkonzept frei.",
            rechtlich: "Flächen für die Feuerwehr sind nach Bauordnungsrecht ständig freizuhalten; die DIN 14090 konkretisiert die Anforderungen."
        },
        "35.13": {
            einfach: "Lagern Sie Paletten und Leergut draußen nicht direkt an der Hauswand.",
            bghw: "Legen Sie Abstände für Außenlagerungen nach Brandschutzkonzept und Vorgaben des Sachversicherers fest.",
            rechtlich: "Brandgefährdungen durch Außenlagerung sind nach § 5 ArbSchG zu beurteilen; Vorgaben des Brandschutzkonzepts sind einzuhalten."
        }
    },
    "Erste Hilfe": {
        "36.1": {
            einfach: "Sorgen Sie dafür, dass in jeder Schicht genug Ersthelfer da sind.",
            bghw: "Stellen Sie ausreichend Ersthelfer gemäß DGUV Vorschrift 1 sicher (bei mehr als 20 Anwesenden in Handelsbetrieben 5 %, in sonstigen Betrieben 10 %; Einstufung in der Gefährdungsbeurteilung festlegen).",
            rechtlich: "Nach § 26 DGUV Vorschrift 1 muss eine ausreichende Zahl von Ersthelfern zur Verfügung stehen; bei 2 bis 20 Anwesenden mindestens eine Person, darüber 5 % (Handel) bzw. 10 % (sonstige Betriebe)."
        },
        "36.2": {
            einfach: "Prüfen Sie die Verbandkästen regelmäßig und füllen Sie verbrauchtes Material nach.",
            bghw: "Stellen Sie Erste-Hilfe-Material gemäß DGUV Information 204-022 und ASR A4.3 bereit (DIN 13157 bzw. DIN 13169) und kontrollieren Sie es regelmäßig.",
            rechtlich: "Nach § 25 DGUV Vorschrift 1 und Anhang Nr. 4.3 ArbStättV sind Mittel zur Ersten Hilfe leicht zugänglich und in ausreichender Menge bereitzuhalten."
        },
        "36.3": {
            einfach: "Schreiben Sie jede Erste-Hilfe-Leistung ins Verbandbuch.",
            bghw: "Dokumentieren Sie Erste-Hilfe-Leistungen gemäß DGUV Information 204-020 und bewahren Sie die Aufzeichnungen fünf Jahre auf.",
            rechtlich: "Nach § 24 Abs. 6 DGUV Vorschrift 1 ist jede Erste-Hilfe-Leistung zu dokumentieren; die Aufzeichnungen sind fünf Jahre aufzubewahren."
        },
        "36.4": {
            einfach: "Hängen Sie die Notrufnummer und die Namen der Ersthelfer gut sichtbar aus.",
            bghw: "Hängen Sie Notrufnummern und Ersthelfer gemäß DGUV Information 204-022 aus (Aushang Erste Hilfe).",
            rechtlich: "Nach § 24 Abs. 5 DGUV Vorschrift 1 ist durch Aushänge über die Erste Hilfe und Notrufnummern zu informieren."
        },
        "36.5": {
            einfach: "Prüfen Sie, ob ein Defibrillator sinnvoll ist, und halten Sie ihn einsatzbereit.",
            bghw: "Entscheiden Sie über die Bereitstellung eines AED in der Gefährdungsbeurteilung (DGUV Information 204-022) und halten Sie ihn gemäß Herstellerangaben einsatzbereit.",
            rechtlich: "Art und Umfang der Erste-Hilfe-Einrichtungen sind nach § 10 ArbSchG und § 25 DGUV Vorschrift 1 nach der Gefährdungsbeurteilung festzulegen."
        },
        "36.6": {
            einfach: "Stellen Sie eine Augenspülflasche dort bereit, wo mit Säuren oder Reinigern gearbeitet wird.",
            bghw: "Stellen Sie Augenspüleinrichtungen gemäß Gefährdungsbeurteilung und DGUV Information 204-022 bereit.",
            rechtlich: "Mittel zur Ersten Hilfe sind nach § 25 DGUV Vorschrift 1 entsprechend den betrieblichen Gefährdungen bereitzuhalten."
        },
        "36.7": {
            einfach: "Prüfen Sie, ob ein Sanitätsraum nötig ist, und halten Sie ihn einsatzbereit.",
            bghw: "Stellen Sie einen Sanitätsraum gemäß DGUV Vorschrift 1 und ASR A4.3 bereit, wenn die Voraussetzungen erfüllt sind.",
            rechtlich: "Nach § 25 Abs. 4 DGUV Vorschrift 1 ist ein Sanitätsraum bereitzustellen, wenn mehr als 1.000 Versicherte oder bei besonderen Unfallgefahren mehr als 100 Versicherte tätig sind (ASR A4.3)."
        },
        "36.8": {
            einfach: "Legen Sie fest, wer den Rettungsdienst an der Pforte empfängt und zum Unfallort bringt.",
            bghw: "Legen Sie im Notfallplan die Alarmierung und Einweisung des Rettungsdienstes fest (DGUV Information 204-022).",
            rechtlich: "Nach § 10 ArbSchG sind die erforderlichen Verbindungen zu außerbetrieblichen Stellen, insbesondere Rettungsdienst und Feuerwehr, herzustellen."
        }
    },
    "Organisation": {
        "37.1": {
            einfach: "Prüfen Sie, ob die Gefährdungsbeurteilung aktuell ist und alle Tätigkeiten abdeckt.",
            bghw: "Erstellen und aktualisieren Sie die Gefährdungsbeurteilung für alle Tätigkeiten, einschließlich psychischer Belastung, und dokumentieren Sie sie.",
            rechtlich: "Nach §§ 5, 6 ArbSchG ist die Gefährdungsbeurteilung durchzuführen und zu dokumentieren; nach § 5 Abs. 3 Nr. 6 ArbSchG ist die psychische Belastung zu berücksichtigen."
        },
        "37.2": {
            einfach: "Unterweisen Sie alle Beschäftigten jedes Jahr, Jugendliche jedes halbe Jahr, und lassen Sie es unterschreiben.",
            bghw: "Führen Sie Unterweisungen gemäß DGUV Vorschrift 1 mindestens jährlich durch und dokumentieren Sie diese.",
            rechtlich: "Die Unterweisung ist nach § 12 ArbSchG und § 4 DGUV Vorschrift 1 mindestens jährlich zu wiederholen und zu dokumentieren; Jugendliche sind nach § 29 JArbSchG mindestens halbjährlich zu unterweisen."
        },
        "37.3": {
            einfach: "Führen Sie eine Liste aller Geräte und Anlagen, die geprüft werden müssen, mit den nächsten Prüfterminen.",
            bghw: "Führen Sie ein Prüfkataster (z. B. Stapler, Regale, Tore, Ladebrücken, Leitern, Elektrogeräte, Aufzüge) gemäß BetrSichV und überwachen Sie die Fristen.",
            rechtlich: "Nach § 3 Abs. 6 BetrSichV sind Art, Umfang und Fristen erforderlicher Prüfungen zu ermitteln; die Ergebnisse sind nach § 14 Abs. 7 BetrSichV aufzuzeichnen."
        },
        "37.4": {
            einfach: "Stimmen Sie mit Fremdfirmen ab, welche Gefahren es gibt und wer wofür zuständig ist.",
            bghw: "Regeln Sie die Koordination mit Fremdfirmen gemäß DGUV Vorschrift 1 (z. B. Fremdfirmenregelung, Einweisung, Koordinator).",
            rechtlich: "Nach § 8 ArbSchG und § 6 DGUV Vorschrift 1 haben Arbeitgeber bei der Zusammenarbeit zusammenzuwirken; erforderlichenfalls ist ein Koordinator zu bestimmen."
        },
        "37.5": {
            einfach: "Legen Sie fest, wie Personen abgesichert werden, die allein arbeiten.",
            bghw: "Beurteilen Sie Alleinarbeit und legen Sie Überwachungsmaßnahmen fest, z. B. Personen-Notsignal-Anlagen gemäß DGUV Regel 112-139.",
            rechtlich: "Nach § 8 DGUV Vorschrift 1 ist bei gefährlichen Arbeiten, die von einer Person allein ausgeführt werden, eine geeignete Überwachung sicherzustellen."
        },
        "37.6": {
            einfach: "Achten Sie auf die Arbeitszeitregeln und bieten Sie Nachtarbeitern eine Untersuchung beim Betriebsarzt an.",
            bghw: "Gestalten Sie Schichtpläne nach gesicherten arbeitswissenschaftlichen Erkenntnissen und bieten Sie die Untersuchung für Nachtarbeitnehmer an.",
            rechtlich: "Nach § 6 Abs. 1 ArbZG ist Nacht- und Schichtarbeit nach gesicherten arbeitswissenschaftlichen Erkenntnissen festzulegen; Nachtarbeitnehmer haben nach § 6 Abs. 3 ArbZG Anspruch auf arbeitsmedizinische Untersuchung."
        },
        "37.7": {
            einfach: "Klären Sie, ob Betriebsarzt und Sicherheitsfachkraft benannt sind und ob sich der Arbeitsschutzausschuss regelmäßig trifft.",
            bghw: "Stellen Sie die Betreuung gemäß DGUV Vorschrift 2 sicher und führen Sie den Arbeitsschutzausschuss mindestens vierteljährlich durch.",
            rechtlich: "Nach §§ 2, 5 ASiG sind Betriebsarzt und Fachkraft für Arbeitssicherheit zu bestellen; bei mehr als 20 Beschäftigten ist nach § 11 ASiG ein Arbeitsschutzausschuss zu bilden, der mindestens vierteljährlich zusammentritt."
        },
        "37.8": {
            einfach: "Schauen Sie sich jeden Unfall genau an, melden Sie ihn bei Bedarf der Berufsgenossenschaft und überlegen Sie, wie er künftig vermieden wird.",
            bghw: "Untersuchen Sie Unfälle, melden Sie meldepflichtige Unfälle an die BGHW und passen Sie die Gefährdungsbeurteilung an.",
            rechtlich: "Unfälle mit mehr als drei Tagen Arbeitsunfähigkeit sind nach § 193 SGB VII binnen drei Tagen anzuzeigen; die Gefährdungsbeurteilung ist nach § 3 Abs. 1 ArbSchG anzupassen."
        },
        "37.9": {
            einfach: "Prüfen Sie für jede Tätigkeit, ob sie für Schwangere geeignet ist, und schreiben Sie das auf.",
            bghw: "Führen Sie die anlassunabhängige Gefährdungsbeurteilung nach Mutterschutzgesetz durch und dokumentieren Sie sie.",
            rechtlich: "Nach § 10 MuSchG ist für jede Tätigkeit die Gefährdung für schwangere oder stillende Frauen zu beurteilen und zu dokumentieren."
        },
        "37.10": {
            einfach: "Unterweisen Sie neue Kräfte und Leiharbeiter am ersten Tag vor Arbeitsbeginn.",
            bghw: "Stellen Sie die Erstunterweisung vor Arbeitsaufnahme sicher, auch für Leiharbeitnehmer (DGUV Vorschrift 1).",
            rechtlich: "Nach § 12 ArbSchG ist vor Aufnahme der Tätigkeit zu unterweisen; bei Arbeitnehmerüberlassung trifft die Pflicht nach § 12 Abs. 2 ArbSchG den Entleiher."
        },
        "37.11": {
            einfach: "Hängen Sie an jeder Maschine eine verständliche Anleitung aus.",
            bghw: "Erstellen Sie Betriebsanweisungen für Arbeitsmittel gemäß BetrSichV und halten Sie sie aktuell.",
            rechtlich: "Nach § 12 Abs. 2 BetrSichV sind schriftliche Betriebsanweisungen in verständlicher Form und Sprache zur Verfügung zu stellen."
        }
    },
    default: {
        einfach: 'Legen Sie geeignete Maßnahmen fest, um den Mangel zu beheben, und dokumentieren Sie diese.',
        bghw: 'Legen Sie geeignete Maßnahmen zur Mängelbeseitigung gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung fest und dokumentieren Sie diese nachvollziehbar.',
        rechtlich: 'Geeignete Maßnahmen zur Mängelbeseitigung sind gemäß § 3 ArbSchG festzulegen und zu dokumentieren; die Wirksamkeit ist nach § 3 Abs. 1 Satz 2 ArbSchG zu überprüfen.'
    }
};

// Flache Zuordnung: Pruefpunkt-ID -> {einfach, bghw, rechtlich} (ueber alle Kategorien hinweg).
const MEASURES_BY_ID = (() => {
    const map = {};
    Object.keys(MEASURES_TEXT).forEach(key => {
        const value = MEASURES_TEXT[key];
        if (key === 'default' || typeof value !== 'object') return;
        Object.keys(value).forEach(itemId => {
            map[itemId] = value[itemId];
        });
    });
    return map;
})();

// Aktuell gewaehlter Sprachstil (wird von der App per Umschalter gesetzt und in localStorage gemerkt).
let MEASURE_STYLE = localStorage.getItem('ghbMeasureStyle') || 'einfach';

function setMeasureStyle(style) {
    if (['einfach', 'bghw', 'rechtlich'].indexOf(style) === -1) return;
    MEASURE_STYLE = style;
    localStorage.setItem('ghbMeasureStyle', style);
}

// Helfer: liefert den vordefinierten Massnahmen-Text zu einer Pruefpunkt-ID im aktuell gewaehlten Stil.
// style kann optional explizit angegeben werden, sonst wird MEASURE_STYLE verwendet.
function getMeasureText(itemId, style) {
    // Freie Pruefpunkte ("Sonstiges"): kein Vorschlag, Maßnahme frei eintragen
    if (typeof FREIE_PUNKT_IDS !== 'undefined' && FREIE_PUNKT_IDS.indexOf(itemId) !== -1) return '';
    const s = style || MEASURE_STYLE;
    const entry = MEASURES_BY_ID[itemId];
    if (entry && entry[s]) return entry[s];
    if (entry && entry.rechtlich) return entry.rechtlich;
    return MEASURES_TEXT.default[s] || MEASURES_TEXT.default.rechtlich;
}
