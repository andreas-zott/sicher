// ===== Vordefinierte Maßnahmen-Texte je Prüfpunkt, in drei Sprachstilen =====
// einfach    = Alltagssprache ohne Paragraphen, fuer Mitarbeitende ohne Fachhintergrund
// bghw       = Terminologie/Rahmen angelehnt an BGHW- und DGUV-Regel-Veroeffentlichungen des Handels
// rechtlich  = mit expliziten Paragraphen/Normen (ArbSchG, ArbStaettV, ASR, DGUV Vorschrift etc.)

const MEASURES_TEXT = {

    "Gesamtmarkt": {
        "1.1": {
            einfach: 'Achten Sie darauf, dass alle Mitarbeitenden festes, vorne geschlossenes und rutschfestes Schuhwerk tragen.',
            bghw: 'Setzen Sie die BGHW-Empfehlungen zum sicheren Schuhwerk um: festes, im Zehenbereich geschlossenes und rutschhemmendes Schuhwerk gemäß betrieblicher Gefährdungsbeurteilung.',
            rechtlich: 'Gemäß Gefährdungsbeurteilung und DGUV Vorschrift 1 ist sicherzustellen, dass alle Beschäftigten geeignetes, festes, geschlossenes und rutschhemmendes Schuhwerk tragen. Die Einhaltung ist regelmäßig zu kontrollieren.'
        },
        "1.2": {
            einfach: 'Weisen Sie Ihre Mitarbeitenden regelmäßig ein, wie sie Hubwagen & Co. sicher benutzen: Schutzausrüstung tragen, Lasten nicht überladen, niemanden mitfahren lassen.',
            bghw: 'Führen Sie regelmäßige Unterweisungen zum sicheren Umgang mit Flurförderfahrzeugen gemäß den BGHW-Vorgaben durch, inkl. PSA-Pflicht, zulässiger Traglasten und Verbot der Personenmitnahme.',
            rechtlich: 'Beschäftigte sind regelmäßig anhand der Betriebsanweisung zum sicheren Umgang mit Flurförderfahrzeugen zu unterweisen. PSA-Pflicht, Traglastbegrenzungen und das Verbot der Personenmitnahme sind konsequent einzuhalten.'
        },
        "1.3": {
            einfach: 'Lassen Sie die Automatiktüren umgehend prüfen. Schränken Sie den Betrieb bis dahin bei Bedarf ein und beheben Sie festgestellte Mängel zügig.',
            bghw: 'Veranlassen Sie die Prüfung der Automatiktüren gemäß den BGHW-Vorgaben und ASR A1.7 umgehend über einen Sachkundigen, schränken Sie den Betrieb bis dahin bei Bedarf ein und dokumentieren Sie die Mängelbeseitigung.',
            rechtlich: 'Fachgerechte Prüfung der betroffenen Automatiktüren nach ASR A1.7 umgehend veranlassen. Betrieb bis zur Prüfung ggf. einschränken. Festgestellte Mängel zügig beheben und Dokumentation aktualisieren.'
        },
        "1.4": {
            einfach: 'Lassen Sie den Aufzug regelmäßig von einem Fachbetrieb prüfen und halten Sie ihn in einwandfreiem Zustand.',
            bghw: 'Beauftragen Sie eine zugelassene Überwachungsstelle mit der wiederkehrenden Prüfung der Aufzugsanlage entsprechend den BGHW-Hinweisen zu technischen Arbeitsmitteln.',
            rechtlich: 'Aufzugsanlagen sind gemäß BetrSichV wiederkehrend durch zugelassene Überwachungsstellen zu prüfen und in sicherem Zustand zu halten.'
        },
        "1.6": {
            einfach: 'Stellen Sie genug sichere Trittstufen oder Rolltritte bereit und sorgen Sie dafür, dass sie auch genutzt werden.',
            bghw: 'Stellen Sie geprüfte Aufstiegshilfen in ausreichender Anzahl gemäß den BGHW-Empfehlungen bereit und stellen Sie deren bestimmungsgemäße Nutzung sicher.',
            rechtlich: 'Geeignete und geprüfte Aufstiegshilfen sind bereitzustellen. Die Nutzung hat gemäß DGUV Information 208-016 zu erfolgen.'
        },
        "1.7": {
            einfach: 'Lassen Sie Leitern und Tritte regelmäßig prüfen und sortieren Sie beschädigte sofort aus.',
            bghw: 'Prüfen Sie Leitern und Tritte gemäß DGUV Information 208-016 in den von der BGHW empfohlenen Intervallen durch eine befähigte Person.',
            rechtlich: 'Leitern und Tritte sind regelmäßig durch befähigte Personen zu prüfen. Beschädigte Leitern sind sofort auszusondern.'
        },
        "1.8": {
            einfach: 'Nutzen Sie nur die freigegebenen Sicherheitsmesser aus dem Ordersatz.',
            bghw: 'Stellen Sie sicher, dass ausschließlich die im BGHW-Ordersatz freigegebenen Sicherheitsmesser verwendet werden.',
            rechtlich: 'Es dürfen ausschließlich geeignete Sicherheitsmesser aus dem freigegebenen Ordersatz verwendet werden.'
        },
        "1.9": {
            einfach: 'Halten Sie Gänge und Wege frei von Stolperfallen, damit niemand ausrutscht oder stürzt.',
            bghw: 'Gestalten Sie die Verkehrswege gemäß den BGHW-Hinweisen zu innerbetrieblichem Verkehr frei von Stolper-, Rutsch- und Sturzgefahren.',
            rechtlich: 'Verkehrswege sind gemäß ASR A1.5 frei von Stolper-, Rutsch- und Sturzgefahren zu halten.'
        },
        "1.10": {
            einfach: 'Halten Sie Treppen frei von Gegenständen und beheben Sie Schäden zügig.',
            bghw: 'Kontrollieren Sie Treppen regelmäßig auf Schäden und halten Sie sie entsprechend den BGHW-Vorgaben frei von Gegenständen.',
            rechtlich: 'Treppen sind frei von Gegenständen zu halten und regelmäßig auf Schäden zu kontrollieren.'
        },
        "1.11": {
            einfach: 'Hängen Sie Betriebsanweisungen gut sichtbar auf und achten Sie darauf, dass sie auch befolgt werden.',
            bghw: 'Machen Sie Betriebsanweisungen gemäß den BGHW-Vorgaben jederzeit zugänglich und kontrollieren Sie die Einhaltung der Sicherheitsanweisungen.',
            rechtlich: 'Betriebsanweisungen sind aktuell, zugänglich und für Beschäftigte verständlich bereitzustellen.'
        },
        "1.12": {
            einfach: 'Sorgen Sie für ausreichend helles Licht in Verkauf und Lager, damit Gefahrenhinweise und Flüssigkeiten im Regal gut zu erkennen sind.',
            bghw: 'Stellen Sie die Beleuchtung in Verkaufs- und Lagerbereichen entsprechend den BGHW-Beleuchtungsempfehlungen (mind. 300 Lux) sicher, damit Gefahrenhinweise und Leckagen zuverlässig erkennbar sind.',
            rechtlich: 'Die Beleuchtung ist gemäß ASR A3.4 sicherzustellen (mind. 300 Lux im Verkaufsraum). Gefahrenstellen und Leckagen müssen jederzeit eindeutig erkennbar sein.'
        },
        "1.13": {
            einfach: 'Lassen Sie das Schnelllauftor umgehend vom Hersteller oder einem Fachmann prüfen und reparieren. Nutzen Sie den Torbereich bis dahin besonders vorsichtig.',
            bghw: 'Veranlassen Sie die Prüfung und ggf. Instandsetzung des Schnelllauftors gemäß den BGHW-Vorgaben unverzüglich über einen Sachkundigen bzw. den Hersteller; der Torbereich ist bis zur Mängelfreiheit mit besonderer Vorsicht zu nutzen.',
            rechtlich: 'Prüfung und ggf. erforderliche Instandsetzung des Schnelllauftors unverzüglich über einen Sachkundigen / den Hersteller veranlassen. Bis zur Mängelfreiheit ist der Torbereich mit besonderer Vorsicht zu nutzen.'
        },
        "1.14": {
            einfach: 'Lassen Sie das Rolltor zeitnah von einem Fachmann prüfen und warten und halten Sie den Zustand schriftlich fest.',
            bghw: 'Veranlassen Sie die Sachkundigenprüfung sowie die erforderliche Wartung des Rolltors gemäß den BGHW-Vorgaben kurzfristig und dokumentieren Sie den Zustand im Prüfbuch.',
            rechtlich: 'Sachkundigenprüfung sowie erforderliche Wartung des Rolltors kurzfristig veranlassen und den ordnungsgemäßen Zustand im Prüfbuch dokumentieren.'
        }
    },

    "Brandschutz": {
        "2.1": {
            einfach: 'Lassen Sie die Feuerlöscher regelmäßig prüfen und halten Sie die Fristen ein.',
            bghw: 'Lassen Sie die Feuerlöscheinrichtungen entsprechend dem BGHW-Regelwerk zu ASR A2.2 durch eine befähigte Person prüfen und die Prüffristen dokumentieren.',
            rechtlich: 'Feuerlöscher sind gemäß ASR A2.2 i. V. m. § 4 ArbStättV regelmäßig (in der Regel alle zwei Jahre) durch eine befähigte Person zu prüfen; die Prüfung ist zu dokumentieren.'
        },
        "2.2": {
            einfach: 'Stellen Sie nichts vor die Feuerlöscher und Wandhydranten.',
            bghw: 'Halten Sie Feuerlöscher und Wandhydranten gemäß dem BGHW-Regelwerk zu ASR A2.2 jederzeit frei zugänglich und deutlich gekennzeichnet.',
            rechtlich: 'Feuerlöscher und Wandhydranten sind gemäß ASR A2.2 jederzeit frei zugänglich zu halten und nach ASR A1.3 zu kennzeichnen.'
        },
        "2.3": {
            einfach: 'Kontrollieren Sie regelmäßig, ob die Plomben an den Wandhydranten unversehrt sind.',
            bghw: 'Kontrollieren Sie die Prüfsiegel der Wandhydranten im Rahmen der BGHW-Regelwerk-konformen Brandschutzbegehung regelmäßig auf Unversehrtheit.',
            rechtlich: 'Die Prüfsiegel der Wandhydranten sind im Rahmen der wiederkehrenden Prüfung nach ASR A2.2 auf Unversehrtheit zu kontrollieren.'
        },
        "2.4": {
            einfach: 'Stellen Sie nichts vor Brandschutztüren und blockieren Sie sie nicht.',
            bghw: 'Halten Sie Brandschutztüren gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk frei von Zustellungen, damit die Schließfunktion jederzeit gewährleistet ist.',
            rechtlich: 'Brandschutztüren dürfen gemäß § 4 ArbStättV i. V. m. DGUV Vorschrift 1 nicht verstellt, blockiert oder in ihrer Schließfunktion beeinträchtigt werden.'
        },
        "2.5": {
            einfach: 'Lassen Sie die Halterungen und den Schließmechanismus der Feuerschutztüren regelmäßig prüfen.',
            bghw: 'Prüfen Sie Türhaltevorrichtungen und Schließfolgeregler der Feuerschutzabschlüsse regelmäßig auf Funktion gemäß den Prüfvorgaben des BGHW-Regelwerks.',
            rechtlich: 'Türhaltevorrichtungen und Schließfolgeregler von Feuerschutzabschlüssen sind gemäß den Herstellervorgaben und § 4 BetrSichV regelmäßig auf Funktion zu prüfen.'
        },
        "2.6": {
            einfach: 'Beheben Sie Schäden an Brandschutztüren sofort.',
            bghw: 'Setzen Sie beschädigte Brandschutztüren gemäß dem BGHW-Regelwerk unverzüglich instand, um deren Schutzfunktion sicherzustellen.',
            rechtlich: 'Beschädigte Brandschutztüren sind gemäß § 4 ArbStättV unverzüglich instand zu setzen, da ihre Schutzfunktion sonst nicht mehr gewährleistet ist.'
        },
        "2.7": {
            einfach: 'Hängen Sie einen aktuellen Flucht- und Rettungsplan gut sichtbar auf.',
            bghw: 'Erstellen und veröffentlichen Sie einen aktuellen Flucht- und Rettungsplan gemäß ASR A2.3 und dem BGHW-Regelwerk zur Brandschutzorganisation.',
            rechtlich: 'Ein aktueller Flucht- und Rettungsplan ist gemäß ASR A2.3 zu erstellen und an geeigneten Stellen gut sichtbar auszuhängen.'
        },
        "2.8": {
            einfach: 'Prüfen Sie regelmäßig, ob die Notbeleuchtung noch funktioniert.',
            bghw: 'Prüfen Sie die Sicherheits- und Notbeleuchtung gemäß ASR A3.4 und dem BGHW-Regelwerk in regelmäßigen Intervallen (in der Regel jährlich) auf Funktion.',
            rechtlich: 'Die Sicherheits- und Notbeleuchtung ist gemäß ASR A3.4 i. V. m. DIN EN 1838 regelmäßig auf Funktionsfähigkeit zu prüfen.'
        },
        "2.9": {
            einfach: 'Halten Sie Fluchtwege und Notausgänge komplett frei – innen wie außen.',
            bghw: 'Halten Sie Flucht- und Rettungswege sowie Notausgänge gemäß ASR A2.3 und dem BGHW-Regelwerk in voller Breite und dauerhaft frei, auch im Außenbereich.',
            rechtlich: 'Flucht- und Rettungswege sowie Notausgänge sind gemäß ASR A2.3 in ihrer gesamten Breite ständig freizuhalten, auch im Außenbereich.'
        },
        "2.10": {
            einfach: 'Sorgen Sie dafür, dass sich Notausgänge jederzeit ohne Schlüssel oder Werkzeug leicht öffnen lassen.',
            bghw: 'Stellen Sie gemäß ASR A2.3 und dem BGHW-Regelwerk sicher, dass sich alle Notausgänge und -ausstiege jederzeit ohne Hilfsmittel von innen leicht öffnen lassen.',
            rechtlich: 'Notausgänge müssen gemäß ASR A2.3 jederzeit ohne fremde Hilfsmittel von innen leicht zu öffnen sein; die Funktionsfähigkeit der Beschläge ist sicherzustellen.'
        },
        "2.11": {
            einfach: 'Prüfen Sie, ob die Notausgänge tatsächlich ins Freie bzw. an einen sicheren Ort führen.',
            bghw: 'Überprüfen Sie im Rahmen der Brandschutzbegehung nach dem BGHW-Regelwerk, dass alle Notausgänge gemäß ASR A2.3 in tatsächlich sichere Bereiche führen.',
            rechtlich: 'Notausgänge müssen gemäß ASR A2.3 in einen gesicherten Bereich im Freien oder in einen anderen sicheren Bereich führen.'
        },
        "2.12": {
            einfach: 'Lassen Sie die Brandmeldeanlage regelmäßig warten und testen.',
            bghw: 'Lassen Sie die Brandmeldeanlage gemäß DIN 14675 und dem BGHW-Regelwerk regelmäßig durch eine Fachfirma warten und auf Funktion prüfen.',
            rechtlich: 'Die Brandmeldeanlage ist gemäß DIN 14675 und den Vorgaben der jeweiligen Landesbauordnung regelmäßig zu warten und auf Funktion zu prüfen.'
        },
        "2.13": {
            einfach: 'Verschließen Sie die Einfüllöffnung des Presscontainers nach Ladenschluss.',
            bghw: 'Sichern Sie die Einfüllöffnung des Presscontainers gemäß den BGHW-Vorgaben zur Brandschutzorganisation nach Betriebsschluss mechanisch gegen unbefugte Nutzung.',
            rechtlich: 'Die Einfüllöffnung des Presscontainers ist nach Betriebsschluss mechanisch zu sichern, um Brandstiftung durch eingeworfene Brandsätze vorzubeugen (§ 4 ArbSchG).'
        },
        "2.14": {
            einfach: 'Lagern Sie keine Kartons oder brennbaren Materialien in Technik- und Heizräumen.',
            bghw: 'Halten Sie Technik- und Heizräume gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk frei von brennbaren Materialien.',
            rechtlich: 'Technik- und Heizräume sind gemäß den brandschutzrechtlichen Vorgaben (§ 4 ArbSchG, DGUV Vorschrift 1) frei von brennbaren Materialien zu halten.'
        },
        "2.15": {
            einfach: 'Nutzen Sie Technik- und Heizräume nicht als Lagerfläche.',
            bghw: 'Nutzen Sie Technik- und Heizräume gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk ausschließlich zweckgebunden und nicht als Lagerfläche.',
            rechtlich: 'Technik- und Heizräume sind ausschließlich zweckgebunden zu nutzen; eine Zweckentfremdung als Lagerfläche ist zu unterbinden.'
        }
    },

    "Sozialräume": {
        "3.1": {
            einfach: 'Hängen Sie die vorgeschriebenen Gesetze und die Brandschutzordnung im Sozialraum aus.',
            bghw: 'Hängen Sie die aushangpflichtigen Gesetze, Unfallverhütungsvorschriften und die Brandschutzordnung Teil A gemäß § 3 ArbSchG, DGUV Vorschrift 1 und dem BGHW-Regelwerk im Sozialbereich aus.',
            rechtlich: 'Die aushangpflichtigen Gesetze, Unfallverhütungsvorschriften sowie die Brandschutzordnung Teil A sind im Sozialbereich gut sichtbar auszuhängen (§ 3 ArbSchG, DGUV Vorschrift 1).'
        },
        "3.2": {
            einfach: 'Stellen Sie Kaffeemaschine und andere heiße Geräte auf eine feuerfeste Unterlage.',
            bghw: 'Stellen Sie hitzeentwickelnde Geräte wie die Kaffeemaschine gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk auf eine nicht brennbare Unterlage.',
            rechtlich: 'Kaffeemaschine und andere hitzeentwickelnde Geräte sind gemäß § 4 ArbSchG auf einer nicht brennbaren Unterlage abzustellen, um Brandgefahren zu vermeiden.'
        },
        "3.3": {
            einfach: 'Lassen Sie Kabel, Steckdosen und Geräte regelmäßig auf Sicherheit prüfen.',
            bghw: 'Prüfen Sie ortsveränderliche elektrische Betriebsmittel gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk in angemessenen Intervallen.',
            rechtlich: 'Ortsveränderliche elektrische Betriebsmittel sind gemäß DGUV Vorschrift 3 in angemessenen Zeitabständen zu prüfen.'
        },
        "3.4": {
            einfach: 'Halten Sie den Pausenraum frei von Lagergut, damit er wirklich der Erholung dient.',
            bghw: 'Stellen Sie gemäß ASR A4.2 und dem BGHW-Regelwerk sicher, dass der Pausenraum primär der Erholung dient und nicht als Lagerfläche zweckentfremdet wird.',
            rechtlich: 'Der Pausenraum ist gemäß ASR A4.2 primär zu Erholungszwecken vorzuhalten und von betrieblichem Lagergut freizuhalten.'
        }
    },

    "Erste Hilfe": {
        "4.1": {
            einfach: 'Sorgen Sie dafür, dass Erste-Hilfe-Koffer gut sichtbar, leicht erreichbar und richtig gekennzeichnet sind.',
            bghw: 'Positionieren und kennzeichnen Sie Erste-Hilfe-Material gemäß DGUV Information 204-022 und dem BGHW-Regelwerk normgerecht und gut sichtbar.',
            rechtlich: 'Die Standorte der Erste-Hilfe-Koffer müssen den Anforderungen an Sichtbarkeit, Erreichbarkeit und Norm-Kennzeichnung gemäß DGUV Information 204-022 entsprechen.'
        },
        "4.2": {
            einfach: 'Kontrollieren Sie regelmäßig, ob das Verbandsmaterial vollständig und nicht abgelaufen ist.',
            bghw: 'Kontrollieren Sie das Erste-Hilfe-Material gemäß DGUV Information 204-022 und dem BGHW-Regelwerk regelmäßig auf Vollständigkeit und Verfallsdaten.',
            rechtlich: 'Das Erste-Hilfe-Material ist gemäß DGUV Information 204-022 an allen Standorten vollständig vorzuhalten; die Verfallsdaten steriler Inhalte sind zu überwachen.'
        },
        "4.3": {
            einfach: 'Dokumentieren Sie jede Erste-Hilfe-Leistung sorgfältig.',
            bghw: 'Führen Sie das Verbandbuch gemäß DGUV Information 204-020 und dem BGHW-Regelwerk ordnungsgemäß.',
            rechtlich: 'Die Dokumentation von Erste-Hilfe-Leistungen ist gemäß DGUV Information 204-020 ordnungsgemäß zu führen.'
        },
        "4.4": {
            einfach: 'Stellen Sie sicher, dass während der ganzen Öffnungszeit genug ausgebildete Ersthelfer da sind.',
            bghw: 'Stellen Sie die nach DGUV Vorschrift 1 und dem BGHW-Regelwerk erforderliche Anzahl ausgebildeter Ersthelfer während der gesamten Öffnungszeit sicher.',
            rechtlich: 'Während der gesamten Öffnungszeit ist die nach DGUV Vorschrift 1 erforderliche Anzahl ausgebildeter Ersthelfer anwesend zu halten.'
        },
        "4.5": {
            einfach: 'Hängen Sie die Notrufnummer gut sichtbar aus.',
            bghw: 'Hängen Sie die Notrufnummer gemäß § 10 ArbSchG und dem BGHW-Regelwerk gut sichtbar an zentraler Stelle aus.',
            rechtlich: 'Eine Notrufnummer ist gut sichtbar auszuhängen (§ 10 ArbSchG).'
        },
        "4.6": {
            einfach: 'Hängen Sie Anweisungen zur Ersten Hilfe gut sichtbar auf.',
            bghw: 'Hängen Sie Erste-Hilfe-Anweisungen gemäß DGUV Information 204-022 und dem BGHW-Regelwerk aus.',
            rechtlich: 'Erste-Hilfe-Anweisungen sind gemäß § 10 ArbSchG bereitzustellen und auszuhängen.'
        }
    },

    "Elektrische Sicherheit": {
        "5.1": {
            einfach: 'Beheben Sie beschädigte Schalter und Steckdosen sofort.',
            bghw: 'Kontrollieren Sie Schalter und Steckdosen gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk regelmäßig auf Beschädigungen und veranlassen Sie ggf. eine Instandsetzung durch eine Elektrofachkraft.',
            rechtlich: 'Schäden an Schaltern und Steckdosen sind unverzüglich durch eine Elektrofachkraft zu beseitigen (DGUV Vorschrift 3).'
        },
        "5.2": {
            einfach: 'Sichern Sie Kabel, die von der Decke hängen, so, dass niemand daran ziehen kann.',
            bghw: 'Sichern Sie von der Decke geführte Leitungen gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk mit geeigneten Zugentlastungen, damit keine Zugkräfte auf die Kontaktstellen wirken.',
            rechtlich: 'Von der Decke geführte Leitungen und Steckverbindungen sind durch geeignete mechanische Zugentlastungen so zu sichern, dass keine Zugkräfte auf die elektrischen Kontaktstellen wirken (DGUV Vorschrift 3).'
        },
        "5.3": {
            einfach: 'Prüfen Sie Steckdosen und Kabel regelmäßig auf Schäden.',
            bghw: 'Kontrollieren Sie Steckdosen und Kabel gemäß DGUV Vorschrift 3 in den vom BGHW-Regelwerk empfohlenen Intervallen (ortsveränderliche Betriebsmittel in der Regel jährlich).',
            rechtlich: 'Steckdosen und Kabel sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3).'
        },
        "5.4": {
            einfach: 'Lassen Sie Kabelverbindungen nicht offen auf dem Boden liegen, z. B. unter Kühltruhen.',
            bghw: 'Vermeiden Sie ungeschützt auf dem Boden liegende Steckverbindungen gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk, insbesondere unter Kühl- und Tiefkühltruhen.',
            rechtlich: 'Elektrische Steckverbindungen dürfen gemäß DGUV Vorschrift 3 nicht ungeschützt auf dem Boden liegen, insbesondere nicht in feuchtigkeitsgefährdeten Bereichen wie unter Kühl- oder Tiefkühltruhen.'
        },
        "5.5": {
            einfach: 'Vermeiden Sie provisorische Verkabelungen – lassen Sie alles fest installieren.',
            bghw: 'Vermeiden Sie provisorische elektrische Installationen gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk und lassen Sie dauerhafte Lösungen durch eine Elektrofachkraft einrichten.',
            rechtlich: 'Provisorische elektrische Installationen sind zu vermeiden und durch fachgerechte, dauerhafte Installationen zu ersetzen (DGUV Vorschrift 3).'
        }
    },

    "CO2 Kühleinrichtungen": {
        "6.1": {
            einfach: 'Weisen Sie alle, die sich in der Nähe von Kühlanlagen aufhalten, in die Gefahren ein.',
            bghw: 'Unterweisen Sie Beschäftigte im Bereich von CO2-Kühlanlagen gemäß § 12 ArbSchG, DGUV Regel 110-008 und dem BGHW-Regelwerk zu den spezifischen Gefahren.',
            rechtlich: 'Personen, die sich im Bereich von CO2-Kühlanlagen oder Kühlhäusern aufhalten, sind gemäß § 12 ArbSchG und DGUV Regel 110-008 zu unterweisen.'
        },
        "6.2": {
            einfach: 'Prüfen Sie, ob sich die Notentriegelung leicht öffnen lässt.',
            bghw: 'Prüfen Sie die Notentriegelung an CO2-Kühlanlagen gemäß DGUV Regel 110-008 und dem BGHW-Regelwerk regelmäßig auf Funktion.',
            rechtlich: 'Die Notentriegelung ist gemäß DGUV Regel 110-008 regelmäßig auf Vorhandensein und Funktionsfähigkeit zu prüfen.'
        },
        "6.3": {
            einfach: 'Stellen Sie keine Kisten oder Waren vor die Gas-Sensoren.',
            bghw: 'Halten Sie CO2-Sensoren gemäß DGUV Regel 110-008 und dem BGHW-Regelwerk frei von Verstellungen, damit die Warnfunktion jederzeit gewährleistet ist.',
            rechtlich: 'Sensoren dürfen gemäß DGUV Regel 110-008 nicht durch Material oder Gegenstände verstellt werden, um die Funktionsfähigkeit der Gaswarnanlage sicherzustellen.'
        },
        "6.4": {
            einfach: 'Prüfen Sie, ob die Beleuchtung im Kühlbereich einwandfrei funktioniert.',
            bghw: 'Kontrollieren Sie die Beleuchtung im Kühlbereich gemäß ASR A3.4 und dem BGHW-Regelwerk regelmäßig auf einwandfreie Funktion.',
            rechtlich: 'Die Beleuchtung im Kühlbereich ist regelmäßig auf Funktionsfähigkeit zu prüfen (ASR A3.4).'
        },
        "6.5": {
            einfach: 'Kontrollieren Sie Alarmleuchten, Kennzeichnungen und Türen der Kühlanlage regelmäßig.',
            bghw: 'Kontrollieren Sie alle Sicherheitsvorrichtungen (Alarmleuchten, Kennzeichnungen, Kühlhaustüren) gemäß DGUV Regel 110-008 und dem BGHW-Regelwerk auf Funktionsfähigkeit.',
            rechtlich: 'Sämtliche Sicherheitsvorrichtungen (Alarmleuchten, Kennzeichnungen, Kühlhaustüren) sind auf Funktionsfähigkeit zu prüfen (DGUV Regel 110-008).'
        }
    },

    "Kühlhaus": {
        "7.1": {
            einfach: 'Prüfen Sie, ob an allen Lampen im Kühlhaus die Schutzkappe montiert ist.',
            bghw: 'Stellen Sie gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk sicher, dass an sämtlichen Leuchten im Kühlhaus die Schutzkappe montiert ist.',
            rechtlich: 'An allen Leuchten im Kühlhaus ist die Schutzkappe (Überwurfkappe) montiert zu halten (DGUV Vorschrift 3).'
        },
        "7.2": {
            einfach: 'Prüfen Sie, ob sich die Notentriegelung im Kühlhaus leicht öffnen lässt.',
            bghw: 'Prüfen Sie die Notentriegelung im Kühlhaus gemäß DGUV Regel 110-008 und dem BGHW-Regelwerk regelmäßig auf Funktion.',
            rechtlich: 'Die Notentriegelung im Kühlhaus ist gemäß DGUV Regel 110-008 regelmäßig auf Vorhandensein und Funktionsfähigkeit zu prüfen.'
        },
        "7.3": {
            einfach: 'Kennzeichnen Sie die Innenseite der Kühlhaustüren mit dem Rettungswegschild.',
            bghw: 'Kennzeichnen Sie Kühlhaustüren von innen gemäß ISO 7010 und dem BGHW-Regelwerk mit dem Rettungswegschild.',
            rechtlich: 'Kühlhaustüren sind von innen mit dem Rettungswegschild gemäß ISO 7010 zu kennzeichnen.'
        },
        "7.4": {
            einfach: 'Prüfen Sie, ob die Beleuchtung im Kühlhaus einwandfrei funktioniert.',
            bghw: 'Kontrollieren Sie die Beleuchtung im Kühlhaus gemäß ASR A3.4 und dem BGHW-Regelwerk regelmäßig auf einwandfreie Funktion.',
            rechtlich: 'Die Beleuchtung im Kühlhaus ist regelmäßig auf Funktionsfähigkeit zu prüfen (ASR A3.4).'
        },
        "7.5": {
            einfach: 'Prüfen Sie, ob die Notruf-Funktion im Kühlhaus (falls vorhanden) funktioniert und unbeschädigt ist.',
            bghw: 'Prüfen Sie eine vorhandene Notruf-Funktion im Kühlhaus gemäß DGUV Regel 110-008 und dem BGHW-Regelwerk regelmäßig auf Funktionsfähigkeit.',
            rechtlich: 'Die Notruf-Funktion im Kühlhaus ist, sofern vorhanden, gemäß DGUV Regel 110-008 regelmäßig auf Funktionsfähigkeit und Unversehrtheit zu prüfen.'
        }
    },

    "Lager und Regale": {
        "8.1": {
            einfach: 'Lassen Sie den elektrischen Hubwagen regelmäßig prüfen und beheben Sie Schäden sofort.',
            bghw: 'Lassen Sie den elektrischen Hubwagen gemäß DGUV Vorschrift 68 und dem BGHW-Regelwerk regelmäßig prüfen.',
            rechtlich: 'Der elektrische Hubwagen ist gemäß DGUV Vorschrift 68 wiederkehrend zu prüfen; Schutzeinrichtungen müssen funktionsfähig sein.'
        },
        "8.2": {
            einfach: 'Kontrollieren Sie den Gabelhubwagen regelmäßig auf Schäden.',
            bghw: 'Kontrollieren Sie den Gabelhubwagen gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk regelmäßig auf Beschädigungen.',
            rechtlich: 'Der Gabelhubwagen ist gemäß § 3 DGUV Vorschrift 1 regelmäßig auf seinen ordnungsgemäßen Zustand zu prüfen.'
        },
        "8.3": {
            einfach: 'Lassen Sie die Schwerlastregale regelmäßig von einem Fachmann prüfen.',
            bghw: 'Lassen Sie Schwerlastregale gemäß DGUV Regel 108-007 und dem BGHW-Regelwerk regelmäßig durch eine befähigte Person prüfen.',
            rechtlich: 'Schwerlastregale sind gemäß DGUV Regel 108-007 regelmäßig durch eine befähigte Person zu prüfen.'
        },
        "8.4": {
            einfach: 'Bringen Sie an den Regalen einen Anfahrschutz an.',
            bghw: 'Rüsten Sie Regale gemäß DGUV Regel 108-007 und dem BGHW-Regelwerk mit einem geeigneten Anfahrschutz aus.',
            rechtlich: 'Regale sind mit einem geeigneten Anfahrschutz gemäß DGUV Regel 108-007 auszurüsten.'
        },
        "8.5": {
            einfach: 'Bringen Sie an den Schwerlastregalen ein Schild mit der maximalen Traglast an.',
            bghw: 'Kennzeichnen Sie Schwerlastregale gemäß DGUV Regel 108-007 und dem BGHW-Regelwerk deutlich mit der zulässigen Traglast.',
            rechtlich: 'Die zulässige Traglast ist an Schwerlastregalen gemäß DGUV Regel 108-007 dauerhaft und gut sichtbar anzubringen.'
        },
        "8.6": {
            einfach: 'Bringen Sie an der Rampe eine Absturzsicherung an.',
            bghw: 'Rüsten Sie die Rampe gemäß ASR A2.1 und dem BGHW-Regelwerk mit einer Absturzsicherung aus.',
            rechtlich: 'An der Rampe ist eine Absturzsicherung gemäß ASR A2.1 anzubringen.'
        },
        "8.7": {
            einfach: 'Kontrollieren Sie, ob die Absturzsicherung unbeschädigt und richtig gekennzeichnet ist.',
            bghw: 'Kontrollieren Sie die Absturzsicherung gemäß ASR A2.1 und dem BGHW-Regelwerk regelmäßig auf Beschädigungen und Kennzeichnung.',
            rechtlich: 'Die Absturzsicherung ist regelmäßig auf ihren ordnungsgemäßen Zustand und ihre Kennzeichnung zu prüfen (ASR A2.1).'
        },
        "8.8": {
            einfach: 'Lassen Sie die Müll-/Papierpresse regelmäßig prüfen.',
            bghw: 'Lassen Sie die Müll-/Papierpresse gemäß § 14 BetrSichV und dem BGHW-Regelwerk regelmäßig prüfen.',
            rechtlich: 'Die Müll-/Papierpresse ist gemäß § 14 BetrSichV wiederkehrend durch eine befähigte Person zu prüfen.'
        },
        "8.9": {
            einfach: 'Kontrollieren Sie die Presse auf Schäden, funktionierende Schutzeinrichtungen und festen Stand.',
            bghw: 'Kontrollieren Sie die Müll-/Papierpresse gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk auf Beschädigungen, intakte Schutzeinrichtungen und festen Stand.',
            rechtlich: 'Die Müll-/Papierpresse muss frei von Beschädigungen sein, über intakte Schutzeinrichtungen verfügen und sicher/standfest aufgestellt sein.'
        },
        "8.10": {
            einfach: 'Halten Sie die Wege im Lager frei von Stolperfallen.',
            bghw: 'Gestalten Sie die Verkehrswege im Lager gemäß ASR A1.5 und dem BGHW-Regelwerk frei von Stolper-, Rutsch- und Sturzgefahren.',
            rechtlich: 'Verkehrswege im Lager sind gemäß ASR A1.5 frei von Stolper-, Rutsch- und Sturzgefahren zu halten.'
        }
    },

    "Leergut": {
        "9.1": {
            einfach: 'Kontrollieren Sie die Annahmegeräte der Leergutrücknahme regelmäßig und beheben oder ersetzen Sie beschädigte Geräte sofort – achten Sie besonders auf Glasscherben und intakte Schutzvorrichtungen.',
            bghw: 'Kontrollieren und warten Sie die Annahmegeräte der Leergutrücknahme gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk regelmäßig; setzen Sie beschädigte oder defekte Geräte unverzüglich instand oder außer Betrieb und beseitigen Sie Glasbruch umgehend.',
            rechtlich: 'Die Annahmegeräte der Leergutrücknahme sind regelmäßig auf Beschädigungen, Glasscherben und funktionierende Schutzeinrichtungen zu kontrollieren; defekte Geräte sind unverzüglich instand zu setzen oder außer Betrieb zu nehmen.'
        },
        "9.2": {
            einfach: 'Weisen Sie Ihre Mitarbeitenden an, die Rollbahnen nicht zu betreten.',
            bghw: 'Weisen Sie Beschäftigte gemäß § 12 ArbSchG und dem BGHW-Regelwerk an, Rollbahnen nicht zu betreten, und kontrollieren Sie die Einhaltung.',
            rechtlich: 'Rollbahnen dürfen nicht betreten werden; die Einhaltung ist im Rahmen der Unterweisung sicherzustellen (§ 12 ArbSchG).'
        },
        "9.3": {
            einfach: 'Sortieren Sie beschädigte Paletten und Kisten konsequent aus.',
            bghw: 'Sortieren Sie beschädigte Paletten und Kisten gemäß DGUV Vorschrift 1 und dem BGHW-Regelwerk konsequent aus, bevor sie erneut verwendet werden.',
            rechtlich: 'Beschädigte Paletten und Kisten sind konsequent auszusortieren und der weiteren Nutzung zu entziehen.'
        },
        "9.4": {
            einfach: 'Zeigen Sie den Mitarbeitenden, wie sie Lasten sicher heben und tragen.',
            bghw: 'Unterweisen Sie Beschäftigte gemäß DGUV Information 208-033 und dem BGHW-Regelwerk zum sicheren Aufnehmen und Transportieren von Lasten.',
            rechtlich: 'Lasten sind gemäß Lastenhandhabungsverordnung (LasthandhabV) sicher aufzunehmen und zu transportieren.'
        },
        "9.5": {
            einfach: 'Stellen Sie die nötige Schutzausrüstung bereit und sorgen Sie dafür, dass sie getragen wird.',
            bghw: 'Stellen Sie die im Leergutbereich erforderliche PSA gemäß PSA-Benutzungsverordnung und dem BGHW-Regelwerk bereit und kontrollieren Sie deren Tragen.',
            rechtlich: 'Die erforderliche persönliche Schutzausrüstung ist gemäß PSA-Benutzungsverordnung zur Verfügung zu stellen und zu tragen.'
        },
        "9.6": {
            einfach: 'Entsorgen Sie Glasbruch und Abfälle im Leergutbereich sofort und ordnungsgemäß.',
            bghw: 'Entsorgen Sie Abfälle und Bruchmaterial gemäß § 4 ArbSchG und dem BGHW-Regelwerk unverzüglich und ordnungsgemäß.',
            rechtlich: 'Abfälle und Bruchmaterial sind unverzüglich und ordnungsgemäß zu entsorgen.'
        },
        "9.7": {
            einfach: 'Stapeln Sie Leergut nicht höher, als es sicher ist.',
            bghw: 'Halten Sie die im Rahmen der Gefährdungsbeurteilung (§ 5 ArbSchG) und des BGHW-Regelwerks ermittelten maximalen Stapelhöhen im Leergutbereich ein.',
            rechtlich: 'Die zulässigen Stapelhöhen sind gemäß der Gefährdungsbeurteilung nach § 5 ArbSchG einzuhalten.'
        },
        "9.8": {
            einfach: 'Halten Sie die Lagerfläche sauber und rutschfrei.',
            bghw: 'Halten Sie die Lagerfläche gemäß ASR A1.5 und dem BGHW-Regelwerk sauber und rutschfrei.',
            rechtlich: 'Die Lagerfläche ist sauber und rutschfrei zu halten (ASR A1.5).'
        },
        "9.9": {
            einfach: 'Sorgen Sie dafür, dass zwischen Rollbahn und Wand mindestens 60 cm Platz zum Durchgehen bleibt (an engen Stellen kurz auch 50 cm).',
            bghw: 'Halten Sie die lichte Breite des Wartungsganges zwischen Rollbahn und Wand gemäß ASR A1.8 und dem BGHW-Regelwerk durchgehend bei mindestens 0,60 m (Engstellen kurzzeitig 0,50 m).',
            rechtlich: 'Die lichte Breite des Wartungsganges zwischen Rollbahn und Wand muss gemäß ASR A1.8 durchgehend mindestens 0,60 m betragen (an Engstellen kurzzeitig 0,50 m zulässig).'
        }
    },

    "Praktikanten": {
        "10.1": {
            einfach: 'Weisen Sie neue Praktikanten und Schüleraushilfen vor dem ersten Arbeitstag in die Sicherheitsregeln ein.',
            bghw: 'Führen Sie die Unterweisung von Praktikanten und Schüleraushilfen gemäß § 12 ArbSchG, § 29 JArbSchG (bei Minderjährigen) und dem BGHW-Regelwerk durch.',
            rechtlich: 'Praktikanten und Schüleraushilfen sind vor Aufnahme der Tätigkeit gemäß § 12 ArbSchG zu unterweisen; bei minderjährigen Beschäftigten ist zusätzlich die halbjährliche Unterweisungspflicht nach § 29 JArbSchG zu beachten.'
        },
        "10.2": {
            einfach: 'Halten Sie schriftlich fest, wer wann unterwiesen wurde.',
            bghw: 'Dokumentieren Sie alle durchgeführten Unterweisungen gemäß § 6 ArbSchG und dem BGHW-Regelwerk rechtssicher und archivieren Sie die Nachweise.',
            rechtlich: 'Dokumentieren Sie alle durchgeführten Unterweisungen rechtskonform und archivieren Sie die Nachweise gemäß § 6 ArbSchG.'
        },
        "10.3": {
            einfach: 'Fragen Sie nach der Unterweisung nach, ob wirklich alles verstanden wurde.',
            bghw: 'Prüfen Sie das Verständnis der Unterweisungsinhalte gemäß § 12 ArbSchG und dem BGHW-Regelwerk, z. B. durch gezielte Rückfragen.',
            rechtlich: 'Vergewissern Sie sich, dass unterwiesene Personen die vermittelten Inhalte verstanden haben, etwa durch Rückfragen oder Lernerfolgskontrollen (§ 12 ArbSchG).'
        }
    },

    "Arbeitsmedizin": {
        "11.1": {
            einfach: 'Bieten Sie Ihren Mitarbeitenden die vorgeschriebenen Gesundheitschecks beim Betriebsarzt an.',
            bghw: 'Bieten Sie arbeitsmedizinische Vorsorge gemäß ArbMedVV und dem BGHW-Regelwerk an.',
            rechtlich: 'Arbeitsmedizinische Vorsorge ist gemäß ArbMedVV anzubieten bzw. zu veranlassen.'
        },
        "11.2": {
            einfach: 'Planen Sie regelmäßige Besuche oder Sprechstunden des Betriebsarztes ein.',
            bghw: 'Planen und dokumentieren Sie die arbeitsmedizinische Betreuung (Begehung/Sprechstunde) gemäß DGUV Vorschrift 2 und dem BGHW-Regelwerk für das laufende Kalenderjahr.',
            rechtlich: 'Die arbeitsmedizinische Betreuung (Begehung oder Sprechstunde) ist gemäß DGUV Vorschrift 2 für das laufende Kalenderjahr zu planen und zu dokumentieren.'
        },
        "11.3": {
            einfach: 'Lassen Sie sich vom Betriebsarzt zu Gesundheitsfragen beraten, wenn Bedarf besteht.',
            bghw: 'Nehmen Sie arbeitsmedizinische Beratungsangebote gemäß DGUV Vorschrift 2 und dem BGHW-Regelwerk für Beschäftigte und Führungskräfte in Anspruch.',
            rechtlich: 'Arbeitsmedizinische Beratungen für Beschäftigte oder Führungskräfte sind gemäß DGUV Vorschrift 2 zu ermöglichen.'
        },
        "11.4": {
            einfach: 'Sorgen Sie mit Hautschutzplan und -produkten dafür, dass die Haut geschützt ist.',
            bghw: 'Setzen Sie Maßnahmen zur Vermeidung von Hauterkrankungen gemäß TRGS 401 und dem BGHW-Regelwerk konsequent um.',
            rechtlich: 'Maßnahmen zur Vermeidung von Hauterkrankungen sind gemäß TRGS 401 zu treffen.'
        },
        "11.5": {
            einfach: 'Setzen Sie die Empfehlungen des Betriebsarztes um und halten Sie sie schriftlich fest.',
            bghw: 'Dokumentieren und setzen Sie Berichte und Empfehlungen des Betriebsarztes gemäß § 3 ArbMedVV und dem BGHW-Regelwerk konsequent um.',
            rechtlich: 'Berichte und Empfehlungen des Betriebsarztes sind zu dokumentieren und im Rahmen der Gefährdungsbeurteilung umzusetzen (§ 3 ArbMedVV).'
        },
        "11.6": {
            einfach: 'Halten Sie Toiletten und Pausenräume sauber, funktionsfähig und gut ausgestattet.',
            bghw: 'Halten Sie sanitäre Anlagen und Pausenräume gemäß ASR A4.1/A4.2 und dem BGHW-Regelwerk sauber, funktionsfähig und ausreichend mit Hygieneartikeln bestückt.',
            rechtlich: 'Sanitäre Anlagen und Pausenräume sind gemäß ASR A4.1 und ASR A4.2 sauber, funktionsfähig und ausreichend mit Hygieneartikeln auszustatten.'
        }
    },

    "Backstation": {
        "12.1": {
            einfach: 'Kontrollieren Sie Backofen, Backbleche und Brotschneidemaschine regelmäßig auf ihren Zustand.',
            bghw: 'Kontrollieren Sie die Arbeitsgeräte der Backstation gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk regelmäßig auf ihren ordnungsgemäßen Zustand.',
            rechtlich: 'Die Arbeitsgeräte an der Backstation (Backofen, Backbleche, Brotschneidemaschine) sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3).'
        },
        "12.2": {
            einfach: 'Beheben Sie ein beschädigtes Handwaschbecken zeitnah.',
            bghw: 'Halten Sie das freistehende Handwaschbecken gemäß ASR A4.1 und dem BGHW-Regelwerk unbeschädigt und funktionsfähig.',
            rechtlich: 'Das freistehende Handwaschbecken ist gemäß ASR A4.1 unbeschädigt und funktionsfähig zu halten.'
        },
        "12.3": {
            einfach: 'Verlegen Sie Kabel so, dass niemand darüber stolpert, und lassen Sie beschädigte reparieren.',
            bghw: 'Verlegen Sie Elektroleitungen an der Backstation gemäß DGUV Vorschrift 3 und ASR A1.5 stolperfrei und lassen Sie Schäden umgehend beheben.',
            rechtlich: 'Elektroleitungen sind stolperfrei zu verlegen und auf Unversehrtheit zu prüfen (DGUV Vorschrift 3, ASR A1.5).'
        },
        "12.4": {
            einfach: 'Lassen Sie prüfen, ob die Stromzuleitung den geltenden Normen entspricht.',
            bghw: 'Lassen Sie die Zuleitung gemäß DIN VDE 0100 und dem BGHW-Regelwerk durch eine Elektrofachkraft prüfen.',
            rechtlich: 'Die Zuleitung ist auf Konformität mit DIN VDE 0100 zu prüfen.'
        },
        "12.5": {
            einfach: 'Lassen Sie alle Maschinen prüfen und halten Sie die Ergebnisse schriftlich fest.',
            bghw: 'Lassen Sie alle Maschinen gemäß § 14 BetrSichV und dem BGHW-Regelwerk prüfen und dokumentieren Sie die Ergebnisse.',
            rechtlich: 'Alle Maschinen sind gemäß § 14 BetrSichV zu prüfen; die Prüfungen sind zu dokumentieren.'
        },
        "12.6": {
            einfach: 'Kontrollieren Sie, ob alle Schutzvorrichtungen an den Maschinen vorhanden und funktionsfähig sind.',
            bghw: 'Kontrollieren Sie Schutzeinrichtungen an Backstationsmaschinen gemäß § 4 BetrSichV und dem BGHW-Regelwerk regelmäßig auf Vorhandensein und Funktion.',
            rechtlich: 'Schutzeinrichtungen müssen gemäß § 4 BetrSichV vorhanden und funktionsfähig sein.'
        },
        "12.7": {
            einfach: 'Hängen Sie die Betriebsanweisungen für die Backstation gut sichtbar auf.',
            bghw: 'Hängen Sie Betriebsanweisungen für die Backstation gemäß § 14 GefStoffV, § 4 BetrSichV und dem BGHW-Regelwerk gut sichtbar aus.',
            rechtlich: 'Betriebsanweisungen sind gemäß § 14 GefStoffV bzw. § 4 BetrSichV gut sichtbar auszuhängen.'
        },
        "12.8": {
            einfach: 'Prüfen Sie den Backhandschuh auf Verschleiß und tauschen Sie ihn bei Bedarf aus.',
            bghw: 'Kontrollieren Sie den Backhandschuh gemäß PSA-Benutzungsverordnung und dem BGHW-Regelwerk regelmäßig auf Verschleiß und ausreichende Stulpenlänge.',
            rechtlich: 'Backhandschuhe sind regelmäßig auf Verschleiß und ausreichende Schutzlänge (Stulpe) zu prüfen (PSA-Benutzungsverordnung).'
        },
        "12.9": {
            einfach: 'Warten Sie Heißtheken und Fritteusen regelmäßig.',
            bghw: 'Warten Sie Heißgeräte (Heißtheken, Fritteusen) gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk regelmäßig und lassen Sie sie technisch prüfen.',
            rechtlich: 'Heißgeräte sind regelmäßig technisch zu warten und auf einwandfreien Zustand zu prüfen (DGUV Vorschrift 3).'
        },
        "12.10": {
            einfach: 'Wenn die Brotschneidemaschine defekt ist: sofort ausstecken, ein Warnschild dranhängen und einen Elektriker rufen.',
            bghw: 'Nehmen Sie eine defekte Brotschneidemaschine gemäß BGHW-Vorgaben unverzüglich außer Betrieb, kennzeichnen Sie sie deutlich und veranlassen Sie eine DGUV V3-Prüfung durch eine Elektrofachkraft.',
            rechtlich: 'Gerät sofort sperren (Netzstecker ziehen), mit einem Warnhinweis \'Defekt – Nicht benutzen\' kennzeichnen und eine DGUV V3 Prüfung bzw. Instandsetzung durch eine Elektrofachkraft veranlassen.'
        }
    },

    "Serviceabteilung": {
        "13.1": {
            einfach: 'Hängen Sie an den Waschplätzen einen aktuellen Hautschutzplan auf.',
            bghw: 'Hängen Sie einen auf die Gefährdungsbeurteilung abgestimmten Hautschutzplan gemäß TRGS 401 und dem BGHW-Regelwerk an den Waschplätzen aus.',
            rechtlich: 'Ein aktueller, auf die Gefährdungsbeurteilung abgestimmter Hautschutzplan ist gemäß TRGS 401 an den Waschplätzen gut sichtbar auszuhängen.'
        },
        "13.2": {
            einfach: 'Stellen Sie Hautschutz- und Pflegecreme bereit.',
            bghw: 'Stellen Sie Hautschutz- und Hautpflegeprodukte gemäß TRGS 401 und dem BGHW-Regelwerk bereit.',
            rechtlich: 'Hautschutz- und Hautpflegeprodukte sind gemäß TRGS 401 zur Verfügung zu stellen.'
        },
        "13.3": {
            einfach: 'Kontrollieren Sie die Geräte im Servicebereich regelmäßig auf ihren Zustand.',
            bghw: 'Kontrollieren Sie die Arbeitsgeräte im Servicebereich gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk regelmäßig auf ihren ordnungsgemäßen Zustand.',
            rechtlich: 'Die Arbeitsgeräte im Servicebereich sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3).'
        },
        "13.4": {
            einfach: 'Prüfen Sie, ob aufgeklappte Thekenscheiben von selbst oben bleiben.',
            bghw: 'Prüfen Sie gemäß § 4 BetrSichV und dem BGHW-Regelwerk, dass aufklappbare Thekenscheiben in geöffneter Stellung sicher und selbstständig stehen bleiben.',
            rechtlich: 'Aufklappbare Thekenscheiben müssen gemäß § 4 BetrSichV in der oberen Stellung sicher und selbstständig verharren.'
        },
        "13.5": {
            einfach: 'Kleben Sie Markierungen in Augenhöhe an Glastüren und Glaswände.',
            bghw: 'Kennzeichnen Sie Glastüren und Glaswände gemäß ASR A1.7 und dem BGHW-Regelwerk in Augenhöhe, um Anstoßunfälle zu vermeiden.',
            rechtlich: 'Glastüren und Glaswände sind gemäß ASR A1.7 in Augenhöhe deutlich zu kennzeichnen.'
        },
        "13.6": {
            einfach: 'Reinigen Sie Schneidbretter und Messer regelmäßig und nutzen Sie die Farbcodierung für unterschiedliche Lebensmittel.',
            bghw: 'Reinigen Sie Schneidbretter und Messer regelmäßig und halten Sie das Farbcodierungssystem gemäß LMHV und dem BGHW-Regelwerk ein.',
            rechtlich: 'Schneidbretter und Messer sind regelmäßig zu reinigen und entsprechend dem in der Lebensmittelhygiene-Verordnung (LMHV) vorgeschriebenen Farbcodierungssystem zu verwenden.'
        },
        "13.7": {
            einfach: 'Verwenden Sie Schneidbretter mit einem sicheren Einschub fürs Messer.',
            bghw: 'Verwenden Sie Schneidbretter mit Messereinschub gemäß § 5 ArbSchG (Gefährdungsbeurteilung) und dem BGHW-Regelwerk zur Schnittverletzungsprävention.',
            rechtlich: 'Es sind Schneidbretter mit Messereinschub gemäß der Gefährdungsbeurteilung nach § 5 ArbSchG zu verwenden.'
        },
        "13.8": {
            einfach: 'Bewahren Sie Messer in einem Messerhalter auf, nicht lose.',
            bghw: 'Nutzen Sie Messerhalter gemäß § 5 ArbSchG (Gefährdungsbeurteilung) und dem BGHW-Regelwerk zur sicheren Aufbewahrung von Schneidwerkzeugen.',
            rechtlich: 'Zur sicheren Aufbewahrung von Messern sind Messerhalter gemäß der Gefährdungsbeurteilung nach § 5 ArbSchG zu verwenden.'
        },
        "13.9": {
            einfach: 'Kontrollieren Sie die Geräte im Convenience-Bereich regelmäßig.',
            bghw: 'Kontrollieren Sie Convenience-Geräte gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk regelmäßig auf ihren ordnungsgemäßen Zustand.',
            rechtlich: 'Convenience-Geräte sind regelmäßig auf ihren ordnungsgemäßen Zustand zu prüfen (DGUV Vorschrift 3).'
        },
        "13.10": {
            einfach: 'Sorgen Sie für ausreichend Licht im Servicebereich.',
            bghw: 'Stellen Sie die Beleuchtung im Servicebereich gemäß ASR A3.4 und dem BGHW-Regelwerk sicher.',
            rechtlich: 'Die Beleuchtung im Servicebereich ist gemäß ASR A3.4 ausreichend sicherzustellen.'
        }
    },

    "Kassenzone": {
        "14.1": {
            einfach: 'Räumen Sie den Fußraum an der Kasse frei von Gegenständen.',
            bghw: 'Halten Sie den Fußraum an der Kasse gemäß ASR A1.5 und dem BGHW-Regelwerk frei von Gegenständen.',
            rechtlich: 'Der Fußraum im Kassenbereich ist frei von Gegenständen zu halten (ASR A1.5).'
        },
        "14.2": {
            einfach: 'Beheben Sie Schäden am Boden im Kassenbereich zügig.',
            bghw: 'Kontrollieren Sie den Fußboden im Kassenbereich gemäß ASR A1.5 und dem BGHW-Regelwerk regelmäßig auf Schäden.',
            rechtlich: 'Der Fußboden im Kassenbereich ist gemäß ASR A1.5 frei von Beschädigungen zu halten.'
        },
        "14.3": {
            einfach: 'Stellen Sie nichts Brennbares an die eingebauten Heizgeräte im Kassenraum.',
            bghw: 'Halten Sie die eingebauten Heizgeräte im Kassenraum gemäß ASR A2.2 und dem BGHW-Regelwerk frei von brennbarem Material.',
            rechtlich: 'Serienmäßig eingebaute Heizgeräte im Kassenraum sind gemäß ASR A2.2 frei von brennbarem Material zu halten.'
        },
        "14.4": {
            einfach: 'Prüfen Sie, ob die Kassenstühle noch richtig funktionieren, und tauschen Sie defekte aus.',
            bghw: 'Kontrollieren Sie Kassenstühle gemäß § 3a ArbStättV und dem BGHW-Regelwerk regelmäßig auf Funktionsfähigkeit.',
            rechtlich: 'Kassenstühle sind gemäß § 3a ArbStättV in funktionsfähigem, ergonomisch geeignetem Zustand vorzuhalten.'
        },
        "14.5": {
            einfach: 'Prüfen Sie das Kassenband auf Schäden und größere Lücken.',
            bghw: 'Kontrollieren Sie das Transportband gemäß DGUV Vorschrift 3 und dem BGHW-Regelwerk regelmäßig auf Beschädigungen und Lücken über 5 mm.',
            rechtlich: 'Das Transportband ist unbeschädigt zu halten; Lücken von über 5 mm sind zu vermeiden (DGUV Vorschrift 3, Verletzungsgefahr).'
        },
        "14.6": {
            einfach: 'Räumen Sie Einkaufskörbe ordentlich in den Ständer, damit niemand darüber stolpert.',
            bghw: 'Lagern Sie Einkaufskörbe gemäß ASR A1.5 und dem BGHW-Regelwerk ordnungsgemäß im vorgesehenen Ständer, ohne den Verkehrsweg zu blockieren.',
            rechtlich: 'Einkaufskörbe sind ordnungsgemäß im vorgesehenen Ständer abzulegen; ein Hineinragen in den Verkehrsweg ist zu vermeiden (ASR A1.5).'
        }
    },

    "Gefahrstoffe": {
        "15.1": {
            einfach: 'Lagern Sie Gefahrstoffe so, dass sich unterschiedliche Stoffe nicht gefährlich vermischen können.',
            bghw: 'Beachten Sie die Zusammenlagerungsverbote nach TRGS 510 und dem BGHW-Regelwerk konsequent.',
            rechtlich: 'Gefahrstoffe sind unter strikter Beachtung der Zusammenlagerungsverbote nach TRGS 510 (Abschnitt 7 und Anlage 2) zu lagern, sodass gefährliche Wechselwirkungen ausgeschlossen sind.'
        },
        "15.2": {
            einfach: 'Stellen Sie Schutzbrille und Handschuhe für den Umgang mit Gefahrstoffen bereit.',
            bghw: 'Stellen Sie die für Gefahrstoffarbeiten passende PSA gemäß TRGS 400 und dem BGHW-Regelwerk bereit.',
            rechtlich: 'Die passende persönliche Schutzausrüstung (z. B. Schutzbrille, Handschuhe) ist gemäß TRGS 400 für Tätigkeiten mit Gefahrstoffen bereitzustellen.'
        },
        "15.3": {
            einfach: 'Halten Sie die vorgeschriebene Schutzausrüstung griffbereit in der Nähe.',
            bghw: 'Halten Sie die in Betriebsanweisungen geforderte PSA gemäß § 14 GefStoffV und dem BGHW-Regelwerk unmittelbar griffbereit vor.',
            rechtlich: 'Die in den Betriebsanweisungen geforderte persönliche Schutzausrüstung ist gemäß § 14 GefStoffV in unmittelbarer Nähe und einsatzbereit vorzuhalten.'
        },
        "15.4": {
            einfach: 'Halten Sie die Sicherheitsdatenblätter für alle Gefahrstoffe griffbereit.',
            bghw: 'Halten Sie Sicherheitsdatenblätter gemäß Art. 31 REACH-Verordnung und dem BGHW-Regelwerk jederzeit verfügbar.',
            rechtlich: 'Sicherheitsdatenblätter sind gemäß Art. 31 REACH-Verordnung jederzeit verfügbar zu halten.'
        },
        "15.5": {
            einfach: 'Weisen Sie Mitarbeitende regelmäßig im sicheren Umgang mit Gefahrstoffen ein.',
            bghw: 'Unterweisen Sie Mitarbeitende gemäß TRGS 555 und § 14 GefStoffV sowie dem BGHW-Regelwerk regelmäßig zum sicheren Umgang mit Gefahrstoffen.',
            rechtlich: 'Mitarbeiter sind gemäß § 14 GefStoffV regelmäßig zum Umgang mit Gefahrstoffen zu unterweisen.'
        }
    },

    "Marktleiterbüro": {
        "16.1": {
            einfach: 'Führen Sie eine aktuelle Liste aller Anlagen, die regelmäßig geprüft werden müssen, und heften Sie die Prüfberichte dazu ab.',
            bghw: 'Führen und pflegen Sie ein Prüfverzeichnis prüfpflichtiger Anlagen und Einrichtungen gemäß § 3 BetrSichV und dem BGHW-Regelwerk und legen Sie die zugehörigen Prüfberichte vollständig und aktuell vor.',
            rechtlich: 'Aktuelle Listen und Prüfberichte prüfpflichtiger Anlagen und Einrichtungen sind gemäß § 3 BetrSichV i. V. m. § 4 ArbSchG vollständig vorzuhalten und regelmäßig zu aktualisieren.'
        },
        "16.2": {
            einfach: 'Sorgen Sie dafür, dass möglichst wenig Bargeld sichtbar und griffbereit im Büro liegt, damit ein Überfall weniger attraktiv wird.',
            bghw: 'Setzen Sie die im Rahmen der Gefährdungsbeurteilung (§ 5 ArbSchG) und des BGHW-Regelwerks empfohlenen organisatorischen und baulichen Maßnahmen zur Überfallprävention um (z. B. Bargeldreduzierung, Zeitschlosstresore, Sichtschutz).',
            rechtlich: 'Geeignete organisatorische und technische Maßnahmen zur Reduzierung des Überfallrisikos sind gemäß Gefährdungsbeurteilung nach § 5 ArbSchG umzusetzen.'
        },
        "16.3": {
            einfach: 'Schließen Sie die Bürotür ab, wenn Sie mit Bargeld oder anderen Zahlungsmitteln hantieren.',
            bghw: 'Halten Sie die Tür während sämtlicher Kassiervorgänge und der Bargeldbearbeitung gemäß § 5 ArbSchG und dem BGHW-Regelwerk konsequent verschlossen.',
            rechtlich: 'Während des Umgangs mit Zahlungsmitteln ist die Bürotür im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG verschlossen zu halten.'
        },
        "16.4": {
            einfach: 'Führen Sie mit neuen Mitarbeitenden vor dem ersten Arbeitstag eine Einweisung zu Arbeitssicherheit und Brandschutz durch.',
            bghw: 'Unterweisen Sie neue Beschäftigte vor Tätigkeitsaufnahme gemäß § 12 ArbSchG und dem BGHW-Regelwerk zu Arbeitssicherheit, Brandschutz und betrieblichen Gefährdungen.',
            rechtlich: 'Neue Beschäftigte sind vor Tätigkeitsaufnahme zu Arbeitssicherheit, Brandschutz und betrieblichen Gefährdungen gemäß § 12 ArbSchG zu unterweisen.'
        },
        "16.5": {
            einfach: 'Achten Sie darauf, dass der Boden im Büro sauber, unbeschädigt und frei von Stolperfallen ist.',
            bghw: 'Beseitigen Sie Boden-Mängel im Büro umgehend gemäß ASR A1.5 und dem BGHW-Regelwerk.',
            rechtlich: 'Der Fußboden im Büro des Marktleiters ist gemäß ArbStättV i. V. m. ASR A1.5 frei von Schäden, Verschmutzungen und Stolperstellen zu halten.'
        }
    },

    "Barrierefreies WC": {
        "17.1": {
            einfach: 'Prüfen Sie, ob die Notrufschnur bis maximal 10 cm über dem Boden hängt, damit man sie auch liegend erreicht.',
            bghw: 'Stellen Sie gemäß DIN 18040-1 und dem BGHW-Regelwerk sicher, dass die Notrufschnur maximal 10 cm über dem Fußboden herabhängt.',
            rechtlich: 'Die Notrufschnur muss gemäß DIN 18040-1 bis maximal 10 cm über dem Fußboden herabhängen, um nach einem Sturz erreichbar zu sein.'
        },
        "17.2": {
            einfach: 'Sorgen Sie dafür, dass ein Alarm sofort bei einer besetzten Stelle ankommt.',
            bghw: 'Leiten Sie den Alarm gemäß DIN 18040-1 und dem BGHW-Regelwerk an eine ständig besetzte Stelle (z. B. Empfang, Leitwarte) weiter.',
            rechtlich: 'Der Alarm ist gemäß DIN 18040-1 an eine ständig besetzte Stelle weiterzuleiten.'
        },
        "17.3": {
            einfach: 'Testen Sie die Notrufschnüre regelmäßig, mindestens einmal im Monat.',
            bghw: 'Prüfen Sie Zugschnüre und Signalgeber gemäß DIN VDE 0834 und dem BGHW-Regelwerk mindestens monatlich auf Funktion.',
            rechtlich: 'Prüfen Sie die Zugschnüre und Signalgeber gemäß DIN VDE 0834 regelmäßig, mindestens jedoch monatlich, auf ihre einwandfreie Funktion und dokumentieren Sie die Ergebnisse nachvollziehbar.'
        },
        "17.4": {
            einfach: 'Erklären Sie den Mitarbeitenden, was bei einem Alarm zu tun ist.',
            bghw: 'Unterweisen Sie Beschäftigte gemäß § 12 ArbSchG und dem BGHW-Regelwerk zum richtigen Verhalten bei einem Notrufalarm.',
            rechtlich: 'Beschäftigte sind gemäß § 12 ArbSchG über das Verhalten bei einem Alarm zu unterweisen.'
        },
        "17.5": {
            einfach: 'Prüfen Sie, ob sich die WC-Tür im Notfall auch von außen öffnen lässt.',
            bghw: 'Stellen Sie sicher, dass die Tür gemäß DIN 18040-1 und dem BGHW-Regelwerk im Notfall von außen entriegelt werden kann.',
            rechtlich: 'Es ist sicherzustellen, dass die Tür im Notfall gemäß DIN 18040-1 von außen entriegelt werden kann.'
        }
    },

    "Notfallmanagement": {
        "18.1": {
            einfach: 'Erstellen Sie einen Notfallplan für Ihren Betrieb.',
            bghw: 'Erstellen Sie einen Notfallplan gemäß § 10 ArbSchG und dem BGHW-Regelwerk zur betrieblichen Notfallorganisation.',
            rechtlich: 'Ein Notfallplan ist gemäß § 10 ArbSchG zu erstellen und vorzuhalten.'
        },
        "18.2": {
            einfach: 'Sorgen Sie dafür, dass alle wissen, was bei Brand, Unfall oder Evakuierung zu tun ist.',
            bghw: 'Vermitteln Sie das Verhalten bei Brand, Unfall und Evakuierung gemäß § 10 ArbSchG und dem BGHW-Regelwerk.',
            rechtlich: 'Das Verhalten bei Brand, Unfall und Evakuierung ist gemäß § 10 ArbSchG regelmäßig zu vermitteln und zu üben.'
        },
        "18.3": {
            einfach: 'Legen Sie klar fest, wer im Notfall welche Aufgabe hat.',
            bghw: 'Regeln Sie die Zuständigkeiten im Notfall gemäß § 10 ArbSchG und dem BGHW-Regelwerk eindeutig.',
            rechtlich: 'Zuständigkeiten im Notfall sind gemäß § 10 ArbSchG eindeutig zu regeln und zu dokumentieren.'
        },
        "18.4": {
            einfach: 'Legen Sie fest, wie im Ernstfall Alarm ausgelöst wird.',
            bghw: 'Regeln Sie die Alarmierung gemäß § 10 ArbSchG und dem BGHW-Regelwerk verbindlich.',
            rechtlich: 'Die Alarmierung ist gemäß § 10 ArbSchG verbindlich zu regeln.'
        }
    },

    "Dokumentation": {
        "19.1": {
            einfach: 'Dokumentieren und archivieren Sie jede Erste-Hilfe-Leistung.',
            bghw: 'Führen und archivieren Sie die Dokumentation von Erste-Hilfe-Leistungen gemäß DGUV Information 204-020 und dem BGHW-Regelwerk.',
            rechtlich: 'Die Dokumentation von Erste-Hilfe-Leistungen ist gemäß DGUV Information 204-020 ordnungsgemäß zu führen und aufzubewahren.'
        },
        "19.2": {
            einfach: 'Bestellen Sie einen ausgebildeten Sicherheitsbeauftragten.',
            bghw: 'Bestellen Sie einen gemäß § 22 SGB VII und dem BGHW-Regelwerk ausgebildeten Sicherheitsbeauftragten.',
            rechtlich: 'Ein Sicherheitsbeauftragter ist gemäß § 22 SGB VII auszubilden und schriftlich zu bestellen.'
        },
        "19.3": {
            einfach: 'Sorgen Sie dafür, dass immer mindestens ein ausgebildeter Brandschutzhelfer im Laden ist.',
            bghw: 'Stellen Sie gemäß DGUV Information 205-023 und dem BGHW-Regelwerk die ständige Anwesenheit eines Brandschutzhelfers während der Öffnungszeiten sicher.',
            rechtlich: 'Während der gesamten Ladenöffnungszeit ist mindestens ein Mitarbeiter mit der Qualifikation als Brandschutzhelfer gemäß DGUV Information 205-023 anwesend zu halten.'
        },
        "19.4": {
            einfach: 'Führen Sie mindestens alle 6 Monate eine Schulung zum sicheren Umgang mit Bargeld durch.',
            bghw: 'Führen Sie die Unterweisung zum Umgang mit Zahlungsmitteln gemäß § 12 ArbSchG und dem BGHW-Regelwerk mindestens halbjährlich durch.',
            rechtlich: 'Die Unterweisung zum Umgang mit Zahlungsmitteln ist gemäß § 12 ArbSchG mindestens alle 6 Monate zu wiederholen.'
        },
        "19.5": {
            einfach: 'Halten Sie alle Unterweisungen schriftlich fest.',
            bghw: 'Dokumentieren Sie alle Unterweisungen gemäß § 12 ArbSchG und dem BGHW-Regelwerk nachvollziehbar und vollständig.',
            rechtlich: 'Unterweisungen sind gemäß § 12 ArbSchG lückenlos zu dokumentieren.'
        },
        "19.6": {
            einfach: 'Beziehen Sie neue Abläufe oder Sicherheitstechniken in die nächste Schulung mit ein.',
            bghw: 'Berücksichtigen Sie aktuelle betriebliche Änderungen und neue Sicherheitstechniken gemäß § 12 ArbSchG und dem BGHW-Regelwerk in jeder Unterweisung.',
            rechtlich: 'Aktuelle Änderungen in den betrieblichen Abläufen oder neue Sicherheitstechniken sind bei der Unterweisung gemäß § 12 ArbSchG zu berücksichtigen.'
        },
        "19.7": {
            einfach: 'Erstellen und aktualisieren Sie die Gefährdungsbeurteilung für Ihren Markt.',
            bghw: 'Erstellen und aktualisieren Sie die Gefährdungsbeurteilung gemäß § 5 ArbSchG und dem BGHW-Regelwerk regelmäßig.',
            rechtlich: 'Die Gefährdungsbeurteilung (GBO) ist gemäß § 5 ArbSchG zu erstellen und auf dem aktuellen Stand zu halten.'
        }
    },

    "Psychische Belastung": {
        "20.1": {
            einfach: 'Berücksichtigen Sie Wünsche der Mitarbeitenden bei der Dienstplanung, wo es geht.',
            bghw: 'Berücksichtigen Sie Beschäftigtenwünsche gemäß der Gefährdungsbeurteilung psychischer Belastung nach § 5 ArbSchG (vgl. DGUV Information 206-007) und dem BGHW-Regelwerk bei der Arbeitsplanung.',
            rechtlich: 'Wünsche der Beschäftigten sind im Rahmen der Arbeitsplanung angemessen zu berücksichtigen (§ 5 ArbSchG, psychische Belastung).'
        },
        "20.2": {
            einfach: 'Sorgen Sie dafür, dass Pausen wirklich eingehalten werden.',
            bghw: 'Setzen Sie die Pausenregelung gemäß § 4 ArbZG und dem BGHW-Regelwerk konsequent um.',
            rechtlich: 'Die Pausenregelung ist gemäß § 4 ArbZG konsequent umzusetzen.'
        },
        "20.3": {
            einfach: 'Vermeiden Sie unnötige Überstunden.',
            bghw: 'Begrenzen Sie Überstunden im Rahmen der Gefährdungsbeurteilung psychischer Belastung nach § 5 ArbSchG und dem BGHW-Regelwerk.',
            rechtlich: 'Überstunden sind im Rahmen der Gefährdungsbeurteilung psychischer Belastung möglichst gering zu halten (§ 5 ArbSchG).'
        },
        "20.4": {
            einfach: 'Führen Sie regelmäßige Teambesprechungen durch.',
            bghw: 'Führen Sie regelmäßige Teambesprechungen gemäß § 3 ArbSchG und dem BGHW-Regelwerk zur betrieblichen Organisation durch.',
            rechtlich: 'Regelmäßige Teambesprechungen sind im Rahmen der betrieblichen Organisation durchzuführen (§ 3 ArbSchG).'
        },
        "20.5": {
            einfach: 'Sorgen Sie für eine gute Einarbeitung neuer Mitarbeitender.',
            bghw: 'Stellen Sie eine strukturierte Einarbeitung gemäß § 12 ArbSchG und dem BGHW-Regelwerk für neue Mitarbeitende sicher.',
            rechtlich: 'Neue Mitarbeiter sind gemäß § 12 ArbSchG strukturiert einzuarbeiten.'
        },
        "20.6": {
            einfach: 'Führen Sie eine Unterweisung zu Brand- und Arbeitsschutz durch.',
            bghw: 'Führen Sie die Unterweisung zu Brand- und Arbeitsschutz gemäß § 12 ArbSchG und dem BGHW-Regelwerk regelmäßig durch.',
            rechtlich: 'Eine Unterweisung zum Thema Brand- und Arbeitsschutz ist gemäß § 12 ArbSchG durchzuführen.'
        },
        "20.7": {
            einfach: 'Richten Sie ein schwarzes Brett im Sozialraum oder Kassenbüro ein.',
            bghw: 'Richten Sie gemäß dem BGHW-Regelwerk zur innerbetrieblichen Kommunikation ein schwarzes Brett im Sozialraum oder Kassenbüro ein.',
            rechtlich: 'Ein Aushang (schwarzes Brett) ist im Sozialraum oder Kassenbüro zur innerbetrieblichen Information vorzuhalten.'
        },
        "20.8": {
            einfach: 'Erklären Sie Entscheidungen offen und nachvollziehbar.',
            bghw: 'Kommunizieren Sie Entscheidungen gemäß § 3 ArbSchG und dem BGHW-Regelwerk zu psychischer Gesundheit transparent.',
            rechtlich: 'Betriebliche Entscheidungen sind den Beschäftigten im Rahmen der arbeitgeberseitigen Fürsorgepflicht (§ 618 BGB, § 3 ArbSchG) transparent zu erläutern.'
        },
        "20.9": {
            einfach: 'Loben Sie gute Leistungen.',
            bghw: 'Geben Sie gemäß § 3 ArbSchG und dem BGHW-Regelwerk regelmäßig positives Feedback bei guter Leistung.',
            rechtlich: 'Positive Rückmeldungen bei guter Leistung sind Teil einer angemessenen Führungskultur (§ 3 ArbSchG, psychische Belastung).'
        },
        "20.10": {
            einfach: 'Üben Sie Kritik sachlich und fair.',
            bghw: 'Üben Sie konstruktive Kritik gemäß § 75 BetrVG und dem BGHW-Regelwerk sachlich und wertschätzend.',
            rechtlich: 'Führen Sie Kritikgespräche sachlich und lösungsorientiert, unter Wahrung der Würde der betroffenen Person (§ 75 BetrVG, § 4 ArbSchG).'
        },
        "20.11": {
            einfach: 'Hängen Sie Infos zur Suchtprävention aus.',
            bghw: 'Hängen Sie Informationen zur Suchtprävention gemäß § 3 ArbSchG und dem BGHW-Regelwerk gut sichtbar aus.',
            rechtlich: 'Stellen Sie einen gut sichtbaren Aushang mit Informationen zur Suchtprävention bereit und verweisen Sie auf innerbetriebliche Hilfsangebote (§ 3 ArbSchG).'
        },
        "20.12": {
            einfach: 'Bieten Sie erkrankten Mitarbeitenden Unterstützung bei der Rückkehr an den Arbeitsplatz.',
            bghw: 'Implementieren Sie ein betriebliches Eingliederungsmanagement gemäß § 167 SGB IX und dem BGHW-Regelwerk.',
            rechtlich: 'Ein betriebliches Eingliederungsmanagement gemäß § 167 SGB IX ist umzusetzen.'
        },
        "20.13": {
            einfach: 'Vermeiden Sie, dass Mitarbeitende allein arbeiten, wo es sich vermeiden lässt.',
            bghw: 'Vermeiden Sie Alleinarbeit im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG und dem BGHW-Regelwerk, insbesondere bei erhöhtem Überfallrisiko.',
            rechtlich: 'Alleinarbeit ist im Rahmen der Gefährdungsbeurteilung nach § 5 ArbSchG möglichst zu vermeiden.'
        },
        "20.14": {
            einfach: 'Sorgen Sie für Unterstützung, falls jemand einen Überfall erlebt hat.',
            bghw: 'Organisieren Sie die Betreuung nach einem Überfall gemäß § 3 ArbSchG und dem BGHW-Regelwerk (z. B. Nachsorge, psychologische Erstbetreuung).',
            rechtlich: 'Maßnahmen zur Betreuung von Beschäftigten nach Überfall- oder Gewaltvorfällen sind gemäß § 3 ArbSchG organisatorisch sicherzustellen.'
        },
        "20.15": {
            einfach: 'Bieten Sie Schulungen an, wie man in gefährlichen Situationen reagiert.',
            bghw: 'Bieten Sie Schulungen zum Umgang mit aggressiven oder gewalttätigen Situationen gemäß § 3 ArbSchG und dem BGHW-Regelwerk an.',
            rechtlich: 'Schulungen zum Umgang mit aggressiven oder gewalttätigen Situationen sind gemäß § 3 ArbSchG anzubieten.'
        },
        "20.16": {
            einfach: 'Hören Sie auf Vorschläge Ihrer Mitarbeitenden und beziehen Sie sie ein.',
            bghw: 'Beziehen Sie Mitarbeiteranregungen gemäß dem BGHW-Regelwerk zur Mitarbeiterbeteiligung aktiv in betriebliche Entscheidungen ein.',
            rechtlich: 'Mitarbeiteranregungen sind aktiv in Entscheidungs- und Verbesserungsprozesse einzubeziehen.'
        },
        "20.17": {
            einfach: 'Bieten Sie Ihren Mitarbeitenden Weiterbildungen an.',
            bghw: 'Schaffen Sie Weiterbildungsangebote gemäß § 82 BetrVG und dem BGHW-Regelwerk.',
            rechtlich: 'Schaffen Sie innerbetriebliche oder externe Weiterbildungsangebote und fördern Sie Qualifizierungen gemäß § 82 BetrVG sowie § 3 ArbSchG.'
        }
    },

    "Kundenaufzug": {
        "21.1": {
            einfach: 'Beheben Sie äußere Schäden an Kabine, Türen, Boden oder Beleuchtung des Kundenaufzugs umgehend und lassen Sie eine fehlende oder unleserliche Tragfähigkeitsangabe erneuern.',
            bghw: 'Veranlassen Sie die Instandsetzung äußerer Schäden am Kundenaufzug gemäß den BGHW-Vorgaben umgehend und stellen Sie eine gut lesbare Tragfähigkeitsangabe sicher.',
            rechtlich: 'Äußere Schäden an Kabine, Türen, Boden oder Beleuchtung des Kundenaufzugs sind unverzüglich zu beseitigen; die zulässige Tragfähigkeit ist gemäß BetrSichV deutlich sichtbar anzugeben.'
        },
        "21.2": {
            einfach: 'Lassen Sie defekte Aufzugstüren, Lichtschranken oder Türsensoren sofort reparieren und halten Sie die Zugänge frei von Stolperstellen.',
            bghw: 'Veranlassen Sie die Instandsetzung von Aufzugstüren, Lichtschranken und Türsensoren gemäß BGHW-Vorgaben unverzüglich und beseitigen Sie Stolperstellen im Zugangsbereich.',
            rechtlich: 'Defekte Aufzugstüren, Lichtschranken oder Türsensoren sind unverzüglich instand zu setzen; die Zugänge sind gemäß ASR A1.5 frei von Stolperstellen zu halten.'
        },
        "21.3": {
            einfach: 'Lassen Sie defekte Bedientasten, die Notruftaste oder die Etagenanzeige umgehend reparieren und sorgen Sie für verständliche Beschriftung.',
            bghw: 'Veranlassen Sie die Instandsetzung von Bedientasten, Notruftaste und Etagenanzeige gemäß BGHW-Vorgaben und stellen Sie eine verständliche Beschriftung sicher.',
            rechtlich: 'Bedientasten, Notruftaste sowie Etagen- bzw. Fahrtrichtungsanzeige sind funktionsfähig zu halten und verständlich zu beschriften.'
        },
        "21.4": {
            einfach: 'Lassen Sie die Notrufeinrichtung reparieren und schulen Sie das Personal, wie es sich bei eingeschlossenen Kunden verhält.',
            bghw: 'Veranlassen Sie die Instandsetzung der Notrufeinrichtung gemäß BGHW-Vorgaben und unterweisen Sie das Personal zum Verhalten bei eingeschlossenen Personen.',
            rechtlich: 'Eine funktionsfähige Notrufeinrichtung ist sicherzustellen; das Personal ist gemäß § 12 ArbSchG zum Verhalten bei eingeschlossenen Personen zu unterweisen. Eine eigenständige Befreiung durch Personal ist zu unterlassen.'
        },
        "21.5": {
            einfach: 'Holen Sie die fällige Aufzugsprüfung nach, beheben Sie offene Mängel aus dem letzten Prüfbericht und legen Sie die Prüfbescheinigung vor.',
            bghw: 'Veranlassen Sie die fristgerechte wiederkehrende Prüfung gemäß BGHW-Vorgaben, arbeiten Sie festgestellte Mängel vollständig ab und halten Sie die Prüfbescheinigung bereit.',
            rechtlich: 'Die wiederkehrende Prüfung des Aufzugs ist gemäß BetrSichV fristgerecht durchzuführen; festgestellte Mängel sind vollständig abzuarbeiten und die Prüfbescheinigung ist vorzuhalten.'
        },
        "21.6": {
            einfach: 'Räumen Sie Waren und Lagergut vor den Aufzugstüren weg und sorgen Sie für einen ebenen, gut beleuchteten Bereich.',
            bghw: 'Halten Sie die Bereiche vor den Aufzugstüren gemäß BGHW-Vorgaben frei von Waren und Lagergut und sorgen Sie für ausreichende Beleuchtung.',
            rechtlich: 'Die Bereiche vor den Aufzugstüren sind freizuhalten, eben zu gestalten und gemäß ASR A3.4 ausreichend zu beleuchten.'
        },
        "21.7": {
            einfach: 'Prüfen Sie, ob der Aufzug für Kunden inkl. Einkaufswagen und mobilitätseingeschränkte Personen geeignet ist, und bringen Sie verständliche Hinweise bei Störungen an.',
            bghw: 'Stellen Sie die Eignung des Aufzugs für den Kundenverkehr (Einkaufswagen, Barrierefreiheit) gemäß BGHW-Vorgaben sicher und bringen Sie verständliche Störungshinweise an.',
            rechtlich: 'Die Eignung des Aufzugs für die vorgesehene Kundennutzung, einschließlich Einkaufswagen und mobilitätseingeschränkter Personen, ist sicherzustellen; Hinweise bei Störungen sind verständlich anzubringen.'
        },
        "21.8": {
            einfach: 'Legen Sie schriftlich fest, wer im Notfall für die Befreiung eingeschlossener Personen zuständig ist, hinterlegen Sie eine Notbefreiungsanleitung vor Ort und beim Notdienst, schulen Sie das Personal in Erstmaßnahmen (Beruhigung, Zugang, Feuerwehr-Einweisung) und sorgen Sie für einen Ersatz-Notdienst, falls der reguläre ausfällt.',
            bghw: 'Regeln und dokumentieren Sie die Zuständigkeit für die Notbefreiung sowie die Alarmierungskette gemäß den BGHW-Vorgaben, hinterlegen Sie die Notbefreiungsanleitung vor Ort und beim Notdienst, schulen Sie das Personal in Erstmaßnahmen und stellen Sie eine redundante Notdienst-Absicherung sicher.',
            rechtlich: 'Die Zuständigkeit für die Notbefreiung (intern/extern/kombiniert) sowie die Alarmierungskette (Notdienst → Objektpersonal → ggf. Feuerwehr) sind schriftlich zu regeln und zu dokumentieren; eine Notbefreiungsanleitung ist vor Ort und beim Notdienst vorzuhalten. Das Personal ist gemäß § 12 ArbSchG in Erstmaßnahmen zu schulen; eine Redundanz für den Ausfall des externen Dienstes ist sicherzustellen.'
        },
        "21.9": {
            einfach: 'Erstellen Sie eine schriftliche Alarmierungskette für Aufzugsstörungen und eingeschlossene Personen und machen Sie sie allen Beteiligten bekannt.',
            bghw: 'Dokumentieren Sie die Alarmierungs- und Eskalationskette für Aufzugsstörungen gemäß BGHW-Vorgaben und stellen Sie deren Bekanntheit beim zuständigen Personal sicher.',
            rechtlich: 'Eine dokumentierte Alarmierungs- und Eskalationskette für Aufzugsstörungen bzw. eingeschlossene Personen ist zu erstellen und dem zuständigen Personal bekannt zu machen.'
        },
        "21.10": {
            einfach: 'Halten Sie die Kontaktdaten des Aufzugsnotdienstes aktuell und sorgen Sie dafür, dass das Personal jederzeit darauf zugreifen kann.',
            bghw: 'Stellen Sie die jederzeitige Verfügbarkeit aktueller Kontaktdaten des Aufzugsnotdienstes für das Objektpersonal gemäß BGHW-Vorgaben sicher.',
            rechtlich: 'Die Kontaktdaten des zuständigen Aufzugsnotdienstes sind aktuell zu halten und dem Objektpersonal jederzeit zugänglich zu machen.'
        },
        "21.11": {
            einfach: 'Legen Sie eine Notbefreiungsanleitung bzw. eine schriftliche Vorgehensweise für den Störungsfall vor Ort bereit.',
            bghw: 'Hinterlegen Sie eine Notbefreiungsanleitung bzw. dokumentierte Vorgehensweise für den Störungsfall gemäß BGHW-Vorgaben vor Ort.',
            rechtlich: 'Eine Notbefreiungsanleitung bzw. dokumentierte Vorgehensweise für den Störungsfall ist vor Ort bereitzuhalten.'
        },
        "21.12": {
            einfach: 'Legen Sie fest, wie das Personal im Notfall die Einsatzkräfte bzw. den Aufzugsnotdienst zum betroffenen Aufzug einweist.',
            bghw: 'Regeln Sie die Einweisung der Einsatzkräfte bzw. des Aufzugsnotdienstes zum betroffenen Aufzug durch das Objektpersonal gemäß BGHW-Vorgaben.',
            rechtlich: 'Es ist zu regeln, wie das Objektpersonal im Notfall die Einsatzkräfte bzw. den Aufzugsnotdienst zum betroffenen Aufzug einweist.'
        },
        "21.13": {
            einfach: 'Schulen Sie das zuständige Personal in den Erstmaßnahmen bei eingeschlossenen Personen.',
            bghw: 'Unterweisen Sie das zuständige Personal in den erforderlichen Erstmaßnahmen bei eingeschlossenen Personen gemäß BGHW-Vorgaben.',
            rechtlich: 'Das zuständige Personal ist gemäß § 12 ArbSchG in den erforderlichen Erstmaßnahmen bei eingeschlossenen Personen zu unterweisen.'
        },
        "21.14": {
            einfach: 'Stellen Sie sicher, dass eingeschlossene Personen bis zum Eintreffen des Fachpersonals betreut und beruhigt werden.',
            bghw: 'Stellen Sie eine angemessene Betreuung und Beruhigung eingeschlossener Personen bis zum Eintreffen des zuständigen Fachpersonals gemäß BGHW-Vorgaben sicher.',
            rechtlich: 'Es ist sicherzustellen, dass eingeschlossene Personen bis zum Eintreffen des zuständigen Fachpersonals angemessen betreut und beruhigt werden.'
        },
        "21.15": {
            einfach: 'Legen Sie eine Vertretungsregelung fest, falls der Aufzugsnotdienst einmal nicht erreichbar ist.',
            bghw: 'Richten Sie eine Vertretungs- bzw. Redundanzregelung für den Ausfall des zuständigen Aufzugsnotdienstes gemäß BGHW-Vorgaben ein.',
            rechtlich: 'Für den Fall der Nichterreichbarkeit des zuständigen Aufzugsnotdienstes ist eine Vertretungs- bzw. Redundanzregelung vorzuhalten.'
        }
    },

    "Lastenaufzug": {
        "22.1": {
            einfach: 'Beheben Sie äußere Schäden an Kabine, Türen, Boden, Beleuchtung oder Bedienelementen des Lastenaufzugs umgehend.',
            bghw: 'Veranlassen Sie die Instandsetzung äußerer Schäden am Lastenaufzug gemäß BGHW-Vorgaben umgehend.',
            rechtlich: 'Äußere Schäden an Kabine, Türen, Boden, Beleuchtung oder Bedienelementen des Lastenaufzugs sind unverzüglich zu beseitigen.'
        },
        "22.2": {
            einfach: 'Bringen Sie eine gut sichtbare Tragfähigkeitsangabe an und weisen Sie das Personal auf die zulässige Beladung hin.',
            bghw: 'Stellen Sie eine deutlich sichtbare Tragfähigkeitsangabe sicher und unterweisen Sie das Personal zur zulässigen Beladung gemäß BGHW-Vorgaben.',
            rechtlich: 'Die zulässige Tragfähigkeit ist gemäß BetrSichV deutlich sichtbar anzugeben; eine Überladung oder unsachgemäße Beladung ist zu unterbinden.'
        },
        "22.3": {
            einfach: 'Lassen Sie defekte Aufzugstüren oder Türsicherungen sofort reparieren und beseitigen Sie Quetsch- oder Absturzgefahren.',
            bghw: 'Veranlassen Sie die Instandsetzung von Aufzugstüren und Türsicherungen gemäß BGHW-Vorgaben und beseitigen Sie erkannte Quetsch- oder Absturzgefahren.',
            rechtlich: 'Defekte Aufzugstüren oder Türsicherungen sind unverzüglich instand zu setzen; Quetsch- oder Absturzgefahren sind zu beseitigen.'
        },
        "22.4": {
            einfach: 'Räumen Sie Waren, Paletten und sonstige Hindernisse vor den Aufzugstüren weg.',
            bghw: 'Halten Sie die Bereiche vor den Aufzugstüren gemäß BGHW-Vorgaben frei von Waren, Paletten und sonstigen Hindernissen.',
            rechtlich: 'Die Bereiche vor den Aufzugstüren sind freizuhalten von Waren, Paletten und sonstigen Hindernissen.'
        },
        "22.5": {
            einfach: 'Weisen Sie, falls zutreffend, deutlich sichtbar darauf hin, dass der Lastenaufzug nicht zur Personenbeförderung genutzt werden darf, und sorgen Sie für bestimmungsgemäße Nutzung.',
            bghw: 'Bringen Sie erforderliche Hinweise bzw. Verbote zur Personenbeförderung gemäß BGHW-Vorgaben gut sichtbar an und stellen Sie die bestimmungsgemäße Nutzung sicher.',
            rechtlich: 'Der Lastenaufzug ist bestimmungsgemäß zu verwenden; erforderliche Hinweise bzw. Verbote zur Personenbeförderung sind gut sichtbar anzubringen.'
        },
        "22.6": {
            einfach: 'Lassen Sie defekte Bedienelemente, Anzeigen oder Sicherheitseinrichtungen reparieren und sorgen Sie für eindeutige Kennzeichnung.',
            bghw: 'Veranlassen Sie die Instandsetzung von Bedienelementen, Anzeigen und Sicherheitseinrichtungen gemäß BGHW-Vorgaben und stellen Sie eine eindeutige Kennzeichnung sicher.',
            rechtlich: 'Bedienelemente, Anzeigen und Sicherheitseinrichtungen sind funktionsfähig zu halten und eindeutig zu kennzeichnen.'
        },
        "22.7": {
            einfach: 'Holen Sie die fällige Prüfung nach und beheben Sie offene Mängel aus dem letzten Prüfbericht.',
            bghw: 'Veranlassen Sie die fristgerechte Prüfung gemäß BGHW-Vorgaben und arbeiten Sie festgestellte Mängel vollständig ab.',
            rechtlich: 'Die wiederkehrende Prüfung des Lastenaufzugs ist gemäß BetrSichV fristgerecht durchzuführen; festgestellte Mängel sind vollständig abzuarbeiten.'
        },
        "22.8": {
            einfach: 'Unterweisen Sie die zuständigen Beschäftigten in der sicheren Bedienung und Beladung des Lastenaufzugs.',
            bghw: 'Unterweisen Sie die zuständigen Beschäftigten in der sicheren Bedienung und Beladung gemäß BGHW-Vorgaben.',
            rechtlich: 'Die zuständigen Beschäftigten sind gemäß § 12 ArbSchG in der sicheren Bedienung und Beladung des Lastenaufzugs zu unterweisen.'
        },
        "22.9": {
            einfach: 'Legen Sie schriftlich fest, wie bei einer Störung oder einem Einschluss vorzugehen ist, und machen Sie die Ansprechpartner bekannt.',
            bghw: 'Regeln Sie das Vorgehen bei Störung oder Einschluss gemäß BGHW-Vorgaben und benennen Sie die zuständigen Ansprechpartner.',
            rechtlich: 'Das Vorgehen bei einer Störung oder einem Einschluss ist schriftlich zu regeln; die zuständigen Ansprechpartner sind bekannt zu machen.'
        }
    },

    default: {
        einfach: 'Legen Sie geeignete Maßnahmen fest, um den Mangel zu beheben, und dokumentieren Sie diese.',
        bghw: 'Legen Sie geeignete Maßnahmen zur Mängelbeseitigung gemäß den BGHW-Vorgaben fest und dokumentieren Sie diese nachvollziehbar.',
        rechtlich: 'Geeignete Maßnahmen zur Mängelbeseitigung sind gemäß § 3 ArbSchG festzulegen und zu dokumentieren.'
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
let MEASURE_STYLE = localStorage.getItem('measureStyle') || 'rechtlich';

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
