const state = {
  model: null,
};

// ===== Helpers ==============================================================
const todayISO = () => new Date().toISOString().slice(0, 10);

const generateId = () => {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `rep-${stamp}-${rand}`;
};

// ===== Model creation =======================================================
// Shape:
// {
//   id, createdAt,
//   meta: { azienda, impianto, data, tecnico, strumento, logoData, logoName },
//   motori: [ { id, order, ...fields } ],
//   nextMotorOrder
// }
const createEmptyModel = () => ({
  id: generateId(),
  createdAt: new Date().toISOString(),
  meta: {
    azienda: "",
    impianto: "",
    data: todayISO(),
    tecnico: "",
    strumento: "",
    logoData: "",
    logoName: "",
  },
  motori: [],
  nextMotorOrder: 1,
});

// ===== Normalization ========================================================
const normalizeMotor = (raw = {}) => ({
  id: raw.id || generateId(),
  // `order` controls visual order and PDF ordering.
  // Accept numbers and numeric strings, fallback to 0 (will be reindexed on import).
  order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 0,
  identificativo: (raw.identificativo || "").trim(),
  marca: (raw.marca || "").trim(),
  modello: (raw.modello || "").trim(),
  potenza: (raw.potenza || "").toString().trim(),
  tensione: (raw.tensione || "").toString().trim(),
  correnteNominale: (raw.correnteNominale || "").toString().trim(),
  tipoRaffreddamento: (raw.tipoRaffreddamento || "").toString().trim(),
  tensioneProva: (raw.tensioneProva || "").toString().trim(),
  resistenza: (raw.resistenza || "").toString().trim(),
  indicePolarizzazione: (raw.indicePolarizzazione || "").toString().trim(),
  note: (raw.note || "").trim(),
});

const normalizeModel = (raw = {}) => {
  const meta = raw.meta || raw.datiGenerali || {};
  const motori = Array.isArray(raw.motori) ? raw.motori : [];
  const normalizedMotori = motori.map(normalizeMotor);

  // Make sure `order` is always unique and sequential.
  // This prevents edge-cases where imported motors all have `order = 0`
  // and moving items up/down stops working.
  const reindexedMotori = normalizedMotori
    .map((motor, index) => ({ motor, index }))
    .sort((a, b) => (a.motor.order || 0) - (b.motor.order || 0) || a.index - b.index)
    .map(({ motor }, index) => ({ ...motor, order: index + 1 }));

  return {
    id: raw.id || generateId(),
    createdAt: raw.createdAt || new Date().toISOString(),
    meta: {
      azienda: (meta.azienda || "").trim(),
      impianto: (meta.impianto || "").trim(),
      data: meta.data || todayISO(),
      tecnico: (meta.tecnico || "").trim(),
      strumento: (meta.strumento || "").trim(),
      logoData: meta.logoData || "",
      logoName: meta.logoName || "",
    },
    motori: reindexedMotori,
    nextMotorOrder: reindexedMotori.length + 1,
  };
};

// ===== Validation ===========================================================
const validateModel = (model) => {
  const errors = [];
  if (!model) {
    errors.push("Modello assente");
  }
  if (model && !model.meta.data) {
    errors.push("Data ispezione mancante");
  }
  return {
    valid: errors.length === 0,
    errors,
  };
};

// ===== Utilities ============================================================
const sortByOrder = (items) => [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
