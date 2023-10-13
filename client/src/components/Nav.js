import { useState, useEffect } from 'react'
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'
import { removeToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function NavBar({ currentUser, setCurrentUser }) {
  const navigate = useNavigate()
  const [navBarOpen, setNavBarOpen] = useState(false) 

  if (!currentUser) return <div></div>

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
            <Navbar.Brand href="/">CM Database</Navbar.Brand>
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
                  setCurrentUser(undefined)
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

