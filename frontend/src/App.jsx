import { useState } from 'react'

export default function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setStatus({ ok: res.ok, text: data.message })
      if (res.ok) setForm({ name: '', email: '', password: '' })
    } catch {
      setStatus({ ok: false, text: 'Сервер недоступен' })
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Регистрация</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input name="name" placeholder="Имя" value={form.name} onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Пароль (мин. 6 символов)" value={form.password} onChange={onChange} required minLength={6} />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {status && (
        <p style={{ color: status.ok ? 'green' : 'crimson' }}>{status.text}</p>
      )}
    </div>
  )
}