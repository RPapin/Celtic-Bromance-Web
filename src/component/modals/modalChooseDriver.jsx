import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useCookies } from 'react-cookie';


const ModalChooseDriver = (props) => {
  
  const readData = new ReadData()
  const [cookies, setCookie] = useCookies(['user']);
  const [loading, setLoading] = useState(true);
  const [selectDriver, setSelectDriver] = useState([])
  const [driverSelected, setDriverSelected] = useState([])
  const title = props.context === "swapCar" ? "Choose the driver you want to change your car with " : "Choose the driver you want to change your point during the next round ";

  const handleSelect = (e) => {
    setDriverSelected(e.target.value)
  }
  const handleClose = () => props.closeModal();
  const fetchDriver = async () => {
    let allInfo = await readData.getLocalApi("fetch_drivers")
    if(allInfo){
      let driverAvailable = []
      allInfo.forEach(element => {
        if(element['available'] && element['Steam id '] !== cookies['user'])driverAvailable.push(element)
      });
      setSelectDriver(driverAvailable)
      setLoading(false)
    }
  }
  const confirmSelect = async () => {
    readData.postLocalApi(props.context, [cookies['user'], driverSelected]).then(() => {
      props.seeResult()
    })
    props.closeModal()
  }
  useEffect( () => {
    if(loading)fetchDriver()
  })

  return (
    <>
    {!loading && 
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <select class="form-select" aria-label="Default select example" onChange={handleSelect}>
          <option></option>
          {selectDriver.map((element) => {
            return <option value={element["Steam id "]} key={element["Steam id "]}>{element["First name"]} {element["Surname"]}</option>
          })}
        </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={confirmSelect}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    }
    </>
  );
}

export default ModalChooseDriver