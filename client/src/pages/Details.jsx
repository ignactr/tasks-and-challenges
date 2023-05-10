import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Details(props){
    const [subPage, setSubPage] = useState(0);
    const [details, setDetails] = useState({});
    const [responseMessage, setResponseMessage] = useState('');

    const navigateTo = useNavigate();

    const formattedDate= (date) =>{
        const dateToFormat= new Date(date);
        const formattedDate = `${dateToFormat.getDate().toString().padStart(2, '0')}/${(dateToFormat.getMonth()+1).toString().padStart(2, '0')}/${dateToFormat.getFullYear()} ${dateToFormat.getHours().toString().padStart(2, '0')}:${dateToFormat.getMinutes().toString().padStart(2, '0')}:${dateToFormat.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate;
    }

    const getDetails= async (id) => {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/details/details',{id: id},
        {headers: {'Authorization': `Bearer ${token}`}}
        ).then((response) => {
        //if user is logged in and there are no errors
        if (response.status === 207) {
            setDetails(response.data);
        }
        }).catch((error) =>{
        //if user is not authorized
        if (error.response && error.response.status === 401) {
            navigateTo('../notlogged');
        } 
        else if (error.response && error.response.status === 410) {
            setResponseMessage('No challenge found');
        }
        else if (error.response && error.response.status === 500) {
            setResponseMessage('Internal server error');
        }
    });
    }
    useEffect(()=>{
        getDetails(props.id);
    }, []);

    return (
        <div>
            <p><button onClick={()=>props.setSubPage(0)}>go back</button><button onClick={()=>setSubPage(0)}>Details</button><button onClick={()=>setSubPage(1)}>Conversation</button></p>
            {
            subPage === 1 ? <Conversation challengeId={props.id}/> : 
            <div>
                <h2>Details</h2>
                <p>author: {details.author}</p>
                <p>title: {details.title}</p>
                <p>details: {details.details}</p>
                <p>start date: {formattedDate(details.startDate)}</p>
                <p>end date: {formattedDate(details.endDate)}</p>
                <p>reward: {details.points}</p>
                <p>state: {details.challengeState === 0 ? 'available': details.challengeState === 1 ? 'claimed' : details.challengeState === 2 ? 'to verification' : details.challengeState === 3 ? 'finished' : 'expired'}</p>
                {(details.acceptedBy != '' && details.acceptedBy != null) && <p>Accepted By: {details.acceptedBy}</p>}
                {responseMessage != '' && <p>{responseMessage}</p>}

            </div>
            }
        </div>
    )
}
function Conversation(props){
    const [messageController,setMessageController] = useState('') 

    return (
        <div>
            <h2>Conversation</h2>
            <p>id: {props.challengeId}</p>
            <form onSubmit={(event)=>{}}>
                Message: <input type="text" value= {messageController} onChange={(event)=>setMessageController(event.target.value)}></input>
                <input type="submit" value="Send"/>
            </form>
        </div>
    )
}

export default Details;