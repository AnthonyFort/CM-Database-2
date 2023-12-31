
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorModal from './ErrorModal'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'

export default function Register() {

  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password_confirmation: '',
    church: '',
  })

  // Sets the state of the given form field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Checks that all form fields have been filled
    if (!formData.username || !formData.password || !formData.password_confirmation || !formData.church) {
      setErrorMessage('Please fill out all fields.')
      setShowErrorModal(true)
      return
    }
    try {
      const { data } = await axios.post('/api/auth/register/', formData)
      navigate('/login')
    } catch (error) {
      console.log(error)
      setErrorMessage(error.message)
      setShowErrorModal(true)
    }
  }


  return (
    <>
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} errorMessage={errorMessage} />}
      <div className='form'>
        <h1 className="mt-5">Register</h1>
        <Container className="mt-1">
          <Row className="justify-content-md-center">
            <Col xs={12} md={6} lg={4}>
              <Form onSubmit={handleSubmit} className='form-groups mt-1' >
                <Form.Group controlId="formUsername" className='form-group'>
                  <Form.Control type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formChurch" className='form-group'>
                  <Form.Control type="text" name="church" placeholder="Enter affiliated church" value={formData.church} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formPassword" className='form-group'>
                  <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formPasswordConfirmation" className='form-group'>
                  <Form.Control type="password" name="password_confirmation" placeholder="Confirm password" value={formData.password_confirmation} onChange={handleChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className='form-submit mt-2'>
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}