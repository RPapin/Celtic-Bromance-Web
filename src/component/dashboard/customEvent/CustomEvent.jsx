/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import ReadData from '../../../services/readData'
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import getCleanTrackName from '../../../helpers/getCleanTrackName';
import './CustomEvent.css';

const CustomEvent = ({ isAlreadyEventCreated, setIsAlreadyEventCreated }) => {

    const { t } = useTranslation();
    const readData = new ReadData()
    // const [show, setShow] = useState(true);
    const [loading, setLoading] = useState(true);
    const [trackList, setTrackList] = useState([])
    const [carList, setCarList] = useState([])
    const [carClassList, setCarClassList] = useState([])
    const [weatherList, setWeatherList] = useState([])
    const [carSelectionDisplay, setCarSelectionDisplay] = useState(true);
    const [trackSelected, setTrackSelected] = useState();
    const [weatherSelected, setWeatherSelected] = useState();
    const [nightTime, setNightTime] = useState(false);
    const [cookies] = useCookies(['name']);
    const [collapsed, setCollapsed] = useState(false);
    const [eventSavedNotif, setEventSavedNotif] = useState(false);

    const handleClose = () => {
        setCollapsed(true);
        setEventSavedNotif(true);
        setTimeout(() => { setEventSavedNotif(false) }, 3000)

    }


    const fetchServerInfo = async () => {
        let paramFromApi = await readData.getLocalApi("get_param_list")
        setLoading(false)
        //For testing purpose
        let trackList = []
        let carList = []
        let carClassList = []
        let weatherList = {}
        Object.keys(paramFromApi['tracks']).map((index) => {
            trackList.push({
                "index": index,
                "name": getCleanTrackName(paramFromApi['tracks'][index]['tracks'][0])
            })
        })
        setTrackList(trackList)
        Object.keys(paramFromApi['cars']).map((index) => {
            const objToAdd = {
                "class": paramFromApi['cars'][index]['class'],
                "available": false,
            }
            let obj = carClassList.find(o => o.class === paramFromApi['cars'][index]['class']);
            if (obj === undefined) {
                carClassList.push(objToAdd)
            }
            carList.push({
                "index": index,
                "available": false,
                "model": paramFromApi['cars'][index]['model'],
                "class": paramFromApi['cars'][index]['class'],
                "DLC": paramFromApi['cars'][index]['DLC'],
            })
        })
        Object.keys(paramFromApi['weather']).map((value, index) => {
            weatherList[value] = paramFromApi['weather'][value]['name']
            // weatherList.push(paramFromApi['weather'][value]['name'])
        })
        setCarList(carList)
        setCarClassList(carClassList)
        setWeatherList(weatherList)
        //fetch previously created event
        if (isAlreadyEventCreated) {
            let customEvent = await readData.getLocalApi("fetch_custom_event")
            Object.keys(customEvent).map((index) => {
                if (customEvent[index]['steam id '] === cookies['user']) {
                    let carSelectedList = []
                    customEvent[index]['cars'].forEach(carSelected => {
                        carSelectedList.push(carSelected.index)
                    })
                    carList.forEach(car => {
                        if (carSelectedList.includes(car.index)) {
                            car.available = true;
                        }
                    })
                    setCarList(carList)
                    setTrackSelected(customEvent[index]['track'])
                    setWeatherSelected(customEvent[index]['weather'])
                    setNightTime(customEvent[index]['dayTime'])
                }
            })
        }
    }
    const handleCarChange = (type, e, index) => {
        if (type == "class") {
            let classAvailable = []
            //Class selection
            const list = [...carClassList];
            list[index]["available"] = !carClassList[index]["available"]
            setCarClassList(list);
            //get class available
            list.map((element) => {
                if (element.available) {
                    classAvailable.push(element.class)
                }
            })
            carList.map((element, index) => {
                if (classAvailable.includes(element.class)) {
                    carList[index]["available"] = true
                } else {
                    carList[index]["available"] = false
                }
            })
            setCarList(carList)
        } else if (type = "car") {
            const list = [...carList];
            list[index]["available"] = !carList[index]["available"]
            setCarList(list);
        }

    }

    const handleSubmitCustomEvent = async (e) => {
        e.preventDefault()
        const eventParam = {
            "steam id ": cookies['user'],
            "userName": cookies['name'],
            "cars": carList,
            "track": trackSelected,
            "weather": weatherSelected,
            "dayTime": nightTime
        }
        await readData.postLocalApi("create_custom_event", eventParam)
        setIsAlreadyEventCreated(true)
        handleClose()
    }
    useEffect(() => {
        if (loading) fetchServerInfo()
    })

    return (
        <>
            <div className="mt-5 mb-5 border border-secondary rounded-bottom rounded-3">
                <div className="w-100 bg-secondary d-flex flex-row align-items-center" style={{ cursor: 'pointer' }} onClick={() => { setCollapsed(!collapsed) }}>
                    <h3 className="text-white pl-2 pt-2 pb-2">Your Custom Event</h3>

                    <p className="text-white fw-bold ml-auto mr-4 mb-0 align-self-center">
                        {collapsed
                            ? "Show Event"
                            : "Hide Event"}
                    </p>
                    {eventSavedNotif && <p className="text-white mb-0 ml-5">Your event has been saved!</p>}
                </div>
                <div style={{ display: collapsed ? 'none' : 'block' }}>
                    <div className="container text-center mt-3" >
                        <form onSubmit={handleSubmitCustomEvent} id="customEventForm">
                            <div className="row d-flex flex-row justify-content-center">
                                <div className="col">
                                    <h5>{t("customEvent.trackSelection")}</h5>
                                    <select className="form-select" aria-label="Default select example" onChange={(e) => { setTrackSelected(e.target.value) }} value={trackSelected}>
                                        <option></option>
                                        {trackList.map((element, index) => {
                                            return <option id={index} value={element.name} key={index}>{element.name}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col">
                                    <h5>{t("customEvent.weatherSelection")}</h5>
                                    <select className="form-select" aria-label="Default select example" onChange={(e) => { setWeatherSelected(e.target.value) }} value={weatherSelected}>
                                        <option></option>
                                        {Object.entries(weatherList).map(([key, value]) => {
                                            return <option value={key} key={key}>{value}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col d-flex justify-content-center">
                                    <div className="form-check form-switch">
                                        <div><label className="form-check-label h5" htmlFor="flexSwitchCheckDefault">{t("customEvent.nightSelection")}</label></div>
                                        <div className="pl-5 pt-2"><input className="form-check-input" type="checkbox" role="switch" onChange={e => setNightTime(!nightTime)} checked={nightTime} /></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <h5>{t("customEvent.carSelection")}</h5>
                                </div>
                                <div className="row text-left d-grid mb-5 carSelectGrid">

                                    {
                                        // Car class selection
                                        carClassList.map((classParam, i) => {
                                            const classCarList = carList.map((carParam, index) => {
                                                if (carParam.class == classParam.class) {
                                                    return (
                                                        <div className="form-check car-individual" key={index}>
                                                            <input className="form-check-input" type="checkbox" id={"car" + index} name={"car" + index} value={index} onChange={e => handleCarChange("car", e, index)} checked={carParam.available}></input>
                                                            <label className="form-check-label">{carParam.model}</label>
                                                        </div>)
                                                }
                                            })
                                            return (
                                                <div className={classParam.class}>
                                                    <div className="form-check car-class" key={i}>
                                                        <Button className="btn-secondary" onClick={(e => handleCarChange("class", e, i))}><b>{classParam.class.toUpperCase()} (Toggle All)</b></Button>
                                                    </div>
                                                    <div>
                                                        {classCarList}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="text-center mb-2">
                        <Button variant="primary" onClick={handleSubmitCustomEvent} >
                            {t("save")}
                        </Button>
                    </div>
                </div>
            </div >
        </>
    );
}

export default CustomEvent