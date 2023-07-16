import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData';
import Modal from 'react-bootstrap/Modal';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';


const ModalChooseDriver = (props) => {
  const { t, } = useTranslation();
  const readData = new ReadData()
  const [cookies, ] = useCookies(['user']);
  const [loading, setLoading] = useState(true);
  const [selectDriver, setSelectDriver] = useState([])
  const [driverSelected, setDriverSelected] = useState([])
  const title = props.context === "swapCar" ? t("swapCar.title") : t("teamWith.title");

  const handleSelect = (e) => {
    setDriverSelected(e.target.value)
  }
  const handleClose = () => props.closeModal();
  const fetchDriver = async () => {
    let allInfo = await readData.getLocalApi("fetch_drivers")
    if(allInfo){
      let driverAvailable = []
      allInfo.forEach(element => {
        if(props.context === "swapCar"){
            if(element['available'] && element['Steam id '] !== cookies['user']){
              driverAvailable.push(element)
            }
        }
        else {
          if(element['available'] && element['Steam id '] !== cookies['user'] && element['teamWithVictim'] < 1){
            driverAvailable.push(element)
          }
        }
      });
      setSelectDriver(driverAvailable)
      setLoading(false)
    }
  }
  const confirmSelect = async () => {
    readData.postLocalApi(props.context, [cookies['user'], driverSelected]).then((e) => {
      props.seeResult()
    })
    props.closeModal()
  }
  useEffect( () => {
    console.log("useEffect choose")
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
       
        <select className="form-select" aria-label="Default select example" onChange={handleSelect}>
          <option></option>
          {selectDriver.map((element) => {
            return <option value={element["Steam id "]} key={element["Steam id "]}>{element["First name"]} {element["Surname"]}</option>
          })}
        </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={confirmSelect}>
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
    }
    </>
  );
}

export default ModalChooseDriver