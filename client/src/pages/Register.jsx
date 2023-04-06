import React, {useEffect, useState} from 'react';
import axios from 'axios';

function Register(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');
    const [secondPasswordController, setSecondPasswordController] = useState('');

    const handleRegister = async () => {
        await axios.post('http://localhost:5000/api/handleRegistration', {
            login: loginController,
            password: passwordController,
        }).then(response => {
            console.log(response.status === 400);
        }).catch(error => {
            console.log(error);
        });
    };

    return(
        <div>
            <form onSubmit={handleRegister}>
                Login: <input value={loginController} onChange={event => setLoginController(event.target.value)} /><br/>
                Password: <input value={passwordController} onChange={event => setPasswordController(event.target.value)} /><br/>
                Repeat password: <input value={secondPasswordController} onChange={event => setSecondPasswordController(event.target.value)} /><br/>
                <input type="submit" value="sign up"/>
            </form>
        </div>
    );
}
export default Register