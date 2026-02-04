const renderMeta = () => {
  if (!state.model) {
    Object.values(ui.metaInputs).forEach((input) => {
      input.value = "";
    });
    updateLogoLabel(null);
    return;
  }
  ui.metaInputs.azienda.value = state.model.meta.azienda;
  ui.metaInputs.impianto.value = state.model.meta.impianto;
  ui.metaInputs.data.value = state.model.meta.data;
  ui.metaInputs.tecnico.value = state.model.meta.tecnico;
  ui.metaInputs.strumento.value = state.model.meta.strumento;
  updateLogoLabel(state.model);
};

const renderMotori = () => {
  const list = document.getElementById("lista-motori");
  list.replaceChildren();

  const toNumber = (value) => {
    if (value === null || value === undefined) {
      return null;
    }
    const normalized = value.toString().replace(",", ".").trim();
    if (!normalized) {
      return null;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const evaluateIr = (value) => {
    const numeric = toNumber(value);
    if (numeric === null) {
      return { icon: "—", label: "Non disponibile" };
    }
    if (numeric < 1) {
      return { icon: "❌", label: "Inaccettabile" };
    }
    if (numeric < 10) {
      return { icon: "⚠", label: "Attenzione" };
    }
    return { icon: "✅", label: "OK" };
  };

  const evaluatePi = (value) => {
    const numeric = toNumber(value);
    if (numeric === null) {
      return { icon: "—", label: "Non disponibile" };
    }
    if (numeric < 1) {
      return { icon: "❌", label: "Inaccettabile" };
    }
    if (numeric < 2) {
      return { icon: "⚠", label: "Attenzione" };
    }
    return { icon: "✅", label: "OK" };
  };

  const createTextCell = (value) => {
    const td = document.createElement("td");
    td.textContent = value ?? "";
    return td;
  };

  if (!state.model || state.model.motori.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 14;
    cell.className = "muted";
    cell.textContent = "Nessun motore inserito.";
    row.appendChild(cell);
    list.appendChild(row);
    return;
  }

  sortByOrder(state.model.motori).forEach((motore, index, arr) => {
    const row = document.createElement("tr");
    row.appendChild(createTextCell(motore.identificativo));
    row.appendChild(createTextCell(motore.marca));
    row.appendChild(createTextCell(motore.modello));
    row.appendChild(createTextCell(motore.potenza));
    row.appendChild(createTextCell(motore.tensione));
    row.appendChild(createTextCell(motore.correnteNominale));
    row.appendChild(createTextCell(motore.tipoRaffreddamento));
    row.appendChild(createTextCell(motore.tensioneProva));
    row.appendChild(createTextCell(motore.resistenza));
    const irResult = evaluateIr(motore.resistenza);
    const irCell = document.createElement("td");
    irCell.textContent = irResult.icon;
    irCell.title = irResult.label;
    row.appendChild(irCell);
    row.appendChild(createTextCell(motore.indicePolarizzazione));
    const piResult = evaluatePi(motore.indicePolarizzazione);
    const piCell = document.createElement("td");
    piCell.textContent = piResult.icon;
    piCell.title = piResult.label;
    row.appendChild(piCell);
    row.appendChild(createTextCell(motore.note || "-"));

    const actionsCell = document.createElement("td");
    const actionsWrap = document.createElement("div");
    actionsWrap.className = "actions-inline";

    const upButton = document.createElement("button");
    upButton.className = "icon-btn";
    upButton.textContent = "⬆️ Su";
    upButton.dataset.move = "up";
    upButton.dataset.id = motore.id;
    upButton.disabled = index === 0;
    actionsWrap.appendChild(upButton);

    const downButton = document.createElement("button");
    downButton.className = "icon-btn";
    downButton.textContent = "⬇️ Giu";
    downButton.dataset.move = "down";
    downButton.dataset.id = motore.id;
    downButton.disabled = index === arr.length - 1;
    actionsWrap.appendChild(downButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-btn danger";
    deleteButton.textContent = "🗑️ Elimina";
    deleteButton.dataset.delete = motore.id;
    actionsWrap.appendChild(deleteButton);

    actionsCell.appendChild(actionsWrap);
    row.appendChild(actionsCell);
    list.appendChild(row);
  });
};

// Re-render all visible UI from the current model.
const rerenderAll = () => {
  renderMeta();
  renderMotori();
  updateSubtitle(state.model);
};
