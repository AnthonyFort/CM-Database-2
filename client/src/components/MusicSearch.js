import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import { Button, Container, Form, ListGroup, Row, Col, InputGroup } from 'react-bootstrap'


export default function MusicSearch({ currentUser, setCurrentUser }) {

  const [submitButtonClicked, setSubmitButtonClicked] = useState(false)
  const [allMusic, setAllMusic] = useState([])
  const [searchedMusic, setSearchedMusic] = useState([])
  const [keywordFields, setKeywordFields] = useState([{ keyword: '' }])
  const [readingFields, setReadingFields] = useState([{ book: '', chapter: '' }])

  // This function allows for separate keyword fields to be entered without interfering with each other
  // By passing it the index of the field in the keywords array, the function knows which field is being typed into
  const handleKeywordChange = (e, index) => {
    const updatedKeywordFields = [...keywordFields]
    updatedKeywordFields[index].keyword = e.target.value
    setKeywordFields(updatedKeywordFields)
  }

  // Same as above, but, in addition, also checks whether the field being typed into is the book or the chapter field
  const handleReadingChange = (e, index, field) => {
    const updatedReadings = [...readingFields]
    updatedReadings[index][field] = e.target.value
    setReadingFields(updatedReadings)
  }

  useEffect(() => {
    setCurrentUser(currentUser)
  }, [])

  // Fetches all the music from the database
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

  // This function handles the information from the search request
  // It then sends it to the rankedResults function to sort and return the search results
  const handleSubmit = (event) => {
    event.preventDefault()
    const keywordsArray = keywordFields.map(k => k.keyword).filter(keyword => keyword.trim())
    const readingsArray = readingFields.filter(reading => reading.book.trim())
    const rankedMusic = rankResults(keywordsArray, readingsArray)
    setSearchedMusic(rankedMusic)
    setSubmitButtonClicked(true)
  }

  // This function uses RegExp to look for matches between searches and items in the database
  // Items are assigned a score based on the number of matches they have and returned in descending order of score
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

  // The following functions allow users to add an remove form fields to/from the search (eg, if they want to search using more than one keyword)
  // It does this by adding (or deleting) keyword /reading objects to the keywords /readings array 
  const handleAddKeyword = () => {
    setKeywordFields([...keywordFields, { keyword: '' }])
  }

  const handleAddReading = () => {
    setReadingFields([...readingFields, { book: '', chapter: '' }])
  }

  const removeKeyword = (index) => {
    const updatedKeywords = [...keywordFields]
    updatedKeywords.splice(index, 1)
    setKeywordFields(updatedKeywords)
  }

  const removeReading = (index) => {
    const updatedReadings = [...readingFields]
    updatedReadings.splice(index, 1)
    setReadingFields(updatedReadings)
  }

  if (!currentUser) return <div>Unauthorised</div>

  return (
    <Container>
      <h3 className="text-center mb-4">Search Music by Keyword and/or Bible Reading</h3>
      <Form onSubmit={handleSubmit} className="form-groups">
        <div>
          <Row style={{ border: '1px solid grey', padding: '10px', margin: '10px' }}>
            {keywordFields && keywordFields.map((keyword, index) => (
              <Col xs={12} md={6} lg={6} key={index}>
                <InputGroup className="mb-2" controlId={keyword} >
                  <Form.Control
                    type='text'
                    name='keyword'
                    placeholder='keyword'
                    value={keyword.keyword}
                    onChange={(e) => handleKeywordChange(e, index)}
                  />
                  {
                    keywordFields.length > 1 && (
                      <Button variant="outline-danger" size="sm" onClick={() => removeKeyword(index)}>-</Button>
                    )
                  }
                </InputGroup>
              </Col>
            )
            )}
          </Row>
          <Button variant="success" className="m-2" size='sm' onClick={handleAddKeyword}>
            Add Keyword
          </Button>
          {readingFields.map((reading, index) => (
            <Row key={index} style={{ border: '1px solid grey', padding: '10px', margin: '10px' }} >
              <Col xs={12} md={6} lg={6}>
                <InputGroup className="mb-2">
                  <Form.Control
                    type='text'
                    name='book'
                    placeholder='Book'
                    value={reading.book}
                    onChange={(e) => handleReadingChange(e, index, 'book')}
                  />
                </InputGroup>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InputGroup className='mb-2'>
                  <Form.Control
                    type='text'
                    name='chapter'
                    placeholder='Chapter'
                    value={reading.chapter}
                    onChange={(e) => handleReadingChange(e, index, 'chapter')}
                  />
                  {
                    readingFields.length > 1 && (
                      <Button variant="outline-danger" onClick={() => removeReading(index)}>-</Button>
                    )
                  }
                </InputGroup>
              </Col>
            </Row>
          ))}
          <Button variant="success" className="m-2" size="sm" onClick={handleAddReading}>
            Add Reading
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
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
