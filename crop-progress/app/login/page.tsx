"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import  {login, getUserByEmail} from '@/utils/api'

export const  Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // First login
      const loginResponse = await login(email, password);
      
      if (loginResponse.message) {
        // Then get user details for role-based routing
        try {
          const user = await getUserByEmail(email);
          
          // Store user info in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          
          // Route based on user role
          if (user.users_role === 'admin') {
            router.push('/dashboard/admin');
          } else if (user.users_role === 'field_agent') {
            router.push('/dashboard/field-agent');
          } else {
            setError('Unknown user role');
          }
        } catch (userErr) {
          setError('Login successful but failed to get user details');
        }
      } else {
        setError(loginResponse.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };
  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}
export default Login;