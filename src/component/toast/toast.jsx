import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import './toast.css'



const ToastCustom = ({positionX, positionY, color, hideToast}) => {
    
    const { t, i18n } = useTranslation();
    const [openModal, setOpenModal] = useState(false)


    const closeModal = () => {
      setOpenModal(false)
    }

    useEffect( () => {
        setTimeout(() => {
            hideToast(false)
        }, 5000)
  })
    return (
    <div className={"position-fixed m-1 " + positionX + " " + positionY}>
    <div id="liveToast" className={"toast align-items-center text-white border-0 fade show bg-" + color}  role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
            <div className="toast-body">
                {t("toast.updateSuceed")}
            </div>
            <button type="button" className="btn-close-toast btn-close btn-close-white m-auto me-2" aria-label="Close" onClick={() => hideToast(false)}></button>
        </div>
    </div>
    </div>
    );

}

export default ToastCustom