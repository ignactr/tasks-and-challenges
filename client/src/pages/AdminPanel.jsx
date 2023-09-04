import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import '../custom.css';

function UsersView(props) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [validated, setValidated] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);
    const [loginValid, setLoginValid] = useState(true);
    const [passwordController, setPasswordController] = useState('');
    const [loginController, setLoginController] = useState('');
    const [karmaController, setKarmaController] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [response, setResponse] = useState(0);

    const closeLinkRef = useRef(null);
    const data = props.data;
    const handleRowSelect = (user) => {
        if (selectedUser != null && user._id === selectedUser._id) {
            setSelectedUser(null);
        }
        else {
            setSelectedUser(user);
        }
    }
    const clearControllers = () => {
        setPasswordController('');
        setLoginController('');
        setKarmaController('');
        setValidated(false);
        setPasswordValid(true);
        setLoginValid(true);
        setResponse(0);
    }
    const formattedDate = (date) => {
        const dateToFormat = new Date(date);
        const formattedDate = `${dateToFormat.getDate().toString().padStart(2, '0')}/${(dateToFormat.getMonth() + 1).toString().padStart(2, '0')}/${dateToFormat.getFullYear()} ${dateToFormat.getHours().toString().padStart(2, '0')}:${dateToFormat.getMinutes().toString().padStart(2, '0')}:${dateToFormat.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate;
    }
    //form handling functions
    const handleDelete = async (event, selectedUsersLogin, selectedUserId) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        event.preventDefault();
        if (loginController === selectedUsersLogin) {
            setLoginValid(true);
            if (passwordController === '') {
                setPasswordValid(false);
                return 0;
            }
            const token = localStorage.getItem('accessToken');
            await axios.post('http://localhost:5000/api/adminUserOperations/delete', {
                password: passwordController,
                id: selectedUserId
            }, { headers: { 'Authorization': `Bearer ${token}` } }).then(response => {
                if (response.status === 205) {
                    setResponseMessage('user, his challenges and conversations from post successfully deleted');
                    clearControllers();
                    setSelectedUser(null);
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click(); // Programmatically trigger the click event
                        props.refresh();
                    }
                }
            }).catch(error => {
                //if user is not logged in
                if (error.response && error.response.status === 401) {
                    navigateTo('../notlogged');
                }
                //if user is logged in but he is not an admin
                else if (error.response && error.response.status === 402) {
                    navigateTo('../notadmin');
                }
                //if user is not found
                else if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                    clearControllers();
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click(); // Programmatically trigger the click event
                        props.refresh();
                    }
                }
                //if password is wrong
                else if (error.response && error.response.status === 300) {
                    setResponse(300);
                    setPasswordValid(false);
                }
                else {
                    console.log(error);
                }
            });
        }
        else {
            setLoginValid(false);
        }
    }
    const handleLoginChange = async (event, selectedUserId) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        event.preventDefault();
        if (loginController != '') {
            setLoginValid(true);
            const token = localStorage.getItem('accessToken');
            await axios.post('http://localhost:5000/api/adminUserOperations/changeLogin', {
                login: loginController,
                id: selectedUserId
            }, { headers: { 'Authorization': `Bearer ${token}` } }).then(response => {
                if (response.status === 205) {
                    setResponseMessage('login successfully changed');
                    clearControllers();
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click(); // Programmatically trigger the click event
                        props.refresh();
                    }
                }
            }).catch(error => {
                //if user is not logged in
                if (error.response && error.response.status === 401) {
                    navigateTo('../notlogged');
                }
                //if user is logged in but he is not an admin
                else if (error.response && error.response.status === 402) {
                    navigateTo('../notadmin');
                }
                //if login is already occupied
                else if (error.response && error.response.status === 409) {
                    setResponse(409);
                    setLoginValid(false);
                }
                //if user is not found
                else if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                    clearControllers();
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click();
                        props.refresh();
                    }
                }
                else {
                    console.log(error);
                }
            });
        }
        else {
            setLoginValid(false);
        }
    }
    const handleEditKarma = async (event, selectedUserId) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        event.preventDefault();
        if (karmaController != '') {
            const token = localStorage.getItem('accessToken');
            await axios.post('http://localhost:5000/api/adminUserOperations/editKarma', {
                karma: karmaController,
                id: selectedUserId
            }, { headers: { 'Authorization': `Bearer ${token}` } }).then(response => {
                if (response.status === 205) {
                    setResponseMessage('karma successfully changed');
                    clearControllers();
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click(); // Programmatically trigger the click event
                        props.refresh();
                    }
                }
            }).catch(error => {
                //if user is not logged in
                if (error.response && error.response.status === 401) {
                    navigateTo('../notlogged');
                }
                //if user is logged in but he is not an admin
                else if (error.response && error.response.status === 402) {
                    navigateTo('../notadmin');
                }
                //if user is not found
                else if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                    clearControllers();
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click();
                        props.refresh();
                    }
                }
                else {
                    console.log(error);
                }
            });
        }
    }
    const handleChangeStatus = async (event, selectedUserId) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        event.preventDefault();
        if (passwordController != '') {
            setPasswordValid(true);
            const token = localStorage.getItem('accessToken');
            await axios.post('http://localhost:5000/api/adminUserOperations/changeStatus', {
                password: passwordController,
                id: selectedUserId
            }, { headers: { 'Authorization': `Bearer ${token}` } }).then(response => {
                if (response.status === 205) {
                    setResponseMessage('status successfully changed');
                    clearControllers();
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click(); // Programmatically trigger the click event
                        props.refresh();
                    }
                }
            }).catch(error => {
                //if user is not logged in
                if (error.response && error.response.status === 401) {
                    navigateTo('../notlogged');
                }
                //if user is logged in but he is not an admin
                else if (error.response && error.response.status === 402) {
                    navigateTo('../notadmin');
                }
                //if user is not found
                else if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                    clearControllers();
                    if (closeLinkRef.current) {
                        closeLinkRef.current.click();
                        props.refresh();
                    }
                }
                //if password is wrong
                else if (error.response && error.response.status === 300) {
                    setResponse(300);
                    setPasswordValid(false);
                }
                else {
                    console.log(error);
                }
            });
        }
        else {
            setPasswordValid(false);
        }
    }

    useEffect(() => {
        if (selectedUser != null) {
            setSelectedUser(data.find(user => user._id === selectedUser._id));
        }
    }, [data]);

    return (
        <div>
            {data != null ?
                <Table striped hover bordered>
                    <thead>
                        <tr>
                            <th>id</th><th>login</th><th>karma</th><th>created at</th><th>last logged in</th><th>is admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((user) => {
                                return <tr style={selectedUser != null && selectedUser._id === user._id ? { backgroundColor: 'lightgray' } : {}} key={user._id} onClick={() => { handleRowSelect(user) }}>
                                    <td>{user._id}</td>
                                    <td>{user.login}</td>
                                    <td>{user.karma}</td>
                                    <td>{formattedDate(user.createDate)}</td>
                                    <td>{formattedDate(user.lastLogged)}</td>
                                    <td>{user.isAdmin === true ? 'yes' : 'no'}</td>
                                </tr>;
                            })
                        }
                    </tbody>
                </Table>
                : <h1>no data</h1>}
            {
                responseMessage != '' &&
                <h4>{responseMessage}</h4>
            }
            {selectedUser != null &&
                <div>
                    <Stack direction='horizontal' gap={2}>
                        <a href="#divDelete" className="aButton">Delete user</a>
                        <a href="#divChange" className="aButton">Change user's login</a>
                        <a href="#divKarma" className="aButton">Edit karma</a>
                        <a href="#divSet" className="aButton">Set as admin/user</a>

                    </Stack>
                    {/* div showing delete user form */}
                    <div className="overlay" id="divDelete">
                        <div className="wrapper">
                            <Form noValidate validated={validated} onSubmit={(event) => handleDelete(event, selectedUser.login, selectedUser._id)}>
                                <h3>Delete user</h3>
                                <a href="#" ref={closeLinkRef} className="close" onClick={() => { clearControllers() }}>&times;</a>
                                <Form.Group controlId='formLogin'>
                                    <Form.Label>Login</Form.Label>
                                    <Form.Control
                                        value={loginController}
                                        onChange={event => setLoginController(event.target.value)}
                                        type='text'
                                        placeholder={selectedUser.login}
                                        required
                                        isInvalid={!loginValid}
                                    />
                                    {(!validated || !loginValid) && (
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid login.
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                                <Form.Group controlId='formPassword'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        value={passwordController}
                                        onChange={event => setPasswordController(event.target.value)}
                                        type='password'
                                        placeholder='Enter Password'
                                        required
                                        isInvalid={!passwordValid}
                                    />
                                    {response === 300 ?
                                        <Form.Control.Feedback type="invalid">
                                            Wrong password.
                                        </Form.Control.Feedback> : (!validated || !passwordValid) && (
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid password.
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Button className='w-100' variant='success' type='submit'>
                                    Delete
                                </Button>
                            </Form>
                        </div>
                    </div>
                    {/* div showing change user's login form */}
                    <div className="overlay" id="divChange">
                        <div className="wrapper">
                            <Form noValidate validated={validated} onSubmit={(event) => { handleLoginChange(event, selectedUser._id) }}>
                                <h3>Change user's login</h3>
                                <a href="#" ref={closeLinkRef} className="close" onClick={() => { clearControllers() }}>&times;</a>
                                <Form.Group className='mb-3' controlId='formLogin'>
                                    <Form.Label>New login</Form.Label>
                                    <Form.Control
                                        value={loginController}
                                        onChange={event => setLoginController(event.target.value)}
                                        type='text'
                                        placeholder={selectedUser.login}
                                        required
                                        isInvalid={!loginValid}
                                    />
                                    {
                                        response === 409 ?
                                            <Form.Control.Feedback type="invalid">
                                                Login is already occupied
                                            </Form.Control.Feedback> :
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a login.
                                            </Form.Control.Feedback>
                                    }
                                </Form.Group>
                                <Button className='w-100' variant='success' type='submit'>
                                    Change login
                                </Button>
                            </Form>
                        </div>
                    </div>
                    {/* div showing change user's karma form */}
                    <div className="overlay" id="divKarma">
                        <div className="wrapper">
                            <Form noValidate validated={validated} onSubmit={(event) => { handleEditKarma(event, selectedUser._id) }}>
                                <h3>Edit user's karma</h3>
                                <a href="#" ref={closeLinkRef} className="close" onClick={() => { clearControllers() }}>&times;</a>
                                <Form.Group className='mb-3' controlId='formKarma'>
                                    <Form.Label>Number of karma</Form.Label>
                                    <Form.Control
                                        value={karmaController}
                                        onChange={event => setKarmaController(event.target.value)}
                                        type='number'
                                        min='0'
                                        placeholder={selectedUser.karma}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a karma's number.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button className='w-100' variant='success' type='submit'>
                                    Change karma
                                </Button>
                            </Form>
                        </div>
                    </div>
                    {/* div showing change user's status form */}
                    <div className="overlay" id="divSet">
                        <div className="wrapper">
                            <Form noValidate validated={validated} onSubmit={(event) => { handleChangeStatus(event, selectedUser._id) }}>
                                <h3>
                                    Set {selectedUser.login} as {selectedUser.isAdmin === true ? 'user' : 'admin'}?
                                </h3>
                                <a href="#" ref={closeLinkRef} className="close" onClick={() => { clearControllers() }}>&times;</a>
                                <Form.Group controlId='formPassword'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        value={passwordController}
                                        onChange={event => setPasswordController(event.target.value)}
                                        type='password'
                                        placeholder='Enter Password'
                                        required
                                        isInvalid={!passwordValid}
                                    />
                                    {response === 300 ?
                                        <Form.Control.Feedback type="invalid">
                                            Wrong password.
                                        </Form.Control.Feedback> : (!validated || !passwordValid) && (
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid password.
                                            </Form.Control.Feedback>
                                        )}
                                </Form.Group>
                                <Button className='w-100' variant='success' type='submit'>
                                    {selectedUser.isAdmin === true ? 'Set as user' : 'Set as admin'}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

function AdminPanel() {
    const [data, setData] = useState();
    const [activeTab, setActiveTab] = useState('users');

    const navigateTo = useNavigate();

    const getPageTraffic = async () => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/adminPageTraffic', null,
            { headers: { 'Authorization': `Bearer ${token}` } }
        ).then((response) => {
            //if user is admin and there are no errors
            if (response.status === 207) {
                setData(response.data.data);
            }
        }).catch((error) => {
            //if user is not logged in
            if (error.response && error.response.status === 401) {
                navigateTo('../notlogged');
            }
            //if user is logged in but he is not an admin
            else if (error.response && error.response.status === 402) {
                navigateTo('../notadmin');
            }
            //if there are no users found
            else if (error.response && error.response.status === 410) {
                console.log(error.response);
            }
            else if (error.response && error.response.status === 500) {
                console.log(error);
            }
        });
    }
    const handleTabSelect = (selectedTab) => {
        switch (selectedTab) {
            case 'users':
                getPageTraffic();
                break;
            case 'challenges':
                //content in future
                console.log('challenges');
                break;
        }
    }
    useEffect(() => {
        getPageTraffic();
    }, []);

    return (
        <div>
            <p>Admin Panel</p>
            <Container className='pt-4 pb-5'>
                <Tabs activeKey={activeTab} onSelect={handleTabSelect} id='admin-filter-tab' className='mb-3' justify>
                    {/* shows list of registered users sorted by last time they have logged in */}
                    <Tab eventKey='users' title='users'>
                        <UsersView refresh={getPageTraffic} data={data} />
                    </Tab>
                    {/* shows list of created challenges, admin can change them using this tab */}
                    <Tab eventKey='challenges' title='challenges'>

                    </Tab>
                </Tabs>
            </Container>
            <button onClick={() => navigateTo('../')}>Main Page</button>
        </div>
    );
}

export default AdminPanel