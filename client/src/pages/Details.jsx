import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Details(props){
    return (
        <div>
            <p><button onClick={()=>props.setSubPage(0)}>go back</button></p>
            <p>details id: {props.id}</p>
        </div>
    )
}

export default Details;