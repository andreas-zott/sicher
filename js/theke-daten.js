const THEKE_KATEGORIEN = [
 {
  "titel": "1. Hygiene & Infektionsschutz",
  "fragen": [
   {
    "frage": "Werden persönliche Schutzkleidung und Handschuhe getragen?",
    "name": "schutzkleidung"
   },
   {
    "frage": "Werden Hände regelmäßig und gründlich gewaschen?",
    "name": "handwaschen"
   },
   {
    "frage": "Ist eine hygienische Reinigung der Arbeitsflächen gewährleistet?",
    "name": "arbeitsflaechen_reinigung"
   },
   {
    "frage": "Sind Reinigungs- und Desinfektionsmittel vorhanden und richtig gelagert?",
    "name": "desinfektionsmittel"
   },
   {
    "frage": "Werden Pflegeprodukte (z.B. Handcreme) den Mitarbeitenden zur Verfügung gestellt?",
    "name": "pflegeprodukte"
   },
   {
    "frage": "Sind Hygieneeimer (z.B. für Handschuhe oder Tücher) vorhanden und werden sie genutzt?",
    "name": "hygieneeimer"
   }
  ]
 },
 {
  "titel": "2. Arbeitssicherheit / Schutzmaßnahmen",
  "fragen": [
   {
    "frage": "Werden scharfe Werkzeuge (Messer, Maschinen) sicher verwendet?",
    "name": "scharfe_werkzeuge"
   },
   {
    "frage": "Sind Messer und Werkzeuge ordentlich gelagert und gepflegt?",
    "name": "messer_lagerung"
   },
   {
    "frage": "Ist die Theke rutschfest und sauber gehalten?",
    "name": "theke_rutschfest"
   },
   {
    "frage": "Werden Arbeitsunfälle und Verletzungen dokumentiert?",
    "name": "unfaelle_dokumentation"
   },
   {
    "frage": "Werden die Aufschnittschneidemaschine sicher bedient und regelmäßig gereinigt?",
    "name": "aufschnittschneidemaschine_sicherheit"
   },
   {
    "frage": "Wird der Kutter vorschriftsmäßig verwendet und gewartet?",
    "name": "kutter_sicherheit"
   },
   {
    "frage": "Ist der Fleischwolf sicher bedient und nach Gebrauch gründlich gereinigt?",
    "name": "fleischwolf_sicherheit"
   }
  ]
 },
 {
  "titel": "3. Kühlkette und Lagerung",
  "fragen": [
   {
    "frage": "Ist die Kühlkette durchgehend gewährleistet?",
    "name": "kuehlkette"
   },
   {
    "frage": "Sind Kühlschränke und Kühlräume sauber und funktionieren einwandfrei?",
    "name": "kuehlschrank_sauber"
   },
   {
    "frage": "Werden Lebensmittel korrekt und sicher gelagert?",
    "name": "lebensmittel_lagerung"
   }
  ]
 },
 {
  "titel": "4. Brandschutz",
  "fragen": [
   {
    "frage": "Sind Feuerlöscher vorhanden und regelmäßig geprüft?",
    "name": "feuerloescher"
   },
   {
    "frage": "Gibt es Maßnahmen zur Vermeidung von Fettbränden?",
    "name": "fettbrand_massnahmen"
   }
  ]
 },
 {
  "titel": "5. Psychische Gesundheit / Stressmanagement",
  "fragen": [
   {
    "frage": "Gibt es Angebote zur Stressbewältigung und psychischen Unterstützung?",
    "name": "stressmanagement"
   },
   {
    "frage": "Wird auf angemessene Pausen und Erholungszeiten geachtet?",
    "name": "pausen"
   }
  ]
 },
 {
  "titel": "6. Umgang mit Kunden",
  "fragen": [
   {
    "frage": "Gibt es Schulungen zum Umgang mit aggressiven Kunden?",
    "name": "kunden_aggression"
   },
   {
    "frage": "Wird ein Konfliktmanagementsystem angewendet?",
    "name": "konfliktmanagement"
   }
  ]
 },
 {
  "titel": "7. Laderampe & Lagerung",
  "fragen": [
   {
    "frage": "Ist die Laderampe sicher begehbar und gut beleuchtet?",
    "name": "laderampe_sicherheit"
   },
   {
    "frage": "Sind Schwerlastregale ordnungsgemäß installiert und belastbar?",
    "name": "schwerlastregale"
   }
  ]
 },
 {
  "titel": "8. Weitere Gefahren",
  "fragen": [
   {
    "frage": "Besteht Rutschgefahr am Arbeitsplatz?",
    "name": "gefahr_rutschgefahr"
   },
   {
    "frage": "Werden hygienische Maßnahmen zur Vermeidung biologischer Kontaminationen konsequent eingehalten?",
    "name": "gefahr_biologische_kontamination"
   },
   {
    "frage": "Werden Reinigungs- und Desinfektionsmittel sicher gelagert und unter Beachtung des Arbeitsschutzes verwendet?",
    "name": "gefahr_chemikalien"
   },
   {
    "frage": "Gibt es ergonomische Arbeitsplätze und wird auf rückenschonende Arbeitsweisen geachtet?",
    "name": "gefahr_ergonomie"
   },
   {
    "frage": "Wird Lärm und Vibrationen durch Maschinen regelmäßig kontrolliert und auf Schutzmaßnahmen geachtet?",
    "name": "gefahr_laerm_vibration"
   },
   {
    "frage": "Werden elektrische Geräte regelmäßig geprüft und ist die elektrische Sicherheit gewährleistet?",
    "name": "gefahr_elektrisch"
   },
   {
    "frage": "Ist der Arbeitsbereich gegen Kältebelastung in Kühlräumen ausreichend geschützt?",
    "name": "gefahr_kältebelastung"
   },
   {
    "frage": "Gibt es Maßnahmen zur Vermeidung von Fettbränden und sind entsprechende Feuerlöscher vorhanden?",
    "name": "gefahr_fettbrand"
   },
   {
    "frage": "Werden schwere Lasten richtig gehoben und gibt es Hilfsmittel zum Transport?",
    "name": "gefahr_heben"
   }
  ]
 },
 {
  "titel": "9. Metzgerei Maschinen",
  "fragen": [
   {
    "frage": "Sind alle Maschinen (Aufschnittschneidemaschine, Kutter, Fleischwolf) regelmäßig gewartet und geprüft?",
    "name": "maschinen_gewartet"
   },
   {
    "frage": "Verfügen alle Maschinen über funktionierende Sicherheitsvorrichtungen (Not-Aus, Schutzabdeckungen)?",
    "name": "maschinen_sicherheitsvorrichtungen"
   },
   {
    "frage": "Werden Maschinen nur von geschultem Personal bedient?",
    "name": "maschinen_schulung"
   },
   {
    "frage": "Sind Bedienungsanleitungen gut zugänglich und werden Sicherheitsanweisungen eingehalten?",
    "name": "maschinen_anleitungen"
   },
   {
    "frage": "Werden Maschinen nach Gebrauch gründlich gereinigt und desinfiziert?",
    "name": "maschinen_reinigung"
   },
   {
    "frage": "Gibt es klare Anweisungen für das sichere Ein- und Ausschalten der Maschinen?",
    "name": "maschinen_anweisung"
   },
   {
    "frage": "Sind elektrische Anschlüsse und Kabel der Maschinen sicher und ohne Beschädigungen?",
    "name": "maschinen_elektrik"
   },
   {
    "frage": "Sind alle beweglichen Teile der Maschinen regelmäßig geschmiert und gewartet?",
    "name": "maschinen_schmierung"
   },
   {
    "frage": "Gibt es einen festgelegten Bereich für Maschinen mit ausreichendem Sicherheitsabstand?",
    "name": "maschinen_bereich"
   },
   {
    "frage": "Werden Maschinen regelmäßig auf Funktionsfähigkeit und Sauberkeit geprüft?",
    "name": "maschinen_pruefung"
   }
  ]
 },
 {
  "titel": "10. Service- und Heiße Theke",
  "fragen": [
   {
    "frage": "Wird die Temperatur dokumentiert und regelmäßig kontrolliert?",
    "name": "theke_temperaturkontrolle"
   },
   {
    "frage": "Werden warme Speisen nicht zu lange in Warmhaltegeräten aufbewahrt (z. B. max. 2 Stunden)?",
    "name": "theke_warmhaltezeit"
   },
   {
    "frage": "Werden Schneidbretter und Messer regelmäßig gereinigt und farbcodiert verwendet?",
    "name": "theke_schneidbretter"
   },
   {
    "frage": "Sind alle Heißgeräte (z. B. Heißtheken, Fritteusen) in technisch einwandfreiem Zustand?",
    "name": "theke_heissgeraete_zustand"
   },
   {
    "frage": "Gibt es Schutzvorrichtungen (z. B. Spritzschutz) bei heißen Geräten oder Grillbereichen?",
    "name": "theke_schutzvorrichtungen"
   },
   {
    "frage": "Werden regelmäßig Reinigungspläne für heiße und kalte Thekenbereiche durchgeführt?",
    "name": "theke_reinigung"
   },
   {
    "frage": "Ist der Umgang mit allergenen Stoffen gekennzeichnet und wird Mitarbeitenden geschult?",
    "name": "theke_allergene"
   },
   {
    "frage": "Gibt es geeignete Handschuhe, Pinzetten oder andere Hilfsmittel zur hygienischen Entnahme?",
    "name": "theke_hilfsmittel"
   },
   {
    "frage": "Ist die Ausgabefläche (Thekenbereich zum Kunden) frei von Verschmutzungen?",
    "name": "theke_ausgabeflaeche"
   }
  ]
 },
 {
  "titel": "11. Lager",
  "fragen": [
   {
    "frage": "Ist das Lager sauber, trocken und gut belüftet?",
    "name": "lager_sauberkeit"
   },
   {
    "frage": "Werden Regale sicher beladen und ist der Zugang nicht versperrt?",
    "name": "lager_regale"
   },
   {
    "frage": "Gibt es geeignete Hebehilfen oder Leitern für höhere Regale?",
    "name": "lager_hebehilfen"
   }
  ]
 },
 {
  "titel": "12. Personalräume",
  "fragen": [
   {
    "frage": "Sind Umkleideräume vorhanden und sauber?",
    "name": "personal_umkleide"
   },
   {
    "frage": "Werden Hygieneartikel wie Seife und Papierhandtücher bereitgestellt?",
    "name": "personal_hygieneartikel"
   }
  ]
 },
 {
  "titel": "13. Kassenbüro",
  "fragen": [
   {
    "frage": "Ist der Arbeitsplatz ergonomisch eingerichtet (Stuhl, Monitorhöhe)?",
    "name": "kasse_ergonomie"
   },
   {
    "frage": "Gibt es Sicherheitsvorkehrungen für Bargeldaufbewahrung?",
    "name": "kasse_sicherheit"
   }
  ]
 },
 {
  "titel": "14. Verkaufsfläche",
  "fragen": [
   {
    "frage": "Ist der Boden rutschfest und frei von Stolperfallen?",
    "name": "verkauf_boden"
   },
   {
    "frage": "Sind Flucht- und Rettungswege klar gekennzeichnet und nicht blockiert?",
    "name": "verkauf_fluchtwege"
   }
  ]
 },
 {
  "titel": "15. Heizungsraum",
  "fragen": [
   {
    "frage": "Ist der Heizungsraum frei zugänglich und nicht als Lager zweckentfremdet?",
    "name": "heizung_zugang"
   },
   {
    "frage": "Werden regelmäßige Wartungen durch Fachpersonal durchgeführt?",
    "name": "heizung_wartung"
   }
  ]
 },
 {
  "titel": "16. Lüftung",
  "fragen": [
   {
    "frage": "Funktionieren alle Lüftungssysteme einwandfrei und ohne Verunreinigungen?",
    "name": "lueftung_funktion"
   },
   {
    "frage": "Werden Filteranlagen regelmäßig geprüft und gereinigt?",
    "name": "lueftung_filter"
   }
  ]
 },
 {
  "titel": "17. Maschinenraum / Kühlung",
  "fragen": [
   {
    "frage": "Ist der Zugang zum Kühlmaschinenraum nur autorisiertem Personal erlaubt?",
    "name": "kuehlung_zugang"
   },
   {
    "frage": "Gibt es Hinweise zu Not-Aus-Schaltern und deren Funktion?",
    "name": "kuehlung_notaus"
   }
  ]
 },
 {
  "titel": "18. Kühlhäuser",
  "fragen": [
   {
    "frage": "Sind die Türen der Kühlhäuser eindeutig und gut sichtbar gekennzeichnet?",
    "name": "kuehlhaus_tueren"
   },
   {
    "frage": "Funktioniert die Notruffunktion innerhalb der Kühlhäuser einwandfrei?",
    "name": "kuehlhaus_notruf"
   },
   {
    "frage": "Ist die Beleuchtung in den Kühlhäusern ausreichend und funktioniert zuverlässig?",
    "name": "kuehlhaus_beleuchtung"
   }
  ]
 }
];
