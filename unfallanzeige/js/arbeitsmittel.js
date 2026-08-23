// Katalog "Unfallverursachendes Arbeitsmittel / Gegenstand" – Einfachauswahl, gruppiert
// nach Sachgebiet für bessere Übersicht. Bei "Sonstiges" wird zusätzlich ein Freitext
// erfasst (arbeitsmittelSonstigesText).
const ARBEITSMITTEL_KATALOG = [
  {
    gruppe: "Maschinen",
    eintraege: ["Aufschnittschneidemaschine", "Brotschneidemaschine", "Käseschneidemaschine", "Fleischwolf", "Sonstige Maschine / Anlage"]
  },
  {
    gruppe: "Transport- und Lagerhilfsmittel",
    eintraege: ["Leiter / Trittleiter", "Rollbehälter / Rollcontainer", "Europalette", "Einwegpalette", "Hubwagen", "Elektrohubwagen", "Einkaufswagen", "Transportwagen", "Kommissionierwagen"]
  },
  {
    gruppe: "Einrichtung / Ausstattung",
    eintraege: ["Regal / Regalsystem", "Warenständer / Verkaufstheke", "Kühl- / Tiefkühlanlage", "Kühltheke", "Tür / Automatiktür / Rolltor"]
  },
  {
    gruppe: "Werkzeuge / Waren",
    eintraege: ["Schneidwerkzeug / Cuttermesser", "Messer / sonstiges Handwerkzeug", "Glas / Glasbehälter", "Verpackungsmaterial", "Karton / Warenkarton", "Ware / Produkt"]
  },
  {
    gruppe: "Reinigung / Elektrik",
    eintraege: ["Reinigungsgerät", "Reinigungschemikalien", "Elektrisches Arbeitsmittel / Gerät", "Kabel / elektrische Leitung"]
  },
  {
    gruppe: "Bauliche Gegebenheiten",
    eintraege: ["Boden / Bodenbelag", "Treppe / Stufe", "Rampe"]
  },
  {
    gruppe: "Sonstiges",
    eintraege: ["Sonstiges", "Kein Arbeitsmittel / Gegenstand beteiligt", "Nicht feststellbar"]
  }
];

function formatArbeitsmittel(wert, sonstigesText) {
  if (!wert) return "";
  if (wert === "Sonstiges" && sonstigesText) return `Sonstiges: ${sonstigesText}`;
  return wert;
}
