import { Link } from 'react-router-dom'
import { Button, Container, Row, Col, Image } from 'react-bootstrap'

import logo from '../images/logo.png'


export default function Home() {
  return (
    <Container fluid className='homepage'>
      <Row className='justify-content-md-center'>
        <Col md={8} lg={6} className='homepage-col m-2'>  
          <Image src={logo} className='logo' roundedCircle fluid />  
          <div className='homepage-blurb'>
            <p>
              Welcome to CM Database, a powerful tool for church musicians to find music for any occasion.
            </p>
            <p>
              Just search for the related Bible readings or keywords for the service, and we’ll do the rest.
            </p>
            <p>
              Keep track of the music you perform at your church, and, in the process, help contribute to the database and to the church music community.
            </p>
          </div>
        </Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col md={8} lg={6} className='text-center'> 
          <div className='homepage-buttons'>
            <Button as={Link} to='/login' className='m-2'>Login</Button> 
            <Button as={Link} to='/register'>Register</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
  // return (
  //   <>
  //     <div className='homepage'>
  //       <div className='homepage-blurb'>
  //         <img src={logo} className='logo'/>
  //         <p>
  //           Welcome to CM Database, a powerful tool for church musicians to find music for any occasion.
  //         </p>
  //         <p>
  //           Just search for the related Bible readings or keywords for the service, and we’ll do the rest.
  //         </p>
  //         <p>
  //           Keep track of the music you perform at your church, and, in the process, help contribute to the database and to the church music community.
  //         </p>
  //       </div>
  //       <div className='homepage-buttons'>
  //         <Button as={Link} to='/login'>Login</Button>
  //         <Button as={Link} to='/register'>Register</Button>
  //       </div>
  //     </div>
  //   </>
  // )
}