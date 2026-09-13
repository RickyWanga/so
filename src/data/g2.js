export const g2Areas = [
  'Tutte',
  'File system',
  'Sicurezza',
  'Memoria',
  'Deadlock e risorse',
  'I/O e DMA',
  'Architettura e Linux',
]

export const g2Questions = [
  {
    id: 'g2-inode-nome',
    area: 'File system',
    question: 'Perché il nome del file NON è memorizzato nell’i-node?',
    answer:
      'Perché con gli hard link due o più nomi diversi puntano allo stesso i-node. Il nome sta nelle directory entry; l’i-node contiene attributi e puntatori ai blocchi.',
    source: '2021.07.21',
    hot: false,
  },
  {
    id: 'g2-link-count',
    area: 'File system',
    question: 'Cosa succede se il link count di un i-node è errato?',
    answer:
      'Se maggiore del reale: il file non viene mai deallocato, spazio perso. Se minore: l’i-node può essere deallocato mentre esistono ancora link validi, che diventano dangling reference con possibile corruzione.',
    source: '2017.05.29, 2025.01.15',
    hot: true,
  },
  {
    id: 'g2-hard-soft',
    area: 'File system',
    question: 'Come sono memorizzati hard link e link simbolici?',
    answer:
      'Hard link: normale directory entry che punta allo stesso numero di i-node, link count incrementato; originale e link sono indistinguibili. Link simbolico: file speciale con proprio i-node il cui contenuto è il percorso del target (se corto, dentro l’i-node stesso).',
    source: '2019.05.18, 2019.06.18',
    hot: false,
  },
  {
    id: 'g2-fat-uguali',
    area: 'File system',
    question: 'Possono esistere elementi di uguale valore nella FAT?',
    answer:
      'Normalmente no: ogni blocco appartiene a un solo file. Due entry uguali (non EOC) significano cross-link, cioè corruzione: due file condividono lo stesso blocco.',
    source: 'tipo nuovo feb 2026',
    hot: true,
  },
  {
    id: 'g2-fat-concatenata',
    area: 'File system',
    question: 'Perché FAT è più efficiente dell’allocazione concatenata con puntatori nei blocchi?',
    answer:
      'La tabella centralizzata (spesso in cache) si segue senza spostare la testina da un blocco all’altro come nelle lseek concatenate, e i blocchi dati restano interamente disponibili per i dati invece di ospitare puntatori.',
    source: '2017.06.19, 2022.06.01',
    hot: false,
  },
  {
    id: 'g2-ext2-max',
    area: 'File system',
    question: 'Come si calcola la lunghezza massima di un file in ext2?',
    answer:
      'Sommando i contributi dell’i-node: K puntatori diretti × B, più indiretto singolo (B/P × B), doppio ((B/P)² × B) e triplo ((B/P)³ × B), con B dimensione blocco e P dimensione puntatore.',
    source: '2018.05.28, 2022.06.21',
    hot: false,
  },
  {
    id: 'g2-partizioni',
    area: 'File system',
    question: 'A cosa serve partizionare un disco?',
    answer:
      'Organizzazione, sicurezza e performance: separare SO dai dati, isolare partizioni con policy diverse (/home con quote, /tmp noexec), multi-boot, swap dedicata, danni confinati in caso di corruzione.',
    source: '2018.01.22',
    hot: false,
  },
  {
    id: 'g2-fsck',
    area: 'File system',
    question: 'Come trova fsck i file inaccessibili tramite pathname?',
    answer:
      'Attraversa le directory dalla radice marcando gli i-node raggiungibili, poi confronta con la tabella degli i-node allocati. Un i-node allocato ma irraggiungibile è orfano: se coerente finisce in lost+found, altrimenti viene deallocato. Nella stessa scansione ricalcola link count e bitmap.',
    source: 'luglio 2026',
    hot: true,
  },
  {
    id: 'g2-journaling',
    area: 'File system',
    question: 'Il journaling protegge i dati? Si possono perdere informazioni?',
    answer:
      'Ripristina la coerenza ma non tutto: le transazioni in coda non confermate vanno perse e non protegge dai guasti meccanici del disco.',
    source: '2018.09.19, 2017.07.17',
    hot: false,
  },
  {
    id: 'g2-raid',
    area: 'File system',
    question: 'RAID1 o RAID5 a parità di dischi? E RAID0 quando?',
    answer:
      'Entrambi tollerano 1 guasto. RAID5 rende N−1 dischi, RAID1 il 50%: RAID5 quando conta lo spazio (almeno 3 dischi, carico in lettura), RAID1 con pochi dischi, molte letture parallele o scritture intense (niente calcolo parità). RAID0 non tollera nulla: solo performance per dati ricostruibili (cache, scratch).',
    source: '2020.01.15, 2024.06.25',
    hot: true,
  },
  {
    id: 'g2-capability',
    area: 'Sicurezza',
    question: 'Perché revocare una capability è più difficile che revocare un’ACL?',
    answer:
      'La capability è in mano al processo, non c’è un punto centrale dove rimuoverla: bisogna trovare e invalidare tutte le copie. Con le ACL i diritti stanno nell’oggetto (es. i-node), revocare è una modifica locale. Soluzione: capability indirette via tabella globale.',
    source: '2017.05.29, 2025.01.15',
    hot: true,
  },
  {
    id: 'g2-salt',
    area: 'Sicurezza',
    question: 'Da quale attacco protegge il salt? Perché è difficile da individuare?',
    answer:
      'Dagli attacchi offline a dizionario con hash precalcolati (rainbow table): ogni password ha salt casuale diverso, la tabella va ricalcolata per ogni account. È difficile da individuare perché dopo il furto degli hash l’attaccante lavora offline sulla propria macchina, senza tentativi di login osservabili. Il salt non aumenta l’entropia: servono anche KDF lente e /etc/shadow protetto.',
    source: 'giugno 2026, 2022.06.01',
    hot: true,
  },
  {
    id: 'g2-shadow',
    area: 'Sicurezza',
    question: 'Perché /etc/shadow e non /etc/passwd per gli hash?',
    answer:
      'Perché /etc/passwd è leggibile da tutti: gli hash rubati alimentano attacchi offline. /etc/shadow è leggibile solo da root.',
    source: '2018.05.28',
    hot: false,
  },
  {
    id: 'g2-nx',
    area: 'Sicurezza',
    question: 'Perché lo stack non deve essere eseguibile?',
    answer:
      'Blocca la tecnica classica del buffer overflow: sovrascrivere l’indirizzo di ritorno per saltare a shellcode iniettato sullo stack solleva eccezione se la zona è marcata dati (NX bit). Non ferma ROP/return-to-libc, ma alza molto la barriera.',
    source: '2024.06.25',
    hot: false,
  },
  {
    id: 'g2-virus-worm',
    area: 'Sicurezza',
    question: 'Differenze fra virus e worm? Difese?',
    answer:
      'Il virus si attacca a programmi esistenti e richiede esecuzione/interazione umana; il worm è autonomo e si propaga via rete sfruttando vulnerabilità. Difese comuni: patch, antivirus, minimo privilegio; per i worm anche firewall, segmentazione e servizi spenti.',
    source: '2018.06.21',
    hot: false,
  },
  {
    id: 'g2-paginazione-mv',
    area: 'Memoria',
    question: 'Perché la paginazione per implementare la memoria virtuale?',
    answer:
      'Nasce per l’allocazione ma è ideale per la MV: unità fissa e piccola da spostare disco-RAM, hardware semplice, poca frammentazione interna e quasi zero esterna, trasparente al programmatore, simula più memoria della RAM fisica.',
    source: '2022.01.17, 2022.02.14',
    hot: true,
  },
  {
    id: 'g2-tlb-miss',
    area: 'Memoria',
    question: 'TLB miss implica sempre page fault?',
    answer:
      'No. Il miss dice solo che la traduzione non è nella cache: la pagina può essere in RAM (TLB pieno, altro processo) e basta ricaricare la traduzione. Solo se la pagina non è in RAM scatta il page fault.',
    source: '2023.02.15',
    hot: false,
  },
  {
    id: 'g2-stack-belady',
    area: 'Memoria',
    question: 'Perché un algoritmo a stack non soffre l’anomalia di Belady?',
    answer:
      'Per definizione con m+1 frame tiene tutto quello che teneva con m: un fault con più frame sarebbe stato fault anche con meno. I fault non possono aumentare all’aumentare dei frame. LRU e MIN sono a stack, FIFO no.',
    source: '2019.06.18, 2023.06.13',
    hot: true,
  },
  {
    id: 'g2-second-chance',
    area: 'Memoria',
    question: 'Perché Second Chance è preferito a LRU pur non essendo a stack?',
    answer:
      'LRU vero richiede contatori con overflow e scansione, oppure stack con 6 puntatori per accesso: troppo costoso. Second Chance usa un bit di riferimento e una scansione circolare: molto più semplice da implementare.',
    source: '2017.05.29, 2025.01.15',
    hot: false,
  },
  {
    id: 'g2-trashing',
    area: 'Memoria',
    question: 'In trashing il carico CPU è alto o basso?',
    answer:
      'Basso: i processi sono bloccati sui page fault in attesa del disco e la CPU resta senza ready. Trappola: lo scheduler vede CPU bassa e carica altri processi, peggiorando tutto. Contromisura: ridurre il grado di multiprogrammazione sospendendo processi.',
    source: 'luglio 2026, 2019.05.18',
    hot: true,
  },
  {
    id: 'g2-compattazione',
    area: 'Memoria',
    question: 'Perché sospendere i processi durante la compattazione?',
    answer:
      'Perché gli indirizzi fisici cambiano mentre i dati vengono spostati: un processo in esecuzione vedrebbe memoria incoerente. Serve rilocazione dinamica.',
    source: '2025.02.11',
    hot: false,
  },
  {
    id: 'g2-banchiere',
    area: 'Deadlock e risorse',
    question: 'Quando si esegue il banchiere? E se lo stato è non-safe?',
    answer:
      'Prima di rendere definitiva un’operazione che riduce le risorse o aggiunge crediti: ammissione processi e richieste che non si soddisfano subito (assegnazione simulata + test). Se safe si conferma, se non-safe si annulla e la richiesta resta sospesa. Unsafe non è deadlock, ma non garantisce più di evitarlo.',
    source: 'giugno 2026, 2018.02.12',
    hot: true,
  },
  {
    id: 'g2-knot',
    area: 'Deadlock e risorse',
    question: 'Cos’è un knot e che c’entra col deadlock?',
    answer:
      'Insieme chiuso di nodi dove da ognuno si raggiungono tutti e soli gli altri. Con al massimo una richiesta sospesa per processo, deadlock se e solo se esiste un knot. Nel multirisorsa un ciclo da solo non basta (serve il knot).',
    source: '2015.02.14, 2018.07.17',
    hot: true,
  },
  {
    id: 'g2-spinlock',
    area: 'Deadlock e risorse',
    question: 'Perché servono gli spinlock nei kernel SMP?',
    answer:
      'Più CPU eseguono kernel insieme e condividono strutture: serve mutua esclusione. In kernel non si può sospendere il flusso, quindi per sezioni brevi l’unica opzione è l’attesa attiva con test&set: costa meno di un context switch.',
    source: '2017.05.29, 2025.01.15',
    hot: true,
  },
  {
    id: 'g2-dma-dischi',
    area: 'I/O e DMA',
    question: 'Perché DMA per i dischi e non per i terminali?',
    answer:
      'Il setup del controller ha costo fisso che si ammortizza solo su blocchi grandi (dischi). Per pochi byte (terminali) costerebbe più del trasferimento: meglio interrupt-driven o polling.',
    source: '2021.06.23',
    hot: false,
  },
  {
    id: 'g2-dma-senza-int',
    area: 'I/O e DMA',
    question: 'Può esistere interrupt-driven senza DMA? E DMA senza interrupt?',
    answer:
      'Sì a entrambi. Senza DMA la CPU copia i dati a mano nell’handler: il DMA è un’ottimizzazione, non un requisito. Senza interrupt il driver deve fare polling sullo stato, sprecando la CPU liberata dal DMA: solo embedded minimali. Con memoria virtuale serve page pinning perché il DMA usa indirizzi fisici.',
    source: '2025.02.11, 2023.01.18',
    hot: true,
  },
  {
    id: 'g2-interrupt',
    area: 'I/O e DMA',
    question: 'Perché gli interrupt hanno reso i SO più efficienti?',
    answer:
      'Perché eliminano il busy waiting sulle I/O: la CPU esegue altro mentre il dispositivo lavora e riprende solo all’interrupt di completamento.',
    source: '2019.09.13, 2022.01.17',
    hot: false,
  },
  {
    id: 'g2-fork-exec',
    area: 'Architettura e Linux',
    question: 'Perché Unix separa fork ed exec? Vantaggi?',
    answer:
      'fork duplica il processo, exec ne sostituisce il programma senza cambiare PID. La separazione lascia il “momento in mezzo” dove la shell configura redirezioni e pipe; i due meccanismi sono ortogonali (figlio senza exec, exec senza fork) e con copy-on-write la fork prima di exec non copia quasi niente.',
    source: 'luglio 2026',
    hot: true,
  },
  {
    id: 'g2-microkernel',
    area: 'Architettura e Linux',
    question: 'Microkernel: più flessibile e sicuro ma meno efficiente. Perché?',
    answer:
      'Servizi (file system, driver, rete) come processi utente: sostituibili e isolati (un crash non abbatte tutto), ma comunicano via message passing con context switch e copie, molto più costoso delle chiamate dirette del monolitico (Linux).',
    source: '2019.05.18',
    hot: false,
  },
  {
    id: 'g2-syscall',
    area: 'Architettura e Linux',
    question: 'Differenza fra funzione di libreria e system call?',
    answer:
      'La libreria (es. sprintf) resta in user mode; la system call (es. write) fa trap in kernel mode per risorse protette, con mode switch molto più costoso. Parametri via registri, ritorno in registro.',
    source: '2022.09.06',
    hot: false,
  },
  {
    id: 'g2-porting',
    area: 'Architettura e Linux',
    question: 'Passi per portare Linux su una nuova CPU (es. csirv)?',
    answer:
      'Toolchain con backend dedicato (cross-compilatore), ABI, codice architetturale in arch/csirv (bootstrap, trap, context switch, MMU, timer, SMP), bootloader e driver essenziali, libc e user space cross-compilati, avvio prima su emulatore. Il bootstrap non richiede un compilatore nativo.',
    source: 'giugno 2026, 2023.07.19',
    hot: true,
  },
  {
    id: 'g2-compilatore-c',
    area: 'Architettura e Linux',
    question: 'Perché il compilatore C è scritto in C?',
    answer:
      'Per portabilità: basta ricompilarlo su ogni architettura invece di riscriverlo in assembly. Bootstrap: la prima versione in assembly compila quella in C, poi si auto-compila.',
    source: '2022.09.06',
    hot: false,
  },
  {
    id: 'g2-srtf',
    area: 'Scheduling (teoria)',
    question: 'Perché in SRTF il residuo può diventare negativo? E lo scheduler?',
    answer:
      'Il burst è stimato (media esponenziale): se dura più del previsto, tempo eseguito meno stima va sotto zero. Un residuo negativo è minore di ogni altra stima, quindi il processo non viene più prerilasciato e continua fino a fine burst.',
    source: 'giugno 2026, 2022.07.20',
    hot: true,
  },
  {
    id: 'g2-aging',
    area: 'Scheduling (teoria)',
    question: 'Come funziona l’aging contro la starvation?',
    answer:
      'Alza gradualmente la priorità dei processi che attendono da molto: prima o poi superano gli altri e vengono eseguiti. Nessuno resta indietro per sempre come nelle priorità statiche pure.',
    source: '2018.01.22',
    hot: false,
  },
]
