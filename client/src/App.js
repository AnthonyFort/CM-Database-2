import axiosAuth from './lib/axios'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import ChurchPage from './components/ChurchPage'
import ChurchSearch from './components/ChurchSearch'
import Home from './components/Home'
import Login from './components/Login'
import MusicSearch from './components/MusicSearch'
import NavBar from './components/Nav'
import NotFound from './components/NotFound'
import Register from './components/Register'
import SavedMusicItems from './components/SavedMusicItems'
import MusicItem from './components/MusicItem'

export default function App() {

  const [currentUser, setCurrentUser] = useState()
  async function getCurrentUser() {
    try {
      const { data } = await axiosAuth.get('/api/auth/current/')
      setCurrentUser(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <>
      <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login getCurrentUser={getCurrentUser} />} />
          <Route path='/church-page/:id' element={<ChurchPage currentUser={currentUser} getCurrentUser={getCurrentUser} />} />
          <Route path='/church-search' element={<ChurchSearch />} />
          <Route path='/music-search' element={<MusicSearch />} />
          <Route path='/music-page/:id' element={<MusicItem />} />
          <Route path='/saved-music' element={<SavedMusicItems />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
