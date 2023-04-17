import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const navigateTo = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:5000/api/login', {
            login: loginController,
            password: passwordController,
        }).then(response => {
            if (response.status === 200) {
                localStorage.setItem('accessToken',response.data.token);
                navigateTo('../');
                //setResponseMessage('Logged in');
            }
            else if(response.status === 410){
                setResponseMessage('No user found');
            }
            else if(response.status === 300){
                setResponseMessage('Wrong password');
            }
        }).catch(error => {
            if (error.response && error.response.status === 410) {
                setResponseMessage('No user found');
            } 
            else if (error.response && error.response.status === 300) {
                setResponseMessage('Wrong password');
            }
            else {
                console.log(error);
                setResponseMessage('Unexpected error');
            }
        });
    };

    return(
        <div>
            <form onSubmit={(event) => handleLogin(event)}>
                Login: <input value={loginController} onChange={event => setLoginController(event.target.value)} /><br/>
                Password: <input value={passwordController} onChange={event => setPasswordController(event.target.value)} /><br/>
                <input type="submit" value="sign in"/>
                <p>don't have an account- <a href="http://localhost:5173/register">sign up</a> </p>
                <p>{responseMessage}</p>
            </form>
        </div>
    );
}
export default Login