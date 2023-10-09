import { useEffect } from 'react'
import axiosAuth from './lib/axios'
import Login from './components/Login'
import { getToken } from './lib/auth'

export default function App() {

  return <Login />
}
