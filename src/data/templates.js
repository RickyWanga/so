const code = (value) => String.raw`${value}`

export const templates = [
  {
    id: 'tmpl-semaforo-binario-con-monitor',
    part: 'C1 — Monitor',
    title: 'Semaforo Binario con Monitor',
    intro: '',
    code: code(`monitor monobinario {
  int value;
  int blockedCount = 0;
  condition block;

  monobinario(int v) { value = v; }

  monoP() {
    if (value == 0) {
      ++blockedCount;
      block.wait();
      --blockedCount;   // ⚠️ OBBLIGATORIO dopo il risveglio (pattern waiting++/wait/waiting--)
    } else {
      value = 0;
    }
  }

  monoV() {
    if (value == 0 && blockedCount >= 1)
      block.signal();
    else
      value = 1;
  }
}`),
  },
  {
    id: 'tmpl-lettori-scrittori-con-monitor',
    part: 'C1 — Monitor',
    title: 'Lettori/Scrittori con Monitor',
    intro: '',
    code: code(`monitor ReadWrite {
  int readers = 0;
  int waitingWriters = 0;
  bool writing = false;
  condition ok2read, ok2write;

  procedure entry startRead() {
    if (writing || waitingWriters > 0) {
      ok2read.wait();
    }
    readers++;
    ok2read.signal();  // risveglia altri lettori in coda
  }

  procedure entry endRead() {
    readers--;
    if (readers == 0)
      ok2write.signal();
  }

  procedure entry startWrite() {
    waitingWriters++;
    if (readers > 0 || writing)
      ok2write.wait();
    waitingWriters--;
    writing = true;
  }

  procedure entry endWrite() {
    writing = false;
    if (waitingWriters > 0)
      ok2write.signal();
    else
      ok2read.signal();
  }
}`),
  },
  {
    id: 'tmpl-produttore-consumatore-storage-a-componenti',
    part: 'C1 — Monitor',
    title: 'Produttore/Consumatore (Storage a Componenti)',
    intro: '',
    code: code(`monitor storage {
  int components[16];
  (condition, int) waiting[16];  // (coda, conteggio)

  procedure entry add(int[16] c) {
    for (int i = 0; i < 16; ++i) {
      components[i] += c[i];
      repeat(waiting[i].second)  // sveglia tutti in attesa
        waiting[i].first.signal();
    }
  }

  procedure entry get(int[16] requirements) {
    for (int i = 0; i < 16; ++i) {
      if (requirements[i] > components[i]) {
        ++waiting[i].second;
        while (requirements[i] > components[i])
          waiting[i].first.wait();
        --waiting[i].second;
      }
      components[i] -= requirements[i];
    }
  }
}`),
  },
  {
    id: 'tmpl-rendez-vous-at-least-n',
    part: 'C1 — Monitor',
    title: 'Rendez-vous "at least N"',
    intro: '---',
    code: code(`monitor alrv {
  int waiting = 0;
  int target = 0;
  condition ok;

  procedure entry at_least(int n) {
    if (n <= 1) return;  // no attesa necessaria
    waiting++;
    if (waiting >= n) {
      target = n;
      repeat(n - 1) ok.signal();
      waiting -= n;
    } else {
      ok.wait();
    }
  }
}`),
  },
  {
    id: 'tmpl-semaforo-generale-da-binari-fair-fifo',
    part: 'C2 — Semafori',
    title: 'Semaforo Generale da Binari (Fair, FIFO)',
    intro: '',
    code: code(`class Semaphore {
  int value;
  int blocked = 0;
  binary_semaphore mutex(1);
  binary_semaphore sem(0);

  Semaphore(int init) { value = init; }

  void P() {
    mutex.P();
    if (value == 0) {
      blocked++;
      mutex.V();
      sem.P();       // si blocca qui
      blocked--;
    }
    value--;
    mutex.V();
  }

  void V() {
    mutex.P();
    value++;
    if (blocked > 0) {
      sem.V();       // sveglia un P in attesa
    } else {
      mutex.V();
    }
  }
}`),
  },
  {
    id: 'tmpl-semaforo-a-priorit-lifo',
    part: 'C2 — Semafori',
    title: 'Semaforo a Priorità LIFO',
    intro: '',
    code: code(`class OrderedLifoSemaphore {
  BinarySemaphore mutex(1);
  int initial, nP, nV = 0, 0, 0;
  OrderedStack<BinarySemaphore> s;

  OrderedLifoSemaphore(int init) { initial = init; }

  void PLP(int prio) {
    mutex.P();
    // ⚠️ CORRETTO: initial - (nP+1) + nV < 0  (il +1 era un errore → faceva passare P con risorse già esaurite)
    if (initial - nP - 1 + nV < 0) {
      BinarySemaphore new_sem(0);
      s.push(prio, new_sem);
      mutex.V();
      new_sem.P();
    }
    nP++;
    mutex.V();
  }

  void PLV() {
    mutex.P();
    nV++;
    if (initial - nP + nV >= 0 && !s.empty())
      s.pop().V();   // sveglia priorità max (LIFO)
    else
      mutex.V();
  }
}`),
  },
  {
    id: 'tmpl-passaggio-del-testimone-template-universale',
    part: 'C2 — Semafori',
    title: 'Passaggio del Testimone — Template Universale',
    intro: 'Regola fondamentale: chi avvia la catena **NON rilascia la mutex**. La mutex viene passata di processo in processo insieme al testimone. L\'ULTIMO risvegliato (counter == 0) fa finalmente `mutex.V()`.',
    code: code(`binary_semaphore mutex(1);
semaphore s(0);
int counter = 0;

// ===== PROCESSO CHE SI BLOCCA =====
void attendi() {
    mutex.P();
    counter++;               // mi registro tra i bloccati
    mutex.V();               // RILASCIO PRIMA di bloccarmi
    s.P();                   // QUI MI BLOCCCO
    // ===== RISVEGLIATO =====
    counter--;
    if (counter > 0)
        s.V();               // PASSO IL TESTIMONE al prossimo
    else
        mutex.V();           // ULTIMO: RILASCIO LA MUTEX
}

// ===== PROCESSO CHE SBLOCCA TUTTI =====
void sblocca() {
    mutex.P();
    // ... operazioni sui dati condivisi ...
    s.V();                   // sveglia il PRIMO
    // ⚠️ NON fare mutex.V()! La rilascerà l'ultimo risvegliato
}`),
  },
  {
    id: 'tmpl-wait4-blocchi-di-4-applicazione-del-template',
    part: 'C2 — Semafori',
    title: 'wait4 — Blocchi di 4 (applicazione del template)',
    intro: '',
    code: code(`binary_semaphore mutex(1);
semaphore ok2go(0);
int n = 0;

void wait4() {
    mutex.P();
    n++;
    if (n >= 4) {
        n--;                 // io NON sono tra i bloccati
        ok2go.V();           // sveglia il PRIMO. NON rilascio mutex!
    } else {
        mutex.V();           // rilascio prima di bloccarmi
        ok2go.P();           // mi blocco
        n--;                 // RISVEGLIATO
        if (n > 0)
            ok2go.V();       // testimone al prossimo
        else
            mutex.V();       // ultimo: libero mutex
    }
}`),
  },
  {
    id: 'tmpl-sumstop-sumgo-accumulo-e-sblocco-applicazion',
    part: 'C2 — Semafori',
    title: 'sumstop/sumgo — Accumulo e Sblocco (applicazione del template)',
    intro: '',
    code: code(`int sum = 0;
semaphore s(0);
binary_semaphore mutex(1);

void sumstop(int v) {
    mutex.P();
    sum += v;
    mutex.V();               // rilascio PRIMA di bloccarmi
    s.P();                   // BLOCCATO
    // RISVEGLIATO:
    sum -= v;                // tolgo il MIO valore dalla somma
    if (sum > 0)
        s.V();               // testimone al prossimo
    else
        mutex.V();           // ultimo: libero mutex
}

int sumgo() {
    mutex.P();
    int tot = sum;           // catturo la somma
    s.V();                   // sveglia il PRIMO. NON rilascio mutex!
    return tot;
}`),
  },
  {
    id: 'tmpl-barriera-all-out-sau',
    part: 'C2 — Semafori',
    title: 'Barriera "All Out" (SAU)',
    intro: '---',
    code: code(`binary_semaphore mutex(1);
semaphore all_out(0);
int in_section = 0, exiting = 0;

void SAU_enter() {
  mutex.P();
  in_section++;
  mutex.V();
}

void SAU_exit() {
  mutex.P();
  if (++exiting == in_section) {
    repeat(in_section - 1) all_out.V();  // sveglia tutti
    in_section = 0;
    exiting = 0;
    mutex.V();
  } else {
    mutex.V();
    all_out.P();    // aspetta gli altri
  }
}`),
  },
  {
    id: 'tmpl-asincrono-sincrono-con-ack',
    part: 'C2 — Message Passing',
    title: 'Asincrono → Sincrono (con ACK)',
    intro: '',
    code: code(`void ssend(msg_t msg, pid_t dest) {
  asend((getpid(), msg), dest);
  (_, ack) = arecv(dest);   // aspetta ACK
}

msg_t srecv(pid_t sender) {
  (pid, msg) = arecv(sender);
  asend(ACK, pid);
  return msg;
}`),
  },
  {
    id: 'tmpl-bloccante-non-bloccante-dummy-messages',
    part: 'C2 — Message Passing',
    title: 'Bloccante → Non-Bloccante (Dummy Messages)',
    intro: '',
    code: code(`bool skip = false;

T | None nbreceive(pid_t p) {
  if (!skip)
    asend((get_pid(), null), get_pid());  // dummy per sbloccare
  (pid, data) = areceive(p || get_pid());
  if (pid == get_pid() && data == null) {
    skip = false;
    return None;
  }
  skip = true;
  return data;
}`),
  },
  {
    id: 'tmpl-pssend-psreceive-message-passing-affidabile',
    part: 'C2 — Message Passing',
    title: 'pssend/psreceive (message passing affidabile)',
    intro: '',
    code: code(`void pssend(T data, pid_t p) {
  asend((get_pid(), data), p);
  (pid_t, T) response;
  while ((response = areceive(p)) && response.second != ACK)
    asend(response, get_pid());  // reindirizza messaggi non-ACK
}

T | None psreceive(pid_t p) {
  res = nbreceive(p);
  if (res != None) {
    asend(ACK, res.first);
    return res.second;
  }
  return None;
}`),
  },
  {
    id: 'tmpl-mulsend-invio-n-copie',
    part: 'C2 — Message Passing',
    title: 'mulsend — invio N copie',
    intro: '',
    code: code(`void mulsend(pid_t dest, T msg, int times) {
  for (int i = 0; i < times; ++i) {
    asend(dest, (msg, get_pid()));
    arecv(dest);  // aspetta ACK per ogni copia
  }
}

T multrecv(pid_t sender) {
  (msg, snd) = arecv(sender || ANY);
  asend(snd, ACK);
  return msg;
}`),
  },
  {
    id: 'tmpl-chained-send-invio-a-catena',
    part: 'C2 — Message Passing',
    title: 'chained_send — invio a catena',
    intro: '---',
    code: code(`void chained_send(T msg, list<pid_t> dests) {
  ssyncsend(msg, dests[0]);           // aspetta primo
  for (int i = 1; i < dests.size(); i++)
    ssyncsend(dests[i-1], dests[i]);  // ogni destinatario inoltra
}

T chained_recv(void) {
  msg = ssyncrecv(ANY);
  return msg;
}`),
  },
  {
    id: 'tmpl-template-smp-biprocessore',
    part: 'G1 — Scheduling',
    title: 'Template SMP Biprocessore',
    intro: '**Dati input tipici:**\n```\nP1: cpu 4ms, I/O 4ms, cpu 2ms\nP2: cpu 2ms, I/O 4ms, cpu 5ms\nP3: cpu 5ms, I/O 3ms, cpu 3ms\nP4: cpu 10ms, I/O 1ms\n\nI/O: 1 unità, FIFO\nPriorità: P1 > P2 > P3 > P4\n```\n\n**Metodo:**\n1. Tracciare l\'asse del tempo, due colonne CPU\n2. All\'inizio: processi ordinati per priorità sulle CPU libere\n3. Quando un processo va in I/O: libera la CPU → schedulare il prossimo ready\n4. Quando I/O completa: il processo torna ready → preemption se ha priorità > running\n5. I/O è bloccante: il processo non può continuare finché I/O non completa\n6. Context switch cost = 0 (salvo indicazione contraria)',
    code: '',
  },
  {
    id: 'tmpl-template-round-robin-multilivello',
    part: 'G1 — Scheduling',
    title: 'Template Round-Robin Multilivello',
    intro: '```\nLivello ALTO (FIFO): processi periodici H, K (ogni 6ms, 1ms CPU)\nLivello BASSO (RR, q=3ms): P e Q (normali con I/O)\n\nRegola: i processi ad alta priorità prevalgono SEMPRE\n```',
    code: '',
  },
  {
    id: 'tmpl-ed-earliest-deadline-test-di-schedulabilit',
    part: 'G1 — Scheduling',
    title: 'ED (Earliest Deadline) — Test di Schedulabilità',
    intro: 'Per processi periodici con solo CPU:\n```\nTest di Liu & Layland: U = Σ(Ci/Ti) ≤ 1\n  Ci = tempo CPU per istanza\n  Ti = periodo\n\nSe U > 1 → NON schedulabile\nSe U ≤ 1 → DA VERIFICARE costruendo lo schedule\n```\n\n---',
    code: '',
  },
];
