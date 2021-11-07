import React, { useState, useEffect } from 'react'
import ReadData from '../../services/readData'
import Dropdown from 'react-bootstrap/Dropdown';
import './wheelCustomEvent.css'
import { useCookies } from 'react-cookie';
import WheelComponent from 'react-wheel-of-prizes'
import Wheel from '../wheel/wheel';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
// import 'react-wheel-of-prizes/dist/index.css'


const WheelCustomEvent = ({setShowWheel}) => {
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
    }
    useEffect( () => {
        console.log("spinwheel ")
        if(!loading){
            fecthCustomEvent()
        }
    }, [])
      const onSelectItem = (winner) => {
        if(winner !== false){
            setTimeout(() => {
                let winnerEvent
                setWinner(userList[winner])
                Object.keys(customEvent).map((steamId, index) => {
                    console.log(index)
                    if (index == winner){
                        winnerEvent = customEvent[steamId]
                    }
                })
                readData.postLocalApi("set_next_round_from_spin", winnerEvent)
            }, 4000);
        } else {
            setWinner("")
        }
      }
      return (
        <>
        {loading ?
            <div className="container">
                <Button onClick={() => setShowWheel(false)}>Back</Button>
                <Wheel items={userList} onFinished={onSelectItem}/>
                {winner && 
                <div>{winner}</div>
                }
            </div>
            :
            <div className="spinnerContainer"><Spinner animation="grow" variant="danger" /></div>
        }
        </>
      )

}

export default WheelCustomEvent