import { useState, useMemo } from 'react'
import { LIVERPOOL_SQUAD } from '../data/footballData'

const POSITIONS = ['All', 'GK', 'DEF', 'MID', 'FWD'];
const COMP_FILTERS = ['all', 'epl', 'ucl'];
const COMP_LABELS = { all: 'All Comps', epl: 'Premier League', ucl: 'Champions League' };

function getPositionGroup(pos) {
  if (pos === 'GK') return 'GK';
  if (['CB', 'CB/RB', 'LB', 'RB', 'RB/RWB'].includes(pos)) return 'DEF';
  if (['CM', 'DM', 'CM/DM', 'AM', 'AM/CM', 'CM/AM'].includes(pos)) return 'MID';
  return 'FWD';
}

export default function Squad() {
  const [posFilter, setPosFilter] = useState('All');
  const [compFilter, setCompFilter] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [sortBy, setSortBy] = useState('number');

  const filtered = useMemo(() => {
    let list = [...LIVERPOOL_SQUAD];
    if (posFilter !== 'All') {
      list = list.filter(p => getPositionGroup(p.position) === posFilter);
    }
    if (sortBy === 'number') list.sort((a, b) => a.number - b.number);
    if (sortBy === 'goals') list.sort((a, b) => (b.stats[compFilter]?.goals || 0) - (a.stats[compFilter]?.goals || 0));
    if (sortBy === 'apps') list.sort((a, b) => (b.stats[compFilter]?.apps || 0) - (a.stats[compFilter]?.apps || 0));
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [posFilter, compFilter, sortBy]);

  return (
    <div>
      <div className="page-header">
        <h1><span className="accent">LIVERPOOL</span> SQUAD</h1>
        <p className="subtitle">2025—26 Season · Player Stats & Info</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.2rem', alignItems: 'center' }}>
        <div className="filter-pills" style={{ marginBottom: 0 }}>
          {POSITIONS.map(p => (
            <button key={p} className={`pill ${posFilter === p ? 'active' : ''}`} onClick={() => setPosFilter(p)}>{p}</button>
          ))}
        </div>
        <span style={{ color: 'var(--border-light)' }}>|</span>
        <div className="filter-pills" style={{ marginBottom: 0 }}>
          {COMP_FILTERS.map(c => (
            <button key={c} className={`pill ${compFilter === c ? 'active' : ''}`} onClick={() => setCompFilter(c)}>{COMP_LABELS[c]}</button>
          ))}
        </div>
        <span style={{ color: 'var(--border-light)' }}>|</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            padding: '0.4rem 0.7rem',
            borderRadius: '100px',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          <option value="number">Sort: Number</option>
          <option value="goals">Sort: Goals</option>
          <option value="apps">Sort: Apps</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      <div className="squad-grid fade-in">
        {filtered.map(player => (
          <PlayerCard
            key={player.number}
            player={player}
            compFilter={compFilter}
            onClick={() => setSelectedPlayer(player)}
          />
        ))}
      </div>

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  )
}

function PlayerCard({ player: p, compFilter, onClick }) {
  const stats = p.stats[compFilter] || p.stats.all;
  const isGK = p.position === 'GK';
  const contractEnd = new Date(p.contract);
  const isExpiring = contractEnd < new Date('2027-01-01');

  return (
    <div className={`player-card ${p.injury ? 'injured' : ''}`} onClick={onClick}>
      <div className="player-top">
        <span className="player-number">{p.number}</span>
        <div className="player-info">
          <h3>{p.name}</h3>
          <div className="player-meta">
            <span>{p.flag} {p.nationality}</span>
            <span>{p.position}</span>
            <span>Age {p.age}</span>
          </div>
        </div>
      </div>

      <div className="player-stats-row">
        <div className="player-stat">
          <div className="stat-val">{stats.apps}</div>
          <div className="stat-label">Apps</div>
        </div>
        {isGK ? (
          <>
            <div className="player-stat">
              <div className="stat-val">{stats.saves}</div>
              <div className="stat-label">Saves</div>
            </div>
            <div className="player-stat">
              <div className="stat-val">{stats.cleanSheets}</div>
              <div className="stat-label">CS</div>
            </div>
          </>
        ) : (
          <>
            <div className="player-stat">
              <div className="stat-val">{stats.goals}</div>
              <div className="stat-label">Goals</div>
            </div>
            <div className="player-stat">
              <div className="stat-val">{stats.assists}</div>
              <div className="stat-label">Assists</div>
            </div>
          </>
        )}
        <div className="player-stat">
          <div className="stat-val">{stats.yellowCards}</div>
          <div className="stat-label">YC</div>
        </div>
      </div>

      <div className="player-badges">
        <span className="player-badge badge-pos">{p.position}</span>
        <span className={`player-badge badge-contract ${isExpiring ? 'expiring' : ''}`}>
          📄 {contractEnd.getFullYear()}
        </span>
        {p.injury && (
          <span className="player-badge badge-injury">🏥 {p.injury.type}</span>
        )}
      </div>
    </div>
  )
}

function PlayerDetailModal({ player: p, onClose }) {
  const [detailComp, setDetailComp] = useState('all');
  const stats = p.stats[detailComp] || p.stats.all;
  const isGK = p.position === 'GK';
  const contractEnd = new Date(p.contract);
  const isExpiring = contractEnd < new Date('2027-01-01');
  const dob = new Date(p.dob);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-close">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="player-detail-header">
          <span className="player-detail-number">{p.number}</span>
          <div className="player-detail-info">
            <h2>{p.name}</h2>
            <div className="player-detail-meta">
              <span>{p.flag} {p.nationality}</span>
              <span>•</span>
              <span>{p.position}</span>
              <span>•</span>
              <span>Age {p.age}</span>
              <span>•</span>
              <span>DOB: {dob.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="player-detail-meta" style={{ marginTop: '0.4rem' }}>
              <span>Market Value: <strong style={{ color: 'var(--green)' }}>{p.marketValue}</strong></span>
              <span>•</span>
              <span>Contract: <strong style={{ color: isExpiring ? 'var(--yellow-card)' : 'var(--text-primary)' }}>
                {contractEnd.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                {isExpiring && ' ⚠️'}
              </strong></span>
            </div>
          </div>
        </div>

        {p.injury && (
          <div style={{
            margin: '0 1.5rem 1rem',
            padding: '0.7rem 1rem',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '8px',
            fontSize: '0.82rem',
          }}>
            <span style={{ color: 'var(--red-card)', fontWeight: 600 }}>🏥 Injury: {p.injury.type}</span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
              Since {formatDate(p.injury.since)} · Expected return: {formatDate(p.injury.expectedReturn)}
            </div>
          </div>
        )}

        <div style={{ padding: '0 1.5rem 0.5rem' }}>
          <div className="filter-pills">
            {COMP_FILTERS.map(c => (
              <button key={c} className={`pill ${detailComp === c ? 'active' : ''}`} onClick={() => setDetailComp(c)}>
                {COMP_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="player-stat-grid">
          <StatCard label="Apps" value={stats.apps} />
          <StatCard label="Minutes" value={stats.minutesPlayed} />
          {isGK ? (
            <>
              <StatCard label="Saves" value={stats.saves} />
              <StatCard label="Clean Sheets" value={stats.cleanSheets} />
              <StatCard label="Goals Against" value={(stats.apps * 90 - stats.minutesPlayed) ? '—' : stats.apps > 0 ? Math.round((stats.apps * 90 - stats.minutesPlayed) >= 0 ? 0 : 0) : 0} />
            </>
          ) : (
            <>
              <StatCard label="Goals" value={stats.goals} highlight />
              <StatCard label="Assists" value={stats.assists} highlight />
              <StatCard label="G+A" value={stats.goals + stats.assists} highlight />
            </>
          )}
          <StatCard label="Yellow" value={stats.yellowCards} />
          <StatCard label="Red" value={stats.redCards} />
          {isGK && <StatCard label="CS" value={stats.cleanSheets} />}
          {!isGK && stats.cleanSheets !== null && <StatCard label="CS" value={stats.cleanSheets} />}
          {stats.apps > 0 && !isGK && (
            <StatCard
              label="Mins/Goal"
              value={stats.goals > 0 ? Math.round(stats.minutesPlayed / stats.goals) : '—'}
            />
          )}
        </div>

        {/* Per 90 stats for outfield */}
        {!isGK && stats.minutesPlayed > 0 && (
          <div className="modal-section">
            <h3>PER 90 MINUTES</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
              <Per90Card label="Goals" value={(stats.goals / stats.minutesPlayed * 90).toFixed(2)} />
              <Per90Card label="Assists" value={(stats.assists / stats.minutesPlayed * 90).toFixed(2)} />
              <Per90Card label="G+A" value={((stats.goals + stats.assists) / stats.minutesPlayed * 90).toFixed(2)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="player-stat-card">
      <div className="val" style={{ color: highlight ? 'var(--red)' : undefined }}>{value}</div>
      <div className="label">{label}</div>
    </div>
  )
}

function Per90Card({ label, value }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '0.6rem',
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold)' }}>{value}</div>
      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
