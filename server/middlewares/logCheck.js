const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      req.userId = decoded.userId;
      next();
    });
  };
  
  module.exports = authMiddleware;