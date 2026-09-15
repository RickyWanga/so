export const g1rimp = [
  {
    id: 'g1-2017-05-29-lifo-min',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Stringa infinita con LIFO uguale a MIN',
    source: '29 maggio 2017 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2017.05.29.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 2,
    statement:
      'Trovare una stringa di riferimenti infinita (con numero finito di pagine) per cui LIFO (vittima = ultima pagina caricata) e MIN si comportano esattamente allo stesso modo.',
    idea:
      'Se la pagina caricata piu di recente e sempre quella che non servira piu, la vittima LIFO coincide con la scelta di MIN.',
    solution:
      'Una stringa che non ripete mai una pagina dopo il suo primo uso (o che ripete solo la pagina appena caricata). Esempio: 0 1 2 3 4 5 6 7 8 ... con N frame: ogni fault carica una pagina nuova, LIFO espelle l\'ultima caricata che non verra mai piu usata, ed e esattamente la scelta di MIN. Regola generale: LIFO = MIN quando manca la localita temporale, cioe la pagina caricata piu di recente e sempre quella dal prossimo uso piu lontano.',
    invariants: [
      'LIFO espelle sempre l\'ultima pagina caricata.',
      'MIN espelle la pagina dal prossimo uso piu lontano.',
    ],
    pitfalls: [
      'Con ripetizioni arbitrarie le due politiche divergono: serve assenza di riuso.',
    ],
  },
  {
    id: 'g1-2017-07-17-shift-first',
    part: 'G1',
    topic: 'Page replacement',
    title: 'shift_first: MIN con 3 e 4 frame',
    source: '17 luglio 2017 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2017.07.17.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 3,
    statement:
      'void shift_first(char *a) { for (i=0; i<95; i++) a[i*1024] = a[(i+2)*1024]; } con pagine da 1K. Quanti page fault con MIN a 3 frame e con MIN a 4 frame?',
    idea:
      'La stringa scorre in avanti senza riuso lontano: MIN espelle sempre la pagina dal prossimo uso piu lontano e non soffre l\'anomalia di Belady.',
    solution:
      'Stringa di riferimenti: per i=0..94 si legge la pagina i+2 e si scrive la pagina i, cioe 2,0, 3,1, 4,2, 5,3, ..., 96,94. MIN con 3 frame: 97 fault. MIN con 4 frame: 97 fault. MIN e un algoritmo a stack, quindi aggiungere un frame non puo peggiorare il numero di fault; qui la stringa usa pagine sempre nuove, cosi ogni pagina serve solo due volte consecutive e la vittima MIN e sempre quella col prossimo uso piu lontano.',
    invariants: [
      'MIN e a stack: piu frame non aumentano mai i fault.',
      'Ogni pagina della stringa compare solo in due riferimenti consecutivi.',
    ],
    pitfalls: [
      'Confondere lettura e scrittura: ogni iterazione genera due riferimenti (i+2 in lettura, i in scrittura).',
      'Attribuire a MIN l\'anomalia di Belady, che riguarda FIFO e algoritmi non a stack.',
    ],
  },
  {
    id: 'g1-2017-09-11-working-set',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Working set globale di 3 processi',
    source: '11 settembre 2017 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2017.09.11.tot.pdf',
    focus: false,
    reconstructed: true,
    difficulty: 3,
    statement:
      'Data la sequenza di accessi di 3 processi (a, b, c) (da verificare sul testo ufficiale), calcolare il working set globale con durata (finestra) di 15 riferimenti.',
    idea:
      'Il working set e l\'insieme delle pagine distinte nella finestra: se la somma dei working set supera i frame, scatta il trashing.',
    solution:
      'Metodo: 1) si scorre la finestra di 15 riferimenti; 2) a ogni passo si contano le pagine DISTINTE nella finestra = working set; 3) se il WS supera i frame disponibili si ha trashing e si sospende un processo; 4) il sistema deve mantenere la somma dei WS minore o uguale ai frame totali. Per i valori numerici serve la sequenza esatta dal testo (da verificare sul testo ufficiale).',
    invariants: [
      'WS(t) = pagine distinte negli ultimi 15 riferimenti.',
      'Condizione di stabilita: somma dei WS <= frame totali.',
    ],
    pitfalls: [
      'Contare i riferimenti invece delle pagine distinte.',
      'Dimenticare la sospensione di un processo in caso di trashing.',
    ],
  },
  {
    id: 'g1-2019-07-15-minref',
    part: 'G1',
    topic: 'Page replacement',
    title: 'MINREF contro MIN',
    source: '15 luglio 2019 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2019.07.15.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 3,
    statement:
      'MINREF sceglie come vittima la pagina che compare meno volte nella stringa dall\'inizio. a) Trovare una sequenza infinita dove MINREF = MIN. b) (da verificare sul testo ufficiale).',
    idea:
      'Con pagine sempre nuove ogni conteggio vale 1 e la vittima MINREF coincide con quella di MIN; in generale MINREF e inefficiente perche ignora il futuro.',
    solution:
      'a) Una stringa dove ogni pagina compare una volta sola prima di essere espulsa: 0 1 2 3 4 5 6 ... (pagine sempre nuove). MINREF espelle la pagina col conteggio minore e MIN espelle quella col prossimo uso piu lontano (che non verra mai riusata): coincidono. Perche MINREF e inefficiente: non tiene conto della recency — una pagina usata 100 volte in passato ma mai piu in futuro non viene mai espulsa da MINREF, mentre MIN la espellerebbe subito. MINREF ignora la localita temporale futura.',
    invariants: [
      'MINREF guarda solo il passato (conteggio dall\'inizio).',
      'MIN guarda solo il futuro (prossimo uso).',
    ],
    pitfalls: [
      'Credere che un alto conteggio passato implichi riuso futuro.',
    ],
  },
  {
    id: 'g1-2021-07-21-pagmod',
    part: 'G1',
    topic: 'Page replacement',
    title: 'pagmod: vittima i % NF, stack e uguaglianza con MIN',
    source: '21 luglio 2021 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.07.21.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 3,
    statement:
      'pagmod sceglie come vittima il frame i % NF, dove i e la posizione nella stringa e NF il numero di frame. a) E un algoritmo a stack? b) Trovare una sequenza infinita dove pagmod = MIN.',
    idea:
      'La vittima dipende solo dall\'indice i e da NF, non dal contenuto: cambiando NF cambia tutto, quindi niente proprieta di stack; con pagine mai riusate ogni vittima e anche scelta di MIN.',
    solution:
      'a) NO, non e a stack. La vittima dipende solo dall\'indice i e da NF, non dal contenuto dei frame. Aumentando NF cambia completamente la scelta delle vittime e il numero di fault puo aumentare: pagmod e soggetto all\'anomalia di Belady. b) Sequenza di pagine tutte diverse in ordine: 0,1,2,...,NF-1, NF, NF+1, ...: ogni accesso e un fault, la vittima e il frame i % NF che contiene la pagina mai piu usata, ed e la scelta di MIN.',
    invariants: [
      'Algoritmo a stack: l\'insieme in memoria con k frame e sottoinsieme di quello con k+1 frame.',
      'pagmod decide solo in base a (i, NF).',
    ],
    pitfalls: [
      'Pensare che una vittima deterministica implichi la proprieta di stack.',
    ],
  },
  {
    id: 'g1-2021-09-15-belady',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Anomalia di Belady con FIFO',
    source: '15 settembre 2021 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.09.15.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 2,
    statement:
      'Data la stringa 1 2 3 4 1 2 5 1 2 3 4 5, verificare che con FIFO a 4 frame ci sono piu fault che con 3 frame (anomalia di Belady).',
    idea:
      'FIFO non e a stack: con piu frame alcune pagine restano piu a lungo e bloccano i frame che servirebbero ai riusi successivi.',
    solution:
      'FIFO con 3 frame: 9 page fault. FIFO con 4 frame: 10 page fault (anomalia). Con 3 frame: f0 = 1,1,1,4,4,4,5,5,5,5,5,5; f1 = -,2,2,2,1,1,1,1,1,3,3,3; f2 = -,-,3,3,3,2,2,2,2,2,4,4. Con 4 frame: f0 = 1,1,1,1,1,1,5,5,5,5,4,4; f1 = -,2,2,2,2,2,2,1,1,1,1,5; f2 = -,-,3,3,3,3,3,3,2,2,2,2; f3 = -,-,-,4,4,4,4,4,4,3,3,3. Perche: con 4 frame la pagina 1 resta in memoria piu a lungo e blocca il frame che servirebbe alle pagine 3 e 4 quando ritornano.',
    invariants: [
      'FIFO espelle la pagina caricata da piu tempo.',
      'Anomalia di Belady: piu frame possono dare piu fault (solo se non a stack).',
    ],
    pitfalls: [
      'Simulare male l\'ordine FIFO dopo i fault: gli hit non cambiano la coda.',
      'Credere che l\'anomalia valga per LRU o MIN (sono a stack).',
    ],
  },
  {
    id: 'g1-2023-09-11-pagine-8-9-bit',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Pagine da 8 bit contro 9 bit',
    source: '11 settembre 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.09.11.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 2,
    statement:
      'Spazio indirizzabile di 4096 byte (12 bit). Confrontare pagine con offset da 8 bit (256 B) contro pagine con offset da 9 bit (512 B).',
    idea:
      'Pagine piccole: meno frammentazione interna ma tabelle piu grandi e piu fault; pagine grandi: viceversa.',
    solution:
      '8 bit (256 B): 4096/256 = 16 pagine, offset 8 bit, indice di pagina 4 bit. 9 bit (512 B): 4096/512 = 8 pagine, offset 9 bit, indice di pagina 3 bit. Pagine piu piccole: meno frammentazione interna ma tabelle delle pagine piu grandi e piu page fault (meno localita per pagina). Pagine piu grandi: meno fault ma piu frammentazione interna (in media mezza pagina sprecata: 128 B contro 256 B).',
    invariants: [
      'n.pagine = spazio / dimensione pagina.',
      'bit indice + bit offset = bit dello spazio logico (4+8 = 3+9 = 12).',
    ],
    pitfalls: [
      'Confondere bit di offset con bit di indice pagina.',
      'Dimenticare il trade-off frammentazione interna contro dimensione tabella.',
    ],
  },
  {
    id: 'g1-2024-07-22-min-3-4-frame',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Ciclo shift con MIN a 3 e 4 frame',
    source: '22 luglio 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.07.22.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 3,
    statement:
      'for (i=0; i<15; i++) a[i*1024] = a[(i+2)*1024]; con pagine da 1K. Quanti page fault con MIN a 3 frame e con MIN a 4 frame?',
    idea:
      'Stessa struttura dello shift_first 2017: scansione in avanti, MIN non peggiora aggiungendo frame.',
    solution:
      'Stringa: per i=0..14 si legge i+2 e si scrive i, cioe 2,0, 3,1, 4,2, 5,3, 6,4, 7,5, 8,6, 9,7, 10,8, 11,9, 12,10, 13,11, 14,12, 15,13, 16,14. MIN con 3 frame: 31 fault. MIN con 4 frame: 31 fault (nessuna anomalia: MIN e a stack).',
    invariants: [
      'MIN e a stack: fault(4 frame) <= fault(3 frame).',
    ],
    pitfalls: [
      'Generare la stringa con un solo riferimento per iterazione invece di due.',
    ],
  },
  {
    id: 'g1-2025-06-23-minpage',
    part: 'G1',
    topic: 'Page replacement',
    title: 'minpage: uguaglianza con LRU e MIN, stack, inefficienza',
    source: '23 giugno 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.06.23.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 4,
    statement:
      'minpage sceglie come vittima la pagina col numero di pagina minimo. 1) Trovare una stringa infinita dove minpage = LRU = MIN. 2) Mostrare che minpage non e soggetto all\'anomalia di Belady. 3) Perche e inefficiente?',
    idea:
      'Con blocchi crescenti ripetuti la pagina col numero minimo e anche la meno recente e quella dal riuso piu lontano; la scelta monotona in NF da la proprieta di stack, ma il numero di pagina ignora la localita.',
    solution:
      '1) Stringa: pagine in ordine crescente ripetute in blocchi, es. 0 1 2 3 0 1 2 3 4 5 6 7 4 5 6 7 ... — con 4 frame la vittima di minpage (numero minimo = la piu vecchia) coincide con LRU e MIN. 2) No Belady: minpage espelle sempre la pagina col numero piu piccolo; all\'aumentare dei frame l\'insieme delle pagine in memoria con k frame resta sottoinsieme di quello con k+1 frame (proprieta di stack, scelta monotona in NF). 3) Inefficiente: ignora la localita — una pagina con numero basso usata di continuo viene espulsa mentre una con numero alto mai piu usata resta. Esempio: 5 5 5 5 0 1 2 3 — la pagina 5, usata 4 volte, verrebbe espulsa appena arriva la 0.',
    invariants: [
      'minpage decide solo in base al numero di pagina.',
      'Proprieta di stack: insieme(k) incluso in insieme(k+1).',
    ],
    pitfalls: [
      'Confondere numero di pagina basso con poco usata di recente.',
      'Per il punto 2 serve la monotonia, non basta un esempio.',
    ],
  },
  {
    id: 'g1-2025-09-05-pagmod',
    part: 'G1',
    topic: 'Page replacement',
    title: 'pagmod: non a stack, uguaglianza con MIN',
    source: '5 settembre 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.09.05.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 3,
    statement:
      'pagmod sceglie come vittima il frame i % NF all\'i-mo accesso. a) Dimostrare se e un algoritmo a stack. b) Trovare una sequenza infinita dove pagmod = MIN.',
    idea:
      'Stesso schema del 2021.07.21: la vittima dipende da (i, NF) quindi niente stack; pagine mai ripetute per l\'uguaglianza con MIN.',
    solution:
      'a) NON e a stack. Controesempio: con 3 frame la vittima segue 0,1,2,0,1,2...; con 4 frame 0,1,2,3,0,1... La scelta delle vittime e completamente diversa: non esiste monotonia dell\'insieme in memoria rispetto a NF, quindi puo soffrire l\'anomalia di Belady. b) Pagine mai ripetute in ordine: 0 1 2 3 4 5 6 7 8 ...: ogni accesso e un fault, la vittima e il frame i % NF che contiene la pagina mai piu usata = scelta di MIN.',
    invariants: [
      'pagmod decide solo in base a (i, NF).',
      'Senza riuso, ogni fault espelle una pagina mai piu usata (scelta MIN).',
    ],
    pitfalls: [
      'Dare solo l\'esempio del punto b senza il controesempio del punto a.',
    ],
  },
  {
    id: 'g1-2026-01-09-trace',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Trace a 4 frame compatibile con MIN, LRU, FIFO?',
    source: '9 gennaio 2026 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2026.01.09.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 4,
    statement:
      'Data la stringa 0 1 2 3 0 1 2 4 0 1 2 4 3 1 2 4 5 4 2 1 4 5 3 4 5 1 e l\'evoluzione dei 4 frame (f0..f3), dire se e compatibile con MIN, LRU, FIFO. (Proposta anche il 6 febbraio 2026.)',
    idea:
      'Simulare i tre algoritmi e confrontare fault e vittime: MIN e LRU danno 8 fault con la stessa evoluzione, FIFO ne da 12.',
    solution:
      'Con 4 frame: MIN 8 fault, LRU 8 fault, FIFO 12 fault. Evoluzione MIN/LRU (identica qui): f0 = 0 sempre poi 3 poi 5 (0 0 0 0 0 0 0 0 0 0 0 0 3 3 3 3 5 5 5 5 5 5 5 5 5 5); f1 = 1 da secondo accesso in poi; f2 = 2 poi 3 negli ultimi accessi; f3 = 3 poi 4 dal settimo accesso. La trace data nel testo corrisponde a MIN e LRU (8 fault), non a FIFO (12 fault): FIFO al settimo accesso (pagina 4) espellerebbe la pagina 0 (arrivata prima) invece della 3 — la trace mostra che esce 3 e 0 resta, quindi non e FIFO.',
    invariants: [
      'A parita di fault, la vittima al primo rimpiazzo discrimina FIFO da LRU/MIN.',
      'FIFO ignora gli hit, LRU li registra.',
    ],
    pitfalls: [
      'Fermarsi al conteggio dei fault senza controllare quale pagina esce a ogni fault.',
      'MIN e LRU qui coincidono: non sempre e cosi, va verificato caso per caso.',
    ],
  },
  {
    id: 'g1-2026-06-inversa-fifo-lru',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Costruzione inversa: stato finale voluto con FIFO e LRU',
    source: 'Giugno 2026 — esercizio ricostruito (non ufficiale)',
    focus: true,
    reconstructed: true,
    difficulty: 5,
    statement:
      'Memoria con 4 frame e un unico processo con 5 pagine {1,2,3,4,5}. a) Con FIFO, costruire la piu corta stringa che inizi con 3,4,5,1 e termini con pagina 1 nel frame 1, 2 nel frame 2, 3 nel frame 3, 4 nel frame 4, o dimostrare che non esiste. b) Con FIFO, stessa domanda con stato finale 4 nel frame 1, 3 nel frame 2, 2 nel frame 3, 1 nel frame 4, o dimostrare che non esiste. c) Con LRU, costruire la piu corta stringa che inizi con 3,4,5,1 e termini con 1,2,3,4 nei frame 1..4, o dimostrare che non esiste.',
    idea:
      'Con 5 pagine e 4 frame ogni fault riferisce l\'unica pagina assente: l\'evoluzione dei fault FIFO e deterministica; con LRU gli hit permettono di riordinare le vittime.',
    solution:
      'Dopo il prefisso 3 4 5 1 i frame sono F1=3 F2=4 F3=5 F4=1, coda FIFO 3 4 5 1, ordine LRU 3 4 5 1. a) FIFO verso F1=1 F2=2 F3=3 F4=4: stringa minima di 12 riferimenti: 3 4 5 1 | 2 3 4 5 | 1 2 3 4. Passo 5: rif 2, vittima 3; passo 6: rif 3, vittima 4; passo 7: rif 4, vittima 5; passo 8: rif 5, vittima 1; passo 9: rif 1, vittima 2; passo 10: rif 2, vittima 3; passo 11: rif 3, vittima 4; passo 12: rif 4, vittima 5. Minima perche ogni frame va sostituito e con 5 pagine su 4 frame fault e vittime sono forzati: lo stato obiettivo compare dopo 8 fault aggiuntivi. b) FIFO verso F1=4 F2=3 F3=2 F4=1: IMPOSSIBILE. Gli hit non modificano FIFO e ogni fault riferisce l\'unica pagina assente, quindi l\'evoluzione e deterministica e ciclica (periodo 20 fault); quando la pagina assente e 5 le sole configurazioni sono 2 3 4 1 / 1 2 3 4 / 4 1 2 3 / 3 4 1 2: 4 3 2 1 non compare mai e gli hit non possono renderla raggiungibile. c) LRU verso F1=1 F2=2 F3=3 F4=4: stringa minima di 10 riferimenti: 3 4 5 1 | 3 5 | 2 4 1 3. Passo 5: rif 3 hit; passo 6: rif 5 hit (ordine LRU ora F2,F4,F1,F3); passo 7: rif 2 fault, vittima 4; passo 8: rif 4 fault, vittima 1; passo 9: rif 1 fault, vittima 3; passo 10: rif 3 fault, vittima 5. Minima perche servono 4 fault (uno per frame) con vittime in ordine F2,F4,F1,F3: un singolo hit non basta a ottenere tale ordine, ne servono 2, quindi 2 hit + 4 fault dopo il prefisso. Verifica con ricerca esaustiva sugli stati FIFO/LRU con pagine {1..5} e 4 frame.',
    invariants: [
      'Con NF+1 pagine e NF frame ogni fault riferisce l\'unica pagina assente.',
      'Hit FIFO: frame e coda invariati. Hit LRU: pagina riusata diventa piu recente.',
      'Dopo il prefisso ogni frame va sostituito: servono almeno 4 fault.',
    ],
    pitfalls: [
      'Dimenticare che gli hit FIFO non cambiano la coda: non aiutano a raggiungere stati fuori dal ciclo.',
      'In LRU contare gli hit come fault o sbagliare l\'ordine delle vittime.',
      'Nel punto b tentare stringhe lunghe a caso invece di usare la ciclicita deterministica.',
    ],
  },
  {
    id: 'g1-2018-06-21-unsafe',
    part: 'G1',
    topic: 'Banchiere',
    title: 'Costruire uno stato unsafe a 3 valute',
    source: '21 giugno 2018 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2018.06.21.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 4,
    statement:
      'Costruire uno stato unsafe a 3 valute che diventi safe aggiungendo 1 istanza di OGNI valuta, ma resti unsafe aggiungendone una sola (di una sola valuta).',
    idea:
      'Serve che ogni processo abbia almeno una componente di Need >= 2, cosi una sola istanza in piu non sblocca nessuno ma (2,2,2) si.',
    solution:
      'Max/Alloc/Need: p1 Max (4,2,4) Alloc (2,0,0) Need (2,2,4); p2 Max (4,4,2) Alloc (0,2,0) Need (4,2,2); p3 Max (2,4,4) Alloc (0,0,4) Need (2,4,0); Available = (0,0,0). Con (0,0,0): nessun Need e soddisfacibile, stato unsafe. Con (1,1,1): ogni Need ha almeno una componente >= 2, nessuno e soddisfacibile, resta unsafe. Con (2,2,2): p3 e soddisfacibile, termina e rilascia (0,0,4), Available=(2,2,6); poi p1 e soddisfacibile e la sequenza completa: stato safe. Quindi una sola istanza in piu non basta, servono tutte e tre le valute.',
    invariants: [
      'Need = Max - Alloc per ogni processo e valuta.',
      'Safe = esiste un ordine che soddisfa tutti i Need con i rilasci.',
    ],
    pitfalls: [
      'Costruire Need con componenti 1: una sola istanza basterebbe a sbloccare.',
      'Dimenticare di verificare che con (1,1,1) NESSUN processo parta.',
    ],
  },
  {
    id: 'g1-2019-01-15-capitale-minimo',
    part: 'G1',
    topic: 'Banchiere',
    title: 'Capitale iniziale minimo a 3 valute',
    source: '15 gennaio 2019 — testo ufficiale (riproposto il 1 giugno 2022)',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2019.01.15.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 4,
    statement:
      'p1 credito (4,2,4) alloc (2,0,0); p2 credito (4,4,2) alloc (0,2,0); p3 credito (2,4,4) alloc (0,0,4). Trovare il capitale iniziale minimo che rende lo stato safe.',
    idea:
      'Provare gli ordini di terminazione possibili: il capitale deve coprire Alloc gia date piu il primo Need, e il minimo si ottiene con l\'ordine migliore.',
    solution:
      'Need: p1 (2,2,4); p2 (4,2,2); p3 (2,4,0). Partendo da p1: IC >= (4,2,4)+(0,2,0)+(0,0,4) = (4,4,8). Partendo da p2: Need (4,2,2), poi p3 o p1: (4,2,2)+(2,0,0)+(0,0,4) = (6,2,6), poi + (0,2,0) = (6,4,6). Partendo da p3: Need (2,4,0), poi servono (4,6,0) piu la terza componente per p1: (4,6,4). Capitale minimo: (6,4,6) con ordine p2, p3, p1.',
    invariants: [
      'IC = Available + somma Alloc: il capitale copre allocato + disponibile.',
      'Il minimo e preso sul migliore ordine di terminazione.',
    ],
    pitfalls: [
      'Fermarsi al primo ordine trovato invece di confrontarli tutti.',
      'Confondere credito massimo con Need nel calcolo.',
    ],
  },
  {
    id: 'g1-2023-06-01-banchiere-temporale',
    part: 'G1',
    topic: 'Banchiere',
    title: 'Banchiere con evoluzione temporale t0-t5',
    source: '1 giugno 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.06.01.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 4,
    statement:
      'IC=(4,3,4). t=0: p1 credito (2,2,3) alloc (1,2,3); p2 (2,3,0) alloc (0,1,0); p3 (3,0,3) alloc (2,0,0). Poi: t=1 p4 attivato con credito (1,0,0) chiede (1,0,0); t=2 p4 termina; t=3 p3 chiede (1,0,0); t=4 p5 attivato con credito (1,0,0) chiede (1,0,0); t=5 p1 termina. Dire per ogni evento se la richiesta e accettata.',
    idea:
      'A ogni richiesta simulare l\'allocazione e testare la safety: si accetta solo se lo stato simulato resta safe.',
    solution:
      't=0: Need p1 (1,0,0), p2 (2,2,0), p3 (1,0,3); Available = (4,3,4)-(3,3,3) = (1,0,1). Sequenza safe p1, p2, p3. t=1: p4 chiede (1,0,0) <= (1,0,1); simulando, Available=(0,0,1) e p4 ha Need nullo quindi termina e si torna safe: ACCETTATA. t=2: p4 termina, Available=(1,0,1). t=3: p3 chiede (1,0,0); simulando, Available=(0,0,1) e nessun Need (p1 (1,0,0), p2 (2,2,0), p3 (0,0,3)) e soddisfacibile: UNSAFE, RIFIUTATA. t=4: p5 chiede (1,0,0): stessa simulazione, UNSAFE, RIFIUTATA. t=5: p1 termina e rilascia (1,2,3): Available=(2,2,4); ora p2 (2,2,0) parte, poi p3 (1,0,3): si torna a uno stato safe.',
    invariants: [
      'Request <= Need e Request <= Available come precondizioni.',
      'Solo l\'assegnazione simulata safe viene confermata.',
    ],
    pitfalls: [
      'Accettare una richiesta solo perche Available basta, senza il test di safety.',
      'Dimenticare di aggiornare Available a ogni terminazione.',
    ],
  },
  {
    id: 'g1-2024-09-10-banchiere-bivaluta',
    part: 'G1',
    topic: 'Banchiere',
    title: 'Banchiere bivaluta con richieste e restituzioni',
    source: '10 settembre 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.09.10.tot.pdf',
    focus: false,
    reconstructed: true,
    difficulty: 3,
    statement:
      'Mostrare stato e azione a ogni richiesta e restituzione in un sistema bivaluta (valori numerici da verificare sul testo ufficiale).',
    idea:
      'Stesso protocollo del banchiere classico: precondizioni, allocazione simulata, test di safety.',
    solution:
      'Metodo generale: 1) a ogni richiesta controllare Request <= Available e Request <= Need; 2) simulare l\'allocazione: se lo stato risultante e safe si accetta, altrimenti si rifiuta (processo in attesa); 3) a ogni restituzione fare Available += Released e ricontrollare le richieste pendenti. Per i valori numerici vedere il PDF 2024.09.10 (da verificare sul testo ufficiale).',
    invariants: [
      'Request <= Need e Request <= Available.',
      'Available + somma Alloc = capitale costante.',
    ],
    pitfalls: [
      'Non riesaminare le richieste pendenti dopo una restituzione.',
    ],
  },
  {
    id: 'g1-2025-02-11-banchiere-bivaluta',
    part: 'G1',
    topic: 'Banchiere',
    title: 'Banchiere bivaluta a 3 processi',
    source: '11 febbraio 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.02.11.tot.pdf',
    focus: false,
    reconstructed: true,
    difficulty: 3,
    statement:
      'Esercizio del banchiere con 3 processi e valute A e B (valori numerici da verificare sul testo ufficiale).',
    idea:
      'Costruire Max, Alloc e Need sulle due valute e cercare la sequenza sicura ordinando i Need.',
    solution:
      'Metodo: costruire le tabelle Max, Alloc e Need per le valute A e B, calcolare Available = Totale - somma Alloc, poi verificare la sequenza sicura confrontando i Need con Available e aggiornando Available a ogni terminazione simulata. Per i valori numerici vedere il PDF 2025.02.11 (da verificare sul testo ufficiale).',
    invariants: [
      'Need = Max - Alloc su entrambe le valute.',
    ],
    pitfalls: [
      'Sommare valute diverse tra loro.',
    ],
  },
  {
    id: 'g1-2020-02-20-risorse',
    part: 'G1',
    topic: 'Banchiere',
    title: '3 classi di risorse e 4 processi',
    source: '20 febbraio 2020 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2020.02.20.tot.pdf',
    focus: false,
    reconstructed: true,
    difficulty: 3,
    statement:
      'Sistema con 3 classi di risorse A, B, C e 4 processi p, q, r, s fotografati in un certo istante (valori numerici da verificare sul testo ufficiale). Dire se lo stato e safe e, in caso, dare la sequenza.',
    idea:
      'E un test di safety del banchiere: tabelle, Available e ricerca dell\'ordine di terminazione.',
    solution:
      'Metodo: costruire Max, Alloc e Need; calcolare Available = Totale - somma Alloc; cercare la sequenza sicura confrontando iterativamente i Need con Available (a ogni terminazione simulata si somma Alloc del processo a Available). Se nessun Need e soddisfacibile lo stato e unsafe. Per i valori numerici vedere il PDF 2020.02.20 (da verificare sul testo ufficiale).',
    invariants: [
      'Available = Totale - somma Alloc.',
      'A ogni passo serve almeno un Need <= Available.',
    ],
    pitfalls: [
      'Fermarsi al primo processo eseguibile senza completare la sequenza.',
    ],
  },
  {
    id: 'g1-2023-06-13-fat-14',
    part: 'G1',
    topic: 'File system',
    title: 'FAT a 14 blocchi: incoerenze e correzioni',
    source: '13 giugno 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.06.13.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 4,
    statement:
      'FAT con 14 blocchi dati (0-1 riservati): Res, Res, EOC, EOC, 4, EOC, 5, EOC, 12, EOC, EOC, 10, 13, 7. Primo blocco libero: 8. Root (blocco 2): f punta a 3, g a 6, d a 9. Blocco directory 9: d1 punta a 10, d2 a 11, d3 a 7. Trovare le incoerenze e le correzioni di fsck.',
    idea:
      'Seguire ogni catena dalla root e dalla free list: ogni blocco deve appartenere ad esattamente una delle due; condivisioni e orfani sono errori.',
    solution:
      'Catene: f parte da 3: FAT[3]=EOC, quindi f = {3}. g parte da 6: FAT[6]=5, FAT[5]=EOC, quindi g = {6,5}. d1 parte da 10: 10 -> 13 -> 7 -> EOC, quindi d1 = {10,13,7}. d2 parte da 11: FAT[11]=10, ma 10 e gia in d1: cross-link tra d1 e d2. d3 parte da 7, gia in d1: cross-link tra d1 e d3. Free list da 8: 8 -> 12 -> EOC; il blocco 4 non e in alcuna catena ne nella free list: blocco perduto (orfano). Correzioni fsck: 1) blocco 4: aggiungerlo alla free list; 2) blocco 7 condiviso tra d1 e d3: duplicarlo (copiare i dati in un blocco libero per d3) o troncare d3; 3) blocco 10 condiviso tra d1 e d2: duplicarlo per una delle due catene o troncare d2.',
    invariants: [
      'Ogni blocco dati: o in un solo file, o nella free list, mai in entrambi, mai in nessuno.',
      'EOC chiude ogni catena; la free list parte dalla testa nota.',
    ],
    pitfalls: [
      'Scambiare indice e valore nella FAT (indice = blocco corrente, valore = prossimo).',
      'Dimenticare il blocco orfano 4 perche non compare in alcun errore di condivisione.',
    ],
  },
  {
    id: 'g1-2024-05-29-fat-32',
    part: 'G1',
    topic: 'File system',
    title: 'FAT a 32 blocchi: 3 errori',
    source: '29 maggio 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.05.29.tot.pdf',
    focus: true,
    reconstructed: false,
    difficulty: 5,
    statement:
      'Tabella FAT esadecimale a 32 blocchi (FF = EOC). Root nel blocco 00: fileA punta a 05, dir a 0A, fileE a 18. Blocco 0A: fileB punta a 12, fileC a 16, fileD a 05. Testa della free list: 02. Disegnare l\'albero, dare contenuto di fileA e blocchi di fileC, trovare 3 errori.',
    idea:
      'Ricostruire tutte le catene (file e free list) dalla tabella e cercare condivisioni, cicli e orfani.',
    solution:
      'FAT (indice -> valore): 00->FF 01->FF 02->03 03->04 04->0F 05->01 06->07 07->08 08->FF 09->0B 0A->FF 0B->0C 0C->0D 0D->0E 0E->0F 0F->FF 10->09 11->1D 12->13 13->11 14->14 15->1B 16->17 17->15 18->19 19->1A 1A->06 1B->FF 1C->10 1D->1E 1E->1F 1F->1C. fileA da 05: 05 -> 01 -> FF, quindi fileA = {05, 01}. fileC da 16: 16 -> 17 -> 15 -> 1B -> FF, quindi 4 blocchi {16,17,15,1B}. Tre errori: 1) fileD e fileA puntano entrambi al blocco 05: cross-link. 2) Blocco 14: FAT[14]=14, auto-riferimento (ciclo infinito); nessun file vi punta e non e in free list: blocco orfano con ciclo. 3) Free list da 02: 02 -> 03 -> 04 -> 0F -> FF; ma fileB (da 12: 12 -> 13 -> 11 -> 1D -> 1E -> 1F -> 1C -> 10 -> 09 -> 0B -> 0C -> 0D -> 0E -> 0F) contiene 0F, che e anche nella free list: cross-link tra file e free list. Correzioni: duplicare 05 per fileD; rompere il ciclo del 14 (EOC o free list); togliere 0F dalla free list (o duplicarlo).',
    invariants: [
      'Ogni blocco: esattamente un proprietario (un file o la free list).',
      'Nessun ciclo nelle catene: ogni percorso termina con EOC/FF.',
    ],
    pitfalls: [
      'Leggere gli indici esadecimali come decimali (0A, 0F, 1B...).',
      'Non seguire per intero la lunga catena di fileB e perdere la condivisione di 0F.',
      'Scambiare FF (EOC) con un blocco libero.',
    ],
  },
  {
    id: 'g1-2022-07-20-fsck',
    part: 'G1',
    topic: 'File system',
    title: 'Incongruenze rilevate da fsck',
    source: '20 luglio 2022 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.07.20.tot.pdf',
    focus: false,
    reconstructed: false,
    difficulty: 2,
    statement:
      'Elencare le incongruenze rilevate da fsck su un file system tipo UNIX/ext2, come vengono scoperte e come si ripristina la coerenza.',
    idea:
      'fsck riconta tutto da zero (blocchi, link, bitmap, raggiungibilita) e riallinea i metadati alla realta trovata.',
    solution:
      'Quattro tipi classici. 1) Errato numero di blocchi del file: l\'i-node dice N blocchi ma la catena ne ha M; fsck riconta percorrendo la catena e aggiorna l\'i-node, i blocchi in eccesso tornano alla bitmap dei liberi. 2) Errato numero di link (reference count): fsck conta le directory entry che puntano all\'i-node e corregge il contatore; se troppo alto, spazio mai deallocato (perso); se troppo basso, file deallocato mentre esistono link (dangling). 3) Errori nella bitmap dei blocchi: blocco marcato libero ma usato da un file (va tolto dalla free list) o marcato occupato ma non raggiungibile (va aggiunto alla free list). 4) Problemi di connettivita: sottografi non raggiungibili dalla root (directory orfane, i-node non referenziati); fsck li collega a lost+found (col numero di i-node come nome) oppure li marca per la cancellazione.',
    invariants: [
      'Bitmap, link count e dimensioni devono corrispondere all\'uso reale.',
      'Ogni i-node allocato deve essere raggiungibile dalla root.',
    ],
    pitfalls: [
      'Dimenticare lost+found come destinazione degli orfani.',
      'Confondere le due direzioni dell\'errore di bitmap.',
    ],
  },
  {
    id: 'g1-2023-07-19-rr-look',
    part: 'G1',
    topic: 'File system',
    title: 'RR 4ms piu LOOK sul disco',
    source: '19 luglio 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.07.19.tot.pdf',
    focus: false,
    reconstructed: true,
    difficulty: 4,
    statement:
      'Monoprocessore con scheduling RR a 4ms e disco con algoritmo LOOK (ascensore), testina al cilindro 0, seek di 1 cilindro/ms, operazioni di I/O con tempi dati (da verificare sul testo ufficiale). Costruire il diagramma combinato CPU + disco.',
    idea:
      'Simulare CPU e disco in parallelo: la CPU assegna quanti RR, il disco serve le richieste in ordine LOOK e sblocca i processi.',
    solution:
      'Metodo: 1) simulare la CPU con Round Robin a quanti di 4ms tra i processi pronti; 2) quando un processo richiede I/O, inserirlo nella coda del disco (LOOK); 3) la testina si muove in una direzione servendo le richieste incontrate, con tempo di seek pari alla distanza in cilindri (1ms per cilindro); 4) il processo resta bloccato finche l\'I/O non completa (seek + ritardo rotazionale + transfer); 5) costruire il Gantt combinato di CPU e disco. Per i valori numerici vedere il PDF 2023.07.19 (da verificare sul testo ufficiale).',
    invariants: [
      'LOOK serve in ordine di cilindro nella direzione corrente, poi inverte.',
      'seek(ms) = distanza in cilindri.',
      'Un processo in I/O non e schedulabile sulla CPU.',
    ],
    pitfalls: [
      'Usare SCAN (fino a fine disco) invece di LOOK (fino all\'ultima richiesta).',
      'Dimenticare che testina e CPU avanzano in parallelo.',
    ],
  },
  {
    id: 'g1-2021-05-26-rm',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Schedulabilita con Rate Monotonic',
    source: '26 maggio 2021 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.05.26.tot.pdf',
    focus: false,
    reconstructed: true,
    difficulty: 2,
    statement:
      'Processi periodici con priorita statica preemptive secondo Rate Monotonic (valori numerici da verificare sul testo ufficiale). Dire se l\'insieme e schedulabile.',
    idea:
      'Test di Liu e Layland sull\'utilizzazione; se fallisce non e detto niente (condizione solo sufficiente) e serve lo schedule.',
    solution:
      'Usare il test di schedulabilita di Liu e Layland: somma di Ci/Ti <= n(2^(1/n) - 1). Soglie: n=2: 0.828; n=3: 0.779; n=4: 0.756. Se il test fallisce, l\'insieme puo comunque essere schedulabile (condizione sufficiente ma non necessaria): costruire lo schedule per verifica. Per i valori numerici vedere il PDF 2021.05.26 (da verificare sul testo ufficiale).',
    invariants: [
      'U = somma Ci/Ti; priorita RM = periodo piu corto.',
      'Il test e sufficiente, non necessario.',
    ],
    pitfalls: [
      'Dichiarare non schedulabile un insieme che fallisce solo il test sufficiente.',
    ],
  },
  {
    id: 'g1-2019-06-18-holt',
    part: 'G1',
    topic: 'Altro',
    title: 'Grafi di Holt in deadlock non riducibili',
    source: '18 giugno 2019 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2019.06.18.tot.pdf',
    focus: false,
    reconstructed: true,
    difficulty: 3,
    statement:
      'Costruire grafi di Holt con le proprieta richieste (deadlock, non riducibilita) (dettagli da verificare sul testo ufficiale).',
    idea:
      'Un grafo non riducibile contiene un knot: un ciclo dove ogni processo attende una risorsa trattenuta nel ciclo.',
    solution:
      'Un grafo NON riducibile ha un knot: nessun processo con soli archi entranti, quindi la riduzione non puo partire. Esempio minimale con risorse a 1 istanza: P1 attende R1, R1 assegnata a P2, P2 attende R2, R2 assegnata a P1 (ciclo di 4 nodi): ogni processo ha un arco uscente, il grafo non si riduce ed e in deadlock. Per i diagrammi completi vedere le note sui grafi di Holt (da verificare sul testo ufficiale).',
    invariants: [
      'Riduzione: si rimuove un processo i cui need sono soddisfacibili, restituendone le risorse.',
      'Knot = insieme di nodi senza uscite verso l\'esterno: non riducibile.',
    ],
    pitfalls: [
      'Confondere ciclo (necessario ma non sufficiente con istanze multiple) con knot.',
    ],
  },
];
