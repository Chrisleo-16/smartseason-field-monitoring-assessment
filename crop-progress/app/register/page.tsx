"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/utils/api'

export const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phone_number: '', users_role: 'field_agent' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await register(formData.username, formData.password, formData.email, formData.phone_number, formData.users_role)
      if (response.message) router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100vh', background: '#060A04', display: 'flex', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 14px 16px;
          font-family: 'Nunito', sans-serif; font-size: 15px; color: #F0EDE4; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .auth-input::placeholder { color: #555; }
        .auth-input:focus { border-color: rgba(122,184,90,0.5); background: rgba(122,184,90,0.04); }

        .role-card {
          padding: 20px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.2s; flex: 1; text-align: center;
        }
        .role-card:hover { border-color: rgba(122,184,90,0.3); background: rgba(122,184,90,0.05); }
        .role-card.selected { border-color: rgba(122,184,90,0.6); background: rgba(122,184,90,0.1); }

        .auth-btn {
          width: 100%; background: #4E8B3A; color: white; border: none; border-radius: 12px;
          padding: 15px; font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .auth-btn:hover:not(:disabled) { background: #5FA348; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(78,139,58,0.3); }
        .auth-btn:disabled { background: #2a4a21; cursor: not-allowed; }

        .left-panel {
          flex: 1; background: linear-gradient(135deg,#0F1A0B 0%,#111F0D 50%,#0A1208 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px; position: relative; overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .right-panel {
          width: 520px; flex-shrink: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 60px 48px; background: #0C1009; overflow-y: auto;
        }

        @media (max-width: 960px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; min-height: 100vh; }
        }

        @media (max-width: 480px) {
          .right-panel { padding: 40px 24px !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(78,139,58,0.1) 0%,transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#4E8B3A,#7AB85A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
          <span style={{ fontFamily: 'Instrument Serif', fontSize: 20, color: '#F0EDE4' }}>CropSync</span>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 340 }}>
          <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 34, color: '#F0EDE4', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 40 }}>
            Start growing<br /><em style={{ color: '#7AB85A' }}>smarter today</em>
          </h2>
          {[
            {icon:'🌾',title:'Real-time field monitoring',desc:'Track every crop from planting to harvest'},
            {icon:'🌦️',title:'Smart weather alerts',desc:'Hyper-local forecasts with farming guidance'},
            {icon:'📊',title:'Yield analytics',desc:'Data-driven decisions for better harvests'},
            {icon:'👥',title:'Team collaboration',desc:'Coordinate field agents across all your farms'},
          ].map(b => (
            <div key={b.title} style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: 'rgba(78,139,58,0.15)', border: '1px solid rgba(78,139,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{b.icon}</div>
              <div>
                <div style={{ fontFamily: 'Nunito', fontSize: 14, fontWeight: 500, color: '#E0DDD5', marginBottom: 3 }}>{b.title}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 13, color: '#888', fontWeight: 300 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, justifyContent: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#4E8B3A,#7AB85A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌿</div>
            <span style={{ fontFamily: 'Instrument Serif', fontSize: 19, color: '#F0EDE4' }}>CropSync</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 34, color: '#F0EDE4', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.1 }}>Create account</h1>
            <p style={{ fontFamily: 'Nunito', fontSize: 15, color: '#888', fontWeight: 300 }}>Join thousands of farmers using CropSync</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontFamily: 'Nunito', fontSize: 14, color: '#FF8088' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Role selector */}
            <div>
              <label style={{ fontFamily: 'Nunito', fontSize: 13, color: '#A8A49C', display: 'block', marginBottom: 10 }}>I am a…</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  {value:'field_agent',label:'Field Agent',icon:'🧑‍🌾',desc:'I work in the field'},
                  {value:'admin',label:'Farm Manager',icon:'🏢',desc:'I manage operations'},
                ].map(r => (
                  <div key={r.value} className={`role-card ${formData.users_role === r.value ? 'selected' : ''}`} onClick={() => setFormData({...formData, users_role: r.value})}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{r.icon}</div>
                    <div style={{ fontFamily: 'Nunito', fontSize: 13, fontWeight: 500, color: formData.users_role === r.value ? '#7AB85A' : '#DDD', marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontFamily: 'Nunito', fontSize: 11, color: '#666' }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontFamily: 'Nunito', fontSize: 13, color: '#A8A49C', display: 'block', marginBottom: 8 }}>Username</label>
                <input type="text" name="username" className="auth-input" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ fontFamily: 'Nunito', fontSize: 13, color: '#A8A49C', display: 'block', marginBottom: 8 }}>Phone</label>
                <input type="tel" name="phone_number" className="auth-input" placeholder="+254 700 000 000" value={formData.phone_number} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'Nunito', fontSize: 13, color: '#A8A49C', display: 'block', marginBottom: 8 }}>Email address</label>
              <input type="email" name="email" className="auth-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div>
              <label style={{ fontFamily: 'Nunito', fontSize: 13, color: '#A8A49C', display: 'block', marginBottom: 8 }}>Password</label>
              <input type="password" name="password" className="auth-input" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p style={{ fontFamily: 'Nunito', fontSize: 12, color: '#555', textAlign: 'center', lineHeight: 1.5 }}>
              By creating an account you agree to our{' '}
              <a href="#" style={{ color: '#7AB85A', textDecoration: 'none' }}>Terms</a> and{' '}
              <a href="#" style={{ color: '#7AB85A', textDecoration: 'none' }}>Privacy Policy</a>
            </p>
          </form>

          <p style={{ fontFamily: 'Nunito', fontSize: 14, color: '#888', textAlign: 'center', marginTop: 28, fontWeight: 300 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#7AB85A', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
          <p style={{ fontFamily: 'Nunito', fontSize: 14, color: '#888', textAlign: 'center', marginTop: 12, fontWeight: 300 }}>
            <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Register