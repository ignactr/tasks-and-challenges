import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function NotLogged() {
    const navigateTo = useNavigate();

    const logIn= () =>{
        navigateTo('../login');
    }
    const signUp= () =>{
        navigateTo('../register');
    }

    return (
        // <div>
        //     <h1>You can't get here, because you aren't logged in </h1><br/>
        //     <button onClick={logIn}>Log in</button>
        //     <button onClick={signUp}>Sign up</button>
        // </div>

        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <div className='text-center my-3'>
                    <h1>You can't get here, because you aren't logged in</h1>
                </div>
                
                <Col className='d-flex justify-content-end'>
                    <Button onClick={logIn} className='w-25 border border-3 border-secondary-subtle' variant='light' type='submit'>
                        Log in
                    </Button>
                </Col>

                <Col className='d-flex justify-content-start'>
                    <Button onClick={signUp} className='w-25' variant='success' type='submit'>
                        Sign up
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default NotLogged;