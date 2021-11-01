import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData'
import './joker.css'
import { useCookies } from 'react-cookie';
import ModalChooseDriver from '../modals/modalChooseDriver';


const Joker = ({seeResult, updateJoker}) => {
    const readData = new ReadData()
    const [openModal, setOpenModal] = useState(false)
    const [actionContext, setActionContext] = useState()
    const [swapCar, setSwapCar] = useState(null)
    const [swapPoint, setswapPoint] = useState(null)
    const [cookies, setCookie] = useCookies(['user']);

    const getJokerNumber = () => {
      readData.getLocalApi("get_param_list").then( response => {
        response.entry.forEach(driver => {
          if(driver['Steam id '] === cookies['user']){
            setSwapCar(driver['swapCar'])
            setswapPoint(driver['swapPoint'])
          }
        })
      })
    }
    const closeModal = () => {
      setOpenModal(false)
      getJokerNumber()
    }
    const openDriverChoose = (context) => {
      setOpenModal(true)
      setActionContext(context)
    }
    useEffect( () => {
      getJokerNumber()
  }, [updateJoker])
    return (
      <>
        <div className="row mt-4">
          <div className="col-md-6">
            {swapCar > 0 &&
              <div>Car swap available : {swapCar}</div>
            }
          </div>
          <div className="col-md-6">
            {swapPoint > 0 &&
              <div>Point swap available : {swapPoint}</div>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-5 me-2 d-flex justify-content-center">
            {swapCar > 0 && 
              <Button className="btnJoker mb-2" variant="primary" onClick={() => openDriverChoose("swapCar")}>
                Swap car 
              </Button>
            }
          </div>
          <div className="col-md-6 d-flex justify-content-center">
          {swapPoint > 0 && 
            <Button className="btnJoker mb-2" variant="primary" onClick={() => openDriverChoose("swapPoint")}>
              Swap point
            </Button>
          }
          </div>
        </div>

          {openModal &&
           <ModalChooseDriver seeResult={seeResult} closeModal={closeModal} context={actionContext}/>
          }
      </>
    );

}

export default Joker