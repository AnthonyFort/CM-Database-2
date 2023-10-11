import axiosAuth from '../lib/axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ErrorModal from './ErrorModal'

export default function SavedMusicItems() {
  const [musicItemData, setMusicItemData] = useState([])
  const [showErrorModal, setShowErrorModal] = useState(false)

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
    async function getSavedMusicItems() {
      try {
        const { data } = await axiosAuth.get('/api/saved/')
        setMusicItemData(data)
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
      <h1>Saved Music Items</h1>
      {musicItemData && musicItemData.length > 0 && musicItemData.map(item => (
        <div key={item.id}>
          <h2>Title: {item.music_item.title}</h2>
          <h3>Composer: {item.music_item.composer}</h3>
          <ul>
            <h4>Keywords</h4>
            {item.music_item.keywords && item.music_item.keywords.length > 0 && item.music_item.keywords.map((keyword, index) => (
              <li key={index}>
                {keyword.keyword}
              </li>
            ))}
          </ul>
          <ul>
            <h4>Related Readings</h4>
            {item.music_item.related_readings && item.music_item.related_readings.length > 0 && item.music_item.related_readings.map((reading, index) => (
              <li key={index}>
                <h5>{reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}</h5>
                <p>{reading.text}</p>
              </li>
            ))}
          </ul>
          <ul>
            <h4>Performances</h4>
            {item.music_item.performances && item.music_item.performances.length > 0 && item.music_item.performances.map((performance, index) => (
              <li key={index}>
                {performance.date_of_service} - {performance.church.church}
              </li>
            ))}
          </ul>
          <button onClick={() => deleteMusicItem(item.id)}>
            Remove Item
          </button>
        </div>

      ))}
    </>
  )
}