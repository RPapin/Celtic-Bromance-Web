import React, { useState, useEffect } from 'react'
import './formula1.css'
import NewNameplate from './formula1'
import countries from "i18n-iso-countries"
// var countries = require("i18n-iso-countries");
// 

const StartingGrid = ({gridNextRound}) => {
    
    const [, setCurrentGrid] = useState(gridNextRound)
    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

    const teamsColor = ["mercedes",	"ferrari", "redbull", "alpine", "haas", "alphatauri", "williams", "astonmartin", "alfaromeo", "mclaren", "myteam"]
        // {
        //     "color" : "mercedes",
        //     "cars": [""]
        //     },

    useEffect( () => {
        document.getElementById('starting-grid').innerHTML = null;
        if(gridNextRound !== null){
            setCurrentGrid(gridNextRound)
            gridNextRound.forEach((element, i) => {
                //Get the abbr nationanilty
                const natAbbr = countries.getAlpha2Code(element.nationality, "en") ? countries.getAlpha2Code(element.nationality, "en").toLocaleLowerCase() : 'pl'
                //get colors
                const vmax = teamsColor.length - 1
                const generated = Math.floor(Math.random()*(vmax - 0 + 1) + 0);
                const j = i +1 
                const driverInfo = {
                    "grid": {
                        "position": j,
                        "state": "ontrack"
                    },
                    "color": teamsColor[generated],
                    "firstname": element.firstName,
                    "lastname": element.lastName,
                    "abbreviation": "KUB",
                    "nationality": natAbbr
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