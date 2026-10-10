// ==========================================================================
// ASiC Handel — GBO: Fristüberwachung und Erinnerungsmail an den Markt
// ==========================================================================
// Zeigt überfällige Maßnahmen (Frist überschritten, nicht erledigt) und die
// fällige jährliche Überprüfung der GBO. Aus der Liste lässt sich per Knopfdruck
// ein Mailentwurf an die hinterlegte Marktadresse erstellen.
// Hinweis: Eine reine Browser-App kann Mails nicht selbstständig versenden.
// Der Entwurf wird im Mailprogramm des Geräts geöffnet und dort abgeschickt.
// Ein automatischer Versand (z. B. täglich) setzt einen Server voraus.
// Hinweis zur Datenhaltung: Es werden nur Angaben aus dem eigenen GBO-Stand
// verwendet; es werden keine Daten an Dritte übertragen.
// ==========================================================================
(function () {
    'use strict';

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const iso = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    const fmt = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? v.slice(8, 10) + '.' + v.slice(5, 7) + '.' + v.slice(0, 4) : (v || '');
    const days = (a, b) => Math.round((Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10))) / 86400000);
    const api = () => window.GBOState || null;

    function overdueList() {
        const g = api();
        if (!g || !window.GBO_DATA) return [];
        const st = g.get(), today = iso(), out = [];
        g.modules().forEach(m => {
            (window.GBO_DATA.questions[m[0]] || []).forEach(q => {
                const a = (st.answers || {})[q[0]];
                if (!a || !['action', 'consult'].includes(a.status) || !a.due || a.done || a.due >= today) return;
                const list = Array.isArray(a.measures) ? a.measures.filter(Boolean) : [];
                const text = [list.join('; '), a.measure].filter(Boolean).join('; ') || q[2];
                out.push({ id: q[0], module: m[1], topic: q[1], text, due: a.due, owner: a.owner || '', late: days(a.due, today) });
            });
        });
        return out.sort((x, y) => y.late - x.late);
    }

    function reviewStatus() {
        return window.GBORisk && GBORisk.reviewInfo ? GBORisk.reviewInfo() : null;
    }

    function mailText(list, rv) {
        const st = api().get(), meta = st.meta || {};
        const markt = meta.marktnummer || '-';
        const t = [];
        t.push('Guten Tag' + (meta.marktleitung ? ' ' + meta.marktleitung : '') + ',');
        t.push(`für den Markt ${markt}${meta.plzOrt ? ' (' + meta.plzOrt + ')' : ''} sind in der Gefährdungsbeurteilung Fristen überschritten.`);
        if (list.length) {
            t.push('Überfällige Maßnahmen:\n' + list.map((x, i) => `${i + 1}. ${x.module} – ${x.topic}\n   Maßnahme: ${x.text}\n   Frist: ${fmt(x.due)} (${x.late} ${x.late === 1 ? 'Tag' : 'Tage'} überfällig)${x.owner ? '\n   Zuständig: ' + x.owner : ''}`).join('\n'));
        }
        if (rv && rv.status === 'late') t.push(`Die jährliche Überprüfung der Gefährdungsbeurteilung war spätestens am ${fmt(rv.due)} fällig.`);
        t.push('Bitte setzen Sie die Maßnahmen um und tragen Sie die Erledigung mit Datum ein. Falls eine Frist nicht zu halten ist, teilen Sie mir bitte den Grund und einen neuen Termin mit.');
        t.push(`Mit freundlichen Grüßen\n${meta.pruefername ? meta.pruefername + '\n' : ''}Fachkraft für Arbeitssicherheit (SiFa)`);
        return t.join('\n\n');
    }

    function html() {
        const list = overdueList(), rv = reviewStatus();
        const rvLate = !!(rv && rv.status === 'late');
        const meta = api().get().meta || {};
        const mail = (meta.marktEmail || '').trim();
        const rows = list.map(x => `<div class="gbo-stat-row"><div><b>${esc(x.module)} · ${esc(x.topic)}</b><small>${esc(x.text)}${x.owner ? ' · zuständig: ' + esc(x.owner) : ''}</small></div><div class="gbo-stat-due late">${fmt(x.due)} · ${x.late} T. überfällig</div></div>`).join('');
        const last = (api().get().reminders || []).slice(-1)[0];
        return `<h3>Fristüberwachung</h3>
<p class="gbo-note">Zeigt Maßnahmen mit abgelaufener Frist, die noch nicht als erledigt markiert sind, und die jährliche Überprüfung der GBO.</p>
<div class="gbo-review-status ${list.length || rvLate ? 'late' : 'ok'}"><b>${list.length ? list.length + (list.length === 1 ? ' Frist überschritten' : ' Fristen überschritten') : 'Keine überfälligen Maßnahmen'}${rvLate ? ' · Überprüfung der GBO überfällig' : ''}</b><span>${last ? 'Zuletzt Erinnerung erstellt am ' + fmt(last.date) + ' (' + last.count + ' Punkte)' : 'Noch keine Erinnerung erstellt'}</span></div>
<section class="gbo-stat-list"><h3>Überfällige Maßnahmen <span>${list.length}</span></h3>${rows || '<p class="gbo-note">Keine Maßnahme mit abgelaufener Frist.</p>'}</section>
<div class="gbo-doc-actions"><button type="button" class="gbo-btn" id="fristMail" ${list.length || rvLate ? '' : 'disabled'}>Erinnerung per Mail vorbereiten</button></div>
<p class="gbo-note">${mail ? 'Empfänger: ' + esc(mail) : 'Keine E-Mail-Adresse des Marktes hinterlegt (Betriebsdaten, Feld „E-Mail des Marktes“). Der Entwurf wird ohne Empfänger geöffnet.'} Die App öffnet nur einen Entwurf im Mailprogramm; abgeschickt wird er von Ihnen. Ein automatischer Versand ist ohne Server nicht möglich.</p>`;
    }

    function banner() {
        const host = document.querySelector('main');
        if (!host || !api()) return;
        let b = document.getElementById('gboFristBanner');
        const n = overdueList().length, rv = reviewStatus(), late = !!(rv && rv.status === 'late');
        if (!n && !late) { if (b) b.remove(); return; }
        if (!b) {
            b = document.createElement('div');
            b.id = 'gboFristBanner';
            b.className = 'gbo-frist-banner';
            b.setAttribute('role', 'status');
            host.insertAdjacentElement('afterbegin', b);
        }
        b.textContent = (n ? `${n} ${n === 1 ? 'Frist' : 'Fristen'} überschritten` : '') + (n && late ? ' · ' : '') + (late ? 'Überprüfung der GBO überfällig' : '') + ' – siehe Statistik, Fristüberwachung.';
    }

    function render() {
        const panel = document.querySelector('[data-gbo-panel="statistik"]');
        if (!panel || !api()) { banner(); return; }
        let box = document.getElementById('gboFristen');
        if (!box) {
            box = document.createElement('div');
            box.id = 'gboFristen';
            box.className = 'gbo-risk-overview';
            const after = document.getElementById('gboReview') || document.getElementById('gboRiskOverview') || document.getElementById('gboStatsDetails');
            if (!after) return;
            after.insertAdjacentElement('afterend', box);
        }
        box.innerHTML = html();
        const btn = document.getElementById('fristMail');
        if (btn) btn.onclick = () => {
            const list = overdueList(), rv = reviewStatus(), st = api().get(), meta = st.meta || {};
            const subj = `Arbeitsschutz: Überfällige Maßnahmen – Markt ${meta.marktnummer || '-'}`;
            const to = (meta.marktEmail || '').trim();
            (st.reminders = st.reminders || []).push({ date: iso(), count: list.length });
            api().save();
            window.location.href = `mailto:${encodeURIComponent(to).replace(/%40/g, '@')}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(mailText(list, rv))}`;
        };
        banner();
    }

    window.GBOFristen = { overdue: overdueList, mailText };
    document.addEventListener('asic:gbo-rendered', () => setTimeout(render, 0));
    document.addEventListener('asic:gbo-saved', () => setTimeout(render, 0));
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(render, 0)); else setTimeout(render, 0);
})();
