import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      height: '56px',
      background: 'var(--surface)'
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--accent)',
        letterSpacing: '0.1em'
      }}>PAYASSURED</span>
      <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
        {[['/', 'Cases'], ['/cases/new', 'New Case'], ['/clients/new', 'New Client']].map(([path, label]) => (
          <Link key={path} to={path} style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: pathname === path ? 'var(--accent)' : 'var(--muted)',
            borderBottom: pathname === path ? '2px solid var(--accent)' : '2px solid transparent',
            paddingBottom: '2px',
            transition: 'color 0.2s'
          }}>{label}</Link>
        ))}
      </div>
    </nav>
  )
}