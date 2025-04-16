// NurseDashboard.jsx
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

// ---------------- GraphQL Queries & Mutations ----------------
const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      userName
      email
      password
      motivationalTips
      vitalReports
      symptoms
    }
  }
`;

const GET_VITAL_REPORTS = gql`
  query GetVitalReports {
    vitalReports {
      id
      patient
      date
      bodyTemp
      heartRate
      bloodPressure
      respiratoryRate
    }
  }
`;

const ADD_VITAL_REPORT = gql`
  mutation AddVitalReport(
    $patient: ID!
    $date: Date!
    $bodyTemp: Float!
    $heartRate: Float!
    $bloodPressure: Float!
    $respiratoryRate: Float!
  ) {
    addVitalReport(
      patient: $patient
      date: $date
      bodyTemp: $bodyTemp
      heartRate: $heartRate
      bloodPressure: $bloodPressure
      respiratoryRate: $respiratoryRate
    ) {
      id
    }
  }
`;

const UPDATE_PATIENT_TIPS = gql`
  mutation UpdatePatient(
    $id: ID!
    $email: String!
    $userName: String!
    $password: String!
    $motivationalTips: [String!]
    $vitalReports: [ID!]
    $symptoms: [ID!]
  ) {
    updatePatient(
      id: $id
      email: $email
      userName: $userName
      password: $password
      motivationalTips: $motivationalTips
      vitalReports: $vitalReports
      symptoms: $symptoms
    ) {
      id
    }
  }
`;

export default function NurseDashboard() {
  const { data: patientData } = useQuery(GET_PATIENTS);
  const { data: vitalsData, refetch: refetchVitals } = useQuery(GET_VITAL_REPORTS);
  const [addVitalReport] = useMutation(ADD_VITAL_REPORT);
  const [updatePatient] = useMutation(UPDATE_PATIENT_TIPS);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatientObj, setSelectedPatientObj] = useState(null);
  const [vitals, setVitals] = useState({
    temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: ''
  });
  const [tip, setTip] = useState('');

  const handlePatientChange = (e) => {
    const patient = patientData?.patients.find(p => p.id === e.target.value);
    setSelectedPatientId(patient?.id);
    setSelectedPatientObj(patient || null);
  };

  const submitVitals = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return alert("Select a patient first");
    try {
      await addVitalReport({
        variables: {
          patient: selectedPatientId,
          date: new Date().toISOString(),
          bodyTemp: parseFloat(vitals.temperature),
          heartRate: parseFloat(vitals.heartRate),
          bloodPressure: parseFloat(vitals.bloodPressure),
          respiratoryRate: parseFloat(vitals.respiratoryRate)
        }
      });
      alert("Vitals submitted");
      setVitals({ temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: '' });
      await refetchVitals();
    } catch (err) {
      console.error(err);
      alert("Error submitting vitals");
    }
  };

  const submitTip = async (e) => {
    e.preventDefault();
    if (!selectedPatientObj) return;
    try {
      const newTips = [...(selectedPatientObj.motivationalTips || []), tip];
      await updatePatient({
        variables: {
          id: selectedPatientObj.id,
          email: selectedPatientObj.email,
          userName: selectedPatientObj.userName,
          password: selectedPatientObj.password,
          motivationalTips: newTips,
          vitalReports: selectedPatientObj.vitalReports || [],
          symptoms: selectedPatientObj.symptoms || []
        }
      });
      alert("Tip sent");
      setTip('');
    } catch (err) {
      console.error(err);
      alert("Error sending tip");
    }
  };

  const filteredVitals = vitalsData?.vitalReports?.filter(v => v.patient === selectedPatientId) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src="/healthlogo.png" alt="Your Health Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-blue-700">Your Health - Nurse Dashboard</h1>
      </div>

      {/* Patient Selector */}
      <div className="mb-4">
        <label className="font-medium">Select Patient:</label>
        <select className="ml-2 border rounded px-2 py-1" value={selectedPatientId} onChange={handlePatientChange}>
          <option value="">-- Select --</option>
          {patientData?.patients.map(p => (
            <option key={p.id} value={p.id}>{p.userName}</option>
          ))}
        </select>
      </div>

      {/* Vitals Entry */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Enter Vitals</h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={submitVitals}>
          {['temperature', 'heartRate', 'bloodPressure', 'respiratoryRate'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              value={vitals[field]}
              onChange={e => setVitals({ ...vitals, [field]: e.target.value })}
              className="border p-2 rounded"
              required
            />
          ))}
          <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit Vitals</button>
        </form>
      </div>

      {/* Past Vitals */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Past Vitals</h2>
        {filteredVitals.length === 0 ? <p>No vitals available.</p> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Date</th>
                <th>Temp</th>
                <th>HR</th>
                <th>BP</th>
                <th>RR</th>
              </tr>
            </thead>
            <tbody>
              {filteredVitals.map((v, i) => (
                <tr key={i} className="text-center">
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                  <td>{v.bodyTemp}</td>
                  <td>{v.heartRate}</td>
                  <td>{v.bloodPressure}</td>
                  <td>{v.respiratoryRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Health Summary */}
{selectedPatientId && (
  <div className="bg-white shadow p-6 rounded mb-6">
    <h2 className="text-xl font-semibold mb-2">Patient Health Summary</h2>
    <ul className="list-disc list-inside text-sm text-gray-700">
      <li>Total vitals submitted: {filteredVitals.length}</li>
      {filteredVitals.length > 0 && (
        <>
          <li>Last submission: {new Date(filteredVitals[0].date).toLocaleDateString()}</li>
          <li>Last Temp: {filteredVitals[0].bodyTemp}°C</li>
          <li>Last HR: {filteredVitals[0].heartRate} bpm</li>
          <li>Last BP: {filteredVitals[0].bloodPressure}</li>
          <li>Last RR: {filteredVitals[0].respiratoryRate} rpm</li>
        </>
      )}
    </ul>
  </div>
)}


      {/* Tip Sender */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-2">Send Motivational Tip</h2>
        <form onSubmit={submitTip} className="flex flex-col gap-3">
          <textarea value={tip} onChange={e => setTip(e.target.value)} className="border p-2 rounded" rows={3} required />
          <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Send Tip</button>
        </form>
      </div>
    </div>
  );
}
