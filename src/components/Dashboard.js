import React, { useState } from 'react'
import { useAuthUser } from "../context/UserContext"
import { Navbar, Container, Nav, Button } from "react-bootstrap"
import { useNavigate, Link, Outlet } from 'react-router-dom'

export default function Dashboard() {

    const navigate = useNavigate()
    const { currentUser, setCurrentUser } = useAuthUser()
    let userBtnVisibility = currentUser.is_admin
    let userBtnStyle = {
        display: userBtnVisibility ? "block" : "none"
    }
    const [ heroSectionVisible, setHeroSectionVisible ] = useState(true)

    let heroStyle = {
        display: heroSectionVisible ? "flex" : "none"
    }

    const logout = () => {
        navigate("/")
        setCurrentUser({})
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Laitek Medical</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link>
                            <Link onClick={() => setHeroSectionVisible(false)} className="router-link nav-router-link" to="/dashboard/patients">Patients</Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link onClick={() => setHeroSectionVisible(false)} className="router-link nav-router-link" to="/dashboard/account-settings">Account</Link>
                        </Nav.Link>
                        <Nav.Link style={userBtnStyle}>
                            <Link onClick={() => setHeroSectionVisible(false)} className="router-link nav-router-link" to="/dashboard/users">Users</Link>
                        </Nav.Link>
                        <Button variant="outline-dark" onClick={logout} className="logout-btn">Log Out</Button>
                    </Nav>
                </Container>
            </Navbar>
            <div className="hero" style={heroStyle}>
                <div className="hero-text-wrapper">
                    <div className="hero-text">
                        Data Migration - Things change. We help!
                    </div>
                    <div className="hero-subtext">
                    Whether you are entering in to a merger, acquisition, or purchase of a new PACS or VNA, visit us first.
                    </div>
                </div>
                <div className="hero-img-wrapper">
                    <img src="../assets/irwan-iwe-rbDE93-0hHs-unsplash.jpg" alt="" className="hero-img" />
                </div>
            </div>
            <Outlet />
        </>
    )
}