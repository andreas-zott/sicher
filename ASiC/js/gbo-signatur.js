// ==========================================================================
// ASiC Handel — GBO: Unterschriftenfelder (Freigabe)
// ==========================================================================
// Zeichenfelder für die verantwortliche Person (Marktleitung / Unternehmer)
// und die erstellende Person. Die Unterschrift wird als kleines PNG im GBO-Stand
// gespeichert (state.signatures) und auf Seite 2 des PDF eingesetzt.
// Hinweis: Das ist eine eingescannte Handunterschrift als Bild, keine qualifizierte
// elektronische Signatur. Sie ersetzt nicht die Schriftform, wo diese vorgeschrieben ist.
// ==========================================================================
(function () {
    'use strict';

    const FIELDS = [
        { key: 'verantwortlich', title: 'Verantwortliche Person (Marktleitung / Unternehmer)', metaName: 'marktleitung' },
        { key: 'ersteller', title: 'Ersteller (Fachkraft für Arbeitssicherheit / Prüfer)', metaName: 'pruefername' }
    ];
    const W = 600, H = 200;
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    const fmt = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? v.slice(8, 10) + '.' + v.slice(5, 7) + '.' + v.slice(0, 4) : '';
    const api = () => window.GBOState || null;

    function sigs() {
        const st = api().get();
        if (!st.signatures || typeof st.signatures !== 'object') st.signatures = {};
        return st.signatures;
    }

    function fieldHtml(f) {
        const s = sigs()[f.key] || {};
        const st = api().get();
        const name = s.name != null ? s.name : (st.meta && st.meta[f.metaName]) || '';
        return `<div class="gbo-sig" data-sig="${f.key}">
  <h4>${esc(f.title)}</h4>
  <div class="gbo-sig-row">
    <label>Name<input data-sig-name value="${esc(name)}" autocomplete="off"></label>
    <label>Datum<input type="date" data-sig-date value="${esc(s.date || '')}"></label>
  </div>
  <div class="gbo-sig-pad"><canvas width="${W}" height="${H}" aria-label="Unterschriftenfeld: mit Finger oder Stift unterschreiben"></canvas><span class="gbo-sig-hint">Hier unterschreiben</span></div>
  <div class="gbo-doc-actions"><button type="button" class="gbo-btn secondary" data-sig-clear>Unterschrift löschen</button><span class="gbo-sig-state" data-sig-state>${s.img ? 'Unterschrift gespeichert' + (s.date ? ' am ' + fmt(s.date) : '') : 'Noch keine Unterschrift'}</span></div>
</div>`;
    }

    function wire(box, f) {
        const canvas = box.querySelector('canvas'), ctx = canvas.getContext('2d');
        if (!ctx) return;
        const hint = box.querySelector('.gbo-sig-hint'), state = box.querySelector('[data-sig-state]');
        ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111';
        const cur = sigs()[f.key];
        if (cur && cur.img) {
            const im = new Image();
            im.onload = () => { ctx.drawImage(im, 0, 0, W, H); hint.hidden = true; };
            im.src = cur.img;
        }
        const pos = e => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
        let drawing = false, last = null;
        const save = () => {
            const s = sigs(), e = s[f.key] || (s[f.key] = {});
            e.img = canvas.toDataURL('image/png');
            e.name = box.querySelector('[data-sig-name]').value;
            if (!e.date) e.date = today();
            box.querySelector('[data-sig-date]').value = e.date;
            api().save();
            state.textContent = 'Unterschrift gespeichert am ' + fmt(e.date);
        };
        canvas.addEventListener('pointerdown', e => {
            e.preventDefault(); drawing = true; last = pos(e); hint.hidden = true;
            try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* ignorieren */ }
            ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(last[0] + 0.1, last[1] + 0.1); ctx.stroke();
        });
        canvas.addEventListener('pointermove', e => {
            if (!drawing) return;
            e.preventDefault();
            const p = pos(e);
            ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
            last = p;
        });
        const end = e => { if (!drawing) return; drawing = false; save(); };
        canvas.addEventListener('pointerup', end);
        canvas.addEventListener('pointercancel', end);
        box.querySelector('[data-sig-clear]').onclick = () => {
            ctx.clearRect(0, 0, W, H); hint.hidden = false;
            const s = sigs();
            if (s[f.key]) { delete s[f.key].img; if (!s[f.key].name && !s[f.key].date) delete s[f.key]; }
            api().save();
            state.textContent = 'Noch keine Unterschrift';
        };
        box.querySelector('[data-sig-name]').onchange = ev => {
            const s = sigs(); (s[f.key] || (s[f.key] = {})).name = ev.target.value; api().save();
        };
        box.querySelector('[data-sig-date]').onchange = ev => {
            const s = sigs(); (s[f.key] || (s[f.key] = {})).date = ev.target.value; api().save();
        };
    }

    function render() {
        const panel = document.querySelector('[data-gbo-panel="dokumentation"]');
        if (!panel || !api()) return;
        if (document.getElementById('gboSignaturen')) return;
        const sec = document.createElement('section');
        sec.id = 'gboSignaturen';
        sec.className = 'gbo-sig-section';
        sec.innerHTML = `<h3>Freigabe und Unterschrift</h3>
<p class="gbo-note">Mit Finger oder Stift im Feld unterschreiben. Die Unterschrift wird im GBO-Stand gespeichert und auf Seite 2 des PDF eingesetzt. Es handelt sich um eine Handunterschrift als Bild, nicht um eine qualifizierte elektronische Signatur. Ändert sich die GBO wesentlich, sollte die Freigabe erneut unterschrieben werden.</p>
<div class="gbo-sig-grid">${FIELDS.map(fieldHtml).join('')}</div>`;
        const first = panel.querySelector('.gbo-doc-primary');
        if (first) first.insertAdjacentElement('beforebegin', sec); else panel.appendChild(sec);
        FIELDS.forEach(f => wire(sec.querySelector(`[data-sig="${f.key}"]`), f));
    }

    window.GBOSignatur = { render };
    document.addEventListener('asic:gbo-rendered', render);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
