const code = (value) => String.raw`${value}`

export const exercises = [
  {
    id: 'c1-nmeet',
    part: 'C1',
    topic: 'Rendez-vous',
    title: 'Nmeet: gruppi di n e media condivisa',
    source: '21 luglio 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.07.21.tot.pdf',
    focus: true,
    difficulty: 3,
    statement:
      'nmeet(n, val) blocca il chiamante fino a quando sono presenti n chiamate con lo stesso n. Tutti i membri del gruppo restituiscono la media dei rispettivi val. Gruppi con valori di n diversi sono indipendenti.',
    idea:
      'Per ogni n mantieni quanti membri della generazione sono ancora nel monitor, la somma, il risultato e una condition. L’ultimo arrivato calcola la media e avvia una catena di signal. Con condition signal-urgent nessun nuovo gruppo con lo stesso n può mescolarsi prima che la catena sia terminata.',
    solution: code(`monitor NMeet {
    int inside[MAX_N + 1] = {0};
    double sum[MAX_N + 1] = {0};
    double result[MAX_N + 1] = {0};
    condition q[MAX_N + 1];

    double nmeet(unsigned n, double val) {
        inside[n]++;
        sum[n] += val;

        if (inside[n] < n)
            q[n].wait();
        else {
            result[n] = sum[n] / n;
            q[n].signal();
        }

        double answer = result[n];
        inside[n]--;

        if (inside[n] > 0)
            q[n].signal();
        else
            sum[n] = 0;

        return answer;
    }
}`),
    invariants: [
      '0 ≤ inside[n] ≤ n durante una generazione.',
      'La media viene scritta prima del primo signal.',
      'Finché inside[n] > 0, il prossimo membro del gruppo riceve il testimone.',
      'La somma viene azzerata soltanto dall’ultimo membro della generazione.',
    ],
    pitfalls: [
      'Azzerare somma e contatore appena arriva l’n-esimo processo.',
      'Usare una sola condition per tutti i valori di n.',
      'Ragionare con semantica Mesa: qui il corso assume signal-urgent.',
    ],
  },
  {
    id: 'c1-syncvalue',
    part: 'C1',
    topic: 'Generazioni',
    title: 'Syncvalue: cambio chiave e snapshot del gruppo',
    source: '19 luglio 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.07.19.tot.pdf',
    focus: true,
    difficulty: 3,
    statement:
      'Ogni syncvalue(key) si blocca. Una chiamata con chiave diversa dalla precedente libera tutti i processi del vecchio gruppo; ciascuno restituisce la dimensione di quel gruppo. La chiamata che cambia chiave diventa il primo membro del gruppo successivo e si blocca.',
    idea:
      'Il processo che cambia chiave fotografa waiting in released, segnala il vecchio gruppo e rimane nella coda urgente. Quando la catena ha portato waiting a zero, imposta la nuova chiave, si conta e si blocca.',
    solution: code(`monitor SyncValue {
    int currentKey;
    int waiting = 0;
    int released = 0;
    condition q;

    int syncvalue(int key) {
        if (waiting == 0)
            currentKey = key;
        else if (key != currentKey) {
            released = waiting;
            q.signal();
            // Torno qui solo dopo lo svuotamento del vecchio gruppo.
            currentKey = key;
        }

        waiting++;
        q.wait();

        int answer = released;
        waiting--;
        if (waiting > 0)
            q.signal();

        return answer;
    }
}`),
    invariants: [
      'Tutti i processi contati in waiting condividono currentKey.',
      'released resta immutato per l’intera catena di risveglio.',
      'Il nuovo chiamante incrementa waiting solo dopo lo svuotamento del gruppo precedente.',
    ],
    pitfalls: [
      'Includere il processo che cambia chiave nello snapshot del vecchio gruppo.',
      'Sovrascrivere released mentre processi precedenti devono ancora leggerlo.',
      'Fare un broadcast senza impedire l’ingresso della nuova generazione.',
    ],
  },
  {
    id: 'c1-at-least',
    part: 'C1',
    topic: 'Rendez-vous',
    title: 'At least rendez-vous',
    source: '15 settembre 2021 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.09.15.tot.pdf',
    focus: true,
    difficulty: 5,
    statement:
      'at_least(n) esprime la volontà di sincronizzarsi con un insieme di almeno n processi, chiamante incluso. Se esiste un massimo m per cui il numero di richieste con soglia ≤ m è almeno m, tutte le richieste con soglia ≤ m possono completare.',
    idea:
      'Usa un contatore e una condition per soglia. Dopo aver contato il chiamante, calcola il massimo prefisso soddisfacibile. Se il chiamante appartiene al gruppo, lo rimuovi dal contatore e segnali tutte le classi fino a m. I signal sono eseguiti in un ciclo: con signal-urgent ogni risvegliato decrementa il proprio contatore prima che il segnalatore riprenda.',
    solution: code(`monitor AtLeast {
    int waiting[MAX + 1] = {0};
    condition q[MAX + 1];

    void at_least(int n) {
        waiting[n]++;

        int prefix = 0;
        int m = 0;
        for (int k = 1; k <= MAX; k++) {
            prefix += waiting[k];
            if (prefix >= k)
                m = k;
        }

        if (n <= m) {
            // Il chiamante appartiene al gruppo ma non è sospeso.
            waiting[n]--;

            for (int k = 1; k <= m; k++)
                while (waiting[k] > 0)
                    q[k].signal();
        } else {
            q[n].wait();
            waiting[n]--;
        }
    }
}`),
    invariants: [
      'waiting[k] conta chiamate non ancora completate con richiesta k.',
      'In uno stato stabile non resta un prefisso già soddisfacibile: verrebbe liberato dalla chiamata che lo ha creato.',
      'Ogni signal a q[k] fa diminuire waiting[k] prima del signal successivo.',
    ],
    pitfalls: [
      'Calcolare il prefisso senza includere il chiamante corrente.',
      'Liberare soltanto la classe m invece di tutte le classi ≤ m.',
      'Dimenticare che n=1 deve completare immediatamente.',
    ],
  },
  {
    id: 'c1-oddblock',
    part: 'C1',
    topic: 'Classi e snapshot',
    title: 'Oddblock: liberazione dei gruppi pari',
    source: '22 luglio 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.07.22.tot.pdf',
    focus: true,
    difficulty: 3,
    statement:
      'oddstop(key) blocca sempre. evengo libera tutti i processi delle chiavi che, al momento della chiamata, hanno un numero pari e positivo di attese. Ogni processo restituisce la dimensione fotografata del proprio gruppo.',
    idea:
      'Per ogni chiave servono contatore, risultato e condition. evengo salva il contatore e dà un solo signal; i processi della chiave passano il testimone fino allo svuotamento.',
    solution: code(`monitor OddBlock {
    int waiting[MAX_KEYS] = {0};
    int snapshot[MAX_KEYS] = {0};
    condition q[MAX_KEYS];

    int oddstop(int key) {
        waiting[key]++;
        q[key].wait();

        int answer = snapshot[key];
        waiting[key]--;
        if (waiting[key] > 0)
            q[key].signal();

        return answer;
    }

    void evengo(void) {
        for (int key = 0; key < MAX_KEYS; key++) {
            if (waiting[key] > 0 && waiting[key] % 2 == 0) {
                snapshot[key] = waiting[key];
                q[key].signal();
            }
        }
    }
}`),
    invariants: [
      'snapshot[key] viene impostato prima di sbloccare il primo membro.',
      'Durante la catena non entrano nuove procedure entry, grazie alla coda urgente.',
      'Le chiavi con cardinalità dispari non vengono toccate.',
    ],
    pitfalls: [
      'Eseguire tanti signal in un for senza comprendere la semantica del monitor.',
      'Restituire waiting dopo che è già stato decrementato.',
      'Usare una condition unica e risvegliare una chiave sbagliata.',
    ],
  },
  {
    id: 'c1-colored-rw',
    part: 'C1',
    topic: 'Reader-writer',
    title: 'Reader-writer colorato — ricostruzione didattica',
    source: 'Giugno 2026 — ricostruito dalla descrizione dello studente',
    sourceUrl: null,
    reconstructed: true,
    focus: true,
    difficulty: 4,
    statement:
      'Contratto assunto: lettori dello stesso colore possono leggere insieme; lettori rossi e neri non possono sovrapporsi; uno scrittore opera in esclusione. La variante qui mostrata dà priorità agli scrittori già in attesa. Il testo ufficiale di giugno 2026 non è ancora nell’archivio, quindi dettagli diversi richiedono una modifica della politica.',
    idea:
      'Tratta rosso, nero e scrittori come tre classi. Il primo lettore stabilisce il colore attivo; i lettori dello stesso colore entrano in catena solo se non è già in attesa uno scrittore. L’ultimo lettore passa il monitor a uno scrittore o all’altro colore.',
    solution: code(`monitor ColoredRW {
    const int RED = 0, BLACK = 1;
    int activeReaders = 0;
    int activeColor = -1;
    int waitingReaders[2] = {0, 0};
    int waitingWriters = 0;
    bool writerActive = false;
    condition readers[2], writers;

    void startRead(int color) {
        if (writerActive ||
            (activeReaders > 0 && activeColor != color) ||
            waitingWriters > 0) {
            waitingReaders[color]++;
            readers[color].wait();
            waitingReaders[color]--;
        }

        if (activeReaders == 0)
            activeColor = color;
        activeReaders++;

        if (waitingWriters == 0 && waitingReaders[color] > 0)
            readers[color].signal();
    }

    void endRead(int color) {
        activeReaders--;
        if (activeReaders == 0) {
            activeColor = -1;
            if (waitingWriters > 0)
                writers.signal();
            else if (waitingReaders[1 - color] > 0)
                readers[1 - color].signal();
            else if (waitingReaders[color] > 0)
                readers[color].signal();
        }
    }

    void startWrite(void) {
        if (writerActive || activeReaders > 0) {
            waitingWriters++;
            writers.wait();
            waitingWriters--;
        }
        writerActive = true;
    }

    void endWrite(void) {
        writerActive = false;
        if (waitingWriters > 0)
            writers.signal();
        else if (waitingReaders[RED] > 0)
            readers[RED].signal();
        else if (waitingReaders[BLACK] > 0)
            readers[BLACK].signal();
    }
}`),
    invariants: [
      'writerActive implica activeReaders = 0.',
      'activeReaders > 0 implica activeColor ∈ {RED, BLACK}.',
      'Non esistono contemporaneamente lettori di colori diversi.',
    ],
    pitfalls: [
      'Questa è una soluzione a un contratto esplicito, non una trascrizione del testo di giugno 2026.',
      'La priorità stretta agli scrittori può affamare i lettori con un flusso infinito di scrittori.',
      'Per fairness completa serve una variabile di turno o una politica FIFO fra le classi.',
    ],
  },
  {
    id: 'c2-wait4',
    part: 'C2',
    topic: 'Semafori',
    title: 'Wait4: gruppi di quattro con passaggio del testimone',
    source: '18 gennaio 2023 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.01.18.tot.pdf',
    focus: false,
    difficulty: 2,
    statement:
      'I primi tre chiamanti si fermano; il quarto fa completare tutti e quattro. Il meccanismo è riutilizzabile per i gruppi successivi, usa soltanto contatori e semafori e deve impedire che un nuovo gruppo rubi i segnali.',
    idea:
      'Il quarto lascia mutex chiuso e avvia una catena su ok2go. Ogni risvegliato decrementa n e passa il testimone. L’ultimo riapre mutex, consentendo al quinto processo di entrare.',
    solution: code(`semaphore mutex = 1;
semaphore ok2go = 0;
int n = 0;

void wait4(void) {
    mutex.P();
    n++;

    if (n == 4) {
        n--;          // il quarto può già terminare
        ok2go.V();    // avvia la catena, mutex resta chiuso
    } else {
        mutex.V();
        ok2go.P();    // riceve il testimone

        n--;
        if (n > 0)
            ok2go.V();
        else
            mutex.V();
    }
}`),
    invariants: [
      'Durante la raccolta n è il numero di membri entrati.',
      'Durante il rilascio n è il numero di membri ancora da far uscire.',
      'mutex rimane chiuso per tutta la catena.',
      'ok2go non conserva segnali residui al termine del gruppo.',
    ],
    pitfalls: [
      'Il quarto non deve eseguire mutex.V().',
      'Tre V immediate seguite da mutex.V possono permettere a un nuovo processo di consumare un segnale.',
      'mutex è un semaforo binario: non richiede che P e V siano eseguite dallo stesso processo.',
    ],
  },
  {
    id: 'c2-threshlocking',
    part: 'C2',
    topic: 'Semafori',
    title: 'Threshlocking: classi di attesa e soglia',
    source: '23 giugno 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.06.23.tot.pdf',
    focus: false,
    difficulty: 4,
    statement:
      'threshlock(level) blocca se level è maggiore o uguale alla soglia corrente. chthreshold(newlevel) cambia soglia e libera tutti i processi con level minore della nuova soglia.',
    idea:
      'Usa un semaforo e un contatore per livello. chthreshold chiude il cancello mutex, imposta uno scan e consegna il testimone al primo livello diventato valido. Ogni risvegliato aggiorna il contatore e cerca il destinatario successivo. Il cancello viene riaperto soltanto quando non restano livelli validi.',
    solution: code(`// Versione con livelli interi in un intervallo finito [MIN, MAX].
semaphore mutex = 1;
semaphore gate[MAX - MIN + 1] = {0};
int waiting[MAX - MIN + 1] = {0};
int threshold = 0;
int scanLevel;

int idx(int level) { return level - MIN; }

void pass_baton(void) {
    while (scanLevel < threshold && waiting[idx(scanLevel)] == 0)
        scanLevel++;

    if (scanLevel < threshold)
        gate[idx(scanLevel)].V();
    else
        mutex.V();
}

void threshlock(int level) {
    mutex.P();

    if (level < threshold) {
        mutex.V();
        return;
    }

    waiting[idx(level)]++;
    mutex.V();
    gate[idx(level)].P();

    // Da qui possiedo il testimone: mutex è ancora chiuso.
    waiting[idx(level)]--;
    pass_baton();
}

void chthreshold(int newlevel) {
    mutex.P();
    threshold = newlevel;
    scanLevel = MIN;
    pass_baton();
}`),
    invariants: [
      'Durante una catena, nessun nuovo chiamante può superare mutex.P().',
      'Sono risvegliati soltanto livelli strettamente minori della soglia.',
      'Ogni processo risvegliato diminuisce il proprio contatore prima di passare il testimone.',
    ],
    pitfalls: [
      'Un unico semaforo di attesa può svegliare un livello non ammissibile.',
      'Liberare mutex prima di aver svuotato tutte le classi diventate valide.',
      'Per livelli non limitati serve una mappa ordinata, non un array.',
    ],
  },
  {
    id: 'c2-fifolifo',
    part: 'C2',
    topic: 'Semafori custom',
    title: 'Fifolifo: scegliere il più vecchio o il più recente',
    source: 'Giugno 2026 — ricostruito dalla descrizione dello studente',
    sourceUrl: null,
    reconstructed: true,
    focus: true,
    difficulty: 3,
    statement:
      'Contratto assunto: P si comporta come una P ordinaria; V(mode) consegna una risorsa al primo sospeso se mode=FIFO e all’ultimo sospeso se mode=LIFO. In assenza di sospesi il credito viene accumulato. L’API esatta del compito non è ancora pubblica.',
    idea:
      'Serve una deque di record di attesa. Ogni record contiene un semaforo binario privato inizializzato a zero. In questo modo la V non chiede al semaforo base di scegliere il processo: segnala direttamente il record selezionato.',
    solution: code(`class FifoLifoSemaphore {
    struct Waiter {
        semaphore privateGate = 0;
    };

    int value;
    deque<Waiter *> waiters;
    semaphore mutex = 1;

    FifoLifoSemaphore(int init) { value = init; }

    void P(void) {
        Waiter me;
        mutex.P();

        if (value > 0) {
            value--;
            mutex.V();
            return;
        }

        waiters.push_back(&me);
        mutex.V();
        me.privateGate.P();
    }

    void V(bool lifo) {
        mutex.P();

        if (waiters.empty()) {
            value++;
        } else {
            Waiter *chosen;
            if (lifo) {
                chosen = waiters.back();
                waiters.pop_back();
            } else {
                chosen = waiters.front();
                waiters.pop_front();
            }
            chosen->privateGate.V();
        }

        mutex.V();
    }
};`),
    invariants: [
      'Se waiters non è vuota, una V consegna direttamente il credito e non incrementa value.',
      'Ogni privateGate ha un unico possibile chiamante.',
      'La politica FIFO/LIFO dipende dalla deque, non dalla fairness dei semafori di base.',
    ],
    pitfalls: [
      'Una sola coda di PID non basta se poi si segnala un unico semaforo unfair condiviso.',
      'Non incrementare value e risvegliare un processo per la stessa V: conteresti il credito due volte.',
      'Questa soluzione usa una struttura dati perché la selezione arbitraria la rende necessaria.',
    ],
  },
  {
    id: 'c2-mpss',
    part: 'C2',
    topic: 'Message passing',
    title: 'MPSs: ricezione n-esima, bloccante o non bloccante',
    source: '21 luglio 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.07.21.tot.pdf',
    focus: true,
    difficulty: 4,
    statement:
      'Su un servizio asincrono, mpssrecv(sender, num) restituisce il |num|-esimo messaggio pendente del mittente. Se num è positivo attende; se è negativo restituisce NULL quando i messaggi pendenti non bastano.',
    idea:
      'Mantieni un deposito locale in ordine di ricezione. La ricezione bloccante continua a prelevare da ANY e conserva i messaggi non ancora richiesti. Per fotografare in modo non bloccante la mailbox, invia a te stesso un marker unico e ricevi fino al marker; ciò richiede la convenzione del corso per cui il marker delimita i messaggi già pendenti.',
    solution: code(`list<Packet> inbox;
long nextToken = 0;

void mpsssend(msg_t msg, pid_t destination) {
    asend(<DATA, getpid(), msg>, destination);
}

void drain_pending(void) {
    long token = ++nextToken;
    asend(<MARKER, getpid(), token>, getpid());

    while (true) {
        Packet p = arecv(ANY);
        if (p.kind == MARKER && p.sender == getpid() && p.token == token)
            break;
        inbox.push_back(p);
    }
}

msg_t mpssrecv(pid_t sender, int num) {
    int wanted = abs(num);

    if (num < 0) {
        drain_pending();
        if (count_from(inbox, sender) < wanted)
            return NULL;
    } else {
        while (count_from(inbox, sender) < wanted)
            inbox.push_back(arecv(ANY));
    }

    return remove_nth_from(inbox, sender, wanted);
}`),
    invariants: [
      'Nessun messaggio ricevuto dal processo viene perso.',
      'remove_nth_from elimina soltanto il messaggio restituito.',
      'Per ogni mittente viene preservato l’ordine FIFO.',
    ],
    pitfalls: [
      'Chiamare arecv(sender) direttamente fa perdere il controllo sui messaggi già depositati localmente.',
      'La tecnica del marker va dichiarata e motivata rispetto alle garanzie del servizio di base.',
      'Il valore assoluto di num è una posizione, non un identificatore del messaggio.',
    ],
  },
  {
    id: 'c2-async-sync',
    part: 'C2',
    topic: 'Message passing',
    title: 'Da asincrono a sincrono con ACK',
    source: 'Pattern ricorrente negli appelli',
    sourceUrl: null,
    focus: true,
    difficulty: 3,
    statement:
      'Costruire send e receive sincrone sopra primitive asincrone, senza processo server e con selezione del mittente. La send deve terminare soltanto quando il destinatario ha effettivamente ricevuto quel messaggio.',
    idea:
      'Aggiungi identificatore, mittente e tipo al pacchetto. Il ricevente invia un ACK con lo stesso id. Ogni processo conserva in un inbox locale i DATA o gli ACK arrivati mentre aspettava qualcos’altro.',
    solution: code(`list<Packet> inbox;
long sequence = 0;

void ssend(msg_t msg, pid_t dest) {
    long id = ++sequence;
    asend(<DATA, id, getpid(), msg>, dest);

    while (!remove_ack(inbox, dest, id)) {
        Packet p = arecv(ANY);
        if (p.kind == ACK && p.sender == dest && p.id == id)
            return;
        inbox.push_back(p);
    }
}

msg_t srecv(pid_t sender) {
    Packet p;

    if (!remove_first_data(inbox, sender, &p)) {
        do {
            p = arecv(ANY);
            if (p.kind != DATA || (sender != ANY && p.sender != sender)) {
                inbox.push_back(p);
                p = NONE;
            }
        } while (p == NONE);
    }

    asend(<ACK, p.id, getpid()>, p.sender);
    return p.payload;
}`),
    invariants: [
      'Ogni ACK identifica una singola spedizione.',
      'La send completa solo dopo l’esecuzione logica della receive.',
      'I pacchetti non corrispondenti sono conservati.',
    ],
    pitfalls: [
      'Usare un ACK senza id confonde due send simultanee verso lo stesso destinatario.',
      'Scartare DATA mentre si attende un ACK.',
      'Inviare l’ACK prima di aver selezionato e consumato il DATA corretto.',
    ],
  },
  {
    id: 'c2-fragmentation',
    part: 'C2',
    topic: 'Message passing',
    title: 'Messaggi arbitrari sopra pacchetti da 256 byte',
    source: '25 giugno 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.06.25.tot.pdf',
    focus: true,
    difficulty: 3,
    statement:
      'Il servizio di base invia al massimo 256 byte e conserva FIFO per mittente. Implementare messaggi asincroni di lunghezza arbitraria senza server.',
    idea:
      'Ogni frammento porta sender, messageId, indice, numero totale e payload. Il ricevente conserva frammenti incompleti e messaggi completi non ancora richiesti. Per lo stesso mittente non deve consegnare un messaggio successivo prima di uno precedente incompleto.',
    solution: code(`const int HEADER = sizeof(pid_t) + 3 * sizeof(int);
const int CHUNK = 256 - HEADER;
int nextMessageId = 0;
map<(pid_t, int), Assembly> partial;
map<pid_t, queue<msg_t>> complete;

void asend_large(msg_t msg, pid_t dest) {
    int id = ++nextMessageId;
    int total = ceil(length(msg) / CHUNK);

    for (int i = 0; i < total; i++) {
        bytes part = slice(msg, i * CHUNK, CHUNK);
        lasend(<getpid(), id, i, total, part>, dest);
    }
}

msg_t arecv_large(pid_t sender) {
    while (complete[sender].empty()) {
        Fragment f = larecv(ANY);
        partial[(f.sender, f.id)].put(f.index, f.payload, f.total);

        if (partial[(f.sender, f.id)].is_complete()) {
            msg_t m = partial[(f.sender, f.id)].join();
            complete[f.sender].push(m);
            partial.erase((f.sender, f.id));
        }
    }

    msg_t answer = complete[sender].front();
    complete[sender].pop();
    return answer;
}`),
    invariants: [
      'La coppia (sender, messageId) identifica univocamente un assemblaggio.',
      'Ogni frammento viene inserito una sola volta nella propria posizione.',
      'I messaggi completi restano in FIFO per mittente.',
    ],
    pitfalls: [
      'Usare soltanto l’indice del frammento, confondendo due messaggi contemporanei.',
      'Dimenticare che l’header riduce lo spazio disponibile per il payload.',
      'Per sender=ANY serve anche una coda globale dell’ordine di completamento o ricezione previsto dal contratto.',
    ],
  },
  {
    id: 'c2-chained',
    part: 'C2',
    topic: 'Message passing',
    title: 'Message passing sincrono concatenato',
    source: '15 settembre 2021 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.09.15.tot.pdf',
    focus: false,
    difficulty: 2,
    statement:
      'Il mittente invia un messaggio a una lista di destinatari. Si sblocca quando il primo riceve; il primo destinatario si sblocca quando il secondo riceve, e così via. Non sono ammessi server.',
    idea:
      'Il messaggio trasporta la coda rimanente. Ogni destinatario, prima di restituire, esegue una send sincrona verso il successivo: la semantica bloccante realizza automaticamente la catena.',
    solution: code(`void chained_send(msg_t msg, list<pid_t> dests) {
    if (dests.empty())
        return;

    pid_t first = dests.pop_front();
    ssend(<msg, dests>, first);
}

msg_t chained_recv(void) {
    <msg_t msg, list<pid_t> rest> = srecv(ANY);

    if (!rest.empty()) {
        pid_t next = rest.pop_front();
        ssend(<msg, rest>, next);
    }

    return msg;
}`),
    invariants: [
      'Ogni processo rimuove esattamente un destinatario dalla lista.',
      'Il blocco della send sincrona collega l’uscita del nodo i alla ricezione del nodo i+1.',
      'L’ultimo destinatario non esegue una send ulteriore.',
    ],
    pitfalls: [
      'Inviare la lista intera senza rimuovere il destinatario corrente.',
      'Usare asend: il processo precedente si sbloccherebbe troppo presto.',
      'Non gestire la lista vuota.',
    ],
  },
  {
    id: 'g1-rr-2025',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Round Robin: tre processi 4 CPU, 4 I/O, 4 CPU',
    source: '21 luglio 2025 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2025.07.21.tot.pdf',
    focus: true,
    difficulty: 3,
    statement:
      'P1, P2 e P3 iniziano insieme. Ciascuno esegue 4 ms di CPU, 4 ms sulla stessa unità FIFO e altri 4 ms di CPU. Trovare lo schedule per ogni quanto intero positivo, le scelte migliori e la durata massima.',
    idea:
      'Poiché ogni burst CPU dura 4, esistono solo i casi q=1, q=2, q=3 e q≥4. Il lavoro CPU totale è 24 ms: qualunque schedule senza CPU idle è ottimo.',
    solution: code(`q = 1:
CPU  1 2 3 1 2 3 1 2 3 1 2 3 - - 1 1 1 1 2 2 2 2 3 3 3 3
I/O  - - - - - - - - - - 1 1 1 1 2 2 2 2 3 3 3 3 - - - -
T = 26 ms

q = 2:
CPU  1 1 2 2 3 3 1 1 2 2 3 3 1 1 1 1 2 2 2 2 3 3 3 3
I/O  - - - - - - - - 1 1 1 1 2 2 2 2 3 3 3 3 - - - -
T = 24 ms

q = 3:
CPU  1 1 1 2 2 2 3 3 3 1 2 3 - - 1 1 1 1 2 2 2 2 3 3 3 3
I/O  - - - - - - - - - - 1 1 1 1 2 2 2 2 3 3 3 3 - - - -
T = 26 ms

q >= 4:
CPU  1 1 1 1 2 2 2 2 3 3 3 3 1 1 1 1 2 2 2 2 3 3 3 3
I/O  - - - - 1 1 1 1 2 2 2 2 3 3 3 3 - - - - - - - -
T = 24 ms

Scelte migliori: q = 2 oppure q >= 4.
Durata massima: 26 ms, ottenuta con q = 1 e q = 3.`),
    invariants: [
      'La coda I/O è FIFO e l’operazione non viene preemptata.',
      'Al completamento I/O il processo torna in fondo alla ready queue.',
      'Per q≥4 ogni CPU burst termina prima della scadenza del quanto.',
    ],
    pitfalls: [
      'Trattare tutti i q≥4 come casi differenti.',
      'Dimenticare i due millisecondi di CPU inattiva nei casi q=1 e q=3.',
      'Confondere il termine dell’I/O con l’esecuzione immediata sulla CPU.',
    ],
  },
  {
    id: 'g1-periodic-x8',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Processi periodici a priorità: trovare x minimo',
    source: 'Esercizio fornito dallo studente',
    sourceUrl: null,
    focus: true,
    difficulty: 3,
    statement:
      'P1 usa 1 ms CPU + 1 ms I/O2 ogni 4 ms; P2 usa 1 ms CPU + 1 ms I/O1 ogni 2 ms; P3 usa 1 ms CPU, 2 ms I/O2, 1 ms CPU, 2 ms I/O2 ogni x. CPU e I/O usano priorità statica P1>P2>P3. Gli offset iniziali sono scegliibili.',
    idea:
      'Prima applica i vincoli di utilizzazione a ogni risorsa. La CPU è quella critica: 1/4 + 1/2 + 2/x ≤ 1, quindi x≥8. L’I/O2 richiede 1/4 + 4/x ≤1, cioè x≥16/3. Poi costruisci uno schedule periodico con offset 0,1,2.',
    solution: code(`Vincolo CPU:
  Ucpu = 1/4 + 1/2 + 2/x <= 1
  3/4 + 2/x <= 1
  x >= 8

Vincolo I/O 1:
  Uio1 = 1/2 <= 1

Vincolo I/O 2:
  Uio2 = 1/4 + 4/x <= 1
  x >= 16/3

Il vincolo dominante è quindi x >= 8.

Uno schema periodico per x = 8, con offset P1=0, P2=1, P3=2:

t       0 1 2 3 4 5 6 7 | 8 9 10 11 12 13 14 15
CPU     1 2 3 2 1 2 3 2 | 1 2  3  2  1  2  3  2
I/O1    - - 2 - 2 - 2 - | 2 -  2  -  2  -  2  -
I/O2    - 1 - 3 3 1 - 3 | 3 1  -  3  3  1  -  3

Le due apparizioni CPU di P3 distano 4 ms, ma appartengono alla stessa
attivazione; le prime CPU di due attivazioni successive distano 8 ms.`),
    invariants: [
      'Ogni istanza deve completare tutti i propri burst prima della successiva riattivazione.',
      'L’utilizzazione ≤1 è necessaria su CPU e su ciascuna unità di I/O.',
      'Gli offset possono evitare collisioni, ma non possono superare un carico di risorsa >1.',
    ],
    pitfalls: [
      'Contare un solo burst CPU di P3 e concludere x=4.',
      'Confondere la distanza fra i due burst della stessa istanza con il periodo.',
      'Controllare soltanto la CPU e ignorare le unità di I/O.',
    ],
  },
  {
    id: 'g1-pages-construction',
    part: 'G1',
    topic: 'Page replacement',
    title: 'Costruire stringhe per FIFO e LRU con 4 frame e 5 pagine',
    source: 'Pattern giugno 2026 — ricostruito dalla descrizione dello studente',
    sourceUrl: null,
    reconstructed: true,
    focus: false,
    difficulty: 3,
    statement:
      'Allenamento per il tipo di esercizio segnalato a giugno 2026: costruire stringhe di riferimenti che producano un comportamento desiderato con FIFO e LRU, usando 4 frame e le pagine 1…5.',
    idea:
      'Per forzare un fault a ogni riferimento, usa un ciclo di 5 pagine con soli 4 frame. Per far divergere FIFO e LRU, riusa alcune pagine per cambiare la recenza senza cambiare l’ordine di caricamento.',
    solution: code(`A) Fault a ogni riferimento, sia con FIFO sia con LRU:
   1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,...

   Con 4 frame, quando una pagina ritorna è già stata espulsa.

B) Fare peggio con FIFO che con LRU:
   1,2,3,4,1,2,3,5,1

   Dopo 1,2,3,4,1,2,3:
   - FIFO ricorda ancora l'ordine di caricamento 1,2,3,4.
   - LRU considera 4 la pagina meno recente.

   Sul riferimento 5:
   - FIFO espelle 1.
   - LRU espelle 4.

   Sul riferimento finale 1:
   - FIFO fa fault.
   - LRU fa hit.

   Totale: FIFO 6 fault, LRU 5 fault.

Ricetta generale per differenziarli:
1. riempi i frame;
2. fai hit su tutte le pagine tranne una, modificando l'ordine LRU;
3. inserisci una pagina nuova;
4. riferisci la pagina che FIFO ha espulso ma LRU ha conservato.`),
    invariants: [
      'FIFO aggiorna l’ordine solo quando una pagina viene caricata.',
      'LRU aggiorna la recenza a ogni hit e a ogni fault.',
      'Con 5 pagine cicliche e 4 frame la distanza di riuso è 5, quindi supera la capacità.',
    ],
    pitfalls: [
      'Aggiornare la coda FIFO anche durante un hit.',
      'Confrontare solo il contenuto dei frame e non il loro ordine logico.',
      'Il testo esatto di giugno 2026 può imporre conteggi o condizioni diverse.',
    ],
  },
  {
    id: 'g1-fat-fsck',
    part: 'G1',
    topic: 'File system',
    title: 'FAT/fsck: riconoscere blocchi persi, doppi e cicli',
    source: '13 giugno 2023 e 20 luglio 2022 — pattern ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2023.06.13.tot.pdf',
    focus: true,
    difficulty: 3,
    statement:
      'Dato un insieme di directory, una FAT e una lista dei blocchi liberi, individuare tutte le incoerenze e proporre riparazioni che riportino il file system in uno stato coerente.',
    idea:
      'Costruisci tre insiemi: blocchi raggiungibili dai file, blocchi raggiungibili dalla free list e blocchi non raggiungibili. Durante la visita registra anche il predecessore per trovare condivisioni e cicli.',
    solution: code(`Procedura di controllo:

1. Per ogni entry di directory visita la catena FAT fino a EOC.
   - Se rivedi un blocco della stessa catena: ciclo.
   - Se un blocco è già proprietario di un altro file: cross-link.

2. Visita la free list.
   - Un blocco sia libero sia raggiungibile da un file è un errore grave.

3. Ogni blocco allocato ma non raggiungibile né dai file né dalla free list
   è un blocco perso.

Esempio tipico dell'appello 2023:
- blocco 4: catena ciclica non referenziata -> blocco perso;
- blocco 7: presente sia nella free list sia nel file /d/d3;
- blocchi 10 e 11: condivisione/ciclo fra /d/d1 e /d/d2.

Riparazioni possibili:
- inserire il blocco perso nella free list, se i dati non vanno recuperati;
- rimuovere 7 dalla free list;
- spezzare il cross-link copiando una catena in blocchi nuovi, troncare uno
  dei file a EOC oppure eliminare una entry, a seconda della politica di fsck.`),
    invariants: [
      'Ogni blocco dati appartiene a una sola catena di file oppure alla free list, mai a entrambe.',
      'Ogni catena termina in EOC e non contiene cicli.',
      'Ogni blocco allocato deve essere raggiungibile da una directory.',
    ],
    pitfalls: [
      'Segnalare l’errore senza indicare una riparazione coerente.',
      'Correggere un cross-link cambiando un puntatore senza preservare i dati o dichiarare il troncamento.',
      'Dimenticare che una directory è a sua volta un file e occupa blocchi.',
    ],
  },
  {
    id: 'g1-scheduling-method',
    part: 'G1',
    topic: 'Scheduling',
    title: 'Metodo universale per costruire un Gantt',
    source: 'Pattern ricorrente',
    sourceUrl: null,
    focus: true,
    difficulty: 2,
    statement:
      'Procedura riutilizzabile per Round Robin, priorità statica, sistemi multiprocessore, processi periodici e dispositivi FIFO/LOOK.',
    idea:
      'Non disegnare direttamente il risultato. Mantieni una tabella degli eventi e lo stato separato di CPU, ready queue e ciascun device. Avanza sempre al prossimo evento significativo.',
    solution: code(`Per ogni processo conserva:
  stato, burst corrente, lavoro residuo, priorità, deadline/periodo.

Per ogni risorsa conserva:
  assegnatario, coda, politica, istante di completamento.

A ogni passo:
1. trova il prossimo evento:
   - arrivo o riattivazione periodica;
   - fine burst CPU;
   - scadenza del quanto;
   - fine I/O;
   - nuova richiesta che provoca preemption;
2. porta avanti tutte le risorse fino a quell'istante;
3. applica gli eventi simultanei in un ordine dichiarato;
4. aggiorna ready queue e code I/O;
5. rischedula soltanto le risorse che ne hanno bisogno;
6. annota lo stato prima di avanzare di nuovo.

Controlli finali:
- somma delle celle CPU di ogni processo = somma dei suoi CPU burst;
- somma delle celle su ogni device = lavoro I/O assegnato;
- nessun processo usa CPU e I/O nello stesso istante;
- ogni preemption è motivata da una regola dello scheduler.`),
    invariants: [
      'Un processo è in un solo stato alla volta.',
      'Una risorsa seriale ha al massimo un assegnatario.',
      'Un burst residuo non diventa mai negativo.',
      'Il Gantt è la conseguenza del registro eventi, non il contrario.',
    ],
    pitfalls: [
      'Saltare un completamento I/O che rende ready un processo ad alta priorità.',
      'Azzerare il quanto dopo una preemption quando il testo non lo prevede.',
      'Non dichiarare come si ordinano eventi esattamente simultanei.',
    ],
  },
  {
    id: 'g1-banker-template',
    part: 'G1',
    topic: 'Banchiere',
    title: 'Banchiere multivaluta: test di stato safe',
    source: 'Pattern ricorrente G1',
    sourceUrl: null,
    focus: false,
    difficulty: 3,
    statement:
      'Dato Max, Allocated e capitale totale per più tipi di risorsa, determinare se lo stato è safe e produrre una sequenza sicura; oppure trovare il capitale minimo per una sequenza candidata.',
    idea:
      'Calcola Need=Max−Allocated e Available=Total−somma(Allocated). Cerca iterativamente un processo non ancora concluso con Need≤Available componente per componente; simulane la conclusione restituendo Allocated.',
    solution: code(`Need[i] = Max[i] - Allocated[i]
Available = Total - sum_i Allocated[i]
Finished[i] = false
safeSequence = []

repeat:
    scegli un processo i non finito con Need[i] <= Available
    se non esiste: stop

    Available = Available + Allocated[i]
    Finished[i] = true
    safeSequence.append(i)

Lo stato è safe se e solo se tutti i processi sono stati inseriti.

Per cercare il capitale minimo associato a una sequenza s:
- parti dalle risorse già allocate;
- per ogni processo s[j], aggiungi soltanto la carenza positiva necessaria
  a rendere Need[s[j]] <= Available;
- dopo la conclusione, somma ad Available le risorse restituite;
- confronta tutte le sequenze possibili o usa branch-and-bound.`),
    invariants: [
      'I confronti fra vettori sono componente per componente.',
      'Unsafe non significa necessariamente deadlock già presente.',
      'Una volta simulato come concluso, un processo restituisce soltanto Allocated, non Max.',
    ],
    pitfalls: [
      'Ordinare i processi con un unico numero: nel caso multivaluta non esiste in generale un ordinamento totale.',
      'Sommare Max anziché le risorse effettivamente allocate.',
      'Fermarsi alla prima sequenza fallita e concludere che lo stato è unsafe.',
    ],
  },
  {
    id: 'c2-wrongsem',
    part: 'C2',
    topic: 'Semafori',
    title: 'Wrongsem: correggere un semaforo unfair con il testimone',
    source: '12 luglio 2021 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2021.07.21.tot.pdf',
    focus: false,
    difficulty: 3,
    statement:
      'L’implementazione proposta può eseguire due V sul semaforo di attesa prima che il primo processo risvegliato aggiorni count. Bisogna mostrare l’interleaving errato e correggere il servizio con passaggio del testimone.',
    idea:
      'Quando una V trova un processo sospeso, non libera mutex: consegna il testimone tramite s. Il processo risvegliato non riprende mutex con una nuova P; aggiorna count e infine lo libera. Una seconda V non può osservare uno stato intermedio.',
    solution: code(`int value = 0;
int count = 0;
semaphore mutex = 1;
semaphore s = 0;

void wV(void) {
    mutex.P();

    if (count > 0) {
        s.V();          // consegna diretta; mutex resta chiuso
    } else {
        value++;
        mutex.V();
    }
}

void wP(void) {
    mutex.P();

    if (value > 0) {
        value--;
        mutex.V();
        return;
    }

    count++;
    mutex.V();
    s.P();              // riceve il testimone

    count--;
    mutex.V();
}

Interleaving che rompe la versione errata:
1. P è sospeso: value=0, count=1.
2. V1 esegue s.V() e poi mutex.V().
3. Prima che P riprenda mutex, V2 entra e vede ancora count=1.
4. V2 esegue un secondo s.V(): lo stesso credito viene contabilizzato male.`),
    invariants: [
      'value è positivo soltanto quando non ci sono processi sospesi.',
      'Una V con count>0 consegna direttamente la risorsa e non incrementa value.',
      'Fra la scelta del destinatario e count-- nessun altro processo può acquisire mutex.',
    ],
    pitfalls: [
      'Risvegliare e poi liberare mutex prima che il destinatario aggiorni count.',
      'Fare sia value++ sia s.V() per la stessa operazione V.',
      'Dopo s.P il processo possiede già il testimone: una nuova mutex.P causerebbe deadlock.',
    ],
  },
  {
    id: 'c2-sumstop',
    part: 'C2',
    topic: 'Semafori',
    title: 'Sumstop/sumgo: broadcast con somma fotografata',
    source: '6 settembre 2022 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2022.09.06.tot.pdf',
    focus: false,
    difficulty: 3,
    statement:
      'sumstop(v) blocca sempre. sumgo() libera tutti i processi attualmente sospesi e restituisce la somma algebrica dei loro v; restituisce zero se il gruppo è vuoto.',
    idea:
      'waiting è separato da sum, perché i valori possono essere zero o negativi. sumgo fotografa la somma, lascia mutex chiuso e avvia una catena. L’ultimo sumstop risvegliato azzera il gruppo e riapre il cancello.',
    solution: code(`semaphore mutex = 1;
semaphore gate = 0;
int waiting = 0;
int sum = 0;

void sumstop(int v) {
    mutex.P();
    waiting++;
    sum += v;
    mutex.V();

    gate.P();           // riceve il testimone
    waiting--;

    if (waiting > 0)
        gate.V();
    else {
        sum = 0;
        mutex.V();
    }
}

int sumgo(void) {
    mutex.P();

    if (waiting == 0) {
        mutex.V();
        return 0;
    }

    int answer = sum;
    gate.V();           // mutex resta chiuso fino all’ultimo
    return answer;
}`),
    invariants: [
      'waiting conta processi, sum aggrega valori: sono concetti distinti.',
      'Nessun nuovo sumstop entra mentre il gruppo fotografato viene svuotato.',
      'La somma viene azzerata soltanto dall’ultimo membro del gruppo.',
    ],
    pitfalls: [
      'Usare sum>0 per capire se restano processi: fallisce con zero e valori negativi.',
      'Liberare mutex dentro sumgo subito dopo gate.V().',
      'Sottrarre i valori senza un contatore e perdere il criterio di terminazione.',
    ],
  },
  {
    id: 'c2-delay-tick',
    part: 'C2',
    topic: 'Semafori',
    title: 'Delay/tick: scadenze multiple con semafori privati',
    source: '6 febbraio 2026 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2026.02.06.tot.pdf',
    focus: false,
    difficulty: 3,
    statement:
      'delay(ntick) è sempre bloccante e termina dopo esattamente ntick successive chiamate tick. Più processi possono scadere nella stessa tick.',
    idea:
      'Ogni chiamante crea un record con contatore residuo e semaforo privato. tick prende una fotografia implicita bloccando mutex, decrementa soltanto i record già presenti, rimuove gli scaduti e segnala i rispettivi gate.',
    solution: code(`struct Waiter {
    int remaining;
    semaphore gate = 0;
};

semaphore mutex = 1;
list<Waiter *> blocked;

void delay(int ntick) {
    assert(ntick > 0);
    Waiter me;
    me.remaining = ntick;

    mutex.P();
    blocked.push_back(&me);
    mutex.V();

    me.gate.P();
}

void tick(void) {
    list<Waiter *> expired;

    mutex.P();
    for (iterator it = blocked.begin(); it != blocked.end(); ) {
        Waiter *w = *it;
        w->remaining--;
        if (w->remaining == 0) {
            it = blocked.erase(it);
            expired.push_back(w);
        } else {
            ++it;
        }
    }

    for each (Waiter *w in expired)
        w->gate.V();

    mutex.V();
}`),
    invariants: [
      'remaining è il numero di tick future ancora necessarie.',
      'Un delay arrivato durante tick entra soltanto dopo la scansione e non perde un conteggio.',
      'Ogni gate privato viene segnalato una sola volta.',
    ],
    pitfalls: [
      'Decrementare anche i processi che chiamano delay durante la tick corrente.',
      'Usare un solo semaforo condiviso senza poter scegliere tutte le scadenze corrette.',
      'Modificare una lista durante l’iterazione senza un iteratore o una lista expired sicura.',
    ],
  },
  {
    id: 'c2-nas712',
    part: 'C2',
    topic: 'Semafori custom',
    title: 'Nas712: il settimo sospeso e l’ottavo liberatore',
    source: '22 luglio 2024 — testo ufficiale',
    sourceUrl: 'https://www.cs.unibo.it/~renzo/so/compiti/2024.07.22.tot.pdf',
    focus: false,
    difficulty: 4,
    statement:
      'L’astrazione si comporta come un semaforo, ma ammette al massimo sette processi sospesi. Se una P arriva quando i sospesi sono già sette, quella P non si blocca e libera tutti e sette.',
    idea:
      'La V ordinaria consegna una risorsa a un solo sospeso. L’ottava P imposta una modalità di rilascio collettivo e avvia una catena di sette segnali lasciando mutex chiuso. La stessa gate gestisce entrambi i casi grazie a toRelease.',
    solution: code(`class nas712 {
    int value;
    int waiting = 0;
    int toRelease = 0;
    semaphore mutex = 1;
    semaphore gate = 0;

    nas712(int init) { value = init; }

    void naP(void) {
        mutex.P();

        if (value > 0) {
            value--;
            mutex.V();
            return;
        }

        if (waiting == 7) {
            toRelease = 7;
            gate.V();       // l’ottava P non si blocca
            return;
        }

        waiting++;
        mutex.V();
        gate.P();           // riceve una V o il testimone collettivo

        waiting--;
        if (toRelease > 0) {
            toRelease--;
            if (toRelease > 0)
                gate.V();
            else
                mutex.V();
        } else {
            mutex.V();
        }
    }

    void naV(void) {
        mutex.P();
        if (waiting > 0)
            gate.V();       // consegna diretta, mutex resta chiuso
        else {
            value++;
            mutex.V();
        }
    }
};`),
    invariants: [
      'waiting non supera mai 7.',
      'Una naV con sospesi non incrementa value.',
      'Durante il rilascio dei sette, nuovi chiamanti restano fuori da mutex.',
    ],
    pitfalls: [
      'Contare anche l’ottava P fra i sette da risvegliare.',
      'Liberare mutex prima della fine della catena collettiva.',
      'Confondere toRelease con waiting: uno descrive la catena, l’altro i sospesi effettivi.',
    ],
  },
]

export const parts = ['Tutte', 'C1', 'C2', 'G1']

export const topics = [
  'Tutti',
  ...Array.from(new Set(exercises.map((exercise) => exercise.topic))).sort(),
]
