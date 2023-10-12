import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import MusicItem from './MusicItem'


export default function MusicSearch() {

  const [currentUser, setCurrentUser] = useState()

  const [submitButtonClicked, setSubmitButtonClicked] = useState(false)

  const [formData, setFormData] = useState({
    keyword: '',
    book: '',
    chapter: '',
  })

  const [allMusic, setAllMusic] = useState([])
  const [searchedMusic, setSearchedMusic] = useState([])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
    async function getMusicData() {
      try {
        const { data } = await axiosAuth.get('/api/music')
        data.sort()
        setAllMusic(data)
      } catch (error) {
        console.log(error)
      }
    }
    getMusicData()
  }, [])


  function rankResults(keyword, book, chapter) {
    const results = [...allMusic]
      .map(item => {
        let score = 0

        if (keyword) {
          const keywordRegex = new RegExp(keyword, 'gi')
          const keywordScore = (item.keywords || []).reduce((acc, k) => {
            const match = k.keyword.match(keywordRegex)
            return acc + (match ? match.length : 0)
          }, 0)
          score += keywordScore
        }

        if (book) {
          const bookRegex = new RegExp(book, 'gi')
          const readingScore = (item.related_readings || []).reduce((acc, reading) => {
            const bookMatch = reading.book.match(bookRegex)
            const chapterMatch = chapter ? reading.chapter === parseInt(chapter) : true
            return acc + (bookMatch && chapterMatch ? 1 : 0)
          }, 0)
          score += readingScore
        }

        return {
          ...item,
          score,
        }
      })
      .filter(item => item.score)

    const uniqueResults = Array.from(new Map(results.map(item => [item.id, item])).values())
    return uniqueResults.sort((a, b) => b.score - a.score)
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    const rankedMusic = rankResults(formData.keyword, formData.book, formData.chapter)
    console.log(rankedMusic)
    setSearchedMusic(rankedMusic)
    setSubmitButtonClicked(true)
  }


  if (!currentUser) return <div>Unauthorised</div>

  return (
    <div>
      <div className='search-header'>
        <h1>Search Music</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="keyword"
              placeholder="search keyword"
              value={formData.keyword}
              onChange={handleChange}
            />
            <input
              type="text"
              name="book"
              placeholder="Search Book"
              value={formData.book}
              onChange={handleChange}
            />
            <input
              type="text"
              name="chapter"
              placeholder="Search Chapter"
              value={formData.chapter}
              onChange={handleChange}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        {submitButtonClicked && searchedMusic.length > 0 ? (
          <section className='user-section'>
            {searchedMusic && searchedMusic.map(item => {
              return (
                <div key={item.id} value={item.id}>
                  <Link to={`/music-page/${item.id}`}>{item.title}</Link>
                </div>
              )
            })}
          </section>
        ) :  'No music items found'}
      </div>
    </div>
  )
}