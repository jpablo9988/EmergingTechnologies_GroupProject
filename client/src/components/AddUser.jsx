// AddUser component
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
//
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
//
// AddUser mutation
const ADD_USER = gql`
  mutation AddUser($userName: String!, $email: String!, $password: String!, $type: String!) {
    createUser(userName: $userName, email: $email, password: $password, type: $type) {
      __typename
      id
    }
  }
`;
// AddUser component
const AddUser = () => {
  let navigate = useNavigate()
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('patient');
  const [showLoading, setShowLoading] = useState(false);
  // AddUser mutation
  const [addUser] = useMutation(ADD_USER
    , {
      onCompleted(data) {
        console.log(data.createUser.id);
        const id = data.createUser.id;
        setUserName('');
        setEmail('');
        setPassword('');
        setShowLoading(false);
        navigate('/login');
      }
    }
  );
  //
  const saveUser = (e) => {
    setShowLoading(true);
    e.preventDefault();
    setType('patient');
    addUser({ variables: { userName, email, password, type } });
  };
  return (
    <div>
      {showLoading &&
        <Spinner animation="border" type="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      }
      <h2>Register</h2>
      <Form onSubmit={saveUser}>
        <Form.Group>
          <Form.Label> User Name</Form.Label>
          <Form.Control type="text" name="userName" id="userName" placeholder="Enter user-name here..." value={userName} onChange={(e) => setUserName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="text" name="email" id="email" rows="3" placeholder="Enter e-mail here..." value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" id="password" placeholder="Enter password here..." value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>User Type</Form.Label>
          <Form.Select aria-label="User Type" onChange={(e) => setType(e.target.value)} name="type" value={type}>
            <option value="patient">Patient</option>
            <option value="nurse">Nurse</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>

      </Form>
    </div>

  );
};
//
export default AddUser;
