import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Element(props){
  const user = props.user;
  const challenge = props.challenge;
  return (
    <div key={challenge._id}>
      <p>-------------------------------</p>
      <p>author: {challenge.author}</p>
      <p>title: {challenge.title}</p>
      <p>details: {challenge.details}</p>
      <p>reward: {challenge.points}</p>
      {(challenge.acceptedBy != null && challenge.acceptedBy != '') && <p>claimed by: {challenge.acceptedBy}</p>}
      {(challenge.challengeState === 0 && challenge.author != user[1]) ? <button onClick={() => props.handleClaim(challenge)}>Claim</button> : (challenge.author === user[1] || challenge.acceptedBy === user[1]) && <button>View details</button>}
    </div>
  );
}

function Main() {
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState([]);
  const [filter, setFilter] = useState(0);

  const navigateTo = useNavigate();
  const token = localStorage.getItem('accessToken');

  const yours = challenges.filter((challenge) =>{
    return challenge.author === user[1];
  });
  const available = challenges.filter(challenge =>{
    return challenge.challengeState === 0;
  });
  const handleClaim = async (challenge) => {
    await axios.post('http://localhost:5000/api/handleStateChange/claim',{
      challengeId: challenge._id,
      userLogin: user[1]
    },{headers: {'Authorization': `Bearer ${token}`}}
    ).then((response)=> {
      if (response.status === 202) {
        console.log('updated');
        getChallenges();
      }
    }).catch((error) =>{
      if (error.response && error.response.status === 401) {
        navigateTo('../notlogged');
      } else if (error.response && error.response.status === 500) {
        console.log(error);
       }
    });
  }
  const getChallenges = async () => {
    await axios.post('http://localhost:5000/api/showChallenges',null,
      {headers: {'Authorization': `Bearer ${token}`}}
    ).then((response) => {
      //if user is logged in and there are no errors
      if (response.status === 207) {
        setChallenges(response.data.tasks);
        getUserName(response.data.userId);
      }
    }).catch((error) =>{
      //if user is not authorized
      if (error.response && error.response.status === 401) {
        navigateTo('../notlogged');
      } 
      else if (error.response && error.response.status === 500) {
       console.log(error);
      }
    });
  };
  const getUserName = async () => {
    await axios.post('http://localhost:5000/api/getNameFromId',null,{headers: {'Authorization': `Bearer ${token}`}}).then((response) => {
      if (response.status === 207) {
        setUser([response.data.userId,response.data.login]);
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
  useEffect(()=>{
    getChallenges();
  }, []);

  return (
    <div>
      <h1>Challenges</h1>
      <h2>ilość rekordów: {challenges.length}</h2>
      <p><button>zalogowany: {user[1]}</button><button onClick={()=>{navigateTo('../addNewChallenge')}}>+ Dodaj post</button></p>
      <p><button onClick={() => setFilter(1) }>Wolne</button><button onClick={() => setFilter(2) }>Zamieszczone przez ciebie</button><button onClick={() => setFilter(0) }>Wszystkie</button></p>
      <hr/>
      <div>
        {
          filter === 0 ? challenges.map(challenge => <Element handleClaim= {handleClaim} challenge= {challenge} user= {user}/>) : filter === 1 ? available.map(challenge => <Element handleClaim= {handleClaim} challenge= {challenge} user= {user}/>) : yours.map(challenge => <Element handleClaim= {handleClaim} challenge= {challenge} user= {user}/>)
        }
      </div>
    </div>
  )
}
  
export default Main