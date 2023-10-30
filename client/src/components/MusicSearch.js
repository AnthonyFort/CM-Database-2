import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import { Button, Container, Form, ListGroup, Row, Col, InputGroup } from 'react-bootstrap'


export default function MusicSearch() {

  const [currentUser, setCurrentUser] = useState()
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false)
  const [allMusic, setAllMusic] = useState([])
  const [searchedMusic, setSearchedMusic] = useState([])
  const [keywordFields, setKeywordFields] = useState([{ keyword: '' }])
  const [readingFields, setReadingFields] = useState([{ book: '', chapter: '' }])

  const handleKeywordChange = (e, index) => {
    const updatedKeywordFields = [...keywordFields]
    updatedKeywordFields[index].keyword = e.target.value
    setKeywordFields(updatedKeywordFields)
  }

  const handleReadingChange = (e, index, field) => {
    const updatedReadings = [...readingFields]
    updatedReadings[index][field] = e.target.value
    setReadingFields(updatedReadings)
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

  function rankResults(keywords, readings) {
    const results = [...allMusic].map(item => {
      let score = 0

      keywords.forEach(keyword => {
        if (keyword) {
          const keywordRegex = new RegExp(keyword, 'gi')
          const keywordScore = (item.keywords || []).reduce((acc, k) => {
            const match = k.keyword.match(keywordRegex)
            return acc + (match ? match.length : 0)
          }, 0)
          score += keywordScore
        }
      })
      readings.forEach(({ book, chapter }) => {
        if (book) {
          const bookRegex = new RegExp(book, 'gi')
          const readingScore = (item.related_readings || []).reduce((acc, reading) => {
            const bookMatch = reading.book.match(bookRegex)
            const chapterMatch = chapter ? reading.chapter === parseInt(chapter) : true
            return acc + (bookMatch && chapterMatch ? 1 : 0)
          }, 0)
          score += readingScore
        }
      })

      return {
        ...item,
        score,
      }
    })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
    return results
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const keywordsArray = keywordFields.map(k => k.keyword).filter(keyword => keyword.trim())
    const readingsArray = readingFields.filter(reading => reading.book.trim())
    const rankedMusic = rankResults(keywordsArray, readingsArray)

    setSearchedMusic(rankedMusic)
    setSubmitButtonClicked(true)
  }

  const handleAddKeyword = () => {
    setKeywordFields([...keywordFields, { keyword: '' }])
  }

  const handleAddReading = () => {
    setReadingFields([readingFields, { book: '', chapter: '' }])
  }

  if (!currentUser) return <div>Unauthorised</div>

  return (
    <Container>
      <h1 className="text-center mb-4">Search Music</h1>

      <Form onSubmit={handleSubmit} className="form-groups">
        {keywordFields && keywordFields.map((keyword, index) => (
          <Form.Group className="mb-2" controlId={keyword} key={index}>
            <Form.Control
              type='text'
              name='keyword'
              placeholder='keyword'
              value={keyword.keyword}
              onChange={(e) => handleKeywordChange(e, index)}
            />
          </Form.Group>
        )
        )}
        {readingFields.map((reading, index) => (
          <Row key={index}>
            <Col>
              <Form.Group className="mb-2">
                <Form.Control
                  type='text'
                  name='book'
                  placeholder='Bible Book (optional)'
                  value={reading.book}
                  onChange={(e) => handleReadingChange(e, index, 'book')}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-2'>
                <Form.Control
                  type='text'
                  name='chapter'
                  placeholder='Chapter (optional)'
                  value={reading.chapter}
                  onChange={(e) => handleReadingChange(e, index, 'chapter')}
                />
              </Form.Group>
            </Col>
          </Row>
        ))}
        <Button onClick={handleAddKeyword}>
          Add Keyword
        </Button>

        <Button onClick={handleAddReading}>
          Add Reading
        </Button>

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
