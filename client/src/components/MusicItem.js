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
      <h1>{musicItemData.title}</h1>
      <section>
        <h2>{musicItemData.composer}</h2>
        <h3>Related Readings</h3>
        <ul>
          <h4>Keywords</h4>
          {musicItemData.keywords && musicItemData.keywords.length > 0 && musicItemData.keywords.map((keyword, index) => (
            <li key={index}>
              {keyword.keyword}
            </li>
          ))}
        </ul>
        <ul>
          <h4>Related Readings</h4>
          {musicItemData.related_readings && musicItemData.related_readings.length > 0 && musicItemData.related_readings.map((reading, index) => (
            <li key={index}>
              <h5>{reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}</h5>
              <p>{reading.text}</p>
            </li>
          ))}
        </ul>
        <ul>
          <h4>Performances</h4>
          {musicItemData.performances && musicItemData.performances.length > 0 && musicItemData.performances.map((performance, index) => (
            <li key={index}>
              {performance.date_of_service} - {performance.church.church}
            </li>
          ))}
        </ul>
        <button onClick={saveMusicItem}>Save Music Item</button>
      </section>
    </>
  )
}
