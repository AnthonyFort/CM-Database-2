import { useState, useEffect } from 'react'
import axios from 'axios'
import { setToken, getPayload } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import ErrorModal from './ErrorModal'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'

export default function Login({ getCurrentUser }) {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      setErrorMessage('Please fill out all fields.')
      setShowErrorModal(true)
      return
    }
    try {
      const { data } = await axios.post('/api/auth/login/', formData)
      console.log(data)
      setToken('access-token', data.access)
      setToken('refresh-token', data.refresh)
      await getCurrentUser()
      navigate(`/church-page/${getPayload('access-token').user_id}`)
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
        <h1 className="mt-5">Login</h1>
        <Container className="mt-1">
          <Row className="justify-content-md-center">
            <Col xs={12} md={6} lg={4}>
              <Form onSubmit={handleSubmit} className='form-groups mt-1'>
                <Form.Group controlId="formUsernameLogin" className='form-group'>
                  <Form.Control type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formPasswordLogin" className='form-group'>
                  <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} />
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