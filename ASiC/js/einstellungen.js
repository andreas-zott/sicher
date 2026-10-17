// ==========================================================================
// ASiC Handel — Einstellungen (Server-Adresse + Zugriffsschlüssel)
// ==========================================================================
// Ab Rev. 1.52 im Design der Hilfe-Seite: Statuskacheln, Verbindungstest
// und Anzeigen/Verbergen des Schlüssels. Gespeichert wird weiterhin nur im
// localStorage dieses Geräts (Schlüssel 'nasBaseUrl' und 'nasApiKey' bleiben
// aus Kompatibilitätsgründen unverändert).
// ==========================================================================

function initSettingsPage() {
    const input = document.getElementById('nas-base-url');
    const keyInput = document.getElementById('nas-api-key');
    const status = document.getElementById('settings-status');
    const btnSave = document.getElementById('btn-save-settings');
    const btnReset = document.getElementById('btn-reset-settings');
    const btnTest = document.getElementById('btn-test-connection');
    const btnToggle = document.getElementById('btn-toggle-key');

    if (!input) return;

    // Aktuelle Werte beim Laden anzeigen
    input.value = getNasBaseUrl();
    keyInput.value = getNasApiKey();
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
        const key = getNasApiKey();
        setTile('st-server', base ? base : 'gleiche Adresse wie die App', '');
        setTile('st-key', key ? 'hinterlegt (' + key.length + ' Zeichen)' : 'nicht hinterlegt', '');
        setTile('st-version', typeof APP_REVISION !== 'undefined'
            ? 'Rev. ' + APP_REVISION + (typeof APP_REVISION_DATE !== 'undefined' ? ' · ' + formatDate(APP_REVISION_DATE) : '')
            : '–', '');
    }

    function setStatus(text, state) {
        status.textContent = text;
        status.classList.remove('is-ok', 'is-error');
        if (state) status.classList.add(state);
    }

    // Unterschied zwischen Eingabe und gespeichertem Stand anzeigen
    function markDirty() {
        const geaendert = input.value.trim() !== getNasBaseUrl() || keyInput.value !== getNasApiKey();
        setStatus(geaendert ? 'Noch nicht gespeichert.' : '', '');
    }
    input.addEventListener('input', markDirty);
    keyInput.addEventListener('input', markDirty);

    btnToggle.addEventListener('click', () => {
        const zeigen = keyInput.type === 'password';
        keyInput.type = zeigen ? 'text' : 'password';
        btnToggle.setAttribute('aria-pressed', zeigen ? 'true' : 'false');
        btnToggle.setAttribute('aria-label', zeigen ? 'Schlüssel verbergen' : 'Schlüssel anzeigen');
    });

    btnSave.addEventListener('click', () => {
        const value = input.value.trim().replace(/\/+$/, '');
        const key = keyInput.value; // bewusst nicht getrimmt, Schlüssel könnten führende/folgende Zeichen enthalten
        try {
            if (value) {
                localStorage.setItem('nasBaseUrl', value);
            } else {
                localStorage.removeItem('nasBaseUrl');
            }
            if (key) {
                localStorage.setItem('nasApiKey', key);
            } else {
                localStorage.removeItem('nasApiKey');
            }
            input.value = value;
            showToast('Einstellungen gespeichert');
            updateTiles();
            setStatus('Gespeichert.', 'is-ok');
        } catch (e) {
            showToast('Speichern fehlgeschlagen: ' + (e && e.message ? e.message : 'unbekannter Fehler'), 'error');
            setStatus('Speichern fehlgeschlagen.', 'is-error');
        }
    });

    btnReset.addEventListener('click', () => {
        if (!confirm('Server-Adresse und Zugriffsschlüssel auf diesem Gerät zurücksetzen? Begehungen, Fotos und Archiv bleiben unverändert.')) return;
        input.value = '';
        keyInput.value = '';
        try {
            localStorage.removeItem('nasBaseUrl');
            localStorage.removeItem('nasApiKey');
        } catch (e) {}
        updateTiles();
        setTile('st-conn', 'noch nicht getestet', '');
        setStatus('Zurückgesetzt.', '');
        showToast('Zurückgesetzt');
    });

    // Verbindungstest: fragt list.php mit den GERADE EINGETRAGENEN Werten ab
    // (auch wenn sie noch nicht gespeichert sind). Liest und verändert nichts.
    btnTest.addEventListener('click', async () => {
        const base = input.value.trim().replace(/\/+$/, '');
        const key = keyInput.value;
        const url = (base ? base + '/' : './') + 'list.php';
        const opts = { cache: 'no-store' };
        if (key) opts.headers = { 'X-Api-Key': key };

        btnTest.disabled = true;
        setTile('st-conn', 'wird getestet …', '');
        setStatus('Verbindung wird getestet …', '');

        const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = ctrl ? setTimeout(() => ctrl.abort(), 10000) : null;
        if (ctrl) opts.signal = ctrl.signal;

        try {
            const res = await fetch(url, opts);
            let data = null;
            try { data = await res.json(); } catch (e) { data = null; }

            if (res.ok && data && data.ok) {
                const n = Array.isArray(data.files) ? data.files.length : 0;
                setTile('st-conn', 'in Ordnung · ' + n + (n === 1 ? ' Begehung' : ' Begehungen'), 'is-ok');
                setStatus('Verbindung in Ordnung. Im Team-Archiv ' + (n === 1 ? 'liegt 1 Begehung.' : 'liegen ' + n + ' Begehungen.'), 'is-ok');
            } else if (data && data.message) {
                setTile('st-conn', 'Fehler', 'is-alert');
                setStatus('Server meldet: ' + data.message + ' (HTTP ' + res.status + ')', 'is-error');
            } else if (res.status === 404) {
                setTile('st-conn', 'Server-Skripte fehlen', 'is-alert');
                setStatus('Unter dieser Adresse gibt es keine Server-Skripte (HTTP 404). Adresse prüfen oder die EDV fragen.', 'is-error');
            } else {
                setTile('st-conn', 'unerwartete Antwort', 'is-alert');
                setStatus('Unerwartete Antwort vom Server (HTTP ' + res.status + '). Möglicherweise wird PHP nicht ausgeführt oder eine Anmeldeseite ist vorgeschaltet.', 'is-error');
            }
        } catch (err) {
            const abbruch = err && err.name === 'AbortError';
            setTile('st-conn', abbruch ? 'keine Antwort' : 'nicht erreichbar', 'is-alert');
            setStatus(abbruch
                ? 'Der Server hat nicht innerhalb von 10 Sekunden geantwortet.'
                : 'Server nicht erreichbar. Netzverbindung, VPN und Adresse prüfen' + (base ? ' – bei anderer Adresse ggf. auch CORS.' : '.'), 'is-error');
        } finally {
            if (timer) clearTimeout(timer);
            btnTest.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
    if (typeof renderFooterMeta === 'function') renderFooterMeta();
});
