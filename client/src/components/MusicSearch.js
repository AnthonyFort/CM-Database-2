import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import MusicItem from './MusicItem'
import { all } from 'axios'

export default function MusicSearch() {

  const [allMusic, setAllMusic] = useState([])
  const [music, setMusic] = useState()

  const [keywordSearch, setKeywordSearch] = useState('')

  const [readingSearch, setReadingSearch] = useState({
    book: '',
    chapter: null,
  })

  const [bookSearch, setBookSearch] = useState('')


  useEffect(() => {
    async function getMusicData() {
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
    getMusicData()
  }, [])

  function handleInputChange(event) {
    const newBookValue = event.target.value
    setReadingSearch(current => ({
      ...current,
      book: newBookValue,
    }))
  }
  
  function handleKeyup() {
    const searchTerm = readingSearch.book.toLowerCase()
    const newSearchedMusic = allMusic.filter(item =>
      item.related_readings.some(reading =>
        reading.book.toLowerCase().includes(searchTerm)
      )
    )
    setMusic(newSearchedMusic)
    console.log('SEARCHED', newSearchedMusic)
  }






  return (
    <div>
      <div className='search-header'>
        <h1>Search Music</h1>
        {/* <input onKeyUp={handleKeywordKeyup} placeholder='Search keyword' /> */}
        <input
          type='text'
          value={readingSearch.book}
          onChange={handleInputChange}
          onKeyUp={handleKeyup}
          placeholder='Search Book'
        />
        <input
          type='text'
          value={readingSearch.chapter}
          onChange={(event) => setReadingSearch({ ...readingSearch, chapter: event.target.value })}
          placeholder='Search Chapter'
        />
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