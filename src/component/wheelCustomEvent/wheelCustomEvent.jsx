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

    const fecthCustomEvent = async () => {
        let users = []
        setLoading(true)
        let customEvent = await readData.getLocalApi("fetch_custom_event")
        Object.keys(customEvent).map((index) => {
            console.log(index)
            users.push(customEvent[index]['userName'])
        })
        console.log(users)
        setUserList(users)
    }
    useEffect( () => {
        console.log("spinwheel ")
        if(!loading){
            fecthCustomEvent()
        }
    }, [])
    const segments = [
        'better luck next time',
        'won 70',
        'won 10',
        'better luck next time',
        'won 2',
        'won uber pass',
        'better luck next time',
        'won a voucher'
      ]
      const onSelectItem = (winner) => {
        if(winner !== false){
            setTimeout(() => {
                console.log("set winner")
                setWinner(userList[winner])
                readData.postLocalApi("set_next_round_from_spin", winner)
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
        // <WheelComponent
        //   segments={segments}
        //   segColors={segColors}
        //   winningSegment='won 10'
        //   onFinished={(winner) => onFinished(winner)}
        //   primaryColor='black'
        //   contrastColor='white'
        //   buttonText='Spin'
        //   isOnlyOnce={false}
        //   size={290}
        //   upDuration={1000}
        //   downDuration={5000}
        //   fontFamily='Arial'
        // />

      )

}

export default WheelCustomEvent