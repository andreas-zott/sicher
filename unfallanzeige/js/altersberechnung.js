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

// Wochentag des Unfalls (Montag zuerst, wie in der amtlichen DGUV/Statista-Unfallstatistik üblich:
// dort zeigt sich bundesweit ein deutlicher Montags-Schwerpunkt bei meldepflichtigen Arbeitsunfällen).
const UAL_WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
function ualWochentag(unfallDatum) {
  if (!unfallDatum) return null;
  const d = new Date(unfallDatum);
  if (isNaN(d.getTime())) return null;
  const jsTag = d.getDay(); // 0 = Sonntag ... 6 = Samstag
  return UAL_WOCHENTAGE[(jsTag + 6) % 7];
}

// Betriebszugehörigkeit zum Unfallzeitpunkt in vollen Monaten, aus Feld 25
// ("Seit wann bei dieser Tätigkeit?") und dem Unfalldatum.
function ualBetriebszugehoerigkeitMonate(taetigSeit, unfallDatum) {
  if (!taetigSeit || !unfallDatum) return null;
  const start = new Date(taetigSeit);
  const unfall = new Date(unfallDatum);
  if (isNaN(start.getTime()) || isNaN(unfall.getTime())) return null;
  let monate = (unfall.getFullYear() - start.getFullYear()) * 12 + (unfall.getMonth() - start.getMonth());
  if (unfall.getDate() < start.getDate()) monate -= 1;
  if (monate < 0) return null; // unplausibel (Unfall vor Tätigkeitsbeginn)
  return monate;
}

function ualBetriebszugehoerigkeitGruppe(monate) {
  if (monate == null) return null;
  if (monate < 3) return "unter 3 Monate";
  if (monate < 12) return "3–12 Monate";
  if (monate < 36) return "1–3 Jahre";
  if (monate < 120) return "3–10 Jahre";
  return "über 10 Jahre";
}

