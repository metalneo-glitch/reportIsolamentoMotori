const getImageFormat = (dataUrl) => {
  const match = /^data:image\/(png|jpeg|jpg);/i.exec(dataUrl || "");
  if (!match) {
    return null;
  }
  const type = match[1].toLowerCase();
  const normalized = type === "jpg" ? "jpeg" : type;
  return normalized === "png" ? "PNG" : "JPEG";
};

const exportPdfReport = () => {
  if (!state.model) {
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const azienda = state.model.meta.azienda || "-";
  const impianto = state.model.meta.impianto || "-";
  const data = state.model.meta.data || "-";
  const tecnico = state.model.meta.tecnico || "-";
  const strumento = state.model.meta.strumento || "-";

  // Header
  doc.setFontSize(16);
  doc.text("Report Isolamento Motori", 14, 18);

  const logoFormat = getImageFormat(state.model.meta.logoData);
  if (logoFormat) {
    try {
      doc.addImage(state.model.meta.logoData, logoFormat, 150, 12, 40, 20);
    } catch (error) {
      // If the logo is corrupt or unsupported, generate the PDF anyway.
    }
  }

  doc.setFontSize(11);
  doc.text(`Azienda/Cliente: ${azienda}`, 14, 28);
  doc.text(`Impianto/Linea: ${impianto}`, 14, 35);
  doc.text(`Data ispezione: ${data}`, 14, 42);
  doc.text(`Tecnico: ${tecnico}`, 14, 49);
  doc.text(`Strumento: ${strumento}`, 14, 56);

  // Table
  const rows = sortByOrder(state.model.motori).map((motore) => [
    motore.identificativo,
    motore.marca,
    motore.modello,
    motore.potenza,
    motore.tensione,
    motore.correnteNominale,
    motore.tipoRaffreddamento,
    motore.tensioneProva,
    motore.resistenza,
    motore.indicePolarizzazione,
    motore.note || "-",
  ]);

  const head = [[
    "Identificativo",
    "Marca",
    "Modello",
    "Potenza (kW)",
    "Tensione (V)",
    "Corrente (A)",
    "Raffreddamento",
    "Tensione prova (V)",
    "Resistenza (MΩ)",
    "Indice pol.",
    "Note",
  ]];

  doc.autoTable({
    startY: 64,
    head,
    body: rows.length > 0 ? rows : [["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]],
    styles: {
      fontSize: 8,
    },
    headStyles: {
      fillColor: [43, 108, 176],
    },
  });

  doc.save(`report-isolamento-${new Date().toISOString().slice(0, 10)}.pdf`);
};
