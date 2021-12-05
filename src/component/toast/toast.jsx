import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import ReadData from '../../services/readData'



const Toast = ({position, color}) => {
    const [openModal, setOpenModal] = useState(false)


    const closeModal = () => {
      setOpenModal(false)
      getJokerNumber()
    }

    useEffect( () => {

  }, )
    return (
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
        <strong class="me-auto">Bootstrap</strong>
        <small></small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
        Hello, world! This is a toast message.
        </div>
    </div>
    </div>
    );

}

export default Toast