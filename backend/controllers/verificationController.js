const Document = require('../models/Document');
const VerificationLog = require('../models/VerificationLog');
const authorityChecker = require('../services/validation/authorityChecker');

// KEY FILE: Orchestration logic
exports.startVerification = async (req, res) => {
    const { documentId } = req.params;

    try {
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // Step 1: Simulate document processing (e.g. data extraction)
        // In a real system, this would involve more complex logic.
        const extractedData = {
            university: "Saveetha Engineering College",
            roll_number: "SEC12345",
            year: "2023"
        };

        // Step 2: Perform authority check
        const authorityResult = await authorityChecker.verifyAgainstAuthority(extractedData);

        // Step 3: Log the verification attempt
        const log = new VerificationLog({
            documentId,
            verificationSteps: [
                { step: 'AuthorityCheck', status: authorityResult.verified ? 'Success' : 'Failed', details: authorityResult }
            ],
            finalStatus: authorityResult.verified ? 'Verified' : 'Rejected',
        });
        await log.save();

        // Step 4: Update document status
        document.status = log.finalStatus;
        await document.save();

        res.json({ log });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
