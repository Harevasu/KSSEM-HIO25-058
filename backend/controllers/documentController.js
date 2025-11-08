const Document = require('../models/Document');
const { createHash } = require('../utils/hashUtils');

exports.uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload a file' });
  }

  try {
    const newDocument = new Document({
      candidateId: req.body.candidateId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileHash: createHash(req.file.buffer), // Assuming file buffer is available
      status: 'Uploaded',
    });

    const document = await newDocument.save();
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
