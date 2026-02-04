# Report Isolamento Motori

Pagina HTML statica per creare report di isolamento elettrico motori. Inserisci i dati, salva in JSON, esporta in PDF.

## Come usare

1. Apri `index.html` nel browser.
2. Compila i dati generali e i dati del motore.
3. Usa `Aggiungi motore` per inserirlo nella tabella.
4. Esporta con `Salva JSON` oppure `Esporta PDF`.

## Funzioni principali

- Modello unico in memoria (`state.model`) (tiene tutti i dati in memoria).
- Import/Export JSON.
- Export PDF con tabella motori e logo aziendale.
- Help con tabelle di riferimento (PI, IR, tensione prova, guida rapida).

## Struttura cartelle

```
reportIsolamentoMotori/
├── index.html            # layout e template help
├── css/
│   └── style.css         # tema e componenti UI
├── js/
│   ├── state.js          # modello e normalizzazione (pulisce i dati importati)
│   ├── ui.js             # binding campi e UI helper
│   ├── render.js         # rendering tabella
│   ├── actions.js        # mutazioni, import/export, logo
│   ├── app.js            # bootstrap e binding eventi
│   └── pdf.js            # generazione PDF
├── assets/               # risorse future (logo, immagini, icone)
└── lib/                  # librerie locali
```

## Note

- Il logo supporta PNG/JPG.
- Le librerie PDF sono in locale dentro `lib/`.
