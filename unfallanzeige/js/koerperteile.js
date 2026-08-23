// Katalog verletzter Körperteile (Feld 19 der Unfallanzeige U 1000)
// Gruppiert wie im Formularvordruck üblich, mit Seitenangabe wo sinnvoll.
const KOERPERTEIL_KATALOG = [
  { gruppe: "Kopf", teile: ["Kopf (allgemein)", "Auge", "Gesicht", "Ohr", "Zähne/Mund", "Hals/Nacken"] },
  { gruppe: "Rumpf", teile: ["Rücken", "Brustkorb", "Bauch", "Becken", "Wirbelsäule"] },
  { gruppe: "Obere Extremität", teile: ["Schulter", "Oberarm", "Ellenbogen", "Unterarm", "Handgelenk", "Hand", "Finger"] },
  { gruppe: "Untere Extremität", teile: ["Hüfte", "Oberschenkel", "Knie", "Unterschenkel", "Sprunggelenk", "Fuß", "Zehe"] },
  { gruppe: "Sonstige", teile: ["Innere Organe", "Psyche", "Sonstiges"] }
];

// Körperteile, bei denen eine Seitenangabe (links/rechts/beidseitig) sinnvoll ist
const KOERPERTEIL_MIT_SEITE = new Set([
  "Auge", "Ohr", "Schulter", "Oberarm", "Ellenbogen", "Unterarm", "Handgelenk", "Hand", "Finger",
  "Hüfte", "Oberschenkel", "Knie", "Unterschenkel", "Sprunggelenk", "Fuß", "Zehe"
]);

function formatKoerperteil(eintrag) {
  // eintrag: { teil, seite } -> "rechter Unterarm" etc. Für Auswertung reicht der reine Teilname.
  if (!eintrag.seite || eintrag.seite === "keine") return eintrag.teil;
  const seiteLabel = { links: "links", rechts: "rechts", beidseitig: "beidseitig" }[eintrag.seite] || "";
  return seiteLabel ? `${eintrag.teil} (${seiteLabel})` : eintrag.teil;
}
