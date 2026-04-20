"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, getUserByEmail } from '@/utils/api'

export const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const loginResponse = await login(email, password)
      if (loginResponse.message) {
        try {
          const user = await getUserByEmail(email)
          localStorage.setItem('user', JSON.stringify(user))
          if (user.users_role === 'admin') router.push('/dashboard/admin')
          else if (user.users_role === 'field_agent') router.push('/dashboard/field-agent')
          else setError('Unknown user role')
        } catch {
          setError('Login successful but failed to get user details')
        }
      } else {
        setError(loginResponse.error || 'Invalid credentials')
      }
    } catch {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#060A04', display: 'flex', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 14px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; color: #F0EDE4; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .auth-input::placeholder { color: #555; }
        .auth-input:focus { border-color: rgba(122,184,90,0.5); background: rgba(122,184,90,0.04); }

        .auth-btn {
          width: 100%; background: #4E8B3A; color: white; border: none; border-radius: 12px;
          padding: 15px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .auth-btn:hover:not(:disabled) { background: #5FA348; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(78,139,58,0.3); }
        .auth-btn:disabled { background: #2a4a21; cursor: not-allowed; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .float-anim { animation: float 6s ease-in-out infinite; }

        .left-panel {
          flex: 1; background: linear-gradient(135deg,#0F1A0B 0%,#111F0D 50%,#0A1208 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px; position: relative; overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .right-panel {
          width: 480px; flex-shrink: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 60px 48px; background: #0C1009; overflow-y: auto;
        }

        @media (max-width: 900px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; min-height: 100vh; }
        }

        @media (max-width: 480px) {
          .right-panel { padding: 40px 24px !important; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(78,139,58,0.12) 0%,transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#4E8B3A,#7AB85A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
          <span style={{ fontFamily: 'Instrument Serif', fontSize: 20, color: '#F0EDE4' }}>CropSync</span>
        </div>

        <div className="float-anim" style={{ position: 'relative', zIndex: 1 }}>
          <svg width="340" height="280" viewBox="0 0 340 280" fill="none">
            <rect width="340" height="280" rx="20" fill="#0D1A09"/>
            <circle cx="270" cy="60" r="40" fill="rgba(234,179,8,0.07)"/>
            <circle cx="270" cy="60" r="24" fill="rgba(234,179,8,0.11)"/>
            <circle cx="270" cy="60" r="13" fill="rgba(234,179,8,0.22)"/>
            <ellipse cx="170" cy="200" rx="200" ry="80" fill="rgba(78,139,58,0.06)"/>
            <rect x="20" y="160" width="130" height="90" rx="4" fill="rgba(78,139,58,0.14)"/>
            <rect x="170" y="160" width="150" height="90" rx="4" fill="rgba(78,139,58,0.09)"/>
            {[0,1,2,3,4,5].map(i => <line key={i} x1={24+i*22} y1="164" x2={24+i*22} y2="248" stroke="rgba(122,184,90,0.28)" strokeWidth="1.5" strokeDasharray="4,4"/>)}
            {[0,1,2,3,4,5,6].map(i => <line key={i} x1={174+i*20} y1="164" x2={174+i*20} y2="248" stroke="rgba(122,184,90,0.18)" strokeWidth="1.5" strokeDasharray="4,4"/>)}
            <rect x="150" y="120" width="8" height="40" rx="2" fill="#2A4A20"/>
            <ellipse cx="154" cy="112" rx="18" ry="22" fill="#3A6A28"/>
            <ellipse cx="154" cy="106" rx="12" ry="14" fill="#4E8B3A"/>
            <rect x="160" y="130" width="6" height="28" rx="2" fill="#2A4A20"/>
            <ellipse cx="163" cy="122" rx="13" ry="16" fill="#3A6A28"/>
            <rect x="20" y="20" width="110" height="44" rx="8" fill="rgba(78,139,58,0.2)" stroke="rgba(78,139,58,0.4)" strokeWidth="1"/>
            <text x="32" y="38" fill="rgba(122,184,90,0.7)" fontSize="9" fontFamily="sans-serif">CROP HEALTH</text>
            <text x="32" y="55" fill="#7AB85A" fontSize="15" fontFamily="sans-serif" fontWeight="600">92%</text>
            <rect x="210" y="20" width="110" height="44" rx="8" fill="rgba(58,122,106,0.2)" stroke="rgba(58,122,106,0.4)" strokeWidth="1"/>
            <text x="222" y="38" fill="rgba(90,184,160,0.7)" fontSize="9" fontFamily="sans-serif">RAINFALL</text>
            <text x="222" y="55" fill="#5AB8A0" fontSize="15" fontFamily="sans-serif" fontWeight="600">24mm</text>
            <rect x="0" y="248" width="340" height="32" fill="#0A0E08"/>
          </svg>
        </div>

        <div style={{ marginTop: 36, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Instrument Serif', fontSize: 32, color: '#F0EDE4', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Every field tells<br /><em style={{ color: '#7AB85A' }}>a story</em>
          </h2>
          <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: '#9A968E', fontWeight: 300, lineHeight: 1.6, maxWidth: 280 }}>
            Monitor, manage, and maximise your farm's potential with real-time intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 40, marginTop: 44, position: 'relative', zIndex: 1 }}>
          {[['12K+','Farmers'],['98%','Uptime'],['3.2M','Acres']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Instrument Serif', fontSize: 22, color: '#7AB85A' }}>{v}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#666', fontWeight: 300 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#4E8B3A,#7AB85A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌿</div>
            <span style={{ fontFamily: 'Instrument Serif', fontSize: 19, color: '#F0EDE4' }}>CropSync</span>
          </div>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'Instrument Serif', fontSize: 36, color: '#F0EDE4', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.1 }}>Welcome back</h1>
            <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: '#888', fontWeight: 300 }}>Sign in to your CropSync account</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontFamily: 'DM Sans', fontSize: 14, color: '#FF8088' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#A8A49C', display: 'block', marginBottom: 8 }}>Email address</label>
              <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#A8A49C' }}>Password</label>
                <a href="#" style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7AB85A', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 16, padding: 0 }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#555' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#888', textAlign: 'center', fontWeight: 300, marginBottom: 16 }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#7AB85A', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
          </p>
          <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#888', textAlign: 'center', fontWeight: 300 }}>
            <Link href="/" style={{ color: '#666', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}>← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Login