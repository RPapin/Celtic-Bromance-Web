import React, { useState, useEffect } from 'react'
import './formula1.css'
import GridNameplate from './GridNameplate'
import countries from "i18n-iso-countries"
import ReadData from '../../services/readData'
import { useCookies } from 'react-cookie';


const StartingGrid = ({ updateJoker, seeResult, gridNextRound }) => {

    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

    const readData = new ReadData()
    const [swapCar, setSwapCar] = useState(0)
    const [swapPoint, setSwapPoint] = useState(0)
    const [cookies,] = useCookies(['user'])



    const doSwap = async (action, victim) => {
        readData.postLocalApi(action, [cookies['user'], victim]).then((e) => {
            seeResult()
        })
    }

    const getJokerNumber = () => {
        readData.getLocalApi("get_param_list").then(response => {
            response.entry.forEach(driver => {
                if (driver['Steam id '] === cookies['user']) {
                    setSwapCar(driver['swapCar'])
                    setSwapPoint(driver['swapPoint'])
                    console.log("Swap Car: " + driver['swapCar'])
                }
            })
        })
    }

    useEffect(() => {
        getJokerNumber();
    }, [updateJoker])

    const grid = gridNextRound.map((element, i) =>
        <GridNameplate
            key={element.playerID}
            doSwap={doSwap}
            driverInfo={{
                "grid": {
                    "position": i + 1,
                    "state": "ontrack"
                },
                "firstName": element.firstName,
                "lastName": element.lastName,
                "constructor": element.car,
                "number": element.ballast,
                "playerId": element.playerID,
                "nationality": countries.getAlpha2Code(element.nationality, "en") ? countries.getAlpha2Code(element.nationality, "en").toLocaleLowerCase() : 'pl'
            }}
            seeResult={seeResult}
            swapCar={swapCar}
            swapPoint={swapPoint} />
    )

    return (
        <>
            
                <div className="starting-grid">
                    {grid}
                </div>
            
        </>
    )
}

export default StartingGrid