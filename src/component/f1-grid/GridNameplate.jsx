import React, { useEffect } from 'react'
import logos from '../../logo/manufacturers'
import ac from '../../logo/assettocorsa.png'
import swapcar from '../../svgs/swapcar.svg'
import { useCookies } from 'react-cookie';
import getCarLogo from '../../helpers/getCarLogo';
import './formula1.css';
import { useTranslation } from 'react-i18next';

export default function GridNameplate({ isInGrid, doSwap, driverInfo, swapCar, teamWith, isSwappingCar, isTeamingWith, teamWithVictimId, disabledTeaming, serverStatus }) {
    const [cookies,] = useCookies(['user']);
    const { t, } = useTranslation();
    useEffect(() => {
        console.log("useEffect GridNameplate")
        console.log(serverStatus)
    })
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
                    {teamWithVictimId == driverInfo.playerId &&
                        <div className="nameplate-points-swap-victim-container"><p className="nameplate-points-swap-victim">{t("grid.youTeamWith")}</p></div>
                    }
                </div>

            </div>
            {isInGrid &&
                <>
                    {driverInfo.playerId !== cookies['user'] && !serverStatus &&
                        <>
                        {/* Team container */}
                        {/* <div className="nameplate-swap-points-container" onClick={!disabledTeaming || teamWith > 0 ? () => doSwap('teamWith', driverInfo.playerId) : undefined} 
                        style={{ backgroundColor: !disabledTeaming || teamWith > 0 ? undefined : 'gray' }}>
                            <img src={swapcar} height="18px" width="18px" alt="swap points" />
                            {disabledTeaming ?
                                    <span style={{ fontSize: '12px' }}> {t("grid.gotATeam")}</span> :
                                teamWith === 0 ?
                                <span style={{ fontSize: '12px' }}> {t("grid.noTeamingLeft")}</span> :
                                    isTeamingWith
                                        ? <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.teaming")} </span>
                                        : <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.teamWith")} ({teamWith || 0}) </span>
                            }
                        </div> */}
                            {teamWith > 0 && !isSwappingCar && !disabledTeaming && 
                                <div className="nameplate-swap-points-container" onClick={() => doSwap('teamWith', driverInfo.playerId)}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap points" />
                                    {isTeamingWith
                                        ? <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.teaming")} </span>
                                        : <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.teamWith")} ({teamWith || 0}) </span>
                                    }
                                </div>
                            }
                            {teamWith > 0 && isSwappingCar && !disabledTeaming &&
                                <div className="nameplate-swap-points-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap points" />
                                    {isTeamingWith
                                        ? <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.teaming")} </span>
                                        : <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.teamWith")} ({teamWith || 0}) </span>
                                    }
                                </div>
                            }
                            {teamWith === 0 && 
                                <div className="nameplate-swap-points-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap points" /><span style={{ fontSize: '12px' }}> {t("grid.noTeamingLeft")}</span>
                                </div>
                            }
                            { disabledTeaming  && teamWith > 0 && 
                                <div className="nameplate-swap-points-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap points" /><span style={{ fontSize: '12px' }}> {t("grid.gotATeam")}</span>
                                </div>
                            }

                            {swapCar > 0 && !isTeamingWith && 
                                <div className="nameplate-swap-car-container" onClick={() => doSwap('swapCar', driverInfo.playerId)}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap car" />
                                    {isSwappingCar
                                        ? <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.swapping")}</span>
                                        : <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.swapCar")} ({swapCar})</span>}
                                </div>
                            }
                            {swapCar > 0 && isTeamingWith && 
                                <div className="nameplate-swap-car-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap car" />
                                    {isSwappingCar
                                        ? <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.swapping")}</span>
                                        : <span style={{ fontSize: '12px' }} className='spanF1'> {t("grid.swapCar")} ({swapCar})</span>}
                                </div>
                            }
                            {swapCar == 0 && 
                                <div className="nameplate-swap-car-container" style={{ backgroundColor: 'gray' }}>
                                    <img src={swapcar} height="18px" width="18px" alt="swap car" />
                                    <span style={{ fontSize: '12px' }} className='spanF1'> No Car Swaps</span>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}