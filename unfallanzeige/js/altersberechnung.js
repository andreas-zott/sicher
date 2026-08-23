// Berechnet das Alter der versicherten Person zum Unfallzeitpunkt aus Geburtsdatum (Feld 5)
// und Unfalldatum (Feld 15). Beide liegen als ISO-Datum (YYYY-MM-DD) aus den <input type="date">
// Feldern vor. Gibt null zurück, wenn eines der beiden Daten fehlt oder ungültig ist.
function ualAlterBerechnen(geburtsdatum, unfallDatum) {
  if (!geburtsdatum || !unfallDatum) return null;
  const geburt = new Date(geburtsdatum);
  const unfall = new Date(unfallDatum);
  if (isNaN(geburt.getTime()) || isNaN(unfall.getTime())) return null;
  let alter = unfall.getFullYear() - geburt.getFullYear();
  const vorGeburtstag = (unfall.getMonth() < geburt.getMonth()) ||
    (unfall.getMonth() === geburt.getMonth() && unfall.getDate() < geburt.getDate());
  if (vorGeburtstag) alter -= 1;
  if (alter < 0 || alter > 120) return null; // Plausibilitätsgrenze gegen Eingabefehler
  return alter;
}

function ualAltersgruppe(alter) {
  if (alter == null) return null;
  if (alter < 20) return "unter 20";
  if (alter < 30) return "20–29";
  if (alter < 40) return "30–39";
  if (alter < 50) return "40–49";
  if (alter < 60) return "50–59";
  return "60+";
}
