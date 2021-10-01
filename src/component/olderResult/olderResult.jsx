import React, { useState, useEffect } from 'react'
import ReadData from '../../services/readData'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import './olderResult.css'
import ChampionnshipResult from '../championnshipResult/championnshipResult';

const OlderResult = ({admin, setAdmin}) => {
    const readData = new ReadData()

    const [isResultDisplay, setIsResultDisplay] = useState(false)
    const [fullResult, setFullResult] = useState([])
    const [oneResult, setOneResult] = useState()
    const [loading, setLoading] = useState(false)
    const [activeBtn, setActiveBtn] = useState(-1)


    const seeResult = async () => {
        setLoading(true)
        let allInfo = await readData.getLocalApi("get_older_result")
        if(allInfo){
            setFullResult(allInfo)
        } 
    }

    const toggleChampionship = (e, result, i) => {
        setActiveBtn(i)
        setIsResultDisplay(true)
        setOneResult(result)
    }
    useEffect( () => {
        if(!loading){
            seeResult()
        }
    })
    return (

    <div className={'container'}>
        {!loading ?
            // <div className="server-info"> The ACC server is not connected</div>
            <div className="spinnerContainer"><Spinner animation="grow" variant="danger" /></div>
           :
           <>
        <div className={"btnContainer"}>
        {fullResult.map((tempResult, i) => {
            return (
                <Button variant={activeBtn === i ? "primary" : "outline-primary"} onClick={(e) => { toggleChampionship(e, tempResult, i)}}>{tempResult['date']}</Button>
            )
        })
        }
        </div>
        {isResultDisplay && <ChampionnshipResult fullResult={oneResult}/>}
        </>
    }
    </div>
    )

}

export default OlderResult