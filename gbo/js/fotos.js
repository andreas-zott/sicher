// ==========================================================================
// ASiC Handel — Fotos-Seite (Aufnahme, Raster, Kommentare)
// ==========================================================================

let photosCache = [];
let photoObjectUrls = [];

function revokePhotoObjectUrls() {
    photoObjectUrls.forEach(url => URL.revokeObjectURL(url));
    photoObjectUrls = [];
}

async function loadAndRenderPhotos() {
    try {
        photosCache = await getUnlinkedPhotos();
        renderPhotoGrid();
    } catch (err) {
        console.error('Fotos konnten nicht geladen werden:', err);
        showToast('Fotos konnten nicht geladen werden: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
    }
}

function renderPhotoGrid() {
    const container = document.getElementById('photo-grid');
    const empty = document.getElementById('no-photos');
    if (!container) return;

    revokePhotoObjectUrls();

    if (photosCache.length === 0) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    container.innerHTML = photosCache.map(photo => {
        const url = URL.createObjectURL(photo.blob);
        photoObjectUrls.push(url);
        return `
        <div class="photo-tile card" data-id="${photo.id}">
            <img src="${url}" alt="Foto" class="photo-preview">
            <textarea class="photo-comment" placeholder="Kommentar zu diesem Foto…" onchange="onPhotoCommentChange('${photo.id}', this.value)">${photo.comment || ''}</textarea>
            <div class="photo-tile-actions">
                <button class="btn-link photo-delete" onclick="onPhotoDelete('${photo.id}')">🗑️ Löschen</button>
            </div>
        </div>`;
    }).join('');
}

async function onPhotoCommentChange(id, value) {
    try {
        await updatePhotoComment(id, value);
        const p = photosCache.find(ph => ph.id === id);
        if (p) p.comment = value;
    } catch (err) {
        console.error('Kommentar konnte nicht gespeichert werden:', err);
        showToast('Kommentar konnte nicht gespeichert werden', 'error');
    }
}

async function onPhotoDelete(id) {
    try {
        await deletePhoto(id);
        photosCache = photosCache.filter(p => p.id !== id);
        renderPhotoGrid();
        showToast('Foto gelöscht');
    } catch (err) {
        console.error('Foto konnte nicht gelöscht werden:', err);
        showToast('Foto konnte nicht gelöscht werden', 'error');
    }
}

async function onPhotosCaptured(fileList) {
    const files = Array.from(fileList).filter(f => f.type && f.type.startsWith('image/'));
    if (files.length === 0) return;

    let failed = 0;
    for (const file of files) {
        try {
            const blob = await resizeImageFile(file);
            await addPhoto(blob, '');
        } catch (err) {
            console.error('Foto konnte nicht verarbeitet werden:', err);
            failed++;
        }
    }

    await loadAndRenderPhotos();

    if (failed > 0) {
        showToast(`${failed} Foto(s) konnten nicht gespeichert werden`, 'error');
    } else {
        showToast(files.length > 1 ? `${files.length} Fotos hinzugefügt` : 'Foto hinzugefügt');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderPhotos();

    const input = document.getElementById('photo-capture-input');
    if (input) input.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length) onPhotosCaptured(e.target.files);
        e.target.value = '';
    });

    // Hinweis: initExportMenu() wird bereits zentral in app.js (eigenes
    // DOMContentLoaded) fuer JEDE Seite aufgerufen - ein zweiter Aufruf hier
    // wuerde den Menu-Button doppelt verdrahten und dazu fuehren, dass sich
    // das Menue bei jedem Klick sofort wieder selbst schliesst.
});
