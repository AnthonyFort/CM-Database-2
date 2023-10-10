import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import MusicItem from './MusicItem'

export default function MusicSearch() {

  const [allMusic, setAllMusic] = useState([])
  const [music, setMusic] = useState()

  const [keywordSearch, setKeywordSearch] = useState('')
  const [readingSearch, setReadingSearch] = useState('')


  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axiosAuth.get('/api/music')
        data.sort()
        setAllMusic(data)
        console.log('ALL MUSIC', allMusic)
        setMusic(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [])

  function filterMusicItems() {
    const filteredMusic = allMusic.filter(item => {
      if (!item.keywords) return false
      return item.keywords.some(keyword =>
        keyword.keyword.toLowerCase().includes(keywordSearch.toLowerCase())
      )
    })
    setMusic(filteredMusic)
  }



  function handleKeyup(event) {
    const selectedMusic = [...allMusic]
    const newSearchedMusic = selectedMusic.filter(music => music.title.toLowerCase().includes(event.target.value.toLowerCase()))
    setMusic(newSearchedMusic)
    console.log('SEARCHED', newSearchedMusic)
  }

  function handleKeywordKeyup(event) {
    setKeywordSearch(event.target.value)
    filterMusicItems()
  }

  const [searchInput, setSearchInput] = useState('')
  const [searchBy, setSearchBy] = useState('title')
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value)
  }



  return (
    <div>
      <div className='search-header'>
        <h1>Search Music</h1>
        <input onKeyUp={handleKeywordKeyup} placeholder='Search keyword' />
      </div>
      <section className='user-section'>
        {music && music.map(item => {
          return (
            <div key={item.id} value={item.id}>
              <Link to={`/music-page/${item.id}`}>{item.title}</Link>
            </div>
          )
        })}
      </section>
    </div>
  )
}