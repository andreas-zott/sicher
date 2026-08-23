// Katalog der Unfallursachen, zweistufig (Kategorie -> Detailursache).
// Speicherung pro Bericht als { unfallursacheKategorie, unfallursacheDetail }.
const UNFALLURSACHE_KATALOG = [
  {
    kategorie: "Sturz / Stolpern",
    unterpunkte: [
      "Stolpern über Kartons, Paletten oder Waren",
      "Rutschiger/nasser Boden",
      "Unebene Bodenfläche",
      "Lose Bodenbeläge oder Matten",
      "Sturz auf Treppen oder Stufen"
    ]
  },
  {
    kategorie: "Herabfallende / umfallende Gegenstände",
    unterpunkte: [
      "Ware aus Regal gefallen",
      "Regal oder Warenträger umgekippt",
      "Unsachgemäße Lagerung",
      "Überladenes Regal",
      "Gegenstand von oben herabgefallen"
    ]
  },
  {
    kategorie: "Anstoßen / Quetschen",
    unterpunkte: [
      "Anstoßen an Regale, Türen oder Einrichtung",
      "Einklemmen zwischen Waren oder Einrichtungen",
      "Quetschen an Rolltoren, Türen oder Schubladen",
      "Verletzung durch Einkaufswagen oder Transportwagen"
    ]
  },
  {
    kategorie: "Schneiden / Stechen",
    unterpunkte: [
      "Schnitt an Verpackungen",
      "Verletzung durch Messer/Cuttermesser",
      "Scharfe Kanten an Regalen oder Waren",
      "Zerbrochenes Glas oder beschädigte Verpackungen"
    ]
  },
  {
    kategorie: "Heben / Tragen",
    unterpunkte: [
      "Überlastung beim Heben",
      "Falsche Hebe- oder Tragetechnik",
      "Heben schwerer Waren",
      "Ungünstige Körperhaltung",
      "Verdrehung beim Heben oder Tragen"
    ]
  },
  {
    kategorie: "Transport / innerbetrieblicher Verkehr",
    unterpunkte: [
      "Zusammenstoß mit Hubwagen",
      "Unfall mit Rollcontainern",
      "Zusammenstoß mit Flurförderzeugen",
      "Herabfallen der Ladung beim Transport",
      "Zusammenstoß zwischen Mitarbeitern oder Kunden"
    ]
  },
  {
    kategorie: "Technische / elektrische Ursachen",
    unterpunkte: [
      "Defektes Arbeitsmittel",
      "Defektes elektrisches Gerät",
      "Beschädigtes Kabel",
      "Fehlfunktion einer Maschine oder Anlage"
    ]
  },
  {
    kategorie: "Thermische Ursachen",
    unterpunkte: [
      "Verbrennung an heißen Oberflächen",
      "Kontakt mit heißen Flüssigkeiten",
      "Verbrühung",
      "Kälteverletzung"
    ]
  },
  {
    kategorie: "Sonstige Ursachen",
    unterpunkte: [
      "Unachtsamkeit / Fehltritt",
      "Unzureichende Beleuchtung",
      "Fehlende oder unzureichende Kennzeichnung",
      "Fehlende persönliche Schutzausrüstung",
      "Unklare Arbeitsanweisung",
      "Sonstige, nicht näher bezeichnete Ursache"
    ]
  }
];

function formatUnfallursache(kategorie, detail) {
  if (!kategorie) return "";
  return detail ? `${kategorie} – ${detail}` : kategorie;
}
