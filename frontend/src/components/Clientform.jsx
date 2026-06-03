import { useState } from 'react'
import { createClient } from '../api'

export default function ClientForm({ onSuccess }) {
  const [form, setForm] = useState({
    client_name: '', company_name: '', city: '',
    contact_person: '', phone: '', email: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await createClient(form)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create client')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        {[
          ['client_name','Client Name'], ['company_name','Company Name'],
          ['city','City'], ['contact_person','Contact Person'],
          ['phone','Phone'], ['email','Email']
        ].map(([key, label]) => (
          <div className="form-group" key={key}>
            <label>{label}</label>
            <input name={key} value={form[key]} onChange={handle} required type={key==='email'?'email':'text'} />
          </div>
        ))}
      </div>
      {error && <p className="error" style={{marginTop:'0.75rem'}}>{error}</p>}
      <div style={{ marginTop: '1.25rem' }}>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Create Client'}
        </button>
      </div>
    </form>
  )
}