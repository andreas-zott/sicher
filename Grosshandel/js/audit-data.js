// Großhandel Begehung – Prüfkatalog (Rev. 1.0, Stand 20.11.2026)
// Aufgebaut auf ASiC Handel Rev. 1.55-20. Jede Kategorie hat einen Schalter
// "nicht zutreffend" (Text: naLabel). Optionale Unterbereiche über "group",
// Gliederung in Bereiche über "bereich", Prüffrist in Monaten über "pruef" (0 = nur Datum).
// Wird aus tools/katalog*.py erzeugt (tools/erzeuge.py) - Änderungen dort pflegen.
const AUDIT_CATEGORIES = [
    {
        id: "empfang",
        nr: 1,
        name: "Haupteingang und Empfang",
        bereich: "Eingänge, Empfang und Besucherbereiche",
        naLabel: "Kein Haupteingang mit Empfang am Standort",
        items: [
            { id: "1.1", pruef: 12, text: "Sind die automatischen Eingangstüren bzw. Karusselltüren wiederkehrend geprüft und funktionieren die Schutzeinrichtungen?" },
            { id: "1.2", text: "Ist der Eingangsbereich bei Nässe rutschsicher (Sauberlaufzone, Schirmständer, keine glatten Fliesen ohne Matte)?" },
            { id: "1.3", text: "Sind Glastüren und Glaswände aus Sicherheitsglas und in Augenhöhe gut sichtbar markiert?" },
            { id: "1.4", text: "Ist der Empfangsarbeitsplatz ergonomisch gestaltet (Theke, Bildschirm, Sitz-/Stehmöglichkeit) und vor Zugluft der Eingangstüren geschützt?" },
            { id: "1.5", text: "Gibt es für das Empfangspersonal Regeln und Hilfsmittel für schwierige oder bedrohliche Situationen (Alarmknopf, Notruf, Rückzugsmöglichkeit, Schulung)?" },
            { id: "1.6", text: "Werden Besucher registriert und über die wichtigsten Sicherheitsregeln informiert (Besucherausweis, Hinweisblatt, Begleitung ins Lager)?" },
            { id: "1.7", text: "Sind Fluchtwege, Notausgang und Sammelplatz vom Eingangsbereich aus gekennzeichnet und frei?" },
            { id: "1.8", text: "Ist der Eingang barrierefrei erreichbar, soweit Menschen mit Behinderungen beschäftigt sind oder Besucher kommen?" },
            { id: "1.9", text: "Sind Erste-Hilfe-Material, Defibrillator (falls vorhanden) und Notrufliste am Empfang schnell erreichbar?" },
            { id: "1.10", text: "Ist der Bildschirm am Empfang blendfrei aufgestellt (keine Spiegelung durch Glasfassade, Eingangstüren oder Leuchten) und ist ein Sonnenschutz vorhanden?" },
            { id: "1.11", text: "Sind Bildschirm, Tastatur und Maus am Empfang getrennt aufstellbar und Bildschirmhöhe sowie Sehabstand passend eingestellt?" },
            { id: "1.12", text: "Ist am Empfang ein Wechsel zwischen Sitzen und Stehen möglich (Stehpult bzw. höhenverstellbarer Tresen) und ist der Stuhl einstellbar?" },
            { id: "1.13", text: "Wird dem Empfangspersonal die arbeitsmedizinische Vorsorge für Bildschirmarbeit (inkl. Sehtest) angeboten und ist die Bildschirmarbeit durch Pausen bzw. andere Tätigkeiten unterbrochen?" },
            { id: "1.14", text: "Ist die Beleuchtung am Empfangsarbeitsplatz ausreichend (mindestens 500 lx im Bereich der Arbeitsaufgabe) und blendfrei?" }
        ]
    },
    {
        id: "pforten",
        nr: 2,
        name: "Pforten und Schrankenanlagen",
        bereich: "Eingänge, Empfang und Besucherbereiche",
        naLabel: "Keine Pforten bzw. Schrankenanlagen am Standort",
        instanzen: ["Pforte 1", "Pforte 2"],
        profilFeld: "anzahlPforten",
        items: [
            { id: "2.1", group: "Pforte 1", text: "Pforte 1 – Ist der Pförtnerarbeitsplatz ergonomisch gestaltet (geeigneter Stuhl für lange Sitzzeiten, Bildschirme für die Überwachung blendfrei angeordnet)?" },
            { id: "2.2", group: "Pforte 1", text: "Pforte 1 – Ist das Raumklima in der Pforte angemessen (Heizung, Sonnenschutz, Lüftung, keine Zugluft durch Durchreiche)?" },
            { id: "2.3", group: "Pforte 1", text: "Pforte 1 – Werden in der Pforte nur geprüfte elektrische Geräte benutzt (keine privaten Heizlüfter oder Wasserkocher ohne Prüfung)?" },
            { id: "2.4", group: "Pforte 1", text: "Pforte 1 – Ist für Allein- und Nachtarbeit an der Pforte eine Notrufmöglichkeit vorhanden (z. B. Personen-Notsignal-Anlage, Kontrollanrufe)?" },
            { id: "2.5", group: "Pforte 1", text: "Pforte 1 – Ist eine Toilette in angemessener Entfernung erreichbar und ist eine Pausenregelung (Ablösung) vorhanden?" },
            { id: "2.6", group: "Pforte 1", pruef: 12, text: "Pforte 1 – Ist die Schrankenanlage wiederkehrend geprüft und funktionieren die Sicherheitseinrichtungen (Induktionsschleife, Lichtschranke, Schließkraftbegrenzung)?" },
            { id: "2.7", group: "Pforte 1", text: "Pforte 1 – Ist der Schrankenbaum gut sichtbar (rot-weiß, reflektierend, ggf. beleuchtet) und gibt es einen getrennten Weg für Fußgänger und Radfahrer?" },
            { id: "2.8", group: "Pforte 1", text: "Pforte 1 – Ist das Vorgehen bei der Kontrolle und Einweisung von Lkw sicher geregelt (Warnweste, Standort außerhalb des Fahrwegs, Beleuchtung)?" },
            { id: "2.9", group: "Pforte 1", text: "Pforte 1 – Liegen an der Pforte Alarmplan, Notrufnummern, Feuerwehrpläne und Schlüssel für den Notfall bereit und ist das Personal eingewiesen?" },
            { id: "2.10", group: "Pforte 2", text: "Pforte 2 – Ist der Pförtnerarbeitsplatz ergonomisch gestaltet (geeigneter Stuhl für lange Sitzzeiten, Bildschirme für die Überwachung blendfrei angeordnet)?" },
            { id: "2.11", group: "Pforte 2", text: "Pforte 2 – Ist das Raumklima in der Pforte angemessen (Heizung, Sonnenschutz, Lüftung, keine Zugluft durch Durchreiche)?" },
            { id: "2.12", group: "Pforte 2", text: "Pforte 2 – Werden in der Pforte nur geprüfte elektrische Geräte benutzt (keine privaten Heizlüfter oder Wasserkocher ohne Prüfung)?" },
            { id: "2.13", group: "Pforte 2", text: "Pforte 2 – Ist für Allein- und Nachtarbeit an der Pforte eine Notrufmöglichkeit vorhanden (z. B. Personen-Notsignal-Anlage, Kontrollanrufe)?" },
            { id: "2.14", group: "Pforte 2", text: "Pforte 2 – Ist eine Toilette in angemessener Entfernung erreichbar und ist eine Pausenregelung (Ablösung) vorhanden?" },
            { id: "2.15", group: "Pforte 2", pruef: 12, text: "Pforte 2 – Ist die Schrankenanlage wiederkehrend geprüft und funktionieren die Sicherheitseinrichtungen (Induktionsschleife, Lichtschranke, Schließkraftbegrenzung)?" },
            { id: "2.16", group: "Pforte 2", text: "Pforte 2 – Ist der Schrankenbaum gut sichtbar (rot-weiß, reflektierend, ggf. beleuchtet) und gibt es einen getrennten Weg für Fußgänger und Radfahrer?" },
            { id: "2.17", group: "Pforte 2", text: "Pforte 2 – Ist das Vorgehen bei der Kontrolle und Einweisung von Lkw sicher geregelt (Warnweste, Standort außerhalb des Fahrwegs, Beleuchtung)?" },
            { id: "2.18", group: "Pforte 2", text: "Pforte 2 – Liegen an der Pforte Alarmplan, Notrufnummern, Feuerwehrpläne und Schlüssel für den Notfall bereit und ist das Personal eingewiesen?" }
        ]
    },
    {
        id: "boersensaal",
        nr: 3,
        name: "Börsensaal und Veranstaltungen",
        bereich: "Eingänge, Empfang und Besucherbereiche",
        naLabel: "Kein Börsensaal bzw. Veranstaltungsbereich am Standort",
        items: [
            { id: "3.1", text: "Ist die höchstzulässige Personenzahl bekannt und liegt ein genehmigter Bestuhlungs- und Rettungswegeplan vor?" },
            { id: "3.2", text: "Sind Rettungswege und Notausgänge frei, ausreichend breit, gekennzeichnet und öffnen die Türen in Fluchtrichtung (ggf. mit Panikbeschlägen)?" },
            { id: "3.3", text: "Sind Sicherheitsbeleuchtung und Rettungswegkennzeichnung im Saal funktionsfähig?" },
            { id: "3.4", text: "Sind Bühnen, Podeste und Messestände standsicher, an Kanten gesichert und gekennzeichnet?" },
            { id: "3.5", text: "Sind Lasten über Personen (Traversen, Lautsprecher, Beleuchtung, Banner) sicher befestigt und geprüft?" },
            { id: "3.6", text: "Sind Dekorationen, Stellwände und Ausstattung schwer entflammbar und brennbare Materialien begrenzt?" },
            { id: "3.7", text: "Sind offene Flammen und Gasgeräte (z. B. Rechauds, Gaskocher bei Verkostungen) geregelt und genehmigt?" },
            { id: "3.8", text: "Sind elektrische Anlagen für Veranstaltungen (Verteiler, Leitungen, Mehrfachsteckdosen) geprüft und Kabel stolperfrei verlegt?" },
            { id: "3.9", text: "Sind Auf- und Abbau koordiniert (Messebauer, Aussteller, Flurförderzeuge im Saal, Zeitdruck) und ist eine verantwortliche Person benannt?" },
            { id: "3.10", text: "Sind Erste Hilfe, Brandsicherheitswache und Sanitätsdienst bei Veranstaltungen nach Größe und Art geregelt?" },
            { id: "3.11", text: "Ist der Saal bei hoher Personenzahl ausreichend belüftet?" }
        ]
    },
    {
        id: "ausstellung",
        nr: 4,
        name: "Ausstellungsraum",
        bereich: "Eingänge, Empfang und Besucherbereiche",
        naLabel: "Kein Ausstellungsraum für Waren am Standort",
        items: [
            { id: "4.1", text: "Sind Exponate (Regale, Möbel, Großgeräte, Displays) standsicher aufgestellt und gegen Kippen gesichert?" },
            { id: "4.2", text: "Wird Ware in der Höhe sicher präsentiert und nur mit geeigneten Aufstiegshilfen erreicht?" },
            { id: "4.3", text: "Sind die Wege im Ausstellungsraum ausreichend breit, frei und ohne Stolperstellen (Podestkanten, Teppichkanten, Kabel)?" },
            { id: "4.4", text: "Sind elektrische Vorführgeräte geprüft, sicher angeschlossen und Vorführmaschinen mit wirksamen Schutzeinrichtungen versehen?" },
            { id: "4.5", text: "Sind Glasflächen, Spiegel und scharfe Kanten an Exponaten gesichert bzw. gekennzeichnet?" },
            { id: "4.6", text: "Sind Umbau- und Dekorationsarbeiten sicher organisiert (Lastenhandhabung, Leitern, Werkzeuge, Hilfsmittel)?" },
            { id: "4.7", text: "Haben Strahler und Leuchten ausreichenden Abstand zu brennbaren Exponaten und Dekorationen?" },
            { id: "4.8", text: "Sind Fluchtwege und Notausgänge im Ausstellungsraum frei und gekennzeichnet?" }
        ]
    },
    {
        id: "buero",
        nr: 5,
        name: "Büroarbeitsplätze",
        bereich: "Verwaltung, Schulung und Sozialbereiche",
        naLabel: "Keine Büroarbeitsplätze am Standort",
        items: [
            { id: "5.1", text: "Sind die Bildschirme so aufgestellt, dass keine Blendung oder Spiegelung durch Fenster oder Leuchten entsteht (Blickrichtung parallel zum Fenster)?" },
            { id: "5.2", text: "Sind Bürostuhl, Arbeitstisch und Bildschirm ergonomisch einstellbar und auf die jeweilige Person eingestellt?" },
            { id: "5.3", text: "Steht für jeden Büroarbeitsplatz eine ausreichende Bewegungsfläche zur Verfügung und sind die Räume nicht überbelegt?" },
            { id: "5.4", text: "Ist die Beleuchtung an den Büroarbeitsplätzen ausreichend und funktionsfähig?" },
            { id: "5.5", text: "Liegt die Raumtemperatur in den Büros im zulässigen Bereich (mindestens 20 °C) und gibt es bei Hitze Maßnahmen?" },
            { id: "5.6", text: "Sind Kabel und Mehrfachsteckdosen so verlegt, dass keine Stolperstellen entstehen und keine Steckdosenleisten hintereinander gesteckt sind?" },
            { id: "5.7", text: "Wird den Beschäftigten an Bildschirmarbeitsplätzen eine arbeitsmedizinische Vorsorge (Angebotsvorsorge inkl. Sehtest) angeboten?" },
            { id: "5.8", pruef: 24, text: "Sind die ortsveränderlichen elektrischen Geräte im Büro (z. B. Leuchten, Ladegeräte, Kaffeemaschinen) geprüft?" },
            { id: "5.9", text: "Wird die Bildschirmarbeit durch andere Tätigkeiten oder Pausen regelmäßig unterbrochen?" },
            { id: "5.10", text: "Sind Fenster, Sonnenschutz und Lüftungsmöglichkeiten in den Büros funktionsfähig?" }
        ]
    },
    {
        id: "dlz-verwaltung",
        nr: 42,
        name: "Verwaltung Dienstleistungszentrum",
        bereich: "Verwaltung, Schulung und Sozialbereiche",
        naLabel: "Keine Verwaltung im Dienstleistungszentrum",
        items: [
            { id: "42.1", text: "Verwaltung Dienstleistungszentrum – Sind die Bildschirme so aufgestellt, dass keine Blendung oder Spiegelung durch Fenster oder Leuchten entsteht (Blickrichtung parallel zum Fenster)?" },
            { id: "42.2", text: "Verwaltung Dienstleistungszentrum – Sind Bürostuhl, Arbeitstisch und Bildschirm ergonomisch einstellbar und auf die jeweilige Person eingestellt?" },
            { id: "42.3", text: "Verwaltung Dienstleistungszentrum – Steht für jeden Büroarbeitsplatz eine ausreichende Bewegungsfläche zur Verfügung und sind die Räume nicht überbelegt?" },
            { id: "42.4", text: "Verwaltung Dienstleistungszentrum – Ist die Beleuchtung an den Büroarbeitsplätzen ausreichend und funktionsfähig?" },
            { id: "42.5", text: "Verwaltung Dienstleistungszentrum – Liegt die Raumtemperatur in den Büros im zulässigen Bereich (mindestens 20 °C) und gibt es bei Hitze Maßnahmen?" },
            { id: "42.6", text: "Verwaltung Dienstleistungszentrum – Sind Kabel und Mehrfachsteckdosen so verlegt, dass keine Stolperstellen entstehen und keine Steckdosenleisten hintereinander gesteckt sind?" },
            { id: "42.7", text: "Verwaltung Dienstleistungszentrum – Wird den Beschäftigten an Bildschirmarbeitsplätzen eine arbeitsmedizinische Vorsorge (Angebotsvorsorge inkl. Sehtest) angeboten?" },
            { id: "42.8", pruef: 24, text: "Verwaltung Dienstleistungszentrum – Sind die ortsveränderlichen elektrischen Geräte im Büro (z. B. Leuchten, Ladegeräte, Kaffeemaschinen) geprüft?" },
            { id: "42.9", text: "Verwaltung Dienstleistungszentrum – Wird die Bildschirmarbeit durch andere Tätigkeiten oder Pausen regelmäßig unterbrochen?" },
            { id: "42.10", text: "Verwaltung Dienstleistungszentrum – Sind Fenster, Sonnenschutz und Lüftungsmöglichkeiten in den Büros funktionsfähig?" },
            { id: "42.11", text: "Verwaltung Dienstleistungszentrum – Sind Flucht- und Rettungswege im Gebäude frei und gekennzeichnet und ist ein aktueller Flucht- und Rettungsplan ausgehängt?" },
            { id: "42.12", pruef: 24, text: "Verwaltung Dienstleistungszentrum – Sind in der Verwaltung ausreichend Feuerlöscher vorhanden, frei zugänglich und geprüft?" },
            { id: "42.13", text: "Verwaltung Dienstleistungszentrum – Sind in der Verwaltung Ersthelfer benannt und Verbandkasten sowie Notrufnummern vorhanden?" },
            { id: "42.14", text: "Verwaltung Dienstleistungszentrum – Sind Treppen, Flure und ggf. der Aufzug im Gebäude sicher (Handläufe, Beleuchtung, Prüfung des Aufzugs)?" },
            { id: "42.15", text: "Verwaltung Dienstleistungszentrum – Sind Pausenraum bzw. Teeküche und Toiletten der Verwaltung sauber und ausreichend?" }
        ]
    },
    {
        id: "schulung",
        nr: 43,
        name: "Schulungszentrum",
        bereich: "Verwaltung, Schulung und Sozialbereiche",
        naLabel: "Kein Schulungszentrum am Standort",
        items: [
            { id: "43.1", group: "Schulungs- und Seminarräume", text: "Sind Schulungs- und Seminarräume für die Teilnehmerzahl ausreichend groß und wird die zulässige Personenzahl eingehalten?" },
            { id: "43.2", group: "Schulungs- und Seminarräume", text: "Sind Tische und Stühle so gestellt, dass Gänge und Ausgänge frei bleiben und niemand über Kabel stolpert?" },
            { id: "43.3", group: "Schulungs- und Seminarräume", text: "Sind Beleuchtung, Verdunkelung und Lüftung der Schulungsräume ausreichend (auch bei voller Belegung)?" },
            { id: "43.4", group: "Schulungs- und Seminarräume", pruef: 24, text: "Sind Präsentations- und Medientechnik (Beamer, Bildschirme, Leinwände, Deckenhalterungen) sicher befestigt und die elektrischen Geräte geprüft?" },
            { id: "43.5", group: "Schulungs- und Seminarräume", text: "Sind praktische Übungen (z. B. Staplerschulung, Erste-Hilfe-Kurs, Feuerlöscherübung) sicher organisiert (Übungsfläche abgesperrt, Ausrüstung geprüft, Aufsicht)?" },
            { id: "43.6", group: "Flure, Treppen und Fluchtwege", text: "Sind Flucht- und Rettungswege im Schulungszentrum frei, gekennzeichnet und sind Fluchtpläne in jedem Raum ausgehängt?" },
            { id: "43.7", group: "Flure, Treppen und Fluchtwege", text: "Werden Teilnehmende zu Beginn über Fluchtwege, Sammelplatz und Verhalten im Notfall informiert?" },
            { id: "43.8", group: "Flure, Treppen und Fluchtwege", text: "Sind Treppen, Flure und ggf. Aufzug im Schulungszentrum sicher (Handläufe, Beleuchtung, gültige Aufzugsprüfung) und ist der Zugang barrierefrei, soweit erforderlich?" },
            { id: "43.9", group: "Flure, Treppen und Fluchtwege", text: "Sind Feuerlöscher, Sicherheitsbeleuchtung und Brandmelder im Schulungszentrum vorhanden und frei zugänglich?" },
            { id: "43.10", group: "Pausenbereich, Teeküche und Sanitärräume", text: "Sind Pausenbereich, Teeküche bzw. Catering sicher und sauber (Elektrogeräte geprüft, Heißgetränke, Rutschgefahr)?" },
            { id: "43.11", group: "Pausenbereich, Teeküche und Sanitärräume", text: "Sind ausreichend Toiletten für Teilnehmende und Beschäftigte vorhanden und sauber?" },
            { id: "43.12", group: "Pausenbereich, Teeküche und Sanitärräume", text: "Sind Erste-Hilfe-Material und ein Ersthelfer während der Schulungen verfügbar?" },
            { id: "43.13", group: "Pausenbereich, Teeküche und Sanitärräume", text: "Ist der Arbeitsplatz der Trainerinnen und Trainer ergonomisch (Bildschirmarbeit, Sprechbelastung, Stehen) und gibt es einen Rückzugs- bzw. Vorbereitungsraum?" }
        ]
    },
    {
        id: "sozial-psa",
        nr: 6,
        name: "Sozialräume und PSA",
        bereich: "Verwaltung, Schulung und Sozialbereiche",
        naLabel: "Sozialräume und PSA nicht Gegenstand dieser Begehung",
        items: [
            { id: "6.1", text: "Sind Pausenräume bzw. Pausenbereiche vorhanden, sauber und frei von Lagergut?" },
            { id: "6.2", text: "Sind Toiletten, Wasch- und Umkleideräume in ausreichender Zahl vorhanden und sauber?" },
            { id: "6.3", text: "Werden Sicherheitsschuhe gestellt und im Lager konsequent getragen?" },
            { id: "6.4", text: "Wird Warnkleidung getragen, wo Fahrzeugverkehr herrscht (Hof, Rampe, Lager mit Staplerverkehr)?" },
            { id: "6.5", text: "Werden geeignete Schutzhandschuhe (z. B. Schnittschutz, Kälteschutz) bereitgestellt und benutzt?" },
            { id: "6.6", text: "Sind die Beschäftigten im richtigen Gebrauch der PSA unterwiesen?" }
        ]
    },
    {
        id: "verkehrswege",
        nr: 7,
        name: "Verkehrswege",
        bereich: "Verkehr, Parkflächen und Parkhäuser",
        naLabel: "Verkehrswege nicht Gegenstand dieser Begehung",
        items: [
            { id: "7.1", text: "Sind Fahrwege für Flurförderzeuge und Gehwege für Personen getrennt oder deutlich gekennzeichnet?" },
            { id: "7.2", text: "Sind die Fahrwege ausreichend breit (Fahrzeug- bzw. Ladungsbreite plus Randzuschläge, bei Gegenverkehr zusätzlich Begegnungszuschlag)?" },
            { id: "7.3", text: "Sind alle Verkehrswege frei von abgestellter Ware, Paletten, Leergut und anderen Hindernissen?" },
            { id: "7.4", text: "Ist der Fußboden der Verkehrswege eben, tragfähig, rutschhemmend und ohne Schäden (Löcher, Risse, lose Abdeckungen)?" },
            { id: "7.5", text: "Sind unübersichtliche Kreuzungen, Ecken und Regalausgänge durch Spiegel, Warnhinweise oder Geschwindigkeitsbegrenzung gesichert?" },
            { id: "7.6", text: "Sind die Verkehrswege ausreichend beleuchtet?" },
            { id: "7.7", text: "Sind Treppen, Rampen und Übergänge mit Handläufen versehen, unbeschädigt und frei von Gegenständen?" },
            { id: "7.8", text: "Ist die Höchstgeschwindigkeit für Flurförderzeuge in Hallen festgelegt und beschildert?" },
            { id: "7.9", text: "Sind Querungsstellen für Fußgänger (z. B. an Toren, Durchgängen, Sozialräumen) gekennzeichnet und gesichert (Absperrgitter, Sichtschutz, Spiegel)?" },
            { id: "7.10", text: "Sind Eingangsbereiche und Tore bei Nässe gegen Ausrutschen gesichert (Sauberlaufzonen, Abtropfmatten)?" }
        ]
    },
    {
        id: "aussenbereich",
        nr: 8,
        name: "Außenbereich und Hof",
        bereich: "Verkehr, Parkflächen und Parkhäuser",
        naLabel: "Kein eigener Außenbereich bzw. Hof am Standort",
        items: [
            { id: "8.1", text: "Ist die Verkehrsführung auf dem Hof (Lkw, Pkw, Fußgänger) eindeutig geregelt und gekennzeichnet?" },
            { id: "8.2", text: "Ist das Rückwärtsfahren und Rangieren der Lkw sicher organisiert (z. B. Einweiser, Rückfahrkamera, Sperrbereiche)?" },
            { id: "8.3", text: "Ist der Außenbereich bei Dunkelheit ausreichend beleuchtet (Hof, Rampenvorfeld, Wege zum Parkplatz)?" },
            { id: "8.4", text: "Ist ein Winterdienst (Räumen und Streuen) für Hof, Rampenvorfeld und Gehwege organisiert und dokumentiert?" },
            { id: "8.5", text: "Sind Anfahrschutz und Poller an gefährdeten Gebäudeteilen, Toren, Leitungen und Tankstellen vorhanden und unbeschädigt?" },
            { id: "8.6", text: "Gibt es für fremde Lkw-Fahrer verständliche Verhaltensregeln (z. B. Aufenthaltsbereich, Warnweste, Verbot des Betretens des Lagers)?" },
            { id: "8.7", text: "Sind Abfall- und Leergutsammelstellen im Außenbereich geordnet und behindern sie keine Verkehrs- oder Fluchtwege?" }
        ]
    },
    {
        id: "parkhaeuser",
        nr: 9,
        name: "Parkhäuser",
        bereich: "Verkehr, Parkflächen und Parkhäuser",
        naLabel: "Keine Parkhäuser am Standort",
        instanzen: ["Parkhaus 1", "Parkhaus 2", "Parkhaus 3", "Parkhaus 4"],
        profilFeld: "anzahlParkhaeuser",
        items: [
            { id: "9.1", group: "Parkhaus 1", text: "Parkhaus 1 – Sind Fahrbahnen und Rampen markiert, ist die Geschwindigkeit begrenzt und sind unübersichtliche Stellen mit Spiegeln gesichert?" },
            { id: "9.2", group: "Parkhaus 1", text: "Parkhaus 1 – Gibt es sichere, gekennzeichnete Gehwege für Fußgänger zu Treppenhäusern, Aufzügen und Ausgängen?" },
            { id: "9.3", group: "Parkhaus 1", text: "Parkhaus 1 – Ist der Boden frei von Schlaglöchern und Stolperstellen, und sind Rampen und Oberdeck bei Glätte geräumt und gestreut?" },
            { id: "9.4", group: "Parkhaus 1", text: "Parkhaus 1 – Sind die Treppen in den Treppenhäusern unbeschädigt, mit Handläufen versehen, beleuchtet und frei von Abfall und Lagerung?" },
            { id: "9.5", group: "Parkhaus 1", text: "Parkhaus 1 – Schließen die Treppenhaustüren selbstständig und sind sie nicht verkeilt oder festgestellt?" },
            { id: "9.6", group: "Parkhaus 1", pruef: 24, text: "Parkhaus 1 – Ist der Aufzug im Parkhaus durch eine ZÜS geprüft und ist die Prüfung gültig?" },
            { id: "9.7", group: "Parkhaus 1", text: "Parkhaus 1 – Funktioniert der Notruf im Parkhausaufzug und ist der Aufzug in ordnungsgemäßem Zustand (Türen, Beleuchtung, Sauberkeit)?" },
            { id: "9.8", group: "Parkhaus 1", text: "Parkhaus 1 – Sind Beleuchtung, Sicherheitsbeleuchtung und Rettungswegkennzeichnung im Parkhaus funktionsfähig?" },
            { id: "9.9", group: "Parkhaus 1", text: "Parkhaus 1 – Sind Feuerlöscher bzw. Wandhydranten vorhanden und geprüft, und wird im Parkhaus nichts Brennbares gelagert?" },
            { id: "9.10", group: "Parkhaus 1", pruef: 0, text: "Parkhaus 1 – Ist die CO-Warnanlage bzw. Lüftungsanlage (bei geschlossenen Großgaragen) funktionsfähig und geprüft?" },
            { id: "9.11", group: "Parkhaus 1", text: "Parkhaus 1 – Sind Brüstungen und Geländer an Decks und Rampen unbeschädigt und gegen Anfahren geschützt?" },
            { id: "9.12", group: "Parkhaus 1", text: "Parkhaus 1 – Sind Durchfahrtshöhen gekennzeichnet und Stützen sowie Einbauten gegen Anfahren geschützt und gelb-schwarz markiert?" },
            { id: "9.13", group: "Parkhaus 2", text: "Parkhaus 2 – Sind Fahrbahnen und Rampen markiert, ist die Geschwindigkeit begrenzt und sind unübersichtliche Stellen mit Spiegeln gesichert?" },
            { id: "9.14", group: "Parkhaus 2", text: "Parkhaus 2 – Gibt es sichere, gekennzeichnete Gehwege für Fußgänger zu Treppenhäusern, Aufzügen und Ausgängen?" },
            { id: "9.15", group: "Parkhaus 2", text: "Parkhaus 2 – Ist der Boden frei von Schlaglöchern und Stolperstellen, und sind Rampen und Oberdeck bei Glätte geräumt und gestreut?" },
            { id: "9.16", group: "Parkhaus 2", text: "Parkhaus 2 – Sind die Treppen in den Treppenhäusern unbeschädigt, mit Handläufen versehen, beleuchtet und frei von Abfall und Lagerung?" },
            { id: "9.17", group: "Parkhaus 2", text: "Parkhaus 2 – Schließen die Treppenhaustüren selbstständig und sind sie nicht verkeilt oder festgestellt?" },
            { id: "9.18", group: "Parkhaus 2", pruef: 24, text: "Parkhaus 2 – Ist der Aufzug im Parkhaus durch eine ZÜS geprüft und ist die Prüfung gültig?" },
            { id: "9.19", group: "Parkhaus 2", text: "Parkhaus 2 – Funktioniert der Notruf im Parkhausaufzug und ist der Aufzug in ordnungsgemäßem Zustand (Türen, Beleuchtung, Sauberkeit)?" },
            { id: "9.20", group: "Parkhaus 2", text: "Parkhaus 2 – Sind Beleuchtung, Sicherheitsbeleuchtung und Rettungswegkennzeichnung im Parkhaus funktionsfähig?" },
            { id: "9.21", group: "Parkhaus 2", text: "Parkhaus 2 – Sind Feuerlöscher bzw. Wandhydranten vorhanden und geprüft, und wird im Parkhaus nichts Brennbares gelagert?" },
            { id: "9.22", group: "Parkhaus 2", pruef: 0, text: "Parkhaus 2 – Ist die CO-Warnanlage bzw. Lüftungsanlage (bei geschlossenen Großgaragen) funktionsfähig und geprüft?" },
            { id: "9.23", group: "Parkhaus 2", text: "Parkhaus 2 – Sind Brüstungen und Geländer an Decks und Rampen unbeschädigt und gegen Anfahren geschützt?" },
            { id: "9.24", group: "Parkhaus 2", text: "Parkhaus 2 – Sind Durchfahrtshöhen gekennzeichnet und Stützen sowie Einbauten gegen Anfahren geschützt und gelb-schwarz markiert?" },
            { id: "9.25", group: "Parkhaus 3", text: "Parkhaus 3 – Sind Fahrbahnen und Rampen markiert, ist die Geschwindigkeit begrenzt und sind unübersichtliche Stellen mit Spiegeln gesichert?" },
            { id: "9.26", group: "Parkhaus 3", text: "Parkhaus 3 – Gibt es sichere, gekennzeichnete Gehwege für Fußgänger zu Treppenhäusern, Aufzügen und Ausgängen?" },
            { id: "9.27", group: "Parkhaus 3", text: "Parkhaus 3 – Ist der Boden frei von Schlaglöchern und Stolperstellen, und sind Rampen und Oberdeck bei Glätte geräumt und gestreut?" },
            { id: "9.28", group: "Parkhaus 3", text: "Parkhaus 3 – Sind die Treppen in den Treppenhäusern unbeschädigt, mit Handläufen versehen, beleuchtet und frei von Abfall und Lagerung?" },
            { id: "9.29", group: "Parkhaus 3", text: "Parkhaus 3 – Schließen die Treppenhaustüren selbstständig und sind sie nicht verkeilt oder festgestellt?" },
            { id: "9.30", group: "Parkhaus 3", pruef: 24, text: "Parkhaus 3 – Ist der Aufzug im Parkhaus durch eine ZÜS geprüft und ist die Prüfung gültig?" },
            { id: "9.31", group: "Parkhaus 3", text: "Parkhaus 3 – Funktioniert der Notruf im Parkhausaufzug und ist der Aufzug in ordnungsgemäßem Zustand (Türen, Beleuchtung, Sauberkeit)?" },
            { id: "9.32", group: "Parkhaus 3", text: "Parkhaus 3 – Sind Beleuchtung, Sicherheitsbeleuchtung und Rettungswegkennzeichnung im Parkhaus funktionsfähig?" },
            { id: "9.33", group: "Parkhaus 3", text: "Parkhaus 3 – Sind Feuerlöscher bzw. Wandhydranten vorhanden und geprüft, und wird im Parkhaus nichts Brennbares gelagert?" },
            { id: "9.34", group: "Parkhaus 3", pruef: 0, text: "Parkhaus 3 – Ist die CO-Warnanlage bzw. Lüftungsanlage (bei geschlossenen Großgaragen) funktionsfähig und geprüft?" },
            { id: "9.35", group: "Parkhaus 3", text: "Parkhaus 3 – Sind Brüstungen und Geländer an Decks und Rampen unbeschädigt und gegen Anfahren geschützt?" },
            { id: "9.36", group: "Parkhaus 3", text: "Parkhaus 3 – Sind Durchfahrtshöhen gekennzeichnet und Stützen sowie Einbauten gegen Anfahren geschützt und gelb-schwarz markiert?" },
            { id: "9.37", group: "Parkhaus 4", text: "Parkhaus 4 – Sind Fahrbahnen und Rampen markiert, ist die Geschwindigkeit begrenzt und sind unübersichtliche Stellen mit Spiegeln gesichert?" },
            { id: "9.38", group: "Parkhaus 4", text: "Parkhaus 4 – Gibt es sichere, gekennzeichnete Gehwege für Fußgänger zu Treppenhäusern, Aufzügen und Ausgängen?" },
            { id: "9.39", group: "Parkhaus 4", text: "Parkhaus 4 – Ist der Boden frei von Schlaglöchern und Stolperstellen, und sind Rampen und Oberdeck bei Glätte geräumt und gestreut?" },
            { id: "9.40", group: "Parkhaus 4", text: "Parkhaus 4 – Sind die Treppen in den Treppenhäusern unbeschädigt, mit Handläufen versehen, beleuchtet und frei von Abfall und Lagerung?" },
            { id: "9.41", group: "Parkhaus 4", text: "Parkhaus 4 – Schließen die Treppenhaustüren selbstständig und sind sie nicht verkeilt oder festgestellt?" },
            { id: "9.42", group: "Parkhaus 4", pruef: 24, text: "Parkhaus 4 – Ist der Aufzug im Parkhaus durch eine ZÜS geprüft und ist die Prüfung gültig?" },
            { id: "9.43", group: "Parkhaus 4", text: "Parkhaus 4 – Funktioniert der Notruf im Parkhausaufzug und ist der Aufzug in ordnungsgemäßem Zustand (Türen, Beleuchtung, Sauberkeit)?" },
            { id: "9.44", group: "Parkhaus 4", text: "Parkhaus 4 – Sind Beleuchtung, Sicherheitsbeleuchtung und Rettungswegkennzeichnung im Parkhaus funktionsfähig?" },
            { id: "9.45", group: "Parkhaus 4", text: "Parkhaus 4 – Sind Feuerlöscher bzw. Wandhydranten vorhanden und geprüft, und wird im Parkhaus nichts Brennbares gelagert?" },
            { id: "9.46", group: "Parkhaus 4", pruef: 0, text: "Parkhaus 4 – Ist die CO-Warnanlage bzw. Lüftungsanlage (bei geschlossenen Großgaragen) funktionsfähig und geprüft?" },
            { id: "9.47", group: "Parkhaus 4", text: "Parkhaus 4 – Sind Brüstungen und Geländer an Decks und Rampen unbeschädigt und gegen Anfahren geschützt?" },
            { id: "9.48", group: "Parkhaus 4", text: "Parkhaus 4 – Sind Durchfahrtshöhen gekennzeichnet und Stützen sowie Einbauten gegen Anfahren geschützt und gelb-schwarz markiert?" }
        ]
    },
    {
        id: "ladesaeulen",
        nr: 44,
        name: "Ladesäulen für Elektrofahrzeuge",
        bereich: "Verkehr, Parkflächen und Parkhäuser",
        naLabel: "Keine Ladesäulen auf den Parkflächen",
        items: [
            { id: "44.1", pruef: 12, text: "Sind Ladesäulen und Wallboxen sowie ihre Zuleitungen wiederkehrend durch eine Elektrofachkraft geprüft?" },
            { id: "44.2", text: "Sind Ladesäulen gegen Anfahren geschützt (Poller, Anfahrschutz) und unbeschädigt (Gehäuse, Ladekabel, Stecker)?" },
            { id: "44.3", text: "Liegen Ladekabel nicht als Stolperstelle über Geh- und Fahrwegen (Kabelhalter, Kabelmanagement)?" },
            { id: "44.4", text: "Ist eine Not-Aus- bzw. Freischaltmöglichkeit für die Ladeinfrastruktur vorhanden, gekennzeichnet und für die Feuerwehr bekannt?" },
            { id: "44.5", text: "Ist der Brandschutz für Ladeplätze berücksichtigt, insbesondere in Parkhäusern (Abstimmung mit Brandschutzkonzept und Feuerwehr, Löschmittel, Abstand zu brennbaren Lagerungen)?" },
            { id: "44.6", text: "Werden Dienstfahrzeuge und Elektro-Flurförderzeuge nur an den dafür vorgesehenen Ladepunkten geladen (keine Haushaltssteckdosen, keine Verlängerungskabel)?" },
            { id: "44.7", text: "Sind die Ladeplätze ausreichend beleuchtet und gekennzeichnet?" }
        ]
    },
    {
        id: "tore",
        nr: 10,
        name: "Tore und Türen",
        bereich: "Verkehr, Parkflächen und Parkhäuser",
        naLabel: "Keine kraftbetätigten Tore bzw. Türen am Standort",
        items: [
            { id: "10.1", pruef: 12, text: "Sind die kraftbetätigten Tore (Rolltore, Sektionaltore, Schnelllauftore) wiederkehrend geprüft (Prüfnachweis nicht älter als ein Jahr)?" },
            { id: "10.2", text: "Funktionieren die Schutzeinrichtungen der Tore (Schließkantensicherung, Lichtschranke, Absturz- bzw. Federbruchsicherung)?" },
            { id: "10.3", text: "Gibt es in unmittelbarer Nähe der Fahrzeugtore gekennzeichnete Türen für Fußgänger?" },
            { id: "10.4", text: "Sind Tore und Torlaufbereiche frei von Ware, und ist die Torbedienung (Taster, Zugschalter) frei zugänglich?" },
            { id: "10.5", text: "Sind Pendeltüren und Streifenvorhänge durchsichtig bzw. mit Sichtfenstern versehen und unbeschädigt?" },
            { id: "10.6", text: "Sind die Notausgangstüren jederzeit von innen ohne Hilfsmittel zu öffnen und nicht verstellt?" }
        ]
    },
    {
        id: "rampe",
        nr: 11,
        name: "Anlieferung und Rampe",
        bereich: "Anlieferung, Versand und Verpackung",
        naLabel: "Keine Laderampe bzw. Anlieferung am Standort",
        items: [
            { id: "11.1", pruef: 12, text: "Sind die Überladebrücken (Ladebrücken) funktionsfähig, unbeschädigt und wiederkehrend geprüft (Prüfnachweis vorhanden)?" },
            { id: "11.2", text: "Werden Lkw beim Be- und Entladen gegen Wegrollen und vorzeitiges Abfahren gesichert (z. B. Unterlegkeile, Radsperre, Ampel, Schlüsselübergabe)?" },
            { id: "11.3", text: "Sind die Rampenkanten gut sichtbar gelb-schwarz gekennzeichnet?" },
            { id: "11.4", text: "Sind Rampenbereiche über 1 m Höhe, an denen nicht be- oder entladen wird, gegen Absturz gesichert (z. B. Geländer, Ketten)?" },
            { id: "11.5", text: "Gibt es sichere Auf- und Abgänge (Treppen) an der Rampe, sodass niemand herunterspringen muss?" },
            { id: "11.6", text: "Sind Torabdichtungen, Rampenpuffer und Rampenbeleuchtung funktionsfähig und unbeschädigt?" },
            { id: "11.7", text: "Sind Paletten und Ware im Rampenbereich so abgestellt, dass Verkehrswege, Tore und Ladebrücken frei bleiben?" },
            { id: "11.8", text: "Werden die Beschäftigten an der Rampe über die Gefahren (Absturz, Wegrollen, Lücke zwischen Rampe und Lkw) unterwiesen?" },
            { id: "11.9", text: "Werden Ladebordwände sicher benutzt (keine Personen mitfahren mit Rollcontainern ohne Sicherung, Fußraum frei, Sicherungsklappen genutzt)?" },
            { id: "11.10", text: "Sind die Ampel- bzw. Signalanlagen an den Rampentoren funktionsfähig und werden sie beachtet?" }
        ]
    },
    {
        id: "wareneingang",
        nr: 12,
        name: "Wareneingang und Ladungssicherung",
        bereich: "Anlieferung, Versand und Verpackung",
        naLabel: "Kein Wareneingang bzw. keine Verladung am Standort",
        items: [
            { id: "12.1", text: "Wird die Ladung beim Verladen so gesichert, dass sie bei normaler Fahrt nicht verrutschen, umfallen oder herabfallen kann?" },
            { id: "12.2", text: "Werden beschädigte Paletten und Ladungsträger erkannt, aussortiert und nicht mehr verwendet?" },
            { id: "12.3", text: "Ist ein ausreichend großer, gekennzeichneter Bereitstellbereich für Wareneingang und Warenausgang vorhanden?" },
            { id: "12.4", text: "Sind Palettenstapel und Blocklager standsicher und nicht zu hoch gestapelt?" },
            { id: "12.5", text: "Werden zum Öffnen von Folie und Umreifungen Sicherheitsmesser bzw. geeignete Schneidwerkzeuge benutzt?" },
            { id: "12.6", text: "Ist die Ein- und Ausfahrt der Lkw-Ladefläche mit Flurförderzeugen geregelt (Tragfähigkeit Ladefläche/Ladebrücke, Spaltabdeckung)?" }
        ]
    },
    {
        id: "rollcontainer",
        nr: 13,
        name: "Rollcontainer",
        bereich: "Anlieferung, Versand und Verpackung",
        naLabel: "Keine Rollcontainer am Standort",
        items: [
            { id: "13.1", text: "Sind die Rollcontainer in einwandfreiem Zustand (Räder, Lenkrollen, Feststeller, Seitenwände, Verriegelungen) und werden beschädigte aussortiert und gekennzeichnet?" },
            { id: "13.2", text: "Werden die zulässige Traglast und die Beladungsregeln eingehalten (schwere Ware unten, Sicht beim Schieben nicht verdeckt)?" },
            { id: "13.3", text: "Ist die Ladung in den Rollcontainern gegen Herausfallen gesichert (Netze, Gurte, Einlegeböden)?" },
            { id: "13.4", text: "Wird geregelt, wie viele Rollcontainer eine Person gleichzeitig bewegen darf, und werden Rollcontainer möglichst geschoben statt gezogen?" },
            { id: "13.5", text: "Werden Rollcontainerzüge nur mit geeigneten Schleppern und Kupplungen gebildet?" },
            { id: "13.6", text: "Ist der Transport über Rampen, Ladebordwände und Gefälle sicher geregelt (Feststeller, zweite Person, keine Personen vor dem Rollcontainer)?" },
            { id: "13.7", text: "Werden die Griffe benutzt und sind Quetschstellen an Händen und Füßen bekannt (Sicherheitsschuhe, ggf. Handschuhe)?" },
            { id: "13.8", text: "Werden Rollcontainer im Lkw gegen Verrutschen gesichert (Sperrstangen, Gurte, formschlüssiges Laden)?" },
            { id: "13.9", text: "Werden Rollcontainer sicher abgestellt (nicht in Flucht- und Verkehrswegen, gegen Wegrollen gesichert, leere Rollcontainer standsicher ineinandergeschoben)?" }
        ]
    },
    {
        id: "verpackung",
        nr: 14,
        name: "Verpackungsmaschinen",
        bereich: "Anlieferung, Versand und Verpackung",
        naLabel: "Keine Verpackungsmaschinen am Standort",
        items: [
            { id: "14.1", text: "Haben alle Verpackungsmaschinen eine CE-Kennzeichnung, eine Konformitätserklärung und eine Betriebsanleitung in deutscher Sprache?" },
            { id: "14.2", text: "Sind die Schutzeinrichtungen (Schutzgitter, Lichtschranken, Verriegelungen) wirksam und nicht manipuliert?" },
            { id: "14.3", text: "Sind Not-Halt-Einrichtungen erreichbar und wird ihre Funktion regelmäßig getestet?" },
            { id: "14.4", text: "Ist der Gefahrbereich des Palettenwicklers (Drehteller, Wickelarm) gesichert bzw. gekennzeichnet und betritt ihn niemand während des Wickelns?" },
            { id: "14.5", text: "Werden an Umreifungsmaschinen und -geräten Schutzbrillen getragen und ist die Gefahr durch zurückschnellende Bänder bekannt?" },
            { id: "14.6", text: "Sind Folienschweißgeräte, Schrumpftunnel und Schrumpfpistolen gegen Verbrennungen und Brand gesichert (Gasgeräte nach Flüssiggasregeln)?" },
            { id: "14.7", text: "Werden Folien- und Bandwechsel sowie Störungsbeseitigung nur bei stillgesetzter und gesicherter Maschine durchgeführt?" },
            { id: "14.8", pruef: 12, text: "Sind die Verpackungsmaschinen wiederkehrend geprüft?" },
            { id: "14.9", text: "Liegen Betriebsanweisungen vor und werden die Maschinen nur von unterwiesenen, beauftragten Personen bedient?" },
            { id: "14.10", text: "Ist das Heben schwerer Folienrollen und Bandspulen durch Hilfsmittel erleichtert?" }
        ]
    },
    {
        id: "lager",
        nr: 15,
        name: "Lager",
        bereich: "Lager, Kommissionierung und Leergut",
        naLabel: "Kein Lagerbereich am Standort",
        items: [
            { id: "15.1", text: "Sind Lagerflächen und Lagerplätze eindeutig gekennzeichnet und wird die Lagerordnung eingehalten?" },
            { id: "15.2", text: "Sind Fluchtwege und Notausgänge im Lager frei, gekennzeichnet und die Sicherheitsbeleuchtung funktionsfähig?" },
            { id: "15.3", text: "Wird schwere Ware unten und leichte Ware oben gelagert?" },
            { id: "15.4", text: "Ist das Lager ausreichend und gleichmäßig beleuchtet, auch in den Regalgassen?" },
            { id: "15.5", text: "Sind im Lager geeignete Aufstiegshilfen vorhanden und wird nicht auf Regale oder Ware geklettert?" },
            { id: "15.6", text: "Sind Ordnung und Sauberkeit im Lager gewährleistet (keine Folienreste, Bänder, Glasbruch oder Flüssigkeiten auf dem Boden)?" },
            { id: "15.7", text: "Ist das Lagerklima zumutbar (Zugluft, Kälte im Winter, Hitze im Sommer) und gibt es bei Bedarf Maßnahmen?" },
            { id: "15.8", text: "Sind Elektroverteiler, Feuerlöscher, Wandhydranten und Brandmelder frei zugänglich und nicht zugestellt?" },
            { id: "15.9", text: "Werden Verpackungsabfälle (Folien, Kartonagen, Holz) regelmäßig entfernt und in geeigneten Sammelbehältern gesammelt?" }
        ]
    },
    {
        id: "regale",
        nr: 16,
        name: "Regale",
        bereich: "Lager, Kommissionierung und Leergut",
        naLabel: "Keine Regalanlagen am Standort",
        items: [
            { id: "16.1", pruef: 12, text: "Ist die jährliche Inspektion der Regalanlagen durch eine fachkundige Person durchgeführt und dokumentiert?" },
            { id: "16.2", text: "Werden die Regale zusätzlich regelmäßig durch die Beschäftigten bzw. eine beauftragte Person auf Schäden kontrolliert (Sichtkontrolle)?" },
            { id: "16.3", text: "Sind an allen Regalen gut sichtbare Belastungsschilder (zulässige Fach- und Feldlast) angebracht und werden diese eingehalten?" },
            { id: "16.4", text: "Sind beschädigte Regalteile (verbogene Stützen, Traversen, fehlende Sicherungsstifte) markiert, entlastet bzw. gesperrt?" },
            { id: "16.5", text: "Ist an Regalecken und Stützen in Fahrbereichen ein Anfahrschutz vorhanden, gelb-schwarz gekennzeichnet und unbeschädigt?" },
            { id: "16.6", text: "Ist eine Durchschubsicherung vorhanden, wo Ladeeinheiten in angrenzende Gänge oder Arbeitsbereiche geschoben werden können?" },
            { id: "16.7", text: "Sind Paletten im Regal richtig aufgelegt (mittig, nicht überstehend, nur intakte Paletten) und ist die Ware gesichert?" },
            { id: "16.8", text: "Sind Regale standsicher aufgestellt bzw. befestigt (Bodenverankerung, Wandbefestigung, Fußplatten)?" },
            { id: "16.9", text: "Sind Durchgänge und Durchfahrten unter Regalen gegen herabfallende Ware gesichert (Schutznetze, Abdeckungen)?" },
            { id: "16.10", text: "Sind in Schmalgängen mit leitliniengeführten Flurförderzeugen Personenschutzanlagen vorhanden bzw. ist das Betreten geregelt?" },
            { id: "16.11", text: "Sind Fachboden- und Kragarmregale gegen Umkippen gesichert und die Fachlasten gekennzeichnet?" },
            { id: "16.12", text: "Ist am Regal erkennbar, wann die letzte Regalinspektion stattgefunden hat (z. B. Prüfplakette)?" }
        ]
    },
    {
        id: "rbg",
        nr: 17,
        name: "Regalbediengeräte",
        bereich: "Lager, Kommissionierung und Leergut",
        naLabel: "Keine Regalbediengeräte am Standort",
        items: [
            { id: "17.1", pruef: 12, text: "Sind die Regalbediengeräte wiederkehrend durch eine zur Prüfung befähigte Person geprüft und ist der Nachweis vorhanden?" },
            { id: "17.2", text: "Sind die Gassen automatischer bzw. mannfreier Regalbediengeräte gegen unbefugtes Betreten gesichert (Zugangstüren mit Verriegelung)?" },
            { id: "17.3", text: "Sind die Not-Halt-Einrichtungen erreichbar, gekennzeichnet und funktionsfähig?" },
            { id: "17.4", text: "Werden Regalbediengeräte nur von unterwiesenen und beauftragten Personen bedient bzw. betreten (Wartung, Störungsbeseitigung)?" },
            { id: "17.5", text: "Gibt es ein Verfahren zur sicheren Störungsbeseitigung und Bergung (z. B. Freischalten, Sichern gegen Wiedereinschalten, Rettung aus der Kabine)?" },
            { id: "17.6", text: "Liegt eine aktuelle Betriebsanweisung für die Regalbediengeräte vor?" }
        ]
    },
    {
        id: "kommissionierung",
        nr: 18,
        name: "Kommissionierung",
        bereich: "Lager, Kommissionierung und Leergut",
        naLabel: "Keine Kommissionierung am Standort",
        items: [
            { id: "18.1", text: "Ist für die Kommissionierung eine Beurteilung der Lastenhandhabung (z. B. Leitmerkmalmethode) durchgeführt?" },
            { id: "18.2", text: "Sind Greifhöhen ergonomisch gestaltet (schwere, häufig gegriffene Ware zwischen Knie- und Schulterhöhe)?" },
            { id: "18.3", text: "Stehen Hilfsmittel für schwere Lasten zur Verfügung (Hebehilfen, höhenverstellbare Plattformen, Hubtische) und werden sie benutzt?" },
            { id: "18.4", text: "Sind Scanner, Pick-by-Voice- bzw. Pick-by-Light-Systeme ergonomisch (Gewicht, Tragekomfort, Bildschirmgröße, Lautstärke)?" },
            { id: "18.5", text: "Sind Arbeitstempo, Leistungsvorgaben und Pausen so gestaltet, dass keine Überlastung entsteht?" },
            { id: "18.6", text: "Werden den Beschäftigten mit körperlich belastender Tätigkeit eine arbeitsmedizinische Vorsorge angeboten?" },
            { id: "18.7", text: "Sind die Kommissionierwagen bzw. Rollcontainer in gutem Zustand und werden sie nicht überladen?" },
            { id: "18.8", text: "Sind Personen auf Vertikalkommissionierern (hochfahrbarer Fahrerstand) gegen Absturz gesichert (Gurt, Schranken, Seitenschutz)?" },
            { id: "18.9", text: "Sind Kommissionierwege und Lagerorte so angeordnet, dass lange Laufwege und häufiges Heben über Schulterhöhe vermieden werden?" }
        ]
    },
    {
        id: "kuehlung",
        nr: 19,
        name: "Kühlung und Tiefkühlung",
        bereich: "Lager, Kommissionierung und Leergut",
        naLabel: "Keine begehbaren Kühl- bzw. Tiefkühlbereiche am Standort",
        items: [
            { id: "19.1", text: "Lassen sich die Türen der Kühl- und Tiefkühlräume jederzeit von innen ohne Hilfsmittel öffnen (Notöffnung funktionsfähig, nicht vereist)?" },
            { id: "19.2", text: "Ist in den Kühl- und Tiefkühlräumen eine Notrufeinrichtung vorhanden, gekennzeichnet und funktionsfähig?" },
            { id: "19.3", text: "Werden geeignete Kälteschutzkleidung, Handschuhe und Schuhe gestellt und getragen?" },
            { id: "19.4", text: "Sind Aufenthaltszeiten in der Kälte und Aufwärmpausen geregelt?" },
            { id: "19.5", text: "Wird bei Tätigkeiten in extremer Kälte (−25 °C und kälter) die arbeitsmedizinische Pflichtvorsorge veranlasst?" },
            { id: "19.6", text: "Sind die Fußböden in Kühlbereichen frei von Eis und Glätte?" },
            { id: "19.7", pruef: 12, text: "Ist eine Gaswarnanlage für das Kältemittel vorhanden, sofern erforderlich, und wird sie wiederkehrend geprüft?" },
            { id: "19.8", text: "Sind die Beschäftigten über Gefahren in Kühlbereichen (Einschließen, Kälte, Kältemittel) unterwiesen?" },
            { id: "19.9", text: "Ist sichergestellt, dass vor dem Verschließen der Kühl- und Tiefkühlräume niemand mehr im Raum ist (Kontrollgang, Beleuchtung innen sichtbar)?" },
            { id: "19.10", text: "Sind Kühlraumtüren und -tore frei von Eisbildung und schließen die Dichtungen ordnungsgemäß?" }
        ]
    },
    {
        id: "absturz",
        nr: 20,
        name: "Absturzsicherung",
        bereich: "Lager, Kommissionierung und Leergut",
        naLabel: "Keine Absturzgefährdungen am Standort (keine Bühnen, Podeste oder Arbeiten in der Höhe)",
        items: [
            { id: "20.1", group: "Bühnen und Absturzkanten", text: "Sind Bühnen, Podeste, Zwischengeschosse und Regalbühnen an Absturzkanten mit Geländer (mindestens 1,00 m hoch, mit Knie- und Fußleiste) gesichert?" },
            { id: "20.2", group: "Bühnen und Absturzkanten", text: "Sind Übergabestellen an Regal- und Lagerbühnen (Palettenaufgabe) so gesichert, dass beim Be- und Entladen niemand abstürzen kann (z. B. Palettenschleuse, Wippschranke)?" },
            { id: "20.3", group: "Bühnen und Absturzkanten", text: "Sind Bodenöffnungen, Schächte und Gruben abgedeckt oder umwehrt?" },
            { id: "20.4", group: "Leitern und Tritte", pruef: 12, text: "Sind ausreichend geeignete Leitern und Tritte vorhanden, geprüft und in einwandfreiem Zustand?" },
            { id: "20.5", group: "Leitern und Tritte", text: "Werden Leitern bestimmungsgemäß benutzt (nicht als Arbeitsplatz über längere Zeit, nicht seitlich hinauslehnen, Anlegeleitern gesichert)?" },
            { id: "20.6", group: "PSA gegen Absturz", pruef: 12, text: "Ist persönliche Schutzausrüstung gegen Absturz (PSAgA) vorhanden, wo sie erforderlich ist, und wird sie jährlich durch einen Sachkundigen geprüft?" },
            { id: "20.7", group: "PSA gegen Absturz", text: "Sind die Benutzer von PSAgA unterwiesen (mit praktischer Übung) und gibt es ein Rettungskonzept?" }
        ]
    },
    {
        id: "leergut",
        nr: 21,
        name: "Leergutzentrum",
        bereich: "Lager, Kommissionierung und Leergut",
        naLabel: "Kein Leergutzentrum am Standort",
        items: [
            { id: "21.1", text: "Sind Leergutannahme-, Sortier- und Förderanlagen mit wirksamen Schutzeinrichtungen und Not-Halt ausgerüstet?" },
            { id: "21.2", pruef: 12, text: "Sind die Sortier- und Förderanlagen wiederkehrend geprüft?" },
            { id: "21.3", text: "Werden Störungen (z. B. Flaschenstau) nur bei stillgesetzter und gesicherter Anlage beseitigt?" },
            { id: "21.4", text: "Sind Stapelhöhen für Leergutkisten und Leergutpaletten festgelegt und werden sie eingehalten (Standsicherheit)?" },
            { id: "21.5", text: "Ist der Umgang mit Glasbruch geregelt (Schnittschutzhandschuhe, Kehrgeräte, Sammelbehälter)?" },
            { id: "21.6", text: "Sind Hygiene und Reinigung im Leergutbereich geregelt (Restflüssigkeiten, Schimmel, Insekten, Waschgelegenheit)?" },
            { id: "21.7", text: "Sind die Sortierarbeitsplätze ergonomisch gestaltet (Greifhöhe, Drehbewegungen, Steh- oder Sitzhilfen, Tätigkeitswechsel)?" },
            { id: "21.8", text: "Ist der Lärm im Leergutbereich (Flaschen, Anlagen) ermittelt und wird bei Bedarf Gehörschutz bereitgestellt bzw. getragen?" },
            { id: "21.9", text: "Ist die hohe Brandlast durch Kunststoffkisten und Paletten berücksichtigt (Lagerabschnitte, Abstände, Rauchverbot, Löschmittel)?" },
            { id: "21.10", text: "Sind die Beschäftigten im Leergutbereich gegen Witterung, Zugluft und Kälte geschützt (bei offenen Hallen bzw. im Außenbereich)?" }
        ]
    },
    {
        id: "fw-zerlegung",
        nr: 22,
        name: "Fleischwerk – Zerlegung und Messerarbeit",
        bereich: "Fleischwerk",
        naLabel: "Kein Fleischwerk bzw. keine Zerlegung am Standort",
        items: [
            { id: "22.1", text: "Tragen alle Beschäftigten bei der Messerarbeit Stechschutzschürze und Kettenhandschuh in passender Größe?" },
            { id: "22.2", text: "Werden die Stechschutz-PSA regelmäßig auf Beschädigungen geprüft, gereinigt und bei Schäden ersetzt?" },
            { id: "22.3", text: "Sind geeignete, scharfe Messer vorhanden, ist das Schärfen geregelt und werden Messer sicher abgelegt und transportiert (Köcher, Messerhalter)?" },
            { id: "22.4", text: "Sind die Zerlegearbeitsplätze in der Höhe anpassbar und ist ausreichend Abstand zwischen den Arbeitsplätzen vorhanden?" },
            { id: "22.5", text: "Ist der Fußboden in der Zerlegung ausreichend rutschhemmend und werden Fett- und Fleischreste laufend entfernt?" },
            { id: "22.6", text: "Ist das manuelle Heben und Tragen schwerer Fleischteile durch Hilfsmittel (Rohrbahn, Hebehilfen, Kippvorrichtungen) begrenzt?" },
            { id: "22.7", text: "Werden einseitig belastende, sich wiederholende Tätigkeiten durch Arbeitsplatzwechsel und Pausen ausgeglichen?" },
            { id: "22.8", text: "Ist für Schnittverletzungen Erste-Hilfe-Material in unmittelbarer Nähe vorhanden und werden Verletzungen dokumentiert?" }
        ]
    },
    {
        id: "fw-maschinen",
        nr: 23,
        name: "Fleischwerk – Maschinen",
        bereich: "Fleischwerk",
        naLabel: "Keine Maschinen der Fleischverarbeitung am Standort",
        items: [
            { id: "23.1", text: "Sind Bandsägen mit verstellbarer Schutzhaube (auf Schnitthöhe eingestellt), Schiebeschlitten bzw. Restestückhalter ausgerüstet und werden diese benutzt?" },
            { id: "23.2", text: "Sind Fleischwölfe nur mit Einfüllschutz betrieben und wird zum Nachschieben ein Stopfer benutzt?" },
            { id: "23.3", text: "Sind Kutter, Mischer und Tumbler mit funktionierender Deckel- bzw. Schutzhaubenverriegelung ausgerüstet (Nachlauf beachtet)?" },
            { id: "23.4", text: "Sind Entschwartungs- und Entvliesmaschinen mit den vorgeschriebenen Schutzeinrichtungen ausgerüstet und werden sie nur von unterwiesenen Personen bedient?" },
            { id: "23.5", text: "Sind Vakuum-, Tiefzieh- und Clipmaschinen gegen Eingreifen in Gefahrstellen gesichert?" },
            { id: "23.6", text: "Werden Maschinen nur im stillgesetzten und gegen Wiedereinschalten gesicherten Zustand gereinigt und bei Störungen geöffnet?" },
            { id: "23.7", pruef: 12, text: "Sind die Maschinen wiederkehrend geprüft und ist die elektrische Sicherheit in Nassbereichen gewährleistet (Schutzart, Fehlerstrom-Schutzschalter)?" },
            { id: "23.8", text: "Liegen für alle Maschinen Betriebsanweisungen in verständlicher Sprache vor und ist die Beschäftigung von Jugendlichen an gefährlichen Maschinen ausgeschlossen?" }
        ]
    },
    {
        id: "fw-umgebung",
        nr: 24,
        name: "Fleischwerk – Kälte, Nässe, Reinigung und Hygiene",
        bereich: "Fleischwerk",
        naLabel: "Keine Produktionsbereiche eines Fleischwerks am Standort",
        items: [
            { id: "24.1", pruef: 12, text: "Ist bei einer Ammoniak-Kälteanlage eine Gaswarnanlage vorhanden und geprüft, und sind Notfallplan, Fluchtgeräte und Augendusche vorhanden?" },
            { id: "24.2", pruef: 12, text: "Sind Hochdruckreiniger wiederkehrend geprüft und werden beim Reinigen Schutzbrille bzw. Gesichtsschutz und geeignete Schutzkleidung getragen?" },
            { id: "24.3", text: "Sind für Reinigungs- und Desinfektionsmittel Betriebsanweisungen, Dosieranlagen und die nötige PSA vorhanden, und ist das Vermischen von Mitteln ausgeschlossen?" },
            { id: "24.4", text: "Ist für Feuchtarbeit ein Hautschutzplan vorhanden und wird die arbeitsmedizinische Vorsorge angeboten bzw. veranlasst?" },
            { id: "24.5", text: "Werden grundlegende Hygienemaßnahmen beim Umgang mit rohem Fleisch eingehalten (Waschgelegenheiten, Schutzkleidung, getrennte Pausenbereiche)?" },
            { id: "24.6", text: "Ist die Lärmbelastung ermittelt, wird ab 80 dB(A) Gehörschutz bereitgestellt und ab 85 dB(A) getragen und sind Lärmbereiche gekennzeichnet?" },
            { id: "24.7", text: "Sind Kältearbeitsplätze in der Produktion beurteilt und gibt es Aufwärmmöglichkeiten sowie geeignete Kälteschutzkleidung?" },
            { id: "24.8", text: "Sind Hygieneschleusen, Umkleiden und Stiefelwaschanlagen ausreichend groß, rutschhemmend und mit getrennter Aufbewahrung von Straßen- und Arbeitskleidung?" },
            { id: "24.9", text: "Sind Bodenabläufe, Rinnen und Abdeckungen trittsicher und unbeschädigt?" }
        ]
    },
    {
        id: "fw-foerder",
        nr: 25,
        name: "Fleischwerk – Fördertechnik, Transport und Organisation",
        bereich: "Fleischwerk",
        naLabel: "Kein Fleischwerk am Standort",
        items: [
            { id: "25.1", text: "Sind Rohrbahn bzw. Hängebahn sicher (Haken, Weichen, Endanschläge, keine herabfallenden Teile, ausreichende Kopffreiheit)?" },
            { id: "25.2", pruef: 12, text: "Sind Hebezeuge, Hebebühnen und Lastaufnahmemittel im Fleischwerk geprüft?" },
            { id: "25.3", text: "Sind Kistenwaschanlagen und Kistenstapel sicher (Schutzeinrichtungen, Stapelhöhe, Gewicht gefüllter Kisten)?" },
            { id: "25.4", text: "Sind Hubwagen und Flurförderzeuge für Nass- und Kühlbereiche geeignet (Bremsen, Bereifung) und in gutem Zustand?" },
            { id: "25.5", text: "Werden die Arbeitszeiten elektronisch erfasst und wird in Schlachtung, Zerlegung und Verarbeitung nur eigenes Personal eingesetzt (Fleischwirtschaft)?" },
            { id: "25.6", text: "Werden die Beschäftigten in einer verständlichen Sprache unterwiesen (ggf. mehrsprachig, mit Bildern) und ist dies dokumentiert?" },
            { id: "25.7", text: "Ist die Gefährdungsbeurteilung für das Fleischwerk aktuell (Maschinen, Messerarbeit, Kälte, Nässe, Lärm, Biostoffe, Gefahrstoffe) und mit dem Unfallversicherungsträger (in der Regel BGN) abgestimmt?" }
        ]
    },
    {
        id: "fz-umschlag",
        nr: 39,
        name: "Frischezentrum – Wareneingang, Umschlag und Kommissionierung",
        bereich: "Frischezentrum Obst und Gemüse",
        naLabel: "Kein Frischezentrum (Obst und Gemüse) am Standort",
        items: [
            { id: "39.1", pruef: 12, text: "Sind Rampen, Ladebrücken und die Sicherung der (Kühl-)Lkw im Frischezentrum genauso geregelt wie im Hauptlager (Keile bzw. Ampel, geprüfte Ladebrücken)?" },
            { id: "39.2", text: "Werden Pflanzenreste, Obst und Nässe auf dem Boden laufend entfernt, damit niemand ausrutscht?" },
            { id: "39.3", text: "Ist der Arbeitsplatz der Qualitätskontrolle gut beleuchtet (gute Farbwiedergabe), ergonomisch und werden für Schnittproben Sicherheitsmesser bzw. Schnittschutzhandschuhe benutzt?" },
            { id: "39.4", text: "Ist das Heben schwerer Gebinde (z. B. Kartoffel- und Zwiebelsäcke, Bananenkartons, Melonen) beurteilt und stehen Hilfsmittel zur Verfügung?" },
            { id: "39.5", text: "Sind Kisten- und Steigenstapel (Holzsteigen, Mehrwegkisten) standsicher und werden bei Holzsteigen Handschuhe gegen Splitter getragen?" },
            { id: "39.6", text: "Ist der Verkehr in den Bereitstell- und Umschlagzonen geregelt (getrennte Wege, Schrittgeschwindigkeit, Zeitdruck beim Umschlag berücksichtigt)?" },
            { id: "39.7", text: "Sind die Beschäftigten im gekühlten Umschlagbereich gegen Kälte und Zugluft geschützt (Kälteschutzkleidung, Aufwärmmöglichkeit)?" },
            { id: "39.8", text: "Werden verdorbene Ware und organische Abfälle regelmäßig entsorgt (geschlossene Behälter, Reinigung, Schutz vor Schädlingen)?" },
            { id: "39.9", text: "Ist die Gefährdungsbeurteilung für das Frischezentrum aktuell und sind die Beschäftigten unterwiesen?" }
        ]
    },
    {
        id: "fz-lager",
        nr: 40,
        name: "Frischezentrum – Kühllager und Reiferäume",
        bereich: "Frischezentrum Obst und Gemüse",
        naLabel: "Keine Kühllager bzw. Reiferäume im Frischezentrum",
        items: [
            { id: "40.1", text: "Lassen sich die Türen der Kühl- und Reiferäume jederzeit von innen öffnen und ist in jedem Raum ein funktionsfähiger Notruf vorhanden?" },
            { id: "40.2", text: "Ist das Betreten von Reiferäumen und Lagern mit kontrollierter Atmosphäre (CO2 durch Atmung der Früchte, Sauerstoffmangel) geregelt (Warnschild, Freimessen bzw. Lüften vor dem Betreten, Erlaubnisschein)?" },
            { id: "40.3", pruef: 12, text: "Sind die Gaswarnanlagen (CO2, O2, Ethylen, Kältemittel) in Reife- und Kühlräumen vorhanden, funktionsfähig und geprüft?" },
            { id: "40.4", text: "Ist der Umgang mit Ethylen-Reifegas geregelt (Betriebsanweisung, Gasflaschen gesichert, Explosionsschutz soweit erforderlich, nur unterwiesene Personen)?" },
            { id: "40.5", text: "Werden Importcontainer vor dem Öffnen auf Begasung geprüft (Kennzeichnung, Freimessen, Lüften)?" },
            { id: "40.6", text: "Ist der Umgang mit verschimmelter Ware geregelt (Handschuhe, ggf. Atemschutz bei starkem Schimmelbefall, Händewaschen)?" },
            { id: "40.7", text: "Sind Böden in Kühl- und Reiferäumen frei von Eis und Kondenswasser und sind Aufenthaltszeiten und Kälteschutz geregelt?" },
            { id: "40.8", text: "Sind Kälte-Maschinenräume gegen unbefugten Zutritt gesichert und gibt es einen Notfallplan bei Kältemittelaustritt?" }
        ]
    },
    {
        id: "fz-verwaltung",
        nr: 41,
        name: "Frischezentrum – Verwaltung",
        bereich: "Frischezentrum Obst und Gemüse",
        naLabel: "Keine eigene Verwaltung im Frischezentrum",
        items: [
            { id: "41.1", text: "Verwaltung Frischezentrum – Sind die Bildschirme so aufgestellt, dass keine Blendung oder Spiegelung durch Fenster oder Leuchten entsteht (Blickrichtung parallel zum Fenster)?" },
            { id: "41.2", text: "Verwaltung Frischezentrum – Sind Bürostuhl, Arbeitstisch und Bildschirm ergonomisch einstellbar und auf die jeweilige Person eingestellt?" },
            { id: "41.3", text: "Verwaltung Frischezentrum – Steht für jeden Büroarbeitsplatz eine ausreichende Bewegungsfläche zur Verfügung und sind die Räume nicht überbelegt?" },
            { id: "41.4", text: "Verwaltung Frischezentrum – Ist die Beleuchtung an den Büroarbeitsplätzen ausreichend und funktionsfähig?" },
            { id: "41.5", text: "Verwaltung Frischezentrum – Liegt die Raumtemperatur in den Büros im zulässigen Bereich (mindestens 20 °C) und gibt es bei Hitze Maßnahmen?" },
            { id: "41.6", text: "Verwaltung Frischezentrum – Sind Kabel und Mehrfachsteckdosen so verlegt, dass keine Stolperstellen entstehen und keine Steckdosenleisten hintereinander gesteckt sind?" },
            { id: "41.7", text: "Verwaltung Frischezentrum – Wird den Beschäftigten an Bildschirmarbeitsplätzen eine arbeitsmedizinische Vorsorge (Angebotsvorsorge inkl. Sehtest) angeboten?" },
            { id: "41.8", pruef: 24, text: "Verwaltung Frischezentrum – Sind die ortsveränderlichen elektrischen Geräte im Büro (z. B. Leuchten, Ladegeräte, Kaffeemaschinen) geprüft?" },
            { id: "41.9", text: "Verwaltung Frischezentrum – Wird die Bildschirmarbeit durch andere Tätigkeiten oder Pausen regelmäßig unterbrochen?" },
            { id: "41.10", text: "Verwaltung Frischezentrum – Sind Fenster, Sonnenschutz und Lüftungsmöglichkeiten in den Büros funktionsfähig?" },
            { id: "41.11", text: "Sind Flucht- und Rettungswege im Verwaltungsgebäude frei und gekennzeichnet und ist ein aktueller Flucht- und Rettungsplan ausgehängt?" },
            { id: "41.12", pruef: 24, text: "Sind in der Verwaltung ausreichend Feuerlöscher vorhanden, frei zugänglich und geprüft?" },
            { id: "41.13", text: "Sind in der Verwaltung Ersthelfer benannt und Verbandkasten sowie Notrufnummern vorhanden?" },
            { id: "41.14", text: "Sind Treppen, Flure und ggf. der Aufzug im Verwaltungsgebäude sicher (Handläufe, Beleuchtung, Prüfung des Aufzugs)?" },
            { id: "41.15", text: "Sind Pausenraum bzw. Teeküche und Toiletten der Verwaltung sauber und ausreichend?" }
        ]
    },
    {
        id: "stapler",
        nr: 26,
        name: "Gabelstapler",
        bereich: "Flurförderzeuge, Werkstatt und Tankstelle",
        naLabel: "Keine Gabelstapler mit Fahrersitz bzw. Fahrerstand am Standort",
        items: [
            { id: "26.1", text: "Haben alle Staplerfahrer eine Ausbildung (Fahrausweis) und eine schriftliche Beauftragung durch den Unternehmer?" },
            { id: "26.2", pruef: 12, text: "Ist die jährliche Prüfung der Stapler durch eine zur Prüfung befähigte Person nachgewiesen (Prüfplakette, Prüfbuch)?" },
            { id: "26.3", text: "Wird vor Arbeitsbeginn eine Einsatzprüfung (Bremsen, Lenkung, Hydraulik, Gabelzinken, Warneinrichtungen) durchgeführt?" },
            { id: "26.4", text: "Werden vorhandene Rückhaltesysteme (Sicherheitsgurt, Bügeltür, geschlossene Kabine) benutzt?" },
            { id: "26.5", text: "Wird das Mitfahren und Hochheben von Personen unterlassen bzw. nur mit dafür zugelassenen Arbeitsbühnen durchgeführt?" },
            { id: "26.6", text: "Sind Tragfähigkeitsschild bzw. Lastdiagramm vorhanden und lesbar, und werden die zulässigen Lasten eingehalten?" },
            { id: "26.7", text: "Werden Stapler sicher abgestellt (Gabel abgesenkt, Feststellbremse, Schlüssel abgezogen, nicht vor Notausgängen oder Feuerlöschern)?" },
            { id: "26.8", text: "Erfolgt der Wechsel von Treibgasflaschen nur durch unterwiesene Personen und werden Treibgasstapler nicht unter Erdgleiche abgestellt?" },
            { id: "26.9", text: "Werden die Staplerfahrer mindestens jährlich unterwiesen und ist dies dokumentiert?" },
            { id: "26.10", text: "Sind Maßnahmen gegen Zusammenstöße mit Fußgängern getroffen (z. B. Warnlicht/Blue Spot, Rückfahrwarner, Kameras, Rückwärtsfahren bei sichtbehindernder Last)?" },
            { id: "26.11", text: "Sind Anbaugeräte (z. B. Klammern, Drehgeräte, Arbeitsbühnen) zugelassen, im Lastdiagramm berücksichtigt und geprüft?" },
            { id: "26.12", text: "Werden Gefälle und Rampen nur mit bergseitiger Last befahren und wird auf Steigungen nicht gewendet?" }
        ]
    },
    {
        id: "eameisen",
        nr: 27,
        name: "E-Ameisen (Mitgänger-Flurförderzeuge)",
        bereich: "Flurförderzeuge, Werkstatt und Tankstelle",
        naLabel: "Keine E-Ameisen bzw. elektrischen Mitgänger-Flurförderzeuge am Standort",
        items: [
            { id: "27.1", text: "Werden E-Ameisen nur von unterwiesenen, geeigneten und vom Unternehmer beauftragten Personen bedient?" },
            { id: "27.2", text: "Funktionieren Totmannschalter, Kollisionsschutz (Bauchschalter), Bremse und Hupe?" },
            { id: "27.3", pruef: 12, text: "Ist die jährliche Prüfung der E-Ameisen nachgewiesen (Prüfplakette, Prüfprotokoll)?" },
            { id: "27.4", text: "Wird die Standplattform bzw. das Mitfahren nur genutzt, wenn das Gerät dafür vorgesehen ist?" },
            { id: "27.5", text: "Wird mit angepasster Geschwindigkeit gefahren, insbesondere an Kreuzungen, Rampen und in engen Gängen (Quetschgefahr)?" },
            { id: "27.6", text: "Werden E-Ameisen nach Gebrauch sicher abgestellt (Schlüssel abgezogen, nicht in Verkehrs- oder Fluchtwegen)?" },
            { id: "27.7", text: "Tragen die Bediener Sicherheitsschuhe?" }
        ]
    },
    {
        id: "hubwagen",
        nr: 28,
        name: "Hubwagen",
        bereich: "Flurförderzeuge, Werkstatt und Tankstelle",
        naLabel: "Keine handbetriebenen Hubwagen am Standort",
        items: [
            { id: "28.1", text: "Sind die Hubwagen in technisch einwandfreiem Zustand (Räder, Deichsel, Hydraulik dicht, Bremse falls vorhanden)?" },
            { id: "28.2", pruef: 12, text: "Werden die Hubwagen wiederkehrend geprüft (z. B. jährlich) und ist dies dokumentiert?" },
            { id: "28.3", text: "Werden Hubwagen nach Gebrauch so abgestellt, dass keine Stolpergefahr entsteht (Gabel abgesenkt, nicht in Wegen)?" },
            { id: "28.4", text: "Werden die zulässige Tragfähigkeit eingehalten und schwere Lasten nur auf ebenem Boden bewegt (nicht auf Gefälle)?" },
            { id: "28.5", text: "Sind die Zugkräfte beim Bewegen schwerer Paletten zumutbar (ggf. elektrische Unterstützung vorhanden)?" }
        ]
    },
    {
        id: "ladestation",
        nr: 29,
        name: "Batterieladestation",
        bereich: "Flurförderzeuge, Werkstatt und Tankstelle",
        naLabel: "Keine Batterieladestation am Standort",
        items: [
            { id: "29.1", text: "Ist der Laderaum bzw. Ladebereich ausreichend belüftet?" },
            { id: "29.2", text: "Ist der Ladebereich gekennzeichnet (Rauchen und offenes Feuer verboten, Warnhinweise) und frei von brennbarem Material?" },
            { id: "29.3", text: "Sind eine Augenspülflasche bzw. Augendusche und geeignete PSA (Schutzbrille, säurefeste Handschuhe, Schürze) vorhanden?" },
            { id: "29.4", pruef: 12, text: "Sind Ladegeräte, Ladekabel und Stecker unbeschädigt und geprüft?" },
            { id: "29.5", text: "Gibt es für Lithium-Ionen-Batterien besondere Regeln (Laden nur mit Originalladegerät, Umgang mit beschädigten Akkus)?" },
            { id: "29.6", text: "Liegt eine Betriebsanweisung für das Laden und den Batteriewechsel vor und sind die Beschäftigten unterwiesen?" },
            { id: "29.7", text: "Ist in der Nähe des Ladebereichs ein geeigneter Feuerlöscher vorhanden?" }
        ]
    },
    {
        id: "werkstatt",
        nr: 30,
        name: "Werkstatt Flurförderzeuge",
        bereich: "Flurförderzeuge, Werkstatt und Tankstelle",
        naLabel: "Keine Instandsetzungswerkstatt für Flurförderzeuge am Standort",
        items: [
            { id: "30.1", group: "Werkstatt und Instandsetzung", pruef: 12, text: "Sind Hebebühnen, Hubtische und Wagenheber wiederkehrend durch eine zur Prüfung befähigte Person geprüft?" },
            { id: "30.2", group: "Werkstatt und Instandsetzung", pruef: 12, text: "Sind Krane, Hebezeuge und Anschlagmittel (Ketten, Hebebänder) geprüft, gekennzeichnet und in einwandfreiem Zustand?" },
            { id: "30.3", group: "Werkstatt und Instandsetzung", text: "Werden angehobene Fahrzeuge, Hubmasten und Gabelträger vor Arbeiten darunter gegen unbeabsichtigtes Absenken gesichert (Unterstellböcke, Mastsicherung)?" },
            { id: "30.4", group: "Werkstatt und Instandsetzung", text: "Werden Flurförderzeuge nach einer Instandsetzung vor der Freigabe auf ihre sichere Funktion geprüft und ist dies dokumentiert?" },
            { id: "30.5", group: "Werkstatt und Instandsetzung", text: "Werden defekte Flurförderzeuge bis zur Reparatur gekennzeichnet und gegen Benutzung gesichert (z. B. Schlüssel abgezogen, Sperrschild)?" },
            { id: "30.6", group: "Werkstatt und Instandsetzung", pruef: 12, text: "Sind elektrische Handwerkzeuge, Ladegeräte und Verlängerungsleitungen in der Werkstatt geprüft?" },
            { id: "30.7", group: "Werkstatt und Instandsetzung", text: "Werden Arbeiten an der elektrischen Anlage und an Traktionsbatterien nur von Elektrofachkräften bzw. elektrotechnisch unterwiesenen Personen ausgeführt (Freischalten, Batteriestecker gezogen)?" },
            { id: "30.8", group: "Werkstatt und Instandsetzung", text: "Ist für Schweiß-, Trenn- und Schleifarbeiten der Brandschutz geregelt (Erlaubnisschein außerhalb fester Arbeitsplätze, Funkenschutz, Löschmittel) und ist eine Absaugung vorhanden?" },
            { id: "30.9", group: "Werkstatt und Instandsetzung", pruef: 0, text: "Sind Druckluftanlage, Kompressor und Druckbehälter geprüft und in ordnungsgemäßem Zustand?" },
            { id: "30.10", group: "Werkstatt und Instandsetzung", text: "Werden Reifen mit Luftbereifung (insbesondere mehrteilige Felgen) nur mit Reifenfüllkäfig bzw. geeigneter Schutzeinrichtung befüllt?" },
            { id: "30.11", group: "Werkstatt und Instandsetzung", text: "Werden Öle, Bremsenreiniger und andere Betriebsstoffe sachgerecht gelagert (Auffangwanne), ist Altöl getrennt gesammelt und liegen Betriebsanweisungen vor?" },
            { id: "30.12", group: "Werkstatt und Instandsetzung", text: "Gibt es einen Hautschutzplan und werden geeignete Schutzhandschuhe, Schutzbrillen und Gehörschutz bereitgestellt und benutzt?" },
            { id: "30.13", group: "Werkstatt und Instandsetzung", text: "Ist in der Werkstatt Erste-Hilfe-Material einschließlich Augenspülung vorhanden?" },
            { id: "30.14", group: "Sozialraum, Pausenraum und Büro der Werkstatt", text: "Ist ein Pausenraum vorhanden, der von der Werkstatt getrennt, sauber und frei von Lagergut ist?" },
            { id: "30.15", group: "Sozialraum, Pausenraum und Büro der Werkstatt", text: "Sind Wasch- und Umkleideräume vorhanden und können Straßen- und Arbeitskleidung getrennt aufbewahrt werden?" },
            { id: "30.16", group: "Sozialraum, Pausenraum und Büro der Werkstatt", text: "Ist der Büroarbeitsplatz der Werkstatt ergonomisch eingerichtet und vor Lärm, Abgasen und Zugluft aus der Werkstatt geschützt?" },
            { id: "30.17", group: "Sozialraum, Pausenraum und Büro der Werkstatt", text: "Sind Sozialräume und Werkstattbüro sauber, ausreichend beheizt, belüftet und beleuchtet?" }
        ]
    },
    {
        id: "tankstelle",
        nr: 31,
        name: "Betriebstankstelle (Diesel)",
        bereich: "Flurförderzeuge, Werkstatt und Tankstelle",
        naLabel: "Keine Betriebstankstelle am Standort",
        items: [
            { id: "31.1", pruef: 0, text: "Ist die Tankanlage nach Wasserrecht geprüft (Sachverständigenprüfung nach AwSV, soweit erforderlich) und liegt die Anlagendokumentation vor?" },
            { id: "31.2", text: "Ist das Merkblatt bzw. die Betriebsanweisung zum Umgang mit wassergefährdenden Stoffen an der Tankstelle ausgehängt?" },
            { id: "31.3", text: "Ist die Abfüllfläche flüssigkeitsundicht befestigt und wird das Niederschlagswasser über einen Leichtflüssigkeitsabscheider abgeleitet?" },
            { id: "31.4", pruef: 6, text: "Wird der Leichtflüssigkeitsabscheider regelmäßig kontrolliert und gewartet (Eigenkontrolle, Wartung durch Sachkundigen, Entleerung)?" },
            { id: "31.5", text: "Sind Bindemittel und Auffangmaterial für ausgelaufenen Kraftstoff vorhanden und ist das Vorgehen bei Leckagen festgelegt?" },
            { id: "31.6", text: "Sind Not-Aus der Zapfanlage, Rauchverbot und Hinweis „Motor aus“ gut sichtbar gekennzeichnet und ist ein Feuerlöscher vorhanden?" },
            { id: "31.7", pruef: 12, text: "Sind Zapfsäule, Schläuche, Zapfventil und Abreißkupplung unbeschädigt und dicht, und sind die elektrischen Teile geprüft?" },
            { id: "31.8", text: "Sind Zapfsäule und Tank gegen Anfahren geschützt?" },
            { id: "31.9", text: "Wird nur durch unterwiesene Personen getankt und ist die Anlage gegen unbefugte Benutzung gesichert (Schlüssel, Tankkarte)?" },
            { id: "31.10", text: "Werden beim Betanken Schutzhandschuhe benutzt und ist Hautschutz vorhanden (Diesel entfettet die Haut)?" }
        ]
    },
    {
        id: "aufzuege",
        nr: 32,
        name: "Aufzüge (Personen- und Lastenaufzug)",
        bereich: "Gebäude, Technik, Photovoltaik und Gefahrstoffe",
        naLabel: "Keine Aufzugsanlagen am Standort",
        items: [
            { id: "32.1", group: "Personenaufzug", pruef: 24, text: "Ist die Prüfung durch eine zugelassene Überwachungsstelle (ZÜS) gültig (Hauptprüfung spätestens alle zwei Jahre, Zwischenprüfung)?" },
            { id: "32.2", group: "Personenaufzug", text: "Funktioniert das Notrufsystem und ist eine Personenbefreiung organisiert?" },
            { id: "32.3", group: "Personenaufzug", text: "Befindet sich der Aufzug in ordnungsgemäßem Zustand (Türen, Haltegenauigkeit, Beleuchtung, keine Beschädigungen)?" },
            { id: "32.4", group: "Lastenaufzug", pruef: 0, text: "Ist die Prüfung des Lastenaufzugs (Güteraufzug) aktuell und nachgewiesen?" },
            { id: "32.5", group: "Lastenaufzug", text: "Ist am Lastenaufzug das Mitfahrverbot für Personen deutlich angebracht und wird es eingehalten?" },
            { id: "32.6", group: "Lastenaufzug", text: "Sind Tragfähigkeit und Bedienhinweise am Lastenaufzug angebracht und werden Rollcontainer bzw. Paletten gesichert transportiert?" }
        ]
    },
    {
        id: "photovoltaik",
        nr: 45,
        name: "Photovoltaikanlage auf den Dächern",
        bereich: "Gebäude, Technik, Photovoltaik und Gefahrstoffe",
        naLabel: "Keine Photovoltaikanlage auf den Dächern",
        items: [
            { id: "45.1", pruef: 48, text: "Ist die Photovoltaikanlage einschließlich Wechselrichter wiederkehrend durch eine Elektrofachkraft geprüft?" },
            { id: "45.2", text: "Ist das Begehen der Dachflächen (Wartung, Reinigung, Kontrolle) gegen Absturz gesichert (Geländer, Anschlageinrichtungen, Laufwege, Schutz vor Durchsturz durch Lichtkuppeln)?" },
            { id: "45.3", text: "Ist der Zugang zum Dach geregelt (verschlossen, nur unterwiesene bzw. beauftragte Personen, Erlaubnis für Fremdfirmen)?" },
            { id: "45.4", text: "Ist die PV-Anlage für die Feuerwehr gekennzeichnet (Hinweisschilder, Lage von Modulen, Leitungen und Wechselrichtern im Feuerwehrplan) und ist eine Freischaltmöglichkeit vorhanden?" },
            { id: "45.5", text: "Sind Wechselrichter und Stromspeicher (falls vorhanden) in geeigneten, belüfteten Räumen bzw. Bereichen aufgestellt, frei von brennbaren Lagerungen und gekennzeichnet?" },
            { id: "45.6", text: "Werden Arbeiten an der PV-Anlage (auch Reinigung) nur von Fachfirmen bzw. Elektrofachkräften ausgeführt, unter Beachtung der Gleichspannungsgefahr?" },
            { id: "45.7", text: "Ist bei der Montage die Tragfähigkeit des Dachs nachgewiesen und werden Module, Unterkonstruktion und Blitzschutz regelmäßig kontrolliert (z. B. nach Sturm)?" }
        ]
    },
    {
        id: "presse",
        nr: 33,
        name: "Ballenpresse und Müllpresse",
        bereich: "Gebäude, Technik, Photovoltaik und Gefahrstoffe",
        naLabel: "Keine Ballenpresse bzw. Müllpresse am Standort",
        items: [
            { id: "33.1", text: "Sind die Schutzeinrichtungen der Ballen- bzw. Müllpresse (Türverriegelung, Not-Halt) funktionsfähig und nicht manipuliert?" },
            { id: "33.2", pruef: 12, text: "Ist die wiederkehrende Prüfung der Presse durch eine zur Prüfung befähigte Person nachgewiesen?" },
            { id: "33.3", text: "Wird die Presse nur von unterwiesenen und beauftragten Personen bedient und ist die Benutzung durch Jugendliche ausgeschlossen?" },
            { id: "33.4", text: "Liegt eine Betriebsanweisung an der Presse aus?" },
            { id: "33.5", text: "Ist der Bereich um die Presse frei, sauber und frei von brennbarem Material außerhalb der Presse?" },
            { id: "33.6", text: "Werden fertige Ballen sicher gelagert und transportiert (standsicher, nicht zu hoch gestapelt)?" }
        ]
    },
    {
        id: "gefahrstoffe",
        nr: 34,
        name: "Gefahrstoffe",
        bereich: "Gebäude, Technik, Photovoltaik und Gefahrstoffe",
        naLabel: "Keine Gefahrstoffe am Standort gelagert oder verwendet",
        items: [
            { id: "34.1", text: "Ist ein aktuelles Gefahrstoffverzeichnis vorhanden?" },
            { id: "34.2", text: "Liegen aktuelle Sicherheitsdatenblätter vor und sind sie für die Beschäftigten zugänglich?" },
            { id: "34.3", text: "Sind Betriebsanweisungen für die verwendeten Gefahrstoffe vorhanden und sind die Beschäftigten unterwiesen?" },
            { id: "34.4", text: "Werden Gefahrstoffe sachgerecht gelagert (Auffangwanne, Zusammenlagerungsverbote beachtet, nicht in Verkehrs- oder Fluchtwegen)?" },
            { id: "34.5", text: "Sind alle Behälter ordnungsgemäß gekennzeichnet (keine Umfüllung in Lebensmittelbehälter)?" },
            { id: "34.6", text: "Werden die erforderlichen Schutzhandschuhe und Schutzbrillen bereitgestellt und benutzt?" },
            { id: "34.7", text: "Wurde geprüft, ob gefährliche Stoffe durch weniger gefährliche ersetzt werden können (Substitutionsprüfung)?" },
            { id: "34.8", text: "Werden Spraydosen und Druckgaspackungen sicher gelagert (nicht an Wärmequellen, nicht in Fluchtwegen)?" }
        ]
    },
    {
        id: "brandschutz",
        nr: 35,
        name: "Brandschutz und Flucht",
        bereich: "Brandschutz",
        naLabel: "Brandschutz nicht Gegenstand dieser Begehung",
        items: [
            { id: "35.1", pruef: 24, text: "Sind ausreichend Feuerlöscher vorhanden, gekennzeichnet, frei zugänglich und geprüft (Prüfung höchstens alle zwei Jahre)?" },
            { id: "35.2", text: "Sind Flucht- und Rettungswege sowie Notausgänge frei, gekennzeichnet und führen sie ins Freie bzw. in einen gesicherten Bereich?" },
            { id: "35.3", text: "Ist ein aktueller Flucht- und Rettungsplan an geeigneten Stellen ausgehängt?" },
            { id: "35.4", pruef: 12, text: "Ist die Sicherheitsbeleuchtung funktionsfähig und wird sie regelmäßig geprüft?" },
            { id: "35.5", pruef: 12, text: "Sind Brandschutztüren und -tore funktionsfähig, nicht verkeilt und im Schließbereich frei?" },
            { id: "35.6", text: "Ist unter Sprinklerköpfen bzw. Deckenbereichen der notwendige Freiraum eingehalten (keine Ware bis unter die Sprinkler)?" },
            { id: "35.7", text: "Sind ausreichend Brandschutzhelfer benannt und ausgebildet (in der Regel 5 % der Beschäftigten)?" },
            { id: "35.8", text: "Ist eine Brandschutzordnung vorhanden und wird regelmäßig eine Räumungsübung durchgeführt?" },
            { id: "35.9", pruef: 12, text: "Ist die Brandmeldeanlage wiederkehrend inspiziert und gewartet (Prüfnachweis vorhanden)?" },
            { id: "35.10", pruef: 12, text: "Sind Rauch- und Wärmeabzugsanlagen (RWA) funktionsfähig und gewartet?" },
            { id: "35.11", pruef: 12, text: "Sind Wandhydranten geprüft und frei zugänglich?" },
            { id: "35.12", text: "Sind Feuerwehrzufahrten, Aufstell- und Bewegungsflächen frei und gekennzeichnet?" },
            { id: "35.13", text: "Werden brennbare Stoffe im Freien (Paletten, Leergut, Abfall) mit ausreichendem Abstand zu Gebäuden gelagert?" }
        ]
    },
    {
        id: "erstehilfe",
        nr: 36,
        name: "Erste Hilfe",
        bereich: "Organisation und Notfall",
        naLabel: "Erste Hilfe nicht Gegenstand dieser Begehung",
        items: [
            { id: "36.1", text: "Sind ausreichend Ersthelfer in jeder Schicht anwesend?" },
            { id: "36.2", text: "Sind Verbandkästen vollständig, gekennzeichnet und schnell erreichbar (auch im Lager und an der Rampe)?" },
            { id: "36.3", text: "Werden Erste-Hilfe-Leistungen dokumentiert (Verbandbuch bzw. Meldeblock)?" },
            { id: "36.4", text: "Sind Notrufnummern und Namen der Ersthelfer ausgehängt?" },
            { id: "36.5", text: "Ist ein Defibrillator (AED) vorhanden bzw. die Entscheidung dazu in der Gefährdungsbeurteilung getroffen?" },
            { id: "36.6", text: "Ist eine Augenspüleinrichtung vorhanden, wo Augenverletzungen durch Stoffe möglich sind?" },
            { id: "36.7", text: "Ist ein Sanitätsraum vorhanden, sofern erforderlich (mehr als 1.000 Beschäftigte oder mehr als 100 bei besonderen Unfallgefahren)?" },
            { id: "36.8", text: "Ist der Alarmierungsweg für den Rettungsdienst festgelegt (Einweisung an der Pforte, Zufahrt, Sammelplatz)?" }
        ]
    },
    {
        id: "organisation",
        nr: 37,
        name: "Organisation",
        bereich: "Organisation und Notfall",
        naLabel: "Organisation nicht Gegenstand dieser Begehung",
        items: [
            { id: "37.1", text: "Liegt eine aktuelle Gefährdungsbeurteilung für alle Tätigkeiten am Standort vor (einschließlich psychischer Belastung)?" },
            { id: "37.2", text: "Werden die Beschäftigten mindestens jährlich unterwiesen (Jugendliche halbjährlich) und ist dies dokumentiert?" },
            { id: "37.3", text: "Gibt es eine Übersicht über alle prüfpflichtigen Arbeitsmittel und Anlagen mit Prüffristen (Prüfkataster) und werden die Fristen eingehalten?" },
            { id: "37.4", text: "Ist die Zusammenarbeit mit Fremdfirmen (Reinigung, Wartung, Leiharbeit, Transporteure) geregelt und abgestimmt?" },
            { id: "37.5", text: "Ist Alleinarbeit (z. B. in Randzeiten, Nachtschicht, Kühlbereichen) beurteilt und abgesichert (z. B. Personen-Notsignal-Anlage, Kontrollanrufe)?" },
            { id: "37.6", text: "Sind Nacht- und Schichtarbeit arbeitszeitrechtlich korrekt geregelt und wird Nachtarbeitern eine arbeitsmedizinische Untersuchung angeboten?" },
            { id: "37.7", text: "Sind Betriebsarzt und Fachkraft für Arbeitssicherheit bestellt und tagt der Arbeitsschutzausschuss regelmäßig (bei mehr als 20 Beschäftigten vierteljährlich)?" },
            { id: "37.8", text: "Werden Arbeitsunfälle untersucht, meldepflichtige Unfälle fristgerecht gemeldet und daraus Maßnahmen abgeleitet?" },
            { id: "37.9", text: "Ist die Gefährdungsbeurteilung für schwangere und stillende Frauen (anlassunabhängig) durchgeführt?" },
            { id: "37.10", text: "Werden Leiharbeitnehmer und neue Beschäftigte vor Arbeitsaufnahme arbeitsplatzbezogen unterwiesen?" },
            { id: "37.11", text: "Liegen für alle Maschinen und gefährlichen Arbeitsmittel Betriebsanweisungen vor?" }
        ]
    },
    {
        id: "sonstiges",
        nr: 38,
        name: "Sonstiges",
        bereich: "Organisation und Notfall",
        naLabel: "Keine sonstigen Feststellungen",
        items: [
            { id: "38.1", frei: true, text: "" },
            { id: "38.2", frei: true, text: "" }
        ]
    }
];

// IDs der freien Pruefpunkte (Kategorie "Sonstiges")

// Ausstattung am Standort (Betriebsprofil auf der Prüfkatalog-Seite).
// Haken entfernt -> zugehörige Kategorien werden "nicht zutreffend".
const AUSSTATTUNG = [
    { key: "empfang", label: "Haupteingang mit Empfang", kategorien: ["empfang"] },
    { key: "pforten", label: "Pforten / Schrankenanlagen", kategorien: ["pforten"] },
    { key: "boersensaal", label: "Börsensaal / Veranstaltungen", kategorien: ["boersensaal"] },
    { key: "ausstellung", label: "Ausstellungsraum", kategorien: ["ausstellung"] },
    { key: "parkhaeuser", label: "Parkhäuser", kategorien: ["parkhaeuser"] },
    { key: "buero", label: "Büroarbeitsplätze", kategorien: ["buero"] },
    { key: "hof", label: "Eigener Hof / Außenbereich", kategorien: ["aussenbereich"] },
    { key: "tore", label: "Kraftbetätigte Tore", kategorien: ["tore"] },
    { key: "rampe", label: "Laderampe / Anlieferung", kategorien: ["rampe"] },
    { key: "verladung", label: "Wareneingang / Verladung", kategorien: ["wareneingang"] },
    { key: "regale", label: "Regalanlagen", kategorien: ["regale"] },
    { key: "rbg", label: "Regalbediengeräte", kategorien: ["rbg"] },
    { key: "kommissionierung", label: "Kommissionierung", kategorien: ["kommissionierung"] },
    { key: "kuehlung", label: "Kühl- / Tiefkühlbereich", kategorien: ["kuehlung"] },
    { key: "hoehe", label: "Bühnen / Arbeiten in der Höhe", kategorien: ["absturz"] },
    { key: "stapler", label: "Gabelstapler", kategorien: ["stapler"] },
    { key: "eameisen", label: "E-Ameisen", kategorien: ["eameisen"] },
    { key: "hubwagen", label: "Handhubwagen", kategorien: ["hubwagen"] },
    { key: "ladestation", label: "Batterieladestation", kategorien: ["ladestation"] },
    { key: "werkstatt", label: "Werkstatt Flurförderzeuge", kategorien: ["werkstatt"] },
    { key: "tankstelle", label: "Betriebstankstelle Diesel", kategorien: ["tankstelle"] },
    { key: "aufzuege", label: "Aufzüge", kategorien: ["aufzuege"] },
    { key: "presse", label: "Ballen- / Müllpresse", kategorien: ["presse"] },
    { key: "gefahrstoffe", label: "Gefahrstoffe", kategorien: ["gefahrstoffe"] },
    { key: "rollcontainer", label: "Rollcontainer", kategorien: ["rollcontainer"] },
    { key: "verpackung", label: "Verpackungsmaschinen", kategorien: ["verpackung"] },
    { key: "leergut", label: "Leergutzentrum", kategorien: ["leergut"] },
    { key: "fleischwerk", label: "Fleischwerk", kategorien: ["fw-zerlegung", "fw-maschinen", "fw-umgebung", "fw-foerder"] },
    { key: "frischezentrum", label: "Frischezentrum Obst/Gemüse", kategorien: ["fz-umschlag", "fz-lager"] },
    { key: "fz-verwaltung", label: "Verwaltung Frischezentrum", kategorien: ["fz-verwaltung"] },
    { key: "dlz-verwaltung", label: "Verwaltung Dienstleistungszentrum", kategorien: ["dlz-verwaltung"] },
    { key: "schulung", label: "Schulungszentrum", kategorien: ["schulung"] },
    { key: "ladesaeulen", label: "Ladesäulen auf Parkflächen", kategorien: ["ladesaeulen"] },
    { key: "photovoltaik", label: "Photovoltaikanlage", kategorien: ["photovoltaik"] }
];

const FREIE_PUNKT_IDS = AUDIT_CATEGORIES.reduce((ids, c) => ids.concat(c.items.filter(i => i.frei).map(i => i.id)), []);
