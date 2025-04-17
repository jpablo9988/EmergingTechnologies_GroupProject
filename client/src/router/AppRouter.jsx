import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import AddUser from '../components/AddUser';
import LoginUser from '../components/LoginUser';
import PatientList from '../components/PatientList';
import EditPatient from '../components/EditPatient';
import NurseDashboard from '../components/NurseDashboard';
import PatientDashboard from '../components/PatientDashboard';
import NavbarProvider from './NavbarProvider';
import AuthContext from '../auth/AuthContext';

// ProtectedRoute Wrapper
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = React.useContext(AuthContext);
    return isLoggedIn ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
    const { isLoggedIn, isNurse, authUser } = React.useContext(AuthContext);

    return (
        <Router>
            <NavbarProvider />
            <div>
                <Routes>
                    {/* Default Route Logic */}
                    <Route
                        index
                        element={
                            isLoggedIn
                                ? <Navigate to={isNurse ? "/dashboard/nurse" : "/dashboard/patient"} />
                                : <Navigate to="/login" />
                        }
                    />

                    {/* Public Routes */}
                    {!isLoggedIn && <Route path="/login" element={<LoginUser />} />}
                    {!isLoggedIn && <Route path="/register" element={<AddUser />} />}

                    {/* Nurse Dashboard */}
                    {isLoggedIn && isNurse && (
                        <>
                            <Route path="/dashboard/nurse" element={<ProtectedRoute><NurseDashboard /></ProtectedRoute>} />
                            <Route path="/patientList" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
                            <Route path="/editPatient/:id" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} />
                        </>
                    )}

                    {/* Patient Dashboard (now passing patientId) */}
                    {isLoggedIn && !isNurse && (
                        <Route
                            path="/dashboard/patient"
                            element={
                                <ProtectedRoute>
                                    <PatientDashboard patientId={authUser.id} />
                                </ProtectedRoute>
                            }
                        />
                    )}

                    {/* Fallback to dashboard or login */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default AppRouter;
