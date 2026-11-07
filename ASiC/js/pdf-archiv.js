// ==========================================================================
// ASiC Handel — PDF-Archiv (ab Rev. 1.55-3)
// ==========================================================================
// Liste der auf dem Server abgelegten PDFs (pdf.php?aktion=liste) mit Suche.
// Öffnen lädt das PDF über nasFetch (Zugriffsschlüssel + Anmeldung) und
// zeigt es im PDF-Betrachter des Geräts. Texte vom Server nur per
// textContent – nie als HTML.
// ==========================================================================

(function () {
    'use strict';

    const el = id => document.getElementById(id);
    let alle = [];
    let loeschenErlaubt = false;   // ab 1.55-7: Administratoren mit Schalter "Löschen im Archiv"

    function fehler(text) {
        el('pa-fehler').textContent = text || '';
        el('pa-fehler').hidden = !text;
    }

    function datumDe(iso) {
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
        return m ? m[3] + '.' + m[2] + '.' + m[1] : String(iso || '');
    }

    function zeitDe(iso) {
        const d = iso ? new Date(iso) : null;
        if (!d || isNaN(d)) return '';
        return d.toLocaleDateString('de-DE') + ', ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    }

    function groesse(b) {
        return b >= 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
    }

    async function oeffnen(p, knopf) {
        // Fenster sofort öffnen (sonst blockiert der Browser es nach dem Laden)
        let fenster = null;
        try { fenster = window.open('', '_blank'); } catch (e) { fenster = null; }
        const vorher = knopf.textContent;
        knopf.disabled = true;
        knopf.textContent = 'Wird geladen …';
        try {
            const res = await nasFetch('pdf.php', 'aktion=datei&id=' + encodeURIComponent(p.id), { cache: 'no-store' });
            if (!res.ok) {
                let j = {};
                try { j = await res.json(); } catch (e) {}
                throw new Error(j.message || ('Fehler ' + res.status));
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            if (fenster && !fenster.closed) {
                fenster.location.href = url;
            } else {
                const a = document.createElement('a');
                a.href = url;
                a.download = p.datei;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            setTimeout(() => URL.revokeObjectURL(url), 120000);
        } catch (err) {
            if (fenster && !fenster.closed) fenster.close();
            fehler(err.message === 'Failed to fetch' ? 'Der Server ist nicht erreichbar.' : err.message);
        } finally {
            knopf.disabled = false;
            knopf.textContent = vorher;
        }
    }

    async function loeschen(p) {
        const wahl = await zeigeHinweisFenster({
            titel: 'PDF löschen',
            sub: 'Aus dem PDF-Archiv, endgültig',
            karte: { markt: 'Markt ' + p.markt, datum: datumDe(p.datum), ort: p.artText + ' · ' + p.datei },
            punkte: [
                'Das PDF wird endgültig vom Server gelöscht und ist danach für niemanden mehr abrufbar.',
                'Die Begehung selbst (Team-Archiv, Verlauf) bleibt erhalten.',
                'Der Vorgang wird im Protokoll vermerkt.'
            ],
            knoepfe: [
                { w: 'ja', text: 'Endgültig löschen', art: 'warn' },
                { w: '', text: 'Abbrechen' }
            ]
        });
        if (wahl !== 'ja') return;
        fehler('');
        try {
            const res = await nasFetch('pdf.php', '', {
                method: 'POST', cache: 'no-store',
                headers: { 'Content-Type': 'application/json', 'X-ASiC': '1' },
                body: JSON.stringify({ aktion: 'loeschen', id: p.id })
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j.ok) throw new Error(j.message || ('Fehler ' + res.status));
            alle = alle.filter(x => x.id !== p.id);
            zeigen();
            showToast('Gelöscht – ' + p.datei + ' ist nicht mehr im PDF-Archiv.');
        } catch (err) {
            fehler(err.message === 'Failed to fetch' ? 'Der Server ist nicht erreichbar.' : err.message);
        }
    }

    function passt(p, q) {
        if (!q) return true;
        const text = [p.markt, p.datum, datumDe(p.datum), p.artText, p.von, p.datei].join(' ').toLowerCase();
        return q.toLowerCase().split(/\s+/).every(w => text.includes(w));
    }

    function zeigen() {
        const q = el('pa-suche').value.trim();
        const treffer = alle.filter(p => passt(p, q));
        const ziel = el('pa-liste');
        ziel.textContent = '';
        el('pa-anzahl').textContent = alle.length
            ? treffer.length + ' von ' + alle.length + ' PDFs'
            : '';
        if (!alle.length) {
            ziel.innerHTML = '<div class="s-card"><p class="s-hint">Noch keine PDFs im Archiv. Sie landen hier, sobald jemand in der App ein PDF teilt, herunterlädt oder druckt.</p></div>';
            return;
        }
        if (!treffer.length) {
            ziel.innerHTML = '<div class="s-card"><p class="s-hint">Keine Treffer.</p></div>';
            return;
        }
        // nach Markt gruppieren
        const gruppen = new Map();
        treffer.forEach(p => {
            if (!gruppen.has(p.markt)) gruppen.set(p.markt, []);
            gruppen.get(p.markt).push(p);
        });
        [...gruppen.keys()].sort((a, b) => a.localeCompare(b, 'de', { numeric: true })).forEach(markt => {
            const karte = document.createElement('div');
            karte.className = 's-card pa-markt';
            const h = document.createElement('h2');
            h.className = 'pa-markt-titel';
            h.textContent = 'Markt ' + markt;
            karte.append(h);
            gruppen.get(markt).sort((a, b) => b.datum.localeCompare(a.datum) || b.zeit.localeCompare(a.zeit)).forEach(p => {
                const z = document.createElement('div');
                z.className = 'pa-zeile';
                const text = document.createElement('div');
                const t1 = document.createElement('strong');
                t1.textContent = datumDe(p.datum) + ' · ' + p.artText;
                const t2 = document.createElement('div');
                t2.className = 'pa-info';
                t2.textContent = 'abgelegt ' + zeitDe(p.zeit) + (p.von ? ' von ' + p.von : '') + ' · ' + groesse(p.groesse) + ' · ' + p.datei;
                text.append(t1, t2);
                const k = document.createElement('button');
                k.type = 'button';
                k.className = 'btn btn-secondary';
                k.textContent = 'Öffnen';
                k.addEventListener('click', () => oeffnen(p, k));
                const knoepfe = document.createElement('div');
                knoepfe.className = 'pa-knoepfe';
                knoepfe.append(k);
                if (loeschenErlaubt) {
                    const l = document.createElement('button');
                    l.type = 'button';
                    l.className = 'btn-link photo-delete';
                    l.textContent = '🗑️ Löschen';
                    l.addEventListener('click', () => loeschen(p));
                    knoepfe.append(l);
                }
                z.append(text, knoepfe);
                karte.append(z);
            });
            ziel.append(karte);
        });
    }

    async function laden() {
        try {
            const res = await nasFetch('pdf.php', 'aktion=liste', { cache: 'no-store' });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j.ok) throw new Error(j.message || ('Fehler ' + res.status));
            alle = j.pdfs || [];
            zeigen();
        } catch (err) {
            el('pa-liste').textContent = '';
            fehler(err.message === 'Failed to fetch'
                ? 'Der Server ist nicht erreichbar. Das PDF-Archiv braucht eine Verbindung.'
                : err.message);
        }
    }

    el('pa-suche').addEventListener('input', zeigen);

    (async function start() {
        const s = window.asicAnmeldung ? await window.asicAnmeldung : null;
        if (s && !s.aktiv) {
            fehler('Auf diesem Server ist die Anmeldung nicht eingeschaltet. Das PDF-Archiv lässt sich dann nur über den PDF-Ordner auf dem Server einsehen.');
            el('pa-bereich').hidden = true;
            return;
        }
        if (s && s.benutzer && !s.benutzer.pdfLesen) {
            fehler('Für das PDF-Archiv fehlt die Berechtigung. Bitte an einen Administrator wenden.');
            el('pa-bereich').hidden = true;
            return;
        }
        loeschenErlaubt = !!(s && s.benutzer && s.benutzer.rolle === 'admin' && s.archivLoeschen);
        laden();
    })();
})();
