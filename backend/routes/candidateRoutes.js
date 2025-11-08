const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addCandidate, getCandidates } = require('../controllers/candidateController');

router.post('/', auth, addCandidate);
router.get('/', auth, getCandidates);

module.exports = router;
