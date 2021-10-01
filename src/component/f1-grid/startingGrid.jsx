import React, { useState, useEffect } from 'react'
import ReadData from '../../services/readData'
import Button from 'react-bootstrap/Button';
import './formula1.css'
import NewNameplate from './formula1'
import ChampionnshipResult from '../championnshipResult/championnshipResult';
import ModalCheck from '../modals/modalCheck';


const StartingGrid = ({gridNextRound}) => {
    const [loading, setLoading] = useState(true)
    const [currentGrid, setCurrentGrid] = useState(gridNextRound)
    useEffect( () => {
        document.getElementById('starting-grid').innerHTML = null;
        if(gridNextRound !== null){
            setCurrentGrid(gridNextRound)
            gridNextRound.forEach((element, i) => {
    
                const j = i +1 
                const driverInfo = {
                    "grid": {
                        "position": j,
                        "state": "ontrack"
                    },
                    "color": "williams",
                    "firstname": element.firstName,
                    "lastname": element.lastName,
                    "constructor": element.car,
                    "number": element.ballast,
                    "abbreviation": "KUB",
                    "nationality": "pl"
                }
                NewNameplate(driverInfo, "#starting-grid");
            });
        }
    
    }, [gridNextRound])
    return (
        <div id="starting-grid"></div>
    )
}

export default StartingGrid