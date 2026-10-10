// ===== Vordefinierte Maßnahmen-Texte je Prüfpunkt, in drei Sprachstilen =====
// Fachliche Überarbeitung: 01.10.2026. Vollprüfung der Maßnahmentexte gegen aktuelle BGHW/DGUV-, BAuA- und Bundesrechtsquellen; feste Fristen und Pflichtaussagen wurden besonders geprüft.
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
// Rechts-/Regelwerksstand bei der Überarbeitung: 01.10.2026.
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
        'DGUV Regel 110-010 – Verwendung von Flüssiggas',
        'DGUV Vorschrift 25 – Überfallprävention',
        'DGUV Regel 108-010 – Überfallprävention in Verkaufsstellen',
        'DGUV Vorschrift 1 – Grundsätze der Prävention',
        'DGUV Regel 100-001 – Grundsätze der Prävention (Konkretisierung der DGUV Vorschrift 1, Ausgabe 06/2025)',
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
        'DIN VDE 0834 – Rufanlagen, soweit für die konkret installierte Anlage einschlägig'
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
            einfach: 'Stellen Sie für die jeweilige Tätigkeit geeignetes Schuhwerk bzw. erforderlichen Fußschutz mit ausreichender Rutschhemmung bereit bzw. sicher. Welche Anforderungen erforderlich sind, richtet sich nach der Gefährdungsbeurteilung, insbesondere nach Bodenbeschaffenheit, Nässe und möglichen Verunreinigungen.',
            bghw: 'Wählen Sie geeignetes Schuhwerk bzw. erforderlichen Fußschutz auf Grundlage der Gefährdungsbeurteilung aus. Berücksichtigen Sie insbesondere Bodenbeschaffenheit, auftretende gleitfördernde Stoffe und die erforderliche Rutschhemmung. Die früheren Rutschhemmklassen SRA/SRB/SRC sind nicht mehr als aktuelle Mindestanforderung zu verwenden.',
            rechtlich: 'Die Auswahl erforderlichen Fußschutzes erfolgt auf Grundlage der Gefährdungsbeurteilung. Anforderungen an Sicherheitsschuhe und deren Rutschhemmung werden insbesondere durch die jeweils einschlägigen Produktnormen und die DGUV Regel 112-191 konkretisiert. Die früheren Kennzeichnungen SRA, SRB und SRC sind für neu ausgewählten Fußschutz nicht als aktuelle Anforderung anzusetzen.'
        },
        "1.2": {
            einfach: 'Unterweisen Sie die Beschäftigten im sicheren Umgang mit Flurförderzeugen und Hubwagen. Beachten Sie Traglasten, erforderliche Schutzausrüstung und das Verbot unzulässiger Personenmitnahme. Mitfahrbare Flurförderzeuge dürfen nur von geeigneten, mindestens 18 Jahre alten und schriftlich beauftragten Personen geführt werden.',
            bghw: 'Führen Sie regelmäßige Unterweisungen zum sicheren Umgang mit Flurförderfahrzeugen gemäß DGUV Vorschrift 68 und der DGUV Regel 108-601 durch, inkl. PSA-Pflicht, zulässiger Traglasten und Verbot der Personenmitnahme. Für mitfahrbare Flurförderzeuge ist ein schriftlicher Fahrauftrag zu erteilen; Mindestalter 18 Jahre (§ 7 DGUV Vorschrift 68).',
            rechtlich: 'Beschäftigte sind regelmäßig anhand der Betriebsanweisung zum sicheren Umgang mit Flurförderfahrzeugen zu unterweisen. PSA-Pflicht, Traglastbegrenzungen und das Verbot der Personenmitnahme sind konsequent einzuhalten. Fahrer mitfahrbarer Flurförderzeuge müssen mindestens 18 Jahre alt, körperlich/geistig geeignet und schriftlich beauftragt sein (§ 7 DGUV Vorschrift 68); die Unterweisung ist mindestens jährlich zu wiederholen (§ 4 Abs. 3 DGUV Vorschrift 68).'
        },
        "1.3": {
            einfach: 'Lassen Sie auffällige oder beschädigte Automatiktüren umgehend fachkundig prüfen und festgestellte Mängel beseitigen. Kraftbetätigte Türen sind wiederkehrend sicherheitstechnisch zu prüfen; die ASR A1.7 empfiehlt hierfür mindestens eine jährliche Prüfung.',
            bghw: 'Veranlassen Sie bei Mängeln die Prüfung und Instandsetzung der Automatiktüren. Nach ASR A1.7 müssen kraftbetätigte Türen nach Herstellervorgaben vor der ersten Inbetriebnahme, nach wesentlichen Änderungen und wiederkehrend auf sicheren Zustand geprüft werden; die wiederkehrende Prüfung sollte mindestens einmal jährlich erfolgen.',
            rechtlich: 'Nach ASR A1.7 Abschnitt 10.2 sind kraftbetätigte Türen nach Herstellervorgaben vor der ersten Inbetriebnahme, nach wesentlichen Änderungen sowie wiederkehrend sachgerecht auf sicheren Zustand zu prüfen. Die wiederkehrende Prüfung sollte mindestens einmal jährlich erfolgen; die Ergebnisse sind aufzuzeichnen und in der Arbeitsstätte aufzubewahren.'
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
            einfach: 'Kontrollieren Sie Leitern und Tritte vor der Verwendung auf erkennbare Mängel und lassen Sie sie wiederkehrend prüfen. Die DGUV Information 208-016 empfiehlt mindestens eine jährliche Prüfung. Beschädigte Leitern und Tritte sofort aus der Benutzung nehmen.',
            bghw: 'Leitern und Tritte sind vor der Verwendung auf ordnungsgemäßen Zustand zu kontrollieren und wiederkehrend einer Sicht- und Funktionsprüfung zu unterziehen. Die Prüffrist ist unter Berücksichtigung von Nutzungshäufigkeit, Beanspruchung und bisherigen Mängeln festzulegen. Die DGUV Information 208-016 empfiehlt mindestens eine jährliche Prüfung. Eine Prüfplakette kann die Organisation unterstützen, wird hier aber nicht als allgemeine gesetzliche Pflicht dargestellt.',
            rechtlich: 'Art, Umfang und Fristen erforderlicher Prüfungen sind auf Grundlage der Gefährdungsbeurteilung festzulegen. Nach DGUV Information 208-016 richten sich die Zeitabstände insbesondere nach Nutzungshäufigkeit, Beanspruchung sowie Häufigkeit und Schwere festgestellter Mängel; eine mindestens jährliche Prüfung wird empfohlen. Eine pauschale gesetzliche Pflicht zu einer Prüfplakette wird daraus nicht abgeleitet.'
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
        "1.13": {
            einfach: 'Lassen Sie ein mangelhaftes Schnelllauftor umgehend fachkundig prüfen und instand setzen. Kraftbetätigte Tore sind wiederkehrend sicherheitstechnisch zu prüfen; die ASR A1.7 empfiehlt mindestens eine jährliche Prüfung.',
            bghw: 'Veranlassen Sie bei Mängeln Prüfung und Instandsetzung des Schnelllauftors. Nach ASR A1.7 erfolgt die wiederkehrende sicherheitstechnische Prüfung nach den Vorgaben des Herstellers; sie sollte mindestens einmal jährlich durchgeführt werden.',
            rechtlich: 'Nach ASR A1.7 Abschnitt 10.2 sind kraftbetätigte Tore nach Herstellervorgaben vor der ersten Inbetriebnahme, nach wesentlichen Änderungen und wiederkehrend sachgerecht auf sicheren Zustand zu prüfen. Die wiederkehrende Prüfung sollte mindestens einmal jährlich erfolgen; die Ergebnisse sind aufzuzeichnen.'
        },
        "1.14": {
            einfach: 'Lassen Sie ein mangelhaftes Rolltor fachkundig prüfen und instand setzen. Die erforderliche Wartung ist nach Herstellervorgaben durchzuführen. Die wiederkehrende sicherheitstechnische Prüfung sollte nach ASR A1.7 mindestens einmal jährlich erfolgen.',
            bghw: 'Veranlassen Sie Prüfung, erforderliche Wartung und Instandsetzung des Rolltors nach Herstellervorgaben und ASR A1.7. Die wiederkehrende sicherheitstechnische Prüfung sollte mindestens einmal jährlich durchgeführt werden.',
            rechtlich: 'Nach ASR A1.7 Abschnitt 10.2 sind kraftbetätigte Tore nach Herstellervorgaben wiederkehrend sachgerecht auf sicheren Zustand zu prüfen. Die wiederkehrende Prüfung sollte mindestens einmal jährlich erfolgen; die Ergebnisse sind aufzuzeichnen und in der Arbeitsstätte aufzubewahren.'
        }
    },
    "Brandschutz": {        "2.1": {
            einfach: 'Lassen Sie die Feuerlöscher regelmäßig warten und prüfen. Als Regelfrist für die Wartung gelten zwei Jahre; abweichende Herstellerangaben und besondere Beanspruchungen sind zu berücksichtigen.',
            bghw: 'Lassen Sie Feuerlöscher nach ASR A2.2 Abschnitt 7.4 regelmäßig fachkundig warten und die Funktionsfähigkeit prüfen. Für Feuerlöscher gilt grundsätzlich eine zweijährige Wartungsfrist; vom Hersteller zugelassene längere Fristen können berücksichtigt werden, kürzere Herstellerfristen und stärkere Beanspruchungen erfordern entsprechend kürzere Abstände.',
            rechtlich: '§ 4 Abs. 3 ArbStättV verlangt die Instandhaltung und regelmäßige Funktionsprüfung von Feuerlöscheinrichtungen. ASR A2.2 Abschnitt 7.4 konkretisiert dies: Feuerlöscher sind grundsätzlich alle zwei Jahre durch einen Fachkundigen zu warten. Vom Hersteller zugelassene längere Fristen können herangezogen werden; kürzere Herstellerfristen sowie bei starker Beanspruchung erforderliche kürzere Abstände sind zu beachten. Die Ergebnisse sind zu dokumentieren.'
        },
        "2.2": {
            einfach: 'Stellen Sie nichts vor die Feuerlöscher und Wandhydranten.',
            bghw: 'Halten Sie Feuerlöscher und Wandhydranten gemäß der DGUV Regel 108-601 „Branche Einzelhandel“ zu ASR A2.2 jederzeit frei zugänglich und deutlich gekennzeichnet.',
            rechtlich: 'Feuerlöscher und Wandhydranten sind gemäß ASR A2.2 jederzeit frei zugänglich zu halten und nach ASR A1.3 zu kennzeichnen. Freihaltung und Kennzeichnung sind nach ASR A2.2 i. V. m. ASR A1.3 (Sicherheitskennzeichnung) sicherzustellen.'
        },
        "2.3": {
            einfach: 'Kontrollieren Sie Wandhydranten regelmäßig auf erkennbare Mängel und stellen Sie die vorgeschriebene Instandhaltung und Funktionsprüfung nach den für die Anlage geltenden Vorgaben sicher.',
            bghw: 'Stellen Sie die regelmäßigen Betreiberkontrollen sowie die fachgerechte Instandhaltung der Wandhydrantenanlage sicher. Maßgeblich sind insbesondere Brandschutzkonzept, Herstellerangaben und die aktuelle DIN 14462; festgestellte Mängel sind zu beseitigen und Kontrollen bzw. Instandhaltung nachvollziehbar zu dokumentieren.',
            rechtlich: 'Wandhydranten und Löschwasseranlagen sind funktionsfähig zu halten und entsprechend den für die konkrete Anlage geltenden Vorgaben zu kontrollieren und instand zu halten. Für Planung, Betrieb und Instandhaltung ist insbesondere DIN 14462:2023-07 einschlägig; DIN 1988-600 betrifft insbesondere die Anbindung an Trinkwasserinstallationen und ist nicht alleinige Grundlage für die wiederkehrende Instandhaltung.'
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
            einfach: 'Lassen Sie die Sicherheitsbeleuchtung regelmäßig auf Funktion prüfen und festgestellte Mängel unverzüglich beseitigen. Prüfintervalle und Prüfumfang richten sich nach Herstellerangaben und den anerkannten Regeln der Technik.',
            bghw: 'Stellen Sie die regelmäßige Funktionsprüfung und Instandhaltung der Sicherheitsbeleuchtung gemäß ASR A2.3 sicher. Abstände und Umfang der Prüfungen sowie die Dokumentation richten sich nach Herstellerangaben und den anerkannten Regeln der Technik.',
            rechtlich: 'Nach ASR A2.3 ist die Sicherheitsbeleuchtung instand zu halten und in regelmäßigen Abständen auf ihre Funktionsfähigkeit zu prüfen. Abstände und Umfang der Prüfung sowie die Dokumentationspflicht ergeben sich aus den Herstellerangaben und den anerkannten Regeln der Technik. Festgestellte Mängel sind unverzüglich sachgerecht zu beseitigen.'
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
            einfach: 'Stellen Sie sicher, dass die für Ihren Betrieb vorgeschriebenen Gesetze, Unfallverhütungsvorschriften und betrieblichen Informationen für Beschäftigte zugänglich sind. Eine Brandschutzordnung Teil A ist dort auszuhängen, wo sie aufgrund des Brandschutzkonzepts bzw. der betrieblichen Festlegung erforderlich ist.',
            bghw: 'Machen Sie die einschlägigen Arbeitsschutzvorschriften und betrieblichen Sicherheitsinformationen für Beschäftigte zugänglich. Aushänge und eine Brandschutzordnung sind nach den jeweils für den Betrieb geltenden Vorgaben zu organisieren.',
            rechtlich: 'Die Pflicht zur Bekanntmachung oder Zugänglichmachung ergibt sich jeweils aus der einschlägigen Vorschrift; sie besteht nicht pauschal für jedes Arbeitsschutzgesetz in derselben Form. Die Brandschutzordnung nach DIN 14096 ist umzusetzen, wenn sie aufgrund baurechtlicher, behördlicher oder betrieblicher Brandschutzvorgaben vorgesehen ist.'
        },
        "3.2": {
            einfach: 'Stellen Sie Kaffeemaschine und andere heiße Geräte auf eine feuerfeste Unterlage.',
            bghw: 'Stellen Sie hitzeentwickelnde Geräte wie die Kaffeemaschine gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ auf eine nicht brennbare Unterlage.',
            rechtlich: 'Kaffeemaschine und andere hitzeentwickelnde Geräte sind auf Grundlage der Gefährdungsbeurteilung und der Anforderungen an den Brandschutz so aufzustellen und zu betreiben, dass Brandgefährdungen vermieden werden (§§ 3, 4 ArbSchG; § 4 ArbStättV; ASR A2.2). Der erforderliche Sicherheitsabstand zu brennbaren Materialien richtet sich nach Herstellerangaben und der Gefährdungsbeurteilung (§ 5 ArbSchG).'
        },
        "3.3": {
            einfach: 'Lassen Sie elektrische Betriebsmittel in den anhand der Gefährdungsbeurteilung festgelegten Fristen prüfen. Prüffristen müssen zu Einsatzbedingungen und Beanspruchung passen; erkennbare Mängel sind sofort zu beseitigen bzw. das Gerät ist außer Betrieb zu nehmen.',
            bghw: 'Prüfen Sie ortsveränderliche elektrische Betriebsmittel gemäß DGUV Vorschrift 3 in angemessenen, anhand der Gefährdungsbeurteilung festgelegten Intervallen. Die Durchführungsanweisung nennt sechs Monate als Richtwert; die Frist kann anhand der Einsatzbedingungen und der bei Prüfungen festgestellten Fehlerquote angepasst werden.',
            rechtlich: 'Nach § 5 DGUV Vorschrift 3 sind elektrische Anlagen und Betriebsmittel auf ordnungsgemäßen Zustand zu prüfen. Für ortsveränderliche elektrische Betriebsmittel nennt die Durchführungsanweisung einen Richtwert von sechs Monaten. Die konkrete Prüffrist ist unter Berücksichtigung von Einsatzbedingungen, Beanspruchung und Fehlerquote festzulegen.'
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
            einfach: 'Sorgen Sie dafür, dass während der Arbeitszeit ausreichend ausgebildete Ersthelfer zur Verfügung stehen. Bei 2 bis 20 anwesenden Versicherten ist mindestens ein Ersthelfer erforderlich. Bei mehr als 20 anwesenden Versicherten müssen in Verwaltungs- und Handelsbetrieben grundsätzlich mindestens 5 % als Ersthelfer zur Verfügung stehen.',
            bghw: 'Stellen Sie sicher, dass die nach § 26 Abs. 1 DGUV Vorschrift 1 erforderliche Zahl an Ersthelfern zur Verfügung steht. Bei 2 bis 20 anwesenden Versicherten ist mindestens ein Ersthelfer erforderlich; bei mehr als 20 anwesenden Versicherten sind in Verwaltungs- und Handelsbetrieben grundsätzlich 5 % als Ersthelfer erforderlich. Berücksichtigen Sie Schichtbetrieb und Abwesenheiten bei der Organisation.',
            rechtlich: 'Nach § 26 Abs. 1 DGUV Vorschrift 1 hat der Unternehmer dafür zu sorgen, dass bei 2 bis 20 anwesenden Versicherten mindestens ein Ersthelfer und bei mehr als 20 anwesenden Versicherten in Verwaltungs- und Handelsbetrieben grundsätzlich 5 % der anwesenden Versicherten als Ersthelfer zur Verfügung stehen.'
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
            einfach: 'Kontrollieren Sie Steckdosen, Leitungen und elektrische Geräte auf erkennbare Schäden und lassen Sie erforderliche elektrische Prüfungen in den festgelegten Fristen durchführen.',
            bghw: 'Stellen Sie Prüfungen elektrischer Anlagen und Betriebsmittel gemäß DGUV Vorschrift 3 sicher. Prüffristen sind anhand der Gefährdungsbeurteilung, der Einsatzbedingungen und der betrieblichen Erfahrungen festzulegen; für unterschiedliche Anlagen und Betriebsmittel gelten unterschiedliche Richtwerte.',
            rechtlich: 'Nach § 5 DGUV Vorschrift 3 sind elektrische Anlagen und Betriebsmittel vor der ersten Inbetriebnahme bzw. nach Änderung oder Instandsetzung sowie in bestimmten Zeitabständen auf ordnungsgemäßen Zustand zu prüfen. Die Prüffristen sind so festzulegen, dass entstehende Mängel rechtzeitig festgestellt werden; Richtwerte der Durchführungsanweisung sind unter Berücksichtigung der betrieblichen Bedingungen anzuwenden.'
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
            einfach: 'Unterweisen Sie Beschäftigte vor Aufnahme der Tätigkeit über die Gefahren von CO₂-Kälteanlagen, das Verhalten bei Alarm und die Fluchtwege. Wiederholen Sie die Unterweisung entsprechend den Gefährdungen, mindestens jedoch jährlich.',
            bghw: 'Unterweisen Sie Beschäftigte im Bereich von CO₂-Kälteanlagen tätigkeitsbezogen über die spezifischen Gefahren, Alarmierung und das Verhalten im Notfall. Die Wiederholung erfolgt nach § 4 Abs. 1 DGUV Vorschrift 1 erforderlichenfalls, mindestens jedoch einmal jährlich.',
            rechtlich: 'Die tätigkeitsbezogene Unterweisung ist nach § 12 ArbSchG durchzuführen. Nach § 4 Abs. 1 DGUV Vorschrift 1 muss sie erforderlichenfalls wiederholt werden, mindestens jedoch einmal jährlich. Bei CO₂-Kälteanlagen sind die spezifischen Gefährdungen und Notfallmaßnahmen zu berücksichtigen.'
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
            einfach: 'Lassen Sie Flurförderzeuge, z. B. elektrische Hubwagen, in Abständen von längstens einem Jahr durch einen Sachkundigen prüfen. Festgestellte Mängel sind zu beheben und die Prüfung ist nachzuweisen.',
            bghw: 'Lassen Sie Flurförderzeuge und ihre Anbaugeräte gemäß § 37 Abs. 1 DGUV Vorschrift 68 in Abständen von längstens einem Jahr durch einen Sachkundigen prüfen. Sorgen Sie dafür, dass sicherheitsrelevante Mängel beseitigt werden und ein Prüfnachweis geführt wird.',
            rechtlich: 'Nach § 37 Abs. 1 DGUV Vorschrift 68 sind Flurförderzeuge und ihre Anbaugeräte in Abständen von längstens einem Jahr durch einen Sachkundigen zu prüfen. Nach § 39 DGUV Vorschrift 68 ist über die wiederkehrenden Prüfungen ein Prüfnachweis zu führen.'
        },
        "8.2": {
            einfach: 'Kontrollieren Sie den Gabelhubwagen regelmäßig auf Schäden.',
            bghw: 'Kontrollieren Sie den Gabelhubwagen gemäß DGUV Vorschrift 1 und DGUV Regel 108-601 „Branche Einzelhandel“ regelmäßig auf Beschädigungen.',
            rechtlich: 'Der Gabelhubwagen ist gemäß § 3 DGUV Vorschrift 1 regelmäßig auf seinen ordnungsgemäßen Zustand zu prüfen. Für handgeführte Flurförderzeuge ist als Richtwert eine jährliche Prüfung durch eine befähigte Person angemessen (§ 3 Abs. 6 BetrSichV).'
        },
        "8.3": {
            einfach: 'Kontrollieren Sie Regale regelmäßig auf Schäden. Legen Sie die Abstände der Sichtkontrollen anhand der Gefährdung fest. Bei entsprechend prüfpflichtigen Regalanlagen ist zusätzlich mindestens alle 12 Monate eine Experteninspektion durch eine fachkundige Person durchzuführen.',
            bghw: 'Sorgen Sie für regelmäßige Kontrollen der Regalanlagen. Sichtkontrollen sind in kürzeren Zeitabständen durchzuführen – wöchentlich oder in Abständen, die auf Grundlage einer Risikoanalyse festgelegt werden. Die Experteninspektion ist mindestens alle 12 Monate durch eine fachkundige Person durchzuführen. Festgestellte Schäden sind zu bewerten und erforderliche Maßnahmen einzuleiten.',
            rechtlich: 'Für Regalanlagen konkretisiert DGUV Information 208-043 die wiederkehrenden Kontrollen: Eine Experteninspektion ist mindestens alle 12 Monate durch eine fachkundige Person durchzuführen. Zusätzliche Inspektionen bzw. Sichtkontrollen erfolgen in kürzeren Zeitabständen, wöchentlich oder in anhand einer Risikoanalyse festgelegten Abständen.'
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
            einfach: 'Legen Sie für die Müll- bzw. Papierpresse die erforderlichen Kontrollen und Prüfungen anhand der Gefährdungsbeurteilung und Herstellerangaben fest und lassen Sie diese fristgerecht durchführen.',
            bghw: 'Ermitteln Sie für die Müll- bzw. Papierpresse Art, Umfang und Fristen erforderlicher Kontrollen und Prüfungen nach BetrSichV. Berücksichtigen Sie insbesondere schädigende Einflüsse, Einsatzbedingungen und Herstellerangaben; erforderliche Prüfungen sind durch entsprechend qualifizierte Personen durchzuführen.',
            rechtlich: 'Nach § 3 Abs. 6 BetrSichV sind Art und Umfang erforderlicher Prüfungen sowie die Fristen wiederkehrender Prüfungen zu ermitteln und festzulegen. Ob und in welchen Fristen Prüfungen nach § 14 BetrSichV erforderlich sind, richtet sich nach den dort genannten Voraussetzungen und der Gefährdungsbeurteilung; eine pauschale jährliche Prüffrist gilt nicht für jede Presse.'
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
            einfach: 'Stellen Sie sicher, dass erforderliche Pflichtvorsorge veranlasst, Angebotsvorsorge angeboten und Wunschvorsorge im vorgesehenen Umfang ermöglicht wird.',
            bghw: 'Stellen Sie die arbeitsmedizinische Vorsorge nach ArbMedVV sicher: Pflichtvorsorge veranlassen, Angebotsvorsorge anbieten und Wunschvorsorge unter den gesetzlichen Voraussetzungen ermöglichen.',
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
            einfach: 'Kontrollieren Sie Backofen, Backbleche und Brotschneidemaschine regelmäßig auf sicheren Zustand. Elektrische Geräte sind entsprechend der festgelegten Prüffristen elektrisch zu prüfen; für Maschinen können zusätzliche Kontrollen oder Prüfungen erforderlich sein.',
            bghw: 'Stellen Sie für die Arbeitsmittel der Backstation die nach Gefährdungsbeurteilung erforderlichen Kontrollen und Prüfungen sicher. Elektrische Prüfungen richten sich nach DGUV Vorschrift 3; bei Maschinen sind zusätzlich BetrSichV, Einsatzbedingungen und Herstellerangaben zu berücksichtigen.',
            rechtlich: 'Art, Umfang und Fristen erforderlicher Prüfungen sind abhängig vom jeweiligen Arbeitsmittel festzulegen. Für elektrische Anlagen und Betriebsmittel gilt insbesondere § 5 DGUV Vorschrift 3; für Arbeitsmittel sind zusätzlich die einschlägigen Anforderungen der BetrSichV und die Gefährdungsbeurteilung zu berücksichtigen.'
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
            einfach: 'Nehmen Sie beschädigte oder offensichtlich ungeeignete Zuleitungen, Stecker und Anschlüsse außer Betrieb und lassen Sie sie fachgerecht instand setzen bzw. prüfen.',
            bghw: 'Lassen Sie die Zuleitung gemäß DIN VDE 0100 und der DGUV Regel 108-601 durch eine Elektrofachkraft prüfen.',
            rechtlich: 'Die Zuleitung ist auf Konformität mit DIN VDE 0100 zu prüfen. Die Prüfung der Zuleitung durch eine Elektrofachkraft ist gemäß DGUV Vorschrift 3 i. V. m. DIN VDE 0100-600 vor Erstinbetriebnahme und danach wiederkehrend durchzuführen.'
        },
        "12.5": {
            einfach: 'Legen Sie für die Maschinen fest, welche Kontrollen und Prüfungen für einen sicheren Betrieb erforderlich sind. Führen Sie diese fristgerecht durch und dokumentieren Sie die Prüfungen, soweit dies vorgeschrieben oder erforderlich ist. Festgestellte Mängel sind zu beseitigen.',
            bghw: 'Ermitteln Sie im Rahmen der Gefährdungsbeurteilung Art, Umfang und Fristen der erforderlichen Kontrollen und Prüfungen von Maschinen und anderen Arbeitsmitteln. Berücksichtigen Sie insbesondere Einsatzbedingungen, mögliche schädigende Einflüsse und Herstellerangaben. Erforderliche Prüfungen sind durch entsprechend qualifizierte Personen durchführen zu lassen.',
            rechtlich: 'Nach § 3 Abs. 6 BetrSichV hat der Arbeitgeber Art und Umfang erforderlicher Prüfungen von Arbeitsmitteln sowie die Fristen wiederkehrender Prüfungen zu ermitteln und festzulegen, soweit keine konkreten Vorgaben bestehen. Ob eine Prüfung nach § 14 BetrSichV erforderlich ist, richtet sich nach den dort genannten Voraussetzungen; TRBS 1201 konkretisiert die Ermittlung und Durchführung erforderlicher Prüfungen und Kontrollen.'
        },
        "12.6": {
            einfach: 'Kontrollieren Sie, ob alle Schutzvorrichtungen an den Maschinen vorhanden und funktionsfähig sind.',
            bghw: 'Kontrollieren Sie Schutzeinrichtungen an Backstationsmaschinen gemäß § 4 BetrSichV und der DGUV Regel 108-601 regelmäßig auf Vorhandensein und Funktion.',
            rechtlich: 'Schutzeinrichtungen müssen entsprechend der Gefährdungsbeurteilung sicher vorhanden und funktionsfähig sein; die regelmäßige Funktionskontrolle ist nach § 4 Abs. 5 BetrSichV sicherzustellen. Die regelmäßige Funktionskontrolle ist gemäß § 4 Abs. 5 BetrSichV mindestens im Rahmen jeder wiederkehrenden Prüfung sicherzustellen.'
        },
        "12.7": {
            einfach: 'Stellen Sie die erforderlichen Betriebsanweisungen für die Backstation verständlich bereit und sorgen Sie dafür, dass die Beschäftigten darauf zugreifen können.',
            bghw: 'Stellen Sie erforderliche Betriebsanweisungen für die Backstation nach den jeweils einschlägigen Vorschriften verständlich und für die Beschäftigten zugänglich bereit.',
            rechtlich: 'Erforderliche Betriebsanweisungen sind nach den jeweils einschlägigen Vorschriften verständlich bereitzustellen und den Beschäftigten zugänglich zu machen. Für Tätigkeiten mit Gefahrstoffen richtet sich die Betriebsanweisung insbesondere nach § 14 GefStoffV; für Arbeitsmittel sind die Gefährdungsbeurteilung, BetrSichV und Herstellerinformationen zu berücksichtigen.'
        },
        "12.8": {
            einfach: 'Prüfen Sie den Backhandschuh auf Verschleiß und tauschen Sie ihn bei Bedarf aus.',
            bghw: 'Kontrollieren Sie den Backhandschuh gemäß PSA-Benutzungsverordnung und der DGUV Regel 108-601 regelmäßig auf Verschleiß und ausreichende Stulpenlänge.',
            rechtlich: 'Backhandschuhe sind regelmäßig auf Verschleiß und ausreichende Schutzlänge (Stulpe) zu prüfen (PSA-Benutzungsverordnung). Backhandschuhe sind gemäß PSA-Benutzungsverordnung regelmäßig auf Hitzebeständigkeit und Unversehrtheit zu prüfen und bei Verschleiß unverzüglich zu ersetzen.'
        },
        "12.9": {
            einfach: 'Warten und kontrollieren Sie Heißtheken und Fritteusen entsprechend den Herstellerangaben und lassen Sie erforderliche Prüfungen in den festgelegten Fristen durchführen.',
            bghw: 'Stellen Sie Wartung, Kontrollen und erforderliche Prüfungen von Heißtheken und Fritteusen entsprechend Gefährdungsbeurteilung, Herstellerangaben und – bei elektrischen Geräten – DGUV Vorschrift 3 sicher.',
            rechtlich: 'Die erforderlichen Wartungs-, Kontroll- und Prüffristen sind abhängig von Bauart, Einsatzbedingungen und Gefährdungsbeurteilung festzulegen. Für elektrische Anlagen und Betriebsmittel ist insbesondere § 5 DGUV Vorschrift 3 zu beachten; eine pauschale Prüffrist von 6 bis 24 Monaten gilt nicht für jedes Heißgerät.'
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
            einfach: 'Kontrollieren Sie die Geräte im Servicebereich regelmäßig auf sicheren Zustand und lassen Sie erforderliche Prüfungen in den festgelegten Fristen durchführen.',
            bghw: 'Stellen Sie die erforderlichen Kontrollen und Prüfungen der Arbeitsmittel im Servicebereich entsprechend Gefährdungsbeurteilung, Einsatzbedingungen und Herstellerangaben sicher. Für elektrische Geräte ist DGUV Vorschrift 3 zu beachten.',
            rechtlich: 'Art, Umfang und Fristen erforderlicher Prüfungen richten sich nach dem jeweiligen Arbeitsmittel und den Einsatzbedingungen. Elektrische Anlagen und Betriebsmittel sind nach § 5 DGUV Vorschrift 3 in den festgelegten Fristen auf ordnungsgemäßen Zustand zu prüfen.'
        },
        "13.4": {
            einfach: 'Stellen Sie sicher, dass aufklappbare Thekenscheiben in geöffneter Stellung sicher gehalten werden und nicht unbeabsichtigt herunterfallen oder zuklappen können. Beschädigte Halterungen, Scharniere oder Unterstützungseinrichtungen sind instand zu setzen.',
            bghw: 'Kontrollieren Sie aufklappbare Thekenscheiben und deren Halte-, Scharnier- und Unterstützungseinrichtungen auf sicheren Zustand und Funktion. Geöffnete Scheiben müssen zuverlässig gehalten werden; Gefährdungen durch Herabfallen, unbeabsichtigtes Schließen, Quetschen oder Einklemmen sind zu vermeiden.',
            rechtlich: 'Gefährdungen durch bewegliche Teile, Quetsch- und Scherstellen sowie unbeabsichtigte Bewegungen sind im Rahmen der Gefährdungsbeurteilung zu berücksichtigen und durch geeignete Schutzmaßnahmen zu vermeiden. Soweit die Theke bzw. ihre Einrichtungen Arbeitsmittel im Sinne der BetrSichV sind, sind die Anforderungen der BetrSichV einschließlich erforderlicher Kontrollen und gegebenenfalls Prüfungen anzuwenden.'
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
            einfach: 'Kontrollieren Sie die Geräte im Convenience-Bereich regelmäßig auf sicheren Zustand und lassen Sie erforderliche Prüfungen in den festgelegten Fristen durchführen.',
            bghw: 'Stellen Sie die erforderlichen Kontrollen und Prüfungen der Convenience-Geräte entsprechend Gefährdungsbeurteilung, Einsatzbedingungen und Herstellerangaben sicher. Für elektrische Geräte ist DGUV Vorschrift 3 zu beachten.',
            rechtlich: 'Art, Umfang und Fristen erforderlicher Prüfungen richten sich nach dem jeweiligen Arbeitsmittel und den Einsatzbedingungen. Elektrische Anlagen und Betriebsmittel sind nach § 5 DGUV Vorschrift 3 in den festgelegten Fristen auf ordnungsgemäßen Zustand zu prüfen.'
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
            rechtlich: 'Gefahrstoffe sind nach den Zusammenlagerungsregeln der TRGS 510 zu lagern. Maßgeblich sind insbesondere Abschnitt 13 zur Zusammen-, Getrennt- und Separatlagerung sowie Anhang 2 zur Zuordnung der Lagerklassen; gefährliche Wechselwirkungen sind zu vermeiden.'
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
            rechtlich: 'Neue Beschäftigte sind nach § 12 ArbSchG bei der Einstellung vor Aufnahme der Tätigkeit arbeitsplatz- und aufgabenbezogen zu Sicherheit und Gesundheitsschutz zu unterweisen. § 4 Abs. 1 DGUV Vorschrift 1 verlangt zusätzlich die Dokumentation der Unterweisung und eine erforderlichenfalls wiederholte, mindestens jährliche Unterweisung; spezielle Vorschriften können kürzere Intervalle vorgeben.'
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
            einfach: 'Testen Sie die Notrufeinrichtung des barrierefreien WCs regelmäßig und nach den für die eingebaute Anlage geltenden Vorgaben. Halten Sie die festgelegten Prüfungen nachvollziehbar fest.',
            bghw: 'Prüfen Sie die Notrufeinrichtung des barrierefreien WCs in den anhand von Herstellerangaben, Gefährdungsbeurteilung und den für die konkrete Rufanlage geltenden technischen Regeln festgelegten Abständen. Eine pauschale Monatsfrist wird ohne Nachweis für die konkrete Anlage nicht vorgegeben.',
            rechtlich: 'Die Notrufeinrichtung ist funktionsfähig zu halten und in geeigneten Abständen zu kontrollieren. Prüfart und Prüffrist sind anhand der konkreten Anlage, der Herstellerangaben und der einschlägigen technischen Regeln festzulegen. DIN VDE 0834 darf nur herangezogen werden, wenn sie für die tatsächlich installierte Rufanlage anwendbar ist; eine allgemeine monatliche Prüffrist für jedes barrierefreie WC wird hier nicht unterstellt.'
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
            einfach: 'Sorgen Sie für eine ausreichende Anzahl ausgebildeter Brandschutzhelfer. In der Regel sind 5 % der Beschäftigten ausreichend. Berücksichtigen Sie bei der Planung insbesondere Schichtbetrieb, Urlaub, Krankheit, die Größe des Marktes und eine gegebenenfalls erhöhte Brandgefährdung.',
            bghw: 'Ermitteln Sie die erforderliche Anzahl der Brandschutzhelfer anhand der Gefährdungsbeurteilung. Nach ASR A2.2 ist ein Anteil von 5 % der Beschäftigten in der Regel ausreichend. Schichtbetrieb und Abwesenheiten sowie besondere betriebliche Verhältnisse sind bei der erforderlichen Anzahl zu berücksichtigen.',
            rechtlich: 'Nach ASR A2.2 Abschnitt 7.3 hat der Arbeitgeber eine ausreichende Anzahl Beschäftigter durch Unterweisung und Übung im Umgang mit Feuerlöscheinrichtungen zur Bekämpfung von Entstehungsbränden vertraut zu machen. Die Anzahl ergibt sich aus der Gefährdungsbeurteilung; 5 % der Beschäftigten sind in der Regel ausreichend. Schichtbetrieb und Abwesenheiten sind zu berücksichtigen.'
        },
        "19.4": {
            einfach: 'Unterweisen Sie Beschäftigte, die mit Bargeld umgehen oder von einem Überfall betroffen sein können, mindestens alle sechs Monate zur Überfallprävention und dokumentieren Sie die Unterweisung.',
            bghw: 'Führen und dokumentieren Sie die Unterweisung zur Überfallprävention mindestens halbjährlich gemäß § 9 Abs. 1 DGUV Vorschrift 25. Für Verkaufsstellen sind ergänzend die Konkretisierungen der DGUV Regel 108-010 „Überfallprävention in Verkaufsstellen“ zu berücksichtigen.',
            rechtlich: 'Nach § 9 Abs. 1 DGUV Vorschrift 25 sind Versicherte, die Umgang mit Bargeld haben oder von einem Überfall betroffen sein können, mindestens halbjährlich sowie bei Bedarf zu unterweisen. Für Verkaufsstellen konkretisiert DGUV Regel 108-010 die Anforderungen zur Überfallprävention.'
        },
        "19.5": {
            einfach: 'Dokumentieren Sie jede durchgeführte Unterweisung so, dass Zeitpunkt, Thema und unterwiesene Personen nachvollziehbar sind. Eine Unterschrift ist nur dann zwingend, wenn eine spezielle Vorschrift sie verlangt.',
            bghw: 'Dokumentieren Sie Unterweisungen nach § 4 Abs. 1 DGUV Vorschrift 1 nachvollziehbar. Die DGUV Regel 100-001 erläutert, dass die DGUV Vorschrift 1 keine bestimmte Form und grundsätzlich keine Unterschrift vorgibt; spezielle Vorschriften können zusätzliche Dokumentations- oder Unterschriftsanforderungen enthalten.',
            rechtlich: '§ 4 Abs. 1 DGUV Vorschrift 1 verlangt die Dokumentation der Unterweisung. Nach DGUV Regel 100-001 ist dafür keine bestimmte Form vorgeschrieben; eine allgemeine Unterschriftspflicht ergibt sich aus der DGUV Vorschrift 1 nicht. Datum, Anlass bzw. Thema und die unterwiesenen Personen sollten für einen belastbaren Nachweis erkennbar sein. Spezielle Vorschriften, z. B. § 14 GefStoffV, können ausdrücklich eine schriftliche Dokumentation und Unterschrift verlangen.'
        },
        "19.6": {
            einfach: 'Beziehen Sie neue Abläufe oder Sicherheitstechniken in die nächste Schulung mit ein.',
            bghw: 'Berücksichtigen Sie aktuelle betriebliche Änderungen und neue Sicherheitstechniken gemäß § 12 ArbSchG und der DGUV Regel 108-601 in jeder Unterweisung.',
            rechtlich: 'Aktuelle Änderungen in den betrieblichen Abläufen oder neue Sicherheitstechniken sind bei der Unterweisung gemäß § 12 ArbSchG zu berücksichtigen. Änderungen sind unverzüglich, spätestens bei der nächsten turnusmäßigen Unterweisung, zu berücksichtigen (§ 12 Abs. 1 ArbSchG).'
        },
        "19.7": {
            einfach: 'Erstellen Sie die Gefährdungsbeurteilung für den Markt und halten Sie sie aktuell. Überprüfen und aktualisieren Sie sie insbesondere bei Änderungen der Arbeitsbedingungen, neuen Gefährdungen oder wenn die Wirksamkeitskontrolle Anpassungsbedarf zeigt.',
            bghw: 'Erstellen und dokumentieren Sie die Gefährdungsbeurteilung gemäß § 5 ArbSchG und § 3 DGUV Vorschrift 1. Überprüfen Sie sie insbesondere bei Änderungen der betrieblichen Gegebenheiten und passen Sie Maßnahmen bei Bedarf an.',
            rechtlich: 'Nach § 5 ArbSchG und § 3 DGUV Vorschrift 1 sind die Gefährdungen zu beurteilen und die erforderlichen Maßnahmen festzulegen. Nach § 3 Abs. 2 DGUV Vorschrift 1 ist die Gefährdungsbeurteilung insbesondere zu überprüfen, wenn sich betriebliche Gegebenheiten hinsichtlich Sicherheit und Gesundheitsschutz verändert haben; eine pauschale jährliche Neuerstellung ist nicht vorgeschrieben.'
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
            einfach: 'Nutzen Sie Teambesprechungen, wenn sie helfen, Arbeitsabläufe, Belastungen oder notwendige Verbesserungen gemeinsam zu klären.',
            bghw: 'Nutzen Sie Teambesprechungen als mögliche organisatorische Maßnahme, wenn dies aus Arbeitsorganisation, Kommunikation oder der Gefährdungsbeurteilung sinnvoll ist. DGUV Regel 108-601 unterstützt eine geeignete betriebliche Organisation, schreibt aber keine feste Besprechungsform vor.',
            rechtlich: 'Regelmäßige Teambesprechungen können als organisatorische Maßnahme zur Umsetzung der Gefährdungsbeurteilung, Unterweisung und Kommunikation eingesetzt werden; § 3 ArbSchG schreibt jedoch keine bestimmte Besprechungsform vor. Regelmäßige Teambesprechungen sind eine anerkannte organisatorische Maßnahme im Rahmen der Gefährdungsbeurteilung psychischer Belastung nach § 5 Abs. 3 Nr. 6 ArbSchG.'
        },
        "20.5": {
            einfach: 'Sorgen Sie für eine gute Einarbeitung neuer Mitarbeitender.',
            bghw: 'Stellen Sie eine strukturierte Einarbeitung gemäß § 12 ArbSchG und der DGUV Regel 108-601 für neue Mitarbeitende sicher.',
            rechtlich: 'Neue Beschäftigte sind vor Aufnahme der Tätigkeit und bei relevanten Änderungen tätigkeitsbezogen zu unterweisen (§ 12 ArbSchG); die Einarbeitung ist entsprechend der Gefährdungsbeurteilung zu organisieren. Eine strukturierte Einarbeitung ist als organisatorische Maßnahme im Sinne der Gefährdungsbeurteilung psychischer Belastung (§ 5 Abs. 3 Nr. 6 ArbSchG) zu werten, insbesondere zur Vermeidung von Überforderung.'
        },
        "20.6": {
            einfach: 'Unterweisen Sie Beschäftigte passend zu ihrer Tätigkeit und den vorhandenen Gefährdungen. Eine Unterweisung ist insbesondere bei Arbeitsbeginn und bei relevanten Änderungen erforderlich. Wiederholungen erfolgen bei Bedarf und mindestens einmal jährlich; einzelne Vorschriften können kürzere Fristen verlangen.',
            bghw: 'Führen Sie Unterweisungen tätigkeits- und gefährdungsbezogen durch. § 4 Abs. 1 DGUV Vorschrift 1 verlangt erforderlichenfalls Wiederholungen, mindestens jedoch einmal jährlich. Die DGUV Regel 100-001 stellt klar, dass dies nicht als eine einzige jährliche Gesamtunterweisung zu verstehen ist; Einstellungs-, Änderungs-, Anlass- und spezielle Fachunterweisungen sind entsprechend den jeweiligen Gefährdungen durchzuführen.',
            rechtlich: 'Nach § 12 ArbSchG muss die Unterweisung arbeitsplatz- bzw. aufgabenbezogen erfolgen, insbesondere bei Einstellung, Aufgabenänderungen sowie vor Einführung neuer Arbeitsmittel oder Technologien. § 4 Abs. 1 DGUV Vorschrift 1 verlangt erforderlichenfalls Wiederholungen, mindestens einmal jährlich, und deren Dokumentation. Spezielle Vorschriften können zusätzliche Anlässe oder kürzere Intervalle festlegen.'
        },
        "20.7": {
            einfach: 'Stellen Sie sicher, dass vorgeschriebene und für die Beschäftigten erforderliche Informationen gut zugänglich sind. Ein schwarzes Brett kann dafür genutzt werden, ist aber nicht allgemein gesetzlich vorgeschrieben.',
            bghw: 'Organisieren Sie die innerbetriebliche Information so, dass erforderliche Arbeitsschutzinformationen und vorgeschriebene Aushänge für Beschäftigte zugänglich sind. Ein schwarzes Brett im Sozialraum oder Kassenbüro ist eine mögliche organisatorische Lösung, aber keine allgemeine Pflicht aus § 3 ArbSchG.',
            rechtlich: 'Arbeitsschutzrechtliche Informations-, Unterweisungs- und gegebenenfalls Aushangpflichten sind zu erfüllen. § 3 ArbSchG schreibt jedoch kein bestimmtes schwarzes Brett im Sozialraum oder Kassenbüro vor; die geeignete Form der innerbetrieblichen Information ist betrieblich festzulegen.'
        },
        "20.8": {
            einfach: 'Kommunizieren Sie wichtige betriebliche Entscheidungen verständlich und nachvollziehbar, besonders wenn sie Arbeitsabläufe oder Belastungen verändern.',
            bghw: 'Gestalten Sie die Kommunikation bei Veränderungen so, dass Beschäftigte die für ihre Arbeit relevanten Informationen erhalten. Transparente Kommunikation kann eine geeignete organisatorische Maßnahme sein; Art und Umfang richten sich nach der betrieblichen Situation und Gefährdungsbeurteilung.',
            rechtlich: 'ArbSchG und BGB schreiben keine allgemeine Pflicht vor, jede betriebliche Entscheidung in einer bestimmten Form transparent zu erläutern. Soweit Veränderungen Sicherheit, Gesundheit oder Arbeitsbedingungen betreffen, sind die einschlägigen Informations-, Unterweisungs- und Beteiligungspflichten zu erfüllen; geeignete Kommunikation kann zudem eine Maßnahme aus der Gefährdungsbeurteilung sein.'
        },
        "20.9": {
            einfach: 'Geben Sie angemessenes und respektvolles Feedback. Positives Feedback kann zu einer guten Zusammenarbeit beitragen.',
            bghw: 'Berücksichtigen Sie Führungsverhalten und soziale Beziehungen bei der Gestaltung gesunder Arbeitsbedingungen. Positives Feedback kann dabei eine sinnvolle Maßnahme sein, ist aber keine eigenständige Pflicht aus der DGUV Regel 108-601.',
            rechtlich: 'Positives Feedback kann eine geeignete organisatorische Maßnahme gegen psychische Belastungen sein; eine ausdrückliche gesetzliche Pflicht zu Lob besteht nicht. Maßgeblich ist die Gefährdungsbeurteilung psychischer Belastungen nach § 5 ArbSchG. Positives Feedback ist eine anerkannte Maßnahme im Handlungsfeld „Führung“ der Gefährdungsbeurteilung psychischer Belastung nach § 5 Abs. 3 Nr. 6 ArbSchG.'
        },
        "20.10": {
            einfach: 'Üben Sie Kritik sachlich und fair.',
            bghw: 'Üben Sie konstruktive Kritik gemäß § 75 BetrVG und der DGUV Regel 108-601 sachlich und wertschätzend.',
            rechtlich: 'Führen Sie Kritikgespräche sachlich, fair und respektvoll. Die konkrete Ausgestaltung ist Bestandteil einer geeigneten betrieblichen Organisation und Führungskultur. Konstruktive Kritikkultur zählt zu den organisatorischen Maßnahmen der Gefährdungsbeurteilung psychischer Belastung; § 75 BetrVG verpflichtet zusätzlich zur fairen, gleichbehandelnden Behandlung der Beschäftigten.'
        },
        "20.11": {
            einfach: 'Machen Sie bei erkennbarem Bedarf Informationen und Ansprechstellen zur Suchtprävention gut zugänglich. Ein bestimmter Aushang ist nicht allgemein vorgeschrieben.',
            bghw: 'Berücksichtigen Sie Suchtgefährdungen und betriebliche Unterstützungsangebote, soweit dies für den Betrieb relevant ist. Informationen können z. B. über Aushang, Intranet oder direkte Ansprechstellen zugänglich gemacht werden; die DGUV Regel 108-601 schreibt keinen bestimmten Aushang vor.',
            rechtlich: '§ 3 ArbSchG schreibt keinen bestimmten Aushang zur Suchtprävention vor. Ergibt die Gefährdungsbeurteilung Handlungsbedarf, sind geeignete organisatorische Schutz- und Unterstützungsmaßnahmen festzulegen. Die konkrete Informationsform ist betrieblich zu bestimmen.'
        },
        "20.12": {
            einfach: 'Bieten Sie erkrankten Mitarbeitenden Unterstützung bei der Rückkehr an den Arbeitsplatz.',
            bghw: 'Implementieren Sie ein betriebliches Eingliederungsmanagement gemäß § 167 SGB IX und der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Ein betriebliches Eingliederungsmanagement ist nach § 167 Abs. 2 SGB IX anzubieten, wenn Beschäftigte innerhalb eines Jahres länger als sechs Wochen ununterbrochen oder wiederholt arbeitsunfähig sind. Das BEM-Gespräch ist den Beschäftigten anzubieten; die Teilnahme ist freiwillig, die Nichtteilnahme darf keine Nachteile zur Folge haben.'
        },
        "20.13": {
            einfach: 'Prüfen Sie bei Alleinarbeit, welche Gefährdungen bestehen und welche Schutzmaßnahmen erforderlich sind. Bei erhöhtem Überfall- oder Gewaltrisiko müssen die besonderen Vorgaben zur Überfallprävention berücksichtigt werden.',
            bghw: 'Bewerten Sie Alleinarbeit in der Gefährdungsbeurteilung und legen Sie geeignete Schutzmaßnahmen fest. Für Verkaufsstellen mit Überfallgefährdung sind zusätzlich DGUV Vorschrift 25 und DGUV Regel 108-010 maßgeblich; ein pauschales Verbot jeder Alleinarbeit besteht daraus nicht.',
            rechtlich: 'Alleinarbeit ist nach § 5 ArbSchG anhand der konkreten Gefährdungen zu beurteilen; daraus folgt kein allgemeines Verbot. Soweit Beschäftigte mit Bargeld umgehen oder von einem Überfall betroffen sein können, sind zusätzlich die für die Verkaufsstelle geltenden Anforderungen der DGUV Vorschrift 25 und deren Konkretisierung durch DGUV Regel 108-010 umzusetzen.'
        },
        "20.14": {
            einfach: 'Legen Sie vorab fest, wie Beschäftigte nach einem Überfall oder Überfallversuch sofort unterstützt und betreut werden.',
            bghw: 'Legen Sie im Notfallplan die unmittelbare Betreuung von Überfallbetroffenen fest. DGUV Vorschrift 25 § 20 und DGUV Regel 108-010 verlangen, dass auch nach einem versuchten Überfall geeignete Betreuungs- und Meldewege vorbereitet sind.',
            rechtlich: '§ 20 Abs. 1 DGUV Vorschrift 25 verlangt im Rahmen der Notfallplanung Festlegungen zu den Maßnahmen unmittelbar nach einem Überfall; dazu gehört die angemessene Betreuung der betroffenen Versicherten. DGUV Regel 108-010 konkretisiert dies für Verkaufsstellen und bezieht auch versuchte Überfälle bzw. Bedrohungssituationen ein.'
        },
        "20.15": {
            einfach: 'Unterweisen Sie Beschäftigte passend zu den festgestellten Gewalt- und Überfallrisiken und üben Sie das sichere Verhalten, wenn dies für die Tätigkeit erforderlich ist.',
            bghw: 'Leiten Sie Schulungs- und Unterweisungsinhalte zu Aggression, Gewalt und Überfällen aus der Gefährdungsbeurteilung ab. Für überfallgefährdete Verkaufsstellen sind insbesondere DGUV Vorschrift 25 und DGUV Regel 108-010 zu berücksichtigen.',
            rechtlich: 'Aus § 3 ArbSchG folgt keine pauschale Pflicht zu einer bestimmten Deeskalationsschulung. Ergeben sich aus der Gefährdungsbeurteilung relevante Gewalt- oder Überfallgefährdungen, sind geeignete Schutzmaßnahmen sowie die erforderlichen Unterweisungen festzulegen. Für Beschäftigte mit Bargeldumgang oder möglicher Überfallbetroffenheit gelten zusätzlich die Unterweisungsvorgaben der DGUV Vorschrift 25.'
        },
        "20.16": {
            einfach: 'Hören Sie auf Vorschläge Ihrer Mitarbeitenden und beziehen Sie sie ein.',
            bghw: 'Beziehen Sie Mitarbeiteranregungen gemäß der DGUV Regel 108-601 „Branche Einzelhandel“ zur Mitarbeiterbeteiligung aktiv in betriebliche Entscheidungen ein.',
            rechtlich: 'Beschäftigte sind im Rahmen der einschlägigen Beteiligungsrechte und der betrieblichen Organisation angemessen einzubeziehen; konkrete Beteiligungsrechte können sich insbesondere aus dem BetrVG ergeben. Beteiligungsrechte der Beschäftigten ergeben sich insbesondere aus § 81 BetrVG (Unterrichtungs- und Erörterungsrecht) sowie ggf. betrieblichen Vorschlagswesen-Regelungen.'
        },
        "20.17": {
            einfach: 'Prüfen Sie, welche Qualifikationen für die jeweiligen Aufgaben erforderlich sind, und ermöglichen Sie passende Schulungen oder Weiterbildungen, wenn dafür Bedarf besteht.',
            bghw: 'Stellen Sie sicher, dass Beschäftigte für ihre Aufgaben ausreichend qualifiziert und unterwiesen sind. Darüber hinausgehende Weiterbildung richtet sich nach betrieblichem und individuellem Bedarf; § 82 BetrVG begründet keine allgemeine arbeitsschutzrechtliche Weiterbildungspflicht.',
            rechtlich: 'Weiterbildungsmaßnahmen sind entsprechend dem betrieblichen Bedarf und den festgestellten Qualifikationsanforderungen zu planen. § 82 BetrVG regelt insbesondere das Gespräch über berufliche Entwicklung und Weiterbildung und begründet nicht pauschal eine allgemeine Schulungspflicht. § 82 Abs. 2 BetrVG begründet einen Anspruch auf ein Gespräch über die berufliche Entwicklung; eine allgemeine Fortbildungspflicht des Arbeitgebers besteht daraus nicht.'
        }
    },
    "Kundenaufzug": {        "21.1": {
            einfach: 'Beheben Sie sichtbare Schäden am Kundenaufzug und sorgen Sie dafür, dass vorgeschriebene Angaben wie die Tragfähigkeit gut lesbar sind.',
            bghw: 'Veranlassen Sie die Beseitigung sichtbarer Mängel am Kundenaufzug und halten Sie die erforderlichen Kennzeichnungen gut lesbar. Berücksichtigen Sie dabei BetrSichV Anhang 1 Nr. 4 und die branchenspezifischen Hinweise der DGUV Regel 108-601.',
            rechtlich: 'Aufzugsanlagen sind sicher zu betreiben und regelmäßig auf offensichtliche Mängel zu kontrollieren (BetrSichV Anhang 1 Nr. 4.6). Erkennbare sicherheitsrelevante Mängel sind zu bewerten und erforderliche Maßnahmen unverzüglich einzuleiten; erforderliche Kennzeichnungen müssen lesbar sein.'
        },
        "21.2": {
            einfach: 'Lassen Sie defekte Aufzugstüren, Lichtschranken oder Türsensoren umgehend fachgerecht reparieren und halten Sie den Zugangsbereich sicher und frei.',
            bghw: 'Nehmen Sie Mängel an Türen und Schutzeinrichtungen ernst und veranlassen Sie eine fachgerechte Instandsetzung. Zugänge sind entsprechend den Arbeitsstättenanforderungen sicher und frei von Stolperstellen zu halten.',
            rechtlich: 'Der Betreiber hat die Aufzugsanlage regelmäßig auf offensichtliche sicherheitsrelevante Mängel zu kontrollieren (BetrSichV Anhang 1 Nr. 4.6) und erforderliche Instandhaltungsmaßnahmen nach § 10 BetrSichV zu treffen. Verkehrs- und Zugangsbereiche sind sicher zu halten.'
        },
        "21.3": {
            einfach: 'Lassen Sie defekte Bedientasten, Anzeigen oder die Notrufeinrichtung umgehend fachgerecht instand setzen.',
            bghw: 'Stellen Sie die Funktionsfähigkeit der Bedienelemente und insbesondere der Notrufeinrichtung sicher. Mängel sind fachgerecht zu beseitigen; die Anforderungen an das Notrufsystem richten sich nach der konkreten Aufzugsanlage.',
            rechtlich: 'Für die von BetrSichV Anhang 1 Nr. 4.1 erfassten Aufzugsanlagen muss im Fahrkorb ein wirksames Zweiwege-Kommunikationssystem vorhanden sein, über das ein Notdienst ständig erreicht werden kann. Erkannte Mängel an Bedienelementen oder Sicherheitseinrichtungen sind im Rahmen der Instandhaltung zu beseitigen.'
        },
        "21.4": {
            einfach: 'Sorgen Sie dafür, dass der Aufzugsnotruf funktioniert und der zuständige Notdienst ständig erreichbar ist. Beschäftigte müssen wissen, wie sie bei einem Einschluss unterstützen und Hilfe organisieren.',
            bghw: 'Stellen Sie das wirksame Zweiwege-Kommunikationssystem zum Notdienst sicher und unterweisen Sie zuständige Beschäftigte über ihre Aufgaben im Notfall. Befreiungen dürfen nur durch hierfür vorgesehene und geeignete Personen erfolgen.',
            rechtlich: 'BetrSichV Anhang 1 Nr. 4.1 verlangt bei den dort genannten Aufzugsanlagen ein wirksames Zweiwege-Kommunikationssystem, über das ein Notdienst ständig erreichbar ist. Der Notfallplan muss u. a. die Personen benennen, die eine Befreiung Eingeschlossener vornehmen können; andere Beschäftigte dürfen daraus nicht eigenmächtig eine technische Befreiung ableiten.'
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
            einfach: 'Halten Sie einen aktuellen Notfallplan für den Aufzug bereit. Darin müssen Zuständigkeiten, Erreichbarkeit des Notdienstes und die Befreiung eingeschlossener Personen klar geregelt sein.',
            bghw: 'Erstellen und pflegen Sie den Notfallplan für die Aufzugsanlage. Er muss insbesondere Standort, verantwortliche Stelle, Zugangsberechtigte, Personen für die Befreiung, Erste-Hilfe-Kontakte, den voraussichtlichen Beginn der Befreiung und die Notbefreiungsanleitung abdecken.',
            rechtlich: 'Nach BetrSichV Anhang 1 Nr. 4.1 ist für die dort erfassten Aufzugsanlagen ein Notfallplan anzufertigen und dem Notdienst vor der Inbetriebnahme zur Verfügung zu stellen. Der vorgeschriebene Mindestinhalt umfasst Standort, verantwortlichen Arbeitgeber, Zugangsberechtigte, Personen für die Befreiung, Erste-Hilfe-Kontakte, Angaben zum voraussichtlichen Beginn der Befreiung und die Notbefreiungsanleitung. Eine pauschale 30-Minuten-Frist oder generelle Pflicht zu einem zweiten Notdienst wird daraus nicht abgeleitet.'
        },
        "21.9": {
            einfach: 'Sorgen Sie dafür, dass bei einer Aufzugsstörung sofort klar ist, wie der Notdienst erreicht wird und wer vor Ort welche Aufgabe übernimmt.',
            bghw: 'Organisieren Sie die Alarmierung anhand des Notfallplans und stellen Sie sicher, dass der Notdienst auf einen Notruf unverzüglich angemessen reagieren und sachgerechte Hilfemaßnahmen einleiten kann.',
            rechtlich: 'BetrSichV Anhang 1 Nr. 4.1 verlangt ein wirksames Zweiwege-Kommunikationssystem zum ständig erreichbaren Notdienst und einen Notfallplan. Die innerbetriebliche Alarmierungsorganisation ist daran auszurichten; eine darüber hinausgehende starre Form der Alarmierungskette wird nicht pauschal vorgeschrieben.'
        },
        "21.10": {
            einfach: 'Halten Sie die Kontaktdaten und Zuständigkeiten für den Aufzugsnotfall aktuell und für das zuständige Personal schnell verfügbar.',
            bghw: 'Pflegen Sie die für den Notfallplan und die betriebliche Organisation erforderlichen Kontaktdaten und Zuständigkeiten und stellen Sie deren Verfügbarkeit sicher.',
            rechtlich: 'Die im Notfallplan nach BetrSichV Anhang 1 Nr. 4.1 erforderlichen Angaben und Kontakte müssen für eine wirksame Notfallorganisation aktuell sein. Entscheidend ist, dass der vorgeschriebene Notdienst über das Zweiwege-Kommunikationssystem ständig erreichbar ist.'
        },
        "21.11": {
            einfach: 'Halten Sie die vorgeschriebene Notbefreiungsanleitung in unmittelbarer Nähe der Aufzugsanlage bereit.',
            bghw: 'Stellen Sie die Notbefreiungsanleitung und die zur Befreiung erforderlichen Einrichtungen in unmittelbarer Nähe der Anlage bereit und berücksichtigen Sie sie im Notfallplan.',
            rechtlich: 'BetrSichV Anhang 1 Nr. 4.1 verlangt, dass Notbefreiungsanleitung und die zur Befreiung Eingeschlossener erforderlichen Einrichtungen vor der Inbetriebnahme in unmittelbarer Nähe der Anlage bereitgestellt werden. Der Notfallplan ist dem Notdienst zur Verfügung zu stellen.'
        },
        "21.12": {
            einfach: 'Legen Sie organisatorisch fest, wie Notdienst oder Einsatzkräfte im Ereignisfall schnell zur richtigen Aufzugsanlage gelangen.',
            bghw: 'Ergänzen Sie die betriebliche Notfallorganisation so, dass Notdienst und Einsatzkräfte den Standort und die erforderlichen Zugänge ohne Verzögerung erreichen können.',
            rechtlich: 'Der Notfallplan nach BetrSichV Anhang 1 Nr. 4.1 muss den Standort der Aufzugsanlage sowie Angaben zu Personen enthalten, die Zugang zu allen Einrichtungen der Anlage haben. Daraus ist eine geeignete betriebliche Einweisung der Hilfeleistenden zu organisieren.'
        },
        "21.13": {
            einfach: 'Unterweisen Sie die zuständigen Beschäftigten über ihre Aufgaben bei einer Aufzugsstörung und bei eingeschlossenen Personen. Wiederholen Sie die Unterweisung mindestens jährlich und zusätzlich bei Bedarf.',
            bghw: 'Unterweisen Sie zuständige Beschäftigte arbeitsplatz- und aufgabenbezogen über die Notfallorganisation. Die Wiederholung erfolgt nach DGUV Vorschrift 1 § 4 erforderlichenfalls, mindestens jedoch einmal jährlich, sowie bei relevanten Änderungen oder Anlässen.',
            rechtlich: '§ 12 ArbSchG verlangt eine angemessene, arbeitsplatz- bzw. aufgabenbezogene Unterweisung und erforderlichenfalls regelmäßige Wiederholung. Ergänzend verlangt § 4 DGUV Vorschrift 1 eine erforderlichenfalls wiederholte, mindestens jährliche Unterweisung und deren Dokumentation. Inhaltlich ist die konkrete Notfallorganisation der Aufzugsanlage zugrunde zu legen.'
        },
        "21.14": {
            einfach: 'Halten Sie Kontakt zu eingeschlossenen Personen und sorgen Sie dafür, dass der Notdienst unverzüglich die erforderliche Hilfe einleitet.',
            bghw: 'Organisieren Sie die Betreuung Eingeschlossener als Teil der Notfallmaßnahmen und stellen Sie sicher, dass der ständig erreichbare Notdienst unverzüglich angemessen reagieren kann.',
            rechtlich: 'BetrSichV Anhang 1 Nr. 4.1 verlangt ein wirksames Zweiwege-Kommunikationssystem und eine Organisation, durch die der Notdienst auf Notrufe unverzüglich angemessen reagieren und umgehend sachgerechte Hilfemaßnahmen einleiten kann. Die konkrete Betreuung ist hieran auszurichten.'
        },
        "21.15": {
            einfach: 'Prüfen Sie, ob die Notfallorganisation auch bei Ausfällen zuverlässig funktioniert. Entscheidend ist, dass der vorgeschriebene Notdienst ständig erreichbar bleibt.',
            bghw: 'Gestalten Sie die Notfallorganisation so robust, dass die ständige Erreichbarkeit des erforderlichen Notdienstes und eine sachgerechte Hilfe auch bei organisatorischen Störungen gewährleistet bleiben.',
            rechtlich: 'BetrSichV Anhang 1 Nr. 4.1 verlangt die ständige Erreichbarkeit eines Notdienstes über das Zweiwege-Kommunikationssystem. Wie der Betreiber diese Verfügbarkeit organisatorisch absichert, ist festzulegen; eine eigenständige gesetzliche Pflicht zu einem bestimmten zweiten oder Ersatz-Notdienst wird hier nicht behauptet.'
        }
    },
    "Lastenaufzug": {        "22.1": {
            einfach: 'Beheben Sie sichtbare Schäden am Lastenaufzug und lassen Sie sicherheitsrelevante Mängel fachgerecht instand setzen.',
            bghw: 'Kontrollieren Sie die Aufzugsanlage regelmäßig auf offensichtliche Mängel und veranlassen Sie bei sicherheitsrelevanten Feststellungen die erforderliche Instandhaltung.',
            rechtlich: 'BetrSichV Anhang 1 Nr. 4.6 verlangt regelmäßige Kontrollen auf offensichtliche Mängel, die die sichere Verwendung beeinträchtigen können. Erforderliche Instandhaltungsmaßnahmen sind nach § 10 BetrSichV zu treffen.'
        },
        "22.2": {
            einfach: 'Bringen Sie eine gut sichtbare Tragfähigkeitsangabe an und weisen Sie das Personal auf die zulässige Beladung hin.',
            bghw: 'Stellen Sie eine deutlich sichtbare Tragfähigkeitsangabe sicher und unterweisen Sie das Personal zur zulässigen Beladung gemäß TRBS 3121 sowie der DGUV Regel 108-601 „Branche Einzelhandel“.',
            rechtlich: 'Die zulässige Tragfähigkeit ist gemäß BetrSichV deutlich sichtbar anzugeben; eine Überladung oder unsachgemäße Beladung ist zu unterbinden. Die Tragfähigkeitsangabe ist gemäß Maschinenrichtlinie 2006/42/EG bzw. Aufzugsrichtlinie 2014/33/EU sowie BetrSichV dauerhaft und gut lesbar am Aufzug anzubringen.'
        },
        "22.3": {
            einfach: 'Lassen Sie defekte Aufzugstüren oder Türsicherungen umgehend fachgerecht instand setzen und nehmen Sie die Anlage bei einer unmittelbaren Gefahr nicht weiter in Betrieb.',
            bghw: 'Veranlassen Sie bei Mängeln an Türen oder Sicherheitseinrichtungen eine fachgerechte Bewertung und Instandsetzung. Bei nicht sicherer Verwendung ist die Anlage bis zur Beseitigung des Mangels entsprechend zu sichern.',
            rechtlich: 'Der Betreiber muss die Aufzugsanlage regelmäßig auf offensichtliche sicherheitsrelevante Mängel kontrollieren (BetrSichV Anhang 1 Nr. 4.6) und erforderliche Instandhaltungsmaßnahmen nach § 10 BetrSichV treffen. Die weitere Verwendung ist nur zulässig, wenn sie sicher erfolgen kann.'
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
            einfach: 'Lassen Sie defekte Bedienelemente, Anzeigen oder Sicherheitseinrichtungen fachgerecht instand setzen.',
            bghw: 'Halten Sie Bedienelemente und Sicherheitseinrichtungen funktionsfähig und berücksichtigen Sie festgestellte Mängel bei Kontrolle, Instandhaltung und den vorgeschriebenen Prüfungen.',
            rechtlich: 'Aufzugsanlagen sind regelmäßig auf offensichtliche Mängel zu kontrollieren und instand zu halten (BetrSichV Anhang 1 Nr. 4.2 und 4.6). Zusätzlich gelten die wiederkehrenden Prüfungen nach § 16 BetrSichV für die hiervon erfassten Anlagen.'
        },
        "22.7": {
            einfach: 'Holen Sie die fällige Prüfung nach und beheben Sie offene Mängel aus dem letzten Prüfbericht. Die Hauptprüfung durch eine zugelassene Überwachungsstelle (ZÜS) ist gesetzlich spätestens alle zwei Jahre Pflicht.',
            bghw: 'Veranlassen Sie die fristgerechte Prüfung gemäß § 16 BetrSichV und der DGUV Regel 108-601 und arbeiten Sie festgestellte Mängel vollständig ab. Die ZÜS-Hauptprüfung darf gemäß § 16 i. V. m. Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV im Abstand von höchstens zwei Jahren erfolgen.',
            rechtlich: 'Die wiederkehrende Prüfung des Lastenaufzugs ist gemäß § 16 BetrSichV durch eine zugelassene Überwachungsstelle (ZÜS) fristgerecht durchzuführen; festgestellte Mängel sind vollständig abzuarbeiten. Die vom Arbeitgeber nach § 3 Abs. 6 BetrSichV festzulegende Prüffrist der ZÜS-Hauptprüfung darf gemäß Anhang 2 Abschnitt 2 Nr. 4.1 BetrSichV zwei Jahre nicht überschreiten.'
        },
        "22.8": {
            einfach: 'Unterweisen Sie die zuständigen Beschäftigten vor der Bedienung in der sicheren und bestimmungsgemäßen Nutzung und wiederholen Sie die Unterweisung mindestens jährlich sowie bei Bedarf.',
            bghw: 'Unterweisen Sie zuständige Beschäftigte arbeitsplatz- und aufgabenbezogen zur sicheren Bedienung und Beladung. Die Wiederholung erfolgt nach DGUV Vorschrift 1 § 4 erforderlichenfalls, mindestens jedoch jährlich, sowie anlassbezogen.',
            rechtlich: '§ 12 ArbSchG verlangt eine angemessene Unterweisung vor Aufnahme bzw. bei Änderungen der Tätigkeit und eine an die Gefährdungsentwicklung angepasste, erforderlichenfalls regelmäßige Wiederholung. Ergänzend verlangt § 4 DGUV Vorschrift 1 eine erforderlichenfalls wiederholte, mindestens jährliche Unterweisung und deren Dokumentation.'
        },
        "22.9": {
            einfach: 'Legen Sie für Störungen oder einen möglichen Einschluss fest, wie Hilfe gerufen wird, wer zuständig ist und welche Informationen benötigt werden.',
            bghw: 'Richten Sie die Notfallorganisation nach den für die konkrete Aufzugsanlage geltenden Anforderungen aus. Ist ein Einschluss möglich, müssen Hilfeherbeirufung, Notfallplan und Notbefreiungsorganisation entsprechend BetrSichV Anhang 1 Nr. 4.1 sichergestellt sein.',
            rechtlich: 'Für Aufzugsanlagen, in denen Personen eingeschlossen werden können, gelten die Notfallanforderungen aus BetrSichV Anhang 1 Nr. 4.1 entsprechend. Dazu gehören je nach Anlagenart insbesondere die Möglichkeit, Hilfe herbeizurufen, der Notfallplan und die Notbefreiungsanleitung. Eine pauschale Bezugnahme auf eine bestimmte Reaktionszeit der alten TRBS 3121 wird vermieden.'
        }
    },

    "Flüssiggasflaschen": {
        "23.1": {
            einfach: 'Lagern Sie Flüssiggasflaschen vorzugsweise im Freien in einem geeigneten Lagerbereich.',
            bghw: 'Bevorzugen Sie gemäß DGUV Regel 110-010 die Lagerung von Flüssiggasflaschen im Freien gegenüber der Lagerung in Räumen.',
            rechtlich: 'Die Lagerung ist anhand der Gefährdungsbeurteilung nach GefStoffV und TRGS 510 festzulegen. DGUV Regel 110-010 konkretisiert, dass die Lagerung im Freien erfahrungsgemäß vorzuziehen ist.'
        },
        "23.2": {
            einfach: 'Ermitteln Sie Anzahl und Gesamtmenge der gelagerten Flüssiggasflaschen und legen Sie danach die erforderlichen Schutzmaßnahmen fest.',
            bghw: 'Ordnen Sie die Lagermenge nach DGUV Regel 110-010 dem zutreffenden Mengenbereich zu: eine Flasche bzw. maximal 50 kg, mehr als eine Flasche oder mehr als 50 kg bis 200 kg sowie über 200 kg.',
            rechtlich: 'DGUV Regel 110-010 Tabelle 7 staffelt die Schutzmaßnahmen nach der Lagermenge. Beim Überschreiten einer der jeweiligen Mengenschwellen sind die weitergehenden Schutzmaßnahmen anzuwenden.'
        },
        "23.3": {
            einfach: 'Richten Sie bei mehr als einer Flasche oder mehr als 50 kg Flüssiggas einen geeigneten Lagerbereich mit den erforderlichen zusätzlichen Schutzmaßnahmen ein.',
            bghw: 'Bei mehr als einer Flüssiggasflasche oder mehr als 50 kg sind nach DGUV Regel 110-010 die weitergehenden Anforderungen an ein Flüssiggaslager zu berücksichtigen.',
            rechtlich: 'DGUV Regel 110-010 fordert bei mehr als einer Flasche oder mehr als 50 kg Flüssiggas weitergehende Schutzmaßnahmen; die konkrete Ausführung richtet sich zusätzlich nach GefStoffV und TRGS 510.'
        },
        "23.4": {
            einfach: 'Lagern Sie Flüssiggasflaschen stehend und sichern Sie sie zuverlässig gegen Umfallen und Herabfallen.',
            bghw: 'Lagern Sie LPG-Flaschen entsprechend TRGS 510 stehend und sichern Sie Druckgasbehälter gegen Umfallen oder Herabfallen.',
            rechtlich: 'TRGS 510 Abschnitt 10.2 verlangt die Sicherung von Druckgasbehältern gegen Umfallen oder Herabfallen und bestimmt, dass Flüssiggasflaschen stehend zu lagern sind.'
        },
        "23.5": {
            einfach: 'Sichern Sie den Lagerbereich gegen den Zugriff unbefugter Personen.',
            bghw: 'Beschränken Sie den Zugang zum Flüssiggaslager entsprechend Gefährdungsbeurteilung, TRGS 510 und DGUV Regel 110-010 auf befugte Personen.',
            rechtlich: 'Die organisatorischen Schutzmaßnahmen für die Lagerung von Gasen unter Druck sind nach GefStoffV und TRGS 510 festzulegen; der Lagerbereich ist gegen unbefugten Zugriff zu sichern, soweit dies aufgrund der Gefährdung erforderlich ist.'
        },
        "23.6": {
            einfach: 'Schützen Sie die Flaschen vor unzulässiger Erwärmung und halten Sie die für den Lagerort erforderlichen Schutzmaßnahmen ein.',
            bghw: 'Schützen Sie Druckgasbehälter entsprechend TRGS 510 vor übermäßiger äußerer Wärmeeinwirkung und berücksichtigen Sie die für Lagerort und Lagermenge erforderlichen Schutzmaßnahmen.',
            rechtlich: 'TRGS 510 Abschnitt 10.2 fordert Schutz vor übermäßiger äußerer Wärmeeinwirkung; weitere Abstände und Schutzmaßnahmen sind anhand von Lagerart, Lagermenge und Gefährdungsbeurteilung festzulegen.'
        },
        "23.7": {
            einfach: 'Schließen Sie die Flaschenventile und schützen Sie sie gegen Beschädigung.',
            bghw: 'Sorgen Sie dafür, dass Ventile geschlossen und mit einer geeigneten Schutzeinrichtung, z. B. Schutzkappe oder Schutzkragen, gegen Beschädigung geschützt sind.',
            rechtlich: 'TRGS 510 Abschnitt 10.2 fordert den Schutz der Ventile von Druckgasbehältern durch geeignete Schutzeinrichtungen; die sichere Lagerung ist nach GefStoffV zu gewährleisten.'
        },
        "23.8": {
            einfach: 'Kontrollieren Sie insbesondere teilentleerte Rückgabeflaschen vor der Rückführung ins Lager auf Ventildichtheit, z. B. mit geeignetem Lecksuchmittel.',
            bghw: 'Führen Sie die in DGUV Regel 110-010 beschriebene Dichtheitskontrolle des Flaschenventils vor der Rückführung teilentleerter Flaschen in das Lager durch.',
            rechtlich: 'DGUV Regel 110-010 Abschnitt 5.1.19 beschreibt den Dichtheitsnachweis der Flaschenventile, z. B. mit schaumbildenden Mitteln, ausdrücklich auch für teilentleerte Flaschen vor der Rückführung in das Lager.'
        },
        "23.9": {
            einfach: 'Nehmen Sie beschädigte, undichte oder auffällige Flaschen aus dem normalen Ablauf und sichern Sie sie nach dem festgelegten Notfallverfahren.',
            bghw: 'Legen Sie für undichte oder beschädigte Flüssiggasflaschen geeignete Maßnahmen nach Gefährdungsbeurteilung und DGUV Regel 110-010 fest; behandeln Sie solche Flaschen nicht wie unauffälliges Lagergut.',
            rechtlich: 'Bei erkennbaren Schäden oder Undichtheiten sind unverzüglich die aus der Gefährdungsbeurteilung nach GefStoffV abgeleiteten Schutz- und Notfallmaßnahmen anzuwenden.'
        },
        "23.10": {
            einfach: 'Sorgen Sie dafür, dass Kennzeichnungen lesbar bleiben und Inhalt sowie Gefahren eindeutig erkennbar sind.',
            bghw: 'Kontrollieren Sie die gefahrstoffrechtliche Kennzeichnung der Flüssiggasflaschen auf Erkennbarkeit und berücksichtigen Sie beschädigte oder unklare Kennzeichnungen bei der Annahme und Lagerung.',
            rechtlich: 'Die gefahrstoffrechtliche Kennzeichnung muss die sichere Identifikation des Gefahrstoffs und seiner Gefahren ermöglichen; maßgeblich sind insbesondere GefStoffV und CLP-Verordnung.'
        },
        "23.11": {
            einfach: 'Legen Sie einen sicheren Ablauf für die Ausgabe der Flaschen an Kundinnen und Kunden fest.',
            bghw: 'Regeln Sie Ausgabe und Bereitstellung von Flüssiggasflaschen so, dass Lager- und Transportanforderungen der DGUV Regel 108-601, DGUV Regel 110-010 und TRGS 510 eingehalten werden.',
            rechtlich: 'Ausgabe und Bereitstellung sind in der Gefährdungsbeurteilung zu berücksichtigen und entsprechend GefStoffV/TRGS 510 sicher zu organisieren.'
        },
        "23.12": {
            einfach: 'Legen Sie einen sicheren Ablauf für die Rücknahme leerer und teilentleerter Flaschen fest.',
            bghw: 'Regeln Sie die Rücknahme einschließlich Ventilkontrolle, Umgang mit auffälligen Flaschen und Weitertransport in den Lagerbereich.',
            rechtlich: 'Die Rücknahme ist als Tätigkeit mit Gefahrstoffen in der Gefährdungsbeurteilung zu berücksichtigen; erforderliche Schutzmaßnahmen ergeben sich aus GefStoffV, TRGS 510 und DGUV Regel 110-010.'
        },
        "23.13": {
            einfach: 'Bringen Sie zurückgenommene Flaschen ohne unnötige Zwischenlagerung in den vorgesehenen Lagerbereich.',
            bghw: 'Organisieren Sie den zeitnahen innerbetrieblichen Transport zurückgenommener Flüssiggasflaschen in den vorgesehenen Lagerbereich.',
            rechtlich: 'Ein- und Auslagern sowie innerbetrieblicher Transport sind nach DGUV Regel 110-010 Bestandteil der bei der Lagerung zu berücksichtigenden Tätigkeiten und in der Gefährdungsbeurteilung zu erfassen.'
        },
        "23.14": {
            einfach: 'Stellen Sie Flüssiggasflaschen nicht auf Verkehrs- oder Fluchtwegen ab und vermeiden Sie eine unzulässige Lagerung im Verkaufsraum.',
            bghw: 'Halten Sie Verkehrs- und Fluchtwege frei und organisieren Sie Bereitstellung bzw. Lagerung von Flüssiggasflaschen nur in dafür geeigneten Bereichen.',
            rechtlich: 'Verkehrs- und Fluchtwege sind nach ArbStättV/ASR freizuhalten. Ob eine Bereitstellung oder Lagerung von Flüssiggasflaschen in Räumen zulässig ist, richtet sich zusätzlich nach GefStoffV und TRGS 510.'
        },
        "23.15": {
            einfach: 'Verwenden Sie geeignete Transporthilfen und sichern Sie die Flaschen beim Transport gegen Umfallen oder Herabfallen.',
            bghw: 'Stellen Sie geeignete Transporthilfen bereit und berücksichtigen Sie beim innerbetrieblichen Transport die Schutzmaßnahmen der DGUV Regel 108-601 und DGUV Regel 110-010.',
            rechtlich: 'Der innerbetriebliche Transport ist in der Gefährdungsbeurteilung zu berücksichtigen; Druckgasbehälter sind gegen mechanische Gefährdungen, insbesondere Umfallen und Herabfallen, zu sichern.'
        },
        "23.16": {
            einfach: 'Halten Sie wirksame Zündquellen vom gefährdeten Bereich fern und setzen Sie die festgelegten Brand- und Explosionsschutzmaßnahmen um.',
            bghw: 'Bewerten Sie mögliche Gefahrenbereiche und vermeiden Sie wirksame Zündquellen entsprechend DGUV Regel 110-010 und TRGS 510.',
            rechtlich: 'Brand- und Explosionsgefährdungen sind nach GefStoffV zu beurteilen. TRGS 510 und DGUV Regel 110-010 konkretisieren die erforderlichen Schutzmaßnahmen bei der Lagerung entzündbarer Gase.'
        },
        "23.17": {
            einfach: 'Bringen Sie die aufgrund der Gefährdungsbeurteilung erforderlichen Warn-, Verbots- und Sicherheitskennzeichnungen gut sichtbar an.',
            bghw: 'Kennzeichnen Sie den Lagerbereich entsprechend Gefährdungsbeurteilung, ASR A1.3 und den gefahrstoffrechtlichen Anforderungen.',
            rechtlich: 'Erforderliche Sicherheitskennzeichnungen ergeben sich aus Gefährdungsbeurteilung, GefStoffV und ASR A1.3; Art und Umfang sind vom konkreten Lagerbereich und den Gefährdungen abhängig.'
        },
        "23.18": {
            einfach: 'Nehmen Sie das Flüssiggaslager in die vorhandenen Brandschutz-, Feuerwehr- und Notfallunterlagen auf.',
            bghw: 'Berücksichtigen Sie das Flüssiggaslager entsprechend DGUV Regel 108-601 in vorhandenen Feuerwehrplänen und passen Sie betriebliche Brandschutz- und Notfallunterlagen an.',
            rechtlich: 'Gefahrstofflager und daraus resultierende Notfallmaßnahmen sind in der betrieblichen Gefahrenabwehr zu berücksichtigen. DGUV Regel 108-601 konkretisiert dies für Flüssiggaslager im Einzelhandel.'
        },
        "23.19": {
            einfach: 'Legen Sie fest, wie bei Gasgeruch, Undichtheit oder Brand alarmiert und gehandelt wird, und machen Sie den Ablauf den Beschäftigten bekannt.',
            bghw: 'Regeln Sie Alarmierung und Verhalten bei Gasaustritt oder Brand in Betriebsanweisung und Notfallorganisation und unterweisen Sie die betroffenen Beschäftigten.',
            rechtlich: 'Nach GefStoffV sind geeignete Maßnahmen für Betriebsstörungen, Unfälle und Notfälle festzulegen; Beschäftigte sind über die erforderlichen Verhaltensweisen zu informieren und zu unterweisen.'
        },
        "23.20": {
            einfach: 'Erstellen Sie eine aktuelle, verständliche Betriebsanweisung für den Umgang mit Flüssiggasflaschen.',
            bghw: 'Erstellen Sie gemäß GefStoffV und DGUV Regel 108-601 eine arbeitsbereichs- und tätigkeitsbezogene Betriebsanweisung für Lagerung, Ausgabe, Rücknahme und Transport.',
            rechtlich: 'Nach § 14 GefStoffV ist eine schriftliche Betriebsanweisung in verständlicher Form und Sprache zugänglich zu machen, wenn Beschäftigte Tätigkeiten mit Gefahrstoffen ausüben.'
        },
        "23.21": {
            einfach: 'Unterweisen Sie die betroffenen Beschäftigten vor der ersten Tätigkeit und danach mindestens einmal jährlich.',
            bghw: 'Unterweisen Sie Beschäftigte anhand der Betriebsanweisung vor Aufnahme der Tätigkeit und danach mindestens jährlich über Gefährdungen und Schutzmaßnahmen beim Umgang mit Flüssiggasflaschen.',
            rechtlich: '§ 14 GefStoffV verlangt eine arbeitsplatzbezogene Unterweisung vor Aufnahme der Beschäftigung und danach mindestens jährlich; Inhalt und Zeitpunkt der Unterweisung sind schriftlich festzuhalten.'
        },
        "23.22": {
            einfach: 'Dokumentieren Sie Inhalt und Zeitpunkt der Unterweisung.',
            bghw: 'Dokumentieren Sie die Gefahrstoffunterweisung nachvollziehbar mit Inhalt und Zeitpunkt.',
            rechtlich: 'Nach § 14 GefStoffV sind Inhalt und Zeitpunkt der Unterweisung schriftlich festzuhalten und von den Unterwiesenen durch Unterschrift zu bestätigen.'
        },
        "23.23": {
            einfach: 'Stellen Sie den anhand der Gefährdungsbeurteilung erforderlichen Fuß- und Handschutz bereit und sorgen Sie für dessen Benutzung.',
            bghw: 'Legen Sie geeigneten Fuß- und Handschutz anhand der Gefährdungsbeurteilung fest. DGUV Regel 108-601 nennt bei der Handhabung von Flüssiggasflaschen insbesondere Sicherheitsschuhe und geeigneten Handschutz.',
            rechtlich: 'Erforderliche persönliche Schutzausrüstung ist auf Grundlage der Gefährdungsbeurteilung nach ArbSchG/GefStoffV und PSA-Benutzungsverordnung auszuwählen, bereitzustellen und bestimmungsgemäß zu benutzen.'
        },
        "23.24": {
            einfach: 'Aktualisieren Sie die Gefährdungsbeurteilung für Lagerung, Ausgabe, Rücknahme und Transport der Flüssiggasflaschen.',
            bghw: 'Erfassen Sie sämtliche Tätigkeiten mit Flüssiggasflaschen in der Gefährdungsbeurteilung und berücksichtigen Sie dabei Lagerort, Lagermenge, Rücknahme, Dichtheit, Transport sowie Brand- und Explosionsgefährdungen.',
            rechtlich: 'Nach § 5 ArbSchG und § 6 GefStoffV sind die Gefährdungen zu ermitteln und zu beurteilen. Die Schutzmaßnahmen sind entsprechend GefStoffV und den einschlägigen Technischen Regeln, insbesondere TRGS 510, festzulegen und aktuell zu halten.'
        }
    },

    "Beleuchtung": {
        "24.1": {
            einfach: 'Sorgen Sie im Verkaufsraum für eine gleichmäßige, funktionsfähige Beleuchtung. Dunkle Bereiche und störende Blendung sind zu beseitigen; im Verkaufsbereich sind nach ASR A3.4 mindestens 300 lx erforderlich.',
            bghw: 'Stellen Sie im Verkaufsraum eine ausreichende und gleichmäßige Beleuchtung sicher. Nach ASR A3.4 beträgt die Mindestbeleuchtungsstärke im Verkaufsbereich 300 lx. Defekte Leuchten, auffällige Dunkelzonen und störende Blendung sind zu beseitigen.',
            rechtlich: 'Nach ArbStättV in Verbindung mit ASR A3.4 ist der Verkaufsbereich ausreichend zu beleuchten. ASR A3.4 nennt für Verkaufsbereiche eine Mindestbeleuchtungsstärke von 300 lx; die Beleuchtung ist so auszulegen und instand zu halten, dass Sicherheit und Gesundheit der Beschäftigten gewährleistet sind.'
        },
        "24.2": {
            einfach: 'Sorgen Sie im Lager für ausreichendes und funktionsfähiges Licht. Die erforderliche Helligkeit richtet sich danach, ob dort nur gelagert, Ware gesucht, gelesen oder verpackt wird.',
            bghw: 'Stellen Sie die Lagerbeleuchtung entsprechend der tatsächlichen Tätigkeit und Sehaufgabe sicher. ASR A3.4 unterscheidet bei Lagerräumen unter anderem zwischen gleichartigem bzw. großteiligem Lagergut, Suchaufgaben, Leseaufgaben sowie Versand- und Verpackungsbereichen.',
            rechtlich: 'Nach ArbStättV in Verbindung mit ASR A3.4 ist die Beleuchtungsstärke im Lager tätigkeitsbezogen festzulegen. ASR A3.4 nennt beispielsweise 50 lx für Lagerräume mit gleichartigem oder großteiligem Lagergut, 100 lx bei Suchaufgaben, 200 lx bei Leseaufgaben und 300 lx für Versand- und Verpackungsbereiche.'
        },
        "24.3": {
            einfach: 'Sorgen Sie im Servicebereich für ausreichendes, funktionsfähiges und möglichst blendfreies Licht, damit die dortigen Arbeiten sicher ausgeführt werden können.',
            bghw: 'Stellen Sie im Servicebereich eine ausreichende Beleuchtung entsprechend den dort tatsächlich ausgeführten Tätigkeiten und Sehaufgaben sicher. Defekte Leuchten, auffällige Dunkelzonen und störende Blendung sind zu beseitigen.',
            rechtlich: 'Nach ArbStättV in Verbindung mit ASR A3.4 muss die Beleuchtung den jeweiligen Tätigkeiten und Sehaufgaben entsprechen. Der konkret erforderliche Mindestwert richtet sich nach der tatsächlichen Nutzung des Servicebereichs; eine pauschale Zuordnung zu einem einzelnen Tabellenwert ist ohne nähere Tätigkeitsbestimmung nicht sachgerecht.'
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
let MEASURE_STYLE = localStorage.getItem('measureStyle') || 'einfach';

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
