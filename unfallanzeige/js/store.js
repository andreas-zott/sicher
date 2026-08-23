// Gemeinsamer IndexedDB-Zugriff für alle Seiten (index.html, verlauf.html, auswertung.html)
// Merke (bekanntes Bug-Muster aus früheren Projekten): dieses File MUSS auf ALLEN Seiten
// eingebunden werden, nicht nur auf der Seite, auf der es "thematisch" gehört.

const UA_DB_NAME = "unfallanzeigeDB";
const UA_DB_VERSION = 1;
const UA_STORE = "berichte";
const UA_DB_TIMEOUT_MS = 5000; // gegen bekannten Safari-IndexedDB-Hänger

function ualOpenDB() {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("Zeitüberschreitung beim Öffnen der Datenbank. Bitte Seite neu laden."));
      }
    }, UA_DB_TIMEOUT_MS);

    const req = indexedDB.open(UA_DB_NAME, UA_DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(UA_STORE)) {
        db.createObjectStore(UA_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(req.result);
    };
    req.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(req.error || new Error("Datenbank konnte nicht geöffnet werden."));
    };
  });
}

async function ualSaveBericht(bericht) {
  const db = await ualOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UA_STORE, "readwrite");
    tx.objectStore(UA_STORE).put(bericht);
    tx.oncomplete = () => resolve(bericht);
    tx.onerror = () => reject(tx.error);
  });
}

async function ualGetAlleBerichte() {
  const db = await ualOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UA_STORE, "readonly");
    const req = tx.objectStore(UA_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function ualGetBericht(id) {
  const db = await ualOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UA_STORE, "readonly");
    const req = tx.objectStore(UA_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function ualLoescheBericht(id) {
  const db = await ualOpenDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(UA_STORE, "readwrite");
    tx.objectStore(UA_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function ualNeueId() {
  return "ua_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

// Gemeinsames Namensschema für exportierte Dateien (PDF wie JSON): Name der Person + Unfalldatum,
// damit Dateien beim Sichten/Weiterleiten sofort erkennbar sind.
function ualBerichtDateiname(b, extension) {
  const namensteil = (b.personName || "Person").replace(/[^a-zA-Z0-9]+/g, "_");
  const datumsteil = (b.unfallDatum || "ohne_Datum").replace(/-/g, "");
  return `Unfallanzeige_${namensteil}_${datumsteil}.${extension}`;
}
