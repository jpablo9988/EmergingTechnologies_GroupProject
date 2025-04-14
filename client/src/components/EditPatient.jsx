// EditUser component
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      userName
      email
    }
  }
`;
const UPDATE_PATIENT = gql`
  mutation UpdatePatient($id: ID!, $userName: String!, $email: String!, $role: String!) {
    updatePatient(id: $id, userName: $userName, email: $email) {
      id
      userName  
      email     
    }
  }
`;

function EditPatient() {
  const [user, setUser] = useState({ id: '', userName: '', email: '', role: '' });
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id parameter from the URL

  const { loading, error, data } = useQuery(GET_PATIENT, {
    variables: { id },
    onCompleted: (data) => {
      const { userName: currentUserName, email: currentEmail } = data.user;
      setUser({ id, userName: currentUserName, email: currentEmail });
    },
  });

  const [updatePatient] = useMutation(UPDATE_PATIENT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updatePatient({
        variables: { id, userName: user.userName, email: user.email },
      });
      navigate('/patientList');
    } catch (error) {
      console.error('Error updating Patient:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Edit Patient</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            placeholder="Patient's Name"
            value={user.userName || ''}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="text"
            name="email"
            placeholder="Patient's E-mail"
            value={user.email || ''}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default EditPatient;
