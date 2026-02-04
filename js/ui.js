const ui = {
  subtitle: document.getElementById("subtitle"),
  logoLabel: document.getElementById("logo-label"),
  metaInputs: {
    azienda: document.getElementById("azienda"),
    impianto: document.getElementById("impianto"),
    data: document.getElementById("data"),
    tecnico: document.getElementById("tecnico"),
    strumento: document.getElementById("strumento"),
  },
  motorInputs: {
    identificativo: document.getElementById("identificativo"),
    marca: document.getElementById("marca"),
    modello: document.getElementById("modello"),
    potenza: document.getElementById("potenza"),
    tensione: document.getElementById("tensione"),
    correnteNominale: document.getElementById("corrente-nominale"),
    tipoRaffreddamento: document.getElementById("tipo-raffreddamento"),
    tensioneProva: document.getElementById("tensione-prova"),
    resistenza: document.getElementById("resistenza"),
    indicePolarizzazione: document.getElementById("indice-polarizzazione"),
    note: document.getElementById("note"),
  },
};

// Enable/disable all fields that require a report model.
const setUiEnabled = (enabled) => {
  document.querySelectorAll("[data-requires-model]").forEach((el) => {
    el.disabled = !enabled;
  });
};

const updateSubtitle = (model) => {
  if (!model) {
    ui.subtitle.textContent = "Nessun report caricato. Crea un nuovo report per iniziare.";
    return;
  }
  const label = [model.meta.azienda, model.meta.impianto].filter(Boolean).join(" · ") || "Report senza titolo";
  ui.subtitle.textContent = `${label} · ${model.meta.data || todayISO()}`;
};

const updateLogoLabel = (model) => {
  if (!ui.logoLabel) {
    return;
  }
  if (!model || !model.meta.logoName) {
    ui.logoLabel.textContent = "Nessun logo";
    return;
  }
  ui.logoLabel.textContent = model.meta.logoName;
};

// Keep meta inputs in sync with the model in real time.
const bindMetaFields = () => {
  Object.entries(ui.metaInputs).forEach(([key, input]) => {
    input.addEventListener("input", (event) => {
      if (!state.model) {
        return;
      }
      state.model.meta[key] = event.target.value;
      updateSubtitle(state.model);
    });
  });
};

const clearMotorInputs = () => {
  Object.values(ui.motorInputs).forEach((input) => {
    input.value = "";
  });
};
