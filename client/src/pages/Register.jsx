import React, {useEffect, useState} from 'react';
import axios from 'axios';

function Register(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');
    const [secondPasswordController, setSecondPasswordController] = useState('');
    const [passwordPower, setPasswordPower] = useState(0);
    const [responseMessage, setResponseMessage] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:5000/api/handleRegistration', {
            login: loginController,
            password: passwordController,
        }).then(response => {
            if (response.status === 201) {
                setResponseMessage('User added');
            }
        }).catch(error => {
            if (error.response && error.response.status === 409) {
                setResponseMessage('User with the same login already exists');
            } else {
                console.log(error);
                setResponseMessage('Unexpected error');
            }
        });
    };
    const passChanger = (event) =>{
        const password = event.target.value;
        setPasswordController(password);
        setPasswordPower((prevState) => {
            let power = 0;
            if (password.length >= 6) {
              power = 1;
              if (password.length >= 9) {
                power++;
              }
              if (/\d/.test(password)) { //if contains any numbers
                power++;
              }
              if (/[A-Z]/.test(password)) { //if contains uppercase letters
                power++;
              }
              if(password.includes('@') || password.includes('#') || password.includes('_') || password.includes('$')){
                power++;
              }
              if(password.includes('.') || password.includes('!') || password.includes('?') || password.includes(',')){
                power++;
              }
            }
            return power;
          });
    }

    return(
        <div>
            <form onSubmit={event => handleRegister(event)}>
                Login: <input value={loginController} onChange={event => setLoginController(event.target.value)} /><br/>
                Password: <input value={passwordController} onChange={event => passChanger(event)} /> <>power: {passwordPower}</> <br/>
                Repeat password: <input value={secondPasswordController} onChange={event => setSecondPasswordController(event.target.value)} /><>{passwordController.length > 0 && passwordController != secondPasswordController && 'passwords have to be the same' }</><br/>
                <input type="submit" value="sign up"/>
                <p>{responseMessage}</p>
            </form>
        </div>
    );
}
export default Register