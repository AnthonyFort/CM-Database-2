import { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Container, Nav, Navbar, Row, Col, Button } from 'react-bootstrap'

import { setToken, getToken } from '../utils/auth'
import { stateValues, fieldValues } from '../utils/common'

import ErrorModal from './ErrorModal'


export default function FormPage({ title, request, fields, redirect, onLoad }) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(stateValues(fields))
  const [errors, setErrors] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    async function fillFormFields() {
      try {
        const { data } = await onLoad()
        setFormData(data)
      } catch (error) {
        console.error(error)
        setErrors(error)
      }
    }
    if (onLoad) {
      fillFormFields()
    }
  }, [onLoad])

  async function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
    setErrors('')
  }


  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const { data } = await request(formData)
      if (data.token) {
        setToken(data.token)
      }
      if (redirect) {

        const token = getToken()
        if (!token) return false
        const payload = JSON.parse(window.atob(token.split('.')[1]))
        const payloadExpiry = payload.exp
        const userID = payload.sub

        if (title === 'Login') {
          navigate(`/users/${userID}`)
        }

        if (title === 'Register') {
          navigate('/login')
        }

      }
    } catch (error) {
      const errorMessage = error.response.data.message
      console.error(errorMessage)
      setErrors(errorMessage)
      setShowErrorModal(true)
    }
  }

  return (
    <section className="form-col">
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />}
      <div className="entry">
        <div className="text">
          <h1>AAG Music</h1>
          <h3>Where artists help each other get heard.</h3>
        </div>
      </div>
      <Container>
        <Row>
          {fields.length > 0 ?
            <Col as="form" onSubmit={handleSubmit} className="form-col">
              {fieldValues(fields).map(field => {
                const { type, name, variable } = field
                return (
                  <div key={variable} className='form-fields'>
                    <label hidden htmlFor={variable}>{name}</label>
                    <input
                      type={type}
                      name={variable}
                      placeholder={name}
                      value={formData[variable]}
                      onChange={handleChange}
                    />
                  </div>
                )
              })}
              {errors && <p>{errors}</p>}
              {<button className='submit-button' type="submit">{title}</button>}
            </Col>
            :
            'Form Error'
          }
        </Row>
      </Container>
    </section>
  )
}