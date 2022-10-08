import React, { useState, useEffect } from 'react'
import './formula1.css'
import GridNameplate from './GridNameplate'
import countries from "i18n-iso-countries"

const StartingGrid = ({gridNextRound}) => {
    
    const [grid, setGrid] = useState([]);
    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

    useEffect(() => {
        setGrid([]);
        if(gridNextRound) {
        gridNextRound.forEach((element, i) => {
            const natAbbr = countries.getAlpha2Code(element.nationality, "en") ? countries.getAlpha2Code(element.nationality, "en").toLocaleLowerCase() : 'pl'
            const driverInfo = {
                "grid": {
                    "position": i+1,
                    "state": "ontrack"
                },
                "firstName": element.firstName,
                "lastName": element.lastName,
                "constructor": element.car,
                "number": element.ballast,
                "nationality": natAbbr
            };
            setGrid(current => [...current,<GridNameplate driverInfo={driverInfo} />]);
        })
    }
    }, [gridNextRound])

    return (
        <div className="starting-grid">
            {grid}
        </div>

    )
}

export default StartingGrid