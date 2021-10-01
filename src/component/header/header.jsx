import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import './header.css'
import AdminPanel from '../adminPanel/adminPanel';
import OlderResult from '../olderResult/olderResult';
import { useCookies } from 'react-cookie';
import ModalConnect from '../modals/modalConnect';


const Header = ({admin, setAdmin, olderResult, setIsOlderResult}) => {
    const [logIn, setLogIn] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const logOut = () => {
        removeCookie('user')
        removeCookie('name')
    }
    return (

    <div className={'header'}>
        <img src={'../CelticBromanceLogoFINAL.png'} className='topLogo' alt="celtic-bromance.png" ></img>
        <h1 className="title">Celtic Bromance Championship</h1>
        {cookies['name'] && <div className="me-1">{cookies['name']}</div>}
        <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
                Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {olderResult ? <Dropdown.Item onClick={() => setIsOlderResult(!olderResult)}>View current championship</Dropdown.Item> : <Dropdown.Item onClick={() => setIsOlderResult(!olderResult)}>View older results</Dropdown.Item>}
                {cookies['name'] ? 
                <>
                    <Dropdown.Item onClick={() => logOut()}>Log out</Dropdown.Item>
                </> :
                <>
                    <Dropdown.Item onClick={() => setLogIn(true)}>Log In</Dropdown.Item>
                </> }
            </Dropdown.Menu>
        </Dropdown>

        {
            logIn && 
            <ModalConnect setAdmin={setAdmin}/>
        }

    </div>
    )

}

export default Header