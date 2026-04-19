import Link from 'next/link'
import React from 'react'

export const LandingPage = () => {
  return (
    <div className='flex justify-content-center gap-3'>
      <h1>Welcome Home</h1>
      <button type='submit' className='btn-outline'><Link href='/login'>Login</Link></button>
      <button type='submit' className='btn-outline'>
        <Link href='/register'>Register</Link>
        </button>
    </div>
  )
}
