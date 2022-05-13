import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useAuthUser } from "../context/UserContext"
import { validateName, validatePassword, validateUsername } from "../validator"
import CustomTooltip from "./tooltips/CustomTooltip"

export default function Signup() {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const nameRef = useRef()
  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useAuthUser()

  async function handleSubmit(e) {
    e.preventDefault()

    const user = {
        "username": usernameRef.current.value,
        "password": passwordRef.current.value,
        "name": nameRef.current.value,
        "is_admin": false
    }

    if (!validateUsername(usernameRef.current.value)) {
      console.log("invalid username")
      setError("Invalid username! Check username format by clicking the info icon near username")
      setTimeout(() => {
        setError("") 
      }, 3000)
    } else if (!validatePassword(passwordRef.current.value)) {
      console.log("invalid password")
      setError("Invalid password! Check password format by clicking the info icon near password")
      setTimeout(() => {
        setError("") 
      }, 3000)
    } else if (!validateName(nameRef.current.value)) {
      console.log("invalid name")
      setError("Invalid name!")
      setTimeout(() => {
        setError("") 
      }, 3000)
    } else {
      setLoading(true)
      fetch('http://localhost:8080/user', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin" : "*", 
              "Access-Control-Allow-Credentials" : true 
          },
          body: JSON.stringify(user),
      })
      .then(res => res.json())
      .then(res => {
          if (res) {
            console.log(res)
            if (res.hasOwnProperty('status'))
              setError("error: status " + res['status'])
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
              
      })
    }
  }

  return (
    <>
      <div className="signup-page-wrapper">
        <Card className="card">
            <Card.Body className="card-b">
                <h2 className="card-h">Sign Up</h2> 
                {currentUser && currentUser.username}
                {error && <Alert variant="danger" className="alert">{error}</Alert>}
                <Form onSubmit={handleSubmit} className="form">
                    <Form.Group id="text" className="form-group">
                      <div className="form-group-wrapper">
                        <Form.Label>Username</Form.Label>
                        <CustomTooltip>
                          <div><b>Username format:</b></div>
                          <div>- Only alphanumeric characters (a-z A-Z 0-9)</div>
                          <div>- Allowed dot (.), underscore (_), or hyphen (-)</div>
                          <div>- First character must be alphanumeric </div>
                          <div>- Not consecutive dot (.), underscore (_), or hyphen (-)</div>
                          <div>- The number of characters must be between 5 to 20</div>
                        </CustomTooltip>
                      </div>
                      <Form.Control type="text" ref={usernameRef} required />
                    </Form.Group>
                    <Form.Group id="password" className="form-group">
                      <div className="form-group-wrapper">
                        <Form.Label>Password</Form.Label>
                        <CustomTooltip>
                          <div><b>Password format:</b></div>
                          <div>- At least one upper case English letter</div>
                          <div>- At least one lower case English letter</div>
                          <div>- At least one digit</div>
                          <div>- At least one special character</div>
                          <div>- Minimum eight characters</div>
                        </CustomTooltip>
                      </div>
                      <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id="name" className="form-group">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="submit-btn btn" type="submit"> 
                        Sign Up
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="login-link"> 
          Already have an account?
          <Link to="/" className="router-link"> Log In</Link>
        </div>
      </div>
    </>
  )
}