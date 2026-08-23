(function () {
  const listeEl = document.getElementById("liste");
  const sucheEl = document.getElementById("suche");
  const toastEl = document.getElementById("toast");

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  let alleBerichte = [];

  function formatDatum(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE") + " " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }
  function formatUnfallDatum(v) {
    if (!v) return "kein Unfalldatum";
    const [j, m, t] = v.split("-");
    return t ? `${t}.${m}.${j}` : v;
  }

  function render(liste) {
    listeEl.innerHTML = "";
    if (!liste.length) {
      listeEl.innerHTML = `<div class="empty-state">Noch keine Unfallanzeigen gespeichert.<br><a href="index.html">Neue Unfallanzeige anlegen →</a></div>`;
      return;
    }
    liste
      .slice()
      .sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm))
      .forEach((b) => {
        const card = document.createElement("div");
        card.className = "list-card";
        const koerperteile = (b.koerperteile || []).map((k) => k.teil).join(", ") || "keine Angabe";
        card.innerHTML = `
          <div>
            <div class="meta-title">${escapeHtml(b.personName || "Ohne Namen")} ${b.toedlich === "ja" ? '<span class="badge badge-fatal">Tödlich</span>' : ""}</div>
            <div class="meta-sub">Unfall am ${formatUnfallDatum(b.unfallDatum)}${b.unfallUhrzeit ? ", " + b.unfallUhrzeit + " Uhr" : ""} · ${escapeHtml(b.unfallort || "kein Ort angegeben")}</div>
            <div class="meta-sub">Körperteile: ${escapeHtml(koerperteile)} · gespeichert ${formatDatum(b.erstelltAm)}</div>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn secondary" data-action="oeffnen" data-id="${b.id}">Öffnen</button>
            <button class="btn ghost" data-action="pdf" data-id="${b.id}">PDF</button>
            <button class="btn danger" data-action="loeschen" data-id="${b.id}">Löschen</button>
          </div>
        `;
        listeEl.appendChild(card);
      });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  async function ladeAlle() {
    try {
      alleBerichte = await ualGetAlleBerichte();
      render(alleBerichte);
    } catch (e) {
      listeEl.innerHTML = `<div class="empty-state">Archiv konnte nicht geladen werden: ${escapeHtml(e.message)}</div>`;
    }
  }

  sucheEl.addEventListener("input", () => {
    const q = sucheEl.value.trim().toLowerCase();
    if (!q) { render(alleBerichte); return; }
    render(alleBerichte.filter((b) =>
      [b.personName, b.unfallort, b.unfallDatum, b.betriebsteil, b.taetigkeit]
        .some((v) => (v || "").toLowerCase().includes(q))
    ));
  });

  listeEl.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "oeffnen") {
      location.href = `index.html?id=${encodeURIComponent(id)}`;
      return;
    }
    if (action === "pdf") {
      const textVorher = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Erzeuge PDF …";
      try {
        const b = await ualGetBericht(id);
        if (b) await erzeugeUnfallanzeigePdf(b);
      } catch (e) {
        console.error(e);
        toast("Fehler: " + e.message);
      } finally {
        btn.disabled = false;
        btn.textContent = textVorher;
      }
      return;
    }
    if (action === "loeschen") {
      if (!confirm("Diese Unfallanzeige unwiderruflich löschen?")) return;
      await ualLoescheBericht(id);
      toast("Gelöscht.");
      ladeAlle();
    }
  });

  ladeAlle();
})();
