const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    console.log(`[Auth] User verified: ${req.userId}`);
    next();
  } catch (err) {
    console.error(`[Auth] Token verification failed: ${err.message}`);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

module.exports = { authMiddleware };
