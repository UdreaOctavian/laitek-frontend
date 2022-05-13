import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuthUser } from "../context/UserContext"
import { AiFillEdit } from 'react-icons/ai'
import { validateName, validatePassword, validateUsername } from "../validator"
import CustomTooltip from "./tooltips/CustomTooltip"

export default function AccountSettingsPage() {

  const { currentUser, setCurrentUser } = useAuthUser()
  const [ isEditState, setIsEditState ] = useState(false)
  const [ controlFormEnabled, setControlFormEnabled ] = useState(true)
  const [ error, setError ] = useState("")
  const usernameRef = useRef()
  const passwordRef = useRef()
  const nameRef = useRef()
  const navigate = useNavigate()

  const formRef = useRef()

  function postRequest() {
    const editedUser = {
      ...currentUser,
      "username": usernameRef.current.value ? usernameRef.current.value : currentUser.username,
      "password": passwordRef.current.value ? passwordRef.current.value : currentUser.password,
      "name": nameRef.current.value ? nameRef.current.value : currentUser.name
    }

    fetch('http://localhost:8080/user', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin" : "*", 
          "Access-Control-Allow-Credentials" : true 
      },
      body: JSON.stringify(editedUser),
    })
    .then(res => res.json())
    .then(res => {
        if (res) {
          console.log(res)
          setIsEditState(prevState => !prevState)
          setControlFormEnabled(prevState => !prevState)
          if (res.hasOwnProperty('status')) {
            setError("error: status " + res['status'])
            setTimeout(() => {
              setError("") 
            }, 3000)
          }
          else {
            setCurrentUser(editedUser)
            usernameRef.current.value = ""
            passwordRef.current.value = ""
            nameRef.current.value = ""
            navigate("/dashboard/account-settings")
          }

        }})
  }

  const handleSubmit = () => {
    if (!isEditState) {
      
      setControlFormEnabled(prevState => !prevState)
      setIsEditState(prevState => !prevState)
    } else {

      
      if (usernameRef.current.value !== "" || 
          usernameRef.current.value !== "" || 
          usernameRef.current.value !== "") {
      
        if (usernameRef.current.value !== "" && !validateUsername(usernameRef.current.value)) {
          console.log("invalid username")
          setError("Invalid username! Check username format by clicking the info icon near username")
          setTimeout(() => {
            setError("") 
          }, 3000)
          setIsEditState(prevState => !prevState)
          setControlFormEnabled(prevState => !prevState)
          formRef.current.reset()
        } else if (passwordRef.current.value !== "" && !validatePassword(passwordRef.current.value)) {
          console.log("invalid password")          
          setError("Invalid password! Check password format by clicking the info icon near password")
          setTimeout(() => {
            setError("") 
          }, 3000)
          setIsEditState(prevState => !prevState)
          setControlFormEnabled(prevState => !prevState)
          formRef.current.reset()
        } else if (nameRef.current.value !== "" && !validateName(nameRef.current.value)) {
          console.log("invalid name")
          setError("Invalid name!")
          setTimeout(() => {
            setError("") 
          }, 3000)
          setIsEditState(prevState => !prevState)
          setControlFormEnabled(prevState => !prevState)
          formRef.current.reset()
        } else postRequest()
      } else postRequest()
    }
      
    //   if (usernameRef.current.value !== "") {
    //     console.log('baiu 1')
    //     if (!validateUsername(usernameRef.current.value)) {
    //       console.log("invalid username")
    //       setError("Invalid username! Check username format by clicking the info icon near username")
    //       setTimeout(() => {
    //         setError("") 
    //       }, 3000)
    //       setIsEditState(prevState => !prevState)
    //       setControlFormEnabled(prevState => !prevState)
    //       formRef.current.reset()
    //     } else {
    //       //verificare pentru password + name
    //       postRequest()
    //     }
    //   } else if (passwordRef.current.value !== "") {
    //     console.log('baiu 2')
    //     if (!validatePassword(passwordRef.current.value)) {
    //       console.log("invalid password")
          
    //       setError("Invalid password! Check password format by clicking the info icon near password")
    //       setTimeout(() => {
    //         setError("") 
    //       }, 3000)
    //       setIsEditState(prevState => !prevState)
    //       setControlFormEnabled(prevState => !prevState)
    //       formRef.current.reset()
    //     } else {
    //       //verificare name
    //       postRequest()
    //     }
    //   }
    //     else if (nameRef.current.value !== "") {
    //       console.log('baiu 3')
    //       if(!validateName(nameRef.current.value)) {
    //         console.log("invalid name")
    //         setError("Invalid name!")
    //         setTimeout(() => {
    //           setError("") 
    //         }, 3000)
    //         setIsEditState(prevState => !prevState)
    //         setControlFormEnabled(prevState => !prevState)
    //         formRef.current.reset()
    //       } else {
    //         postRequest()
    //       }
    //   } else {
    //     postRequest()
    //   }
  }

  return (
    <div className='account-settings-page'>
      <Card className="card">
        <Card.Body className="card-b">
            <h2 className="card-h">Account Info</h2> 
            {error && <Alert variant="danger" className="alert">{error}</Alert>}
            <Form className="form" ref={formRef}>
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
                  <Form.Control onClick={() => console.log(usernameRef.current.placeholder)} type="text" required disabled={controlFormEnabled} placeholder={currentUser.username} ref={usernameRef}/>
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
                  <Form.Control type="text" required disabled={controlFormEnabled} placeholder={currentUser.password} ref={passwordRef}/>
                </Form.Group>
                <Form.Group id="name" className="form-group">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" required disabled={controlFormEnabled} placeholder={currentUser.name} ref={nameRef}/>
                </Form.Group>
                <Button className="submit-btn btn" onClick={handleSubmit}> 
                    {isEditState ? "Update" : 
                      <>
                        Edit profile <AiFillEdit className="edit-btn"/>
                      </>
                    }
                </Button>
            </Form>
        </Card.Body>
      </Card>
    </div>
  )
}
