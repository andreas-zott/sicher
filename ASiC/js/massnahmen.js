// ==========================================================================
// BEGEHUNGSLISTE — Maßnahmen-Seite
// Karten, Fotos, Kamera, Unterschriften, PDF/Teilen/Drucken
// ==========================================================================

let signaturePads = {};
let measurePhotosByMeasure = {};
let measurePhotoObjectUrls = [];

function revokeMeasurePhotoObjectUrls() {
    measurePhotoObjectUrls.forEach(url => URL.revokeObjectURL(url));
    measurePhotoObjectUrls = [];
}


// ==========================================================================
// MASSNAHMEN-KARTEN RENDERN
// ==========================================================================

async function renderMeasures() {
    const container = document.getElementById('measures-container');
    const noMeasures = document.getElementById('no-measures');

    if (!container) return;

    if (state.measures.length === 0) {
        container.style.display = 'none';

        if (noMeasures) {
            noMeasures.style.display = 'block';
        }

        return;
    }

    container.style.display = 'flex';

    if (noMeasures) {
        noMeasures.style.display = 'none';
    }


    // ----------------------------------------------------------------------
    // Alle Fotos einmal laden und nach Maßnahme gruppieren
    // ----------------------------------------------------------------------

    try {
        const allPhotos = await getAllPhotos();

        measurePhotosByMeasure = {};

        allPhotos.forEach(photo => {
            if (!photo.measureId) return;

            if (!measurePhotosByMeasure[photo.measureId]) {
                measurePhotosByMeasure[photo.measureId] = [];
            }

            measurePhotosByMeasure[photo.measureId].push(photo);
        });

    } catch (err) {
        console.error(
            'Fotos zu den Maßnahmen konnten nicht geladen werden:',
            err
        );

        measurePhotosByMeasure = {};
    }


    // ----------------------------------------------------------------------
    // Vorschaubilder nachrüsten
    // Fotos, die VOR dieser Funktion aufgenommen wurden (also ohne die
    // damals noch nicht vorhandene Miniatur-Erzeugung), bekommen hier
    // rückwirkend eine kleine Vorschau nachgetragen - nur für Fotos, die
    // tatsächlich lokal (IndexedDB) vorhanden sind und noch KEIN
    // zugehöriges Vorschaubild im JSON-Zustand haben. So landet beim
    // nächsten Speichern/Exportieren auch für ältere, bereits laufende
    // Begehungen ein Vorschaubild in der Datei.
    // ----------------------------------------------------------------------

    let nachgeruestet = false;

    for (const measure of state.measures) {
        const echteFotos = measurePhotosByMeasure[measure.id] || [];
        if (echteFotos.length === 0) continue;

        if (!measure.photoThumbnails) measure.photoThumbnails = [];
        const vorhandeneIds = new Set(measure.photoThumbnails.map(t => t.photoId));

        for (const photo of echteFotos) {
            if (vorhandeneIds.has(photo.id)) continue;

            try {
                const thumbBlob = await resizeImageFile(photo.blob, 220, 0.55);
                const thumbDataUrl = await blobToDataUrl(thumbBlob);
                measure.photoThumbnails.push({ photoId: photo.id, dataUrl: thumbDataUrl });
                nachgeruestet = true;
            } catch (thumbErr) {
                console.warn('Vorschaubild konnte nicht nachträglich erzeugt werden:', thumbErr);
            }
        }
    }

    if (nachgeruestet) {
        saveState();
    }


    revokeMeasurePhotoObjectUrls();


    // ----------------------------------------------------------------------
    // Maßnahmen-Karten erzeugen
    // ----------------------------------------------------------------------

    container.innerHTML = state.measures.map((measure, index) => {

        const found = findItemById(measure.itemId);

        const questionText = found
            ? `[${measure.itemId}] ${found.item.text}`
            : 'Manuell erfasste Maßnahme';

        const photos =
            measurePhotosByMeasure[measure.id] || [];


        // ------------------------------------------------------------------
        // Foto-Vorschauen
        // Alle Fotos werden gleich dargestellt: 180 × 180 px
        // Fallback: liegen lokal (IndexedDB) keine Fotos zu dieser Maßnahme
        // vor - z. B. weil die Begehung gerade erst vom NAS geladen wurde,
        // auf einem anderen Geraet gespeichert - werden die im JSON
        // mitgelieferten kleinen Vorschaubilder gezeigt (nur Ansicht, kein
        // Löschen möglich, da kein echtes Foto in IndexedDB dahinter steht).
        // ------------------------------------------------------------------

        const photoThumbs = photos.length > 0
            ? photos.map(photo => {

                const url = URL.createObjectURL(photo.blob);

                measurePhotoObjectUrls.push(url);

                return `
                    <div class="measure-photo-thumb">

                        <img
                            src="${url}"
                            alt="Foto zur Maßnahme">

                        <button
                            type="button"
                            class="measure-photo-delete"
                            onclick="onMeasurePhotoDelete('${photo.id}', '${measure.id}')"
                            title="Foto löschen">
                            ✕
                        </button>

                    </div>
                `;

            }).join('')
            : (measure.photoThumbnails || []).map(t => `
                <div class="measure-photo-thumb measure-photo-thumb-readonly" title="Nur Vorschau — Originalfoto liegt auf einem anderen Gerät">
                    <img src="${t.dataUrl}" alt="Vorschaubild zur Maßnahme">
                </div>
            `).join('');


        // ------------------------------------------------------------------
        // Maßnahmen-Karte
        // ------------------------------------------------------------------

        return `
            <div class="measure-card card">

                <!-- ====================================================== -->
                <!-- FRAGE -->
                <!-- ====================================================== -->

                <div class="measure-question">

                    <span class="measure-number">
                        ${index + 1}.
                    </span>

                    <span class="measure-question-text">
                        ${questionText}
                    </span>

                </div>


                <!-- ====================================================== -->
                <!-- FOTOS -->
                <!-- ====================================================== -->

                <div class="measure-photos">

                    <div class="measure-photos-header">

                        <span class="label">
                            Fotos
                        </span>


                        <!-- ------------------------------------------------ -->
                        <!-- KAMERA -->
                        <!-- ------------------------------------------------ -->

                        <button
                            type="button"
                            class="btn-link"
                            onclick="openMeasureCamera('${measure.id}')">
                            📷 Kamera öffnen
                        </button>


                        <!-- ------------------------------------------------ -->
                        <!-- FOTOS AUS GALERIE -->
                        <!-- ------------------------------------------------ -->

                        <label
                            class="btn-link"
                            for="photo-input-${measure.id}">
                            🖼️ Aus Fotos auswählen
                        </label>


                        <input
                            type="file"
                            id="photo-input-${measure.id}"
                            accept="image/*"
                            multiple
                            style="display:none;"
                            onchange="onMeasurePhotosCaptured('${measure.id}', this.files); this.value='';">

                    </div>


                    <!-- ---------------------------------------------------- -->
                    <!-- FOTO-VORSCHAU -->
                    <!-- ---------------------------------------------------- -->

                    ${
                        (photos.length > 0 || (measure.photoThumbnails && measure.photoThumbnails.length > 0))
                            ? `
                                <div class="measure-photo-grid">
                                    ${photoThumbs}
                                </div>
                              `
                            : ''
                    }

                </div>


                <!-- ====================================================== -->
                <!-- MASSNAHME -->
                <!-- ====================================================== -->

                <div class="measure-answer">

                    <span class="measure-answer-label">
                        Maßnahme
                    </span>

                    <textarea
                        oninput="updateMeasureField(
                            '${measure.id}',
                            'description',
                            this.value
                        )">${measure.description || ''}</textarea>


                    ${
                        (state.comments && state.comments[measure.itemId])
                            ? `
                                <p class="measure-comment">
                                    Kommentar: ${state.comments[measure.itemId]}
                                </p>
                              `
                            : ''
                    }

                </div>


                <!-- ====================================================== -->
                <!-- STATUS -->
                <!-- ====================================================== -->

                <div class="measure-status-row">

                    <span class="label">
                        Status
                    </span>

                    <select
                        class="status-badge ${measure.status}"
                        onchange="
                            updateMeasureField(
                                '${measure.id}',
                                'status',
                                this.value
                            );
                            this.className =
                                'status-badge ' + this.value;
                        ">

                        <option
                            value="offen"
                            ${measure.status === 'offen' ? 'selected' : ''}>
                            Offen
                        </option>

                        <option
                            value="bearbeitung"
                            ${measure.status === 'bearbeitung' ? 'selected' : ''}>
                            In Bearbeitung
                        </option>

                        <option
                            value="erledigt"
                            ${measure.status === 'erledigt' ? 'selected' : ''}>
                            Erledigt
                        </option>

                    </select>

                </div>

            </div>
        `;

    }).join('');
}


// ==========================================================================
// KAMERA ÖFFNEN
// ==========================================================================

function openMeasureCamera(measureId) {

    const existingInput =
        document.getElementById(
            `camera-input-${measureId}`
        );


    if (existingInput) {
        existingInput.click();
        return;
    }


    // Temporäres Kamera-Input erzeugen
    const cameraInput =
        document.createElement('input');


    cameraInput.type = 'file';

    // Nur Bilder
    cameraInput.accept = 'image/*';

    // Rückseitige Kamera bevorzugen
    cameraInput.setAttribute(
        'capture',
        'environment'
    );

    // Eine Aufnahme pro Kamera-Aufruf
    cameraInput.multiple = false;

    cameraInput.id =
        `camera-input-${measureId}`;

    cameraInput.style.display = 'none';


    // ----------------------------------------------------------------------
    // Nach der Aufnahme
    // ----------------------------------------------------------------------

    cameraInput.addEventListener(
        'change',
        async () => {

            if (
                cameraInput.files &&
                cameraInput.files.length > 0
            ) {

                await onMeasurePhotosCaptured(
                    measureId,
                    cameraInput.files
                );
            }


            // Temporäres Element entfernen
            cameraInput.remove();
        }
    );


    document.body.appendChild(
        cameraInput
    );


    // Kamera öffnen
    cameraInput.click();
}


// ==========================================================================
// FOTOS AUFNEHMEN / SPEICHERN
// ==========================================================================

async function onMeasurePhotosCaptured(
    measureId,
    fileList
) {

    const files =
        Array.from(fileList).filter(
            file =>
                file.type &&
                file.type.startsWith('image/')
        );


    if (files.length === 0) {
        return;
    }


    let failed = 0;


    // ----------------------------------------------------------------------
    // Fotos verarbeiten
    // ----------------------------------------------------------------------

    for (const file of files) {

        try {

            const blob =
                await resizeImageFile(file);


            const record =
                await addPhoto(
                    blob,
                    '',
                    measureId
                );

            // Kleines Vorschaubild zusaetzlich im state.measures ablegen
            // (Teil des JSON-Exports/NAS-Speicherns) - im Unterschied zum
            // Blob in IndexedDB ist das die einzige Version, die beim
            // Laden einer Begehung auf einem ANDEREN Geraet (z. B. aus dem
            // Team-Archiv) ueberhaupt verfuegbar ist, da IndexedDB
            // geraetegebunden ist. Bewusst klein gehalten (220px, niedrige
            // Qualitaet), um die Dateigroesse fuer den Mail-Versand nicht
            // relevant zu vergroessern.
            try {
                const thumbBlob = await resizeImageFile(file, 220, 0.55);
                const thumbDataUrl = await blobToDataUrl(thumbBlob);
                const measure = state.measures.find(m => m.id === measureId);
                if (measure) {
                    if (!measure.photoThumbnails) measure.photoThumbnails = [];
                    measure.photoThumbnails.push({ photoId: record.id, dataUrl: thumbDataUrl });
                    saveState();
                }
            } catch (thumbErr) {
                console.warn('Vorschaubild konnte nicht erzeugt werden:', thumbErr);
            }

        } catch (err) {

            console.error(
                'Foto konnte nicht verarbeitet werden:',
                err
            );

            failed++;
        }
    }


    // Karten neu laden
    await renderMeasures();


    // ----------------------------------------------------------------------
    // Rückmeldung
    // ----------------------------------------------------------------------

    if (failed > 0) {

        showToast(
            `${failed} Foto(s) konnten nicht gespeichert werden`,
            'error'
        );

    } else {

        showToast(
            files.length > 1
                ? `${files.length} Fotos hinzugefügt`
                : 'Foto hinzugefügt'
        );
    }
}


// ==========================================================================
// FOTO LÖSCHEN
// ==========================================================================

async function onMeasurePhotoDelete(
    photoId,
    measureId
) {

    try {

        await deletePhoto(photoId);

        const measure = state.measures.find(m => m.id === measureId);
        if (measure && measure.photoThumbnails) {
            measure.photoThumbnails = measure.photoThumbnails.filter(t => t.photoId !== photoId);
            saveState();
        }

        await renderMeasures();

        showToast('Foto gelöscht');

    } catch (err) {

        console.error(
            'Foto konnte nicht gelöscht werden:',
            err
        );

        showToast(
            'Foto konnte nicht gelöscht werden',
            'error'
        );
    }
}


// ==========================================================================
// MASSNAHMEN-FELD AKTUALISIEREN
// ==========================================================================

function updateMeasureField(
    id,
    field,
    value
) {

    const measure =
        state.measures.find(
            m => m.id === id
        );


    if (!measure) {
        return;
    }


    measure[field] = value;

    saveState();
}


// ==========================================================================
// UNTERSCHRIFTEN-CANVAS
// ==========================================================================

function initSignaturePad(
    key,
    canvasId
) {

    const canvas =
        document.getElementById(
            canvasId
        );


    if (!canvas) {
        return;
    }


    const ratio =
        window.devicePixelRatio || 1;


    const rect =
        canvas.getBoundingClientRect();


    canvas.width =
        rect.width * ratio;

    canvas.height =
        rect.height * ratio;


    const ctx =
        canvas.getContext('2d');


    ctx.scale(
        ratio,
        ratio
    );


    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1c2226';


    let drawing = false;
    let hasStroke = false;


    // ----------------------------------------------------------------------
    // Touch-/Mausposition
    // ----------------------------------------------------------------------

    function pos(e) {

        const r =
            canvas.getBoundingClientRect();


        const point =
            e.touches
                ? e.touches[0]
                : e;


        return {
            x: point.clientX - r.left,
            y: point.clientY - r.top
        };
    }


    // ----------------------------------------------------------------------
    // Start
    // ----------------------------------------------------------------------

    function start(e) {

        e.preventDefault();

        drawing = true;
        hasStroke = true;


        const p = pos(e);

        ctx.beginPath();

        ctx.moveTo(
            p.x,
            p.y
        );
    }


    // ----------------------------------------------------------------------
    // Zeichnen
    // ----------------------------------------------------------------------

    function move(e) {

        if (!drawing) {
            return;
        }


        e.preventDefault();


        const p = pos(e);


        ctx.lineTo(
            p.x,
            p.y
        );


        ctx.stroke();
    }


    // ----------------------------------------------------------------------
    // Ende
    // ----------------------------------------------------------------------

    function end() {

        if (!drawing) {
            return;
        }


        drawing = false;


        state.signatures[key] =
            canvas.toDataURL(
                'image/png'
            );


        saveState();
    }


    // ----------------------------------------------------------------------
    // Maus
    // ----------------------------------------------------------------------

    canvas.addEventListener(
        'mousedown',
        start
    );

    canvas.addEventListener(
        'mousemove',
        move
    );

    window.addEventListener(
        'mouseup',
        end
    );


    // ----------------------------------------------------------------------
    // Touch / iPad
    // ----------------------------------------------------------------------

    canvas.addEventListener(
        'touchstart',
        start,
        { passive: false }
    );

    canvas.addEventListener(
        'touchmove',
        move,
        { passive: false }
    );

    canvas.addEventListener(
        'touchend',
        end
    );


    // ----------------------------------------------------------------------
    // Pad speichern
    // ----------------------------------------------------------------------

    signaturePads[key] = {

        canvas,
        ctx,
        ratio,

        clear: () => {

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            hasStroke = false;


            state.signatures[key] =
                null;


            saveState();
        }
    };
}


// ==========================================================================
// UNTERSCHRIFTEN WIEDERHERSTELLEN
// ==========================================================================

function restoreSignatures() {

    Object.keys(
        signaturePads
    ).forEach(key => {

        const dataUrl =
            state.signatures[key];


        const pad =
            signaturePads[key];


        if (!dataUrl || !pad) {
            return;
        }


        const img =
            new Image();


        img.onload = () => {

            pad.ctx.clearRect(
                0,
                0,
                pad.canvas.width,
                pad.canvas.height
            );


            pad.ctx.drawImage(
                img,
                0,
                0,
                pad.canvas.width /
                    pad.ratio,
                pad.canvas.height /
                    pad.ratio
            );
        };


        img.src = dataUrl;
    });
}


// ==========================================================================
// PDF
// ==========================================================================
//
// buildPdf(), pdfFilename() sowie das komplette Export-Menü
// (Modus-Auswahl, Drucken, Teilen, Mail) leben zentral in app.js.
// ==========================================================================


// ==========================================================================
// INITIALISIERUNG
// ==========================================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        // --------------------------------------------------------------
        // Unterschriften
        // --------------------------------------------------------------

        initSignaturePad(
            'pruefer',
            'sig-pruefer-canvas'
        );

        initSignaturePad(
            'marktleitung',
            'sig-marktleitung-canvas'
        );


        // --------------------------------------------------------------
        // Prüfername
        // --------------------------------------------------------------

        const sigPrueferName =
            document.getElementById(
                'sig-pruefer-name'
            );


        if (sigPrueferName) {

            sigPrueferName.value =
                state.companyInfo.pruefername || '';


            sigPrueferName.addEventListener(
                'change',
                () => {

                    state.companyInfo.pruefername =
                        sigPrueferName.value;


                    saveState();

                    renderCompanyInfoStrip();
                }
            );
        }


        // --------------------------------------------------------------
        // Marktleitungsname
        // --------------------------------------------------------------

        const sigMarktleitungName =
            document.getElementById(
                'sig-marktleitung-name'
            );


        if (sigMarktleitungName) {

            sigMarktleitungName.value =
                state.companyInfo.marktleitung || '';


            sigMarktleitungName.addEventListener(
                'change',
                () => {

                    state.companyInfo.marktleitung =
                        sigMarktleitungName.value;


                    saveState();

                    renderCompanyInfoStrip();
                }
            );
        }


        // --------------------------------------------------------------
        // Maßnahmen anzeigen
        // --------------------------------------------------------------

        renderMeasures();


        // --------------------------------------------------------------
        // Unterschriften wiederherstellen
        // --------------------------------------------------------------

        restoreSignatures();


        // --------------------------------------------------------------
        // Prüfer-Unterschrift löschen
        // --------------------------------------------------------------

        const clearPruefer =
            document.getElementById(
                'clear-sig-pruefer'
            );


        if (clearPruefer) {

            clearPruefer.addEventListener(
                'click',
                () => {

                    if (
                        signaturePads.pruefer
                    ) {
                        signaturePads.pruefer.clear();
                    }
                }
            );
        }


        // --------------------------------------------------------------
        // Marktleitung-Unterschrift löschen
        // --------------------------------------------------------------

        const clearMarktleitung =
            document.getElementById(
                'clear-sig-marktleitung'
            );


        if (clearMarktleitung) {

            clearMarktleitung.addEventListener(
                'click',
                () => {

                    if (
                        signaturePads.marktleitung
                    ) {
                        signaturePads.marktleitung.clear();
                    }
                }
            );
        }


        // --------------------------------------------------------------
        // Speichern
        // --------------------------------------------------------------

        const btnSave =
            document.getElementById(
                'btn-save-measures'
            );


        if (btnSave) {

            btnSave.addEventListener(
                'click',
                () => {

                    saveState();

                    showToast(
                        'Gespeichert'
                    );
                }
            );
        }

    }
);