const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadDocument } = require('../controllers/documentController');
const { startVerification } = require('../controllers/verificationController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('document'), uploadDocument);
router.post('/verify/:documentId', auth, startVerification);

module.exports = router;
