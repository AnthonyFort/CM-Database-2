import FormPage from './FormPage'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    church: '',
  })

  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/register/', formData)
    } catch (error) {
      console.log(error)
      setMessage(error.response.data.detail)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={formData.username} onChange={handleChange} />
      <br />
      <input type="email" name="email" value={formData.email} onChange={handleChange} />
      <br />
      <input type="password" name="password" value={formData.password} onChange={handleChange}  />
      <br />
      <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange}  />
      <br />
      <input type="text" name="church" value={formData.church} onChange={handleChange} />
      <br />
      {message && <p>{message}</p>}
      <input type="submit" value="Submit" />
    </form>
  )
}