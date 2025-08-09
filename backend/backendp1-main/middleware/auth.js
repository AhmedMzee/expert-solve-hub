 
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireExpert = (req, res, next) => {
  if (req.user.user_type !== 'expert') {
    return res.status(403).json({ error: 'Expert access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireExpert
};