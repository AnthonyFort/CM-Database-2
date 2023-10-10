import axiosAuth from './lib/axios'
import { getToken } from './lib/auth'

import { Routes, Route } from 'react-router-dom'

import AddService from './components/AddService'
import ChurchPage from './components/ChurchPage'
import ChurchSearch from './components/ChurchSearch'
import FormPage from './components/FormPage'
import Home from './components/Home'
import Login from './components/Login'
import MusicSearch from './components/MusicSearch'
import NavBar from './components/Nav'
import NotFound from './components/NotFound'
import Register from './components/Register'
import SavedMusicItems from './components/SavedMusicItems'
import MusicItem from './components/MusicItem'

export default function App() {

  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/add-service' element={<AddService />} />
          <Route path='/church-page/:id' element={<ChurchPage />} />
          <Route path='/church-search' element={<ChurchSearch />} />
          <Route path='/music-search' element={<MusicSearch />} />
          <Route path='/music-page/:id' element={<MusicItem />} />
          <Route path='/saved-music' element={<SavedMusicItems />} />
        </Routes>
      </main>
    </>
  )
}
