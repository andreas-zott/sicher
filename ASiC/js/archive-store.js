// ==========================================================================
// ASiC Handel — Archiv abgeschlossener Begehungen (IndexedDB)
// ==========================================================================
// Separate Datenbank von den Fotos, aber nach demselben Muster. Ein Archiv-
// Datensatz ist ein vollstaendiger Schnappschuss einer Begehung (Betriebsdaten,
// Antworten, Kommentare, Massnahmen, Unterschriften, Statistik) inklusive der
// zugehoerigen Fotos zum Archivierungszeitpunkt - damit ein archivierter
// Bericht spaeter jederzeit erneut vollstaendig als PDF exportierbar bleibt,
// auch nachdem die naechste Begehung laengst begonnen oder die "aktuellen"
// Fotos geloescht wurden.

const ARCHIVE_DB_NAME = 'asicHandelArchiv';
const ARCHIVE_DB_VERSION = 1;
const ARCHIVE_STORE = 'audits';

function openArchiveDB() {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) {
            reject(new Error('IndexedDB wird von diesem Browser nicht unterstützt.'));
            return;
        }
        const req = indexedDB.open(ARCHIVE_DB_NAME, ARCHIVE_DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(ARCHIVE_STORE)) {
                const store = db.createObjectStore(ARCHIVE_STORE, { keyPath: 'id' });
                store.createIndex('createdAt', 'createdAt');
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error || new Error('Archiv-Datenbank konnte nicht geöffnet werden.'));
    });
}

function saveArchivedAudit(record) {
    return openArchiveDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(ARCHIVE_STORE, 'readwrite');
        tx.objectStore(ARCHIVE_STORE).add(record);
        tx.oncomplete = () => resolve(record);
        tx.onerror = () => reject(tx.error || new Error('Begehung konnte nicht archiviert werden.'));
    }));
}

// Neueste zuerst
function getAllArchivedAudits() {
    return openArchiveDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(ARCHIVE_STORE, 'readonly');
        const req = tx.objectStore(ARCHIVE_STORE).index('createdAt').getAll();
        req.onsuccess = () => resolve((req.result || []).sort((a, b) => b.createdAt - a.createdAt));
        req.onerror = () => reject(req.error || new Error('Archiv konnte nicht geladen werden.'));
    }));
}

function getArchivedAudit(id) {
    return openArchiveDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(ARCHIVE_STORE, 'readonly');
        const req = tx.objectStore(ARCHIVE_STORE).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error || new Error('Begehung konnte nicht geladen werden.'));
    }));
}

function deleteArchivedAudit(id) {
    return openArchiveDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(ARCHIVE_STORE, 'readwrite');
        tx.objectStore(ARCHIVE_STORE).delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error || new Error('Begehung konnte nicht gelöscht werden.'));
    }));
}
