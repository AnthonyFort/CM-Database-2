import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ErrorModal from './ErrorModal'
import axiosAuth from '../lib/axios'

import { getToken } from '../utils/auth'

export default function ChurchPage() {

  const navigate = useNavigate()
  const [ChurchPage, setChurchPage] = useState({
    userSongs: [],
  })
  const [churchData, setChurchData] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const { id } = useParams()

  const [newService, setNewService] = useState({
    date_of_service: '',
    type_of_service: '',
    music_items: [{
      title: '',
      composer: '',
      keywords: '',
      related_readings: {
        book: '',
        chapter: '',
        start_verse: '',
        end_verse: '',
      },
    }],
  })

  useEffect(() => {
    async function getChurchData() {
      try {
        const { data } = await axiosAuth.get(`/api/auth/${id}`)
        setChurchData(data)
      } catch (error) {
        console.error(error)
        setShowErrorModal(true)
      }
    }
    getChurchData()
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await axiosAuth.post('/api/services/', newService)
    } catch (error) {
      console.error(error)
    }
  }

  const handleMusicItemChange = (index, key, value) => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems[index][key] = value
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const addMusicItem = () => {
    setNewService({
      ...newService,
      music_items: [...newService.music_items, {
        title: '',
        composer: '',
        keywords: '',
        related_readings: {
          book: '',
          chapter: '',
          start_verse: '',
          end_verse: '',
        },
      }],
    })
  }

  const handleReadingChange = (index, key, value) => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems[index].related_readings[key] = value
    setNewService({ ...newService, music_items: updatedMusicItems })
  }
  

  if (!churchData) return <div>Loading...</div>

  return (
    <>
      {showErrorModal && <ErrorModal closeModal={() => setShowErrorModal(false)} />}

      <h1>{churchData.church}</h1>

      <section>
        <h2>Past Services</h2>
        {churchData.past_services.map((service) => (
          <div key={service.date_of_service}>
            <h3>{service.date_of_service} - {service.type_of_service}</h3>
            <ul>
              {service.music_items.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong> by {item.composer}
                  <ul>
                    <p>Related Readings</p>
                    {item.related_readings.map((reading, index) => (
                      <li key={index}>
                        {reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}
                      </li>
                    ))}
                  </ul>
                  <ul>
                    <p>Keywords</p>
                    {item.keywords.map((keyword, index) => (
                      <li key={index}>
                        {keyword.keyword}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <form onSubmit={handleSubmit}>
          <label>
            Date of Service:
            <input
              type="date"
              value={newService.date_of_service}
              onChange={event => setNewService({ ...newService, date_of_service: event.target.value })}
            />
          </label>

          <label>
            Type of Service:
            <input
              type="text"
              value={newService.type_of_service}
              onChange={event => setNewService({ ...newService, type_of_service: event.target.value })}
            />
          </label>
          <button type='button' onClick={addMusicItem}>Add Music Item</button>
          <div>
            {newService.music_items.map((musicItem, index) => (
              <div key={index}>
                <label>
                  Title:
                  <input
                    value={musicItem.title}
                    onChange={event => handleMusicItemChange(index, 'title', event.target.value)}
                  />
                </label>

                <label>
                  Composer:
                  <input
                    value={musicItem.composer}
                    onChange={event => handleMusicItemChange(index, 'composer', event.target.value)}
                  />
                </label>
                <label>
                  Keywords:
                  <input
                    value={musicItem.keywords}
                    onChange={event => handleMusicItemChange(index, 'keywords', event.target.value)}
                  />
                </label>
                <div>
                  <h4>Related Readings</h4>

                  <label>
                    Book:
                    <input
                      value={musicItem.related_readings.book}
                      onChange={e => handleReadingChange(index, 'book', e.target.value)}
                    />
                  </label>

                  <label>
                    Chapter:
                    <input
                      type="number"
                      value={musicItem.related_readings.chapter}
                      onChange={e => handleReadingChange(index, 'chapter', e.target.value)}
                    />
                  </label>

                  <label>
                    Start Verse:
                    <input
                      type="number"
                      value={musicItem.related_readings.start_verse}
                      onChange={e => handleReadingChange(index, 'start_verse', e.target.value)}
                    />
                  </label>

                  <label>
                    End Verse:
                    <input
                      type="number"
                      value={musicItem.related_readings.end_verse}
                      onChange={e => handleReadingChange(index, 'end_verse', e.target.value)}
                    />
                  </label>
                </div>

              </div>
            ))}
          </div>

          <button type="submit>">Add Service</button>
        </form>
      </section>

    </>
  )

}
