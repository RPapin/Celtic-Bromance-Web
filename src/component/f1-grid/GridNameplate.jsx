import React from 'react'
import logos from '../../logo/manufacturers'
import ac from '../../logo/assettocorsa.png'
import swapcar from '../../svgs/swapcar.svg'
import { useCookies } from 'react-cookie';
import getCarLogo from '../../helpers/getCarLogo';
import './formula1.css'

export default function GridNameplate({ isInGrid, doSwap, driverInfo, swapCar, swapPoint, isSwappingCar, isSwappingPoints, swapPointVictimId }) {
    const [cookies,] = useCookies(['user']);

    return (
        <div className="complete-container">
            <div className="nameplate-container" style={{ backgroundColor: cookies['user'] == driverInfo.playerId && '#ac1e16' }}>
                <div className="nameplate-number-container">
                    <p className="nameplate-number">{driverInfo.grid.position}</p>
                </div>
                <div className="nameplate-drivername-container" >
                    <p className="nameplate-drivername">
                        {driverInfo.firstName.charAt(0).toUpperCase()}. {driverInfo.lastName.toUpperCase()}</p>
                </div>
                <div className="nameplate-country-container" style={{ backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0) 1%, rgba(0, 0, 0, 1) 90%), url('https://flagcdn.com/${driverInfo.nationality}.svg')` }}>
                </div>
                <div className="nameplate-constructor-logo-container">
                    <img className="nameplate-constructor-logo" src={getCarLogo(driverInfo.constructor)} alt="ACC" />
                </div>
                <div className="nameplate-constructor-container">
                    <p className="nameplate-constructor">{driverInfo.constructor.toUpperCase()}</p>
                    {swapPointVictimId == driverInfo.playerId &&
                        <div className="nameplate-points-swap-victim-container"><p className="nameplate-points-swap-victim">Points Swap!</p></div>
                    }
                </div>

            </div>
            {!isInGrid &&
                <>
                    {driverInfo.playerId !== cookies['user'] &&
                        <>
                            {swapPoint > 0 && !isSwappingCar &&
                                <div className="nameplate-swap-points-container" onClick={() => doSwap('swapPoint', driverInfo.playerId)}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap points" />
                                    {isSwappingPoints
                                        ? <span style={{ fontSize: '12px' }}> Swapping... </span>
                                        : <span style={{ fontSize: '12px' }}> Swap Points ({swapPoint || 0}) </span>
                                    }
                                </div>
                            }
                            {swapPoint > 0 && isSwappingCar &&
                                <div className="nameplate-swap-points-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap points" />
                                    {isSwappingPoints
                                        ? <span style={{ fontSize: '12px' }}> Swapping... </span>
                                        : <span style={{ fontSize: '12px' }}> Swap Points ({swapPoint || 0}) </span>
                                    }
                                </div>
                            }
                            {swapPoint == 0 &&
                                <div className="nameplate-swap-points-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap points" /><span style={{ fontSize: '12px' }}> No Point Swaps</span>
                                </div>
                            }

                            {swapCar > 0 && !isSwappingPoints &&
                                <div className="nameplate-swap-car-container" onClick={() => doSwap('swapCar', driverInfo.playerId)}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap car" />
                                    {isSwappingCar
                                        ? <span style={{ fontSize: '12px' }}> Swapping...</span>
                                        : <span style={{ fontSize: '12px' }}> Swap Car ({swapCar})</span>}
                                </div>
                            }
                            {swapCar > 0 && isSwappingPoints &&
                                <div className="nameplate-swap-car-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap car" />
                                    {isSwappingCar
                                        ? <span style={{ fontSize: '12px' }}> Swapping...</span>
                                        : <span style={{ fontSize: '12px' }}> Swap Car ({swapCar})</span>}
                                </div>
                            }
                            {swapCar == 0 &&
                                <div className="nameplate-swap-car-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap car" />
                                    <span style={{ fontSize: '12px' }}> No Car Swaps</span>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}