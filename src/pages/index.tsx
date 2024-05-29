import React from 'react'
import Login from './login'
import NavigationLogin from '../app/navigation-login';

const LoginPage = () => {
  return (
    <div className='login-page'>  
    <NavigationLogin />
    <div className="container">
        <Login />
    </div>
</div>
  )
}

export default LoginPage;
