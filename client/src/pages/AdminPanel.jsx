import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Button from "react-bootstrap/Button";
import '../custom.css';

function UsersView(props){
    const [selectedUser, setSelectedUser] = useState(null);

    const data = props.data;
    const handleRowSelect = (user) =>{
        if(selectedUser != null && user._id === selectedUser._id){
            setSelectedUser(null);
        }
        else{
            setSelectedUser(user);
        }
    }
    const formattedDate= (date) =>{
        const dateToFormat= new Date(date);
        const formattedDate = `${dateToFormat.getDate().toString().padStart(2, '0')}/${(dateToFormat.getMonth()+1).toString().padStart(2, '0')}/${dateToFormat.getFullYear()} ${dateToFormat.getHours().toString().padStart(2, '0')}:${dateToFormat.getMinutes().toString().padStart(2, '0')}:${dateToFormat.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate;
    }

    return (
        <div>
            <Table striped hover bordered>
                <thead>
                    <tr>
                        <th>id</th><th>login</th><th>karma</th><th>created at</th><th>last logged in</th><th>is admin</th>
                    </tr>
                </thead>
                <tbody>
                {data != null ? data.map((user) => {
                    return <tr style={selectedUser != null && selectedUser._id === user._id ? {backgroundColor: 'lightgray'} : {}} key={user._id} onClick={()=>{handleRowSelect(user)}}>
                                <td>{user._id}</td>
                                <td>{user.login}</td>
                                <td>{user.karma}</td>
                                <td>{formattedDate(user.createDate)}</td>
                                <td>{formattedDate(user.lastLogged)}</td>
                                <td>{user.isAdmin === true ? 'yes' : 'no'}</td>
                            </tr>;
                    }) : <h1>no data</h1>}
                </tbody>
            </Table>
            { selectedUser != null && 
                <div>
                    <Stack direction='horizontal' gap={2}>
                        <a href="#divDelete" className="aButton">Delete user</a>
                        <a href="#divChange" className="aButton">Change user's login</a>
                        <a href="#divKarma" className="aButton">Edit karma</a>
                        <a href="#divSet" className="aButton">Set as admin/user</a>

                    </Stack>
                    <div className="overlay" id="divDelete">
                        <div className="wrapper">
                            <h3>Delete user</h3>
                            <a href="#" className="close">&times;</a>
                            <label>password: </label>
                            <input type="text"></input><br/>
                            <label>user's login: </label>
                            <input type="text" placeholder={selectedUser.login}></input><br/>
                            <input type="submit" value="Delete" />
                        </div>
                    </div>
                    <div className="overlay" id="divChange">
                        <div className="wrapper">
                            <h3>Change user's login</h3>
                            <a href="#" className="close">&times;</a>
                            <label>new login: </label>
                            <input type="text"></input><br/>
                            <input type="submit" value="Change login" />
                        </div>
                    </div>
                    <div className="overlay" id="divKarma">
                        <div className="wrapper">
                            <h3>Edit karma</h3>
                            <a href="#" className="close">&times;</a>
                            <label>Number of karma: </label>
                            <input type="number" placeholder={selectedUser.karma}></input><br/>
                            <input type="submit" value="Change karma" />
                        </div>
                    </div>
                    <div className="overlay" id="divSet">
                        <div className="wrapper">
                            <h3>Set {selectedUser.login} as {selectedUser.isAdmin === true ? 'user' : 'admin'}?</h3>
                            <a href="#" className="close">&times;</a>
                            <label>password: </label>
                            <input type="text"></input><br/>
                            <input type="submit" value={selectedUser.isAdmin === true ? 'Set as user' : 'Set as admin'} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

function AdminPanel(){
    const [data, setData] = useState();
    const [activeTab, setActiveTab] = useState('users');

    const navigateTo = useNavigate();

    const getPageTraffic = async () => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/adminPageTraffic',null,
            {headers: {'Authorization': `Bearer ${token}`}}
        ).then((response) => {
            //if user is admin and there are no errors
            if (response.status === 207) {
                setData(response.data.data);
            }
        }).catch((error) =>{
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
    useEffect(()=>{
        getPageTraffic();
    },[]);

    return(
        <div>
            <p>Admin Panel</p>
            <Container className='pt-4 pb-5'>
                <Tabs activeKey={activeTab} onSelect={handleTabSelect} id='admin-filter-tab' className='mb-3' justify>
                    {/* shows list of registered users sorted by last time they have logged in */}
                    <Tab eventKey='users' title='users'>
                        <UsersView data= {data} />
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