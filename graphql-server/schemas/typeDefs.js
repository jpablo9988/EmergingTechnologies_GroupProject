// graphql-server/typeDefs.js
const typeDefs = `#graphql
  scalar Date

  interface User {
    id: ID!
    userName: String!
    email: String!
    password: String
    kind: String
  }

  type Nurse implements User {
    id: ID!
    userName: String!
    email: String!
    password: String
    kind: String
  }

  type Patient implements User {
    id: ID!
    userName: String!
    email: String!
    password: String
    kind: String
    motivationalTips: [String!]
    vitalReports: [ID!]
    symptoms: [ID!]
    rewardPoints: Int
  }

  type Symptom {
    id: ID!
    name: String!
    description: String!
  }

  type EmergencyAlert {
    id: ID!
    patient: Patient!
    date: Date!
    resolved: Boolean
    response: String
    priority: Int
    symptoms: [Symptom!]
  }

  type VitalReport {
    id: ID!
    patient: Patient!
    date: Date!
    bodyTemp: Float!
    heartRate: Float!
    bloodPressure: Float!
    respiratoryRate: Float!
  }

  type PredictionResult {
    condition: String!
    score: Float!
  }

  type Query {
    nurses: [Nurse]
    nurse(id: ID!): Nurse
    patients: [Patient]
    patient(id: ID!): Patient
    emergencyAlerts: [EmergencyAlert]
    emergencyAlert(id: ID!): EmergencyAlert
    symptoms: [Symptom]
    symptom(id: ID!): Symptom
    vitalReports: [VitalReport]
    vitalReport(id: ID!): VitalReport
    isLoggedIn: Boolean!
    isPatient: Boolean!
    isNurse: Boolean!
    authUserId: ID
  }

  type Mutation {
    createUser(email: String!, userName: String!, password: String!, type: String!): User
    sendEmergencyAlert(patient: ID!, date: Date!, symptoms: [ID!]): EmergencyAlert
    updateEmergencyAlert(id: ID!, resolved: Boolean, response: String): EmergencyAlert
    createNurse(email: String!, userName: String!, password: String!): Nurse
    updateNurse(id: ID!, email: String!, userName: String!, password: String!): Nurse
    createPatient(email: String!, userName: String!, password: String!): Patient
    updatePatient(
      id: ID!,
      email: String!,
      userName: String!,
      password: String,
      motivationalTips: [String!],
      vitalReports: [ID!],
      symptoms: [ID!],
      rewardPoints: Int
    ): Patient
    addSymptom(name: String!, description: String!): Symptom
    editSymptom(id: ID!, name: String!, description: String!): Symptom
    addVitalReport(
      patient: ID!,
      date: Date!,
      bodyTemp: Float!,
      heartRate: Float!,
      bloodPressure: Float!,
      respiratoryRate: Float!
    ): VitalReport
    editVitalReport(
      id: ID!,
      patient: ID!,
      date: Date!,
      bodyTemp: Float!,
      heartRate: Float!,
      bloodPressure: Float!,
      respiratoryRate: Float!
    ): VitalReport
    loginUser(email: String!, password: String!): User
    logOut: String!
    assignSymptom(patientId: ID!, symptomId: ID!): Patient
    predictMedicalCondition(symptoms: [String!]!): PredictionResult!
  }
`;

export default typeDefs;