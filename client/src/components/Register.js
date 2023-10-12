
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorModal from './ErrorModal'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    church: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="username" value={formData.username} onChange={handleChange} />
        <br />
        <input type="email" name="email" placeholder="email" value={formData.email} onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleChange} />
        <br />
        <input type="password" name="password_confirmation" placeholder="password confirmation" value={formData.password_confirmation} onChange={handleChange} />
        <br />
        <input type="text" name="church" placeholder="affiliated church" value={formData.church} onChange={handleChange} />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}