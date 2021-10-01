import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData'
import Modal from 'react-bootstrap/Modal';
import './modalCheck.css'
import Form from 'react-bootstrap/Form'
import { useCookies } from 'react-cookie';


const ModalConnect = ({setAdmin}) => {

  const [cookies, setCookie] = useCookies(['user']);
  const readData = new ReadData()
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectDriver, setSelectDriver] = useState([])
  const [isEmpty, setIsEmpty] = useState(true)
  const [driverId, setDriverId] = useState()
  const [driverName, setDriverName] = useState()

  const handleSelect = (e) => {
    const currentDrivername = document.getElementById(e.target.value).getAttribute('drivername')
    setDriverId(e.target.value)
    setDriverName(currentDrivername)
    setIsEmpty(false)
  }

  const handleClose = () => setShow(false);
  const handleConfirm = () => {
    var driverInfo = selectDriver.filter(obj => {
      return obj['Steam id '] === driverId
    })
    if(driverInfo[0]['isAdmin']){
      localStorage.setItem('admin', true);
      setAdmin(true)
    } else {
      localStorage.setItem('admin', false);
      setAdmin(false)
    }
    setCookie('user', driverId, {path: '/'})
    setCookie('name', driverName, {path: '/'})
    handleClose();
  }
  const fetchDriver = async () => {
    let allInfo = await readData.getLocalApi("fetch_drivers")
    if(allInfo){
      setSelectDriver(allInfo)
      setLoading(false)
    }
  }
    useEffect( () => {
      if(loading)fetchDriver()
  })
  return (
    <>
    {!loading && 
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Who are you ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <select class="form-select" aria-label="Default select example" onChange={handleSelect}>
          <option></option>
          {selectDriver.map((element) => {
            return <option id={element["Steam id "]} value={element["Steam id "]} drivername={element["First name"] + ' ' + element["Surname"]}>{element["First name"]} {element["Surname"]}</option>
          })}
        </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Continue as guest
          </Button>
          <Button variant="secondary" onClick={handleConfirm} disabled={isEmpty}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    }
    </>
  );
}

export default ModalConnect