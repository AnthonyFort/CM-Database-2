import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosAuth from '../lib/axios'
import { Container, Card, Button, ListGroup, Modal } from 'react-bootstrap'
import SavedModal from './SavedModal'
import ErrorModal from './ErrorModal'

export default function MusicItem() {

  const [musicItemData, setmusicItemData] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Fetches information about the queried music item
  useEffect(() => {
    async function getMusicItemData() {
      try {
        const { data } = await axiosAuth.get(`/api/music/${id}/`)
        if (data.past_services) {
          data.past_services.sort((a, b) => {
            return new Date(b.date_of_service) - new Date(a.date_of_service)
          })
        }
        setmusicItemData(data)
      } catch (error) {
        console.error(error)
        setShowErrorModal(true)
      }
    }
    getMusicItemData()
  }, [id])

  // Takes the id of the music item from the url and posts it to API to be saved
  const saveMusicItem = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        music_item: parseInt(id),
      }
      const { data } = await axiosAuth.post('/api/saved/', payload)
      setShowSavedModal(true)
    } catch (error) {
      console.log(error)
      setShowErrorModal(true)
    }
  }

  if (!musicItemData) return <div>Loading...</div>

  return (
    <>
      {showErrorModal && <ErrorModal closeModal={() => setShowErrorModal(false)} />}
      {showSavedModal && <SavedModal show={showSavedModal} onClose={() => {
        setShowSavedModal(false)
        navigate('/saved-music')
      }
      } />}

      <Container className="mt-4">
        <Card className="mb-4" xs={12} sm={10} md={8} lg={6} key={musicItemData.id}>
          <Card.Body>
            <Card.Title>{musicItemData.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{musicItemData.composer}</Card.Subtitle>
            {musicItemData.keywords && musicItemData.keywords.length > 0 && (
              <>
                <h6>Keywords</h6>
                <ListGroup variant="flush">
                  {musicItemData.keywords.map((keyword, index) => (
                    <ListGroup.Item key={index}>{keyword.keyword}</ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}

            {musicItemData.related_readings && musicItemData.related_readings.length > 0 && (
              <>
                <h6 className="mt-3">Related Readings</h6>
                <ListGroup variant="flush">
                  {musicItemData.related_readings.map((reading, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}</strong>
                      <p>{reading.text}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}

            {musicItemData.past_performances && musicItemData.past_performances.length > 0 && (
              <>
                <h6 className="mt-3">Performances</h6>
                <ListGroup variant="flush">
                  {musicItemData.past_performances.map((performance, index) => (
                    <ListGroup.Item key={index}>
                      {performance.date_of_service} - {performance.type_of_service} - {performance.church}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}

            <Button onClick={saveMusicItem} className="mt-3">Save Music Item</Button>
          </Card.Body>
        </Card >
      </Container >
    </>
  )
}
