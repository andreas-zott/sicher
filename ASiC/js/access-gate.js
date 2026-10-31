// ==========================================================================
// ASiC Handel — Zugangs-Hürde
// ==========================================================================
// WICHTIG: Dies ist KEIN echter Zugriffsschutz! Die Abfrage soll nur
// zufaelliges Entdecken/Herumstoebern durch Unbeteiligte verhindern.
// Echten Schutz liefert der Server (Firmennetz, Zugriffsschluessel in
// config.php, ggf. Anmeldung am Webserver).
//
// Ab Rev. 1.52 steht der Code nicht mehr hier, sondern als SHA-256-
// Pruefsumme in ../zugang-config.js (vom Betreiber anpassbar). Fehlt diese
// Datei, gilt die eingebaute Voreinstellung.
//
// Auf dem Geraet wird nach erfolgreicher Eingabe die Pruefsumme des gueltigen
// Codes gemerkt. Aendert der Betreiber den Code, passt sie nicht mehr und die
// App fragt einmal neu.
// ==========================================================================

const ACCESS_STORAGE_KEY = 'asicHandelAccessGranted';

// Pruefsumme des bisherigen Standardcodes (bis Rev. 1.51 im Quelltext).
const ACCESS_DEFAULT_HASH = '35dd4578183b7acc2b18153304e59452d7ae1bbe34877d5edccf3ae5964e5232';

function accessConfig() {
    const c = (window.ASIC_ZUGANG && typeof window.ASIC_ZUGANG === 'object') ? window.ASIC_ZUGANG : {};
    const hash = String(c.codeHash || '').trim().toLowerCase();
    return {
        aktiv: c.aktiv !== false,
        codeHash: /^[0-9a-f]{64}$/.test(hash) ? hash : ACCESS_DEFAULT_HASH
    };
}

// SHA-256 als Hex-Text. Nutzt die Web-Crypto-Schnittstelle (nur bei HTTPS
// verfuegbar) und faellt sonst auf eine kleine eigene Umsetzung zurueck.
async function accessSha256(text) {
    const bytes = new TextEncoder().encode(text);
    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
        const buf = await window.crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return accessSha256Fallback(bytes);
}

function accessSha256Fallback(bytes) {
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const len = bytes.length;
    const total = ((len + 9 + 63) >> 6) << 6;
    const msg = new Uint8Array(total);
    msg.set(bytes);
    msg[len] = 0x80;
    const bitLen = len * 8;
    msg[total - 4] = (bitLen >>> 24) & 0xff;
    msg[total - 3] = (bitLen >>> 16) & 0xff;
    msg[total - 2] = (bitLen >>> 8) & 0xff;
    msg[total - 1] = bitLen & 0xff;
    const w = new Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let off = 0; off < total; off += 64) {
        for (let i = 0; i < 16; i++) {
            w[i] = (msg[off + i * 4] << 24) | (msg[off + i * 4 + 1] << 16) | (msg[off + i * 4 + 2] << 8) | msg[off + i * 4 + 3];
        }
        for (let i = 16; i < 64; i++) {
            const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
            const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        }
        let [a, b, c, d, e, f, g, h] = H;
        for (let i = 0; i < 64; i++) {
            const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            const ch = (e & f) ^ (~e & g);
            const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
            const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) | 0;
            h = g; g = f; f = e; e = (d + t1) | 0;
            d = c; c = b; b = a; a = (t1 + t2) | 0;
        }
        H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
        H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

(function () {
    // Nur greifen, wenn die Seite als installierte App laeuft (eigenes
    // Fenster ohne Browser-Oberflaeche) - beim normalen Aufruf in einem
    // ganz gewoehnlichen Browser-Tab bleibt die Seite frei zugaenglich.
    // display-mode:standalone erkennt das bei Edge/Chrome (Windows/Mac),
    // navigator.standalone zusaetzlich bei "Zum Home-Bildschirm" auf iOS.
    const isInstalledApp =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true;
    if (!isInstalledApp) return;

    const cfg = accessConfig();
    if (!cfg.aktiv) return;

    let gemerkt = '';
    try { gemerkt = localStorage.getItem(ACCESS_STORAGE_KEY) || ''; } catch (e) { gemerkt = ''; }
    // Bis Rev. 1.51 wurde nur 'true' gemerkt - gilt weiter, solange der
    // Standardcode unveraendert ist.
    if (gemerkt === cfg.codeHash || (gemerkt === 'true' && cfg.codeHash === ACCESS_DEFAULT_HASH)) return;

    document.documentElement.classList.add('access-locked');

    document.addEventListener('DOMContentLoaded', () => {
        const overlay = document.createElement('div');
        overlay.className = 'access-gate-overlay';
        overlay.innerHTML =
            '<div class="access-gate-box">' +
                '<div class="access-gate-brand">ASiC Handel</div>' +
                '<p class="access-gate-text">Bitte Zugangscode eingeben</p>' +
                '<input type="password" id="access-gate-input" class="access-gate-input" autocomplete="off" placeholder="Zugangscode">' +
                '<button class="btn btn-primary access-gate-btn" id="access-gate-btn">Weiter</button>' +
                '<p class="access-gate-error" id="access-gate-error" style="display:none;">Falscher Code, bitte erneut versuchen.</p>' +
            '</div>';
        document.body.appendChild(overlay);

        const input = document.getElementById('access-gate-input');
        const btn = document.getElementById('access-gate-btn');
        const errorMsg = document.getElementById('access-gate-error');

        async function tryUnlock() {
            const hash = await accessSha256(input.value);
            if (hash === cfg.codeHash) {
                try { localStorage.setItem(ACCESS_STORAGE_KEY, cfg.codeHash); } catch (e) { /* ohne Speicher: nur fuer diese Sitzung */ }
                document.documentElement.classList.remove('access-locked');
                overlay.remove();
            } else {
                errorMsg.style.display = 'block';
                input.value = '';
                input.focus();
            }
        }

        btn.addEventListener('click', tryUnlock);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
        input.focus();
    });
})();
