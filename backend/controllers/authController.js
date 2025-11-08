const jwt = require('jsonwebtoken');
// Dummy user model
const users = []; // In a real app, this would be a database model

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // In a real app, you'd find the user and verify the password
  const user = { email }; // Dummy user

  if (!user) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const payload = {
    user: {
      id: '12345', // dummy id
      role: 'admin'
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};
