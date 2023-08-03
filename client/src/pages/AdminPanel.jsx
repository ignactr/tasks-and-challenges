import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

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

    return(
        <div>
            <p>Admin Panel</p>
            <Container className='pt-4 pb-5'>
                <Tabs activeKey={activeTab} onSelect={handleTabSelect} id='admin-filter-tab' className='mb-3' justify>
                    {/* shows list of registered users sorted by last time they have logged in */}
                    <Tab eventKey='users' title='users'>
                        <ul>
                            {data != null ? data.map((user) => {
                                return <li key={user._id}><b>{user.login}</b> karma: {user.karma} account created: {user.createDate} last logged: {user.lastLogged}</li>;
                            }) : <h1>no data</h1>}
                        </ul>
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