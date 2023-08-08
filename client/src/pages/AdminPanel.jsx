import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Button from "react-bootstrap/Button";

function AdminPanel(){
    const [data, setData] = useState();
    const [activeTab, setActiveTab] = useState('users');
    const [selectedUser, setSelectedUser] = useState(null);

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
    const handleRowSelect = (user) =>{
        if(selectedUser != null){
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
                            <Stack direction='horizontal' gap={2}>
                                <Button variant='light'>Delete user</Button>
                                <Button variant='light'>Change user's login</Button>
                                <Button variant='light'>Edit karma</Button>
                                <Button variant='light'>set as admin/user</Button>

                            </Stack>
                        }
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