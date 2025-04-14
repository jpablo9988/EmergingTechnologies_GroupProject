import React from 'react';
import { gql, useQuery } from "@apollo/client";
//import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
//import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
//
// TODO: Change to List Patients.
const GET_PATIENTS = gql`
{
    patients{
      id
      userName
      email
    }
}
`;
//
const PatientList = () => {

    const { loading, error, data, refetch } = useQuery(GET_PATIENTS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (

        <div>

            <Table >
                <tbody>
                    <tr>
                        <th>userName</th>
                        <th>email</th>

                    </tr>
                    {data.patients.map((patient, index) => (
                        <tr key={index}>

                            <td>{patient.userName}</td>
                            <td>{patient.email}</td>
                            <td>
                                <Link to={`/editPatient/${patient.id}`}>Edit</Link>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="center">
                <button className="center" onClick={() => refetch()}>Refetch</button>
            </div>

        </div>

    );
}

export default PatientList

