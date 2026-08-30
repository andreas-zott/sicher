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
function berechneAuffaelligeMaerkte(daten) {
    const byMarket = {};

    daten.forEach(record => {
        const firma = (record.companyInfo.firma || 'Ohne Markt-Angabe').trim();
        if (!byMarket[firma]) byMarket[firma] = { mangel: 0, total: 0 };

        Object.keys(record.ratings || {}).forEach(itemId => {
            const rating = record.ratings[itemId];
            if (!rating || rating === 'na') return;
            byMarket[firma].total++;
            if (rating === 'mangel') byMarket[firma].mangel++;
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

    const auffaellig = marketRates
        .filter(m => m.pct > durchschnitt)
        .sort((a, b) => b.pct - a.pct);

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
        const firma = (r.companyInfo.firma || 'Ohne Markt-Angabe').trim();
        if (!byMarket[firma]) byMarket[firma] = [];
        byMarket[firma].push(r);
    });

    const marketNames = Object.keys(byMarket).sort();
    return marketNames.map(firma => {
        const list = byMarket[firma].sort((a, b) => zeitwertVonBegehung(a) - zeitwertVonBegehung(b));
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
        return { firma, entries };
    });
}

// Kleine gemeinsame HTML-Renderfunktionen, damit auswertung.js UND
// verlauf.js exakt dieselbe Darstellung erzeugen (Tabellen, Balken usw.).
// escapeHtml() muss im aufrufenden Kontext bereits vorhanden sein.

function renderKategorienSchwachstellenHtml(daten) {
    if (daten.length === 0) {
        return '<p class="auswertung-empty">Keine Begehungen vorhanden.</p>';
    }
    const rows = berechneKategorienSchwachstellen(daten);
    if (rows.length === 0) {
        return '<p class="auswertung-empty">Für die vorhandenen Begehungen liegen keine auswertbaren Antworten vor.</p>';
    }
    return `
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

function renderAuffaelligeMaerkteHtml(daten) {
    if (daten.length === 0) {
        return '<p class="auswertung-empty">Keine Begehungen vorhanden.</p>';
    }
    const { durchschnitt, auffaellig } = berechneAuffaelligeMaerkte(daten);
    if (auffaellig.length === 0) {
        return `<div class="auswertung-good">✓ Kein Markt liegt aktuell über der durchschnittlichen Mängelquote (${Math.round(durchschnitt)}%).</div>`;
    }
    return `
        <p class="auswertung-hint">Durchschnittliche Mängelquote aller Märkte: ${Math.round(durchschnitt)}%</p>
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
    return markets.map(({ firma, entries }) => {
        const items = entries.map(e => `<li>${e.datum} — ${e.mangel} Mangel/Mängel ${e.trend ? trendSymbol[e.trend] : ''}</li>`).join('');
        return `
            <div class="auswertung-market-block">
                <h4>${escapeHtml(firma)} <span class="auswertung-market-count">(${entries.length} Begehung${entries.length === 1 ? '' : 'en'})</span></h4>
                <ul class="auswertung-market-list">${items}</ul>
            </div>`;
    }).join('');
}
