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
            { id: "1.6", text: "Werden für Tätigkeiten in der Höhe (z. B. in Lager oder Verkaufsraum) geeignete und geprüfte Aufstiegshilfen (z. B. Trittstufen, Rolltritte/Elefantenfüße) in ausreichender Zahl bereitgestellt und bestimmungsgemäß benutzt?" },
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
            { id: "2.2", text: "Sind die Feuerlöscheinrichtungen frei zugänglich und nicht durch Ware, Displays oder sonstige Gegenstände blockiert?" },
            { id: "2.3", text: "Sind die Prüfsiegel auf den Wandhydranten unbeschädigt?" },
            { id: "2.4", text: "Sind die Brandschutztüren frei von Zugestellungen und wird ihre Funktion nicht gestört?" },
            { id: "2.5", text: "Sind die Türhaltevorrichtungen und der Schließfolgeregler des Feuerschutzabschlusses in Ordnung?" },
            { id: "2.6", text: "Sind die Brandschutztüren ohne Beschädigungen?" },
            { id: "2.7", text: "Ist ein aktueller Flucht- und Rettungsplan vorhanden?" },
            { id: "2.8", text: "Ist die Notausgangsbeleuchtung ohne Defekte?" },
            { id: "2.9", text: "Sind alle Flucht- und Rettungswege sowie Notausgänge in ihrer gesamten Breite ständig freigehalten und im Außenbereich nicht durch Fahrzeuge oder Lagergut blockiert?" },
            { id: "2.10", text: "Sind alle Notausgänge und -ausstiege jederzeit ohne fremde Hilfsmittel von innen leicht zu öffnen und ist die Bedienbarkeit der Beschläge sichergestellt?" },
            { id: "2.11", text: "Führen die Notausgänge in sichere Bereiche?" },
            { id: "2.12", text: "Ist die Brandmeldeanlage funktionsfähig?" },
            { id: "2.13", text: "Wird die Einfüllöffnung des Presscontainers nach Ladenschluss bzw. Betriebsende konsequent mechanisch verschlossen und gegen unbefugte Nutzung gesichert?" },
            { id: "2.14", text: "Sind die Technik- und Heizräume frei von brennbaren Materialien (z. B. Kisten, Kartons)?" },
            { id: "2.15", text: "Sind die Technik- und Heizräume frei von Lagernutzung?" }
        ]
    },
    {
        id: "sozialräume",
        name: "Sozialräume",
        items: [
            { id: "3.1", text: "Hängen im Sozialbereich die aktuellen aushangpflichtigen Gesetze, Unfallverhütungsvorschriften sowie die Brandschutzordnung Teil A aus?" },
            { id: "3.2", text: "Sind die Kaffeemaschine und andere hitzeentwickelnde Geräte auf einer nicht brennbaren Unterlage abgestellt?" },
            { id: "3.3", text: "Werden ortsveränderliche elektrische Betriebsmittel (z. B. Leitungen, Steckverbindungen, Leuchten, Geräte) in angemessenen Zeitabständen geprüft?" },
            { id: "3.4", text: "Dient der Pausenraum primär der Erholung der Beschäftigten und ist er frei von größeren Mengen an betrieblichem Lagergut (z. B. Archivboxen)?" }
        ]
    },
    {
        id: "erstehilfe",
        name: "Erste Hilfe",
        items: [
            { id: "4.1", text: "Erfüllen die Standorte der Erste-Hilfe-Koffer die Anforderungen an Sichtbarkeit, Erreichbarkeit und Norm-Kennzeichnung gemäß DGUV?" },
            { id: "4.2", text: "Ist das Erste-Hilfe-Material an allen Standorten in vollständigem Zustand und ist das Verfallsdatum der sterilen Inhalte noch nicht überschritten?" },
            { id: "4.3", text: "Wird die Dokumentation von Erste-Hilfe-Leistungen ordnungsgemäß geführt?" },
            { id: "4.4", text: "Ist während der gesamten Öffnungszeit die erforderliche Anzahl an ausgebildeten Ersthelfern gemäß DGUV Vorschrift 1 anwesend?" },
            { id: "4.5", text: "Ist eine Notrufnummer ausgehängt?" },
            { id: "4.6", text: "Sind Erste-Hilfe-Anweisungen vorhanden?" }
        ]
    },
    {
        id: "elektrisch",
        name: "Elektrische Sicherheit",
        items: [
            { id: "5.1", text: "Sind zur Zeit der Begehung keine sichtbaren Beschädigungen an Schaltern und Steckdosen vorhanden?" },
            { id: "5.2", text: "Sind von der Decke geführte Leitungen und Steckverbindungen durch geeignete mechanische Zugentlastungen (z. B. Stahlseile, Ketten oder spezielle Klemmvorrichtungen) so gesichert, dass keine Zugkräfte auf die elektrischen Kontaktstellen wirken?" },
            { id: "5.3", text: "Sind Steckdosen und Kabel in einwandfreiem Zustand?" },
            { id: "5.4", text: "Elektrische Steckverbindungen liegen nicht ungeschützt auf dem Boden, insbesondere in Bereichen (z. B. unter Kühl- oder Tiefkühltruhen)?" },
            { id: "5.5", text: "Sind provisorische Installationen vermieden?" }
        ]
    },
    {
        id: "co2-kuehleinrichtungen",
        name: "CO2 Kühleinrichtungen",
        items: [
            { id: "6.1", text: "Wurden Personen, die sich im Bereich von Kühlanlagen oder Kühlhäusern aufhalten, unterwiesen?" },
            { id: "6.2", text: "Ist die Notentriegelung vorhanden und in Ordnung?" },
            { id: "6.3", text: "Sind die Sensoren nicht mit Material oder sonstigen Gegenständen verstellt?" },
            { id: "6.4", text: "Funktioniert die Beleuchtung einwandfrei?" },
            { id: "6.5", text: "Sind alle Sicherheitsvorrichtungen (Alarmleuchten, Kennzeichnungen, Kühlhaustüren) intakt?" }
        ]
    },
    {
        id: "kühlhaus",
        name: "Kühlhaus",
        items: [
            { id: "7.1", text: "Ist an allen Beleuchtungen in den Kühlhäusern die Überwurfkappe (Schutzkappe/Schutzglas) montiert?" },
            { id: "7.2", text: "Ist die Notentriegelung vorhanden und in Ordnung?" },
            { id: "7.3", text: "Sind die Kühlhaustüren von innen mit dem Rettungswegschild ISO 7010 gekennzeichnet?" },
            { id: "7.4", text: "Funktioniert die Beleuchtung einwandfrei?" },
            { id: "7.5", text: "Ist die Notruf-Funktion (wenn vorhanden) in Ordnung und ohne Beschädigungen?" }
        ]
    },
    {
        id: "lager",
        name: "Lager und Regale",
        items: [
            { id: "8.1", text: "Ist der elektrische Hubwagen geprüft und in einem ordnungsgemäßen Zustand (keine sichtbaren Beschädigungen, funktionsfähige Schutzeinrichtungen)?" },
            { id: "8.2", text: "Ist der Gabelhubwagen in einem ordnungsgemäßen Zustand ohne sichtbare Beschädigungen?" },
            { id: "8.3", text: "Sind die Schwerlastregale geprüft?" },
            { id: "8.4", text: "Ist der Anfahrschutz vorhanden?" },
            { id: "8.5", text: "Ist die Traglastangabe an den Schwerlastregalen vorhanden?" },
            { id: "8.6", text: "Befindet sich eine Absturzsicherung an der Rampe?" },
            { id: "8.7", text: "Ist die Absturzsicherung in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen und mit Kennzeichnung)?" },
            { id: "8.8", text: "Ist die Müll-/Papierpresse geprüft?" },
            { id: "8.9", text: "Ist die Müll-/Papierpresse in einem ordnungsgemäßen Zustand (keine sichtbaren Beschädigungen, intakte Schutzeinrichtungen, fester Stand)?" },
            { id: "8.10", text: "Sind die Verkehrswege so beschaffen, dass kein Risiko zum Stolpern, Ausrutschen oder Umknicken besteht?" }
        ]
    },
    {
        id: "leergut",
        name: "Leergut",
        items: [
            { id: "9.1", text: "Sind die Annahmegeräte unbeschädigt und funktionsfähig?" },
            { id: "9.2", text: "Werden Rollbahnen nicht betreten?" },
            { id: "9.3", text: "Sind beschädigte Paletten/Kisten aussortiert?" },
            { id: "9.4", text: "Werden Lasten sicher aufgenommen und transportiert?" },
            { id: "9.5", text: "Wird die PSA zur Verfügung gestellt und getragen?" },
            { id: "9.6", text: "Werden Abfälle und Bruchmaterial ordnungsgemäß entsorgt?" },
            { id: "9.7", text: "Werden Stapelhöhen eingehalten?" },
            { id: "9.8", text: "Ist die Lagerfläche sauber und rutschfrei?" }
        ]
    },
    {
        id: "praktikanten",
        name: "Praktikanten",
        items: [
            { id: "10.1", text: "Wurde die Unterweisung von Praktikanten und Schüleraushilfen durchgeführt?" },
            { id: "10.2", text: "Wurde die Unterweisung schriftlich dokumentiert?" },
            { id: "10.3", text: "Haben die Personen die Inhalte der Unterweisung verstanden?" }
        ]
    },
    {
        id: "arbeitsmedizin",
        name: "Arbeitsmedizin",
        items: [
            { id: "11.1", text: "Wird den Beschäftigten arbeitsmedizinische Vorsorge angeboten?" },
            { id: "11.2", text: "Erfolgte im laufenden Berichtszeitraum eine arbeitsmedizinische Betreuung (z. B. Begehung oder Sprechstunde) bzw. ist diese für das aktuelle Kalenderjahr fest eingeplant?" },
            { id: "11.3", text: "Erfolgten arbeitsmedizinische Beratungen für Beschäftigte oder Führungskräfte?" },
            { id: "11.4", text: "Sind Maßnahmen gegen Hauterkrankungen getroffen?" },
            { id: "11.5", text: "Werden Berichte und Empfehlungen des Betriebsarztes dokumentiert und umgesetzt?" },
            { id: "11.6", text: "Sind sanitäre Anlagen und Pausenräume sauber, funktionsfähig und ausreichend mit Hygieneartikeln bestückt?" }
        ]
    },
    {
        id: "backstation",
        name: "Backstation",
        items: [
            { id: "12.1", text: "Sind die Arbeitsgeräte an der Backstation (Backofen, Backbleche, Brotschneidemaschine) in einem ordnungsgemäßen Zustand?" },
            { id: "12.2", text: "Ist das freistehende Handwaschbecken ohne Beschädigungen?" },
            { id: "12.3", text: "Sind die Elektroleitungen intakt und bilden keine Stolperstellen?" },
            { id: "12.4", text: "Entspricht die Zuleitung der VDE-Norm?" },
            { id: "12.5", text: "Sind alle Maschinen geprüft und dokumentiert?" },
            { id: "12.6", text: "Sind Schutzeinrichtungen vorhanden und funktionsfähig?" },
            { id: "12.7", text: "Sind Betriebsanweisungen ausgehaengt?" },
            { id: "12.8", text: "Ist der Backhandschuh für die Backstation in einem ordnungsgemäßen Zustand (kein Verschleiß) und besitzt eine lange Stulpe?" },
            { id: "12.9", text: "Sind alle Heißgeräte (z. B. Heißtheken, Fritteusen) in technisch einwandfreiem Zustand?" }
        ]
    },
    {
        id: "serviceabteilung",
        name: "Serviceabteilung",
        items: [
            { id: "13.1", text: "Hängt an den Waschplätzen ein aktueller, auf die Gefährdungsbeurteilung abgestimmter Hautschutzplan gut sichtbar aus?" },
            { id: "13.2", text: "Werden Hautschutz- und Hautpflegeprodukte zur Verfügung gestellt?" },
            { id: "13.3", text: "Sind die Arbeitsgeräte im Servicebereich in einem ordnungsgemäßen Zustand?" },
            { id: "13.4", text: "Bleiben die aufklappbaren Thekenscheiben in der oberen Stellung sicher und selbstständig stehen?" },
            { id: "13.5", text: "Sind die Glastüren und Glaswände in Augenhöhe gekennzeichnet?" },
            { id: "13.6", text: "Werden Schneidbretter und Messer regelmäßig gereinigt und farbcodiert verwendet?" },
            { id: "13.7", text: "Werden Schneidbretter mit Messereinschub verwendet?" },
            { id: "13.8", text: "Werden Messerhalter verwendet?" },
            { id: "13.9", text: "Sind die Convenience-Geräte in einem ordnungsgemäßen Zustand?" },
            { id: "13.10", text: "Ist die Beleuchtung ausreichend im Servicebereich?" }
        ]
    },
    {
        id: "kassenzone",
        name: "Kassenzone",
        items: [
            { id: "14.1", text: "Ist der Fußraum frei von Gegenständen?" },
            { id: "14.2", text: "Ist der Fußboden im Kassenbereich in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen)?" },
            { id: "14.3", text: "Sind die serienmäßig eingebauten Heizgeräte im Kassenraum nicht durch brennbares Material zugestellt?" },
            { id: "14.4", text: "Sind die Kassenstühle in einem funktionsfähigen Zustand?" },
            { id: "14.5", text: "Ist das Transportband unbeschädigt und weist keine Lücke von über 5 mm auf?" },
            { id: "14.6", text: "Sind die Einkaufskörbe ordnungsgemäß im vorgesehenen Ständer abgelegt und ragen nicht in den Verkehrsweg hinein, sodass keine Stolpergefahr besteht?" }
        ]
    },
    {
        id: "gefahrstoffe",
        name: "Gefahrstoffe",
        items: [
            { id: "15.1", text: "Werden Gefahrstoffe unter strikter Beachtung der Zusammenlagerungsverbote nach TRGS 510 (Abschnitt 7 und Anlage 2) so gelagert, dass gefährliche Wechselwirkungen zwischen verschiedenen Stoffgruppen ausgeschlossen sind?" },
            { id: "15.2", text: "Wird die passende persönliche Schutzausrüstung (z. B. Schutzbrille, Handschuhe) für Tätigkeiten mit Gefahrstoffen zur Verfügung gestellt?" },
            { id: "15.3", text: "Ist die in den Betriebsanweisungen geforderte Persönliche Schutzausrüstung in unmittelbarer Nähe und einsatzbereit vorhanden?" },
            { id: "15.4", text: "Sind Sicherheitsdatenblätter verfügbar?" },
            { id: "15.5", text: "Sind Mitarbeiter unterwiesen?" }
        ]
    },
    {
        id: "marktleiterbüro",
        name: "Marktleiterbüro",
        items: [
            { id: "16.1", text: "Liegt eine aktuelle Liste sowie Prüfberichte prüfungsbedürftiger Einrichtungen vor?" },
            { id: "16.2", text: "Sind Maßnahmen getroffen, die den Anreiz zu Raubüberfällen vermindern (z. B. Türspion, feststehender Knauf)?" },
            { id: "16.3", text: "Ist die Tür während des Umgangs mit Zahlungsmitteln verschlossen?" },
            { id: "16.4", text: "Werden neue Mitarbeiter vor Aufnahme der Tätigkeit zum Thema Arbeitssicherheit und Brandschutz unterwiesen?" }
        ]
    },
    {
        id: "barrierefreies-wc",
        name: "Barrierefreies WC",
        items: [
            { id: "17.1", text: "Hängt die Notrufschnur (Zugschnur) bis maximal 10 cm über dem Fußboden herab, um nach einem Sturz erreichbar zu sein?" },
            { id: "17.2", text: "Wird der Alarm an eine ständig besetzte Stelle (z. B. Empfang, Leitwarte) weitergeleitet?" },
            { id: "17.3", text: "Werden die Zugschnüre und Signalgeber in regelmäßigen Intervallen (z. B. monatlich) auf Funktion geprüft?" },
            { id: "17.4", text: "Sind die Beschäftigten über das Verhalten bei einem Alarm unterwiesen?" },
            { id: "17.5", text: "Ist sichergestellt, dass die Tür im Notfall von außen entriegelt werden kann (Notentriegelung)?" }
        ]
    },
    {
        id: "notfall",
        name: "Notfallmanagement",
        items: [
            { id: "18.1", text: "Ist ein Notfallplan vorhanden?" },
            { id: "18.2", text: "Sind Verhalten bei Brand, Unfall und Evakuierung bekannt?" },
            { id: "18.3", text: "Sind Zuständigkeiten im Notfall geregelt?" },
            { id: "18.4", text: "Ist die Alarmierung geregelt?" }
        ]
    },
    {
        id: "dokumentation",
        name: "Dokumentation",
        items: [
            { id: "19.1", text: "Wird die Dokumentation von Erste-Hilfe-Leistungen ordnungsgemäß geführt und aufbewahrt?" },
            { id: "19.2", text: "Ist ein Sicherheitsbeauftragter ausgebildet und bestellt?" },
            { id: "19.3", text: "Ist während der gesamten Ladenöffnungszeit mindestens ein Mitarbeiter mit der Qualifikation als Brandschutzhelfer anwesend?" },
            { id: "19.4", text: "Erfolgte die letzte Unterweisung zum Umgang mit Zahlungsmitteln innerhalb der letzten 6 Monate?" },
            { id: "19.5", text: "Sind Unterweisungen dokumentiert?" },
            { id: "19.6", text: "Wurden bei der Unterweisung aktuelle Änderungen in den betrieblichen Abläufen oder neue Sicherheitstechniken berücksichtigt?" },
            { id: "19.7", text: "Wurde die Gefährdungsbeurteilung (GBO) erstellt und ist sie auf dem aktuellen Stand?" }
        ]
    },
    {
        id: "psychische-belastung",
        name: "Psychische Belastung",
        items: [
            { id: "20.1", text: "Werden Wünsche der Beschäftigten bei der Arbeitsplanung berücksichtigt?" },
            { id: "20.2", text: "Ist die Pausenregelung umgesetzt?" },
            { id: "20.3", text: "Werden Überstunden gering gehalten?" },
            { id: "20.4", text: "Werden regelmäßige Teambesprechungen durchgeführt?" },
            { id: "20.5", text: "Werden neue Mitarbeiter eingearbeitet?" },
            { id: "20.6", text: "Ist eine Unterweisung zum Thema Brand- und Arbeitsschutz erfolgt?" },
            { id: "20.7", text: "Hängt ein sogenanntes schwarzes Brett im Sozialraum oder Kassenbüro?" },
            { id: "20.8", text: "Werden Entscheidungen transparent erläutert?" },
            { id: "20.9", text: "Gibt es positive Rückmeldungen bei guter Leistung?" },
            { id: "20.10", text: "Wird konstruktive Kritik geübt?" },
            { id: "20.11", text: "Gibt es einen Aushang zur Information über die Suchtprävention?" },
            { id: "20.12", text: "Ist ein betriebliches Wiedereingliederungsmanagement implementiert?" },
            { id: "20.13", text: "Wird Alleinarbeit vermieden?" },
            { id: "20.14", text: "Ist die Betreuung nach einem Überfall organisiert?" },
            { id: "20.15", text: "Werden Schulungen für den Umgang mit gewalttätigen Situationen ermöglicht?" },
            { id: "20.16", text: "Beziehen Sie Mitarbeiteranregungen in die Entscheidungsprozesse mit ein?" }
        ]
    }
];