// ==========================================================================
// ASiC Handel — Foto-Speicherung (IndexedDB) + Bildverkleinerung
// ==========================================================================
// Fotos liegen bewusst NICHT im normalen state/localStorage: Ein einzelnes
// iPad-Foto kann mehrere MB gross sein, waehrend localStorage insgesamt nur
// ca. 5-10 MB fasst. IndexedDB erlaubt deutlich mehr Speicher. Jedes Foto
// wird vor dem Speichern zusaetzlich clientseitig verkleinert (siehe
// resizeImageFile), um den Bedarf weiter zu senken.

const PHOTO_DB_NAME = 'asicHandelPhotos';
const PHOTO_DB_VERSION = 1;
const PHOTO_STORE = 'photos';

function openPhotoDB() {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) {
            reject(new Error('IndexedDB wird von diesem Browser nicht unterstützt.'));
            return;
        }
        // Bekannter Safari/WebKit-Fehler: indexedDB.open() kann in manchen
        // Situationen (privater Modus, App laenger im Hintergrund) einfach nie
        // antworten - weder Erfolg noch Fehler. Ohne diese Zeitueberschreitung
        // wuerde das komplett lautlos haengen bleiben, ohne jede Rueckmeldung.
        let settled = false;
        const timeoutId = setTimeout(() => {
            if (settled) return;
            settled = true;
            reject(new Error('Zeitüberschreitung beim Öffnen der Foto-Datenbank. Bitte privaten Browser-Modus deaktivieren oder Safari einmal komplett schließen und neu öffnen.'));
        }, 5000);

        const req = indexedDB.open(PHOTO_DB_NAME, PHOTO_DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(PHOTO_STORE)) {
                const store = db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
                store.createIndex('createdAt', 'createdAt');
            }
        };
        req.onsuccess = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timeoutId);
            resolve(req.result);
        };
        req.onerror = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timeoutId);
            reject(req.error || new Error('IndexedDB konnte nicht geöffnet werden.'));
        };
    });
}

function addPhoto(blob, comment, measureId) {
    return openPhotoDB().then(db => new Promise((resolve, reject) => {
        const id = 'photo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        const record = { id, blob, comment: comment || '', createdAt: Date.now(), measureId: measureId || null };
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        tx.objectStore(PHOTO_STORE).add(record);
        tx.oncomplete = () => resolve(record);
        tx.onerror = () => reject(tx.error || new Error('Foto konnte nicht gespeichert werden.'));
    }));
}

function getAllPhotos() {
    return openPhotoDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(PHOTO_STORE, 'readonly');
        const req = tx.objectStore(PHOTO_STORE).index('createdAt').getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error || new Error('Fotos konnten nicht geladen werden.'));
    }));
}

// Fotos ohne Verknuepfung zu einer Massnahme (fuer die allgemeine Fotos-Seite)
function getUnlinkedPhotos() {
    return getAllPhotos().then(photos => photos.filter(p => !p.measureId));
}

// Fotos zu genau einer bestimmten Massnahme (fuer die Massnahmen-Seite)
function getPhotosForMeasure(measureId) {
    return getAllPhotos().then(photos => photos.filter(p => p.measureId === measureId));
}

function updatePhotoComment(id, comment) {
    return openPhotoDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        const store = tx.objectStore(PHOTO_STORE);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
            const record = getReq.result;
            if (record) {
                record.comment = comment;
                store.put(record);
            }
        };
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error || new Error('Kommentar konnte nicht gespeichert werden.'));
    }));
}

function deletePhoto(id) {
    return openPhotoDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        tx.objectStore(PHOTO_STORE).delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error || new Error('Foto konnte nicht gelöscht werden.'));
    }));
}

function deleteAllPhotos() {
    return openPhotoDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        tx.objectStore(PHOTO_STORE).clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error || new Error('Fotos konnten nicht gelöscht werden.'));
    }));
}

// Schreibt eine Liste von Foto-Datensaetzen unveraendert zurueck (inkl.
// urspruenglicher id/measureId/createdAt) - im Unterschied zu addPhoto()
// wird KEINE neue id vergeben. Wird beim Wiederherstellen einer
// archivierten Begehung genutzt, damit die measureId-Zuordnung zu den
// ebenfalls wiederhergestellten Massnahmen exakt erhalten bleibt.
function restorePhotos(photosArray) {
    return openPhotoDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(PHOTO_STORE, 'readwrite');
        const store = tx.objectStore(PHOTO_STORE);
        (photosArray || []).forEach(p => store.put(p));
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error || new Error('Fotos konnten nicht wiederhergestellt werden.'));
    }));
}

// Verkleinert ein aufgenommenes/ausgewaehltes Bild ueber ein Canvas auf maximal
// maxWidth Pixel Breite und komprimiert es als JPEG, bevor es gespeichert wird.
function resizeImageFile(file, maxWidth, quality) {
    maxWidth = maxWidth || 1600;
    quality = quality || 0.78;
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            let width = img.naturalWidth;
            let height = img.naturalHeight;
            if (width > maxWidth) {
                height = Math.round(height * (maxWidth / width));
                width = maxWidth;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Bild konnte nicht verarbeitet werden.'));
            }, 'image/jpeg', quality);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Bild konnte nicht geladen werden.')); };
        img.src = url;
    });
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error('Bild konnte nicht gelesen werden.'));
        reader.readAsDataURL(blob);
    });
}

function getImageDimensions(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error('Bildabmessungen konnten nicht ermittelt werden.'));
        img.src = dataUrl;
    });
}

// Skaliert imgWidth/imgHeight so, dass sie in maxWidth/maxHeight passen (Seitenverhaeltnis erhalten).
function fitImage(imgWidth, imgHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    return { width: imgWidth * ratio, height: imgHeight * ratio };
}
