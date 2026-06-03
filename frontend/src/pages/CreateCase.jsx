import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getClients, createCase, createClient } from '../api'

const STATUSES = ['New', 'In Follow-up', 'Partially Paid', 'Closed']

export default function CreateCase() {
  const nav = useNavigate()
  const [clients, setClients] = useState([])
  const [tab, setTab] = useState('case')
  const [form, setForm] = useState({
    client_id: '', invoice_number: '', invoice_amount: '',
    invoice_date: '', due_date: '', status: 'New', last_follow_up_notes: ''
  })
  const [clientForm, setClientForm] = useState({
    client_name: '', company_name: '', city: '',
    contact_person: '', phone: '', email: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { getClients().then(setClients) }, [])

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleClient = e => setClientForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submitCase = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await createCase({ ...form, client_id: Number(form.client_id), invoice_amount: Number(form.invoice_amount) })
      nav('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create case')
    } finally { setLoading(false) }
  }

  const submitClient = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await createClient(clientForm)
      const updated = await getClients()
      setClients(updated)
      setTab('case')
      setClientForm({ client_name:'',company_name:'',city:'',contact_person:'',phone:'',email:'' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create client')
    } finally { setLoading(false) }
  }

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>← Back</Link>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '1.25rem 0 1.5rem' }}>Create New Case</h1>

      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        {[['case', 'Case Details'], ['client', 'Add Client First']].map(([key, label]) => (
          <button key={key} className="btn-ghost" onClick={() => setTab(key)} style={{
            borderRadius: 0, border: 'none', borderBottom: tab === key ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === key ? 'var(--accent)' : 'var(--muted)', paddingBottom: '0.75rem'
          }}>{label}</button>
        ))}
      </div>

      {tab === 'case' ? (
        <form onSubmit={submitCase} className="card" style={{ padding: '1.5rem' }}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Client</label>
              <select name="client_id" value={form.client_id} onChange={handle} required>
                <option value="">Select a client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.client_name} — {c.company_name}</option>)}
              </select>
            </div>
            {[
              ['invoice_number','Invoice Number','text'],
              ['invoice_amount','Invoice Amount (₹)','number'],
              ['invoice_date','Invoice Date','date'],
              ['due_date','Due Date','date'],
            ].map(([name, label, type]) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handle} required min={type==='number'?'0':undefined} step={type==='number'?'0.01':undefined} />
              </div>
            ))}
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Follow-up Notes</label>
              <textarea name="last_follow_up_notes" rows={3} value={form.last_follow_up_notes} onChange={handle} />
            </div>
          </div>
          {error && <p className="error" style={{marginTop:'0.75rem'}}>{error}</p>}
          <div style={{ marginTop: '1.25rem' }}>
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Case'}</button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitClient} className="card" style={{ padding: '1.5rem' }}>
          <div className="form-grid">
            {[
              ['client_name','Client Name'], ['company_name','Company Name'],
              ['city','City'], ['contact_person','Contact Person'],
              ['phone','Phone'], ['email','Email']
            ].map(([name, label]) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <input name={name} type={name==='email'?'email':'text'} value={clientForm[name]} onChange={handleClient} required />
              </div>
            ))}
          </div>
          {error && <p className="error" style={{marginTop:'0.75rem'}}>{error}</p>}
          <div style={{ marginTop: '1.25rem' }}>
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Client'}</button>
          </div>
        </form>
      )}
    </div>
  )
}