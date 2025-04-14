//Login.js
import React, { useState } from 'react';
//import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext'
import "./entryform.css"
// Login function component

function Login() {
    const { login } = React.useContext(AuthContext);
    let navigate = useNavigate()
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [isError, setIsError] = useState(false);
    const handleLogin = async (event) => {
        event.preventDefault();
        const didLogIn = await login(email, password);
        if (didLogIn !== undefined) {
            console.log('email:', email, 'password:', password, "loggedIn: ", didLogIn);
            if (didLogIn)
                navigate('/home');
            else {
                setIsError(true);
            }
        }
        else {
            setIsError(true);
        }
        setEmail('');
        setPassword('');

    };
    return (
        <div className="entryform">
            {isError && "Email or password couldn't be found!"}
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label> Email:</Form.Label>
                    <Form.Control id="email" type="email" onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email:" />
                </Form.Group>

                <Form.Group>
                    <Form.Label> Password:</Form.Label>
                    <Form.Control id="password" type="password" onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password:" />
                </Form.Group>

                <Button size="lg" variant="primary" type="submit" >
                    Login
                </Button>

            </Form>


        </div>
    );
}
//
export default Login;