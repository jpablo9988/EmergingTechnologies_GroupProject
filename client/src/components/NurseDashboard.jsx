import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { predictConditionFromSymptoms } from "../utils/conditionPredictor";




// ---------------- GraphQL ----------------
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
      patient {
        id
        userName
      }
      date
      bodyTemp
      heartRate
      bloodPressure
      respiratoryRate
    }
  }
`;

const GET_SYMPTOMS = gql`
  query GetSymptoms {
    symptoms {
      id
      name
      description
    }
  }
`;

const GET_EMERGENCY_ALERTS = gql`
  query GetEmergencyAlerts {
    emergencyAlerts {
      id
      date
      resolved
      response
      patient {
        id
        userName
      }
      symptoms {
        id
        name
        description
      }
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

const UPDATE_EMERGENCY_ALERT = gql`
  mutation UpdateEmergencyAlert($id: ID!, $resolved: Boolean, $response: String) {
    updateEmergencyAlert(id: $id, resolved: $resolved, response: $response) {
      id
      resolved
      response
    }
  }
`;

export default function NurseDashboard() {
  const { data: patientData, refetch: refetchPatients } = useQuery(GET_PATIENTS);
  const { data: vitalsData, refetch: refetchVitals } = useQuery(GET_VITAL_REPORTS);
  const { data: symptomData } = useQuery(GET_SYMPTOMS);
  const { data: alertsData, refetch: refetchAlerts } = useQuery(GET_EMERGENCY_ALERTS);

  const [addVitalReport] = useMutation(ADD_VITAL_REPORT);
  const [updatePatient] = useMutation(UPDATE_PATIENT_TIPS);
  const [updateEmergencyAlert] = useMutation(UPDATE_EMERGENCY_ALERT);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatientObj, setSelectedPatientObj] = useState(null);
  const [vitals, setVitals] = useState({
    temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: ''
  });
  const [tip, setTip] = useState('');
  const [alertResponses, setAlertResponses] = useState({});
  const [showResolved, setShowResolved] = useState(false);
  const [predictions, setPredictions] = useState({}); // 🧠 For condition prediction

  const handlePatientChange = (e) => {
    const patient = patientData?.patients.find(p => p.id === e.target.value);
    setSelectedPatientId(patient?.id || '');
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
      await refetchPatients();
      alert("Tip sent");
      setTip('');
    } catch (err) {
      console.error(err);
      alert("Error sending tip");
    }
  };

  const handleAlertResponseChange = (alertId, text) => {
    setAlertResponses(prev => ({ ...prev, [alertId]: text }));
  };

  const handleUpdateAlert = async (alertId, update) => {
    try {
      await updateEmergencyAlert({ variables: { id: alertId, ...update } });
      await refetchAlerts();
      alert("Alert updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update alert");
    }
  };

  const handlePredictCondition = async (alertId, symptoms) => {
    try {
      const prediction = await predictConditionFromSymptoms(symptoms.map(s => s.name));
      setPredictions(prev => ({ ...prev, [alertId]: prediction }));
    } catch (err) {
      console.error('Prediction error:', err);
      alert('Failed to predict condition.');
    }
  };

  const filteredVitals = vitalsData?.vitalReports?.filter(
    v => v.patient?.id === selectedPatientId
  ) || [];

  const filteredAlerts = alertsData?.emergencyAlerts?.filter(alert => showResolved || !alert.resolved) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <img src="/healthlogo.png" alt="Your Health Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-blue-700">Your Health - Nurse Dashboard</h1>
      </div>

      <div className="mb-4">
        <label className="font-medium">Select Patient:</label>
        <select className="ml-2 border rounded px-2 py-1" value={selectedPatientId} onChange={handlePatientChange}>
          <option value="">-- Select --</option>
          {patientData?.patients.map(p => (
            <option key={p.id} value={p.id}>{p.userName}</option>
          ))}
        </select>
      </div>

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

      {filteredVitals.length > 0 && (
        <div className="bg-white shadow p-6 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Past Vitals for {selectedPatientObj?.userName}</h2>
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
        </div>
      )}

      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-2">Send Motivational Tip</h2>
        <form onSubmit={submitTip} className="flex flex-col gap-3">
          <textarea value={tip} onChange={e => setTip(e.target.value)} className="border p-2 rounded" rows={3} required />
          <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Send Tip</button>
        </form>
      </div>

      <div className="bg-white shadow p-6 rounded mt-8">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Emergency Alerts</h2>
        <button
          onClick={() => setShowResolved(prev => !prev)}
          className="mb-4 bg-gray-200 px-4 py-1 rounded text-sm"
        >
          {showResolved ? 'Hide Resolved Alerts' : 'Show Resolved Alerts'}
        </button>

        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className="border rounded p-4 bg-gray-50">
                <p><strong>Patient:</strong> {alert.patient?.userName || 'Unknown'}</p>
                <p><strong>Date:</strong> {new Date(alert.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {alert.resolved ? "✅ Resolved" : "❗ Unresolved"}</p>

                {alert.symptoms?.length > 0 && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="font-semibold">Symptoms Reported in This Alert:</p>
                    <ul className="list-disc list-inside">
                      {alert.symptoms.map(symptom => (
                        <li key={symptom.id}><strong>{symptom.name}</strong>: {symptom.description}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <label className="block mt-2 text-sm font-medium">Response:</label>
                <textarea
                  className="border rounded w-full p-2 mt-1 text-sm"
                  rows={2}
                  placeholder="Write your response..."
                  value={alertResponses[alert.id] || alert.response || ''}
                  onChange={(e) => handleAlertResponseChange(alert.id, e.target.value)}
                />

                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    onClick={() => handleUpdateAlert(alert.id, { response: alertResponses[alert.id] || '' })}
                  >
                    Save Response
                  </button>
                  {!alert.resolved && (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      onClick={() => handleUpdateAlert(alert.id, { resolved: true })}
                    >
                      Mark as Resolved
                    </button>
                  )}
                  <button
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    onClick={() => handlePredictCondition(alert.id, alert.symptoms)}
                  >
                    Predict Condition
                  </button>
                </div>

                {predictions[alert.id]?.length > 0 && (
  <div className="mt-2 text-sm text-purple-700">
    <p className="font-semibold">Top Predicted Conditions:</p>
    <ul className="list-disc list-inside">
      {predictions[alert.id].map((p, i) => (
        <li key={i}>
          <strong>{p.condition}</strong>: {(p.score * 100).toFixed(1)}%
        </li>
      ))}
    </ul>
  </div>






                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No {showResolved ? 'resolved' : 'unresolved'} emergency alerts.</p>
        )}
      </div>
    </div>
  );
}
