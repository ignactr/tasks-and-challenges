import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Main() {
  const [challenges, setChallenges] = useState([]);
  const [buttonState, setButtonState] = useState(false);

  const navigateTo = useNavigate();

  const getChallenges = async () => {
    const token = localStorage.getItem('accessToken');
    await axios.post('http://localhost:5000/api/showChallenges',null,
      {headers: {'Authorization': `Bearer ${token}`}}
    ).then(response => {
      //if user is logged in and there are no errors
      if (response.status === 207) {
        setChallenges(response.data.tasks);
      }
    }).catch(error =>{
      if (error.response && error.response.status === 401) {
        navigateTo('../notlogged');
      } 
      else if (error.response && error.response.status === 500) {
       console.log(error);
      }
    });
  };

  function retry(){
    if(buttonState === true){
      setButtonState(false);
    }
    else{
      setButtonState(true);
    }
  }

  useEffect(()=>{
    getChallenges();
  }, []);

  return (
    <div>
      <button onClick={retry}>Retry</button>
      <h1>Challenges</h1>
      <h2>ilość rekordów: {challenges.length}</h2>
      <ul>
        {challenges.map(challenge => (
          <li key={challenge._id}>
            <p>id: {challenge._id}</p>
            <p>author: {challenge.author}</p>
            <p>title: {challenge.title}</p>
            <p>details: {challenge.details}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
  
export default Main