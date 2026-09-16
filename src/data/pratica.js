const code = (value) => String.raw`${value}`

export const praticaLinks = {
  archive: 'https://www.cs.unibo.it/~renzo/so/provapratica.shtml',
  tgz: 'https://www.cs.unibo.it/~renzo/so/provapratica.tgz',
  sciullo: 'https://www.cs.unibo.it/~luca.sciullo2/so2526/',
}

export const praticaFormat = [
  {
    n: '0',
    title: 'Permessi directory (sempre uguale)',
    points: '0 pt',
    body: 'chmod 700 ~ ; mkdir -p /public/username ; chmod 700 /public/username. Vietati system(), popen(), exec di "sh -c" (e in Python os.system/os.spawn: usare subprocess).',
  },
  {
    n: '1',
    title: 'C obbligatorio, prima di tutto il resto',
    points: '20 pt',
    body: 'Programma C con system call: quasi sempre attraversamento directory, file (open/read/write/stat), segnali (sigqueue) o pipe/fork.',
  },
  {
    n: '2',
    title: 'C, variante del n.1',
    points: '10 pt',
    body: 'Stesso tema con una modifica (confronta invece di copiare, ack, più mittenti, undo).',
  },
  {
    n: '3',
    title: 'Python o bash a scelta',
    points: '10 pt',
    body: 'Script su file system: find + pipe, stat, sha1sum, awk/sed in bash; os.walk, os.stat, subprocess, hashlib in Python.',
  },
  {
    n: '4',
    title: 'Consegna + orale',
    points: '0 pt',
    body: 'sha1sum di tutti i file, poi breve discussione: bisogna saper spiegare ogni scelta fatta nel codice.',
  },
]

export const praticaRecent = [
  {
    date: '2026.02.09',
    url: 'https://www.cs.unibo.it/~renzo/so/pratiche/2026.02.09.pdf',
    ex1: 'sigtx/sigrx: trasferire stringhe di max 8 char via sigqueue (value dei segnali). sigrx stampa il pid e attende.',
    ex2: 'Stringhe arbitrarie: iterare 8 char alla volta con ack prima dei successivi.',
  },
  {
    date: '2026.01.12',
    url: 'https://www.cs.unibo.it/~renzo/so/pratiche/2026.01.12.pdf',
    ex1: 'modifcmp: 1 arg = elenca file nel sottoalbero più recenti del file dato; 2 file = stampa il secondo se più recente; file+dir = cerca nel sottoalbero.',
  },
  {
    date: '2025.07.23',
    url: 'https://www.cs.unibo.it/~renzo/so/pratiche/2025.07.23.pdf',
    ex1: 'sha1dir: ricostruisce albero identico; i file regolari diventano file con la hash sha1 dell’originale.',
    ex2: 'sha1diff: elenca i file la cui hash non corrisponde. Ex3: dremcont cancella i duplicati di un file.',
  },
  {
    date: '2025.06.24',
    url: 'https://www.cs.unibo.it/~renzo/so/pratiche/2025.06.24.pdf',
    ex1: 'semsend/semrecv: trasferire stringa bit a bit con SIGUSR1/SIGUSR2, terminatore incluso.',
    ex2: 'semrecv multi-mittente con bit interallacciati. Ex3: prepend righe a file C/bash/python.',
  },
  {
    date: '2024.07.23',
    url: 'https://www.cs.unibo.it/~renzo/so/pratiche/2024.07.23.pdf',
    ex1: 'Sposta i file regolari in sottodir "...", sostituiscili con symlink relativi via rename() atomica.',
    ex2: 'Undo: risostituisci i symlink con i file veri, sempre con rename() atomica.',
  },
]

export const praticaTemplates = [
  {
    id: 'pr-walkdir',
    title: 'Attraversamento ricorsivo directory',
    use: 'modifcmp, sha1dir, ckfile, dremcont: quasi tutti gli ex.1 partono da qui.',
    code: code(`#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>
#include <limits.h>

static void walk(const char *dir, void (*cb)(const char *, struct stat *)) {
    DIR *d = opendir(dir);
    if (!d) { perror("opendir"); return; }
    struct dirent *e;
    char path[PATH_MAX];
    struct stat st;
    while ((e = readdir(d)) != NULL) {
        if (!strcmp(e->d_name, ".") || !strcmp(e->d_name, ".."))
            continue;
        snprintf(path, sizeof path, "%s/%s", dir, e->d_name);
        if (lstat(path, &st) < 0) { perror("lstat"); continue; }
        if (S_ISDIR(st.st_mode))
            walk(path, cb);          /* ricorsione */
        else if (S_ISREG(st.st_mode))
            cb(path, &st);           /* solo file regolari */
    }
    closedir(d);
}`),
  },
  {
    id: 'pr-fileeq',
    title: 'Confronto contenuto di due file (niente librerie hash)',
    use: 'ckfile, dremcont, sha1diff (versione senza SHA1).',
    code: code(`#include <fcntl.h>
#include <unistd.h>
#include <string.h>

/* 1 se stesso contenuto, 0 altrimenti, -1 errore */
static int same_content(const char *a, const char *b) {
    int fa = open(a, O_RDONLY), fb = open(b, O_RDONLY);
    if (fa < 0 || fb < 0) return -1;
    char ba[4096], bb[4096];
    ssize_t na, nb;
    int eq = 1;
    do {
        na = read(fa, ba, sizeof ba);
        nb = read(fb, bb, sizeof bb);
        if (na < 0 || nb < 0) { eq = -1; break; }
        if (na != nb || memcmp(ba, bb, na) != 0) { eq = 0; break; }
    } while (na > 0);
    close(fa);
    close(fb);
    return eq;
}`),
  },
  {
    id: 'pr-sigtxrx',
    title: 'Stringhe via sigqueue (max 8 char per segnale)',
    use: 'sigtx/sigrx 2026.02.09: il value porta 8 byte, memcpy dentro/fuori.',
    code: code(`/* ---- sigrx.c ---- */
#include <stdio.h>
#include <signal.h>
#include <string.h>
#include <unistd.h>

static void on_sig(int sig, siginfo_t *si, void *u) {
    (void)sig; (void)u;
    char buf[9];
    memcpy(buf, &si->si_value.sival_int, 8);  /* 8 byte dal segnale */
    buf[8] = 0;
    printf("%s\\n", buf);
    fflush(stdout);
}

int main(void) {
    printf("%d\\n", getpid());
    fflush(stdout);
    struct sigaction sa = {0};
    sa.sa_sigaction = on_sig;
    sa.sa_flags = SA_SIGINFO;   /* serve si_value: senza, niente dati */
    sigaction(SIGUSR1, &sa, NULL);
    for (;;) pause();
}

/* ---- sigtx.c: invio ---- */
#include <signal.h>
#include <string.h>
/* pid e msg da argv */
void send8(pid_t pid, const char *msg) {
    union sigval v;
    memset(&v, 0, sizeof v);
    memcpy(&v.sival_int, msg, 8);   /* max 8 char, resto azzerato */
    sigqueue(pid, SIGUSR1, v);
}
/* stringhe lunghe: ciclo a blocchi di 8 + ack (ex.2) */`),
  },
  {
    id: 'pr-symlink-atomic',
    title: 'Sostituzione atomica con symlink + rename',
    use: '2024.07.23: il file non deve mai risultare inesistente.',
    code: code(`#include <unistd.h>
#include <stdio.h>

/* sposta path in path.new e lascia symlink relativo al suo posto */
static int replace_with_symlink(const char *path) {
    char tmp[4096], link[4096];
    snprintf(tmp, sizeof tmp, "%s.new", path);
    /* 1. crea il sostituto con nome temporaneo */
    if (symlink("...", tmp) < 0) { perror("symlink"); return -1; }
    /* 2. rename atomica: tmp -> path (mai un istante senza file) */
    snprintf(link, sizeof link, "%s", path);
    if (rename(tmp, link) < 0) { perror("rename"); return -1; }
    return 0;
}
/* regola: MAI unlink+symlink (finestra senza file); SEMPRE tmp+rename */`),
  },
  {
    id: 'pr-bash',
    title: 'Bash: find, hash, prepend',
    use: 'Ex.3 quando conviene bash: duplicati, metadati, modifiche in massa.',
    code: code(`# file uguali a f in d (dremcont): confronta via sha1sum
f="$1"; d="$2"
h=$(sha1sum "$f" | cut -d' ' -f1)
find "$d" -type f -exec sha1sum {} + | grep "^$h" | cut -d' ' -f3- | while read -r p; do
    [ "$p" != "$f" ] && rm -- "$p"
done

# prepend di HEADER a tutti i .c/.sh/.py della dir corrente
for p in *.c *.sh *.py; do
    [ -f "$p" ] || continue
    { printf '%s\\n' "$HEADER"; cat -- "$p"; } > "$p.tmp" && mv -- "$p.tmp" "$p"
done

# file modificati dopo un riferimento (modifcmp in bash)
find . -type f -newer "$rif" -print`),
  },
  {
    id: 'pr-python',
    title: 'Python: walk + stat + hash',
    use: 'Ex.3 quando conviene Python: ricorsione leggibile, hashlib, subprocess.',
    code: code(`import os, hashlib, subprocess, sys

def sha1_of(path):
    h = hashlib.sha1()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()

# tutti i file sotto d con mtime maggiore di rif
rif_mtime = os.stat(sys.argv[1]).st_mtime
for root, _dirs, files in os.walk(sys.argv[2]):
    for name in files:
        p = os.path.join(root, name)
        if os.stat(p).st_mtime > rif_mtime:
            print(p)

# MAI os.system / os.spawn: solo subprocess.run([...], check=True)`),
  },
]

export const praticaTips = [
  'Ex.1 vale metà voto: fallo per primo e fallo funzionare, poi la variante.',
  'Makefile anche minimo: Davoli lo apprezza (all, clean, -Wall).',
  'Zero warning con -Wall: inizializza tutto, controlla ogni ritorno.',
  'perror() su ogni errore di system call: punti gratis in sede orale.',
  'Nell’orale spiega ogni scelta: algoritmo, strutture, perché non alternative.',
  'Internet c’è: man 2 open, man 3 opendir, man 7 signal — e questa pagina.',
]
