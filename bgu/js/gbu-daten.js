// ==========================================================================
// GBU-Katalog — zentrale Datengrundlage aller Gefährdungsbeurteilungen
// ==========================================================================
//
// Jeder Eintrag beschreibt EINE Gefährdungsbeurteilung vollständig. Die
// generische Formular-Engine (js/gbu-engine.js) rendert daraus automatisch
// Formular UND PDF. Eine neue Gefährdungsbeurteilung hinzuzufügen bedeutet:
// hier einen neuen Eintrag nach demselben Schema ergänzen — keine neue
// HTML-Datei, kein neues Skript.
//
// Schema je Eintrag:
//   id            - eindeutiger Kurzname, erscheint in der Adresse (gbu.html?id=...)
//   titel         - vollständiger Titel der Gefährdungsbeurteilung
//   kategorie     - Gruppierung für die Übersichtsseite (z. B. "Maschinen", "Tätigkeiten")
//   icon          - ein Emoji für die Übersichtskarte
//   hatMaschine   - true = zeigt den Abschnitt "Beschreibung der Maschine"
//   maschine      - { typ, hersteller, baujahrSeriennummer, verwendungszweck } (nur falls hatMaschine)
//   taetigkeiten  - Liste von Stichpunkten "Beschreibung der Tätigkeit" (nur falls KEIN hatMaschine)
//   gefaehrdungen - Liste { gefahr, beschreibung, folgen }
//   massnahmen    - Liste { gefahr, massnahme, beschreibung }
//   psa           - Freitext, persönliche Schutzausrüstung
//   restgefaehrdung - Freitext
//   risikomatrix  - Liste { gefahr, wahrscheinlichkeit (1-5), schwere (1-5) }
//
// Risikoschwelle einheitlich für ALLE Gefährdungsbeurteilungen (siehe
// berechneRisikostufe() in gbu-engine.js): 1-6 Niedrig, 7-12 Mittel, 13-25 Hoch.

const GBU_KATALOG = [

    // ======================================================================
    // 1. Sohlen- und Stiefelreiniger
    // ======================================================================
    {
        id: "sohlenreiniger",
        titel: "Sohlen- und Stiefelreiniger",
        kategorie: "Maschinen & Geräte",
        icon: "🥾",
        hatMaschine: true,
        maschine: {
            typ: "Sohlen- und Stiefelreiniger",
            hersteller: "",
            baujahrSeriennummer: "",
            verwendungszweck: "Effektives, gleichzeitiges Reinigen der Sohlen und Sohlenränder im Eingangsbereich."
        },
        gefaehrdungen: [
            {
                gefahr: "Einzugsgefahr",
                beschreibung: "Schnürsenkel oder lose Hosenbeine können sich in den rotierenden Bürsten verfangen.",
                folgen: "Zugverletzungen, Stolpern, Sturz"
            },
            {
                gefahr: "Quetschgefahr",
                beschreibung: "Finger oder Hand geraten beim Reinigen oder Warten zwischen die rotierenden Bürsten.",
                folgen: "Quetschungen, Prellungen"
            },
            {
                gefahr: "Stolpergefahr",
                beschreibung: "Unsachgemäß verlegtes Anschlusskabel im stark frequentierten Eingangsbereich.",
                folgen: "Sturz, Verletzungen"
            },
            {
                gefahr: "Schleuderwirkung",
                beschreibung: "Wasser oder Schmutzpartikel werden bei schneller Bürstenrotation weggeschleudert.",
                folgen: "Augenreizung, verschmutzte Kleidung, Rutschgefahr im Umfeld"
            },
            {
                gefahr: "Stromschlag",
                beschreibung: "Defekte oder beschädigte Kabel bzw. Stecker, insbesondere in feuchter Umgebung.",
                folgen: "Stromschlag, im schlimmsten Fall Herzkammerflimmern"
            },
            {
                gefahr: "Unbefugte Nutzung",
                beschreibung: "Kinder oder unbefugte Personen nutzen das Gerät unbeaufsichtigt.",
                folgen: "Verletzungen durch Fehlbedienung"
            },
            {
                gefahr: "Infektionsgefahr",
                beschreibung: "Mangelnde Reinigung der Bürsten bei Kontakt vieler unterschiedlicher Nutzer.",
                folgen: "Übertragung von Keimen oder Pilzinfektionen"
            },
            {
                gefahr: "Rutschgefahr",
                beschreibung: "Austretendes Wasser sammelt sich auf dem Boden im Eingangsbereich.",
                folgen: "Sturz, Verletzungen"
            }
        ],
        massnahmen: [
            {
                gefahr: "Einzugsgefahr",
                massnahme: "Abdeckung der rotierenden Teile",
                beschreibung: "Schutzgitter bzw. -abdeckung verhindert direkten Kontakt mit den Bürsten."
            },
            {
                gefahr: "Mechanische / elektrische Gefährdungen",
                massnahme: "Abschaltautomatik bei Überlastung",
                beschreibung: "Gerät schaltet bei blockierten Bürsten automatisch ab."
            },
            {
                gefahr: "Alle Gefährdungen",
                massnahme: "Nur funktionierende Maschinen verwenden",
                beschreibung: "Sichtkontrolle vor Inbetriebnahme durch die nutzende Person."
            },
            {
                gefahr: "Unbefugte Nutzung",
                massnahme: "Nutzungshinweise anbringen",
                beschreibung: "Gut sichtbares Piktogramm bzw. Hinweisschild direkt am Gerät."
            },
            {
                gefahr: "Infektionsgefahr",
                massnahme: "Regelmäßige Reinigung",
                beschreibung: "Bürsten in festgelegten Intervallen reinigen bzw. desinfizieren."
            }
        ],
        psa: "Keine erforderlich bei sachgemäßer Nutzung.",
        restgefaehrdung: "Bei Einhaltung der Schutzmaßnahmen ist das Restrisiko als gering einzustufen.",
        risikomatrix: [
            { gefahr: "Einzugsgefahr durch Bürsten", wahrscheinlichkeit: 3, schwere: 3 },
            { gefahr: "Stromschlag bei defektem Kabel", wahrscheinlichkeit: 2, schwere: 4 },
            { gefahr: "Rutschgefahr durch feuchten Boden", wahrscheinlichkeit: 3, schwere: 5 }
        ]
    },

    // ======================================================================
    // 2. Aufschnittschneidemaschine
    // ======================================================================
    {
        id: "aufschnittschneidemaschine",
        titel: "Aufschnittschneidemaschine",
        kategorie: "Maschinen & Geräte",
        icon: "🔪",
        hatMaschine: true,
        maschine: {
            typ: "Aufschnittschneidemaschine",
            hersteller: "",
            baujahrSeriennummer: "",
            verwendungszweck: "Schneiden von Wurst, Käse, Schinken und Brot in Scheiben."
        },
        gefaehrdungen: [
            {
                gefahr: "Schnittverletzung",
                beschreibung: "Kontakt mit der rotierenden Klinge beim Schneiden oder Reinigen.",
                folgen: "Tiefe Schnittwunden, in Extremfällen Amputationsverletzungen"
            },
            {
                gefahr: "Quetschgefahr",
                beschreibung: "Finger im Bereich des Vorschubschlittens.",
                folgen: "Quetschungen, Prellungen"
            },
            {
                gefahr: "Einklemmgefahr",
                beschreibung: "Bewegliche Teile wie Schlitten oder Gehäuse.",
                folgen: "Einklemmen von Fingern oder Handgelenk"
            },
            {
                gefahr: "Nachlaufgefahr",
                beschreibung: "Die Klinge dreht nach dem Ausschalten kurzzeitig nach.",
                folgen: "Schnittverletzung trotz vermeintlichem Stillstand"
            },
            {
                gefahr: "Stromschlag",
                beschreibung: "Beschädigtes Netzkabel, mangelhafte Erdung, defekte Schalter oder Isolierung.",
                folgen: "Stromschlag, Brandgefahr"
            },
            {
                gefahr: "Thermische Gefährdung",
                beschreibung: "Erwärmung von Motorteilen im Dauerbetrieb, Verbrühung beim Reinigen mit Heißwasser.",
                folgen: "Verbrennungen, Verbrühungen"
            },
            {
                gefahr: "Lärmbelastung",
                beschreibung: "Dauerbetrieb, insbesondere bei hartem Schneidgut (über 70 dB(A)).",
                folgen: "Gehörschäden bei dauerhafter Exposition"
            },
            {
                gefahr: "Ergonomische Belastung",
                beschreibung: "Zwangshaltung bei ungünstiger Arbeitshöhe, wiederholte Bewegungsabläufe.",
                folgen: "Muskel-Skelett-Erkrankungen"
            },
            {
                gefahr: "Schnittgefahr bei Reinigung",
                beschreibung: "Manuelle Reinigung der Messer.",
                folgen: "Schnittverletzungen"
            },
            {
                gefahr: "Versehentliches Einschalten",
                beschreibung: "Während Reinigung oder Wartung.",
                folgen: "Schwere Schnittverletzungen"
            },
            {
                gefahr: "Reinigungschemikalien",
                beschreibung: "Haut- oder Augenkontakt mit Reinigungsmitteln.",
                folgen: "Reizungen, Verätzungen"
            },
            {
                gefahr: "Rutschgefahr",
                beschreibung: "Herabfallende Lebensmittelreste auf dem Boden.",
                folgen: "Sturz"
            },
            {
                gefahr: "Infektionsrisiko",
                beschreibung: "Unzureichende Hygiene an der Maschine.",
                folgen: "Lebensmittelkontamination, Infektionen"
            }
        ],
        massnahmen: [
            {
                gefahr: "Schnittverletzung / Nachlaufgefahr",
                massnahme: "Abdeckung des Messers im Ruhezustand",
                beschreibung: "Automatische oder manuelle Klingenabdeckung bei Stillstand."
            },
            {
                gefahr: "Nachlaufgefahr",
                massnahme: "Messer-Nachlaufbremse",
                beschreibung: "Verhindert das Nachlaufen der Klinge nach dem Ausschalten."
            },
            {
                gefahr: "Alle Gefährdungen",
                massnahme: "Not-Aus-Schalter",
                beschreibung: "Gut erreichbar und eindeutig gekennzeichnet."
            },
            {
                gefahr: "Versehentliches Einschalten",
                massnahme: "Sicherheitsverriegelung",
                beschreibung: "Maschine stoppt automatisch bei geöffnetem Gehäuse."
            },
            {
                gefahr: "Alle Gefährdungen",
                massnahme: "Nur eingewiesenes Personal",
                beschreibung: "Bedienung ausschließlich durch unterwiesene Mitarbeitende."
            },
            {
                gefahr: "Alle Gefährdungen",
                massnahme: "Regelmäßige Unterweisung",
                beschreibung: "Mindestens einmal jährlich, dokumentiert."
            },
            {
                gefahr: "Alle Gefährdungen",
                massnahme: "Betriebsanweisung",
                beschreibung: "In Sichtweite der Maschine ausgehängt."
            },
            {
                gefahr: "Schnittgefahr bei Reinigung",
                massnahme: "Reinigungsplan",
                beschreibung: "Inklusive Abschaltung und Sicherung gegen Wiedereinschalten."
            },
            {
                gefahr: "Mechanische Fehlfunktionen",
                massnahme: "Wartung nach Herstellervorgaben",
                beschreibung: "Durch autorisiertes Personal, dokumentiert."
            }
        ],
        psa: "Rutschfeste Arbeitsschuhe, Schürze gegen Lebensmittelkontakt, Schutzbrille bei Verwendung aggressiver Reinigungsmittel, Schnittschutzhandschuhe beim Reinigen.",
        restgefaehrdung: "Minimale Schnittgefahr bei Missachtung der Sicherheitsvorkehrungen (z. B. Reinigung ohne Handschuhe). Restrisiko als akzeptabel bewertet.",
        risikomatrix: [
            { gefahr: "Schnittverletzung am Messer", wahrscheinlichkeit: 3, schwere: 3 },
            { gefahr: "Stromschlag bei Reinigung", wahrscheinlichkeit: 2, schwere: 4 },
            { gefahr: "Übergreifen in den Schneidbereich", wahrscheinlichkeit: 4, schwere: 3 },
            { gefahr: "Nichtbenutzung des Restehalters", wahrscheinlichkeit: 3, schwere: 3 }
        ]
    },

    // ======================================================================
    // 3. Abrollpresscontainer (Leihgerät)
    // ======================================================================
    {
        id: "abrollpresscontainer",
        titel: "Abrollpresscontainer (Leihgerät)",
        kategorie: "Tätigkeiten & Anlagen",
        icon: "🗑️",
        hatMaschine: false,
        taetigkeiten: [
            "Aufstellen durch autorisierten Entsorger",
            "Bedienen und Überwachen der Presse",
            "Befüllen der Presse mit Abfällen",
            "Starten und Stoppen der Pressvorgänge",
            "Entleerung durch autorisierten Entsorger",
            "Wartung und Prüfung durch autorisierten Entsorger"
        ],
        gefaehrdungen: [
            {
                gefahr: "Einklemm- und Quetschgefahr",
                beschreibung: "Mechanische Teile des Containers und der Presse können Hände oder Gliedmaßen einklemmen.",
                folgen: "Schwere Verletzungen, Amputationen, Quetschungen"
            },
            {
                gefahr: "Sturzgefahr",
                beschreibung: "Personen können beim Be- oder Entladen ausrutschen oder fallen.",
                folgen: "Prellungen, Knochenbrüche, Kopfverletzungen"
            },
            {
                gefahr: "Absturzgefahr",
                beschreibung: "Beim Nachdrücken oder Stopfen des Pressguts kann es zu Abstürzen kommen.",
                folgen: "Verstauchungen, Knochenbrüche, schwere Verletzungen"
            },
            {
                gefahr: "Stolper-, Rutsch- oder Quetschgefahr",
                beschreibung: "Beim Beschicken der Presse besteht die Gefahr des Ausrutschens, Stolperns oder Quetschens.",
                folgen: "Quetschungen, Schnittwunden, Knochenbrüche"
            },
            {
                gefahr: "Infektionsgefahr",
                beschreibung: "Kontakt mit kontaminiertem Pressgut.",
                folgen: "Hautinfektionen, Atemwegserkrankungen, systemische Infektionen"
            },
            {
                gefahr: "Kreislaufbelastung",
                beschreibung: "Hitzearbeit im Sommerbetrieb im Freien kann den Kreislauf stark belasten.",
                folgen: "Kreislaufkollaps, Hitzeschlag, Dehydration"
            },
            {
                gefahr: "Kälteeinwirkung",
                beschreibung: "Arbeiten im Winter können durch Kälteeinwirkung zu gesundheitlichen Problemen führen.",
                folgen: "Erfrierungen, Unterkühlung, eingeschränkte Beweglichkeit"
            },
            {
                gefahr: "Unzureichende Sicherung der Last",
                beschreibung: "Material kann herausfallen oder umstürzen.",
                folgen: "Verletzungen durch herabfallende Gegenstände"
            },
            {
                gefahr: "Mechanische Fehlfunktionen",
                beschreibung: "Defekte an der Presse können zu unkontrolliertem Betrieb führen.",
                folgen: "Verletzungen durch bewegliche Teile, Materialschäden"
            },
            {
                gefahr: "Elektrische Gefährdung",
                beschreibung: "Defekte elektrische Anlagen am Container oder an der Presse.",
                folgen: "Elektrischer Schlag, Brandgefahr"
            },
            {
                gefahr: "Lärmbelastung",
                beschreibung: "Hohe Betriebsgeräusche der Presse.",
                folgen: "Hörschäden, Stress"
            },
            {
                gefahr: "Staub- und Schmutzbelastung",
                beschreibung: "Entstehung von Staub beim Pressen.",
                folgen: "Atemwegserkrankungen, Reizungen"
            },
            {
                gefahr: "Hineinfallen / Klettern in die Pressöffnung",
                beschreibung: "Betriebs- oder betriebsfremde Personen (z. B. Kinder, Reinigungspersonal) können in die Beschickungsöffnung steigen oder stürzen — besonders bei Blockadenbeseitigung oder Reinigungsarbeiten.",
                folgen: "Tödliche Quetschungen, Amputationen, schwere innere Verletzungen"
            }
        ],
        massnahmen: [
            {
                gefahr: "Einklemm- und Quetschgefahr",
                massnahme: "Schutzverkleidungen & Not-Aus-Schalter",
                beschreibung: "Abdeckungen an beweglichen Teilen montieren; Not-Aus-Schalter gut erreichbar anbringen."
            },
            {
                gefahr: "Sturzgefahr",
                massnahme: "Rutschfeste Böden & Absperrungen",
                beschreibung: "Rutschhemmende Beläge verwenden; Gefahrenstellen absperren."
            },
            {
                gefahr: "Absturzgefahr beim Nachdrücken / Stopfen",
                massnahme: "Absicherung & Schulung",
                beschreibung: "Absturzsicherungen an Gefahrenstellen; Schulungen für sicheres Nachdrücken und Stopfen."
            },
            {
                gefahr: "Stolper-, Rutsch- oder Quetschgefahr beim Beschicken",
                massnahme: "Rutschfeste Böden & klare Wege",
                beschreibung: "Rutschfeste Beläge und freie, gut markierte Laufwege schaffen."
            },
            {
                gefahr: "Infektionsgefahr durch kontaminiertes Pressgut",
                massnahme: "Schutzausrüstung & Hygiene",
                beschreibung: "Handschuhe, Schutzkleidung und Hygienemaßnahmen strikt einhalten."
            },
            {
                gefahr: "Kreislaufbelastung bei Hitzearbeit",
                massnahme: "Pausen & Flüssigkeitszufuhr",
                beschreibung: "Regelmäßige Pausen, schattige Ruhebereiche und ausreichende Flüssigkeitszufuhr sicherstellen."
            },
            {
                gefahr: "Kälteeinwirkung im Winter",
                massnahme: "Warme Arbeitskleidung & Pausen",
                beschreibung: "Wärmeisolierende Kleidung tragen; Pausen in beheizten Räumen ermöglichen."
            },
            {
                gefahr: "Unzureichende Sicherung der Last",
                massnahme: "Regelmäßige Kontrolle & Schulung",
                beschreibung: "Lasten ordnungsgemäß sichern; Mitarbeitende über korrektes Handling schulen."
            },
            {
                gefahr: "Mechanische Fehlfunktionen",
                massnahme: "Wartung & Prüfung",
                beschreibung: "Regelmäßige Inspektion und Wartung der Anlage gemäß Herstellerangaben."
            },
            {
                gefahr: "Elektrische Gefährdung",
                massnahme: "Fachgerechte Installation & Prüfung",
                beschreibung: "Elektroanlagen nur von Fachpersonal installieren lassen; regelmäßige Sicherheitsprüfungen."
            },
            {
                gefahr: "Lärmbelastung",
                massnahme: "Gehörschutz & Wartung",
                beschreibung: "Bereitstellung von Gehörschutz; Wartung zur Reduzierung von Lärm."
            },
            {
                gefahr: "Staub- und Schmutzbelastung",
                massnahme: "Absaugung & Atemschutz",
                beschreibung: "Absauganlagen installieren; bei hoher Belastung Atemschutzmasken tragen."
            },
            {
                gefahr: "Klettern in die Pressöffnung",
                massnahme: "Warnschilder, Zugangskontrolle & Barrieren",
                beschreibung: "Warn- und Verbotsschilder („Einsteigen verboten“, „Lebensgefahr“); nur autorisiertes Personal mit Schlüsselschalter (LoTo-Prinzip); Absperrbügel, Geländer oder feste Barrieren an der Öffnung; Schulung zur sicheren Blockadenbeseitigung bei Stillstand."
            }
        ],
        psa: "Schutzhandschuhe, Sicherheitsschuhe, Gehörschutz bei erhöhter Lärmbelastung, Schutzkleidung bei Kontakt mit Pressgut.",
        restgefaehrdung: "Bei Einhaltung der Schutzmaßnahmen und ausschließlicher Bedienung durch eingewiesenes Personal ist das Restrisiko als vertretbar einzustufen.",
        risikomatrix: [
            { gefahr: "Quetschung durch Pressmechanik", wahrscheinlichkeit: 3, schwere: 4 },
            { gefahr: "Stromschlag durch defektes Kabel", wahrscheinlichkeit: 2, schwere: 4 },
            { gefahr: "Hineinfallen in Pressöffnung", wahrscheinlichkeit: 2, schwere: 5 },
            { gefahr: "Rückspritzender Müll beim Einwurf", wahrscheinlichkeit: 3, schwere: 2 },
            { gefahr: "Absturz beim Nachdrücken / Stopfen", wahrscheinlichkeit: 3, schwere: 3 },
            { gefahr: "Stolper-, Rutsch- oder Quetschgefahr beim Beschicken", wahrscheinlichkeit: 3, schwere: 3 },
            { gefahr: "Infektionsgefahr durch kontaminiertes Pressgut", wahrscheinlichkeit: 2, schwere: 3 },
            { gefahr: "Kreislaufbelastung bei Hitzearbeit", wahrscheinlichkeit: 3, schwere: 3 },
            { gefahr: "Kälteeinwirkung im Winter", wahrscheinlichkeit: 2, schwere: 2 }
        ]
    }

];
