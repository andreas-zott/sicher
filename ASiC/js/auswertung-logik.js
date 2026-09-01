// ==========================================================================
// ASiC Handel — Gemeinsame Auswertungs-Berechnungslogik
// ==========================================================================
//
// Reine Berechnungsfunktionen (keine DOM-Zugriffe), die sowohl von
// auswertung.js (Bildschirmanzeige + PDF-Export, lokales Archiv) als auch
// von verlauf.js (Auswertung Verlauf / Auswertung Team, direkt auf der
// Verlauf-Seite) genutzt werden. Damit existiert die eigentliche Logik nur
// EINMAL - alle Ansichten zeigen garantiert dieselben Zahlen.
//
// Voraussetzung: findItemById() und formatDate() aus js/app.js muessen
// bereits geladen sein.

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str === undefined || str === null ? '' : String(str);
    return div.innerHTML;
}

// Liefert einen Zeitstempel fuer eine Begehung, unabhaengig von der
// Datenquelle: lokale Archivdatensaetze haben createdAt direkt gesetzt,
// vom NAS geladene Datensaetze (fetchSynologyRecord()) haben das NICHT -
// dort wird ersatzweise aus companyInfo.datum ermittelt.
function zeitwertVonBegehung(r) {
    if (r.createdAt) return r.createdAt;
    if (r.companyInfo && r.companyInfo.datum) return new Date(r.companyInfo.datum).getTime() || 0;
    return 0;
}

// Reine Filterfunktion (kein Zugriff auf Modulvariablen) - wird von
// auswertung.js (lokales Archiv, Modulvariable auswertungArchiv) UND von
// auswertung-team.js (Team-Archiv/NAS, keine Modulvariable, immer frisch
// geladene Daten) genutzt. monate=null bedeutet "alle".
function filterNachZeitraum(daten, monate) {
    if (monate === null) return daten;
    const grenze = new Date();
    grenze.setMonth(grenze.getMonth() - monate);
    grenze.setHours(0, 0, 0, 0);
    return daten.filter(r => zeitwertVonBegehung(r) >= grenze.getTime());
}

// ===== Kategorien-Schwachstellen =====
// Iteriert bewusst ueber die in jeder Begehung selbst gespeicherten
// Bewertungs-Schluessel (record.ratings), NICHT ueber den aktuellen
// AUDIT_CATEGORIES-Katalog - siehe ausfuehrliche Begruendung in der
// Technischen Dokumentation (Abschnitt zu buildAuswertungCsvRows()).
function berechneKategorienSchwachstellen(daten) {
    const counts = {};

    daten.forEach(record => {
        Object.keys(record.ratings || {}).forEach(itemId => {
            const rating = record.ratings[itemId];
            if (!rating || rating === 'na') return;

            const found = findItemById(itemId);
            const kategorieName = found ? found.category.name : '(Kategorie nicht mehr im aktuellen Katalog)';

            if (!counts[kategorieName]) counts[kategorieName] = { mangel: 0, total: 0 };
            counts[kategorieName].total++;
            if (rating === 'mangel') counts[kategorieName].mangel++;
        });
    });

    return Object.entries(counts)
        .filter(([, c]) => c.total > 0)
        .map(([name, c]) => ({ name, mangel: c.mangel, total: c.total, pct: Math.round((c.mangel / c.total) * 100) }))
        .sort((a, b) => b.pct - a.pct);
}

// ===== Auffällige Märkte (Ranking nach Mängelquote) =====
function berechneAuffaelligeMaerkte(daten, modus) {
    modus = modus || 'durchschnitt';
    const byMarket = {};

    daten.forEach(record => {
        const marktnummer = (record.companyInfo.marktnummer || 'Ohne Markt-Angabe').trim();
        if (!byMarket[marktnummer]) byMarket[marktnummer] = { mangel: 0, total: 0 };

        Object.keys(record.ratings || {}).forEach(itemId => {
            const rating = record.ratings[itemId];
            if (!rating || rating === 'na') return;
            byMarket[marktnummer].total++;
            if (rating === 'mangel') byMarket[marktnummer].mangel++;
        });
    });

    const marketRates = Object.entries(byMarket)
        .filter(([, c]) => c.total > 0)
        .map(([name, c]) => ({ name, mangel: c.mangel, total: c.total, pct: (c.mangel / c.total) * 100 }));

    if (marketRates.length === 0) {
        return { durchschnitt: 0, auffaellig: [], alle: [] };
    }

    const gesamtMangel = marketRates.reduce((s, m) => s + m.mangel, 0);
    const gesamtTotal = marketRates.reduce((s, m) => s + m.total, 0);
    const durchschnitt = gesamtTotal > 0 ? (gesamtMangel / gesamtTotal) * 100 : 0;

    const sortiert = () => [...marketRates].sort((a, b) => b.pct - a.pct);

    let auffaellig;
    if (modus === 'top5') {
        auffaellig = sortiert().slice(0, 5);
    } else if (modus === 'top10') {
        auffaellig = sortiert().slice(0, 10);
    } else if (modus === 'ab50') {
        auffaellig = sortiert().filter(m => m.pct >= 50);
    } else if (modus === 'ab75') {
        auffaellig = sortiert().filter(m => m.pct >= 75);
    } else {
        auffaellig = sortiert().filter(m => m.pct > durchschnitt);
    }

    return { durchschnitt, auffaellig, alle: marketRates };
}

// ===== Verlauf pro Markt =====
// Robust fuer zwei unterschiedliche Datenquellen gebaut:
// - Lokale Archivdatensaetze (saveArchivedAudit()) haben createdAt/stats
//   direkt gesetzt.
// - Vom NAS geladene Datensaetze (fetchSynologyRecord()) haben das NICHT -
//   dort wird ersatzweise aus companyInfo.datum sortiert und die
//   Mangel-Zahl direkt aus den Bewertungen gezaehlt, statt sich auf ein
//   vorab gespeichertes Feld zu verlassen.
function berechneVerlaufProMarkt(daten) {
    function mangelZahl(r) {
        if (r.stats && typeof r.stats.mangel === 'number') return r.stats.mangel;
        return Object.values(r.ratings || {}).filter(v => v === 'mangel').length;
    }

    const byMarket = {};
    daten.forEach(r => {
        const marktnummer = (r.companyInfo.marktnummer || 'Ohne Markt-Angabe').trim();
        if (!byMarket[marktnummer]) byMarket[marktnummer] = [];
        byMarket[marktnummer].push(r);
    });

    const marketNames = Object.keys(byMarket).sort();
    return marketNames.map(marktnummer => {
        const list = byMarket[marktnummer].sort((a, b) => zeitwertVonBegehung(a) - zeitwertVonBegehung(b));
        const entries = list.map((r, i) => {
            const mangel = mangelZahl(r);
            let trend = 'gleich';
            if (i > 0) {
                const prevMangel = mangelZahl(list[i - 1]);
                if (mangel < prevMangel) trend = 'besser';
                else if (mangel > prevMangel) trend = 'schlechter';
            }
            const datum = formatDate(r.companyInfo.datum) || new Date(zeitwertVonBegehung(r)).toLocaleDateString('de-DE');
            return { datum, mangel, trend: i === 0 ? null : trend };
        });
        return { marktnummer, entries };
    });
}

// Kleine gemeinsame HTML-Renderfunktionen, damit auswertung.js UND
// verlauf.js exakt dieselbe Darstellung erzeugen (Tabellen, Balken usw.).
// escapeHtml() muss im aufrufenden Kontext bereits vorhanden sein.

// ===== Gesamtverteilung (Ja/Mangel/N.V. über alle Bewertungen) =====
function berechneGesamtverteilung(daten) {
    let ok = 0, mangel = 0, na = 0;
    daten.forEach(record => {
        Object.values(record.ratings || {}).forEach(rating => {
            if (rating === 'ok') ok++;
            else if (rating === 'mangel') mangel++;
            else if (rating === 'na') na++;
        });
    });
    return { ok, mangel, na, total: ok + mangel + na };
}

// ===== SVG-Diagramme (bildschirmseitig, dieselben Farben/Zahlen wie im PDF) =====
// Bewusst ohne externe Chart-Bibliothek von Hand als SVG erzeugt, analog
// zum PDF-Export (buildAuswertungPdf in auswertung.js zeichnet dieselben
// Diagramme direkt mit jsPDF-Bordmitteln) - keine zusaetzliche Abhaengigkeit.

const DIAGRAMM_FARBEN = { ok: '#2f9e64', mangel: '#d6453f', na: '#7c8790' };

function svgBalkendiagramm(rows, opts) {
    opts = opts || {};
    const breite = opts.breite || 560;
    const hoehe = opts.hoehe || 200;
    const margin = { oben: 10, unten: 46, links: 4, rechts: 4 };
    const anzahl = rows.length;
    if (anzahl === 0) return '';

    const plotHoehe = hoehe - margin.oben - margin.unten;
    const balkenBreite = Math.min(46, (breite - margin.links - margin.rechts) / anzahl * 0.6);
    const abstand = (breite - margin.links - margin.rechts) / anzahl;

    const balken = rows.map((r, i) => {
        const x = margin.links + i * abstand + (abstand - balkenBreite) / 2;
        const balkenHoehe = Math.max(2, (r.pct / 100) * plotHoehe);
        const y = margin.oben + (plotHoehe - balkenHoehe);
        const farbe = r.pct >= 50 ? DIAGRAMM_FARBEN.mangel : (r.pct >= 20 ? '#d97706' : DIAGRAMM_FARBEN.ok);
        const labelY = hoehe - margin.unten + 14;
        const kurzName = r.name.length > 14 ? r.name.slice(0, 13) + '…' : r.name;
        return `
            <g class="auswertung-balken-klickbar" data-kategorie="${escapeHtml(r.name)}" onclick="onKategorieBalkenKlick(this)" style="cursor:pointer;">
                <rect x="${x - 3}" y="${margin.oben - 2}" width="${balkenBreite + 6}" height="${plotHoehe + 4}" fill="transparent"></rect>
                <rect x="${x}" y="${y}" width="${balkenBreite}" height="${balkenHoehe}" rx="3" fill="${farbe}"></rect>
                <text x="${x + balkenBreite / 2}" y="${y - 4}" text-anchor="middle" font-size="10" font-weight="700" fill="#1c2226">${r.pct}%</text>
                <text x="${x + balkenBreite / 2}" y="${labelY}" text-anchor="middle" font-size="8.5" fill="#5b6670" transform="rotate(-35 ${x + balkenBreite / 2} ${labelY})">${escapeHtml(kurzName)}</text>
            </g>`;
    }).join('');

    return `<svg class="auswertung-chart" viewBox="0 0 ${breite} ${hoehe}" xmlns="http://www.w3.org/2000/svg">
        <line x1="${margin.links}" y1="${margin.oben + plotHoehe}" x2="${breite - margin.rechts}" y2="${margin.oben + plotHoehe}" stroke="#dfe3e6" stroke-width="1"></line>
        ${balken}
    </svg>`;
}

function svgTortendiagramm(verteilung, opts) {
    opts = opts || {};
    const groesse = opts.groesse || 180;
    const radius = groesse / 2 - 4;
    const cx = groesse / 2, cy = groesse / 2;
    const { ok, mangel, na, total } = verteilung;

    if (total === 0) {
        return `<p class="auswertung-empty">Keine auswertbaren Antworten im gewählten Zeitraum.</p>`;
    }

    const segmente = [
        { wert: ok, farbe: DIAGRAMM_FARBEN.ok, label: 'In Ordnung' },
        { wert: mangel, farbe: DIAGRAMM_FARBEN.mangel, label: 'Mangel' },
        { wert: na, farbe: DIAGRAMM_FARBEN.na, label: 'Nicht vorhanden' }
    ].filter(s => s.wert > 0);

    let startWinkel = -90;
    const pfade = segmente.map(s => {
        const anteil = s.wert / total;
        const endWinkel = startWinkel + anteil * 360;
        const grossBogen = (endWinkel - startWinkel) > 180 ? 1 : 0;
        const x1 = cx + radius * Math.cos(startWinkel * Math.PI / 180);
        const y1 = cy + radius * Math.sin(startWinkel * Math.PI / 180);
        const x2 = cx + radius * Math.cos(endWinkel * Math.PI / 180);
        const y2 = cy + radius * Math.sin(endWinkel * Math.PI / 180);
        const pfad = segmente.length === 1
            ? `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${s.farbe}"></circle>`
            : `<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${radius},${radius} 0 ${grossBogen} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${s.farbe}"></path>`;
        startWinkel = endWinkel;
        return pfad;
    }).join('');

    const legende = segmente.map(s => `
        <div class="auswertung-legende-eintrag">
            <span class="auswertung-legende-farbe" style="background:${s.farbe}"></span>
            ${s.label}: ${s.wert} (${Math.round((s.wert / total) * 100)}%)
        </div>`).join('');

    return `
        <div class="auswertung-torte-wrapper">
            <svg class="auswertung-chart auswertung-torte" viewBox="0 0 ${groesse} ${groesse}" xmlns="http://www.w3.org/2000/svg">${pfade}</svg>
            <div class="auswertung-legende">${legende}</div>
        </div>`;
}

function renderGesamtverteilungHtml(daten) {
    if (daten.length === 0) {
        return '<p class="auswertung-empty">Keine Begehungen vorhanden.</p>';
    }
    const verteilung = berechneGesamtverteilung(daten);
    return svgTortendiagramm(verteilung);
}

// ===== Einzelfragen-Schwachstellen innerhalb EINER Kategorie (Drilldown) =====
function berechneEinzelfragenSchwachstellen(daten, kategorieName) {
    const counts = {};

    daten.forEach(record => {
        Object.keys(record.ratings || {}).forEach(itemId => {
            const rating = record.ratings[itemId];
            if (!rating || rating === 'na') return;

            const found = findItemById(itemId);
            const eigeneKategorie = found ? found.category.name : '(Kategorie nicht mehr im aktuellen Katalog)';
            if (eigeneKategorie !== kategorieName) return;

            const frageText = found ? found.item.text : itemId;
            if (!counts[frageText]) counts[frageText] = { mangel: 0, total: 0 };
            counts[frageText].total++;
            if (rating === 'mangel') counts[frageText].mangel++;
        });
    });

    return Object.entries(counts)
        .filter(([, c]) => c.total > 0)
        .map(([name, c]) => ({ name, mangel: c.mangel, total: c.total, pct: Math.round((c.mangel / c.total) * 100) }))
        .sort((a, b) => b.pct - a.pct);
}

function renderEinzelfragenSchwachstellenHtml(daten, kategorieName) {
    const rows = berechneEinzelfragenSchwachstellen(daten, kategorieName);
    if (rows.length === 0) {
        return '<p class="auswertung-empty">Keine auswertbaren Antworten in dieser Kategorie.</p>';
    }
    return `
        <table class="doku-table">
            <tr><th>Frage</th><th>Mängelquote</th><th></th></tr>
            ${rows.map(r => `
                <tr>
                    <td>${escapeHtml(r.name)}</td>
                    <td>${r.mangel} / ${r.total} (${r.pct}%)</td>
                    <td><div class="auswertung-bar"><div class="auswertung-bar-fill" style="width:${r.pct}%"></div></div></td>
                </tr>`).join('')}
        </table>`;
}

// ===== Gesamt-Trend über Zeit (Mängelquote je Monat, über alle Märkte) =====
function berechneGesamtTrend(daten) {
    const proMonat = {};

    daten.forEach(record => {
        const zeitwert = zeitwertVonBegehung(record);
        if (!zeitwert) return;
        const d = new Date(zeitwert);
        const monatSchluessel = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');

        if (!proMonat[monatSchluessel]) proMonat[monatSchluessel] = { mangel: 0, total: 0 };

        Object.values(record.ratings || {}).forEach(rating => {
            if (!rating || rating === 'na') return;
            proMonat[monatSchluessel].total++;
            if (rating === 'mangel') proMonat[monatSchluessel].mangel++;
        });
    });

    return Object.keys(proMonat)
        .sort()
        .filter(monat => proMonat[monat].total > 0)
        .map(monat => {
            const [jahr, monatNr] = monat.split('-');
            const label = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][parseInt(monatNr, 10) - 1] + ' ' + jahr.slice(2);
            const c = proMonat[monat];
            return { monat, label, mangel: c.mangel, total: c.total, pct: Math.round((c.mangel / c.total) * 100) };
        });
}

function svgLiniendiagramm(punkte, opts) {
    opts = opts || {};
    const breite = opts.breite || 560;
    const hoehe = opts.hoehe || 200;
    const margin = { oben: 16, unten: 34, links: 30, rechts: 12 };
    if (punkte.length === 0) return '';

    const plotBreite = breite - margin.links - margin.rechts;
    const plotHoehe = hoehe - margin.oben - margin.unten;
    const schrittX = punkte.length > 1 ? plotBreite / (punkte.length - 1) : 0;

    const koordinaten = punkte.map((p, i) => ({
        x: margin.links + i * schrittX,
        y: margin.oben + plotHoehe - (p.pct / 100) * plotHoehe,
        p
    }));

    const linie = koordinaten.map((k, i) => (i === 0 ? 'M' : 'L') + k.x.toFixed(1) + ',' + k.y.toFixed(1)).join(' ');

    const gitterlinien = [0, 25, 50, 75, 100].map(pct => {
        const y = margin.oben + plotHoehe - (pct / 100) * plotHoehe;
        return `
            <line x1="${margin.links}" y1="${y}" x2="${breite - margin.rechts}" y2="${y}" stroke="#eef0ee" stroke-width="1"></line>
            <text x="${margin.links - 6}" y="${y + 3}" text-anchor="end" font-size="8" fill="#94a3b8">${pct}%</text>`;
    }).join('');

    const punkteSvg = koordinaten.map(k => `
        <circle cx="${k.x}" cy="${k.y}" r="3.5" fill="${DIAGRAMM_FARBEN.mangel}"></circle>
        <text x="${k.x}" y="${k.y - 8}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#1c2226">${k.p.pct}%</text>
        <text x="${k.x}" y="${hoehe - margin.unten + 14}" text-anchor="middle" font-size="8" fill="#5b6670">${escapeHtml(k.p.label)}</text>`).join('');

    return `<svg class="auswertung-chart" viewBox="0 0 ${breite} ${hoehe}" xmlns="http://www.w3.org/2000/svg">
        ${gitterlinien}
        <path d="${linie}" fill="none" stroke="${DIAGRAMM_FARBEN.mangel}" stroke-width="2"></path>
        ${punkteSvg}
    </svg>`;
}

function renderGesamtTrendHtml(daten) {
    if (daten.length === 0) {
        return '<p class="auswertung-empty">Keine Begehungen vorhanden.</p>';
    }
    const punkte = berechneGesamtTrend(daten);
    if (punkte.length === 0) {
        return '<p class="auswertung-empty">Für die vorhandenen Begehungen liegen keine auswertbaren Antworten vor.</p>';
    }
    if (punkte.length === 1) {
        return `<p class="auswertung-hint">Nur ein Monat mit Daten (${escapeHtml(punkte[0].label)}: ${punkte[0].pct}% Mängelquote) — für einen Trend werden mindestens zwei Monate benötigt.</p>`;
    }
    return svgLiniendiagramm(punkte);
}

function renderKategorienSchwachstellenHtml(daten) {
    if (daten.length === 0) {
        return '<p class="auswertung-empty">Keine Begehungen vorhanden.</p>';
    }
    const rows = berechneKategorienSchwachstellen(daten);
    if (rows.length === 0) {
        return '<p class="auswertung-empty">Für die vorhandenen Begehungen liegen keine auswertbaren Antworten vor.</p>';
    }
    window.__letzteKategorienDaten = daten;
    return `
        <p class="auswertung-hint">Auf einen Balken tippen, um die einzelnen Fragen dieser Kategorie zu sehen.</p>
        ${svgBalkendiagramm(rows)}
        <div class="auswertung-drilldown" style="display:none;"></div>
        <table class="doku-table">
            <tr><th>Kategorie</th><th>Mängelquote</th><th></th></tr>
            ${rows.map(r => `
                <tr>
                    <td>${escapeHtml(r.name)}</td>
                    <td>${r.mangel} / ${r.total} (${r.pct}%)</td>
                    <td><div class="auswertung-bar"><div class="auswertung-bar-fill" style="width:${r.pct}%"></div></div></td>
                </tr>`).join('')}
        </table>`;
}

// Wird beim Klick auf einen Balken in "Kategorien-Schwachstellen" aufgerufen
// (inline onclick im erzeugten SVG, siehe svgBalkendiagramm). Zeigt/versteckt
// die Einzelfragen dieser Kategorie direkt unter dem Diagramm. Nutzt die
// zuletzt gerenderten Daten (window.__letzteKategorienDaten) - dieselben,
// mit denen auch der Balken selbst berechnet wurde, unabhaengig davon, ob
// das auf der lokalen oder der Team-Auswertungsseite passiert.
function onKategorieBalkenKlick(gruppenElement) {
    const kategorie = gruppenElement.getAttribute('data-kategorie');
    const container = gruppenElement.closest('[id]');
    const drilldown = container ? container.querySelector('.auswertung-drilldown') : null;
    if (!drilldown) return;

    if (drilldown.style.display !== 'none' && drilldown.dataset.kategorie === kategorie) {
        drilldown.style.display = 'none';
        drilldown.dataset.kategorie = '';
        return;
    }

    const daten = window.__letzteKategorienDaten || [];
    drilldown.innerHTML = `<h4 style="margin:0.75rem 0 0.5rem;">${escapeHtml(kategorie)} — Einzelfragen</h4>` +
        renderEinzelfragenSchwachstellenHtml(daten, kategorie);
    drilldown.dataset.kategorie = kategorie;
    drilldown.style.display = 'block';
}

function renderAuffaelligeMaerkteHtml(daten, modus) {
    if (daten.length === 0) {
        return '<p class="auswertung-empty">Keine Begehungen vorhanden.</p>';
    }
    const { durchschnitt, auffaellig } = berechneAuffaelligeMaerkte(daten, modus);

    const hinweisText = {
        durchschnitt: `Durchschnittliche Mängelquote aller Märkte: ${Math.round(durchschnitt)}% — angezeigt werden Märkte darüber.`,
        top5: 'Die 5 Märkte mit der höchsten Mängelquote.',
        top10: 'Die 10 Märkte mit der höchsten Mängelquote.',
        ab50: 'Märkte mit einer Mängelquote von mindestens 50%.',
        ab75: 'Märkte mit einer Mängelquote von mindestens 75%.'
    }[modus || 'durchschnitt'];

    if (auffaellig.length === 0) {
        return `<div class="auswertung-good">✓ Kein Markt erfüllt aktuell dieses Kriterium (${hinweisText})</div>`;
    }
    return `
        <p class="auswertung-hint">${hinweisText}</p>
        <table class="doku-table">
            <tr><th>Markt</th><th>Mängelquote</th><th></th></tr>
            ${auffaellig.map(m => `
                <tr>
                    <td>${escapeHtml(m.name)}</td>
                    <td>${m.mangel} / ${m.total} (${Math.round(m.pct)}%)</td>
                    <td><div class="auswertung-bar"><div class="auswertung-bar-fill" style="width:${Math.round(m.pct)}%"></div></div></td>
                </tr>`).join('')}
        </table>`;
}

function renderVerlaufProMarktHtml(daten) {
    if (daten.length === 0) {
        return '<p class="auswertung-empty">Keine Begehungen vorhanden.</p>';
    }
    const trendSymbol = { besser: '<span class="trend-besser">▼ besser</span>', schlechter: '<span class="trend-schlechter">▲ schlechter</span>', gleich: '<span class="trend-gleich">– gleich</span>' };
    const markets = berechneVerlaufProMarkt(daten);
    return markets.map(({ marktnummer, entries }) => {
        const items = entries.map(e => `<li>${e.datum} — ${e.mangel} Mangel/Mängel ${e.trend ? trendSymbol[e.trend] : ''}</li>`).join('');
        return `
            <div class="auswertung-market-block">
                <h4>${escapeHtml(marktnummer)} <span class="auswertung-market-count">(${entries.length} Begehung${entries.length === 1 ? '' : 'en'})</span></h4>
                <ul class="auswertung-market-list">${items}</ul>
            </div>`;
    }).join('');
}
