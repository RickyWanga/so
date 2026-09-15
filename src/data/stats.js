export const g1Stats = [
  { type: 'Rimpiazzamento', p1: 3, p2: 2, p3: 2, p4: 4, total: 11, link: ['exercises', 'G1', 'Page replacement'] },
  { type: 'Priorità statica', p1: 3, p2: 3, p3: 2, p4: 2, total: 10, link: ['exercises', 'G1', 'Scheduling'] },
  { type: 'Analisi inversa / parametrica', p1: 3, p2: 0, p3: 1, p4: 0, total: 4, link: ['exercises', 'G1', 'Tutti'] },
  { type: 'Banchiere', p1: 2, p2: 0, p3: 1, p4: 0, total: 3, link: ['exercises', 'G1', 'Banchiere'] },
  { type: 'Round Robin', p1: 1, p2: 1, p3: 0, p4: 0, total: 2, link: ['exercises', 'G1', 'Scheduling'] },
  { type: 'ED scheduler', p1: 0, p2: 1, p3: 0, p4: 0, total: 1, link: ['exercises', 'G1', 'Scheduling'] },
  { type: 'Multilivello', p1: 0, p2: 1, p3: 0, p4: 0, total: 1, link: ['exercises', 'G1', 'Scheduling'] },
  { type: 'Grafo di Holt', p1: 1, p2: 0, p3: 0, p4: 0, total: 1, link: ['exercises', 'G1', 'Tutti'] },
  { type: 'Altro / non classificato', p1: 3, p2: 2, p3: 2, p4: 0, total: 7, link: ['exercises', 'G1', 'Tutti'] },
]

export const g1Recent = [
  { type: 'Rimpiazzamento', count: 4, note: '4 appelli su 6 (67%)' },
  { type: 'Priorità statica', count: 2, note: '2 appelli su 6 (33%)' },
]

export const g2Stats = [
  { area: 'File system', y24: 3, y25: 3, y26: 2, total: 8, link: 'File system' },
  { area: 'Sicurezza', y24: 2, y25: 3, y26: 0, total: 5, link: 'Sicurezza' },
  { area: 'Memoria', y24: 2, y25: 2, y26: 0, total: 4, link: 'Memoria' },
  { area: 'Varie', y24: 0, y25: 4, y26: 0, total: 4, link: 'Architettura e Linux' },
  { area: 'I/O e DMA', y24: 2, y25: 1, y26: 0, total: 3, link: 'I/O e DMA' },
]

export const g2Top = [
  'i-node link count errato: conseguenze? (2 volte)',
  'Capability vs ACL: perché la revoca è più difficile? (2 volte)',
  'Partizionare un disco: a cosa serve? (2 volte)',
  'FAT: elementi di uguale valore — tipo nuovo (2026.02)',
  'Spinlock in SMP: perché necessari? (2 volte)',
]

export const g2New = [
  'FAT: elementi di uguale valore (feb 2026)',
  'RAID61 vs RAID16 (set 2024)',
  'LOOK vs C-LOOK (giu 2025)',
  'DMA senza interrupt (feb 2025)',
  'Compattazione: perché sospendere (lug 2025)',
]
