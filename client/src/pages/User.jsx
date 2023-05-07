import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DeleteUser(){
    const [passwordController, setPasswordController]= useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const navigateTo = useNavigate();
    
    const handleDelete = async (event) =>{
        event.preventDefault();
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/editUser/delete', {
            password: passwordController
            },{headers: {'Authorization': `Bearer ${token}`}}).then(response => {
                if (response.status === 205) {
                    localStorage.removeItem('accessToken');
                    navigateTo('../login');
                }
            }).catch((error) => {
                if (error.response && error.response.status === 410) {
                    setResponseMessage('No user found');
                } 
                else if (error.response && error.response.status === 510) {
                    setResponseMessage('Invalid password or hash');
                }
                else if (error.response && error.response.status === 300) {
                    setResponseMessage('Wrong password');
                }
                else if (error.response && error.response.status === 401) {
                    navigateTo('../notlogged');
                }
                else {
                    console.log(error);
                }
            }
         );
    }
    return(
        <form onSubmit={(event)=>handleDelete(event)}>
            password: <input type="text" value={passwordController} onChange={(event)=>setPasswordController(event.target.value)}></input>
            <input type="submit" value="delete"/>
            {responseMessage != '' && <p>{responseMessage}</p>}
        </form>
    );
}
function ChangePassword(){
    return(
        <div>change password</div>
    );
}
function User(){
    const [userInfo, setUserInfo] = useState({});
    const [pageState, setPageState] = useState(0);

    const navigateTo = useNavigate();

    const getUserInfo = async () =>{
        const token= localStorage.getItem('accessToken');
        await axios.post('http://localhost:5000/api/getUserFromId/extended',null,{headers: {'Authorization': `Bearer ${token}`}}).then((response) => {
        if (response.status === 207) {
            const createDate= new Date(response.data.createDate);
            const formattedCreateDate = `${createDate.getDate().toString().padStart(2, '0')}/${(createDate.getMonth()+1).toString().padStart(2, '0')}/${createDate.getFullYear()} ${createDate.getHours().toString().padStart(2, '0')}:${createDate.getMinutes().toString().padStart(2, '0')}:${createDate.getSeconds().toString().padStart(2, '0')}`;
            const lastLogged= new Date(response.data.lastLogged);
            const formattedLastLogged = `${lastLogged.getDate().toString().padStart(2, '0')}/${(lastLogged.getMonth()+1).toString().padStart(2, '0')}/${lastLogged.getFullYear()} ${lastLogged.getHours().toString().padStart(2, '0')}:${lastLogged.getMinutes().toString().padStart(2, '0')}:${lastLogged.getSeconds().toString().padStart(2, '0')}`;
            setUserInfo({id: response.data.userId, login: response.data.login, karma: response.data.karma, createDate: formattedCreateDate, lastLogged: formattedLastLogged});
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
    const logOut = () =>{
        localStorage.removeItem('accessToken');
        navigateTo('../login');
    }
    useEffect(()=>{
        getUserInfo();
    }, []);

    return (
        <div>
            <button onClick={()=>{navigateTo('../')}}>back to main page</button>
            <h2>User info</h2>
            <h6>login: {userInfo['login']}</h6>
            <h6>user's karma: {userInfo['karma']}</h6>
            <h6>last logged in: {userInfo['lastLogged']}</h6>
            <h6>registered in: {userInfo['createDate']}</h6>
            <p><button onClick={()=>{logOut()}}>log out</button><button onClick={()=>{setPageState(2)}}>change password</button><button onClick={()=>{setPageState(1)}}>delete account</button></p>
            {
                pageState === 1 ? <DeleteUser /> : pageState === 2 && <ChangePassword />
            }
        </div>
    );
}

export default User;