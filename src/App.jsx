import { useEffect, useMemo, useState } from 'react'
import { exercises, parts, topics } from './data/exercises.js'
import { g2Areas, g2Questions } from './data/g2.js'
import { templates } from './data/templates.js'
import { g1Recent, g1Stats, g2New, g2Stats, g2Top } from './data/stats.js'
import {
  finalRanking,
  recentOfficialExams,
  reportedJune2026,
  summerPairs,
} from './data/prediction.js'
import { patternGroups } from './data/patterns.js'

const navItems = [
  ['home', 'Home'],
  ['exercises', 'Esercizi'],
  ['g2', 'G2'],
  ['template', 'Template'],
  ['stats', 'Statistiche'],
  ['simulator', 'Simulatore'],
  ['archive', 'Archivio'],
]

const officialArchiveUrl = 'https://www.cs.unibo.it/~renzo/so/compiti-so.shtml'

function normalizeHash() {
  if (typeof window === 'undefined') return { page: 'home' }
  const raw = window.location.hash.replace('#/', '').replace('#', '')
  const [page, arg1, arg2] = raw.split('/').map((s) => {
    try { return decodeURIComponent(s) } catch { return s }
  })
  if (!navItems.some(([id]) => id === page)) return { page: 'home' }
  return { page, arg1, arg2 }
}

function App() {
  const [route, setRoute] = useState(normalizeHash)
  const [menuOpen, setMenuOpen] = useState(false)
  const activePage = route.page

  useEffect(() => {
    const onHash = () => setRoute(normalizeHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function navigate(page, arg1, arg2) {
    const extra = [arg1, arg2].filter(Boolean).map((s) => encodeURIComponent(s)).join('/')
    window.location.hash = `#/${page}${extra ? `/${extra}` : ''}`
    setRoute(normalizeHash())
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')} aria-label="Vai alla home">
          <span className="brand-mark">SO</span>
          <span>
            <strong>Davoli Ripasso</strong>
            <small>C1 / C2 / G1 / G2</small>
          </span>
        </button>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          Menu
        </button>

        <nav id="main-navigation" className={menuOpen ? 'nav nav-open' : 'nav'}>
          {navItems.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={activePage === id ? 'nav-link active' : 'nav-link'}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {activePage === 'home' && <HomePage navigate={navigate} />}
        {activePage === 'exercises' && (
          <ExercisesPage
            key={`ex-${route.arg1 || ''}-${route.arg2 || ''}`}
            initialPart={route.arg1}
            initialTopic={route.arg2}
          />
        )}
        {activePage === 'g2' && <G2Page key={`g2-${route.arg1 || ''}`} initialArea={route.arg1} />}
        {activePage === 'template' && <TemplatePage navigate={navigate} />}
        {activePage === 'stats' && <StatisticsPage navigate={navigate} />}
        {activePage === 'simulator' && <SimulatorPage />}
        {activePage === 'archive' && <ArchivePage />}
      </main>

      <footer className="footer">
        <div>
          <strong>SO Davoli Ripasso</strong>
          <p>Materiale didattico non ufficiale. Le soluzioni vanno sempre verificate sul testo completo.</p>
        </div>
        <div className="footer-links">
          <a href={officialArchiveUrl} target="_blank" rel="noreferrer">Archivio ufficiale</a>
          <button type="button" onClick={() => navigate('archive')}>Fonti usate</button>
        </div>
      </footer>
    </div>
  )
}

function HomePage({ navigate }) {
  const focusExercises = exercises.filter((exercise) => exercise.focus).slice(0, 6)

  return (
    <>
      <section className="hero page-width">
        <div className="hero-copy">
          <span className="eyebrow">Scritto di Sistemi Operativi</span>
          <h1>Ripasso mirato, senza previsioni magiche.</h1>
          <p>
            Un sito per allenare i pattern che ritornano davvero: monitor, semafori,
            message passing, G1 e le domande teoriche del G2. La previsione di luglio 2026 e separata dai fatti
            ufficiali e ogni ricostruzione non pubblicata e marcata chiaramente.
          </p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => navigate('exercises')}>
              Apri gli esercizi
            </button>
            <button className="button secondary" type="button" onClick={() => navigate('g2')}>
              Vai alle domande G2
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-label">Priorita di ripasso</div>
          {finalRanking.map((row, index) => (
            <div className="priority-row" key={row.part}>
              <span className={`part-badge part-${row.part.toLowerCase()}`}>{row.part}</span>
              <div>
                <strong>{index + 1}. {row.first}</strong>
                <small>Seconda scelta: {row.second}</small>
              </div>
            </div>
          ))}
          <button className="text-link" type="button" onClick={() => navigate('template')}>
            Vedi template e checklist <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </section>

      <section className="page-width section-block">
        <SectionHeader
          eyebrow="Domande calde"
          title="G2: le risposte che escono di più"
          description="File system e sicurezza fanno metà dei punti. Studiale a flash."
          action={
            <button className="button ghost" type="button" onClick={() => navigate('g2')}>
              Tutte le domande G2
            </button>
          }
        />
        <div className="exercise-preview-grid">
          {g2Questions.filter((item) => item.hot).slice(0, 6).map((item) => (
            <article className="preview-card" key={item.id}>
              <div className="card-topline">
                <span className="topic-badge">{item.area}</span>
              </div>
              <h3>{item.question}</h3>
              <p>{item.answer.slice(0, 140)}…</p>
              <button className="text-link" type="button" onClick={() => navigate('g2')}>
                Leggi la risposta <span aria-hidden="true">-&gt;</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="page-width section-block">
        <SectionHeader
          eyebrow="Parti da qui"
          title="Sei esercizi ad alto rendimento"
          description="Coprono generazioni, risveglio selettivo, message passing e i G1 piu plausibili."
          action={
            <button className="button ghost" type="button" onClick={() => navigate('exercises')}>
              Tutti gli esercizi
            </button>
          }
        />
        <div className="exercise-preview-grid">
          {focusExercises.map((exercise) => (
            <article className="preview-card" key={exercise.id}>
              <div className="card-topline">
                <span className={`part-badge part-${exercise.part.toLowerCase()}`}>{exercise.part}</span>
                <span className="muted-label">{exercise.topic}</span>
              </div>
              <h3>{exercise.title}</h3>
              <p>{exercise.idea}</p>
              <button className="text-link" type="button" onClick={() => navigate('exercises')}>
                Apri soluzione <span aria-hidden="true">-&gt;</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="page-width section-block two-column-callout">
        <div>
          <span className="eyebrow">Metodo</span>
          <h2>Prima l invariante, poi il codice.</h2>
          <p>
            Ogni soluzione del sito separa riconoscimento, idea, invariante, codice e
            errori tipici. E il modo piu rapido per trasformare esercizi diversi in pattern noti.
          </p>
        </div>
        <div className="micro-checklist">
          {[
            'Quale stato condiviso descrive il problema?',
            'Chi si blocca, su quale condizione o semaforo?',
            'Quale evento rende vera la guardia?',
            'Chi passa il testimone o apre la fase successiva?',
            'Un nuovo arrivato puo mescolarsi al gruppo vecchio?',
          ].map((item, index) => (
            <div key={item}><span>{index + 1}</span>{item}</div>
          ))}
        </div>
      </section>
    </>
  )
}

function SummerTable() {
  return (
    <div className="table-scroll">
      <table className="evidence-table">
        <thead>
          <tr>
            <th>Anno</th>
            <th>Giugno C1</th>
            <th>Giugno C2</th>
            <th>Giugno G1</th>
            <th>Luglio C1</th>
            <th>Luglio C2</th>
            <th>Luglio G1</th>
          </tr>
        </thead>
        <tbody>
          {summerPairs.map((pair) => (
            <tr key={pair.year}>
              <td><strong>{pair.year}</strong></td>
              <td><SourceCell text={pair.june.c1} url={pair.june.url} /></td>
              <td>{pair.june.c2}</td>
              <td>{pair.june.g1}</td>
              <td><SourceCell text={pair.july.c1} url={pair.july.url} /></td>
              <td>{pair.july.c2}</td>
              <td>{pair.july.g1}</td>
            </tr>
          ))}
          <tr className="reported-row">
            <td><strong>2026</strong><small>segnalato</small></td>
            <td>{reportedJune2026.c1}</td>
            <td>{reportedJune2026.c2}</td>
            <td>{reportedJune2026.g1}</td>
            <td colSpan="3">Da prevedere: non trattato come dato ufficiale</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function SourceCell({ text, url }) {
  return (
    <a className="table-link" href={url} target="_blank" rel="noreferrer">
      {text}<span aria-hidden="true"> ↗</span>
    </a>
  )
}

function patternExamples(name) {
  const map = {
    'Generazioni e snapshot': ['exercises', 'C1', 'Generazioni'],
    'Rendez-vous esatto': ['exercises', 'C1', 'Rendez-vous'],
    'Risveglio selettivo': ['exercises', 'C1', 'Classi e snapshot'],
    'Scenario a fasi': ['exercises', 'C1', 'Tutti'],
    'Passaggio del testimone': ['exercises', 'C2', 'Semafori'],
    'Semaforo per classe': ['exercises', 'C2', 'Semafori'],
    'Semafori privati': ['exercises', 'C2', 'Semafori custom'],
    'Credito o consegna diretta': ['exercises', 'C2', 'Semafori custom'],
    'Inbox locale': ['exercises', 'C2', 'Message passing'],
    'Sincronia con ACK': ['exercises', 'C2', 'Message passing'],
    'Marker a se stessi': ['exercises', 'C2', 'Message passing'],
    'Frammentazione': ['exercises', 'C2', 'Message passing'],
    'Registro degli eventi': ['exercises', 'G1', 'Scheduling'],
    'Page replacement': ['exercises', 'G1', 'Page replacement'],
    'FAT / fsck come grafo': ['exercises', 'G1', 'File system'],
    'Banchiere vettoriale': ['exercises', 'G1', 'Banchiere'],
  }
  return map[name] || null
}

function TemplatePage({ navigate }) {
  const templateParts = ['C1 — Monitor', 'C2 — Semafori', 'C2 — Message Passing', 'G1 — Scheduling']
  const checklistSections = [
    {
      title: 'Prima di scrivere C1/C2',
      items: [
        'Elenca attori e classi di attesa.',
        'Scrivi stato condiviso e invariante.',
        'Associa ogni wait/P a chi puo sbloccarla.',
        'Decidi come separare generazioni e nuovi arrivi.',
      ],
    },
    {
      title: 'Semafori',
      items: [
        'Ogni V ha un destinatario concettuale preciso.',
        'Durante il testimone il mutex resta chiuso.',
        'L ultimo processo riapre il cancello.',
        'Nessun segnale rimane accumulato per errore.',
        'Se servono scelte precise, usa classi o semafori privati.',
      ],
    },
    {
      title: 'Monitor',
      items: [
        'Ragiona con condition signal-urgent.',
        'Aggiorna lo stato prima del signal.',
        'Congela il risultato prima di risvegliare un gruppo.',
        'Verifica che il monitor sia riutilizzabile.',
      ],
    },
    {
      title: 'Message passing',
      items: [
        'Messaggi con sender, tag e sequence quando necessario.',
        'Nessun messaggio non richiesto viene perso.',
        'ACK inviato nel momento semantico corretto.',
        'ANY e FIFO per mittente sono preservati.',
      ],
    },
    {
      title: 'G1 scheduling',
      items: [
        'Disegna CPU, ogni unita I/O e ready queue separatamente.',
        'Registra arrivi, fine burst, fine I/O, quanto e preemption.',
        'Dichiara la regola per eventi simultanei.',
        'Controlla la somma dei burst di ogni processo.',
      ],
    },
    {
      title: 'Ultimi dieci minuti',
      items: [
        'Inizializzazioni di semafori e contatori.',
        'Segni <, <=, >, >= nelle guardie.',
        'Processi che potrebbero restare bloccati.',
        'Reset della generazione precedente.',
        'Numero di page fault e vittime motivate.',
      ],
    },
  ]

  return (
    <div className="page-width page-stack">
      <SectionHeader
        eyebrow="Metodo"
        title="Riconosci, applica, verifica"
        description="Prima il pattern, poi il template di codice, infine la checklist prima di consegnare."
      />

      <div className="pattern-groups">
        {patternGroups.map((group) => (
          <section className={`pattern-group accent-${group.accent}`} key={group.id}>
            <div className="pattern-group-heading">
              <h2>{group.label}</h2>
              <span>{group.patterns.length} pattern</span>
            </div>
            <div className="pattern-grid">
              {group.patterns.map((pattern) => (
                <article className="pattern-card" key={pattern.name}>
                  <h3>{pattern.name}</h3>
                  <div className="pattern-line">
                    <span>Riconoscilo</span>
                    <p>{pattern.trigger}</p>
                  </div>
                  <div className="pattern-line">
                    <span>Ricetta</span>
                    <p>{pattern.recipe}</p>
                  </div>
                  <div className="pattern-checks">
                    {pattern.checks.map((check) => <span key={check}>{check}</span>)}
                  </div>
                  {(() => {
                    const target = patternExamples(pattern.name)
                    return target ? (
                      <button
                        className="text-link"
                        type="button"
                        onClick={() => navigate(target[0], target[1], target[2])}
                      >
                        Vedi esempi svolti <span aria-hidden="true">-&gt;</span>
                      </button>
                    ) : null
                  })()}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {templateParts.map((part) => (
        <section key={part}>
          <SectionHeader eyebrow="Template di codice" title={part} />
          <div className="exercise-list">
            {templates.filter((item) => item.part === part).map((item) => (
              <details className="exercise-card" id={item.id} key={item.id}>
                <summary>
                  <div className="exercise-summary-main">
                    <h2>{item.title}</h2>
                  </div>
                  <div className="exercise-summary-side">
                    <span className="details-label">Codice</span>
                  </div>
                </summary>
                <div className="exercise-body">
                  {item.intro && (
                    <div className="idea-box">
                      <span>Regola</span>
                      <p>{item.intro}</p>
                    </div>
                  )}
                  {item.code && <CodeBlock code={item.code} />}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}

      <SectionHeader
        eyebrow="Controllo finale"
        title="Checklist prima di consegnare"
        description="Non serve ricordare piu codice: serve intercettare gli errori che trasformano una buona idea in deadlock o starvation."
      />
      <div className="checklist-grid">
        {checklistSections.map((section) => (
          <article className="checklist-card" key={section.title}>
            <h2>{section.title}</h2>
            {section.items.map((item) => (
              <label key={item}>
                <input type="checkbox" />
                <span>{item}</span>
              </label>
            ))}
          </article>
        ))}
      </div>
      <section className="exam-order panel">
        <span className="eyebrow">Ordine consigliato</span>
        <h2>C1 solido, poi punti in G, quindi C2.</h2>
        <div className="exam-order-steps">
          <div><strong>1</strong><span>Leggi tutto e riconosci i pattern.</span></div>
          <div><strong>2</strong><span>Metti al sicuro C1, la parte piu stabile.</span></div>
          <div><strong>3</strong><span>Avvia G1 o la parte generale piu lineare.</span></div>
          <div><strong>4</strong><span>Affronta C2 con invariante e testimone espliciti.</span></div>
          <div><strong>5</strong><span>Lascia il 10-15% del tempo alla verifica.</span></div>
        </div>
      </section>
    </div>
  )
}

function ExercisesPage({ initialPart, initialTopic }) {
  const [query, setQuery] = useState('')
  const [part, setPart] = useState(
    initialPart && parts.includes(initialPart) ? initialPart : 'Tutte',
  )
  const [topic, setTopic] = useState(
    initialTopic && topics.includes(initialTopic) ? initialTopic : 'Tutti',
  )
  const [focusOnly, setFocusOnly] = useState(false)
  const [linkNotice, setLinkNotice] = useState(
    initialPart || initialTopic
      ? `Filtro da link: ${initialPart || 'Tutte'} · ${initialTopic || 'Tutti'}`
      : null,
  )

  function resetFilters() {
    setQuery('')
    setPart('Tutte')
    setTopic('Tutti')
    setFocusOnly(false)
    setLinkNotice(null)
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return exercises.filter((exercise) => {
      if (part !== 'Tutte' && exercise.part !== part) return false
      if (topic !== 'Tutti' && exercise.topic !== topic) return false
      if (focusOnly && !exercise.focus) return false
      if (!needle) return true
      const haystack = [
        exercise.title,
        exercise.topic,
        exercise.statement,
        exercise.idea,
        exercise.source,
      ].join(' ').toLowerCase()
      return haystack.includes(needle)
    })
  }, [query, part, topic, focusOnly])

  return (
    <div className="page-width page-stack">
      <SectionHeader
        eyebrow="Esercizi svolti"
        title="Soluzioni ragionate per C1, C2 e G1"
        description="Le ricostruzioni di giugno 2026 sono etichettate; gli altri esercizi rimandano al PDF ufficiale quando disponibile."
      />

      <div className="filters panel">
        <label className="search-field">
          <span>Cerca</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="es. testimone, FIFO, Gantt..."
          />
        </label>
        <label>
          <span>Parte</span>
          <select value={part} onChange={(event) => setPart(event.target.value)}>
            {parts.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Argomento</span>
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            {topics.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="toggle-label">
          <input type="checkbox" checked={focusOnly} onChange={(event) => setFocusOnly(event.target.checked)} />
          <span>Solo focus</span>
        </label>
      </div>

      <div className="result-line">
        <strong>{filtered.length}</strong> esercizi trovati
        <span>{exercises.length} totali</span>
        {linkNotice && (
          <span className="link-notice">
            {linkNotice}
            <button type="button" onClick={resetFilters}>Azzera</button>
          </span>
        )}
      </div>

      <div className="exercise-list">
        {filtered.map((exercise) => <ExerciseCard exercise={exercise} key={exercise.id} />)}
        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>Nessun esercizio con questi filtri</h3>
            <p>Riduci i filtri oppure cerca un meccanismo piu generale.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ExerciseCard({ exercise }) {
  return (
    <details className="exercise-card" id={exercise.id}>
      <summary>
        <div className="exercise-summary-main">
          <div className="card-topline">
            <span className={`part-badge part-${exercise.part.toLowerCase()}`}>{exercise.part}</span>
            <span className="topic-badge">{exercise.topic}</span>
            {exercise.focus && <span className="focus-badge">Focus</span>}
            {exercise.reconstructed && <span className="reconstructed-badge">Ricostruito</span>}
          </div>
          <h2>{exercise.title}</h2>
          <p>{exercise.statement}</p>
        </div>
        <div className="exercise-summary-side">
          <Difficulty value={exercise.difficulty} />
          <span className="details-label">Apri</span>
        </div>
      </summary>

      <div className="exercise-body">
        <div className="source-line">
          <span>Fonte: {exercise.source}</span>
          {exercise.sourceUrl && (
            <a href={exercise.sourceUrl} target="_blank" rel="noreferrer">Apri PDF ufficiale ↗</a>
          )}
        </div>

        <div className="idea-box">
          <span>Idea guida</span>
          <p>{exercise.idea}</p>
        </div>

        <CodeBlock code={exercise.solution} />

        <div className="exercise-notes-grid">
          <div>
            <h3>Invarianti / controlli</h3>
            <ul className="clean-list checks-list">
              {exercise.invariants.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3>Errori tipici</h3>
            <ul className="clean-list pitfalls-list">
              {exercise.pitfalls.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </details>
  )
}

function Difficulty({ value }) {
  return (
    <span className="difficulty" title={`Difficolta ${value} su 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <i className={index < value ? 'filled' : ''} key={index} />
      ))}
    </span>
  )
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-shell">
      <div className="code-toolbar">
        <span>Pseudocodice</span>
        <button type="button" onClick={copyCode}>{copied ? 'Copiato' : 'Copia'}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  )
}

function G2Page({ initialArea }) {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState(
    initialArea && g2Areas.includes(initialArea) ? initialArea : 'Tutte',
  )
  const [hotOnly, setHotOnly] = useState(false)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return g2Questions.filter((item) => {
      if (area !== 'Tutte' && item.area !== area) return false
      if (hotOnly && !item.hot) return false
      if (!needle) return true
      const haystack = [item.question, item.area, item.answer, item.source].join(' ').toLowerCase()
      return haystack.includes(needle)
    })
  }, [query, area, hotOnly])

  return (
    <div className="page-width page-stack">
      <SectionHeader
        eyebrow="Domande teoriche"
        title="G2: domanda e risposta in due minuti"
        description="Le domande che ritornano negli appelli, con la risposta da scrivere allo scritto. Quelle calde nel 2026 sono marcate Hot."
      />

      <div className="filters panel">
        <label className="search-field">
          <span>Cerca</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="es. salt, knot, RAID, TLB..."
          />
        </label>
        <label>
          <span>Area</span>
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {g2Areas.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="toggle-label">
          <input type="checkbox" checked={hotOnly} onChange={(event) => setHotOnly(event.target.checked)} />
          <span>Solo Hot 2026</span>
        </label>
      </div>

      <div className="result-line">
        <strong>{filtered.length}</strong> domande trovate
        <span>{g2Questions.length} totali</span>
      </div>

      <div className="exercise-list">
        {filtered.map((item) => (
          <details className="exercise-card" id={item.id} key={item.id}>
            <summary>
              <div className="exercise-summary-main">
                <div className="card-topline">
                  <span className="topic-badge">{item.area}</span>
                  {item.hot && <span className="focus-badge">Hot</span>}
                </div>
                <h2>{item.question}</h2>
              </div>
              <div className="exercise-summary-side">
                <span className="details-label">Risposta</span>
              </div>
            </summary>

            <div className="exercise-body">
              <div className="source-line">
                <span>Uscita: {item.source}</span>
              </div>

              <div className="idea-box">
                <span>Risposta</span>
                <p>{item.answer}</p>
              </div>
            </div>
          </details>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>Nessuna domanda con questi filtri</h3>
            <p>Riduci i filtri oppure cerca un meccanismo piu generale.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatisticsPage({ navigate }) {
  const maxG1 = Math.max(...g1Stats.map((row) => row.total))
  const maxG2 = Math.max(...g2Stats.map((row) => row.total))
  const bar = (value, max) => ({
    display: 'block',
    height: '8px',
    borderRadius: '4px',
    background: 'var(--accent, #4c6ef5)',
    width: `${Math.max(4, Math.round((value / max) * 100))}%`,
    marginTop: '4px',
  })

  return (
    <div className="page-width page-stack">
      <SectionHeader
        eyebrow="Statistiche dagli appelli"
        title="Cosa esce davvero"
        description="G1: 48 appelli 2017-2026. G2: 12 appelli 2024-2026, 4 domande per appello. Clicca un tipo per vedere gli esempi svolti."
      />

      <section className="panel section-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">G1 2017-2026</span>
            <h2>Tipi di esercizio per periodo</h2>
          </div>
        </div>
        <div className="table-scroll">
          <table className="evidence-table">
            <thead>
              <tr><th>Tipo</th><th>2017-19</th><th>2020-22</th><th>2023-24</th><th>2025-26</th><th>Tot</th><th></th></tr>
            </thead>
            <tbody>
              {g1Stats.map((row) => (
                <tr key={row.type}>
                  <td><strong>{row.type}</strong><span style={bar(row.total, maxG1)} /></td>
                  <td>{row.p1}</td>
                  <td>{row.p2}</td>
                  <td>{row.p3}</td>
                  <td>{row.p4}</td>
                  <td><strong>{row.total}</strong></td>
                  <td>
                    <button
                      className="text-link"
                      type="button"
                      onClick={() => navigate(row.link[0], row.link[1], row.link[2])}
                    >
                      Esempi -&gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel section-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">G1 2025-2026</span>
            <h2>Solo due tipi sopravvivono</h2>
            <p>Negli ultimi 6 appelli gli altri tipi sono spariti.</p>
          </div>
        </div>
        <ul className="clean-list">
          {g1Recent.map((row) => (
            <li key={row.type}><strong>{row.type}</strong> — {row.note}</li>
          ))}
        </ul>
      </section>

      <section className="panel section-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">G2 2024-2026</span>
            <h2>Domande per area</h2>
            <p>File system + sicurezza = 54% delle domande recenti.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table className="evidence-table">
            <thead>
              <tr><th>Area</th><th>2024</th><th>2025</th><th>2026</th><th>Tot</th><th></th></tr>
            </thead>
            <tbody>
              {g2Stats.map((row) => (
                <tr key={row.area}>
                  <td><strong>{row.area}</strong><span style={bar(row.total, maxG2)} /></td>
                  <td>{row.y24}</td>
                  <td>{row.y25}</td>
                  <td>{row.y26}</td>
                  <td><strong>{row.total}</strong></td>
                  <td>
                    <button
                      className="text-link"
                      type="button"
                      onClick={() => navigate('g2', row.link)}
                    >
                      Domande -&gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel section-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">G2 sotto osservazione</span>
            <h2>Top 5 e tipi nuovi</h2>
          </div>
        </div>
        <h3>Le più frequenti</h3>
        <ul className="clean-list">
          {g2Top.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <h3>Tipi mai visti prima del 2024</h3>
        <ul className="clean-list">
          {g2New.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </div>
  )
}

function SimulatorPage() {
  const [input, setInput] = useState('1 2 3 4 1 2 3 5 1')
  const [frameCount, setFrameCount] = useState(4)

  const references = useMemo(() => parseReferences(input), [input])
  const fifo = useMemo(() => simulatePageReplacement(references, frameCount, 'FIFO'), [references, frameCount])
  const lru = useMemo(() => simulatePageReplacement(references, frameCount, 'LRU'), [references, frameCount])

  return (
    <div className="page-width page-stack">
      <SectionHeader
        eyebrow="Laboratorio G1"
        title="Simulatore FIFO e LRU"
        description="Usalo per costruire controesempi: FIFO non cambia ordine su hit, LRU aggiorna la recenza a ogni riferimento."
      />

      <section className="simulator-controls panel">
        <label className="wide-field">
          <span>Stringa di riferimenti</span>
          <input value={input} onChange={(event) => setInput(event.target.value)} />
          <small>Numeri separati da spazi o virgole.</small>
        </label>
        <label>
          <span>Numero di frame</span>
          <input
            type="number"
            min="1"
            max="12"
            value={frameCount}
            onChange={(event) => setFrameCount(clamp(Number(event.target.value) || 1, 1, 12))}
          />
        </label>
        <div className="preset-buttons">
          <span>Preset</span>
          <button type="button" onClick={() => setInput('1 2 3 4 1 2 3 5 1')}>FIFO peggio</button>
          <button type="button" onClick={() => setInput('1 2 3 4 5 1 2 3 4 5')}>Fault ciclici</button>
          <button type="button" onClick={() => setInput('1 2 3 4 1 2 5 1 2 3 4 5')}>Belady classica</button>
        </div>
      </section>

      {references.length === 0 ? (
        <div className="empty-state"><h3>Inserisci almeno un riferimento valido</h3></div>
      ) : (
        <div className="simulation-grid">
          <SimulationResult result={fifo} />
          <SimulationResult result={lru} />
        </div>
      )}

      <section className="panel recipe-panel">
        <div>
          <span className="eyebrow">Ricetta per differenziare FIFO e LRU</span>
          <h2>Riempi, cambia la recenza, inserisci, richiama.</h2>
        </div>
        <ol>
          <li>Riempi tutti i frame.</li>
          <li>Fai hit sulle pagine che vuoi rendere recenti per LRU.</li>
          <li>Inserisci una pagina nuova: FIFO e LRU devono scegliere vittime diverse.</li>
          <li>Riferisci la pagina espulsa da FIFO ma conservata da LRU.</li>
        </ol>
      </section>
    </div>
  )
}

function SimulationResult({ result }) {
  return (
    <section className="simulation-card">
      <div className="simulation-heading">
        <div>
          <span className="eyebrow">Algoritmo</span>
          <h2>{result.algorithm}</h2>
        </div>
        <div className="fault-counter">
          <strong>{result.faults}</strong>
          <span>page fault</span>
        </div>
      </div>
      <div className="table-scroll">
        <table className="simulation-table">
          <thead>
            <tr><th>#</th><th>Ref</th><th>Frame</th><th>Esito</th><th>Vittima</th></tr>
          </thead>
          <tbody>
            {result.steps.map((step) => (
              <tr key={`${result.algorithm}-${step.index}`}>
                <td>{step.index + 1}</td>
                <td><strong>{step.page}</strong></td>
                <td>
                  <div className="frame-row">
                    {step.frames.map((frame, index) => (
                      <span className={frame === step.page ? 'current' : ''} key={index}>
                        {frame ?? '-'}
                      </span>
                    ))}
                  </div>
                </td>
                <td><span className={step.hit ? 'hit-chip' : 'fault-chip'}>{step.hit ? 'HIT' : 'FAULT'}</span></td>
                <td>{step.victim ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function parseReferences(value) {
  return value
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((item) => Number.isFinite(item))
}

function simulatePageReplacement(references, frameCount, algorithm) {
  const frames = []
  const fifoQueue = []
  const lastUsed = new Map()
  const steps = []
  let faults = 0

  references.forEach((page, index) => {
    const hit = frames.includes(page)
    let victim = null

    if (!hit) {
      faults++
      if (frames.length < frameCount) {
        frames.push(page)
        if (algorithm === 'FIFO') fifoQueue.push(page)
      } else if (algorithm === 'FIFO') {
        victim = fifoQueue.shift()
        const victimIndex = frames.indexOf(victim)
        frames[victimIndex] = page
        fifoQueue.push(page)
      } else {
        victim = frames.reduce((least, candidate) => {
          const leastTime = lastUsed.get(least) ?? -1
          const candidateTime = lastUsed.get(candidate) ?? -1
          return candidateTime < leastTime ? candidate : least
        }, frames[0])
        const victimIndex = frames.indexOf(victim)
        frames[victimIndex] = page
        lastUsed.delete(victim)
      }
    }

    if (algorithm === 'LRU') lastUsed.set(page, index)

    steps.push({
      index,
      page,
      hit,
      victim,
      frames: Array.from({ length: frameCount }, (_, slot) => frames[slot] ?? null),
    })
  })

  return { algorithm, faults, steps }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function ArchivePage() {
  return (
    <div className="page-width page-stack">
      <SectionHeader
        eyebrow="Fonti"
        title="Archivio dei compiti scritti usati nel sito"
        description="Esercizi C1/C2/G1 e domande G2, con rimandi ai PDF ufficiali quando disponibili."
        action={<a className="button primary" href={officialArchiveUrl} target="_blank" rel="noreferrer">Apri archivio ufficiale</a>}
      />

      <section className="panel section-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Ultimi compiti pubblicati</span>
            <h2>2025-2026</h2>
          </div>
        </div>
        <div className="recent-grid">
          {recentOfficialExams.map((exam) => (
            <a className="recent-card" href={exam.url} target="_blank" rel="noreferrer" key={exam.date}>
              <span>{exam.date}</span>
              <strong>{exam.c1}</strong>
              <p><b>C2:</b> {exam.c2}</p>
              <p><b>G1:</b> {exam.g1}</p>
              <small>PDF ufficiale ↗</small>
            </a>
          ))}
        </div>
      </section>

      <section className="panel section-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Serie estiva</span>
            <h2>Giugno e luglio 2017-2025</h2>
          </div>
        </div>
        <SummerTable />
      </section>

      <section className="source-cards">
        <article>
          <span className="source-type">Ufficiale</span>
          <h3>Archivio Davoli</h3>
          <p>Fonte primaria per testi, date e classificazione C1/C2/G1.</p>
          <a href={officialArchiveUrl} target="_blank" rel="noreferrer">Apri ↗</a>
        </article>
        <article>
          <span className="source-type secondary">Appunti</span>
          <h3>Export Notion allegato</h3>
          <p>Usato per confrontare pattern e svolgimenti, mai come soluzione ufficiale.</p>
        </article>
        <article>
          <span className="source-type caution">Segnalato</span>
          <h3>Giugno 2026</h3>
          <p>Contenuti ricostruiti, in attesa del PDF ufficiale.</p>
        </article>
      </section>
    </div>
  )
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  )
}

export default App
