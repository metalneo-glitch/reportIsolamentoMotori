const byId = (id) => document.getElementById(id);

// Close any open <details> menus (Altro/Help) when we perform an action.
const closeAllMenus = () => {
  document.querySelectorAll("details[open]").forEach((details) => {
    details.removeAttribute("open");
  });
};

const openHelpDialog = (title, templateId) => {
  const dialog = byId("help-dialog");
  const titleEl = byId("help-title");
  const bodyEl = byId("help-body");
  const template = byId(templateId);

  if (!dialog || !titleEl || !bodyEl || !template) {
    return;
  }

  closeAllMenus();
  titleEl.textContent = title;
  bodyEl.replaceChildren(template.content.cloneNode(true));

  // Native <dialog> is supported by all modern browsers. Keep a tiny fallback.
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    return;
  }
  dialog.setAttribute("open", "");
};

const init = () => {
  // Bind meta inputs first, then create an initial report (enables the UI).
  bindMetaFields();
  createNewReport();

  // Ensure only one toolbar menu is open at a time (Altro vs Help).
  document.querySelectorAll(".toolbar-menu").forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (!menu.open) {
        return;
      }
      document.querySelectorAll(".toolbar-menu").forEach((other) => {
        if (other !== menu) {
          other.removeAttribute("open");
        }
      });
    });
  });

  // Primary actions
  byId("btn-new").addEventListener("click", createNewReport);
  byId("btn-open").addEventListener("click", () => byId("file-input").click());
  byId("btn-save-json").addEventListener("click", exportJsonReport);
  byId("btn-save-pdf").addEventListener("click", exportPdfReport);

  // Secondary actions
  byId("btn-reset").addEventListener("click", resetReport);
  byId("btn-clear-motors").addEventListener("click", clearMotors);
  byId("btn-logo").addEventListener("click", () => byId("logo-input").click());
  byId("aggiungi").addEventListener("click", addMotor);
  byId("reset").addEventListener("click", clearMotorInputs);

  // Help
  byId("btn-help-pi").addEventListener("click", () => {
    openHelpDialog("Valutazione Indice di Polarizzazione (PI)", "tpl-help-pi");
  });
  byId("btn-help-ir").addEventListener("click", () => {
    openHelpDialog("Valutazione Resistenza di Isolamento (IR)", "tpl-help-ir");
  });
  byId("btn-help-voltage").addEventListener("click", () => {
    openHelpDialog("Tensione di prova", "tpl-help-voltage");
  });
  byId("btn-help-guide").addEventListener("click", () => {
    openHelpDialog("Guida rapida prova", "tpl-help-guide");
  });

  // File import (JSON)
  byId("file-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    try {
      await importJsonReport(file);
    } catch (error) {
      alert("File JSON non valido.");
    } finally {
      event.target.value = "";
    }
  });

  // Logo import (image)
  byId("logo-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    try {
      await updateLogo(file);
    } catch (error) {
      alert("Impossibile caricare il logo.");
    } finally {
      event.target.value = "";
    }
  });

  // Event delegation for list actions (move/delete)
  byId("lista-motori").addEventListener("click", (event) => {
    const deleteId = event.target.dataset.delete;
    if (deleteId) {
      deleteMotor(deleteId);
      return;
    }

    const moveDirection = event.target.dataset.move;
    const moveId = event.target.dataset.id;
    if (moveDirection && moveId) {
      moveMotor(moveId, moveDirection);
    }
  });

  // Allow clicking on the backdrop to close the help dialog.
  const helpDialog = byId("help-dialog");
  if (helpDialog) {
    helpDialog.addEventListener("click", (event) => {
      if (event.target === helpDialog) {
        if (typeof helpDialog.close === "function") {
          helpDialog.close();
          return;
        }
        helpDialog.removeAttribute("open");
      }
    });
  }

  // Close button fallback when <dialog> is not fully supported.
  const helpCloseBtn = byId("btn-help-close");
  if (helpCloseBtn && helpDialog && typeof helpDialog.showModal !== "function") {
    helpCloseBtn.addEventListener("click", (event) => {
      event.preventDefault();
      helpDialog.removeAttribute("open");
    });
  }
};

init();
