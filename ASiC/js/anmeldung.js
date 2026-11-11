// ==========================================================================
// ASiC Handel — Anmeldeseite (ab Rev. 1.55)
// ==========================================================================
// Anmelden und Passwort ändern. Spricht nur mit anmeldung.php auf demselben
// Server. Nach Erfolg geht es zur Seite zurück, von der man kam (?ziel=).
// Das Sitzungs-Cookie setzt der Server (HttpOnly) – diese Seite sieht es nie.
// ==========================================================================

(function () {
    'use strict';

    const params = new URLSearchParams(location.search);
    const ziel = sicheresZiel(params.get('ziel'));
    const nurPasswort = params.get('aktion') === 'passwort';
    let minLaenge = 10;

    // Nur Seiten dieser App als Ziel zulassen (keine fremden Adressen)
    function sicheresZiel(wert) {
        const w = String(wert || '');
        return /^[a-z0-9-]+\.html(#[a-z0-9-]*)?$/i.test(w) ? w : 'index.html';
    }

    const el = id => document.getElementById(id);

    // Ab 1.55-17: Firmenlogo über der Anmeldung, wenn die Seite es enthält
    // (IT-Paket: briefkopf-logo.png). Erst nach erfolgreichem Laden zeigen.
    (function () {
        const logo = el('an-firmenlogo');
        if (!logo) return;
        const zeigen = () => { if (logo.naturalWidth > 0) logo.hidden = false; };
        if (logo.complete) zeigen(); else logo.addEventListener('load', zeigen);
    })();

    function zeige(id) {
        ['form-anmelden', 'form-passwort', 'an-hinweis'].forEach(f => { el(f).hidden = f !== id; });
        const erstesFeld = el(id).querySelector('input:not([hidden])');
        if (erstesFeld) erstesFeld.focus();
    }

    function hinweis(titel, text, mitLink) {
        el('hinweis-titel').textContent = titel;
        el('hinweis-text').textContent = text;
        el('hinweis-link').hidden = !mitLink;
        el('hinweis-link').href = ziel;
        zeige('an-hinweis');
    }

    function weiter() {
        location.replace(ziel);
    }

    async function anfrage(daten) {
        const res = await fetch('anmeldung.php', {
            method: 'POST',
            credentials: 'same-origin',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json', 'X-ASiC': '1' },
            body: JSON.stringify(daten)
        });
        let j = null;
        try { j = await res.json(); } catch (e) { j = null; }
        return { res, j: j || {} };
    }

    function netzFehler(meldungId) {
        el(meldungId).textContent = navigator.onLine === false
            ? 'Keine Verbindung. Zum Anmelden wird eine Verbindung zum Server gebraucht.'
            : 'Der Server ist gerade nicht erreichbar. Bitte später erneut versuchen.';
    }

    function passwortAnsicht(erzwungen, kennung) {
        el('passwort-text').textContent = erzwungen
            ? 'Sie haben ein Startpasswort erhalten. Bitte jetzt ein eigenes Passwort festlegen.'
            : 'Hier können Sie Ihr Passwort ändern.';
        el('btn-passwort-abbrechen').hidden = erzwungen;
        el('pw-kennung').value = kennung || '';
        el('pw-regel').textContent = 'Mindestens ' + minLaenge + ' Zeichen. Tipp: ein kurzer Satz ist leichter zu merken und schwer zu erraten.';
        zeige('form-passwort');
    }

    // Auge-Knopf: Eingabe sichtbar machen
    document.querySelectorAll('[data-zeige]').forEach(b => {
        b.addEventListener('click', () => {
            const f = el(b.dataset.zeige);
            const sichtbar = f.type === 'password';
            f.type = sichtbar ? 'text' : 'password';
            b.setAttribute('aria-pressed', sichtbar ? 'true' : 'false');
            b.setAttribute('aria-label', sichtbar ? 'Passwort verbergen' : 'Passwort anzeigen');
        });
    });

    el('form-anmelden').addEventListener('submit', async e => {
        e.preventDefault();
        const kennung = el('an-kennung').value.trim();
        const passwort = el('an-passwort').value;
        const meldung = el('meldung-anmelden');
        meldung.textContent = '';
        if (!kennung || !passwort) {
            meldung.textContent = 'Bitte Anmeldename und Passwort eingeben.';
            return;
        }
        const knopf = el('btn-anmelden');
        knopf.disabled = true;
        try {
            const { res, j } = await anfrage({ aktion: 'anmelden', kennung, passwort });
            if (res.ok && j.ok) {
                el('an-passwort').value = '';
                try { localStorage.setItem('asicAnmeldename', kennung); } catch (err) {}
                if (j.benutzer && j.benutzer.mussAendern) {
                    el('pw-alt').value = passwort;
                    passwortAnsicht(true, j.benutzer.kennung);
                    el('pw-alt').closest('.s-field').hidden = true;
                    el('pw-neu').focus();
                } else {
                    weiter();
                }
                return;
            }
            meldung.textContent = j.message || 'Die Anmeldung hat nicht geklappt.';
            el('an-passwort').value = '';
            el('an-passwort').focus();
        } catch (err) {
            netzFehler('meldung-anmelden');
        } finally {
            knopf.disabled = false;
        }
    });

    el('form-passwort').addEventListener('submit', async e => {
        e.preventDefault();
        const meldung = el('meldung-passwort');
        meldung.textContent = '';
        const alt = el('pw-alt').value;
        const neu = el('pw-neu').value;
        if (!alt || !neu) {
            meldung.textContent = 'Bitte alle Felder ausfüllen.';
            return;
        }
        if (neu !== el('pw-neu2').value) {
            meldung.textContent = 'Die beiden neuen Passwörter stimmen nicht überein.';
            return;
        }
        if (neu.length < minLaenge) {
            meldung.textContent = 'Das Passwort muss mindestens ' + minLaenge + ' Zeichen lang sein.';
            return;
        }
        const knopf = el('btn-passwort');
        knopf.disabled = true;
        try {
            const { res, j } = await anfrage({ aktion: 'passwort', alt, neu });
            if (res.ok && j.ok) {
                ['pw-alt', 'pw-neu', 'pw-neu2'].forEach(id => { el(id).value = ''; });
                hinweis('Passwort geändert', 'Ihr neues Passwort gilt ab sofort.', false);
                setTimeout(weiter, 1200);
                return;
            }
            if (j.grund === 'anmeldung') {
                el('pw-alt').closest('.s-field').hidden = false;
                el('meldung-anmelden').textContent = 'Die Anmeldung ist abgelaufen. Bitte erneut anmelden.';
                zeige('form-anmelden');
                return;
            }
            meldung.textContent = j.message || 'Das Passwort konnte nicht geändert werden.';
            if (!el('pw-alt').closest('.s-field').hidden && /bisherige/.test(j.message || '')) el('pw-alt').focus();
        } catch (err) {
            netzFehler('meldung-passwort');
        } finally {
            knopf.disabled = false;
        }
    });

    el('btn-passwort-abbrechen').addEventListener('click', weiter);

    // Beim Öffnen: Ist die Anmeldung eingeschaltet, ist man schon angemeldet?
    (async function start() {
        let s = null;
        try {
            const res = await fetch('anmeldung.php?aktion=status', { credentials: 'same-origin', cache: 'no-store' });
            s = await res.json();
        } catch (e) {
            hinweis('Keine Verbindung',
                'Zum Anmelden wird eine Verbindung zum Server gebraucht. Eine bereits geöffnete App funktioniert auch ohne Verbindung weiter.',
                true);
            return;
        }
        if (s && Number.isFinite(s.passwortMinLaenge)) minLaenge = s.passwortMinLaenge;
        try {
            if (s && typeof s.autoTeamArchiv === 'boolean') localStorage.setItem('asicAutoTeamArchiv', s.autoTeamArchiv ? '1' : '0');
            if (s && typeof s.autoPdfArchiv === 'boolean') localStorage.setItem('asicAutoPdfArchiv', s.autoPdfArchiv ? '1' : '0');
            // Merker des früheren Zugangscodes (bis 1.55-9) aufräumen
            localStorage.removeItem('asicAnmeldungAktiv');
            localStorage.removeItem('asicHandelAccessGranted');
        } catch (e) { /* ohne Speicher: weiter */ }
        if (!s || !s.aktiv) {
            hinweis('Keine Anmeldung nötig', 'Auf diesem Server ist die Anmeldung nicht eingeschaltet.', true);
            setTimeout(weiter, 1500);
            return;
        }
        if (s.angemeldet && s.benutzer && s.benutzer.mussAendern) {
            passwortAnsicht(true, s.benutzer.kennung);
            return;
        }
        if (s.angemeldet && nurPasswort) {
            passwortAnsicht(false, s.benutzer && s.benutzer.kennung);
            return;
        }
        if (s.angemeldet) {
            weiter();
            return;
        }
        zeige('form-anmelden');
    })();
})();
