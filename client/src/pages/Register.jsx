import React, {useEffect, useState} from 'react';

function Register(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');
    const [secondPasswordController, setSecondPasswordController] = useState('');

    const handleRegister = () => {

    };

    return(
        <div>
            <form onSubmit={handleRegister}>
                Login: <input value={loginController} onChange={event => setLoginController(event.target.value)} />
                Password: <input value={passwordController} onChange={event => setPasswordController(event.target.value)} />
                Repeat password: <input value={secondPasswordController} onChange={event => setSecondPasswordController(event.target.value)} />
                <input type="submit" value="sign up"/>
            </form>
        </div>
    );
}
export default Register