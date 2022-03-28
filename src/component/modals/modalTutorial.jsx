import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './modalTutorial.css'
import { useTranslation } from 'react-i18next';

const ModalTutorial = ({setShowTutorial}) => {
  const { t, } = useTranslation();
  
  const handleClose = () => {
    setShowTutorial(false);
  }
  useEffect( () => { 
    console.log("ModalTutorial")
  })
  return (
    <>
      <Modal show={true} onHide={handleClose} backdrop='static' size="lg">
        <Modal.Header>
          <Modal.Title>{t("tutorial.welcome")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{t("tutorial.serverInfoTitle")}</h3>
          <div>- {t("tutorial.serverInfo1")}</div>
          <div>- {t("tutorial.serverInfo2")}</div>
          <h3>{t("tutorial.formatTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.formatText")}</p>
          <h3>{t("tutorial.customEventTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.customEventText")}</p>
          <h3>{t("tutorial.wheelTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.wheelText")}</p>
          <h3>{t("tutorial.swapCarTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.swapCarText")}</p>
          <h3>{t("tutorial.swapPointTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.swapPointText")}</p>
          <p className="tutorial-p">{t("tutorial.leaderboardText")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTutorial