import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ErrorModal from './ErrorModal'
import axiosAuth from '../lib/axios'
import { Container, Card, Button, ListGroup, Modal } from 'react-bootstrap'

export default function MusicItem() {
  const navigate = useNavigate()

  const [musicItemData, setmusicItemData] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const { id } = useParams()


  useEffect(() => {
    async function getMusicItemData() {
      try {
        const { data } = await axiosAuth.get(`/api/music/${id}`)
        setmusicItemData(data)
        console.log('MUSIC ITEM', musicItemData)
      } catch (error) {
        console.error(error)
        setShowErrorModal(true)
      }
    }
    getMusicItemData()
  }, [id])



  const saveMusicItem = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        music_item: parseInt(id),
      }
      const { data } = await axiosAuth.post('/api/saved/', payload)
    } catch (error) {
      console.log(error)
      setShowErrorModal(true)
    }
  }

  if (!musicItemData) return <div>Loading...</div>

  return (
    <>
      {showErrorModal && <ErrorModal closeModal={() => setShowErrorModal(false)} />}

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

            {musicItemData.performances && musicItemData.performances.length > 0 && (
              <>
                <h6 className="mt-3">Performances</h6>
                <ListGroup variant="flush">
                  {musicItemData.performances.map((performance, index) => (
                    <ListGroup.Item key={index}>
                      {performance.date_of_service} - {performance.church.church}
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
