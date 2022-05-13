import React, { useState, useEffect, useRef } from 'react'
import { Table, Dropdown } from "react-bootstrap"

export default function PatientsPage() {

  const [ patients, setPatients ] = useState([])
  const [ filteredPatients, setFilteredPatients ] = useState([])
  const [ hospitals, setHospitals ] = useState([])
  const [ hospitalFilterName, setHospitalFilterName ] = useState("")
  const inputRef = useRef()
  
  function filterData() {
    let fp = [...patients]

    if (inputRef.current.value !== "") {
      fp = [...fp].filter(patient => patient.name.startsWith(inputRef.current.value))
    }

    if (hospitalFilterName !== "") {
      fp = [...fp].filter(patient => patient.hospital === hospitalFilterName)
    }
      
    setFilteredPatients(fp)
  }

  function clearFilter() {
    let fp = [...patients]
    setHospitalFilterName("")
    setFilteredPatients(fp)
  }

  useEffect(() => {
    fetch('http://localhost:8080/patient', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
        if (res) {
          setPatients(res)
          setFilteredPatients(res)
          const uniqueHospitals = new Set([...res].map(patient => patient.hospital))
          let hospitalsArray = []
          for (let item of uniqueHospitals) 
            hospitalsArray.push(item)
          setHospitals(hospitalsArray)
        }
    })
  }, [])

  useEffect(() => {
    filterData()
}, [hospitalFilterName])

  return (
    <div className='patients-page'>
      <input onChange={() => {filterData()}} ref={inputRef} placeholder="Sort patients after name..."></input>
      <Dropdown className="d-inline mx-2">
        <Dropdown.Toggle id="dropdown-autoclose-true">
          {hospitalFilterName === "" ? "Sort by hospital" : hospitalFilterName}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            hospitals.map((hospital, index) => (
              <Dropdown.Item onClick={() => {setHospitalFilterName(hospital)}} key={index}>{hospital}</Dropdown.Item>
            ))
          }
          <Dropdown.Item onClick={() => {clearFilter()}}>Clear filter</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Hospital</th>
            <th>Date of birth</th>
          </tr>
        </thead>
        <tbody>
          {
            filteredPatients.map(patient => (
                <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.hospital}</td>
                    <td>{patient.date_of_birth}</td>
                </tr>
            ))
          }
        </tbody>
      </Table>
    </div>
  )
}
