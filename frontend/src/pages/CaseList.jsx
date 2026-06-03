import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCases } from '../api'

const STATUSES = ['', 'New', 'In Follow-up', 'Partially Paid', 'Closed']

function badgeClass(status) {
  return { New: 'badge-new', 'In Follow-up': 'badge-followup', 'Partially Paid': 'badge-partial', Closed: 'badge-closed' }[status] || ''
}

export default function CaseList() {
  const [cases, setCases] = useState([])
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('asc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCases({ status: status || undefined, sort })
      .then(setCases)
      .finally(() => setLoading(false))
  }, [status, sort])

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Invoice Recovery Cases</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {cases.length} record{cases.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/cases/new"><button className="btn-primary">+ New Case</button></Link>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto' }}>
          <option value="asc">Due Date ↑</option>
          <option value="desc">Due Date ↓</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <p style={{ padding: '2rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Loading...</p>
        ) : cases.length === 0 ? (
          <p style={{ padding: '2rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>No cases found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Client</th><th>Invoice #</th><th>Amount</th><th>Due Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/cases/${c.id}`}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{c.client.client_name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{c.client.company_name}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{c.invoice_number}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₹{Number(c.invoice_amount).toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: new Date(c.due_date) < new Date() && c.status !== 'Closed' ? 'var(--danger)' : 'inherit' }}>
                    {c.due_date}
                  </td>
                  <td><span className={`badge ${badgeClass(c.status)}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}