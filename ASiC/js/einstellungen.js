// ==========================================================================
// ASiC Handel — Einstellungen (Server-Adresse + Zugriffsschlüssel)
// ==========================================================================
// Im Design der Hilfe-Seite: Statuskacheln, Verbindungstest und Eintragen
// des Schlüssels (ein gespeicherter Wert wird nicht mehr angezeigt).
// Server-Adresse im localStorage dieses Geräts ('nasBaseUrl'); der
// Zugriffsschlüssel geschützt (siehe nasSchluesselSpeichern in app.js).
// ==========================================================================

function initSettingsPage() {
    const input = document.getElementById('nas-base-url');
    const keyInput = document.getElementById('nas-api-key');
    const status = document.getElementById('settings-status');
    const btnSave = document.getElementById('btn-save-settings');
    const btnReset = document.getElementById('btn-reset-settings');
    const btnTest = document.getElementById('btn-test-connection');
    const btnToggle = document.getElementById('btn-toggle-key');
    const keyHinterlegt = document.getElementById('key-hinterlegt');
    const keyHinterlegtText = document.getElementById('key-hinterlegt-text');
    const keyEingabe = document.getElementById('key-eingabe');
    const btnKeyAendern = document.getElementById('btn-key-aendern');
    const btnKeyEntfernen = document.getElementById('btn-key-entfernen');
    const btnKeyAbbrechen = document.getElementById('btn-key-abbrechen');

    // Ein gespeicherter Schluessel wird nie wieder ins Feld geladen oder
    // angezeigt (nur "hinterlegt · endet auf …1234"). Das Feld dient nur
    // zum Eintragen eines NEUEN Werts.
    let keyBearbeiten = false;

    if (!input) return;

    // Aktuelle Werte beim Laden anzeigen
    const nameInput = document.getElementById('geraet-name');
    input.value = getNasBaseUrl();
    keyInput.value = '';
    zeigeKeyZustand();
    // Ein noch als Text gespeicherter Schluessel wird hier umgestellt
    nasSchluesselHolen().then(() => { zeigeKeyZustand(); updateTiles(); }).catch(() => {});
    if (nameInput) nameInput.value = geraetName();
    updateTiles();
    setStatus('', '');

    function setTile(id, text, state) {
        const tile = document.getElementById(id);
        if (!tile) return;
        tile.classList.remove('is-ok', 'is-alert');
        if (state) tile.classList.add(state);
        const t = tile.querySelector('[data-st-text]');
        if (t) t.textContent = text;
    }

    function updateTiles() {
        const base = getNasBaseUrl();
        const info = nasSchluesselInfo();
        setTile('st-server', base ? base + (adresseSicher(base) ? '' : ' – nicht HTTPS, wird nicht verwendet') : 'gleiche Adresse wie die App', adresseSicher(base) ? '' : 'is-alert');
        setTile('st-key', info ? 'hinterlegt (' + info.laenge + ' Zeichen' + (info.art === 'gesperrt' ? ', geschützt)' : ', ungeschützt)') : 'nicht hinterlegt', '');
        setTile('st-version', typeof APP_REVISION !== 'undefined'
            ? 'Rev. ' + APP_REVISION + (appAusgabestand() !== APP_REVISION ? ' · Ausgabestand ' + appAusgabestand() : '') + (typeof APP_REVISION_DATE !== 'undefined' ? ' · ' + formatDate(APP_REVISION_DATE) : '')
            : '–', '');
    }

    function keyVerbergen() {
        keyInput.type = 'password';
        btnToggle.setAttribute('aria-pressed', 'false');
        btnToggle.setAttribute('aria-label', 'Eingabe anzeigen');
    }

    function zeigeKeyZustand() {
        const info = nasSchluesselInfo();
        const hinterlegt = !!info && !keyBearbeiten;
        keyHinterlegt.hidden = !hinterlegt;
        keyEingabe.hidden = hinterlegt;
        btnKeyAbbrechen.hidden = !(info && keyBearbeiten);
        if (info) {
            keyHinterlegtText.textContent = '✓ Schlüssel hinterlegt'
                + (info.laenge > 8 && info.ende ? ' · endet auf\u00a0…' + info.ende : '')
                + (info.art === 'klartext' ? ' · noch nicht geschützt – wird beim Öffnen über HTTPS umgestellt' : '');
        }
        if (!keyBearbeiten) {
            keyInput.value = '';
            keyVerbergen();
        }
    }

    // Neu eingetragener Schluessel (Text) oder '' = gespeicherten verwenden
    function neuerKey() {
        return keyBearbeiten || !nasSchluesselInfo() ? keyInput.value : '';
    }

    // Schluessel fuer den Verbindungstest: neu eingetragener Wert (nur fuer
    // diesen Test, nicht gespeichert) oder der gespeicherte
    async function testSchluessel() {
        const neu = neuerKey();
        if (!neu) return nasSchluesselInfo() ? undefined : null;
        if (!kryptoSchluesselMoeglich()) {
            throw new Error('Der Zugriffsschlüssel lässt sich nur verwenden, wenn die App über HTTPS geöffnet ist.');
        }
        return { art: 'gesperrt', key: await nasSchluesselImportieren(neu) };
    }

    function setStatus(text, state) {
        status.textContent = text;
        status.classList.remove('is-ok', 'is-error');
        if (state) status.classList.add(state);
    }

    // Unterschied zwischen Eingabe und gespeichertem Stand anzeigen
    function markDirty() {
        const geaendert = input.value.trim() !== getNasBaseUrl() || keyInput.value !== ''
            || (nameInput && nameInput.value.trim() !== geraetName());
        setStatus(geaendert ? 'Noch nicht gespeichert.' : '', '');
    }
    input.addEventListener('input', markDirty);
    keyInput.addEventListener('input', markDirty);
    if (nameInput) nameInput.addEventListener('input', markDirty);

    btnToggle.addEventListener('click', () => {
        const zeigen = keyInput.type === 'password';
        keyInput.type = zeigen ? 'text' : 'password';
        btnToggle.setAttribute('aria-pressed', zeigen ? 'true' : 'false');
        btnToggle.setAttribute('aria-label', zeigen ? 'Eingabe verbergen' : 'Eingabe anzeigen');
    });

    btnKeyAendern.addEventListener('click', () => {
        keyBearbeiten = true;
        keyInput.value = '';
        zeigeKeyZustand();
        keyInput.focus();
    });

    btnKeyAbbrechen.addEventListener('click', () => {
        keyBearbeiten = false;
        zeigeKeyZustand();
        markDirty();
    });

    btnKeyEntfernen.addEventListener('click', async () => {
        if (!confirm('Zugriffsschlüssel auf diesem Gerät entfernen? Das Team-Archiv ist danach erst wieder nach Eintragen des Schlüssels erreichbar.')) return;
        await nasSchluesselLoeschen();
        keyBearbeiten = false;
        zeigeKeyZustand();
        updateTiles();
        setTile('st-conn', 'noch nicht getestet', '');
        setStatus('Schlüssel entfernt.', '');
        showToast('Schlüssel entfernt');
    });

    btnSave.addEventListener('click', async () => {
        const value = input.value.trim().replace(/\/+$/, '');
        const key = neuerKey(); // bewusst nicht getrimmt, Schlüssel könnten führende/folgende Zeichen enthalten
        let ablage = null;
        if (!adresseSicher(value)) {
            setStatus('Nicht gespeichert: Die Server-Adresse muss mit https:// beginnen.', 'is-error');
            return;
        }
        try {
            if (value) {
                localStorage.setItem('nasBaseUrl', value);
            } else {
                localStorage.removeItem('nasBaseUrl');
            }
            // Leeres Feld = bisherigen Schluessel behalten (Entfernen eigens)
            if (key) ablage = await nasSchluesselSpeichern(key);
            if (nameInput) {
                const name = nameInput.value.trim().slice(0, 40);
                if (name) localStorage.setItem('asicGeraetName', name); else localStorage.removeItem('asicGeraetName');
                nameInput.value = name;
            }
            input.value = value;
            keyBearbeiten = false;
            zeigeKeyZustand();
            keyInput.value = '';
            showToast('Einstellungen gespeichert');
            updateTiles();
            setStatus(ablage === 'gesperrt' ? 'Gespeichert. Der Schlüssel ist geschützt abgelegt und lässt sich nicht mehr auslesen.' : 'Gespeichert.', 'is-ok');
        } catch (e) {
            showToast('Speichern fehlgeschlagen: ' + (e && e.message ? e.message : 'unbekannter Fehler'), 'error');
            setStatus('Speichern fehlgeschlagen' + (e && e.message ? ': ' + e.message : '.'), 'is-error');
        }
    });

    btnReset.addEventListener('click', async () => {
        if (!confirm('Server-Adresse und Zugriffsschlüssel auf diesem Gerät zurücksetzen? Begehungen, Fotos und Archiv bleiben unverändert.')) return;
        input.value = '';
        try {
            localStorage.removeItem('nasBaseUrl');
        } catch (e) {}
        await nasSchluesselLoeschen();
        keyBearbeiten = false;
        zeigeKeyZustand();
        updateTiles();
        setTile('st-conn', 'noch nicht getestet', '');
        setStatus('Zurückgesetzt.', '');
        showToast('Zurückgesetzt');
    });

    // Verbindungstest: fragt list.php mit den GERADE EINGETRAGENEN Werten ab
    // (auch wenn sie noch nicht gespeichert sind). Liest und verändert nichts.
    btnTest.addEventListener('click', async () => {
        const base = input.value.trim().replace(/\/+$/, '');
        if (!adresseSicher(base)) {
            setTile('st-conn', 'unsichere Adresse', 'is-alert');
            setStatus('Die Server-Adresse muss mit https:// beginnen.', 'is-error');
            return;
        }
        let key;
        try {
            key = await testSchluessel();
        } catch (e) {
            setStatus(e.message, 'is-error');
            return;
        }
        btnTest.disabled = true;
        setTile('st-conn', 'wird getestet …', '');
        setStatus('Verbindung wird getestet …', '');
        try {
            const r = await pruefeServerVerbindung(base, key);
            setTile('st-conn', r.kachel, r.kachelZustand);
            setStatus(r.meldung, r.meldungZustand);
        } finally {
            btnTest.disabled = false;
        }
    });
}

// ===== Verbindungstest (gemeinsam fuer Knopf und Diagnose) =====
// Fragt list.php mit den uebergebenen Werten ab. Liest und veraendert nichts.
// schluessel: undefined = gespeicherter, null = ohne, sonst Objekt (siehe nasFetch)
async function pruefeServerVerbindung(base, schluessel) {
    if (!adresseSicher(base)) {
        return { ok: false, kachel: 'unsichere Adresse', kachelZustand: 'is-alert',
            meldung: 'Die Server-Adresse muss mit https:// beginnen.', meldungZustand: 'is-error',
            kurz: 'nicht geprüft – Server-Adresse ohne https://' };
    }
    const opts = { cache: 'no-store' };

    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 10000) : null;
    if (ctrl) opts.signal = ctrl.signal;

    try {
        const res = await nasFetch('list.php', '', opts, schluessel, base || '');
        let data = null;
        try { data = await res.json(); } catch (e) { data = null; }

        if (res.ok && data && data.ok) {
            const n = Array.isArray(data.files) ? data.files.length : 0;
            return {
                ok: true, anzahl: n,
                kachel: 'in Ordnung · ' + n + (n === 1 ? ' Begehung' : ' Begehungen'), kachelZustand: 'is-ok',
                meldung: 'Verbindung in Ordnung. Im Team-Archiv ' + (n === 1 ? 'liegt 1 Begehung.' : 'liegen ' + n + ' Begehungen.'), meldungZustand: 'is-ok',
                kurz: 'in Ordnung – ' + n + (n === 1 ? ' Begehung' : ' Begehungen') + ' im Team-Archiv'
            };
        }
        if (data && data.message) {
            return { ok: false, kachel: 'Fehler', kachelZustand: 'is-alert',
                meldung: 'Server meldet: ' + data.message + ' (HTTP ' + res.status + ')', meldungZustand: 'is-error',
                kurz: 'Fehler – Server meldet: „' + data.message + '“ (HTTP ' + res.status + ')' };
        }
        if (res.status === 404) {
            return { ok: false, kachel: 'Server-Skripte fehlen', kachelZustand: 'is-alert',
                meldung: 'Unter dieser Adresse gibt es keine Server-Skripte (HTTP 404). Adresse prüfen oder die EDV fragen.', meldungZustand: 'is-error',
                kurz: 'Fehler – keine Server-Skripte unter dieser Adresse (HTTP 404)' };
        }
        return { ok: false, kachel: 'unerwartete Antwort', kachelZustand: 'is-alert',
            meldung: 'Unerwartete Antwort vom Server (HTTP ' + res.status + '). Möglicherweise wird PHP nicht ausgeführt oder eine Anmeldeseite ist vorgeschaltet.', meldungZustand: 'is-error',
            kurz: 'Fehler – unerwartete Antwort (HTTP ' + res.status + '), PHP läuft nicht oder Anmeldeseite vorgeschaltet' };
    } catch (err) {
        const abbruch = err && err.name === 'AbortError';
        return { ok: false, kachel: abbruch ? 'keine Antwort' : 'nicht erreichbar', kachelZustand: 'is-alert',
            meldung: abbruch
                ? 'Der Server hat nicht innerhalb von 10 Sekunden geantwortet.'
                : 'Server nicht erreichbar. Netzverbindung, VPN und Adresse prüfen' + (base ? ' – bei anderer Adresse ggf. auch CORS.' : '.'),
            meldungZustand: 'is-error',
            kurz: abbruch ? 'Fehler – keine Antwort innerhalb von 10 s'
                : 'Fehler – Server nicht erreichbar (keine Antwort; Netz/VPN/Adresse' + (base ? ' oder CORS-Freigabe' : '') + ')' };
    } finally {
        if (timer) clearTimeout(timer);
    }
}

// ===== Diagnose =====
// Stellt den technischen Zustand dieses Geraets als Text zusammen - fuer
// die EDV. Bewusst OHNE Begehungsinhalte, Namen und Zugriffsschluessel.

function diagnoseGeraet() {
    const ua = navigator.userAgent || '';
    let geraet = 'unbekannt';
    if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) geraet = 'iPad';
    else if (/iPhone/.test(ua)) geraet = 'iPhone';
    else if (/Android/.test(ua)) geraet = 'Android';
    else if (/Windows/.test(ua)) geraet = 'Windows';
    else if (/Macintosh/.test(ua)) geraet = 'Mac';
    else if (/Linux/.test(ua)) geraet = 'Linux';
    let browser = 'unbekannt';
    let m;
    if ((m = ua.match(/Edg\/([\d]+)/))) browser = 'Edge ' + m[1];
    else if ((m = ua.match(/(?:CriOS|Chrome)\/([\d]+)/))) browser = 'Chrome ' + m[1];
    else if ((m = ua.match(/(?:FxiOS|Firefox)\/([\d]+)/))) browser = 'Firefox ' + m[1];
    else if ((m = ua.match(/Version\/([\d.]+).*Safari/))) browser = 'Safari ' + m[1];
    if (/Tauri/i.test(ua) || window.__TAURI__) browser += ' (Desktop-/Android-App)';
    return geraet + ' · ' + browser;
}

function diagnoseMB(bytes) {
    if (!bytes && bytes !== 0) return '?';
    const mb = bytes / 1048576;
    return mb >= 1024 ? (mb / 1024).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' GB'
        : mb.toLocaleString('de-DE', { maximumFractionDigits: mb < 10 ? 1 : 0 }) + ' MB';
}

async function erstelleDiagnoseText() {
    const zeilen = [];
    const z = (titel, wert) => zeilen.push(titel + ': ' + wert);
    const sicher = async (fn, ersatz) => { try { return await fn(); } catch (e) { return ersatz; } };

    zeilen.push('ASiC Handel – Diagnose');
    z('Erstellt', new Date().toLocaleString('de-DE'));

    const build = appAusgabestand();
    z('App', 'Rev. ' + APP_REVISION + ' (' + formatDate(APP_REVISION_DATE) + ') · Ausgabestand ' + build);

    // Service Worker / Cache
    let sw = 'nicht unterstützt';
    if ('serviceWorker' in navigator) {
        sw = navigator.serviceWorker.controller ? 'aktiv' : 'nicht aktiv (Seite einmal neu laden)';
        const namen = await sicher(async () => (await caches.keys()).filter(k => k.startsWith('asic-handel-')), []);
        if (namen.length) {
            const passt = namen.includes('asic-handel-v' + build);
            sw += ' · Cache ' + namen.join(', ') + (passt ? ' ✓' : ' – passt nicht zu Ausgabestand ' + build + ', Seite neu laden');
        } else {
            sw += ' · kein App-Cache';
        }
    }
    z('Service Worker', sw);

    const installiert = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
    z('Aufgerufen über', location.origin + location.pathname.replace(/[^/]*$/, '') + ' · installierte App: ' + (installiert ? 'ja' : 'nein'));

    const base = getNasBaseUrl();
    const info = nasSchluesselInfo();
    z('Server-Adresse', base || 'gleiche Adresse wie die App');
    z('Zugriffsschlüssel', info
        ? 'hinterlegt (' + info.laenge + ' Zeichen, ' + (info.art === 'gesperrt' ? 'geschützt abgelegt, Anfragen unterschrieben' : 'noch als Text – wird erst über HTTPS umgestellt und verwendet') + ')'
        : 'nicht hinterlegt');

    if (serverFunktionenVerfuegbar()) {
        const r = await pruefeServerVerbindung(base);
        z('Verbindungstest', r.kurz);
    } else {
        z('Verbindungstest', 'nicht möglich – App läuft auf GitHub Pages ohne eingetragene Server-Adresse');
    }

    // Hinweis "gerade geoeffnet"
    z('Gerätename', geraetName() || 'nicht eingetragen');
    if (serverFunktionenVerfuegbar()) {
        const offen = await sicher(async () => {
            const res = await nasFetch('offen.php', '', { cache: 'no-store' });
            if (res.status === 404) return 'offen.php fehlt auf dem Server (HTTP 404)';
            if (!res.ok) return 'HTTP ' + res.status;
            const j = await res.json();
            const n = Array.isArray(j.offen) ? j.offen.length : 0;
            return 'erreichbar ✓ · ' + n + (n === 1 ? ' Begehung' : ' Begehungen') + ' gerade geöffnet';
        }, 'nicht erreichbar');
        z('Hinweis „geöffnet“', offen);
    }
    const letzte = (() => { try { return JSON.parse(localStorage.getItem('asicOffenLetzteMeldung') || 'null'); } catch (e) { return null; } })();
    z('Letzte Öffnen-Meldung', letzte ? formatZeitpunkt(letzte.zeit) + ' · ' + letzte.aktion + ' · ' + letzte.ergebnis : 'noch keine');

    // Aktuelle Begehung (nur Zustand, keine Inhalte)
    loadState();
    const zustand = sicherungsZustand();
    const stand = leseServerStand();
    const zustandText = {
        leer: 'leer (keine Begehung in Bearbeitung)',
        gesichert: 'im Team-Archiv gesichert' + (stand ? ' (' + formatZeitpunkt(stand.zeit) + ')' : ''),
        geaendert: 'seit der Sicherung' + (stand ? ' am ' + formatZeitpunkt(stand.zeit) : '') + ' geändert, Änderungen nur auf diesem Gerät',
        ungesichert: 'noch nicht im Team-Archiv gesichert (nur auf diesem Gerät)'
    }[zustand];
    z('Aktuelle Begehung', zustandText);

    const archiv = await sicher(async () => (await getAllArchivedAudits()).length, null);
    z('Lokales Archiv', archiv === null ? 'nicht lesbar' : archiv + (archiv === 1 ? ' Begehung' : ' Begehungen'));
    const fotos = await sicher(async () => (await getAllPhotos()).length, null);
    z('Fotos (aktuelle Begehung)', fotos === null ? 'nicht lesbar' : String(fotos));

    let speicher = 'keine Angabe';
    if (navigator.storage && navigator.storage.estimate) {
        const est = await sicher(() => navigator.storage.estimate(), null);
        if (est) speicher = diagnoseMB(est.usage) + ' belegt von ' + diagnoseMB(est.quota);
        if (navigator.storage.persisted) {
            const dauerhaft = await sicher(() => navigator.storage.persisted(), null);
            if (dauerhaft !== null) speicher += ' · dauerhaft: ' + (dauerhaft ? 'ja' : 'nein');
        }
    }
    z('Speicher auf dem Gerät', speicher);

    z('Gerät', diagnoseGeraet() + ' · ' + (navigator.onLine ? 'online' : 'OFFLINE'));
    z('Browser-Kennung', navigator.userAgent || '–');

    const log = leseFehlerLog();
    zeilen.push('Letzte Fehlermeldungen:' + (log.length ? '' : ' keine'));
    log.slice(-5).reverse().forEach(e => {
        zeilen.push('  ' + formatZeitpunkt(e.zeit) + ' · ' + e.seite + ' · ' + e.text);
    });
    return zeilen.join('\n');
}

async function kopiereText(text, preEl) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (e) { /* weiter mit Ersatzweg */ }
    // Ersatz: Text markieren und klassisch kopieren
    try {
        const range = document.createRange();
        range.selectNodeContents(preEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return document.execCommand('copy');
    } catch (e) {
        return false;
    }
}

function initDiagnose() {
    const btnErstellen = document.getElementById('btn-diagnose-erstellen');
    const btnKopieren = document.getElementById('btn-diagnose-kopieren');
    const btnMail = document.getElementById('btn-diagnose-mail');
    const pre = document.getElementById('diagnose-text');
    const status = document.getElementById('diagnose-status');
    if (!btnErstellen || !pre) return;

    const setStatus = (text, zustand) => {
        status.textContent = text;
        status.classList.remove('is-ok', 'is-error');
        if (zustand) status.classList.add(zustand);
    };

    btnErstellen.addEventListener('click', async () => {
        btnErstellen.disabled = true;
        setStatus('Diagnose wird erstellt, Verbindung wird getestet …', '');
        try {
            pre.textContent = await erstelleDiagnoseText();
            pre.hidden = false;
            btnKopieren.disabled = false;
            btnMail.disabled = false;
            setStatus('Fertig. Mit „Kopieren“ in eine Nachricht an die EDV einfügen oder direkt per Mail senden.', 'is-ok');
        } catch (err) {
            setStatus('Diagnose konnte nicht erstellt werden: ' + (err && err.message ? err.message : 'unbekannter Fehler'), 'is-error');
        } finally {
            btnErstellen.disabled = false;
        }
    });

    btnKopieren.addEventListener('click', async () => {
        const ok = await kopiereText(pre.textContent, pre);
        if (ok) {
            showToast('Diagnose kopiert');
            setStatus('In die Zwischenablage kopiert.', 'is-ok');
        } else {
            setStatus('Kopieren hier nicht möglich – bitte den Text markieren und manuell kopieren.', 'is-error');
        }
    });

    btnMail.addEventListener('click', () => {
        const betreff = 'ASiC Handel – Diagnose (Ausgabestand ' + appAusgabestand() + ')';
        window.location.href = 'mailto:?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(pre.textContent);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
    initDiagnose();
    if (typeof renderFooterMeta === 'function') renderFooterMeta();
});
