(function () {
  const host = document.getElementById("tabelle-host");
  const sucheEl = document.getElementById("suche");

  const BEREICH_LABEL = {
    kasse: "Kasse", verkaufsraum: "Verkaufsraum", lager: "Lager", kuehlraum: "Kühl-/TK-Raum",
    backstube: "Backstube", theke: "Fleischerei/Theke", anlieferung: "Anlieferung/Rampe",
    parkplatz: "Parkplatz/Außen", sozialraum: "Sozialraum", buero: "Büro", sonstiges: "Sonstiges"
  };

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function formatUnfallDatum(v) {
    if (!v) return "";
    const [j, m, t] = v.split("-");
    return t ? `${t}.${m}.${j}` : v;
  }

  const SPALTEN = [
    { key: "marktnummer", label: "Markt-Nr.", get: (b) => b.marktnummer || "" },
    { key: "marktAdresse", label: "Adresse Markt", get: (b) => (b.unternehmenAnschrift || "").replace(/\n/g, ", ") },
    { key: "personName", label: "Name", get: (b) => b.personName || "" },
    { key: "personAdresse", label: "Adresse Person", get: (b) => [b.strasse, b.plz, b.ort].filter(Boolean).join(", "), sortKey: (b) => b.ort || "" },
    { key: "bereichMarkt", label: "Abteilung", get: (b) => BEREICH_LABEL[b.bereichMarkt] || "" },
    { key: "unfallursache", label: "Unfallursache", get: (b) => formatUnfallursache(b.unfallursacheKategorie, b.unfallursacheDetail), sortKey: (b) => b.unfallursacheKategorie || "" },
    { key: "arbeitsmittel", label: "Arbeitsmittel", get: (b) => formatArbeitsmittel(b.arbeitsmittel, b.arbeitsmittelSonstigesText) },
    { key: "unfallDatum", label: "Unfalltag", get: (b) => formatUnfallDatum(b.unfallDatum) },
    { key: "unfallUhrzeit", label: "Uhrzeit", get: (b) => b.unfallUhrzeit || "" },
    { key: "krankheitsdauerTage", label: "Ausfalltage", get: (b) => b.krankheitsdauerTage || "", sortKey: (b) => Number(b.krankheitsdauerTage) || 0 },
    { key: "alter", label: "Alter", get: (b) => { const a = ualAlterBerechnen(b.geburtsdatum, b.unfallDatum); return a == null ? "" : a; }, sortKey: (b) => ualAlterBerechnen(b.geburtsdatum, b.unfallDatum) ?? -1 },
    { key: "auszubildende", label: "Azubi", get: (b) => b.auszubildende === "ja" ? "Ja" : b.auszubildende === "nein" ? "Nein" : "" },
    { key: "wegeunfall", label: "Wegeunfall", get: (b) => b.wegeunfall === "ja" ? "Ja" : b.wegeunfall === "nein" ? "Nein" : "" },
    { key: "koerperteile", label: "Körperteil", get: (b) => (b.koerperteile || []).map((k) => k.teil).join(", "), sortKey: (b) => (b.koerperteile || [])[0]?.teil || "" }
  ];

  let alleBerichte = [];
  let sortKey = "unfallDatum";
  let sortDir = -1;

  function render(liste) {
    if (!liste.length) {
      host.innerHTML = `<div class="empty-state">Noch keine Unfälle erfasst.<br><a href="index.html">Neue Unfallanzeige anlegen →</a></div>`;
      return;
    }
    const spalte = SPALTEN.find((s) => s.key === sortKey) || SPALTEN[0];
    const sortiert = liste.slice().sort((a, b) => {
      const av = spalte.sortKey ? spalte.sortKey(a) : spalte.get(a);
      const bv = spalte.sortKey ? spalte.sortKey(b) : spalte.get(b);
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });

    const kopf = SPALTEN.map((s) => `<th data-key="${s.key}">${escapeHtml(s.label)}${sortKey === s.key ? (sortDir === 1 ? " ▲" : " ▼") : ""}</th>`).join("");
    const zeilen = sortiert.map((b) => {
      const zellen = SPALTEN.map((s) => `<td>${escapeHtml(s.get(b))}</td>`).join("");
      return `<tr data-id="${b.id}">${zellen}<td class="actions"><button class="btn secondary" data-action="oeffnen" data-id="${b.id}">Öffnen</button></td></tr>`;
    }).join("");

    host.innerHTML = `
      <div class="table-scroll">
        <table class="ua-table">
          <thead><tr>${kopf}<th>Aktion</th></tr></thead>
          <tbody>${zeilen}</tbody>
        </table>
      </div>
    `;
  }

  async function laden() {
    try {
      alleBerichte = await ualGetAlleBerichte();
      render(alleBerichte);
    } catch (e) {
      host.innerHTML = `<div class="empty-state">Liste konnte nicht geladen werden: ${escapeHtml(e.message)}</div>`;
    }
  }

  sucheEl.addEventListener("input", () => {
    const q = sucheEl.value.trim().toLowerCase();
    if (!q) { render(alleBerichte); return; }
    render(alleBerichte.filter((b) => SPALTEN.some((s) => String(s.get(b)).toLowerCase().includes(q))));
  });

  host.addEventListener("click", (e) => {
    const th = e.target.closest("th[data-key]");
    if (th) {
      const key = th.dataset.key;
      if (sortKey === key) sortDir *= -1; else { sortKey = key; sortDir = 1; }
      render(alleBerichte);
      return;
    }
    const btn = e.target.closest("button[data-action='oeffnen']");
    if (btn) {
      location.href = `index.html?id=${encodeURIComponent(btn.dataset.id)}`;
    }
  });

  laden();
})();
