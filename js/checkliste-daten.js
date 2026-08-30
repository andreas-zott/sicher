const CHECKLISTE_KATALOG = [
  {
    "nummer": "1.0",
    "name": "Gesamtmarkt",
    "fragen": [
      {
        "frage": "Entspricht das getragene Schuhwerk aller im Bereich tätigen Personen den Anforderungen der Gefährdungsbeurteilung (fest, im Zehenbereich geschlossen, flach und rutschhemmend)?",
        "massnahme": "Sorgen Sie gemäß § 3 Abs. 1 ArbSchG dafür, dass alle Personen im Markt festes, geschlossenes und flaches Schuhwerk tragen, um arbeitsbedingte Gesundheitsgefahren wirksam zu vermeiden."
      },
      {
        "frage": "Beachten die Mitarbeitenden die Betriebsanweisung für Flurförderfahrzeuge insbes. PSA-Pflicht, Traglasten, Verbot der Personenmitnahme?",
        "massnahme": "Betriebsanweisung für Flurförderfahrzeuge (PSA-Pflicht, zulässige Traglasten, Verbot der Personenmitnahme) allen Mitarbeitenden erneut in Erinnerung rufen und Einhaltung konsequent kontrollieren."
      },
      {
        "frage": "Wurden die Automatiktüren gemäß den geltenden Regelwerken geprüft und befinden sich diese in einem ordnungsgemäßen Zustand?",
        "massnahme": "Fachgerechte Prüfung der betroffenen Automatiktüren nach ASR A1.7 umgehend veranlassen. Betrieb bis zur Prüfung ggf. einschränken. Festgestellte Mängel zügig beheben und Dokumentation aktualisieren."
      },
      {
        "frage": "Sind die Schnelllauftore gemäß den Herstellervorgaben und gesetzlichen Fristen geprüft sowie technisch einwandfrei?",
        "massnahme": "Prüfung und ggf. erforderliche Instandsetzung des Schnelllauftors unverzüglich über einen Sachkundigen / den Hersteller veranlassen. Bis zur Mängelfreiheit ist der Torbereich mit besonderer Vorsicht zu nutzen.."
      },
      {
        "frage": "Sind die Rolltore aktuell geprüft und funktionieren alle Schutzeinrichtungen (z. B. Absturzsicherung, Einzugsschutz) einwandfrei?",
        "massnahme": "Sachkundigenprüfung sowie erforderliche Wartung des Rolltors kurzfristig veranlassen und den ordnungsgemäßen Zustand im Prüfbuch dokumentieren."
      },
      {
        "frage": "Ist die Aufzugsanlage geprüft und in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen und mit funktionsfähigen Schutzeinrichtungen)?",
        "massnahme": "Veranlassen Sie gemäß § 4 BetrSichV regelmäßige Prüfungen der Aufzugsanlage, um deren ordnungsgemäßen und sicheren Zustand sicherzustellen."
      },
      {
        "frage": "Werden für Tätigkeiten in der Höhe (z. B. in Lager oder Verkaufsraum) geeignete und geprüfte Aufstiegshilfen (z. B. Trittstufen, Rolltritte/Elefantenfüße) in ausreichender Zahl bereitgestellt und bestimmungsgemäß benutzt?",
        "massnahme": "Stellen Sie sicher, dass für Arbeiten in der Höhe ausschließlich geprüfte und unbeschädigte Aufstiegshilfen (gemäß DGUV Information 208-016) verwendet werden; untersagen Sie die Nutzung ungeeigneter Ersatzlösungen wie Kisten oder Regalböden."
      },
      {
        "frage": "Sind die Leitern geprüft gemäß DGUV Information 208-016 Leitern und Tritte?",
        "massnahme": "Führen Sie regelmäßige Prüfungen aller Leitern und Tritte nach DGUV Information 208-016 sowie gemäß den Regelungen der BetrSichV durch und dokumentieren Sie diese nachvollziehbar."
      },
      {
        "frage": "Werden aus dem Ordersatz geeignete Sicherheitsmesser verwendet?",
        "massnahme": "Stellen Sie auf Grundlage der Gefährdungsbeurteilung sicher, dass ausschließlich geeignete, im Ordersatz festgelegte Sicherheitsmesser verwendet werden, um Schnittverletzungen zu vermeiden (§§ 4–5 ArbSchG)."
      },
      {
        "frage": "Ist der Gabelhubwagen in einem ordnungsgemäßen Zustand ohne sichtbare Beschädigungen?",
        "massnahme": "Sorgen Sie für eine regelmäßige technische Kontrolle und Instandhaltung des Gabelhubwagens gemäß DGUV Vorschrift 68 (Flurförderzeuge), um dessen ordnungsgemäßen Zustand zu gewährleisten."
      },
      {
        "frage": "Ist der elektrische Hubwagen geprüft und in einem ordnungsgemäßen Zustand (keine sichtbaren Beschädigungen, funktionsfähige Schutzeinrichtungen)?",
        "massnahme": "Stellen Sie sicher, dass elektrische Hubwagen gemäß Betriebssicherheitsverordnung und DGUV Regel 100-500 geprüft und mit intakten Schutzeinrichtungen betrieben werden."
      },
      {
        "frage": "Sind die Verkehrswege so beschaffen, dass kein Unfallrisiko durch Stolpern, Ausrutschen oder Umknicken besteht?",
        "massnahme": "Gestalten und erhalten Sie Verkehrswege so, dass sie frei von Stolper-, Rutsch- oder Sturzgefahren sind (§ 3a ArbStättV, ASR A1.8)."
      },
      {
        "frage": "Sind die Treppen unbeschädigt und frei von Gegenständen?",
        "massnahme": "Stellen Sie sicher, dass alle Treppen frei von Hindernissen sind und keine baulichen Mängel aufweisen, um die Unfallgefahr gemäß ASR A1.8 zu minimieren."
      },
      {
        "frage": "Sind Betriebsanweisungen gut zugänglich und werden Sicherheitsanweisungen eingehalten?",
        "massnahme": "Halten Sie alle Betriebsanweisungen gut zugänglich und stellen Sie sicher, dass die Beschäftigten über die Inhalte unterwiesen sind (§§ 4, 12 ArbSchG)."
      },
      {
        "frage": "Ist die Beleuchtung in den Verkaufs- und Lagerbereichen gemäß ASR A3.4 ausreichend dimensioniert (mind. 300 Lux im Verkaufsraum), voll funktionsfähig und so beschaffen, dass Gefahrenhinweise auf Produkten sowie Leckagen in den Regalen jederzeit zweifelsfrei erkennbar sind?",
        "massnahme": "Beleuchtung gemäß ASR A3.4 anpassen (mind. 300 Lux), defekte Leuchten instand setzen und ausreichende Ausleuchtung zur sicheren Erkennung von Gefahren sicherstellen."
      },
      {
        "frage": "Sind von der Decke geführte Leitungen und Steckverbindungen durch geeignete mechanische Zugentlastungen (z. B. Stahlseile, Ketten oder spezielle Klemmvorrichtungen) so gesichert, dass keine Zugkräfte auf die elektrischen Kontaktstellen wirken?",
        "massnahme": "Nachrüstung mechanischer Zugentlastungen gemäß DIN VDE 0100-520."
      },
      {
        "frage": "Sind zur Zeit der Begehung keine sichtbaren Beschädigungen an Schaltern und Steckdosen vorhanden?",
        "massnahme": "Instandsetzung des defekten Schalters bzw. der Steckdose durch eine Elektrofachkraft veranlassen. Bis zur Reparatur ist die Nutzung der betroffenen Komponente zu untersagen."
      },
      {
        "frage": "Elektrische Steckverbindungen liegen nicht ungeschützt auf dem Boden, insbesondere in Bereichen (z. B. unter Kühl- oder Tiefkühltruhen)?",
        "massnahme": "Steckverbindungen sind so zu verlegen, dass sie gegen Feuchtigkeit, Schmutz und mechanische Beanspruchung geschützt sind. Leitungen und Verbindungen dürfen nicht auf dem Boden liegen, insbesondere nicht unter Kühlmöbeln und sichern Sie diese gemäß § 3 ArbSchG und ASR A1.5 gegen unbeabsichtigtes Lösen."
      },
      {
        "frage": "Sind provisorische Installationen vermieden?",
        "massnahme": "Provisorische elektrische Installationen vermeiden. Elektrische Anlagen und Betriebsmittel ausschließlich fachgerecht und dauerhaft installieren bzw. instand setzen lassen."
      },
      {
        "frage": "Erfüllen die Standorte der Erste-Hilfe-Koffer die Anforderungen an Sichtbarkeit, Erreichbarkeit und Norm-Kennzeichnung gemäß DGUV?",
        "massnahme": "Platzieren Sie den Erste-Hilfe-Koffer gut sichtbar, dauerhaft zugänglich und gemäß DGUV Vorschrift 1 an einem geeigneten Ort."
      },
      {
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
        "frage": "Sind die Feuerlöscheinrichtungen geprüft, und werden die Prüffristen eingehalten?",
        "massnahme": "Veranlassen Sie Prüfungen aller Feuerlöscher durch befähigte Personen nach DIN 14406-4 und sorgen Sie für die Einhaltung der vorgeschriebenen Prüffristen gemäß § 10 ArbSchG."
      },
      {
        "frage": "Sind die Feuerlöscheinrichtungen frei zugänglich und nicht durch Ware, Displays oder sonstige Gegenstände blockiert?",
        "massnahme": "Halten Sie alle Feuerlöscheinrichtungen gemäß ASR A2.2 und § 10 ArbSchG stets frei zugänglich, um eine unverzügliche Nutzung im Brandfall zu gewährleisten."
      },
      {
        "frage": "Sind die Prüfsiegel auf den Wandhydranten unbeschädigt?",
        "massnahme": "Prüfsiegel an Wandhydranten regelmäßig auf Unversehrtheit und Gültigkeit kontrollieren. Beschädigte oder fehlende Prüfsiegel umgehend ersetzen und Wartung nachweisen."
      },
      {
        "frage": "Sind die Brandschutztüren frei von Zugestellungen und wird ihre Funktion nicht gestört?",
        "massnahme": "Achten Sie gemäß ASR A2.3 darauf, dass Brandschutztüren jederzeit frei zugänglich und in ihrer Funktion nicht beeinträchtigt sind."
      },
      {
        "frage": "Sind die Türhaltevorrichtungen und der Schließfolgeregler des Feuerschutzabschlusses in Ordnung?",
        "massnahme": "Sorgen Sie dafür, dass Türhaltevorrichtungen und Schließfolgeregler an Brandschutztüren regelmäßig auf ihre Funktionsfähigkeit überprüft werden (vgl. DIN 14677)."
      },
      {
        "frage": "Sind die Brandschutztüren ohne Beschädigungen?",
        "massnahme": "Prüfen Sie regelmäßig den Zustand aller Brandschutztüren auf Beschädigungen und stellen Sie ihre uneingeschränkte Schutzwirkung sicher (§ 4 ArbSchG)."
      },
      {
        "frage": "Ist ein aktueller Flucht- und Rettungsplan vorhanden?",
        "massnahme": "Hängen Sie einen aktuellen und übersichtlichen Flucht- und Rettungsplan gemäß ASR A1.3 und § 4 ArbStättV gut sichtbar aus."
      },
      {
        "frage": "Ist die Notausgangsbeleuchtung ohne Defekte?",
        "massnahme": "Stellen Sie sicher, dass die Notausgangsbeleuchtung gemäß ASR A3.4/3 fehlerfrei funktioniert, um bei Stromausfall eine sichere Flucht zu ermöglichen."
      },
      {
        "frage": "Sind alle Flucht- und Rettungswege sowie Notausgänge in ihrer gesamten Breite ständig freigehalten und im Außenbereich nicht durch Fahrzeuge oder Lagergut blockiert?",
        "massnahme": "Stellen Sie die sofortige Beräumung sicher. Halten Sie Notausgänge zu jeder Zeit frei zugänglich und vermeiden Sie jedwede Art von Verstellung gemäß § 4 ArbStättV i. V. m. ASR A2.3. Unterweisen Sie die Mitarbeitenden erneut über das strikte Verbot der Lagerung von Gegenständen in Fluchtwegen."
      },
      {
        "frage": "Sind alle Notausgänge und -ausstiege jederzeit ohne fremde Hilfsmittel von innen leicht zu öffnen und ist die Bedienbarkeit der Beschläge sichergestellt?",
        "massnahme": "Stellen Sie sicher, dass Notausgänge gemäß ASR A2.3 niemals verschlossen, verriegelt oder durch Vorhänge/Gegenstände verdeckt sind. Defekte Öffnungsmechanismen sind unverzüglich instand zu setzen."
      },
      {
        "frage": "Führen die Notausgänge in sichere Bereiche?",
        "massnahme": "Vergewissern Sie sich, dass alle Notausgänge in gesicherte, gefahrenfreie Bereiche führen und so der Schutz der Beschäftigten gewährleistet ist."
      },
      {
        "frage": "Ist die Brandmeldeanlage funktionsfähig?",
        "massnahme": "Regelmäßige Inspektion und Wartung durch zertifizierte Fachfirmen (meist jährlich nach DIN 14675)."
      },
      {
        "frage": "Sind die Technik- und Heizräume frei von brennbaren Materialien (z. B. Kisten, Kartons)?",
        "massnahme": "Lagern Sie gemäß ASR A2.2 und Brandschutzordnung Teil C keine brennbaren Materialien in Technik- oder Heizräumen, um Brandrisiken zu vermeiden."
      },
      {
        "frage": "Sind die Technik- und Heizräume frei von Lagernutzung?",
        "massnahme": "Verwenden Sie Technik- und Heizräume ausschließlich für ihre bestimmungsgemäße Nutzung, da eine Lagerung dort gegen Brandschutzvorgaben verstößt (§ 3 ArbSchG)."
      },
      {
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
        "frage": "Sind die Arbeitsgeräte an der Backstation (Backofen, Backbleche, Brotschneidemaschine) in einem ordnungsgemäßen Zustand?",
        "massnahme": "Gerät sofort sperren (Netzstecker ziehen), mit einem Warnhinweis („Defekt – Nicht benutzen“) kennzeichnen und eine DGUV V3 Prüfung bzw. Instandsetzung durch eine Elektrofachkraft veranlassen."
      },
      {
        "frage": "Ist das freistehende Handwaschbecken ohne Beschädigungen?",
        "massnahme": "Kontrollieren Sie freistehende Handwaschbecken regelmäßig auf Beschädigungen und sichern Sie deren Hygiene und Funktion gemäß ArbStättV § 6."
      },
      {
        "frage": "Sind die Elektroleitungen intakt und bilden keine Stolperstellen?",
        "massnahme": "Führen Sie regelmäßige Sichtprüfungen elektrischer Leitungen durch, um sicherzustellen, dass keine Stolper- oder Brandgefahren gemäß DGUV Vorschrift 3 entstehen."
      },
      {
        "frage": "Entspricht die Zuleitung der VDE-Norm?",
        "massnahme": "Vergewissern Sie sich, dass sämtliche elektrischen Zuleitungen den Vorgaben der VDE-Normen entsprechen, um elektrische Gefährdungen auszuschließen (§ 3 ArbSchG, BetrSichV)."
      },
      {
        "frage": "Ist der Backhandschuh für die Backstation in einem ordnungsgemäßen Zustand (kein Verschleiß) und besitzt eine lange Stulpe?",
        "massnahme": "Verwenden Sie nur hitzebeständige Backhandschuhe in einwandfreiem Zustand und mit langer Stulpe gemäß PSA-Benutzungsverordnung und § 3 ArbSchG."
      },
      {
        "frage": "Sind alle Heißgeräte (z. B. Heißtheken, Fritteusen) in technisch einwandfreiem Zustand?",
        "massnahme": "Prüfen Sie regelmäßig alle Heißgeräte (z. B. Heißtheken, Fritteusen) auf technische Mängel und dokumentieren Sie die Instandhaltung gemäß BetrSichV § 10."
      },
      {
        "frage": "Ist die Brotschneidemaschine aktuell geprüft und inklusive aller Schutzeinrichtungen in einwandfreiem Zustand?",
        "massnahme": "Gerät sofort sperren (Netzstecker ziehen), mit einem Warnhinweis („Defekt – Nicht benutzen“) kennzeichnen und eine DGUV V3 Prüfung bzw. Instandsetzung durch eine Elektrofachkraft veranlassen."
      }
    ]
  },
  {
    "nummer": "4.0",
    "name": "Serviceabteilung",
    "fragen": [
      {
        "frage": "Hängt an den Waschplätzen ein aktueller, auf die Gefährdungsbeurteilung abgestimmter Hautschutzplan gut sichtbar aus?",
        "massnahme": "Erstellen Sie einen standortspezifischen Hautschutzplan (gemäß TRGS 401) und bringen Sie diesen an allen Waschplätzen gut sichtbar an; stellen Sie die darin aufgeführten Mittel für Hautschutz, Hautreinigung und Hautpflege bereit."
      },
      {
        "frage": "Werden Hautschutz- und Hautpflegeprodukte zur Verfügung gestellt?",
        "massnahme": "Stellen Sie geeignete Hautschutz- und Hautpflegeprodukte bereit, um berufsbedingten Hauterkrankungen gemäß § 3 ArbSchG vorzubeugen."
      },
      {
        "frage": "Sind die Arbeitsgeräte im Servicebereich in einem ordnungsgemäßen Zustand?",
        "massnahme": "Veranlassen Sie regelmäßige Sicht- und Funktionsprüfungen der Arbeitsgeräte im Servicebereich gemäß § 4 BetrSichV."
      },
      {
        "frage": "Bleiben die aufklappbaren Thekenscheiben in der oberen Stellung sicher und selbstständig stehen?",
        "massnahme": "Setzen Sie die betroffenen Thekenelemente unverzüglich außer Betrieb oder sichern Sie diese gegen unbeabsichtigtes Herabfallen. Veranlassen Sie gemäß § 3 Abs. 3 BetrSichV die Instandsetzung der Haltevorrichtungen (z. B. Austausch der Gasdruckfedern), um Quetsch- und Schlagverletzungen zu vermeiden."
      },
      {
        "frage": "Sind die Glastüren und Glaswände in Augenhöhe gekennzeichnet?",
        "massnahme": "Kennzeichnen Sie Glastüren und Glaswände in Augenhöhe mit deutlich sichtbaren Markierungen gemäß ASR A1.3 und DGUV Information 208-004."
      },
      {
        "frage": "Werden Schneidbretter und Messer regelmäßig gereinigt und farbcodiert verwendet?",
        "massnahme": "Reinigen und desinfizieren Sie Schneidbretter und Messer regelmäßig und wenden Sie ein Farbsystem zur hygienischen Trennung an (§ 3 ArbSchG, HACCP)."
      },
      {
        "frage": "Werden Schneidbretter mit Messereinschub verwendet?",
        "massnahme": "Verwenden Sie Schneidbretter mit sicherem Messereinschub, um Schnittverletzungen zu vermeiden und die Lagerung gemäß § 3 ArbSchG sicher zu gestalten."
      },
      {
        "frage": "Werden Messerhalter verwendet?",
        "massnahme": "Sorgen Sie für eine sichere Aufbewahrung von Messern durch geeignete Halterungen gemäß § 3 ArbSchG und DGUV Regel 100-500."
      },
      {
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
        "frage": "Ist der Fußraum frei von Gegenständen?",
        "massnahme": "Halten Sie den Fußraum dauerhaft frei von Gegenständen, um Unfallgefahren durch Stolpern oder Hängenbleiben zu vermeiden (§ 3 ArbSchG, ASR A1.8)."
      },
      {
        "frage": "Ist der Fußboden im Kassenbereich in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen)?",
        "massnahme": "Sorgen Sie für die Instandhaltung und Rutschhemmung des Fußbodens im Kassenbereich gemäß ASR A1.5/1,2 und § 3 ArbSchG."
      },
      {
        "frage": "Sind die serienmäßig eingebauten Heizgeräte im Kassenraum nicht durch brennbares Material zugestellt?",
        "massnahme": "Stellen Sie sicher, dass Heizgeräte frei zugänglich und nicht durch brennbare Materialien blockiert sind, um Brandgefahren gemäß ASR A2.2 zu vermeiden."
      },
      {
        "frage": "Sind die Kassenstühle in einem funktionsfähigen Zustand?",
        "massnahme": "Prüfen Sie Kassenstühle regelmäßig auf Funktionalität und stellen Sie ergonomische Arbeitsmittel gemäß ArbStättV Anhang Nr. 6 bereit."
      },
      {
        "frage": "Ist das Transportband unbeschädigt und weist keine Lücke von über 5 mm auf?",
        "massnahme": "Überprüfen Sie Transportbänder regelmäßig auf Schäden und sorgen Sie dafür, dass keine Lücken über 5 mm entstehen, um Verletzungsrisiken auszuschließen (§ 3 ArbSchG)."
      },
      {
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
        "frage": "Ist an allen Beleuchtungen in den Kühlhäusern die Überwurfkappe (Schutzkappe/Schutzglas) montiert?",
        "massnahme": "Sichern Sie Beleuchtungseinrichtungen in Kühlhäusern mit Schutzabdeckungen gegen mechanische Einwirkungen und Glasbruch gemäß DIN 10500."
      },
      {
        "frage": "Ist die Notentriegelung vorhanden und in Ordnung?",
        "massnahme": "Stellen Sie sicher, dass Notentriegelungen an Kühlraumtüren installiert, gekennzeichnet und jederzeit funktionsfähig sind (§ 3 ArbSchG, TRBS 2121 Teil 2)."
      },
      {
        "frage": "Sind die Kühlhaustüren von innen mit dem Rettungswegschild ISO 7010 gekennzeichnet?",
        "massnahme": "Kennzeichnen Sie Kühlhaustüren von innen mit dem international gültigen Rettungswegsymbol gemäß ISO 7010 und ASR A1.3."
      },
      {
        "frage": "Funktioniert die Beleuchtung einwandfrei?",
        "massnahme": "Stellen Sie eine ausreichende, blendfreie und funktionstüchtige Beleuchtung aller Arbeitsbereiche gemäß ASR A3.4 sicher."
      },
      {
        "frage": "Ist die Notruf-Funktion (wenn vorhanden) in Ordnung und ohne Beschädigungen?",
        "massnahme": "Stellen Sie sicher, dass die Notruf-Funktion in Kühlräumen jederzeit funktionsfähig ist und regelmäßig geprüft wird (§ 4 ArbSchG, TRBS 3121)."
      }
    ]
  },
  {
    "nummer": "7.0",
    "name": "CO2 Kühleinrichtungen",
    "fragen": [
      {
        "frage": "Wurden Personen, die sich im Bereich von Kühlanlagen oder Kühlhäusern aufhalten, unterwiesen?",
        "massnahme": "Führen Sie unverzüglich eine dokumentierte Unterweisung durch."
      },
      {
        "frage": "Sind die Sensoren nicht mit Material oder sonstigen Gegenständen verstellt?",
        "massnahme": "Achten Sie darauf, dass sicherheitsrelevante Sensoren, Melder oder Lüftungselemente nicht verstellt oder blockiert sind (§ 3 ArbSchG, TRBS 1115)."
      },
      {
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
        "frage": "Sind die Schwerlastregale geprüft?",
        "massnahme": "Veranlassen Sie regelmäßige Prüfungen aller Schwerlastregale durch befähigte Personen gemäß BetrSichV § 14 sowie DGUV Regel 108-007."
      },
      {
        "frage": "Ist der Anfahrschutz vorhanden?",
        "massnahme": "Installieren Sie gemäß DGUV Vorschrift 68 und ASR A1.3 einen geeigneten Anfahrschutz an allen relevanten Bereichen, um strukturelle Schäden zu vermeiden."
      },
      {
        "frage": "Ist die Traglastangabe an den Schwerlastregalen vorhanden?",
        "massnahme": "Bringen Sie an jedem Regal deutlich sichtbare und dauerhafte Traglastangaben an, wie es § 4 BetrSichV i.V.m. TRBS 1201 fordert."
      },
      {
        "frage": "Befindet sich eine Absturzsicherung an der Rampe?",
        "massnahme": "Sorgen Sie dafür, dass an Rampen mit Absturzkante geeignete Absturzsicherungen gemäß ASR A2.1 installiert sind."
      },
      {
        "frage": "Ist die Absturzsicherung in einem ordnungsgemäßen Zustand (ohne sichtbare Beschädigungen und mit Kennzeichnung)?",
        "massnahme": "Überprüfen Sie regelmäßig die Absturzsicherung auf Schäden und achten Sie auf gut sichtbare Warnkennzeichnungen (§ 4 ArbSchG)."
      },
      {
        "frage": "Ist die Müll-/Papierpresse geprüft?",
        "massnahme": "Lassen Sie Müll- und Papierpressen regelmäßig durch befähigte Personen gemäß BetrSichV und DGUV Regel 100-500 prüfen."
      },
      {
        "frage": "Ist die Müll-/Papierpresse in einem ordnungsgemäßen Zustand (keine sichtbaren Beschädigungen, intakte Schutzeinrichtungen, fester Stand)?",
        "massnahme": "Stellen Sie sicher, dass die Müll-/Papierpresse technisch einwandfrei, standsicher und mit intakten Schutzeinrichtungen betrieben wird (§ 3 ArbSchG, § 4 BetrSichV)."
      },
      {
        "frage": "Sind die Verkehrswege so beschaffen, dass kein Risiko zum Stolpern, Ausrutschen oder Umknicken besteht?",
        "massnahme": "Gestalten und erhalten Sie Verkehrswege so, dass sie frei von Stolper-, Rutsch- oder Sturzgefahren sind (§ 3a ArbStättV, ASR A1.8)."
      }
    ]
  },
  {
    "nummer": "9.0",
    "name": "Leergut",
    "fragen": [
      {
        "frage": "Sind die Annahmegeräte unbeschädigt und funktionsfähig?",
        "massnahme": "Beschädigte oder defekte Annahmegeräte unverzüglich instand setzen oder außer Betrieb nehmen."
      },
      {
        "frage": "Ist die Leergutrücknahme in einem ordnungsgemäßen Zustand (Schutzeinrichtungen intakt, Einzugsstellen gesichert, keine Glasscherben)?",
        "massnahme": "Stellen Sie sicher, dass die Leergutrücknahme gemäß DGUV Regel 100-500 (Kapitel 2.10) technisch einwandfrei, mit funktionierenden Schutzeinrichtungen versehen und frei von Gefährdungen durch Glasscherben ist."
      },
      {
        "frage": "Werden Rollbahnen nicht betreten?",
        "massnahme": "Beschäftigte unterweisen und unzulässiges Betreten der Rollbahnen verhindern."
      },
      {
        "frage": "Sind beschädigte Paletten/Kisten aussortiert?",
        "massnahme": "Beschädigte Paletten/Kisten aussortieren und aus dem Verkehr ziehen."
      },
      {
        "frage": "Werden Lasten sicher aufgenommen und transportiert?",
        "massnahme": "Sichere Aufnahme und Transport von Lasten durch Unterweisung sicherstellen und Arbeitsmittel prüfen und anpassen."
      },
      {
        "frage": "Wird die PSA zur Verfügung gestellt und getragen?",
        "massnahme": "PSA bereitstellen und Benutzung sicherstellen."
      },
      {
        "frage": "Werden Abfälle und Bruchmaterial ordnungsgemäß entsorgt?",
        "massnahme": "Abfälle und Bruchmaterial ordnungsgemäß trennen, sammeln und entsorgen lassen."
      },
      {
        "frage": "Werden Stapelhöhen eingehalten?",
        "massnahme": "Stapelhöhen anpassen und Einhaltung der zulässigen Stapelgrenzen sicherstellen."
      },
      {
        "frage": "Ist die Lagerfläche sauber und rutschfrei?",
        "massnahme": "Lagerfläche reinigen und Rutschgefahren beseitigen."
      },
      {
        "frage": "Beträgt die lichte Breite des Wartungsganges zwischen Rollbahn und Wand durchgehend mindestens 0,60 m (an Engstellen kurzzeitig 0,50 m)?",
        "massnahme": "Einzug- und Quetschstellen der Rollbahn zur Wand hin technisch absichern (z. B. durch festen Seitenschutz/Verkleidung), den Betrieb der Bahn bei Wartung zwingend stoppen oder, falls betrieblich machbar, den Bereich zeitweise sperren."
      }
    ]
  },
  {
    "nummer": "10.0",
    "name": "Sozialräume",
    "fragen": [
      {
        "frage": "Hängen im Sozialbereich die aktuellen aushangpflichtigen Gesetze, Unfallverhütungsvorschriften sowie die Brandschutzordnung Teil A aus?",
        "massnahme": "Bringen Sie im Sozialbereich alle gesetzlich vorgeschriebenen Aushänge (z. B. ArbSchG, JArbSchG, DGUV Vorschrift 1) gut sichtbar und aktuell an (§ 12 ArbSchG)."
      },
      {
        "frage": "Sind die Kaffeemaschine und andere hitzeentwickelnde Geräte auf einer nicht brennbaren Unterlage abgestellt?",
        "massnahme": "Kaffeemaschine und andere hitzeentwickelnde Geräte umgehend auf eine nicht brennbare Unterlage stellen."
      },
      {
        "frage": "Dient der Pausenraum primär der Erholung der Beschäftigten und ist er frei von größeren Mengen an betrieblichem Lagergut (z. B. Archivboxen)?",
        "massnahme": "Nach der Arbeitsstättenverordnung (ArbStättV) und der technischen Regel ASR A4.2 dient der Pausenraum ausschließlich der Erholung der Beschäftigten. Prüfung alternativer Lagerkapazitäten, um die Aufenthaltsqualität im Pausenraum zu erhöhen und die Brandlast (durch Papier) in den Sozialräumen zu reduzieren."
      },
      {
        "frage": "Werden ortsveränderliche elektrische Betriebsmittel (z. B. Leitungen, Steckverbindungen, Leuchten, Geräte) in angemessenen Zeitabständen geprüft?",
        "massnahme": "Prüfung ortsveränderlicher elektrischer Betriebsmittel gemäß DGUV Vorschrift 3 in angemessenen Zeitabständen veranlassen und dokumentieren."
      }
    ]
  },
  {
    "nummer": "11.0",
    "name": "Marktleiterbüro",
    "fragen": [
      {
        "frage": "Liegt eine aktuelle Liste sowie Prüfberichte prüfungsbedürftiger Einrichtungen vor?",
        "massnahme": "Führen Sie eine vollständige Liste aller prüfpflichtigen Betriebseinrichtungen inklusive Nachweise und Prüfberichte gemäß BetrSichV § 14."
      },
      {
        "frage": "Ist der Fußboden im Büro des Marktleiters frei von Schäden, Verschmutzungen und Stolperstellen?",
        "massnahme": "Stellen Sie sicher, dass sich der Fußboden im Büro des Marktleiters in einem ordnungsgemäßen Zustand befindet, frei von Beschädigungen, Stolperstellen und Verschmutzungen ist, um die Sicherheit gemäß ArbStättV und ASR A1.5 zu gewährleisten."
      },
      {
        "frage": "Sind Maßnahmen getroffen, die den Anreiz zu Raubüberfällen vermindern (z. B. Türspion, feststehender Knauf)?",
        "massnahme": "Ergreifen Sie organisatorische und bauliche Maßnahmen zur Prävention von Raubüberfällen, etwa durch Türspione, Sicherheitsknäufe oder videoüberwachte Eingänge (§ 3 ArbSchG, DGUV Information 215-542)."
      },
      {
        "frage": "Ist die Tür während des Umgangs mit Zahlungsmitteln verschlossen?",
        "massnahme": "Sorgen Sie dafür, dass der Zugang zum Kassenbüro während des Umgangs mit Bargeld stets verschlossen ist, um Überfällen vorzubeugen (§ 3 ArbSchG)."
      },
      {
        "frage": "Werden neue Mitarbeiter vor Aufnahme der Tätigkeit zum Thema Arbeitssicherheit und Brandschutz unterwiesen?",
        "massnahme": "Führen Sie unverzüglich eine dokumentierte Unterweisung durch."
      },
      {
        "frage": "Ist während der gesamten Öffnungszeit die erforderliche Anzahl an ausgebildeten Ersthelfern gemäß DGUV Vorschrift 1 anwesend?",
        "massnahme": "Sicherstellen dass während der gesamten Öffnungszeit die erforderliche Anzahl an ausgebildeten Ersthelfern anwesend ist Dienst- und Schichtplanung entsprechend anpassen sowie regelmäßige Prüfung der Ersthelferqualifikationen und Gültigkeiten durchführen."
      },
      {
        "frage": "Ist während der gesamten Ladenöffnungszeit mindestens ein Mitarbeiter mit der Qualifikation als Brandschutzhelfer anwesend?",
        "massnahme": "Sorgen Sie gemäß ASR A2.2 und § 10 ArbSchG dafür, dass jederzeit ein geschulter Brandschutzhelfer vor Ort ist."
      },
      {
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
        "frage": "Wurde die Unterweisung von Praktikanten und Schüleraushilfen durchgeführt?",
        "massnahme": "Führen Sie eine Unterweisung für Praktikanten und Schüleraushilfen vor Beginn der Beschäftigung gemäß § 12 ArbSchG durch und dokumentieren Sie diese schriftlich."
      },
      {
        "frage": "Wurde die Unterweisung schriftlich dokumentiert?",
        "massnahme": "Dokumentieren Sie alle durchgeführten Unterweisungen rechtskonform und archivieren Sie die Nachweise gemä § 6 ArbSchG."
      },
      {
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
        "frage": "Wird den Beschäftigten arbeitsmedizinische Vorsorge angeboten?",
        "massnahme": "Bieten Sie allen Beschäftigten arbeitsmedizinische Vorsorge nach der Verordnung zur arbeitsmedizinischen Vorsorge (ArbMedVV) an und dokumentieren Sie das Angebot."
      },
      {
        "frage": "Erfolgte im laufenden Berichtszeitraum eine arbeitsmedizinische Betreuung (z. B. Begehung oder Sprechstunde) bzw. ist diese für das aktuelle Kalenderjahr fest eingeplant?",
        "massnahme": "Abstimmung mit dem Betriebsarzt zur Terminierung der Begehung/Sprechstunde für das Folgejahr (2027) sowie Prüfung, ob zwischenzeitlich ein akuter Betreuungsbedarf (z. B. bei neuen Gefährdungen) entstanden ist."
      },
      {
        "frage": "Erfolgten arbeitsmedizinische Beratungen für Beschäftigte oder Führungskräfte?",
        "massnahme": "Ermöglichen Sie Beratungen durch den Betriebsarzt für Beschäftigte und Führungskräfte, insbesondere zu gesundheitlichen Fragestellungen und Präventionsmaßnahmen."
      },
      {
        "frage": "Sind Maßnahmen gegen Hauterkrankungen getroffen?",
        "massnahme": "Ergreifen Sie geeignete Schutzmaßnahmen (z. B. Hautschutzmittel, Handschuhe, Schulungen) zur Prävention von Hauterkrankungen gemäß § 3 ArbSchG und TRGS 401."
      },
      {
        "frage": "Werden Berichte und Empfehlungen des Betriebsarztes dokumentiert und umgesetzt?",
        "massnahme": "Dokumentieren Sie die Empfehlungen des Betriebsarztes und setzen Sie diese nachweislich um, um die Wirksamkeit der arbeitsmedizinischen Betreuung sicherzustellen."
      },
      {
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
        "frage": "Werden Gefahrstoffe unter strikter Beachtung der Zusammenlagerungsverbote nach TRGS 510 (Abschnitt 7 und Anlage 2) so gelagert, dass gefährliche Wechselwirkungen zwischen verschiedenen Stoffgruppen ausgeschlossen sind?",
        "massnahme": "Gefahrstoffe nach TRGS 510 neu trennen und entsprechend den Zusammenlagerungsregeln getrennt lagern (räumlich oder durch geeignete Sicherheitseinrichtungen)."
      },
      {
        "frage": "Wird die passende persönliche Schutzausrüstung (z. B. Schutzbrille, Handschuhe) für Tätigkeiten mit Gefahrstoffen zur Verfügung gestellt",
        "massnahme": "Stellen Sie geeignete persönliche Schutzausrüstung (PSA) für Tätigkeiten mit Gefahrstoffen bereit und weisen Sie die Beschäftigten gemäß § 3 ArbSchG und § 2 PSA-Benutzungsverordnung ein."
      },
      {
        "frage": "Ist die in den Betriebsanweisungen geforderte Persönliche Schutzausrüstung in unmittelbarer Nähe und einsatzbereit vorhanden?",
        "massnahme": "Persönliche Schutzausrüstung gemäß Betriebsanweisung vollständig bereitstellen und in unmittelbarer Nähe zugänglich sowie einsatzbereit lagern; regelmäßige Kontrolle sicherstellen."
      },
      {
        "frage": "Sind Sicherheitsdatenblätter verfügbar?",
        "massnahme": "Stellen Sie sicher, dass Sicherheitsdatenblätter verfügbar sind."
      }
    ]
  },
  {
    "nummer": "15.0",
    "name": "Barrierefreies WC",
    "fragen": [
      {
        "frage": "Hängt die Notrufschnur (Zugschnur) bis maximal 10 cm über dem Fußboden herab, um nach einem Sturz erreichbar zu sein?",
        "massnahme": "Stellen Sie sicher, dass die Notrufschnur gemäß DIN VDE 0834 bis maximal 10 cm über dem Fußboden herabreicht, damit sie auch nach einem Sturz erreichbar ist."
      },
      {
        "frage": "Wird der Alarm an eine ständig besetzte Stelle (z. B. Empfang, Leitwarte) weitergeleitet?",
        "massnahme": "Sorgen Sie dafür, dass jeder Notruf an eine ständig besetzte Stelle (z. B. Empfang oder Leitwarte) weitergeleitet wird."
      },
      {
        "frage": "Werden die Zugschnüre und Signalgeber in regelmäßigen Intervallen (z. B. monatlich) auf Funktion geprüft?",
        "massnahme": "Prüfen Sie die Zugschnüre und Signalgeber gemäß DIN VDE 0834 regelmäßig, mindestens jedoch monatlich, auf ihre einwandfreie Funktion und dokumentieren Sie die Ergebnisse nachvollziehbar."
      },
      {
        "frage": "Sind die Beschäftigten über das Verhalten bei einem Alarm unterwiesen?",
        "massnahme": "Führen Sie unverzüglich eine dokumentierte Unterweisung durch."
      },
      {
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
        "frage": "Wird die Dokumentation von Erste-Hilfe-Leistungen ordnungsgemäß geführt und aufbewahrt?",
        "massnahme": "Stellen Sie sicher, dass alle Erste-Hilfe-Leistungen gemäß DGUV Vorschrift 1 lückenlos dokumentiert und die Aufzeichnungen mindestens 5 Jahre aufbewahrt werden."
      },
      {
        "frage": "Erfolgte die letzte Unterweisung zum Umgang mit Zahlungsmitteln innerhalb der letzten 6 Monate?",
        "massnahme": "Führen Sie regelmäßig, mindestens jedoch halbjährlich, Unterweisungen zum sicheren Umgang mit Zahlungsmitteln durch und dokumentieren Sie diese nachvollziehbar."
      },
      {
        "frage": "Wurden bei der Unterweisung aktuelle Änderungen in den betrieblichen Abläufen oder neue Sicherheitstechniken berücksichtigt?",
        "massnahme": "Berücksichtigen Sie bei Unterweisungen stets aktuelle betriebliche Änderungen sowie neue Sicherheitstechniken und passen Sie die Inhalte entsprechend an."
      },
      {
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
        "frage": "Werden Wünsche der Beschäftigten bei der Arbeitsplanung berücksichtigt?",
        "massnahme": "Beziehen Sie individuelle Wünsche der Beschäftigten bei der Arbeitszeitgestaltung ein, soweit dies mit den betrieblichen Erfordernissen vereinbar ist (§ 3 ArbSchG, § 106 GewO)."
      },
      {
        "frage": "Ist die Pausenregelung umgesetzt?",
        "massnahme": "Stellen Sie sicher, dass die gesetzlichen Pausenregelungen gemäß § 4 ArbZG eingehalten und in der Arbeitszeitplanung berücksichtigt werden."
      },
      {
        "frage": "Dient der Pausenraum primär der Erholung der Beschäftigten?",
        "massnahme": "Nach der Arbeitsstättenverordnung (ArbStättV) und der technischen Regel ASR A4.2 dient der Pausenraum ausschließlich der Erholung der Beschäftigten. Prüfung alternativer Lagerkapazitäten, um die Aufenthaltsqualität im Pausenraum zu erhöhen und die Brandlast (durch Papier) in den Sozialräumen zu reduzieren."
      },
      {
        "frage": "Werden Überstunden gering gehalten?",
        "massnahme": "Begrenzen Sie Überstunden auf das notwendige Maß und achten Sie auf die Einhaltung der täglichen und wöchentlichen Höchstarbeitszeiten (§ 3 ArbZG)."
      },
      {
        "frage": "Werden regelmäßige Teambesprechungen durchgeführt?",
        "massnahme": "Führen Sie regelmäßige Besprechungen im Team durch, um die Kommunikation und Beteiligung der Beschäftigten gemäß § 81 BetrVG und § 4 ArbSchG zu fördern."
      },
      {
        "frage": "Werden neue Mitarbeiter eingearbeitet?",
        "massnahme": "Stellen Sie sicher, dass neue Beschäftigte systematisch eingearbeitet werden und die für ihre Tätigkeit erforderlichen Kenntnisse vermittelt bekommen (§ 3 ArbSchG)."
      },
      {
        "frage": "Ist eine Unterweisung zum Thema Brand- und Arbeitsschutz erfolgt?",
        "massnahme": "Führen Sie regelmäßige Unterweisungen zu Arbeitsschutz und Brandschutz gemäß § 12 ArbSchG und DGUV Information 205-023 durch."
      },
      {
        "frage": "Hängt ein sogenanntes schwarzes Brett im Sozialraum oder Kassenbüro?",
        "massnahme": "Halten Sie ein aktuelles schwarzes Brett im Sozialraum oder Bürobereich zur Information der Beschäftigten bereit (§ 81 BetrVG, § 12 ArbSchG)."
      },
      {
        "frage": "Werden Entscheidungen transparent erläutert?",
        "massnahme": "Kommunizieren Sie betriebliche Entscheidungen transparent und nachvollziehbar, um das Vertrauen der Beschäftigten zu stärken (§ 4 ArbSchG, § 81 BetrVG)."
      },
      {
        "frage": "Gibt es positive Rückmeldungen bei guter Leistung?",
        "massnahme": "Geben Sie regelmäßig wertschätzendes Feedback bei guter Leistung, um Motivation und Arbeitszufriedenheit zu fördern (§ 4 ArbSchG, § 75 BetrVG)."
      },
      {
        "frage": "Wird konstruktive Kritik geübt?",
        "massnahme": "Führen Sie Kritikgespräche sachlich und lösungsorientiert, unter Wahrung der Würde der betroffenen Person (§ 75 BetrVG, § 4 ArbSchG)."
      },
      {
        "frage": "Wurden Weiterbildungsmöglichkeiten geschaffen bzw. angeboten?",
        "massnahme": "Schaffen Sie innerbetriebliche oder externe Weiterbildungsangebote und fördern Sie Qualifizierungen gemäß § 82 BetrVG sowie § 3 ArbSchG."
      },
      {
        "frage": "Gibt es einen Aushang zur Information über die Suchtprävention?",
        "massnahme": "Stellen Sie einen gut sichtbaren Aushang mit Informationen zur Suchtprävention bereit und verweisen Sie auf innerbetriebliche Hilfsangebote (§ 3 ArbSchG, BEM-Leitlinien)."
      },
      {
        "frage": "Ist ein betriebliches Wiedereingliederungsmanagement implementiert?",
        "massnahme": "Implementieren Sie ein betriebliches Wiedereingliederungsmanagement (BEM) nach § 167 Abs. 2 SGB IX für länger erkrankte Beschäftigte."
      },
      {
        "frage": "Wird Alleinarbeit vermieden?",
        "massnahme": "Vermeiden Sie gefährdende Alleinarbeit oder ergreifen Sie geeignete Schutzmaßnahmen, wie Notrufsysteme oder Kontrollgänge (§ 3 ArbSchG, DGUV Regel 115-003)."
      },
      {
        "frage": "Ist die Betreuung nach einem Überfall organisiert?",
        "massnahme": "Stellen Sie sicher, dass betroffene Mitarbeitende nach einem Überfall psychologische Betreuung und Nachsorge erhalten (§ 3 ArbSchG, § 84 SGB IX)."
      },
      {
        "frage": "Werden Schulungen für den Umgang mit gewalttätigen Situationen ermöglicht?",
        "massnahme": "Ermöglichen Sie Mitarbeitenden Schulungen zum Deeskalations- und Konfliktmanagement bei Gewaltvorfällen gemäß § 12 ArbSchG und DGUV Information 206-023."
      },
      {
        "frage": "Beziehen Sie Mitarbeiteranregungen in die Entscheidungsprozesse mit ein?",
        "massnahme": "Stellen Sie sicher, dass Anregungen der Mitarbeitenden systematisch in Entscheidungsprozesse einbezogen und bei Maßnahmen des Arbeits- und Gesundheitsschutzes angemessen berücksichtigt werden (§ 3 ArbSchG, § 87 BetrVG)."
      }
    ]
  }
];
