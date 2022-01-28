import React from 'react'
import './countdownTimer.css'

const CountDownTimer = ({hoursMinSecs, lunchServer, setCountdown}) => {
   
    const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
    const [[hrs, mins, secs], setTime] = React.useState([hours, minutes, seconds]);

    const tick = () => {
        if (hrs === 0 && mins === 0 && secs === 0){
            setCountdown(false)
            let adminLocal = localStorage.getItem('admin')
            if(adminLocal === "true"){
                lunchServer()
            }
        }
        else if (mins === 0 && secs === 0) {
            setTime([hrs - 1, 59, 59]);
        } else if (secs === 0) {
            setTime([hrs, mins - 1, 59]);
        } else {
            setTime([hrs, mins, secs - 1]);
        }
    };
    
    React.useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    });

    
    return (
        <div className="col-md-12 d-flex justify-center countdown-container">
            <span>Time before the next round will be lunched : </span>
            <p className="countdownText">{`${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</p> 
        </div>
    );
}

export default CountDownTimer;