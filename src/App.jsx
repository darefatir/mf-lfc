import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import League from './pages/League'
import Matches from './pages/Matches'
import Squad from './pages/Squad'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="logo-text">
            <span className="logo-accent">MF</span> LFC
          </span>
        </NavLink>
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/epl">EPL</NavLink></li>
          <li><NavLink to="/ucl">UCL</NavLink></li>
          <li><NavLink to="/matches">Matches</NavLink></li>
          <li><NavLink to="/squad">Squad</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/epl" element={<League league="epl" />} />
          <Route path="/ucl" element={<League league="ucl" />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/squad" element={<Squad />} />
        </Routes>
      </main>
    </>
  )
}
