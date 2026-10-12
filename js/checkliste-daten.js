// ==========================================================================
// Arbeitssicherheit-Checkliste — Fragenkatalog
// ==========================================================================
// Gemeinsame Datenquelle fuer liste-neu.html (Desktop/Tablet) und
// mobile-neu.html (Telefon), gelesen von js/checkliste-engine.js.
//
// Aufbau: Kategorie { nummer, name, fragen: [ { id, frage, massnahme } ] }
//   id        - stabile Kennung (z. B. "1.03"). Antworten werden unter dieser
//               Kennung gespeichert. Beim Einfuegen neuer Fragen eine NEUE id
//               vergeben und bestehende ids nicht umnummerieren.
//   frage     - so formulieren, dass "Ja" = in Ordnung und "Nein" = Mangel.
//   massnahme - wird bei "Nein" automatisch in die Massnahmentabelle uebernommen.
// ==========================================================================

const CHECKLISTE_KATALOG = [
 {
  "nummer": "1.0",
  "name": "Gesamtmarkt",
  "fragen": [
   {
    "id": "1.01",
    "frage": "Entspricht das getragene Schuhwerk aller im Bereich tätigen Personen den Anforderungen der Gefährdungsbeurteilung (fest, im Zehenbereich geschlossen, flach und rutschhemmend)?",
    "massnahme": "Sorgen Sie dafür, dass alle Beschäftigten im Markt festes, im Zehenbereich geschlossenes, flaches und rutschhemmendes Schuhwerk tragen (§ 3 Abs. 1 ArbSchG, Gefährdungsbeurteilung, DGUV Regel 112-191)."
   },
   {
    "id": "1.02",
    "frage": "Beachten die Mitarbeitenden die Betriebsanweisung für Flurförderzeuge, insbesondere PSA-Pflicht, Traglasten und das Verbot der Personenmitnahme?",
    "massnahme": "Unterweisen Sie die Beschäftigten erneut anhand der Betriebsanweisung für Flurförderzeuge (PSA-Pflicht, Traglasten, Verbot der Personenmitnahme) und kontrollieren Sie die Einhaltung (§ 12 ArbSchG, DGUV Vorschrift 68)."
   },
   {
    "id": "1.03",
    "frage": "Wurden die Automatiktüren gemäß den geltenden Regelwerken geprüft und befinden sich diese in einem ordnungsgemäßen Zustand?",
    "massnahme": "Fachgerechte Prüfung der betroffenen Automatiktüren nach ASR A1.7 umgehend veranlassen. Betrieb bis zur Prüfung ggf. einschränken. Festgestellte Mängel zügig beheben und Dokumentation aktualisieren."
   },
   {
    "id": "1.04",
    "frage": "Sind die Schnelllauftore gemäß den Herstellervorgaben und gesetzlichen Fristen geprüft sowie technisch einwandfrei?",
    "massnahme": "Prüfung und ggf. erforderliche Instandsetzung des Schnelllauftors unverzüglich durch einen Sachkundigen bzw. den Hersteller veranlassen. Bis zur Mängelbeseitigung den Torbereich nur mit besonderer Vorsicht nutzen (ASR A1.7)."
   },
   {
    "id": "1.05",
    "frage": "Sind die Rolltore aktuell geprüft und funktionieren alle Schutzeinrichtungen (z. B. Absturzsicherung, Einzugsschutz) einwandfrei?",
    "massnahme": "Sachkundigenprüfung sowie erforderliche Wartung des Rolltors kurzfristig veranlassen und den ordnungsgemäßen Zustand im Prüfbuch dokumentieren (ASR A1.7)."
   },
   {
    "id": "1.06",
    "frage": "Ist die Aufzugsanlage geprüft und in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen und mit funktionsfähigen Schutzeinrichtungen)?",
    "massnahme": "Lassen Sie die Aufzugsanlage fristgerecht durch eine zugelassene Überwachungsstelle (ZÜS) prüfen und festgestellte Mängel umgehend beseitigen (§§ 15, 16 BetrSichV i. V. m. Anhang 2 Abschnitt 2, TRBS 3121)."
   },
   {
    "id": "1.07",
    "frage": "Werden für Tätigkeiten in der Höhe (z. B. in Lager oder Verkaufsraum) geeignete und geprüfte Aufstiegshilfen (z. B. Trittstufen, Rolltritte/Elefantenfüße) in ausreichender Zahl bereitgestellt und bestimmungsgemäß benutzt?",
    "massnahme": "Stellen Sie sicher, dass für Arbeiten in der Höhe ausschließlich geprüfte und unbeschädigte Aufstiegshilfen (gemäß DGUV Information 208-016) verwendet werden; untersagen Sie die Nutzung ungeeigneter Ersatzlösungen wie Kisten oder Regalböden."
   },
   {
    "id": "1.08",
    "frage": "Sind die Leitern geprüft gemäß DGUV Information 208-016 Leitern und Tritte?",
    "massnahme": "Führen Sie regelmäßige Prüfungen aller Leitern und Tritte nach DGUV Information 208-016 sowie gemäß den Regelungen der BetrSichV durch und dokumentieren Sie diese nachvollziehbar."
   },
   {
    "id": "1.09",
    "frage": "Werden aus dem Ordersatz geeignete Sicherheitsmesser verwendet?",
    "massnahme": "Stellen Sie auf Grundlage der Gefährdungsbeurteilung sicher, dass ausschließlich geeignete, im Ordersatz festgelegte Sicherheitsmesser verwendet werden, um Schnittverletzungen zu vermeiden (§§ 4–5 ArbSchG)."
   },
   {
    "id": "1.10",
    "frage": "Ist der Gabelhubwagen in einem ordnungsgemäßen Zustand ohne sichtbare Beschädigungen?",
    "massnahme": "Sorgen Sie für eine regelmäßige technische Kontrolle und Instandhaltung des Gabelhubwagens gemäß DGUV Vorschrift 68 (Flurförderzeuge), um dessen ordnungsgemäßen Zustand zu gewährleisten."
   },
   {
    "id": "1.11",
    "frage": "Ist der elektrische Hubwagen geprüft und in einem ordnungsgemäßen Zustand (keine sichtbaren Beschädigungen, funktionsfähige Schutzeinrichtungen)?",
    "massnahme": "Lassen Sie elektrische Hubwagen regelmäßig durch eine befähigte Person prüfen und betreiben Sie sie nur mit intakten Schutzeinrichtungen (§ 14 BetrSichV, DGUV Vorschrift 68)."
   },
   {
    "id": "1.12",
    "frage": "Sind die Verkehrswege so beschaffen, dass kein Unfallrisiko durch Stolpern, Ausrutschen oder Umknicken besteht?",
    "massnahme": "Gestalten und erhalten Sie Verkehrswege so, dass sie frei von Stolper-, Rutsch- oder Sturzgefahren sind (§ 3a ArbStättV, ASR A1.8)."
   },
   {
    "id": "1.13",
    "frage": "Sind die Treppen unbeschädigt und frei von Gegenständen?",
    "massnahme": "Stellen Sie sicher, dass alle Treppen frei von Hindernissen sind und keine baulichen Mängel aufweisen, um die Unfallgefahr gemäß ASR A1.8 zu minimieren."
   },
   {
    "id": "1.14",
    "frage": "Sind Betriebsanweisungen gut zugänglich und werden Sicherheitsanweisungen eingehalten?",
    "massnahme": "Halten Sie alle Betriebsanweisungen gut zugänglich und stellen Sie sicher, dass die Beschäftigten über die Inhalte unterwiesen sind (§§ 4, 12 ArbSchG)."
   },
   {
    "id": "1.15",
    "frage": "Ist die Beleuchtung in den Verkaufs- und Lagerbereichen gemäß ASR A3.4 ausreichend dimensioniert (mind. 300 Lux im Verkaufsraum), voll funktionsfähig und so beschaffen, dass Gefahrenhinweise auf Produkten sowie Leckagen in den Regalen jederzeit zweifelsfrei erkennbar sind?",
    "massnahme": "Beleuchtung gemäß ASR A3.4 anpassen (mind. 300 Lux), defekte Leuchten instand setzen und ausreichende Ausleuchtung zur sicheren Erkennung von Gefahren sicherstellen."
   },
   {
    "id": "1.16",
    "frage": "Sind von der Decke geführte Leitungen und Steckverbindungen durch geeignete mechanische Zugentlastungen (z. B. Stahlseile, Ketten oder spezielle Klemmvorrichtungen) so gesichert, dass keine Zugkräfte auf die elektrischen Kontaktstellen wirken?",
    "massnahme": "Nachrüstung mechanischer Zugentlastungen gemäß DIN VDE 0100-520."
   },
   {
    "id": "1.17",
    "frage": "Sind Schalter und Steckdosen zum Zeitpunkt der Begehung ohne sichtbare Beschädigungen?",
    "massnahme": "Instandsetzung des defekten Schalters bzw. der Steckdose durch eine Elektrofachkraft veranlassen. Bis zur Reparatur die Nutzung der betroffenen Komponente untersagen (DGUV Vorschrift 3)."
   },
   {
    "id": "1.18",
    "frage": "Sind elektrische Steckverbindungen so verlegt, dass sie nicht ungeschützt auf dem Boden liegen (insbesondere unter Kühl- und Tiefkühltruhen)?",
    "massnahme": "Steckverbindungen so verlegen, dass sie gegen Feuchtigkeit, Schmutz und mechanische Beschädigung geschützt sind und nicht auf dem Boden liegen – insbesondere nicht unter Kühlmöbeln (§ 3 ArbSchG, DGUV Vorschrift 3)."
   },
   {
    "id": "1.19",
    "frage": "Sind provisorische Installationen vermieden?",
    "massnahme": "Provisorische elektrische Installationen vermeiden. Elektrische Anlagen und Betriebsmittel ausschließlich fachgerecht und dauerhaft installieren bzw. instand setzen lassen."
   },
   {
    "id": "1.20",
    "frage": "Erfüllen die Standorte der Erste-Hilfe-Koffer die Anforderungen an Sichtbarkeit, Erreichbarkeit und Norm-Kennzeichnung gemäß DGUV?",
    "massnahme": "Erste-Hilfe-Koffer gut sichtbar, jederzeit zugänglich und mit dem Rettungszeichen E003 gekennzeichnet anbringen (§ 25 DGUV Vorschrift 1, ASR A1.3, ASR A4.3)."
   },
   {
    "id": "1.21",
    "frage": "Ist das Erste-Hilfe-Material an allen Standorten in vollständigem Zustand und ist das Verfallsdatum der sterilen Inhalte noch nicht überschritten?",
    "massnahme": "Inhalt der Verbandkästen regelmäßig kontrollieren; Vollständigkeit und Haltbarkeit der Materialien (DIN 13157, DGUV Vorschrift 1) sicherstellen und abgelaufene oder fehlende Bestände sofort ersetzen."
   }
  ]
 },
 {
  "nummer": "2.0",
  "name": "Brandschutz",
  "fragen": [
   {
    "id": "2.01",
    "frage": "Sind die Feuerlöscheinrichtungen geprüft, und werden die Prüffristen eingehalten?",
    "massnahme": "Veranlassen Sie Prüfungen aller Feuerlöscher durch befähigte Personen nach DIN 14406-4 und sorgen Sie für die Einhaltung der vorgeschriebenen Prüffristen gemäß § 10 ArbSchG."
   },
   {
    "id": "2.02",
    "frage": "Sind die Feuerlöscheinrichtungen frei zugänglich und nicht durch Ware, Displays oder sonstige Gegenstände blockiert?",
    "massnahme": "Halten Sie alle Feuerlöscheinrichtungen gemäß ASR A2.2 und § 10 ArbSchG stets frei zugänglich, um eine unverzügliche Nutzung im Brandfall zu gewährleisten."
   },
   {
    "id": "2.03",
    "frage": "Sind die Prüfsiegel auf den Wandhydranten unbeschädigt?",
    "massnahme": "Prüfsiegel an Wandhydranten regelmäßig auf Unversehrtheit und Gültigkeit kontrollieren. Beschädigte oder fehlende Prüfsiegel umgehend ersetzen und Wartung nachweisen."
   },
   {
    "id": "2.04",
    "frage": "Sind die Brandschutztüren frei von Zugestellungen und wird ihre Funktion nicht gestört?",
    "massnahme": "Achten Sie gemäß ASR A2.3 darauf, dass Brandschutztüren jederzeit frei zugänglich und in ihrer Funktion nicht beeinträchtigt sind."
   },
   {
    "id": "2.05",
    "frage": "Sind die Türhaltevorrichtungen und der Schließfolgeregler des Feuerschutzabschlusses in Ordnung?",
    "massnahme": "Sorgen Sie dafür, dass Türhaltevorrichtungen und Schließfolgeregler an Brandschutztüren regelmäßig auf ihre Funktionsfähigkeit überprüft werden (vgl. DIN 14677)."
   },
   {
    "id": "2.06",
    "frage": "Sind die Brandschutztüren ohne Beschädigungen?",
    "massnahme": "Beschädigte Brandschutztüren umgehend durch eine Fachfirma instand setzen lassen, damit ihre Schutzwirkung erhalten bleibt (§ 4 ArbSchG, Bauordnung)."
   },
   {
    "id": "2.07",
    "frage": "Ist ein aktueller Flucht- und Rettungsplan vorhanden?",
    "massnahme": "Hängen Sie einen aktuellen, gut lesbaren Flucht- und Rettungsplan an geeigneter Stelle aus (§ 4 Abs. 4 ArbStättV, ASR A2.3, ASR A1.3)."
   },
   {
    "id": "2.08",
    "frage": "Ist die Notausgangsbeleuchtung ohne Defekte?",
    "massnahme": "Stellen Sie die Funktion der Sicherheitsbeleuchtung umgehend wieder her und lassen Sie sie regelmäßig prüfen, damit bei Stromausfall eine sichere Flucht möglich ist (ASR A2.3, ASR A3.4)."
   },
   {
    "id": "2.09",
    "frage": "Sind alle Flucht- und Rettungswege sowie Notausgänge in ihrer gesamten Breite ständig freigehalten und im Außenbereich nicht durch Fahrzeuge oder Lagergut blockiert?",
    "massnahme": "Stellen Sie die sofortige Beräumung sicher. Halten Sie Notausgänge zu jeder Zeit frei zugänglich und vermeiden Sie jedwede Art von Verstellung gemäß § 4 ArbStättV i. V. m. ASR A2.3. Unterweisen Sie die Mitarbeitenden erneut über das strikte Verbot der Lagerung von Gegenständen in Fluchtwegen."
   },
   {
    "id": "2.10",
    "frage": "Sind alle Notausgänge und -ausstiege jederzeit ohne fremde Hilfsmittel von innen leicht zu öffnen und ist die Bedienbarkeit der Beschläge sichergestellt?",
    "massnahme": "Stellen Sie sicher, dass Notausgänge gemäß ASR A2.3 niemals verschlossen, verriegelt oder durch Vorhänge/Gegenstände verdeckt sind. Defekte Öffnungsmechanismen sind unverzüglich instand zu setzen."
   },
   {
    "id": "2.11",
    "frage": "Führen die Notausgänge in sichere Bereiche?",
    "massnahme": "Vergewissern Sie sich, dass alle Notausgänge in gesicherte, gefahrenfreie Bereiche führen und so der Schutz der Beschäftigten gewährleistet ist."
   },
   {
    "id": "2.12",
    "frage": "Ist die Brandmeldeanlage funktionsfähig?",
    "massnahme": "Regelmäßige Inspektion und Wartung durch zertifizierte Fachfirmen (meist jährlich nach DIN 14675)."
   },
   {
    "id": "2.13",
    "frage": "Sind die Technik- und Heizräume frei von brennbaren Materialien (z. B. Kisten, Kartons)?",
    "massnahme": "Entfernen Sie brennbare Materialien aus Technik- und Heizräumen und halten Sie diese dauerhaft frei (Brandschutzordnung, Feuerungsverordnung des Landes, § 10 ArbSchG)."
   },
   {
    "id": "2.14",
    "frage": "Sind die Technik- und Heizräume frei von Lagernutzung?",
    "massnahme": "Verwenden Sie Technik- und Heizräume ausschließlich für ihre bestimmungsgemäße Nutzung, da eine Lagerung dort gegen Brandschutzvorgaben verstößt (§ 3 ArbSchG)."
   },
   {
    "id": "2.15",
    "frage": "Wird die Einfüllöffnung des Presscontainers nach Ladenschluss bzw. Betriebsende konsequent mechanisch verschlossen und gegen unbefugte Nutzung gesichert?",
    "massnahme": "Die Marktleitung wird gebeten, das Schließpersonal erneut entsprechend zu unterweisen. Insbesondere ist sicherzustellen, dass der Einfüllstutzen des Presscontainers nach Betriebsschluss ordnungsgemäß verschlossen wird. Der Presscontainer ist zudem grundsätzlich stromlos zu schalten. Sofern erforderlich, ist der Einfüllstutzen beziehungsweise die Klappe durch Anbringen eines Schlosses gegen unbefugtes Öffnen zu sichern. Die ordnungsgemäße Sicherung ist künftig verpflichtend als fester Kontrollpunkt in das tägliche Schließprotokoll aufzunehmen."
   }
  ]
 },
 {
  "nummer": "3.0",
  "name": "Backstation",
  "fragen": [
   {
    "id": "3.01",
    "frage": "Sind die Arbeitsgeräte an der Backstation (Backofen, Backbleche, Brotschneidemaschine) in einem ordnungsgemäßen Zustand?",
    "massnahme": "Defekte Arbeitsgeräte sofort außer Betrieb nehmen und kennzeichnen („Defekt – nicht benutzen“). Instandsetzung veranlassen, bei elektrischen Geräten Prüfung durch eine Elektrofachkraft (§ 10 BetrSichV, DGUV Vorschrift 3)."
   },
   {
    "id": "3.02",
    "frage": "Ist das freistehende Handwaschbecken ohne Beschädigungen?",
    "massnahme": "Beschädigtes Handwaschbecken instand setzen lassen und die Ausstattung (fließendes Wasser, Seife, Einmalhandtücher) sicherstellen (ArbStättV Anhang Nr. 4.1, ASR A4.1)."
   },
   {
    "id": "3.03",
    "frage": "Sind die Elektroleitungen intakt und bilden keine Stolperstellen?",
    "massnahme": "Führen Sie regelmäßige Sichtprüfungen elektrischer Leitungen durch, um sicherzustellen, dass keine Stolper- oder Brandgefahren gemäß DGUV Vorschrift 3 entstehen."
   },
   {
    "id": "3.04",
    "frage": "Entspricht die Zuleitung der VDE-Norm?",
    "massnahme": "Vergewissern Sie sich, dass sämtliche elektrischen Zuleitungen den Vorgaben der VDE-Normen entsprechen, um elektrische Gefährdungen auszuschließen (§ 3 ArbSchG, BetrSichV)."
   },
   {
    "id": "3.05",
    "frage": "Ist der Backhandschuh für die Backstation in einem ordnungsgemäßen Zustand (kein Verschleiß) und besitzt eine lange Stulpe?",
    "massnahme": "Verwenden Sie nur hitzebeständige Backhandschuhe in einwandfreiem Zustand und mit langer Stulpe gemäß PSA-Benutzungsverordnung und § 3 ArbSchG."
   },
   {
    "id": "3.06",
    "frage": "Sind alle Heißgeräte (z. B. Heißtheken, Fritteusen) in technisch einwandfreiem Zustand?",
    "massnahme": "Prüfen Sie regelmäßig alle Heißgeräte (z. B. Heißtheken, Fritteusen) auf technische Mängel und dokumentieren Sie die Instandhaltung gemäß BetrSichV § 10."
   },
   {
    "id": "3.07",
    "frage": "Ist die Brotschneidemaschine aktuell geprüft und inklusive aller Schutzeinrichtungen in einwandfreiem Zustand?",
    "massnahme": "Maschine bis zur Instandsetzung außer Betrieb nehmen und kennzeichnen. Schutzeinrichtungen instand setzen und Prüfung nach § 14 BetrSichV sowie elektrische Prüfung (DGUV Vorschrift 3) veranlassen."
   }
  ]
 },
 {
  "nummer": "4.0",
  "name": "Serviceabteilung",
  "fragen": [
   {
    "id": "4.01",
    "frage": "Hängt an den Waschplätzen ein aktueller, auf die Gefährdungsbeurteilung abgestimmter Hautschutzplan gut sichtbar aus?",
    "massnahme": "Erstellen Sie einen standortspezifischen Hautschutzplan (gemäß TRGS 401) und bringen Sie diesen an allen Waschplätzen gut sichtbar an; stellen Sie die darin aufgeführten Mittel für Hautschutz, Hautreinigung und Hautpflege bereit."
   },
   {
    "id": "4.02",
    "frage": "Werden Hautschutz- und Hautpflegeprodukte zur Verfügung gestellt?",
    "massnahme": "Stellen Sie geeignete Hautschutz- und Hautpflegeprodukte bereit, um berufsbedingten Hauterkrankungen gemäß § 3 ArbSchG vorzubeugen."
   },
   {
    "id": "4.03",
    "frage": "Sind die Arbeitsgeräte im Servicebereich in einem ordnungsgemäßen Zustand?",
    "massnahme": "Veranlassen Sie regelmäßige Sicht- und Funktionsprüfungen der Arbeitsgeräte im Servicebereich gemäß § 4 BetrSichV."
   },
   {
    "id": "4.04",
    "frage": "Bleiben die aufklappbaren Thekenscheiben in der oberen Stellung sicher und selbstständig stehen?",
    "massnahme": "Betroffene Thekenelemente unverzüglich außer Betrieb nehmen oder gegen unbeabsichtigtes Herabfallen sichern. Instandsetzung der Haltevorrichtungen (z. B. Austausch der Gasdruckfedern) veranlassen, um Quetsch- und Schlagverletzungen zu vermeiden (§ 10 BetrSichV)."
   },
   {
    "id": "4.05",
    "frage": "Sind die Glastüren und Glaswände in Augenhöhe gekennzeichnet?",
    "massnahme": "Glastüren und Glaswände in Augenhöhe mit deutlich sichtbaren, kontrastreichen Markierungen versehen (ASR A1.6, ASR A1.7, DGUV Information 208-014)."
   },
   {
    "id": "4.06",
    "frage": "Werden Schneidbretter und Messer regelmäßig gereinigt und farbcodiert verwendet?",
    "massnahme": "Reinigen und desinfizieren Sie Schneidbretter und Messer regelmäßig und wenden Sie ein Farbsystem zur hygienischen Trennung an (§ 3 ArbSchG, HACCP)."
   },
   {
    "id": "4.07",
    "frage": "Werden Schneidbretter mit Messereinschub verwendet?",
    "massnahme": "Verwenden Sie Schneidbretter mit sicherem Messereinschub, um Schnittverletzungen zu vermeiden und die Lagerung gemäß § 3 ArbSchG sicher zu gestalten."
   },
   {
    "id": "4.08",
    "frage": "Werden Messerhalter verwendet?",
    "massnahme": "Stellen Sie geeignete Messerhalter bereit und sorgen Sie dafür, dass Messer nach Gebrauch sicher abgelegt werden (§ 3 ArbSchG)."
   },
   {
    "id": "4.09",
    "frage": "Sind die Convenience-Geräte in einem ordnungsgemäßen Zustand?",
    "massnahme": "Führen Sie regelmäßige Wartungen und Funktionsprüfungen an Convenience-Geräten durch, um deren sicheren Betrieb zu gewährleisten (§ 4 BetrSichV)."
   }
  ]
 },
 {
  "nummer": "5.0",
  "name": "Kassenzone",
  "fragen": [
   {
    "id": "5.01",
    "frage": "Ist der Fußraum frei von Gegenständen?",
    "massnahme": "Halten Sie den Fußraum dauerhaft frei von Gegenständen, um Unfallgefahren durch Stolpern oder Hängenbleiben zu vermeiden (§ 3 ArbSchG, ASR A1.8)."
   },
   {
    "id": "5.02",
    "frage": "Ist der Fußboden im Kassenbereich in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen)?",
    "massnahme": "Sorgen Sie für die Instandhaltung und Rutschhemmung des Fußbodens im Kassenbereich gemäß ASR A1.5/1,2 und § 3 ArbSchG."
   },
   {
    "id": "5.03",
    "frage": "Sind die serienmäßig eingebauten Heizgeräte im Kassenraum nicht durch brennbares Material zugestellt?",
    "massnahme": "Stellen Sie sicher, dass Heizgeräte frei zugänglich und nicht durch brennbare Materialien blockiert sind, um Brandgefahren gemäß ASR A2.2 zu vermeiden."
   },
   {
    "id": "5.04",
    "frage": "Sind die Kassenstühle in einem funktionsfähigen Zustand?",
    "massnahme": "Prüfen Sie Kassenstühle regelmäßig auf Funktionalität und stellen Sie ergonomische Arbeitsmittel gemäß ArbStättV Anhang Nr. 6 bereit."
   },
   {
    "id": "5.05",
    "frage": "Ist das Transportband unbeschädigt und weist keine Lücke von über 5 mm auf?",
    "massnahme": "Überprüfen Sie Transportbänder regelmäßig auf Schäden und sorgen Sie dafür, dass keine Lücken über 5 mm entstehen, um Verletzungsrisiken auszuschließen (§ 3 ArbSchG)."
   },
   {
    "id": "5.06",
    "frage": "Sind die Einkaufskörbe ordnungsgemäß im vorgesehenen Ständer abgelegt und ragen nicht in den Verkehrsweg hinein, sodass keine Stolpergefahr besteht?",
    "massnahme": "Einkaufskörbe sofort korrekt im dafür vorgesehenen Ständer einsortieren und den Bereich freiräumen. Mitarbeiter anweisen, regelmäßige Sichtkontrollen durchzuführen, um Stolperstellen durch herausragende oder falsch abgestellte Körbe zu vermeiden."
   }
  ]
 },
 {
  "nummer": "6.0",
  "name": "Kühlhaus",
  "fragen": [
   {
    "id": "6.01",
    "frage": "Ist an allen Beleuchtungen in den Kühlhäusern die Überwurfkappe (Schutzkappe/Schutzglas) montiert?",
    "massnahme": "Fehlende Schutzkappen bzw. Schutzgläser an den Leuchten in Kühlhäusern nachrüsten, um Verletzungen und Glasbruch im Lebensmittelbereich zu vermeiden (§ 3 ArbSchG, HACCP)."
   },
   {
    "id": "6.02",
    "frage": "Ist die Notentriegelung vorhanden und in Ordnung?",
    "massnahme": "Stellen Sie sicher, dass Kühlraumtüren jederzeit von innen ohne Hilfsmittel geöffnet werden können, und lassen Sie fehlende oder defekte Notentriegelungen sofort instand setzen (§ 3 ArbSchG, ASR A1.7)."
   },
   {
    "id": "6.03",
    "frage": "Sind die Kühlhaustüren von innen mit dem Rettungswegschild ISO 7010 gekennzeichnet?",
    "massnahme": "Kennzeichnen Sie Kühlhaustüren von innen mit dem international gültigen Rettungswegsymbol gemäß ISO 7010 und ASR A1.3."
   },
   {
    "id": "6.04",
    "frage": "Funktioniert die Beleuchtung einwandfrei?",
    "massnahme": "Stellen Sie eine ausreichende, blendfreie und funktionstüchtige Beleuchtung aller Arbeitsbereiche gemäß ASR A3.4 sicher."
   },
   {
    "id": "6.05",
    "frage": "Ist die Notruf-Funktion (wenn vorhanden) in Ordnung und ohne Beschädigungen?",
    "massnahme": "Stellen Sie sicher, dass die Notrufeinrichtung im Kühlraum jederzeit funktionsfähig ist, und prüfen Sie die Funktion regelmäßig (§ 3 ArbSchG, DIN EN 378)."
   }
  ]
 },
 {
  "nummer": "7.0",
  "name": "CO2 Kühleinrichtungen",
  "fragen": [
   {
    "id": "7.01",
    "frage": "Wurden Personen, die sich im Bereich von Kühlanlagen oder Kühlhäusern aufhalten, unterwiesen?",
    "massnahme": "Unterweisen Sie alle Personen, die sich im Bereich von Kühlanlagen und Kühlhäusern aufhalten, zu den spezifischen Gefährdungen (Kälte, CO2-Austritt, Einschließen) und zu den Rettungsmaßnahmen und dokumentieren Sie die Unterweisung (§ 12 ArbSchG)."
   },
   {
    "id": "7.02",
    "frage": "Sind die Sensoren nicht mit Material oder sonstigen Gegenständen verstellt?",
    "massnahme": "Achten Sie darauf, dass sicherheitsrelevante Sensoren, Melder oder Lüftungselemente nicht verstellt oder blockiert sind (§ 3 ArbSchG, DGUV Regel 100-500 Kap. 2.35, DIN EN 378)."
   },
   {
    "id": "7.03",
    "frage": "Sind alle Sicherheitsvorrichtungen (Alarmleuchten, Kennzeichnungen, Kühlhaustüren) intakt?",
    "massnahme": "Sorgen Sie dafür, dass alle sicherheitstechnischen Vorrichtungen, wie Alarmleuchten, Kennzeichnungen und Schutzeinrichtungen, stets funktionstüchtig und unbeschädigt sind (§ 4 BetrSichV)."
   }
  ]
 },
 {
  "nummer": "8.0",
  "name": "Lager",
  "fragen": [
   {
    "id": "8.01",
    "frage": "Sind die Schwerlastregale geprüft?",
    "massnahme": "Veranlassen Sie regelmäßige Prüfungen aller Schwerlastregale durch befähigte Personen gemäß BetrSichV § 14 sowie DGUV Information 208-061."
   },
   {
    "id": "8.02",
    "frage": "Ist der Anfahrschutz vorhanden?",
    "massnahme": "Bringen Sie an Regalen und gefährdeten Bauteilen einen geeigneten Anfahrschutz an und kennzeichnen Sie ihn (DGUV Information 208-061, ASR A1.3)."
   },
   {
    "id": "8.03",
    "frage": "Ist die Traglastangabe an den Schwerlastregalen vorhanden?",
    "massnahme": "Bringen Sie an jedem Regal deutlich sichtbare und dauerhafte Traglastangaben an (DGUV Information 208-061, DIN EN 15635)."
   },
   {
    "id": "8.04",
    "frage": "Befindet sich eine Absturzsicherung an der Rampe?",
    "massnahme": "Sorgen Sie dafür, dass an Rampen mit Absturzkante geeignete Absturzsicherungen gemäß ASR A2.1 installiert sind."
   },
   {
    "id": "8.05",
    "frage": "Ist die Absturzsicherung in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen und mit Kennzeichnung)?",
    "massnahme": "Überprüfen Sie regelmäßig die Absturzsicherung auf Schäden und achten Sie auf gut sichtbare Warnkennzeichnungen (§ 4 ArbSchG)."
   },
   {
    "id": "8.06",
    "frage": "Ist die Müll-/Papierpresse geprüft?",
    "massnahme": "Lassen Sie Müll- und Papierpressen regelmäßig durch befähigte Personen prüfen und dokumentieren Sie die Prüfung (§ 14 BetrSichV)."
   },
   {
    "id": "8.07",
    "frage": "Ist die Müll-/Papierpresse in einem ordnungsgemäßen Zustand (keine sichtbaren Beschädigungen, intakte Schutzeinrichtungen, fester Stand)?",
    "massnahme": "Stellen Sie sicher, dass die Müll-/Papierpresse technisch einwandfrei, standsicher und mit intakten Schutzeinrichtungen betrieben wird (§ 3 ArbSchG, § 4 BetrSichV)."
   },
   {
    "id": "8.08",
    "frage": "Sind die Verkehrswege im Lager so beschaffen, dass kein Risiko durch Stolpern, Ausrutschen oder Umknicken besteht?",
    "massnahme": "Gestalten und erhalten Sie Verkehrswege so, dass sie frei von Stolper-, Rutsch- oder Sturzgefahren sind (§ 3a ArbStättV, ASR A1.8)."
   }
  ]
 },
 {
  "nummer": "9.0",
  "name": "Leergut",
  "fragen": [
   {
    "id": "9.01",
    "frage": "Sind die Annahmegeräte unbeschädigt und funktionsfähig?",
    "massnahme": "Beschädigte oder defekte Annahmegeräte unverzüglich instand setzen oder außer Betrieb nehmen."
   },
   {
    "id": "9.02",
    "frage": "Ist die Leergutrücknahme in einem ordnungsgemäßen Zustand (Schutzeinrichtungen intakt, Einzugsstellen gesichert, keine Glasscherben)?",
    "massnahme": "Stellen Sie sicher, dass die Leergutrücknahme technisch einwandfrei ist, Schutzeinrichtungen und Einzugssicherungen wirksam sind und keine Gefährdung durch Glasscherben besteht (§ 3 ArbSchG, § 4 BetrSichV, Betriebsanleitung des Herstellers)."
   },
   {
    "id": "9.03",
    "frage": "Werden Rollbahnen nicht betreten?",
    "massnahme": "Beschäftigte unterweisen und unzulässiges Betreten der Rollbahnen verhindern."
   },
   {
    "id": "9.04",
    "frage": "Sind beschädigte Paletten/Kisten aussortiert?",
    "massnahme": "Beschädigte Paletten/Kisten aussortieren und aus dem Verkehr ziehen."
   },
   {
    "id": "9.05",
    "frage": "Werden Lasten sicher aufgenommen und transportiert?",
    "massnahme": "Sichere Aufnahme und Transport von Lasten durch Unterweisung sicherstellen und Arbeitsmittel prüfen und anpassen."
   },
   {
    "id": "9.06",
    "frage": "Wird die PSA zur Verfügung gestellt und getragen?",
    "massnahme": "PSA bereitstellen und Benutzung sicherstellen."
   },
   {
    "id": "9.07",
    "frage": "Werden Abfälle und Bruchmaterial ordnungsgemäß entsorgt?",
    "massnahme": "Abfälle und Bruchmaterial ordnungsgemäß trennen, sammeln und entsorgen lassen."
   },
   {
    "id": "9.08",
    "frage": "Werden Stapelhöhen eingehalten?",
    "massnahme": "Stapelhöhen anpassen und Einhaltung der zulässigen Stapelgrenzen sicherstellen."
   },
   {
    "id": "9.09",
    "frage": "Ist die Lagerfläche sauber und rutschfrei?",
    "massnahme": "Lagerfläche reinigen und Rutschgefahren beseitigen."
   },
   {
    "id": "9.10",
    "frage": "Beträgt die lichte Breite des Wartungsganges zwischen Rollbahn und Wand durchgehend mindestens 0,60 m (an Engstellen kurzzeitig 0,50 m)?",
    "massnahme": "Wartungsgang zwischen Rollbahn und Wand auf mindestens 0,60 m lichte Breite (an Engstellen 0,50 m) freihalten bzw. herstellen. Wo das nicht möglich ist, Einzugs- und Quetschstellen technisch absichern und die Anlage bei Wartungsarbeiten stillsetzen (ASR A1.8)."
   }
  ]
 },
 {
  "nummer": "10.0",
  "name": "Sozialräume",
  "fragen": [
   {
    "id": "10.01",
    "frage": "Hängen im Sozialbereich die aktuellen aushangpflichtigen Gesetze, Unfallverhütungsvorschriften sowie die Brandschutzordnung Teil A aus?",
    "massnahme": "Bringen Sie im Sozialbereich alle aushangpflichtigen Gesetze und Vorschriften (z. B. ArbZG, JArbSchG, AGG, MuSchG, DGUV Vorschrift 1) sowie die Brandschutzordnung Teil A gut sichtbar und aktuell an (§ 16 ArbZG, § 47 JArbSchG, § 12 Abs. 5 AGG, § 12 DGUV Vorschrift 1)."
   },
   {
    "id": "10.02",
    "frage": "Sind die Kaffeemaschine und andere hitzeentwickelnde Geräte auf einer nicht brennbaren Unterlage abgestellt?",
    "massnahme": "Betreiben Sie hitzeentwickelnde Geräte ausschließlich auf nicht brennbaren Unterlagen, um Brandgefahren gemäß ASR A2.2 zu vermeiden."
   },
   {
    "id": "10.03",
    "frage": "Dient der Pausenraum primär der Erholung der Beschäftigten und ist er frei von größeren Mengen an betrieblichem Lagergut (z. B. Archivboxen)?",
    "massnahme": "Nach der Arbeitsstättenverordnung (ArbStättV) und der technischen Regel ASR A4.2 dient der Pausenraum ausschließlich der Erholung der Beschäftigten. Prüfung alternativer Lagerkapazitäten, um die Aufenthaltsqualität im Pausenraum zu erhöhen und die Brandlast (durch Papier) in den Sozialräumen zu reduzieren."
   },
   {
    "id": "10.04",
    "frage": "Werden ortsveränderliche elektrische Betriebsmittel (z. B. Leitungen, Steckverbindungen, Leuchten, Geräte) in angemessenen Zeitabständen geprüft?",
    "massnahme": "Führen Sie regelmäßige Prüfungen ortsveränderlicher elektrischer Betriebsmittel durch befähigte Elektrofachkräfte gemäß DGUV Vorschrift 3 und TRBS 1201."
   }
  ]
 },
 {
  "nummer": "11.0",
  "name": "Marktleiterbüro",
  "fragen": [
   {
    "id": "11.01",
    "frage": "Liegt eine aktuelle Liste sowie Prüfberichte prüfungsbedürftiger Einrichtungen vor?",
    "massnahme": "Führen Sie eine vollständige Liste aller prüfpflichtigen Betriebseinrichtungen inklusive Nachweise und Prüfberichte gemäß BetrSichV § 14."
   },
   {
    "id": "11.02",
    "frage": "Ist der Fußboden im Büro des Marktleiters frei von Schäden, Verschmutzungen und Stolperstellen?",
    "massnahme": "Stellen Sie sicher, dass sich der Fußboden im Büro des Marktleiters in einem ordnungsgemäßen Zustand befindet, frei von Beschädigungen, Stolperstellen und Verschmutzungen ist, um die Sicherheit gemäß ArbStättV und ASR A1.5 zu gewährleisten."
   },
   {
    "id": "11.03",
    "frage": "Sind Maßnahmen getroffen, die den Anreiz zu Raubüberfällen vermindern (z. B. Türspion, feststehender Knauf)?",
    "massnahme": "Ergreifen Sie bauliche und organisatorische Maßnahmen zur Überfallprävention, z. B. Türspion, feststehender Knauf oder videoüberwachter Zugang (§ 3 ArbSchG, DGUV Vorschrift 25 „Überfallprävention“)."
   },
   {
    "id": "11.04",
    "frage": "Ist die Tür während des Umgangs mit Zahlungsmitteln verschlossen?",
    "massnahme": "Sorgen Sie dafür, dass der Zugang zum Kassenbüro während des Umgangs mit Bargeld stets verschlossen ist (§ 3 ArbSchG, DGUV Vorschrift 25)."
   },
   {
    "id": "11.05",
    "frage": "Werden neue Mitarbeiter vor Aufnahme der Tätigkeit zum Thema Arbeitssicherheit und Brandschutz unterwiesen?",
    "massnahme": "Führen Sie vor Arbeitsaufnahme eine Erstunterweisung zu Arbeitssicherheit und Brandschutz durch und dokumentieren Sie diese (§ 12 ArbSchG, § 4 DGUV Vorschrift 1)."
   },
   {
    "id": "11.06",
    "frage": "Ist während der gesamten Öffnungszeit die erforderliche Anzahl an ausgebildeten Ersthelfern gemäß DGUV Vorschrift 1 anwesend?",
    "massnahme": "Sicherstellen, dass während der gesamten Öffnungszeit die erforderliche Anzahl ausgebildeter Ersthelfer anwesend ist. Dienst- und Schichtplanung entsprechend anpassen und die Gültigkeit der Ausbildungen regelmäßig prüfen (§ 26 DGUV Vorschrift 1)."
   },
   {
    "id": "11.07",
    "frage": "Ist während der gesamten Ladenöffnungszeit mindestens ein Mitarbeiter mit der Qualifikation als Brandschutzhelfer anwesend?",
    "massnahme": "Sorgen Sie dafür, dass während der gesamten Öffnungszeit ausgebildete Brandschutzhelfer in ausreichender Zahl anwesend sind (§ 10 ArbSchG, ASR A2.2 Abschnitt 7.3)."
   },
   {
    "id": "11.08",
    "frage": "Ist ein Sicherheitsbeauftragter ausgebildet und bestellt?",
    "massnahme": "Bestellen Sie gemäß § 22 SGB VII einen geeigneten Sicherheitsbeauftragten und stellen Sie dessen Schulung und regelmäßige Beteiligung sicher."
   }
  ]
 },
 {
  "nummer": "12.0",
  "name": "Praktikanten",
  "fragen": [
   {
    "id": "12.01",
    "frage": "Wurde die Unterweisung von Praktikanten und Schüleraushilfen durchgeführt?",
    "massnahme": "Führen Sie eine Unterweisung für Praktikanten und Schüleraushilfen vor Beginn der Beschäftigung gemäß § 12 ArbSchG durch und dokumentieren Sie diese schriftlich."
   },
   {
    "id": "12.02",
    "frage": "Wurde die Unterweisung schriftlich dokumentiert?",
    "massnahme": "Dokumentieren Sie alle Unterweisungen schriftlich (Datum, Inhalt, Teilnehmende, Unterschrift) und bewahren Sie die Nachweise auf (§ 12 ArbSchG, § 4 Abs. 1 DGUV Vorschrift 1)."
   },
   {
    "id": "12.03",
    "frage": "Haben die Personen die Inhalte der Unterweisung verstanden?",
    "massnahme": "Vergewissern Sie sich, dass unterwiesene Personen die vermittelten Inhalte verstanden haben, etwa durch Rückfragen oder Lernerfolgskontrollen (§ 12 ArbSchG)."
   }
  ]
 },
 {
  "nummer": "13.0",
  "name": "Arbeitsmedizin",
  "fragen": [
   {
    "id": "13.01",
    "frage": "Wird den Beschäftigten arbeitsmedizinische Vorsorge angeboten?",
    "massnahme": "Bieten Sie allen Beschäftigten arbeitsmedizinische Vorsorge nach der Verordnung zur arbeitsmedizinischen Vorsorge (ArbMedVV) an und dokumentieren Sie das Angebot."
   },
   {
    "id": "13.02",
    "frage": "Erfolgte im laufenden Berichtszeitraum eine arbeitsmedizinische Betreuung (z. B. Begehung oder Sprechstunde) bzw. ist diese für das aktuelle Kalenderjahr fest eingeplant?",
    "massnahme": "Termin für Begehung bzw. Sprechstunde mit dem Betriebsarzt vereinbaren und prüfen, ob zwischenzeitlich ein akuter Betreuungsbedarf (z. B. durch neue Gefährdungen) besteht (ASiG, DGUV Vorschrift 2)."
   },
   {
    "id": "13.03",
    "frage": "Erfolgten arbeitsmedizinische Beratungen für Beschäftigte oder Führungskräfte?",
    "massnahme": "Ermöglichen Sie Beratungen durch den Betriebsarzt für Beschäftigte und Führungskräfte, insbesondere zu gesundheitlichen Fragestellungen und Präventionsmaßnahmen."
   },
   {
    "id": "13.04",
    "frage": "Sind Maßnahmen gegen Hauterkrankungen getroffen?",
    "massnahme": "Ergreifen Sie geeignete Schutzmaßnahmen (z. B. Hautschutzmittel, Handschuhe, Schulungen) zur Prävention von Hauterkrankungen gemäß § 3 ArbSchG und TRGS 401."
   },
   {
    "id": "13.05",
    "frage": "Werden Berichte und Empfehlungen des Betriebsarztes dokumentiert und umgesetzt?",
    "massnahme": "Dokumentieren Sie die Empfehlungen des Betriebsarztes und setzen Sie diese nachweislich um, um die Wirksamkeit der arbeitsmedizinischen Betreuung sicherzustellen."
   },
   {
    "id": "13.06",
    "frage": "Sind sanitäre Anlagen und Pausenräume sauber, funktionsfähig und ausreichend mit Hygieneartikeln bestückt?",
    "massnahme": "Stellen Sie sicher, dass sanitäre Anlagen und Pausenräume regelmäßig gereinigt, instand gehalten und mit ausreichenden Hygieneartikeln (Seife, Einmalhandtücher, Desinfektionsmittel) ausgestattet werden – gemäß ArbStättV Anhang Nr. 4.1 und ASR A4.1."
   }
  ]
 },
 {
  "nummer": "14.0",
  "name": "Gefahrstoffe",
  "fragen": [
   {
    "id": "14.01",
    "frage": "Werden Gefahrstoffe unter strikter Beachtung der Zusammenlagerungsverbote nach TRGS 510 (Abschnitt 7 und Anlage 2) so gelagert, dass gefährliche Wechselwirkungen zwischen verschiedenen Stoffgruppen ausgeschlossen sind?",
    "massnahme": "Gefahrstoffe nach TRGS 510 neu trennen und entsprechend den Zusammenlagerungsregeln getrennt lagern (räumlich oder durch geeignete Sicherheitseinrichtungen)."
   },
   {
    "id": "14.02",
    "frage": "Wird die passende persönliche Schutzausrüstung (z. B. Schutzbrille, Handschuhe) für Tätigkeiten mit Gefahrstoffen zur Verfügung gestellt?",
    "massnahme": "Stellen Sie geeignete persönliche Schutzausrüstung (PSA) für Tätigkeiten mit Gefahrstoffen bereit und weisen Sie die Beschäftigten gemäß § 3 ArbSchG und § 2 PSA-Benutzungsverordnung ein."
   },
   {
    "id": "14.03",
    "frage": "Ist die in den Betriebsanweisungen geforderte persönliche Schutzausrüstung in unmittelbarer Nähe und einsatzbereit vorhanden?",
    "massnahme": "Persönliche Schutzausrüstung gemäß Betriebsanweisung vollständig bereitstellen und in unmittelbarer Nähe zugänglich sowie einsatzbereit lagern; regelmäßige Kontrolle sicherstellen."
   },
   {
    "id": "14.04",
    "frage": "Sind Sicherheitsdatenblätter verfügbar?",
    "massnahme": "Stellen Sie sicher, dass für alle verwendeten Gefahrstoffe aktuelle Sicherheitsdatenblätter vorliegen und für die Beschäftigten zugänglich sind (§ 6 GefStoffV, Art. 31 REACH-Verordnung)."
   }
  ]
 },
 {
  "nummer": "15.0",
  "name": "Barrierefreies WC",
  "fragen": [
   {
    "id": "15.01",
    "frage": "Hängt die Notrufschnur (Zugschnur) bis maximal 10 cm über dem Fußboden herab, um nach einem Sturz erreichbar zu sein?",
    "massnahme": "Stellen Sie sicher, dass die Notrufschnur gemäß DIN VDE 0834 bis maximal 10 cm über dem Fußboden herabreicht, damit sie auch nach einem Sturz erreichbar ist."
   },
   {
    "id": "15.02",
    "frage": "Wird der Alarm an eine ständig besetzte Stelle (z. B. Empfang, Leitwarte) weitergeleitet?",
    "massnahme": "Sorgen Sie dafür, dass jeder Notruf an eine ständig besetzte Stelle (z. B. Empfang oder Leitwarte) weitergeleitet wird."
   },
   {
    "id": "15.03",
    "frage": "Werden die Zugschnüre und Signalgeber in regelmäßigen Intervallen (z. B. monatlich) auf Funktion geprüft?",
    "massnahme": "Prüfen Sie die Zugschnüre und Signalgeber gemäß DIN VDE 0834 regelmäßig, mindestens jedoch monatlich, auf ihre einwandfreie Funktion und dokumentieren Sie die Ergebnisse nachvollziehbar."
   },
   {
    "id": "15.04",
    "frage": "Sind die Beschäftigten über das Verhalten bei einem Alarm unterwiesen?",
    "massnahme": "Unterweisen Sie alle Beschäftigten regelmäßig im Verhalten bei einem Notrufalarm (Reaktion, Hilfeleistung, Alarmverfolgung) und dokumentieren Sie die Unterweisung (§ 12 ArbSchG)."
   },
   {
    "id": "15.05",
    "frage": "Ist sichergestellt, dass die Tür im Notfall von außen entriegelt werden kann (Notentriegelung)?",
    "massnahme": "Notentriegelung an der Tür herstellen bzw. funktionsfähig ausführen, damit eine Öffnung von außen im Notfall jederzeit möglich ist."
   }
  ]
 },
 {
  "nummer": "16.0",
  "name": "Dokumentation",
  "fragen": [
   {
    "id": "16.01",
    "frage": "Wird die Dokumentation von Erste-Hilfe-Leistungen ordnungsgemäß geführt und aufbewahrt?",
    "massnahme": "Stellen Sie sicher, dass alle Erste-Hilfe-Leistungen lückenlos dokumentiert und die Aufzeichnungen fünf Jahre aufbewahrt werden (§ 24 Abs. 6 DGUV Vorschrift 1)."
   },
   {
    "id": "16.02",
    "frage": "Erfolgte die letzte Unterweisung zum Umgang mit Zahlungsmitteln innerhalb der letzten 6 Monate?",
    "massnahme": "Führen Sie regelmäßig, mindestens jedoch halbjährlich, Unterweisungen zum sicheren Umgang mit Zahlungsmitteln durch und dokumentieren Sie diese nachvollziehbar."
   },
   {
    "id": "16.03",
    "frage": "Wurden bei der Unterweisung aktuelle Änderungen in den betrieblichen Abläufen oder neue Sicherheitstechniken berücksichtigt?",
    "massnahme": "Berücksichtigen Sie bei Unterweisungen stets aktuelle betriebliche Änderungen sowie neue Sicherheitstechniken und passen Sie die Inhalte entsprechend an."
   },
   {
    "id": "16.04",
    "frage": "Wurde die Gefährdungsbeurteilung (GBO) erstellt und ist sie auf dem aktuellen Stand?",
    "massnahme": "Erstellen und aktualisieren Sie regelmäßig eine schriftliche Gefährdungsbeurteilung gemäß § 5 ArbSchG und § 3 BetrSichV."
   }
  ]
 },
 {
  "nummer": "17.0",
  "name": "Psychische Belastung",
  "fragen": [
   {
    "id": "17.01",
    "frage": "Werden Wünsche der Beschäftigten bei der Arbeitsplanung berücksichtigt?",
    "massnahme": "Beziehen Sie individuelle Wünsche der Beschäftigten bei der Arbeitszeitgestaltung ein, soweit dies mit den betrieblichen Erfordernissen vereinbar ist (§ 3 ArbSchG, § 106 GewO)."
   },
   {
    "id": "17.02",
    "frage": "Ist die Pausenregelung umgesetzt?",
    "massnahme": "Stellen Sie sicher, dass die gesetzlichen Pausenregelungen gemäß § 4 ArbZG eingehalten und in der Arbeitszeitplanung berücksichtigt werden."
   },
   {
    "id": "17.03",
    "frage": "Werden Überstunden gering gehalten?",
    "massnahme": "Begrenzen Sie Überstunden auf das notwendige Maß und achten Sie auf die Einhaltung der täglichen und wöchentlichen Höchstarbeitszeiten (§ 3 ArbZG)."
   },
   {
    "id": "17.04",
    "frage": "Werden regelmäßige Teambesprechungen durchgeführt?",
    "massnahme": "Führen Sie regelmäßige Besprechungen im Team durch, um die Kommunikation und Beteiligung der Beschäftigten gemäß § 81 BetrVG und § 4 ArbSchG zu fördern."
   },
   {
    "id": "17.05",
    "frage": "Werden neue Mitarbeiter eingearbeitet?",
    "massnahme": "Stellen Sie sicher, dass neue Beschäftigte systematisch eingearbeitet werden und die für ihre Tätigkeit erforderlichen Kenntnisse vermittelt bekommen (§ 3 ArbSchG)."
   },
   {
    "id": "17.06",
    "frage": "Ist eine Unterweisung zum Thema Brand- und Arbeitsschutz erfolgt?",
    "massnahme": "Führen Sie regelmäßige Unterweisungen zu Arbeitsschutz und Brandschutz gemäß § 12 ArbSchG und DGUV Information 205-023 durch."
   },
   {
    "id": "17.07",
    "frage": "Hängt ein sogenanntes schwarzes Brett im Sozialraum oder Kassenbüro?",
    "massnahme": "Halten Sie ein aktuelles schwarzes Brett im Sozialraum oder Bürobereich zur Information der Beschäftigten bereit (§ 81 BetrVG, § 12 ArbSchG)."
   },
   {
    "id": "17.08",
    "frage": "Werden Entscheidungen transparent erläutert?",
    "massnahme": "Kommunizieren Sie betriebliche Entscheidungen transparent und nachvollziehbar, um das Vertrauen der Beschäftigten zu stärken (§ 4 ArbSchG, § 81 BetrVG)."
   },
   {
    "id": "17.09",
    "frage": "Gibt es positive Rückmeldungen bei guter Leistung?",
    "massnahme": "Geben Sie regelmäßig wertschätzendes Feedback bei guter Leistung, um Motivation und Arbeitszufriedenheit zu fördern (§ 4 ArbSchG, § 75 BetrVG)."
   },
   {
    "id": "17.10",
    "frage": "Wird konstruktive Kritik geübt?",
    "massnahme": "Führen Sie Kritikgespräche sachlich und lösungsorientiert, unter Wahrung der Würde der betroffenen Person (§ 75 BetrVG, § 4 ArbSchG)."
   },
   {
    "id": "17.11",
    "frage": "Wurden Weiterbildungsmöglichkeiten geschaffen bzw. angeboten?",
    "massnahme": "Schaffen Sie innerbetriebliche oder externe Weiterbildungsangebote und fördern Sie Qualifizierungen gemäß § 82 BetrVG sowie § 3 ArbSchG."
   },
   {
    "id": "17.12",
    "frage": "Gibt es einen Aushang zur Information über die Suchtprävention?",
    "massnahme": "Stellen Sie einen gut sichtbaren Aushang mit Informationen zur Suchtprävention bereit und verweisen Sie auf innerbetriebliche und externe Hilfsangebote (§ 3 ArbSchG)."
   },
   {
    "id": "17.13",
    "frage": "Ist ein Betriebliches Eingliederungsmanagement (BEM) eingeführt?",
    "massnahme": "Führen Sie ein Betriebliches Eingliederungsmanagement (BEM) ein und bieten Sie es Beschäftigten an, die innerhalb eines Jahres länger als sechs Wochen arbeitsunfähig waren (§ 167 Abs. 2 SGB IX)."
   },
   {
    "id": "17.14",
    "frage": "Wird Alleinarbeit vermieden?",
    "massnahme": "Vermeiden Sie gefährdende Alleinarbeit oder ergreifen Sie geeignete Schutzmaßnahmen wie Personen-Notsignal-Anlagen oder regelmäßige Kontrollanrufe (§ 3 ArbSchG, DGUV Regel 112-139)."
   },
   {
    "id": "17.15",
    "frage": "Ist die Betreuung nach einem Überfall organisiert?",
    "massnahme": "Stellen Sie sicher, dass betroffene Beschäftigte nach einem Überfall eine psychologische Erstbetreuung und Nachsorge erhalten (§ 3 ArbSchG, DGUV Information 206-023)."
   },
   {
    "id": "17.16",
    "frage": "Werden Schulungen für den Umgang mit gewalttätigen Situationen ermöglicht?",
    "massnahme": "Ermöglichen Sie den Beschäftigten Schulungen zu Deeskalation und Konfliktmanagement bei Gewalt- und Bedrohungssituationen (§ 12 ArbSchG)."
   },
   {
    "id": "17.17",
    "frage": "Werden Anregungen der Mitarbeitenden in Entscheidungsprozesse einbezogen?",
    "massnahme": "Stellen Sie sicher, dass Anregungen der Mitarbeitenden systematisch in Entscheidungsprozesse einbezogen und bei Maßnahmen des Arbeits- und Gesundheitsschutzes berücksichtigt werden (§ 3 ArbSchG, § 87 BetrVG)."
   }
  ]
 }
];
