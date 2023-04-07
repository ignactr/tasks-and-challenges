import React, {useEffect, useState} from 'react';

function Login(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');

    const handleLogin = () => {

    };

    return(
        <div>
            <form onSubmit={handleLogin}>
                Login: <input value={loginController} onChange={event => setLoginController(event.target.value)} /><br/>
                Password: <input value={passwordController} onChange={event => setPasswordController(event.target.value)} /><br/>
                <input type="submit" value="sign in"/>
                <p>don't have an account- <a href="http://localhost:5173/register">sign up</a> </p>
            </form>
        </div>
    );
}
export default Login