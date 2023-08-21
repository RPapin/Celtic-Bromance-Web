import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './modalTutorial.css'
import { useTranslation } from 'react-i18next';
import ServerInfo from "../../serverInfo.json";

const ModalTutorial = ({setShowTutorial}) => {
  const { t, } = useTranslation();
  
  const handleClose = () => {
    setShowTutorial(false);
  }
  return (
    <>
      <Modal show={true} onHide={handleClose} backdrop='static' size="lg">
        <Modal.Header>
          <Modal.Title>{t("tutorial.welcome")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='tuto-text-container'>
          <div className='find-more-link'>
            <p className="tutorial-p find-more">{t("tutorial.findMore")}</p>
            <a className="tutorial-p find-more " href={t("tutorial.discordLink")}>{t("tutorial.discordLink")}</a>
          </div>
          <h3>{t("tutorial.serverInfoTitle")}</h3>
          <div>- {t("serverSettings.name")} : {ServerInfo.name}</div>
          <div>- {t("serverSettings.password")} : {ServerInfo.password}</div>
          <h3>{t("tutorial.formatTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.formatText")}</p>
          <h3>{t("tutorial.customEventTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.customEventText")}</p>
          <h3>{t("tutorial.wheelTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.wheelText")}</p>
          <h2>{t("tutorial.jokersTitle")}</h2>
          <h3>{t("tutorial.swapCarTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.swapCarText")}</p>
          <h3>{t("tutorial.teamWithTitle")}</h3>
          <p className="tutorial-p">{t("tutorial.teamWithText")}</p>
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