import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPanel(){
    const [pageTraffic, setPageTraffic] = useState();

    const navigateTo = useNavigate();

    const getPageTraffic = async () => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/adminPageTraffic',null,
            {headers: {'Authorization': `Bearer ${token}`}}
        ).then((response) => {
            //if user is admin and there are no errors
            if (response.status === 207) {
                setPageTraffic(response.data);
                console.log(pageTraffic);
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
    useEffect(()=>{
        getPageTraffic();
    },[]);

    return(
        <div>
            <p>Admin Panel</p>
            <ul>
                {pageTraffic.map((element) => {
                    return <li>{element.login}</li>;
                })}
            </ul>
            <button onClick={() => navigateTo('../')}>Main Page</button>
        </div>
    );
}

export default AdminPanel