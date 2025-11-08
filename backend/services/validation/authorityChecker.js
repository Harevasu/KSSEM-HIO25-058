// Simulates NAD/DigiLocker integration via trusted registry
async function verifyAgainstAuthority(extractedData) {
  const { university, roll_number, year } = extractedData;

  // Step 1: Check if university is UGC-recognized (via mock DB)
  const trusted = require('../../mocks/trustedUniversities.json');
  const uni = trusted.find(u => u.name.toLowerCase() === university.toLowerCase());

  if (!uni) return { verified: false, reason: "University not UGC-recognized" };

  // Step 2: Validate roll number format
  const patterns = require('../../mocks/rollNumberPatterns');
  const validRoll = patterns[university]?.test(roll_number);

  // Step 3: (In production) Query NAD/DigiLocker -> simulated here
  return {
    verified: true,
    authority_source: "Simulated NAD Registry (Live API in production)",
    confidence: validRoll ? 0.95 : 0.7
  };
}

module.exports = { verifyAgainstAuthority };
