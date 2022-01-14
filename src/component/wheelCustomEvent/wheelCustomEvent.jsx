import React, { useState, useEffect } from 'react'
import ReadData from '../../services/readData'
import Dropdown from 'react-bootstrap/Dropdown';
import './wheelCustomEvent.css'
import { useCookies } from 'react-cookie';
import Wheel from '../wheel/wheel';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
// import 'react-wheel-of-prizes/dist/index.css'


const WheelCustomEvent = ({setShowWheel, determinedWinner}) => {
    const readData = new ReadData()

    const [cookies, setCookie, removeCookie] = useCookies(['name']);
    const [loading, setLoading] = useState(false)
    const [userList, setUserList] = useState([])
    const [winner, setWinner] = useState(false)
    const [customEvent, setCustomEvent] = useState({})

    const fecthCustomEvent = async () => {
        let users = []
        setLoading(true)
        let customEvent = await readData.getLocalApi("fetch_custom_event")
        Object.keys(customEvent).map((index) => {
            setCustomEvent(customEvent)
            
            users.push(customEvent[index]['userName'])
        })
        setUserList(users)
        if(determinedWinner !== false){
            setTimeout(() => {
                console.log("show winner" + users[determinedWinner])
                setWinner(users[determinedWinner])
            }, 4000);
        }
    }
    useEffect( () => {
        if(!loading){
            fecthCustomEvent()
        }
    }, [])

    const onSelectItem = (winner, determinedWinnerLocal) => {
        if(winner !== false){
            let winnerEvent
            //Lauch the event for everyone 
            Object.keys(customEvent).map((steamId, index) => {
                if (index === winner){
                    winnerEvent = customEvent[steamId]
                }
            })
            if(determinedWinnerLocal === false){
                readData.postLocalApi("sync_wheel_spin", winner)
                setTimeout(() => {
                    setWinner(userList[winner])
                    readData.postLocalApi("set_next_round_from_spin", winnerEvent)
                }, 4000);
            } 
        } else {
            setWinner("")
        }
    }
    return (
    <>
    {loading ?
        <div className="container">
            <Button onClick={() => setShowWheel(false)}>Back</Button>
            <Wheel items={userList} onFinished={onSelectItem} determinedWinner={determinedWinner} />
            {winner && 
            <div className="winner">The winner is : <h3>{winner}</h3></div>
            }
        </div>
        :
        <div className="spinnerContainer"><Spinner animation="grow" variant="danger" /></div>
    }
    </>
    )

}

export default WheelCustomEvent