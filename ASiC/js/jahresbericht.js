// ==========================================================================
// ASiC Handel — Jahresbericht aus dem Team-Archiv (ab 1.55-14)
// ==========================================================================
// Nur in der Benutzerverwaltung (also nur für Administratoren). Lädt alle
// Begehungen des gewählten Jahres aus dem Team-Archiv (list.php + load.php
// über nasFetch, mit Zugriffsschlüssel und Anmeldung) und erstellt daraus
//   - ein PDF mit Briefkopf (Absender aus den Einstellungen des Servers),
//   - oder eine CSV-Datei für Excel.
// Gezählt werden je Begehung die mit "Mangel" bewerteten Prüfpunkte.
// Das PDF wird – wie alle PDFs der App – zusätzlich im PDF-Archiv abgelegt
// (Unterordner "Jahresberichte"), wenn das PDF-Archiv eingeschaltet ist.
// Alle Texte aus dem Server werden nur als Text verwendet, nie als HTML.
// ==========================================================================

(function () {
    'use strict';

    const el = id => document.getElementById(id);
    if (!el('jb-pdf')) return;

    const FELDER = ['firma', 'abteilung', 'strasse', 'ort', 'land', 'ansprechpartner', 'telefon', 'email'];
    let briefkopf = {};
    let dateien = null;          // Metadaten aus list.php
    let laeuft = false;

    function status(text, art) {
        const s = el('jb-status');
        s.textContent = text || '';
        s.className = 's-status' + (art === 'ok' ? ' is-ok' : (art === 'fehler' || art === 'warnung') ? ' is-error' : '');
    }

    function sperren(an) {
        laeuft = an;
        ['jb-pdf', 'jb-csv', 'jb-jahr'].forEach(id => { el(id).disabled = an; });
    }

    // ---------- Briefkopf ----------
    function briefkopfAnzeigen(b) {
        briefkopf = Object.assign({}, b || {});
        FELDER.forEach(f => { const i = el('jb-' + f); if (i) i.value = briefkopf[f] || ''; });
    }

    document.addEventListener('asic-einstellungen', ev => {
        if (ev && ev.detail && ev.detail.briefkopf) briefkopfAnzeigen(ev.detail.briefkopf);
    });
    // falls die Benutzerverwaltung schneller geladen hat als diese Datei
    if (window.asicTeamEinstellungenLetzte && window.asicTeamEinstellungenLetzte.briefkopf) {
        briefkopfAnzeigen(window.asicTeamEinstellungenLetzte.briefkopf);
    }

    el('jb-form').addEventListener('submit', async ev => {
        ev.preventDefault();
        const neu = {};
        FELDER.forEach(f => { neu[f] = (el('jb-' + f).value || '').trim(); });
        const knopf = el('jb-speichern');
        knopf.disabled = true;
        el('jb-bk-status').textContent = 'Wird gespeichert …';
        try {
            const res = await nasFetch('benutzer.php', '', {
                method: 'POST', cache: 'no-store',
                headers: { 'Content-Type': 'application/json', 'X-ASiC': '1' },
                body: JSON.stringify({ aktion: 'briefkopf', briefkopf: neu })
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j.ok) throw new Error(j.message || ('Fehler ' + res.status));
            briefkopfAnzeigen(j.einstellungen && j.einstellungen.briefkopf);
            el('jb-bk-status').textContent = 'Briefkopf gespeichert.';
            if (typeof showToast === 'function') showToast('Briefkopf gespeichert');
        } catch (err) {
            el('jb-bk-status').textContent = 'Nicht gespeichert: ' + err.message;
        } finally {
            knopf.disabled = false;
        }
    });

    // ---------- Daten ----------
    // Datum als JJJJ-MM-TT oder TT.MM.JJJJ
    function jahrAus(datum) {
        const s = String(datum || '');
        const m = /^(\d{4})-\d{2}-\d{2}/.exec(s) || /^\d{1,2}\.\d{1,2}\.(\d{4})/.exec(s);
        return m ? m[1] : '';
    }

    // list.php liefert datumISO (JJJJ-MM-TT) und datum (TT.MM.JJJJ)
    function dateiJahr(f) {
        return jahrAus(f.datumISO) || jahrAus(f.datum);
    }

    function dateiName(f) {
        return f.fileName || f.filename || '';
    }

    function datumDe(iso) {
        const s = String(iso || '');
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
        if (m) return m[3] + '.' + m[2] + '.' + m[1];
        return /^\d{1,2}\.\d{1,2}\.\d{4}/.test(s) ? s.slice(0, 10) : '–';
    }

    // Sortierschlüssel JJJJ-MM-TT, auch aus TT.MM.JJJJ
    function datumIso(s) {
        s = String(s || '');
        const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(s);
        return m ? m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0') : s.slice(0, 10);
    }

    function heuteDe() {
        const d = new Date();
        return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
    }

    function heuteIso() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    async function jahreLaden() {
        const auswahl = el('jb-jahr');
        try {
            dateien = await getServerFiles();
            const jahre = new Set();
            dateien.forEach(f => { const j = dateiJahr(f); if (j) jahre.add(j); });
            jahre.add(String(new Date().getFullYear()));
            auswahl.textContent = '';
            [...jahre].sort().reverse().forEach(j => {
                const o = document.createElement('option');
                o.value = j;
                o.textContent = j;
                auswahl.append(o);
            });
            status('');
        } catch (err) {
            auswahl.textContent = '';
            const o = document.createElement('option');
            o.value = String(new Date().getFullYear());
            o.textContent = o.value;
            auswahl.append(o);
            status('Team-Archiv nicht erreichbar: ' + err.message, 'fehler');
        }
    }

    async function begehungenDesJahres(jahr) {
        if (!dateien) dateien = await getServerFiles();
        const kandidaten = dateien.filter(f => dateiName(f) && (!dateiJahr(f) || dateiJahr(f) === jahr));
        const zeilen = [];
        let fertig = 0, fehlgeschlagen = 0;
        status('Lade Begehungen aus dem Team-Archiv … 0 von ' + kandidaten.length);
        // höchstens 4 gleichzeitig, damit der Server nicht überlastet wird
        let naechste = 0;
        async function arbeiter() {
            while (naechste < kandidaten.length) {
                const f = kandidaten[naechste++];
                try {
                    const r = await fetchServerRecord(dateiName(f));
                    const c = (r && r.companyInfo) || {};
                    const datum = datumIso(c.datum || f.datumISO || f.datum);
                    if (jahrAus(datum) === jahr) {
                        let maengel = 0;
                        Object.values((r && r.ratings) || {}).forEach(v => { if (v === 'mangel') maengel++; });
                        zeilen.push({
                            markt: String(c.marktnummer || f.marktnummer || '').trim(),
                            ort: String(c.plzOrt || f.plzOrt || '').trim(),
                            datum,
                            pruefer: String(c.pruefername || '').trim(),
                            maengel
                        });
                    }
                } catch (e) {
                    fehlgeschlagen++;
                }
                fertig++;
                status('Lade Begehungen aus dem Team-Archiv … ' + fertig + ' von ' + kandidaten.length);
            }
        }
        await Promise.all([arbeiter(), arbeiter(), arbeiter(), arbeiter()]);
        zeilen.sort((a, b) => a.markt.localeCompare(b.markt, 'de', { numeric: true }) || a.datum.localeCompare(b.datum));
        return { zeilen, fehlgeschlagen };
    }

    function zusammenfassung(zeilen) {
        const maerkte = new Set(zeilen.map(z => z.markt).filter(Boolean));
        const summe = zeilen.reduce((s, z) => s + z.maengel, 0);
        const schnitt = zeilen.length ? summe / zeilen.length : 0;
        return { begehungen: zeilen.length, maerkte: maerkte.size, maengel: summe, schnitt };
    }

    function zahlDe(x, stellen) {
        return Number(x).toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
    }

    async function ersteller() {
        try {
            const s = window.asicAnmeldung ? await window.asicAnmeldung : null;
            return (s && s.benutzer && (s.benutzer.name || s.benutzer.kennung)) || '';
        } catch (e) { return ''; }
    }

    // ---------- PDF ----------
    // jsPDF-Standardschriften kennen nur den westeuropäischen Zeichensatz:
    // Zeichen außerhalb davon werden ersetzt (Gedankenstrich, Anführungszeichen …).
    function pdfText(s) {
        return String(s == null ? '' : s)
            .replace(/[‒–—−]/g, '-')
            .replace(/[“”„]/g, '"')
            .replace(/[‘’‚]/g, "'")
            .replace(/…/g, '...')
            .replace(/[^\x00-\xFF]/g, '');
    }

    function kuerzen(doc, text, breite) {
        let t = pdfText(text);
        if (doc.getTextWidth(t) <= breite) return t;
        while (t.length > 1 && doc.getTextWidth(t + '...') > breite) t = t.slice(0, -1);
        return t + '...';
    }

    // Ab 1.55-15: Logo oben rechts im Briefkopf, wenn im App-Ordner die Datei
    // "briefkopf-logo.png" liegt (im IT-Paket enthalten). Fehlt sie, bleibt
    // der Platz leer.
    async function ladeLogo() {
        try {
            const res = await fetch('briefkopf-logo.png', { cache: 'no-store', credentials: 'same-origin' });
            if (!res.ok || !/image\/png/.test(res.headers.get('Content-Type') || 'image/png')) return null;
            const blob = await res.blob();
            const daten = await new Promise((ok, fehler) => {
                const r = new FileReader();
                r.onload = () => ok(String(r.result));
                r.onerror = () => fehler(r.error);
                r.readAsDataURL(blob);
            });
            const masse = await new Promise(ok => {
                const bild = new Image();
                bild.onload = () => ok({ w: bild.naturalWidth, h: bild.naturalHeight });
                bild.onerror = () => ok(null);
                bild.src = daten;
            });
            return masse && masse.w && masse.h ? { daten, w: masse.w, h: masse.h } : null;
        } catch (e) {
            return null;
        }
    }

    function baueJahresberichtPdf(jahr, zeilen, werte, von, logo) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const R = 20, B = 210 - 2 * R, UNTEN = 297 - 22;
        const ROT = [204, 7, 30], TINTE = [28, 34, 38], GRAU = [100, 112, 122], LINIE = [221, 225, 222];
        const bk = briefkopf || {};

        // Briefkopf
        let y = 20;
        doc.setTextColor(...TINTE);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
        doc.text(pdfText(bk.firma || 'ASiC Handel'), R, y);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(...GRAU);
        let yl = y;
        [bk.abteilung, bk.strasse, bk.ort, bk.land].filter(Boolean).forEach(z => { yl += 4.6; doc.text(pdfText(z), R, yl); });
        // Logo oben rechts (17 mm hoch), Kontaktangaben dann links davon
        let rechtsX = R + B, logoUnten = 0;
        if (logo) {
            const lh = 17, lw = lh * logo.w / logo.h;
            try {
                doc.addImage(logo.daten, 'PNG', R + B - lw, y - 7, lw, lh);
                rechtsX = R + B - lw - 5;
                logoUnten = y - 7 + lh;
            } catch (e) { /* ohne Logo weiter */ }
        }
        let yr = y;
        const rechts = [];
        if (bk.ansprechpartner) rechts.push(bk.ansprechpartner);
        if (bk.telefon) rechts.push('Tel. ' + bk.telefon);
        if (bk.email) rechts.push(bk.email);
        doc.setFontSize(9);
        rechts.forEach((z, i) => { yr = y + (i === 0 ? 0 : i * 4.6); doc.text(pdfText(z), rechtsX, yr, { align: 'right' }); });
        y = Math.max(yl, yr, logoUnten - 2) + 6;
        doc.setDrawColor(...ROT); doc.setLineWidth(0.8); doc.line(R, y, R + B, y);

        // Titel
        y += 12;
        doc.setTextColor(...TINTE); doc.setFont('helvetica', 'bold'); doc.setFontSize(17);
        doc.text('Jahresbericht Arbeitssicherheit', R, y);
        y += 7.5;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(12.5);
        doc.text('Begehungen ' + jahr, R, y);
        y += 6.5;
        doc.setFontSize(9); doc.setTextColor(...GRAU);
        doc.text(pdfText('Berichtszeitraum: 01.01.' + jahr + ' - 31.12.' + jahr + '   |   Erstellt am ' + heuteDe()
            + (von ? ' von ' + von : '') + '   |   Quelle: Team-Archiv'), R, y);

        // Kennzahlen
        y += 8;
        const kacheln = [
            ['Begehungen', zahlDe(werte.begehungen, 0)],
            ['Märkte', zahlDe(werte.maerkte, 0)],
            ['Mängel gesamt', zahlDe(werte.maengel, 0)],
            ['Mängel je Begehung', zahlDe(werte.schnitt, 1)]
        ];
        const kb = (B - 3 * 4) / 4;
        kacheln.forEach(([titel, wert], i) => {
            const x = R + i * (kb + 4);
            doc.setFillColor(245, 246, 245); doc.setDrawColor(...LINIE); doc.setLineWidth(0.3);
            doc.roundedRect(x, y, kb, 17, 2, 2, 'FD');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...GRAU);
            doc.text(pdfText(titel), x + 3.5, y + 5.5);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(...(i === 2 && werte.maengel > 0 ? ROT : TINTE));
            doc.text(wert, x + 3.5, y + 13.2);
        });
        y += 25;

        // Tabelle
        const SP = [
            { t: 'Nr.', w: 11, a: 'right' },
            { t: 'Markt', w: 22 },
            { t: 'Ort', w: 54 },
            { t: 'Datum', w: 23 },
            { t: 'Prüfer/in', w: 42 },
            { t: 'Mängel', w: 18, a: 'right' }
        ];
        function kopfzeile() {
            doc.setFillColor(28, 34, 38); doc.rect(R, y - 4.6, B, 7, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(255, 255, 255);
            let x = R;
            SP.forEach(s => {
                if (s.a === 'right') doc.text(pdfText(s.t), x + s.w - 2, y, { align: 'right' });
                else doc.text(pdfText(s.t), x + 2, y);
                x += s.w;
            });
            y += 7;
        }
        if (!zeilen.length) {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...GRAU);
            doc.text(pdfText('Für ' + jahr + ' sind im Team-Archiv keine Begehungen gespeichert.'), R, y);
        } else {
            kopfzeile();
            zeilen.forEach((z, i) => {
                if (y > UNTEN - 4) {
                    doc.addPage();
                    y = 22;
                    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...TINTE);
                    doc.text(pdfText('Jahresbericht ' + jahr + ' - Fortsetzung'), R, y);
                    y += 9;
                    kopfzeile();
                }
                if (i % 2 === 1) { doc.setFillColor(245, 246, 245); doc.rect(R, y - 4.4, B, 6.6, 'F'); }
                const werteZeile = [String(i + 1), z.markt || '–', z.ort || '–', datumDe(z.datum), z.pruefer || '–', String(z.maengel)];
                let x = R;
                SP.forEach((s, k) => {
                    const fett = k === 5 && z.maengel > 0;
                    doc.setFont('helvetica', fett ? 'bold' : 'normal'); doc.setFontSize(9);
                    doc.setTextColor(...(fett ? ROT : TINTE));
                    const t = kuerzen(doc, werteZeile[k], s.w - 4);
                    if (s.a === 'right') doc.text(t, x + s.w - 2, y, { align: 'right' });
                    else doc.text(t, x + 2, y);
                    x += s.w;
                });
                doc.setDrawColor(...LINIE); doc.setLineWidth(0.2); doc.line(R, y + 2.2, R + B, y + 2.2);
                y += 6.6;
            });
            // Summenzeile
            doc.setDrawColor(...TINTE); doc.setLineWidth(0.5); doc.line(R, y - 2.2, R + B, y - 2.2);
            y += 2.4;
            doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...TINTE);
            doc.text(pdfText('Summe: ' + werte.begehungen + ' Begehungen in ' + werte.maerkte + ' Märkten'), R + 2, y);
            doc.text(String(werte.maengel), R + B - 2, y, { align: 'right' });
        }

        // Fußzeile auf jeder Seite
        const n = doc.getNumberOfPages();
        for (let s = 1; s <= n; s++) {
            doc.setPage(s);
            doc.setDrawColor(...LINIE); doc.setLineWidth(0.3); doc.line(R, 285, R + B, 285);
            doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...GRAU);
            doc.text(pdfText((bk.firma ? bk.firma + '  |  ' : '') + 'ASiC Handel - Jahresbericht ' + jahr), R, 290);
            doc.text('Seite ' + s + ' von ' + n, R + B, 290, { align: 'right' });
        }
        return doc;
    }

    async function pdfAblegen(blob) {
        if (typeof autoPdfArchivAn === 'function' && !autoPdfArchivAn()) return '';
        try {
            const r = await pdfSenden({ markt: 'alle', datum: heuteIso(), art: 'jahresbericht', pdf: await blobAlsBase64(blob) });
            if (r.ergebnis === 'ok') return ' Zusätzlich im PDF-Archiv abgelegt (Ordner „Jahresberichte“).';
            if (r.ergebnis === 'doppelt') return ' Liegt bereits im PDF-Archiv.';
            if (r.ergebnis === 'fehler') return ' PDF-Archiv: ' + (r.meldung || 'nicht abgelegt') + '.';
        } catch (e) { /* Ablage ist ein Zusatz */ }
        return '';
    }

    async function teilenOderLaden(blob, dateiname, titel, typ) {
        if (navigator.canShare && typeof File !== 'undefined') {
            const datei = new File([blob], dateiname, { type: typ });
            if (navigator.canShare({ files: [datei] })) {
                try {
                    await navigator.share({ files: [datei], title: titel });
                    return 'geteilt';
                } catch (err) {
                    if (err && err.name === 'AbortError') return 'abgebrochen';
                }
            }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = dateiname;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        return 'heruntergeladen';
    }

    async function erstellen(art) {
        if (laeuft) return;
        const jahr = el('jb-jahr').value || String(new Date().getFullYear());
        sperren(true);
        try {
            const { zeilen, fehlgeschlagen } = await begehungenDesJahres(jahr);
            const werte = zusammenfassung(zeilen);
            const hinweis = fehlgeschlagen ? ' ' + fehlgeschlagen + ' Datei(en) ließen sich nicht laden und fehlen.' : '';
            if (art === 'pdf') {
                if (typeof window.jspdf === 'undefined') throw new Error('PDF-Bibliothek nicht geladen – Seite neu laden.');
                const doc = baueJahresberichtPdf(jahr, zeilen, werte, await ersteller(), await ladeLogo());
                const blob = doc.output('blob');
                const ablage = await pdfAblegen(blob);
                const wie = await teilenOderLaden(blob, 'ASiC-Jahresbericht-' + jahr + '.pdf', 'Jahresbericht ' + jahr, 'application/pdf');
                status('Jahresbericht ' + jahr + ': ' + werte.begehungen + ' Begehungen, ' + werte.maengel + ' Mängel.'
                    + (wie === 'heruntergeladen' ? ' PDF heruntergeladen.' : '') + ablage + hinweis, fehlgeschlagen ? 'warnung' : 'ok');
            } else {
                const z = ['Nr.;Marktnummer;Ort;Datum;Prüfer/in;Mängel'];
                const feld = v => {
                    let s = String(v == null ? '' : v);
                    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;          // keine Formeln in Excel
                    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
                };
                zeilen.forEach((r, i) => z.push([i + 1, r.markt, r.ort, datumDe(r.datum), r.pruefer, r.maengel].map(feld).join(';')));
                z.push('');
                z.push(['', 'Summe', werte.begehungen + ' Begehungen', werte.maerkte + ' Märkte', 'Mängel gesamt', werte.maengel].map(feld).join(';'));
                z.push(['', '', '', '', 'Mängel je Begehung', zahlDe(werte.schnitt, 1)].map(feld).join(';'));
                const blob = new Blob(['﻿' + z.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
                const wie = await teilenOderLaden(blob, 'ASiC-Jahresbericht-' + jahr + '.csv', 'Jahresbericht ' + jahr, 'text/csv');
                status('Jahresbericht ' + jahr + ' als CSV: ' + werte.begehungen + ' Begehungen.'
                    + (wie === 'heruntergeladen' ? ' Datei heruntergeladen.' : '') + hinweis, fehlgeschlagen ? 'warnung' : 'ok');
            }
        } catch (err) {
            status('Jahresbericht nicht erstellt: ' + err.message, 'fehler');
        } finally {
            sperren(false);
        }
    }

    el('jb-pdf').addEventListener('click', () => erstellen('pdf'));
    el('jb-csv').addEventListener('click', () => erstellen('csv'));
    jahreLaden();
})();
