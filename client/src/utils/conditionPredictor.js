// client/src/utils/conditionPredictor.js
export function predictConditionFromSymptoms(symptomNames) {
  const conditions = [
    { name: 'COVID-19', keywords: ['Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Loss of Smell'] },
    { name: 'Flu', keywords: ['Fever', 'Fatigue', 'Chills', 'Headache', 'Muscle Aches'] },
    { name: 'Cold', keywords: ['Cough', 'Nasal Congestion', 'Sore Throat', 'Sneezing'] },
    { name: 'Heart Issue', keywords: ['Chest Pain', 'Dizziness', 'Shortness of Breath', 'Nausea'] },
    { name: 'Migraine', keywords: ['Headache', 'Nausea', 'Dizziness', 'Sensitivity to Light'] },
    { name: 'Pneumonia', keywords: ['Fever', 'Cough', 'Shortness of Breath', 'Chest Pain', 'Fatigue'] },
    { name: 'RSV', keywords: ['Cough', 'Fever', 'Nasal Congestion', 'Wheezing'] },
    { name: 'Anxiety Attack', keywords: ['Shortness of Breath', 'Chest Pain', 'Dizziness', 'Heart Palpitations'] },
    { name: 'Food Poisoning', keywords: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach Cramps', 'Fatigue'] }
  ];

  const inputSet = new Set(symptomNames.map(s => s.toLowerCase()));

  const scored = conditions.map(condition => {
    const conditionSet = new Set(condition.keywords.map(k => k.toLowerCase()));
    const intersection = new Set([...inputSet].filter(x => conditionSet.has(x)));
    const union = new Set([...inputSet, ...conditionSet]);
    const score = intersection.size / union.size;

    return {
      condition: condition.name,
      score,
    };
  });

  const topMatches = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // 🔥 Top 3 conditions

  return topMatches;
}
