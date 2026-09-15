export const g1schedB = [
  {
    id: 'g1-2022-01-17-smp-prio-max',
    part: 'G1',
    topic: 'Scheduling',
    title: 'SMP biprocessore con P1 a priorita massima',
    source: '17 gennaio 2022 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.01.17.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 4,
    diagrams: ['Gantt_2022_01_17'],
    statement: 'P1: 4/4/2, P2: 2/4/5, P3: 5/3/3, P4: 10/1 (tempi CPU/I/O/CPU). Sistema biprocessore, unica unita di I/O con gestione FIFO, priorita statica con P1 a priorita massima e P4 a priorita minima. Disegnare lo schedule e indicare i tempi di completamento.',
    idea: 'P1 (priorita massima) occupa sempre una CPU quando e ready e preempta P4 al rientro dall\u0027I/O; P4 riempie solo i buchi lasciati dagli altri processi.',
    solution: 'Passaggi chiave dalle note. 1) P1 (prio max) e P2 partono subito: P1 su CPU1 per 4ms, P2 su CPU2 per 2ms poi va in I/O. 2) P3 (prio 3) subentra su CPU2 per 5ms poi va in I/O. 3) P4 (prio minima) usa CPU1 e CPU2 nei buchi lasciati liberi. 4) P1 torna dall\u0027I/O a t=10 e preempta P4 su CPU2 (10-12). Completamento: P2=11, P1=12, P4=16, P3=16, quindi makespan 16ms; P4 chiude poi con 1ms di I/O a t=17. Vedi diagramma con consegna e soluzione in SO-G1-Gantt.pdf e nota Excalidraw Gantt 2022.01.17.',
    invariants: [
      'P1 ready occupa sempre una CPU (priorita massima).',
      'L\u0027unita di I/O serve in ordine FIFO le richieste dei processi.',
      'P4 esegue solo quando nessun altro processo e ready.'
    ],
    pitfalls: [
      'Dimenticare la preemption di P4 da parte di P1 a t=10.',
      'Sbagliare l\u0027ordine FIFO della coda I/O tra P2, P3 e P1.',
      'Confondere il makespan CPU (16ms) con la chiusura dell\u0027I/O finale di P4 (17ms).'
    ]
  },
  {
    id: 'g1-2022-02-14-smp-prio-min',
    part: 'G1',
    topic: 'Scheduling',
    title: 'SMP biprocessore con P1 a priorita minima',
    source: '14 febbraio 2022 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.02.14.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 4,
    diagrams: ['Gantt_2022_02_14'],
    statement: 'Stessi processi del 2022.01.17 (P1: 4/4/2, P2: 2/4/5, P3: 5/3/3, P4: 10/1), sistema biprocessore con unica unita di I/O FIFO, ma priorita invertite: P1 a priorita minima e P4 a priorita massima. Disegnare lo schedule indicando i punti di preemption.',
    idea: 'Con P1 a priorita minima, ogni rientro di un processo a priorita maggiore lo sospende: P1 viene preemptato a t=7 da P4 e di nuovo quando P2 e P4 rientrano dall\u0027I/O.',
    solution: 'Preemption dalle note. A t=7 P1 torna dall\u0027I/O (dovrebbe andare su CPU2 per 7-8) ma P4, a priorita massima, richiede la CPU: P1 viene sospeso. A t=10-11 P1 riprende su CPU1 (10-13) finche P2 non torna dall\u0027I/O (12) e P4 dall\u0027I/O (13): P1 viene sospeso di nuovo. Completamento: P3=12, P4=13, P2=17, P1=19, quindi makespan 19ms. Vedi diagramma con consegna e soluzione in SO-G1-Gantt.pdf e nota Excalidraw Gantt 2022.02.14.',
    invariants: [
      'P4 ready occupa sempre una CPU (priorita massima).',
      'P1 esegue solo quando nessun altro processo e ready.',
      'L\u0027unita di I/O serve in ordine FIFO.'
    ],
    pitfalls: [
      'Non sospendere P1 a t=7 al rientro quando P4 richiede la CPU.',
      'Perdere la seconda sospensione di P1 tra t=12 e t=13.',
      'Assegnare a P1 una CPU mentre P2 o P4 sono ready.'
    ]
  },
  {
    id: 'g1-2022-06-21-multilivello',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Multilivello a 2 code: FIFO periodici e RR q=3',
    source: '21 giugno 2022 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.06.21.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 3,
    diagrams: ['Gantt_2022_06_21'],
    statement: 'Coda ad alta priorita con politica FIFO: processi h e k periodici ogni 6ms con 1ms di CPU ciascuno. Coda a bassa priorita con Round Robin q=3ms: P: 4/2/2/1/5, Q: 5/3/2/1/4 (tempi CPU/I/O alternati). Disegnare lo schedule.',
    idea: 'I periodici h e k si riattivano ogni 6ms e preemptano sempre la coda bassa; P e Q avanzano in RR da 3ms solo nei buchi tra h e k, con I/O FIFO.',
    solution: 'Regole dalle note. 1) h e k si riattivano ogni 6ms (a 0, 6, 12, 18, 24, 30) e preemptano sempre la coda a bassa priorita. 2) P e Q girano in RR da 3ms nei buchi tra le attivazioni di h e k. 3) L\u0027I/O e FIFO: P fa I/O a 9-11, Q a 17-20, e cosi via. Completamento circa 33ms. Vedi diagramma con consegna e soluzione in SO-G1-Gantt.pdf e nota Excalidraw Gantt 2022.06.21.',
    invariants: [
      'Ogni 6ms h e k vanno in esecuzione prima di qualsiasi processo della coda bassa.',
      'P e Q condividono la CPU in quanti da 3ms a turno.',
      'L\u0027unita di I/O serve le richieste in ordine di arrivo.'
    ],
    pitfalls: [
      'Dimenticare una riattivazione periodica di h e k (0, 6, 12, 18, 24, 30).',
      'Far proseguire P o Q durante l\u0027esecuzione di h o k.',
      'Invertire l\u0027ordine FIFO delle richieste I/O di P e Q.'
    ]
  },
  {
    id: 'g1-2022-09-06-rr-biprocessore',
    part: 'G1',
    topic: 'Scheduling',
    title: 'RR biprocessore con 4 istanze attivate a 0/2/4/7',
    source: '6 settembre 2022 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.09.06.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 5,
    diagrams: [],
    statement: 'Programma P: due volte (5ms CPU + 4ms I/O) piu 2ms CPU finali. Sistema biprocessore, 4 istanze attivate a t=0 (P1), t=2 (P2), t=4 (P3), t=7 (P4). Scheduler Round Robin con quanto 3ms, dispositivo I/O condiviso con gestione FIFO. Calcolare i tempi di completamento.',
    idea: 'Il collo di bottiglia e il dispositivo I/O FIFO (32ms di I/O serializzato su 39ms totali); le CPU restano idle quando tutti i processi sono in I/O e ogni burst da 5ms si spezza in 3+2ms per il quanto.',
    solution: 'Tracciamento completo dalle note (Soluzione G1 2022-09-06). t=0: P1 su CPU0 (0-3). t=2: P2 su CPU1 (2-5). t=3: P1 scade il quanto e riprende subito (3-5). t=4: arriva P3. t=5: P1 finisce il primo burst e inizia I/O (5-9); P2 scade il quanto; CPU0 a P3 (5-8), CPU1 a P2 (5-7). t=7: arriva P4; P2 finisce il burst ma l\u0027I/O e occupato e va in coda; P4 su CPU1 (7-10). t=8: P3 scade il quanto e riprende (8-10). t=9: P1 finisce I/O, l\u0027I/O serve P2 (9-13). t=10: P3 finisce il burst e va in coda I/O; P4 scade il quanto; CPU0 a P1 secondo burst (10-13), CPU1 a P4 (10-12). t=12: P4 finisce il burst e va in coda I/O. t=13: P1 scade il quanto e riprende (13-15); P2 finisce I/O, l\u0027I/O serve P3 (13-17); P2 secondo burst su CPU1 (13-16). t=15: P1 finisce il secondo burst e va in coda I/O. t=16: P2 scade il quanto e riprende (16-18). t=17: P3 finisce I/O, l\u0027I/O serve P4 (17-21); P3 secondo burst su CPU0 (17-20). t=18: P2 finisce il secondo burst e va in coda I/O. t=20: P3 scade il quanto e riprende (20-22). t=21: P4 finisce I/O, l\u0027I/O serve P1 secondo (21-25); P4 secondo burst su CPU1 (21-24). t=22: P3 finisce il secondo burst e va in coda I/O. t=24: P4 scade il quanto e riprende (24-26). t=25: P1 finisce il secondo I/O, l\u0027I/O serve P2 secondo (25-29); P1 short_compute su CPU0 (25-27). t=26: P4 finisce il secondo burst e va in coda I/O. t=27: P1 TERMINA. t=29: P2 finisce il secondo I/O, l\u0027I/O serve P3 secondo (29-33); P2 short_compute (29-31). t=31: P2 TERMINA. t=33: P3 finisce il secondo I/O, l\u0027I/O serve P4 secondo (33-37); P3 short_compute (33-35). t=35: P3 TERMINA. t=37: P4 finisce il secondo I/O; P4 short_compute (37-39). t=39: P4 TERMINA. Risultato: P1=27, P2=31, P3=35, P4=39, makespan 39ms. Turnaround: P1 27, P2 29, P3 31, P4 32; medio 29,75ms. 8 preemption totali (2 per processo sui burst lunghi, nessuna sullo short_compute da 2ms inferiore al quanto). Dispositivo I/O sempre occupato da t=5 a t=37.',
    invariants: [
      'Ogni burst da 5ms si spezza in 3+2ms per il quanto da 3ms.',
      'L\u0027I/O serve in FIFO: ordine P1, P2, P3, P4 sia al primo che al secondo giro.',
      'L\u0027ordine di terminazione rispecchia l\u0027ordine di attivazione.'
    ],
    pitfalls: [
      'Disegnare blocchi CPU continui da 5ms ignorando la preemption del quanto (errore della soluzione Luizo).',
      'Dimenticare la coda I/O: un processo che finisce la CPU a I/O occupato attende in coda.',
      'Non contare i periodi idle delle CPU quando tutti i processi sono in I/O.'
    ]
  },
  {
    id: 'g1-2023-01-18-rr-minmax',
    part: 'G1',
    topic: 'Scheduling',
    title: 'RR a 2 processi: minimo e massimo al variare di q e ordine',
    source: '18 gennaio 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.01.18.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 3,
    diagrams: ['Gantt_2023_01_18_q1', 'Gantt_2023_01_18_q8', 'Gantt_2023_01_18_q12'],
    statement: 'PA: 1/2/1/8/1, PB: 2/1/8/1/1 (tempi CPU/I/O alternati). Stessa unita di I/O con gestione FIFO. Determinare il tempo di completamento minimo e massimo al variare del quanto q e dell\u0027ordine di partenza (PA prima o PB prima).',
    idea: 'Se PA parte prima il completamento resta 14ms per ogni q; se PB parte prima con q grande, i suoi 8ms continui di CPU piu gli 8ms finali di I/O serializzano tutto e il tempo cresce fino a 21ms.',
    solution: 'Tabella dalle note (simulatore). q=1: PA prima 14ms, PB prima 15ms. q=2: 14ms e 18ms. q=3: 14ms e 17ms. q=4: 14ms e 18ms. q=5: 14ms e 19ms. q=6: 14ms e 20ms. q>=8: 14ms e 21ms. Minimo: 14ms (PA prima, qualsiasi q). Massimo: 21ms (PB prima, q>=8). Perche: se PB parte prima con q grande esegue 8ms di CPU continui mentre PA resta fermo, e i suoi 8ms di I/O finali serializzano tutto.',
    invariants: [
      'Con PA prima il completamento e 14ms per ogni valore di q.',
      'Con PB prima il completamento cresce con q fino al tetto di 21ms.',
      'L\u0027unita di I/O serve una richiesta alla volta in ordine di arrivo.'
    ],
    pitfalls: [
      'Assumere che l\u0027ordine di partenza non cambi il makespan.',
      'Trascurare l\u0027effetto del quanto grande sul burst CPU da 8ms di PB.',
      'Dimenticare che gli 8ms finali di I/O di PB non si sovrappongono ad altro.'
    ]
  },
  {
    id: 'g1-2023-02-15-periodici-x',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Periodici a priorita statica: x minimo per schedule infinito',
    source: '15 febbraio 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.02.15.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 3,
    diagrams: ['Gantt_2023_02_15'],
    statement: 'P1 (priorita massima): 2ms CPU + 2ms I/O, periodo 4ms. P2 (media): 2ms CPU + 2ms I/O, periodo 8ms. P3 (minima): 4ms CPU + 2ms I/O + 4ms CPU + 2ms I/O, periodo x da determinare. Trovare lo x minimo che permette uno schedule infinito.',
    idea: 'Al limite di schedulabilita l\u0027utilizzo CPU arriva al 100 per cento: 50 (P1) + 25 (P2) + 8/x (P3) = 100, da cui x = 32ms, e con x=32 l\u0027I/O non forma mai coda.',
    solution: 'Soluzione Luizo dalle note: x minimo = 32ms. P1 (prio max) usa la CPU 2ms ogni 4ms e rientra subito in I/O; P2 (media) incastra i suoi 2ms nei buchi; P3 (minima) completa il primo burst a 16 (tratti 6-8 e 14-16) e il secondo a 32 (tratti 22-24 e 30-32). L\u0027unita di I/O non forma mai coda: ogni richiesta trova il dispositivo libero. Verifica con l\u0027utilizzo CPU: P1 = 2ms ogni 4ms = 50 per cento, P2 = 2ms ogni 8ms = 25 per cento, P3 = 8ms di CPU ogni x; al limite 50 + 25 + 8/x = 100, quindi 8/x = 25 per cento e x = 32ms (utilizzo 100 per cento, schedulabile al limite). Vedi diagramma con consegna e soluzione in SO-G1-Gantt.pdf.',
    invariants: [
      'P1 occupa 2ms di CPU ogni 4ms (50 per cento fisso).',
      'P2 occupa 2ms di CPU ogni 8ms (25 per cento fisso).',
      'Con x=32 ogni richiesta I/O trova il dispositivo libero.'
    ],
    pitfalls: [
      'Calcolare l\u0027utilizzo sulla somma CPU+I/O invece che sulla sola CPU.',
      'Scegliere x minore di 32 sovraccaricando la CPU oltre il 100 per cento.',
      'Non verificare che l\u0027I/O resti senza coda con x=32.'
    ]
  },
  {
    id: 'g1-2024-01-17-periodici-x',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Periodici a priorita statica: x minimo (P1 periodo 2)',
    source: '17 gennaio 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.01.17.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 3,
    diagrams: [],
    statement: 'P1 (priorita massima): 1ms CPU + 1ms I/O, periodo 2ms. P2 (media): 1ms CPU + 1ms I/O, periodo 4ms. P3 (minima): 2ms CPU + 1ms I/O + 2ms CPU + 1ms I/O, periodo x da determinare. Trovare lo x minimo che permette uno schedule infinito.',
    idea: 'Stesso schema del 2023.02.15 in scala ridotta: 50 (P1) + 25 (P2) + 4/x (P3) = 100, da cui x = 16ms.',
    solution: 'Soluzione dalle note: x minimo = 16ms. P1 pesa 1/2 = 50 per cento di CPU, P2 pesa 1/4 = 25 per cento, P3 pesa 4/x: per arrivare al 100 per cento serve 50 + 25 + 25 = 100, quindi x = 16ms. Con x=16 P3 fa 4ms di CPU per periodo; P1 preempta sempre ogni 2ms, P2 ogni 4ms, P3 esegue nei buchi. Schedule indefinito possibile.',
    invariants: [
      'P1 occupa 1ms di CPU ogni 2ms (50 per cento fisso).',
      'P2 occupa 1ms di CPU ogni 4ms (25 per cento fisso).',
      'Con x=16 l\u0027utilizzo CPU totale e esattamente 100 per cento.'
    ],
    pitfalls: [
      'Contare anche i tempi I/O nell\u0027utilizzo CPU.',
      'Scegliere x minore di 16 superando il 100 per cento di CPU.',
      'Dimenticare che P1 preempta ogni 2ms anche P3.'
    ]
  },
  {
    id: 'g1-2024-02-13-periodici-2io',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Periodici con 2 unita I/O: x minimo',
    source: '13 febbraio 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.02.13.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 4,
    diagrams: [],
    statement: 'P1 (priorita massima): 1ms CPU + 1ms I/O su unita 1, periodo 2ms. P2 (media): 1ms CPU + 1ms I/O su unita 2, periodo 4ms. P3 (minima): 1ms CPU + 2ms I/O su unita 2 + 1ms CPU + 2ms I/O su unita 2, periodo x da determinare. Trovare lo x minimo che permette uno schedule infinito.',
    idea: 'La CPU resta all\u002787,5 per cento con x=16 (50 + 25 + 12,5) ma il vero vincolo e l\u0027unita I/O 2 condivisa tra P2 e P3: con x=16 pesa solo 5/16 e lo schedule regge.',
    solution: 'Soluzione dalle note: x minimo = 16ms. P1 pesa 1/2 = 50 per cento di CPU con I/O su unita 1 indipendente; P2 pesa 1/4 = 25 per cento di CPU con I/O su unita 2; P3 pesa 2/16 = 12,5 per cento di CPU, totale 87,5 per cento sotto il 100 per cento. Vincolo I/O unita 2: P2 (1ms ogni 4) + P3 (4ms ogni 16) = 5/16 = 31 per cento, sotto il 100 per cento, quindi schedulabile. Con x=8: P3 peserebbe 25 per cento di CPU (totale 100 per cento borderline) e l\u0027I/O unita 2 peserebbe 5/8 = 62,5 per cento: al limite ma non sicuro.',
    invariants: [
      'L\u0027I/O di P1 e su unita separata e non interferisce con P2 e P3.',
      'P2 e P3 condividono l\u0027unita I/O 2: il loro carico combinato deve restare sotto il 100 per cento.',
      'Con x=16 sia la CPU (87,5 per cento) sia l\u0027unita 2 (31 per cento) sono sotto il limite.'
    ],
    pitfalls: [
      'Ignorare la condivisione dell\u0027unita I/O 2 tra P2 e P3.',
      'Confondere i periodi (2, 4, x) con i tempi di servizio.',
      'Accettare x=8 senza notare che la CPU arriva al 100 per cento borderline.'
    ]
  },
  {
    id: 'g1-2024-06-25-leggere-gantt',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Decifrare il Gantt dato: algoritmi e sequenza',
    source: '25 giugno 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.06.25.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 4,
    diagrams: [],
    statement: 'Dato il Gantt CPU (1 1 1 3 3 2 1 1 1 1 1 3 3 3 1 3 3 2 1 2, poi idle 3, idle 1, idle 2) e il Gantt I/O (1 1 1 3 3 3, poi idle, poi 1 1 1, poi 2 2), stabilire: c\u0027e preemption, quale algoritmo usa la CPU, quale l\u0027I/O, e qual e la sequenza di richieste dei processi.',
    idea: 'I burst CPU visibili sono multipli di 3ms (RR con quanto 3), l\u0027I/O serve in ordine di arrivo (FIFO) e gli slot con un solo numero indicano CPU idle.',
    solution: 'Soluzione dalle note. Scheduler CPU: Round Robin con quanto 3ms, perche i burst visibili sono multipli di 3 (111, 333, ecc.). Scheduler I/O: FIFO, con ordine di arrivo 1, 3, poi 2. Preemption: si, si vede P2 che interrompe P1 e P1 che riprende dopo. Sequenza: P1 fa CPU(3) poi I/O(3) poi CPU(3) e cosi via; P3 fa CPU(3) poi I/O(3) poi CPU(3); P2 fa CPU(2) poi I/O(2) poi CPU(2). I numeri isolati (3, poi 1, poi 2) indicano CPU idle, cioe nessun processo ready in quegli slot.',
    invariants: [
      'Ogni burst CPU da 3ms corrisponde a un quanto Round Robin pieno.',
      'L\u0027ordine di servizio I/O rispecchia l\u0027ordine di arrivo delle richieste.',
      'Uno slot con un solo numero e CPU idle solo se nessun altro processo e ready.'
    ],
    pitfalls: [
      'Leggere gli slot idle come esecuzione del processo indicato.',
      'Confondere il quanto da 3ms con i burst da 2ms di P2.',
      'Assegnare all\u0027I/O una politica RR invece di FIFO.'
    ]
  },
  {
    id: 'g1-2025-01-15-rr-minmax',
    part: 'G1',
    topic: 'Scheduling',
    title: 'RR a 2 processi: minimo e massimo (burst da 6ms)',
    source: '15 gennaio 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.01.15.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 3,
    diagrams: ['Gantt_2025_01_15_q1', 'Gantt_2025_01_15_q12'],
    statement: 'PA: 2/1/1/6/1, PB: 1/1/6/1/1 (tempi CPU/I/O alternati). Stessa unita di I/O con gestione FIFO. Determinare il tempo di completamento minimo e massimo al variare del quanto q e dell\u0027ordine di partenza (PA prima o PB prima).',
    idea: 'Con PA prima bastano q>=2 per il minimo di 12ms; con PB prima e q grande il burst da 6ms di PB piu l\u0027I/O finale portano il tempo fino a 17ms.',
    solution: 'Tabella dalle note (simulatore). q=1: PA prima 14ms, PB prima 14ms. q=2: 12ms e 14ms. q=3: 12ms e 15ms. q=4: 12ms e 16ms. q>=6: 12ms e 17ms. Minimo: 12ms (PA prima, q>=2). Massimo: 17ms (PB prima, q>=6).',
    invariants: [
      'Con PA prima e q>=2 il completamento e fermo a 12ms.',
      'Con PB prima il completamento cresce con q fino al tetto di 17ms.',
      'Con q=1 entrambi gli ordini danno 14ms.'
    ],
    pitfalls: [
      'Pensare che q=1 dia il tempo peggiore: qui il massimo e a q grande con PB prima.',
      'Trascurare l\u0027effetto dell\u0027ordine di partenza sul burst da 6ms.',
      'Dimenticare la serializzazione sull\u0027unita I/O condivisa.'
    ]
  },
  {
    id: 'g1-2025-05-28-periodici-2io',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Periodici con 2 unita I/O: x minimo (P2 periodo 2)',
    source: '28 maggio 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.05.28.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 4,
    diagrams: [],
    statement: 'P1 (priorita massima): 1ms CPU + 1ms I/O su unita 2, periodo 4ms. P2 (media): 1ms CPU + 1ms I/O su unita 1, periodo 2ms. P3 (minima): 1ms CPU + 2ms I/O su unita 2 + 1ms CPU + 2ms I/O su unita 2, periodo x da determinare. Trovare lo x minimo che permette uno schedule infinito.',
    idea: 'P2 ha priorita media ma periodo piu corto e preempta P3; con x=16 la CPU e all\u002787,5 per cento e l\u0027unita I/O 2 al 50 per cento, mentre x=8 e solo al limite (CPU 100 per cento): valore da verificare sul testo ufficiale.',
    solution: 'Soluzione dalle note: x minimo = 16ms come valore sicuro. P1 pesa 1/4 = 25 per cento di CPU; P2 pesa 1/2 = 50 per cento di CPU (priorita media ma periodo piu corto, quindi preempta P3); P3 pesa 2/16 = 12,5 per cento di CPU, totale 87,5 per cento sotto il 100 per cento. Vincolo I/O unita 2: P1 (1ms ogni 4) + P3 (4ms ogni 16) = 0,25 + 0,25 = 50 per cento, sotto il 100 per cento. Con x=8: P3 peserebbe 25 per cento di CPU (totale 100 per cento borderline) e l\u0027I/O unita 2 peserebbe 0,25 + 0,5 = 75 per cento: le note riportano x minimo = 8ms al limite e 16ms sicuro (da verificare sul testo ufficiale quale sia richiesto).',
    invariants: [
      'P2, pur a priorita media, preempta P3 per il periodo piu corto.',
      'P1 e P3 condividono l\u0027unita I/O 2: il loro carico combinato deve restare sotto il 100 per cento.',
      'Con x=16 sia la CPU (87,5 per cento) sia l\u0027unita 2 (50 per cento) sono sotto il limite.'
    ],
    pitfalls: [
      'Dare a P3 precedenza su P2 per la priorita nominale ignorando i periodi.',
      'Ignorare la condivisione dell\u0027unita I/O 2 tra P1 e P3.',
      'Confondere il valore al limite (x=8) con il valore sicuro (x=16).'
    ]
  },
  {
    id: 'g1-2025-07-21-rr-3processi',
    part: 'G1',
    topic: 'Scheduling',
    title: 'RR con 3 processi identici: scelta del quanto',
    source: '21 luglio 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.07.21.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 3,
    diagrams: ['Gantt_2025_07_21_q1', 'Gantt_2025_07_21_q2', 'Gantt_2025_07_21_q3', 'Gantt_2025_07_21_q4'],
    statement: '3 processi identici: 4ms CPU, 4ms I/O, 4ms CPU. Stessa unita di I/O con gestione FIFO. Disegnare lo schedule per ogni quanto q, indicare la scelta migliore e il limite massimo di completamento.',
    idea: 'I quanti che dividono il burst da 4ms (q=2 e q>=4) danno 24ms; q=1 frammenta troppo e q=3 lascia un residuo da 1ms che costa 2ms di CPU idle, entrambi a 26ms.',
    solution: 'Tabella dalle note (simulatore verificato). q=1: 26ms. q=2: 24ms. q=3: 26ms. q>=4: 24ms. Migliori: q=2 e q>=4 con 24ms. Massimo: 26ms (q=1 o q=3). Perche q=1 e q=3 sono peggiori: q=1 frammenta troppo (ogni processo fa 1ms e lascia residui che allungano la coda I/O); q=3 lascia 1ms di residuo per ogni burst da 4ms, quindi servono 4 scatti per finire il primo burst invece di 2, creando 2ms di CPU idle.',
    invariants: [
      'I quanti che dividono 4ms (2 e >=4) evitano residui di burst.',
      'L\u0027unita di I/O serve in FIFO: l\u0027ordine di arrivo decide l\u0027ordine di servizio.',
      'Il makespan oscilla solo tra 24ms e 26ms al variare di q.'
    ],
    pitfalls: [
      'Pensare che q=1 (massima equita) dia il tempo migliore.',
      'Non contare gli scatti extra dovuti al residuo da 1ms con q=3.',
      'Dimenticare i 2ms di CPU idle creati dal residuo con q=3.'
    ]
  }
];
