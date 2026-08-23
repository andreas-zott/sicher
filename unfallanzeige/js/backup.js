// Backup-Funktionen: exportiert/importiert alle in der IndexedDB gespeicherten Unfallanzeigen
// als JSON-Datei. Wird gebraucht, weil die App ausschließlich lokal im Browser speichert
// (siehe UAL_DB_NAME in store.js) – ohne Export gehen die Daten bei Browser-Wechsel,
// "Website-Daten löschen" oder Gerätewechsel verloren.

function ualHeutigesDatumDateiname() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function ualDownloadJson(objekt, dateiname) {
  const blob = new Blob([JSON.stringify(objekt, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dateiname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Exportiert ALLE gespeicherten Unfallanzeigen in eine Sammel-JSON-Datei (Backup/Übertragung).
async function ualExportAlleAlsJson() {
  const berichte = await ualGetAlleBerichte();
  ualDownloadJson(
    { exportiertAm: new Date().toISOString(), anzahl: berichte.length, berichte },
    `Unfallanzeigen_Backup_${ualHeutigesDatumDateiname()}.json`
  );
  return berichte.length;
}

// Exportiert EINE einzelne Unfallanzeige als JSON (z. B. zum gezielten Weiterleiten).
function ualExportEinzelnenAlsJson(bericht) {
  ualDownloadJson(bericht, ualBerichtDateiname(bericht, "json"));
}

// Importiert eine zuvor exportierte JSON-Datei. Akzeptiert sowohl das Sammel-Format
// ({ berichte: [...] }) als auch eine einzelne Unfallanzeige oder ein rohes Array.
// Datensätze mit bereits vorhandener id werden überschrieben (kein Duplikat), neue ids
// werden als neuer Datensatz angelegt.
async function ualImportJsonDatei(file) {
  const text = await file.text();
  let daten;
  try {
    daten = JSON.parse(text);
  } catch (e) {
    throw new Error("Die Datei enthält kein gültiges JSON.");
  }

  let berichte;
  if (Array.isArray(daten)) {
    berichte = daten;
  } else if (daten && Array.isArray(daten.berichte)) {
    berichte = daten.berichte;
  } else if (daten && typeof daten === "object" && daten.id) {
    berichte = [daten]; // Einzelexport
  } else {
    throw new Error("Unbekanntes Dateiformat – keine Unfallanzeigen gefunden.");
  }

  let importiert = 0;
  let uebersprungen = 0;
  for (const bericht of berichte) {
    if (!bericht || typeof bericht !== "object" || !bericht.id) { uebersprungen += 1; continue; }
    await ualSaveBericht(bericht);
    importiert += 1;
  }
  return { importiert, uebersprungen, gesamt: berichte.length };
}
