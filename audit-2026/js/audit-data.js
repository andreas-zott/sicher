// Audit-Daten - Pruefpunkte nach Kategorien
const AUDIT_CATEGORIES = [
    {
           id: "gesamtmarkt",
        name: "Gesamtmarkt",
        items: [
            { id: "1.1", text: "Entspricht das getragene Schuhwerk aller im Bereich tätigen Personen den Anforderungen der Gefährdungsbeurteilung (fest, im Zehenbereich geschlossen, flach und rutschhemmend)?" },
            { id: "1.2", text: "Beachten die Mitarbeitenden die Betriebsanweisung für Flurförderfahrzeuge insbes. PSA-Pflicht, Traglasten, Verbot der Personenmitnahme?" },
            { id: "1.3", text: "Wurden die Automatiktüren, Schnelllauftore und Rolltore gemäß den geltenden Regelwerken geprüft und befinden sich diese in einem ordnungsgemäßen Zustand?" },
            { id: "1.4", text: "Ist die Aufzugsanlage geprüft und in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen und mit funktionsfähigen Schutzeinrichtungen)?" },
            { id: "1.5", text: "Ist die Leergutrücknahme in einem ordnungsgemäßen Zustand (Schutzeinrichtungen intakt, Einzugsstellen gesichert, keine Glasscherben)?" },
            { id: "1.6", text: "Werden für Tätigkeiten in der Höhe geeignete und geprüfte Aufstiegshilfen in ausreichender Zahl bereitgestellt und bestimmungsgemäß benutzt?" },
            { id: "1.7", text: "Sind die Leitern geprüft gemäß DGUV Information 208-016 Leitern und Tritte?" },
            { id: "1.8", text: "Werden aus dem Ordersatz geeignete Sicherheitsmesser verwendet?" },
            { id: "1.9", text: "Sind die Verkehrswege so beschaffen, dass kein Unfallrisiko durch Stolpern, Ausrutschen oder Umknicken besteht?" },
            { id: "1.10", text: "Sind die Treppen unbeschädigt und frei von Gegenständen?" },
            { id: "1.11", text: "Sind Betriebsanweisungen gut zugänglich und werden Sicherheitsanweisungen eingehalten?" },
            { id: "1.12", text: "Ist die Beleuchtung in den Verkaufs- und Lagerbereichen gemäß ASR A3.4 ausreichend dimensioniert (mind. 300 Lux im Verkaufsraum), voll funktionsfähig und so beschaffen, dass Gefahrenhinweise auf Produkten sowie Leckagen in den Regalen jederzeit zweifelsfrei erkennbar sind?" }
        ]
    },

    {
        id: "brandschutz",
        name: "Brandschutz",
        items: [
            { id: "2.1", text: "Sind die Feuerlöscheinrichtungen geprüft, und werden die Prüffristen eingehalten?" },
            { id: "2.2", text: "Sind die Feuerlöscheinrichtungen frei zugänglich und nicht blockiert?" },
            { id: "2.3", text: "Sind die Prüfsiegel auf den Wandhydranten unbeschädigt?" },
            { id: "2.4", text: "Sind die Brandschutztüren frei von Zugestellungen?" },
            { id: "2.5", text: "Sind Türhaltevorrichtungen und Schließfolgeregler in Ordnung?" },
            { id: "2.6", text: "Sind die Brandschutztüren ohne Beschädigungen?" },
            { id: "2.7", text: "Ist ein aktueller Flucht- und Rettungsplan vorhanden?" },
            { id: "2.8", text: "Ist die Notausgangsbeleuchtung ohne Defekte?" },
            { id: "2.9", text: "Sind Flucht- und Rettungswege ständig freigehalten?" },
            { id: "2.10", text: "Sind alle Notausgänge jederzeit leicht zu öffnen?" },
            { id: "2.11", text: "Führen die Notausgänge in sichere Bereiche?" },
            { id: "2.12", text: "Ist die Brandmeldeanlage funktionsfähig?" },
            { id: "2.13", text: "Wird die Einfüllöffnung des Presscontainers nach Betriebsschluss verschlossen?" },
            { id: "2.14", text: "Sind Technik- und Heizräume frei von brennbaren Materialien?" },
            { id: "2.15", text: "Sind Technik- und Heizräume frei von Lagernutzung?" }
        ]
    },

    {
        id: "sozialraeume",
        name: "Sozialräume",
        items: [
            { id: "3.1", text: "Hängen aktuelle aushangpflichtige Gesetze und Vorschriften aus?" },
            { id: "3.2", text: "Sind Kaffeemaschine und hitzeentwickelnde Geräte auf nicht brennbarer Unterlage abgestellt?" },
            { id: "3.3", text: "Werden ortsveränderliche elektrische Betriebsmittel regelmäßig geprüft?" },
            { id: "3.4", text: "Dient der Pausenraum primär der Erholung der Beschäftigten?" }
        ]
    },

    {
        id: "erstehilfe",
        name: "Erste Hilfe",
        items: [
            { id: "4.1", text: "Erfüllen die Standorte der Erste-Hilfe-Koffer die DGUV-Anforderungen?" },
            { id: "4.2", text: "Ist das Erste-Hilfe-Material vollständig und nicht abgelaufen?" },
            { id: "4.3", text: "Wird die Dokumentation von Erste-Hilfe-Leistungen ordnungsgemäß geführt?" },
            { id: "4.4", text: "Ist die erforderliche Anzahl an Ersthelfern anwesend?" },
            { id: "4.5", text: "Ist eine Notrufnummer ausgehängt?" },
            { id: "4.6", text: "Sind Erste-Hilfe-Anweisungen vorhanden?" }
        ]
    },

    {
        id: "elektrische_sicherheit",
        name: "Elektrische Sicherheit",
        items: [
            { id: "5.1", text: "Sind keine sichtbaren Beschädigungen an Schaltern und Steckdosen vorhanden?" },
            { id: "5.2", text: "Sind von der Decke geführte Leitungen ausreichend zugentlastet?" },
            { id: "5.3", text: "Sind Steckdosen und Kabel in einwandfreiem Zustand?" },
            { id: "5.4", text: "Liegen Steckverbindungen nicht ungeschützt auf dem Boden?" },
            { id: "5.5", text: "Sind provisorische Installationen vermieden?" }
        ]
    },

    {
        id: "lager",
        name: "Lager und Regale",
        items: [
            { id: "6.1", text: "Ist der elektrische Hubwagen geprüft und ordnungsgemäß?" },
            { id: "6.2", text: "Ist der Gabelhubwagen ohne sichtbare Beschädigungen?" },
            { id: "6.3", text: "Sind die Schwerlastregale geprüft?" },
            { id: "6.4", text: "Ist der Anfahrschutz vorhanden?" },
            { id: "6.5", text: "Ist die Traglastangabe vorhanden?" },
            { id: "6.6", text: "Befindet sich eine Absturzsicherung an der Rampe?" },
            { id: "6.7", text: "Ist die Absturzsicherung ordnungsgemäß gekennzeichnet?" },
            { id: "6.8", text: "Ist die Müll-/Papierpresse geprüft?" },
            { id: "6.9", text: "Ist die Müll-/Papierpresse in ordnungsgemäßem Zustand?" },
            { id: "6.10", text: "Sind die Verkehrswege sicher begehbar?" }
        ]
    },

    {
        id: "backstation",
        name: "Backstation",
        items: [
            { id: "7.1", text: "Sind die Arbeitsgeräte der Backstation in ordnungsgemäßem Zustand?" },
            { id: "7.2", text: "Ist das Handwaschbecken ohne Beschädigungen?" },
            { id: "7.3", text: "Sind Elektroleitungen intakt und keine Stolperstellen?" },
            { id: "7.4", text: "Entspricht die Zuleitung der VDE-Norm?" },
            { id: "7.5", text: "Sind alle Maschinen geprüft und dokumentiert?" },
            { id: "7.6", text: "Sind Schutzeinrichtungen vorhanden und funktionsfähig?" },
            { id: "7.7", text: "Sind Betriebsanweisungen ausgehängt?" },
            { id: "7.8", text: "Ist der Backhandschuh in ordnungsgemäßem Zustand?" },
            { id: "7.9", text: "Sind alle Heißgeräte technisch einwandfrei?" }
        ]
    },

    {
        id: "kassenzone",
        name: "Kassenzone",
        items: [
            { id: "8.1", text: "Ist der Fußraum frei von Gegenständen?" },
            { id: "8.2", text: "Ist der Fußboden im Kassenbereich unbeschädigt?" },
            { id: "8.3", text: "Sind Heizgeräte nicht durch brennbares Material zugestellt?" },
            { id: "8.4", text: "Sind die Kassenstühle funktionsfähig?" },
            { id: "8.5", text: "Ist das Transportband unbeschädigt?" },
            { id: "8.6", text: "Sind Einkaufskörbe ordnungsgemäß abgelegt?" }
        ]
    },

    {
        id: "notfallmanagement",
        name: "Notfallmanagement",
        items: [
            { id: "9.1", text: "Ist ein Notfallplan vorhanden?" },
            { id: "9.2", text: "Sind Verhalten bei Brand, Unfall und Evakuierung bekannt?" },
            { id: "9.3", text: "Sind Zuständigkeiten im Notfall geregelt?" },
            { id: "9.4", text: "Ist die Alarmierung geregelt?" }
        ]
    },

    {
        id: "dokumentation",
        name: "Dokumentation",
        items: [
            { id: "10.1", text: "Wird die Dokumentation von Erste-Hilfe-Leistungen ordnungsgemäß geführt?" },
            { id: "10.2", text: "Ist ein Sicherheitsbeauftragter bestellt?" },
            { id: "10.3", text: "Ist mindestens ein Brandschutzhelfer anwesend?" },
            { id: "10.4", text: "Erfolgte die letzte Unterweisung zum Umgang mit Zahlungsmitteln innerhalb der letzten 6 Monate?" },
            { id: "10.5", text: "Sind Unterweisungen dokumentiert?" },
            { id: "10.6", text: "Wurden aktuelle Änderungen berücksichtigt?" },
            { id: "10.7", text: "Ist die Gefährdungsbeurteilung aktuell?" }
        ]
    },

    {
        id: "psychische-belastung",
        name: "Psychische Belastung",
        items: [
            { id: "11.1", text: "Werden Wünsche der Beschäftigten bei der Arbeitsplanung berücksichtigt?" },
            { id: "11.2", text: "Ist die Pausenregelung umgesetzt?" },
            { id: "11.3", text: "Werden Überstunden gering gehalten?" },
            { id: "11.4", text: "Werden regelmäßige Teambesprechungen durchgeführt?" },
            { id: "11.5", text: "Werden neue Mitarbeiter eingearbeitet?" },
            { id: "11.6", text: "Ist eine Unterweisung zum Thema Brand- und Arbeitsschutz erfolgt?" },
            { id: "11.7", text: "Hängt ein sogenanntes schwarzes Brett im Sozialraum oder Kassenbüro?" },
            { id: "11.8", text: "Werden Entscheidungen transparent erläutert?" },
            { id: "11.9", text: "Gibt es positive Rückmeldungen bei guter Leistung?" },
            { id: "11.10", text: "Wird konstruktive Kritik geübt?" },
            { id: "11.11", text: "Gibt es einen Aushang zur Information über die Suchtprävention?" },
            { id: "11.12", text: "Ist ein betriebliches Wiedereingliederungsmanagement implementiert?" },
            { id: "11.13", text: "Wird Alleinarbeit vermieden?" },
            { id: "11.14", text: "Ist die Betreuung nach einem Überfall organisiert?" },
            { id: "11.15", text: "Werden Schulungen für den Umgang mit gewalttätigen Situationen ermöglicht?" },
            { id: "11.16", text: "Beziehen Sie Mitarbeiteranregungen in die Entscheidungsprozesse mit ein?" }
        ]
    }
];

// Prioritaeten für Massnahmen
const PRIORITIES = [
    { value: "hoch", label: "Hoch", color: "#dc2626" },
    { value: "mittel", label: "Mittel", color: "#f59e0b" },
    { value: "niedrig", label: "Niedrig", color: "#16a34a" }
];

// Status-Optionen
const STATUS_OPTIONS = [
    { value: "offen", label: "Offen" },
    { value: "in-bearbeitung", label: "In Bearbeitung" },
    { value: "erledigt", label: "Erledigt" }
];



