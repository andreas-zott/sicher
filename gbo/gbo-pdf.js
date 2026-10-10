// ==========================================================================
// ASiC Handel — PDF-Ausgabe der Gefährdungsbeurteilung (GBO)
// ==========================================================================
// Erzeugt mit jsPDF eine echte PDF-Datei in zwei Varianten:
//   - Gesamt-GBO:   Deckblatt, Gliederung nach Bereichen, kompakte Zeilen für
//                   unauffällige Fragen, ausführliche Blöcke bei Handlungs-/
//                   Beratungsbedarf, Bildbelege direkt an der Frage
//   - Maßnahmenliste: Deckblatt und Tabelle mit allen Maßnahmen
// Aktionen: Drucken (PDF in neuem Tab), PDF teilen, Mail vorbereiten.
//
// Die Daten liefert gbo.js über ein Kontextobjekt (siehe GBOPdf.run):
//   collect(measuresOnly) -> Promise<{ meta, groups, stats, images, rev, fileDate }>
// ==========================================================================

(function () {
    'use strict';

    const C = {
        brand: [204, 7, 30],
        ink: [28, 34, 38],
        soft: [78, 88, 96],
        grey: [128, 138, 146],
        line: [208, 213, 218],
        band: [236, 238, 240],
        dark: [41, 50, 58],
        ok: [47, 158, 100],
        action: [204, 7, 30],
        consult: [41, 98, 160],
        na: [124, 135, 144]
    };

    const PAGE = { w: 210, h: 297, ml: 15, mr: 15, top: 24, bottom: 281 };
    const W = PAGE.w - PAGE.ml - PAGE.mr;      // nutzbare Breite: 180 mm
    const PT = 0.3528;                          // 1 pt in mm

    // ----------------------------------------------------------------------
    // Hilfsfunktionen
    // ----------------------------------------------------------------------

    // jsPDF verwendet Standardschriften (WinAnsi). Alles außerhalb davon
    // würde als Zeichensalat erscheinen und wird deshalb ersetzt/entfernt.
    function clean(value) {
        return String(value === null || value === undefined ? '' : value)
            .replace(/\r\n?/g, '\n')
            .replace(/[→⇒➡]/g, '->')
            .replace(/≥/g, '>=')
            .replace(/≤/g, '<=')
            .replace(/[✓✔]/g, 'ok')
            .replace(/−/g, '-')
            .replace(/[     ]/g, ' ')
            .replace(/[​-‍﻿]/g, '')
            .replace(/[^\n -~¡-ÿ–—‘’‚“”„•…€™]/g, '');
    }

    function fmtDate(value) {
        const s = String(value || '').trim();
        const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return m ? `${m[3]}.${m[2]}.${m[1]}` : s;
    }

    function todayIso() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function toast(message, type) {
        document.querySelectorAll('.toast').forEach(t => t.remove());
        const el = document.createElement('div');
        el.className = 'toast ' + (type || 'success');
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), type === 'error' ? 6000 : 2600);
    }

    const STATUS_TEXT = {
        ok: 'Ausreichend geschützt',
        action: 'Handlungsbedarf',
        consult: 'Beratungs-/Vertiefungsbedarf',
        na: 'Nicht zutreffend'
    };
    const STATUS_SHORT = { ok: 'OK', action: 'Handlungsbedarf', consult: 'Beratungsbedarf', na: 'n. z.' };

    function statusColor(status) {
        return C[status] || C.grey;
    }

    // ----------------------------------------------------------------------
    // Zeichenfunktionen (P = { doc, y })
    // ----------------------------------------------------------------------

    function newPage(P) {
        P.doc.addPage();
        P.y = PAGE.top;
    }

    function ensure(P, height) {
        if (P.y + height > PAGE.bottom) {
            newPage(P);
            return true;
        }
        return false;
    }

    function setText(doc, size, style, color) {
        doc.setFont('helvetica', style || 'normal');
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
    }

    function lineStep(size, factor) {
        return size * PT * (factor || 1.3);
    }

    // Umbrechender Absatz; Seitenumbruch zeilenweise
    function paragraph(P, text, opt) {
        const o = Object.assign({ x: PAGE.ml, w: W, size: 9, style: 'normal', color: C.ink, gap: 1.2 }, opt || {});
        setText(P.doc, o.size, o.style, o.color);
        const lines = P.doc.splitTextToSize(clean(text), o.w);
        const step = lineStep(o.size);
        lines.forEach(line => {
            ensure(P, step);
            P.doc.text(line, o.x, P.y + step * 0.78);
            P.y += step;
        });
        P.y += o.gap;
    }

    // Zeilen eines Textes in gegebener Breite
    function wrap(doc, text, size, style, width) {
        doc.setFont('helvetica', style || 'normal');
        doc.setFontSize(size);
        return doc.splitTextToSize(clean(text), width);
    }

    function badge(doc, text, color, xRight, y, size) {
        const s = size || 7;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(s);
        const label = clean(text);
        const w = doc.getTextWidth(label) + 4;
        const h = s * PT + 2.2;
        doc.setFillColor(color[0], color[1], color[2]);
        doc.roundedRect(xRight - w, y, w, h, 1.2, 1.2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(label, xRight - w + 2, y + h - 1.15);
        return { w, h };
    }

    // ----------------------------------------------------------------------
    // Bilder
    // ----------------------------------------------------------------------

    function imageFit(img, maxW, maxH) {
        const w = img.width || 4;
        const h = img.height || 3;
        const f = Math.min(maxW / w, maxH / h);
        return { w: w * f, h: h * f };
    }

    function drawImageBlock(P, entry, label) {
        // entry: { dataUrl, width, height, preview }
        const box = imageFit(entry, 78, 58);
        const captionH = 4.5;
        ensure(P, box.h + captionH + 3);
        const x = PAGE.ml + 34;
        try {
            P.doc.addImage(entry.dataUrl, entry.format || 'JPEG', x, P.y, box.w, box.h);
            P.doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
            P.doc.setLineWidth(0.2);
            P.doc.rect(x, P.y, box.w, box.h);
        } catch (err) {
            console.warn('Bild konnte nicht in die PDF übernommen werden:', err);
            setText(P.doc, 8, 'italic', C.grey);
            P.doc.text('(Bild konnte nicht eingefügt werden)', x, P.y + 4);
            P.y += 6;
            return;
        }
        P.y += box.h + 1;
        setText(P.doc, 7, 'italic', C.grey);
        P.doc.text(clean(label + (entry.preview ? ' (Vorschau)' : '')), x, P.y + 3);
        P.y += captionH + 2;
    }

    // ----------------------------------------------------------------------
    // Feldzeilen: Beschriftung links, Text rechts
    // ----------------------------------------------------------------------

    const LABEL_W = 32;

    function fieldRows(P, fields, keepTogether) {
        const doc = P.doc;
        const size = 8.5;
        const step = lineStep(size, 1.28);
        const valueW = W - LABEL_W - 2;

        const prepared = fields.filter(f => f && String(f.text || '').trim() !== '').map(f => {
            const lines = wrap(doc, f.text, f.size || size, f.style || 'normal', valueW);
            return { f, lines, h: Math.max(lines.length * lineStep(f.size || size, 1.28), step) + 1.1 };
        });

        const total = prepared.reduce((s, p) => s + p.h, 0);
        if (keepTogether && total <= PAGE.bottom - PAGE.top) ensure(P, total);

        prepared.forEach(p => {
            const fsize = p.f.size || size;
            const fstep = lineStep(fsize, 1.28);
            ensure(P, Math.min(p.h, fstep * 2));
            setText(doc, 7.5, 'bold', C.grey);
            doc.text(clean(p.f.label).toUpperCase(), PAGE.ml + 3, P.y + fstep * 0.78);
            setText(doc, fsize, p.f.style || 'normal', p.f.color || C.ink);
            p.lines.forEach(line => {
                ensure(P, fstep);
                setText(doc, fsize, p.f.style || 'normal', p.f.color || C.ink);
                doc.text(line, PAGE.ml + LABEL_W, P.y + fstep * 0.78);
                P.y += fstep;
            });
            P.y += 1.1;
        });
    }

    function measureText(r) {
        const list = Array.isArray(r.measures) ? r.measures.filter(Boolean) : [];
        const parts = [];
        if (list.length) parts.push(list.map(m => '- ' + m).join('\n'));
        if (r.measure) parts.push((list.length ? 'Zusätzlich: ' : '') + r.measure);
        return parts.join('\n');
    }

    function effectText(r) {
        if (!r.checked && !r.effective) return '';
        const res = r.effective === 'yes' ? 'wirksam' : r.effective === 'no' ? 'nicht wirksam' : 'Ergebnis offen';
        return `${r.checked ? fmtDate(r.checked) + ' - ' : ''}${res}`;
    }

    // ----------------------------------------------------------------------
    // Deckblatt
    // ----------------------------------------------------------------------

    function cover(P, data, mode) {
        const doc = P.doc;

        doc.setFillColor(C.brand[0], C.brand[1], C.brand[2]);
        doc.rect(0, 0, PAGE.w, 44, 'F');
        setText(doc, 24, 'bold', [255, 255, 255]);
        doc.text('Gefährdungsbeurteilung', PAGE.w / 2, 22, { align: 'center' });
        setText(doc, 10, 'normal', [255, 255, 255]);
        doc.text(clean('Arbeitsschutz & Prävention · ASiC Handel'), PAGE.w / 2, 31, { align: 'center' });

        setText(doc, 17, 'bold', C.ink);
        doc.text(mode === 'massnahmen' ? 'Maßnahmenliste' : 'Gesamtdokumentation', PAGE.w / 2, 62, { align: 'center' });

        // Betriebsdaten
        const meta = data.meta || {};
        const rows = [
            ['Marktnummer', meta.marktnummer],
            ['Postleitzahl und Ort', meta.plzOrt],
            ['Straße und Hausnummer', meta.strasse],
            ['Datum / Stand', fmtDate(meta.date)],
            ['Prüfer / Ersteller', meta.pruefername],
            ['Marktleitung / Verantwortlich', meta.marktleitung],
            ['Teilnehmer', meta.teilnehmer]
        ];

        let y = 74;
        const x = 30;
        const w = PAGE.w - 60;
        rows.forEach(r => {
            const lines = wrap(doc, r[1] || '-', 11, 'normal', w);
            const h = 4.5 + lines.length * lineStep(11, 1.25) + 2.5;
            setText(doc, 7.5, 'bold', C.grey);
            doc.text(clean(r[0]).toUpperCase(), x, y + 3.2);
            setText(doc, 11, 'normal', C.ink);
            lines.forEach((l, i) => doc.text(l, x, y + 4.5 + 3.4 + i * lineStep(11, 1.25) - 3.4 + 3));
            doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
            doc.setLineWidth(0.2);
            doc.line(x, y + h, x + w, y + h);
            y += h + 1.5;
        });

        // Status
        const s = data.stats;
        y += 5;
        setText(doc, 8.5, 'bold', C.ink);
        doc.text('STATUS DER GBO', x, y);
        const pct = s.total ? Math.round(s.answered / s.total * 100) : 0;
        doc.text(`${s.answered} / ${s.total} beantwortet · ${pct} %`, x + w, y, { align: 'right' });
        y += 2.5;
        doc.setFillColor(230, 233, 237);
        doc.roundedRect(x, y, w, 2.6, 1.3, 1.3, 'F');
        if (pct > 0) {
            doc.setFillColor(C.brand[0], C.brand[1], C.brand[2]);
            doc.roundedRect(x, y, Math.max(2.6, w * pct / 100), 2.6, 1.3, 1.3, 'F');
        }
        y += 10;

        // Kennzahlen als Kästchen
        const boxes = [
            ['Handlungsbedarf', s.action, C.action],
            ['Beratungsbedarf', s.consult, C.consult],
            ['Frist abgelaufen', s.overdue, C.action],
            ['Ausreichend', s.ok, C.ok],
            ['Nicht zutreffend', s.na, C.na],
            ['Nicht bewertet', s.open, C.grey]
        ];
        const bw = (w - 8) / 3;
        boxes.forEach((b, i) => {
            const bx = x + (i % 3) * (bw + 4);
            const by = y + Math.floor(i / 3) * 21;
            doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
            doc.setLineWidth(0.25);
            doc.roundedRect(bx, by, bw, 17, 1.5, 1.5);
            doc.setFillColor(b[2][0], b[2][1], b[2][2]);
            doc.rect(bx, by + 1.2, 1.2, 14.6, 'F');
            setText(doc, 16, 'bold', b[2]);
            doc.text(String(b[1]), bx + 5, by + 9);
            setText(doc, 7.5, 'normal', C.soft);
            doc.text(clean(b[0]), bx + 5, by + 14);
        });
        y += 46;

        setText(doc, 8.5, 'normal', C.soft);
        const umfang = mode === 'massnahmen'
            ? `Umfang: ${data.count} ${data.count === 1 ? 'Eintrag' : 'Einträge'} mit Handlungs-/Beratungsbedarf oder hinterlegter Maßnahme.`
            : `Umfang: ${data.count} bewertete Prüffragen in ${data.moduleCount} ${data.moduleCount === 1 ? 'Bereich' : 'Bereichen'}.`;
        doc.text(clean(umfang), x, y);
        if (mode !== 'massnahmen') {
            y += 5;
            doc.text(clean('Kurzzeichen: OK = ausreichend geschützt · n. z. = nicht zutreffend · offen = noch nicht bewertet'), x, y);
        }
    }

    // ----------------------------------------------------------------------
    // Gesamt-GBO
    // ----------------------------------------------------------------------

    function groupBand(P, title) {
        ensure(P, 8 + 9 + 12);
        P.y += 2;
        P.doc.setFillColor(C.dark[0], C.dark[1], C.dark[2]);
        P.doc.rect(PAGE.ml, P.y, W, 7.5, 'F');
        setText(P.doc, 10.5, 'bold', [255, 255, 255]);
        P.doc.text(clean(title), PAGE.ml + 3, P.y + 5.2);
        P.y += 7.5 + 3;
    }

    function moduleHeading(P, name, counts) {
        ensure(P, 9 + 12);
        const d = P.doc;
        d.setFillColor(C.brand[0], C.brand[1], C.brand[2]);
        d.rect(PAGE.ml, P.y, 1.4, 6, 'F');
        setText(d, 10.5, 'bold', C.ink);
        const lines = wrap(d, name, 10.5, 'bold', W - 50);
        d.text(lines[0], PAGE.ml + 4, P.y + 4.4);
        setText(d, 7.5, 'normal', C.grey);
        d.text(clean(counts), PAGE.ml + W, P.y + 4.4, { align: 'right' });
        P.y += 7;
        d.setDrawColor(C.line[0], C.line[1], C.line[2]);
        d.setLineWidth(0.2);
        d.line(PAGE.ml, P.y, PAGE.ml + W, P.y);
        P.y += 2.2;
    }

    // Kompakte Zeile: Kennung | Thema und Frage | Status
    function compactRow(P, r, image) {
        const d = P.doc;
        const idW = 17;
        const stW = 22;
        const textW = W - idW - stW - 2;
        const topicLines = wrap(d, r.topic || '', 8.5, 'bold', textW);
        const qLines = wrap(d, r.question || '', 8, 'normal', textW);
        const extra = [];
        if (r.existing) extra.push({ label: 'Vorhanden', text: r.existing });
        if (r.photoRef) extra.push({ label: 'Foto/Bezug', text: r.photoRef });
        const h = topicLines.length * lineStep(8.5, 1.25) + qLines.length * lineStep(8, 1.25) + 2.2;
        ensure(P, Math.min(h, 14));
        const y0 = P.y;

        setText(d, 7.5, 'normal', C.grey);
        d.text(clean(r.id), PAGE.ml, y0 + 3.2);

        let y = y0;
        topicLines.forEach(l => {
            setText(d, 8.5, 'bold', C.ink);
            d.text(l, PAGE.ml + idW, y + lineStep(8.5, 1.25) * 0.78);
            y += lineStep(8.5, 1.25);
        });
        qLines.forEach(l => {
            ensure(P, 0);
            setText(d, 8, 'normal', C.soft);
            d.text(l, PAGE.ml + idW, y + lineStep(8, 1.25) * 0.78);
            y += lineStep(8, 1.25);
        });

        const st = r.status;
        const label = st ? STATUS_SHORT[st] : 'offen';
        const color = st ? statusColor(st) : C.grey;
        badge(d, label, color, PAGE.ml + W, y0 + 0.4, 6.8);

        P.y = y0 + h;
        d.setDrawColor(235, 237, 239);
        d.setLineWidth(0.15);
        d.line(PAGE.ml + idW, P.y - 0.6, PAGE.ml + W, P.y - 0.6);

        if (extra.length) {
            fieldRows(P, extra, false);
        }
        if (image) drawImageBlock(P, image, r.photoName || r.id);
    }

    // Ausführlicher Block bei Handlungs-/Beratungsbedarf
    function detailBlock(P, r, image, guidance) {
        const d = P.doc;
        const color = statusColor(r.status);
        const headLines = wrap(d, `${r.id}  ${r.topic || ''}`, 9.5, 'bold', W - 42);
        const headH = headLines.length * lineStep(9.5, 1.25) + 2;

        const g = guidance ? guidance([r.id, r.topic, r.question]) : null;
        const fields = [
            { label: 'Prüffrage', text: r.question },
            { label: 'Feststellung', text: r.finding },
            { label: 'Vorhanden', text: r.existing },
            { label: 'Maßnahmen', text: measureText(r) },
            { label: 'Foto/Bezug', text: r.photoRef },
            { label: 'Verantwortlich', text: r.owner },
            { label: 'Frist', text: r.due ? fmtDate(r.due) + (r.overdue ? '  (Frist abgelaufen)' : '') : '', color: r.overdue ? C.action : C.ink },
            { label: 'Umgesetzt', text: r.done ? fmtDate(r.done) : (r.status === 'action' || r.status === 'consult' ? 'offen' : '') },
            { label: 'Wirksamkeit', text: effectText(r) }
        ];
        if (g && r.status === 'action') {
            fields.push({ label: 'Quelle', text: g.source, size: 7.8, color: C.soft });
            if (g.explain) fields.push({ label: 'Hinweis', text: g.explain, size: 7.8, color: C.soft, style: 'italic' });
        }

        // Block möglichst zusammenhalten: Kopf + Felder
        const valueW = W - LABEL_W - 2;
        let est = headH + 3;
        fields.filter(f => String(f.text || '').trim()).forEach(f => {
            est += Math.max(wrap(d, f.text, f.size || 8.5, f.style || 'normal', valueW).length, 1) * lineStep(f.size || 8.5, 1.28) + 1.1;
        });
        const usable = PAGE.bottom - PAGE.top;
        if (est <= usable) ensure(P, est); else ensure(P, headH + 14);

        const y0 = P.y;
        d.setFillColor(color[0], color[1], color[2]);
        // Kopfzeile
        d.setFillColor(246, 247, 248);
        d.rect(PAGE.ml, y0, W, headH, 'F');
        d.setFillColor(color[0], color[1], color[2]);
        d.rect(PAGE.ml, y0, 1.4, headH, 'F');
        headLines.forEach((l, i) => {
            setText(d, 9.5, 'bold', C.ink);
            d.text(l, PAGE.ml + 4, y0 + 4.2 + i * lineStep(9.5, 1.25));
        });
        badge(d, STATUS_SHORT[r.status] || 'offen', color, PAGE.ml + W - 2, y0 + (headH - 5) / 2, 7);
        P.y = y0 + headH + 1.6;

        fieldRows(P, fields, false);
        if (image) drawImageBlock(P, image, r.photoName || r.id);
        P.y += 2.2;
        d.setDrawColor(C.line[0], C.line[1], C.line[2]);
        d.setLineWidth(0.15);
        d.line(PAGE.ml, P.y - 1.2, PAGE.ml + W, P.y - 1.2);
        P.y += 1;
    }

    function bodyGesamt(P, data, guidance) {
        data.groups.forEach(g => {
            groupBand(P, g.title);
            g.modules.forEach(m => {
                const answered = m.rows.filter(r => r.status).length;
                moduleHeading(P, m.name, `${answered} von ${m.rows.length} beantwortet`);
                m.rows.forEach(r => {
                    const image = data.images[r.id] || null;
                    if (r.status === 'action' || r.status === 'consult') detailBlock(P, r, image, guidance);
                    else compactRow(P, r, image);
                });
                P.y += 2;
            });
        });
    }

    // ----------------------------------------------------------------------
    // Maßnahmenliste (Tabelle)
    // ----------------------------------------------------------------------

    const COLS = [
        { key: 'bereich', title: 'Bereich / Frage', w: 42 },
        { key: 'massnahme', title: 'Feststellung / Maßnahme', w: 78 },
        { key: 'verantwortlich', title: 'Verantwortlich', w: 28 },
        { key: 'frist', title: 'Frist / Status', w: 32 }
    ];

    function tableHeader(P) {
        const d = P.doc;
        const h = 7;
        ensure(P, h + 14);
        let x = PAGE.ml;
        d.setFillColor(C.dark[0], C.dark[1], C.dark[2]);
        d.rect(PAGE.ml, P.y, W, h, 'F');
        COLS.forEach(c => {
            setText(d, 8, 'bold', [255, 255, 255]);
            d.text(clean(c.title), x + 2, P.y + 4.7);
            x += c.w;
        });
        P.y += h;
    }

    function cellLines(d, col, r) {
        // Liefert Array von { text, style, color, size }
        const out = [];
        const add = (text, style, color, size) => out.push({ text: clean(text), style: style || 'normal', color: color || C.ink, size: size || 8 });
        if (col === 'bereich') {
            add(r.module, 'bold', C.ink, 8);
            add(`${r.id} · ${r.topic || ''}`, 'normal', C.soft, 7.6);
        } else if (col === 'massnahme') {
            if (r.finding) { add('Feststellung', 'bold', C.grey, 7); add(r.finding, 'normal', C.ink, 8); }
            const m = measureText(r);
            if (m) { add('Maßnahme', 'bold', C.grey, 7); add(m, 'normal', C.ink, 8); }
            if (!r.finding && !m) add('-', 'normal', C.grey, 8);
        } else if (col === 'verantwortlich') {
            add(r.owner || '-', 'normal', C.ink, 8);
        } else {
            add(r.due ? 'Frist ' + fmtDate(r.due) : 'Keine Frist', 'normal', r.overdue ? C.action : C.ink, 8);
            if (r.overdue) add('abgelaufen', 'bold', C.action, 7.5);
            add(r.done ? 'umgesetzt ' + fmtDate(r.done) : 'offen', 'normal', r.done ? C.ok : C.ink, 8);
            const e = effectText(r);
            if (e) add('Wirksamkeit: ' + e, 'normal', C.soft, 7.4);
        }
        return out;
    }

    function tableRow(P, r, image) {
        const d = P.doc;
        const pad = 2;
        // Zeilen je Spalte vorbereiten
        const cells = COLS.map(c => {
            const parts = cellLines(d, c.key, r);
            const lines = [];
            parts.forEach(p => {
                wrap(d, p.text, p.size, p.style, c.w - pad * 2).forEach(l => lines.push({ t: l, p }));
            });
            return lines;
        });
        const heights = cells.map(lines => lines.reduce((s, l) => s + lineStep(l.p.size, 1.25), 0));
        const rowH = Math.max.apply(null, heights) + pad * 2;
        const imgBox = image ? imageFit(image, 60, 44) : null;
        const imgH = imgBox ? imgBox.h + 7 : 0;

        // Zeile samt Bild möglichst zusammenhalten
        if (ensure(P, Math.min(rowH + imgH, PAGE.bottom - PAGE.top))) tableHeader(P);

        const y0 = P.y;
        d.setDrawColor(C.line[0], C.line[1], C.line[2]);
        d.setLineWidth(0.2);
        let x = PAGE.ml;
        COLS.forEach((c, i) => {
            d.rect(x, y0, c.w, rowH + imgH);
            let y = y0 + pad;
            cells[i].forEach(l => {
                setText(d, l.p.size, l.p.style, l.p.color);
                d.text(l.t, x + pad, y + lineStep(l.p.size, 1.25) * 0.78);
                y += lineStep(l.p.size, 1.25);
            });
            x += c.w;
        });

        if (image) {
            const ix = PAGE.ml + 42 + pad;
            const iy = y0 + rowH - 0.5;
            try {
                d.addImage(image.dataUrl, image.format || 'JPEG', ix, iy, imgBox.w, imgBox.h);
                d.rect(ix, iy, imgBox.w, imgBox.h);
            } catch (err) {
                console.warn('Bild konnte nicht eingefügt werden:', err);
            }
            setText(d, 7, 'italic', C.grey);
            d.text(clean((r.photoName || r.id) + (image.preview ? ' (Vorschau)' : '')), ix, iy + imgBox.h + 3.4);
        }
        P.y = y0 + rowH + imgH;
    }

    function bodyMassnahmen(P, data) {
        if (!data.count) {
            paragraph(P, 'Es liegen keine Einträge mit Handlungs- oder Beratungsbedarf bzw. hinterlegter Maßnahme vor.', { size: 10, color: C.soft });
            return;
        }
        let first = true;
        data.groups.forEach(g => {
            ensure(P, 8 + 7 + 16);
            if (first) { tableHeader(P); first = false; }
            P.y += 0;
            P.doc.setFillColor(C.band[0], C.band[1], C.band[2]);
            P.doc.rect(PAGE.ml, P.y, W, 6.5, 'F');
            P.doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
            P.doc.rect(PAGE.ml, P.y, W, 6.5);
            setText(P.doc, 8.5, 'bold', C.ink);
            P.doc.text(clean(g.title), PAGE.ml + 2, P.y + 4.5);
            P.y += 6.5;
            g.modules.forEach(m => {
                m.rows.forEach(r => tableRow(P, r, data.images[r.id] || null));
            });
        });
    }

    // ----------------------------------------------------------------------
    // Kopf- und Fußzeilen auf allen Seiten
    // ----------------------------------------------------------------------

    function decorate(doc, data, mode) {
        const n = doc.getNumberOfPages();
        const meta = data.meta || {};
        const titel = mode === 'massnahmen' ? 'GBO - Maßnahmenliste' : 'Gefährdungsbeurteilung';
        const markt = `Markt ${meta.marktnummer || '-'}${meta.plzOrt ? ' · ' + meta.plzOrt : ''}`;

        for (let i = 1; i <= n; i++) {
            doc.setPage(i);
            if (i > 1) {
                setText(doc, 8, 'bold', C.ink);
                doc.text(clean(titel), PAGE.ml, 13);
                setText(doc, 8, 'normal', C.soft);
                doc.text(clean(markt + (meta.date ? ' · ' + fmtDate(meta.date) : '')), PAGE.ml + W, 13, { align: 'right' });
                doc.setDrawColor(C.brand[0], C.brand[1], C.brand[2]);
                doc.setLineWidth(0.5);
                doc.line(PAGE.ml, 16, PAGE.ml + W, 16);
            }
            doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
            doc.setLineWidth(0.2);
            doc.line(PAGE.ml, 287, PAGE.ml + W, 287);
            setText(doc, 7.5, 'normal', C.grey);
            doc.text(clean(`ASiC Handel${data.rev ? ' Rev. ' + data.rev : ''} · Erstellt am ${fmtDate(todayIso())}`), PAGE.ml, 292);
            doc.text(`Seite ${i} von ${n}`, PAGE.ml + W, 292, { align: 'right' });
        }
    }

    // ----------------------------------------------------------------------
    // PDF erzeugen
    // ----------------------------------------------------------------------

    async function build(data, mode, guidance) {
        if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('PDF-Bibliothek nicht geladen.');
        const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
        const P = { doc, y: PAGE.top };

        cover(P, data, mode);
        newPage(P);
        if (mode === 'massnahmen') bodyMassnahmen(P, data);
        else bodyGesamt(P, data, guidance);

        decorate(doc, data, mode);
        return doc;
    }

    // ----------------------------------------------------------------------
    // Dateiname, Mail-Betreff und Mail-Text
    // ----------------------------------------------------------------------

    function safePart(v, fallback) {
        const s = String(v || fallback || '').trim().replace(/[^a-z0-9äöüß_-]+/gi, '-').replace(/^-+|-+$/g, '');
        return s || fallback || 'daten';
    }

    function filename(data, mode) {
        const d = String(data.fileDate || todayIso());
        return `GBO_${mode === 'massnahmen' ? 'Massnahmen' : 'Gesamt'}_Markt_${safePart(data.meta.marktnummer, 'ohne-Marktnummer')}_${d}.pdf`;
    }

    function mailSubject(meta, mode) {
        const markt = (meta && meta.marktnummer) || '-';
        return mode === 'massnahmen'
            ? `Gefährdungsbeurteilung – Maßnahmenliste Markt ${markt}`
            : `Gefährdungsbeurteilung Markt ${markt}`;
    }

    function mailText(data, mode) {
        const meta = data.meta || {};
        const s = data.stats || {};
        const markt = meta.marktnummer || '-';
        const adresse = [meta.strasse, meta.plzOrt].filter(Boolean).join(', ');
        const stand = meta.date ? `, Stand ${fmtDate(meta.date)}` : '';
        const inhalt = mode === 'massnahmen'
            ? 'die Maßnahmenliste der Gefährdungsbeurteilung'
            : 'die Gefährdungsbeurteilung';

        const teile = [];
        teile.push('Sehr geehrte Damen und Herren,');
        teile.push(`anbei übersende ich Ihnen ${inhalt} des Marktes ${markt}${adresse ? ' (' + adresse + ')' : ''}${stand}.`);

        if (s.total) {
            const offen = s.openMeasures || 0;
            let status = `Stand der Beurteilung: ${s.answered} von ${s.total} Prüffragen beantwortet`;
            status += `; ${s.action || 0} mit Handlungsbedarf, ${s.consult || 0} mit Beratungs- bzw. Vertiefungsbedarf`;
            status += `; ${offen} Maßnahmen offen`;
            if (s.overdue) status += `, davon ${s.overdue} mit abgelaufener Frist`;
            status += '.';
            teile.push(status);
        }

        teile.push('Ich bitte Sie, die dokumentierten Maßnahmen zu prüfen und bis zu den genannten Fristen umzusetzen. Die Umsetzung bitte mit Datum dokumentieren.');
        teile.push('Vielen Dank für Ihre Unterstützung.');
        teile.push(`Mit freundlichen Grüßen\n${meta.pruefername ? meta.pruefername + '\n' : ''}Fachkraft für Arbeitssicherheit (SiFa)`);
        return teile.join('\n\n');
    }

    // ----------------------------------------------------------------------
    // Aktionen
    // ----------------------------------------------------------------------

    // ctx: { collect(measuresOnly) -> Promise<data>, guidance(q) }
    async function run(action, measuresOnly, ctx) {
        const mode = measuresOnly ? 'massnahmen' : 'gesamt';

        // Mail ohne PDF: nur Entwurf mit Betreff und Text
        if (action === 'mail') {
            try {
                const data = await ctx.collect(measuresOnly, { images: false });
                const subject = encodeURIComponent(mailSubject(data.meta, mode));
                const body = encodeURIComponent(mailText(data, mode));
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            } catch (err) {
                console.error(err);
                toast('Mail konnte nicht vorbereitet werden: ' + (err && err.message ? err.message : 'Fehler'), 'error');
            }
            return;
        }

        // Fenster sofort öffnen (Klick), damit der Pop-up-Blocker nicht eingreift
        let win = null;
        if (action === 'print') {
            try { win = window.open('', '_blank'); } catch (e) { win = null; }
        }

        try {
            toast('PDF wird erstellt …');
            const data = await ctx.collect(measuresOnly, { images: true });
            const doc = await build(data, mode, ctx.guidance);
            const name = filename(data, mode);
            const blob = doc.output('blob');

            if (action === 'print') {
                const url = URL.createObjectURL(blob);
                if (win) {
                    win.location.href = url;
                    toast('PDF geöffnet – über das Teilen-Symbol drucken');
                } else {
                    doc.save(name);
                    toast('Pop-up blockiert – PDF heruntergeladen');
                }
                setTimeout(() => URL.revokeObjectURL(url), 120000);
                return;
            }

            // Teilen (iPad-Teilen-Menü) mit Download als Rückfall
            if (navigator.canShare && typeof File !== 'undefined') {
                const file = new File([blob], name, { type: 'application/pdf' });
                if (navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: mailSubject(data.meta, mode),
                            text: mailText(data, mode)
                        });
                        toast('PDF geteilt');
                        return;
                    } catch (err) {
                        if (err && err.name === 'AbortError') return;
                        console.error('Teilen fehlgeschlagen, lade herunter:', err);
                    }
                }
            }
            doc.save(name);
            toast('PDF heruntergeladen');
        } catch (err) {
            if (win) { try { win.close(); } catch (e) { /* ignorieren */ } }
            console.error('PDF-Erzeugung fehlgeschlagen:', err);
            toast('PDF-Fehler: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'error');
        }
    }

    window.GBOPdf = { run, build, mailSubject, mailText, filename, clean };
})();
