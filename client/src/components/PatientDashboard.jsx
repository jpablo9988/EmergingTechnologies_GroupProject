import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { predictConditionFromSymptoms } from "../utils/conditionPredictor";


// ---------------- GraphQL ----------------
const GET_AUTH_PATIENT = gql`
  query GetAuthPatient($id: ID!) {
    patient(id: $id) {
      id
      userName
      email
      password
      motivationalTips
      vitalReports
      symptoms
      rewardPoints
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

const SEND_EMERGENCY_ALERT = gql`
  mutation SendEmergencyAlert($patient: ID!, $date: Date!, $symptoms: [ID!]) {
    sendEmergencyAlert(patient: $patient, date: $date, symptoms: $symptoms) {
      id
    }
  }
`;

const ASSIGN_SYMPTOM = gql`
  mutation AssignSymptom($patientId: ID!, $symptomId: ID!) {
    assignSymptom(patientId: $patientId, symptomId: $symptomId) {
      id
    }
  }
`;

const UPDATE_PATIENT_REWARDS = gql`
  mutation UpdatePatient(
    $id: ID!
    $email: String!
    $userName: String!
    $password: String
    $motivationalTips: [String!]
    $vitalReports: [ID!]
    $symptoms: [ID!]
    $rewardPoints: Int
  ) {
    updatePatient(
      id: $id
      email: $email
      userName: $userName
      password: $password
      motivationalTips: $motivationalTips
      vitalReports: $vitalReports
      symptoms: $symptoms
      rewardPoints: $rewardPoints
    ) {
      id
    }
  }
`;

// ---------------- Component ----------------
const PatientDashboard = ({ patientId }) => {
  const { data: patientData, refetch } = useQuery(GET_AUTH_PATIENT, {
    variables: { id: patientId },
    pollInterval: 5000,
  });

  const { data: symptomData } = useQuery(GET_SYMPTOMS);
  const { data: alertData } = useQuery(GET_EMERGENCY_ALERTS);

  const [addVitalReport] = useMutation(ADD_VITAL_REPORT);
  const [sendEmergencyAlert] = useMutation(SEND_EMERGENCY_ALERT);
  const [assignSymptom] = useMutation(ASSIGN_SYMPTOM);
  const [updatePatient] = useMutation(UPDATE_PATIENT_REWARDS);

  const [vitals, setVitals] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictions, setPredictions] = useState({}); // 🧠 For condition prediction


  const handleChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleAddSymptom = async (symptomId) => {
    if (selectedSymptoms.includes(symptomId)) return;
    setSelectedSymptoms((prev) => [...prev, symptomId]);

    try {
      await assignSymptom({ variables: { patientId, symptomId } });
    } catch (err) {
      console.error(err);
      alert('Failed to save symptom.');
    }
  };

  const handleRemoveSymptom = (symptomId) => {
    setSelectedSymptoms((prev) => prev.filter((id) => id !== symptomId));
  };


  const handlePredictCondition = async (patientId, symptoms) => {
    var listSymptoms = []
    selectedSymptoms.map((id) => {
      const sym = symptomData.symptoms.find(s => s.id === id)
      if (sym != null) {
        listSymptoms.push(sym)
      }
    });
    try {
      const prediction = await predictConditionFromSymptoms(listSymptoms.map(s => s.name));
      setPredictions(prev => ({ ...prev, [patientId]: prediction }));
    } catch (err) {
      console.error('Prediction error:', err);
      alert('Failed to predict condition.');
    }
  };

  const handleSubmitVitals = async (e) => {
    e.preventDefault();
    try {
      await addVitalReport({
        variables: {
          patient: patientId,
          date: new Date().toISOString(),
          bodyTemp: parseFloat(vitals.temperature),
          heartRate: parseFloat(vitals.heartRate),
          bloodPressure: parseFloat(vitals.bloodPressure),
          respiratoryRate: parseFloat(vitals.respiratoryRate),
        },
      });

      await updatePatient({
        variables: {
          id: patientData.patient.id,
          email: patientData.patient.email,
          userName: patientData.patient.userName,
          password: patientData.patient.password,
          motivationalTips: patientData.patient.motivationalTips,
          vitalReports: patientData.patient.vitalReports,
          symptoms: patientData.patient.symptoms,
          rewardPoints: (patientData.patient.rewardPoints || 0) + 5,
        },
      });

      alert('Vitals submitted and +5 points awarded!');
      setVitals({ temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: '' });
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Error submitting vitals');
    }
  };

  const handleEmergency = async () => {
    try {
      await sendEmergencyAlert({
        variables: {
          patient: patientId,
          date: new Date().toISOString(),
          symptoms: selectedSymptoms,
        },
      });

      await updatePatient({
        variables: {
          id: patientData.patient.id,
          email: patientData.patient.email,
          userName: patientData.patient.userName,
          password: patientData.patient.password,
          motivationalTips: patientData.patient.motivationalTips,
          vitalReports: patientData.patient.vitalReports,
          symptoms: patientData.patient.symptoms,
          rewardPoints: (patientData.patient.rewardPoints || 0) + 10,
        },
      });

      alert('Emergency alert sent and +10 points awarded!');
    } catch (err) {
      console.error(err);
      alert('Failed to send emergency alert');
    }
  };

  const myAlerts = alertData?.emergencyAlerts?.filter(
    (alert) => alert.patient?.id === patientId
  ) || [];

  const latestAlert = myAlerts[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <img src="/healthlogo.png" alt="Your Health Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-blue-700">Your Health - Patient Dashboard</h1>
      </div>

      {/* Reward Points */}
      <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-6">
        <p className="text-lg font-semibold">Reward Points: {patientData?.patient?.rewardPoints || 0}</p>
        <p className="text-sm">+5 pts for vitals · +10 pts for alerts</p>
      </div>

      {/* Vitals Form */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Enter Daily Vitals</h2>
        <form onSubmit={handleSubmitVitals} className="grid grid-cols-2 gap-4">
          <input name="temperature" placeholder="Temperature (°C)" value={vitals.temperature} onChange={handleChange} className="border p-2 rounded" required />
          <input name="heartRate" placeholder="Heart Rate (bpm)" value={vitals.heartRate} onChange={handleChange} className="border p-2 rounded" required />
          <input name="bloodPressure" placeholder="Blood Pressure (e.g., 120/80)" value={vitals.bloodPressure} onChange={handleChange} className="border p-2 rounded" required />
          <input name="respiratoryRate" placeholder="Respiratory Rate (rpm)" value={vitals.respiratoryRate} onChange={handleChange} className="border p-2 rounded" required />
          <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit Vitals</button>
        </form>
      </div>

      {/* Symptom Selector */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Symptoms</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {symptomData?.symptoms.map(symptom => (
            <button
              key={symptom.id}
              className="border px-2 py-1 text-sm rounded hover:bg-blue-100 transition"
              onClick={() => handleAddSymptom(symptom.id)}
              type="button"
            >
              {symptom.name}
            </button>
          ))}
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Selected Symptoms:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedSymptoms.map((id) => {
                const sym = symptomData.symptoms.find(s => s.id === id);
                return (
                  <span key={id} className="bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">

                    <b className="text-sm font-small text-gray-500">{sym?.name}</b> <button onClick={() => handleRemoveSymptom(id)} className="text-red-500 ml-1">✕</button>
                    <br />
                    {sym?.description}
                  </span>
                );
              })}
            </div>
            <br /><br />
            <button onClick={() => handlePredictCondition(patientData.id, selectedSymptoms)} className="text-gray-500 ml-1">
              Get Prediction from Symptoms
            </button>
          </div>
        )}
        {patientData != null && predictions[patientData.id]?.length > 0 && (
          <div className="mt-2 text-sm text-purple-700">
            <p className="font-semibold">Top Predicted Conditions:</p>
            <ul className="list-disc list-inside">
              {predictions[patientData.id].map((p, i) => (
                <li key={i}>
                  <strong>{p.condition}</strong>: {(p.score * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleEmergency}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Send Emergency Alert
        </button>

        {latestAlert && (
          <div className="mt-4 text-sm text-gray-700">
            <p><strong>Last Alert:</strong> {new Date(latestAlert.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {latestAlert.resolved ? '✅ Resolved' : '❗ Pending'}</p>
            {latestAlert.response && (
              <div className="mt-2 bg-gray-100 border rounded p-2">
                <p className="font-medium text-green-700">Nurse Response:</p>
                <p>{latestAlert.response}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Motivational Tips */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-2">Daily Motivational Tips</h2>
        {patientData?.patient?.motivationalTips?.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {patientData.patient.motivationalTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No tips yet.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
