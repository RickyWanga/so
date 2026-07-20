# SO Davoli — Ripasso C1, C2, G1

Sito Vite/React per ripassare lo scritto di Sistemi Operativi dell'Università di Bologna. Contiene:

- valutazione prudente della previsione per luglio 2026;
- archivio giugno/luglio 2017–2026;
- esercizi svolti di monitor, semafori, message passing e G1;
- pattern, invarianti, tranelli e checklist;
- ricerca, filtri e progresso salvato nel browser;
- nessun contenuto G2, per scelta.

Le tracce 2026 non ancora presenti nell'archivio ufficiale sono marcate come **ricostruzioni**. Le soluzioni sono materiale didattico non ufficiale.

## Avvio locale

Requisiti: Node.js 22 o compatibile.

```bash
npm install
npm run dev
```

Il server Vite risponde normalmente su `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Deploy su Coolify

La repository contiene un `Dockerfile` multi-stage già pronto.

1. Crea una nuova risorsa **Application** in Coolify.
2. Collega la repository GitHub.
3. Seleziona il deploy tramite **Dockerfile**.
4. Non impostare una porta pubblica custom: il container espone la porta `80`.
5. Aggiungi il dominio e avvia il deploy.

Il percorso `/healthz` restituisce `200 ok` ed è utilizzabile come health check.

## Pubblicazione manuale su GitHub

```bash
git init
git add .
git commit -m "feat: add SO Davoli study site"
git branch -M main
git remote add origin git@github.com:RickyWanga/so-davoli-ripasso.git
git push -u origin main
```

Prima dell'ultimo comando crea su GitHub una repository vuota chiamata `so-davoli-ripasso`, senza README o `.gitignore` generati dal sito.

## Fonti

- Archivio ufficiale: <https://www.cs.unibo.it/~renzo/so/compiti-so.shtml>
- PDF dei singoli appelli, collegati dalla pagina Archivio dell'applicazione.
- Appunti e svolgimenti allegati alla conversazione, usati come materiale secondario e verificati criticamente.
