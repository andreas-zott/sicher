// ==========================================================================
// GBU Zentrale — generische Engine
// ==========================================================================
//
// Liest die aktuelle GBU-ID aus der Adresse (gbu.html?id=...), sucht den
// passenden Datensatz in GBU_KATALOG (js/gbu-daten.js) und rendert daraus
// das komplette Formular sowie — auf Wunsch — ein PDF. Eine neue
// Gefährdungsbeurteilung braucht keine Änderung an dieser Datei, nur einen
// neuen Eintrag in gbu-daten.js.
//
// PDF-Erzeugung bewusst direkt mit jsPDF (Text/Tabellen selbst gezeichnet),
// NICHT über html2canvas/html2pdf.js: erzeugt durchsuchbaren Text statt
// eines Bild-Screenshots, deutlich kleinere Dateien, keine Layout-Artefakte
// durch Canvas-Rendering, und keine Abhängigkeit von einem CDN.

const GbuEngine = (() => {

    let aktuelleGbu = null;
    const RISIKO_SCHWELLE_NIEDRIG = 6;
    const RISIKO_SCHWELLE_MITTEL = 12;

    function ladeAktuelleGbu() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        return GBU_KATALOG.find(g => g.id === id) || null;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str === undefined || str === null ? '' : String(str);
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return escapeHtml(str).replace(/"/g, '&quot;');
    }

    function berechneRisikostufe(zahl) {
        if (zahl <= RISIKO_SCHWELLE_NIEDRIG) return { text: 'Niedrig', klasse: 'risiko-niedrig' };
        if (zahl <= RISIKO_SCHWELLE_MITTEL) return { text: 'Mittel', klasse: 'risiko-mittel' };
        return { text: 'Hoch', klasse: 'risiko-hoch' };
    }

    function zahlOptionen(auswahl, art) {
        const beschriftungen = art === 'w'
            ? { 1: '1 – selten', 5: '5 – sehr häufig' }
            : { 1: '1 – gering', 5: '5 – katastrophal' };
        let html = '';
        for (let i = 1; i <= 5; i++) {
            const label = beschriftungen[i] || String(i);
            html += `<option value="${i}"${i === auswahl ? ' selected' : ''}>${label}</option>`;
        }
        return html;
    }

    // ===== Rendering =====

    function renderFormular(gbu) {
        document.getElementById('page-title').textContent = gbu.titel + ' — GBU Zentrale';
        document.getElementById('gbu-titel').textContent = 'Gefährdungsbeurteilung — ' + gbu.titel;

        if (gbu.typ === 'pruefliste') {
            renderPruefliste(gbu);
            document.getElementById('gbu-form').style.display = 'block';
            return;
        }

        if (gbu.hatMaschine) {
            document.getElementById('abschnitt-maschine').innerHTML = `
                <h2>2. Beschreibung der Maschine</h2>
                <div class="card">
                    <label for="f-maschinentyp">Maschinentyp / Modell</label>
                    <input type="text" id="f-maschinentyp" value="${escapeHtml(gbu.maschine.typ)}">
                    <label for="f-hersteller">Hersteller</label>
                    <input type="text" id="f-hersteller" value="${escapeHtml(gbu.maschine.hersteller)}">
                    <label for="f-baujahr">Baujahr / Seriennummer</label>
                    <input type="text" id="f-baujahr" value="${escapeHtml(gbu.maschine.baujahrSeriennummer)}">
                    <label for="f-verwendungszweck">Verwendungszweck</label>
                    <textarea id="f-verwendungszweck" rows="2">${escapeHtml(gbu.maschine.verwendungszweck)}</textarea>
                </div>
            `;
        } else {
            document.getElementById('abschnitt-taetigkeit').innerHTML = `
                <h2>2. Beschreibung der Tätigkeit</h2>
                <div class="card">
                    <ul id="f-taetigkeiten-liste" style="margin:0; padding-left:20px;">
                        ${gbu.taetigkeiten.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        document.querySelector('#tabelle-gefaehrdungen tbody').innerHTML = gbu.gefaehrdungen.map(g => `
            <tr>
                <td><strong>${escapeHtml(g.gefahr)}</strong></td>
                <td>${escapeHtml(g.beschreibung)}</td>
                <td>${escapeHtml(g.folgen)}</td>
            </tr>
        `).join('');

        document.querySelector('#tabelle-massnahmen tbody').innerHTML = gbu.massnahmen.map(m => `
            <tr>
                <td>${escapeHtml(m.gefahr)}</td>
                <td><strong>${escapeHtml(m.massnahme)}</strong></td>
                <td>${escapeHtml(m.beschreibung)}</td>
            </tr>
        `).join('');

        document.getElementById('f-psa').value = gbu.psa;
        document.getElementById('f-restgefaehrdung').value = gbu.restgefaehrdung;

        document.querySelector('#tabelle-risiko tbody').innerHTML = gbu.risikomatrix.map((r, i) => {
            const zahl = r.wahrscheinlichkeit * r.schwere;
            const stufe = berechneRisikostufe(zahl);
            return `
                <tr data-index="${i}">
                    <td>${escapeHtml(r.gefahr)}</td>
                    <td><select onchange="GbuEngine.risikoNeuBerechnen(this)">${zahlOptionen(r.wahrscheinlichkeit, 'w')}</select></td>
                    <td><select onchange="GbuEngine.risikoNeuBerechnen(this)">${zahlOptionen(r.schwere, 's')}</select></td>
                    <td class="risikozahl">${zahl}</td>
                    <td><span class="risiko-badge ${stufe.klasse}">${stufe.text}</span></td>
                </tr>
            `;
        }).join('');

        document.getElementById('gbu-form').style.display = 'block';
    }

    // ===== Prüfliste (mehrteilige Ja/Nein/N.V.-Fragebögen) =====
    // Fuer typ:"pruefliste" - blendet die "standard"-Abschnitte (Gefahr/
    // Massnahme/Risikomatrix) aus und rendert stattdessen die Abschnitte
    // mit Ja/Nein/N.V.-Fragen. Jede Frage traegt ihre Massnahme direkt bei
    // sich (kein Risikomatrix-Konzept hier, analog zu liste.html/
    // checkliste-engine.js im Hauptportal).

    function renderPruefliste(gbu) {
        document.getElementById('abschnitt-standard').style.display = 'none';
        const container = document.getElementById('abschnitt-pruefliste');

        container.innerHTML = gbu.abschnitte.map((abschnitt, aIdx) => `
            <div class="pl-abschnitt">
                <h3 class="pl-abschnitt-titel">${escapeHtml(abschnitt.titel)}</h3>
                ${abschnitt.fragen.map((f, fIdx) => {
                    const name = `pl-${aIdx}-${fIdx}`;
                    return `
                    <div class="pl-frage-zeile" data-name="${name}" data-massnahme="${escapeAttr(f.massnahme)}">
                        <div class="pl-frage-text"><span class="pl-frage-nr">${escapeHtml(f.nr)}</span>${escapeHtml(f.frage)}</div>
                        <div class="pl-antworten">
                            <label class="pl-opt pl-opt-ja"><input type="radio" name="${name}" value="ja"><span>Ja</span></label>
                            <label class="pl-opt pl-opt-nein"><input type="radio" name="${name}" value="nein"><span>Nein</span></label>
                            <label class="pl-opt pl-opt-nv"><input type="radio" name="${name}" value="nv"><span>N/V</span></label>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        `).join('');

        container.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const zeile = radio.closest('.pl-frage-zeile');
                zeile.classList.remove('pl-ja', 'pl-nein', 'pl-nv');
                if (radio.value === 'ja') zeile.classList.add('pl-ja');
                if (radio.value === 'nein') zeile.classList.add('pl-nein');
                if (radio.value === 'nv') zeile.classList.add('pl-nv');
                speichereEntwurf();
            });
        });
    }

    function pruefBeantwortung() {
        const ergebnis = [];
        document.querySelectorAll('.pl-frage-zeile').forEach(zeile => {
            const checked = zeile.querySelector('input[type="radio"]:checked');
            ergebnis.push({
                name: zeile.dataset.name,
                frage: zeile.querySelector('.pl-frage-text').textContent,
                massnahme: zeile.dataset.massnahme,
                antwort: checked ? checked.value : null
            });
        });
        return ergebnis;
    }

    function risikoNeuBerechnen(selectElement) {
        const row = selectElement.closest('tr');
        const selects = row.querySelectorAll('select');
        const w = parseInt(selects[0].value, 10);
        const s = parseInt(selects[1].value, 10);
        const zahl = w * s;
        const stufe = berechneRisikostufe(zahl);
        row.querySelector('.risikozahl').textContent = zahl;
        const badge = row.querySelector('.risiko-badge');
        badge.textContent = stufe.text;
        badge.className = 'risiko-badge ' + stufe.klasse;
    }

    // ===== Unterschriften-Canvas =====

    function setupSignatureCanvas(id) {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let painting = false;

        function getPos(evt) {
            const rect = canvas.getBoundingClientRect();
            const x = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
            const y = (evt.touches ? evt.touches[0].clientY : evt.clientY) - rect.top;
            return { x: x * (canvas.width / rect.width), y: y * (canvas.height / rect.height) };
        }
        function start(evt) { painting = true; const p = getPos(evt); ctx.beginPath(); ctx.moveTo(p.x, p.y); evt.preventDefault(); }
        function draw(evt) {
            if (!painting) return;
            const p = getPos(evt);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.lineCap = 'round';
            ctx.stroke();
            evt.preventDefault();
        }
        function stop() { painting = false; ctx.beginPath(); }

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stop);
        canvas.addEventListener('mouseout', stop);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stop);
    }

    function clearSignature(id) {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        speichereEntwurf();
    }

    function istCanvasLeer(canvas) {
        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < pixel.length; i += 4) {
            if (pixel[i] !== 0) return false;
        }
        return true;
    }

    // ===== Entwurf: nur Absicherung gegen versehentliches Neuladen, KEIN Archiv =====
    // Wird unter einem eigenen Schluessel je GBU-ID gespeichert und beim
    // erneuten Aufruf DERSELBEN GBU wieder eingelesen. Es gibt bewusst keine
    // Liste/Historie mehrerer Eintraege - der Entwurf wird beim naechsten
    // Speichern schlicht ueberschrieben.

    function entwurfSchluessel() {
        return 'gbu-entwurf-' + aktuelleGbu.id;
    }

    function speichereEntwurf() {
        if (!aktuelleGbu) return;
        const daten = { felder: {}, risiko: [], unterschriften: {}, pruefliste: {} };

        document.querySelectorAll('#gbu-form input, #gbu-form textarea, #gbu-form select').forEach(el => {
            if (!el.id) return;
            daten.felder[el.id] = el.value;
        });

        document.querySelectorAll('#tabelle-risiko tbody tr').forEach(row => {
            const selects = row.querySelectorAll('select');
            daten.risiko.push([selects[0].value, selects[1].value]);
        });

        document.querySelectorAll('.pl-frage-zeile').forEach(zeile => {
            const checked = zeile.querySelector('input[type="radio"]:checked');
            if (checked) daten.pruefliste[zeile.dataset.name] = checked.value;
        });

        ['sign1', 'sign2'].forEach(id => {
            const canvas = document.getElementById(id);
            daten.unterschriften[id] = istCanvasLeer(canvas) ? null : canvas.toDataURL('image/png');
        });

        try {
            localStorage.setItem(entwurfSchluessel(), JSON.stringify(daten));
        } catch (e) {
            console.warn('Entwurf konnte nicht gespeichert werden:', e);
        }
    }

    function ladeEntwurf() {
        let gespeichert;
        try {
            gespeichert = localStorage.getItem(entwurfSchluessel());
        } catch (e) { return; }
        if (!gespeichert) return;

        let daten;
        try { daten = JSON.parse(gespeichert); } catch (e) { return; }

        Object.keys(daten.felder || {}).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = daten.felder[id];
        });

        (daten.risiko || []).forEach((paar, i) => {
            const row = document.querySelector(`#tabelle-risiko tbody tr[data-index="${i}"]`);
            if (!row) return;
            const selects = row.querySelectorAll('select');
            selects[0].value = paar[0];
            selects[1].value = paar[1];
            risikoNeuBerechnen(selects[0]);
        });

        Object.keys(daten.pruefliste || {}).forEach(name => {
            const antwort = daten.pruefliste[name];
            const radio = document.querySelector(`input[name="${name}"][value="${antwort}"]`);
            if (!radio) return;
            radio.checked = true;
            const zeile = radio.closest('.pl-frage-zeile');
            zeile.classList.remove('pl-ja', 'pl-nein', 'pl-nv');
            zeile.classList.add('pl-' + antwort);
        });

        Object.keys(daten.unterschriften || {}).forEach(id => {
            const url = daten.unterschriften[id];
            if (!url) return;
            const canvas = document.getElementById(id);
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0);
            img.src = url;
        });
    }

    function formularZuruecksetzen() {
        if (!confirm('Formular wirklich zurücksetzen? Alle Eingaben und Unterschriften gehen dabei verloren.')) return;
        try { localStorage.removeItem(entwurfSchluessel()); } catch (e) {}
        window.location.reload();
    }

    function autosaveEinrichten() {
        document.querySelectorAll('#gbu-form input, #gbu-form textarea, #gbu-form select').forEach(el => {
            el.addEventListener('input', speichereEntwurf);
            el.addEventListener('change', speichereEntwurf);
        });
        ['sign1', 'sign2'].forEach(id => {
            const canvas = document.getElementById(id);
            canvas.addEventListener('mouseup', speichereEntwurf);
            canvas.addEventListener('touchend', speichereEntwurf);
        });
    }

    // ===== Toast =====

    function zeigeToast(text, art) {
        const el = document.getElementById('toast');
        el.textContent = text;
        el.className = 'toast show' + (art === 'error' ? ' error' : '');
        clearTimeout(el._timer);
        el._timer = setTimeout(() => { el.className = 'toast'; }, 3200);
    }

    // ===== PDF-Erzeugung (direkt mit jsPDF, kein html2canvas) =====

    function feldWert(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    }

    function baueDaten() {
        const risiko = [];
        document.querySelectorAll('#tabelle-risiko tbody tr').forEach((row, i) => {
            const selects = row.querySelectorAll('select');
            const w = parseInt(selects[0].value, 10);
            const s = parseInt(selects[1].value, 10);
            risiko.push({
                gefahr: aktuelleGbu.risikomatrix[i].gefahr,
                w, s, zahl: w * s, stufe: berechneRisikostufe(w * s).text
            });
        });

        return {
            unternehmen: feldWert('f-unternehmen'),
            standort: feldWert('f-standort'),
            beurteiler: feldWert('f-beurteiler'),
            datum: feldWert('f-datum'),
            maschinentyp: feldWert('f-maschinentyp'),
            hersteller: feldWert('f-hersteller'),
            baujahr: feldWert('f-baujahr'),
            verwendungszweck: feldWert('f-verwendungszweck'),
            psa: feldWert('f-psa'),
            restgefaehrdung: feldWert('f-restgefaehrdung'),
            restrisiko: feldWert('f-restrisiko'),
            weitereMassnahmen: feldWert('f-weitere-massnahmen'),
            unterweisung: feldWert('f-unterweisung'),
            naechstePruefung: feldWert('f-naechste-pruefung'),
            bemerkungen: feldWert('f-bemerkungen'),
            unterschrift1Name: feldWert('f-unterschrift1-name'),
            unterschrift2Name: feldWert('f-unterschrift2-name'),
            risiko
        };
    }

    function formatDatum(iso) {
        if (!iso) return '—';
        const [j, m, t] = iso.split('-');
        if (!j || !m || !t) return iso;
        return `${t}.${m}.${j}`;
    }

    async function buildPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = 210, pageHeight = 297, margin = 16;
        const contentWidth = pageWidth - margin * 2;
        const d = baueDaten();
        let y = 0;

        const INK = [28, 33, 38], SOFT = [75, 85, 99], SAFETY = [242, 169, 0], LINE = [227, 225, 220];
        const RISK_COLOR = { 'Niedrig': [47, 143, 91], 'Mittel': [217, 142, 4], 'Hoch': [192, 57, 43] };

        function neueSeiteFallsNoetig(hoehe) {
            if (y + hoehe > pageHeight - 18) {
                doc.addPage();
                y = 20;
            }
        }

        function ueberschrift(text) {
            neueSeiteFallsNoetig(14);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(13);
            doc.setTextColor(...INK);
            doc.text(text, margin, y);
            y += 3;
            doc.setDrawColor(...SAFETY);
            doc.setLineWidth(0.8);
            doc.line(margin, y, margin + 30, y);
            y += 7;
        }

        function feldZeile(label, wert) {
            neueSeiteFallsNoetig(7);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(...INK);
            doc.text(label + ':', margin, y);
            const labelBreite = doc.getTextWidth(label + ':');
            const wertX = margin + Math.max(55, labelBreite + 4);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...SOFT);
            const zeilen = doc.splitTextToSize(wert || '—', contentWidth - (wertX - margin));
            doc.text(zeilen, wertX, y);
            y += Math.max(6, zeilen.length * 5);
        }

        function tabelle(kopf, zeilen, spaltenAnteile) {
            const spaltenBreiten = spaltenAnteile.map(a => a * contentWidth);
            neueSeiteFallsNoetig(12);

            function kopfZeichnen() {
                doc.setFillColor(...INK);
                doc.rect(margin, y, contentWidth, 7, 'F');
                doc.setFont(undefined, 'bold');
                doc.setFontSize(8.3);
                doc.setTextColor(255, 255, 255);
                let x = margin + 2;
                kopf.forEach((h, i) => { doc.text(h, x, y + 5); x += spaltenBreiten[i]; });
                y += 7;
            }

            kopfZeichnen();

            zeilen.forEach((zeile) => {
                doc.setFont(undefined, 'normal');
                doc.setFontSize(8.3);
                const wrapped = zeile.map((zelle, i) => doc.splitTextToSize(String(zelle), spaltenBreiten[i] - 4));
                const zeilenHoehe = Math.max(...wrapped.map(w => w.length)) * 4.2 + 3;

                if (y + zeilenHoehe > pageHeight - 18) {
                    doc.addPage();
                    y = 20;
                    kopfZeichnen();
                }

                doc.setDrawColor(...LINE);
                doc.setTextColor(...INK);
                let x = margin + 2;
                wrapped.forEach((w, i) => {
                    doc.text(w, x, y + 4.5);
                    x += spaltenBreiten[i];
                });
                y += zeilenHoehe;
                doc.line(margin, y - 1, margin + contentWidth, y - 1);
            });
            y += 6;
        }

        // Kopfbereich
        doc.setFillColor(...INK);
        doc.rect(0, 0, pageWidth, 34, 'F');
        doc.setFillColor(...SAFETY);
        doc.rect(0, 34, pageWidth, 2.5, 'F');
        doc.setFont(undefined, 'bold');
        doc.setFontSize(17);
        doc.setTextColor(255, 255, 255);
        doc.text('Gefährdungsbeurteilung', margin, 16);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(aktuelleGbu.titel, margin, 25);

        y = 46;

        ueberschrift('1. Allgemeine Angaben');
        feldZeile('Unternehmen', d.unternehmen);
        feldZeile('Abteilung / Standort', d.standort);
        feldZeile('Beurteiler', d.beurteiler);
        feldZeile('Datum', formatDatum(d.datum));
        y += 4;

        if (aktuelleGbu.typ === 'pruefliste') {
            const FARBE = { ja: [47, 143, 91], nein: [192, 57, 43], nv: [107, 114, 128] };
            const antworten = pruefBeantwortung();
            let fGesamt = 0;

            aktuelleGbu.abschnitte.forEach((abschnitt) => {
                neueSeiteFallsNoetig(12);
                doc.setFont(undefined, 'bold');
                doc.setFontSize(11);
                doc.setTextColor(...INK);
                doc.text(abschnitt.titel, margin, y);
                y += 6;

                abschnitt.fragen.forEach((f) => {
                    const eintrag = antworten[fGesamt];
                    fGesamt++;
                    const frageZeilen = doc.splitTextToSize(f.nr + '  ' + f.frage, contentWidth - 16);
                    neueSeiteFallsNoetig(frageZeilen.length * 4.2 + 3);

                    doc.setFont(undefined, 'normal');
                    doc.setFontSize(8.6);
                    doc.setTextColor(60, 60, 60);
                    doc.text(frageZeilen, margin, y);

                    const antwortText = eintrag && eintrag.antwort === 'ja' ? 'Ja' : eintrag && eintrag.antwort === 'nein' ? 'Nein' : eintrag && eintrag.antwort === 'nv' ? 'N/V' : '—';
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(...(FARBE[eintrag && eintrag.antwort] || [150, 150, 150]));
                    doc.text(antwortText, margin + contentWidth - 12, y);

                    y += frageZeilen.length * 4.2 + 3;
                    doc.setDrawColor(...LINE);
                    doc.line(margin, y - 1.5, margin + contentWidth, y - 1.5);
                });
                y += 4;
            });

            const neinEintraege = antworten.filter(e => e.antwort === 'nein');
            if (neinEintraege.length > 0) {
                neueSeiteFallsNoetig(14);
                ueberschrift('Maßnahmen (aus „Nein“-Antworten)');
                neinEintraege.forEach(e => {
                    const frageZeilen = doc.splitTextToSize(e.frage, contentWidth);
                    const massnahmeZeilen = doc.splitTextToSize(e.massnahme, contentWidth);
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
        } else if (aktuelleGbu.hatMaschine) {
            ueberschrift('2. Beschreibung der Maschine');
            feldZeile('Maschinentyp / Modell', d.maschinentyp);
            feldZeile('Hersteller', d.hersteller);
            feldZeile('Baujahr / Seriennummer', d.baujahr);
            feldZeile('Verwendungszweck', d.verwendungszweck);
        } else {
            ueberschrift('2. Beschreibung der Tätigkeit');
            aktuelleGbu.taetigkeiten.forEach(t => {
                neueSeiteFallsNoetig(6);
                doc.setFont(undefined, 'normal');
                doc.setFontSize(9.5);
                doc.setTextColor(...SOFT);
                doc.text('•  ' + t, margin, y);
                y += 5.5;
            });
        }
        y += 4;

        if (aktuelleGbu.typ !== 'pruefliste') {
        ueberschrift('3. Gefährdungen');
        tabelle(
            ['Gefahr', 'Beschreibung', 'Mögliche Folgen'],
            aktuelleGbu.gefaehrdungen.map(g => [g.gefahr, g.beschreibung, g.folgen]),
            [0.22, 0.42, 0.36]
        );

        ueberschrift('4. Schutzmaßnahmen');
        tabelle(
            ['Gefahr', 'Maßnahme', 'Beschreibung'],
            aktuelleGbu.massnahmen.map(m => [m.gefahr, m.massnahme, m.beschreibung]),
            [0.28, 0.28, 0.44]
        );
        feldZeile('PSA', d.psa);
        y += 4;

        ueberschrift('5. Bewertung der Risiken');
        neueSeiteFallsNoetig(12);
        {
            const spaltenAnteile = [0.4, 0.15, 0.15, 0.12, 0.18];
            const spaltenBreiten = spaltenAnteile.map(a => a * contentWidth);
            doc.setFillColor(...INK);
            doc.rect(margin, y, contentWidth, 7, 'F');
            doc.setFont(undefined, 'bold');
            doc.setFontSize(8.3);
            doc.setTextColor(255, 255, 255);
            const kopf = ['Gefährdung', 'Wahrsch.', 'Schwere', 'Risikozahl', 'Stufe'];
            let x = margin + 2;
            kopf.forEach((h, i) => { doc.text(h, x, y + 5); x += spaltenBreiten[i]; });
            y += 7;

            d.risiko.forEach(r => {
                neueSeiteFallsNoetig(7);
                doc.setFont(undefined, 'normal');
                doc.setFontSize(8.3);
                doc.setTextColor(...INK);
                const gefahrZeilen = doc.splitTextToSize(r.gefahr, spaltenBreiten[0] - 4);
                const hoehe = Math.max(gefahrZeilen.length * 4.2, 5.5) + 2;
                let x2 = margin + 2;
                doc.text(gefahrZeilen, x2, y + 4); x2 += spaltenBreiten[0];
                doc.text(String(r.w), x2, y + 4); x2 += spaltenBreiten[1];
                doc.text(String(r.s), x2, y + 4); x2 += spaltenBreiten[2];
                doc.text(String(r.zahl), x2, y + 4); x2 += spaltenBreiten[3];
                doc.setTextColor(...(RISK_COLOR[r.stufe] || INK));
                doc.setFont(undefined, 'bold');
                doc.text(r.stufe, x2, y + 4);
                y += hoehe;
                doc.setDrawColor(...LINE);
                doc.line(margin, y - 1, margin + contentWidth, y - 1);
            });
            y += 6;
        }

        feldZeile('Restgefährdung nach Maßnahmen', d.restgefaehrdung);
        feldZeile('Restrisiko vertretbar?', d.restrisiko);
        feldZeile('Weitere Maßnahmen erforderlich?', d.weitereMassnahmen || 'Keine');
        y += 4;

        ueberschrift('6. Dokumentation');
        feldZeile('Unterweisung durchgeführt?', d.unterweisung);
        feldZeile('Datum der nächsten Prüfung', formatDatum(d.naechstePruefung));
        feldZeile('Bemerkungen', d.bemerkungen);
        y += 4;
        }

        ueberschrift('7. Unterschriften');
        neueSeiteFallsNoetig(45);
        const signBreite = (contentWidth - 10) / 2;
        [{ id: 'sign1', name: d.unterschrift1Name }, { id: 'sign2', name: d.unterschrift2Name }].forEach((s, i) => {
            const x = margin + i * (signBreite + 10);
            doc.setDrawColor(...LINE);
            doc.rect(x, y, signBreite, 26);
            const canvas = document.getElementById(s.id);
            if (!istCanvasLeer(canvas)) {
                try {
                    const bild = canvas.toDataURL('image/png');
                    doc.addImage(bild, 'PNG', x + 2, y + 2, signBreite - 4, 22, undefined, 'FAST');
                } catch (e) { /* Bild konnte nicht eingebettet werden */ }
            }
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...SOFT);
            doc.text(s.name || '—', x, y + 31);
        });
        y += 40;

        // Seitenzahlen
        const seiten = doc.getNumberOfPages();
        for (let i = 1; i <= seiten; i++) {
            doc.setPage(i);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(150, 150, 150);
            doc.text(`Seite ${i} von ${seiten}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
            doc.text('GBU Zentrale — ' + aktuelleGbu.titel, margin, pageHeight - 8);
        }

        return doc;
    }

    function pdfDateiname() {
        const teil = aktuelleGbu.id.replace(/[^a-z0-9-]+/gi, '-');
        const datum = new Date().toISOString().split('T')[0];
        return `GBU_${teil}_${datum}.pdf`;
    }

    async function pdfHerunterladen() {
        try {
            zeigeToast('PDF wird erzeugt …');
            const doc = await buildPdf();
            doc.save(pdfDateiname());
            zeigeToast('PDF gespeichert');
        } catch (err) {
            console.error('PDF-Erzeugung fehlgeschlagen:', err);
            zeigeToast('PDF-Erzeugung fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
        }
    }

    async function pdfTeilen() {
        let doc;
        try {
            doc = await buildPdf();
        } catch (err) {
            console.error('PDF-Erzeugung fehlgeschlagen:', err);
            zeigeToast('PDF-Erzeugung fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
            return;
        }

        const dateiname = pdfDateiname();
        const blob = doc.output('blob');
        const text = `Anbei die Gefährdungsbeurteilung „${aktuelleGbu.titel}“.`;

        try {
            if (navigator.canShare && typeof File !== 'undefined') {
                const file = new File([blob], dateiname, { type: 'application/pdf' });
                if (navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({ files: [file], title: 'Gefährdungsbeurteilung — ' + aktuelleGbu.titel, text });
                        zeigeToast('PDF geteilt');
                        return;
                    } catch (err) {
                        if (err && err.name === 'AbortError') return;
                        console.error('Teilen fehlgeschlagen, falle auf Download zurück:', err);
                    }
                }
            }
            doc.save(dateiname);
            zeigeToast('PDF gespeichert (Teilen auf diesem Gerät nicht verfügbar)');
        } catch (err) {
            console.error('PDF-Teilen fehlgeschlagen:', err);
            zeigeToast('PDF-Teilen fehlgeschlagen: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
        }
    }

    // ===== Initialisierung =====

    function init() {
        aktuelleGbu = ladeAktuelleGbu();
        if (!aktuelleGbu) {
            document.getElementById('gbu-nicht-gefunden').style.display = 'block';
            return;
        }
        renderFormular(aktuelleGbu);
        setupSignatureCanvas('sign1');
        setupSignatureCanvas('sign2');
        ladeEntwurf();
        autosaveEinrichten();
    }

    return {
        init,
        risikoNeuBerechnen,
        clearSignature,
        formularZuruecksetzen,
        pdfHerunterladen,
        pdfTeilen
    };

})();
