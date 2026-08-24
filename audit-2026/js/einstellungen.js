// ==========================================================================
// ASiC Handel — Einstellungsseite (WebDAV-Konfiguration)
// ==========================================================================

function readWebDAVFormValues() {
    return {
        host: document.getElementById('webdav-host').value.trim(),
        port: parseInt(document.getElementById('webdav-port').value, 10) || null,
        useHttps: document.getElementById('webdav-https').value === 'true',
        folder: document.getElementById('webdav-folder').value.trim(),
        username: document.getElementById('webdav-username').value,
        password: document.getElementById('webdav-password').value,
        autoUpload: document.getElementById('webdav-auto-upload').checked
    };
}

function fillWebDAVForm(config) {
    if (!config) return;
    document.getElementById('webdav-host').value = config.host || '';
    document.getElementById('webdav-port').value = config.port || '';
    document.getElementById('webdav-https').value = config.useHttps ? 'true' : 'false';
    document.getElementById('webdav-folder').value = config.folder || '';
    document.getElementById('webdav-username').value = config.username || '';
    document.getElementById('webdav-password').value = config.password || '';
    document.getElementById('webdav-auto-upload').checked = !!config.autoUpload;
}

function showWebDAVResult(message, isSuccess) {
    const el = document.getElementById('webdav-result');
    el.textContent = message;
    el.className = 'settings-result show ' + (isSuccess ? 'success' : 'error');
}

document.addEventListener('DOMContentLoaded', () => {
    fillWebDAVForm(getWebDAVConfig());

    const btnTest = document.getElementById('btn-webdav-test');
    const btnSave = document.getElementById('btn-webdav-save');

    if (btnTest) {
        btnTest.addEventListener('click', async () => {
            const config = readWebDAVFormValues();
            btnTest.disabled = true;
            const originalText = btnTest.textContent;
            btnTest.textContent = 'Teste …';
            try {
                const result = await testWebDAVConnection(config);
                showWebDAVResult(result.message, result.ok);
            } catch (err) {
                showWebDAVResult('Unerwarteter Fehler: ' + (err && err.message ? err.message : 'unbekannt'), false);
            } finally {
                btnTest.disabled = false;
                btnTest.textContent = originalText;
            }
        });
    }

    if (btnSave) {
        btnSave.addEventListener('click', () => {
            const config = readWebDAVFormValues();
            if (!config.host || !config.username || !config.password) {
                showWebDAVResult('Bitte mindestens Server-Adresse, Benutzername und Passwort ausfüllen, bevor Sie speichern.', false);
                return;
            }
            saveWebDAVConfig(config);
            showWebDAVResult('Einstellungen gespeichert.', true);
        });
    }
});
