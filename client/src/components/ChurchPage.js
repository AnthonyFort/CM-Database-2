

import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ErrorModal from './ErrorModal'
import axiosAuth from '../lib/axios'

export default function ChurchPage() {
  const navigate = useNavigate()
  
  const [churchData, setChurchData] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const { id } = useParams()

  const [newService, setNewService] = useState({
    date_of_service: '',
    type_of_service: '',
    music_items: [
      {
        title: '',
        composer: '',
        keywords: [
          {
            keyword: '',
          }
        ],
        related_readings: [
          {
            book: '',
            chapter: '',
            start_verse: '',
            end_verse: '',
          }
        ],
      }
    ],
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
      music_items: [
        ...newService.music_items,
        {
          title: '',
          composer: '',
          keywords: [],
          related_readings: [
            {
              book: '',
              chapter: '',
              start_verse: '',
              end_verse: '',
            }
          ],
        }
      ],
    })
  }

  const handleReadingChange = (index, readingIndex, key, value) => {
    const updatedMusicItems = [...newService.music_items]
    if (!updatedMusicItems[index].related_readings[readingIndex]) {
      updatedMusicItems[index].related_readings[readingIndex] = {
        book: '',
        chapter: '',
        start_verse: '',
        end_verse: '',
      }
    }
    updatedMusicItems[index].related_readings[readingIndex][key] = value
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const addReading = (index) => {
    const updatedMusicItems = [...newService.music_items]
    if (!updatedMusicItems[index].related_readings) {
      updatedMusicItems[index].related_readings = []
    }
    updatedMusicItems[index].related_readings.push({
      book: '',
      chapter: '',
      start_verse: '',
      end_verse: '',
    })
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const handleKeywordChange = (index, keywordIndex, value) => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems[index].keywords[keywordIndex].keyword = value
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const addKeyword = (index) => {
    const updatedMusicItems = [...newService.music_items]
    if (!updatedMusicItems[index].keywords) {
      updatedMusicItems[index].keywords = []
    }
    updatedMusicItems[index].keywords.push({ keyword: '' })
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
              <div>
                {musicItem.keywords.map((k, keywordIndex) => (
                  <div key={keywordIndex}>
                    <label>
                      Keyword:
                      <input
                        value={k.keyword}
                        onChange={e => handleKeywordChange(index, keywordIndex, e.target.value)}
                      />
                    </label>
                  </div>
                ))}
                <button onClick={() => addKeyword(index)}>Add Keyword</button>
              </div>
              <div>
                <h4>Related Readings</h4>
                {musicItem.related_readings.map((reading, readingIndex) => (
                  <div key={readingIndex}>
                    <label>
                      Book:
                      <input
                        value={reading.book}
                        onChange={event => handleReadingChange(index, readingIndex, 'book', event.target.value)}
                      />
                    </label>
                    <label>
                      Chapter:
                      <input
                        value={reading.chapter}
                        onChange={event => handleReadingChange(index, readingIndex, 'chapter', event.target.value)}
                      />
                    </label>
                    <label>
                      Start Verse:
                      <input
                        value={reading.start_verse}
                        onChange={event => handleReadingChange(index, readingIndex, 'start_verse', event.target.value)}
                      />
                    </label>
                    <label>
                      End Verse:
                      <input
                        value={reading.end_verse}
                        onChange={event => handleReadingChange(index, readingIndex, 'end_verse', event.target.value)}
                      />
                    </label>
                  </div>
                ))}
                <button onClick={() => addReading(index)}>Add Reading</button>
              </div>
            </div>
          ))}
          <button type="submit">Add Service</button>
        </form>
      </section>
    </>
  )
}
