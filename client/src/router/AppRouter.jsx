import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import AddUser from '../components/AddUser';
import LoginUser from '../components/LoginUser';
import NavbarProvider from './NavbarProvider';
import AuthContext from '../auth/AuthContext';
import PatientList from '../components/PatientList';
import EditPatient from '../components/EditPatient';
const AppRouter = () => {
    const { isLoggedIn, isNurse } = React.useContext(AuthContext);
    return (
        <Router>
            <NavbarProvider />
            <div>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} />
                    {!isLoggedIn && <Route path="login" element={<LoginUser />} />}
                    {isNurse && <Route path="patientList" element={<PatientList />} />}
                    {isNurse && <Route path="editPatient/:id" element={<EditPatient />} />}
                    {!isLoggedIn && <Route path="register" element={<AddUser />} />}
                </Routes>
            </div>
        </Router>
    );
}
export default AppRouter;