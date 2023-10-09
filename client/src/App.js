import { useEffect } from 'react'
import axiosAuth from './lib/axios'
import Login from './components/Login'
import { getToken } from './lib/auth'

export default function App() {
  // useEffect(() => {
  //   async function getData(){
  //     try {
  //       const { data } = await axiosAuth.get('/api/books/') // <---- Replace with your endpoint to test the proxy
  //       console.log(data)
  //     } catch (error) {
  //       console.log(error.message)
  //     }
  //   }
  //   getData()
  // }, [])

  return <Login />
}
