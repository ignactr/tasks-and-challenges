import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddNewChallenge() {
    const [user, setUser] = useState([]);
    const [titleController, setTitleController] = useState('');
    const [detailsController, setDetailsController] = useState('');
    const [pointsController, setPointsController] = useState(20);
    const [pointsWarning, setPointsWarning] = useState('');

    const navigateTo = useNavigate();

    const getUserName = async () => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/getNameFromId',null,{headers: {'Authorization': `Bearer ${token}`}}).then((response) => {
        if (response.status === 207) {
            setUser([response.data.userId,response.data.login,response.data.karma]);
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
    const pointsChange = (event) => {
        //need fix
        setPointsController(event.target.value);
        if(user[2] <= pointsController-20){
            setPointsWarning('Value bigger than your karma minus 20')
        }
        else{
            setPointsWarning('')
        }
    }
    const handleSubmit = () => {
        if(user[2] <= pointsController-20){
            
        }
    }
    useEffect(()=>{
        getUserName();
      }, []);

    return (
        <div>
            <h2>Add new Challenge</h2>
            <b>karma of user {user[1]}: {user[2]}</b>
            <form onSubmit={(event) => handleSubmit(event)}>
            Title: <input value={titleController} onChange={event => setTitleController(event.target.value)} /><br/>
            Details: <input value={detailsController} onChange={event => setDetailsController(event.target.value)} /><br/>
            Reward: <input type="number" value={pointsController} onChange={event => pointsChange(event)} />{pointsWarning}<br/>
                <input type="submit" value="Add Challenge"/>
            </form>
        </div>
    );
}

export default AddNewChallenge;