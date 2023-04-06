import React, {useEffect, useState} from 'react';
import axios from 'axios';

function Register(){
    const [loginController, setLoginController] = useState('');
    const [passwordController, setPasswordController] = useState('');
    const [secondPasswordController, setSecondPasswordController] = useState('');
    const [passwordPower, setPasswordPower] = useState(0);

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
            <form onSubmit={handleRegister}>
                Login: <input value={loginController} onChange={event => setLoginController(event.target.value)} /><br/>
                Password: <input value={passwordController} onChange={event => passChanger(event)} /> <>power: {passwordPower}</> <br/>
                Repeat password: <input value={secondPasswordController} onChange={event => setSecondPasswordController(event.target.value)} /><br/>
                <input type="submit" value="sign up"/>
            </form>
        </div>
    );
}
export default Register