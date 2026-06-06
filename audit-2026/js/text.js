// ===== Vordefinierte Maßnahmen-Texte je Prüfpunkt =====
// Wird als globale Variable bereitgestellt, damit klassische Scripts
// (app.js) ohne Modul-Import darauf zugreifen können.
const MEASURES_TEXT = {

    Gesamtmarkt: {
        "1.1": "Es ist sicherzustellen, dass alle Mitarbeitenden geeignetes Sicherheitsschuhwerk gemäß Gefährdungsbeurteilung tragen. Kontrollen sind regelmäßig durchzuführen und bei Bedarf Ersatzschuhe bereitzustellen.",
        "1.2": "Die Betriebsanweisung für Flurförderfahrzeuge ist regelmäßig zu unterweisen und die Einhaltung (PSA, Traglasten, Personenmitnahmeverbot) durch Stichproben zu kontrollieren.",
        "1.3": "Automatiktüren, Schnelllauftore und Rolltore sind durch eine befähigte Person prüfen zu lassen. Festgestellte Mängel sind unverzüglich zu beheben.",
        "1.4": "Die Aufzugsanlage ist durch eine zugelassene Prüfstelle regelmäßig zu prüfen. Beschädigungen oder Funktionsstörungen sind sofort zu melden und zu beseitigen.",
        "1.5": "Die Leergutrücknahme ist regelmäßig auf Sauberkeit und Sicherheit zu kontrollieren. Glasscherben sind sofort zu entfernen und Schutzeinrichtungen instand zu halten.",
        "1.6": "Geeignete und geprüfte Aufstiegshilfen sind bereitzustellen und deren bestimmungsgemäße Nutzung durch Unterweisung sicherzustellen.",
        "1.7": "Leitern sind gemäß DGUV Information 208-016 regelmäßig zu prüfen und beschädigte Leitern sofort aus dem Verkehr zu ziehen.",
        "1.8": "Es dürfen ausschließlich geprüfte Sicherheitsmesser verwendet werden. Mitarbeitende sind entsprechend zu unterweisen.",
        "1.9": "Verkehrswege sind regelmäßig zu kontrollieren und frei von Stolper- und Rutschgefahren zu halten.",
        "1.10": "Treppen sind regelmäßig auf Schäden zu prüfen und frei von Gegenständen zu halten.",
        "1.11": "Betriebsanweisungen sind gut sichtbar auszuhängen und deren Einhaltung regelmäßig zu kontrollieren.",
        "1.12": "Die Beleuchtung ist gemäß ASR A3.4 zu prüfen und bei Unterschreitung der Lichtstärke instand zu setzen oder zu ergänzen."
    },

    Brandschutz: {
        "2.1": "Feuerlöscheinrichtungen sind regelmäßig durch Fachfirmen zu prüfen und Prüffristen strikt einzuhalten.",
        "2.2": "Feuerlöscher sind jederzeit frei zugänglich zu halten und dürfen nicht verstellt werden.",
        "2.3": "Wandhydranten sind regelmäßig auf unbeschädigte Prüfsiegel und Funktionsfähigkeit zu kontrollieren.",
        "2.4": "Brandschutztüren sind stets frei von Zugestellungen zu halten.",
        "2.5": "Türhaltevorrichtungen und Schließfolgeregler sind regelmäßig zu prüfen und instand zu halten.",
        "2.6": "Beschädigte Brandschutztüren sind unverzüglich instand zu setzen oder zu ersetzen.",
        "2.7": "Ein aktueller Flucht- und Rettungsplan ist gut sichtbar auszuhängen und bei Änderungen zu aktualisieren.",
        "2.8": "Die Notausgangsbeleuchtung ist regelmäßig zu prüfen und defekte Leuchten sind sofort zu ersetzen.",
        "2.9": "Flucht- und Rettungswege sind jederzeit freizuhalten und regelmäßig zu kontrollieren.",
        "2.10": "Notausgänge müssen jederzeit leicht und ohne Hilfsmittel zu öffnen sein.",
        "2.11": "Es ist sicherzustellen, dass alle Notausgänge in sichere Bereiche führen und nicht blockiert sind.",
        "2.12": "Die Brandmeldeanlage ist regelmäßig zu warten und auf Funktionsfähigkeit zu prüfen.",
        "2.13": "Die Einfüllöffnung des Presscontainers ist nach Betriebsschluss konsequent zu verschließen.",
        "2.14": "Technik- und Heizräume sind konsequent frei von brennbaren Materialien zu halten.",
        "2.15": "Technik- und Heizräume dürfen nicht als Lagerflächen genutzt werden."
    },

    Sozialraeume: {
        "3.1": "Aushangpflichtige Gesetze und Vorschriften sind aktuell zu halten und gut sichtbar auszuhängen.",
        "3.2": "Hitzeentwickelnde Geräte sind auf nicht brennbaren Unterlagen zu betreiben.",
        "3.3": "Ortsveränderliche elektrische Betriebsmittel sind regelmäßig nach DGUV V3 zu prüfen.",
        "3.4": "Der Pausenraum ist ausschließlich zur Erholung der Beschäftigten zu nutzen und entsprechend freizuhalten."
    },

    "Erste Hilfe": {
        "4.1": "Erste-Hilfe-Koffer sind an geeigneten, gut erreichbaren Standorten zu platzieren.",
        "4.2": "Erste-Hilfe-Material ist regelmäßig zu prüfen und abgelaufene Materialien sind zu ersetzen.",
        "4.3": "Erste-Hilfe-Leistungen sind vollständig und ordnungsgemäß zu dokumentieren.",
        "4.4": "Die gesetzlich vorgeschriebene Anzahl an Ersthelfern ist jederzeit sicherzustellen.",
        "4.5": "Notrufnummern sind gut sichtbar auszuhängen.",
        "4.6": "Erste-Hilfe-Anweisungen sind aktuell zu halten und gut sichtbar bereitzustellen."
    },

    "Elektrische Sicherheit": {
        "5.1": "Schalter und Steckdosen sind regelmäßig auf Beschädigungen zu prüfen und defekte Teile zu ersetzen.",
        "5.2": "Deckenleitungen sind fachgerecht zu befestigen und zugentlastet zu führen.",
        "5.3": "Steckdosen und Kabel sind in einwandfreiem Zustand zu halten und regelmäßig zu prüfen.",
        "5.4": "Steckverbindungen dürfen nicht ungeschützt auf dem Boden liegen.",
        "5.5": "Provisorische Elektroinstallationen sind zu vermeiden bzw. fachgerecht zu beseitigen."
    },

    Lager: {
        "6.1": "Elektrische Hubwagen sind regelmäßig zu prüfen und nur in einwandfreiem Zustand zu betreiben.",
        "6.2": "Gabelhubwagen sind regelmäßig auf Schäden zu kontrollieren.",
        "6.3": "Schwerlastregale sind gemäß Vorgaben regelmäßig zu prüfen.",
        "6.4": "Anfahrschutz ist an allen relevanten Stellen vorzuhalten und instand zu halten.",
        "6.5": "Traglastangaben sind gut sichtbar anzubringen.",
        "6.6": "Absturzsicherungen an Rampen sind verpflichtend vorzuhalten.",
        "6.7": "Absturzsicherungen sind eindeutig zu kennzeichnen und funktionsfähig zu halten.",
        "6.8": "Müll-/Papierpressen sind regelmäßig zu prüfen.",
        "6.9": "Müll-/Papierpressen sind in technisch einwandfreiem Zustand zu halten.",
        "6.10": "Verkehrswege im Lager sind frei und sicher begehbar zu halten."
    },

    Backstation: {
        "7.1": "Arbeitsgeräte der Backstation sind regelmäßig zu prüfen und instand zu halten.",
        "7.2": "Handwaschbecken sind in hygienisch und technisch einwandfreiem Zustand zu halten.",
        "7.3": "Elektroleitungen sind regelmäßig auf Schäden zu prüfen und Stolperstellen zu vermeiden.",
        "7.4": "Zuleitungen müssen der geltenden VDE-Norm entsprechen.",
        "7.5": "Alle Maschinen sind regelmäßig zu prüfen und zu dokumentieren.",
        "7.6": "Schutzeinrichtungen sind zu installieren und funktionsfähig zu halten.",
        "7.7": "Betriebsanweisungen sind gut sichtbar auszuhängen.",
        "7.8": "Backhandschuhe sind regelmäßig auf Zustand und Eignung zu prüfen.",
        "7.9": "Heißgeräte sind regelmäßig technisch zu warten."
    },

    Kassenzone: {
        "8.1": "Der Fußraum ist frei von Gegenständen zu halten.",
        "8.2": "Der Boden im Kassenbereich ist instand zu halten und frei von Schäden.",
        "8.3": "Heizgeräte sind frei von brennbaren Materialien zu halten.",
        "8.4": "Kassenstühle sind regelmäßig auf Funktionsfähigkeit zu prüfen.",
        "8.5": "Transportbänder sind regelmäßig zu warten und Schäden zu beheben.",
        "8.6": "Einkaufskörbe sind geordnet zu lagern."
    },

    Notfallmanagement: {
        "9.1": "Ein aktueller Notfallplan ist zu erstellen und auszuhängen.",
        "9.2": "Mitarbeitende sind regelmäßig zum Verhalten bei Notfällen zu unterweisen.",
        "9.3": "Zuständigkeiten im Notfall sind klar zu definieren und zu kommunizieren.",
        "9.4": "Alarmierungswege sind eindeutig festzulegen und zu testen."
    },

    Dokumentation: {
        "10.1": "Erste-Hilfe-Dokumentation ist vollständig und korrekt zu führen.",
        "10.2": "Ein Sicherheitsbeauftragter ist schriftlich zu bestellen.",
        "10.3": "Mindestens ein Brandschutzhelfer muss jederzeit verfügbar sein.",
        "10.4": "Unterweisungen zum Umgang mit Zahlungsmitteln sind regelmäßig zu aktualisieren.",
        "10.5": "Alle Unterweisungen sind vollständig zu dokumentieren.",
        "10.6": "Aktuelle Änderungen sind zeitnah in alle Dokumente einzuarbeiten.",
        "10.7": "Die Gefährdungsbeurteilung ist regelmäßig zu aktualisieren."
    },

    Psychische_belastung: {
        "11.1": "Arbeitsplanung ist unter Berücksichtigung der Mitarbeiterwünsche zu gestalten.",
        "11.2": "Pausenregelungen sind konsequent umzusetzen.",
        "11.3": "Überstunden sind auf ein Minimum zu reduzieren.",
        "11.4": "Regelmäßige Teambesprechungen sind durchzuführen.",
        "11.5": "Neue Mitarbeitende sind strukturiert einzuarbeiten.",
        "11.6": "Unterweisungen zu Brand- und Arbeitsschutz sind regelmäßig durchzuführen.",
        "11.7": "Ein schwarzes Brett ist gut sichtbar bereitzustellen.",
        "11.8": "Entscheidungen sind transparent zu kommunizieren.",
        "11.9": "Positive Rückmeldungen sind regelmäßig zu geben.",
        "11.10": "Konstruktive Kritik ist sachlich und regelmäßig zu üben.",
        "11.11": "Informationen zur Suchtprävention sind auszuhängen.",
        "11.12": "Ein betriebliches Wiedereingliederungsmanagement ist zu implementieren.",
        "11.13": "Alleinarbeit ist möglichst zu vermeiden.",
        "11.14": "Eine Betreuung nach Überfällen ist organisatorisch sicherzustellen.",
        "11.15": "Schulungen zum Umgang mit Gewalt sind anzubieten.",
        "11.16": "Mitarbeiteranregungen sind aktiv in Entscheidungen einzubeziehen."
    },

    default: "Geeignete Maßnahmen zur Mängelbeseitigung festlegen und dokumentieren."
};

// Flache Zuordnung: Prüfpunkt-ID -> Maßnahmen-Text (über alle Kategorien hinweg).
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

// Helfer: liefert den vordefinierten Maßnahmen-Text zu einer Prüfpunkt-ID.
function getMeasureText(itemId) {
    return MEASURES_BY_ID[itemId] || MEASURES_TEXT.default;
}
