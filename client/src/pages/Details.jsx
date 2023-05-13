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

function Details(props){
    // const [subPage, setSubPage] = useState(0); sub pages replaced by Bootstrap tabs
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
        // <div>
        //     <p>
        //         <button onClick={()=>props.setSubPage(0)}>go back</button>
        //         <button onClick={()=>setSubPage(0)}>Details</button>
        //         <button onClick={()=>setSubPage(1)}>Conversation</button>
        //     </p>
        //     {
        //     subPage === 1 ? <Conversation challengeId={props.id}/> : 
        //     <div>
        //         <h2>Details</h2>
        //         <p>author: {details.author}</p>
        //         <p>title: {details.title}</p>
        //         <p>details: {details.details}</p>
        //         <p>start date: {formattedDate(details.startDate)}</p>
        //         <p>end date: {formattedDate(details.endDate)}</p>
        //         <p>reward: {details.points}</p>
        //         <p>state: {details.challengeState === 0 ? 'available': details.challengeState === 1 ? 'claimed' : details.challengeState === 2 ? 'to verification' : details.challengeState === 3 ? 'finished' : 'expired'}</p>
        //         {(details.acceptedBy != '' && details.acceptedBy != null) && <p>Accepted By: {details.acceptedBy}</p>}
        //         {responseMessage != '' && <p>{responseMessage}</p>}

        //     </div>
        //     }
        // </div>

        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <Row>
                    <Col xs={3} className='d-flex justify-content-start align-items-end ms-2'>
                        <Button onClick={()=>props.setSubPage(0)} className='border border-3 border-secondary-subtle' variant='light'><i className='bi-arrow-left'></i> Go back</Button>
                    </Col>
                    <Col xs={6} className='d-flex justify-content-center'>
                        <div className='text-center mt-3'>
                            <h2>Challenge details</h2>
                        </div>
                    </Col>
                </Row>

                <Col className='m-3 p-4 border border-5 border-light rounded'>
                    <Tabs
                        defaultActiveKey="details"
                        id="details-tab"
                        className="mb-3"
                        justify
                    >
                        <Tab eventKey="details" title="Details">
                            <Container className='pt-3'>
                                <h3>{details.title}</h3>
                                <h6 className='text-muted'>Author: {details.author}</h6>
                                <p>{details.details}</p>

                                <Row className='text-muted'>
                                    <Col>
                                        <p>Start date: {formattedDate(details.startDate)}</p>
                                    </Col>
                                    <Col>
                                        <p className='float-end'>End date: {formattedDate(details.endDate)}</p>
                                    </Col>
                                </Row>

                                <Row className='text-muted'>
                                    <Col>
                                        <p>Reward: {details.points}</p>
                                    </Col>
                                    <Col>
                                        <p className='float-end'>
                                            State:
                                            {details.challengeState === 0 ? 
                                                ' Available': 
                                            details.challengeState === 1 ? 
                                                ' Claimed' : 
                                            details.challengeState === 2 ? 
                                                ' Pending' : // changed from "to verification"
                                            details.challengeState === 3 ? 
                                                ' Finished' : 
                                                ' Expired'
                                            }
                                        </p>
                                    </Col>
                                </Row>

                                {(details.acceptedBy != '' && details.acceptedBy != null) && 
                                    <p className='text-muted'>Accepted By: {details.acceptedBy}</p>
                                }

                                <div className='text-center'>
                                    {responseMessage != '' && 
                                        <p className='text-danger'>{responseMessage}</p>
                                    }
                                </div>
                            </Container>
                        </Tab>
                        <Tab eventKey="conv" title="Conversation">
                            <Conversation challengeId={props.id}/>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    )
}
function Conversation(props){
    const [messageController,setMessageController] = useState('') 

    // form validation
    const [validated, setValidated] = useState(false);

    // form submission should be properly handled, for now only validation is implemented
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        // <div>
        //     <h2>Conversation</h2>
        //     <p>id: {props.challengeId}</p>
        //     <form onSubmit={(event)=>{}}>
        //         Message: <input type="text" value= {messageController} onChange={(event)=>setMessageController(event.target.value)}></input>
        //         <input type="submit" value="Send"/>
        //     </form>
        // </div>

        <Container className='pt-3'>
            <h3>Write a message:</h3>
            <p className='text-muted'>ID: {props.challengeId}</p> {/* is this paragraph necessary? */}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <Form.Group className='mb-3' controlId='formMessage'>
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
        </Container>
    )
}

export default Details;