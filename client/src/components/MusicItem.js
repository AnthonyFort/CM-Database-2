import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ErrorModal from './ErrorModal'
import axiosAuth from '../lib/axios'

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
      } catch (error) {
        console.error(error)
        setShowErrorModal(true)
      }
    }
    getMusicItemData()
  }, [id])

  if (!musicItemData) return <div>Loading...</div>

  return (
    <>
      {showErrorModal && <ErrorModal closeModal={() => setShowErrorModal(false)} />}
      <h1>{musicItemData.title}</h1>
      <section>
        <h2>{musicItemData.composer}</h2>
        <h3>Related Readings</h3>
        <ul>
          {musicItemData.related_readings.map((reading, index) => (
            <li key={index}>
              {reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}
            </li>
          ))}
        </ul>
        <ul>
          <p>Keywords</p>
          {musicItemData.keywords.map((keyword, index) => (
            <li key={index}>
              {keyword.keyword}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
