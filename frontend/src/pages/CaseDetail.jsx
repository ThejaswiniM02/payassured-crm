import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCase, patchCase } from '../api'

const STATUSES = ['New', 'In Follow-up', 'Partially Paid', 'Closed']

function Badge({ s }) {
  const cls = { New: 'badge-new', 'In Follow-up': 'badge-followup', 'Partially Paid': 'badge-partial', Closed: 'badge-closed' }[s] || ''
  return <span className={`badge ${cls}`}>{s}</span>
}

export default function CaseDetail() {
  const { id } = useParams()
  const [c, setC] = useState(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getCase(id).then(data => {
      setC(data); setStatus(data.status); setNotes(data.last_follow_up_notes || '')
    })
  }, [id])

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const updated = await patchCase(id, { status, last_follow_up_notes: notes })
      setC(updated); setMsg('Saved.')
    } catch { setMsg('Error saving.') }
    finally { setSaving(false) }
  }

  if (!c) return <div className="page" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Loading...</div>

  const field = (label, value) => (
    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem' }}>{label}</div>
      <div style={{ fontSize: '0.9rem' }}>{value}</div>
    </div>
  )

  return (
    <div className="page">
      <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>← Back</Link>
      <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600 }}>{c.invoice_number}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{c.client.client_name} · {c.client.company_name}</p>
        </div>
        <Badge s={c.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Invoice Details</div>
          {field('Invoice Amount', `₹${Number(c.invoice_amount).toLocaleString('en-IN')}`)}
          {field('Invoice Date', c.invoice_date)}
          {field('Due Date', c.due_date)}
          {field('Client Email', c.client.email)}
          {field('City', c.client.city)}
          {field('Phone', c.client.phone)}
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Update Case</p>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Follow-up Notes</label>
            <textarea rows={5} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            {msg && <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: msg === 'Saved.' ? 'var(--accent)' : 'var(--danger)' }}>{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}