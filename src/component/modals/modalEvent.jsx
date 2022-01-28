/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData'
import Modal from 'react-bootstrap/Modal';
import './modalEvent.css'
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

const ModalEvent = ({setModalEvent, isAlreadyEventCreated, setIsAlreadyEventCreated}) => {
 
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

  const handleClose = () => {
    setModalEvent(false);
  }


  const fetchServerInfo = async () => {
    setLoading(false)
    let paramFromApi = await readData.getLocalApi("get_param_list")
    //For testing purpose
    let trackList = []
    let carList = []
    let carClassList = []
    let weatherList = []
    Object.keys(paramFromApi['tracks']).map((index) => {
      trackList.push({
        "index" : index,
        "name": paramFromApi['tracks'][index]['tracks'][0]
      })
    })
    setTrackList(trackList)
    Object.keys(paramFromApi['cars']).map((index) => {
      const objToAdd = {
        "class" : paramFromApi['cars'][index]['class'],
        "available": false,
      }
      let obj = carClassList.find(o => o.class === paramFromApi['cars'][index]['class']);
      if(obj === undefined){
        carClassList.push(objToAdd)
      }
      carList.push({
        "index" : index,
        "available": false,
        "model": paramFromApi['cars'][index]['model'],
        "class": paramFromApi['cars'][index]['class']
      })
    })
    Object.keys(paramFromApi['weather']).map((value, index) => {
      weatherList.push(value)
    })
    setCarList(carList)
    setCarClassList(carClassList)
    setWeatherList(weatherList)
    //fetch previously created event
    if(isAlreadyEventCreated){
      let customEvent = await readData.getLocalApi("fetch_custom_event")
      Object.keys(customEvent).map((index) => {
          if(customEvent[index]['steam id '] === cookies['user']){
            let carSelectedList = []
            customEvent[index]['cars'].forEach(carSelected => {
              carSelectedList.push(carSelected.index)
            })
            carList.forEach(car => {
              if(carSelectedList.includes(car.index) ){
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
  const handleCarChange = (e, index) => {
    if(carSelectionDisplay){
      let classAvailable = []
      //Class selection
      const list = [...carClassList];
      list[index]["available"] = !carClassList[index]["available"]
      setCarClassList(list);
      //get class available
      list.map((element) => {
        if(element.available){
          classAvailable.push(element.class)
        }
      })
      carList.map((element, index) => {
        if(classAvailable.includes(element.class)){
          carList[index]["available"] = true
        } else {
          carList[index]["available"] = false
        }
      })
      setCarList(carList)
    } else {
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
      "cars" : carList,
      "track" : trackSelected,
      "weather" : weatherSelected,
      "dayTime" : nightTime
    }
    await readData.postLocalApi("create_custom_event", eventParam)
    setIsAlreadyEventCreated(true)
    handleClose()
  }
  useEffect( () => {
    if(loading)fetchServerInfo()
  })
  return (
    <>
    {!loading && 
      <Modal show={true} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header>
          <Modal.Title>{t("customEvent.createCustomEvent")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleSubmitCustomEvent} id="customEventForm">
          <div className="row">
            <div className="col-md-12">
              <h5>{t("customEvent.trackSelection")}</h5>
              <select className="form-select" aria-label="Default select example" onChange={(e) => {setTrackSelected(e.target.value)}} value={trackSelected}>
                <option></option>
                {trackList.map((element, index) => {
                  return <option id={index} value={element.name} key={index}>{element.name}</option>
                })}
              </select> 
            </div>
          </div>
          <div className="row">
           <h5>{t("customEvent.carSelection")}</h5>
           <div className="row">
            <div className="col-md-2">
              <Button onClick={() => {setCarSelectionDisplay(!carSelectionDisplay)}}>
                {carSelectionDisplay ? "Show individual car" : "Show car class"}</Button>
            </div>
            </div>
            <div className="row">
              <div className={carSelectionDisplay ? "col-md-10 mx-auto" : "col-md-10 mx-auto car-full-list"}>
                {carSelectionDisplay ?
                // Car class selection
                carClassList.map((param, i) => {
                  return (
                  <div className="form-check car-class" key={i}>
                    <input className="form-check-input" type="checkbox" id={"carClass" + i} name={"carClass" + i} value={param.class} onChange={e => handleCarChange(e, i)} checked={param.available}></input>
                    <label className="form-check-label">{param.class}</label>
                  </div>)
                })
                  : 
                // Car selection
                carList.map((param, i) => {
                    return (
                    <div className="form-check form-check-inline car-individual" key={i}>
                      <input className="form-check-input" type="checkbox" id={"car" + i} name={"car" + i} value={i} onChange={e => handleCarChange(e, i)} checked={param.available}></input>
                      <label className="form-check-label">{param.model}</label>
                    </div>)
                  })
              }
              </div>
            </div>
          </div>
          <div className="row">
            
              <h5>{t("customEvent.weatherSelection")}</h5>
              <div className="col-md-6">
                <select className="form-select" aria-label="Default select example" onChange={(e) => {setWeatherSelected(e.target.value)}} value={weatherSelected}>
                  <option></option>
                  {weatherList.map((element, index) => {
                    return <option id={index} value={element}  key={index}>{element}</option>
                  })}
                </select>
              </div>
              <div className="col-md-6 pt-1">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={e => setNightTime(!nightTime)} checked={nightTime}/>
                  <label className="form-check-label h5" htmlFor="flexSwitchCheckDefault">{t("customEvent.nightSelection")}</label>
                </div>
              </div>
          </div>
        </form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleSubmitCustomEvent} >
            {t("save")}
          </Button>
          <Button variant="secondary" onClick={handleClose} >
           {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    }
    </>
  );
}

export default ModalEvent