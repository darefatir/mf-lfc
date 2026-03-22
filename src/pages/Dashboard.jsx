import { Link } from 'react-router-dom'
import { EPL_STANDINGS, UCL_STANDINGS, LIVERPOOL_MATCHES, UPCOMING_MATCHES, EPL_TOP_SCORERS } from '../data/footballData'

export default function Dashboard() {
  const eplTop5 = EPL_STANDINGS.slice(0, 5);
  const uclTop5 = UCL_STANDINGS.slice(0, 5);
  const recentMatches = LIVERPOOL_MATCHES.slice(0, 3);
  const topScorers = EPL_TOP_SCORERS.slice(0, 5);
  const lfcEpl = EPL_STANDINGS.find(t => t.abbr === 'LFC');
  const lfcUcl = UCL_STANDINGS.find(t => t.abbr === 'LFC');

  return (
    <div>
      <div className="page-header">
        <h1><span className="accent">MF</span> LFC DASHBOARD</h1>
        <p className="subtitle">2025—26 Season · Liverpool FC Tracker</p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <StatBox label="EPL Position" value={`#${lfcEpl?.rank}`} sub={`${lfcEpl?.pts} pts`} />
        <StatBox label="UCL Position" value={`#${lfcUcl?.rank}`} sub={`${lfcUcl?.pts} pts · R16 ✓`} />
        <StatBox label="UCL Next" value="QF" sub="vs PSG" accent />
        <StatBox label="EPL Form" value={lfcEpl?.form?.join('')} sub="Last 5 matches" form={lfcEpl?.form} />
      </div>

      {/* Upcoming Matches */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">
          <h2>UPCOMING FIXTURES</h2>
          <Link to="/matches" style={{ color: 'var(--red)', fontSize: '0.78rem', textDecoration: 'none' }}>View All →</Link>
        </div>
        <div className="card-body">
          <div className="upcoming-strip">
            {UPCOMING_MATCHES.map(m => (
              <div className="upcoming-card" key={m.id}>
                <span className={`comp-badge ${m.compShort === 'UCL' ? 'badge-ucl' : 'badge-epl'}`}>
                  {m.competition} {m.round ? `· ${m.round}` : ''}
                </span>
                <div className="up-date">{formatDate(m.date)} · {m.time}</div>
                <div className="up-teams">
                  <span className={m.home.abbr === 'LFC' ? 'text-red' : ''}>{m.home.team}</span>
                  {' vs '}
                  <span className={m.away.abbr === 'LFC' ? 'text-red' : ''}>{m.away.team}</span>
                </div>
                <div className="up-venue">{m.venue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* EPL Table Mini */}
        <div className="card">
          <div className="card-header">
            <h2>PREMIER LEAGUE</h2>
            <Link to="/epl" style={{ color: 'var(--red)', fontSize: '0.78rem', textDecoration: 'none' }}>Full Table →</Link>
          </div>
          <div className="card-body overflow-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Team</th>
                  <th className="right">P</th>
                  <th className="right">GD</th>
                  <th className="right" style={{ color: 'var(--gold)' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {eplTop5.map(t => (
                  <tr key={t.abbr} className={t.highlight ? 'highlight' : ''}>
                    <td className="num">{t.rank}</td>
                    <td className="bold">{t.team}</td>
                    <td className="right">{t.played}</td>
                    <td className="right">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                    <td className="right bold">{t.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* UCL Table Mini */}
        <div className="card">
          <div className="card-header">
            <h2>CHAMPIONS LEAGUE</h2>
            <Link to="/ucl" style={{ color: 'var(--red)', fontSize: '0.78rem', textDecoration: 'none' }}>Full Table →</Link>
          </div>
          <div className="card-body overflow-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Team</th>
                  <th className="right">P</th>
                  <th className="right">GD</th>
                  <th className="right" style={{ color: 'var(--gold)' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {uclTop5.map(t => (
                  <tr key={t.abbr} className={t.highlight ? 'highlight' : ''}>
                    <td className="num">{t.rank}</td>
                    <td className="bold">{t.team}</td>
                    <td className="right">{t.played}</td>
                    <td className="right">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                    <td className="right bold">{t.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Results */}
        <div className="card">
          <div className="card-header">
            <h2>RECENT RESULTS</h2>
            <Link to="/matches" style={{ color: 'var(--red)', fontSize: '0.78rem', textDecoration: 'none' }}>All Matches →</Link>
          </div>
          <div className="card-body">
            {recentMatches.map(m => (
              <div key={m.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span className={`comp-badge ${m.compShort === 'UCL' ? 'badge-ucl' : 'badge-epl'}`} style={{ marginBottom: '0.3rem' }}>{m.compShort}</span>
                <div className="match-row" style={{ margin: '0.3rem 0' }}>
                  <span className={`match-team home ${m.home.abbr === 'LFC' ? 'lfc' : ''}`}>{m.home.team}</span>
                  <span className="match-score">
                    {m.home.score}<span className="sep">-</span>{m.away.score}
                  </span>
                  <span className={`match-team away ${m.away.abbr === 'LFC' ? 'lfc' : ''}`}>{m.away.team}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(m.date)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EPL Top Scorers Mini */}
        <div className="card">
          <div className="card-header">
            <h2>EPL TOP SCORERS</h2>
            <Link to="/epl" style={{ color: 'var(--red)', fontSize: '0.78rem', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div className="card-body overflow-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th className="right">⚽</th>
                </tr>
              </thead>
              <tbody>
                {topScorers.map(p => (
                  <tr key={p.name} className={p.highlight ? 'highlight' : ''}>
                    <td className="num">{p.rank}</td>
                    <td className="bold">{p.country} {p.name}</td>
                    <td className="text-secondary">{p.team}</td>
                    <td className="right bold">{p.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, sub, accent, form }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '0.8rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{label}</div>
      {form ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '0.3rem 0' }}>
          {form.map((f, i) => <span key={i} className={`form-dot ${f}`}>{f}</span>)}
        </div>
      ) : (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: accent ? 'var(--red)' : 'var(--text-primary)' }}>{value}</div>
      )}
      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{sub}</div>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
