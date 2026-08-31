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

    // ===== Freies Bemerkungsfeld mit vorgefertigten Textbausteinen =====
    // Diese Funktion gab es urspruenglich nur in mobile.html, nicht in
    // liste.html - jetzt fuer beide Seiten gleichermassen ueber die
    // gemeinsame Engine verfuegbar.

    const FREITEXT_VORLAGEN = {
        'freitext-notiz': 'Notiz:\nDie Überprüfung der Arbeitssicherheit verlief sehr produktiv. Das Marktmanagement zeigte ein tiefgehendes Verständnis für die betrieblichen Sicherheitsanforderungen und unterstützte die gemeinsame Bewertung maßgeblich.',
        'freitext-hinweis': 'Hinweis zum Ablauf:\nAufgrund akuter Verpflichtungen der Marktleitung im Bereich der Warenpräsenz und des laufenden Betriebs wurde die Begehung in einem kompakten Zeitfenster durchgeführt. Die Rahmenbedingungen waren dabei durch einen allgemeinen Zeitdruck und eine herausfordernde Personaldecke geprägt. Der Fokus lag daher zielgerichtet auf den wesentlichen Kern- und Gefahrenbereichen. Detail- und Nebenbereiche wurden stichprobenartig betrachtet; die ergänzende Nachprüfung dieser Abschnitte erfolgt im Rahmen einer zeitnahen Folgebegehung.',
        'freitext-fazit-positiv': 'Fazit:\nEin sehr produktiver Rundgang, der von einem partnerschaftlichen Austausch geprägt war. Die Überprüfung der Arbeitssicherheit profitierte maßgeblich von dem tiefen Verständnis des Marktmanagements für die operativen Abläufe. Die reibungslose Zusammenarbeit und die konsequente praktische Umsetzung der Vorgaben vor Ort sind ausdrücklich positiv hervorzuheben.',
        'freitext-fazit-negativ': 'Fazit:\nDer gemeinsame Rundgang machte deutlich, dass bei der Umsetzung der Arbeitssicherheitsstandards vor Ort noch spürbarer Nachholbedarf besteht. Die Abstimmung mit der Marktleitung gestaltete sich stellenweise schwierig. Um das Sicherheitsniveau im Markt auf den geforderten Standard zu bringen, ist eine intensivere Unterstützung und Sensibilisierung des Managements im Tagesgeschäft erforderlich.'
    };

    function freitextEinfuegen(text) {
        const feld = document.getElementById('freitextfeld');
        if (!feld) return;
        const start = feld.selectionStart;
        const end = feld.selectionEnd;
        feld.value = feld.value.substring(0, start) + text + feld.value.substring(end);
        feld.selectionStart = feld.selectionEnd = start + text.length;
        feld.focus();
        speichereStand();
    }

    function freitextLoeschen() {
        const feld = document.getElementById('freitextfeld');
        if (!feld) return;
        feld.value = '';
        speichereStand();
    }

    function initFreitext() {
        document.querySelectorAll('.freitext-buttons .btn[data-text]').forEach(button => {
            button.addEventListener('click', () => {
                freitextEinfuegen(FREITEXT_VORLAGEN[button.dataset.text] || '');
            });
        });
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
            freitext: feldWert('freitextfeld'),
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

        const freitextfeld = document.getElementById('freitextfeld');
        if (freitextfeld && stand.freitext) freitextfeld.value = stand.freitext;

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
        const pageWidth = 210, pageHeight = 297, margin = 15;
        const contentWidth = pageWidth - margin * 2;
        const heute = new Date().toLocaleDateString('de-DE');
        const markt = feldWert('markt') || 'Unbekannt';
        const name = feldWert('name') || '-';
        const marktleitung = feldWert('Marktleitung') || '-';
        const sifa = feldWert('sifa') || '-';
        let y = margin;

        const ROT = [183, 28, 28];
        const spaltenBreiten = [contentWidth * 0.7, contentWidth * 0.1, contentWidth * 0.1, contentWidth * 0.1];

        function miniHeader() {
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Arbeitssicherheits-Checkliste | ${markt}`, margin, 8);
            doc.text(heute, pageWidth - margin, 8, { align: 'right' });
            doc.setDrawColor(200);
            doc.line(margin, 10, pageWidth - margin, 10);
        }

        function neueSeite() {
            doc.addPage();
            miniHeader();
            y = 18;
        }

        function platzPruefen(hoehe) {
            if (y + hoehe > pageHeight - 20) neueSeite();
        }

        function tabellenKopf() {
            doc.setFillColor(...ROT);
            doc.rect(margin, y, contentWidth, 8, 'F');
            doc.setFontSize(9);
            doc.setTextColor(255);
            doc.setFont(undefined, 'bold');
            doc.text('Frage', margin + 3, y + 5.5);
            doc.text('Ja', margin + spaltenBreiten[0] + spaltenBreiten[1] / 2, y + 5.5, { align: 'center' });
            doc.text('Nein', margin + spaltenBreiten[0] + spaltenBreiten[1] + spaltenBreiten[2] / 2, y + 5.5, { align: 'center' });
            doc.text('N/V', margin + spaltenBreiten[0] + spaltenBreiten[1] + spaltenBreiten[2] + spaltenBreiten[3] / 2, y + 5.5, { align: 'center' });
            doc.setFont(undefined, 'normal');
            y += 8;
        }

        // ===== Titelbereich =====
        doc.setFont(undefined, 'bold');
        doc.setFontSize(20);
        doc.setTextColor(33, 37, 41);
        doc.text('Arbeitssicherheits-Checkliste', margin, y + 8);
        doc.setFontSize(12);
        doc.setTextColor(...ROT);
        doc.text(heute, pageWidth - margin, y + 8, { align: 'right' });
        doc.setDrawColor(...ROT);
        doc.setLineWidth(0.8);
        doc.line(margin, y + 12, pageWidth - margin, y + 12);
        y += 22;

        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        doc.setTextColor(0);
        [`Marktnummer: ${markt}`, `Marktleitung: ${marktleitung}`, `Teilnehmer: ${name}`, `SiFa: ${sifa}`].forEach(zeile => {
            doc.text(zeile, margin, y);
            y += 6;
        });
        y += 6;

        // ===== Kategorien als farbige Tabellen =====
        let totalJa = 0, totalNein = 0, totalNV = 0, totalOffen = 0;
        neueSeite();

        CHECKLISTE_KATALOG.forEach((kat, kIdx) => {
            const geschaetzteHoehe = 16 + 8 + kat.fragen.length * 8;
            if (y + Math.min(geschaetzteHoehe, pageHeight - 38) > pageHeight - 20 && y > 18) {
                neueSeite();
            } else if (y > 18) {
                y += 6;
            }

            doc.setFillColor(245, 233, 233);
            doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
            doc.setFontSize(12);
            doc.setTextColor(91, 33, 33);
            doc.setFont(undefined, 'bold');
            doc.text(`${kat.nummer} ${kat.name}`, margin + 5, y + 7);
            doc.setFont(undefined, 'normal');
            y += 16;

            tabellenKopf();

            kat.fragen.forEach((f, fIdx) => {
                const zeile = document.querySelector(`.frage-zeile[data-name="frage-${kIdx}-${fIdx}"]`);
                const checked = zeile ? zeile.querySelector('input[type="radio"]:checked') : null;
                const antwort = checked ? checked.value : null;

                doc.setFontSize(9);
                const frageZeilen = doc.splitTextToSize(f.frage, spaltenBreiten[0] - 6);
                const rowHoehe = Math.max(8, frageZeilen.length * 4 + 4);

                if (y + rowHoehe > pageHeight - 20) {
                    neueSeite();
                    tabellenKopf();
                }

                if (fIdx % 2 === 1) {
                    doc.setFillColor(248, 248, 248);
                    doc.rect(margin, y, contentWidth, rowHoehe, 'F');
                }

                doc.setDrawColor(222, 226, 230);
                let x = margin;
                spaltenBreiten.forEach(b => { doc.rect(x, y, b, rowHoehe); x += b; });

                doc.setTextColor(0);
                doc.text(frageZeilen, margin + 3, y + 4);

                const mitteY = y + rowHoehe / 2 + 1;
                if (antwort === 'ja') {
                    totalJa++;
                    doc.setFillColor(212, 237, 218);
                    doc.rect(margin + spaltenBreiten[0], y, spaltenBreiten[1], rowHoehe, 'F');
                    doc.setTextColor(46, 125, 50);
                    doc.setFont(undefined, 'bold');
                    doc.text('Ja', margin + spaltenBreiten[0] + spaltenBreiten[1] / 2, mitteY, { align: 'center' });
                } else if (antwort === 'nein') {
                    totalNein++;
                    doc.setFillColor(248, 215, 218);
                    doc.rect(margin + spaltenBreiten[0] + spaltenBreiten[1], y, spaltenBreiten[2], rowHoehe, 'F');
                    doc.setTextColor(...ROT);
                    doc.setFont(undefined, 'bold');
                    doc.text('Nein', margin + spaltenBreiten[0] + spaltenBreiten[1] + spaltenBreiten[2] / 2, mitteY, { align: 'center' });
                } else if (antwort === 'nv') {
                    totalNV++;
                    doc.setFillColor(226, 227, 229);
                    doc.rect(margin + spaltenBreiten[0] + spaltenBreiten[1] + spaltenBreiten[2], y, spaltenBreiten[3], rowHoehe, 'F');
                    doc.setTextColor(102);
                    doc.setFont(undefined, 'bold');
                    doc.text('N/V', margin + spaltenBreiten[0] + spaltenBreiten[1] + spaltenBreiten[2] + spaltenBreiten[3] / 2, mitteY, { align: 'center' });
                } else {
                    totalOffen++;
                }
                doc.setFont(undefined, 'normal');
                y += rowHoehe;
            });
        });

        // ===== Maßnahmen =====
        const massnahmenZeilen = document.querySelectorAll('#massnahmenTabelle tr');
        if (massnahmenZeilen.length > 0) {
            platzPruefen(14);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(13);
            doc.setTextColor(33, 37, 41);
            doc.text('Maßnahmen (aus „Nein"-Antworten)', margin, y);
            y += 8;

            massnahmenZeilen.forEach(tr => {
                const zellen = tr.querySelectorAll('td');
                if (zellen.length < 3) return;
                const frage = zellen[1].textContent.trim();
                const massnahme = zellen[2].textContent.trim();
                const frageZeilen = doc.splitTextToSize(frage, contentWidth);
                const massnahmeZeilen = doc.splitTextToSize(massnahme, contentWidth);
                platzPruefen((frageZeilen.length + massnahmeZeilen.length) * 4.2 + 6);

                doc.setFont(undefined, 'bold');
                doc.setFontSize(9);
                doc.setTextColor(33, 37, 41);
                doc.text(frageZeilen, margin, y);
                y += frageZeilen.length * 4.2 + 1;

                doc.setFont(undefined, 'normal');
                doc.setTextColor(71, 85, 105);
                doc.text(massnahmeZeilen, margin, y);
                y += massnahmeZeilen.length * 4.2 + 5;
            });
        }

        // ===== Freies Bemerkungsfeld =====
        platzPruefen(20);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.setTextColor(33, 37, 41);
        doc.text('Freies Bemerkungsfeld / Besonderheiten', margin, y);
        y += 6;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105);
        const freitextWert = feldWert('freitextfeld').trim() || 'Keine zusätzlichen Bemerkungen eingetragen.';
        const freitextZeilen = doc.splitTextToSize(freitextWert, contentWidth);
        platzPruefen(freitextZeilen.length * 4.2);
        doc.text(freitextZeilen, margin, y);
        y += freitextZeilen.length * 4.2 + 8;

        // ===== Unterschrift =====
        if (!istCanvasLeer()) {
            platzPruefen(40);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(33, 37, 41);
            doc.text('Unterschrift', margin, y);
            y += 4;
            try {
                doc.addImage(canvas.toDataURL('image/png'), 'PNG', margin, y, 70, 25, undefined, 'FAST');
            } catch (e) { /* Bild konnte nicht eingebettet werden */ }
            y += 30;
        }

        // ===== Zusammenfassungs-Box =====
        platzPruefen(45);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.setTextColor(33, 37, 41);
        doc.text('Zusammenfassung', margin, y);
        doc.setFont(undefined, 'normal');
        y += 8;

        const gesamt = totalJa + totalNein + totalNV + totalOffen;
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(200);
        doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'FD');
        const boxY = y + 8;
        const spalte = contentWidth / 4;
        const box = (index, wert, label, fuellR, fuellG, fuellB, textR, textG, textB) => {
            const bx = margin + spalte * index;
            doc.setFillColor(fuellR, fuellG, fuellB);
            doc.roundedRect(bx + 5, boxY, spalte - 10, 20, 2, 2, 'F');
            doc.setTextColor(textR, textG, textB);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(String(wert), bx + spalte / 2, boxY + 10, { align: 'center' });
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.text(label, bx + spalte / 2, boxY + 17, { align: 'center' });
        };
        box(0, totalJa, 'Ja', 212, 237, 218, 46, 125, 50);
        box(1, totalNein, 'Nein', 248, 215, 218, ...ROT);
        box(2, totalNV, 'N/V', 226, 227, 229, 102, 102, 102);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...ROT);
        doc.roundedRect(margin + spalte * 3 + 5, boxY, spalte - 10, 20, 2, 2, 'FD');
        doc.setTextColor(...ROT);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(String(gesamt), margin + spalte * 3 + spalte / 2, boxY + 10, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text('Gesamt', margin + spalte * 3 + spalte / 2, boxY + 17, { align: 'center' });
        y += 45;

        // ===== Fußnotiz =====
        platzPruefen(16);
        doc.setDrawColor(200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        doc.setFontSize(8);
        doc.setTextColor(100);
        const hinweis = doc.splitTextToSize(
            'Hinweis: Dieses Dokument wurde elektronisch erstellt und ist auch ohne handschriftliche Unterschrift gültig, sofern die digitale Signatur vorliegt.',
            contentWidth
        );
        doc.text(hinweis, margin, y);
        y += hinweis.length * 3.5 + 4;
        doc.text(`Erstellt am: ${heute} | Markt: ${markt} | SiFa: ${sifa}`, margin, y);

        // ===== Seitenzahlen =====
        const seiten = doc.getNumberOfPages();
        for (let i = 1; i <= seiten; i++) {
            doc.setPage(i);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Seite ${i} von ${seiten}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
        }

        return doc;
    }

    // Text fuer den E-Mail-Versand (navigator.share() UND "Mail vorbereiten").
    // iOS uebernimmt title/text beim Teilen an die Mail-App oft nicht
    // zuverlaessig - daher zusaetzlich der separate, mailto:-basierte Weg
    // ueber mailVorbereiten() unten (analog zu ASiC Handel).
    function emailBetreff() {
        return `Arbeitssicherheits-Checkliste — Markt ${feldWert('markt') || ''}`;
    }
    function emailText() {
        const markt = feldWert('markt') || '';
        const sifa = feldWert('sifa') || '';
        return `Sehr geehrte Damen und Herren,\n\nim Rahmen der turnusmäßigen Arbeitssicherheitsbegehung übersende ich Ihnen anbei das Begehungsprotokoll des Marktes ${markt} zur sachlichen Prüfung.\n\nBitte prüfen Sie die dokumentierten Feststellungen und veranlassen Sie die Umsetzung der erforderlichen Maßnahmen.\n\nMit freundlichen Grüßen\n${sifa}\nFachkraft für Arbeitssicherheit (SiFa)`;
    }

    // Zuverlaessige Alternative zu navigator.share() fuer Betreff/Text: oeffnet
    // eine neue Mail mit korrekt befuelltem Betreff/Text - kann aber aus einer
    // Web-App heraus keinen Anhang setzen. Das per "PDF speichern"/"PDF teilen"
    // gesicherte PDF muss hier einmal zusaetzlich manuell angehaengt werden.
    function mailVorbereiten() {
        const subject = encodeURIComponent(emailBetreff());
        const body = encodeURIComponent(emailText());
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
                    await navigator.share({ files: [file], title: emailBetreff(), text: emailText() });
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
        initFreitext();
        ladeStand();
        aktualisiereMassnahmenTabelle();

        const heute = new Date();
        const datumsfeld = document.getElementById('datum');
        if (datumsfeld) {
            datumsfeld.textContent = heute.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        document.querySelectorAll('#markt, #name, #sifa, #Marktleitung, #freitextfeld').forEach(el => {
            el.addEventListener('input', speichereStand);
        });
    }

    return {
        init,
        weiterZuFotos,
        freitextLoeschen,
        exportiereMassnahmen,
        unterschriftLoeschen,
        formularZuruecksetzen,
        pdfHerunterladen,
        pdfTeilen,
        mailVorbereiten
    };

})();
