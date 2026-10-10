// ==========================================================================
// ASiC Handel — Bildablage der Gefährdungsbeurteilung (GBO)
// ==========================================================================
// Die Bildbelege der GBO liegen als Datei (Blob) in der eigenen IndexedDB
// "asicGboPhotos" (Speicher "photos", Schlüssel = Frage-ID). Im GBO-Stand
// (localStorage) stehen nur der Dateiname, ein Kennzeichen (photoStamp) und
// ein kleines Vorschaubild (photoThumb).
// Die Datenbank ist von der Begehungs-Fotodatenbank getrennt: Zurücksetzen
// einer Begehung löscht keine GBO-Bilder.
// ==========================================================================

(function () {
    'use strict';

    const DB_NAME = 'asicGboPhotos';
    const STORE = 'photos';

    function open() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error('IndexedDB ist nicht verfügbar.'));
                return;
            }
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE, { keyPath: 'id' });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error || new Error('IndexedDB-Fehler'));
            req.onblocked = () => reject(new Error('IndexedDB ist blockiert.'));
        });
    }

    function run(mode, action) {
        return open().then(db => new Promise((resolve, reject) => {
            let result;
            const tx = db.transaction(STORE, mode);
            const request = action(tx.objectStore(STORE));
            if (request) request.onsuccess = () => { result = request.result; };
            tx.oncomplete = () => { db.close(); resolve(result); };
            tx.onerror = () => { db.close(); reject(tx.error); };
            tx.onabort = () => { db.close(); reject(tx.error || new Error('Speichern abgebrochen')); };
        }));
    }

    function put(id, blob, meta) {
        const m = meta || {};
        return run('readwrite', s => s.put({
            id,
            blob,
            name: m.name || '',
            type: m.type || blob.type || '',
            stamp: m.stamp || '',
            size: blob.size || 0,
            savedAt: Date.now()
        }));
    }

    const get = id => run('readonly', s => s.get(id));
    const remove = id => run('readwrite', s => s.delete(id));
    const all = () => run('readonly', s => s.getAll());
    const clear = () => run('readwrite', s => s.clear());

    // Kleines Vorschaubild als Data-URL (für die Anzeige auf anderen Geräten)
    function thumb(blob, max, quality) {
        const maxSeite = max || 240;
        const q = quality || 0.5;
        return new Promise(resolve => {
            let url = '';
            try {
                url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                    try {
                        const f = Math.min(1, maxSeite / Math.max(img.width, img.height));
                        const c = document.createElement('canvas');
                        c.width = Math.max(1, Math.round(img.width * f));
                        c.height = Math.max(1, Math.round(img.height * f));
                        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
                        const d = c.toDataURL('image/jpeg', q);
                        URL.revokeObjectURL(url);
                        resolve(d);
                    } catch (e) {
                        URL.revokeObjectURL(url);
                        resolve('');
                    }
                };
                img.onerror = () => { URL.revokeObjectURL(url); resolve(''); };
                img.src = url;
            } catch (e) {
                if (url) URL.revokeObjectURL(url);
                resolve('');
            }
        });
    }

    // Data-URL (base64) -> Blob; null bei ungültigen Daten
    function dataUrlToBlob(dataUrl) {
        try {
            const m = /^data:([^;,]*)(;base64)?,([\s\S]*)$/.exec(dataUrl || '');
            if (!m || !m[2]) return null;
            const bin = atob(m[3]);
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            return new Blob([bytes], { type: m[1] || 'image/jpeg' });
        } catch (e) {
            return null;
        }
    }

    window.GBOPhotos = { put, get, remove, all, clear, thumb, dataUrlToBlob };
})();
