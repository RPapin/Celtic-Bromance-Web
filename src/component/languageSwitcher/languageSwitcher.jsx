import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import './languageSwitcher.css'
import { useCookies } from 'react-cookie';
import ModalConnect from '../modals/modalConnect';
import { useTranslation } from 'react-i18next';


const LanguageSwitcher = ({}) => {
    
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language)

    const changeLanguage = (e) => {
        if(e.target.checked){
            setLanguage('en')
            i18n.changeLanguage('en');
        } else {
            setLanguage('fr')
            i18n.changeLanguage('fr');
        }
    }

    // useEffect( () => { 
    //     console.log('language ' + language )
    //     console.log('i18n.language ' + i18n.language )
    // })
    return (
        <div className='flexbox'>
            <img src={'../france.png'} className='languageLogo' id="leftFlag" alt="celtic-bromance.png" ></img>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={e => changeLanguage(e)} checked={i18n.language == 'en'}/>
            </div>
            <img src={'../united_kingdom_great_britain.png'} className='languageLogo' alt="celtic-bromance.png" ></img>
        </div>
    )
}

export default LanguageSwitcher