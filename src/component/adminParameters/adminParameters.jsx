import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Accordion, {Item} from 'react-bootstrap/Accordion'
import './adminParameters.css'
import ReadData from '../../services/readData'


const AdminParameters = ({admin, setAdmin, closeAdminPanel}) => {
    const readData = new ReadData()
    const [inputList, setInputList] = useState([])
    const [toggleParam, setToggleParam] = useState([false, false, false])
    const [loading, setLoading] = useState(false)
    const [trackList, setTrackList] = useState([])
    const [carList, setCarList] = useState([])
    const [userList, setUserList] = useState([])
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
        paramFromApi['paramList'][fileName].map((param, i) => {
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
      // Object.keys(paramFromApi['entry']).map((index) => {
      //   userList.push({
      //     "index" : index,
      //     "name": paramFromApi['entry'][index]['First name'] + ' ' + paramFromApi['entry'][index]['Surname'],
      //     "available": paramFromApi['entry'][index]['available']
      //   })
      // })
      setUserList(paramFromApi['entry'])
    } 
    const toggleParameter = (index) => {
      let temp = toggleParam 
      temp[index] = !temp[index]
      setToggleParam(temp)
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
    }
    const handleSubmitTrack = async (e) => {
      e.preventDefault()
      let paramFromApi = await readData.postLocalApi("update_track_parameter", trackList)
    }
    const handleSubmitCar = async (e) => {
      e.preventDefault()
      let paramFromApi = await readData.postLocalApi("update_car_parameter", carList)
    }
    const handleSubmitUser = async (e) => {
      e.preventDefault()
      let paramFromApi = await readData.postLocalApi("update_user_parameter", userList)
    }
    useEffect(() => {
      if(!loading)fetchData()
    });
    return (
      <>
        {admin && loading &&
        <>

          <div className="container accordion-container" id="parameterHeader">
          <Accordion>
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-outline-primary" onClick={() => toggleParameter(0)}>
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
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-outline-primary" onClick={() => toggleParameter(1)}>
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
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-outline-primary" onClick={() => toggleParameter(1)}>
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
            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="btn btn-outline-primary" onClick={() => toggleParameter(1)}>
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

