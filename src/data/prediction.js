export const summerPairs = [
  {
    year: '2017',
    june: {
      c1: 'Giavellotto: scenario a fasi',
      c2: 'Primitive atomiche per spinlock',
      g1: 'Round Robin con I/O',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2017.06.19.tot.pdf',
    },
    july: {
      c1: 'Conferenza: chiamata e presenza',
      c2: 'Message passing broadcast -> asincrono',
      g1: 'Working set e thrashing',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2017.07.17.tot.pdf',
    },
  },
  {
    year: '2018',
    june: {
      c1: 'Traghetto: scenario a fasi',
      c2: 'Semaforo limitato tra -N e N',
      g1: 'Banchiere: costruzione stato unsafe',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2018.06.21.tot.pdf',
    },
    july: {
      c1: 'Delirium: risorsa e rifornimento',
      c2: 'Buffer LIFO con semafori',
      g1: 'Ricostruzione di un Gantt',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2018.07.17.tot.pdf',
    },
  },
  {
    year: '2019',
    june: {
      c1: 'Put/get con broadcast ai lettori',
      c2: 'Correzione di un semaforo e fairness',
      g1: 'Costruzione di grafi di Holt',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2019.06.18.tot.pdf',
    },
    july: {
      c1: 'Pairbuf: rendez-vous FIFO',
      c2: 'Analisi di un server asincrono',
      g1: 'Stringhe infinite di page replacement',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2019.07.15.tot.pdf',
    },
  },
  {
    year: '2021',
    june: {
      c1: 'Delayvalue: coda mobile',
      c2: 'Semaforo a priorita e LIFO',
      g1: 'EDF per processi periodici',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.06.23.tot.pdf',
    },
    july: {
      c1: 'Torneo: rendez-vous a coppie',
      c2: 'Wrongsem e passaggio del testimone',
      g1: 'Algoritmo modulo e proprieta di stack',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.07.21.tot.pdf',
    },
  },
  {
    year: '2022',
    june: {
      c1: 'Collocamento: matching per skill',
      c2: 'Dispatcher con message passing',
      g1: 'Multilevel scheduling con I/O',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.06.21.tot.pdf',
    },
    july: {
      c1: 'Porto: scenario nave/camion',
      c2: 'Message passing testardo',
      g1: 'fsck e incoerenze UNIX',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.07.20.tot.pdf',
    },
  },
  {
    year: '2023',
    june: {
      c1: 'Redblack: rendez-vous a coppie',
      c2: 'Message passing non bloccante a liste',
      g1: 'FAT incoerente',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.06.13.tot.pdf',
    },
    july: {
      c1: 'Syncvalue: cambio chiave e generazioni',
      c2: 'Message passing universale',
      g1: 'Round Robin + disco LOOK',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.07.19.tot.pdf',
    },
  },
  {
    year: '2024',
    june: {
      c1: 'Choicesem: risveglio selettivo',
      c2: 'Frammentazione di messaggi',
      g1: 'Decodifica di un Gantt',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.06.25.tot.pdf',
    },
    july: {
      c1: 'Oddblock: gruppi pari e snapshot',
      c2: 'Nas712 con semafori',
      g1: 'MIN con 3 e 4 frame',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.07.22.tot.pdf',
    },
  },
  {
    year: '2025',
    june: {
      c1: 'Minlenbb: famiglia di buffer',
      c2: 'Threshlocking con semafori',
      g1: 'Minpage e anomalia di Belady',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.06.23.tot.pdf',
    },
    july: {
      c1: 'Nmeet: rendez-vous a gruppi',
      c2: 'MPSs: ricezione n-esima con segno',
      g1: 'Round Robin al variare del quanto',
      url: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.07.21.tot.pdf',
    },
  },
]

export const reportedJune2026 = {
  date: 'Giugno 2026',
  status: 'Segnalazione dello studente; non presente nell archivio ufficiale al 20 luglio 2026',
  c1: 'Reader-writer colorato',
  c2: 'Fifolifo con selezione FIFO/LIFO',
  g1: 'Costruzione di stringhe FIFO/LRU, 4 frame e 5 pagine',
}

export const forecasts = [
  {
    part: 'C1',
    confidence: 'Media',
    primary: 'Rendez-vous, generazioni o risveglio selettivo',
    secondary: 'Scenario a fasi oppure buffer con una condizione non banale',
    verdict:
      'La tua direzione e sensata, ma rendez-vous/barrier non e quasi certo. Nei luglio recenti compaiono spesso matching, gruppi e generazioni, pero il confronto giugno-luglio non mostra una vera regola di non ripetizione a livello di macro-pattern.',
    evidence: [
      '2021: torneo a coppie',
      '2023: syncvalue a generazioni',
      '2024: oddblock con snapshot',
      '2025: nmeet a gruppi',
    ],
    focus: ['nmeet', 'syncvalue', 'at_least', 'oddblock', 'monitor a fasi'],
  },
  {
    part: 'C2',
    confidence: 'Medio-bassa',
    primary: 'Message passing',
    secondary: 'Semaforo custom con selezione o passaggio del testimone',
    verdict:
      'Message passing e il favorito, ma non per una forte alternanza: tra i luglio 2017-2025 compare in 5 casi su 8. Negli anni in cui giugno aveva chiaramente un esercizio a semafori, luglio si divide quasi alla pari tra semafori e message passing.',
    evidence: [
      'Luglio MP: 2017, 2019, 2022, 2023, 2025',
      'Luglio semafori: 2018, 2021, 2024',
      'Nel 2022 e 2023 il paradigma message passing si ripete da giugno a luglio',
    ],
    focus: ['inbox locale', 'ANY', 'ACK', 'tag e sequence number', 'frammentazione'],
  },
  {
    part: 'G1',
    confidence: 'Medio-alta',
    primary: 'Scheduling',
    secondary: 'FAT/fsck',
    verdict:
      'Qui la tua intuizione e piu solida: negli otto accoppiamenti 2017-2025 la categoria principale di luglio e diversa da quella di giugno. Dato il page replacement segnalato a giugno 2026, preparerei prima scheduling e poi FAT/fsck; non li considererei 50/50, perche nei luglio del campione scheduling ricorre tre volte e fsck una.',
    evidence: [
      'Cambio di categoria giugno -> luglio: 8/8 nel campione 2017-2025',
      'G1 di luglio: memoria/pagine 4, scheduling 3, fsck 1',
      'Con pagine appena uscite, scheduling ha il precedente piu forte',
    ],
    focus: ['Round Robin con I/O', 'priorita e processi periodici', 'decodifica Gantt', 'FAT e fsck'],
  },
]

export const finalRanking = [
  {
    part: 'C1',
    first: 'Rendez-vous / generazioni',
    second: 'Risveglio selettivo / scenario a fasi',
    doNotDrop: 'Buffer e reader-writer',
  },
  {
    part: 'C2',
    first: 'Message passing con twist',
    second: 'Semaforo custom',
    doNotDrop: 'Passaggio del testimone',
  },
  {
    part: 'G1',
    first: 'Scheduling',
    second: 'FAT / fsck',
    doNotDrop: 'Banchiere e Holt come copertura breve',
  },
]

export const recentOfficialExams = [
  {
    date: '06 febbraio 2026',
    c1: 'RBB: buffer ridimensionabile',
    c2: 'delay/tick con semafori',
    g1: 'Riconoscere MIN, LRU e FIFO da una traccia',
    url: 'https://www.cs.unibo.it/~renzo/so/compiti/2026.02.06.tot.pdf',
  },
  {
    date: '09 gennaio 2026',
    c1: 'Syndelay con monitor',
    c2: 'Semaforo float',
    g1: 'Riconoscere MIN, LRU e FIFO da una traccia',
    url: 'https://www.cs.unibo.it/~renzo/so/compiti/2026.01.09.tot.pdf',
  },
  {
    date: '05 settembre 2025',
    c1: 'Volo: scenario a fasi',
    c2: 'Messaggi standard sopra pacchetti da 1500 byte',
    g1: 'Pagmod: stack e stringa infinita',
    url: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.09.05.tot.pdf',
  },
  {
    date: '21 luglio 2025',
    c1: 'Nmeet',
    c2: 'MPSs',
    g1: 'Round Robin al variare del quanto',
    url: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.07.21.tot.pdf',
  },
  {
    date: '23 giugno 2025',
    c1: 'Minlenbb',
    c2: 'Threshlocking',
    g1: 'Minpage',
    url: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.06.23.tot.pdf',
  },
  {
    date: '28 maggio 2025',
    c1: 'Maxlenbb',
    c2: 'Anti-stalker con server',
    g1: 'Processi periodici: x minimo',
    url: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.05.28.tot.pdf',
  },
]
