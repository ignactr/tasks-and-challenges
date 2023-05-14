import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function Conversation(props){
    const [comments, setComments] = useState([]);
    const [messageController,setMessageController] = useState('') 

    // form validation
    const [validated, setValidated] = useState(false);

    const navigateTo = useNavigate();

    const getComments = async () => {
        const token = localStorage.getItem('accessToken'); 
        await axios.post('http://localhost:5000/api/conversation/show', {
            id: props.challengeId,
        },{headers: {'Authorization': `Bearer ${token}`}}).then(response => {
            if (response.status === 200) { //success
                setComments(response.data.data);
            }
        }).catch(error => {
            if (error.response && error.response.status === 404) { //no comments found
                setComments(null);
            } 
            else if (error.response && error.response.status === 401) { //unauthorized
                navigateTo('../notlogged');
            }
            else if (error.response && error.response.status === 500) {
                //internal server error
            }
            else {
                console.log(error);
            }
        });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('accessToken');
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        await axios.post('http://localhost:5000/api/conversation/add', {
            id: props.challengeId,
            text: messageController,
        },{headers: {'Authorization': `Bearer ${token}`}}).then(response => {
            if (response.status === 200) { //comment added succesfully
                getComments();
                setMessageController('');
            }
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                //invalid data
            } 
            else if (error.response && error.response.status === 401) { //unauthorized
                navigateTo('../notlogged');
            }
            else if (error.response && error.response.status === 410) {
                //user doesn't exist (I don't know under what circumstances this could occur, but we are prepared for everything)
            }
            else if (error.response && error.response.status === 500) {
                //internal server error
            }
            else {
            console.log(error);
            }
        });

    };
    useEffect(()=>{
        getComments();
    }, []);

    return (
        <Container className='pt-3'>
            { props.acceptedBy === null ? <p>someone needs to claim this challenge first!</p> :
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <Form.Group className='mb-3' controlId='formMessage'>
                    { comments === null ? <p>no comments</p> :
                        comments.map((comment) => //you can access creation data by using comment.createDate
                            <div key={comment._id}>
                                <h6>{comment.author}</h6>
                                <p>{comment.text}</p>
                            </div>
                        )
                    }
                    <Form.Label>Message</Form.Label>
                    <Form.Control 
                        value= {messageController} 
                        onChange={(event)=>setMessageController(event.target.value)}
                        type='text' 
                        placeholder='Enter message' 
                        maxLength={100} // TBD
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid message.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button className='w-100' variant='success' type='submit'>
                    Send
                </Button>

            </Form>
            }
        </Container>
        
    )
}

export default Conversation;