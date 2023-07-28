/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData'
import Modal from 'react-bootstrap/Modal';
import './modalServerInfo.css'
import { useTranslation } from 'react-i18next';


const ModalServerInfo = ({setModalInfo}) => {
  const { t } = useTranslation();
  const readData = new ReadData()
  // const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inputList, setInputList] = useState([])


  const handleClose = () => {
    setModalInfo(false);
  }

  const getWeatherPct = (weatherWeight) => {
    let total = 0;
    let weatherPct = []
    weatherWeight.forEach(element => {
      total += element
    });
    weatherWeight.forEach(element => {
      let pct = Math.round(element / total * 100)
      weatherPct.push(pct)
    });
    return weatherPct
  }
  const fetchServerInfo = async () => {
    let paramFromApi = await readData.getLocalApi("get_param_list")
    //For testing purpose
    let list = []
    Object.keys(paramFromApi['paramList']).map((fileName) => {
      paramFromApi['paramList'][fileName].map((param) => {
        list[param.name] = param.currentValue
        if(param.name === 'weatherWeightConfiguration'){
          list['weatherPct'] = getWeatherPct(param.currentValue)
        }
    })
    setInputList(list);
    setLoading(false)
    })
  }

  useEffect( () => {
    if(loading)fetchServerInfo()
  })
  return (
    <>
    {!loading && 
      <Modal show={true} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{t("serverSettings.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="info-title">{t("serverSettings.pointDistribution")} </div>
              <div>{inputList["pointConfiguration"].map( (point) => {
                  return point + ','
              })}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="info-title">{t("serverSettings.weatherProba")} </div>
              <div>{t("serverSettings.Flooded") + " => " + inputList["weatherPct"][0]}% , {t("serverSettings.Wet") + " => " + inputList["weatherPct"][1]}% , 
              {t("serverSettings.Damp") + " => " + inputList["weatherPct"][2]}% , {t("serverSettings.Dry") + " => " + inputList["weatherPct"][3]}% </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} >
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    }
    </>
  );
}

export default ModalServerInfo