import { useNavigate } from 'react-router-dom';

function NotLogged() {
    const navigateTo = useNavigate();

    const logIn= () =>{
        navigateTo('../login');
    }
    const signUp= () =>{
        navigateTo('../register');
    }

    return (
        <div>
            <h1>You can't get here, because you aren't logged in </h1><br/>
            <button onClick={logIn}>Log in</button>
            <button onClick={signUp}>Sign up</button>
        </div>
    );
}

export default NotLogged;