import React from 'react'
import logos from '../../logo/manufacturers'
import ac from '../../logo/assettocorsa.png'
import swapcar from '../../svgs/swapcar.svg'
import { useCookies } from 'react-cookie';

/* driverInfo
"grid": {
    "position": j,
    "state": "ontrack"
},
"color": teamsColor[generated],
"firstname": element.firstName,
"lastname": element.lastName,
"constructor": element.car,
"number": element.ballast,
"abbreviation": "KUB",
"nationality": natAbbr
}
*/

const getLogoImage = {
    "ALPINE A110 GT4": logos.alpine,
    "ASTON MARTIN V8 VANTAGE GT4": logos.aston,
    "AMR V12 VANTAGE GT3 2013": logos.aston,
    "AMR V8 VANTAGE 2019": logos.aston,
    "AUDI R8 LMS GT4": logos.audi,
    "AUDI R8 LMS 2015": logos.audi,
    "AUDI R8 LMS EVO 2019": logos.audi,
    "AUDI R8 LMS GT3 EVO II": logos.audi,
    "BENTLEY CONTINENTAL GT3 2015": logos.bentley,
    "BENTLEY CONTINENTAL GT3 2018": logos.bentley,
    "BMW M4 GT4": logos.bmw,
    "BMW M6 GT3 2017": logos.bmw,
    "BMW M4 GT3": logos.bmw,
    "CHEVROLET CAMARO GT4.R": logos.chevrolet,
    "FERRARI 488 CHALLENGE EVO": logos.ferrari,
    "FERRARI 488 GT3 2018": logos.ferrari,
    "FERRARI 488 GT3 EVO 2020": logos.ferrari,
    "GINETTA G55 GT4": logos.ginetta,
    "HONDA NSX GT3 2017": logos.honda,
    "HONDA NSX GT3 EVO 2019": logos.honda,
    "EMIL FREY JAGUAR G3 2012": logos.jaguar,
    "KTM X-BOW GT4": logos.ktm,
    "LAMBORGHINI HURACAN SUPERTROFEO 2015": logos.lamborghini,
    "LAMBORGHINI HURACAN SUPER TROFEO EVO2": logos.lamborghini,
    "LAMBORGHINI HURACAN GT3 2015": logos.lamborghini,
    "LAMBORGHINI HURACAN GT3 EVO 2019": logos.lamborghini,
    "LEXUS RC F GT3 2016": logos.lexus,
    "MASERATI GRANTURISMO MC GT4": logos.maserati,
    "MCLAREN 570S GT4": logos.mclaren,
    "MCLAREN 650S GT3 2015": logos.mclaren,
    "MCLAREN 720S GT3 2019": logos.mclaren,
    "MERCEDES AMG GT4": logos.mercerdes,
    "MERCEDES-AMG GT3": logos.mercedes,
    "MERCEDES-AMG GT3 2015": logos.mercedes,
    "NISSAN GT-R NISMO GT3 2015": logos.nissan,
    "NISSAN GT-R NISMO GT3 2018": logos.nissan,
    "PORSCHE 718 CAYMAN GT4 CLUBSPORT": logos.porsche,
    "PORSCHE 991 II GT3 CUP 2017": logos.porsche,
    "PORSCHE 911 GT3 CUP (TYPE 992)": logos.porsche,
    "PORSCHE 991 GT3 R 2018": logos.porsche,
    "PORSCHE 911 II GT3 R 2019": logos.porsche,
    "REITER ENGINEERING R-EX GT3 2017": logos.reiter,

}


export default function GridNameplate({ doSwap, driverInfo, swapCar, swapPoint }) {
    const [cookies,] = useCookies(['user']);

    return (
        <div className="complete-container">
            <div className="nameplate-container" >
                <div className="nameplate-number-container">
                    <p className="nameplate-number">{driverInfo.grid.position}</p>
                </div>
                <div className="nameplate-drivername-container">
                    <p className="nameplate-drivername">{driverInfo.firstName.charAt(0).toUpperCase()}. {driverInfo.lastName.toUpperCase()}</p>
                </div>
                <div className="nameplate-country-container" style={{ backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0) 1%, rgba(0, 0, 0, 1) 90%), url('https://flagcdn.com/${driverInfo.nationality}.svg')` }}>
                </div>
                <div className="nameplate-constructor-logo-container">
                    <img className="nameplate-constructor-logo" src={getLogoImage[driverInfo.constructor.toUpperCase()] || ac} alt="ACC" />
                </div>
                <div className="nameplate-constructor-container">
                    <p className="nameplate-constructor">{driverInfo.constructor.toUpperCase()}</p>
                </div>

            </div>
            {driverInfo.playerId !== cookies['user'] &&
                <>
                    {swapPoint > 0 &&
                    <div className="nameplate-swap-points-container" onClick={() => doSwap('swapPoint', driverInfo.playerId)}>
                        <img src={swapcar} height="18px" width="18px" alt="swap points"/><span style={{ fontSize: '12px' }}> Swap Points ({swapPoint || 0})</span>
                    </div>
                    }
                    {swapCar > 0 &&
                        <div className="nameplate-swap-car-container" onClick={() => doSwap('swapCar', driverInfo.playerId)}>
                            <img src={swapcar} height="18px" width="18px" alt="swap car"/>
                            <span style={{ fontSize: '12px' }}> Swap Car ({swapCar})</span>
                        </div>
                    }
                </>
            }
        </div>
    )
}