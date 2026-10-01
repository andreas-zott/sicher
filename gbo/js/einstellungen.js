// ==========================================================================
// ASiC Handel — Einstellungen (NAS-Server-Adresse + Zugriffsschlüssel)
// ==========================================================================

function initSettingsPage() {
    const input = document.getElementById('nas-base-url');
    const keyInput = document.getElementById('nas-api-key');
    const status = document.getElementById('settings-status');
    const btnSave = document.getElementById('btn-save-settings');
    const btnReset = document.getElementById('btn-reset-settings');

    if (!input) return;

    // Aktuelle Werte beim Laden anzeigen
    input.value = getNasBaseUrl();
    keyInput.value = getNasApiKey();
    updateStatus();

    function updateStatus() {
        const current = getNasBaseUrl();
        const key = getNasApiKey();
        let text = current
            ? 'Aktuell konfiguriert: ' + current
            : 'Keine externe Adresse hinterlegt — bisheriges Verhalten aktiv (gleiche Adresse wie die App selbst).';
        text += key ? ' · Zugriffsschlüssel wird mitgeschickt.' : ' · Kein Zugriffsschlüssel hinterlegt.';
        status.textContent = text;
    }

    btnSave.addEventListener('click', () => {
        const value = input.value.trim();
        const key = keyInput.value; // bewusst nicht getrimmt, Schluessel koennten fuehrende/folgende Zeichen enthalten
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
            showToast('Einstellungen gespeichert');
            updateStatus();
        } catch (e) {
            showToast('Speichern fehlgeschlagen: ' + (e && e.message ? e.message : 'unbekannter Fehler'), 'error');
        }
    });

    btnReset.addEventListener('click', () => {
        input.value = '';
        keyInput.value = '';
        try {
            localStorage.removeItem('nasBaseUrl');
            localStorage.removeItem('nasApiKey');
        } catch (e) {}
        updateStatus();
        showToast('Zurückgesetzt');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
    if (typeof renderFooterMeta === 'function') renderFooterMeta();
});
