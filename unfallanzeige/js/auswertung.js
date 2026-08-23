(function () {
  const main = document.getElementById("auswertung-main");

  const BEREICH_LABEL = {
    kasse: "Kasse", verkaufsraum: "Verkaufsraum", lager: "Lager", kuehlraum: "Kühl-/TK-Raum",
    backstube: "Backstube", theke: "Fleischerei/Theke", anlieferung: "Anlieferung/Rampe",
    parkplatz: "Parkplatz/Außen", sozialraum: "Sozialraum", buero: "Büro", sonstiges: "Sonstiges"
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function balkenListe(paare, maxBreite) {
    // paare: [ [label, anzahl], ... ] bereits sortiert
    const max = Math.max(1, ...paare.map(([, n]) => n));
    return paare.map(([label, n]) => `
      <div class="bar-row">
        <div class="bar-label">${escapeHtml(label)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(n / max) * 100}%"></div></div>
        <div class="bar-value">${n}</div>
      </div>
    `).join("");
  }

  function zaehle(liste, keyFn) {
    const map = new Map();
    liste.forEach((item) => {
      const k = keyFn(item);
      if (k === null || k === undefined || k === "") return;
      map.set(k, (map.get(k) || 0) + 1);
    });
    return map;
  }

  const ALTERSGRUPPEN_REIHENFOLGE = ["unter 20", "20–29", "30–39", "40–49", "50–59", "60+"];

  function kreuztabelle(berichte, zeilenReihenfolge, zeilenKeyFn, spaltenLabels, spaltenKeyFn) {
    // Baut eine HTML-Tabelle: Zeilen x Spalten = Anzahl Treffer, inkl. Randsummen.
    const matrix = new Map(); // "zeile||spalte" -> count
    const spaltenSummen = new Map();
    const zeilenSummen = new Map();
    let gesamtTreffer = 0;
    berichte.forEach((b) => {
      const zeile = zeilenKeyFn(b);
      const spalte = spaltenKeyFn(b);
      if (zeile == null || spalte == null) return;
      const key = zeile + "||" + spalte;
      matrix.set(key, (matrix.get(key) || 0) + 1);
      spaltenSummen.set(spalte, (spaltenSummen.get(spalte) || 0) + 1);
      zeilenSummen.set(zeile, (zeilenSummen.get(zeile) || 0) + 1);
      gesamtTreffer += 1;
    });
    if (!gesamtTreffer) return null;

    const vorhandeneSpalten = spaltenLabels.filter((s) => spaltenSummen.has(s));
    if (!vorhandeneSpalten.length) return null;

    const kopf = vorhandeneSpalten.map((s) => `<th>${escapeHtml(s)}</th>`).join("");
    const zeilenHtml = zeilenReihenfolge
      .filter((z) => zeilenSummen.has(z))
      .map((z) => {
        const zellen = vorhandeneSpalten.map((s) => {
          const n = matrix.get(z + "||" + s) || 0;
          return `<td class="${n === 0 ? "crosstab-zero" : ""}">${n || "–"}</td>`;
        }).join("");
        return `<tr><td>${escapeHtml(z)}</td>${zellen}<td class="crosstab-total">${zeilenSummen.get(z)}</td></tr>`;
      }).join("");
    const summenZeile = vorhandeneSpalten.map((s) => `<th class="crosstab-total">${spaltenSummen.get(s)}</th>`).join("");

    return `
      <div class="table-scroll">
        <table class="ua-table ua-crosstab">
          <thead><tr><th>Altersgruppe</th>${kopf}<th class="crosstab-total">Gesamt</th></tr></thead>
          <tbody>
            ${zeilenHtml}
            <tr><th>Gesamt</th>${summenZeile}<th class="crosstab-total">${gesamtTreffer}</th></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function uhrzeitBucket(uhrzeit) {
    if (!uhrzeit) return null;
    const stunde = parseInt(uhrzeit.split(":")[0], 10);
    if (isNaN(stunde)) return null;
    if (stunde >= 5 && stunde < 9) return "05–09 Uhr (Frühschicht)";
    if (stunde >= 9 && stunde < 12) return "09–12 Uhr (Vormittag)";
    if (stunde >= 12 && stunde < 14) return "12–14 Uhr (Mittag)";
    if (stunde >= 14 && stunde < 18) return "14–18 Uhr (Nachmittag)";
    if (stunde >= 18 && stunde < 22) return "18–22 Uhr (Abend)";
    return "22–05 Uhr (Nacht)";
  }

  const UHRZEIT_REIHENFOLGE = [
    "05–09 Uhr (Frühschicht)", "09–12 Uhr (Vormittag)", "12–14 Uhr (Mittag)",
    "14–18 Uhr (Nachmittag)", "18–22 Uhr (Abend)", "22–05 Uhr (Nacht)"
  ];

  function monatLabel(datumStr) {
    if (!datumStr) return null;
    const [j, m] = datumStr.split("-");
    if (!j || !m) return null;
    const monate = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    return `${monate[parseInt(m, 10) - 1]} ${j}`;
  }

  function render(berichte) {
    if (!berichte.length) {
      main.innerHTML = `<div class="empty-state">Noch keine Daten für eine Auswertung vorhanden.<br><a href="index.html">Erste Unfallanzeige anlegen →</a></div>`;
      return;
    }

    const gesamt = berichte.length;
    const wegeunfaelle = berichte.filter((b) => b.wegeunfall === "ja").length;
    const toedlich = berichte.filter((b) => b.toedlich === "ja").length;
    const mitKoerperteil = berichte.filter((b) => (b.koerperteile || []).length > 0).length;

    // Körperteile (nach reinem Teilnamen aggregiert, Seite wird ignoriert für die Häufigkeit)
    const koerperteilCount = new Map();
    berichte.forEach((b) => {
      (b.koerperteile || []).forEach((k) => {
        koerperteilCount.set(k.teil, (koerperteilCount.get(k.teil) || 0) + 1);
      });
    });
    const koerperteilSorted = [...koerperteilCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

    // Uhrzeit-Verteilung
    const uhrzeitMap = zaehle(berichte, (b) => uhrzeitBucket(b.unfallUhrzeit));
    const uhrzeitSorted = UHRZEIT_REIHENFOLGE
      .filter((k) => uhrzeitMap.has(k))
      .map((k) => [k, uhrzeitMap.get(k)]);

    // Wege- vs. Betriebsunfall
    const wegeMap = zaehle(berichte, (b) => (b.wegeunfall === "ja" ? "Wegeunfall" : b.wegeunfall === "nein" ? "Betriebsunfall" : null));
    const wegeSorted = [...wegeMap.entries()].sort((a, b) => b[1] - a[1]);

    // Zeitverlauf nach Monat
    const monatMap = zaehle(berichte, (b) => monatLabel(b.unfallDatum));
    const monatSorted = [...monatMap.entries()].sort((a, b) => {
      // sortiere chronologisch anhand des Originaldatums statt alphabetisch
      return 0;
    });
    // chronologisch sortieren: über echtes Datum
    const monatChrono = new Map();
    berichte.forEach((b) => {
      const label = monatLabel(b.unfallDatum);
      if (!label) return;
      const key = b.unfallDatum.slice(0, 7); // YYYY-MM
      if (!monatChrono.has(key)) monatChrono.set(key, { label, n: 0 });
      monatChrono.get(key).n += 1;
    });
    const monatListe = [...monatChrono.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => [v.label, v.n]);

    // Verletzungsarten
    const artMap = zaehle(berichte, (b) => (b.verletzungsart || "").trim() || null);
    const artSorted = [...artMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Unfallursache (Hauptkategorie und Detailursache)
    const ursacheMap = zaehle(berichte, (b) => b.unfallursacheKategorie || null);
    const ursacheSorted = [...ursacheMap.entries()].sort((a, b) => b[1] - a[1]);
    const ursacheDetailMap = zaehle(berichte, (b) => b.unfallursacheDetail ? formatUnfallursache(b.unfallursacheKategorie, b.unfallursacheDetail) : null);
    const ursacheDetailSorted = [...ursacheDetailMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Unfallverursachendes Arbeitsmittel / Gegenstand
    const arbeitsmittelMap = zaehle(berichte, (b) => formatArbeitsmittel(b.arbeitsmittel, b.arbeitsmittelSonstigesText) || null);
    const arbeitsmittelSorted = [...arbeitsmittelMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);

    // Bereich des Marktes
    const bereichMap = zaehle(berichte, (b) => BEREICH_LABEL[b.bereichMarkt] || null);
    const bereichSorted = [...bereichMap.entries()].sort((a, b) => b[1] - a[1]);

    // Marktnummer (welche Märkte melden am häufigsten)
    const marktMap = zaehle(berichte, (b) => (b.marktnummer || "").trim() || null);
    const marktSorted = [...marktMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);

    // Krankheitstage
    const krankheitstageWerte = berichte.map((b) => Number(b.krankheitsdauerTage)).filter((n) => !isNaN(n) && n > 0);
    const summeKrankheitstage = krankheitstageWerte.reduce((a, n) => a + n, 0);
    const schnittKrankheitstage = krankheitstageWerte.length ? (summeKrankheitstage / krankheitstageWerte.length).toFixed(1) : "–";

    // Alter zum Unfallzeitpunkt
    const alterProBericht = berichte.map((b) => ualAlterBerechnen(b.geburtsdatum, b.unfallDatum));
    const alterWerte = alterProBericht.filter((a) => a != null);
    const schnittAlter = alterWerte.length ? (alterWerte.reduce((a, n) => a + n, 0) / alterWerte.length).toFixed(1) : "–";
    const altersgruppenMap = zaehle(berichte, (b) => ualAltersgruppe(ualAlterBerechnen(b.geburtsdatum, b.unfallDatum)));
    const altersgruppenSorted = ALTERSGRUPPEN_REIHENFOLGE.filter((g) => altersgruppenMap.has(g)).map((g) => [g, altersgruppenMap.get(g)]);

    // Azubi-Anteil
    const azubiAnzahl = berichte.filter((b) => b.auszubildende === "ja").length;

    // Kreuztabellen: Alter x Abteilung, Alter x Unfallursache
    const abteilungSpalten = Object.values(BEREICH_LABEL);
    const crosstabAlterAbteilung = kreuztabelle(
      berichte, ALTERSGRUPPEN_REIHENFOLGE,
      (b) => ualAltersgruppe(ualAlterBerechnen(b.geburtsdatum, b.unfallDatum)),
      abteilungSpalten, (b) => BEREICH_LABEL[b.bereichMarkt] || null
    );
    const ursacheSpalten = UNFALLURSACHE_KATALOG.map((g) => g.kategorie);
    const crosstabAlterUrsache = kreuztabelle(
      berichte, ALTERSGRUPPEN_REIHENFOLGE,
      (b) => ualAltersgruppe(ualAlterBerechnen(b.geburtsdatum, b.unfallDatum)),
      ursacheSpalten, (b) => b.unfallursacheKategorie || null
    );

    main.innerHTML = `
      <div class="kpi-row">
        <div class="kpi"><div class="kpi-value">${gesamt}</div><div class="kpi-label">Unfallanzeigen gesamt</div></div>
        <div class="kpi"><div class="kpi-value">${wegeunfaelle}</div><div class="kpi-label">davon Wegeunfälle</div></div>
        <div class="kpi"><div class="kpi-value">${gesamt - wegeunfaelle}</div><div class="kpi-label">davon Betriebsunfälle</div></div>
        <div class="kpi"><div class="kpi-value">${toedlich}</div><div class="kpi-label">tödliche Unfälle</div></div>
        <div class="kpi"><div class="kpi-value">${summeKrankheitstage}</div><div class="kpi-label">Krankheitstage gesamt</div></div>
        <div class="kpi"><div class="kpi-value">${schnittKrankheitstage}</div><div class="kpi-label">Ø Krankheitstage</div></div>
        <div class="kpi"><div class="kpi-value">${schnittAlter}</div><div class="kpi-label">Ø Alter</div></div>
        <div class="kpi"><div class="kpi-value">${azubiAnzahl}</div><div class="kpi-label">davon Azubis</div></div>
      </div>

      <div class="stat-card">
        <h3>Altersverteilung</h3>
        <div class="stat-sub">Alter der versicherten Person zum Unfallzeitpunkt (${alterWerte.length} von ${gesamt} berechenbar)</div>
        ${altersgruppenSorted.length ? balkenListe(altersgruppenSorted) : '<div class="hint">Keine vollständigen Geburts-/Unfalldaten vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Welches Alter, wo verunfallt</h3>
        <div class="stat-sub">Altersgruppe × Abteilung des Marktes</div>
        ${crosstabAlterAbteilung || '<div class="hint">Noch nicht genug Daten (Alter + Abteilung) vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Welches Alter, wobei verunfallt</h3>
        <div class="stat-sub">Altersgruppe × Unfallursache (Hauptkategorie)</div>
        ${crosstabAlterUrsache || '<div class="hint">Noch nicht genug Daten (Alter + Unfallursache) vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Unfallursache</h3>
        <div class="stat-sub">Wie es zum Unfall kam (Hauptkategorien)</div>
        ${ursacheSorted.length ? balkenListe(ursacheSorted) : '<div class="hint">Keine Angaben vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Häufigste Detailursachen</h3>
        <div class="stat-sub">Top 10 der konkreten Unfallursachen</div>
        ${ursacheDetailSorted.length ? balkenListe(ursacheDetailSorted) : '<div class="hint">Keine Angaben vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Unfallverursachendes Arbeitsmittel / Gegenstand</h3>
        <div class="stat-sub">Top 15</div>
        ${arbeitsmittelSorted.length ? balkenListe(arbeitsmittelSorted) : '<div class="hint">Keine Angaben vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Bereich des Marktes</h3>
        <div class="stat-sub">Wo im Markt sich der Unfall ereignete</div>
        ${bereichSorted.length ? balkenListe(bereichSorted) : '<div class="hint">Keine Angaben vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Märkte mit den meisten Unfällen</h3>
        <div class="stat-sub">Nach Marktnummer, Top 15</div>
        ${marktSorted.length ? balkenListe(marktSorted) : '<div class="hint">Keine Marktnummern erfasst.</div>'}
      </div>

      <div class="stat-card">
        <h3>Betroffene Körperteile</h3>
        <div class="stat-sub">Häufigkeit über alle erfassten Unfallanzeigen (${mitKoerperteil} von ${gesamt} mit Angabe)</div>
        ${koerperteilSorted.length ? balkenListe(koerperteilSorted) : '<div class="hint">Keine Angaben vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Unfallzeitpunkt nach Tageszeit</h3>
        <div class="stat-sub">Verteilung der Unfälle nach Uhrzeit-Bereich</div>
        ${uhrzeitSorted.length ? balkenListe(uhrzeitSorted) : '<div class="hint">Keine Uhrzeiten erfasst.</div>'}
      </div>

      <div class="stat-card">
        <h3>Wegeunfall vs. Betriebsunfall</h3>
        <div class="stat-sub">Basierend auf dem internen Zusatzfeld „Wegeunfall“</div>
        ${wegeSorted.length ? balkenListe(wegeSorted) : '<div class="hint">Keine Angaben vorhanden.</div>'}
      </div>

      <div class="stat-card">
        <h3>Unfälle im Zeitverlauf</h3>
        <div class="stat-sub">Anzahl je Monat (nach Unfalldatum)</div>
        ${monatListe.length ? balkenListe(monatListe) : '<div class="hint">Keine Unfalldaten erfasst.</div>'}
      </div>

      <div class="stat-card">
        <h3>Häufigste Verletzungsarten</h3>
        <div class="stat-sub">Freitext aus Feld 20, wortgleiche Einträge zusammengefasst</div>
        ${artSorted.length ? balkenListe(artSorted) : '<div class="hint">Keine Angaben vorhanden.</div>'}
      </div>
    `;
  }

  async function laden() {
    try {
      const berichte = await ualGetAlleBerichte();
      render(berichte);
    } catch (e) {
      main.innerHTML = `<div class="empty-state">Auswertung konnte nicht geladen werden: ${escapeHtml(e.message)}</div>`;
    }
  }

  laden();
})();
