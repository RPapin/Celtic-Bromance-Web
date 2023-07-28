import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import './header.css'
import { useCookies } from 'react-cookie';
import ModalConnect from '../modals/modalConnect';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../languageSwitcher/languageSwitcher';


const Header = ({setAdmin, olderResult, setIsOlderResult}) => {
    
    const { t } = useTranslation();
    const [logIn, setLogIn] = useState(false)
    const [cookies, removeCookie] = useCookies(['name']);

    const logOut = () => {
        setLogIn(false)
        removeCookie('user')
        removeCookie('name')
        setAdmin(false)
        localStorage.setItem('admin', false);
    }
    useEffect( () => {
    }, [logIn])
    return (
    <div className={'header'}>
        <img src={'../CelticBromanceLogoFINAL.png'} className='topLogo' alt="celtic-bromance.png" ></img>
        <h1 className="title">Celtic Bromance Championship</h1>
        {cookies['name'] && <h3 className="me-1">{cookies['name']}</h3>}
        <LanguageSwitcher></LanguageSwitcher>
        <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
                Menu
            </Dropdown.Toggle>

            <Dropdown.Menu className="menu-item-break-space">
                {olderResult ? <Dropdown.Item onClick={() => setIsOlderResult(!olderResult)}>{t("menu.currentResult")}</Dropdown.Item> : <Dropdown.Item onClick={() => setIsOlderResult(!olderResult)}>{t("menu.olderResult")}</Dropdown.Item>}
                {cookies['name'] ? 
                <>
                    <Dropdown.Item onClick={() => logOut()}>{t("menu.logout")}</Dropdown.Item>
                </> :
                <>
                    <Dropdown.Item onClick={() => setLogIn(true)}>{t("menu.login")}</Dropdown.Item>
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