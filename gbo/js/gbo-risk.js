// ==========================================================================
// ASiC Handel - GBO: Risikobewertung und Fortschreibung
// ==========================================================================
// Ergaenzt die Gefaehrdungsbeurteilung um
//   1. die Risikobewertung je Modul (Schwere x Wahrscheinlichkeit, je 1-4):
//      Ausgangsrisiko, Restrisiko nach Umsetzung der Massnahmen und
//      Wirksamkeitskontrolle,
//   2. die Risikouebersicht in der Statistik,
//   3. die Fortschreibung der gesamten GBO (jaehrlich und bei Anlass).
//
// Die Daten liegen im GBO-Stand (state.risk, state.reviews) und werden
// dadurch automatisch mit GBO-Sicherung, Marktcontainer und Server-Ablage
// gesichert. Die Anbindung an den Stand erfolgt ueber window.GBOState
// (siehe gbo.js).
// ==========================================================================

(function () {
    'use strict';

    // ----------------------------------------------------------------------
    // Skalen und Klassen
    // ----------------------------------------------------------------------

    const SEVERITY = [
        [1, 'gering', 'leichte Verletzung oder Beschwerden, Erste Hilfe ausreichend'],
        [2, 'mittel', 'Verletzung oder Erkrankung mit Arbeitsunfähigkeit, vollständig heilbar'],
        [3, 'schwer', 'schwere Verletzung oder Erkrankung, bleibende Schäden möglich'],
        [4, 'sehr schwer', 'tödliche Verletzung oder schwerste dauerhafte Schäden']
    ];

    const PROBABILITY = [
        [1, 'unwahrscheinlich', 'praktisch nicht zu erwarten'],
        [2, 'selten', 'nur in Ausnahmefällen zu erwarten'],
        [3, 'wahrscheinlich', 'gelegentlich zu erwarten'],
        [4, 'sehr wahrscheinlich', 'häufig oder regelmäßig zu erwarten']
    ];

    // Risikozahl = Schwere x Wahrscheinlichkeit (moegliche Werte: 1, 2, 3, 4, 6, 8, 9, 12, 16)
    const CLASSES = [
        { key: 'low', label: 'niedrig', max: 2, action: 'Kein weiterer Handlungsbedarf. Zustand beobachten.' },
        { key: 'mid', label: 'mittel', max: 6, action: 'Maßnahmen planen und mit Frist festlegen (Richtwert: innerhalb von 6 Monaten).' },
        { key: 'high', label: 'hoch', max: 9, action: 'Maßnahmen zeitnah umsetzen (Richtwert: innerhalb von 1 Monat).' },
        { key: 'top', label: 'sehr hoch', max: 16, action: 'Sofort handeln, die Tätigkeit bis zur Umsetzung der Maßnahmen gegebenenfalls aussetzen.' }
    ];

    // Betriebliche Festlegung: Ein Restrisiko bis zur Risikozahl 6 gilt als vertretbar.
    const ACCEPTABLE_MAX = 6;

    const REVIEW_REASONS = [
        'Jährliche Überprüfung',
        'Unfall oder Beinaheunfall',
        'Neues Arbeitsmittel oder neuer Arbeitsstoff',
        'Änderung der Arbeitsabläufe oder Umbau',
        'Neue Rechtslage oder neue Erkenntnisse',
        'Ergebnis einer Begehung oder arbeitsmedizinischen Vorsorge',
        'Sonstiger Anlass'
    ];

    const EFFECT_RESULTS = [
        ['yes', 'wirksam'],
        ['part', 'teilweise wirksam'],
        ['no', 'nicht wirksam']
    ];

    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function classOf(score) {
        if (!score) return null;
        return CLASSES.find(c => score <= c.max) || CLASSES[CLASSES.length - 1];
    }

    function score(s, w) {
        s = Number(s); w = Number(w);
        return (s >= 1 && s <= 4 && w >= 1 && w <= 4) ? s * w : 0;
    }

    function fmtDate(v) {
        const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
        return m ? `${m[3]}.${m[2]}.${m[1]}` : String(v || '');
    }

    function isoToday() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function addMonths(iso, n) {
        const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return '';
        const d = new Date(Number(m[1]), Number(m[2]) - 1 + n, Number(m[3]));
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function daysBetween(fromIso, toIso) {
        const a = new Date(fromIso + 'T00:00:00'), b = new Date(toIso + 'T00:00:00');
        return Math.round((b - a) / 86400000);
    }

    // ----------------------------------------------------------------------
    // Zugriff auf den GBO-Stand
    // ----------------------------------------------------------------------

    function api() { return window.GBOState || null; }

    function stateObj() {
        const g = api();
        if (!g) return null;
        const st = g.get();
        if (!st.risk || typeof st.risk !== 'object') st.risk = {};
        if (!Array.isArray(st.reviews)) st.reviews = [];
        return st;
    }

    function entry(id) {
        const st = stateObj();
        return (st && st.risk[id]) || {};
    }

    // Einzelgefaehrdungen eines Moduls (optional). Sind Einzelgefaehrdungen
    // bewertet, ergibt sich die Modulbewertung aus dem hoechsten Einzelwert.
    function itemsOf(id) {
        const r = entry(id);
        return Array.isArray(r.items) ? r.items : [];
    }

    function topItem(items, sKey, wKey) {
        let best = null, bs = 0;
        items.forEach(it => {
            const sc = score(it[sKey], it[wKey]);
            if (sc > bs) { bs = sc; best = it; }
        });
        return best;
    }

    // Werte des Moduls: eigene Eingabe oder, falls vorhanden, abgeleitet aus Einzelgefaehrdungen
    function effective(id) {
        const r = Object.assign({}, entry(id));
        const items = itemsOf(id);
        const t0 = topItem(items, 's0', 'w0'), t1 = topItem(items, 's1', 'w1');
        r.derived0 = !!t0; r.derived1 = !!t1;
        if (t0) { r.s0 = t0.s0; r.w0 = t0.w0; }
        if (t1) { r.s1 = t1.s1; r.w1 = t1.w1; }
        return r;
    }

    // Aufbereitete Daten eines Moduls (auch fuer PDF und Texte)
    function forModule(id) {
        const r = effective(id);
        const s0 = score(r.s0, r.w0), s1 = score(r.s1, r.w1);
        const c0 = classOf(s0), c1 = classOf(s1);
        const eff = EFFECT_RESULTS.find(e => e[0] === r.effResult);
        return {
            rated0: !!s0, rated1: !!s1,
            score0: s0, score1: s1,
            class0: c0 ? c0.label : '', class1: c1 ? c1.label : '',
            key0: c0 ? c0.key : '', key1: c1 ? c1.key : '',
            acceptable: s1 ? s1 <= ACCEPTABLE_MAX : null,
            effDate: r.effDate || '', effBy: r.effBy || '',
            effResult: eff ? eff[1] : '', effKey: eff ? eff[0] : '',
            s0: r.s0 || '', w0: r.w0 || '', s1: r.s1 || '', w1: r.w1 || '',
            derived: !!(r.derived0 || r.derived1),
            items: itemsOf(id).map(it => {
                const a = score(it.s0, it.w0), b = score(it.s1, it.w1);
                const ca = classOf(a), cb = classOf(b);
                return {
                    name: it.n || '', measure: it.m || '',
                    score0: a, class0: ca ? ca.label : '', score1: b, class1: cb ? cb.label : '',
                    key1: cb ? cb.key : '', acceptable: b ? b <= ACCEPTABLE_MAX : null
                };
            }).filter(it => it.name || it.score0 || it.score1)
        };
    }

    function activeModuleIds() {
        const g = api();
        if (!g) return [];
        const D = window.GBO_DATA;
        return g.modules().map(m => m[0]).filter(id => D.questions && D.questions[id]);
    }

    function summary() {
        const ids = activeModuleIds();
        const out = { total: ids.length, unrated: 0, low: 0, mid: 0, high: 0, top: 0, notAcceptable: [], matrix: {} };
        ids.forEach(id => {
            const m = forModule(id);
            if (!m.rated1) { out.unrated++; return; }
            out[m.key1]++;
            const key = `${m.s1}-${m.w1}`;
            out.matrix[key] = (out.matrix[key] || 0) + 1;
            if (!m.acceptable) out.notAcceptable.push(id);
        });
        return out;
    }

    // ----------------------------------------------------------------------
    // Fortschreibung der GBO
    // ----------------------------------------------------------------------

    function reviewInfo() {
        const st = stateObj();
        if (!st) return null;
        const list = st.reviews.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
        const last = list[0] || null;
        const base = last ? last.date : (st.meta && /^\d{4}-\d{2}-\d{2}$/.test(String(st.meta.date || '')) ? st.meta.date : '');
        const due = base ? addMonths(base, 12) : '';
        let status = 'none', days = null;
        if (due) {
            days = daysBetween(isoToday(), due);
            status = days < 0 ? 'late' : (days <= 30 ? 'soon' : 'ok');
        }
        return { last, base, due, days, status, count: list.length, list };
    }

    function reviewLine() {
        const r = reviewInfo();
        if (!r || !r.due) return '';
        const lastPart = r.last ? `Letzte Überprüfung: ${fmtDate(r.last.date)}` : `Erstellt am ${fmtDate(r.base)}, noch keine Überprüfung dokumentiert`;
        return `${lastPart} · nächste Überprüfung spätestens ${fmtDate(r.due)}`;
    }

    // ----------------------------------------------------------------------
    // Darstellung je Modul
    // ----------------------------------------------------------------------

    function options(list, selected) {
        return '<option value="">bitte wählen</option>' + list.map(o => `<option value="${o[0]}" ${String(selected) === String(o[0]) ? 'selected' : ''}>${o[0]} · ${esc(o[1])}</option>`).join('');
    }

    function chip(key, text) {
        return `<span class="gbo-risk-chip is-${key}">${esc(text)}</span>`;
    }

    function resultHtml(s, w) {
        const sc = score(s, w);
        if (!sc) return '<span class="gbo-risk-chip is-none">noch nicht bewertet</span>';
        const c = classOf(sc);
        return `<span class="gbo-risk-score">${sc}</span>${chip(c.key, 'Risiko ' + c.label)}`;
    }

    function hintsHtml(id) {
        const m = forModule(id);
        const out = [];
        if (m.rated0) out.push(`<p class="gbo-risk-hint"><b>Ausgangsrisiko ${esc(m.class0)}:</b> ${esc(classOf(m.score0).action)}</p>`);
        if (m.rated0 && m.rated1 && m.score1 > m.score0) out.push('<p class="gbo-risk-hint warn">Das Restrisiko ist höher als das Ausgangsrisiko. Bitte beide Einstufungen prüfen.</p>');
        if (m.rated1 && !m.acceptable) out.push('<p class="gbo-risk-hint warn">Restrisiko nicht vertretbar: zusätzliche Maßnahmen festlegen und danach neu bewerten.</p>');
        if (m.rated1 && m.acceptable) out.push('<p class="gbo-risk-hint ok">Restrisiko vertretbar. Die Wirksamkeit der Maßnahmen weiter kontrollieren.</p>');
        if (m.effKey === 'no') out.push('<p class="gbo-risk-hint warn">Maßnahmen als nicht wirksam bewertet: Maßnahmen überarbeiten und das Restrisiko neu einstufen.</p>');
        if (m.effKey === 'part') out.push('<p class="gbo-risk-hint">Maßnahmen nur teilweise wirksam: Nachbesserung prüfen.</p>');
        return out.join('');
    }

    function itemRowHtml(it, i, listId) {
        return `<div class="gbo-risk-item" data-item="${i}">
  <div class="gbo-risk-item-top"><input data-item-f="n" list="${listId}" placeholder="Gefährdung benennen" value="${esc(it.n || '')}"><button type="button" class="gbo-btn secondary" data-item-del="${i}" aria-label="Einzelgefährdung entfernen">Entfernen</button></div>
  <div class="gbo-risk-item-grid">
    <label>Schwere vorher<select data-item-f="s0">${options(SEVERITY, it.s0)}</select></label>
    <label>Wahrsch. vorher<select data-item-f="w0">${options(PROBABILITY, it.w0)}</select></label>
    <label>Schwere nachher<select data-item-f="s1">${options(SEVERITY, it.s1)}</select></label>
    <label>Wahrsch. nachher<select data-item-f="w1">${options(PROBABILITY, it.w1)}</select></label>
  </div>
  <div class="gbo-risk-item-res" data-item-res>${itemResHtml(it)}</div>
  <label class="gbo-risk-item-m">Maßnahme / Bemerkung<input data-item-f="m" value="${esc(it.m || '')}"></label>
</div>`;
    }

    function itemResHtml(it) {
        return `<span>Vorher</span>${resultHtml(it.s0, it.w0)}<span>Nachher</span>${resultHtml(it.s1, it.w1)}`;
    }

    function topicList(id) {
        const q = (window.GBO_DATA.questions && window.GBO_DATA.questions[id]) || [];
        return Array.from(new Set(q.map(x => x[1]).filter(Boolean)));
    }

    function itemsHtml(id) {
        const items = itemsOf(id);
        const listId = 'gboRiskTopics-' + id;
        return `<details class="gbo-risk-items"${items.length ? ' open' : ''}><summary>Einzelgefährdungen bewerten <small>(optional, genauer als die Modulbewertung)</small></summary>
  <p class="gbo-note">Sind Einzelgefährdungen bewertet, gilt für das Modul der jeweils höchste Einzelwert. Vorschläge für die Bezeichnung stammen aus den Themen dieses Moduls.</p>
  <datalist id="${esc(listId)}">${topicList(id).map(t => `<option value="${esc(t)}">`).join('')}</datalist>
  <div data-items>${items.map((it, i) => itemRowHtml(it, i, listId)).join('')}</div>
  <button type="button" class="gbo-btn secondary" data-item-add>+ Einzelgefährdung hinzufügen</button>
</details>`;
    }

    function blockHtml(id) {
        const r = effective(id);
        const dis0 = r.derived0 ? ' disabled' : '', dis1 = r.derived1 ? ' disabled' : '';
        const eff = EFFECT_RESULTS.map(e => `<option value="${e[0]}" ${r.effResult === e[0] ? 'selected' : ''}>${e[1]}</option>`).join('');
        return `<div class="gbo-risk-head"><b>Risikobewertung dieses Moduls</b><span>Schwere × Wahrscheinlichkeit, je Stufe 1 bis 4</span></div>
<div class="gbo-risk-grid">
  <div class="gbo-risk-col">
    <h4>① Ausgangsrisiko <small>ohne die vorgesehenen Maßnahmen</small></h4>
    <label>Schwere<select data-risk-f="s0"${dis0}>${options(SEVERITY, r.s0)}</select></label>
    <label>Wahrscheinlichkeit<select data-risk-f="w0"${dis0}>${options(PROBABILITY, r.w0)}</select></label>
    <div class="gbo-risk-result" data-risk-result="0">${resultHtml(r.s0, r.w0)}</div>
  </div>
  <div class="gbo-risk-col">
    <h4>② Restrisiko <small>nach Umsetzung der Maßnahmen</small></h4>
    <label>Schwere<select data-risk-f="s1"${dis1}>${options(SEVERITY, r.s1)}</select></label>
    <label>Wahrscheinlichkeit<select data-risk-f="w1"${dis1}>${options(PROBABILITY, r.w1)}</select></label>
    <div class="gbo-risk-result" data-risk-result="1">${resultHtml(r.s1, r.w1)}</div>
  </div>
</div>
<div class="gbo-risk-derived" data-risk-derived>${(r.derived0 || r.derived1) ? 'Die Modulbewertung ergibt sich aus dem höchsten Wert der Einzelgefährdungen.' : ''}</div>
<div data-risk-items>${itemsHtml(id)}</div>
<div class="gbo-risk-hints" data-risk-hints>${hintsHtml(id)}</div>
<div class="gbo-risk-eff">
  <b>③ Wirksamkeitskontrolle</b>
  <label>Geprüft am<input type="date" data-risk-f="effDate" value="${esc(r.effDate)}"></label>
  <label>Ergebnis<select data-risk-f="effResult"><option value="">bitte wählen</option>${eff}</select></label>
  <label>Geprüft durch<input data-risk-f="effBy" value="${esc(r.effBy)}"></label>
</div>
<details class="gbo-risk-help"><summary>Skala und Risikoklassen</summary>
  <div class="gbo-risk-scale">
    <div><b>Schwere des möglichen Schadens</b><ul>${SEVERITY.map(o => `<li><b>${o[0]} · ${esc(o[1])}:</b> ${esc(o[2])}</li>`).join('')}</ul></div>
    <div><b>Wahrscheinlichkeit</b><ul>${PROBABILITY.map(o => `<li><b>${o[0]} · ${esc(o[1])}:</b> ${esc(o[2])}</li>`).join('')}</ul></div>
    <div><b>Risikoklassen (Schwere × Wahrscheinlichkeit)</b><ul>
      <li><b>1 bis 2 niedrig:</b> ${esc(CLASSES[0].action)}</li>
      <li><b>3 bis 6 mittel:</b> ${esc(CLASSES[1].action)}</li>
      <li><b>8 bis 9 hoch:</b> ${esc(CLASSES[2].action)}</li>
      <li><b>12 bis 16 sehr hoch:</b> ${esc(CLASSES[3].action)}</li>
    </ul><p class="gbo-note">Ein Restrisiko bis zur Risikozahl ${ACCEPTABLE_MAX} gilt in dieser Anwendung als vertretbar. Das ist eine betriebliche Festlegung, keine gesetzliche Vorgabe.</p></div>
  </div>
</details>`;
    }

    function chipForSummary(id) {
        const m = forModule(id);
        if (!m.rated1 && !m.rated0) return '';
        const a = m.rated0 ? `<i class="is-${m.key0}">${m.score0}</i>` : '<i class="is-none">–</i>';
        const b = m.rated1 ? `<i class="is-${m.key1}">${m.score1}</i>` : '<i class="is-none">–</i>';
        return `<span class="gbo-risk-mini" title="Ausgangsrisiko → Restrisiko">Risiko ${a} → ${b}</span>`;
    }

    function updateBlock(box, id) {
        const m = forModule(id);
        const r = effective(id);
        ['s0', 'w0', 's1', 'w1'].forEach(k => {
            const sel = box.querySelector(`:scope > .gbo-risk-grid [data-risk-f="${k}"]`);
            if (sel) { sel.value = r[k] || ''; sel.disabled = !!(k.endsWith('0') ? r.derived0 : r.derived1); }
        });
        const dn = box.querySelector('[data-risk-derived]');
        if (dn) dn.textContent = (r.derived0 || r.derived1) ? 'Die Modulbewertung ergibt sich aus dem höchsten Wert der Einzelgefährdungen.' : '';
        const res0 = box.querySelector('[data-risk-result="0"]');
        const res1 = box.querySelector('[data-risk-result="1"]');
        if (res0) res0.innerHTML = resultHtml(r.s0, r.w0);
        if (res1) res1.innerHTML = resultHtml(r.s1, r.w1);
        const hints = box.querySelector('[data-risk-hints]');
        if (hints) hints.innerHTML = hintsHtml(id);
        const details = box.closest('details.gbo-module');
        const sum = details && details.querySelector('summary');
        if (sum) {
            let mini = sum.querySelector('.gbo-risk-mini');
            const html = chipForSummary(id);
            if (mini) mini.remove();
            if (html) sum.insertAdjacentHTML('beforeend', html);
        }
        return m;
    }

    function wireItems(box, id) {
        const host = box.querySelector('[data-risk-items]');
        if (!host) return;
        const rerender = () => {
            host.innerHTML = itemsHtml(id);
            wireItems(box, id);
            updateBlock(box, id);
        };
        const items = () => {
            const st = stateObj();
            const e = st.risk[id] || (st.risk[id] = {});
            if (!Array.isArray(e.items)) e.items = [];
            return e;
        };
        const cleanup = () => {
            const st = stateObj(), e = st.risk[id];
            if (e && Array.isArray(e.items) && !e.items.length) delete e.items;
            if (e && !Object.keys(e).length) delete st.risk[id];
        };
        const add = host.querySelector('[data-item-add]');
        if (add) add.onclick = () => {
            const e = items(); e.items.push({ n: '' });
            api().save();
            rerender();
            const det = host.querySelector('details'); if (det) det.open = true;
            const inputs = host.querySelectorAll('[data-item-f="n"]'); if (inputs.length) inputs[inputs.length - 1].focus();
        };
        host.querySelectorAll('[data-item-del]').forEach(btn => {
            btn.onclick = () => {
                const i = Number(btn.dataset.itemDel);
                const e = items();
                const it = e.items[i];
                if (it && (it.n || it.s0 || it.s1) && !confirm('Diese Einzelgefährdung entfernen?')) return;
                e.items.splice(i, 1);
                cleanup();
                api().save();
                rerender();
            };
        });
        host.querySelectorAll('.gbo-risk-item').forEach(row => {
            const i = Number(row.dataset.item);
            row.querySelectorAll('[data-item-f]').forEach(inp => {
                inp.onchange = () => {
                    const e = items();
                    const it = e.items[i];
                    if (!it) return;
                    const k = inp.dataset.itemF;
                    if (inp.value === '') delete it[k]; else it[k] = inp.value;
                    api().save();
                    const res = row.querySelector('[data-item-res]');
                    if (res) res.innerHTML = itemResHtml(it);
                    updateBlock(box, id);
                };
            });
        });
    }

    function decorate() {
        const root = document.getElementById('assessment');
        if (!root || !stateObj()) return;
        root.querySelectorAll('details.gbo-module[data-module]').forEach(det => {
            const id = det.dataset.module;
            if (!(window.GBO_DATA.questions && window.GBO_DATA.questions[id])) return;
            if (det.querySelector(':scope > .gbo-risk')) return;
            const box = document.createElement('div');
            box.className = 'gbo-risk';
            box.dataset.risk = id;
            box.innerHTML = blockHtml(id);
            const target = det.querySelector(':scope > .gbo-subgroups');
            if (target) det.insertBefore(box, target); else det.appendChild(box);
            const sum = det.querySelector('summary');
            const mini = chipForSummary(id);
            if (sum && mini && !sum.querySelector('.gbo-risk-mini')) sum.insertAdjacentHTML('beforeend', mini);
            wireItems(box, id);
            box.querySelectorAll('[data-risk-f]').forEach(inp => {
                inp.onchange = () => {
                    const st = stateObj();
                    const e = st.risk[id] || (st.risk[id] = {});
                    const key = inp.dataset.riskF;
                    if (inp.value === '') delete e[key]; else e[key] = inp.value;
                    if (!Object.keys(e).length) delete st.risk[id];
                    api().save();
                    updateBlock(box, id);
                };
            });
        });
    }

    // ----------------------------------------------------------------------
    // Statistik: Risikouebersicht und Fortschreibung
    // ----------------------------------------------------------------------

    function moduleName(id) {
        const g = api();
        const m = g && g.modules().find(x => x[0] === id);
        return m ? m[1] : id;
    }

    function matrixHtml(sum) {
        let rows = '';
        for (let s = 4; s >= 1; s--) {
            let cells = '';
            for (let w = 1; w <= 4; w++) {
                const sc = s * w, c = classOf(sc);
                const n = sum.matrix[`${s}-${w}`] || 0;
                cells += `<td class="is-${c.key}" title="Schwere ${s} × Wahrscheinlichkeit ${w} = ${sc}">${n ? `<b>${n}</b>` : ''}<small>${sc}</small></td>`;
            }
            rows += `<tr><th>${s} · ${esc(SEVERITY[s - 1][1])}</th>${cells}</tr>`;
        }
        const head = PROBABILITY.map(p => `<th>${p[0]} · ${esc(p[1])}</th>`).join('');
        return `<table class="gbo-risk-matrix"><caption>Module nach Restrisiko (Anzahl)</caption><thead><tr><th>Schwere ↓ / Wahrscheinlichkeit →</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    }

    function overviewHtml() {
        const sum = summary();
        const card = (label, n, cls) => `<div class="gbo-stat-card ${cls}"><span>${label}</span><strong>${n}</strong></div>`;
        const list = sum.notAcceptable.map(id => {
            const m = forModule(id);
            return `<div class="gbo-stat-row"><div><b>${esc(moduleName(id))}</b><small>Ausgangsrisiko ${m.score0 || '–'} → Restrisiko ${m.score1} (${esc(m.class1)})</small></div><div class="gbo-stat-due late">nicht vertretbar</div></div>`;
        }).join('');
        return `<h3>Risikobewertung der Module (Restrisiko)</h3>
<p class="gbo-note">Bewertet wird je Modul nach Schwere × Wahrscheinlichkeit. Berücksichtigt sind die aktuell ausgewählten Module.</p>
<div class="gbo-stats-grid">${card('Niedrig', sum.low, 'is-ok')}${card('Mittel', sum.mid, 'is-mid')}${card('Hoch', sum.high, 'is-action')}${card('Sehr hoch', sum.top, 'is-overdue')}${card('Noch nicht bewertet', sum.unrated, '')}</div>
${matrixHtml(sum)}
<section class="gbo-stat-list"><h3>Restrisiko nicht vertretbar <span>${sum.notAcceptable.length}</span></h3>${list || '<p class="gbo-note">Keine Module mit nicht vertretbarem Restrisiko.</p>'}</section>`;
    }

    function reviewHtml() {
        const r = reviewInfo();
        if (!r) return '';
        const stText = { none: 'Noch kein Termin berechenbar: bitte das Datum der GBO in den Betriebsdaten eintragen.', ok: 'Überprüfung nicht fällig.', soon: `Überprüfung bald fällig (in ${r.days} ${r.days === 1 ? 'Tag' : 'Tagen'}).`, late: `Überprüfung überfällig seit ${Math.abs(r.days)} ${Math.abs(r.days) === 1 ? 'Tag' : 'Tagen'}.` }[r.status];
        const cls = { none: '', ok: 'ok', soon: 'warn', late: 'late' }[r.status];
        const rows = r.list.map((e, i) => `<div class="gbo-stat-row"><div><b>${fmtDate(e.date)} · ${esc(e.reason || 'Überprüfung')}</b>${e.by ? `<small>durch ${esc(e.by)}</small>` : ''}${e.note ? `<p>${esc(e.note)}</p>` : ''}</div><div class="gbo-stat-due"><button type="button" class="gbo-btn secondary" data-review-del="${i}">Entfernen</button></div></div>`).join('');
        const reasons = REVIEW_REASONS.map(x => `<option>${esc(x)}</option>`).join('');
        return `<h3>Fortschreibung der GBO</h3>
<p class="gbo-note">Die Gefährdungsbeurteilung wird mindestens jährlich und zusätzlich bei einem Anlass überprüft (zum Beispiel nach einem Unfall, bei neuen Arbeitsmitteln oder bei einer Änderung der Abläufe) und bei Bedarf angepasst.</p>
<div class="gbo-review-status ${cls}"><b>${esc(reviewLine() || 'Noch kein Überprüfungstermin')}</b><span>${esc(stText)}</span></div>
<div class="gbo-grid gbo-review-form">
  <label>Datum<input type="date" id="reviewDate" value="${isoToday()}"></label>
  <label>Anlass<select id="reviewReason">${reasons}</select></label>
  <label>Durchgeführt von<input id="reviewBy" placeholder="Name"></label>
  <label class="wide">Bemerkung<input id="reviewNote" placeholder="z. B. Ergebnis der Überprüfung, angepasste Module"></label>
</div>
<div class="gbo-doc-actions"><button type="button" class="gbo-btn" id="reviewAdd">Überprüfung dokumentieren</button></div>
<section class="gbo-stat-list"><h3>Dokumentierte Überprüfungen <span>${r.count}</span></h3>${rows || '<p class="gbo-note">Noch keine Überprüfung dokumentiert.</p>'}</section>`;
    }

    function renderOverview() {
        const panel = document.querySelector('[data-gbo-panel="statistik"]');
        const anchor = document.getElementById('gboStatsDetails');
        if (!panel || !anchor || !stateObj()) return;
        let ov = document.getElementById('gboRiskOverview');
        if (!ov) {
            ov = document.createElement('div');
            ov.id = 'gboRiskOverview';
            ov.className = 'gbo-risk-overview';
            anchor.insertAdjacentElement('afterend', ov);
        }
        ov.innerHTML = overviewHtml();
        let rv = document.getElementById('gboReview');
        if (!rv) {
            rv = document.createElement('div');
            rv.id = 'gboReview';
            rv.className = 'gbo-risk-overview';
            ov.insertAdjacentElement('afterend', rv);
        }
        const keepFocus = document.activeElement && rv.contains(document.activeElement) ? document.activeElement.id : '';
        const vals = {};
        ['reviewDate', 'reviewReason', 'reviewBy', 'reviewNote'].forEach(k => { const el = document.getElementById(k); if (el) vals[k] = el.value; });
        rv.innerHTML = reviewHtml();
        Object.keys(vals).forEach(k => { const el = document.getElementById(k); if (el && vals[k] !== '') el.value = vals[k]; });
        if (keepFocus) { const f = document.getElementById(keepFocus); if (f) f.focus(); }
        const add = document.getElementById('reviewAdd');
        if (add) add.onclick = () => {
            const date = document.getElementById('reviewDate').value;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { alert('Bitte ein Datum angeben.'); return; }
            const st = stateObj();
            st.reviews.push({
                date,
                reason: document.getElementById('reviewReason').value,
                by: document.getElementById('reviewBy').value.trim(),
                note: document.getElementById('reviewNote').value.trim()
            });
            api().save();
            ['reviewBy', 'reviewNote'].forEach(k => { const el = document.getElementById(k); if (el) el.value = ''; });
            renderOverview();
        };
        rv.querySelectorAll('[data-review-del]').forEach(b => b.onclick = () => {
            if (!confirm('Diesen Eintrag zur Überprüfung entfernen?')) return;
            const st = stateObj();
            const sorted = st.reviews.slice().sort((a, c) => String(c.date).localeCompare(String(a.date)));
            const target = sorted[Number(b.dataset.reviewDel)];
            st.reviews = st.reviews.filter(x => x !== target);
            api().save();
            renderOverview();
        });
    }

    // ----------------------------------------------------------------------
    // Oeffentliche Schnittstelle (PDF, Texte)
    // ----------------------------------------------------------------------

    window.GBORisk = {
        forModule,
        summary,
        reviewInfo,
        reviewLine,
        classOf,
        ACCEPTABLE_MAX,
        CLASSES,
        SEVERITY,
        PROBABILITY
    };

    function init() {
        decorate();
        renderOverview();
    }

    document.addEventListener('asic:gbo-rendered', init);
    document.addEventListener('asic:gbo-saved', renderOverview);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
