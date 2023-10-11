import { useState, useEffect } from 'react'
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'

import { removeToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import axiosAuth from '../lib/axios'

import jwtDecode from 'jwt-decode'

export default function NavBar() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState()
  const [navBarOpen, setNavBarOpen] = useState(false)

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


  return (
    <div className='nav-wrapper'>
      {currentUser && (
        <Navbar
          bg="light"
          expand="lg"
          className="nav-bar"
          expanded={navBarOpen}
          onToggle={(expanded) => setNavBarOpen(expanded)}
        >
          <Container>
            <Navbar.Brand href="/">AAG Music</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav:" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/music-search" onSelect={() => setNavBarOpen(false)}>Music Search</Nav.Link>
                <Nav.Link href="/church-search" onSelect={() => setNavBarOpen(false)}>Church Search</Nav.Link>
                <Nav.Link href="/saved-music" onSelect={() => setNavBarOpen(false)}>Saved Music</Nav.Link>
                <Nav.Link href={`/church-page/${currentUser.id}`} onSelect={() => setNavBarOpen(false)}>Your Church</Nav.Link>
                <Nav.Link onClick={() => {
                  removeToken()
                  setNavBarOpen(false)
                  navigate('/')    
                }}
                >Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </div>
  )
}
