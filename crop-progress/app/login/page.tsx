import React from 'react'

export const  Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <form action="">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" placeholder='username' />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" placeholder='password' />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}
export default Login;