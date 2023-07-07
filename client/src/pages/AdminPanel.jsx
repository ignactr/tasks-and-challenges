import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel(){

    const navigateTo = useNavigate();

    return(
        <div>
            <p>Admin Panel</p>
            <button onClick={()=>navigateTo('../')}>Main Page</button>
        </div>
    );
}

export default AdminPanel