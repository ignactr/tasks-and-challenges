import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function DeleteUser(){
    const [passwordController, setPasswordController]= useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const navigateTo = useNavigate();

    const handleDelete = async (event) =>{
        // form validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    
        setValidated(true);


        event.preventDefault();
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/editUser/delete', {
            password: passwordController
            },{headers: {'Authorization': `Bearer ${token}`}}).then(response => {
                if (response.status === 205) {
                    localStorage.removeItem('accessToken');
                    navigateTo('../login');
                }
            }).catch((error) => {
                if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                } 
                else if (error.response && error.response.status === 510) {
                    setResponseMessage('Invalid password or hash');
                }
                else if (error.response && error.response.status === 300) {
                    setResponseMessage('Wrong password');
                }
                else if (error.response && error.response.status === 401) {
                    navigateTo('../notlogged');
                }
                else {
                    console.log(error);
                }
            }
         );
    }
    return(
        // <form onSubmit={(event)=>handleDelete(event)}>
        //     password: <input type="text" value={passwordController} onChange={(event)=>setPasswordController(event.target.value)}></input><br/>
        //     <input type="submit" value="delete"/>
        //     {responseMessage != '' && <p>{responseMessage}</p>}
        // </form>

        <Form className='m-4' noValidate validated={validated} onSubmit={(event)=>handleDelete(event)}>

            <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    value={passwordController} 
                    onChange={(event)=>setPasswordController(event.target.value)}
                    type='password' 
                    placeholder='Enter password' 
                    maxLength={50} // TBD
                    required 
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                </Form.Control.Feedback>
            </Form.Group>

            <Button className='w-100' variant='outline-danger' type='submit'>
                Delete account
            </Button>

            <Form.Group className='text-center m-1'>
            {
                responseMessage != '' &&
                <Form.Text className='text-danger' id='responseMessage'>
                    {responseMessage}
                </Form.Text>
            }               
            </Form.Group>

        </Form>
    );
}

function ChangePassword(){
    const [oldPasswordController, setOldPasswordController]= useState('');
    const [newPasswordController1, setNewPasswordController1]= useState('');
    const [newPasswordController2, setNewPasswordController2]= useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const navigateTo = useNavigate();

    const handleChange = async (event) =>{
        // form validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    
        setValidated(true);


        event.preventDefault();
        if(newPasswordController1 === newPasswordController2){
            const token = localStorage.getItem('accessToken');
            await axios.post('http://localhost:5000/api/editUser/changePassword', {
            oldPassword: oldPasswordController,
            newPassword: newPasswordController1
            },{headers: {'Authorization': `Bearer ${token}`}}).then(response => {
                if (response.status === 205) {
                    setResponseMessage('Password succesfully changed');
                }
            }).catch((error) => {
                if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                } 
                else if (error.response && error.response.status === 510) {
                    setResponseMessage('Invalid password or hash');
                }
                else if (error.response && error.response.status === 400) {
                    setResponseMessage('New password must be at least 6 characters long');
                }
                else if (error.response && error.response.status === 300) {
                    setResponseMessage('Wrong password');
                }
                else if (error.response && error.response.status === 401) {
                    navigateTo('../notlogged');
                }
                else {
                    console.log(error);
                }
            }
         );
        }
        else{
            setResponseMessage('New password must be the same!')
        }
    }
    return(
        // <form onSubmit={(event)=>handleChange(event)}>
        //     old password: <input type="text" value={oldPasswordController} onChange={(event)=>setOldPasswordController(event.target.value)}></input><br/>
        //     new password: <input type="text" value={newPasswordController1} onChange={(event)=>setNewPasswordController1(event.target.value)}></input><br/>
        //     repeat new password: <input type="text" value={newPasswordController2} onChange={(event)=>setNewPasswordController2(event.target.value)}></input><br/>
        //     <input type="submit" value="change password"/>
        //     {responseMessage != '' && <p>{responseMessage}</p>}
        // </form>

        <Form className='m-4' noValidate validated={validated} onSubmit={(event)=>handleChange(event)}>

            <Form.Group className='mb-3' controlId='formOldPassword'>
                <Form.Label>Old password</Form.Label>
                <Form.Control 
                    value={oldPasswordController} 
                    onChange={(event)=>setOldPasswordController(event.target.value)}
                    type='password' 
                    placeholder='Enter old password' 
                    maxLength={50} // TBD
                    required 
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formNewPassword'>
                <Form.Label>New password</Form.Label>
                <Form.Control 
                    value={newPasswordController1} 
                    onChange={(event)=>setNewPasswordController1(event.target.value)}
                    type='password' 
                    placeholder='Enter new password' 
                    maxLength={50} // TBD
                    required 
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='mb-3' controlId='repeatNewPassword'>
                <Form.Label>Repeat new password</Form.Label>
                <Form.Control 
                    value={newPasswordController2} 
                    onChange={(event)=>setNewPasswordController2(event.target.value)}
                    type='password' 
                    placeholder='Reenter new password' 
                    maxLength={50} // TBD
                    required 
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                </Form.Control.Feedback>
            </Form.Group>

            <Button className='w-100' variant='success' type='submit'>
                Change password
            </Button>

            <Form.Group className='text-center m-1'>
            {responseMessage != '' &&
                <Form.Text className='text-danger' id='responseMessage'>
                    {responseMessage}
                </Form.Text>
            }               
            </Form.Group>
            
        </Form>
    );
}
function User(){
    const [userInfo, setUserInfo] = useState({});
    const [pageState, setPageState] = useState(0);

    const navigateTo = useNavigate();

    const getUserInfo = async () =>{
        const token= localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/getUserFromId/extended',null,{headers: {'Authorization': `Bearer ${token}`}}).then((response) => {
        if (response.status === 207) {
            const createDate= new Date(response.data.createDate);
            const formattedCreateDate = `${createDate.getDate().toString().padStart(2, '0')}/${(createDate.getMonth()+1).toString().padStart(2, '0')}/${createDate.getFullYear()} ${createDate.getHours().toString().padStart(2, '0')}:${createDate.getMinutes().toString().padStart(2, '0')}:${createDate.getSeconds().toString().padStart(2, '0')}`;
            const lastLogged= new Date(response.data.lastLogged);
            const formattedLastLogged = `${lastLogged.getDate().toString().padStart(2, '0')}/${(lastLogged.getMonth()+1).toString().padStart(2, '0')}/${lastLogged.getFullYear()} ${lastLogged.getHours().toString().padStart(2, '0')}:${lastLogged.getMinutes().toString().padStart(2, '0')}:${lastLogged.getSeconds().toString().padStart(2, '0')}`;
            setUserInfo({id: response.data.userId, login: response.data.login, karma: response.data.karma, createDate: formattedCreateDate, lastLogged: formattedLastLogged});
        }
        }).catch(error =>{
        //if user is not authorized
        if (error.response && error.response.status === 401) {
            navigateTo('../notlogged');
        } 
        else if (error.response && error.response.status === 500) {
            console.log(error);
        }
    });
    }
    const logOut = () =>{
        localStorage.removeItem('accessToken');
        navigateTo('../login');
    }
    useEffect(()=>{
        getUserInfo();
    }, []);

    return (
        // <div>
        //     <button onClick={()=>{navigateTo('../')}}>back to main page</button>
        //     <h2>User info</h2>
        //     <h6>login: {userInfo['login']}</h6>
        //     <h6>user's karma: {userInfo['karma']}</h6>
        //     <h6>last logged in: {userInfo['lastLogged']}</h6>
        //     <h6>registered in: {userInfo['createDate']}</h6>
        //     <p><button onClick={()=>{logOut()}}>log out</button><button onClick={()=>{setPageState(2)}}>change password</button><button onClick={()=>{setPageState(1)}}>delete account</button></p>
        //     {
        //         pageState === 1 ? <DeleteUser /> : pageState === 2 && <ChangePassword />
        //     }
        // </div>

        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <Button onClick={()=>{navigateTo('../')}} className='w-25 border border-3 border-secondary-subtle' variant='light' type='submit'>
                    Go back
                </Button>

                <div className='text-center mt-3'>
                    <h2>User info</h2>
                </div>
                
                <Col className='m-3 p-3 border border-5 border-light rounded'>
                    <ListGroup className='m-4'>
                        <ListGroup.Item>Login: {userInfo['login']}</ListGroup.Item>
                        <ListGroup.Item>User's karma: {userInfo['karma']}</ListGroup.Item>
                        <ListGroup.Item>Last login: {userInfo['lastLogged']}</ListGroup.Item>
                        <ListGroup.Item>Registered on: {userInfo['createDate']}</ListGroup.Item>
                    </ListGroup>

                    <div className='text-center my-3'>
                        <h4>Actions</h4>
                    </div>

                    <ButtonGroup className='d-flex'>
                        <Button onClick={()=>{logOut()}} className='border border-3 border-secondary-subtle' variant="light">Log out</Button>
                        <Button onClick={()=>{setPageState(2)}} variant="success">Change password</Button>
                        <Button onClick={()=>{setPageState(1)}} variant="danger">Delete account</Button>
                    </ButtonGroup>
                    
                    {pageState === 1 ? <DeleteUser /> : pageState === 2 && <ChangePassword />}
                </Col>
            </Row>
        </Container>
    );
}

export default User;