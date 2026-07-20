export const patternGroups = [
  {
    id: 'monitor',
    label: 'C1 / Monitor',
    accent: 'violet',
    patterns: [
      {
        name: 'Generazioni e snapshot',
        trigger: '"tutti quelli attualmente in attesa", cambio chiave, media o numero comune',
        recipe: 'Fotografa count/result, chiudi la generazione, segnala solo dopo aver congelato i dati.',
        checks: ['Nuovi arrivi separati', 'Risultato non sovrascritto', 'Reset eseguito dall ultimo'],
      },
      {
        name: 'Rendez-vous esatto',
        trigger: 'Gruppi di n, coppie, matching tra classi',
        recipe: 'Coda o condition per classe; l ultimo arrivato compone il gruppo e assegna i risultati.',
        checks: ['FIFO richiesta', 'Classi indipendenti', 'Nessun membro usato due volte'],
      },
      {
        name: 'Risveglio selettivo',
        trigger: 'Soglia, colore, chiave, posizione n-esima',
        recipe: 'Rappresenta separatamente le classi di attesa e segnala soltanto la guardia diventata vera.',
        checks: ['Predicate diverse', 'Politica di fairness', 'Signal-urgent compreso'],
      },
      {
        name: 'Scenario a fasi',
        trigger: 'Nave, torneo, volo, porto, conferenza',
        recipe: 'Esplicita stato/fase, contatori di completamento e transizioni che aprono la fase successiva.',
        checks: ['Una sola transizione', 'Riutilizzabilita', 'Nessun processo della fase futura entra prima'],
      },
    ],
  },
  {
    id: 'semaphores',
    label: 'C2 / Semafori',
    accent: 'amber',
    patterns: [
      {
        name: 'Passaggio del testimone',
        trigger: 'Risvegliare il gruppo corretto senza far entrare nuovi processi',
        recipe: 'Il leader non libera mutex: segnala la coda. Ogni risvegliato aggiorna lo stato e passa il testimone; l ultimo riapre mutex.',
        checks: ['Chi riapre mutex?', 'Segnali esatti', 'Nessun segnale residuo'],
      },
      {
        name: 'Semaforo per classe',
        trigger: 'Livelli, priorita, colori o soglie differenti',
        recipe: 'Usa q[class] e waiting[class]. Un solo semaforo non puo scegliere una guardia logica specifica.',
        checks: ['Classe corretta', 'Contatore decrementato', 'Scan termina'],
      },
      {
        name: 'Semafori privati',
        trigger: 'FIFO/LIFO selettivo, processo n-esimo, scelta esplicita del destinatario',
        recipe: 'Accoda un semaforo binario privato per chiamante e segnala esattamente il record scelto.',
        checks: ['Un solo proprietario', 'Rimozione atomica', 'Credito non contato due volte'],
      },
      {
        name: 'Credito o consegna diretta',
        trigger: 'Implementare un semaforo custom',
        recipe: 'Se nessuno aspetta, incrementa value. Se qualcuno aspetta, consegna direttamente la V senza incrementare value.',
        checks: ['Invariante nP <= init+nV', 'No doppio credito', 'Fairness dichiarata'],
      },
    ],
  },
  {
    id: 'message',
    label: 'C2 / Message passing',
    accent: 'cyan',
    patterns: [
      {
        name: 'Inbox locale',
        trigger: 'Ricezione da mittente specifico sopra arecv(ANY)',
        recipe: 'Ogni messaggio non richiesto viene conservato in una lista locale, mai scartato.',
        checks: ['FIFO per mittente', 'ANY gestito', 'Un solo messaggio rimosso'],
      },
      {
        name: 'Sincronia con ACK',
        trigger: 'Costruire send sincrona sopra servizio asincrono',
        recipe: 'DATA contiene sender e sequence; il ricevente invia ACK solo quando consegna quel messaggio.',
        checks: ['ACK non ambiguo', 'Chiamate concorrenti', 'Tag distinti'],
      },
      {
        name: 'Marker a se stessi',
        trigger: 'Ricezione completamente non bloccante senza primitive native',
        recipe: 'Invia un marker unico a te stesso e drena fino al marker per fotografare i messaggi gia pendenti.',
        checks: ['Assunzione FIFO esplicita', 'Token unico', 'Marker non esposto all utente'],
      },
      {
        name: 'Frammentazione',
        trigger: 'Messaggi arbitrari sopra pacchetti limitati',
        recipe: 'Aggiungi messageId, indice frammento, totale e mittente; ricomponi per chiave composta.',
        checks: ['Messaggi concorrenti', 'Ultimo frammento', 'Ordine e duplicati'],
      },
    ],
  },
  {
    id: 'g1',
    label: 'G1 / Parte generale',
    accent: 'green',
    patterns: [
      {
        name: 'Registro degli eventi',
        trigger: 'Qualsiasi Gantt con CPU e I/O',
        recipe: 'Mantieni ready queue, code dei device e prossimo evento. Disegna il Gantt come output del registro.',
        checks: ['Arrivi simultanei', 'Fine I/O', 'Preemption motivata'],
      },
      {
        name: 'Page replacement',
        trigger: 'FIFO, LRU, MIN, stack, Belady, costruzione stringhe',
        recipe: 'Separa contenuto dei frame e metadati della politica. Su hit FIFO non cambia; LRU aggiorna la recenza.',
        checks: ['Fault contati', 'Vittima motivata', 'Stato dopo ogni riferimento'],
      },
      {
        name: 'FAT / fsck come grafo',
        trigger: 'Tabella FAT, free list, directory e incoerenze',
        recipe: 'Visita catene file e free list; marca proprietario, predecessore, cicli e blocchi irraggiungibili.',
        checks: ['Cross-link', 'Blocco libero e allocato', 'Orfano o ciclo'],
      },
      {
        name: 'Banchiere vettoriale',
        trigger: 'Stato safe, capitale minimo, piu valute',
        recipe: 'Need=Max-Allocated; scegli Need<=Available componente per componente e restituisci Allocated.',
        checks: ['Sequenza completa', 'Unsafe non equivale a deadlock', 'Confronti vettoriali'],
      },
    ],
  },
]
