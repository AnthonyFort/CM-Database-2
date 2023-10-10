import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'

export default function SearchUsers() {

  const [allChurches, setAllChurches] = useState([])
  const [churches, setChurches] = useState()


  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axiosAuth.get('/api/auth')
        data.sort()
        setAllChurches(data)
        console.log('ALL CHURCHES', allChurches)
        setChurches(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [])

  function handleKeyup(event) {
    const selectedChurches = [...allChurches]
    const newSearchedChurches = selectedChurches.filter(church => church.church.toLowerCase().includes(event.target.value.toLowerCase()))
    setChurches(newSearchedChurches)
    console.log('SEARCHED', newSearchedChurches)
  }



  const [searchInput, setSearchInput] = useState('')
  const [searchBy, setSearchBy] = useState('church') 
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value)
  }

  return (
    <div>
      <div className='search-header'>
        <h1>Search Churches</h1>
        <input onKeyUp={handleKeyup} placeholder='Search name' />
      </div>
      <section className='user-section'>
        {churches && churches.map(church => {
          return (
            <div key={church.id} value={church.id}>
              <Link to={`/church-page/${church.id}`}>{church.church}</Link>
            </div>
          )
        })}
      </section>
    </div>
  )
}