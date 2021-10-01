import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './modalCheck.css'


const ModalCheck = (props) => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
  
    return (
      <>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Breaking News</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.text}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );

}

export default ModalCheck