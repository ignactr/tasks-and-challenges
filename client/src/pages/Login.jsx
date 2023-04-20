import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
        // <div>
        //     <form onSubmit={(event) => handleLogin(event)}>
        //         Login: <input value={loginController} onChange={event => setLoginController(event.target.value)} /><br/>
        //         Password: <input value={passwordController} onChange={event => setPasswordController(event.target.value)} /><br/>
        //         <input type="submit" value="sign in"/>
        //         <p>don't have an account- <a href="http://localhost:5173/register">sign up</a> </p>
        //         <p>{responseMessage}</p>
        //     </form>
        // </div>

        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <div className='text-center'>
                    <h1>Tasks and Challenges</h1>
                </div>
                <Col className='m-3 p-3 border border-5 border-light rounded'>
                    <Form onSubmit={(event) => handleLogin(event)}>
                        <Form.Group className='mb-3' controlId='formLogin'>
                            <Form.Label>Login</Form.Label>
                            <Form.Control value={loginController} onChange={event => setLoginController(event.target.value)} type='text' placeholder='Enter login' />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='formPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={passwordController} onChange={event => setPasswordController(event.target.value)} type='password' placeholder='Password' />
                        </Form.Group>
                        <Button className='w-100' variant='success' type='submit'>
                            Sign in
                        </Button>
                        <Form.Group className='text-center m-1'>
                            <Form.Text id='signUpLink'>
                                Don't have an account? <a href='http://localhost:5173/register'>Sign up</a>
                            </Form.Text>
                            <br></br>
                            <Form.Text className='text-danger' id='responseMessage'>
                                {responseMessage}
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
export default Login