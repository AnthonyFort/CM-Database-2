import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken, setToken } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import axiosAuth from '../lib/axios'


export default function Login() {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState()
  const [accessToken, setAccessToken] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formData)
      setToken('access-token', data.access)
      setToken('refresh-token', data.refresh)
      setAccessToken(data.access)
      setIsLoggedIn(true)
    } catch (error) {
      console.log(error)
      setMessage(error.response.data.detail)
    }
  }

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const { data } = await axiosAuth.get('/api/auth/current')
        setCurrentUser(data)
        if (data && data.id) {
          navigate(`/church-page/${data.id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (accessToken) {
      getCurrentUser()
    }

  }, [accessToken])

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="username" value={formData.username} onChange={handleChange} />
      <br />
      <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleChange} />
      <br />
      {message && <p>{message}</p>}
      <input type="submit" value="Submit" />
    </form>
  )
}