import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Form, Card, Alert } from "react-bootstrap"
import { MdDelete } from "react-icons/md"
import { IoMdAddCircle } from "react-icons/io"
import CustomTooltip from "./tooltips/CustomTooltip"
import { validateName, validatePassword, validateUsername } from "../validator"
import { useAuthUser } from "../context/UserContext"

export default function UsersPage() {

  const { currentUser, setCurrentUser } = useAuthUser()

  const [ users, setUsers ] = useState([])
  const [ show, setShow ] = useState(false)
  const [ error, setError ] = useState("")
  const [ isSwitchOn, setIsSwitchOn ] = useState(false)
  const usernameRef = useRef()
  const passwordRef = useRef()
  const nameRef = useRef()

  const [ showEdit, setShowEdit ] = useState(false)
  const [ isSwitchEditOn, setIsSwitchEditOn ] = useState(false)
  const usernameEditRef = useRef()
  const passwordEditRef = useRef()
  const nameEditRef = useRef()

  const formRef = useRef()
  const formEditRef = useRef()

  const [ editUser, setEditUser ] = useState({
    "id": "",
    "username": "",
    "password": "",
    "name": "",
    "is_admin": ""
  })

  const onSwitchEditAction = () => {
    setEditUser({
      ...editUser,
      "is_admin": !isSwitchEditOn
    })
    setIsSwitchEditOn(!isSwitchEditOn)
  }
  
  const handleCloseEdit = () => setShowEdit(false)
  
  function handleShowEdit(user) {
    const requestOptions = {
      method: 'GET'
    }

    setShowEdit(true)
    fetch(`http://localhost:8080/user/${user.id}`, requestOptions)
    .then(res => res.json())
    .then(res => {
      setEditUser({...res})
    })
    
  }

  const onSwitchAction = () => setIsSwitchOn(!isSwitchOn)
  
  const handleClose = () => setShow(false)
  
  const handleShow = () => setShow(true)
  
  function addUser() {
    const newUser = {
    "username": usernameRef.current.value,
    "password": passwordRef.current.value,
    "name": nameRef.current.value,
    "is_admin": isSwitchOn
    }
    console.log(newUser)
    fetch('http://localhost:8080/user', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin" : "*", 
          "Access-Control-Allow-Credentials" : true 
      },
      body: JSON.stringify(newUser),
    })
    .then(res => res.json())
    .then(res => {
      if (res) {
        console.log(res)
        if (res.hasOwnProperty('status')) {
          setError("error: status " + res['status'])
        }
        else {
          setShow(false)
          setIsSwitchOn(false)
          fetch('http://localhost:8080/user', {
            method: 'GET'
          })
          .then(res => res.json())
          .then(res => {
              if (res) {
                setUsers(res)
              }
          })
        }
      }
      setTimeout(() => {
        setError("") 
      }, 3000)       
    })
  }

  const handleAddUser = () => {

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
    } else addUser()
  }

  function editUserRequest() {
    const updateUser = {
      ...editUser,
      "username": usernameEditRef.current.value ? usernameEditRef.current.value : editUser.username,
      "password": passwordEditRef.current.value ? passwordEditRef.current.value : editUser.password,
      "name": nameEditRef.current.value ? nameEditRef.current.value : editUser.name,
      "is_admin": isSwitchEditOn,
    }
    fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true 
        },
        body: JSON.stringify(updateUser),
    })
    .then(res => res.json())
    .then(res => {
        if (res) {
          console.log(res)
          if (res.hasOwnProperty('status')) {
            console.log(res)
            setError("error: status " + res['status'])
          }
          else {
            setShowEdit(false)
            fetch('http://localhost:8080/user', {
              method: 'GET'
            })
            .then(res => res.json())
            .then(res => {
                if (res) {
                  setUsers(res)
                }
            })
          }
        }
        setTimeout(() => {
          setError("") 
        }, 3000)
            
    })
  }

  const handleEditUser = () => {

    if (usernameEditRef.current.value !== "" || usernameEditRef.current.value !== "" || usernameEditRef.current.value !== "") {
      if (usernameEditRef.current.value !== "" && !validateUsername(usernameEditRef.current.value)) {
        console.log("invalid username")
        setError("Invalid username! Check username format by clicking the info icon near username")
        setTimeout(() => {
          setError("") 
        }, 3000)
        formEditRef.current.reset()
      } else if (passwordEditRef.current.value !== "" && !validatePassword(passwordEditRef.current.value)) {
          console.log("invalid password")
          
          setError("Invalid password! Check password format by clicking the info icon near password")
          setTimeout(() => {
            setError("") 
          }, 3000)
          formEditRef.current.reset()
      } else if (nameEditRef.current.value !== "" && !validateName(nameEditRef.current.value)) {
          console.log("invalid name")
          setError("Invalid name!")
          setTimeout(() => {
            setError("") 
          }, 3000)
          formEditRef.current.reset()
     } else editUserRequest()
    } else editUserRequest()
  }

  const deleteUser = (userId) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json'}
    }

    fetch(`http://localhost:8080/user/${userId}`, requestOptions)
    .then(() => {
      fetch('http://localhost:8080/user', {
        method: 'GET'
      })
      .then(res => res.json())
      .then(res => {
          if (res) {
            setUsers(res)
          }
      })
    })
  }

  useEffect(() => {

    fetch('http://localhost:8080/user', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
        if (res) {
          setUsers(res)
        }
    })

  }, [])

  return (
    <div className="users-page-wrapper">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Name</th>
            <th>Admin</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="td-username" onClick={() => {handleShowEdit(user)}}>{user.username}</td>
                    <td>{user.password}</td>
                    <td>{user.name}</td>
                    <td>{user.is_admin ? "Admin" : "Guest"}</td>
                    <td><MdDelete className='delete-user-btn' onClick={() => deleteUser(user.id)}/></td>
                </tr>
            ))
          }
        </tbody>
      </Table>
      <Button className="add-user-btn btn" onClick={handleShow}> 
          Add User <IoMdAddCircle className='add-user-icon'/>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add user</Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-user-modal-body">
          <Card className="add-user-card">
            <Form ref={formRef}>
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
                  <Form.Control type="text" ref={usernameRef} required placeholder="Username..."/>
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
                  <Form.Control type="password" ref={passwordRef} required placeholder="Password..."/>
                </Form.Group>
                <Form.Group id="name" className="form-group">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" ref={nameRef} required placeholder="Name..."/>
                </Form.Group>
                <Form.Group id="admin" className="form-group">
                    <Form.Switch 
                      type="switch"
                      id="custom-switch"
                      label="Is Admin"
                      onChange={onSwitchAction}
                      checked={isSwitchOn}
                    />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
            </Form>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" className="btn" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* ------------------------------------------------------------------------------------------- */}

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit user</Modal.Title>
        </Modal.Header>
        <Modal.Body className="add-user-modal-body">
          <Card className="add-user-card">
            <Form ref={formEditRef}>
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
                  <Form.Control type="text" ref={usernameEditRef} required placeholder={editUser.username}/>
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
                  <Form.Control type="password" ref={passwordEditRef} required placeholder={editUser.password}/>
                </Form.Group>
                <Form.Group id="name" className="form-group">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" ref={nameEditRef} required placeholder={editUser.name}/>
                </Form.Group>
                <Form.Group id="admin" className="form-group">
                    <Form.Switch 
                      type="switch"
                      id="custom-switch"
                      label="Is Admin"
                      onChange={onSwitchEditAction}
                      checked={editUser.is_admin}
                    />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
            </Form>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" className="btn" onClick={handleEditUser}>
            Update User
          </Button>
        </Modal.Footer>
      </Modal>


      
    </div>
  )
}
