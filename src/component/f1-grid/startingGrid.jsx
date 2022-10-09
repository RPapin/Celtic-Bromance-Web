import React, { useState, useEffect } from 'react'
import GridNameplate from './GridNameplate'
import countries from "i18n-iso-countries"
import ReadData from '../../services/readData'
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import GridSpotFinder from './gridSpotFinder';


const StartingGrid = ({ isInGrid, updateJoker, seeResult, gridNextRound, waitingGrid }) => {
    const { t, } = useTranslation();
    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

    const readData = new ReadData()
    const [swapCar, setSwapCar] = useState(0)
    const [swapPoint, setSwapPoint] = useState(0)
    const [cookies,] = useCookies(['user'])
    const [isSwappingPoints, setIsSwappingPoints] = useState(false)
    const [isSwappingCar, setIsSwappingCar] = useState(false)
    const [swapPointVictimId, setSwapPointVictimId] = useState()

    const doSwap = async (action, victim) => {
        if (!isSwappingPoints && !isSwappingCar) {
            readData.postLocalApi(action, [cookies['user'], victim]).then((e) => {
                seeResult()
            })
            if (action === "swapPoint") {
                setIsSwappingPoints(true)
                setSwapPointVictimId(victim)
            } else if (action === "swapCar") {
                setIsSwappingCar(true)
            }
        }
    }

    const getJokerNumber = () => {
        readData.getLocalApi("get_param_list").then(response => {
            response.entry.forEach(driver => {
                if (driver['Steam id '] === cookies['user']) {
                    setSwapCar(driver['swapCar'])
                    setSwapPoint(driver['swapPoint'])
                    if (isSwappingPoints) {
                        setIsSwappingPoints(false)
                    }
                    if (isSwappingCar) {
                        setIsSwappingCar(false)
                    }
                }
            })
        })
        readData.postLocalApi("getSwapPointVictim", cookies['user']).then(response => {
            console.log("Your Vicitm is: " + response);
            setSwapPointVictimId(response)
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
            swapPoint={swapPoint}
            isSwappingCar={isSwappingCar}
            isSwappingPoints={isSwappingPoints}
            swapPointVictimId={swapPointVictimId}
            isInGrid={isInGrid} />
    )

    return (
        <>
            <div className="mt-5 mb-5 border border-secondary rounded-bottom rounded-3">
                <div className="mb-3 w-100 bg-secondary">
                    <h3 className="text-white pl-2 pt-2 pb-2">{t("dashboard.startingGrid")}</h3>
                </div>
                {isInGrid && <><GridSpotFinder /><hr /></>}
                <div className="container text-center d-flex flex-column align-items-center justify-content-center">
                    {!waitingGrid ?
                        <div className="container d-flex flex-column align-items-center justify-content-center">
                            {grid}
                        </div>
                        :
                        <p>{t("dashboard.waitingGrid")}</p>
                    }
                </div>
            </div>
        </>
    )
}

export default StartingGrid