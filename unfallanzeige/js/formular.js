(function () {
  const form = document.getElementById("ua-form");
  const toastEl = document.getElementById("toast");

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  // ---------- Empfängerliste (dynamisch, für Mehrfach-PDF-Export) ----------
  const empfaengerHost = document.getElementById("empfaenger-liste");
  let empfaengerZaehler = 0;

  function empfaengerZeileHinzufuegen(bezeichnung, adresse) {
    empfaengerZaehler += 1;
    const id = "emp_" + empfaengerZaehler;
    const row = document.createElement("div");
    row.className = "field-grid";
    row.dataset.empfaengerRow = id;
    row.style.marginBottom = "8px";
    row.innerHTML = `
      <div class="field-row">
        <label class="field-label">Bezeichnung</label>
        <input type="text" data-empfaenger-bezeichnung placeholder="z. B. BGHW oder Bezirksregierung Düsseldorf" value="${bezeichnung ? escapeAttr(bezeichnung) : ""}">
      </div>
      <div class="field-row" style="display:flex; gap:8px; align-items:flex-end;">
        <div style="flex:1;">
          <label class="field-label">Adresse</label>
          <textarea data-empfaenger-adresse rows="2" placeholder="Name, Straße, PLZ Ort">${adresse ? escapeHtml(adresse) : ""}</textarea>
        </div>
        <button type="button" class="btn ghost" data-empfaenger-entfernen title="Empfänger entfernen">✕</button>
      </div>
    `;
    empfaengerHost.appendChild(row);
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str).replace(/"/g, "&quot;"); }

  empfaengerHost.addEventListener("click", (e) => {
    if (e.target.closest("[data-empfaenger-entfernen]")) {
      const rows = empfaengerHost.querySelectorAll("[data-empfaenger-row]");
      if (rows.length <= 1) { toast("Mindestens ein Empfänger wird benötigt."); return; }
      e.target.closest("[data-empfaenger-row]").remove();
    }
  });
  document.getElementById("btnEmpfaengerHinzufuegen").addEventListener("click", () => empfaengerZeileHinzufuegen("", ""));

  function getEmpfaengerListe() {
    return [...empfaengerHost.querySelectorAll("[data-empfaenger-row]")].map((row) => ({
      bezeichnung: row.querySelector("[data-empfaenger-bezeichnung]").value.trim(),
      adresse: row.querySelector("[data-empfaenger-adresse]").value.trim()
    })).filter((e) => e.bezeichnung || e.adresse);
  }
  function setEmpfaengerListe(liste) {
    empfaengerHost.innerHTML = "";
    if (!liste || !liste.length) {
      // Standardbelegung: BGHW zuerst, danach die üblichen Bezirksregierungen NRW, dann Betriebsrat.
      // Alle Adressen bleiben vollständig editierbar.
      empfaengerZeileHinzufuegen("BGHW Bonn", "Berufsgenossenschaft Handel und Warenlogistik (BGHW)\nDirektion Bonn\nNiebuhrstraße 5\n53113 Bonn");
      empfaengerZeileHinzufuegen("Bezirksregierung Köln", "Bezirksregierung Köln\nDezernat Arbeitsschutz\nZeughausstraße 2–10\n50667 Köln");
      empfaengerZeileHinzufuegen("Bezirksregierung Düsseldorf", "Bezirksregierung Düsseldorf\nDezernat Arbeitsschutz\nCecilienallee 2\n40474 Düsseldorf");
      empfaengerZeileHinzufuegen("Bezirksregierung Münster", "Bezirksregierung Münster\nDezernat Arbeitsschutz\nDomplatz 1–3\n48143 Münster");
      empfaengerZeileHinzufuegen("Betriebsrat", "");
    } else {
      liste.forEach((e) => empfaengerZeileHinzufuegen(e.bezeichnung, e.adresse));
    }
  }
  setEmpfaengerListe(null); // Startzustand: BGHW + Bezirksregierungen + Betriebsrat vorbelegt


  function initChoicePills() {
    document.querySelectorAll(".choice-pill").forEach((pill) => {
      const input = pill.querySelector("input");
      const sync = () => pill.classList.toggle("checked", input.checked);
      input.addEventListener("change", () => {
        // bei radio: Geschwister-Pillen im selben Namen entladen
        if (input.type === "radio") {
          document.querySelectorAll(`input[name="${input.name}"]`).forEach((sib) => {
            sib.closest(".choice-pill").classList.toggle("checked", sib.checked);
          });
        } else {
          sync();
        }
        handleConditionalFields();
      });
      if (input.dataset.danger) pill.classList.add("pill-danger-source");
      sync();
    });
  }

  function handleConditionalFields() {
    const eingestellt = form.querySelector('input[name="arbeitEingestellt"]:checked');
    document.getElementById("arbeitEingestelltSpaeterFelder").style.display =
      eingestellt && eingestellt.value === "spaeter" ? "grid" : "none";

    const wieder = form.querySelector('input[name="wiederAufgenommen"]:checked');
    document.getElementById("wiederAufgenommenFelder").style.display =
      wieder && wieder.value === "ja" ? "grid" : "none";

    const toedlich = form.querySelector('input[name="toedlich"]:checked');
    document.querySelectorAll('.choice-row[data-choice-group="toedlich"] .choice-pill').forEach((p) => {
      const isJa = p.querySelector("input").value === "ja";
      p.classList.toggle("danger", isJa && p.querySelector("input").checked);
    });
  }

  // ---------- Körperteil-Katalog rendern ----------
  const katalogHost = document.getElementById("koerperteil-katalog");
  const koerperteilState = {}; // { "Auge": {aktiv:true, seite:"links"} }

  function renderKoerperteilKatalog() {
    katalogHost.innerHTML = "";
    KOERPERTEIL_KATALOG.forEach((gruppe) => {
      const gDiv = document.createElement("div");
      gDiv.className = "koerperteil-gruppe";
      const h4 = document.createElement("h4");
      h4.textContent = gruppe.gruppe;
      gDiv.appendChild(h4);

      gruppe.teile.forEach((teil) => {
        const row = document.createElement("div");
        row.className = "koerperteil-item";
        row.dataset.teil = teil;

        const label = document.createElement("label");
        label.className = "teil-name";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.style.marginRight = "6px";
        cb.addEventListener("change", () => {
          koerperteilState[teil] = koerperteilState[teil] || { aktiv: false, seite: "keine" };
          koerperteilState[teil].aktiv = cb.checked;
          row.classList.toggle("aktiv", cb.checked);
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(" " + teil));
        row.appendChild(label);

        if (KOERPERTEIL_MIT_SEITE.has(teil)) {
          const seiteWrap = document.createElement("div");
          seiteWrap.className = "seite-choice";
          ["links", "rechts", "beidseitig"].forEach((seite) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "seite-btn";
            btn.textContent = seite;
            btn.addEventListener("click", () => {
              koerperteilState[teil].seite = seite;
              seiteWrap.querySelectorAll(".seite-btn").forEach((b) => b.classList.remove("checked"));
              btn.classList.add("checked");
            });
            seiteWrap.appendChild(btn);
          });
          row.appendChild(seiteWrap);
        }

        gDiv.appendChild(row);
      });
      katalogHost.appendChild(gDiv);
    });
  }
  renderKoerperteilKatalog();

  function getAusgewaehlteKoerperteile() {
    return Object.entries(koerperteilState)
      .filter(([, v]) => v.aktiv)
      .map(([teil, v]) => ({ teil, seite: v.seite || "keine" }));
  }

  function setKoerperteile(list) {
    (list || []).forEach((eintrag) => {
      const row = katalogHost.querySelector(`.koerperteil-item[data-teil="${CSS.escape(eintrag.teil)}"]`);
      if (!row) return;
      const cb = row.querySelector('input[type="checkbox"]');
      cb.checked = true;
      row.classList.add("aktiv");
      koerperteilState[eintrag.teil] = { aktiv: true, seite: eintrag.seite || "keine" };
      if (eintrag.seite && eintrag.seite !== "keine") {
        row.querySelectorAll(".seite-btn").forEach((b) => {
          if (b.textContent === eintrag.seite) b.classList.add("checked");
        });
      }
    });
  }

  // ---------- Unfallursachen-Katalog rendern (zweistufig: Kategorie -> Detailursache) ----------
  const ursacheHost = document.getElementById("unfallursache-katalog");
  let ursacheState = { kategorie: null, detail: null };

  function renderUnfallursacheKatalog() {
    ursacheHost.innerHTML = "";
    const kategorieRow = document.createElement("div");
    kategorieRow.className = "choice-row compact-grid";
    kategorieRow.style.marginBottom = "10px";
    const aktiveKategorieHinweis = document.createElement("div");
    aktiveKategorieHinweis.className = "katalog-aktive-kategorie";
    aktiveKategorieHinweis.style.display = "none";
    const unterHost = document.createElement("div");
    unterHost.className = "choice-row compact-grid";
    unterHost.id = "unfallursache-unterpunkte";

    function renderUnterpunkte(gruppe) {
      unterHost.innerHTML = "";
      gruppe.unterpunkte.forEach((punkt) => {
        const label = document.createElement("label");
        label.className = "choice-pill";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "unfallursacheDetail";
        input.value = punkt;
        input.addEventListener("change", () => {
          ursacheState.detail = punkt;
          unterHost.querySelectorAll(".choice-pill").forEach((p) => p.classList.remove("checked"));
          label.classList.add("checked");
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + punkt));
        unterHost.appendChild(label);
      });
    }

    UNFALLURSACHE_KATALOG.forEach((gruppe) => {
      const label = document.createElement("label");
      label.className = "choice-pill";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "unfallursacheKategorie";
      input.value = gruppe.kategorie;
      input.addEventListener("change", () => {
        ursacheState = { kategorie: gruppe.kategorie, detail: null };
        kategorieRow.querySelectorAll(".choice-pill").forEach((p) => p.classList.remove("checked"));
        label.classList.add("checked");
        aktiveKategorieHinweis.textContent = "Ausgewählte Kategorie: " + gruppe.kategorie;
        aktiveKategorieHinweis.style.display = "inline-block";
        renderUnterpunkte(gruppe);
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + gruppe.kategorie));
      kategorieRow.appendChild(label);
    });

    ursacheHost.appendChild(kategorieRow);
    ursacheHost.appendChild(aktiveKategorieHinweis);
    ursacheHost.appendChild(unterHost);
  }
  renderUnfallursacheKatalog();

  function setUnfallursache(kategorie, detail) {
    if (!kategorie) return;
    const kategorieInput = ursacheHost.querySelector(`input[name="unfallursacheKategorie"][value="${CSS.escape(kategorie)}"]`);
    if (!kategorieInput) return;
    kategorieInput.checked = true;
    kategorieInput.dispatchEvent(new Event("change"));
    if (detail) {
      setTimeout(() => {
        const detailInput = document.getElementById("unfallursache-unterpunkte")
          .querySelector(`input[value="${CSS.escape(detail)}"]`);
        if (detailInput) {
          detailInput.checked = true;
          detailInput.dispatchEvent(new Event("change"));
        }
      }, 0);
    }
  }

  // ---------- Arbeitsmittel-Katalog rendern (flache Einfachauswahl) ----------
  const arbeitsmittelHost = document.getElementById("arbeitsmittel-katalog");
  const arbeitsmittelSonstigesWrap = document.getElementById("arbeitsmittelSonstigesWrap");
  const arbeitsmittelSonstigesText = document.getElementById("arbeitsmittelSonstigesText");
  let arbeitsmittelWert = null;

  function renderArbeitsmittelKatalog() {
    arbeitsmittelHost.innerHTML = "";
    ARBEITSMITTEL_KATALOG.forEach((gruppe) => {
      const gDiv = document.createElement("div");
      gDiv.className = "katalog-gruppe";
      const h4 = document.createElement("h4");
      h4.textContent = gruppe.gruppe;
      gDiv.appendChild(h4);

      const row = document.createElement("div");
      row.className = "choice-row compact-grid";
      gruppe.eintraege.forEach((eintrag) => {
        const label = document.createElement("label");
        label.className = "choice-pill";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "arbeitsmittel";
        input.value = eintrag;
        input.addEventListener("change", () => {
          arbeitsmittelWert = eintrag;
          arbeitsmittelHost.querySelectorAll(".choice-pill").forEach((p) => p.classList.remove("checked"));
          label.classList.add("checked");
          arbeitsmittelSonstigesWrap.style.display = eintrag === "Sonstiges" ? "block" : "none";
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + eintrag));
        row.appendChild(label);
      });
      gDiv.appendChild(row);
      arbeitsmittelHost.appendChild(gDiv);
    });
  }
  renderArbeitsmittelKatalog();

  function setArbeitsmittel(wert, sonstigesText) {
    if (!wert) return;
    const input = arbeitsmittelHost.querySelector(`input[value="${CSS.escape(wert)}"]`);
    if (!input) return;
    input.checked = true;
    input.dispatchEvent(new Event("change"));
    if (sonstigesText) arbeitsmittelSonstigesText.value = sonstigesText;
  }

  // ---------- Signatur-Pad ----------
  function setupSignaturePad(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let hasContent = false;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const prevData = hasContent ? canvas.toDataURL() : null;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#16212b";
      if (prevData) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
        img.src = prevData;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - rect.left, y: p.clientY - rect.top };
    }
    function start(e) {
      e.preventDefault();
      drawing = true;
      hasContent = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end() { drawing = false; }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    document.querySelector(`[data-clear-sig="${canvasId}"]`).addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasContent = false;
    });

    return {
      isEmpty: () => !hasContent,
      dataUrl: () => (hasContent ? canvas.toDataURL("image/png") : null),
      setDataUrl: (url) => {
        if (!url) return;
        const img = new Image();
        img.onload = () => {
          const rect = canvas.getBoundingClientRect();
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          hasContent = true;
        };
        img.src = url;
      }
    };
  }

  const sigUnternehmer = setupSignaturePad("sigUnternehmer");
  const sigBetriebsrat = setupSignaturePad("sigBetriebsrat");

  // ---------- Formulardaten sammeln ----------
  function sammleFormularDaten() {
    const fd = new FormData(form);
    const get = (name) => fd.get(name) || "";
    return {
      unternehmenAnschrift: get("unternehmenAnschrift"),
      marktnummer: get("marktnummer"),
      unternehmensnummer: get("unternehmensnummer"),
      empfaengerListe: getEmpfaengerListe(),
      personName: get("personName"),
      geburtsdatum: get("geburtsdatum"),
      strasse: get("strasse"),
      plz: get("plz"),
      ort: get("ort"),
      geschlecht: get("geschlecht"),
      staatsangehoerigkeit: get("staatsangehoerigkeit"),
      leiharbeitnehmer: get("leiharbeitnehmer"),
      auszubildende: get("auszubildende"),
      beziehung: {
        verwandt: !!fd.get("beziehungVerwandt"),
        verheiratet: !!fd.get("beziehungVerheiratet"),
        lebenspartnerschaft: !!fd.get("beziehungLebenspartnerschaft"),
        rolle: get("rolle")
      },
      entgeltfortzahlungWochen: get("entgeltfortzahlungWochen"),
      krankenkasse: get("krankenkasse"),
      toedlich: get("toedlich"),
      unfallDatum: get("unfallDatum"),
      unfallUhrzeit: get("unfallUhrzeit"),
      unfallort: get("unfallort"),
      homeoffice: get("homeoffice"),
      wegeunfall: get("wegeunfall"),
      schilderungQuelle: get("schilderungQuelle"),
      schilderung: get("schilderung"),
      koerperteile: getAusgewaehlteKoerperteile(),
      verletzungsart: get("verletzungsart"),
      unfallursacheKategorie: ursacheState.kategorie,
      unfallursacheDetail: ursacheState.detail,
      arbeitsmittel: arbeitsmittelWert,
      arbeitsmittelSonstigesText: arbeitsmittelSonstigesText.value,
      augenzeuge: get("augenzeuge"),
      kenntnisPerson: get("kenntnisPerson"),
      erstbehandlung: get("erstbehandlung"),
      arbeitszeitBeginn: get("arbeitszeitBeginn"),
      arbeitszeitEnde: get("arbeitszeitEnde"),
      taetigkeit: get("taetigkeit"),
      taetigSeit: get("taetigSeit"),
      betriebsteil: get("betriebsteil"),
      bereichMarkt: get("bereichMarkt"),
      arbeitEingestellt: get("arbeitEingestellt"),
      spaeterDatum: get("spaeterDatum"),
      spaeterUhrzeit: get("spaeterUhrzeit"),
      wiederAufgenommen: get("wiederAufgenommen"),
      wiederAufgenommenDatum: get("wiederAufgenommenDatum"),
      wiederBeginn: get("wiederBeginn"),
      wiederEnde: get("wiederEnde"),
      krankheitsdauerTage: get("krankheitsdauerTage"),
      meldedatum: get("meldedatum"),
      telefonRueckfragen: get("telefonRueckfragen"),
      unterschriftUnternehmer: sigUnternehmer.dataUrl(),
      unterschriftBetriebsrat: sigBetriebsrat.dataUrl()
    };
  }

  // ---------- Speichern ----------
  let aktuelleId = null;
  const params = new URLSearchParams(location.search);
  if (params.get("id")) aktuelleId = params.get("id");

  async function speichern() {
    const daten = sammleFormularDaten();
    const bericht = {
      id: aktuelleId || ualNeueId(),
      erstelltAm: new Date().toISOString(),
      ...daten
    };
    await ualSaveBericht(bericht);
    aktuelleId = bericht.id;
    return bericht;
  }

  document.getElementById("btnSpeichern").addEventListener("click", async () => {
    try {
      await speichern();
      toast("Gespeichert.");
    } catch (e) {
      console.error(e);
      toast("Speichern fehlgeschlagen: " + e.message);
    }
  });

  document.getElementById("btnZuruecksetzen").addEventListener("click", () => {
    if (confirm("Formular wirklich leeren? Nicht gespeicherte Eingaben gehen verloren.")) {
      location.href = "index.html";
    }
  });

  document.getElementById("btnSpeichernExport").addEventListener("click", async (ev) => {
    const btn = ev.currentTarget;
    btn.disabled = true;
    const textVorher = btn.textContent;
    btn.textContent = "Erzeuge PDF …";
    try {
      const bericht = await speichern();
      await erzeugeUnfallanzeigePdf(bericht);
      toast("Gespeichert und PDF erzeugt.");
    } catch (e) {
      console.error(e);
      toast("Fehler: " + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = textVorher;
    }
  });

  // ---------- Vorhandenen Bericht laden (z. B. aus dem Archiv zum Bearbeiten) ----------
  async function ladeFallsVorhanden() {
    if (!aktuelleId) return;
    try {
      const b = await ualGetBericht(aktuelleId);
      if (!b) return;
      Object.entries(b).forEach(([key, value]) => {
        if (key === "koerperteile") return;
        if (key === "empfaengerListe") { setEmpfaengerListe(value); return; }
        if (key === "empfaenger" && !b.empfaengerListe) { setEmpfaengerListe([{ bezeichnung: "BGHW", adresse: value }]); return; }
        if (key === "beziehung") {
          if (value.verwandt) form.querySelector('[name="beziehungVerwandt"]').checked = true;
          if (value.verheiratet) form.querySelector('[name="beziehungVerheiratet"]').checked = true;
          if (value.lebenspartnerschaft) form.querySelector('[name="beziehungLebenspartnerschaft"]').checked = true;
          if (value.rolle) {
            const el = form.querySelector(`[name="rolle"][value="${value.rolle}"]`);
            if (el) el.checked = true;
          }
          return;
        }
        if (key === "unterschriftUnternehmer") { sigUnternehmer.setDataUrl(value); return; }
        if (key === "unterschriftBetriebsrat") { sigBetriebsrat.setDataUrl(value); return; }
        if (key === "unfallursacheKategorie" || key === "unfallursacheDetail") return; // unten gemeinsam behandelt
        if (key === "arbeitsmittel" || key === "arbeitsmittelSonstigesText") return; // unten gemeinsam behandelt
        const els = form.querySelectorAll(`[name="${key}"]`);
        if (!els.length) return;
        if (els[0].type === "radio") {
          const el = form.querySelector(`[name="${key}"][value="${value}"]`);
          if (el) el.checked = true;
        } else {
          els[0].value = value || "";
        }
      });
      setKoerperteile(b.koerperteile);
      setUnfallursache(b.unfallursacheKategorie, b.unfallursacheDetail);
      setArbeitsmittel(b.arbeitsmittel, b.arbeitsmittelSonstigesText);
      initChoicePills();
      handleConditionalFields();
    } catch (e) {
      console.error("Konnte Bericht nicht laden:", e);
    }
  }

  initChoicePills();
  handleConditionalFields();
  ladeFallsVorhanden();
})();
