import { Button, Modal } from 'react-bootstrap'

export default function SavedModal({ show, onClose }){
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Music Item Saved</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Music Item Saved</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}