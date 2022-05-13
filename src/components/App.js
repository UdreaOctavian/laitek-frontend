import "bootstrap/dist/css/bootstrap.min.css"
import "../index.scss"
import { UserProvider } from "../context/UserContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import Signup from "./Signup"
import PatientsPage from "./PatientsPage"
import AccountSettingsPage from "./AccountSettingsPage"
import UsersPage from "./UsersPage"

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="/dashboard/patients" element={<PatientsPage />}></Route>
            <Route path="/dashboard/account-settings" element={<AccountSettingsPage />}></Route>
            <Route path="/dashboard/users" element={<UsersPage />}></Route>
          </Route>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      </UserProvider>
    </Router>   
  )
}

export default App