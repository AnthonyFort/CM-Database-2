import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export default function Home() {
  return (
    <>
      <p>
        Welcome to CM Database, a powerful tool for church musicians to find music for any occasion.
      </p>
      <p>
        Just search for the related Bible readings or keywords for the service, and we’ll do the rest.
      </p>
      <p>
        Keep track of the music you perform at your church, and, in the process, help contribute to the database and to the church music community.
      </p>
      <Button as={Link} to='/login'>Login</Button>
      <Button as={Link} to='/register'>Register</Button>
    </>
  )
}