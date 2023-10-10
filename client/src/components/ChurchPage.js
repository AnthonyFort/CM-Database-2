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
                    {item.related_readings.map((reading, idx) => (
                      <li key={idx}>
                        {reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}
                      </li>
                    ))}
                  </ul>
                  <ul>
                    <p>Keywords</p>
                    {item.keywords.map((keyword, idx) => (
                      <li key={idx}>
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

    </>
  )

}
