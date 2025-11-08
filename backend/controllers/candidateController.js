const Candidate = require('../models/Candidate');

exports.addCandidate = async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const candidate = await newCandidate.save();
    // Here you would trigger an email to the candidate
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
