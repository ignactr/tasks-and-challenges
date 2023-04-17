import React, {useEffect, useState} from 'react';
import axios from 'axios';

function Main() {
  const [challenges, setChallenges] = useState([]);
  const [buttonState, setButtonState] = useState(false);

  const getChallenges = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post('http://localhost:5000/api/showChallenges',null,{headers: {'Authorization': `Bearer ${token}`}});
      setChallenges(response.data);
    } catch (error) {
      console.error('There was an error fetching the challenges:', error);
    }
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