import React, { useState, useEffect } from 'react'
import './LibraryPanel.css'

interface LibraryPanelProps { onAdd: (type: string, content: string) => void; onClose?: () => void }

interface CeremonyItem { name: string; desc: string }
interface CeremonySection { title: string; items: CeremonyItem[] }

// (Color swatches moved to right ConfigPanel)
// Region-specific ceremony sets
// Categorised sections
const northCeremonySections: CeremonySection[] = [
  {
    title: 'Pre-Wedding Rituals',
    items: [
  { name: 'Roka / Thaka', desc: 'Formal announcement confirming the alliance between families.' },
  { name: 'Sagai / Engagement', desc: 'Engagement: exchange of rings, gifts and sweets.' },
  { name: 'Ganesh Puja', desc: 'Invocation of Lord Ganesha to remove obstacles before ceremonies begin.' },
  { name: 'Griha Shanti Puja', desc: 'House & planetary peace puja seeking blessings; common in Marwari/Baniya/Kayastha families.' },
  { name: 'Tilak Ceremony', desc: 'Bride’s family applies tilak to groom; honor ritual (UP/Bihar/Rajasthan).' },
  { name: 'Haldi', desc: 'Turmeric paste applied to bride & groom for glow; Punjabi: boliyan singing; Rajasthani: separate events.' },
  { name: 'Mehndi', desc: 'Henna applied to bride’s hands/feet; Punjabi songs; Rajasthani ghoomar dance.' },
  { name: 'Sangeet', desc: 'Musical night of dance; Punjabi: bhangra/dhol; Marwari: folk songs.' },
  { name: 'Chooda Ceremony', desc: 'Punjabi: Maternal uncle blesses and adorns bride with red & ivory bangles.' },
  { name: 'Kalire Ceremony', desc: 'Punjabi: Dangling kalire ornaments tied to bridal chooda for prosperity.' },
  { name: 'Sehra Bandi', desc: 'Groom’s sehra (floral veil) tied before the baraat sets out.' },
  { name: 'Ghodi Puja', desc: 'Worship of the mare/horse before groom mounts for the baraat.' }
    ]
  },
  {
    title: 'Wedding Day Rituals',
    items: [
  { name: 'Baraat', desc: 'Procession of groom arriving with music, dance and celebration.' },
  { name: 'Milni', desc: 'Formal greeting and garland exchange between key family members (esp. Punjabi).' },
  { name: 'Jaimala / Varmala', desc: 'Exchange of floral garlands signifying acceptance.' },
  { name: 'Kanyadaan', desc: 'Bride’s parents entrust daughter to groom; symbolic giving away.' },
  { name: 'Hast Melap / Granthi Bandhan', desc: 'Tying of garments/hands signifying sacred union.' },
  { name: 'Mangal Phera / Saat Phere', desc: 'Seven (sometimes four) sacred rounds around the fire with vows.' },
  { name: 'Sindoor & Mangalsutra', desc: 'Groom applies vermillion and ties mangalsutra marking marital status.' },
  { name: 'Aashirwad', desc: 'Elders offer blessings to the couple.' }
    ]
  },
  {
    title: 'Post-Wedding Rituals',
    items: [
  { name: 'Bidai / Vidaai', desc: 'Emotional departure of bride from her parental home.' },
  { name: 'Griha Pravesh', desc: 'Bride welcomed with aarti; gently topples rice pot entering new home.' },
  { name: 'Mooh Dikhai', desc: 'Introductions & gifts as groom’s relatives formally meet bride.' },
  { name: 'Pag Phera', desc: 'Bride visits her maternal home shortly after wedding.' },
  { name: 'Reception', desc: 'Post-wedding feast hosted (usually) by groom’s family.' }
    ]
  }
]

// South Indian ceremonies categorised
const southCeremonySections: CeremonySection[] = [
  {
    title: 'Pre-Wedding Rituals',
    items: [
      { name: 'Nichayathartham', desc: 'Formal engagement: families exchange gifts and confirm the muhurtham (auspicious time).'},
      { name: 'Pandakaal Muhurtham', desc: 'Bamboo (pandhal) pole ritual seeking divine blessings for a smooth wedding.'},
      { name: 'Sumangali Prarthanai', desc: 'Married women (sumangalis) honored & invoked to bless the bride.'},
      { name: 'Kashi Yatra', desc: 'Groom theatrically sets out for spiritual life; convinced to return & marry.'},
      { name: 'Haldi', desc: 'Turmeric / nalangu style purification applied to bride & groom.'}
    ]
  },
  {
    title: 'Wedding Day Rituals',
    items: [
      { name: 'Janavasam', desc: 'Public procession / introduction of groom on arrival at venue.'},
      { name: 'Mangalasnanam', desc: 'Sacred oil / turmeric bath taken on wedding morning for purity.'},
      { name: 'Mandap Puja', desc: 'Consecration of mandap and deities before principal rites.'},
      { name: 'Kanyaadaanam', desc: 'Bride’s father ceremonially gives her hand to the groom.'},
      { name: 'Muhurtham', desc: 'Most auspicious moment where key union rituals occur.'},
      { name: 'Mangalsutra Dharanam', desc: 'Groom ties the thali (mangalsutra) with three knots signifying union.'},
      { name: 'Kankana Dharanam', desc: 'Protective sacred thread tied to wrists of couple.'},
      { name: 'Sapthapadi', desc: 'Seven steps around the fire symbolising shared vows & life stages.'},
      { name: 'Laja Homam', desc: 'Bride offers puffed rice into fire praying for prosperity.'},
      { name: 'Talambralu', desc: 'Playful showering of turmeric rice on each other’s heads.'},
      { name: 'Oonjal', desc: 'Swing ceremony—couple seated, songs & warding off rites performed.'},
      { name: 'Arundhati Darshanam', desc: 'Couple shown Arundhati-Vashishta star idealising fidelity.'}
    ]
  },
  {
    title: 'Post-Wedding Rituals',
    items: [
      { name: 'Griha Pravesham', desc: 'Bride’s ceremonial entry into new home (aarti, rice pot).'},
      { name: 'Reception', desc: 'Celebratory feast & social gathering.'},
      { name: 'Maruveedu', desc: 'Bride visits maternal home (often with groom) after a few days.'},
      { name: 'Nagavalli Muhurtham', desc: 'Post-wedding puja invoking prosperity & household well-being.'}
    ]
  }
]

const LibraryPanel: React.FC<LibraryPanelProps> = ({ onAdd, onClose }) => {
  const [region, setRegion] = useState<'north' | 'south'>('north')
  const currentSections = region === 'north' ? northCeremonySections : southCeremonySections
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const toggle = (title: string) => setOpen(o => ({ ...o, [title]: !o[title] }))

  useEffect(() => {
    if (!onClose) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <aside className="library" aria-label="Asset library">
      <button className="panel-close" aria-label="Close library" onClick={onClose}>×</button>
      <div className="library__section" style={{ gap: 8 }}>
        <h4 style={{ marginBottom: 6 }}>Region</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setRegion('north')}
            style={{
              flex: 1,
              background: region === 'north' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: region === 'north' ? '#fff' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >North</button>
          <button
            onClick={() => setRegion('south')}
            style={{
              flex: 1,
              background: region === 'south' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: region === 'south' ? '#fff' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >South</button>
        </div>
      </div>
      <div className="library__section">
        <h4>{region === 'north' ? 'North Indian Ceremonies' : 'South Indian Ceremonies'}</h4>
        {currentSections.map(section => {
          const expanded = open[section.title] !== false // default open
          return (
            <div key={section.title} className="ceremony-section" data-expanded={expanded}>
              <button type="button" className="ceremony-section__header" onClick={() => toggle(section.title)} aria-expanded={expanded}>
                <span>{section.title}</span>
                <span className="carat" aria-hidden>{expanded ? '▾' : '▸'}</span>
              </button>
              {expanded && (
                <div className="list-buttons ceremony-buttons" role="list">
                  {section.items.map(item => (
                    <button
                      key={item.name}
                      onClick={() => onAdd('ceremony', item.name)}
                      title={item.desc}
                      aria-label={`${item.name}: ${item.desc}`}
                      role="listitem"
                    >{item.name}</button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default LibraryPanel
