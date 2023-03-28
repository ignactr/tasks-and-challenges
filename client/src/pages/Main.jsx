import React, {useEffect, useState} from 'react';

function Main() {
  const [challenges, setChallenges] = useState([]);
  const [buttonState, setButtonState] = useState(false);

  useEffect(()=>{
    fetch('/api/showChallenges').then(resonse=>Response.json()).then(data => setChallenges(data.docs)).catch(error => console.error(error));
  }, []);

  function retry(){
    if(buttonState === true){
      setButtonState(false);
    }
    else{
      setButtonState(true);
    }
  }

  return (
    <div>
      <button onClick={retry}>Retry</button>
      <h1>Challenges</h1>
      <h2>ilość rekordów: {challenges.length}</h2>
      <ul>
        {challenges.map(challenge => (
          <li key={challenge._id}>
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