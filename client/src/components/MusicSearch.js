import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import MusicItem from './MusicItem'


export default function MusicSearch() {

  const [allReadingMusic, setAllReadingMusic] = useState([])
  const [readingMusic, setReadingMusic] = useState([])
  const [allKeywordMusic, setAllKeywordMusic] = useState([])
  const [keywordMusic, setKeywordMusic] = useState([])

  const [keywordSearch, setKeywordSearch] = useState('')

  const [readingSearch, setReadingSearch] = useState({
    book: '',
    chapter: null,
  })

  const [bookSearch, setBookSearch] = useState('')


  useEffect(() => {
    async function getMusicDataForReadings() {
      try {
        const { data } = await axiosAuth.get('/api/music')
        data.sort()
        setAllReadingMusic(data)
        setReadingMusic(data)
      } catch (error) {
        console.log(error)
      }
    }
    getMusicDataForReadings()
  }, [])

  useEffect(() => {
    async function getMusicDataForKeywords() {
      try {
        const { data } = await axiosAuth.get('/api/music')
        data.sort()
        setAllKeywordMusic(data)
        setKeywordMusic(data)
      } catch (error) {
        console.log(error)
      }
    }
    getMusicDataForKeywords()
  }, [])

  function handleBookInputChange(event) {
    const newBookValue = event.target.value
    setReadingSearch(current => ({
      ...current,
      book: newBookValue,
    }))
  }

  function handleChapterInputChange(event) {
    const newChapterValue = event.target.value
    setReadingSearch(current => ({
      ...current,
      chapter: newChapterValue,
    }))
  }

  function handleSearch() {
    const book = readingSearch.book.toLowerCase()
    const chapter = readingSearch.chapter

    const newSearchedMusic = allReadingMusic.filter(item =>
      item.related_readings.some(reading =>
        reading.book.toLowerCase().includes(book) &&
        (chapter ? reading.chapter === parseInt(chapter) : true)
      )
    )
    setReadingMusic(newSearchedMusic)
    console.log('SEARCHED', newSearchedMusic)
  }

  function handleKeywordKeyup(event) {
    const selectedMusic = [...allKeywordMusic]
    const newSearchedMusic = selectedMusic.filter(item =>
      item.keywords.some(keyword =>
        keyword.keyword.toLowerCase().includes(event.target.value)
      ))
    setKeywordMusic(newSearchedMusic)

  }




  return (
    <div>
      <div className='search-header'>
        <h1>Search Music</h1>
        <div>
          <h2>Search by Reading</h2>
          <input
            type='text'
            value={readingSearch.book}
            onChange={handleBookInputChange}
            onKeyUp={handleSearch}
            placeholder='Search Book'
          />
          <input
            type='text'
            value={readingSearch.chapter}
            onChange={handleChapterInputChange}
            onKeyUp={handleSearch}
            placeholder='Search Chapter'
          />
        </div>
        <section className='user-section'>
          {readingMusic && readingMusic.map(item => {
            return (
              <div key={item.id} value={item.id}>
                <Link to={`/music-page/${item.id}`}>{item.title}</Link>
              </div>
            )
          })}
        </section>
      </div>
      <h2>Search by Keyword</h2>
      <input onKeyUp={handleKeywordKeyup} placeholder='Search keyword' />\
      <section className='user-section'>
        {keywordMusic && keywordMusic.map(item => {
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