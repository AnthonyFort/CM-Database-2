import { useState } from 'react'
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'

import { getToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function NavBar() {
  // const navigate = useNavigate()
  // const [searchInput, setSearchInput] = useState('')
  // const handleSearchInputChange = (event) => {
  //   setSearchInput(event.target.value)
  // }


  // return (
  //   <div className='nav-wrapper'>
  //     <Navbar bg="light" expand="lg" className="nav-bar">
  //       <Container>
  //         <Navbar.Brand href="/">AAG Music</Navbar.Brand>
  //         <Navbar.Toggle aria-controls="basic-navbar-nav:" />
  //         <Navbar.Collapse id="basic-navbar-nav">
  //           <Nav className="mr-auto">
  //             <Nav.Link href="/register">Register</Nav.Link>
  //             <Nav.Link href="/login">Login</Nav.Link>
  //             <Nav.Link href={`/users/${userID}`}>Profile Page</Nav.Link>
  //             <Nav.Link href="/search">Search Users</Nav.Link>
  //             <Nav.Link href={`/users/${userID}/songs`}>Check pending songs</Nav.Link>
  //           </Nav>
  //         </Navbar.Collapse>
  //       </Container>
  //     </Navbar>
  //   </div>
  // )
}
