import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import { Container, Row, Col, Form, ListGroup } from 'react-bootstrap'

export default function ChurchSearch() {

  const [allChurches, setAllChurches] = useState([])
  const [churches, setChurches] = useState()

  const [currentUser, setCurrentUser] = useState()

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
    async function getUserData() {
      try {
        const { data } = await axiosAuth.get('/api/auth')
        data.sort()
        setAllChurches(data)
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

  if (!currentUser) return <div>Unauthorised</div>

  return (
    <Container>
      <Row className="mt-5 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mb-4">Search Churches</h1>
          <Form>
            <Form.Group controlId="searchChurch">
              <Form.Control
                type="text"
                placeholder="Search Church Name"
                onKeyUp={handleKeyup}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <ListGroup>
            {churches && churches.map(church => (
              <ListGroup.Item key={church.id} >
                <Link to={`/church-page/${church.id}`}>{church.church}</Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}