import { useState } from 'react'
import { LIVERPOOL_MATCHES, UPCOMING_MATCHES } from '../data/footballData'

export default function Matches() {
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('results');
  const [selectedMatch, setSelectedMatch] = useState(null);

  const allResults = LIVERPOOL_MATCHES;
  const filteredResults = filter === 'all' ? allResults
    : filter === 'epl' ? allResults.filter(m => m.compShort === 'EPL')
    : allResults.filter(m => m.compShort === 'UCL');

  const filteredUpcoming = filter === 'all' ? UPCOMING_MATCHES
    : filter === 'epl' ? UPCOMING_MATCHES.filter(m => m.compShort === 'EPL')
    : UPCOMING_MATCHES.filter(m => m.compShort === 'UCL');

  return (
    <div>
      <div className="page-header">
        <h1><span className="accent">LIVERPOOL</span> MATCHES</h1>
        <p className="subtitle">2025—26 Season · All Competitions</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>Results</button>
        <button className={`tab-btn ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming</button>
      </div>

      <div className="filter-pills">
        <button className={`pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`pill ${filter === 'epl' ? 'active' : ''}`} onClick={() => setFilter('epl')}>Premier League</button>
        <button className={`pill ${filter === 'ucl' ? 'active' : ''}`} onClick={() => setFilter('ucl')}>Champions League</button>
      </div>

      {tab === 'results' && (
        <div className="matches-grid fade-in">
          {filteredResults.map(m => (
            <MatchCard key={m.id} match={m} onClick={() => setSelectedMatch(m)} />
          ))}
        </div>
      )}

      {tab === 'upcoming' && (
        <div className="matches-grid fade-in">
          {filteredUpcoming.map(m => (
            <UpcomingCard key={m.id} match={m} />
          ))}
        </div>
      )}

      {selectedMatch && (
        <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  )
}

function MatchCard({ match: m, onClick }) {
  const lfcGoals = m.events?.filter(e => e.type === 'goal' && e.team === 'LFC') || [];
  const lfcWin = (m.home.abbr === 'LFC' && m.home.score > m.away.score) || (m.away.abbr === 'LFC' && m.away.score > m.home.score);
  const lfcLoss = (m.home.abbr === 'LFC' && m.home.score < m.away.score) || (m.away.abbr === 'LFC' && m.away.score < m.home.score);
  const resultColor = lfcWin ? 'var(--green)' : lfcLoss ? 'var(--red)' : 'var(--text-muted)';

  return (
    <div className="match-card" onClick={onClick} style={{ borderLeft: `3px solid ${resultColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <span className={`comp-badge ${m.compShort === 'UCL' ? 'badge-ucl' : 'badge-epl'}`}>
          {m.compShort} {m.round ? `· ${m.round}` : ''}
        </span>
        {m.agg && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Agg: {m.agg}</span>}
      </div>

      <div className="match-row">
        <span className={`match-team home ${m.home.abbr === 'LFC' ? 'lfc' : ''}`}>{m.home.team}</span>
        <span className="match-score">
          {m.home.score}<span className="sep">—</span>{m.away.score}
        </span>
        <span className={`match-team away ${m.away.abbr === 'LFC' ? 'lfc' : ''}`}>{m.away.team}</span>
      </div>

      <div className="match-meta">
        <span>{formatDate(m.date)} · {m.time}</span>
        <span>{m.venue}</span>
      </div>

      {lfcGoals.length > 0 && (
        <div className="match-events-mini">
          {lfcGoals.map((e, i) => (
            <span key={i} className="event-mini">⚽ {e.player} {e.minute}'</span>
          ))}
        </div>
      )}
    </div>
  )
}

function UpcomingCard({ match: m }) {
  return (
    <div className="match-card" style={{ borderLeft: '3px solid var(--gold)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <span className={`comp-badge ${m.compShort === 'UCL' ? 'badge-ucl' : 'badge-epl'}`}>
          {m.compShort} {m.round ? `· ${m.round}` : ''}
        </span>
        <span className="comp-badge badge-upcoming">UPCOMING</span>
      </div>

      <div className="match-row">
        <span className={`match-team home ${m.home.abbr === 'LFC' ? 'lfc' : ''}`}>{m.home.team}</span>
        <span className="match-score" style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text-muted)' }}>
          vs
        </span>
        <span className={`match-team away ${m.away.abbr === 'LFC' ? 'lfc' : ''}`}>{m.away.team}</span>
      </div>

      <div className="match-meta">
        <span>{formatDate(m.date)} · {m.time}</span>
        <span>{m.venue}</span>
      </div>

      {m.probability && (
        <div style={{ marginTop: '0.6rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Win Probability</div>
          <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', gap: '2px' }}>
            <div style={{ width: `${m.probability.home}%`, background: m.home.abbr === 'LFC' ? 'var(--red)' : 'var(--text-muted)', borderRadius: '3px' }}></div>
            <div style={{ width: `${m.probability.draw}%`, background: 'var(--border-light)', borderRadius: '3px' }}></div>
            <div style={{ width: `${m.probability.away}%`, background: m.away.abbr === 'LFC' ? 'var(--red)' : 'var(--text-muted)', borderRadius: '3px' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            <span>{m.home.abbr} {m.probability.home}%</span>
            <span>Draw {m.probability.draw}%</span>
            <span>{m.away.abbr} {m.probability.away}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

function MatchDetailModal({ match: m, onClose }) {
  const goals = m.events?.filter(e => e.type === 'goal') || [];
  const cards = m.events?.filter(e => e.type === 'yellow' || e.type === 'red') || [];
  const allEvents = [...(m.events || [])].sort((a, b) => a.minute - b.minute);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-close">
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-header">
          <span className={`comp-badge ${m.compShort === 'UCL' ? 'badge-ucl' : 'badge-epl'}`}>
            {m.competition} {m.round ? `· ${m.round}` : ''}
          </span>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            {formatDate(m.date)} · {m.venue}
          </div>

          <div className="modal-score-row">
            <span className={`modal-team-name home ${m.home.abbr === 'LFC' ? 'text-red' : ''}`}>{m.home.team}</span>
            <span className="modal-big-score">
              {m.home.score}<span className="sep">—</span>{m.away.score}
            </span>
            <span className={`modal-team-name away ${m.away.abbr === 'LFC' ? 'text-red' : ''}`}>{m.away.team}</span>
          </div>
          {m.agg && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Aggregate: {m.agg}</div>}
        </div>

        {/* Events */}
        {allEvents.length > 0 && (
          <div className="modal-section">
            <h3>MATCH EVENTS</h3>
            <div className="event-list">
              {allEvents.map((e, i) => (
                <div key={i} className="event-item">
                  <span className="event-minute">{e.minute}'</span>
                  <span className="event-icon">
                    {e.type === 'goal' ? '⚽' : e.type === 'yellow' ? '🟨' : '🟥'}
                  </span>
                  <span className="event-player">{e.player}</span>
                  {e.assist && <span className="event-assist">(assist: {e.assist})</span>}
                  <span className="event-team-tag">{e.team}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lineups */}
        {m.lineup && (
          <div className="modal-section">
            <h3>STARTING LINEUPS</h3>
            <div className="lineup-cols">
              <LineupCol side="home" data={m.lineup.home} name={m.home.team} isLfc={m.home.abbr === 'LFC'} />
              <LineupCol side="away" data={m.lineup.away} name={m.away.team} isLfc={m.away.abbr === 'LFC'} />
            </div>
          </div>
        )}

        {/* Substitutions */}
        {m.lineup && (
          <div className="modal-section">
            <h3>SUBSTITUTIONS</h3>
            <div className="lineup-cols">
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', color: m.home.abbr === 'LFC' ? 'var(--red)' : 'var(--text-primary)' }}>
                  {m.home.team}
                </h4>
                {(m.lineup.home.subs || []).map((s, i) => (
                  <div key={i} className="sub-item">
                    <span className="sub-minute">{s.minute}'</span>
                    <span className="sub-in">▲ {s.playerIn}</span>
                    <span className="sub-out">▼ {s.playerOut}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', color: m.away.abbr === 'LFC' ? 'var(--red)' : 'var(--text-primary)' }}>
                  {m.away.team}
                </h4>
                {(m.lineup.away.subs || []).map((s, i) => (
                  <div key={i} className="sub-item">
                    <span className="sub-minute">{s.minute}'</span>
                    <span className="sub-in">▲ {s.playerIn}</span>
                    <span className="sub-out">▼ {s.playerOut}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bench */}
        {m.lineup && (
          <div className="modal-section">
            <h3>BENCH</h3>
            <div className="lineup-cols">
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>{m.home.team}</h4>
                <ul className="lineup-list">
                  {m.lineup.home.bench?.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>{m.away.team}</h4>
                <ul className="lineup-list">
                  {m.lineup.away.bench?.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LineupCol({ data, name, isLfc }) {
  return (
    <div className="lineup-col">
      <h4 style={{ color: isLfc ? 'var(--red)' : 'var(--text-primary)' }}>
        {name} <span className="formation">({data.formation})</span>
      </h4>
      <ol className="lineup-list" style={{ paddingLeft: '1.2rem' }}>
        {data.starting?.map((p, i) => (
          <li key={i} className="starter">{p}</li>
        ))}
      </ol>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
