import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';

function Conversation(props){
    const [comments, setComments] = useState([]);
    const [messageController,setMessageController] = useState('');

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
        <Container className='h-50 pt-3'>
            { props.acceptedBy === null ? <p className='text-muted text-center'>Someone needs to claim this challenge first!</p> :
            <>
                <div style={{maxHeight: '30rem'}} className='overflow-auto d-flex flex-column-reverse'>
                    <div>
                        { comments === null ? 
                            <p className='text-center text-muted'>No comments yet.</p> 
                        :
                            comments.map((comment) => //you can access creation data by using comment.createDate
                                <div className='w-50 bg-success p-2 my-2 rounded text-white' key={comment._id}>
                                    <h6>{comment.author}</h6>
                                    {comment.text}
                                </div>
                            )
                        }
                    </div>
                </div>

                <Form className='mt-3' noValidate onSubmit={handleSubmit}>
                    
                    <Form.Group className='mb-3' controlId='formMessage'>
                        <Form.Label>Message</Form.Label>
                        <InputGroup>
                            <Form.Control 
                                value= {messageController} 
                                onChange={(event)=>setMessageController(event.target.value)}
                                type='text' 
                                placeholder='Enter message' 
                                maxLength={500} // TBD
                                required 
                            />
                            <Button variant='success' type='submit'>
                                <i className='bi-send-fill'></i>
                            </Button>
                        </InputGroup>
                    </Form.Group>

                </Form>
            </>
            }
        </Container>
    )
}

export default Conversation;