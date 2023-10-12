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

  const [currentUser, setCurrentUser] = useState()

  const [keywordButtonClicked, setKeywordButtonClicked] = useState(false)
  const [readingButtonClicked, setReadingButtonClicked] = useState(false)
  const [keywordFormData, setKeywordFormData] = useState({ keyword: '' })
  const [readingFormData, setReadingFormData] = useState({
    book: '',
    chapter: '',
  })


  const handleChange = (e) => {
    setKeywordFormData({ ...keywordFormData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const { data } = await axiosAuth.get('/api/auth/current')
        setCurrentUser(data)
      } catch (error) {
        console.log(error)
      }
    }
    getCurrentUser()
  }, [])


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

  const handleKeywordSubmit = async (event) => {
    event.preventDefault()
    const selectedMusic = [...allKeywordMusic]
    const newSearchedMusic = selectedMusic.filter(item =>
      item.keywords.some(keyword =>
        keyword.keyword.toLowerCase().includes(keywordFormData.keyword)
      ))
    setKeywordMusic(newSearchedMusic)
    setKeywordButtonClicked(true)
  }

  const handleReadingSubmit = async (event) => {
    event.preventDefault()
    const book = readingSearch.book.toLowerCase()
    const chapter = readingSearch.chapter
    const selectedMusic = [...allReadingMusic]
    const newSearchedMusic = selectedMusic.filter(item =>
      item.related_readings.some(reading =>
        reading.book.toLowerCase().includes(book) &&
        (chapter ? reading.chapter === parseInt(chapter) : true)
      )
    )
    setReadingMusic(newSearchedMusic)
    setReadingButtonClicked(true)
  }


  if (!currentUser) return <div>Unauthorised</div>

  return (
    <div>
      <div className='search-header'>
        <h1>Search Music</h1>
        <div>
          <h2>Search by Reading</h2>
          <form onSubmit={handleReadingSubmit}>
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
            <input type="submit" value="Submit" />
          </form>
        </div>
        {readingButtonClicked && (
          <section className='user-section'>
            {readingMusic && readingMusic.map(item => {
              return (
                <div key={item.id} value={item.id}>
                  <Link to={`/music-page/${item.id}`}>{item.title}</Link>
                </div>
              )
            })}
          </section>
        )}

      </div>
      <h2>Search by Keyword</h2>
      <form onSubmit={handleKeywordSubmit}>
        <input type="text" name="keyword" placeholder="search keyword" value={keywordFormData.keyword} onChange={handleChange} />
        <input type="submit" value="Submit" />
      </form>
      {keywordButtonClicked && (
        <section className='user-section'>
          {keywordMusic && keywordMusic.map(item => {
            return (
              <div key={item.id} value={item.id}>
                <Link to={`/music-page/${item.id}`}>{item.title}</Link>
              </div>
            )
          })}
        </section>
      )}


    </div>
  )
}