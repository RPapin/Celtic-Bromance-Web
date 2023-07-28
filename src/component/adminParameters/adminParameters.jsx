/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion'
import './adminParameters.css'
import ReadData from '../../services/readData'
import ToastCustom from '../toast/toast';


const AdminParameters = () => {
    const readData = new ReadData()
    const [inputList, setInputList] = useState([])
    const [loading, setLoading] = useState(false)
    const [trackList, setTrackList] = useState([])
    const [carList, setCarList] = useState([])
    const [userList, setUserList] = useState([])
    const [showToast, setShowToast] = useState(false)
    
    const defaultListParameters = [{file: 'Data/championnshipConfiguration.json', name: 'pointConfiguration', value: [15,11,8,6,4,3,2,1], label: 'Point distribution (Each point must be separed with a comma)', type: 'text'},
      {file: 'Data/championnshipConfiguration.json', name: 'serverAdmin', value: 76561198445003541, label: 'SteamId of the server Admin', type: 'text'},
      {file: 'Template/event.json', name: 'practiceDuration', value: 10, label: 'Set the practice duration', type: 'number'},
      {file: 'Template/event.json', name: 'raceDuration', value: 15, label: 'Set the race duration', type: 'number'}]

    const fetchData = async () => {
      setLoading(true)
      let paramFromApi = await readData.getLocalApi("get_param_list")
      //For testing purpose
      let list = []
      let trackList = []
      let carList = []
      Object.keys(paramFromApi['paramList']).map((fileName) => {
        paramFromApi['paramList'][fileName].map((param) => {
          list.push({
            "file": fileName,
            "name" : param.name,
            "value" : param.currentValue, 
            "label" : param.label,
            "type" : param.type})
        })
      })
      setInputList(list);
      Object.keys(paramFromApi['tracks']).map((index) => {
        trackList.push({
          "index" : index,
          "available": paramFromApi['tracks'][index]['available'],
          "name": paramFromApi['tracks'][index]['tracks'][0]
        })
      })
      setTrackList(trackList)
      Object.keys(paramFromApi['cars']).map((index) => {
        carList.push({
          "index" : index,
          "available": paramFromApi['cars'][index]['available'],
          "model": paramFromApi['cars'][index]['model'],
          "class": paramFromApi['cars'][index]['class']
        })
      })
      setCarList(carList)
      setUserList(paramFromApi['entry'])
    } 

    const handleInputChange = (e, index) => {
      const { type, value } = e.target;
      const list = [...inputList];
      list[index]["value"] = type !== 'number' ?  value : Number.parseInt(value);
      setInputList(list);
    }
    const handleTrackChange = (e, index) => {
      const list = [...trackList];
      list[index]["available"] = !trackList[index]["available"]
      setTrackList(list);
    }
    const handleCarChange = (e, index) => {
      const list = [...carList];
      list[index]["available"] = !carList[index]["available"]
      setCarList(list);
    }
    const handleUserChange = (e, index) => {
      const list = [...userList];
      list[index]["available"] = !userList[index]["available"]
      setUserList(list);
    }
    const handleSubmit = async (e) => {
      e.preventDefault()
      let paramFromApi = await readData.postLocalApi("update_parameter", inputList)
      toggleToast(paramFromApi)
      document.getElementById('toggleParam').click()
    }
    const handleSubmitTrack = async (e) => {
      e.preventDefault()
      let paramFromApi = await readData.postLocalApi("update_track_parameter", trackList)
      toggleToast(paramFromApi)
      document.getElementById('toggleTrack').click()
    }
    const handleSubmitCar = async (e) => {
      e.preventDefault()
      let paramFromApi = await readData.postLocalApi("update_car_parameter", carList)
      toggleToast(paramFromApi)
      document.getElementById('toggleCar').click()
    }
    const handleSubmitUser = async (e) => {
      e.preventDefault()
      await readData.postLocalApi("update_user_parameter", userList)
      toggleToast(true)
      document.getElementById('toggleUser').click()
    }
    const toggleToast = () => {
      setShowToast(true)
    }
    useEffect(() => {
      if(!loading)fetchData()
    });
    return (
      <>
        {loading &&
        <>
          {showToast && 
            <ToastCustom positionX={"end-0"} positionY={"top-0"} color="primary" hideToast={setShowToast}/>
          }
          <div className="container accordion-container" id="parameterHeader">
          <Accordion>
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-primary" id="toggleParam">
              {/* {toggleParam[0] === true ? "Hide" : "Show" } parameters */} Toggle parameters
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0" className="collapse">
            <form onSubmit={handleSubmit} id="collapseOne" className="collapse show" aria-labelledby="parameterHeader" data-parent="#parameterHeader">
              {
                inputList.map((param, i) => {
                  return (
                  <div className="form-group" key={i}>
                    <label>{param.label}</label>
                    <input type={param.type} className="form-control" id={param.name} name={param.name} value={param.value} onChange={e => handleInputChange(e, i)}></input>
                  </div>)

                })
              }
              <Button variant="outline-primary" type="submit" className="bottomBtn" disabled={inputList === defaultListParameters}>Save new parameters</Button>
            </form>
            </Accordion.Collapse>
          </Accordion>
          
          <Accordion>
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-primary" id="toggleTrack">
             Toggle tracks
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0" className="collapse">
            <form onSubmit={handleSubmitTrack} id="collapseTwo" className="collapse show" aria-labelledby="parameterHeader" data-parent="#parameterHeader">
              {
                trackList.map((param, i) => {
                  
                  return (
                  <div className="form-group car-list" key={i}>
                    
                    <input className="form-check-input" type="checkbox" id={"track" + i} name={"track" + i} value={i} onChange={e => handleTrackChange(e, i)} checked={param.available}></input>
                    <label className="form-check-label">{param.name}</label>
                  </div>)

                })
              }
              <Button variant="outline-primary" type="submit" className="bottomBtn" >Save new tracks</Button>
            </form>
            </Accordion.Collapse>

          </Accordion>
          <Accordion>
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-primary" id="toggleCar">
             Toggle Cars
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0" className="collapse">
            <form onSubmit={handleSubmitCar} id="collapseThree" className="collapse show" aria-labelledby="parameterHeader" data-parent="#parameterHeader">
              {
                carList.map((param, i) => {
                  
                  return (
                  <div className="form-group car-list" key={i}>
                    <input className="form-check-input" type="checkbox" id={"car" + i} name={"car" + i} value={i} onChange={e => handleCarChange(e, i)} checked={param.available}></input>
                    <label className="form-check-label">{param.model}</label>
                  </div>)
                })
              }
              <Button variant="outline-primary" type="submit" className="bottomBtn" >Save new cars</Button>
               {/* disabled={inputList === defaultListParameters} */}
            </form>
            </Accordion.Collapse>

          </Accordion>
          <Accordion>
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-primary" id="toggleUser">
             Toggle User
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0" className="collapse">
            <form onSubmit={handleSubmitUser} id="collapseFour" className="collapse show" aria-labelledby="parameterHeader" data-parent="#parameterHeader">
              {
                userList.map((param, i) => {
                  return (
                  <div className="form-group car-list" key={i}>
                    <input className="form-check-input" type="checkbox" id={"user" + i} name={"user" + i} value={i} onChange={e => handleUserChange(e, i)} checked={param.available}></input>
                    <label className="form-check-label">{param['First name'] + ' ' + param['Surname']}</label>
                  </div>)
                })
              }
              <Button variant="outline-primary" type="submit" className="bottomBtn" >Save new entrylist</Button>
               {/* disabled={inputList === defaultListParameters} */}
            </form>
            </Accordion.Collapse>

          </Accordion>
          </div>
          </>
        }
    </>
    );

}

export default AdminParameters

