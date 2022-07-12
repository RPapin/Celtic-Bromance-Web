/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
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
import Joker from '../joker/joker';
import ModalServerInfo from '../modals/modalServerInfo';
import ModalEvent from '../modals/modalEvent';
import ModalTutorial from '../modals/modalTutorial';
import CountDownTimer from '../countdownTimer/countdownTimer';
import { useTranslation } from 'react-i18next';

const Dashboard = ({admin, setAdmin}) => {
    const { t,  } = useTranslation();
    const readData = new ReadData()

    const [cookies, ] = useCookies(['user']);
    const [infoNextRound, setInfoNextRound] = useState()
    const [gridNextRound, setGridNextRound] = useState()
    const [newResult, setNewResult] = useState(false)
    const [fullResult, setFullResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [serverInfo, setServerInfo] = useState(false)
    const [serverStatus, setServerStatus] = useState(false)
    const [updateJoker, setUpdateJoker] = useState(0)
    const [modalInfo, setModalInfo] = useState(false)
    const [modalEvent, setModalEvent] = useState(false)
    const [waitingGrid, setWaitingGrid] = useState(false)
    const [showWheel, setShowWheel] = useState(false)
    const [showTutorial, setShowTutorial] = useState(false)
    const [determinedWinner, setDeterminedWinner] = useState(false)
    const [isAlreadyEventCreated, setIsAlreadyEventCreated] = useState(false)
    const [countdownState, setCountdown] = useState(false)


    const getNextRoundInfo = (nextRoundInfo) => {
        const eventInfo = JSON.parse(JSON.stringify(nextRoundInfo.eventInfo))
        const gridInfo = JSON.parse(JSON.stringify(nextRoundInfo.usersInfo.usersInfo))
        let eventInfoArray = [] 
        Object.keys(eventInfo).forEach(key => eventInfoArray.push([key, eventInfo[key]]))
        setGridNextRound(gridInfo)
        setInfoNextRound(eventInfoArray)
        setNewResult(nextRoundInfo.foundNewResults)   
        setUpdateJoker(updateJoker + 1)
        setWaitingGrid(false)
    }

    const startChampionnship = async () => {
        let firstRoundInfo = await readData.getLocalApi("start_championnship")
        if(firstRoundInfo){
            getNextRoundInfo(firstRoundInfo)
            setServerInfo(true)
        } else setServerInfo(false)
    }
    const lunchServer = async () => {
        console.log('lunchServer')
        let serverStatus = await readData.getLocalApi("launch_server")
        setServerStatus(serverStatus['serverStatus'])
    }
    const shutDownServer = async () => {
        let serverStatus = await readData.getLocalApi("shutdown_server")
        setServerStatus(serverStatus['serverStatus'])
    }
    const newDraw = async () => {
        let allInfo = await readData.getLocalApi("new_draw")
        if(allInfo){
            getNextRoundInfo(allInfo)
        } else setServerInfo(false)
    }
    const seeResult = async () => {
        setLoading(true)
        let allInfo = await readData.getLocalApi("display_result")
        if(allInfo){
            if(allInfo['nextRoundInfo']){
                allInfo['nextRoundInfo']['foundNewResults'] = allInfo['foundNewResults']
                getNextRoundInfo(allInfo['nextRoundInfo'])
            }
            setFullResult(allInfo['standings'])
            setServerInfo(true)
            setServerStatus(allInfo['serverStatus'])
            setUpdateJoker(updateJoker + 1)
        } else setServerInfo(false)
    }
    const resetChampionnship = async () => {
        let resetStatus = await readData.getLocalApi("reset_championnship")
        if(resetStatus){
            setGridNextRound(null)
            setInfoNextRound(null)
            setFullResult(null)
            setNewResult('Championship has been reset')
            setServerInfo(true)
        } else setServerInfo(false)
    }
    const registerToSSE =  async () => {
        const url = await readData.getTunnelUrl()
        const eventSource = new EventSource(url + "events");
        eventSource.addEventListener("dataUpdate", e =>{
            const result = JSON.parse(e.data)
            const size = Object.keys(result['nextRoundInfo']).length;
            console.log(result)
            if(size !== 0)getNextRoundInfo(result['nextRoundInfo'])
            else {
                setWaitingGrid(true)
            }
            setFullResult(result['standings'])
            setServerInfo(true)
            setServerStatus(result['serverStatus'])
        });
        eventSource.addEventListener("updateServerStatus", e =>{
            const result = JSON.parse(e.data)
            setServerStatus(result['serverStatus'])
        });
        eventSource.addEventListener("newDraw", e =>{
            const result = JSON.parse(e.data)
            getNextRoundInfo(result)
        });
        eventSource.addEventListener("carSwap", e =>{
            let result = JSON.parse(e.data)
            result['nextRoundInfo']['foundNewResults'] = false
            getNextRoundInfo(result['nextRoundInfo'])
        });
        eventSource.addEventListener("startCountdown", e =>{
            let countdownSec = JSON.parse(e.data)
            startCountdown(countdownSec)
        });
        eventSource.addEventListener("stopCountdown", e =>{
            setCountdown(false)
        });
        let adminLocal = localStorage.getItem('admin')
        if(adminLocal === 'false' || adminLocal === null){
            eventSource.addEventListener("syncWheel", e =>{
                console.log("call to sync")
                let result = JSON.parse(e.data)
                setDeterminedWinner(result)
                //reload component to lauch the "didMount"
                setShowWheel(false)
                setShowWheel(true)
            });
        }
    }
    const startCountdown= (countdownSec ) => {
        setCountdown(false)
        var hours = Math.floor(countdownSec / 60 / 60);
        var minutes = Math.floor(countdownSec / 60) - (hours * 60);
        var seconds = countdownSec % 60;
        const countdownFinal = { hours : hours, minutes : minutes, seconds : seconds }
        console.log("countdown full " + countdownFinal.minutes + ":" + countdownFinal.seconds)
        setCountdown(countdownFinal)
    }
    const getCustomEvent = async () => {
        
        let customEvent = await readData.getLocalApi("fetch_custom_event")
        Object.keys(customEvent).map((index) => {
            if(customEvent[index]['steam id '] === cookies['user'])setIsAlreadyEventCreated(true)
        })
    }
    const getCountDown = async () => {
        let countdown = await readData.getLocalApi("check_countdown")
        console.log("countdown " + countdown)
        if(countdown){
            startCountdown(countdown)
        }
    }
    const toggleCountdown = async () => {
        if(countdownState === false){
            let countdown = await readData.getLocalApi("get_countdown_value")
            readData.postLocalApi("start_countdown", countdown)
        } else {
            readData.getLocalApi("stop_countdown")
        }
    }

    useEffect( () => {
        console.log('useEffect dash')
        if(!loading){
            seeResult()
            registerToSSE()
            getCustomEvent()
            getCountDown()
        }
    }, [countdownState])
    return (
    <div className={'container'}>
        <div className='tutorialLink'>
            {t("tutorial.firstTime")} &nbsp;
            <a href="#" onClick={() => {setShowTutorial(true)}}>{t("tutorial.seeRules")}</a>
        </div>
        {
            showTutorial &&
            <ModalTutorial setShowTutorial={setShowTutorial}/>

        }
        {
            showWheel ?
            <WheelCustomEvent setShowWheel={setShowWheel} determinedWinner={determinedWinner} getCountDown={getCountDown}/>
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
                        <Button variant="primary" onClick={() => {setShowWheel(true)}}>Spin the wheel !</Button>
                        <Button variant="primary" onClick={toggleCountdown}>{
                        countdownState ? 
                            "Stop the countdown"
                            :
                            "Start the countdown"
                        }</Button>
                    </div>
                </div>
            }
            {newResult &&
                <ModalCheck text={newResult}/>
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
                                <CountDownTimer hoursMinSecs={countdownState} lunchServer={lunchServer} setCountdown={setCountdown} />
                            </div>
                        }
                        <div className="row">
                            <div className="serverStatus ">

                            {serverStatus ? <>
                                <h4 className="up">{t("dashboard.serverStatusUp")}</h4>
                                <p>
                                    <b>Name :</b> Celtic Bromance - American DLC Fun Night <br/>
                                    <b>Password :</b> beer
                                </p>
                                </> :  <h4 className="down">{t("dashboard.serverStatusDown")}</h4>}
                            <Button className="btnJoker mb-2" variant="info" onClick={() => setModalInfo(true)}>
                                {t("dashboard.serverSettings")}
                            </Button>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="infoNextRound col-md-12">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h3>{t("dashboard.infoNextRound")}</h3>
                                            <ul>
                                                {infoNextRound.map((label, i) => {
                                                    return (<li key={i}>{label[0]} : {label[1]}</li>)
                                                })}
                                            </ul>
                                    </div>
                                    {/* If user is connected */}
                                    {  ('user' in cookies) &&
                                        <div className="col-md-4">
                                            <Joker seeResult={seeResult} updateJoker={updateJoker} serverStatus={serverStatus}/>
                                            <Button className="btnJoker mb-2" variant="info" onClick={() => setModalEvent(true)}>
                                                {isAlreadyEventCreated ?
                                                    t("dashboard.customEventEditBtn")
                                                    :
                                                    t("dashboard.customEventCreateBtn")
                                                }
                                            </Button>
                                        </div>
                                    }
                                </div>
                                <hr/>
                                <div className="row">
                                    <h3>{t("dashboard.startingGrid")}</h3>
                                    {!waitingGrid ? 
                                        <StartingGrid gridNextRound={gridNextRound}/> :
                                        <p>{t("dashboard.waitingGrid")}</p>
                                    }
                                    </div>
                            {admin && 
                                <div className="adminDiv">
                                {serverStatus ? <Button variant="outline-primary" onClick={shutDownServer} className="bottomBtn">Shut down the server </Button> : <Button variant="outline-primary" onClick={lunchServer} className="bottomBtn">Launch the server </Button>}
                                <Button variant="outline-primary" onClick={seeResult} className="bottomBtn">Check Result</Button>
                                <Button variant="outline-primary" onClick={newDraw} className="bottomBtn">New draw</Button>
                                <Button variant="outline-danger" onClick={() => {
                                    if(window.confirm("You are going to delete the current championnship"))resetChampionnship()
                                }}>Reset Championnship</Button>
                                </div>
                            }
                            </div>
                        </div>
                        </>
                    }   
                </div>
                <hr/>
                <ChampionnshipResult fullResult={fullResult}/>
                {
                    modalInfo &&
                    <ModalServerInfo setModalInfo={setModalInfo}/>
                }
                {
                    modalEvent &&
                    <ModalEvent setModalEvent={setModalEvent} isAlreadyEventCreated={isAlreadyEventCreated} setIsAlreadyEventCreated={setIsAlreadyEventCreated}/>
                }
                </>
            }
            </>
        }
    </div>
    )

}

export default Dashboard