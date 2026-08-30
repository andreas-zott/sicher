// ==========================================================================
// Arbeitssicherheit-Checkliste — gemeinsame Engine
// ==========================================================================
//
// Wird von liste.html (Desktop/Tablet) UND mobile.html (Telefon) genutzt.
// Beide laden dieselbe Datenquelle (js/checkliste-daten.js) und dieselbe
// Logik hier - nur das CSS/Layout unterscheidet sich zwischen den Seiten.
//
// Ersetzt zwei vorherige Probleme aus liste.html/mobile.html:
// 1. Eine ~460-zeilige if/else-Kette (generateMeasure) pro Datei, die den
//    Massnahmentext anhand von Fragetext-Teilstrings erraten hat - jetzt
//    steht der Massnahmentext direkt an der Frage in den Daten.
// 2. ZWEI parallele, nicht zusammenpassende Speichersysteme (manuelles
//    Speichern schrieb unter einem Schluessel inkl. Unterschrift, das
//    tatsaechlich beim Laden verwendete System las einen ANDEREN
//    Schluessel OHNE Unterschrift - Unterschriften gingen dadurch beim
//    naechsten Laden verloren). Jetzt: ein Schluessel, ein System, inkl.
//    Unterschrift.

const ChecklisteEngine = (() => {

    const STORAGE_KEY = 'checkliste_stand_v2';

    // ===== Rendering =====

    function renderKategorien() {
        const container = document.getElementById('fragenContainer');
        if (!container) return;

        container.innerHTML = CHECKLISTE_KATALOG.map((kat, kIdx) => `
            <div class="kategorie-block">
                <h2 class="kategorie-titel">${kat.nummer} ${escapeHtml(kat.name)}</h2>
                <div class="fragen-liste">
                    ${kat.fragen.map((f, fIdx) => {
                        const name = `frage-${kIdx}-${fIdx}`;
                        return `
                        <div class="frage-zeile" data-name="${name}" data-massnahme="${escapeAttr(f.massnahme)}">
                            <div class="frage-text">${escapeHtml(f.frage)}</div>
                            <div class="antwort-optionen">
                                <label class="antwort-opt opt-ja">
                                    <input type="radio" name="${name}" value="ja">
                                    <span>Ja</span>
                                </label>
                                <label class="antwort-opt opt-nein">
                                    <input type="radio" name="${name}" value="nein">
                                    <span>Nein</span>
                                </label>
                                <label class="antwort-opt opt-nv">
                                    <input type="radio" name="${name}" value="nv">
                                    <span>N/V</span>
                                </label>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `).join('');

        container.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                aktualisiereHervorhebung(radio);
                aktualisiereMassnahmenTabelle();
                speichereStand();
            });
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str === undefined || str === null ? '' : String(str);
        return div.innerHTML;
    }
    function escapeAttr(str) {
        return escapeHtml(str).replace(/"/g, '&quot;');
    }

    function aktualisiereHervorhebung(radio) {
        const zeile = radio.closest('.frage-zeile');
        zeile.classList.remove('hervorhebung-ja', 'hervorhebung-nein', 'hervorhebung-nv');
        if (radio.value === 'ja') zeile.classList.add('hervorhebung-ja');
        if (radio.value === 'nein') zeile.classList.add('hervorhebung-nein');
        if (radio.value === 'nv') zeile.classList.add('hervorhebung-nv');
    }

    // ===== Maßnahmentabelle (bei "Nein") =====

    function aktualisiereMassnahmenTabelle() {
        const tbody = document.getElementById('massnahmenTabelle');
        if (!tbody) return;

        const neinZeilen = Array.from(document.querySelectorAll('.frage-zeile')).filter(zeile => {
            const checked = zeile.querySelector('input[type="radio"]:checked');
            return checked && checked.value === 'nein';
        });

        tbody.innerHTML = neinZeilen.map((zeile, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${zeile.querySelector('.frage-text').textContent}</td>
                <td>${zeile.dataset.massnahme}</td>
            </tr>
        `).join('');

        const auswertungContainer = document.getElementById('auswertung-hinweis');
        if (auswertungContainer) {
            auswertungContainer.textContent = neinZeilen.length === 0
                ? 'Keine Abweichungen erfasst.'
                : `${neinZeilen.length} Abweichung${neinZeilen.length === 1 ? '' : 'en'} erfasst — siehe Maßnahmentabelle.`;
        }
    }

    // ===== Unterschriften-Canvas =====

    let canvas, ctx, malend = false;

    function initSignatur() {
        canvas = document.getElementById('unterschriftCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resizeCanvas();

        function pos(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            return { x, y };
        }
        function start(e) { malend = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
        function zeichne(e) {
            if (!malend) return;
            const p = pos(e);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.lineCap = 'round';
            ctx.stroke();
            e.preventDefault();
        }
        function stop() { if (!malend) return; malend = false; ctx.beginPath(); speichereStand(); }

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', zeichne);
        canvas.addEventListener('mouseup', stop);
        canvas.addEventListener('mouseout', stop);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', zeichne, { passive: false });
        canvas.addEventListener('touchend', stop);
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!canvas) return;
        const bild = istCanvasLeer() ? null : canvas.toDataURL('image/png');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (bild) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = bild;
        }
    }

    function istCanvasLeer() {
        if (!canvas || !ctx) return true;
        const daten = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < daten.length; i += 4) {
            if (daten[i] !== 0) return false;
        }
        return true;
    }

    function unterschriftLoeschen() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        speichereStand();
    }

    // ===== Speichern & Laden (EIN System statt der zwei vorherigen) =====

    function feldWert(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    }

    function speichereStand() {
        const antworten = {};
        document.querySelectorAll('.frage-zeile').forEach(zeile => {
            const checked = zeile.querySelector('input[type="radio"]:checked');
            if (checked) antworten[zeile.dataset.name] = checked.value;
        });

        const stand = {
            markt: feldWert('markt'),
            name: feldWert('name'),
            sifa: feldWert('sifa'),
            marktleitung: feldWert('Marktleitung'),
            antworten,
            unterschrift: istCanvasLeer() ? null : canvas.toDataURL('image/png')
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stand));
        } catch (e) {
            console.warn('Stand konnte nicht gespeichert werden:', e);
        }
    }

    function ladeStand() {
        let gespeichert;
        try { gespeichert = localStorage.getItem(STORAGE_KEY); } catch (e) { return; }
        if (!gespeichert) return;

        let stand;
        try { stand = JSON.parse(gespeichert); } catch (e) { return; }

        ['markt', 'name', 'sifa', 'Marktleitung'].forEach(id => {
            const el = document.getElementById(id);
            if (el && stand[id === 'Marktleitung' ? 'marktleitung' : id]) {
                el.value = stand[id === 'Marktleitung' ? 'marktleitung' : id];
            }
        });

        Object.keys(stand.antworten || {}).forEach(name => {
            const radio = document.querySelector(`input[name="${name}"][value="${stand.antworten[name]}"]`);
            if (radio) {
                radio.checked = true;
                aktualisiereHervorhebung(radio);
            }
        });

        if (stand.unterschrift && canvas) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = stand.unterschrift;
        }

        aktualisiereMassnahmenTabelle();
    }

    function formularZuruecksetzen() {
        if (!confirm('Formular wirklich zurücksetzen? Alle Eingaben und die Unterschrift gehen dabei verloren.')) return;
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        window.location.reload();
    }

    // ===== Übergabe an foto.html =====

    function weiterZuFotos() {
        const markt = feldWert('markt');
        const name = feldWert('name');
        const sifa = feldWert('sifa');
        if (!markt || !name || !sifa) {
            alert('Bitte Marktnummer, Name und SiFa ausfüllen, bevor es weitergeht.');
            return;
        }
        const url = `foto.html?marktnummer=${encodeURIComponent(markt)}&name=${encodeURIComponent(name)}&sifa=${encodeURIComponent(sifa)}`;
        window.open(url, '_blank');
    }

    // ===== Übergabe an massnahmen-sifa.html =====
    //
    // WICHTIG: Ursprünglich per window.open() + postMessage() umgesetzt -
    // das funktionierte auf mobile.html (iOS Safari) unzuverlässig: Pop-up-
    // Blocker verhindern das Öffnen ohne Fehlermeldung, und die opener-
    // Referenz zwischen den Fenstern geht auf mobilen Browsern leicht
    // verloren (z. B. bei Tab-Wechsel). Jetzt: Die Daten werden VOR dem
    // Öffnen in localStorage geschrieben - massnahmen-sifa.html liest sie
    // beim Laden direkt aus, unabhängig von Pop-up-Blockern oder einer
    // funktionierenden Fenster-Beziehung. postMessage bleibt zusätzlich
    // bestehen (falls beide Fenster bereits offen sind), ist aber nicht
    // mehr der einzige Übertragungsweg.

    const MASSNAHMEN_UEBERGABE_KEY = 'massnahmen_uebergabe';

    function exportiereMassnahmen() {
        const zeilen = [];
        document.querySelectorAll('#massnahmenTabelle tr').forEach((tr, i) => {
            const zellen = tr.querySelectorAll('td');
            if (zellen.length >= 3) {
                zeilen.push({
                    nr: i + 1,
                    frage: zellen[1].textContent.trim(),
                    beschreibung: zellen[2].textContent.trim()
                });
            }
        });

        const daten = {
            datum: new Date().toLocaleDateString('de-DE'),
            markt: feldWert('markt'),
            marktleitung: feldWert('Marktleitung'),
            name: feldWert('name'),
            sifa: feldWert('sifa'),
            massnahmen: zeilen
        };

        try {
            localStorage.setItem(MASSNAHMEN_UEBERGABE_KEY, JSON.stringify(daten));
        } catch (e) {
            console.warn('Maßnahmen konnten nicht zwischengespeichert werden:', e);
        }

        const neuesFenster = window.open('massnahmen-sifa.html', 'massnahmen');
        if (!neuesFenster) {
            alert('Die Maßnahmen-Auswertung konnte nicht geöffnet werden — vermutlich blockiert dein Browser das Pop-up. Bitte Pop-ups für diese Seite erlauben und erneut versuchen, oder „massnahmen-sifa.html" direkt aus der Übersicht öffnen.');
            return;
        }

        // Zusaetzlich per postMessage, falls beide Fenster bereits eine
        // funktionierende Verbindung haben (schneller als der Storage-Read
        // beim Laden, aber nicht mehr die einzige Quelle).
        let gesendet = false;
        function empfaengerHorchen(event) {
            if (gesendet) return;
            if (event.data && event.data.typ === 'massnahmen-sifa-bereit') {
                gesendet = true;
                window.removeEventListener('message', empfaengerHorchen);
                neuesFenster.postMessage(daten, '*');
            }
        }
        window.addEventListener('message', empfaengerHorchen);
        setTimeout(() => {
            gesendet = true;
            window.removeEventListener('message', empfaengerHorchen);
        }, 2500);
    }

    // ===== PDF-Erzeugung =====

    async function buildPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = 210, pageHeight = 297, margin = 16;
        const contentWidth = pageWidth - margin * 2;
        let y = 20;

        const INK = [10, 47, 115], SOFT = [71, 85, 105], LINE = [226, 232, 240];
        const FARBE = { ja: [22, 163, 74], nein: [198, 40, 40], nv: [107, 114, 128] };

        function neueSeiteFallsNoetig(hoehe) {
            if (y + hoehe > pageHeight - 16) { doc.addPage(); y = 20; }
        }

        doc.setFont(undefined, 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...INK);
        doc.text('Arbeitssicherheits-Checkliste', margin, y);
        y += 10;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...SOFT);
        doc.text(`Markt: ${feldWert('markt')}    Name: ${feldWert('name')}    SiFa: ${feldWert('sifa')}`, margin, y);
        y += 5;
        doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, margin, y);
        y += 10;

        CHECKLISTE_KATALOG.forEach((kat, kIdx) => {
            neueSeiteFallsNoetig(14);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(...INK);
            doc.text(`${kat.nummer} ${kat.name}`, margin, y);
            y += 6;

            kat.fragen.forEach((f, fIdx) => {
                const zeile = document.querySelector(`.frage-zeile[data-name="frage-${kIdx}-${fIdx}"]`);
                const checked = zeile ? zeile.querySelector('input[type="radio"]:checked') : null;
                const antwort = checked ? checked.value : '—';

                const frageZeilen = doc.splitTextToSize(f.frage, contentWidth - 20);
                neueSeiteFallsNoetig(frageZeilen.length * 4.2 + 3);

                doc.setFont(undefined, 'normal');
                doc.setFontSize(8.8);
                doc.setTextColor(60, 60, 60);
                doc.text(frageZeilen, margin, y);

                doc.setFont(undefined, 'bold');
                doc.setTextColor(...(FARBE[antwort] || [150, 150, 150]));
                doc.text(antwort === 'ja' ? 'Ja' : antwort === 'nein' ? 'Nein' : antwort === 'nv' ? 'N/V' : '—', margin + contentWidth - 12, y);

                y += frageZeilen.length * 4.2 + 3;
                doc.setDrawColor(...LINE);
                doc.line(margin, y - 1.5, margin + contentWidth, y - 1.5);
            });
            y += 4;
        });

        // Maßnahmentabelle
        const massnahmenZeilen = document.querySelectorAll('#massnahmenTabelle tr');
        if (massnahmenZeilen.length > 0) {
            neueSeiteFallsNoetig(14);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(13);
            doc.setTextColor(...INK);
            doc.text('Maßnahmen (aus "Nein"-Antworten)', margin, y);
            y += 8;

            massnahmenZeilen.forEach(tr => {
                const zellen = tr.querySelectorAll('td');
                if (zellen.length < 3) return;
                const frage = zellen[1].textContent.trim();
                const massnahme = zellen[2].textContent.trim();
                const frageZeilen = doc.splitTextToSize(frage, contentWidth);
                const massnahmeZeilen = doc.splitTextToSize(massnahme, contentWidth);
                neueSeiteFallsNoetig((frageZeilen.length + massnahmeZeilen.length) * 4.2 + 6);

                doc.setFont(undefined, 'bold');
                doc.setFontSize(9);
                doc.setTextColor(...INK);
                doc.text(frageZeilen, margin, y);
                y += frageZeilen.length * 4.2 + 1;

                doc.setFont(undefined, 'normal');
                doc.setTextColor(...SOFT);
                doc.text(massnahmeZeilen, margin, y);
                y += massnahmeZeilen.length * 4.2 + 5;
            });
        }

        // Unterschrift
        if (!istCanvasLeer()) {
            neueSeiteFallsNoetig(40);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(...INK);
            doc.text('Unterschrift', margin, y);
            y += 4;
            try {
                doc.addImage(canvas.toDataURL('image/png'), 'PNG', margin, y, 70, 25, undefined, 'FAST');
            } catch (e) { /* Bild konnte nicht eingebettet werden */ }
            y += 30;
        }

        const seiten = doc.getNumberOfPages();
        for (let i = 1; i <= seiten; i++) {
            doc.setPage(i);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(150, 150, 150);
            doc.text(`Seite ${i} von ${seiten}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
        }

        return doc;
    }

    function pdfDateiname() {
        const markt = (feldWert('markt') || 'Markt').replace(/[^a-z0-9-]+/gi, '-');
        const datum = new Date().toISOString().split('T')[0];
        return `Checkliste_${markt}_${datum}.pdf`;
    }

    async function pdfHerunterladen() {
        const doc = await buildPdf();
        doc.save(pdfDateiname());
    }

    async function pdfTeilen() {
        const doc = await buildPdf();
        const dateiname = pdfDateiname();
        const blob = doc.output('blob');
        try {
            if (navigator.canShare && typeof File !== 'undefined') {
                const file = new File([blob], dateiname, { type: 'application/pdf' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: 'Arbeitssicherheits-Checkliste' });
                    return;
                }
            }
            doc.save(dateiname);
        } catch (err) {
            if (err && err.name === 'AbortError') return;
            doc.save(dateiname);
        }
    }

    // ===== Initialisierung =====

    function init() {
        renderKategorien();
        initSignatur();
        ladeStand();
        aktualisiereMassnahmenTabelle();

        const heute = new Date();
        const datumsfeld = document.getElementById('datum');
        if (datumsfeld) {
            datumsfeld.textContent = heute.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        document.querySelectorAll('#markt, #name, #sifa, #Marktleitung').forEach(el => {
            el.addEventListener('input', speichereStand);
        });
    }

    return {
        init,
        weiterZuFotos,
        exportiereMassnahmen,
        unterschriftLoeschen,
        formularZuruecksetzen,
        pdfHerunterladen,
        pdfTeilen
    };

})();
