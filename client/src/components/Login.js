import { useState } from 'react'
import axios from 'axios'
import { setToken } from '../lib/auth'

export default function Login() {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formData)
      setToken('access-token', data.access)
      setToken('refresh-token', data.refresh)
      console.log('TOKENS ADDED TO STORAGE')
      setMessage('Login was successful')
    } catch (error) {
      console.log(error)
      setMessage(error.response.data.detail)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={formData.username} onChange={handleChange} />
      <br />
      <input type="password" name="password" value={formData.password} onChange={handleChange}  />
      <br />
      {message && <p>{message}</p>}
      <input type="submit" value="Submit" />
    </form>
  )
}