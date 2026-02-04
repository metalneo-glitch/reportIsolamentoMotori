const createNewReport = () => {
  state.model = createEmptyModel();
  setUiEnabled(true);
  rerenderAll();
};

const resetReport = () => {
  state.model = null;
  setUiEnabled(false);
  rerenderAll();
};

// Import/export ==============================================================
const importJsonReport = async (file) => {
  const text = await file.text();
  const raw = JSON.parse(text);
  state.model = normalizeModel(raw);
  setUiEnabled(true);
  rerenderAll();
};

const exportJsonReport = () => {
  if (!state.model) {
    return;
  }
  const blob = new Blob([JSON.stringify(state.model, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `report-isolamento-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const updateLogo = async (file) => {
  if (!state.model) {
    return;
  }

  // jsPDF supports PNG/JPEG data URLs out of the box. Keep the UX explicit.
  const type = (file.type || "").toLowerCase();
  const isSupported =
    type === "image/png" ||
    type === "image/jpeg" ||
    type === "image/jpg" ||
    /\.(png|jpe?g)$/i.test(file.name || "");
  if (!isSupported) {
    alert("Formato logo non supportato. Usa PNG o JPG.");
    return;
  }

  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > 1.5) {
    alert("Logo molto grande: il JSON/PDF potrebbero risultare pesanti. Valuta un logo piu leggero.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  state.model.meta.logoData = dataUrl;
  state.model.meta.logoName = file.name || "logo";
  rerenderAll();
};

// Motors ====================================================================
const addMotor = () => {
  if (!state.model) {
    return;
  }
  const identificativo = ui.motorInputs.identificativo.value.trim();
  if (!identificativo) {
    alert("Inserisci almeno l'identificativo del motore.");
    return;
  }

  const motor = normalizeMotor({
    id: generateId(),
    order: state.model.nextMotorOrder,
    identificativo,
    marca: ui.motorInputs.marca.value,
    modello: ui.motorInputs.modello.value,
    potenza: ui.motorInputs.potenza.value,
    tensione: ui.motorInputs.tensione.value,
    correnteNominale: ui.motorInputs.correnteNominale.value,
    tipoRaffreddamento: ui.motorInputs.tipoRaffreddamento.value,
    tensioneProva: ui.motorInputs.tensioneProva.value,
    resistenza: ui.motorInputs.resistenza.value,
    indicePolarizzazione: ui.motorInputs.indicePolarizzazione.value,
    note: ui.motorInputs.note.value,
  });

  state.model.nextMotorOrder += 1;
  state.model.motori.push(motor);
  clearMotorInputs();
  rerenderAll();
};

const deleteMotor = (id) => {
  if (!state.model) {
    return;
  }
  state.model.motori = state.model.motori.filter((item) => item.id !== id);
  rerenderAll();
};

// Swap the `order` values to move a motor up/down without re-indexing all.
const moveMotor = (id, direction) => {
  if (!state.model) {
    return;
  }
  const list = sortByOrder(state.model.motori);
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= list.length) {
    return;
  }
  const current = list[index];
  const target = list[targetIndex];
  const temp = current.order;
  current.order = target.order;
  target.order = temp;
  state.model.motori = list;
  rerenderAll();
};

const clearMotors = () => {
  if (!state.model) {
    return;
  }
  state.model.motori = [];
  state.model.nextMotorOrder = 1;
  rerenderAll();
};
