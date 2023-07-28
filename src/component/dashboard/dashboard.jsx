/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react'
import ReadData from '../../services/readData'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import './dashboard.css'
import ChampionnshipResult from '../championnshipResult/championnshipResult';
import WheelCustomEvent from '../wheelCustomEvent/wheelCustomEvent';
import StartingGrid from '../f1-grid/startingGrid';
import { useCookies } from 'react-cookie';
import ModalCheck from '../modals/modalCheck';
import AdminParameters from '../adminParameters/adminParameters';
import ModalServerInfo from '../modals/modalServerInfo';
import ModalTutorial from '../modals/modalTutorial';
import CountDownTimer from '../countdownTimer/countdownTimer';
import { useTranslation } from 'react-i18next';
import NextRoundTrackInfo from './NextRoundTrackInfo/NextRoundTrackInfo';
import CustomEvent from "./customEvent/CustomEvent";

const Dashboard = ({ admin }) => {
    const { t, } = useTranslation();
    const readData = new ReadData()

    const [cookies,] = useCookies(['user']);
    const [infoNextRound, setInfoNextRound] = useState()
    const [gridNextRound, setGridNextRound] = useState()
    const [newResult, setNewResult] = useState(false)
    const [fullResult, setFullResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [serverInfo, setServerInfo] = useState(false)
    const [serverStatus, setServerStatus] = useState(false)
    const [updateJoker, setUpdateJoker] = useState(0)
    const [modalInfo, setModalInfo] = useState(false)
    const [waitingGrid, setWaitingGrid] = useState(false)
    const [showWheel, setShowWheel] = useState(false)
    const [showTutorial, setShowTutorial] = useState(false)
    const [determinedWinner, setDeterminedWinner] = useState(false)
    const [isAlreadyEventCreated, setIsAlreadyEventCreated] = useState(false)
    const [countdownState, setCountdown] = useState(false)
    const [swapModal, setSwapModal] = useState(false)
    const [swapModalText, setSwapModalText] = useState("")
    const isInGrid = useRef(false)


    const checkIsIngrid = () => {
        if (gridNextRound) {
            const userIngrid = gridNextRound.find(element => element.playerID === cookies['user']);
            isInGrid.current = userIngrid !== undefined;
        }
    }

    const getNextRoundInfo = (nextRoundInfo) => {
        const eventInfo = JSON.parse(JSON.stringify(nextRoundInfo.eventInfo))
        const gridInfo = JSON.parse(JSON.stringify(nextRoundInfo.usersInfo.usersInfo))
        setGridNextRound(gridInfo)
        setInfoNextRound(eventInfo)
        setNewResult(nextRoundInfo.foundNewResults)
        //refresh grid
        setUpdateJoker((updateJoker) => updateJoker + 1);
        setWaitingGrid(nextRoundInfo["gridStatus"] !== "READY")
    }

    const startChampionnship = async () => {
        let firstRoundInfo = await readData.getLocalApi("start_championnship")
        if (firstRoundInfo) {
            getNextRoundInfo(firstRoundInfo)
            setServerInfo(true)
        } else setServerInfo(false)
    }
    const launchServer = async () => {
        let serverStatus = await readData.getLocalApi("launch_server")
        setServerStatus(serverStatus['serverStatus'])
    }
    const shutDownServer = async () => {
        let serverStatus = await readData.getLocalApi("shutdown_server")
        setServerStatus(serverStatus['serverStatus'])
    }
    const newDraw = async () => {
        let allInfo = await readData.getLocalApi("new_draw")
        if (allInfo) {
            getNextRoundInfo(allInfo)
        } else setServerInfo(false)
    }
    const seeResult = async () => {
        setLoading(true)
        let allInfo = await readData.getLocalApi("display_result")
        if (allInfo) {
            if (allInfo['nextRoundInfo']) {
                allInfo['nextRoundInfo']['foundNewResults'] = allInfo['foundNewResults']
                getNextRoundInfo(allInfo['nextRoundInfo'])
            }
            setFullResult(allInfo['standings'])
            setServerInfo(true)
            setServerStatus(allInfo['serverStatus'])
            //refresh grid
            setUpdateJoker((updateJoker) => updateJoker + 1);
        } else setServerInfo(false)
    }
    const resetChampionnship = async () => {
        let resetStatus = await readData.getLocalApi("reset_championnship")
        if (resetStatus) {
            setGridNextRound(null)
            setInfoNextRound(null)
            setFullResult(null)
            setNewResult('Championship has been reset')
            setServerInfo(true)
        } else setServerInfo(false)
    }
    const registerToSSE = async () => {
        const url = await readData.getTunnelUrl()
        const eventSource = new EventSource(url + "events");
        eventSource.addEventListener("dataUpdate", e => {
            console.log("dataUpdate")
            const result = JSON.parse(e.data)
            console.log(result)
            const sizeNextRoundInfo = Object.keys(result['nextRoundInfo']).length;
            if (sizeNextRoundInfo !== 0) getNextRoundInfo(result['nextRoundInfo'])
            if (result['gridStatus'].length !== 0)setWaitingGrid(result['gridStatus'] !== "READY")
            setFullResult(result['standings'])
            setServerInfo(true)
            setServerStatus(result['serverStatus'])
        });
        eventSource.addEventListener("updateServerStatus", e => {
            const result = JSON.parse(e.data)
            setServerStatus(result['serverStatus'])
        });
        eventSource.addEventListener("newDraw", e => {
            console.log('newDraw sse')
            const result = JSON.parse(e.data)
            getNextRoundInfo(result)
            //refresh grid
            setUpdateJoker((updateJoker) => updateJoker + 1);
        });
        eventSource.addEventListener("startCountdown", e => {
            let countdownSec = JSON.parse(e.data)
            startCountdown(countdownSec)
        });
        eventSource.addEventListener("stopCountdown", () => {
            setCountdown(false)
        });
        let adminLocal = localStorage.getItem('admin')
        if (adminLocal === 'false' || adminLocal === null) {
            eventSource.addEventListener("syncWheel", e => {
                //CHECK IF THE USER IS IN THE CHAMP
                if(isInGrid.current){
                    let result = JSON.parse(e.data)
                    setDeterminedWinner(result)
                //    reload component to lauch the "didMount"
                    setShowWheel(false)
                    setShowWheel(true)
                }
            });
        }
        eventSource.addEventListener("justSwapped", e => {
            const result = JSON.parse(e.data)
            result.nri.nextRoundInfo.foundNewResults = false
            console.log(result)
            getNextRoundInfo(result.nri.nextRoundInfo);
            //Is the victim
            if(result.victim.id === cookies['user']){
                if(result.action === "swapCar"){
                    setSwapModalText(result.leader.name + t("modal.swapCar"))
                } else {
                    //TeamWith
                    setSwapModalText(t("modal.teamWith") + result.leader.name)
                    //refresh grid
                    setUpdateJoker((updateJoker) => updateJoker + 1);
                }
                setSwapModal(true)
            }
        });
    }
    const startCountdown = (countdownSec) => {
        setCountdown(false)
        var hours = Math.floor(countdownSec / 60 / 60);
        var minutes = Math.floor(countdownSec / 60) - (hours * 60);
        var seconds = countdownSec % 60;
        const countdownFinal = { hours: hours, minutes: minutes, seconds: seconds }
        setCountdown(countdownFinal)
    }
    const getCustomEvent = async () => {

        let customEvent = await readData.getLocalApi("fetch_custom_event")
        Object.keys(customEvent).map((index) => {
            if (customEvent[index]['steam id '] === cookies['user']) setIsAlreadyEventCreated(true)
        })
    }
    const getCountDown = async () => {
        let countdown = await readData.getLocalApi("check_countdown")
        if (countdown) {
            startCountdown(countdown)
        }
    }
    const toggleCountdown = async () => {
        if (countdownState === false) {
            let countdown = await readData.getLocalApi("get_countdown_value")
            readData.postLocalApi("start_countdown", countdown)
        } else {
            readData.getLocalApi("stop_countdown_v2")
        }
    }
    window.onfocus = function () {
        //When the page is loaded we update the countdown
        getCountDown()
     };
    useEffect(() => {
        checkIsIngrid()
        if (!loading) {
            console.log("Check everything")
            seeResult()
            registerToSSE()
            getCustomEvent()
            getCountDown()
        }
    }, [countdownState, gridNextRound])
    return (
        <div className={'container'}>
            <div className='tutorialLink'>
                {t("tutorial.firstTime")} &nbsp;
                <a href="#" onClick={() => { setShowTutorial(true) }}>{t("tutorial.seeRules")}</a>
            </div>
            {
                showTutorial &&
                <ModalTutorial setShowTutorial={setShowTutorial} />

            }
            {
                showWheel ?
                    <WheelCustomEvent setShowWheel={setShowWheel} determinedWinner={determinedWinner} getCountDown={getCountDown} />
                    // <WheelThemed />
                    :
                    <>
                        {!serverInfo && loading ?
                            // <div className="server-info"> The ACC server is not connected</div>
                            <div className="spinnerContainer"><Spinner animation="grow" variant="danger" /></div>
                            :
                            <>
                                {admin &&
                                    <div className="container">
                                        <AdminParameters />
                                        <div className="actionsContainer m-2">
                                            <Button variant="primary" onClick={() => { setShowWheel(true) }}>Spin the wheel !</Button>
                                            <Button variant="primary" onClick={toggleCountdown}>{
                                                countdownState ?
                                                    "Stop the countdown"
                                                    :
                                                    "Start the countdown"
                                            }</Button>
                                        </div>
                                    </div>
                                }
                                {/* TODO: Another hacky work-around...pls fix me */}
                                {newResult && newResult.includes("Championnship ") &&
                                    <ModalCheck text={newResult} setModalCheck={setSwapModal}/>
                                }
                                {swapModal &&
                                    <ModalCheck text={swapModalText} setModalCheck={setSwapModal} />
                                }
                                <div className={'container'}>
                                    {!fullResult && loading && admin && serverInfo &&
                                        <div className='actionsContainer'>
                                            <Button variant="primary" onClick={startChampionnship}>Start a new championship !</Button>
                                        </div>
                                    }
                                    {infoNextRound &&
                                        <>
                                            {countdownState !== false &&
                                                <div className="row">
                                                    <CountDownTimer hoursMinSecs={countdownState} launchServer={launchServer} setCountdown={setCountdown} />
                                                </div>
                                            }
                                            <div className="row">
                                                <div className="serverStatus ">

                                                    {serverStatus ? <>
                                                        <h4 className="up">{t("dashboard.serverStatusUp")}</h4>
                                                        <p className="server-log-info">
                                                            <b>{t("serverSettings.name")} :</b> Celtic Bromance Party Night <br />
                                                            <b>{t("serverSettings.password")} :</b> beer
                                                        </p>
                                                    </> : <h4 className="down">{t("dashboard.serverStatusDown")}</h4>}
                                                    <Button className="btnJoker mb-2" variant="info" onClick={() => setModalInfo(true)}>
                                                        {t("dashboard.serverSettings")}
                                                    </Button>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="infoNextRound col-md-12">
                                                    {/* If user is connected and is in grid*/}
                                                    {('user' in cookies) && isInGrid.current &&
                                                        <CustomEvent isAlreadyEventCreated={isAlreadyEventCreated} setIsAlreadyEventCreated={setIsAlreadyEventCreated} />
                                                    }
                                                    <hr />
                                                    <NextRoundTrackInfo infoNextRound={infoNextRound} newResult={newResult} />
                                                    <StartingGrid isInGrid={isInGrid.current} seeResult={seeResult} updateJoker={updateJoker} gridNextRound={gridNextRound} waitingGrid={waitingGrid} serverStatus={serverStatus}/>
                                                    {admin &&
                                                        <div className="adminDiv">
                                                            {serverStatus ? <Button variant="outline-primary" onClick={shutDownServer} className="bottomBtn">Shut down the server </Button> : <Button variant="outline-primary" onClick={launchServer} className="bottomBtn">Launch the server </Button>}
                                                            <Button variant="outline-primary" onClick={seeResult} className="bottomBtn">Check Result</Button>
                                                            <Button variant="outline-primary" onClick={newDraw} className="bottomBtn">New draw</Button>
                                                            <Button variant="outline-danger" onClick={() => {
                                                                if (window.confirm("You are going to delete the current championnship")) resetChampionnship()
                                                            }}>Reset Championnship</Button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <hr />
                                <ChampionnshipResult fullResult={fullResult} />
                                {
                                    modalInfo &&
                                    <ModalServerInfo setModalInfo={setModalInfo} />
                                }
                            </>
                        }
                    </>
            }
        </div>
    )

}

export default Dashboard