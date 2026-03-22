import { useState } from 'react'
import {
  EPL_STANDINGS, UCL_STANDINGS,
  EPL_TOP_SCORERS, EPL_TOP_ASSISTS,
  UCL_TOP_SCORERS, UCL_TOP_ASSISTS
} from '../data/footballData'

export default function League({ league }) {
  const [tab, setTab] = useState('standings');
  const isEpl = league === 'epl';
  const title = isEpl ? 'PREMIER LEAGUE' : 'CHAMPIONS LEAGUE';
  const standings = isEpl ? EPL_STANDINGS : UCL_STANDINGS;
  const scorers = isEpl ? EPL_TOP_SCORERS : UCL_TOP_SCORERS;
  const assists = isEpl ? EPL_TOP_ASSISTS : UCL_TOP_ASSISTS;

  return (
    <div>
      <div className="page-header">
        <h1><span className="accent">{isEpl ? 'EPL' : 'UCL'}</span> {title}</h1>
        <p className="subtitle">2025—26 Season{isEpl ? '' : ' · League Phase + Knockouts'}</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${tab === 'standings' ? 'active' : ''}`} onClick={() => setTab('standings')}>Standings</button>
        <button className={`tab-btn ${tab === 'scorers' ? 'active' : ''}`} onClick={() => setTab('scorers')}>Top Scorers</button>
        <button className={`tab-btn ${tab === 'assists' ? 'active' : ''}`} onClick={() => setTab('assists')}>Top Assists</button>
      </div>

      {tab === 'standings' && <StandingsTable data={standings} isEpl={isEpl} />}
      {tab === 'scorers' && <StatsTable data={scorers} type="goals" />}
      {tab === 'assists' && <StatsTable data={assists} type="assists" />}
    </div>
  )
}

function StandingsTable({ data, isEpl }) {
  return (
    <div className="card fade-in">
      <div className="card-body overflow-table">
        <table className="data-table">
          <thead>
            <tr>
              <th className="num">#</th>
              <th>Team</th>
              <th className="right">P</th>
              <th className="right">W</th>
              <th className="right">D</th>
              <th className="right">L</th>
              <th className="right">GF</th>
              <th className="right">GA</th>
              <th className="right">GD</th>
              <th className="right" style={{ color: 'var(--gold)' }}>Pts</th>
              {isEpl && <th>Form</th>}
              {!isEpl && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((t, i) => {
              let zoneClass = '';
              if (isEpl) {
                if (i === 3) zoneClass = 'zone-line';
                if (i === 16) zoneClass = 'zone-line-rel';
              } else {
                if (i === 7) zoneClass = 'zone-line';
                if (i === 15) zoneClass = 'zone-line';
              }
              return (
                <tr key={t.abbr} className={`${t.highlight ? 'highlight' : ''} ${zoneClass}`}>
                  <td className="num">{t.rank}</td>
                  <td>
                    <span className="team-name">
                      <span>{t.logo || ''}</span>
                      <span style={{ fontWeight: t.highlight ? 700 : 500 }}>{t.team}</span>
                    </span>
                  </td>
                  <td className="right">{t.played}</td>
                  <td className="right">{t.w}</td>
                  <td className="right">{t.d}</td>
                  <td className="right">{t.l}</td>
                  <td className="right">{t.gf}</td>
                  <td className="right">{t.ga}</td>
                  <td className="right" style={{ fontWeight: 600 }}>{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                  <td className="right bold" style={{ color: t.highlight ? 'var(--red)' : 'var(--text-primary)' }}>{t.pts}</td>
                  {isEpl && (
                    <td>
                      <div className="form-dots">
                        {(t.form || []).map((f, j) => (
                          <span key={j} className={`form-dot ${f}`}>{f}</span>
                        ))}
                      </div>
                    </td>
                  )}
                  {!isEpl && (
                    <td>
                      {t.qualified && (
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: t.qualified === 'R16' ? 'rgba(16,185,129,0.15)' : 'rgba(250,204,21,0.12)',
                          color: t.qualified === 'R16' ? 'var(--green)' : 'var(--yellow-card)',
                          border: `1px solid ${t.qualified === 'R16' ? 'rgba(16,185,129,0.3)' : 'rgba(250,204,21,0.3)'}`,
                        }}>
                          {t.qualified === 'R16' ? 'R16' : 'Playoff'}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        {isEpl && (
          <div style={{ padding: '0.8rem 0.5rem 0.2rem', display: 'flex', gap: '1.2rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 3, background: 'var(--ucl-blue)', borderRadius: 2, marginRight: 4, verticalAlign: 'middle' }}></span>Champions League</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 3, background: 'var(--red-card)', borderRadius: 2, marginRight: 4, verticalAlign: 'middle' }}></span>Relegation</span>
          </div>
        )}
      </div>
    </div>
  )
}

function StatsTable({ data, type }) {
  const isGoals = type === 'goals';
  return (
    <div className="card fade-in">
      <div className="card-body overflow-table">
        <table className="data-table">
          <thead>
            <tr>
              <th className="num">#</th>
              <th>Player</th>
              <th>Team</th>
              <th className="right">Apps</th>
              <th className="right" style={{ color: 'var(--gold)' }}>{isGoals ? '⚽ Goals' : '🅰️ Assists'}</th>
              <th className="right">{isGoals ? 'Assists' : 'Goals'}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(p => (
              <tr key={p.name + p.rank} className={p.highlight ? 'highlight' : ''}>
                <td className="num">{p.rank}</td>
                <td>
                  <span className="team-name">
                    <span>{p.country}</span>
                    <span style={{ fontWeight: p.highlight ? 700 : 500 }}>{p.name}</span>
                  </span>
                </td>
                <td className="text-secondary">{p.team}</td>
                <td className="right">{p.apps}</td>
                <td className="right bold" style={{ color: p.highlight ? 'var(--red)' : 'var(--text-primary)', fontSize: '0.92rem' }}>
                  {isGoals ? p.goals : p.assists}
                </td>
                <td className="right text-secondary">{isGoals ? p.assists : p.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
