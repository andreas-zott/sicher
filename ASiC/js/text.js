// ===== Vordefinierte Maßnahmen-Texte je Prüfpunkt, in drei Sprachstilen =====
// Fachliche Überarbeitung: 25.08.2026. Regelwerksbezüge wurden gegen aktuelle BGHW/DGUV-, BAuA- und Bundesrechtsquellen abgeglichen.
// Detailüberarbeitung (2. Stufe): 25.08.2026 – jeder einzelne Prüfpunkt wurde individuell um konkrete Fristen/Intervalle,
// präzisere Paragraphen-/Absatzangaben und zusätzliche branchenspezifische DGUV-/DIN-Einzelverweise ergänzt (kein pauschaler
// Kategorietext). Recherchequellen u. a.: BetrSichV (Gesetze-im-Internet), ASR A2.2/A2.3/A3.4 (BAuA), DIN 14406-4, DIN EN 15635,
// DGUV Vorschrift 3 Anhang 1, DGUV Information 208-016/208-061, DIN V VDE V 0108-100 / DIN EN 50172, DIN 18040-1.
// Hinweis: DGUV-Regeln und DGUV-Informationen konkretisieren die Umsetzung; sie sind nicht mit staatlichen Rechtsvorschriften gleichzusetzen.
// Besonders berücksichtigt: DGUV Regel 108-601, DGUV Information 208-061 (ersetzt zurückgezogene DGUV Regel 108-007),
// DGUV Vorschrift 25 / DGUV Regel 108-010, DGUV Vorschrift 68, DGUV Information 208-016, ASR und BetrSichV.
// einfach    = Alltagssprache ohne Paragraphen, fuer Mitarbeitende ohne Fachhintergrund
// bghw       = branchenspezifische Terminologie mit konkreten BGHW-/DGUV-Regelwerken
// rechtlich  = konkrete gesetzliche/technische Rechtsgrundlagen; technische Regeln nur dort,
//              wo sie die gesetzlichen Schutzziele konkretisieren.
//
// Rechts-/Regelwerksstand bei der Überarbeitung: 25.08.2026.
// Verifiziert wurden insbesondere:
// - BGHW/DGUV Regel 108-601 "Branche Einzelhandel"
// - DGUV Vorschrift 25 "Überfallprävention" und DGUV Regel 108-010
// - DGUV Vorschrift 1, 2, 3, 68 sowie DGUV Informationen 204-020/204-022,
//   208-016, 208-043, 208-061
// - DGUV Regel 110-008 (CO2-/Kälteanlagen), soweit einschlägig
// - ASR A1.2, A1.3, A1.5, A1.7, A1.8, A2.1, A2.2, A2.3, A3.4, A4.1, A4.2, A4.3
// - ArbSchG, ArbStättV, BetrSichV, GefStoffV, ArbMedVV, ArbZG, JArbSchG,
//   SGB VII und SGB IX sowie einschlägige TRBS/TRGS
// - DIN 14406-4 (Feuerlöscher-Instandhaltung), DIN EN 15635 (Regalsysteme),
//   DIN V VDE V 0108-100 / DIN EN 50172 (Sicherheitsbeleuchtung), DIN 18040-1 (Barrierefreies Bauen),
//   DIN 18650-2 / DIN EN 13241 (kraftbetätigte Türen/Tore), TRBS 3121 (Aufzugsanlagen),
//   PSA-Benutzungsverordnung, LasthandhabV, LMHV, REACH-VO Art. 31, BetrVG, BGB § 618
//
// Offizielle Quellen:
// https://www.bghw.de/arbeitsschutz/
// https://publikationen.dguv.de/
// https://www.baua.de/DE/Angebote/Regelwerk/ASR/ASR
// https://www.gesetze-im-internet.de/

const MEASURE_SOURCES = {
    bghw: [
        'DGUV Regel 108-601 – Branche Einzelhandel',
        'DGUV Vorschrift 25 – Überfallprävention',
        'DGUV Regel 108-010 – Überfallprävention in Verkaufsstellen',
        'DGUV Vorschrift 1 – Grundsätze der Prävention',
        'DGUV Vorschrift 2 – Betriebsärzte und Fachkräfte für Arbeitssicherheit',
        'DGUV Vorschrift 3 – Elektrische Anlagen und Betriebsmittel',
        'DGUV Vorschrift 68 – Flurförderzeuge',
        'DGUV Information 204-020 – Dokumentation der Erste-Hilfe-Leistungen',
        'DGUV Information 204-022 – Erste-Hilfe im Betrieb',
        'DGUV Information 208-016 – Handlungsanleitung für den Umgang mit Leitern und Tritten',
        'DGUV Information 208-061 – Lagereinrichtungen und Ladungsträger',
        'DGUV Regel 110-008 – Betreiben von Kälteanlagen, Wärmepumpen und Kühleinrichtungen mit Kohlendioxid',
        'TRBS 3121 – Betrieb von Aufzugsanlagen',
        'DIN 14406-4 – Tragbare Feuerlöscher, Instandhaltung',
        'DIN EN 15635 – Ortsfeste Regalsysteme aus Stahl, Nutzung und Instandhaltung',
        'DIN V VDE V 0108-100 / DIN EN 50172 – Sicherheitsbeleuchtungsanlagen',
        'DIN 18040-1 – Barrierefreies Bauen, öffentlich zugängliche Gebäude',
        'DIN 18650-2 / DIN EN 13241 – Kraftbetätigte Türen und Tore, Prüfung',
        'DIN VDE 0834 – Anlagen für Ruf- und Zeitmesssysteme in Krankenhäusern/barrierefreien Anlagen'
    ],
    rechtsquellen: [
        'ArbSchG – insbesondere §§ 3, 4, 5, 5a, 6, 10, 12',
        'ArbStättV – insbesondere §§ 3, 3a, 4, 6, 9',
        'BetrSichV – insbesondere §§ 3, 4, 5, 10, 12, 14, 15, 16 sowie Anhang 2 Abschnitt 2 Nr. 4.1',
        'GefStoffV – insbesondere §§ 6, 14',
        'ArbMedVV – insbesondere §§ 3, 4, 5, 5a',
        'ArbZG – insbesondere §§ 3, 4, 5',
        'JArbSchG – insbesondere §§ 22 ff., § 29',
        'SGB VII – insbesondere § 22',
        'SGB IX – insbesondere § 167 Abs. 2',
        'BetrVG – insbesondere §§ 75, 81, 82',
        'BGB – § 618 (Fürsorgepflicht des Arbeitgebers)',
        'PSA-Benutzungsverordnung – § 2',
        'Lastenhandhabungsverordnung (LasthandhabV)',
        'Lebensmittelhygiene-Verordnung (LMHV)',
        'REACH-Verordnung (EG) Nr. 1907/2006 – Art. 31 (Sicherheitsdatenblätter)',
        'Aufzugsrichtlinie 2014/33/EU',
        'ASR A1.2, A1.3, A1.5, A1.7, A1.8, A2.1, A2.2, A2.3, A3.4, A4.1, A4.2, A4.3',
        'TRGS 400, TRGS 401, TRGS 510, TRGS 555',
        'TRBS 1201, TRBS 1203, TRBS 3121'
    ]
};

const MEASURES_TEXT = {

    "Gesamtmarkt": {        "1.1": {
            einfach: 'Achten Sie darauf, dass alle Mitarbeitenden festes, vorne geschlossenes und rutschfestes Schuhwerk tragen.',
            bghw: 'Setzen Sie die Vorgaben zu sicherem Schuhwerk gemäß § 5 ArbSchG (Gefährdungsbeurteilung), DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ um: festes, im Zehenbereich geschlossenes und rutschhemmendes Schuhwerk. Maßgeblich sind mind. die Rutschhemmklassen SRA/SRB nach DIN EN ISO 20345/20347.',
            rechtlich: 'Gemäß Gefährdungsbeurteilung und DGUV Vorschrift 1 ist sicherzustellen, dass alle Beschäftigten geeignetes, festes, geschlossenes und rutschhemmendes Schuhwerk tragen. Die Einhaltung ist regelmäßig zu kontrollieren. Die PSA-Kategorie ist anhand der Gefährdungsbeurteilung festzulegen (i. d. R. Rutschhemmklasse SRA/SRB nach DIN EN ISO 20345/20347); die Kontrolle ist im Rahmen der jährlichen Unterweisung nach § 12 ArbSchG zu dokumentieren.'
        },
        "1.2": {
            einfach: 'Weisen Sie Ihre Mitarbeitenden regelmäßig ein, wie sie Hubwagen & Co. sicher benutzen: Schutzausrüstung tragen, Lasten nicht überladen, niemanden mitfahren lassen. Nur volljährige Beschäftigte mit Fahrauftrag dürfen mitfahrbare Geräte führen.',
            bghw: 'Führen Sie regelmäßige Unterweisungen zum sicheren Umgang mit Flurförderfahrzeugen gemäß DGUV Vorschrift 68 und der DGUV Regel 108-601 durch, inkl. PSA-Pflicht, zulässiger Traglasten und Verbot der Personenmitnahme. Für mitfahrbare Flurförderzeuge ist ein schriftlicher Fahrauftrag zu erteilen; Mindestalter 18 Jahre (§ 7 DGUV Vorschrift 68).',
            rechtlich: 'Beschäftigte sind regelmäßig anhand der Betriebsanweisung zum sicheren Umgang mit Flurförderfahrzeugen zu unterweisen. PSA-Pflicht, Traglastbegrenzungen und das Verbot der Personenmitnahme sind konsequent einzuhalten. Fahrer mitfahrbarer Flurförderzeuge müssen mindestens 18 Jahre alt, körperlich/geistig geeignet und schriftlich beauftragt sein (§ 7 DGUV Vorschrift 68); die Unterweisung ist mindestens jährlich zu wiederholen (§ 4 Abs. 3 DGUV Vorschrift 68).'
        },
        "1.3": {
            einfach: 'Lassen Sie die Automatiktüren umgehend prüfen. Schränken Sie den Betrieb bis dahin bei Bedarf ein und beheben Sie festgestellte Mängel zügig. Eine Sachkundigenprüfung ist ohnehin mindestens einmal jährlich Pflicht.',
            bghw: 'Veranlassen Sie die Prüfung der Automatiktüren gemäß ASR A1.7 und der DGUV Regel 108-601 umgehend über einen Sachkundigen, schränken Sie den Betrieb bis dahin bei Bedarf ein und dokumentieren Sie die Mängelbeseitigung. Regelprüfintervall: mindestens jährlich durch eine sachkundige Person gemäß DIN 18650-2.',
            rechtlich: 'Fachgerechte Prüfung der betroffenen Automatiktüren nach ASR A1.7 umgehend veranlassen. Betrieb bis zur Prüfung ggf. einschränken. Festgestellte Mängel zügig beheben und Dokumentation aktualisieren. Die Regelprüffrist für kraftbetätigte Türen/Tore beträgt gemäß DIN 18650-2 mindestens einmal jährlich durch eine sachkundige Person; das Ergebnis ist im Prüfbuch zu dokumentieren.'
        },
        "1.4": {
            einfach: 'Lassen Sie den Aufzug regelmäßig von einem Fachbetrieb prüfen und halten Sie ihn in einwandfreiem Zustand. Spätestens alle zwei Jahre ist die Prüfung durch eine zugelassene Prüfstelle (ZÜS) gesetzlich vorgeschrieben.',
            bghw: 'Beauftragen Sie eine zugelassene Überwachungsstelle mit der wiederkehrenden Prüfung der Aufzugsanlage gemäß BetrSichV und der DGUV Regel 108-601 „Branche Einzelhandel“. Die Prüffrist der ZÜS-Hauptprüfung darf zwei Jahre nicht überschreiten (§ 16 i. V. m. Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV).',
            rechtlich: 'Aufzugsanlagen sind gemäß BetrSichV wiederkehrend durch zugelassene Überwachungsstellen zu prüfen und in sicherem Zustand zu halten. Die vom Arbeitgeber nach § 3 Abs. 6 BetrSichV festzulegende Prüffrist der ZÜS-Hauptprüfung darf gemäß Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV zwei Jahre nicht überschreiten; die Prüfbescheinigungen sind aufzubewahren.'
        },
        "1.6": {
            einfach: 'Stellen Sie genug sichere Trittstufen oder Rolltritte bereit und sorgen Sie dafür, dass sie auch genutzt werden.',
            bghw: 'Stellen Sie geprüfte Aufstiegshilfen gemäß DGUV Information 208-016 und der DGUV Regel 108-601 in ausreichender Anzahl bereit und stellen Sie deren bestimmungsgemäße Nutzung sicher.',
            rechtlich: 'Geeignete und geprüfte Aufstiegshilfen sind bereitzustellen. Die Nutzung hat gemäß DGUV Information 208-016 zu erfolgen. Ungeeignete Aufstiegshilfen wie Kisten, Regale oder Stühle sind zu untersagen; dies ist im Rahmen der Unterweisung nach § 12 ArbSchG zu kontrollieren.'
        },
        "1.7": {
            einfach: 'Lassen Sie Leitern und Tritte regelmäßig prüfen und sortieren Sie beschädigte sofort aus. Als Richtwert gilt: mindestens einmal jährlich, mit Prüfplakette pro Leiter.',
            bghw: 'Prüfen Sie Leitern und Tritte gemäß DGUV Information 208-016 und der DGUV Regel 108-601 durch eine befähigte Person in angemessenen Intervallen. Als Richtwert gilt mindestens jährlich (§ 3 Abs. 6 BetrSichV); führen Sie ein Kontrollblatt je Leiter mit Prüfplakette.',
            rechtlich: 'Leitern und Tritte sind regelmäßig durch befähigte Personen zu prüfen. Beschädigte Leitern sind sofort auszusondern. Art, Umfang und Frist der Prüfung sind anhand der Gefährdungsbeurteilung festzulegen (§ 3 Abs. 6 BetrSichV); als Richtwert gilt mindestens jährlich. Beschädigte Leitern sind sofort der Nutzung zu entziehen (§ 5 BetrSichV).'
        },
        "1.8": {
            einfach: 'Nutzen Sie nur die freigegebenen Sicherheitsmesser aus dem Ordersatz.',
            bghw: 'Stellen Sie im Rahmen der Gefährdungsbeurteilung (§ 5 ArbSchG) und der DGUV Regel 108-601 „Branche Einzelhandel“ sicher, dass ausschließlich freigegebene Sicherheitsmesser verwendet werden.',
            rechtlich: 'Es dürfen ausschließlich geeignete Sicherheitsmesser gemäß der Gefährdungsbeurteilung nach § 5 ArbSchG verwendet werden. Die Auswahl ist im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG zu dokumentieren und in der Betriebsanweisung festzuhalten.'
        },
        "1.9": {
            einfach: 'Halten Sie Gänge und Wege frei von Stolperfallen, damit niemand ausrutscht oder stürzt.',
            bghw: 'Gestalten Sie die Verkehrswege gemäß ASR A1.5 und der DGUV Regel 108-601 frei von Stolper-, Rutsch- und Sturzgefahren.',
            rechtlich: 'Verkehrswege sind gemäß ASR A1.5 frei von Stolper-, Rutsch- und Sturzgefahren zu halten. Verkehrswege sind nach ASR A1.5 Abschnitt 4 rutschhemmend auszuführen und regelmäßig auf Verunreinigungen und Beschädigungen zu kontrollieren.'
        },
        "1.10": {
            einfach: 'Halten Sie Treppen frei von Gegenständen und beheben Sie Schäden zügig.',
            bghw: 'Kontrollieren Sie Treppen regelmäßig auf Schäden und halten Sie sie gemäß ASR A1.5 und der DGUV Regel 108-601 frei von Gegenständen.',
            rechtlich: 'Treppen sind gemäß ASR A1.5 frei von Gegenständen zu halten und regelmäßig auf Schäden zu kontrollieren. Handläufe und Stufenkanten sind entsprechend ASR A1.5 Abschnitt 6 sicher und rutschhemmend zu gestalten.'
        },
        "1.11": {
            einfach: 'Hängen Sie Betriebsanweisungen gut sichtbar auf und achten Sie darauf, dass sie auch befolgt werden.',
            bghw: 'Machen Sie Betriebsanweisungen gemäß § 14 GefStoffV bzw. § 4 BetrSichV und der DGUV Regel 108-601 jederzeit zugänglich und kontrollieren Sie die Einhaltung der Sicherheitsanweisungen.',
            rechtlich: 'Betriebsanweisungen sind gemäß § 14 GefStoffV bzw. § 4 BetrSichV aktuell, zugänglich und für Beschäftigte verständlich bereitzustellen. Betriebsanweisungen sind in einer für die Beschäftigten verständlichen Form und Sprache abzufassen (§ 14 Abs. 1 GefStoffV) und regelmäßig auf Aktualität zu prüfen.'
        },
        "1.12": {
            einfach: 'Sorgen Sie für ausreichend helles Licht in Verkauf und Lager, damit Gefahrenhinweise und Flüssigkeiten im Regal gut zu erkennen sind.',
            bghw: 'Stellen Sie die Beleuchtung in Verkaufs- und Lagerbereichen gemäß ASR A3.4 entsprechend der ermittelten Beleuchtungsanforderungen und der DGUV Regel 108-601 sicher, damit Gefahrenhinweise und Leckagen zuverlässig erkennbar sind.',
            rechtlich: 'Die Beleuchtung ist gemäß ASR A3.4 entsprechend der Tätigkeit, Raumgröße und Sehaufgabe ausreichend zu dimensionieren. Gefahrenstellen und Leckagen müssen sicher erkennbar sein. Als Anhaltswert gilt nach ASR A3.4 Anhang 1 für Verkaufsräume üblicherweise mindestens 300 Lux, für Lagerbereiche mindestens 100–200 Lux, je nach Sehaufgabe.'
        },
        "1.13": {
            einfach: 'Lassen Sie das Schnelllauftor umgehend vom Hersteller oder einem Fachmann prüfen und reparieren. Nutzen Sie den Torbereich bis dahin besonders vorsichtig. Kraftbetätigte Tore sind mindestens einmal jährlich sachkundig zu prüfen.',
            bghw: 'Veranlassen Sie die Prüfung und ggf. Instandsetzung des Schnelllauftors gemäß § 14 BetrSichV und der DGUV Regel 108-601 unverzüglich über einen Sachkundigen bzw. den Hersteller; der Torbereich ist bis zur Mängelfreiheit mit besonderer Vorsicht zu nutzen. Die Prüffrist beträgt gemäß DIN EN 13241 i. V. m. ASR A1.7 mindestens jährlich durch eine sachkundige Person.',
            rechtlich: 'Prüfung und ggf. erforderliche Instandsetzung des Schnelllauftors sind gemäß § 14 BetrSichV unverzüglich über einen Sachkundigen bzw. den Hersteller zu veranlassen. Bis zur Mängelfreiheit ist der Torbereich mit besonderer Vorsicht zu nutzen. Kraftbetätigte Tore sind gemäß DIN EN 13241 i. V. m. § 14 BetrSichV mindestens jährlich durch eine sachkundige Person zu prüfen; das Ergebnis ist zu dokumentieren.'
        },
        "1.14": {
            einfach: 'Lassen Sie das Rolltor zeitnah von einem Fachmann prüfen und warten und halten Sie den Zustand schriftlich fest. Auch Rolltore sind mindestens einmal jährlich sachkundig zu prüfen.',
            bghw: 'Veranlassen Sie die Sachkundigenprüfung sowie die erforderliche Wartung des Rolltors gemäß § 14 BetrSichV und der DGUV Regel 108-601 kurzfristig und dokumentieren Sie den Zustand im Prüfbuch. Die Prüffrist beträgt gemäß DIN EN 13241 mindestens jährlich durch eine sachkundige Person.',
            rechtlich: 'Sachkundigenprüfung sowie erforderliche Wartung des Rolltors sind gemäß § 14 BetrSichV kurzfristig zu veranlassen; der ordnungsgemäße Zustand ist im Prüfbuch zu dokumentieren. Rolltore sind gemäß DIN EN 13241 i. V. m. § 14 BetrSichV mindestens jährlich durch eine sachkundige Person zu prüfen und im Prüfbuch zu dokumentieren.'
        }
    },
    "Brandschutz": {        "2.1": {
            einfach: 'Lassen Sie die Feuerlöscher regelmäßig prüfen und halten Sie die Fristen ein. Die Prüfung ist gesetzlich mindestens alle zwei Jahre Pflicht.',
            bghw: 'Lassen Sie die Feuerlöscheinrichtungen entsprechend der DGUV Regel 108-601 „Branche Einzelhandel“ zu ASR A2.2 durch eine befähigte Person prüfen und die Prüffristen dokumentieren. Die Prüffrist beträgt gemäß ASR A2.2 Nr. 7.4 i. V. m. DIN 14406-4 höchstens zwei Jahre; kürzere Herstellerfristen sind zu beachten.',
            rechtlich: 'Feuerlöscher sind gemäß ASR A2.2 i. V. m. § 4 ArbStättV regelmäßig (in der Regel alle zwei Jahre) durch eine befähigte Person zu prüfen; die Prüfung ist zu dokumentieren. Tragbare Feuerlöscher sind gemäß ASR A2.2 Nr. 7.4 i. V. m. DIN 14406-4 spätestens alle zwei Jahre durch eine sachkundige Person zu warten; das Ergebnis ist durch Instandhaltungsnachweis/Prüfplakette zu dokumentieren. Bei starker Beanspruchung sind kürzere Intervalle festzulegen.'
        },
        "2.2": {
            einfach: 'Stellen Sie nichts vor die Feuerlöscher und Wandhydranten.',
            bghw: 'Halten Sie Feuerlöscher und Wandhydranten gemäß der DGUV Regel 108-601 „Branche Einzelhandel“ zu ASR A2.2 jederzeit frei zugänglich und deutlich gekennzeichnet.',
            rechtlich: 'Feuerlöscher und Wandhydranten sind gemäß ASR A2.2 jederzeit frei zugänglich zu halten und nach ASR A1.3 zu kennzeichnen. Freihaltung und Kennzeichnung sind nach ASR A2.2 i. V. m. ASR A1.3 (Sicherheitskennzeichnung) sicherzustellen.'
        },
        "2.3": {
            einfach: 'Kontrollieren Sie regelmäßig, ob die Plomben an den Wandhydranten unversehrt sind. Zusätzlich zur Sichtkontrolle ist eine technische Prüfung der Wandhydranten mindestens jährlich vorgeschrieben.',
            bghw: 'Kontrollieren Sie die Prüfsiegel der Wandhydranten im Rahmen der gemäß der DGUV Regel 108-601 „Branche Einzelhandel“ durchgeführten Brandschutzbegehung regelmäßig auf Unversehrtheit. Wandhydranten sind zusätzlich zur Plombenkontrolle gemäß DIN 1988-600 mindestens jährlich technisch zu prüfen.',
            rechtlich: 'Wandhydranten sind entsprechend den festgelegten Prüf- und Wartungsanforderungen zu kontrollieren; die Prüfung ist nachvollziehbar zu dokumentieren. ASR A2.2 enthält die Anforderungen an die Bereitstellung und Instandhaltung der Einrichtungen zur Brandbekämpfung. Wandhydranten sind gemäß DIN 1988-600 mindestens jährlich einer technischen Prüfung zu unterziehen; die Sichtkontrolle der Plomben erfolgt ergänzend im Rahmen der betrieblichen Brandschutzbegehung.'
        },
        "2.4": {
            einfach: 'Stellen Sie nichts vor Brandschutztüren und blockieren Sie sie nicht.',
            bghw: 'Halten Sie Brandschutztüren gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ frei von Zustellungen, damit die Schließfunktion jederzeit gewährleistet ist.',
            rechtlich: 'Brandschutztüren sind gemäß § 4 ArbStättV so zu betreiben, dass ihre Schutz- und Schließfunktion nicht beeinträchtigt wird; erforderliche Rettungswege und Ausgänge sind freizuhalten. Verstellungen sind als Ordnungswidrigkeit nach § 9 ArbStättV zu werten, wenn dadurch die Schließfunktion beeinträchtigt wird.'
        },
        "2.5": {
            einfach: 'Lassen Sie die Halterungen und den Schließmechanismus der Feuerschutztüren regelmäßig prüfen. Als Richtwert gilt eine jährliche Wartung, wie bei anderen Feuerschutzabschlüssen üblich.',
            bghw: 'Prüfen Sie Türhaltevorrichtungen und Schließfolgeregler der Feuerschutzabschlüsse regelmäßig auf Funktion gemäß den Herstellervorgaben und den festgelegten Prüf-/Wartungsintervallen. Als Richtwert gilt eine jährliche Wartung gemäß Herstellervorgaben, analog DIN 14677 für Feststellanlagen.',
            rechtlich: 'Türhaltevorrichtungen und Schließfolgeregler von Feuerschutzabschlüssen sind nach den bauordnungsrechtlichen Vorgaben, den Herstellervorgaben und den festgelegten Prüf-/Wartungsintervallen auf Funktion zu prüfen. Türhaltevorrichtungen und Schließfolgeregler sind entsprechend den Herstellerangaben, i. d. R. mindestens jährlich, auf Funktion zu prüfen; für elektroakustisch freigehaltene Feuerschutzabschlüsse gilt ergänzend DIN 14677.'
        },
        "2.6": {
            einfach: 'Beheben Sie Schäden an Brandschutztüren sofort.',
            bghw: 'Setzen Sie beschädigte Brandschutztüren gemäß der DGUV Regel 108-601 „Branche Einzelhandel“ unverzüglich instand, um deren Schutzfunktion sicherzustellen.',
            rechtlich: 'Festgestellte Mängel an Brandschutztüren sind gemäß § 4 ArbStättV unverzüglich zu beseitigen; bei unmittelbarer erheblicher Gefahr ist die Nutzung bis zur sicheren Beseitigung einzuschränken. Mängel an der Schutzfunktion (Dichtungen, Schließmechanik, Falzausbildung) sind gemäß § 4 ArbStättV unverzüglich zu beseitigen; bis dahin ist die Ersatzmaßnahme (z. B. Brandwache) zu prüfen.'
        },
        "2.7": {
            einfach: 'Hängen Sie einen aktuellen Flucht- und Rettungsplan gut sichtbar auf.',
            bghw: 'Erstellen und veröffentlichen Sie einen aktuellen Flucht- und Rettungsplan gemäß ASR A2.3 und der DGUV Regel 108-601 zur Brandschutzorganisation.',
            rechtlich: 'Ein aktueller Flucht- und Rettungsplan ist gemäß ASR A2.3 zu erstellen und an geeigneten Stellen gut sichtbar auszuhängen. Der Flucht- und Rettungsplan ist gemäß ASR A2.3 Anlage 1 nach DIN ISO 23601 zu gestalten und bei baulichen oder organisatorischen Änderungen zu aktualisieren.'
        },
        "2.8": {
            einfach: 'Prüfen Sie regelmäßig, ob die Notbeleuchtung noch funktioniert. Notwendig sind: wöchentlicher Funktionstest, jährlicher Volltest der gesamten Betriebsdauer und alle drei Jahre eine Prüfung durch einen Sachverständigen.',
            bghw: 'Prüfen Sie die Sicherheits- und Notbeleuchtung gemäß ASR A3.4 und der DGUV Regel 108-601 in regelmäßigen Intervallen (in der Regel jährlich) auf Funktion. Erforderlich sind: wöchentlicher Funktionstest, jährlicher Volltest (Bemessungsbetriebsdauer) sowie eine Sachverständigenprüfung alle drei Jahre gemäß DIN V VDE V 0108-100 / DIN EN 50172.',
            rechtlich: 'Die Sicherheits- und Notbeleuchtung ist gemäß ASR A2.3 und den einschlägigen elektrotechnischen Regeln regelmäßig auf Funktionsfähigkeit zu prüfen. Die Sicherheits- und Notbeleuchtung ist gemäß DIN V VDE V 0108-100 / DIN EN 50172 wöchentlich (Funktionstest), jährlich (Volltest der Bemessungsbetriebsdauer) sowie alle drei Jahre durch einen Sachverständigen zu prüfen; ein Prüfbuch ist mindestens vier Jahre aufzubewahren.'
        },
        "2.9": {
            einfach: 'Halten Sie Fluchtwege und Notausgänge komplett frei – innen wie außen.',
            bghw: 'Halten Sie Flucht- und Rettungswege sowie Notausgänge gemäß ASR A2.3 und der DGUV Regel 108-601 in voller Breite und dauerhaft frei, auch im Außenbereich.',
            rechtlich: 'Flucht- und Rettungswege sowie Notausgänge sind gemäß ASR A2.3 in ihrer gesamten Breite ständig freizuhalten, auch im Außenbereich. Die Mindestbreite der Fluchtwege richtet sich nach ASR A2.3 Nr. 5 (i. d. R. mind. 1,00–1,20 m, je nach Personenzahl).'
        },
        "2.10": {
            einfach: 'Sorgen Sie dafür, dass sich Notausgänge jederzeit ohne Schlüssel oder Werkzeug leicht öffnen lassen.',
            bghw: 'Stellen Sie gemäß ASR A2.3 und der DGUV Regel 108-601 sicher, dass sich alle Notausgänge und -ausstiege jederzeit ohne Hilfsmittel von innen leicht öffnen lassen.',
            rechtlich: 'Notausgänge müssen gemäß ASR A2.3 jederzeit ohne fremde Hilfsmittel von innen leicht zu öffnen sein; die Funktionsfähigkeit der Beschläge ist sicherzustellen. Die Beschlagfunktion (Panikverschluss/Fluchttürsteuerung) ist gemäß ASR A2.3 i. V. m. DIN EN 179/DIN EN 1125 regelmäßig zu prüfen.'
        },
        "2.11": {
            einfach: 'Prüfen Sie, ob die Notausgänge tatsächlich ins Freie bzw. an einen sicheren Ort führen.',
            bghw: 'Überprüfen Sie im Rahmen der Brandschutzbegehung nach der DGUV Regel 108-601 „Branche Einzelhandel“, dass alle Notausgänge gemäß ASR A2.3 in tatsächlich sichere Bereiche führen.',
            rechtlich: 'Notausgänge müssen gemäß ASR A2.3 in einen gesicherten Bereich im Freien oder in einen anderen sicheren Bereich führen. Der sichere Bereich muss ausreichend Platz für die evakuierten Personen bieten und darf nicht durch Fahrzeuge, Anlieferzonen o. Ä. gefährdet sein (ASR A2.3).'
        },
        "2.12": {
            einfach: 'Lassen Sie die Brandmeldeanlage regelmäßig warten und testen. Üblich sind eine halbjährliche Inspektion und eine jährliche Vollwartung durch eine Fachfirma.',
            bghw: 'Lassen Sie die Brandmeldeanlage gemäß DIN 14675 und der DGUV Regel 108-601 regelmäßig durch eine Fachfirma warten und auf Funktion prüfen. Üblich sind halbjährliche Inspektionen und jährliche Vollwartungen gemäß DIN VDE 0833-1/-2 i. V. m. DIN 14675.',
            rechtlich: 'Die Brandmeldeanlage ist gemäß DIN 14675 und den Vorgaben der jeweiligen Landesbauordnung regelmäßig zu warten und auf Funktion zu prüfen. Brandmeldeanlagen sind gemäß DIN 14675 i. V. m. DIN VDE 0833-1/-2 regelmäßig zu warten (üblich: halbjährliche Inspektion, jährliche Vollwartung); die konkreten Fristen richten sich zusätzlich nach der jeweiligen Landesbauordnung bzw. behördlichen Auflage.'
        },
        "2.13": {
            einfach: 'Verschließen Sie die Einfüllöffnung des Presscontainers nach Ladenschluss.',
            bghw: 'Sichern Sie die Einfüllöffnung des Presscontainers gemäß den BGHW-Vorgaben zur Brandschutzorganisation nach Betriebsschluss mechanisch gegen unbefugte Nutzung.',
            rechtlich: 'Die Einfüllöffnung des Presscontainers ist entsprechend der Gefährdungsbeurteilung und des betrieblichen Brandschutzkonzepts nach Betriebsschluss gegen unbefugte Nutzung zu sichern (§§ 3, 5 ArbSchG; ASR A2.2). Die Sicherung dient auch der Brandlastreduzierung; sie ist im Rahmen der betrieblichen Brandschutzordnung Teil B/C festzulegen.'
        },
        "2.14": {
            einfach: 'Lagern Sie keine Kartons oder brennbaren Materialien in Technik- und Heizräumen.',
            bghw: 'Halten Sie Technik- und Heizräume gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ frei von brennbaren Materialien.',
            rechtlich: 'Technik- und Heizräume sind entsprechend der Gefährdungsbeurteilung und den brandschutzrechtlichen Vorgaben frei von unnötigen brennbaren Materialien zu halten (§§ 3, 5 ArbSchG; § 4 ArbStättV; ASR A2.2). Maßgeblich ist zudem, dass Heizräume nach § 4 ArbStättV i. V. m. den einschlägigen Feuerungsverordnungen der Länder frei von Brandlasten zu halten sind.'
        },
        "2.15": {
            einfach: 'Nutzen Sie Technik- und Heizräume nicht als Lagerfläche.',
            bghw: 'Nutzen Sie Technik- und Heizräume gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ ausschließlich zweckgebunden und nicht als Lagerfläche.',
            rechtlich: 'Technik- und Heizräume sind ausschließlich zweckgebunden zu nutzen; eine Zweckentfremdung als Lagerfläche ist zu unterbinden. Die Zweckbindung ist Bestandteil der brandschutzrechtlichen Nutzungsgenehmigung; eine Zweckentfremdung kann die Betriebserlaubnis gefährden.'
        }
    },
    "Sozialräume": {        "3.1": {
            einfach: 'Hängen Sie die vorgeschriebenen Gesetze und die Brandschutzordnung im Sozialraum aus.',
            bghw: 'Hängen Sie die aushangpflichtigen Gesetze, Unfallverhütungsvorschriften und die Brandschutzordnung Teil A gemäß DGUV Vorschrift 1 und den jeweils einschlägigen Aushang- und Brandschutzvorgaben und der DGUV Regel 108-601 im Sozialbereich aus.',
            rechtlich: 'Die aushangpflichtigen Gesetze, Unfallverhütungsvorschriften sowie die Brandschutzordnung Teil A sind im Sozialbereich gut sichtbar auszuhängen (DGUV Vorschrift 1 und den jeweils einschlägigen Aushang- und Brandschutzvorgaben). Die Aushangpflicht ergibt sich u. a. aus § 22 DGUV Vorschrift 1 sowie ArbSchG, ArbZG und MuSchG; die Brandschutzordnung Teil A ist nach DIN 14096 auszuhängen.'
        },
        "3.2": {
            einfach: 'Stellen Sie Kaffeemaschine und andere heiße Geräte auf eine feuerfeste Unterlage.',
            bghw: 'Stellen Sie hitzeentwickelnde Geräte wie die Kaffeemaschine gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ auf eine nicht brennbare Unterlage.',
            rechtlich: 'Kaffeemaschine und andere hitzeentwickelnde Geräte sind auf Grundlage der Gefährdungsbeurteilung und der Anforderungen an den Brandschutz so aufzustellen und zu betreiben, dass Brandgefährdungen vermieden werden (§§ 3, 4 ArbSchG; § 4 ArbStättV; ASR A2.2). Der erforderliche Sicherheitsabstand zu brennbaren Materialien richtet sich nach Herstellerangaben und der Gefährdungsbeurteilung (§ 5 ArbSchG).'
        },
        "3.3": {
            einfach: 'Lassen Sie Kabel, Steckdosen und Geräte regelmäßig auf Sicherheit prüfen. Als Richtwert gilt: alle 6 bis 24 Monate, je nach Beanspruchung.',
            bghw: 'Prüfen Sie ortsveränderliche elektrische Betriebsmittel gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 in angemessenen Intervallen. Als Richtwert nach DGUV Vorschrift 3 Anhang 1 Tabelle 1B gilt: ortsveränderliche Betriebsmittel alle 6–24 Monate, abhängig von Nutzungsintensität und Fehlerquote (< 2 %).',
            rechtlich: 'Ortsveränderliche elektrische Betriebsmittel sind gemäß DGUV Vorschrift 3 in angemessenen Zeitabständen zu prüfen. Ortsveränderliche elektrische Betriebsmittel sind gemäß DGUV Vorschrift 3 Anhang 1 Tabelle 1B als Richtwert alle 6 bis 24 Monate zu prüfen; die konkrete Frist ist anhand der Gefährdungsbeurteilung nach § 3 BetrSichV festzulegen und bei einer Fehlerquote über 2 % zu verkürzen.'
        },
        "3.4": {
            einfach: 'Halten Sie den Pausenraum frei von Lagergut, damit er wirklich der Erholung dient.',
            bghw: 'Stellen Sie gemäß ASR A4.2 und der DGUV Regel 108-601 sicher, dass der Pausenraum primär der Erholung dient und nicht als Lagerfläche zweckentfremdet wird.',
            rechtlich: 'Der Pausenraum ist gemäß ASR A4.2 primär zu Erholungszwecken vorzuhalten und von betrieblichem Lagergut freizuhalten. Die Mindestgröße des Pausenraums richtet sich nach ASR A4.2 Nr. 5 (i. d. R. mind. 6 m² bzw. 1 m² pro gleichzeitig anwesender Person zzgl. Grundfläche).'
        }
    },
    "Erste Hilfe": {        "4.1": {
            einfach: 'Sorgen Sie dafür, dass Erste-Hilfe-Koffer gut sichtbar, leicht erreichbar und richtig gekennzeichnet sind.',
            bghw: 'Positionieren und kennzeichnen Sie Erste-Hilfe-Material gemäß DGUV Information 204-022 und der DGUV Regel 108-601 normgerecht und gut sichtbar.',
            rechtlich: 'Die Standorte der Erste-Hilfe-Koffer müssen den Anforderungen an Sichtbarkeit, Erreichbarkeit und Norm-Kennzeichnung gemäß DGUV Information 204-022 entsprechen. Erste-Hilfe-Material ist gemäß DIN 13157 (kleiner Verbandkasten, bis 50 Beschäftigte) bzw. DIN 13169 (großer Verbandkasten) auszustatten und nach DGUV Information 204-022 gut sichtbar und leicht erreichbar zu positionieren.'
        },
        "4.2": {
            einfach: 'Kontrollieren Sie regelmäßig, ob das Verbandsmaterial vollständig und nicht abgelaufen ist. Kontrollieren Sie das am besten mindestens zweimal im Jahr.',
            bghw: 'Kontrollieren Sie das Erste-Hilfe-Material gemäß DGUV Information 204-022 und der DGUV Regel 108-601 regelmäßig auf Vollständigkeit und Verfallsdaten. Empfohlen wird eine Kontrolle mindestens halbjährlich gemäß DGUV Information 204-022.',
            rechtlich: 'Das Erste-Hilfe-Material ist gemäß DGUV Information 204-022 an allen Standorten vollständig vorzuhalten; die Verfallsdaten steriler Inhalte sind zu überwachen. Das Erste-Hilfe-Material ist gemäß DIN 13157/13169 vollständig vorzuhalten; eine Kontrolle auf Vollständigkeit und Verfallsdaten wird gemäß DGUV Information 204-022 mindestens halbjährlich empfohlen.'
        },
        "4.3": {
            einfach: 'Dokumentieren Sie jede Erste-Hilfe-Leistung sorgfältig.',
            bghw: 'Führen Sie das Verbandbuch gemäß DGUV Information 204-020 und der DGUV Regel 108-601 ordnungsgemäß.',
            rechtlich: 'Die Dokumentation von Erste-Hilfe-Leistungen ist gemäß DGUV Information 204-020 ordnungsgemäß zu führen. Aufzeichnungen über Erste-Hilfe-Leistungen sind gemäß DGUV Information 204-020 mindestens fünf Jahre nach dem Unfalltag aufzubewahren.'
        },
        "4.4": {
            einfach: 'Stellen Sie sicher, dass während der ganzen Öffnungszeit genug ausgebildete Ersthelfer da sind. Für Handel/Verwaltung gilt: bei 2–20 Beschäftigten mind. 1 Ersthelfer, ab 21 Beschäftigten mind. 10 % der Anwesenden.',
            bghw: 'Stellen Sie die nach DGUV Vorschrift 1 und der DGUV Regel 108-601 erforderliche Anzahl ausgebildeter Ersthelfer während der gesamten Öffnungszeit sicher. Für Handel und Verwaltung gilt gemäß § 26 DGUV Vorschrift 1: bei 2–20 Beschäftigten mindestens 1 Ersthelfer, bei mehr als 20 Beschäftigten mindestens 10 %.',
            rechtlich: 'Während der gesamten Öffnungszeit ist die nach DGUV Vorschrift 1 erforderliche Anzahl ausgebildeter Ersthelfer anwesend zu halten. Die Mindestzahl der Ersthelfer ergibt sich aus § 26 Abs. 2 DGUV Vorschrift 1: in Verwaltungs- und Handelsbetrieben bei 2 bis 20 anwesenden Versicherten mindestens 1 Ersthelfer, bei mehr als 20 Versicherten mindestens 10 %; die Anwesenheit ist während der gesamten Öffnungszeit sicherzustellen.'
        },
        "4.5": {
            einfach: 'Hängen Sie die Notrufnummer gut sichtbar aus.',
            bghw: 'Hängen Sie die Notrufnummer gemäß § 10 ArbSchG und der DGUV Regel 108-601 gut sichtbar an zentraler Stelle aus.',
            rechtlich: 'Eine Notrufnummer ist gut sichtbar auszuhängen (§ 10 ArbSchG). Die Notrufnummer 112 (Feuerwehr/Rettungsdienst) ist zusätzlich zu betrieblichen Meldewegen gut sichtbar auszuhängen (§ 10 Abs. 2 ArbSchG).'
        },
        "4.6": {
            einfach: 'Hängen Sie Anweisungen zur Ersten Hilfe gut sichtbar auf.',
            bghw: 'Hängen Sie Erste-Hilfe-Anweisungen gemäß DGUV Information 204-022 und der DGUV Regel 108-601 aus.',
            rechtlich: 'Erste-Hilfe-Anweisungen sind gemäß § 10 ArbSchG bereitzustellen und auszuhängen. Erste-Hilfe-Anweisungen sollten dem DGUV-Aushang „Anleitung zur Ersten Hilfe“ gemäß DGUV Information 204-022 entsprechen.'
        }
    },
    "Elektrische Sicherheit": {        "5.1": {
            einfach: 'Beheben Sie beschädigte Schalter und Steckdosen sofort.',
            bghw: 'Kontrollieren Sie Schalter und Steckdosen gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 regelmäßig auf Beschädigungen und veranlassen Sie ggf. eine Instandsetzung durch eine Elektrofachkraft.',
            rechtlich: 'Schäden an Schaltern und Steckdosen sind unverzüglich durch eine Elektrofachkraft zu beseitigen (DGUV Vorschrift 3). Die Instandsetzung darf nur durch eine Elektrofachkraft oder unter deren Anleitung durch eine elektrotechnisch unterwiesene Person erfolgen (§ 2 DGUV Vorschrift 3).'
        },
        "5.2": {
            einfach: 'Sichern Sie Kabel, die von der Decke hängen, so, dass niemand daran ziehen kann.',
            bghw: 'Sichern Sie von der Decke geführte Leitungen gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 mit geeigneten Zugentlastungen, damit keine Zugkräfte auf die Kontaktstellen wirken.',
            rechtlich: 'Von der Decke geführte Leitungen und Steckverbindungen sind durch geeignete mechanische Zugentlastungen so zu sichern, dass keine Zugkräfte auf die elektrischen Kontaktstellen wirken (DGUV Vorschrift 3). Zugentlastungen sind so zu bemessen, dass keine mechanische Zugkraft auf Steckverbindungen und Anschlussklemmen übertragen wird (DGUV Vorschrift 3, DIN VDE 0100-520).'
        },
        "5.3": {
            einfach: 'Prüfen Sie Steckdosen und Kabel regelmäßig auf Schäden. Als Richtwert gilt: alle 6 bis 24 Monate, je nach Beanspruchung.',
            bghw: 'Kontrollieren Sie Steckdosen und Kabel gemäß DGUV Vorschrift 3 in den von der DGUV Regel 108-601 „Branche Einzelhandel“ empfohlenen Intervallen (ortsveränderliche Betriebsmittel in der Regel jährlich). Als Richtwert nach DGUV Vorschrift 3 Anhang 1 Tabelle 1B gilt: 6–24 Monate für ortsveränderliche Betriebsmittel, 4 Jahre für ortsfeste Anlagen.',
            rechtlich: 'Steckdosen und Kabel sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3). Prüffristen richten sich nach DGUV Vorschrift 3 Anhang 1 Tabelle 1B: als Richtwert 6–24 Monate für ortsveränderliche Betriebsmittel und bis zu 4 Jahre für ortsfeste Anlagen; maßgeblich ist die anhand der Gefährdungsbeurteilung (§ 3 BetrSichV) ermittelte Fehlerquote (Verlängerung nur bei < 2 % Fehlerquote).'
        },
        "5.4": {
            einfach: 'Lassen Sie Kabelverbindungen nicht offen auf dem Boden liegen, z. B. unter Kühltruhen.',
            bghw: 'Vermeiden Sie ungeschützt auf dem Boden liegende Steckverbindungen gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601, insbesondere unter Kühl- und Tiefkühltruhen.',
            rechtlich: 'Elektrische Steckverbindungen dürfen gemäß DGUV Vorschrift 3 nicht ungeschützt auf dem Boden liegen, insbesondere nicht in feuchtigkeitsgefährdeten Bereichen wie unter Kühl- oder Tiefkühltruhen. Feuchtigkeitsgefährdete Bereiche erfordern mindestens Schutzart IP44, in nassen Bereichen entsprechend höher (DIN VDE 0100-737).'
        },
        "5.5": {
            einfach: 'Vermeiden Sie provisorische Verkabelungen – lassen Sie alles fest installieren.',
            bghw: 'Vermeiden Sie provisorische elektrische Installationen gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 und lassen Sie dauerhafte Lösungen durch eine Elektrofachkraft einrichten.',
            rechtlich: 'Provisorische elektrische Installationen sind zu vermeiden und durch fachgerechte, dauerhafte Installationen zu ersetzen (DGUV Vorschrift 3). Elektrische Installationen sind nur durch eine Elektrofachkraft gemäß DIN VDE 0100 zu errichten, zu ändern und zu prüfen (§ 2 DGUV Vorschrift 3).'
        }
    },
    "CO2 Kühleinrichtungen": {        "6.1": {
            einfach: 'Weisen Sie alle, die sich in der Nähe von Kühlanlagen aufhalten, in die Gefahren ein.',
            bghw: 'Unterweisen Sie Beschäftigte im Bereich von CO2-Kühlanlagen gemäß § 12 ArbSchG, DGUV Regel 110-008 und der DGUV Regel 108-601 zu den spezifischen Gefahren.',
            rechtlich: 'Personen, die sich im Bereich von CO2-Kühlanlagen oder Kühlhäusern aufhalten, sind gemäß § 12 ArbSchG und DGUV Regel 110-008 zu unterweisen. Die Unterweisung ist gemäß § 12 ArbSchG vor Aufnahme der Tätigkeit und danach mindestens jährlich zu wiederholen und muss Verhalten bei Alarm sowie Fluchtwege umfassen (DGUV Regel 110-008 Abschn. 5).'
        },
        "6.2": {
            einfach: 'Prüfen Sie, ob sich die Notentriegelung leicht öffnen lässt.',
            bghw: 'Prüfen Sie die Notentriegelung an CO2-Kühlanlagen gemäß DGUV Regel 110-008 (Kälteanlagen mit Kohlendioxid) und der DGUV Regel 108-601 regelmäßig auf Funktion.',
            rechtlich: 'Die Notentriegelung ist gemäß DGUV Regel 110-008 regelmäßig auf Vorhandensein und Funktionsfähigkeit zu prüfen. Die Funktionsprüfung der Notentriegelung ist gemäß DGUV Regel 110-008 in die regelmäßige technische Prüfung der Kälteanlage einzubeziehen und zu dokumentieren.'
        },
        "6.3": {
            einfach: 'Stellen Sie keine Kisten oder Waren vor die Gas-Sensoren.',
            bghw: 'Halten Sie CO2-Sensoren gemäß DGUV Regel 110-008 (Kälteanlagen mit Kohlendioxid) und der DGUV Regel 108-601 frei von Verstellungen, damit die Warnfunktion jederzeit gewährleistet ist.',
            rechtlich: 'Sensoren dürfen gemäß DGUV Regel 110-008 nicht durch Material oder Gegenstände verstellt werden, um die Funktionsfähigkeit der Gaswarnanlage sicherzustellen. Die CO2-Warneinrichtung ist gemäß DGUV Regel 110-008 auf zwei Alarmstufen auszulegen (Voralarm und Hauptalarm) und regelmäßig auf Funktion und freie Zugänglichkeit der Sensoren zu prüfen.'
        },
        "6.4": {
            einfach: 'Prüfen Sie, ob die Beleuchtung im Kühlbereich einwandfrei funktioniert.',
            bghw: 'Kontrollieren Sie die Beleuchtung im Kühlbereich gemäß ASR A3.4 und der DGUV Regel 108-601 regelmäßig auf einwandfreie Funktion.',
            rechtlich: 'Die Beleuchtung im Kühlbereich ist regelmäßig auf Funktionsfähigkeit zu prüfen (ASR A3.4). Als Anhaltswert nach ASR A3.4 gilt für Kühl-/Lagerbereiche eine Mindestbeleuchtungsstärke von etwa 100–200 Lux.'
        },
        "6.5": {
            einfach: 'Kontrollieren Sie Alarmleuchten, Kennzeichnungen und Türen der Kühlanlage regelmäßig.',
            bghw: 'Kontrollieren Sie alle Sicherheitsvorrichtungen (Alarmleuchten, Kennzeichnungen, Kühlhaustüren) gemäß DGUV Regel 110-008 (Kälteanlagen mit Kohlendioxid) und der DGUV Regel 108-601 auf Funktionsfähigkeit.',
            rechtlich: 'Sämtliche Sicherheitsvorrichtungen (Alarmleuchten, Kennzeichnungen, Kühlhaustüren) sind auf Funktionsfähigkeit zu prüfen (DGUV Regel 110-008). Die Prüfung der Sicherheitsvorrichtungen ist gemäß DGUV Regel 110-008 in die wiederkehrende Anlagenprüfung durch eine befähigte Person einzubeziehen und zu dokumentieren.'
        }
    },
    "Kühlhaus": {        "7.1": {
            einfach: 'Prüfen Sie, ob an allen Lampen im Kühlhaus die Schutzkappe montiert ist.',
            bghw: 'Stellen Sie gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 sicher, dass an sämtlichen Leuchten im Kühlhaus die Schutzkappe montiert ist.',
            rechtlich: 'An allen Leuchten im Kühlhaus ist die Schutzkappe (Überwurfkappe) montiert zu halten (DGUV Vorschrift 3). Die Schutzkappe verhindert das Eindringen von Feuchtigkeit und Splittern bei Glasbruch (DGUV Vorschrift 3 i. V. m. DIN VDE 0100-737 für Feuchträume).'
        },
        "7.2": {
            einfach: 'Prüfen Sie, ob sich die Notentriegelung im Kühlhaus leicht öffnen lässt.',
            bghw: 'Prüfen Sie die Notentriegelung im Kühlhaus gemäß DGUV Regel 110-008 (Kälteanlagen mit Kohlendioxid) und der DGUV Regel 108-601 regelmäßig auf Funktion.',
            rechtlich: 'Die Notentriegelung im Kühlhaus ist gemäß DGUV Regel 110-008 regelmäßig auf Vorhandensein und Funktionsfähigkeit zu prüfen. Die Notentriegelung ist gemäß DGUV Regel 110-008 in die regelmäßige technische Prüfung einzubeziehen.'
        },
        "7.3": {
            einfach: 'Kennzeichnen Sie die Innenseite der Kühlhaustüren mit dem Rettungswegschild.',
            bghw: 'Kennzeichnen Sie Kühlhaustüren von innen gemäß ISO 7010 und der DGUV Regel 108-601 mit dem Rettungswegschild.',
            rechtlich: 'Kühlhaustüren sind von innen mit dem Rettungswegschild gemäß ISO 7010 zu kennzeichnen. Die Kennzeichnung hat nach ISO 7010 (E001 „Rettungsweg“) langnachleuchtend zu erfolgen, damit sie bei Stromausfall erkennbar bleibt.'
        },
        "7.4": {
            einfach: 'Prüfen Sie, ob die Beleuchtung im Kühlhaus einwandfrei funktioniert.',
            bghw: 'Kontrollieren Sie die Beleuchtung im Kühlhaus gemäß ASR A3.4 und der DGUV Regel 108-601 regelmäßig auf einwandfreie Funktion.',
            rechtlich: 'Die Beleuchtung im Kühlhaus ist regelmäßig auf Funktionsfähigkeit zu prüfen (ASR A3.4). Als Anhaltswert nach ASR A3.4 gilt für Kühlhäuser eine Mindestbeleuchtungsstärke von etwa 100–150 Lux.'
        },
        "7.5": {
            einfach: 'Prüfen Sie, ob die Notruf-Funktion im Kühlhaus (falls vorhanden) funktioniert und unbeschädigt ist.',
            bghw: 'Prüfen Sie eine vorhandene Notruf-Funktion im Kühlhaus gemäß DGUV Regel 110-008 (Kälteanlagen mit Kohlendioxid) und der DGUV Regel 108-601 regelmäßig auf Funktionsfähigkeit.',
            rechtlich: 'Die Notruf-Funktion im Kühlhaus ist, sofern vorhanden, gemäß DGUV Regel 110-008 regelmäßig auf Funktionsfähigkeit und Unversehrtheit zu prüfen. Eine vorhandene Notruf-Funktion ist gemäß DGUV Regel 110-008 in die regelmäßige Anlagenprüfung einzubeziehen.'
        }
    },
    "Lager und Regale": {        "8.1": {
            einfach: 'Lassen Sie den elektrischen Hubwagen regelmäßig prüfen und beheben Sie Schäden sofort.',
            bghw: 'Lassen Sie den elektrischen Hubwagen gemäß DGUV Vorschrift 68 und der DGUV Regel 108-601 regelmäßig prüfen.',
            rechtlich: 'Der elektrische Hubwagen ist gemäß DGUV Vorschrift 68 wiederkehrend zu prüfen; Schutzeinrichtungen müssen funktionsfähig sein. Der elektrische Hubwagen ist gemäß § 37 Abs. 2 DGUV Vorschrift 68 mindestens jährlich durch eine befähigte Person zu prüfen; das Ergebnis ist in einem Prüfbuch zu dokumentieren.'
        },
        "8.2": {
            einfach: 'Kontrollieren Sie den Gabelhubwagen regelmäßig auf Schäden.',
            bghw: 'Kontrollieren Sie den Gabelhubwagen gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ regelmäßig auf Beschädigungen.',
            rechtlich: 'Der Gabelhubwagen ist gemäß § 3 DGUV Vorschrift 1 regelmäßig auf seinen ordnungsgemäßen Zustand zu prüfen. Für handgeführte Flurförderzeuge ist als Richtwert eine jährliche Prüfung durch eine befähigte Person angemessen (§ 3 Abs. 6 BetrSichV).'
        },
        "8.3": {
            einfach: 'Lassen Sie die Schwerlastregale regelmäßig von einem Fachmann prüfen. Nötig sind eine wöchentliche Sichtkontrolle durch geschultes Personal und eine jährliche Expertenprüfung.',
            bghw: 'Lassen Sie Schwerlastregale gemäß DGUV Information 208-061 und der DGUV Regel 108-601 regelmäßig durch eine befähigte Person prüfen. Erforderlich sind eine wöchentliche Sichtkontrolle durch unterwiesenes Personal sowie mindestens jährlich eine Experteninspektion durch eine befähigte Person gemäß DIN EN 15635 und § 10 BetrSichV.',
            rechtlich: 'Schwerlastregale sind gemäß DGUV Information 208-061 regelmäßig durch eine befähigte Person zu prüfen. Regalanlagen sind gemäß DIN EN 15635 i. V. m. § 10 BetrSichV zweistufig zu prüfen: wöchentliche Sichtkontrolle durch unterwiesenes Personal sowie mindestens jährliche Experteninspektion durch eine befähigte Person (Regalinspekteur); Schadensklassen sind nach dem Ampelsystem (grün/orange/rot) zu bewerten und Rot-Befunde sofort zu sperren.'
        },
        "8.4": {
            einfach: 'Bringen Sie an den Regalen einen Anfahrschutz an.',
            bghw: 'Rüsten Sie Regale gemäß DGUV Information 208-061 und der DGUV Regel 108-601 mit einem geeigneten Anfahrschutz aus.',
            rechtlich: 'Regale sind mit einem geeigneten Anfahrschutz gemäß DGUV Information 208-061 auszurüsten. Anfahrschutz ist gemäß DIN EN 15635 an exponierten Regalständern anzubringen und im Rahmen der wöchentlichen Sichtkontrolle auf Unversehrtheit zu prüfen.'
        },
        "8.5": {
            einfach: 'Bringen Sie an den Schwerlastregalen ein Schild mit der maximalen Traglast an.',
            bghw: 'Kennzeichnen Sie Schwerlastregale gemäß DGUV Information 208-061 und der DGUV Regel 108-601 deutlich mit der zulässigen Traglast.',
            rechtlich: 'Die zulässige Traglast ist an Schwerlastregalen gemäß DGUV Information 208-061 dauerhaft und gut sichtbar anzubringen. Die Traglastangabe ist gemäß DIN EN 15635 dauerhaft, lesbar und feldbezogen anzubringen.'
        },
        "8.6": {
            einfach: 'Bringen Sie an der Rampe eine Absturzsicherung an.',
            bghw: 'Rüsten Sie die Rampe gemäß ASR A2.1 und der DGUV Regel 108-601 mit einer Absturzsicherung aus.',
            rechtlich: 'An der Rampe ist eine Absturzsicherung gemäß ASR A2.1 anzubringen. Absturzsicherungen an Rampen sind gemäß ASR A2.1 Nr. 4 ab einer Absturzhöhe von mehr als 1 m grundsätzlich erforderlich (bei geringerer Höhe abhängig von der Gefährdungsbeurteilung).'
        },
        "8.7": {
            einfach: 'Kontrollieren Sie, ob die Absturzsicherung unbeschädigt und richtig gekennzeichnet ist.',
            bghw: 'Kontrollieren Sie die Absturzsicherung gemäß ASR A2.1 und der DGUV Regel 108-601 regelmäßig auf Beschädigungen und Kennzeichnung.',
            rechtlich: 'Die Absturzsicherung ist regelmäßig auf ihren ordnungsgemäßen Zustand und ihre Kennzeichnung zu prüfen (ASR A2.1). Die Kennzeichnung erfolgt nach ASR A1.3 (Sicherheits- und Gesundheitsschutzkennzeichnung); Beschädigungen sind im Rahmen der wöchentlichen Sichtkontrolle zu erfassen.'
        },
        "8.8": {
            einfach: 'Lassen Sie die Müll-/Papierpresse regelmäßig prüfen.',
            bghw: 'Lassen Sie die Müll-/Papierpresse gemäß § 14 BetrSichV und der DGUV Regel 108-601 regelmäßig prüfen.',
            rechtlich: 'Die Müll-/Papierpresse ist gemäß § 14 BetrSichV wiederkehrend durch eine befähigte Person zu prüfen. Die Müll-/Papierpresse ist gemäß § 14 BetrSichV vor erstmaliger Inbetriebnahme und danach wiederkehrend, als Richtwert mindestens jährlich, durch eine befähigte Person zu prüfen.'
        },
        "8.9": {
            einfach: 'Kontrollieren Sie die Presse auf Schäden, funktionierende Schutzeinrichtungen und festen Stand.',
            bghw: 'Kontrollieren Sie die Müll-/Papierpresse gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ auf Beschädigungen, intakte Schutzeinrichtungen und festen Stand.',
            rechtlich: 'Die Müll-/Papierpresse muss frei von Beschädigungen sein, über intakte Schutzeinrichtungen verfügen und sicher/standfest aufgestellt sein. Die Standsicherheit ist gemäß § 14 BetrSichV Bestandteil der wiederkehrenden Prüfung durch eine befähigte Person.'
        },
        "8.10": {
            einfach: 'Halten Sie die Wege im Lager frei von Stolperfallen.',
            bghw: 'Gestalten Sie die Verkehrswege im Lager gemäß ASR A1.5 und der DGUV Regel 108-601 frei von Stolper-, Rutsch- und Sturzgefahren.',
            rechtlich: 'Verkehrswege im Lager sind gemäß ASR A1.5 frei von Stolper-, Rutsch- und Sturzgefahren zu halten. Mindestbreiten für Verkehrswege im Lager richten sich nach ASR A1.8 (i. d. R. mind. 1,00 m bei Personenverkehr, mehr bei gleichzeitigem Fahrzeugverkehr).'
        }
    },
    "Leergut": {        "9.1": {
            einfach: 'Kontrollieren Sie die Annahmegeräte der Leergutrücknahme regelmäßig und beheben oder ersetzen Sie beschädigte Geräte sofort – achten Sie besonders auf Glasscherben und intakte Schutzvorrichtungen.',
            bghw: 'Kontrollieren und warten Sie die Annahmegeräte der Leergutrücknahme gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ regelmäßig; setzen Sie beschädigte oder defekte Geräte unverzüglich instand oder außer Betrieb und beseitigen Sie Glasbruch umgehend.',
            rechtlich: 'Die Annahmegeräte der Leergutrücknahme sind regelmäßig auf Beschädigungen, Glasscherben und funktionierende Schutzeinrichtungen zu kontrollieren; defekte Geräte sind unverzüglich instand zu setzen oder außer Betrieb zu nehmen. Schutzeinrichtungen an Leergutautomaten unterliegen als Arbeitsmittel der Prüfpflicht nach § 3 BetrSichV; Glasbruch ist als Sofortmaßnahme zu entfernen (Schnittgefahr).'
        },
        "9.2": {
            einfach: 'Weisen Sie Ihre Mitarbeitenden an, die Rollbahnen nicht zu betreten.',
            bghw: 'Weisen Sie Beschäftigte gemäß § 12 ArbSchG und der DGUV Regel 108-601 an, Rollbahnen nicht zu betreten, und kontrollieren Sie die Einhaltung.',
            rechtlich: 'Rollbahnen dürfen nicht betreten werden; die Einhaltung ist im Rahmen der Unterweisung sicherzustellen (§ 12 ArbSchG). Das Verbot ist Bestandteil der Betriebsanweisung und im Rahmen der Unterweisung nach § 12 ArbSchG zu vermitteln.'
        },
        "9.3": {
            einfach: 'Sortieren Sie beschädigte Paletten und Kisten konsequent aus.',
            bghw: 'Sortieren Sie beschädigte Paletten und Kisten gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ konsequent aus, bevor sie erneut verwendet werden.',
            rechtlich: 'Beschädigte Paletten und Kisten sind konsequent auszusortieren und der weiteren Nutzung zu entziehen. Beschädigte Ladungsträger sind gemäß DGUV Information 208-061 der weiteren Nutzung zu entziehen, um Bruch- und Einsturzgefahren zu vermeiden.'
        },
        "9.4": {
            einfach: 'Zeigen Sie den Mitarbeitenden, wie sie Lasten sicher heben und tragen.',
            bghw: 'Unterweisen Sie Beschäftigte gemäß DGUV Information 208-033 und der DGUV Regel 108-601 zum sicheren Aufnehmen und Transportieren von Lasten.',
            rechtlich: 'Lasten sind gemäß Lastenhandhabungsverordnung (LasthandhabV) sicher aufzunehmen und zu transportieren. Nach der Lastenhandhabungsverordnung sind Gefährdungen durch manuelle Lastenhandhabung zu ermitteln und – wo technisch möglich – durch Hilfsmittel zu vermeiden oder zu verringern.'
        },
        "9.5": {
            einfach: 'Stellen Sie die nötige Schutzausrüstung bereit und sorgen Sie dafür, dass sie getragen wird.',
            bghw: 'Stellen Sie die im Leergutbereich erforderliche PSA gemäß PSA-Benutzungsverordnung und der DGUV Regel 108-601 bereit und kontrollieren Sie deren Tragen.',
            rechtlich: 'Die erforderliche persönliche Schutzausrüstung ist gemäß PSA-Benutzungsverordnung zur Verfügung zu stellen und zu tragen. Nach § 2 PSA-Benutzungsverordnung ist geeignete PSA (z. B. Schnittschutzhandschuhe, Sicherheitsschuhe) kostenlos bereitzustellen und deren Tragen zu kontrollieren.'
        },
        "9.6": {
            einfach: 'Entsorgen Sie Glasbruch und Abfälle im Leergutbereich sofort und ordnungsgemäß.',
            bghw: 'Entsorgen Sie Abfälle und Bruchmaterial unverzüglich und ordnungsgemäß und halten Sie die Verkehrs- und Arbeitsbereiche sauber gemäß DGUV Regel 108-601 sowie ASR A1.5.',
            rechtlich: 'Abfälle und Bruchmaterial sind unverzüglich und ordnungsgemäß zu entsorgen. Glasbruch ist unverzüglich zu beseitigen, da er nach ASR A1.5 eine akute Schnitt- und Rutschgefahr darstellt.'
        },
        "9.7": {
            einfach: 'Stapeln Sie Leergut nicht höher, als es sicher ist.',
            bghw: 'Halten Sie die im Rahmen der Gefährdungsbeurteilung (§ 5 ArbSchG) und der DGUV Regel 108-601 „Branche Einzelhandel“ ermittelten maximalen Stapelhöhen im Leergutbereich ein.',
            rechtlich: 'Die zulässigen Stapelhöhen sind gemäß der Gefährdungsbeurteilung nach § 5 ArbSchG einzuhalten. Die maximale Stapelhöhe ist abhängig von Standfestigkeit, Ladungsträgertyp und Bodenbelastbarkeit im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG festzulegen.'
        },
        "9.8": {
            einfach: 'Halten Sie die Lagerfläche sauber und rutschfrei.',
            bghw: 'Halten Sie die Lagerfläche gemäß ASR A1.5 und der DGUV Regel 108-601 sauber und rutschfrei.',
            rechtlich: 'Die Lagerfläche ist sauber und rutschfrei zu halten (ASR A1.5). Rutschgefahren sind durch geeignete Reinigungsintervalle und ggf. rutschhemmende Bodenbeläge nach ASR A1.5 Abschnitt 4 zu vermeiden.'
        },
        "9.9": {
            einfach: 'Sorgen Sie dafür, dass zwischen Rollbahn und Wand mindestens 60 cm Platz zum Durchgehen bleibt (an engen Stellen kurz auch 50 cm).',
            bghw: 'Halten Sie die lichte Breite des Wartungsganges zwischen Rollbahn und Wand gemäß ASR A1.8 und der DGUV Regel 108-601 durchgehend bei mindestens 0,60 m (Engstellen kurzzeitig 0,50 m).',
            rechtlich: 'Die lichte Breite des Wartungsganges zwischen Rollbahn und Wand muss gemäß ASR A1.8 durchgehend mindestens 0,60 m betragen (an Engstellen kurzzeitig 0,50 m zulässig). Die Mindestbreite von 0,60 m orientiert sich an ASR A1.8 Nr. 4 für selten begangene Wartungs- und Kontrollgänge; bei regelmäßigem Personenverkehr ist grundsätzlich eine größere Breite (mind. 0,875 m) vorzusehen.'
        }
    },
    "Praktikanten": {        "10.1": {
            einfach: 'Weisen Sie neue Praktikanten und Schüleraushilfen vor dem ersten Arbeitstag in die Sicherheitsregeln ein. Bei minderjährigen Praktikanten ist die Unterweisung alle sechs Monate zu wiederholen.',
            bghw: 'Führen Sie die Unterweisung von Praktikanten und Schüleraushilfen gemäß § 12 ArbSchG, § 29 JArbSchG (bei Minderjährigen) und der DGUV Regel 108-601 durch. Bei minderjährigen Beschäftigten ist die Unterweisung nach § 29 JArbSchG mindestens halbjährlich zu wiederholen.',
            rechtlich: 'Praktikanten und Schüleraushilfen sind vor Aufnahme der Tätigkeit gemäß § 12 ArbSchG zu unterweisen; bei minderjährigen Beschäftigten ist zusätzlich die halbjährliche Unterweisungspflicht nach § 29 JArbSchG zu beachten. Bei minderjährigen Beschäftigten ist die Unterweisung nach § 29 Abs. 1 JArbSchG mindestens alle sechs Monate zu wiederholen und um die besonderen Beschäftigungsbeschränkungen für Jugendliche (§§ 22 ff. JArbSchG) zu ergänzen.'
        },
        "10.2": {
            einfach: 'Halten Sie schriftlich fest, wer wann unterwiesen wurde.',
            bghw: 'Dokumentieren Sie alle durchgeführten Unterweisungen gemäß § 6 ArbSchG und der DGUV Regel 108-601 rechtssicher und archivieren Sie die Nachweise.',
            rechtlich: 'Dokumentieren Sie alle durchgeführten Unterweisungen rechtskonform und archivieren Sie die Nachweise gemäß § 6 ArbSchG. Die Dokumentation der Unterweisung (Datum, Inhalt, Teilnehmer, Unterschrift) dient als Nachweis im Rahmen der Aufsichtspflichten nach § 6 ArbSchG.'
        },
        "10.3": {
            einfach: 'Fragen Sie nach der Unterweisung nach, ob wirklich alles verstanden wurde.',
            bghw: 'Prüfen Sie das Verständnis der Unterweisungsinhalte gemäß § 12 ArbSchG und der DGUV Regel 108-601, z. B. durch gezielte Rückfragen.',
            rechtlich: 'Vergewissern Sie sich, dass unterwiesene Personen die vermittelten Inhalte verstanden haben, etwa durch Rückfragen oder Lernerfolgskontrollen (§ 12 ArbSchG). Eine formlose Lernerfolgskontrolle (z. B. Rückfragen, kurzer Test) ist als gute Praxis zur Erfüllung der Unterweisungspflicht nach § 12 ArbSchG zu empfehlen.'
        }
    },
    "Arbeitsmedizin": {        "11.1": {
            einfach: 'Bieten Sie Ihren Mitarbeitenden die vorgeschriebenen Gesundheitschecks beim Betriebsarzt an.',
            bghw: 'Bieten Sie arbeitsmedizinische Vorsorge gemäß ArbMedVV und der DGUV Regel 108-601 an.',
            rechtlich: 'Arbeitsmedizinische Vorsorge ist gemäß ArbMedVV anzubieten bzw. zu veranlassen. Zu unterscheiden sind Pflichtvorsorge (zwingend vor und während der Tätigkeit), Angebotsvorsorge (anzubieten) und Wunschvorsorge (auf Verlangen der Beschäftigten) gemäß §§ 4, 5, 5a ArbMedVV; der konkrete Anlass ergibt sich aus Anhang Teil 1–4 ArbMedVV.'
        },
        "11.2": {
            einfach: 'Planen Sie regelmäßige Besuche oder Sprechstunden des Betriebsarztes ein.',
            bghw: 'Planen und dokumentieren Sie die arbeitsmedizinische Betreuung (Begehung/Sprechstunde) gemäß DGUV Vorschrift 2 und der DGUV Regel 108-601 für das laufende Kalenderjahr.',
            rechtlich: 'Die arbeitsmedizinische Betreuung (Begehung oder Sprechstunde) ist gemäß DGUV Vorschrift 2 für das laufende Kalenderjahr zu planen und zu dokumentieren. Umfang und Einsatzzeiten der betriebsärztlichen Betreuung richten sich nach der Betreuungsart (Regelbetreuung/alternative bedarfsorientierte Betreuung) gemäß DGUV Vorschrift 2 Anlage 2.'
        },
        "11.3": {
            einfach: 'Lassen Sie sich vom Betriebsarzt zu Gesundheitsfragen beraten, wenn Bedarf besteht.',
            bghw: 'Nehmen Sie arbeitsmedizinische Beratungsangebote gemäß DGUV Vorschrift 2 und der DGUV Regel 108-601 für Beschäftigte und Führungskräfte in Anspruch.',
            rechtlich: 'Arbeitsmedizinische Beratungen für Beschäftigte oder Führungskräfte sind gemäß DGUV Vorschrift 2 zu ermöglichen. Der Anspruch auf arbeitsmedizinische Beratung ergibt sich u. a. aus § 3 Abs. 3 ArbMedVV (Wunschvorsorge) und § 3 DGUV Vorschrift 2.'
        },
        "11.4": {
            einfach: 'Sorgen Sie mit Hautschutzplan und -produkten dafür, dass die Haut geschützt ist.',
            bghw: 'Setzen Sie Maßnahmen zur Vermeidung von Hauterkrankungen gemäß TRGS 401 und der DGUV Regel 108-601 konsequent um.',
            rechtlich: 'Maßnahmen zur Vermeidung von Hauterkrankungen sind gemäß TRGS 401 zu treffen. Ein betriebsspezifischer Hautschutzplan ist gemäß TRGS 401 Nr. 6 zu erstellen, auszuhängen und regelmäßig zu aktualisieren.'
        },
        "11.5": {
            einfach: 'Setzen Sie die Empfehlungen des Betriebsarztes um und halten Sie sie schriftlich fest.',
            bghw: 'Dokumentieren und setzen Sie Berichte und Empfehlungen des Betriebsarztes gemäß § 3 ArbMedVV und der DGUV Regel 108-601 konsequent um.',
            rechtlich: 'Berichte und Empfehlungen des Betriebsarztes sind zu dokumentieren und im Rahmen der Gefährdungsbeurteilung umzusetzen (§ 3 ArbMedVV). Empfehlungen des Betriebsarztes sind im Rahmen der Fortschreibung der Gefährdungsbeurteilung nach § 3 ArbMedVV zu berücksichtigen und zu dokumentieren.'
        },
        "11.6": {
            einfach: 'Halten Sie Toiletten und Pausenräume sauber, funktionsfähig und gut ausgestattet.',
            bghw: 'Halten Sie sanitäre Anlagen und Pausenräume gemäß ASR A4.1/A4.2 und der DGUV Regel 108-601 sauber, funktionsfähig und ausreichend mit Hygieneartikeln bestückt.',
            rechtlich: 'Sanitäre Anlagen und Pausenräume sind gemäß ASR A4.1 und ASR A4.2 sauber, funktionsfähig und ausreichend mit Hygieneartikeln auszustatten. Sanitärräume sind gemäß ASR A4.1 Nr. 4 mit fließendem Wasser, Seife und Einmalhandtüchern auszustatten.'
        }
    },
    "Backstation": {        "12.1": {
            einfach: 'Kontrollieren Sie Backofen, Backbleche und Brotschneidemaschine regelmäßig auf ihren Zustand.',
            bghw: 'Kontrollieren Sie die Arbeitsgeräte der Backstation gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 regelmäßig auf ihren ordnungsgemäßen Zustand.',
            rechtlich: 'Die Arbeitsgeräte an der Backstation (Backofen, Backbleche, Brotschneidemaschine) sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3). Als Richtwert für ortsfeste Küchen-/Backgeräte gilt eine wiederkehrende Prüfung alle 4 Jahre, für ortsveränderliche Geräte 6–24 Monate (DGUV Vorschrift 3 Anhang 1 Tabelle 1B).'
        },
        "12.2": {
            einfach: 'Beheben Sie ein beschädigtes Handwaschbecken zeitnah.',
            bghw: 'Halten Sie das freistehende Handwaschbecken gemäß ASR A4.1 und der DGUV Regel 108-601 unbeschädigt und funktionsfähig.',
            rechtlich: 'Das freistehende Handwaschbecken ist gemäß ASR A4.1 unbeschädigt und funktionsfähig zu halten. Das Handwaschbecken ist gemäß ASR A4.1 mit Warm-/Kaltwasser, Seifenspender und hygienischer Handtrocknung auszustatten.'
        },
        "12.3": {
            einfach: 'Verlegen Sie Kabel so, dass niemand darüber stolpert, und lassen Sie beschädigte reparieren.',
            bghw: 'Verlegen Sie Elektroleitungen an der Backstation gemäß DGUV Vorschrift 3 und ASR A1.5 stolperfrei und lassen Sie Schäden umgehend beheben.',
            rechtlich: 'Elektroleitungen sind stolperfrei zu verlegen und auf Unversehrtheit zu prüfen (DGUV Vorschrift 3, ASR A1.5). Kabel sind gemäß ASR A1.5 so zu verlegen, dass keine Stolperstellen entstehen; Kabelbrücken oder Unterflurverlegung sind zu bevorzugen.'
        },
        "12.4": {
            einfach: 'Lassen Sie prüfen, ob die Stromzuleitung den geltenden Normen entspricht.',
            bghw: 'Lassen Sie die Zuleitung gemäß DIN VDE 0100 und der DGUV Regel 108-601 durch eine Elektrofachkraft prüfen.',
            rechtlich: 'Die Zuleitung ist auf Konformität mit DIN VDE 0100 zu prüfen. Die Prüfung der Zuleitung durch eine Elektrofachkraft ist gemäß DGUV Vorschrift 3 i. V. m. DIN VDE 0100-600 vor Erstinbetriebnahme und danach wiederkehrend durchzuführen.'
        },
        "12.5": {
            einfach: 'Lassen Sie alle Maschinen prüfen und halten Sie die Ergebnisse schriftlich fest.',
            bghw: 'Lassen Sie alle Maschinen gemäß § 14 BetrSichV und der DGUV Regel 108-601 prüfen und dokumentieren Sie die Ergebnisse.',
            rechtlich: 'Alle Maschinen sind gemäß § 14 BetrSichV zu prüfen; die Prüfungen sind zu dokumentieren. Maschinen an der Backstation sind gemäß § 14 BetrSichV vor erstmaliger Inbetriebnahme und danach wiederkehrend (Richtwert: jährlich) durch eine befähigte Person zu prüfen.'
        },
        "12.6": {
            einfach: 'Kontrollieren Sie, ob alle Schutzvorrichtungen an den Maschinen vorhanden und funktionsfähig sind.',
            bghw: 'Kontrollieren Sie Schutzeinrichtungen an Backstationsmaschinen gemäß § 4 BetrSichV und der DGUV Regel 108-601 regelmäßig auf Vorhandensein und Funktion.',
            rechtlich: 'Schutzeinrichtungen müssen entsprechend der Gefährdungsbeurteilung sicher vorhanden und funktionsfähig sein; die regelmäßige Funktionskontrolle ist nach § 4 Abs. 5 BetrSichV sicherzustellen. Die regelmäßige Funktionskontrolle ist gemäß § 4 Abs. 5 BetrSichV mindestens im Rahmen jeder wiederkehrenden Prüfung sicherzustellen.'
        },
        "12.7": {
            einfach: 'Hängen Sie die Betriebsanweisungen für die Backstation gut sichtbar auf.',
            bghw: 'Hängen Sie Betriebsanweisungen für die Backstation gemäß § 14 GefStoffV, § 4 BetrSichV und der DGUV Regel 108-601 gut sichtbar aus.',
            rechtlich: 'Betriebsanweisungen sind gemäß § 14 GefStoffV bzw. § 4 BetrSichV gut sichtbar auszuhängen. Betriebsanweisungen sind gemäß § 14 Abs. 1 GefStoffV bzw. § 4 BetrSichV verständlich und in der jeweiligen Landessprache der Beschäftigten abzufassen.'
        },
        "12.8": {
            einfach: 'Prüfen Sie den Backhandschuh auf Verschleiß und tauschen Sie ihn bei Bedarf aus.',
            bghw: 'Kontrollieren Sie den Backhandschuh gemäß PSA-Benutzungsverordnung und der DGUV Regel 108-601 regelmäßig auf Verschleiß und ausreichende Stulpenlänge.',
            rechtlich: 'Backhandschuhe sind regelmäßig auf Verschleiß und ausreichende Schutzlänge (Stulpe) zu prüfen (PSA-Benutzungsverordnung). Backhandschuhe sind gemäß PSA-Benutzungsverordnung regelmäßig auf Hitzebeständigkeit und Unversehrtheit zu prüfen und bei Verschleiß unverzüglich zu ersetzen.'
        },
        "12.9": {
            einfach: 'Warten Sie Heißtheken und Fritteusen regelmäßig.',
            bghw: 'Warten Sie Heißgeräte (Heißtheken, Fritteusen) gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 regelmäßig und lassen Sie sie technisch prüfen.',
            rechtlich: 'Heißgeräte sind regelmäßig technisch zu warten und auf einwandfreien Zustand zu prüfen (DGUV Vorschrift 3). Als Richtwert gilt eine wiederkehrende Prüfung ortsveränderlicher Heißgeräte alle 6–24 Monate gemäß DGUV Vorschrift 3.'
        },
        "12.10": {
            einfach: 'Wenn die Brotschneidemaschine defekt ist: sofort ausstecken, ein Warnschild dranhängen und einen Elektriker rufen.',
            bghw: 'Nehmen Sie eine defekte Brotschneidemaschine gemäß BGHW-Vorgaben unverzüglich außer Betrieb, kennzeichnen Sie sie deutlich und veranlassen Sie eine DGUV V3-Prüfung durch eine Elektrofachkraft.',
            rechtlich: 'Gerät sofort sperren (Netzstecker ziehen), mit einem Warnhinweis \'Defekt – Nicht benutzen\' kennzeichnen und eine DGUV V3 Prüfung bzw. Instandsetzung durch eine Elektrofachkraft veranlassen. Nach DGUV Vorschrift 3 ist ein als defekt erkanntes Elektrogerät sofort außer Betrieb zu nehmen und darf erst nach Instandsetzung und Prüfung durch eine Elektrofachkraft wieder genutzt werden.'
        }
    },
    "Serviceabteilung": {        "13.1": {
            einfach: 'Hängen Sie an den Waschplätzen einen aktuellen Hautschutzplan auf.',
            bghw: 'Hängen Sie einen auf die Gefährdungsbeurteilung abgestimmten Hautschutzplan gemäß TRGS 401 und der DGUV Regel 108-601 an den Waschplätzen aus.',
            rechtlich: 'Ein aktueller, auf die Gefährdungsbeurteilung abgestimmter Hautschutzplan ist gemäß TRGS 401 an den Waschplätzen gut sichtbar auszuhängen. Der Hautschutzplan ist gemäß TRGS 401 Nr. 6 auf die konkret verwendeten Reinigungs- und Desinfektionsmittel abzustimmen.'
        },
        "13.2": {
            einfach: 'Stellen Sie Hautschutz- und Pflegecreme bereit.',
            bghw: 'Stellen Sie Hautschutz- und Hautpflegeprodukte gemäß TRGS 401 und der DGUV Regel 108-601 bereit.',
            rechtlich: 'Hautschutz- und Hautpflegeprodukte sind gemäß TRGS 401 zur Verfügung zu stellen. Hautschutz-, Hautreinigungs- und Hautpflegemittel sind gemäß TRGS 401 Nr. 6 als „Drei-Stufen-Plan“ bereitzustellen.'
        },
        "13.3": {
            einfach: 'Kontrollieren Sie die Geräte im Servicebereich regelmäßig auf ihren Zustand.',
            bghw: 'Kontrollieren Sie die Arbeitsgeräte im Servicebereich gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 regelmäßig auf ihren ordnungsgemäßen Zustand.',
            rechtlich: 'Die Arbeitsgeräte im Servicebereich sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3). Als Richtwert gilt eine Prüfung ortsveränderlicher Geräte alle 6–24 Monate gemäß DGUV Vorschrift 3 Anhang 1 Tabelle 1B.'
        },
        "13.4": {
            einfach: 'Prüfen Sie, ob aufgeklappte Thekenscheiben von selbst oben bleiben.',
            bghw: 'Prüfen Sie gemäß § 4 BetrSichV und der DGUV Regel 108-601, dass aufklappbare Thekenscheiben in geöffneter Stellung sicher und selbstständig stehen bleiben.',
            rechtlich: 'Aufklappbare Thekenscheiben müssen gemäß § 4 BetrSichV in der oberen Stellung sicher und selbstständig verharren. Die Standsicherheit aufklappbarer Thekenscheiben in geöffneter Stellung ist Bestandteil der Prüfung nach § 4 BetrSichV (Schutz vor Herabfallen/Quetschung).'
        },
        "13.5": {
            einfach: 'Kleben Sie Markierungen in Augenhöhe an Glastüren und Glaswände.',
            bghw: 'Kennzeichnen Sie Glastüren und Glaswände gemäß ASR A1.7 und der DGUV Regel 108-601 in Augenhöhe, um Anstoßunfälle zu vermeiden.',
            rechtlich: 'Glastüren und Glaswände sind gemäß ASR A1.7 in Augenhöhe deutlich zu kennzeichnen. Die Kennzeichnung großflächiger Verglasungen dient der Vermeidung von Anstoßunfällen; sie sollte in zwei Höhen (ca. 0,90–1,05 m sowie 1,50–1,70 m) angebracht werden, orientiert an ASR A1.7 und DIN 4844-2 (Sicherheitskennzeichnung).'
        },
        "13.6": {
            einfach: 'Reinigen Sie Schneidbretter und Messer regelmäßig und nutzen Sie die Farbcodierung für unterschiedliche Lebensmittel.',
            bghw: 'Reinigen Sie Schneidbretter und Messer regelmäßig und halten Sie das Farbcodierungssystem gemäß LMHV und der DGUV Regel 108-601 ein.',
            rechtlich: 'Schneidbretter und Messer sind entsprechend der betrieblichen Lebensmittelhygiene und dem HACCP-/Hygienekonzept zu reinigen und zu verwenden. Eine bestimmte Farbcodierung ist in der LMHV nicht allgemein vorgeschrieben. Ein Farbcodierungssystem für Schneidbretter/Messer ist eine gängige Praxisempfehlung im Rahmen des betrieblichen HACCP-Konzepts, um Kreuzkontaminationen zu vermeiden; die LMHV selbst schreibt keine bestimmte Farbcodierung vor.'
        },
        "13.7": {
            einfach: 'Verwenden Sie Schneidbretter mit einem sicheren Einschub fürs Messer.',
            bghw: 'Verwenden Sie Schneidbretter mit Messereinschub gemäß § 5 ArbSchG (Gefährdungsbeurteilung) und der DGUV Regel 108-601 zur Schnittverletzungsprävention.',
            rechtlich: 'Es sind Schneidbretter mit Messereinschub gemäß der Gefährdungsbeurteilung nach § 5 ArbSchG zu verwenden. Messereinschübe reduzieren das Schnittverletzungsrisiko und sind Bestandteil der Schutzmaßnahmen nach dem TOP-Prinzip (§ 4 ArbSchG: technisch vor organisatorisch vor personenbezogen).'
        },
        "13.8": {
            einfach: 'Bewahren Sie Messer in einem Messerhalter auf, nicht lose.',
            bghw: 'Nutzen Sie Messerhalter gemäß § 5 ArbSchG (Gefährdungsbeurteilung) und der DGUV Regel 108-601 zur sicheren Aufbewahrung von Schneidwerkzeugen.',
            rechtlich: 'Zur sicheren Aufbewahrung von Messern sind Messerhalter gemäß der Gefährdungsbeurteilung nach § 5 ArbSchG zu verwenden. Eine sichere Aufbewahrung (Messerhalter, Klingenschutz) verhindert Schnittverletzungen beim Greifen in Schubladen oder Spülbecken.'
        },
        "13.9": {
            einfach: 'Kontrollieren Sie die Geräte im Convenience-Bereich regelmäßig.',
            bghw: 'Kontrollieren Sie Convenience-Geräte gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 regelmäßig auf ihren ordnungsgemäßen Zustand.',
            rechtlich: 'Convenience-Geräte sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3). Als Richtwert gilt eine Prüfung ortsveränderlicher Convenience-Geräte alle 6–24 Monate gemäß DGUV Vorschrift 3.'
        },
        "13.10": {
            einfach: 'Sorgen Sie für ausreichend Licht im Servicebereich.',
            bghw: 'Stellen Sie die Beleuchtung im Servicebereich gemäß ASR A3.4 und der DGUV Regel 108-601 sicher.',
            rechtlich: 'Die Beleuchtung im Servicebereich ist gemäß ASR A3.4 ausreichend sicherzustellen. Als Anhaltswert nach ASR A3.4 gilt für Verkaufs-/Servicebereiche eine Mindestbeleuchtungsstärke von etwa 300 Lux.'
        }
    },
    "Kassenzone": {        "14.1": {
            einfach: 'Räumen Sie den Fußraum an der Kasse frei von Gegenständen.',
            bghw: 'Halten Sie den Fußraum an der Kasse gemäß ASR A1.5 und der DGUV Regel 108-601 frei von Gegenständen.',
            rechtlich: 'Der Fußraum im Kassenbereich ist frei von Gegenständen zu halten (ASR A1.5). Der Fußraum ist gemäß ASR A1.2 (Raumabmessungen) i. V. m. ASR A1.5 frei von Kabeln, Kartons und sonstigen Gegenständen zu halten.'
        },
        "14.2": {
            einfach: 'Beheben Sie Schäden am Boden im Kassenbereich zügig.',
            bghw: 'Kontrollieren Sie den Fußboden im Kassenbereich gemäß ASR A1.5 und der DGUV Regel 108-601 regelmäßig auf Schäden.',
            rechtlich: 'Der Fußboden im Kassenbereich ist gemäß ASR A1.5 frei von Beschädigungen zu halten. Schäden am Fußboden (Risse, lose Beläge) sind gemäß ASR A1.5 unverzüglich zu beseitigen.'
        },
        "14.3": {
            einfach: 'Stellen Sie nichts Brennbares an die eingebauten Heizgeräte im Kassenraum.',
            bghw: 'Halten Sie die eingebauten Heizgeräte im Kassenraum gemäß ASR A2.2 und der DGUV Regel 108-601 frei von brennbarem Material.',
            rechtlich: 'Serienmäßig eingebaute Heizgeräte im Kassenraum sind gemäß ASR A2.2 frei von brennbarem Material zu halten. Der erforderliche Sicherheitsabstand zu brennbarem Material an Heizgeräten richtet sich nach den Herstellerangaben und ASR A2.2.'
        },
        "14.4": {
            einfach: 'Prüfen Sie, ob die Kassenstühle noch richtig funktionieren, und tauschen Sie defekte aus.',
            bghw: 'Kontrollieren Sie Kassenstühle gemäß § 3a ArbStättV und der DGUV Regel 108-601 regelmäßig auf Funktionsfähigkeit.',
            rechtlich: 'Kassenstühle sind gemäß § 3a ArbStättV in funktionsfähigem, ergonomisch geeignetem Zustand vorzuhalten. Kassenarbeitsplätze sind ergonomisch nach § 3a ArbStättV i. V. m. ASR A1.2 zu gestalten; höhenverstellbare, standsichere Stühle mit intakten Rollen und Rückenlehne sind vorzuhalten.'
        },
        "14.5": {
            einfach: 'Prüfen Sie das Kassenband auf Schäden und größere Lücken.',
            bghw: 'Kontrollieren Sie das Transportband gemäß DGUV Vorschrift 3 und der DGUV Regel 108-601 regelmäßig auf Beschädigungen und Lücken über 5 mm.',
            rechtlich: 'Das Transportband ist unbeschädigt zu halten; Lücken von über 5 mm sind zu vermeiden (DGUV Vorschrift 3, Verletzungsgefahr). Lücken über 5 mm im Transportband stellen eine Klemm-/Quetschgefahr dar und sind gemäß DGUV Vorschrift 3 unverzüglich zu beheben.'
        },
        "14.6": {
            einfach: 'Räumen Sie Einkaufskörbe ordentlich in den Ständer, damit niemand darüber stolpert.',
            bghw: 'Lagern Sie Einkaufskörbe gemäß ASR A1.5 und der DGUV Regel 108-601 ordnungsgemäß im vorgesehenen Ständer, ohne den Verkehrsweg zu blockieren.',
            rechtlich: 'Einkaufskörbe sind ordnungsgemäß im vorgesehenen Ständer abzulegen; ein Hineinragen in den Verkehrsweg ist zu vermeiden (ASR A1.5). Der Korbständer darf gemäß ASR A1.8 nicht in die Mindestbreite des Verkehrswegs hineinragen.'
        }
    },
    "Gefahrstoffe": {        "15.1": {
            einfach: 'Lagern Sie Gefahrstoffe so, dass sich unterschiedliche Stoffe nicht gefährlich vermischen können.',
            bghw: 'Beachten Sie die Zusammenlagerungsverbote nach TRGS 510 und der DGUV Regel 108-601 konsequent.',
            rechtlich: 'Gefahrstoffe sind unter strikter Beachtung der Zusammenlagerungsverbote nach TRGS 510 (Abschnitt 7 und Anlage 2) zu lagern, sodass gefährliche Wechselwirkungen ausgeschlossen sind. Die Zusammenlagerungsverbote und -beschränkungen ergeben sich aus TRGS 510 Abschnitt 7 i. V. m. Anlage 1 (Zusammenlagerungstabelle).'
        },
        "15.2": {
            einfach: 'Stellen Sie Schutzbrille und Handschuhe für den Umgang mit Gefahrstoffen bereit.',
            bghw: 'Stellen Sie die für Gefahrstoffarbeiten passende PSA gemäß TRGS 400 und der DGUV Regel 108-601 bereit.',
            rechtlich: 'Die passende persönliche Schutzausrüstung (z. B. Schutzbrille, Handschuhe) ist gemäß TRGS 400 für Tätigkeiten mit Gefahrstoffen bereitzustellen. Die konkrete PSA ergibt sich aus dem Sicherheitsdatenblatt (Abschnitt 8) und ist in der Betriebsanweisung nach § 14 GefStoffV festzulegen.'
        },
        "15.3": {
            einfach: 'Halten Sie die vorgeschriebene Schutzausrüstung griffbereit in der Nähe.',
            bghw: 'Halten Sie die in Betriebsanweisungen geforderte PSA gemäß § 14 GefStoffV und der DGUV Regel 108-601 unmittelbar griffbereit vor.',
            rechtlich: 'Die in den Betriebsanweisungen geforderte persönliche Schutzausrüstung ist gemäß § 14 GefStoffV in unmittelbarer Nähe und einsatzbereit vorzuhalten. Die unmittelbare Griffbereitschaft der PSA im Gefahrfall ist gemäß § 14 Abs. 1 GefStoffV sicherzustellen, insbesondere bei Tätigkeiten mit Verätzungs- oder Augenschädigungsrisiko (ggf. Augendusche in der Nähe).'
        },
        "15.4": {
            einfach: 'Halten Sie die Sicherheitsdatenblätter für alle Gefahrstoffe griffbereit.',
            bghw: 'Halten Sie Sicherheitsdatenblätter gemäß Art. 31 REACH-Verordnung und der DGUV Regel 108-601 jederzeit verfügbar.',
            rechtlich: 'Sicherheitsdatenblätter sind gemäß Art. 31 REACH-Verordnung jederzeit verfügbar zu halten. Sicherheitsdatenblätter sind gemäß Art. 31 REACH-Verordnung (EG) Nr. 1907/2006 kostenlos vom Lieferanten bereitzustellen und den betroffenen Beschäftigten in verständlicher Form zugänglich zu machen.'
        },
        "15.5": {
            einfach: 'Weisen Sie Mitarbeitende regelmäßig im sicheren Umgang mit Gefahrstoffen ein.',
            bghw: 'Unterweisen Sie Mitarbeitende gemäß TRGS 555 und § 14 GefStoffV sowie der DGUV Regel 108-601 „Branche Einzelhandel“ regelmäßig zum sicheren Umgang mit Gefahrstoffen.',
            rechtlich: 'Mitarbeiter sind gemäß § 14 GefStoffV regelmäßig zum Umgang mit Gefahrstoffen zu unterweisen. Die Unterweisung ist gemäß § 14 Abs. 2 GefStoffV i. V. m. TRGS 555 vor Aufnahme der Tätigkeit und danach mindestens jährlich zu wiederholen, mündlich und arbeitsplatzbezogen.'
        }
    },
    "Marktleiterbüro": {        "16.1": {
            einfach: 'Führen Sie eine aktuelle Liste aller Anlagen, die regelmäßig geprüft werden müssen, und heften Sie die Prüfberichte dazu ab.',
            bghw: 'Führen und pflegen Sie ein Prüfverzeichnis prüfpflichtiger Anlagen und Einrichtungen gemäß § 3 BetrSichV und der DGUV Regel 108-601 und legen Sie die zugehörigen Prüfberichte vollständig und aktuell vor.',
            rechtlich: 'Prüfungen, Prüffristen und Ergebnisse sind entsprechend den Anforderungen der BetrSichV, insbesondere §§ 3, 14 bis 17, zu ermitteln, zu dokumentieren und nachvollziehbar aufzubewahren. Das Prüfverzeichnis muss nach § 3 Abs. 6 BetrSichV mindestens die geprüften Arbeitsmittel/Anlagen, die festgelegten Prüffristen, das Prüfdatum und den Prüfer benennen.'
        },
        "16.2": {
            einfach: 'Sorgen Sie dafür, dass möglichst wenig Bargeld sichtbar und griffbereit im Büro liegt, damit ein Überfall weniger attraktiv wird.',
            bghw: 'Setzen Sie die im Rahmen der Gefährdungsbeurteilung (§ 5 ArbSchG) und der DGUV Regel 108-601 „Branche Einzelhandel“ empfohlenen organisatorischen und baulichen Maßnahmen zur Überfallprävention um (z. B. Bargeldreduzierung, Zeitschlosstresore, Sichtschutz).',
            rechtlich: 'Geeignete organisatorische und technische Maßnahmen zur Reduzierung des Überfallrisikos sind gemäß Gefährdungsbeurteilung nach § 5 ArbSchG umzusetzen. Maßgeblich sind zusätzlich die Vorgaben der DGUV Vorschrift 25 „Überfallprävention“ und der DGUV Regel 108-010 zu baulich-technischen und organisatorischen Maßnahmen (Zeitschlosstresore, Kassenschleusen, Videoüberwachung, Bargeldlimits).'
        },
        "16.3": {
            einfach: 'Schließen Sie die Bürotür ab, wenn Sie mit Bargeld oder anderen Zahlungsmitteln hantieren.',
            bghw: 'Halten Sie die Tür während sämtlicher Kassiervorgänge und der Bargeldbearbeitung gemäß § 5 ArbSchG und der DGUV Regel 108-601 konsequent verschlossen.',
            rechtlich: 'Während des Umgangs mit Zahlungsmitteln ist die Bürotür im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG verschlossen zu halten. Die Maßnahme ist Bestandteil der Überfallprävention nach DGUV Vorschrift 25 und im betrieblichen Sicherheitskonzept festzulegen.'
        },
        "16.4": {
            einfach: 'Führen Sie mit neuen Mitarbeitenden vor dem ersten Arbeitstag eine Einweisung zu Arbeitssicherheit und Brandschutz durch.',
            bghw: 'Unterweisen Sie neue Beschäftigte vor Tätigkeitsaufnahme gemäß § 12 ArbSchG und der DGUV Regel 108-601 zu Arbeitssicherheit, Brandschutz und betrieblichen Gefährdungen.',
            rechtlich: 'Neue Beschäftigte sind vor Tätigkeitsaufnahme zu Arbeitssicherheit, Brandschutz und betrieblichen Gefährdungen gemäß § 12 ArbSchG zu unterweisen. Die Einweisung ist gemäß § 12 ArbSchG vor Aufnahme der Tätigkeit durchzuführen und deren Inhalt zu dokumentieren.'
        },
        "16.5": {
            einfach: 'Achten Sie darauf, dass der Boden im Büro sauber, unbeschädigt und frei von Stolperfallen ist.',
            bghw: 'Beseitigen Sie Boden-Mängel im Büro umgehend gemäß ASR A1.5 und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Der Fußboden im Büro des Marktleiters ist gemäß ArbStättV i. V. m. ASR A1.5 frei von Schäden, Verschmutzungen und Stolperstellen zu halten. Der Fußboden ist gemäß ASR A1.5 rutschhemmend und frei von Stolperstellen zu halten.'
        }
    },
    "Barrierefreies WC": {        "17.1": {
            einfach: 'Prüfen Sie, ob die Notrufschnur bis maximal 10 cm über dem Boden hängt, damit man sie auch liegend erreicht.',
            bghw: 'Stellen Sie gemäß DIN 18040-1 und der DGUV Regel 108-601 sicher, dass die Notrufschnur maximal 10 cm über dem Fußboden herabhängt.',
            rechtlich: 'Die Notrufschnur muss gemäß DIN 18040-1 bis maximal 10 cm über dem Fußboden herabhängen, um nach einem Sturz erreichbar zu sein. Die Höhe von max. 10 cm über dem Fußboden gewährleistet, dass die Notrufschnur auch von einer liegenden, gestürzten Person erreicht werden kann (DIN 18040-1 Nr. 5.5).'
        },
        "17.2": {
            einfach: 'Sorgen Sie dafür, dass ein Alarm sofort bei einer besetzten Stelle ankommt.',
            bghw: 'Leiten Sie den Alarm gemäß DIN 18040-1 und der DGUV Regel 108-601 an eine ständig besetzte Stelle (z. B. Empfang, Leitwarte) weiter.',
            rechtlich: 'Der Alarm ist gemäß DIN 18040-1 an eine ständig besetzte Stelle weiterzuleiten. Die ständig besetzte Stelle ist gemäß DIN 18040-1 so zu organisieren, dass eine Reaktion auf den Alarm jederzeit, auch außerhalb der Kernöffnungszeiten, sichergestellt ist.'
        },
        "17.3": {
            einfach: 'Testen Sie die Notrufschnüre regelmäßig, mindestens einmal im Monat.',
            bghw: 'Prüfen Sie Zugschnüre und Signalgeber gemäß DIN VDE 0834 und der DGUV Regel 108-601 mindestens monatlich auf Funktion.',
            rechtlich: 'Prüfen Sie die Zugschnüre und Signalgeber gemäß DIN VDE 0834 regelmäßig, mindestens jedoch monatlich, auf ihre einwandfreie Funktion und dokumentieren Sie die Ergebnisse nachvollziehbar. Die monatliche Funktionsprüfung von Zugschnur und Signalgeber gemäß DIN VDE 0834-1 ist zu protokollieren (Datum, Prüfer, Ergebnis).'
        },
        "17.4": {
            einfach: 'Erklären Sie den Mitarbeitenden, was bei einem Alarm zu tun ist.',
            bghw: 'Unterweisen Sie Beschäftigte gemäß § 12 ArbSchG und der DGUV Regel 108-601 zum richtigen Verhalten bei einem Notrufalarm.',
            rechtlich: 'Beschäftigte sind gemäß § 12 ArbSchG über das Verhalten bei einem Alarm zu unterweisen. Die Unterweisung zum Verhalten bei Alarm ist gemäß § 12 ArbSchG regelmäßig zu wiederholen und neuen Beschäftigten unmittelbar zu vermitteln.'
        },
        "17.5": {
            einfach: 'Prüfen Sie, ob sich die WC-Tür im Notfall auch von außen öffnen lässt.',
            bghw: 'Stellen Sie sicher, dass die Tür gemäß DIN 18040-1 und der DGUV Regel 108-601 im Notfall von außen entriegelt werden kann.',
            rechtlich: 'Es ist sicherzustellen, dass die Tür im Notfall gemäß DIN 18040-1 von außen entriegelt werden kann. Die Tür muss gemäß DIN 18040-1 Nr. 5.5 im Notfall von außen entriegelbar sein, ohne dass die Privatsphäre bei normaler Nutzung beeinträchtigt wird.'
        }
    },
    "Notfallmanagement": {        "18.1": {
            einfach: 'Erstellen Sie einen Notfallplan für Ihren Betrieb.',
            bghw: 'Erstellen Sie einen Notfallplan gemäß § 10 ArbSchG und der DGUV Regel 108-601 zur betrieblichen Notfallorganisation.',
            rechtlich: 'Ein Notfallplan ist gemäß § 10 ArbSchG zu erstellen und vorzuhalten. Der Notfallplan ist gemäß § 10 ArbSchG i. V. m. ASR A2.3 (Flucht- und Rettungsplan) zu erstellen, den Beschäftigten bekannt zu machen und regelmäßig zu üben.'
        },
        "18.2": {
            einfach: 'Sorgen Sie dafür, dass alle wissen, was bei Brand, Unfall oder Evakuierung zu tun ist.',
            bghw: 'Vermitteln Sie das Verhalten bei Brand, Unfall und Evakuierung gemäß § 10 ArbSchG und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Das Verhalten bei Brand, Unfall und Evakuierung ist gemäß § 10 ArbSchG regelmäßig zu vermitteln und zu üben. Räumungsübungen sollten als gute Praxis in angemessenen Abständen, z. B. jährlich, durchgeführt werden.'
        },
        "18.3": {
            einfach: 'Legen Sie klar fest, wer im Notfall welche Aufgabe hat.',
            bghw: 'Regeln Sie die Zuständigkeiten im Notfall gemäß § 10 ArbSchG und der DGUV Regel 108-601 eindeutig.',
            rechtlich: 'Zuständigkeiten im Notfall sind gemäß § 10 ArbSchG eindeutig zu regeln und zu dokumentieren. Die Zuständigkeiten (z. B. Räumungshelfer, Ersthelfer, Brandschutzhelfer, Ansprechpartner für Einsatzkräfte) sind gemäß § 10 ArbSchG schriftlich in der Notfallorganisation festzulegen.'
        },
        "18.4": {
            einfach: 'Legen Sie fest, wie im Ernstfall Alarm ausgelöst wird.',
            bghw: 'Regeln Sie die Alarmierung gemäß § 10 ArbSchG und der DGUV Regel 108-601 verbindlich.',
            rechtlich: 'Die Alarmierung ist gemäß § 10 ArbSchG verbindlich zu regeln. Die Alarmierungswege (intern und an Rettungsdienste/Feuerwehr) sind gemäß § 10 ArbSchG eindeutig und redundant zu regeln.'
        }
    },
    "Dokumentation": {        "19.1": {
            einfach: 'Dokumentieren und archivieren Sie jede Erste-Hilfe-Leistung.',
            bghw: 'Führen und archivieren Sie die Dokumentation von Erste-Hilfe-Leistungen gemäß DGUV Information 204-020 und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Die Dokumentation von Erste-Hilfe-Leistungen ist gemäß DGUV Information 204-020 ordnungsgemäß zu führen und aufzubewahren. Die Dokumentation muss mindestens Datum, Hergang, verletzte Person, Art der Verletzung und geleistete Erste Hilfe umfassen (DGUV Information 204-020) und ist mindestens fünf Jahre aufzubewahren.'
        },
        "19.2": {
            einfach: 'Bestellen Sie einen ausgebildeten Sicherheitsbeauftragten.',
            bghw: 'Bestellen Sie einen gemäß § 22 SGB VII und der DGUV Regel 108-601 ausgebildeten Sicherheitsbeauftragten.',
            rechtlich: 'Sicherheitsbeauftragte sind nach § 22 SGB VII unter den dort genannten Voraussetzungen zu bestellen; Auswahl, Aufgaben und erforderliche Qualifizierung sind betrieblich festzulegen. Nach § 22 Abs. 1 SGB VII sind Sicherheitsbeauftragte zu bestellen, wenn dies aufgrund der Zahl der Beschäftigten, der Arbeitsbedingungen oder der Unfall- und Gesundheitsgefahren erforderlich ist; im Einzelhandel wird i. d. R. ab 21 Beschäftigten eine Bestellung erwartet.'
        },
        "19.3": {
            einfach: 'Sorgen Sie dafür, dass immer mindestens ein ausgebildeter Brandschutzhelfer im Laden ist.',
            bghw: 'Stellen Sie gemäß DGUV Information 205-023 und der DGUV Regel 108-601 die ständige Anwesenheit eines Brandschutzhelfers während der Öffnungszeiten sicher.',
            rechtlich: 'Es ist eine ausreichende Zahl von Brandschutzhelferinnen und Brandschutzhelfern zu benennen und auszubilden; die erforderliche Anzahl und Verfügbarkeit ist aus der Gefährdungsbeurteilung und ASR A2.2 abzuleiten (in der Regel mindestens 5 % der Beschäftigten, bei erhöhter Brandgefährdung mehr). Als grober Richtwert der DGUV gilt mindestens 5 % der Beschäftigten als Brandschutzhelfer, bei erhöhter Brandgefährdung oder komplexer Betriebsstruktur entsprechend mehr; ausschlaggebend ist die Gefährdungsbeurteilung.'
        },
        "19.4": {
            einfach: 'Führen Sie mindestens alle 6 Monate eine Schulung zum sicheren Umgang mit Bargeld durch.',
            bghw: 'Führen Sie die Unterweisung zum Umgang mit Zahlungsmitteln gemäß § 12 ArbSchG und der DGUV Regel 108-601 mindestens halbjährlich durch.',
            rechtlich: 'Die Unterweisung zum Umgang mit Zahlungsmitteln ist nach § 12 ArbSchG auf Grundlage der Gefährdungsbeurteilung in angemessenen Abständen und bei maßgeblichen Änderungen zu wiederholen. Ein pauschales halbjährliches Intervall ist nicht allgemein gesetzlich vorgegeben. Ein pauschales halbjährliches Intervall ist zwar nicht gesetzlich zwingend, hat sich aber in der Praxis der Überfallprävention (DGUV Vorschrift 25) als angemessen etabliert.'
        },
        "19.5": {
            einfach: 'Halten Sie alle Unterweisungen schriftlich fest.',
            bghw: 'Dokumentieren Sie alle Unterweisungen gemäß § 12 ArbSchG und der DGUV Regel 108-601 nachvollziehbar und vollständig.',
            rechtlich: 'Die Durchführung der Unterweisung ist nachvollziehbar zu dokumentieren; Inhalt, Zeitpunkt und Teilnehmer sollten aus dem Nachweis hervorgehen. Der Nachweis sollte Datum, Thema, Inhalt, Namen der Teilnehmer und deren Unterschrift enthalten (§ 12 ArbSchG).'
        },
        "19.6": {
            einfach: 'Beziehen Sie neue Abläufe oder Sicherheitstechniken in die nächste Schulung mit ein.',
            bghw: 'Berücksichtigen Sie aktuelle betriebliche Änderungen und neue Sicherheitstechniken gemäß § 12 ArbSchG und der DGUV Regel 108-601 in jeder Unterweisung.',
            rechtlich: 'Aktuelle Änderungen in den betrieblichen Abläufen oder neue Sicherheitstechniken sind bei der Unterweisung gemäß § 12 ArbSchG zu berücksichtigen. Änderungen sind unverzüglich, spätestens bei der nächsten turnusmäßigen Unterweisung, zu berücksichtigen (§ 12 Abs. 1 ArbSchG).'
        },
        "19.7": {
            einfach: 'Erstellen und aktualisieren Sie die Gefährdungsbeurteilung für Ihren Markt.',
            bghw: 'Erstellen und aktualisieren Sie die Gefährdungsbeurteilung gemäß § 5 ArbSchG und der DGUV Regel 108-601 regelmäßig.',
            rechtlich: 'Die Gefährdungsbeurteilung (GBO) ist gemäß § 5 ArbSchG zu erstellen und auf dem aktuellen Stand zu halten. Die Gefährdungsbeurteilung ist gemäß § 3 Abs. 1 BetrSichV bzw. § 5 ArbSchG bei Bedarf, mindestens aber bei wesentlichen Änderungen der Arbeitsbedingungen, zu aktualisieren.'
        }
    },
    "Psychische Belastung": {        "20.1": {
            einfach: 'Berücksichtigen Sie Wünsche der Mitarbeitenden bei der Dienstplanung, wo es geht.',
            bghw: 'Berücksichtigen Sie Beschäftigtenwünsche gemäß der Gefährdungsbeurteilung psychischer Belastung nach § 5 ArbSchG (vgl. DGUV Information 206-007) und der DGUV Regel 108-601 bei der Arbeitsplanung.',
            rechtlich: 'Arbeitszeit und Arbeitsorganisation sind im Rahmen der Gefährdungsbeurteilung psychischer Belastungen zu beurteilen und erforderlichenfalls anzupassen (§§ 3, 5 ArbSchG). Psychische Belastungen sind seit der ArbSchG-Novelle 2013 gemäß § 5 Abs. 3 Nr. 6 ArbSchG ausdrücklicher Bestandteil der Gefährdungsbeurteilung; die GDA-Leitlinie „Gefährdungsbeurteilung psychischer Belastung“ konkretisiert die Vorgehensweise.'
        },
        "20.2": {
            einfach: 'Sorgen Sie dafür, dass Pausen wirklich eingehalten werden.',
            bghw: 'Setzen Sie die Pausenregelung gemäß § 4 ArbZG und der DGUV Regel 108-601 konsequent um.',
            rechtlich: 'Die Pausenregelung ist gemäß § 4 ArbZG konsequent umzusetzen. Ruhepausen sind gemäß § 4 ArbZG bei einer Arbeitszeit von mehr als 6 bis 9 Stunden mindestens 30 Minuten, bei mehr als 9 Stunden mindestens 45 Minuten einzuhalten.'
        },
        "20.3": {
            einfach: 'Vermeiden Sie unnötige Überstunden.',
            bghw: 'Begrenzen Sie Überstunden im Rahmen der Gefährdungsbeurteilung psychischer Belastung nach § 5 ArbSchG und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Arbeitszeit und Überstunden sind unter Beachtung des Arbeitszeitgesetzes und der Gefährdungsbeurteilung zu gestalten; insbesondere sind die Höchstarbeitszeiten und Ruhezeiten nach dem ArbZG einzuhalten (§§ 3, 5 ArbSchG; ArbZG). Die Höchstarbeitszeit beträgt gemäß § 3 ArbZG grundsätzlich 8 Stunden werktäglich (Verlängerung auf bis zu 10 Stunden nur bei Ausgleich innerhalb von 6 Kalendermonaten); die Ruhezeit zwischen zwei Arbeitstagen muss gemäß § 5 ArbZG mindestens 11 Stunden betragen.'
        },
        "20.4": {
            einfach: 'Führen Sie regelmäßige Teambesprechungen durch.',
            bghw: 'Führen Sie regelmäßige Teambesprechungen gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung und der DGUV Regel 108-601 zur betrieblichen Organisation durch.',
            rechtlich: 'Regelmäßige Teambesprechungen können als organisatorische Maßnahme zur Umsetzung der Gefährdungsbeurteilung, Unterweisung und Kommunikation eingesetzt werden; § 3 ArbSchG schreibt jedoch keine bestimmte Besprechungsform vor. Regelmäßige Teambesprechungen sind eine anerkannte organisatorische Maßnahme im Rahmen der Gefährdungsbeurteilung psychischer Belastung nach § 5 Abs. 3 Nr. 6 ArbSchG.'
        },
        "20.5": {
            einfach: 'Sorgen Sie für eine gute Einarbeitung neuer Mitarbeitender.',
            bghw: 'Stellen Sie eine strukturierte Einarbeitung gemäß § 12 ArbSchG und der DGUV Regel 108-601 für neue Mitarbeitende sicher.',
            rechtlich: 'Neue Beschäftigte sind vor Aufnahme der Tätigkeit und bei relevanten Änderungen tätigkeitsbezogen zu unterweisen (§ 12 ArbSchG); die Einarbeitung ist entsprechend der Gefährdungsbeurteilung zu organisieren. Eine strukturierte Einarbeitung ist als organisatorische Maßnahme im Sinne der Gefährdungsbeurteilung psychischer Belastung (§ 5 Abs. 3 Nr. 6 ArbSchG) zu werten, insbesondere zur Vermeidung von Überforderung.'
        },
        "20.6": {
            einfach: 'Führen Sie eine Unterweisung zu Brand- und Arbeitsschutz durch.',
            bghw: 'Führen Sie die Unterweisung zu Brand- und Arbeitsschutz gemäß § 12 ArbSchG und der DGUV Regel 108-601 regelmäßig durch.',
            rechtlich: 'Eine Unterweisung zum Thema Brand- und Arbeitsschutz ist gemäß § 12 ArbSchG durchzuführen. Die Unterweisung ist gemäß § 12 ArbSchG mindestens jährlich zu wiederholen.'
        },
        "20.7": {
            einfach: 'Richten Sie ein schwarzes Brett im Sozialraum oder Kassenbüro ein.',
            bghw: 'Richten Sie gemäß der DGUV Regel 108-601 „Branche Einzelhandel“ zur innerbetrieblichen Kommunikation ein schwarzes Brett im Sozialraum oder Kassenbüro ein.',
            rechtlich: 'Ein Aushang (schwarzes Brett) ist im Sozialraum oder Kassenbüro zur innerbetrieblichen Information vorzuhalten. Ein Aushang zur innerbetrieblichen Kommunikation dient der Umsetzung der Beteiligungs- und Informationspflichten nach § 3 ArbSchG.'
        },
        "20.8": {
            einfach: 'Erklären Sie Entscheidungen offen und nachvollziehbar.',
            bghw: 'Kommunizieren Sie Entscheidungen gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung und der DGUV Regel 108-601 zu psychischer Gesundheit transparent.',
            rechtlich: 'Betriebliche Entscheidungen sind den Beschäftigten im Rahmen der arbeitgeberseitigen Fürsorgepflicht (§ 618 BGB, § 3 ArbSchG) transparent zu erläutern. Transparente Kommunikation ist Ausdruck der arbeitgeberseitigen Fürsorgepflicht nach § 618 BGB und trägt zur Reduzierung psychischer Fehlbelastung bei.'
        },
        "20.9": {
            einfach: 'Loben Sie gute Leistungen.',
            bghw: 'Geben Sie gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung und der DGUV Regel 108-601 regelmäßig positives Feedback bei guter Leistung.',
            rechtlich: 'Positives Feedback kann eine geeignete organisatorische Maßnahme gegen psychische Belastungen sein; eine ausdrückliche gesetzliche Pflicht zu Lob besteht nicht. Maßgeblich ist die Gefährdungsbeurteilung psychischer Belastungen nach § 5 ArbSchG. Positives Feedback ist eine anerkannte Maßnahme im Handlungsfeld „Führung“ der Gefährdungsbeurteilung psychischer Belastung nach § 5 Abs. 3 Nr. 6 ArbSchG.'
        },
        "20.10": {
            einfach: 'Üben Sie Kritik sachlich und fair.',
            bghw: 'Üben Sie konstruktive Kritik gemäß § 75 BetrVG und der DGUV Regel 108-601 sachlich und wertschätzend.',
            rechtlich: 'Führen Sie Kritikgespräche sachlich, fair und respektvoll. Die konkrete Ausgestaltung ist Bestandteil einer geeigneten betrieblichen Organisation und Führungskultur. Konstruktive Kritikkultur zählt zu den organisatorischen Maßnahmen der Gefährdungsbeurteilung psychischer Belastung; § 75 BetrVG verpflichtet zusätzlich zur fairen, gleichbehandelnden Behandlung der Beschäftigten.'
        },
        "20.11": {
            einfach: 'Hängen Sie Infos zur Suchtprävention aus.',
            bghw: 'Hängen Sie Informationen zur Suchtprävention gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung und der DGUV Regel 108-601 gut sichtbar aus.',
            rechtlich: 'Stellen Sie einen gut sichtbaren Aushang mit Informationen zur Suchtprävention bereit und verweisen Sie auf innerbetriebliche Hilfsangebote (§ 3 ArbSchG). Suchtprävention ist Bestandteil der allgemeinen Fürsorgepflicht nach § 3 ArbSchG; Hinweise auf innerbetriebliche und externe Beratungsangebote (z. B. Suchtberatungsstellen) sollten enthalten sein.'
        },
        "20.12": {
            einfach: 'Bieten Sie erkrankten Mitarbeitenden Unterstützung bei der Rückkehr an den Arbeitsplatz.',
            bghw: 'Implementieren Sie ein betriebliches Eingliederungsmanagement gemäß § 167 SGB IX und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Ein betriebliches Eingliederungsmanagement ist nach § 167 Abs. 2 SGB IX anzubieten, wenn Beschäftigte innerhalb eines Jahres länger als sechs Wochen ununterbrochen oder wiederholt arbeitsunfähig sind. Das BEM-Gespräch ist den Beschäftigten anzubieten; die Teilnahme ist freiwillig, die Nichtteilnahme darf keine Nachteile zur Folge haben.'
        },
        "20.13": {
            einfach: 'Vermeiden Sie, dass Mitarbeitende allein arbeiten, wo es sich vermeiden lässt.',
            bghw: 'Vermeiden Sie Alleinarbeit im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG und der DGUV Regel 108-601, insbesondere bei erhöhtem Überfallrisiko.',
            rechtlich: 'Alleinarbeit ist im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG möglichst zu vermeiden. Bei erhöhtem Überfall- oder Gewaltrisiko sind ergänzend die Vorgaben der DGUV Vorschrift 25 „Überfallprävention“ zu Alleinarbeit zu berücksichtigen.'
        },
        "20.14": {
            einfach: 'Sorgen Sie für Unterstützung, falls jemand einen Überfall erlebt hat.',
            bghw: 'Organisieren Sie die Betreuung nach einem Überfall gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung und der DGUV Regel 108-601 (z. B. Nachsorge, psychologische Erstbetreuung).',
            rechtlich: 'Maßnahmen zur Betreuung von Beschäftigten nach Überfall- oder Gewaltvorfällen sind gemäß § 3 ArbSchG organisatorisch sicherzustellen. Psychologische Erstbetreuung nach traumatisierenden Ereignissen (z. B. Raubüberfall) ist als Maßnahme der Gefährdungsbeurteilung nach § 3 ArbSchG sowie DGUV Vorschrift 25 zu organisieren; die gesetzliche Unfallversicherung übernimmt ggf. die Kosten der Traumanachsorge.'
        },
        "20.15": {
            einfach: 'Bieten Sie Schulungen an, wie man in gefährlichen Situationen reagiert.',
            bghw: 'Bieten Sie Schulungen zum Umgang mit aggressiven oder gewalttätigen Situationen gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung und der DGUV Regel 108-601 an.',
            rechtlich: 'Schulungen zum Umgang mit aggressiven oder gewalttätigen Situationen sind gemäß § 3 ArbSchG anzubieten. Deeskalationsschulungen sind eine anerkannte Präventionsmaßnahme im Rahmen der DGUV Vorschrift 25 „Überfallprävention“ und der Gefährdungsbeurteilung nach § 3 ArbSchG.'
        },
        "20.16": {
            einfach: 'Hören Sie auf Vorschläge Ihrer Mitarbeitenden und beziehen Sie sie ein.',
            bghw: 'Beziehen Sie Mitarbeiteranregungen gemäß der DGUV Regel 108-601 „Branche Einzelhandel“ zur Mitarbeiterbeteiligung aktiv in betriebliche Entscheidungen ein.',
            rechtlich: 'Beschäftigte sind im Rahmen der einschlägigen Beteiligungsrechte und der betrieblichen Organisation angemessen einzubeziehen; konkrete Beteiligungsrechte können sich insbesondere aus dem BetrVG ergeben. Beteiligungsrechte der Beschäftigten ergeben sich insbesondere aus § 81 BetrVG (Unterrichtungs- und Erörterungsrecht) sowie ggf. betrieblichen Vorschlagswesen-Regelungen.'
        },
        "20.17": {
            einfach: 'Bieten Sie Ihren Mitarbeitenden Weiterbildungen an.',
            bghw: 'Schaffen Sie Weiterbildungsangebote gemäß § 82 BetrVG und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Weiterbildungsmaßnahmen sind entsprechend dem betrieblichen Bedarf und den festgestellten Qualifikationsanforderungen zu planen. § 82 BetrVG regelt insbesondere das Gespräch über berufliche Entwicklung und Weiterbildung und begründet nicht pauschal eine allgemeine Schulungspflicht. § 82 Abs. 2 BetrVG begründet einen Anspruch auf ein Gespräch über die berufliche Entwicklung; eine allgemeine Fortbildungspflicht des Arbeitgebers besteht daraus nicht.'
        }
    },
    "Kundenaufzug": {        "21.1": {
            einfach: 'Beheben Sie äußere Schäden an Kabine, Türen, Boden oder Beleuchtung des Kundenaufzugs umgehend und lassen Sie eine fehlende oder unleserliche Tragfähigkeitsangabe erneuern.',
            bghw: 'Veranlassen Sie die Instandsetzung äußerer Schäden am Kundenaufzug gemäß TRBS 3121 sowie der DGUV Regel 108-601 umgehend und stellen Sie eine gut lesbare Tragfähigkeitsangabe sicher.',
            rechtlich: 'Äußere Schäden an Kabine, Türen, Boden oder Beleuchtung des Kundenaufzugs sind unverzüglich zu beseitigen; die zulässige Tragfähigkeit ist gemäß BetrSichV deutlich sichtbar anzugeben. Die Tragfähigkeitsangabe ist gemäß Aufzugsrichtlinie 2014/33/EU i. V. m. BetrSichV dauerhaft und gut lesbar anzubringen.'
        },
        "21.2": {
            einfach: 'Lassen Sie defekte Aufzugstüren, Lichtschranken oder Türsensoren sofort reparieren und halten Sie die Zugänge frei von Stolperstellen.',
            bghw: 'Veranlassen Sie die Instandsetzung von Aufzugstüren, Lichtschranken und Türsensoren gemäß TRBS 3121 sowie der DGUV Regel 108-601 unverzüglich und beseitigen Sie Stolperstellen im Zugangsbereich.',
            rechtlich: 'Defekte Aufzugstüren, Lichtschranken oder Türsensoren sind unverzüglich instand zu setzen; die Zugänge sind gemäß ASR A1.5 frei von Stolperstellen zu halten. Lichtschranken/Türsensoren unterliegen als Sicherheitsbauteile der Aufzugsrichtlinie 2014/33/EU der regelmäßigen Funktionsprüfung im Rahmen der Wartung.'
        },
        "21.3": {
            einfach: 'Lassen Sie defekte Bedientasten, die Notruftaste oder die Etagenanzeige umgehend reparieren und sorgen Sie für verständliche Beschriftung.',
            bghw: 'Veranlassen Sie die Instandsetzung von Bedientasten, Notruftaste und Etagenanzeige gemäß TRBS 3121 sowie der DGUV Regel 108-601 und stellen Sie eine verständliche Beschriftung sicher.',
            rechtlich: 'Bedientasten, Notruftaste sowie Etagen- bzw. Fahrtrichtungsanzeige sind funktionsfähig zu halten und verständlich zu beschriften. Notruftaste und Etagenanzeige sind Bestandteil der Sicherheitsausrüstung nach EN 81-28 (Notrufsystem) und im Rahmen der Wartung zu prüfen.'
        },
        "21.4": {
            einfach: 'Lassen Sie die Notrufeinrichtung reparieren und schulen Sie das Personal, wie es sich bei eingeschlossenen Kunden verhält.',
            bghw: 'Veranlassen Sie die Instandsetzung der Notrufeinrichtung gemäß TRBS 3121 sowie der DGUV Regel 108-601 und unterweisen Sie das Personal zum Verhalten bei eingeschlossenen Personen.',
            rechtlich: 'Eine funktionsfähige Notrufeinrichtung ist sicherzustellen; das Personal ist gemäß § 12 ArbSchG zum Verhalten bei eingeschlossenen Personen zu unterweisen. Eine eigenständige Befreiung durch Personal ist zu unterlassen. Eine eigenständige Befreiung eingeschlossener Personen durch nicht befähigtes Personal ist wegen erheblicher Verletzungsgefahr zu unterlassen (TRBS 3121 Nr. 4.2).'
        },
        "21.5": {
            einfach: 'Holen Sie die fällige Aufzugsprüfung nach, beheben Sie offene Mängel aus dem letzten Prüfbericht und legen Sie die Prüfbescheinigung vor. Die Hauptprüfung durch eine zugelassene Überwachungsstelle (ZÜS) ist gesetzlich spätestens alle zwei Jahre Pflicht.',
            bghw: 'Veranlassen Sie die fristgerechte wiederkehrende Prüfung gemäß § 16 BetrSichV und der DGUV Regel 108-601, arbeiten Sie festgestellte Mängel vollständig ab und halten Sie die Prüfbescheinigung bereit. Die ZÜS-Hauptprüfung darf gemäß § 16 i. V. m. Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV im Abstand von höchstens zwei Jahren erfolgen.',
            rechtlich: 'Die wiederkehrende Prüfung des Aufzugs ist gemäß § 16 BetrSichV durch eine zugelassene Überwachungsstelle (ZÜS) fristgerecht durchzuführen; festgestellte Mängel sind vollständig abzuarbeiten und die Prüfbescheinigung ist vorzuhalten. Die vom Arbeitgeber nach § 3 Abs. 6 BetrSichV festzulegende Prüffrist der ZÜS-Hauptprüfung darf gemäß Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV zwei Jahre nicht überschreiten; stellt die ZÜS eine unzutreffende Frist fest, ist diese in Abstimmung mit ihr zu verkürzen (§ 16 Abs. 2 BetrSichV).'
        },
        "21.6": {
            einfach: 'Räumen Sie Waren und Lagergut vor den Aufzugstüren weg und sorgen Sie für einen ebenen, gut beleuchteten Bereich.',
            bghw: 'Halten Sie die Bereiche vor den Aufzugstüren gemäß ASR A3.4 und der DGUV Regel 108-601 frei von Waren und Lagergut und sorgen Sie für ausreichende Beleuchtung.',
            rechtlich: 'Die Bereiche vor den Aufzugstüren sind freizuhalten, eben zu gestalten und gemäß ASR A3.4 ausreichend zu beleuchten. Die Beleuchtung im Zugangsbereich richtet sich nach ASR A3.4 (Anhaltswert i. d. R. mind. 100–200 Lux).'
        },
        "21.7": {
            einfach: 'Prüfen Sie, ob der Aufzug für Kunden inkl. Einkaufswagen und mobilitätseingeschränkte Personen geeignet ist, und bringen Sie verständliche Hinweise bei Störungen an.',
            bghw: 'Stellen Sie die Eignung des Aufzugs für den Kundenverkehr (Einkaufswagen, Barrierefreiheit) gemäß TRBS 3121 sowie der DGUV Regel 108-601 sicher und bringen Sie verständliche Störungshinweise an.',
            rechtlich: 'Die Eignung des Aufzugs für die vorgesehene Kundennutzung, einschließlich Einkaufswagen und mobilitätseingeschränkter Personen, ist sicherzustellen; Hinweise bei Störungen sind verständlich anzubringen. Barrierefreiheit richtet sich nach DIN 18040-1 (Kabinenmaße, Bedienelemente in Greifhöhe, taktile/akustische Signale).'
        },
        "21.8": {
            einfach: 'Legen Sie schriftlich fest, wer im Notfall für die Befreiung eingeschlossener Personen zuständig ist, hinterlegen Sie eine Notbefreiungsanleitung vor Ort und beim Notdienst, schulen Sie das Personal in Erstmaßnahmen (Beruhigung, Zugang, Feuerwehr-Einweisung) und sorgen Sie für einen Ersatz-Notdienst, falls der reguläre ausfällt.',
            bghw: 'Regeln und dokumentieren Sie die Zuständigkeit für die Notbefreiung sowie die Alarmierungskette gemäß TRBS 3121 sowie der DGUV Regel 108-601, hinterlegen Sie die Notbefreiungsanleitung vor Ort und beim Notdienst, schulen Sie das Personal in Erstmaßnahmen und stellen Sie eine redundante Notdienst-Absicherung sicher.',
            rechtlich: 'Die Zuständigkeit für die Notbefreiung (intern/extern/kombiniert) sowie die Alarmierungskette (Notdienst → Objektpersonal → ggf. Feuerwehr) sind gemäß TRBS 3121 schriftlich zu regeln und zu dokumentieren; eine Notbefreiungsanleitung ist vor Ort und beim Notdienst vorzuhalten. Das Personal ist gemäß § 12 ArbSchG in Erstmaßnahmen zu schulen; eine Redundanz für den Ausfall des externen Dienstes ist sicherzustellen. Nach TRBS 3121 Nr. 4.2 muss die Notbefreiung innerhalb einer angemessenen Frist (Praxisorientierung: i. d. R. innerhalb von 30 Minuten) sichergestellt sein.'
        },
        "21.9": {
            einfach: 'Erstellen Sie eine schriftliche Alarmierungskette für Aufzugsstörungen und eingeschlossene Personen und machen Sie sie allen Beteiligten bekannt.',
            bghw: 'Dokumentieren Sie die Alarmierungs- und Eskalationskette für Aufzugsstörungen gemäß TRBS 3121 sowie der DGUV Regel 108-601 und stellen Sie deren Bekanntheit beim zuständigen Personal sicher.',
            rechtlich: 'Eine dokumentierte Alarmierungs- und Eskalationskette für Aufzugsstörungen bzw. eingeschlossene Personen ist gemäß TRBS 3121 zu erstellen und dem zuständigen Personal bekannt zu machen. Die Alarmierungskette ist gemäß TRBS 3121 Nr. 4.2 schriftlich zu regeln und beim Notdienst sowie am Aufzug selbst (Notrufsystem nach EN 81-28) zu hinterlegen.'
        },
        "21.10": {
            einfach: 'Halten Sie die Kontaktdaten des Aufzugsnotdienstes aktuell und sorgen Sie dafür, dass das Personal jederzeit darauf zugreifen kann.',
            bghw: 'Stellen Sie die jederzeitige Verfügbarkeit aktueller Kontaktdaten des Aufzugsnotdienstes für das Objektpersonal gemäß TRBS 3121 sowie der DGUV Regel 108-601 sicher.',
            rechtlich: 'Die Kontaktdaten des zuständigen Aufzugsnotdienstes sind aktuell zu halten und dem Objektpersonal jederzeit zugänglich zu machen. Die Erreichbarkeit der Kontaktdaten (z. B. am Notruf-Display, im Marktleiterbüro) ist gemäß TRBS 3121 sicherzustellen.'
        },
        "21.11": {
            einfach: 'Legen Sie eine Notbefreiungsanleitung bzw. eine schriftliche Vorgehensweise für den Störungsfall vor Ort bereit.',
            bghw: 'Hinterlegen Sie eine Notbefreiungsanleitung bzw. dokumentierte Vorgehensweise für den Störungsfall gemäß TRBS 3121 sowie der DGUV Regel 108-601 vor Ort.',
            rechtlich: 'Eine Notbefreiungsanleitung bzw. dokumentierte Vorgehensweise für den Störungsfall ist gemäß TRBS 3121 vor Ort bereitzuhalten. Die Notbefreiungsanleitung sollte mindestens die Schritte zur Kontaktaufnahme, Beruhigung eingeschlossener Personen und Alarmierung der Feuerwehr enthalten (TRBS 3121).'
        },
        "21.12": {
            einfach: 'Legen Sie fest, wie das Personal im Notfall die Einsatzkräfte bzw. den Aufzugsnotdienst zum betroffenen Aufzug einweist.',
            bghw: 'Regeln Sie die Einweisung der Einsatzkräfte bzw. des Aufzugsnotdienstes zum betroffenen Aufzug durch das Objektpersonal gemäß TRBS 3121 sowie der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Es ist zu regeln, wie das Objektpersonal im Notfall die Einsatzkräfte bzw. den Aufzugsnotdienst zum betroffenen Aufzug einweist. Die Einweisung der Einsatzkräfte umfasst insbesondere die eindeutige Standortangabe des betroffenen Aufzugs und den Zugang zum Maschinenraum bzw. Schachtzugang gemäß TRBS 3121.'
        },
        "21.13": {
            einfach: 'Schulen Sie das zuständige Personal in den Erstmaßnahmen bei eingeschlossenen Personen.',
            bghw: 'Unterweisen Sie das zuständige Personal in den erforderlichen Erstmaßnahmen bei eingeschlossenen Personen gemäß § 12 ArbSchG, TRBS 3121 und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Das zuständige Personal ist gemäß § 12 ArbSchG in den erforderlichen Erstmaßnahmen bei eingeschlossenen Personen zu unterweisen. Die Unterweisung ist gemäß § 12 ArbSchG mindestens jährlich zu wiederholen und praxisnah (z. B. anhand einer Checkliste) zu gestalten.'
        },
        "21.14": {
            einfach: 'Stellen Sie sicher, dass eingeschlossene Personen bis zum Eintreffen des Fachpersonals betreut und beruhigt werden.',
            bghw: 'Stellen Sie eine angemessene Betreuung und Beruhigung eingeschlossener Personen bis zum Eintreffen des zuständigen Fachpersonals gemäß TRBS 3121 sowie der DGUV Regel 108-601 sicher.',
            rechtlich: 'Es ist sicherzustellen, dass eingeschlossene Personen bis zum Eintreffen des zuständigen Fachpersonals angemessen betreut und beruhigt werden. Die Betreuung eingeschlossener Personen ist Bestandteil der Fürsorgepflicht nach § 618 BGB und TRBS 3121.'
        },
        "21.15": {
            einfach: 'Legen Sie eine Vertretungsregelung fest, falls der Aufzugsnotdienst einmal nicht erreichbar ist.',
            bghw: 'Richten Sie eine Vertretungs- bzw. Redundanzregelung für den Ausfall des zuständigen Aufzugsnotdienstes gemäß TRBS 3121 sowie der DGUV Regel 108-601 ein.',
            rechtlich: 'Für den Fall der Nichterreichbarkeit des zuständigen Aufzugsnotdienstes ist eine Vertretungs- bzw. Redundanzregelung vorzuhalten. Eine Vertretungsregelung stellt sicher, dass die Notbefreiungsfrist gemäß TRBS 3121 auch bei Ausfall des regulären Dienstleisters eingehalten werden kann.'
        }
    },
    "Lastenaufzug": {        "22.1": {
            einfach: 'Beheben Sie äußere Schäden an Kabine, Türen, Boden, Beleuchtung oder Bedienelementen des Lastenaufzugs umgehend.',
            bghw: 'Veranlassen Sie die Instandsetzung äußerer Schäden am Lastenaufzug gemäß TRBS 3121 sowie der DGUV Regel 108-601 umgehend.',
            rechtlich: 'Äußere Schäden an Kabine, Türen, Boden, Beleuchtung oder Bedienelementen des Lastenaufzugs sind unverzüglich zu beseitigen. Äußere Schäden sind unverzüglich zu beseitigen, da sie auf zugrunde liegende technische Mängel hindeuten können (TRBS 3121).'
        },
        "22.2": {
            einfach: 'Bringen Sie eine gut sichtbare Tragfähigkeitsangabe an und weisen Sie das Personal auf die zulässige Beladung hin.',
            bghw: 'Stellen Sie eine deutlich sichtbare Tragfähigkeitsangabe sicher und unterweisen Sie das Personal zur zulässigen Beladung gemäß TRBS 3121 sowie der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Die zulässige Tragfähigkeit ist gemäß BetrSichV deutlich sichtbar anzugeben; eine Überladung oder unsachgemäße Beladung ist zu unterbinden. Die Tragfähigkeitsangabe ist gemäß Maschinenrichtlinie 2006/42/EG bzw. Aufzugsrichtlinie 2014/33/EU sowie BetrSichV dauerhaft und gut lesbar am Aufzug anzubringen.'
        },
        "22.3": {
            einfach: 'Lassen Sie defekte Aufzugstüren oder Türsicherungen sofort reparieren und beseitigen Sie Quetsch- oder Absturzgefahren.',
            bghw: 'Veranlassen Sie die Instandsetzung von Aufzugstüren und Türsicherungen gemäß TRBS 3121 sowie der DGUV Regel 108-601 und beseitigen Sie erkannte Quetsch- oder Absturzgefahren.',
            rechtlich: 'Defekte Aufzugstüren oder Türsicherungen sind unverzüglich instand zu setzen; Quetsch- oder Absturzgefahren sind zu beseitigen. Türsicherungen sind sicherheitsrelevante Bauteile nach Aufzugsrichtlinie 2014/33/EU und unverzüglich instand zu setzen.'
        },
        "22.4": {
            einfach: 'Räumen Sie Waren, Paletten und sonstige Hindernisse vor den Aufzugstüren weg.',
            bghw: 'Halten Sie die Bereiche vor den Aufzugstüren gemäß ASR A1.8 und der DGUV Regel 108-601 frei von Waren, Paletten und sonstigen Hindernissen.',
            rechtlich: 'Die Bereiche vor den Aufzugstüren sind freizuhalten von Waren, Paletten und sonstigen Hindernissen. Der Bereich vor den Aufzugstüren ist gemäß ASR A1.8 als Verkehrsweg freizuhalten.'
        },
        "22.5": {
            einfach: 'Weisen Sie, falls zutreffend, deutlich sichtbar darauf hin, dass der Lastenaufzug nicht zur Personenbeförderung genutzt werden darf, und sorgen Sie für bestimmungsgemäße Nutzung.',
            bghw: 'Bringen Sie erforderliche Hinweise bzw. Verbote zur Personenbeförderung gemäß TRBS 3121 sowie der DGUV Regel 108-601 gut sichtbar an und stellen Sie die bestimmungsgemäße Nutzung sicher.',
            rechtlich: 'Der Lastenaufzug ist bestimmungsgemäß zu verwenden; erforderliche Hinweise bzw. Verbote zur Personenbeförderung sind gut sichtbar anzubringen. Ein Lastenaufzug ohne Personenbeförderungszulassung darf gemäß Aufzugsrichtlinie 2014/33/EU nicht zur Personenbeförderung genutzt werden; entsprechende Verbotsschilder sind anzubringen.'
        },
        "22.6": {
            einfach: 'Lassen Sie defekte Bedienelemente, Anzeigen oder Sicherheitseinrichtungen reparieren und sorgen Sie für eindeutige Kennzeichnung.',
            bghw: 'Veranlassen Sie die Instandsetzung von Bedienelementen, Anzeigen und Sicherheitseinrichtungen gemäß TRBS 3121 sowie der DGUV Regel 108-601 und stellen Sie eine eindeutige Kennzeichnung sicher.',
            rechtlich: 'Bedienelemente, Anzeigen und Sicherheitseinrichtungen sind funktionsfähig zu halten und eindeutig zu kennzeichnen. Bedienelemente und Sicherheitseinrichtungen sind Bestandteil der wiederkehrenden Prüfung nach § 16 BetrSichV.'
        },
        "22.7": {
            einfach: 'Holen Sie die fällige Prüfung nach und beheben Sie offene Mängel aus dem letzten Prüfbericht. Die Hauptprüfung durch eine zugelassene Überwachungsstelle (ZÜS) ist gesetzlich spätestens alle zwei Jahre Pflicht.',
            bghw: 'Veranlassen Sie die fristgerechte Prüfung gemäß § 16 BetrSichV und der DGUV Regel 108-601 und arbeiten Sie festgestellte Mängel vollständig ab. Die ZÜS-Hauptprüfung darf gemäß § 16 i. V. m. Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV im Abstand von höchstens zwei Jahren erfolgen.',
            rechtlich: 'Die wiederkehrende Prüfung des Lastenaufzugs ist gemäß § 16 BetrSichV durch eine zugelassene Überwachungsstelle (ZÜS) fristgerecht durchzuführen; festgestellte Mängel sind vollständig abzuarbeiten. Die vom Arbeitgeber nach § 3 Abs. 6 BetrSichV festzulegende Prüffrist der ZÜS-Hauptprüfung darf gemäß Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV zwei Jahre nicht überschreiten.'
        },
        "22.8": {
            einfach: 'Unterweisen Sie die zuständigen Beschäftigten in der sicheren Bedienung und Beladung des Lastenaufzugs.',
            bghw: 'Unterweisen Sie die zuständigen Beschäftigten gemäß § 12 ArbSchG und der DGUV Regel 108-601 in der sicheren Bedienung und Beladung.',
            rechtlich: 'Beschäftigte dürfen den Lastenaufzug nur bestimmungsgemäß und entsprechend der Gefährdungsbeurteilung sowie der Betriebsanweisung bedienen; sie sind vor Aufnahme der Tätigkeit und danach erforderlichenfalls gemäß § 12 ArbSchG zu unterweisen. Die Unterweisung ist gemäß § 12 ArbSchG vor erstmaliger Bedienung und danach regelmäßig, mindestens jährlich, zu wiederholen.'
        },
        "22.9": {
            einfach: 'Legen Sie schriftlich fest, wie bei einer Störung oder einem Einschluss vorzugehen ist, und machen Sie die Ansprechpartner bekannt.',
            bghw: 'Regeln Sie das Vorgehen bei Störung oder Einschluss gemäß TRBS 3121 sowie der DGUV Regel 108-601 und benennen Sie die zuständigen Ansprechpartner.',
            rechtlich: 'Das Vorgehen bei einer Störung oder einem Einschluss ist gemäß TRBS 3121 schriftlich zu regeln; die zuständigen Ansprechpartner sind bekannt zu machen. Das Vorgehen bei Störung oder Einschluss ist gemäß TRBS 3121 Nr. 4.2 schriftlich zu regeln, inkl. Ansprechpartner und maximaler Reaktionszeit des Notdienstes.'
        }
    },

    default: {
        einfach: 'Legen Sie geeignete Maßnahmen fest, um den Mangel zu beheben, und dokumentieren Sie diese.',
        bghw: 'Legen Sie geeignete Maßnahmen zur Mängelbeseitigung gemäß § 3 ArbSchG sowie den Ergebnissen der Gefährdungsbeurteilung und der DGUV Regel 108-601 fest und dokumentieren Sie diese nachvollziehbar.',
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
let MEASURE_STYLE = localStorage.getItem('measureStyle') || 'bghw';

function setMeasureStyle(style) {
    if (['einfach', 'bghw', 'rechtlich'].indexOf(style) === -1) return;
    MEASURE_STYLE = style;
    localStorage.setItem('measureStyle', style);
}

// Helfer: liefert den vordefinierten Massnahmen-Text zu einer Pruefpunkt-ID im aktuell gewaehlten Stil.
// style kann optional explizit angegeben werden, sonst wird MEASURE_STYLE verwendet.
function getMeasureText(itemId, style) {
    const s = style || MEASURE_STYLE;
    const entry = MEASURES_BY_ID[itemId];
    if (entry && entry[s]) return entry[s];
    if (entry && entry.rechtlich) return entry.rechtlich;
    return MEASURES_TEXT.default[s] || MEASURES_TEXT.default.rechtlich;
}
