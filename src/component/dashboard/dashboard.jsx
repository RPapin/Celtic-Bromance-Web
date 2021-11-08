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

const Dashboard = ({admin, setAdmin}) => {
    const readData = new ReadData()

    const [cookies, setCookie] = useCookies(['user']);
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
    const [showWheel, setShowWheel] = useState(false)
    const [determinedWinner, setDeterminedWinner] = useState(false)
    const [isAlreadyEventCreated, setIsAlreadyEventCreated] = useState(false)


    const getNextRoundInfo = (nextRoundInfo) => {
        const eventInfo = JSON.parse(JSON.stringify(nextRoundInfo.eventInfo))
        const gridInfo = JSON.parse(JSON.stringify(nextRoundInfo.usersInfo.usersInfo))
        let eventInfoArray = [] 
        Object.keys(eventInfo).forEach(key => eventInfoArray.push([key, eventInfo[key]]))
        setGridNextRound(gridInfo)
        setInfoNextRound(eventInfoArray)
        setNewResult(nextRoundInfo.foundNewResults)   
        setUpdateJoker(updateJoker + 1)
    }

    const startChampionnship = async () => {
        let firstRoundInfo = await readData.getLocalApi("start_championnship")
        if(firstRoundInfo){
            getNextRoundInfo(firstRoundInfo)
            setServerInfo(true)
        } else setServerInfo(false)
    }
    const lunchServer = async () => {
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
            console.log('seeResult')
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
            getNextRoundInfo(result['nextRoundInfo'])
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
        let adminLocal = localStorage.getItem('admin')
        console.log(adminLocal)
        if(adminLocal === 'false' || adminLocal === null){
            console.log("register to  sync")
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
    const getCustomEvent = async () => {
        let customEvent = await readData.getLocalApi("fetch_custom_event")
        Object.keys(customEvent).map((index) => {
            if(customEvent[index]['steam id '] === cookies['user'])setIsAlreadyEventCreated(true)
        })
    }

    useEffect( () => {
        if(!loading){
            seeResult()
            registerToSSE()
            getCustomEvent()
        }
    }, [])
    return (

    <div className={'container'}>
        {
            showWheel ?
            <WheelCustomEvent setShowWheel={setShowWheel} determinedWinner={determinedWinner} />
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

                    <div className="serverStatus ">
                        {serverStatus ? <h4 className="up">Server is up !</h4> :  <h4 className="down">Server is down ...</h4>}
                        <Button className="btnJoker mb-2" variant="info" onClick={() => setModalInfo(true)}>
                            Server settings
                        </Button>
                    
                        </div>
                        <div className="row">
                            <div className="infoNextRound col-md-8">
                                <h3>Info Next Round :</h3>
                                    <ul>
                                        {infoNextRound.map((label, i) => {
                                            return (<li key={i}>{label[0]} : {label[1]}</li>)
                                        })}
                                    </ul>
                                <h3>Starting grid :</h3> 
                                <StartingGrid gridNextRound={gridNextRound}/>
                                
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
                            {/* If user is connected */}
                            {  ('user' in cookies) &&
                                <div className="col-md-4">
                                    <Joker seeResult={seeResult} updateJoker={updateJoker} serverStatus={serverStatus}/>
                                    <Button className="btnJoker mb-2" variant="info" onClick={() => setModalEvent(true)}>
                                        {isAlreadyEventCreated ?
                                            "Edit custom event"
                                            :
                                            "Create custom event"
                                        }
                                    </Button>
                                </div>
                            }
                        </div>
                        </>
                    }   
                </div>
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