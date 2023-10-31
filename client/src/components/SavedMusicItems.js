import axiosAuth from '../lib/axios'
import { useEffect, useState } from 'react'
import ErrorModal from './ErrorModal'
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap'

export default function SavedMusicItems({ currentUser, setCurrentUser }) {
  const [musicItemData, setMusicItemData] = useState([])
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    setCurrentUser(currentUser)
  }, [])


  useEffect(() => {
    async function getSavedMusicItems() {
      try {
        const { data } = await axiosAuth.get('/api/saved/')
        setMusicItemData(data.reverse())
        console.log(musicItemData)
      } catch (error) {
        console.error(error)
        setShowErrorModal(true)
      }
    }
    getSavedMusicItems()
  }, [])

  async function deleteMusicItem(musicId) {
    try {
      await axiosAuth.delete(`/api/saved/${musicId}/`)
      const remainingMusicItems = musicItemData.filter(item => (
        item.id !== parseInt(musicId)
      ))
      setMusicItemData(remainingMusicItems)
    } catch (error) {
      console.log(error)
      setShowErrorModal(true)
    }
  }

  if (!currentUser) return <div>Unauthorised</div>
  if (!musicItemData) return <div>Loading...</div>

  return (
    <>
      {showErrorModal && <ErrorModal closeModal={() => setShowErrorModal(false)} />}
      <Container className="mt-4">
        <h1>Saved Music Items</h1>
        <Row>
          {musicItemData && musicItemData.length > 0 && musicItemData.map(item => (
            <Col xs={12} sm={10} md={8} lg={6} className="mb-4" key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{item.music_item.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{item.music_item.composer}</Card.Subtitle>
                  {item.music_item.keywords && item.music_item.keywords.length > 0 && (
                    <>
                      <h6>Keywords</h6>
                      <ListGroup variant="flush">
                        {item.music_item.keywords.map((keyword, index) => (
                          <ListGroup.Item key={index}>{keyword.keyword}</ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  )}
                  {item.music_item.related_readings && item.music_item.related_readings.length > 0 && (
                    <>
                      <h6 className="mt-3">Related Readings</h6>
                      <ListGroup variant="flush">
                        {item.music_item.related_readings.map((reading, index) => (
                          <ListGroup.Item key={index}>
                            <strong>{reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}</strong>
                            <p>{reading.text}</p>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  )}
                  {item.music_item.performances && item.music_item.performances.length > 0 && (
                    <>
                      <h6 className="mt-3">Performances</h6>
                      <ListGroup variant="flush">
                        {item.music_item.performances.map((performance, index) => (
                          <ListGroup.Item key={index}>
                            {performance.date_of_service} - {performance.church.church}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  )}
                  <Button variant="danger" onClick={() => deleteMusicItem(item.id)} className="mt-3">Remove Item</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}