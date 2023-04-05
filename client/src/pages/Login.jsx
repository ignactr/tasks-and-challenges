import React, {useEffect, useState} from 'react';

function Login(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');

    const handleLogin = () => {

    };

    return(
        <div>
            <form onSubmit={handleLogin}>
                <input value={loginController} onChange={event => setLoginController(event.target.value)} />
                <input value={passwordController} onChange={event => setPasswordController(event.target.value)} />
                <input type="submit" value="sign in"/>
            </form>
        </div>
    );
}
export default Login