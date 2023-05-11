import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Details from './Details';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function Element(props){
  const user = props.user;
  const challenge = props.challenge;
  return (
    <div>
      <p>-------------------------------</p>
      <h6>title: {challenge.title}</h6>
      <p>author: {challenge.author}</p>
      <p>details: {challenge.details}</p>
      <p>reward: {challenge.points}</p>
      {(challenge.acceptedBy != null && challenge.acceptedBy != '') && <p>claimed by: {challenge.acceptedBy}</p>}
      {(challenge.challengeState === 0 && challenge.author != user[1]) ? <button onClick={() => props.handleClaim(challenge)}>Claim</button> : (challenge.author === user[1] || challenge.acceptedBy === user[1]) && <button onClick={() => props.handleChangeState(challenge._id)}>View details</button>}
    </div>
  );
}

function ShowChallenges(props){
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState([]);
  const [filter, setFilter] = useState(0);

  const navigateTo = useNavigate();

  const yours = challenges.filter((challenge) =>{
    return challenge.author === user[1];
  });
  const available = challenges.filter(challenge =>{
    return challenge.challengeState === 0;
  });
  const handleClaim = async (challenge) => {
    const token = localStorage.getItem('accessToken');
    await axios.post('http://localhost:5000/api/handleStateChange/claim',{
      challengeId: challenge._id,
      userLogin: user[1]
    },{headers: {'Authorization': `Bearer ${token}`}}
    ).then((response)=> {
      if (response.status === 202) {
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
    const token = localStorage.getItem('accessToken');
    await axios.post('http://localhost:5000/api/showChallenges',null,
      {headers: {'Authorization': `Bearer ${token}`}}
    ).then((response) => {
      //if user is logged in and there are no errors
      if (response.status === 207) {
        setChallenges(response.data.tasks);
        getUser(response.data.userId);
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
  const getUser = async () => {
    const token = localStorage.getItem('accessToken');
    await axios.post('http://localhost:5000/api/getUserFromId',null,{headers: {'Authorization': `Bearer ${token}`}}).then((response) => {
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
    // <div>
    //   <h1>Challenges</h1>
    //   <p><button onClick={()=> {navigateTo('../User')}}>zalogowany: {user[1]}</button>
    //   <button onClick={()=>{navigateTo('../addNewChallenge')}}>+ Dodaj post</button></p>
    //   <p><button onClick={() => setFilter(1) }>Wolne</button>
    //   <button onClick={() => setFilter(2) }>Zamieszczone przez ciebie</button>
    //   <button onClick={() => setFilter(0) }>Wszystkie</button></p>
    //   <hr/>
    //   <div>
    //     {
    //       filter === 0 ? challenges.map(challenge => <Element handleChangeState={props.handleChangeState} key={challenge._id} handleClaim= {handleClaim} challenge= {challenge} user= {user}/>) : filter === 1 ? available.map(challenge => <Element handleClaim= {handleClaim} challenge= {challenge} user= {user}/>) : yours.map(challenge => <Element handleClaim= {handleClaim} challenge= {challenge} user= {user}/>)
    //     }
    //   </div>
    // </div>

    <>
      <Navbar bg='light' variant='light'>
        <Container>
          <Navbar.Brand href='#'>Tasks and Challenges</Navbar.Brand>
          <Nav className='me-auto'>
            <Nav.Link onClick={()=> {navigateTo('../User')}}>Logged in as: {user[1]}</Nav.Link>
          </Nav>
          <Button onClick={()=>{navigateTo('../addNewChallenge')}} variant='success'>+ Add challenge</Button>
        </Container>
      </Navbar>

      <Container>
        <Tabs
          defaultActiveKey='all'
          id='challenge-filter-tab'
          className='mb-3'
        >
          <Tab onClick={() => setFilter(0) } eventKey='all' title='All'>
            {
              filter === 0 ? 
              challenges.map(challenge => 
                <Element 
                  handleChangeState={props.handleChangeState} 
                  key={challenge._id} 
                  handleClaim={handleClaim} 
                  challenge={challenge} 
                  user={user}
                  />
              ) : filter === 1 ? 
              available.map(challenge => 
                <Element 
                  handleClaim={handleClaim} 
                  challenge=
                  {challenge} 
                  user={user}
                />
              ) : yours.map(challenge => 
                <Element 
                  handleClaim={handleClaim} 
                  challenge={challenge} 
                  user={user}
                />
              )
            }
          </Tab>
          <Tab onClick={() => setFilter(1) } eventKey='available' title='Available'>
            b
          </Tab>
          <Tab onClick={() => setFilter(2) } eventKey='createdbu' title='Created by you'>
            c
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}

function Main(){
  const [subPage, setSubPage] = useState(0);
  const [id, setId] = useState('');

  const handleChangeState = (id) =>{

    setSubPage(1);
    setId(id);
  }

  return (
    <>
    {subPage === 0 ? <ShowChallenges handleChangeState = {handleChangeState}/> : <Details setSubPage={setSubPage} id={id}/>}
    </>
  )
}
  
export default Main