import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useAuthUser } from "../context/UserContext"

export default function Login() {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useAuthUser()

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)
    fetch(`http://localhost:8080/user/${usernameRef.current.value}/${passwordRef.current.value}`, {
        method: 'GET'
        ,headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        if (res) {
          console.log(res)
          if (res.hasOwnProperty('status')) {
              if (res.hasOwnProperty('message') && res['message'] === "Wrong password")
                setError(res['message'])
              else 
                setError("User does not exist in the database")
          }
          else {
            const userDetails = {
              ...res,
              "password": passwordRef.current.value
            }
            console.log(userDetails)
            setCurrentUser(userDetails)
            navigate("/dashboard")
          }
        }
        setLoading(false)
        setTimeout(() => {
          setError("") 
        }, 3000)
            
    }).catch(err => {console.log(err)})
  }

  return (
    <>
      <div className="signup-page-wrapper">
        <Card className="card">
            <Card.Body className="card-b">
                <h2 className="card-h">Log In</h2> 
                {currentUser && currentUser.username}
                {error && <Alert variant="danger" className="alert">{error}</Alert>}
                <Form onSubmit={handleSubmit} className="form">
                    <Form.Group id="text" className="form-group">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" autoFocus ref={usernameRef} required />
                    </Form.Group>
                    <Form.Group id="password" className="form-group">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="submit-btn btn" type="submit"> 
                        Log In
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="login-link"> 
            Need an account?  
            <Link className="router-link" to="/signup"> Sign Up</Link>
        </div>
      </div>
    </>
  )
}