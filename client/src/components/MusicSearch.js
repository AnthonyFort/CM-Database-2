import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import { Button, Container, Form, ListGroup, ListGroupItem } from 'react-bootstrap'


export default function MusicSearch() {

  const [currentUser, setCurrentUser] = useState()
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false)
  const [allMusic, setAllMusic] = useState([])
  const [searchedMusic, setSearchedMusic] = useState([])
  const [formData, setFormData] = useState({
    keyword: '',
    book: '',
    chapter: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const { data } = await axiosAuth.get('/api/auth/current/')
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
        const { data } = await axiosAuth.get('/api/music/')
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
    if (Array.isArray(uniqueResults)) {
      return uniqueResults.sort((a, b) => b.score - a.score)
    } else {
      console.error('not an array')
      return []
    }
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    const rankedMusic = rankResults(formData.keyword, formData.book, formData.chapter)
    console.log('RANKED MUSIC', rankedMusic)
    setSearchedMusic(rankedMusic)
    setSubmitButtonClicked(true)
  }

  if (!currentUser) return <div>Unauthorised</div>

  return (
    <Container>
      <h1 className="text-center mb-4">Search Music</h1>

      <Form onSubmit={handleSubmit} className="form-groups">
        <Form.Group className="mb-2" controlId="keyword">
          <Form.Control
            type="text"
            name="keyword"
            placeholder="Enter keyword (optional)"
            value={formData.keyword}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="book">
          <Form.Control
            type="text"
            name="book"
            placeholder="Enter Bible book (optional)"
            value={formData.book}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="chapter">
          <Form.Control
            type="text"
            name="chapter"
            placeholder="Enter Chapter Number (optional)"
            value={formData.chapter}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      {submitButtonClicked ? (
        searchedMusic.length > 0 ? (
          <Container className="mt-3">
            <h2>Search Results</h2>
            <ListGroup className="mt-4">
              {searchedMusic.map(item => (
                <ListGroup.Item key={item.id}>
                  <Link to={`/music-page/${item.id}`}>{item.title}</Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Container>
        ) : (
          <p className="mt-4 text-center">No music items found</p>
        )
      ) : null}
    </Container>
  )
}