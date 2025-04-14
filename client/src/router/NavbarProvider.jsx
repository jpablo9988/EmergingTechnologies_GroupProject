import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../auth/AuthContext';
import React from 'react';

const NavbarProvider = () => {
    const { isLoggedIn, logout, isNurse } = React.useContext(AuthContext);
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/home">
                    Final Project - Emergent Tech.
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/home">
                            Home
                        </Nav.Link>
                        {!isLoggedIn && <Nav.Link as={Link} to="/login">
                            Login
                        </Nav.Link>}
                        {isLoggedIn && <Nav.Link as={Link} to="/home" onClick={logout}>
                            Logout
                        </Nav.Link>}
                        {isNurse && <Nav.Link as={Link} to="/patientList">
                            Patient List
                        </Nav.Link>}
                        {!isLoggedIn && <Nav.Link as={Link} to="/register">
                            Register
                        </Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>)
}
export default NavbarProvider;