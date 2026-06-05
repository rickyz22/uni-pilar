const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Validate token with auth service
      const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
      const response = await axios.get(`${authUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      req.user = response.data.user;
      next();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        return res.status(401).json({ 
          error: err.response.data.error || 'Invalid token' 
        });
      }
      return res.status(500).json({ error: 'Authentication service error' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = { authMiddleware };
