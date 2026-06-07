// ===== Vordefinierte Maßnahmen-Texte je Prüfpunkt =====
// Wird als globale Variable bereitgestellt, damit klassische Scripts
// (app.js) ohne Modul-Import darauf zugreifen können.

// ===== Vordefinierte Maßnahmen-Texte je Prüfpunkt =====

const MEASURES_TEXT = {

    Gesamtmarkt: {
        "1.1": "Gemäß Gefährdungsbeurteilung und DGUV Vorschrift 1 ist sicherzustellen, dass alle Beschäftigten geeignetes, festes, geschlossenes und rutschhemmendes Schuhwerk tragen. Die Einhaltung ist regelmäßig zu kontrollieren.",

        "1.2": "Beschäftigte sind regelmäßig anhand der Betriebsanweisung zum sicheren Umgang mit Flurförderfahrzeugen zu unterweisen. PSA-Pflicht, Traglastbegrenzungen und das Verbot der Personenmitnahme sind konsequent einzuhalten.",

        "1.3": "Automatiktüren, Schnelllauftore und Rolltore sind gemäß ASR A1.7 sowie BetrSichV regelmäßig durch befähigte Personen zu prüfen. Mängel sind unverzüglich zu beseitigen.",

        "1.4": "Aufzugsanlagen sind gemäß BetrSichV wiederkehrend durch zugelassene Überwachungsstellen zu prüfen und in sicherem Zustand zu halten.",

        "1.5": "Die Leergutrücknahme ist regelmäßig auf Beschädigungen, Glasscherben und funktionierende Schutzeinrichtungen zu kontrollieren.",

        "1.6": "Geeignete und geprüfte Aufstiegshilfen sind bereitzustellen. Die Nutzung hat gemäß DGUV Information 208-016 zu erfolgen.",

        "1.7": "Leitern und Tritte sind regelmäßig durch befähigte Personen zu prüfen. Beschädigte Leitern sind sofort auszusondern.",

        "1.8": "Es dürfen ausschließlich geeignete Sicherheitsmesser aus dem freigegebenen Ordersatz verwendet werden.",

        "1.9": "Verkehrswege sind gemäß ASR A1.5 frei von Stolper-, Rutsch- und Sturzgefahren zu halten.",

        "1.10": "Treppen sind frei von Gegenständen zu halten und regelmäßig auf Schäden zu kontrollieren.",

        "1.11": "Betriebsanweisungen sind aktuell, zugänglich und für Beschäftigte verständlich bereitzustellen.",

        "1.12": "Die Beleuchtung ist gemäß ASR A3.4 sicherzustellen. Gefahrenstellen und Leckagen müssen jederzeit eindeutig erkennbar sein."
    },

    Brandschutz: {
        "2.1": "Feuerlöscheinrichtungen sind gemäß ASR A2.2 regelmäßig durch sachkundige Personen zu prüfen.",

        "2.2": "Feuerlöscher und Wandhydranten sind jederzeit frei zugänglich zu halten.",

        "2.3": "Prüfsiegel der Wandhydranten sind regelmäßig auf Unversehrtheit zu kontrollieren.",

        "2.4": "Brandschutztüren dürfen nicht verstellt oder blockiert werden.",

        "2.5": "Türhaltevorrichtungen und Schließfolgeregler sind regelmäßig auf Funktion zu prüfen.",

        "2.6": "Beschädigte Brandschutztüren sind unverzüglich instand zu setzen.",

        "2.7": "Ein aktueller Flucht- und Rettungsplan ist gut sichtbar auszuhängen.",

        "2.8": "Die Sicherheits- und Notbeleuchtung ist regelmäßig zu prüfen.",

        "2.9": "Flucht- und Rettungswege sind jederzeit vollständig freizuhalten.",

        "2.10": "Notausgänge müssen jederzeit ohne Hilfsmittel leicht zu öffnen sein.",

        "2.11": "Notausgänge müssen in sichere Bereiche führen.",

        "2.12": "Die Brandmeldeanlage ist regelmäßig zu warten und auf Funktion zu prüfen.",

        "2.13": "Die Einfüllöffnung des Presscontainers ist nach Betriebsschluss mechanisch zu sichern.",

        "2.14": "Technik- und Heizräume sind frei von brennbaren Materialien zu halten.",

        "2.15": "Technik- und Heizräume dürfen nicht als Lagerfläche genutzt werden."
    },

    Sozialräume: {
        "3.1": "Aushangpflichtige Gesetze und Vorschriften sind aktuell und gut sichtbar auszuhängen.",

        "3.2": "Hitzeentwickelnde Geräte sind ausschließlich auf nicht brennbaren Unterlagen zu betreiben.",

        "3.3": "Ortsveränderliche elektrische Betriebsmittel sind regelmäßig gemäß DGUV Vorschrift 3 zu prüfen.",

        "3.4": "Pausenräume sind frei von betrieblichem Lagergut zu halten."
    },

    "Erste Hilfe": {
        "4.1": "Erste-Hilfe-Koffer sind sichtbar gekennzeichnet und leicht erreichbar bereitzuhalten.",

        "4.2": "Erste-Hilfe-Materialien sind regelmäßig auf Vollständigkeit und Haltbarkeit zu prüfen.",

        "4.3": "Erste-Hilfe-Leistungen sind gemäß DGUV Vorschrift 1 vollständig zu dokumentieren.",

        "4.4": "Die erforderliche Anzahl an Ersthelfern ist während der gesamten Betriebszeit sicherzustellen.",

        "4.5": "Notrufnummern sind gut sichtbar auszuhängen.",

        "4.6": "Erste-Hilfe-Anweisungen sind aktuell bereitzustellen."
    },

    "Elektrische Sicherheit": {
        "5.1": "Beschädigte Schalter und Steckdosen sind unverzüglich instand zu setzen.",

        "5.2": "Leitungen und Steckverbindungen sind fachgerecht zugentlastet zu befestigen.",

        "5.3": "Steckdosen und Kabel sind regelmäßig auf Schäden zu prüfen.",

        "5.4": "Elektrische Steckverbindungen dürfen nicht ungeschützt auf dem Boden liegen.",

        "5.5": "Provisorische Elektroinstallationen sind unverzüglich fachgerecht zu beseitigen."
    },

    "CO2 Kühleinrichtungen": {
        "6.1": "Beschäftigte sind regelmäßig über Gefahren durch CO2-Kühlanlagen zu unterweisen.",

        "6.2": "Notentriegelungen sind regelmäßig auf Funktion zu prüfen.",

        "6.3": "Sensoren dürfen nicht verstellt oder verdeckt werden.",

        "6.4": "Die Beleuchtung ist funktionsfähig zu halten.",

        "6.5": "Sicherheitsvorrichtungen sind regelmäßig auf Funktion zu prüfen."
    },

    Kühlhaus: {
        "7.1": "Beleuchtungen in Kühlhäusern sind mit geeigneten Schutzkappen zu versehen.",

        "7.2": "Die Notentriegelung ist regelmäßig zu prüfen.",

        "7.3": "Kühlhaustüren sind gemäß ISO 7010 als Rettungsweg zu kennzeichnen.",

        "7.4": "Die Beleuchtung ist funktionsfähig zu halten.",

        "7.5": "Vorhandene Notrufsysteme sind regelmäßig auf Funktion zu prüfen."
    },

    "Lager und Regale": {
        "8.1": "Elektrische Hubwagen sind regelmäßig gemäß BetrSichV zu prüfen.",

        "8.2": "Gabelhubwagen sind regelmäßig auf Beschädigungen zu kontrollieren.",

        "8.3": "Schwerlastregale sind regelmäßig durch befähigte Personen zu prüfen.",

        "8.4": "Anfahrschutz ist an gefährdeten Stellen vorzuhalten.",

        "8.5": "Traglastangaben sind gut sichtbar anzubringen.",

        "8.6": "Absturzsicherungen an Rampen sind bereitzustellen.",

        "8.7": "Absturzsicherungen sind regelmäßig auf Schäden zu prüfen.",

        "8.8": "Müll- und Papierpressen sind regelmäßig zu prüfen.",

        "8.9": "Müll- und Papierpressen sind in sicherem Zustand zu halten.",

        "8.10": "Verkehrswege im Lager sind sicher und frei begehbar zu halten."
    },

    Leergut: {
        "9.1": "Leergutannahmegeräte sind regelmäßig auf Beschädigungen und Funktion zu prüfen.",

        "9.2": "Rollbahnen dürfen aus Sicherheitsgründen nicht betreten werden.",

        "9.3": "Beschädigte Paletten und Kisten sind unverzüglich auszusortieren.",

        "9.4": "Lasten sind ergonomisch und sicher zu transportieren.",

        "9.5": "Persönliche Schutzausrüstung ist bereitzustellen und zu tragen.",

        "9.6": "Bruchmaterialien und Abfälle sind ordnungsgemäß zu entsorgen.",

        "9.7": "Maximale Stapelhöhen sind einzuhalten.",

        "9.8": "Lagerflächen sind sauber und rutschfrei zu halten."
    },


    Arbeitsmedizin: {
        "11.1": "Arbeitsmedizinische Vorsorge ist gemäß ArbMedVV anzubieten.",

        "11.2": "Eine regelmäßige arbeitsmedizinische Betreuung ist sicherzustellen.",

        "11.3": "Arbeitsmedizinische Beratungen sind zu dokumentieren.",

        "11.4": "Geeignete Maßnahmen zum Hautschutz sind umzusetzen.",

        "11.5": "Empfehlungen des Betriebsarztes sind umzusetzen und nachzuverfolgen.",

        "11.6": "Sanitärräume und Pausenräume sind hygienisch sauber zu halten."
    },


      Backstation: {
        "12.1": "Arbeitsgeräte der Backstation sind regelmäßig auf sicheren Zustand zu prüfen.",

        "12.2": "Handwaschbecken sind hygienisch sauber und funktionsfähig zu halten.",

        "12.3": "Elektroleitungen dürfen keine Stolperstellen verursachen.",

        "12.4": "Elektrische Anschlüsse müssen den geltenden VDE-Bestimmungen entsprechen.",

        "12.5": "Maschinenprüfungen sind regelmäßig durchzuführen und zu dokumentieren.",

        "12.6": "Schutzeinrichtungen müssen vorhanden und funktionsfähig sein.",

        "12.7": "Betriebsanweisungen sind gut sichtbar auszuhängen.",

        "12.8": "Backhandschuhe sind regelmäßig auf Verschleiß zu prüfen.",

        "12.9": "Heißgeräte sind regelmäßig technisch zu warten."
    },

     Serviceabteilung: {
        "13.1": "Ein aktueller Hautschutzplan ist gut sichtbar auszuhängen.",

        "13.2": "Geeignete Hautschutz- und Hautpflegeprodukte sind bereitzustellen.",

        "13.3": "Arbeitsgeräte sind regelmäßig auf sicheren Zustand zu prüfen.",

        "13.4": "Aufklappbare Thekenscheiben müssen sicher offen stehen bleiben.",

        "13.5": "Glasflächen sind in Augenhöhe zu kennzeichnen.",

        "13.6": "Schneidbretter und Messer sind hygienisch zu reinigen.",

        "13.7": "Geeignete Schneidbretter mit Messereinschub sind zu verwenden.",

        "13.8": "Messerhalter sind bereitzustellen und zu verwenden.",

        "13.9": "Convenience-Geräte sind regelmäßig zu prüfen.",

        "13.10": "Die Beleuchtung im Servicebereich ist ausreichend sicherzustellen."
    },


    Kassenzone: {
        "14.1": "Der Fußraum ist frei von Gegenständen zu halten.",

        "14.2": "Der Bodenbelag ist regelmäßig auf Schäden zu prüfen.",

        "14.3": "Heizgeräte dürfen nicht durch brennbare Materialien verstellt werden.",

        "14.4": "Kassenstühle sind regelmäßig auf sicheren Zustand zu prüfen.",

        "14.5": "Transportbänder sind regelmäßig zu warten.",

        "14.6": "Einkaufskörbe sind ordnungsgemäß zu lagern."

    },

     Gefahrstoffe: {
        "15.1": "Gefahrstoffe sind gemäß TRGS 510 unter Einhaltung der Zusammenlagerungsverbote sicher zu lagern. Gefährliche Wechselwirkungen zwischen Stoffgruppen sind auszuschließen.",

        "15.2": "Geeignete persönliche Schutzausrüstung ist entsprechend Gefährdungsbeurteilung und Sicherheitsdatenblatt bereitzustellen und zu verwenden.",

        "15.3": "Die in den Betriebsanweisungen geforderte PSA ist jederzeit vollständig und einsatzbereit bereitzuhalten.",

        "15.4": "Aktuelle Sicherheitsdatenblätter müssen in deutscher Sprache verfügbar und für Beschäftigte jederzeit zugänglich sein.",

        "15.5": "Beschäftigte sind vor Aufnahme der Tätigkeit und danach regelmäßig gemäß GefStoffV zu unterweisen."
    },

    Marktleiterbüro: {
        "16.1": "Aktuelle Listen und Prüfberichte prüfpflichtiger Anlagen und Einrichtungen sind vollständig vorzuhalten und regelmäßig zu aktualisieren.",

        "16.2": "Geeignete organisatorische und technische Maßnahmen zur Reduzierung des Überfallrisikos sind umzusetzen.",

        "16.3": "Während des Umgangs mit Zahlungsmitteln ist die Bürotür verschlossen zu halten.",

        "16.4": "Neue Beschäftigte sind vor Tätigkeitsaufnahme zu Arbeitssicherheit, Brandschutz und betrieblichen Gefährdungen zu unterweisen."
    },

   "Barrierefreies WC": {
        "17.1": "Die Notrufschnur muss gemäß DIN 18040 bis maximal 10 cm über dem Fußboden erreichbar sein.",

        "17.2": "Der Alarm ist an eine ständig besetzte oder überwachte Stelle weiterzuleiten.",

        "17.3": "Notrufeinrichtungen sind regelmäßig auf Funktion zu prüfen und zu dokumentieren.",

        "17.4": "Beschäftigte sind regelmäßig zum Verhalten bei Notrufen zu unterweisen.",

        "17.5": "Die Tür muss im Notfall jederzeit von außen entriegelt werden können."
    },


       Notfallmanagement: {
        "18.1": "Ein aktueller Notfall- und Alarmplan ist bereitzustellen und den Beschäftigten bekannt zu machen.",

        "18.2": "Beschäftigte sind regelmäßig zum Verhalten bei Brand, Unfall und Evakuierung zu unterweisen.",

        "18.3": "Zuständigkeiten und Verantwortlichkeiten im Notfall sind eindeutig festzulegen.",

        "18.4": "Alarmierungswege und Meldeketten sind verbindlich festzulegen und regelmäßig zu testen."
    },

     Dokumentation: {
        "19.1": "Dokumentationen über Erste-Hilfe-Leistungen sind vollständig, vertraulich und entsprechend der gesetzlichen Aufbewahrungsfristen aufzubewahren.",

        "19.2": "Ein Sicherheitsbeauftragter ist gemäß DGUV Vorschrift 1 schriftlich zu bestellen.",

        "19.3": "Während der gesamten Ladenöffnungszeit ist mindestens ein ausgebildeter Brandschutzhelfer anwesend zu halten.",

        "19.4": "Unterweisungen zum Umgang mit Zahlungsmitteln sind mindestens halbjährlich durchzuführen und zu dokumentieren.",

        "19.5": "Alle Unterweisungen sind nachvollziehbar und rechtssicher zu dokumentieren.",

        "19.6": "Änderungen betrieblicher Abläufe oder neuer Sicherheitstechniken sind zeitnah in Unterweisungen zu integrieren.",

        "19.7": "Die Gefährdungsbeurteilung ist regelmäßig zu überprüfen und bei Änderungen unverzüglich anzupassen."
    },


  "Psychische Belastung": {
        "20.1": "Mitarbeiterwünsche sind im Rahmen der Arbeitszeitgestaltung angemessen zu berücksichtigen.",

        "20.2": "Die gesetzlichen Pausenregelungen sind einzuhalten und organisatorisch sicherzustellen.",

        "20.3": "Überstunden sind auf das notwendige Maß zu begrenzen.",

        "20.4": "Regelmäßige Teambesprechungen zur Verbesserung der Kommunikation sind durchzuführen.",

        "20.5": "Neue Beschäftigte sind strukturiert einzuarbeiten und fachlich zu begleiten.",

        "20.6": "Unterweisungen zu Brand- und Arbeitsschutz sind regelmäßig durchzuführen und zu dokumentieren.",

        "20.7": "Ein schwarzes Brett oder vergleichbares Informationsmedium ist bereitzustellen.",

        "20.8": "Betriebliche Entscheidungen sind nachvollziehbar und transparent zu kommunizieren.",

        "20.9": "Positive Leistungen und sicherheitsgerechtes Verhalten sind anzuerkennen.",

        "20.10": "Konstruktive Kritik ist sachlich und wertschätzend zu vermitteln.",

        "20.11": "Informationen und Ansprechpartner zur Suchtprävention sind bereitzustellen.",

        "20.12": "Ein betriebliches Eingliederungsmanagement gemäß §167 SGB IX ist umzusetzen.",

        "20.13": "Alleinarbeit ist im Rahmen der Gefährdungsbeurteilung möglichst zu vermeiden.",

        "20.14": "Maßnahmen zur Betreuung von Beschäftigten nach Überfall- oder Gewaltvorfällen sind organisatorisch sicherzustellen.",

        "20.15": "Schulungen zum Umgang mit aggressiven oder gewalttätigen Situationen sind anzubieten.",

        "20.16": "Mitarbeiteranregungen sind aktiv in Entscheidungs- und Verbesserungsprozesse einzubeziehen."
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
