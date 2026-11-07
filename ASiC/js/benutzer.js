// ==========================================================================
// ASiC Handel — Benutzerverwaltung (ab Rev. 1.55)
// ==========================================================================
// Spricht mit benutzer.php über nasFetch (Zugriffsschlüssel + Anmeldung).
// Alle Texte aus dem Server werden mit textContent bzw. escapeHtml
// eingesetzt – nie als HTML.
// ==========================================================================

(function () {
    'use strict';

    const el = id => document.getElementById(id);
    let ich = '';

    const EREIGNIS = {
        'anmeldung': 'Anmeldung',
        'anmeldung-fehl': 'Anmeldung fehlgeschlagen',
        'anmeldung-gesperrt': 'Anmeldung während Sperre versucht',
        'abmeldung': 'Abmeldung',
        'passwort-geaendert': 'Passwort geändert',
        'passwort-fehl': 'Passwortänderung: altes Passwort falsch',
        'passwort-zurueckgesetzt': 'Passwort zurückgesetzt',
        'benutzer-angelegt': 'Benutzer angelegt',
        'benutzer-geaendert': 'Benutzer geändert',
        'benutzer-geloescht': 'Benutzer gelöscht',
        'einrichtung': 'Erster Administrator angelegt',
        'einstellung-geaendert': 'Einstellung geändert',
        'pdf-abruf': 'PDF angesehen',
        'archiv-geloescht': 'Im Archiv gelöscht'
    };

    function zeit(iso) {
        const d = iso ? new Date(iso) : null;
        if (!d || isNaN(d)) return '–';
        return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', '
            + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    }

    function fehler(text) {
        const f = el('bv-fehler');
        f.textContent = text || '';
        f.hidden = !text;
    }

    async function holen(abfrage) {
        const res = await nasFetch('benutzer.php', abfrage, { cache: 'no-store' });
        const j = await res.json().catch(() => ({}));
        if (!res.ok || !j.ok) throw new Error(j.message || ('Fehler ' + res.status));
        return j;
    }

    async function senden(daten) {
        const body = JSON.stringify(daten);
        const res = await nasFetch('benutzer.php', '', {
            method: 'POST', cache: 'no-store',
            headers: { 'Content-Type': 'application/json', 'X-ASiC': '1' },
            body
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok || !j.ok) throw new Error(j.message || ('Fehler ' + res.status));
        return j;
    }

    function startpasswortZeigen(titel, wert) {
        el('bv-start-titel').textContent = titel;
        el('bv-start-wert').textContent = wert;
        el('bv-start').hidden = false;
        el('bv-start').scrollIntoView({ block: 'center' });
    }

    function status(b) {
        if (!b.aktiv) return 'gesperrt';
        if (b.gesperrtBis) return 'vorübergehend gesperrt bis ' + zeit(b.gesperrtBis).split(', ')[1] + ' Uhr';
        if (b.mussAendern) return 'Startpasswort noch nicht geändert';
        return 'aktiv';
    }

    function knopf(text, aktion, art) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn ' + (art === 'warn' ? 'btn-secondary srv-btn-warn' : 'btn-secondary');
        b.textContent = text;
        b.addEventListener('click', aktion);
        return b;
    }

    async function frage(titel, text, knopfText, warn) {
        return await zeigeHinweisFenster({
            titel, punkte: [text],
            knoepfe: [{ w: 'ja', text: knopfText, art: warn ? 'warn' : 'primaer' }, { w: '', text: 'Abbrechen' }]
        }) === 'ja';
    }

    async function ausfuehren(daten, erfolg) {
        fehler('');
        try {
            const j = await senden(daten);
            if (erfolg) erfolg(j);
        } catch (e) {
            fehler(e.message);
        }
        await laden();
    }

    function zeile(b) {
        const z = document.createElement('div');
        z.className = 'bv-zeile' + (b.aktiv ? '' : ' bv-inaktiv');

        const kopf = document.createElement('div');
        kopf.className = 'bv-kopf';
        const name = document.createElement('strong');
        name.textContent = b.name;
        const kennung = document.createElement('span');
        kennung.className = 'bv-kennung';
        kennung.textContent = b.kennung + (b.kennung === ich ? ' · Sie' : '');
        const rolle = document.createElement('span');
        rolle.className = 'srv-badge' + (b.rolle === 'admin' ? ' bv-admin' : '');
        rolle.textContent = b.rolle === 'admin' ? 'Administrator' : 'Prüfer';
        kopf.append(name, kennung, rolle);

        const info = document.createElement('div');
        info.className = 'bv-info';
        info.textContent = status(b) + ' · letzte Anmeldung: ' + (b.letzteAnmeldung ? zeit(b.letzteAnmeldung) : 'noch nie')
            + (b.rolle === 'admin' ? ' · PDF-Archiv: ja (Administrator)' : ' · PDF-Archiv: ' + (b.pdfLesen ? 'ja' : 'nein'));

        const aktionen = document.createElement('div');
        aktionen.className = 'bv-aktionen';
        aktionen.append(knopf('Passwort zurücksetzen', async () => {
            if (!await frage('Passwort zurücksetzen?', b.name + ' bekommt ein neues Startpasswort und wird auf allen Geräten abgemeldet.', 'Zurücksetzen')) return;
            ausfuehren({ aktion: 'zuruecksetzen', kennung: b.kennung }, j => startpasswortZeigen('Neues Startpasswort für ' + b.name, j.startpasswort));
        }));
        if (b.rolle !== 'admin') {
            aktionen.append(knopf(b.pdfLesen ? 'PDF-Archiv entziehen' : 'PDF-Archiv erlauben', async () => {
                if (!b.pdfLesen && !await frage('PDF-Archiv erlauben?', b.name + ' kann danach alle abgelegten PDFs ansehen – mit Fotos, Namen und Unterschriften. Jeder Abruf wird protokolliert.', 'Erlauben')) return;
                ausfuehren({ aktion: 'aendern', kennung: b.kennung, pdfLesen: !b.pdfLesen });
            }));
        }
        if (b.kennung !== ich) {
            aktionen.append(knopf(b.aktiv ? 'Sperren' : 'Entsperren', async () => {
                if (b.aktiv && !await frage('Konto sperren?', b.name + ' kann sich danach nicht mehr anmelden und wird auf allen Geräten abgemeldet.', 'Sperren', true)) return;
                ausfuehren({ aktion: 'aendern', kennung: b.kennung, aktiv: !b.aktiv });
            }));
            aktionen.append(knopf(b.rolle === 'admin' ? 'Zum Prüfer machen' : 'Zum Administrator machen', async () => {
                if (!await frage('Rolle ändern?', b.name + ' wird ' + (b.rolle === 'admin' ? 'Prüfer und kann keine Benutzer mehr verwalten.' : 'Administrator und kann Benutzer verwalten.'), 'Ändern')) return;
                ausfuehren({ aktion: 'aendern', kennung: b.kennung, rolle: b.rolle === 'admin' ? 'pruefer' : 'admin' });
            }));
            aktionen.append(knopf('Löschen', async () => {
                if (!await frage('Konto löschen?', 'Das Konto von ' + b.name + ' wird endgültig gelöscht. Begehungen im Team-Archiv bleiben erhalten.', 'Löschen', true)) return;
                ausfuehren({ aktion: 'loeschen', kennung: b.kennung });
            }, 'warn'));
        }

        z.append(kopf, info, aktionen);
        return z;
    }

    function zeigeEinstellungen(e) {
        if (!e) return;
        el('bv-auto').checked = !!e.autoTeamArchiv;
        el('bv-pdf').checked = e.autoPdfArchiv !== false;
        el('bv-loeschen').checked = !!e.archivLoeschen;
        try { localStorage.setItem('asicAutoPdfArchiv', e.autoPdfArchiv !== false ? '1' : '0'); } catch (err) { /* ohne Speicher */ }
        el('bv-auto-status').textContent = e.geaendert
            ? 'Zuletzt geändert am ' + zeit(e.geaendert) + ' Uhr von ' + (e.von || '–') + '.'
            : 'Voreinstellung (noch nicht geändert).';
        try { localStorage.setItem('asicAutoTeamArchiv', e.autoTeamArchiv ? '1' : '0'); } catch (err) { /* ohne Speicher */ }
    }

    function schalterVerbinden(id, feld, text) {
        el(id).addEventListener('change', async () => {
            const schalter = el(id);
            const wert = schalter.checked;
            schalter.disabled = true;
            fehler('');
            try {
                const daten = { aktion: 'einstellung' };
                daten[feld] = wert;
                const j = await senden(daten);
                zeigeEinstellungen(j.einstellungen);
                if (typeof showToast === 'function') showToast(text + ': ' + (wert ? 'an' : 'aus'));
            } catch (err) {
                schalter.checked = !wert;
                fehler(err.message);
            } finally {
                schalter.disabled = false;
            }
        });
    }
    schalterVerbinden('bv-auto', 'autoTeamArchiv', 'Automatisch ins Team-Archiv');
    schalterVerbinden('bv-pdf', 'autoPdfArchiv', 'PDFs automatisch im PDF-Archiv');
    schalterVerbinden('bv-loeschen', 'archivLoeschen', 'Löschen im Archiv');

    async function laden() {
        const liste = el('bv-liste');
        try {
            const j = await holen('aktion=liste');
            ich = j.ich || '';
            zeigeEinstellungen(j.einstellungen);
            liste.textContent = '';
            if (!j.benutzer.length) {
                liste.innerHTML = '<p class="s-hint">Noch keine Benutzer.</p>';
                return;
            }
            j.benutzer.forEach(b => liste.append(zeile(b)));
        } catch (e) {
            liste.innerHTML = '';
            fehler(e.message === 'Failed to fetch'
                ? 'Der Server ist nicht erreichbar. Die Benutzerverwaltung braucht eine Verbindung.'
                : e.message);
        }
    }

    el('bv-form').addEventListener('submit', async e => {
        e.preventDefault();
        const st = el('bv-status');
        st.textContent = '';
        st.className = 's-status';
        const name = el('bv-name').value.trim();
        const kennung = el('bv-kennung').value.trim().toLowerCase();
        if (!name || !kennung) {
            st.textContent = 'Bitte Name und Anmeldename angeben.';
            st.className = 's-status is-error';
            return;
        }
        el('bv-anlegen').disabled = true;
        try {
            const j = await senden({ aktion: 'anlegen', kennung, name, rolle: el('bv-rolle').value });
            el('bv-name').value = '';
            el('bv-kennung').value = '';
            el('bv-rolle').value = 'pruefer';
            startpasswortZeigen('Startpasswort für ' + name + ' (' + j.kennung + ')', j.startpasswort);
            await laden();
        } catch (err) {
            st.textContent = err.message;
            st.className = 's-status is-error';
        } finally {
            el('bv-anlegen').disabled = false;
        }
    });

    el('bv-start-kopieren').addEventListener('click', async () => {
        const text = el('bv-start-wert').textContent;
        let ok = false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                ok = true;
            }
        } catch (e) { ok = false; }
        if (!ok) {
            // Ersatz: Text markieren, damit er von Hand kopiert werden kann
            const r = document.createRange();
            r.selectNodeContents(el('bv-start-wert'));
            const s = window.getSelection();
            s.removeAllRanges();
            s.addRange(r);
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        }
        if (typeof showToast === 'function') showToast(ok ? 'Startpasswort kopiert' : 'Bitte markierten Text kopieren', ok ? 'success' : 'info');
    });
    el('bv-start-ok').addEventListener('click', () => {
        el('bv-start-wert').textContent = '';
        el('bv-start').hidden = true;
    });

    el('bv-protokoll-laden').addEventListener('click', async () => {
        const ziel = el('bv-protokoll');
        try {
            const j = await holen('aktion=protokoll');
            if (!j.eintraege.length) {
                ziel.innerHTML = '<p class="s-hint">Noch keine Einträge.</p>';
                return;
            }
            const t = document.createElement('table');
            t.className = 'bv-tabelle';
            const kopf = t.createTHead().insertRow();
            ['Zeit', 'Ereignis', 'Konto', 'Absender', 'Hinweis'].forEach(h => {
                const th = document.createElement('th');
                th.textContent = h;
                kopf.append(th);
            });
            const rumpf = t.createTBody();
            j.eintraege.forEach(e => {
                const r = rumpf.insertRow();
                [zeit(e.zeit), EREIGNIS[e.ereignis] || e.ereignis, e.kennung, e.ip, e.zusatz].forEach(w => {
                    r.insertCell().textContent = w || '';
                });
            });
            ziel.textContent = '';
            ziel.append(t);
        } catch (err) {
            fehler(err.message);
        }
    });

    (async function start() {
        const s = window.asicAnmeldung ? await window.asicAnmeldung : null;
        if (s && s.aktiv && s.benutzer && s.benutzer.rolle !== 'admin') {
            fehler('Die Benutzerverwaltung ist Administratoren vorbehalten.');
            document.querySelectorAll('#neu, #liste, #protokoll, #team').forEach(x => { x.hidden = true; });
            return;
        }
        if (s && !s.aktiv) {
            fehler('Auf diesem Server ist die Anmeldung nicht eingeschaltet (config.php).');
            document.querySelectorAll('#neu, #liste, #protokoll, #team').forEach(x => { x.hidden = true; });
            return;
        }
        laden();
    })();
})();
