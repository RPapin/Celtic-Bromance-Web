import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './modalCheck.css'
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

const ModalConnect = ({setAdmin, selectDriver}) => {
  const { t, } = useTranslation();
  const [, setCookie] = useCookies(['user']);
  const [show, setShow] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true)
  const [driverId, setDriverId] = useState()
  const [driverName, setDriverName] = useState()

  const handleSelect = (e) => {
    const currentDrivername = document.getElementById(e.target.value).getAttribute('drivername')
    setDriverId(e.target.value)
    setDriverName(currentDrivername)
    setIsEmpty(false)
  }

  const handleClose = (isAdmin = false) => {
    if(!isAdmin){
      localStorage.setItem('admin', false);
      setAdmin(false)
      setShow(false);
    }
  }
  const handleConfirm = () => {
    let isAdmin = false
    var driverInfo = selectDriver.filter(obj => {
      return obj['Steam id '] === driverId
    })
    if(driverInfo[0]['isAdmin']){
      setAdmin(true)
      isAdmin = true
      localStorage.setItem('admin', true);
    } else {
      localStorage.setItem('admin', false);
      setAdmin(false)
    }
    setCookie('user', driverId, {path: '/'})
    setCookie('name', driverName, {path: '/'})
    handleClose(isAdmin);
  }

  return (
    <>
    <Modal show={show} onHide={handleClose} backdrop='static'>
      <Modal.Header>
        <Modal.Title>{t("connect.connect")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <select className="form-select" aria-label="Default select example" onChange={handleSelect}>
        <option></option>
        {selectDriver.map((element) => {
          return <option id={element["Steam id "]} value={element["Steam id "]} drivername={element["First name"] + ' ' + element["Surname"]} key={element["Steam id "]}>{element["First name"]} {element["Surname"]}</option>
        })}
      </select>
      <div>
        {t("connect.notInList")} 
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfb6ECB7ahE3GrvNVjRdRGYnXhlAMl9cMJ8qmwA5YEDnudJeg/viewform" target={"_blank"}>{t("connect.fillForm")}</a>
        {/* <Button variant="secondary" onClick={connectThroughSteam} >
          {t("connect.thoughSteam")}
        </Button> */}
      </div>

      </Modal.Body>
      <Modal.Footer>
        
        <Button variant="secondary" onClick={handleConfirm} disabled={isEmpty}>
        {t("save")}
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default ModalConnect