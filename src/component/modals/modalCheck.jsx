import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './modalCheck.css'
import { useTranslation } from 'react-i18next';


const ModalCheck = (props) => {
    const [show, setShow] = useState(true);
    const { t, } = useTranslation();
    const handleClose = () => setShow(false);
  
    return (
      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{t("modal.newsTitle")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.text}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            {t("close")}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );

}

export default ModalCheck